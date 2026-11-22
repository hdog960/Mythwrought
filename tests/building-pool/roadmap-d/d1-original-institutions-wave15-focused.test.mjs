// Builder D Wave15: FOCUSED new 8-original source-only validation.
// Full prior 2570 D4 contracts remain unchanged and are NOT rerun in this focused test.
// Recheck all previous tests only at a coordinated major milestone/final acceptance gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL as historical} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {expectedIds,geometrySignature,validateBlueprint,validateCollection} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {buildDistinctive4B} from '../../../src/building-pool/roadmap-4b/m2-distinctive.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS as W1} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {ROADMAP_D_WAVE2_BUILDINGS as W2} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave2.mjs';
import {ROADMAP_D_WAVE3_BUILDINGS as W3} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave3.mjs';
import {ROADMAP_D_WAVE4_BUILDINGS as W4} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave4.mjs';
import {ROADMAP_D_WAVE5_BUILDINGS as W5} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave5.mjs';
import {ROADMAP_D_WAVE6_BUILDINGS as W6} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave6.mjs';
import {ROADMAP_D_WAVE7_BUILDINGS as W7} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave7.mjs';
import {ROADMAP_D_WAVE8_BUILDINGS as W8} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave8.mjs';
import {ROADMAP_D_WAVE9_BUILDINGS as W9} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave9.mjs';
import {ROADMAP_D_WAVE10_BUILDINGS as W10} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave10.mjs';
import {ROADMAP_D_WAVE11_BUILDINGS as W11} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave11.mjs';
import {ROADMAP_D_WAVE12_BUILDINGS as W12} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave12.mjs';
import {ROADMAP_D_WAVE13_BUILDINGS as W13} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave13.mjs';
import {ROADMAP_D_WAVE14_BUILDINGS as W14} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave14.mjs';
import {ROADMAP_D_WAVE15_BUILDINGS,ROADMAP_D_WAVE15_PLANS,ROADMAP_D_WAVE15_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave15.mjs';
const prior=[...W1,...W2,...W3,...W4,...W5,...W6,...W7,...W8,...W9,...W10,...W11,...W12,...W13,...W14];
const fresh=ROADMAP_D_WAVE15_BUILDINGS;
const all=[...historical,...prior,...fresh];
const floorCache=new WeakMap();
function floor(b,t){
 let cache=floorCache.get(b);if(!cache){cache=[];floorCache.set(b,cache)}if(cache[t])return cache[t];
 const raw=b.cells.filter(c=>c.role==='floor').map(c=>{
   let [x,,z]=c.at;if(t&1)x=-x;if(t&2)[x,z]=[z,x];if(t&4)z=-z;return [x,z];
 });
 assert.ok(raw.length>50,'no source floor geometry '+b.id);
 let minx=Infinity,minz=Infinity;
 for(const [x,z] of raw){minx=Math.min(minx,x);minz=Math.min(minz,z)}
 return cache[t]=new Set(raw.map(([x,z])=>(x-minx)+','+(z-minz)));
}
function strictD4(a,b){
 const stable=floor(b,0);let worst=0;
 for(let t=0;t<8;t++){
  const other=floor(a,t);let hit=0;for(const pt of other)if(stable.has(pt))hit++;
  worst=Math.max(worst,hit/(stable.size+other.size-hit));
 }
 return worst;
}
function pair(a,b){
 const ab=strictD4(a,b),ba=strictD4(b,a);
 assert.ok(ab<.89&&ba<.89,'strict 2-direction 8-orientation D4 clone '+a.id+' vs '+b.id+' '+ab+' / '+ba);
}
test('Wave15 source roster adds 8 strictly vacant original D0 IDs, 269 canonical authored, 16 remaining',()=>{
 assert.deepEqual([historical.length,prior.length,fresh.length,all.length],[153,108,8,269]);
 assert.equal(ROADMAP_D_WAVE15_PLANS.length,8);assert.equal(ROADMAP_D_WAVE15_IDS.length,8);
 const expected=new Set(expectedIds()),priorIds=new Set([...historical,...prior].map(b=>b.id));
 for(const b of fresh){
  assert.ok(expected.has(b.id),'non-canonical slot '+b.id);
  assert.ok(!priorIds.has(b.id),'overwrites historical or previous original '+b.id);
  assert.equal(b.worldPlaced,false);assert.equal(b.integrated,false);assert.equal(b.creatorApproved,false);
  assert.equal(b.provenance.historicalSourcesUnchanged,true);
  assert.equal(b.provenance.notFinalArt,true);
  validateBlueprint(b);
 }
 assert.equal(new Set(all.map(b=>b.id)).size,269);
 assert.equal(new Set(all.map(geometrySignature)).size,269);
 assert.deepEqual(validateCollection(all),{authored:269,remaining:16,creatorApproved:0,integrated:0});
});
test('all 57 Wave15 rooms are walkable and original compiler voxels immutable; elevated crown cells physically supported',()=>{
 assert.equal(ROADMAP_D_WAVE15_PLANS.reduce((n,p)=>n+p.rooms.length,0),57);
 for(let i=0;i<fresh.length;i++){
  const b=fresh[i],p=ROADMAP_D_WAVE15_PLANS[i],base=buildDistinctive4B(p);
  const occupancy=new Map(b.cells.map(c=>[c.at.join(','),c]));
  assert.equal(occupancy.size,b.cells.length,'duplicate occupied coordinates '+b.id);
  const baseline=new Set();
  for(const c of base.cells){const id=c.at.join(',');baseline.add(id);assert.deepEqual(occupancy.get(id),c,'historical compiler voxels rewritten '+b.id)}
  const newCells=b.cells.filter(c=>!baseline.has(c.at.join(',')));
  assert.equal(newCells.length,b.provenance.physicalCrownCells);
  assert.ok(newCells.length>=50,'physical crown missing '+b.id);
  assert.ok(Math.max(...newCells.map(c=>c.at[1]))>=14,'source crown height missing '+b.id);
  for(const c of newCells){
   assert.ok(['column','trim'].includes(c.role),'unexpected tower role '+b.id);
   assert.ok(occupancy.has([c.at[0],c.at[1]-1,c.at[2]].join(',')),'unborne upper source crown '+b.id+' '+c.at);
  }
  assert.equal(b.spaces.length,p.rooms.length);
  assert.ok(b.openings.some(o=>o.kind==='entrance'));
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=20);
  const nav=new Set(b.navigation.map(n=>n.at.join(',')));
  for(const room of b.spaces)assert.ok(nav.has(room.access.join(',')),'unreachable room '+b.id+' '+room.kind);
  for(const [x,z] of p.holes||[])for(let y=0;y<8;y++)assert.ok(!occupancy.has([x,y,z].join(',')),'fake open skywell '+b.id);
  assert.ok(b.dependencies.length>0&&b.dependencies.every(d=>d.unresolved?.length>0),'unverified pack dependency silently approved '+b.id);
 }
});
test('every newly authored original D15 against protected 153 historical same type passes exact bidirectional D4',()=>{
 let n=0;
 for(const a of fresh)for(const b of historical)if(a.type===b.type){pair(a,b);n++}
 assert.equal(n,53,'historical W15 same-category census drift');
});
test('every new W15 original against 108 previous originals same type passes strict both-direction D4',()=>{
 let n=0;
 for(const a of fresh)for(const b of prior)if(a.type===b.type){pair(a,b);n++}
 assert.equal(n,290,'prior W1–14 W15 same-category census drift');
});
test('every same-type Wave15 peer pair passes D4 without identity or orientation exemption',()=>{
 let n=0;
 for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)if(fresh[i].type===fresh[j].type){pair(fresh[i],fresh[j]);n++}
 assert.equal(n,7,'Wave15 same-category new/new pair census drift');
 assert.equal(53+290+7,350,'W15 new source two-way D4 count');
 assert.equal(2570+350,2920,'full prior and new source strict D4 combined census');
});
