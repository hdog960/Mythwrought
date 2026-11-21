// Builder D Wave8: 153 historical + 60 newly original blueprints, zero live integration.
// Important: original D5 bidirectional IoU test remains unchanged and still executes separately.
// This extends it to Wave8 with full 213 source objects, BOTH directions of 8-way D4.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {ROADMAP_D_WAVE2_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave2.mjs';
import {ROADMAP_D_WAVE3_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave3.mjs';
import {ROADMAP_D_WAVE4_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave4.mjs';
import {ROADMAP_D_WAVE5_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave5.mjs';
import {ROADMAP_D_WAVE6_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave6.mjs';
import {ROADMAP_D_WAVE7_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave7.mjs';
import {ROADMAP_D_WAVE8_BUILDINGS,ROADMAP_D_WAVE8_IDS,ROADMAP_D_WAVE8_PLANS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave8.mjs';
import {validateCollection,validateBlueprint,expectedIds,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const old=ROADMAP_C_4B_153_ALL;
const firstSeven=[...ROADMAP_D_WAVE1_BUILDINGS,...ROADMAP_D_WAVE2_BUILDINGS,
 ...ROADMAP_D_WAVE3_BUILDINGS,...ROADMAP_D_WAVE4_BUILDINGS,...ROADMAP_D_WAVE5_BUILDINGS,...ROADMAP_D_WAVE6_BUILDINGS,...ROADMAP_D_WAVE7_BUILDINGS];
const fresh=[...firstSeven,...ROADMAP_D_WAVE8_BUILDINGS];
const all=[...old,...fresh];
const cache=new WeakMap();
function floor(b,t){
 let a=cache.get(b);if(!a){a=[];cache.set(b,a)}if(a[t])return a[t];
 const raw=b.cells.filter(c=>c.role==='floor').map(c=>{
  const x=c.at[0],z=c.at[2];let u=t&1?-x:x,v=z;if(t&2)[u,v]=[v,u];if(t&4)v=-v;
  return [u,v];
 });
 assert.ok(raw.length>50,'missing original floor geometry '+b.id);
 let minx=Infinity,minz=Infinity;for(const [x,z] of raw){minx=Math.min(minx,x);minz=Math.min(minz,z)}
 return a[t]=new Set(raw.map(([x,z])=>(x-minx)+','+(z-minz)));
}
function eightD4(a,b){
 const other=floor(b,0);let high=0;
 for(let t=0;t<8;t++){const p=floor(a,t);let hit=0;for(const k of p)if(other.has(k))hit++;
  high=Math.max(high,hit/(p.size+other.size-hit));}
 return high;
}
test('original 153 historical 4B + 6 + 6 + 8 + 8 + 8 + 8 + 8 + 8 = 213 canonical source identities untouched, 72 vacant',()=>{
 assert.deepEqual([old.length,ROADMAP_D_WAVE1_BUILDINGS.length,ROADMAP_D_WAVE2_BUILDINGS.length,
 ROADMAP_D_WAVE3_BUILDINGS.length,ROADMAP_D_WAVE4_BUILDINGS.length,ROADMAP_D_WAVE5_BUILDINGS.length,ROADMAP_D_WAVE6_BUILDINGS.length,ROADMAP_D_WAVE7_BUILDINGS.length,
 ROADMAP_D_WAVE8_BUILDINGS.length],[153,6,6,8,8,8,8,8,8]);
 assert.equal(all.length,213);
 const slots=new Set(expectedIds());const original=new Set([...old,...firstSeven].map(b=>b.id));
 for(const b of ROADMAP_D_WAVE8_BUILDINGS){assert.ok(slots.has(b.id),'not canonical vacant original ID: '+b.id);
  assert.ok(!original.has(b.id),'existing protected ID overwritten: '+b.id);
  assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.provenance.historicalSourcesUnchanged,true);validateBlueprint(b);}
 assert.equal(new Set(all.map(b=>b.id)).size,213,'collision in 213 ID source roster');
 assert.equal(new Set(all.map(geometrySignature)).size,213,'duplicate physical geometry');
 assert.deepEqual(validateCollection(all),{authored:213,remaining:72,creatorApproved:0,integrated:0});
});
test('all Wave8 source structures have real roof supports, entered navigation, six-plus rooms, meaningful window and skylight openings',()=>{
 assert.equal(ROADMAP_D_WAVE8_IDS.length,8);assert.equal(ROADMAP_D_WAVE8_PLANS.length,8);
 const quota=ROADMAP_D_WAVE8_BUILDINGS.reduce((o,b)=>{o[b.type]=(o[b.type]||0)+1;return o},{});
 assert.deepEqual(quota,{schoolhouse:3,'magical-research-institute':3,'arcane-academy':2});
 for(let i=0;i<8;i++){
  const b=ROADMAP_D_WAVE8_BUILDINGS[i],plan=ROADMAP_D_WAVE8_PLANS[i];
  assert.ok(b.cells.length>9000&&b.navigation.length>2000,'underspecified original source '+b.id);
  assert.ok(b.spaces.length>=6,'missing real teaching or research rooms '+b.id);
  assert.ok(b.openings.some(o=>o.kind==='entrance'),'missing real entrance '+b.id);
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=20,'missing genuine windows '+b.id);
  const cells=new Set(b.cells.map(c=>c.at.join(','))),nav=new Set(b.navigation.map(n=>n.at.join(',')));
  for(const r of b.spaces)assert.ok(nav.has(r.access.join(',')),'inaccessible original room '+b.id+' '+r.kind);
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7)){
   const [x,y,z]=c.at;assert.ok(cells.has([x,y-1,z].join(',')),'unsupported real roof '+b.id+' '+c.at);
  }
  assert.ok(plan.holes.length>=1,'original source lacks real sky well '+b.id);
  for(const [x,z] of plan.holes)for(let y=0;y<14;y++)assert.ok(!cells.has([x,y,z].join(',')),'fake source-carved skywell '+b.id+' '+[x,y,z]);
  assert.ok(b.dependencies.length>0&&b.dependencies.every(x=>x.unresolved?.length>0),'falsely approved physical pack dependency '+b.id);
 }
});
test('all 60 new sources satisfy historical 153-source original bidirectional eight-way D4 <0.89',()=>{
 let compared=0;
 for(const n of fresh)for(const h of old)if(n.type===h.type){
  const a=eightD4(n,h),b=eightD4(h,n);compared++;
  assert.ok(a<0.89&&b<0.89,'historical clone '+n.id+' vs '+h.id+': '+a+'/'+b);
 }
 assert.equal(compared,403,'full historical same-category comparison census drift');
});
test('all 60 new originals are unique under 8 floor orientations in BOTH directions, without exemptions',()=>{
 let compared=0;
 for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)if(fresh[i].type===fresh[j].type){
  const a=eightD4(fresh[i],fresh[j]),b=eightD4(fresh[j],fresh[i]);compared++;
  assert.ok(a<0.89&&b<0.89,'cross-wave duplicate '+fresh[i].id+' vs '+fresh[j].id+': '+a+'/'+b);
 }
 assert.equal(compared,583,'full 60-source same-category comparison census drift');
});
test('historically proven Pinewater and Whitepine reverse-IoU regression pairs remain repaired at <0.85',()=>{
 const map=new Map(all.map(b=>[b.id,b]));
 for(const [i,j] of [['r4:schoolhouse:enchanted-forest:large:02','r4:schoolhouse:temperate:large:02'],
                    ['r4:schoolhouse:mountain:small:02','r4:schoolhouse:snow:small:02']]){
  const a=map.get(i),b=map.get(j);assert.ok(a&&b,'historical source regression missing');
  assert.ok(eightD4(a,b)<0.85&&eightD4(b,a)<0.85,'old reverse-IOU leak returned '+i+' '+j);
 }
});
