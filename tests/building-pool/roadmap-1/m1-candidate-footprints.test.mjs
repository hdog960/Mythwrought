import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-1/schema.mjs';
import {auditM1Building} from '../../../src/building-pool/roadmap-1/m1-acceptance.mjs';
import {extraCandidateCells,BED_SOURCE} from '../../../src/building-pool/roadmap-1/m1-candidate-footprints.mjs';
const all=getM1Blueprints(),copy=()=>structuredClone(all.find(b=>b.category==='house'));
const key=v=>v.join(',');
test('physical Pack5 candidate source explicitly supplies 2 bed cells, not a final approved AABB',()=>{
 assert.equal(BED_SOURCE.integrated,false);
 assert.deepEqual(extraCandidateCells('pack5:082',[2,1,5],'north'),[[2,1,6]]);
 assert.throws(()=>extraCandidateCells('pack5:082',[2,1,5],'east'),/north/);
});
test('all fifteen beds reserve foot cells outside physically walkable routes and still have support',()=>{
 const homes=all.filter(b=>b.category==='house');assert.equal(homes.length,15);
 for(const b of homes){
  const beds=b.placements.filter(p=>p.asset==='pack5:082');assert.equal(beds.length,1);
  const reservations=b.footprintReservations.filter(r=>r.asset==='pack5:082');assert.equal(reservations.length,1);
  const set=new Set(b.walkable.map(key)),occ=new Set(b.placements.map(p=>key(p.at)));
  for(const cell of reservations[0].extraCells){
   assert.ok(!set.has(key(cell)),b.id+' physical bed foot was falsely walkable');
   assert.ok(!occ.has(key(cell)),b.id+' bed foot collides with another authored placement');
   assert.ok(occ.has(key([cell[0],0,cell[2]])),b.id+' bed foot has no supporting floor');
  }
  assert.equal(auditM1Building(b).id,b.id);
 }
});
test('missing foot reservation is detected even when declared rooms remain connected',()=>{
 const b=copy();b.footprintReservations=[];
 assert.throws(()=>auditM1Building(b),/two-cell beds require/);
});
test('walking into a future bed-foot collision is rejected by the independent schema',()=>{
 const b=copy(),c=b.footprintReservations[0].extraCells[0];b.walkable.push(c);
 assert.throws(()=>validateBlueprint(b),/multi-cell part overlaps authored placement or walkable space/);
});
test('a forged bed reservation overlapping another authored furnishing is rejected',()=>{
 const b=copy();b.footprintReservations[0].extraCells[0]=[...b.placements.find(p=>p.role==='wall').at];
 assert.throws(()=>validateBlueprint(b),/multi-cell part overlaps authored placement or walkable space/);
});
test('misoriented future bed geometry is not accepted as a substitute for official Pack5 cell offsets',()=>{
 const b=copy();b.footprintReservations[0].extraCells[0][0]+=1;
 assert.throws(()=>auditM1Building(b),/bed footprint disagrees|multi-cell part overlaps/);
});
