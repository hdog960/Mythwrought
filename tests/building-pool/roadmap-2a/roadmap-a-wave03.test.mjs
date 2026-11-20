import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {assertDistinctArchitecture,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS,ROADMAP_A_WAVE03_IDS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
function sourceFloor(b){return b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);}
function d4Variants(b){const coords=sourceFloor(b);return Array.from({length:8},(_,i)=>{const transformed=coords.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let n=0;n<i%4;n++)[x,z]=[-z,x];return [x,z];});const xmin=Math.min(...transformed.map(p=>p[0])),zmin=Math.min(...transformed.map(p=>p[1]));return new Set(transformed.map(([x,z])=>(x-xmin)+','+(z-zmin)));});}
function maxFloorOverlap(a,b){let max=0;for(const x of a)for(const y of b){let shared=0,small=x.size<y.size?x:y,large=x.size<y.size?y:x;for(const v of small)if(large.has(v))shared++;max=Math.max(max,shared/(x.size+y.size-shared));}return max;}
test('Wave03: twelve unused canonical source IDs and real category-specific occupied geometry',()=>{
 const all=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS];
 assert.equal(ROADMAP_A_WAVE03_SHOPS.length,12);assert.equal(new Set(ROADMAP_A_WAVE03_IDS).size,12);assert.equal(new Set(all.map(b=>b.id)).size,31);
 const slots=new Map(plannedSlots().map(b=>[b.id,b]));
 for(const bp of ROADMAP_A_WAVE03_SHOPS){assert.equal(slots.get(bp.id)?.authoredHere,false,bp.id);assert.equal(validateBlueprint(bp).valid,true,bp.id);assert.ok(bp.voxels.length>1000,bp.id);assert.equal(bp.rooms.length,4,bp.id);assert.ok(bp.openings.filter(o=>o.type==='entrance').length===2);assert.ok(bp.openings.filter(o=>o.type==='window').length>=6);assert.equal(bp.worldPlaced,false);assert.equal(bp.numericIdsAssigned,false);}
 assert.equal(assertDistinctArchitecture(ROADMAP_A_WAVE03_SHOPS).distinctArchitectures,12);
});
test('Wave03: strict eight-way same-category D4 <0.85 vs all 19 previous and all twelve Wave03 sources',{timeout:240000},()=>{
 const all=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS];
 const cache=new Map(all.map(b=>[b.id,d4Variants(b)]));let max=0;
 for(const b of ROADMAP_A_WAVE03_SHOPS)for(const old of all)if(b.id!==old.id&&b.category===old.category){const d=maxFloorOverlap(cache.get(b.id),cache.get(old.id));max=Math.max(max,d);assert.ok(d<0.85,b.id+' vs '+old.id+' = '+d);}
 console.log('ROADMAP_A_WAVE03_D4 '+JSON.stringify({new:12,old:19,maximum:max}));
});
test('Wave03: source-only fixture reservations and structural uncertainty are not masked',()=>{
 for(const bp of ROADMAP_A_WAVE03_SHOPS){assert.equal(bp.isolated,true);assert.ok(bp.unresolvedDependencies.length>=3);assert.ok(bp.voxels.some(v=>v.kind==='roof')&&bp.voxels.some(v=>v.kind==='fixture'));assert.ok(bp.voxels.every(v=>Number.isInteger(v.x)&&Number.isInteger(v.y)&&Number.isInteger(v.z)));}
});
