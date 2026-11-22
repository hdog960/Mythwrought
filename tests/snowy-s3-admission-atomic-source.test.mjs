import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3SafeChunk,previewSnowS3FullyAdmittedChunk}
  from '../src/manual-biomes/snowy-s3-integrated-admission.mjs';
const key=(x,y,z)=>x+','+y+','+z;
const M7='mythwrought-five-surface-regions-v7';
function setup(){
  const seed=179,edits=new Map(),caves=new Map(),extra=new Map();
  const get=(x,y,z)=>edits.get(key(x,y,z))??extra.get(key(x,y,z))??
    (y===6?272:y===5?278:y<5?3:0);
  const world={seed,generationProfile:{generator:M7},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    save:()=>({schema:1,seed,edits:[...edits.entries()]})};
  const sites=snowS3SitesForChunk(seed,0,32);
  assert.equal(sites.length,3);
  const deps={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree,
    planScenery:()=>[],describeScene:()=>{throw Error('No scenes');}};
  return {world,sites,extra,caves,edits,deps};
}
test('admission is stable for an unchanging original-M7 reader',()=>{
  const {world,deps}=setup();
  const p=reviewSnowS3SafeChunk(world,0,32,deps);
  assert.equal(p.safe,true);
  assert.equal(p.admitted.length,3);
  assert.equal(p.sourceWorldUnchanged,true);
  assert.ok(p.sceneCalls<=15);
});
test('reject post-validation cave AIR introduced by a scene planner without a save delta',()=>{
  const {world,sites,caves,deps}=setup();
  const first=sites[0];let changed=false;
  const malicious={...deps,planScenery:()=>{
    if(!changed){caves.set(key(first.x+2,6,first.z),0);changed=true;}
    return [];
  }};
  const p=reviewSnowS3SafeChunk(world,0,32,malicious);
  assert.equal(world.edits.size,0);
  assert.equal(p.safe,false,'Cannot admit stale original cave provenance');
  assert.match(p.reason,/source|cave|changed/i);
  const fresh=setup(),freshSite=fresh.sites[0];
  let changedInPreview=false;
  const preview=previewSnowS3FullyAdmittedChunk(fresh.world,0,32,{
    ...fresh.deps,planScenery:()=>{
      if(!changedInPreview){
        fresh.caves.set(key(freshSite.x+2,6,freshSite.z),0);
        changedInPreview=true;
      }
      return [];
    }
  });
  assert.equal(preview.safe,false);
});
test('reject post-validation canopy occupancy introduced by scenery without schema-1 edits',()=>{
  const {world,sites,extra,deps}=setup();
  const s=sites[0],tree=proposedSnowTree(snowS3StyleAt(s,6),s.x,6,s.z,{wind:s.wind});
  const needle=tree.cells.find(c=>c[3]===407)||tree.cells.find(c=>c[3]===406);
  assert.ok(needle);
  let changed=false;
  const malicious={...deps,planScenery:()=>{
    if(!changed){extra.set(key(...needle.slice(0,3)),4);changed=true;}
    return [];
  }};
  const p=reviewSnowS3SafeChunk(world,0,32,malicious);
  assert.equal(world.edits.size,0);
  assert.equal(p.safe,false,'Cannot certify an already-occupied tree cell');
  assert.match(p.reason,/source|changed|physical/i);
});
test('late scene calls cannot invalidate already admitted trees',()=>{
  const {world,sites,caves,deps}=setup(),first=sites[0];
  let calls=0;
  const malicious={...deps,planScenery:()=>{
    calls++;
    if(calls===10)caves.set(key(first.x+2,6,first.z),0);
    return [];
  }};
  const p=reviewSnowS3SafeChunk(world,0,32,malicious);
  assert.ok(calls>=10,'Two tree candidates must share some but not all scene plans');
  assert.equal(p.safe,false,'Later tree-source reads can invalidate earlier certificate');
  assert.match(p.reason,/source|changed|cave/i);
});
