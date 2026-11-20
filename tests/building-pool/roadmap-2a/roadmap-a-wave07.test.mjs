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
import {ROADMAP_A_WAVE07_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave07.mjs';
const older=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS,...ROADMAP_A_WAVE06_SHOPS];const added=ROADMAP_A_WAVE07_SHOPS;
function variants(b){const f=b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);return Array.from({length:8},(_,i)=>{const a=f.map(([xx,zz])=>{let x=i>=4?-xx:xx,z=zz;for(let j=0;j<i%4;j++)[x,z]=[-z,x];return [x,z]});let mx=Math.min(...a.map(p=>p[0])),mz=Math.min(...a.map(p=>p[1]));return new Set(a.map(([x,z])=>(x-mx)+','+(z-mz)));});}
function pair(a,b){let max=0;for(const x of a)for(const y of b){let hits=0,sm=x.size<y.size?x:y,lg=x.size<y.size?y:x;for(const p of sm)if(lg.has(p))hits++;max=Math.max(max,hits/(x.size+y.size-hits));}return max;}
test('Wave07: 12 original genuine source candidates, reserved canonical IDs, no collisions, rooms or saves altered',{timeout:240000},()=>{
 assert.equal(older.length,67);assert.equal(added.length,12);
 assert.equal(new Set([...older,...added].map(b=>b.id)).size,79);
 const ledger=new Map(plannedSlots().map(x=>[x.id,x]));assert.equal(assertDistinctArchitecture(added).distinctArchitectures,12);
 for(const b of added){assert.equal(ledger.get(b.id)?.authoredHere,false,b.id);assert.equal(validateBlueprint(b).valid,true,b.id);assert.ok(b.voxels.length>1000,b.id);assert.equal(b.rooms.length,4,b.id);assert.equal(b.openings.filter(o=>o.type==='entrance').length,2,b.id);assert.ok(b.openings.filter(o=>o.type==='window').length>=6,b.id);assert.ok(b.unresolvedDependencies.length>=3,b.id);assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);}
});
test('Wave07: strict eight-way same-category new-to-new D4 <0.85 against all 67 inherited and 12 Wave07',{timeout:240000},()=>{
 const all=[...older,...added],data=new Map(all.map(b=>[b.id,variants(b)]));let checks=0,max=0;
 for(const b of added)for(const a of all)if(b.id!==a.id&&b.category===a.category){const v=pair(data.get(b.id),data.get(a.id));checks++;max=Math.max(max,v);assert.ok(v<0.85,b.id+' versus '+a.id+' IoU='+v);}
 console.log('ROADMAP_A_WAVE07_D4 '+JSON.stringify({checked:checks,max}));
});
