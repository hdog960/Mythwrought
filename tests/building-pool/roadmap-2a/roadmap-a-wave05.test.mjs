import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS,ROADMAP_A_WAVE05_IDS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave05.mjs';
const all=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS];
function variants(b){const f=b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);return Array.from({length:8},(_,i)=>{let pts=f.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let j=0;j<i%4;j++)[x,z]=[-z,x];return [x,z]});let lowx=Math.min(...pts.map(a=>a[0])),lowz=Math.min(...pts.map(a=>a[1]));return new Set(pts.map(([x,z])=>(x-lowx)+','+(z-lowz)));});}
function d4(a,b){let highest=0;for(const x of a)for(const y of b){let shared=0,small=x.size<y.size?x:y,large=x.size<y.size?y:x;for(const k of small)if(large.has(k))shared++;highest=Math.max(highest,shared/(x.size+y.size-shared));}return highest;}
test('Wave05: twelve genuine unused canonical source IDs, independent voxel architecture and openings',{timeout:240000},()=>{
 assert.equal(ROADMAP_A_WAVE05_SHOPS.length,12);assert.equal(new Set(ROADMAP_A_WAVE05_IDS).size,12);
 assert.equal(new Set(all.map(s=>s.id)).size,55);
 const planned=new Map(plannedSlots().map(s=>[s.id,s]));
 assert.equal(assertDistinctArchitecture(ROADMAP_A_WAVE05_SHOPS).distinctArchitectures,12);
 for(const bp of ROADMAP_A_WAVE05_SHOPS){
  assert.equal(planned.get(bp.id)?.authoredHere,false,bp.id);
  assert.equal(validateBlueprint(bp).valid,true,bp.id);
  assert.ok(bp.voxels.length>1000,bp.id);
  assert.equal(bp.rooms.length,4,bp.id);
  assert.equal(bp.openings.filter(o=>o.type==='entrance').length,2,bp.id);
  assert.ok(bp.openings.filter(o=>o.type==='window').length>=6,bp.id);
  assert.equal(bp.worldPlaced,false,bp.id);assert.equal(bp.numericIdsAssigned,false,bp.id);
 }
});
test('Wave05: 12 new plans strict eight-way <0.85 D4 against all 43 earlier and 12 current category peers',{timeout:240000},()=>{
 const transformed=new Map(all.map(b=>[b.id,variants(b)]));let checks=0,max=0;
 for(const b of ROADMAP_A_WAVE05_SHOPS)for(const other of all)
 if(other.id!==b.id&&other.category===b.category){
  const score=d4(transformed.get(b.id),transformed.get(other.id));
  max=Math.max(max,score);checks++;
  assert.ok(score<0.85,b.id+' collided with '+other.id+' D4 '+score);
 }
 console.log('ROADMAP_A_WAVE05_D4 '+JSON.stringify({checks,max,prior:43,new:12}));
});
test('Wave05: cold source-only producer reservations and exact integer voxels',{timeout:240000},()=>{
 for(const b of ROADMAP_A_WAVE05_SHOPS){
  assert.equal(b.isolated,true);assert.equal(b.status,'authored-candidate');
  assert.ok(b.unresolvedDependencies.length>=3,b.id);
  assert.ok(b.voxels.some(v=>v.kind==='fixture')&&b.voxels.some(v=>v.kind==='roof'));
  assert.ok(b.voxels.every(v=>Number.isInteger(v.x)&&Number.isInteger(v.y)&&Number.isInteger(v.z)));
 }
});
