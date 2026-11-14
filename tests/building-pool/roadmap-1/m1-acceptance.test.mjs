import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {auditM1Building,auditM1Set,assertNoRepeatedBlueprintsInSettlement} from '../../../src/building-pool/roadmap-1/m1-acceptance.mjs';
const buildings=getM1Blueprints();
const sample=(f)=>{const b=structuredClone(buildings[0]);f(b);return b;};

test('all 45 M1 structures have genuine reachable interior clearance, physical weather profiles and room-fitted fixtures',()=>{
 const report=auditM1Set(buildings);
 assert.equal(report.count,45);assert.ok(report.totalWalkable>1500);assert.ok(report.totalPhysicalProfileCells>=600);
 assert.ok(report.records.every(r=>r.unresolvedAssetFamilies>1&&r.reachableCells>=10));
});
test('all 15 empty stables use real aisle-edge fence/partition placements on both sides',()=>{
 const stables=buildings.filter(b=>b.category==='stable');assert.equal(stables.length,15);
 for(const b of stables){assert.deepEqual(b.animals,[]);assert.ok(b.placements.filter(p=>p.role==='partition'&&p.asset==='pack5:096').length>=4);}
});
test('rooms have category-specific actual furnishings and the taverns contain bar-service counters',()=>{
 for(const b of buildings.filter(b=>b.category==='tavern')){
  const refs=b.placements.filter(p=>p.room==='taproom'&&p.asset==='pack5:086');
  assert.equal(refs.length,1,b.id+' missing actual taproom bar counter');
 }
});
test('reject silently duplicated building blueprint IDs inside one future settlement',()=>{
 assert.equal(assertNoRepeatedBlueprintsInSettlement(buildings.slice(0,20).map(b=>b.id)),true);
 assert.throws(()=>assertNoRepeatedBlueprintsInSettlement([buildings[0].id,buildings[0].id]),/reused/);
});
test('detect a fake portal label crossing to a physically distant room',()=>{
 const b=structuredClone(buildings.find(x=>x.category==='house'&&x.architecturalIdentity.plan==='cross'));
 b.portals.find(p=>p.from!=='outside').to='study';
 assert.throws(()=>auditM1Building(b),/mislabeled/);
});
test('reject a declared walkable cell unsupported by an actual foundation or stair',()=>{
 const b=sample(b=>{const cell=b.walkable.find(v=>v[2]>1);b.placements.splice(b.placements.findIndex(p=>p.at[0]===cell[0]&&p.at[1]===0&&p.at[2]===cell[2]),1);});
 assert.throws(()=>auditM1Building(b),/missing physical floor support/);
});
test('unresolved physically absent pack candidate is rejected rather than receiving invented live numeric IDs',()=>{
 const b=sample(b=>{const p=b.placements.find(p=>p.asset==='pack2:013');p.asset='pack2:999';b.dependencies.push({asset:'pack2:999',status:'unresolved',requires:['bounds','orientation','selection']});});
 assert.throws(()=>auditM1Building(b),/missing from the actual five-pack roster/);
});
test('architectural Massing and outside columns must be real voxel placements',()=>{
 const b=sample(b=>{b.placements=b.placements.filter(p=>p.role!=='support');});
 assert.throws(()=>auditM1Building(b),/regional physical profile missing/);
});
test('a tavern cannot be cosmetically relabeled without an authored actual bar counter',()=>{
 const b=structuredClone(buildings.find(x=>x.category==='tavern'));
 b.placements=b.placements.filter(p=>p.asset!=='pack5:086');
 assert.throws(()=>auditM1Building(b),/furnishing mismatch|lacks dedicated/);
});
test('45 candidates distinguish mounted hinged doorways from 60 intentionally open empty-stall gates',()=>{
 const hinged=buildings.flatMap(b=>b.portals.filter(p=>p.opening==='hinged-leaf'));
 const stall=buildings.flatMap(b=>b.portals.filter(p=>p.opening==='open-stall-bay'));
 assert.equal(stall.length,60);assert.ok(hinged.length>=60);
 for(const b of buildings){
  const doors=b.placements.filter(x=>x.role==='door');
  assert.equal(doors.length,b.portals.filter(x=>x.opening==='hinged-leaf').length,b.id);
 }
});
test('a claimed hinged portal without an authored adjacent stowed door is rejected',()=>{
 const b=sample(b=>{b.placements=b.placements.filter(p=>p.role!=='door');});
 assert.throws(()=>auditM1Building(b),/hinged opening has no authored stowed leaf/);
});
test('a stable bay cannot masquerade as a hinged door',()=>{
 const b=structuredClone(buildings.find(b=>b.category==='stable'));
 b.portals.find(p=>p.opening==='open-stall-bay').opening='hinged-leaf';
 assert.throws(()=>auditM1Building(b),/hinged opening has no authored stowed leaf/);
});
test('a stable bay must have actual partition rails on both edges',()=>{
 const b=structuredClone(buildings.find(b=>b.category==='stable'));
 const gate=b.portals.find(p=>p.opening==='open-stall-bay');
 b.placements=b.placements.filter(p=>!(p.at[0]===gate.at[0]&&p.at[1]===1&&p.at[2]===gate.at[2]-1));
 assert.throws(()=>auditM1Building(b),/rails flanking open stall bay/);
});
test('every candidate roof has physically authored frame sections and an unresolved strength/safe-span gate',()=>{
 for(const b of buildings){
  const {roofFrame}=b.architecturalIdentity;
  assert.equal(roofFrame.asset,'pack2:015');
  assert.equal(roofFrame.spanApproval,'unresolved');
  assert.ok(roofFrame.sections>=2);
  assert.ok(roofFrame.cellCount>=b.footprint.width-4);
  assert.equal(b.placements.filter(p=>p.roofFrame).length,roofFrame.cellCount);
 }
});
test('missing actual roof crossbeam voxel is rejected',()=>{
 const b=sample(b=>{b.placements.splice(b.placements.findIndex(p=>p.roofFrame==='crossbeam'),1);});
 assert.throws(()=>auditM1Building(b),/roof frame metadata does not match actual physical voxel count/);
});
test('roof span approval cannot be invented before physical Pack 2 beam and roof assets are integrated',()=>{
 const b=sample(b=>{b.architecturalIdentity.roofFrame.spanApproval='approved';});
 assert.throws(()=>auditM1Building(b),/future timber strength must not be falsely certified/);
});
test('horizontal Pack 2 timber beams cannot substitute for upright roof support-posts',()=>{
 const b=structuredClone(buildings.find(b=>b.placements.some(p=>p.roofFrame==='tie-post')));
 const post=b.placements.find(p=>p.roofFrame==='tie-post');post.asset='pack2:015';post.orientation='up';
 assert.throws(()=>auditM1Building(b),/vertical roof tie-post must use Pack 2 support post/);
});
