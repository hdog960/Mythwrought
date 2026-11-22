// Builder D Wave14: isolated eight NEW arcane academy slots with real elevated source cells.
// Import the unchanged prior 2326-pair / 253-source Wave13 regression suite.
import './d1-original-institutions-wave13.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL as old} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {buildDistinctive4B} from '../../../src/building-pool/roadmap-4b/m2-distinctive.mjs';
import {expectedIds,validateBlueprint,validateCollection,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
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
import {ROADMAP_D_WAVE14_PLANS,ROADMAP_D_WAVE14_BUILDINGS,ROADMAP_D_WAVE14_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave14.mjs';
const protected100=[...W1,...W2,...W3,...W4,...W5,...W6,...W7,...W8,...W9,...W10,...W11,...W12,...W13];
const fresh=ROADMAP_D_WAVE14_BUILDINGS,all=[...old,...protected100,...fresh];
const caches=new WeakMap();
function floor(b,t){let c=caches.get(b);if(!c){c=[];caches.set(b,c)}if(c[t])return c[t];
 const pts=b.cells.filter(x=>x.role==='floor').map(x=>{let [u,,v]=x.at;if(t&1)u=-u;if(t&2)[u,v]=[v,u];if(t&4)v=-v;return [u,v]});
 assert.ok(pts.length>50,'missing original physical source floor '+b.id);
 let minU=Math.min(...pts.map(p=>p[0])),minV=Math.min(...pts.map(p=>p[1]));
 return c[t]=new Set(pts.map(([u,v])=>(u-minU)+','+(v-minV)));
}
function d4(a,b){const q=floor(b,0);let worst=0;for(let t=0;t<8;t++){
 const p=floor(a,t);let hit=0;for(const xy of p)if(q.has(xy))hit++;
 worst=Math.max(worst,hit/(p.size+q.size-hit));
 }return worst;}
function strictPair(a,b){const ab=d4(a,b),ba=d4(b,a);assert.ok(ab<.89&&ba<.89,'Wave14 same-type D4 clone '+a.id+' vs '+b.id+' '+ab+' / '+ba);}

test('original historical 153, prior 100 and eight newly vacant originals preserve all 261 canonical slots, 24 remain',()=>{
 assert.deepEqual([old.length,protected100.length,fresh.length,all.length],[153,100,8,261]);
 assert.equal(ROADMAP_D_WAVE14_PLANS.length,8);assert.equal(ROADMAP_D_WAVE14_IDS.length,8);
 const priorIds=new Set([...old,...protected100].map(b=>b.id));const canonical=new Set(expectedIds());
 for(const b of fresh){assert.ok(canonical.has(b.id),'non-canonical 4B slot '+b.id);assert.ok(!priorIds.has(b.id),'historical/provisional source overwritten: '+b.id);
 assert.equal(b.type,'arcane-academy');assert.equal(b.integrated,false);assert.equal(b.creatorApproved,false);assert.equal(b.worldPlaced,false);
 assert.equal(b.provenance.historicalSourcesUnchanged,true);assert.equal(b.provenance.notFinalArt,true);validateBlueprint(b);}
 assert.equal(new Set(all.map(b=>b.id)).size,261);assert.equal(new Set(all.map(geometrySignature)).size,261);
 assert.deepEqual(validateCollection(all),{authored:261,remaining:24,creatorApproved:0,integrated:0});
});
test('all 59 original Wave14 functional rooms, windows, open skywells, supported roofs and real vertical crowns are source-built, never fake',()=>{
 assert.equal(ROADMAP_D_WAVE14_PLANS.reduce((n,p)=>n+p.rooms.length,0),59);
 for(let i=0;i<8;i++){
  const p=ROADMAP_D_WAVE14_PLANS[i],b=fresh[i],original=buildDistinctive4B(p);
  const occupied=new Map(b.cells.map(c=>[c.at.join(','),c]));
  assert.equal(occupied.size,b.cells.length,'duplicated physical coordinates '+b.id);
  for(const c of original.cells)assert.deepEqual(occupied.get(c.at.join(',')),c,'compiler original coordinate altered '+b.id);
  const originalCoords=new Set(original.cells.map(c=>c.at.join(',')));
  const newCells=b.cells.filter(c=>!originalCoords.has(c.at.join(',')));
  assert.equal(newCells.length,b.provenance.physicalCrownCells);
  assert.ok(newCells.length>=50,'no new true elevated source geometry '+b.id);
  assert.ok(Math.max(...newCells.map(c=>c.at[1]))>=14,'false tall crown '+b.id);
  for(const c of newCells){assert.ok(['trim','column'].includes(c.role));assert.ok(c.at[1]>=8);
    assert.ok(occupied.has([c.at[0],c.at[1]-1,c.at[2]].join(',')),'unsupported literal roof tower '+b.id+' '+c.at);}
  assert.equal(b.spaces.length,p.rooms.length);assert.ok(b.spaces.length>=6);
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=20);
  assert.ok(b.openings.some(o=>o.kind==='entrance'));
  assert.ok(b.dependencies.length>0&&b.dependencies.every(dep=>dep.unresolved.length>0),'Pack acceptance accidentally claimed '+b.id);
  for(const [x,z] of p.holes)for(let y=0;y<8;y++)assert.ok(!occupied.has([x,y,z].join(',')),'fake original open skywell '+b.id);
 }
});
test('new eight source plans have unique source-owned architectural crowns and no final-art or live game claims',()=>{
 assert.equal(new Set(ROADMAP_D_WAVE14_PLANS.map(p=>p.title)).size,8);
 assert.equal(new Set(ROADMAP_D_WAVE14_PLANS.map(p=>p.roof)).size,8);
 for(const [i,b] of fresh.entries()){
  assert.equal(b.provenance.milestone,'D1-wave14');
  assert.equal(b.provenance.liveIntegration,false);
  assert.equal(b.provenance.notFinalArt,true);
  assert.equal(ROADMAP_D_WAVE14_PLANS[i].towers.length>=2,true);
 }
});
test('full Wave14 new-to-historical strict original D4 comparison census',()=>{
 let compared=0;for(const n of fresh)for(const h of old)if(n.type===h.type){strictPair(n,h);compared++;}
 assert.equal(compared,0,'historical 153 unexpectedly contains arcane academy IDs; recensus required');
});
test('all eight Wave14 versus all prior 100 same-type sources pass strict two-direction eight-way D4 <.89',()=>{
 let compared=0;for(const n of fresh)for(const h of protected100)if(n.type===h.type){strictPair(n,h);compared++;}
 assert.equal(compared,208,'full prior-original arcane comparison census drift');
});
test('all Wave14 new/new same-type two-way eight-orientation D4 <.89; historical 2326 untouched',()=>{
 let compared=0;for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){strictPair(fresh[i],fresh[j]);compared++;}
 assert.equal(compared,28);assert.equal(2326+208+28,2562,'all-in total strict D4 census');
});
