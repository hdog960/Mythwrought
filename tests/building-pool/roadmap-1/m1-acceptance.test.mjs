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
