import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {validateBlueprint,structuralFingerprint,validatePool} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
const b=getM1InnExemplars()[0],key=at=>at.join(',');
test('one uniquely authored 3D Inn, unchanged 30 inherited house/tavern geometries',()=>{
 assert.equal(b.id,'r1:inn:temperate:small:001');
 assert.equal(b.title,"Wayfarer's Lantern Inn");
 assert.equal(b.placements.length,1493);
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,5);
 assert.equal(validateBlueprint(b),true);
 const pool=[...getM1Blueprints(),b];
 assert.equal(pool.length,31);assert.equal(validatePool(pool).authored,31);
 assert.equal(new Set(pool.map(x=>x.id)).size,31);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
});
test('five independently reachable 2-high portals, complete exterior entry, no false room labels',()=>{
 const occ=new Set(b.placements.map(p=>key(p.at)));
 for(const p of b.portals){
  const [x,y,z]=p.at;assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])));
 }
 for(const room of b.rooms)assert.ok(b.walkable.some(v=>v.every((x,i)=>x>=room.min[i]&&x<room.max[i])));
 assert.ok(b.rooms.some(r=>r.id==='guest-west'));
 assert.ok(b.rooms.some(r=>r.id==='guest-east'));
 assert.ok(structuralFingerprint(b).length>1000);
});
test('source-real Pack5 two-cell bed reservations have clear head and supported floor',()=>{
 assert.equal(b.footprintReservations.length,2);
 const occ=new Set(b.placements.map(p=>key(p.at))),walk=new Set(b.walkable.map(key));
 for(const r of b.footprintReservations){
  assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
  assert.equal(b.placements.find(p=>key(p.at)===key(r.anchor))?.variant,'wanderer-quilt');
  for(const [x,y,z] of r.extraCells){
   assert.ok(!occ.has(key([x,y,z]))&&!walk.has(key([x,y,z])));
   assert.ok(!occ.has(key([x,y+1,z])));
   assert.ok(occ.has(key([x,y-1,z])));
  }
 }
});
test('every roof tile has authored physical cell backing and unapproved rain/load',()=>{
 const occupied=new Map(b.placements.map(p=>[key(p.at),p]));
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.equal(roof.length,17*18);
 for(const p of roof){
  const [x,y,z]=p.at,below=occupied.get(key([x,y-1,z]));
  assert.ok(below&&['live:wood','pack2:013'].includes(below.asset),b.id+': roof unsupported at '+p.at);
  assert.equal(p.weatherSealApproved,false);
 }
 assert.equal(b.architecturalIdentity.roofWeatherSealApproved,false);
 assert.equal(b.architecturalIdentity.constructionLoadApproved,false);
});
test('no world production IDs, no NPC behavior, only exact unresolved symbolic material references',()=>{
 assert.ok(b.dependencies.length>=8);
 const refs=[...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort();
 assert.deepEqual(refs,b.dependencies.map(d=>d.asset));
 assert.ok(b.dependencies.every(x=>x.status==='unresolved'));
 assert.ok(b.placements.every(p=>!Number.isInteger(p.asset)));
});
