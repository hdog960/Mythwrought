import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {environmentalTreesForChunk,keepLegacyGroveTree,naturalTreeTouchesDesert}
  from '../src/manual-biomes/environment-v7.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';

const SEED=179;
const isDesert=(x,z,seed=SEED)=>v6BiomeAt(x,z,seed)?.name==='desert';
const findPlainDesertEdge=()=>{
  for(let x=1;x<800;x++)
    if(isDesert(x,0)&&!isDesert(x-1,0))return x;
  throw Error('Expected a real Plains-to-Desert boundary at z=0');
};

test('V7 legacy tree policy excludes an entire grove when its trunk or canopy touches Desert',()=>{
  const edge=findPlainDesertEdge();
  assert.equal(isDesert(edge,0),true);
  assert.equal(isDesert(edge-1,0),false);
  const overhang={origin:[edge-1,5,0],cells:[
    [edge-1,6,0,BLOCK.WOOD],[edge,9,0,BLOCK.LEAVES]
  ]};
  assert.equal(naturalTreeTouchesDesert(SEED,overhang.cells,overhang.origin),true);
  assert.equal(keepLegacyGroveTree(SEED,overhang),false,'No cross-border canopy');
  const inDesert={origin:[512,5,0],cells:[[512,6,0,BLOCK.WOOD]]};
  assert.equal(keepLegacyGroveTree(SEED,inDesert),false,'No Desert trunk');
  const plains={origin:[0,5,0],cells:[[0,6,0,BLOCK.WOOD],[1,8,0,BLOCK.LEAVES]]};
  assert.equal(naturalTreeTouchesDesert(SEED,plains.cells,plains.origin),false);
  assert.equal(keepLegacyGroveTree(SEED,plains),true,'Keep existing Plains trees');
});

test('V7 footprint rejection checks all columns and every bordering canopy rather than the root only',()=>{
  const edge=findPlainDesertEdge();
  const exterior=[edge-2,5,0],interior=[edge,9,0];
  // Duplicated vertical cells are common in real trees; they cannot evade the mask.
  assert.equal(naturalTreeTouchesDesert(SEED,[
    [exterior[0],6,0,BLOCK.WOOD],
    [exterior[0],7,0,BLOCK.WOOD],
    [interior[0],8,0,BLOCK.LEAVES],
    [interior[0],9,0,BLOCK.LEAVES]
  ],exterior),true);
  assert.equal(naturalTreeTouchesDesert(SEED,[[edge-1,9,0,BLOCK.LEAVES]],exterior),false);
  assert.equal(naturalTreeTouchesDesert(SEED,[[512,8,0,BLOCK.LEAVES]],[0,5,0]),true);
});

test('V7 environmental tree chunks never emit Desert-side foliage and remain load-order deterministic',()=>{
  // Controlled height/air readers isolate the natural spawn/climate policy
  // from terrain collisions without mocking the deterministic biome sampler.
  const readColumn=()=>new Map([[5,BLOCK.GRASS]]);
  const readCell=(_x,y)=>y<=5?BLOCK.GRASS:BLOCK.AIR;
  const edge=findPlainDesertEdge();
  const sites=[[0,0],[1,0],[-1,0],
    [Math.floor((edge-16)/16),0],[Math.floor(edge/16),0],
    [Math.floor((edge+16)/16),0],
    [Math.floor(512/16),0],[Math.floor(512/16)+1,0],
    // Environment trees are climate-specific; healthy Snow/Enchanted sites
    // are the positive controls, rather than original Plains grove trees.
    [0,32],[1,32],[-1,32],[0,-32],[1,-32],[-1,-32]];
  let trees=0;
  for(const [cx,cz] of sites){
    const first=environmentalTreesForChunk(cx,cz,SEED,readColumn,readCell);
    const repeat=environmentalTreesForChunk(cx,cz,SEED,readColumn,readCell);
    assert.deepEqual(first,repeat,'Chunk generation changed with identical inputs');
    for(const [key,id] of first){
      const [x,,z]=key.split(',').map(Number);
      assert.equal(isDesert(x,z),false,'Natural tree voxel leaked into Desert at '+key);
      assert.ok([BLOCK.WOOD,406,407,408,409,410].includes(id),
        'Unexpected natural tree material '+id);
      trees++;
    }
  }
  assert.ok(trees>0,'Control samples must generate actual trees outside Desert');
});

test('V7 masks naturally seeded landmark trees in Desert without masking unrelated structures',()=>{
  const world=new FourRegionWorld(SEED,fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR));
  // Inject one trusted district provenance record to exercise the real mask
  // lookup, avoiding reliance on chance placement of rare landmarks.
  world.liveDistrictCache.set('4,0',{
    trees:[],
    twinwood:{origin:[512,5,0],cells:[[512,12,0,BLOCK.WOOD]]},
    canopyGate:{origin:[511,5,0],cells:[[512,13,0,BLOCK.LEAVES]]},
    archwood:{origin:[511,5,0],cells:[[512,14,0,BLOCK.WOOD]]},
    fallenGiant:{origin:[511,5,0],cells:[[512,15,0,BLOCK.WOOD]]}
  });
  for(const [y,id] of [[12,BLOCK.WOOD],[13,BLOCK.LEAVES],
    [14,BLOCK.WOOD],[15,BLOCK.WOOD]]){
    assert.equal(world._environmentBaseline(512,y,0,id),BLOCK.AIR,
      'A naturally seeded tree landmark remained in Desert at y='+y);
  }
  // No natural-tree plan overlaps the unrelated site.
  assert.equal(world._environmentBaseline(513,12,0,BLOCK.WOOD),BLOCK.WOOD);
  assert.equal(world.save().edits.length,0,'Natural masking is not a saved edit');
});

test('V7 desert exclusion leaves saved player wood and leaf edits authoritative',()=>{
  const profile=fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(SEED,profile);
  for(const [x,y,z,id] of [[512,17,0,BLOCK.WOOD],[513,17,0,BLOCK.LEAVES]]){
    assert.equal(world.set(x,y,z,id),true);
    assert.equal(world.get(x,y,z),id,'Player edit must win over natural exclusion');
  }
  const saved=world.save();
  assert.equal(saved.schema,1);
  assert.equal(saved.edits.length,2);
  const reopened=new FourRegionWorld(SEED,profile);
  for(const [x,y,z,id] of saved.edits){
    assert.equal(reopened.set(x,y,z,id),true);
    assert.equal(reopened.get(x,y,z),id);
  }
  assert.deepEqual(reopened.save(),saved);
});
