import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
import {auditSelectedInterlevelTopology}
 from '../src/living-underworld/source-network-topology.mjs';

const candidates=(seed=179,rx=2,rz=0)=>[16,25,34].map(index=>
 planDetachedPedestrianSwitchback(seed,rx,rz,index,{radius:44,cornerFlat:8}));

test('three original-planner switchbacks preserve every exact hub transition',()=>{
 for(const [seed,rx,rz] of [[179,2,0],[179,2,1],[2026,0,0],[-17,0,0]]){
  const r=auditSelectedInterlevelTopology(seed,rx,rz,candidates(seed,rx,rz));
  assert.equal(r.ok,true,JSON.stringify(r));
  assert.equal(r.verifiedLinks,3);
  assert.equal(r.completeFourHubTopology,true);
  assert.ok(r.totalCells>10000);
  assert.equal(r.historicalOriginalM7CellsUnverified,true);
  assert.equal(r.playerWalkingUnverified,true);
  assert.equal(r.worldChanged,false);
 }
});
test('two isolated routes never imply a three-connector deep network',()=>{
 const r=auditSelectedInterlevelTopology(179,2,0,candidates().slice(0,2));
 assert.equal(r.ok,false);
 assert.equal(r.reason,'THREE_DEEP_LINKS_REQUIRED');
});
test('swapped connectors cannot claim alternate hub identity',()=>{
 const [a,b,c]=candidates();
 const r=auditSelectedInterlevelTopology(179,2,0,[b,a,c]);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'INTERLEVEL_ENDPOINT_OR_PROVENANCE_MISMATCH');
});
test('cross-seed, stale endpoint metadata and wrong origin cannot reuse approval',()=>{
 const [a,b,c]=candidates();
 for(const wrong of [{...a,seed:2026},
  {...a,from:{...a.from,x:a.from.x+1}},
  {...a,rx:3}]){
  const r=auditSelectedInterlevelTopology(179,2,0,[wrong,b,c]);
  assert.equal(r.ok,false);
  assert.equal(r.reason,'INTERLEVEL_ENDPOINT_OR_PROVENANCE_MISMATCH');
 }
});
test('a discontinuity between claimed staircase segments is never bridged',()=>{
 const [a,b,c]=candidates();
 const segments=[...a.segments];
 segments[1]={...segments[1],a:{...segments[1].a,x:segments[1].a.x+1}};
 const r=auditSelectedInterlevelTopology(179,2,0,[{...a,segments},b,c]);
 assert.equal(r.reason,'INTERLEVEL_ROUTE_DISCONTINUITY_OR_BOUNDS');
});
test('a steep attempted shortcut fails genuine original grade logic',()=>{
 const [a,b,c]=candidates();
 const start=a.segments[0].a,finish=a.segments.at(-1).b;
 const mid={x:start.x+1,y:start.y-30,z:start.z};
 const broken={...a,segments:[{a:start,b:mid},{a:mid,b:finish}]};
 const r=auditSelectedInterlevelTopology(179,2,0,[broken,b,c]);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'INTERLEVEL_GRADE_UNSAFE');
});
test('aggregate physical footprint work budget is enforced',()=>{
 const r=auditSelectedInterlevelTopology(179,2,0,candidates(),{maxCells:1000});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'INTERLEVEL_TOTAL_GEOMETRY_BUDGET');
});
test('invalid seed and impossible source-network options are refused',()=>{
 assert.throws(()=>auditSelectedInterlevelTopology(2**34,2,0,candidates()));
 assert.throws(()=>auditSelectedInterlevelTopology(179,2,0,candidates(),{maxCells:100}));
 assert.throws(()=>auditSelectedInterlevelTopology(179,2,0,[...candidates(),candidates()[0]]));
});
