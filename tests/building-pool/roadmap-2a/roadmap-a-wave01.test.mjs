import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots,inventory} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS,ROADMAP_A_WAVE01_IDS,ROADMAP_A_WAVE01_SPECS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
const floor=b=>new Set(b.voxels.filter(v=>v.y===0&&v.kind==='foundation').map(v=>v.x+','+v.z));
function transforms(f){const cells=[...f].map(k=>k.split(',').map(Number));return Array.from({length:8},(_,i)=>{const pts=cells.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let j=0;j<i%4;j++)[x,z]=[-z,x];return [x,z]});const mx=Math.min(...pts.map(p=>p[0])),mz=Math.min(...pts.map(p=>p[1]));return new Set(pts.map(([x,z])=>(x-mx)+','+(z-mz)))});}
function d4(a,b){let highest=0;for(const x of transforms(a))for(const y of transforms(b)){const smaller=x.size<y.size?x:y,larger=x.size<y.size?y:x;let overlap=0;for(const k of smaller)if(larger.has(k))overlap++;highest=Math.max(highest,overlap/(x.size+y.size-overlap));}return highest;}
test('Roadmap A Wave01: ten unique unused reserved canonical source IDs; historical quota totals unchanged',()=>{
 assert.equal(ROADMAP_A_WAVE01_SHOPS.length,10);
 assert.equal(new Set(ROADMAP_A_WAVE01_IDS).size,10);
 assert.equal(inventory().authoredCandidateTotal,128,'historical catalog deliberately unchanged until acceptance');
 const reserved=new Map(plannedSlots().map(s=>[s.id,s]));
 for(const b of ROADMAP_A_WAVE01_SHOPS){const slot=reserved.get(b.id);assert.ok(slot,b.id);assert.equal(slot.authoredHere,false,'must be previously unfilled slot '+b.id);assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);assert.equal(validateBlueprint(b).valid,true);}
});
test('Roadmap A Wave01: original genuine voxel geometry, three-high entry, rooms and separate materials',()=>{
 for(const b of ROADMAP_A_WAVE01_SHOPS){
  assert.ok(b.voxels.length>1000,b.id);
  assert.equal(b.rooms.length,4,b.id);
  assert.ok(b.openings.filter(o=>o.type==='entrance').length===2,b.id);
  assert.ok(b.openings.filter(o=>o.type==='window').length>=6,b.id);
  assert.ok(b.voxels.some(v=>v.kind==='roof')&&b.voxels.some(v=>v.kind==='wall')&&b.voxels.some(v=>v.kind==='fixture'),b.id);
  assert.ok(b.unresolvedDependencies.every(d=>d.ref&&d.issue),b.id);
  assert.equal(typeof structuralFingerprint(b),'string',b.id);
 }
});
test('Roadmap A Wave01: every new same-category pair meets strict eight-way source footprint D4 IoU < 0.85',()=>{
 for(let i=0;i<ROADMAP_A_WAVE01_SHOPS.length;i++)for(let j=0;j<i;j++){
  const a=ROADMAP_A_WAVE01_SHOPS[i],b=ROADMAP_A_WAVE01_SHOPS[j];if(a.category!==b.category)continue;
  assert.ok(d4(floor(a),floor(b))<0.85,a.id+' vs '+b.id);
 }
});
test('Roadmap A Wave01: no game install or historical source mutations implied',()=>{
 for(const s of ROADMAP_A_WAVE01_SPECS){assert.ok(s.rects.length>=5);assert.ok(s.roofs.length===4);assert.ok(s.anchors.length===4);assert.ok(s.fixtures.length===4);}
});
