import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS,ROADMAP_A_WAVE02_IDS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
function shapes(bp){const floor=bp.voxels.filter(v=>v.y===0&&v.kind==='foundation').map(v=>[v.x,v.z]);return Array.from({length:8},(_,i)=>{const pts=floor.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let n=0;n<i%4;n++)[x,z]=[-z,x];return [x,z]});const mx=Math.min(...pts.map(p=>p[0])),mz=Math.min(...pts.map(p=>p[1]));return new Set(pts.map(([x,z])=>(x-mx)+','+(z-mz)));});}
function d4(a,b){let max=0;for(const x of a)for(const y of b){let hits=0,sm=x.size<y.size?x:y,lg=x.size<y.size?y:x;for(const p of sm)if(lg.has(p))hits++;max=Math.max(max,hits/(x.size+y.size-hits));}return max;}
test('Roadmap A commerce Wave02: nine original, reserved, source-only geometry designs',()=>{
 const slots=new Map(plannedSlots().map(s=>[s.id,s]));assert.equal(ROADMAP_A_WAVE02_SHOPS.length,9);
 assert.equal(new Set(ROADMAP_A_WAVE02_IDS).size,9);
 assert.equal(new Set([...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS].map(b=>b.id)).size,19);
 for(const bp of ROADMAP_A_WAVE02_SHOPS){assert.equal(slots.get(bp.id)?.authoredHere,false,bp.id);assert.equal(validateBlueprint(bp).valid,true,bp.id);assert.ok(bp.voxels.length>1000,bp.id);assert.equal(bp.rooms.length,4,bp.id);assert.ok(bp.openings.filter(o=>o.type==='entrance').length===2,bp.id);assert.ok(bp.openings.filter(o=>o.type==='window').length>=6,bp.id);assert.equal(bp.worldPlaced,false);assert.equal(bp.numericIdsAssigned,false);}
 assert.equal(assertDistinctArchitecture(ROADMAP_A_WAVE02_SHOPS).distinctArchitectures,9);
});
test('Wave02: all nine source footprints have strict <0.85 same-category D4 against Wave01 and new peers',{timeout:240000},()=>{
 const all=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS];const transformed=new Map(all.map(b=>[b.id,shapes(b)]));
 for(const b of ROADMAP_A_WAVE02_SHOPS)for(const a of all)if(a.category===b.category&&a.id!==b.id){let v=d4(transformed.get(b.id),transformed.get(a.id));assert.ok(v<0.85,b.id+' '+a.id+' D4='+v);}
});
test('Wave02: biome roof, fixtures, unresolved producer assets and source-only safeguards',()=>{
 for(const b of ROADMAP_A_WAVE02_SHOPS){assert.equal(b.roof.biomeSpecific,true);assert.ok(b.voxels.some(v=>v.kind==='roof'));assert.ok(b.voxels.some(v=>v.kind==='fixture'));assert.ok(b.unresolvedDependencies.length>=3);assert.equal(b.isolated,true);}
});
