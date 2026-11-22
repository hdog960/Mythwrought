import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {previewSnowS3PhysicalChunk} from '../src/manual-biomes/snowy-s3-physical-chunk-preview.mjs';
const M7='mythwrought-five-surface-regions-v7', key=(x,y,z)=>x+','+y+','+z;
function authenticPhysicalFixture(seed){
  // Flat source-reader stub for chunk splitting only. Uses EXACT actual S3
  // proposedSnowTree voxels, not an original-game world or mock mesh.
  const sites=new Map();
  for(let cx=-2;cx<=2;cx++)for(let cz=30;cz<=34;cz++)
    for(const s of snowS3SitesForChunk(seed,cx,cz))sites.set(s.x+','+s.z,s);
  const get=(x,y,z)=>sites.has(x+','+z)?y===6?272:y===5?278:0:0;
  const edits=new Map(), caves=new Map();
  const world={seed,generationProfile:{generator:M7},edits,
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    environmentCaves:{get:(...xyz)=>caves.get(key(...xyz))}};
  const deps={biomeAt:()=>({name:'snow',weight:1}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree};
  return {world,deps,sites,edits,caves};
}
test('S3 actual four-shape voxels are clipped to negative and positive original 16x16 chunks',()=>{
  for(const seed of [179,2026]){
    const {world,deps,sites}=authenticPhysicalFixture(seed),full=new Map();
    const snapshot=JSON.stringify([...world.edits]);
    let trees=0;
    for(let cx=-2;cx<=2;cx++)for(let cz=30;cz<=34;cz++){
      const plan=previewSnowS3PhysicalChunk(world,cx,cz,deps);
      assert.ok(plan,`${seed} ${cx},${cz} preview failed closed unexpectedly`);
      assert.deepEqual(previewSnowS3PhysicalChunk(world,cx,cz,deps),plan);
      assert.ok(plan.physicalCells<=640);
      assert.equal(plan.physicalCells,plan.cells.length);
      assert.ok(plan.cells.every(([x,y,z])=>
        Math.floor(x/16)===cx&&Math.floor(z/16)===cz&&y>6&&y<=19));
      trees+=plan.sourceTrees;
      for(const cell of plan.cells){
        const k=key(...cell.slice(0,3));
        assert.ok(!full.has(k),'Chunk seam emitted duplicate physical voxel');
        full.set(k,cell[3]);
      }
    }
    assert.ok(trees>0&&full.size>50,'No meaningful physical S3 tree geometry');
    // Compare emitted owner cells to exact original four-shape source rows,
    // not just aggregate totals. Sites beyond the surveyed region can
    // legitimately contribute zero clipped voxels to its outermost chunks.
    for(let cx=-2;cx<=2;cx++)for(let cz=30;cz<=34;cz++){
      const part=previewSnowS3PhysicalChunk(world,cx,cz,deps);
      for(const [owner,count] of part.partialOwnerCounts){
        const site=[...sites.values()].find(s=>s.key===owner);
        assert.ok(site);
        const tree=proposedSnowTree(snowS3StyleAt(site,6),site.x,6,site.z,{wind:site.wind});
        const expected=tree.cells.filter(([x,y,z])=>Math.floor(x/16)===cx&&Math.floor(z/16)===cz);
        assert.equal(count,expected.length,'Clipped owner count must reflect actual tree voxels');
        for(const [x,y,z,id] of expected)assert.equal(full.get(key(x,y,z)),id,
          'Global real S3 silhouette lost a seam voxel');
      }
    }
    assert.equal(JSON.stringify([...world.edits]),snapshot,'Preview mutated world edits');
  }
});
test('S3 preview rejects protection, physical occupation, oversized shape and unknown world',()=>{
  const {world,deps,caves,edits}=authenticPhysicalFixture(179);
  const plan=previewSnowS3PhysicalChunk(world,0,32,deps);
  assert.ok(plan&&plan.physicalCells>0);
  const p=plan.cells[0],where=key(...p.slice(0,3));
  edits.set(where,0);
  const edited=previewSnowS3PhysicalChunk(world,0,32,deps);
  assert.ok(edited&&edited.physicalCells<plan.physicalCells,'Mined canopy must be rejected');
  edits.clear();
  caves.set(where,0);
  const cave=previewSnowS3PhysicalChunk(world,0,32,deps);
  assert.ok(cave&&cave.physicalCells<plan.physicalCells,'Explicit cave AIR cannot be painted');
  caves.clear();
  assert.equal(previewSnowS3PhysicalChunk(world,0,32,{...deps,proposedSnowTree:()=>({style:'incorrect',cells:[]})}).physicalCells,0);
  assert.equal(previewSnowS3PhysicalChunk({},0,0,deps),null);
  assert.throws(()=>previewSnowS3PhysicalChunk(world,250000,0,deps),/Invalid/);
});

test('S3 preview consumes only physically approved cells; never regenerates after clearance',()=>{
  const {world,deps}=authenticPhysicalFixture(179);
  let factoryCalls=0;
  const guarded={...deps,proposedSnowTree:(...args)=>{
    factoryCalls++;
    // The first shape is real and must never be replaced on a second call.
    if(factoryCalls>100)throw Error('Unexpected huge tree factory call budget');
    return proposedSnowTree(...args);
  }};
  const result=previewSnowS3PhysicalChunk(world,0,32,guarded);
  assert.ok(result&&result.sourceTrees>0);
  assert.ok(factoryCalls<=result.checked,
    'S3 generated original physical shape more than once per proposed site');
  assert.ok(result.cells.every(Object.isFrozen),
    'Physical approval token must be immutable');
});
