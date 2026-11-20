import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave06.mjs';
const waves=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS,...ROADMAP_A_WAVE06_SHOPS];
const fp=b=>b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);
function d4s(b){const f=fp(b);return Array.from({length:8},(_,i)=>{const p=f.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let n=0;n<i%4;n++)[x,z]=[-z,x];return [x,z]});const mx=Math.min(...p.map(a=>a[0])),mz=Math.min(...p.map(a=>a[1]));return new Set(p.map(([x,z])=>(x-mx)+','+(z-mz)));});}
function d4(a,b){let best=0;for(const x of a)for(const y of b){let shared=0,sm=x.size<y.size?x:y,lg=x.size<y.size?y:x;for(const p of sm)if(lg.has(p))shared++;best=Math.max(best,shared/(x.size+y.size-shared));}return best;}
test('Wave06: twelve unique unused canonical 2A source IDs with original complete rooms, actual source geometry and no gameplay registration',{timeout:240000},()=>{
 assert.equal(ROADMAP_A_WAVE06_SHOPS.length,12);assert.equal(new Set(waves.map(b=>b.id)).size,67);
 const slots=new Map(plannedSlots().map(s=>[s.id,s]));
 assert.equal(assertDistinctArchitecture(ROADMAP_A_WAVE06_SHOPS).distinctArchitectures,12);
 for(const b of ROADMAP_A_WAVE06_SHOPS){
  assert.equal(slots.get(b.id)?.authoredHere,false,b.id);
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert.ok(b.voxels.length>1000,b.id);
  assert.equal(b.rooms.length,4,b.id);
  assert.equal(b.openings.filter(o=>o.type==='entrance').length,2,b.id);
  assert.ok(b.openings.filter(o=>o.type==='window').length>=6,b.id);
  assert.equal(b.worldPlaced,false,b.id);assert.equal(b.numericIdsAssigned,false,b.id);
  assert.ok(b.unresolvedDependencies.length>=3,b.id);
 }
});
test('Wave06: strict eight-way D4 floor intersection-over-union <0.85 against all 55 prior and 12 new same-category candidates',{timeout:240000},()=>{
 const m=new Map(waves.map(b=>[b.id,d4s(b)]));let total=0,max=0;
 for(const b of ROADMAP_A_WAVE06_SHOPS)for(const other of waves)if(other.id!==b.id&&other.category===b.category){
  const value=d4(m.get(b.id),m.get(other.id));max=Math.max(max,value);total++;
  assert.ok(value<0.85,b.id+' matches '+other.id+' D4='+value);
 }
 console.log('ROADMAP_A_WAVE06_D4 '+JSON.stringify({new:12,older:55,comparisons:total,max}));
});
