import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,worldKey,meshChunk} from '../src/voxel.mjs';
import {auditCaveSourceCells} from '../src/manual-caves/source-composition.mjs';
import {CAVE_ENTRANCE_PROFILE,planNewCaveEntrances,originalCaveEntranceSites}
  from '../src/manual-caves/entrance-preflight.mjs';
test('surface excavation never occurs without explicit new-world approval',()=>{
  const world=new VoxelWorld(179),cells=new Map();
  const result=planNewCaveEntrances({world,sourceCells:cells});
  assert.equal(result.ok,false);
  assert.equal(result.reason,'EXPLICIT_NEW_CAVE_WORLD_REQUIRED');
  assert.equal(world.edits.size,0);
});
test('all real cave sources have four distinct authored surface entry anchors',()=>{
 const sites=originalCaveEntranceSites();
 assert.deepEqual(sites.map(s=>s.name),['old-deep24','switchback36','upper24-windcut','upper24-hollowbend']);
 assert.ok(new Set(sites.map(s=>s.x+','+s.z)).size===4);
});
for(const seed of [179,1,2026,-77]){
 test('source-protected four-cave surface approach physical proposals seed '+seed,()=>{
  const baseline=new VoxelWorld(seed),before=JSON.stringify(baseline.save());
  const source=auditCaveSourceCells(seed);
  assert.equal(source.ok,true,JSON.stringify(source.reasons));
  const plan=planNewCaveEntrances({world:baseline,sourceCells:source.cells,approved:true});
  assert.equal(plan.ok,true,'No safe entrance for seed '+seed+': '+JSON.stringify(plan.failures));
  assert.equal(plan.entrances.length,4);
  assert.equal(plan.profile,CAVE_ENTRANCE_PROFILE);
  const actual={seed,get(x,y,z){
   const k=worldKey(x,y,z);
   return plan.cells.get(k)??source.cells.get(k)??baseline.get(x,y,z);
  }};
  for(const entry of plan.entrances){
   assert.ok(entry.route.length>=4);
   assert.ok(entry.mouth.approachSteps===entry.route.length);
   assert.equal(entry.runtimeConnected,false);
   for(let i=0;i<entry.route.length;i++){
    const p=entry.route[i],prev=entry.route[i-1];
    if(prev){
      assert.equal(Math.abs(p.x-prev.x)+Math.abs(p.z-prev.z),1,'entrance cardinal continuity');
      assert.ok(p.feet-prev.feet===0||p.feet-prev.feet===1,'supported walkable rise');
    }
    assert.notEqual(actual.get(p.x,p.floor,p.z),BLOCK.AIR,'missing entrance support '+entry.name);
    for(let h=1;h<=4;h++)
      assert.equal(actual.get(p.x,p.floor+h,p.z),BLOCK.AIR,'blocked entrance headroom '+entry.name);
    assert.equal(collides(actual,p.x+.5,p.feet,p.z+.5),false,'blocked player body '+entry.name);
   }
   const last=entry.route.at(-1);
   assert.equal(last.x,entry.mouth.x);
   assert.equal(last.z,entry.mouth.z);
  }
  assert.equal(JSON.stringify(baseline.save()),before,'entrance planning modified original schema-1 world');
  assert.equal(baseline.edits.size,0,'proposed entrances must not mutate player edits');
  const first=plan.entrances[0].mouth;
  const vertices=meshChunk(actual,Math.floor(first.x/16),Math.floor(first.z/16));
  assert.ok(vertices.length>0,'real surface mesher sees proposed physical cave mouth');
 });
}
