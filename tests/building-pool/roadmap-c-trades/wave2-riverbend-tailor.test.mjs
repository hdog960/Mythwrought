import test from 'node:test';
import assert from 'node:assert/strict';
import {createCRiverbendTailor} from '../../../src/building-pool/roadmap-c-trades/wave2-riverbend-tailor.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2b/schema.mjs';

const bp=createCRiverbendTailor(),at=(x,y,z)=>[x,y,z].join(',');
const cells=new Map(bp.voxels.map(v=>[at(v.x,v.y,v.z),v]));
const clear=(x,z)=>cells.has(at(x,1,z))&&[2,3,4].every(y=>!cells.has(at(x,y,z)));

test('C trade Wave02 original Riverbend tailor uses its C-only identity, complete physical rooms, real roof and source-cell glass',()=>{
 assert.equal(bp.id,'r2:tailor:temperate:small:03');
 assert.equal(bp.category,'tailor');
 assert.equal(bp.isolated,true);assert.equal(bp.worldPlaced,false);
 assert.equal(validateBlueprint(bp).voxels,2846);
 assert.equal(bp.voxels.filter(v=>v.kind==='foundation').length,652);
 assert.equal(bp.voxels.filter(v=>v.kind==='roof').length,692);
 assert.equal(bp.voxels.filter(v=>v.kind==='window').length,24);
 assert.equal(bp.rooms.length,5);
 assert.deepEqual(new Set(bp.rooms.flatMap(r=>r.uses)),new Set([
  'sales-floor','service-counter','garment-display','fitting-area','stockroom']));
 assert.equal(bp.openings.filter(o=>o.type==='internal-doorway').length,4);
 assert.equal(structuralFingerprint(bp),structuralFingerprint(createCRiverbendTailor()));
 assert.ok(new Set(bp.voxels.filter(v=>v.kind==='roof').map(v=>v.structuralRole)).size>=4);
});

test('Riverbend 9-cell open dye court is truly absent at all elevations, NOT fake air above a flat base',()=>{
 for(let x=15;x<=17;x++)for(let z=18;z<=20;z++)
  for(let y=0;y<bp.extents.y;y++)assert.equal(cells.has(at(x,y,z)),false,'not an absent-ground court '+at(x,y,z));
 assert.equal(bp.voxels.filter(v=>v.kind==='floor').length,652);
});

test('Riverbend street path, true two-wide internal doors, service counter, workshop and fitting wing all walk in real three-high source air',()=>{
 const front=[15,0],start=front.join(','),queue=[front],seen=new Set([start]);
 assert.ok(clear(...front));
 for(let cursor=0;cursor<queue.length;cursor++){
  const [x,z]=queue[cursor];
  for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const xx=x+dx,zz=z+dz,k=xx+','+zz;
   if(!seen.has(k)&&clear(xx,zz)){seen.add(k);queue.push([xx,zz]);}
  }
 }
 for(const t of bp.routeTargets){
  assert.ok(seen.has(t.x+','+t.z),'unreachable physical room path '+JSON.stringify(t));
 }
 for(const [x,z,dir] of [[15,0,'x'],[10,11,'z'],[23,15,'z'],[15,24,'x'],[16,29,'x']]){
  for(let i=0;i<2;i++)assert.ok(clear(x+(dir==='x'?i:0),z+(dir==='z'?i:0)),'fake two-wide doorway '+[x,z]);
 }
 assert.ok(queue.length>200,'missing actual multiroom circulation graph');
});

test('Riverbend transparency records, opening metadata, symbolic asset dependencies and four roof levels are exact real geometry',()=>{
 const windows=bp.voxels.filter(v=>v.kind==='window');
 assert.equal(windows.length,bp.openings.filter(o=>o.type==='window').length);
 for(const w of windows)assert.ok(bp.openings.some(o=>o.type==='window'&&o.x===w.x&&o.y===w.y&&o.z===w.z&&o.material===w.material));
 assert.deepEqual([...new Set(bp.voxels.filter(v=>v.kind==='roof'&&v.y<=10).map(v=>v.y))].sort((a,b)=>a-b),[7,8,9,10]);
 const used=new Set(bp.voxels.map(v=>v.material)),declared=new Set(bp.unresolvedDependencies.map(d=>d.ref));
 for(const ref of used)assert.ok(declared.has(ref),'unresolved material family concealed '+ref);
 assert.equal(bp.physicalProducerVerified,false);
});
