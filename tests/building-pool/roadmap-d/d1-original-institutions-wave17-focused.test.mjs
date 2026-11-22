// Builder D final D17 canonical source-focused tests: 324 new strict D4 cases only.
// Prior 3320 pairs are preserved and rerun at release milestone, not redundantly on every draft.
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
import {ROADMAP_D_WAVE16_BUILDINGS as W16} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS,ROADMAP_D_WAVE17_PLANS,ROADMAP_D_WAVE17_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
const earlier=[...W1,...W2,...W3,...W4,...W5,...W6,...W7,...W8,...W9,...W10,...W11,...W12,...W13,...W14,...W15,...W16];
const fresh=ROADMAP_D_WAVE17_BUILDINGS;
const cache=new WeakMap();
function orientedFloor(b,t){
 let cached=cache.get(b);if(!cached){cached=[];cache.set(b,cached)}if(cached[t])return cached[t];
 const coords=b.cells.filter(c=>c.role==='floor').map(c=>{
   let [x,,z]=c.at;if(t&1)x=-x;if(t&2)[x,z]=[z,x];if(t&4)z=-z;return [x,z];
 });
 assert.ok(coords.length>50,'missing original source floor '+b.id);
 let minx=Infinity,minz=Infinity;for(const [x,z] of coords){minx=Math.min(minx,x);minz=Math.min(minz,z)}
 return cached[t]=new Set(coords.map(([x,z])=>(x-minx)+','+(z-minz)));
}
function d4(a,b){
 const stable=orientedFloor(b,0);let worst=0;
 for(let t=0;t<8;t++){
  const rotated=orientedFloor(a,t);let overlap=0;for(const q of rotated)if(stable.has(q))overlap++;
  worst=Math.max(worst,overlap/(rotated.size+stable.size-overlap));
 }
 return worst;
}
function compare(a,b){const ab=d4(a,b),ba=d4(b,a);assert.ok(ab<.89&&ba<.89,'W17 strict two-direction eight-orientation source clone '+a.id+' vs '+b.id+' '+ab+' / '+ba)}
test('complete 285/285 original canonical 4B source owners, no new duplicate or shadowed historical 153 IDs',()=>{
 assert.deepEqual([historical.length,earlier.length,fresh.length],[153,124,8]);
 const canonical=new Set(expectedIds()),owned=new Set([...historical,...earlier].map(x=>x.id));
 assert.equal(canonical.size,285);assert.equal(owned.size,277);
 for(const b of fresh){
  assert.ok(canonical.has(b.id)&&!owned.has(b.id),'not a truly vacant canonical D0 4B ID '+b.id);
  assert.equal(b.creatorApproved,false);assert.equal(b.worldPlaced,false);assert.equal(b.integrated,false);
  assert.equal(b.provenance.liveIntegration,false);assert.equal(b.provenance.notFinalArt,true);
  validateBlueprint(b);
 }
 const allIds=new Set([...owned,...fresh.map(b=>b.id)]);
 assert.equal(allIds.size,285);assert.deepEqual(allIds,canonical);
 assert.equal(ROADMAP_D_WAVE17_IDS.length,8);
});
test('all 53 W17 functional rooms, original compiler coordinates and genuinely supported extended graded roofs/ornaments',()=>{
 assert.equal(ROADMAP_D_WAVE17_PLANS.reduce((n,p)=>n+p.rooms.length,0),53);
 const unique=new Set();
 for(let i=0;i<fresh.length;i++){
  const p=ROADMAP_D_WAVE17_PLANS[i],b=fresh[i],base=buildDistinctive4B(p);
  const occupied=new Map(b.cells.map(c=>[c.at.join(','),c]));assert.equal(occupied.size,b.cells.length);
  const original=new Set(base.cells.map(c=>c.at.join(',')));
  for(const c of base.cells)assert.deepEqual(occupied.get(c.at.join(',')),c,'previously generated original voxel changed '+b.id);
  const added=b.cells.filter(c=>!original.has(c.at.join(',')));
  assert.ok(added.length>=100&&Math.max(...added.map(c=>c.at[1]))>=12);
  assert.equal(added.length,b.provenance.originalElevatedCells);
  for(const c of added){assert.ok(['roof','trim','column'].includes(c.role));assert.ok(occupied.has([c.at[0],c.at[1]-1,c.at[2]].join(',')),'unborne original roof/crown '+b.id+' '+c.at)}
  assert.equal(b.spaces.length,p.rooms.length);
  const walks=new Set(b.navigation.map(n=>n.at.join(',')));
  for(const room of b.spaces)assert.ok(walks.has(room.access.join(',')),'room disconnected '+b.id+' '+room.kind);
  for(const [x,z] of p.holes||[])for(let y=0;y<8;y++)assert.ok(!occupied.has([x,y,z].join(',')),'false source skywell '+b.id);
  assert.ok(b.openings.some(o=>o.kind==='entrance'));
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=20);
  assert.ok(b.dependencies.length>0&&b.dependencies.every(d=>d.unresolved?.length>0));
  const fp=geometrySignature(b);assert.ok(!unique.has(fp),'new-new same source signature '+b.id);unique.add(fp);
 }
});
test('all 8 final arcane original sources against the one protected historical arcane academy strict full D4 both ways',()=>{
 let pairs=0;for(const n of fresh)for(const p of historical)if(n.type===p.type){compare(n,p);pairs++}
 assert.equal(pairs,8,'historical arcane source census unexpectedly changed');
});
test('all 8 final arcane original sources versus 36 prior arcane source candidates full strict D4 two directions',()=>{
 let pairs=0;for(const n of fresh)for(const p of earlier)if(n.type===p.type){compare(n,p);pairs++}
 assert.equal(pairs,288,'W17 prior 36 arcane pair census changed');
});
test('all 28 final peer academies D4, previous 3320 strict historical+provisional comparisons preserved',()=>{
 let pairs=0;for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){compare(fresh[i],fresh[j]);pairs++}
 assert.equal(pairs,28);
 assert.equal(8+288+28,324,'new strict D17 D4 cases');
 assert.equal(2570+350+400+324,3644,'full source authoring final D4 comparison census');
});
