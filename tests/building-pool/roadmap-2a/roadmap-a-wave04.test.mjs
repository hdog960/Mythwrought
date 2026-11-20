import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS,ROADMAP_A_WAVE04_IDS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave04.mjs';
const recent=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS];
const shapes=b=>{
 const points=b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);
 return Array.from({length:8},(_,i)=>{
  const pts=points.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let j=0;j<i%4;j++)[x,z]=[-z,x];return [x,z]});
  const loX=Math.min(...pts.map(p=>p[0])),loZ=Math.min(...pts.map(p=>p[1]));
  return new Set(pts.map(([x,z])=>(x-loX)+','+(z-loZ)));
 });
};
const iou=(a,b)=>{let best=0;for(const p of a)for(const q of b){
 let overlap=0,small=p.size<q.size?p:q,large=p.size<q.size?q:p;
 for(const k of small)if(large.has(k))overlap++;
 best=Math.max(best,overlap/(p.size+q.size-overlap));
}return best};
test('Wave04: 12 fresh canonical, independently occupied source geometries with unchanged prior 31 IDs',{timeout:240000},()=>{
 const reservations=new Map(plannedSlots().map(s=>[s.id,s]));
 assert.equal(ROADMAP_A_WAVE04_SHOPS.length,12);
 assert.equal(new Set(ROADMAP_A_WAVE04_IDS).size,12);
 assert.equal(new Set(recent.map(x=>x.id)).size,43);
 assert.equal(assertDistinctArchitecture(ROADMAP_A_WAVE04_SHOPS).distinctArchitectures,12);
 for(const b of ROADMAP_A_WAVE04_SHOPS){
  assert.equal(reservations.get(b.id)?.authoredHere,false,b.id);
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert.ok(b.voxels.length>1200,b.id);
  assert.equal(b.rooms.length,4,b.id);
  assert.equal(b.openings.filter(o=>o.type==='entrance').length,2,b.id);
  assert.ok(b.openings.filter(o=>o.type==='window').length>=6,b.id);
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
 }
});
test('Wave04: all 12 new buildings strictly pass eight-way same-type D4 IoU <0.85 vs 31 earlier and new peers',{timeout:240000},()=>{
 const transformed=new Map(recent.map(b=>[b.id,shapes(b)]));
 let checks=0,highest=0;
 for(const b of ROADMAP_A_WAVE04_SHOPS)for(const other of recent)
  if(other.id!==b.id&&other.category===b.category){
   const val=iou(transformed.get(b.id),transformed.get(other.id));checks++;highest=Math.max(highest,val);
   assert.ok(val<0.85,b.id+' vs '+other.id+' D4='+val);
  }
 console.log('ROADMAP_A_WAVE04_D4 '+JSON.stringify({checks,highest,previousProvisional:31}));
});
test('Wave04: protect source-only physical-block producer and unapproved gameplay boundaries',()=>{
 for(const b of ROADMAP_A_WAVE04_SHOPS){
  assert.equal(b.isolated,true);
  assert.ok(b.unresolvedDependencies.length>=3);
  assert.ok(b.voxels.some(v=>v.kind==='roof'));
  assert.ok(b.voxels.some(v=>v.kind==='fixture'));
  assert.ok(b.voxels.every(v=>Number.isInteger(v.x)&&Number.isInteger(v.y)&&Number.isInteger(v.z)));
 }
});
