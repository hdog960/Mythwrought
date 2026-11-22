import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {previewSnowS3CanonicalOwnerChunk} from '../src/manual-biomes/snowy-s3-owner-chunk-preview.mjs';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(seed){
  const edits=new Map(),caves=new Map(),other=new Map(),generator='mythwrought-five-surface-regions-v7';
  const get=(x,y,z)=>edits.get(key(x,y,z))??other.get(key(x,y,z))??
    (y===6?272:y===5?278:y<5?3:0);
  const world={seed,generationProfile:{generator},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    save:()=>({schema:1,seed,edits:[...edits]})};
  const collides=(w,x,feet,z)=>{
    const r=.28,h=1.78,e=1e-5;
    for(let bx=Math.floor(x-r+e);bx<=Math.floor(x+r-e);bx++)
      for(let bz=Math.floor(z-r+e);bz<=Math.floor(z+r-e);bz++)
        for(let by=Math.floor(feet+e);by<=Math.floor(feet+h-e);by++)
          if(w.get(bx,by,bz)!==0)return true;
    return false;
  };
  const deps={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree,
    planScenery:()=>[],describeScene:()=>null,collides};
  return {world,deps,edits,caves,other};
}

test('adjacent positive/negative 16-cell chunk slices agree on the SAME owner tree',()=>{
  const {world,deps}=fixture(179),before=JSON.stringify(world.save());
  const west=previewSnowS3CanonicalOwnerChunk(world,-1,32,deps);
  const east=previewSnowS3CanonicalOwnerChunk(world,0,32,deps);
  assert.ok(west.safe&&east.safe,JSON.stringify({west:west.reason,east:east.reason}));
  // A deterministic global site at x=-3 has needles protruding east to x=0.
  const source=snowS3SitesForChunk(179,0,32).find(s=>s.x===-3);
  assert.ok(source);
  assert.ok(west.accepted.some(a=>a.key===source.key));
  assert.ok(east.accepted.some(a=>a.key===source.key));
  assert.ok(west.cells.some(c=>c[0]===-1));
  assert.ok(east.cells.some(c=>c[0]===0));
  assert.ok(west.cells.every(c=>Math.floor(c[0]/16)===-1&&Math.floor(c[2]/16)===32));
  assert.ok(east.cells.every(c=>Math.floor(c[0]/16)===0&&Math.floor(c[2]/16)===32));
  assert.equal(new Set([...west.cells,...east.cells].map(c=>key(...c.slice(0,3)))).size,
    west.cells.length+east.cells.length,'A world voxel can belong to only one 16x16 chunk');
  assert.deepEqual(previewSnowS3CanonicalOwnerChunk(world,-1,32,deps),west);
  assert.deepEqual(previewSnowS3CanonicalOwnerChunk(world,0,32,deps),east);
  assert.equal(JSON.stringify(world.save()),before);
});

test('canonical owner acceptance does not depend on requesting neighbor chunks first',()=>{
  for(const seed of [179,2026]){
    const {world,deps}=fixture(seed);
    const a=[[-1,32],[0,32],[1,32]].map(([x,z])=>previewSnowS3CanonicalOwnerChunk(world,x,z,deps));
    const b=[[1,32],[0,32],[-1,32]].map(([x,z])=>previewSnowS3CanonicalOwnerChunk(world,x,z,deps)).reverse();
    assert.ok(a.every(p=>p.safe));
    assert.deepEqual(a,b);
    assert.ok(a.every(p=>p.ownerReviews<=9));
    assert.equal(world.edits.size,0);
  }
});

test('owner must reject cave AIR or edited AIR in an adjacent tree footprint',()=>{
  const {world,deps,caves,edits}=fixture(179);
  const ok=previewSnowS3CanonicalOwnerChunk(world,0,32,deps);
  assert.ok(ok.safe&&ok.cells.length);
  const [x,y,z]=ok.cells[0];
  caves.set(key(x,y,z),0);
  const rejected=previewSnowS3CanonicalOwnerChunk(world,0,32,deps);
  assert.ok(rejected.safe);
  assert.ok(!rejected.cells.some(c=>c[0]===x&&c[1]===y&&c[2]===z));
  caves.clear();edits.set(key(x,y,z),0);
  const edited=previewSnowS3CanonicalOwnerChunk(world,0,32,deps);
  assert.ok(edited.safe);
  assert.ok(!edited.cells.some(c=>c[0]===x&&c[1]===y&&c[2]===z));
});

test('original failed body callback aborts the canonical physical chunk',()=>{
  const {world,deps}=fixture(179);
  const result=previewSnowS3CanonicalOwnerChunk(world,0,32,{...deps,collides:()=>undefined});
  assert.equal(result.safe,false);
  assert.match(result.reason,/owner-source-review-failed:original-player-collision-callback-failed/);
  assert.equal(world.edits.size,0);
  assert.equal(previewSnowS3CanonicalOwnerChunk({},0,32,deps).safe,false);
});
