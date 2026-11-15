import test from 'node:test';
import assert from 'node:assert/strict';
import {createTemperateSmallBathhouse,getBathhouseSourceSignature} from '../../../src/building-pool/roadmap-1b/m1-bathhouse-temperate-small.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=c=>c.join(',');
test('M1 public baths is an original full-coordinate building, not a tag or seed',()=>{
 const b=createTemperateSmallBathhouse();
 assert.equal(b.id,'r1:bathhouse:temperate:small:001');
 assert.equal(validateBlueprint(b),true);assert.ok(b.placements.length>=500);
 assert.equal(b.footprint.width,15);assert.equal(b.footprint.depth,17);assert.equal(b.rooms.length,5);
 assert.deepEqual(b.rooms.map(r=>r.id),['changing-room','entry-and-towels','dry-heated-room','wash-service','open-bath']);
 assert.equal(b.portals.length,5);
 assert.equal(b.placements.filter(p=>p.role==='window').length,8);
 assert.ok(b.placements.some(p=>p.role==='roof'));
 assert.ok(b.placements.some(p=>p.role==='support'));
 assert.ok(b.placements.some(p=>p.purpose==='empty bath basin rim'));
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
});
test('M1 physical two-high entrance, real portal clearance and empty basin gap',()=>{
 const b=createTemperateSmallBathhouse(),occupied=new Map(b.placements.map(p=>[K(p.at),p]));
 for(const portal of b.portals){
  assert.ok(!occupied.has(K(portal.at)),portal.opening+' is blocked at foot');
  assert.ok(!occupied.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),portal.opening+' is blocked at head');
 }
 for(const c of [[7,1,0],[7,1,1],[7,1,2],[7,1,3],[9,1,6],[7,1,8],[7,1,10],[7,1,11],[2,1,11],[12,1,11],[7,1,12],[7,1,13]]){
  assert.ok(b.walkable.some(w=>K(w)===K(c)),'core standing/passage cell is not walkable: '+c);
 }
 assert.equal(b.footprintReservations.length,0);
});
test('M1 first bathhouse remains correct in the expanded 28/435 candidate pool',()=>{
 const items=get1BCandidates(),counts=validateAllocation(items);
 assert.equal(items.length,28);assert.equal(counts.authored,28);assert.equal(counts.remaining,407);
 assert.equal(items.filter(x=>x.category==='stable').length,15);
 assert.equal(items.filter(x=>x.category==='bathhouse').length,1);
 assert.equal(new Set(items.map(x=>x.id)).size,28);
 assert.deepEqual(counts.buckets['bathhouse/temperate/small'],1);
});
test('M1 bathhouse is deterministic across independent native source invocations',()=>{
 const a=getBathhouseSourceSignature(),b=getBathhouseSourceSignature();
 assert.equal(a.id,b.id);assert.equal(a.cellCount,b.cellCount);
 assert.equal(a.fingerprint,b.fingerprint);assert.equal(a.serialized,b.serialized);
});
