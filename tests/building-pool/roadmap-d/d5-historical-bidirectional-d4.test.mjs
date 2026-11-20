// Mythwrought Builder D historical hardening: bidirectional eight-way occupied-floor D4.
// Do not relax the old one-direction <0.89 tests. Enforce BOTH directions across every
// same-type pair from 153 protected source objects and all 36 newly authored D1-D5 candidates.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {ROADMAP_D_WAVE2_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave2.mjs';
import {ROADMAP_D_WAVE3_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave3.mjs';
import {ROADMAP_D_WAVE4_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave4.mjs';
import {ROADMAP_D_WAVE5_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave5.mjs';
import {validateCollection,geometrySignature,validateBlueprint,expectedIds} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const old=ROADMAP_C_4B_153_ALL, fresh=[...ROADMAP_D_WAVE1_BUILDINGS,...ROADMAP_D_WAVE2_BUILDINGS,
 ...ROADMAP_D_WAVE3_BUILDINGS,...ROADMAP_D_WAVE4_BUILDINGS,...ROADMAP_D_WAVE5_BUILDINGS];
const all=[...old,...fresh];
const cache=new WeakMap();
function sourceFloor(b,orient){
 let views=cache.get(b);if(!views){views=[];cache.set(b,views)}
 if(views[orient])return views[orient];
 const transform=b.cells.filter(c=>c.role==='floor').map(c=>{
  const x=c.at[0],z=c.at[2];let a=orient&1?-x:x,v=z;
  if(orient&2)[a,v]=[v,a];if(orient&4)v=-v;
  return [a,v];
 });
 assert.ok(transform.length>50,'missing original source-floor coordinates '+b.id);
 let x0=Infinity,z0=Infinity;for(const [x,z] of transform){x0=Math.min(x0,x);z0=Math.min(z0,z)}
 const result=new Set(transform.map(([x,z])=>(x-x0)+','+(z-z0)));
 views[orient]=result;return result;
}
function maxD4(a,b){
 const target=sourceFloor(b,0);let worst=0;
 for(let t=0;t<8;t++){
  const v=sourceFloor(a,t);let hit=0;for(const key of v)if(target.has(key))hit++;
  const score=hit/(v.size+target.size-hit);assert.ok(Number.isFinite(score));
  worst=Math.max(worst,score);
 }
 return worst;
}
function bidirectional(a,b){return Math.max(maxD4(a,b),maxD4(b,a))}
test('source-canonical 153 protected and exactly 36 distinct D1-D5 candidates, 189/285, no production',()=>{
 assert.deepEqual([old.length,ROADMAP_D_WAVE1_BUILDINGS.length,ROADMAP_D_WAVE2_BUILDINGS.length,
  ROADMAP_D_WAVE3_BUILDINGS.length,ROADMAP_D_WAVE4_BUILDINGS.length,ROADMAP_D_WAVE5_BUILDINGS.length],
 [153,6,6,8,8,8]);
 const ids=all.map(x=>x.id),slots=new Set(expectedIds());assert.equal(new Set(ids).size,189);
 assert.equal(new Set(all.map(geometrySignature)).size,189);
 for(const n of fresh){assert.ok(slots.has(n.id),'noncanonical 4B ID '+n.id);validateBlueprint(n);
  assert.deepEqual([n.creatorApproved,n.integrated,n.worldPlaced],[false,false,false]);
  assert.ok(n.provenance.historicalSourcesUnchanged);}
 assert.deepEqual(validateCollection(all),{authored:189,remaining:96,creatorApproved:0,integrated:0});
});
test('full 153-object historical roster versus every D1–D5 original of the same category: BOTH directions of strict D4 <0.89',()=>{
 let compared=0;
 for(const n of fresh)for(const h of old)if(n.type===h.type){
  const a=maxD4(n,h),b=maxD4(h,n);compared++;
  assert.ok(a<0.89&&b<0.89,'historical eight-way source IoU: '+n.id+' vs '+h.id+' fresh→history '+a+' history→fresh '+b);
 }
 assert.ok(compared>=244,'unexpected omission of historical same-category comparisons: '+compared);
});
test('all 36 newly authored originals are distinct from each other in BOTH D4 directions (never mirrored near-clones)',()=>{
 let compared=0;
 for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)if(fresh[i].type===fresh[j].type){
  const a=maxD4(fresh[i],fresh[j]),b=maxD4(fresh[j],fresh[i]);compared++;
  assert.ok(a<0.89&&b<0.89,'new-source eight-way IoU: '+fresh[i].id+' vs '+fresh[j].id+' '+a+' '+b);
 }
 assert.ok(compared>=202,'unexpected omission of new same-category comparison: '+compared);
});
test('proven independent Luminbough/Pinewater and Cliffstep/Whitepine original-geometry regression fixtures remain below 0.85 both ways',()=>{
 const byId=new Map(all.map(b=>[b.id,b]));
 const guards=[
  ['r4:schoolhouse:enchanted-forest:large:02','r4:schoolhouse:temperate:large:02'],
  ['r4:schoolhouse:mountain:small:02','r4:schoolhouse:snow:small:02']
 ];
 for(const [a,b] of guards){assert.ok(byId.has(a)&&byId.has(b),'regression fixture missing '+a+' '+b);
  const ab=maxD4(byId.get(a),byId.get(b)),ba=maxD4(byId.get(b),byId.get(a));
  assert.ok(ab<0.85&&ba<0.85,'repaired physical near-clone reappeared '+a+' vs '+b+' '+ab+' / '+ba);
 }
});
