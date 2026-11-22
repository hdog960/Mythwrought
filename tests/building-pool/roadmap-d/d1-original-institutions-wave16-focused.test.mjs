// Builder D D16 focused native source tests. NEW-only 400 D4 comparison cases.
// Do NOT redundantly rerun the 2920 prior D4 source pairs in development iteration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {expectedIds,validateBlueprint,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {buildDistinctive4B} from '../../../src/building-pool/roadmap-4b/m2-distinctive.mjs';
import {ROADMAP_C_4B_153_ALL as historical} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
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
import {ROADMAP_D_WAVE15_BUILDINGS as W15} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave15.mjs';
import {ROADMAP_D_WAVE16_BUILDINGS,ROADMAP_D_WAVE16_PLANS,ROADMAP_D_WAVE16_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
const earlier=[...W1,...W2,...W3,...W4,...W5,...W6,...W7,...W8,...W9,...W10,...W11,...W12,...W13,...W14,...W15];
const fresh=ROADMAP_D_WAVE16_BUILDINGS;
const floorCache=new WeakMap();
function floor(b,transform){
 let cache=floorCache.get(b);if(!cache){cache=[];floorCache.set(b,cache)}
 if(cache[transform])return cache[transform];
 const points=b.cells.filter(c=>c.role==='floor').map(c=>{
  let [x,,z]=c.at;if(transform&1)x=-x;if(transform&2)[x,z]=[z,x];if(transform&4)z=-z;
  return [x,z];
 });
 assert.ok(points.length>50,'missing original authored floor '+b.id);
 let minx=Infinity,minz=Infinity;for(const [x,z] of points){minx=Math.min(minx,x);minz=Math.min(minz,z)}
 return cache[transform]=new Set(points.map(([x,z])=>(x-minx)+','+(z-minz)));
}
function d4(a,b){
 const fixed=floor(b,0);let worst=0;
 for(let t=0;t<8;t++){
  const moved=floor(a,t);let overlap=0;for(const q of moved)if(fixed.has(q))overlap++;
  worst=Math.max(worst,overlap/(fixed.size+moved.size-overlap));
 }
 return worst;
}
function strictPair(a,b){
 const ab=d4(a,b),ba=d4(b,a);
 assert.ok(ab<.89&&ba<.89,'Original same-category source clone '+a.id+' / '+b.id+' '+ab+' / '+ba);
}
test('D16 eight original unused D0 IDs preserve 153 historical +116 prior, 277 canonical and 8 still vacant',()=>{
 assert.equal(historical.length,153);assert.equal(earlier.length,116);
 assert.equal(fresh.length,8);assert.equal(ROADMAP_D_WAVE16_IDS.length,8);
 const owned=new Set([...historical,...earlier].map(b=>b.id)),canonical=new Set(expectedIds());
 assert.equal(owned.size,269);
 for(const b of fresh){
  assert.ok(canonical.has(b.id)&&!owned.has(b.id),'nonvacant canonical 4B slot '+b.id);
  assert.equal(b.worldPlaced,false);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
  assert.equal(b.provenance.liveIntegration,false);assert.equal(b.provenance.notFinalArt,true);
  validateBlueprint(b);
 }
 const all=[...owned,...fresh.map(b=>b.id)];assert.equal(new Set(all).size,277);
 assert.equal(canonical.size-all.length,8);
});
test('all 64 new D16 accessible rooms and all added graded roof/tower voxels have actual same-coordinate supports',()=>{
 assert.equal(ROADMAP_D_WAVE16_PLANS.reduce((n,p)=>n+p.rooms.length,0),64);
 const signatures=new Set();
 for(let i=0;i<fresh.length;i++){
  const p=ROADMAP_D_WAVE16_PLANS[i],b=fresh[i],base=buildDistinctive4B(p);
  const original=new Set(base.cells.map(c=>c.at.join(','))),occupied=new Map(b.cells.map(c=>[c.at.join(','),c]));
  assert.equal(occupied.size,b.cells.length,'overlapping source cells '+b.id);
  for(const c of base.cells)assert.deepEqual(occupied.get(c.at.join(',')),c,'original compiler source mutated '+b.id);
  const additions=b.cells.filter(c=>!original.has(c.at.join(',')));
  assert.equal(additions.length,b.provenance.originalElevatedCells);
  assert.ok(additions.length>=100&&Math.max(...additions.map(c=>c.at[1]))>=12);
  for(const c of additions){
    assert.ok(['roof','column','trim'].includes(c.role));
    assert.ok(occupied.has([c.at[0],c.at[1]-1,c.at[2]].join(',')),'unsupported elevated original roof '+b.id+' '+c.at);
  }
  assert.equal(b.spaces.length,p.rooms.length);
  assert.ok(b.openings.some(o=>o.kind==='entrance'));
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=20);
  const navigation=new Set(b.navigation.map(n=>n.at.join(',')));
  for(const room of b.spaces)assert.ok(navigation.has(room.access.join(',')),'unreachable D16 room '+b.id+' '+room.kind);
  for(const [x,z] of p.holes||[])for(let y=0;y<8;y++)assert.ok(!occupied.has([x,y,z].join(',')),'fake physical skywell '+b.id);
  assert.ok(b.dependencies.length>0&&b.dependencies.every(d=>d.unresolved?.length>0),'unapproved Manual Pack source family '+b.id);
  const fingerprint=geometrySignature(b);assert.ok(!signatures.has(fingerprint),'mutual same geometry '+b.id);signatures.add(fingerprint);
 }
});
test('all eight W16 originals against 153 protected historical same-type source blueprints: full two-direction D4',()=>{
 let pairs=0;for(const n of fresh)for(const p of historical)if(n.type===p.type){strictPair(n,p);pairs++}
 assert.equal(pairs,68,'protected historical school/research same-type comparison census drift');
});
test('all eight W16 originals against all 116 previous provisional same-type source blueprints: strict two-direction D4',()=>{
 let pairs=0;for(const n of fresh)for(const p of earlier)if(n.type===p.type){strictPair(n,p);pairs++}
 assert.equal(pairs,320,'D16 vs previous originals source comparison census drift');
});
test('all eight W16 new-new same-type pairs are original in both directions with no skipped geometry',()=>{
 let pairs=0;for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)if(fresh[i].type===fresh[j].type){strictPair(fresh[i],fresh[j]);pairs++}
 assert.equal(pairs,12);
 assert.equal(68+320+12,400,'W16 new strict D4 census');
 assert.equal(2570+350+400,3320,'cumulative strict source comparison census at 277/285');
});
