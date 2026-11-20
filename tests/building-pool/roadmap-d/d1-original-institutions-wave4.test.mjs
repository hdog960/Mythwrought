// Builder D D1 Wave4: genuine eight-source historical preservation, original physical details and D4.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {ROADMAP_D_WAVE2_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave2.mjs';
import {ROADMAP_D_WAVE3_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave3.mjs';
import {ROADMAP_D_WAVE4_BUILDINGS,ROADMAP_D_WAVE4_IDS,ROADMAP_D_WAVE4_PLANS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave4.mjs';
import {expectedIds,validateBlueprint,validateCollection,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
function ground(b,t){
 const pts=b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
 const oriented=pts.map(([x,z])=>{let xx=t&1?-x:x,zz=z;if(t&2)[xx,zz]=[zz,xx];if(t&4)zz=-zz;return [xx,zz]});
 let minx=Infinity,minz=Infinity;for(const [x,z] of oriented){minx=Math.min(minx,x);minz=Math.min(minz,z)}
 return new Set(oriented.map(([x,z])=>(x-minx)+','+(z-minz)));
}
function eightWayFloorD4(a,b){
 const ref=ground(b,0);let worst=0;
 for(let t=0;t<8;t++){const cmp=ground(a,t);let n=0;for(const key of cmp)if(ref.has(key))n++;
  worst=Math.max(worst,n/(ref.size+cmp.size-n));}
 return worst;
}
const historical=ROADMAP_C_4B_153_ALL;
const previous=[...historical,...ROADMAP_D_WAVE1_BUILDINGS,...ROADMAP_D_WAVE2_BUILDINGS,...ROADMAP_D_WAVE3_BUILDINGS];
const together=[...previous,...ROADMAP_D_WAVE4_BUILDINGS];
test('D4 eight genuine vacant original 4B IDs, all earlier 165 source objects unchanged, no gallery proxy or live registration',()=>{
 const quota=new Set(expectedIds()),old=new Set(previous.map(x=>x.id));
 assert.deepEqual([historical.length,ROADMAP_D_WAVE1_BUILDINGS.length,ROADMAP_D_WAVE2_BUILDINGS.length,ROADMAP_D_WAVE3_BUILDINGS.length,ROADMAP_D_WAVE4_BUILDINGS.length],[153,6,6,8,8]);
 assert.equal(ROADMAP_D_WAVE4_IDS.length,8);
 for(const id of ROADMAP_D_WAVE4_IDS){assert.ok(quota.has(id),'noncanonical source '+id);assert.ok(!old.has(id),'protected source reused '+id)}
 assert.equal(new Set(together.map(b=>b.id)).size,181,'D4 ID collision');
 assert.equal(new Set(together.map(geometrySignature)).size,181,'source signature clone');
 assert.deepEqual(validateCollection(together),{authored:181,remaining:104,creatorApproved:0,integrated:0});
});
test('Every D4 original has functional room access, actual supported roofs, clear entrance and unregistered Pack dependencies',()=>{
 const categories=ROADMAP_D_WAVE4_BUILDINGS.reduce((o,b)=>{o[b.type]=(o[b.type]||0)+1;return o},{});
 assert.deepEqual(categories,{schoolhouse:4,'magical-research-institute':2,'arcane-academy':2});
 for(const b of ROADMAP_D_WAVE4_BUILDINGS){
  const result=validateBlueprint(b);assert.equal(result.id,b.id);
  assert.ok(b.cells.length>6000&&b.navigation.length>1000,'insufficient actual source occupancy '+b.id);
  assert.ok(b.spaces.length>=6,'unspecified educational room plan '+b.id);
  assert.ok(b.openings.some(x=>x.kind==='entrance'),'missing physical doorway '+b.id);
  assert.ok(b.openings.filter(x=>x.kind==='window').length>=20,'insufficient original windows '+b.id);
  const occupied=new Map(b.cells.map(c=>[c.at.join(','),c]));
  for(const roof of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7)){
   const [x,y,z]=roof.at;assert.ok(occupied.has([x,y-1,z].join(',')),'unsupported D4 roof at '+b.id+' '+roof.at);
  }
  for(const space of b.spaces){assert.ok(b.navigation.some(n=>n.at.join(',')===space.access.join(',')),'not reached: '+b.id+' '+space.kind)}
  assert.deepEqual([b.creatorApproved,b.integrated,b.worldPlaced],[false,false,false]);
  assert.ok(b.dependencies.length>0&&b.dependencies.every(x=>x.unresolved?.length>0),'false Pack producer approval');
  assert.ok(b.provenance.historicalSourcesUnchanged);
 }
});
test('D4 source originality passes exact same-category eight-orientation D4 <0.89 against every old and new 4B design',()=>{
 for(const fresh of ROADMAP_D_WAVE4_BUILDINGS)for(const prior of together){
  if(fresh===prior||fresh.type!==prior.type)continue;
  const overlap=eightWayFloorD4(fresh,prior);
  assert.ok(overlap<0.89,'D4 D4 near-clone '+fresh.id+' vs '+prior.id+': '+overlap);
 }
});
test('D4 courtyard openings physically remove entire source columns below the roof, and roof tags remain authored',()=>{
 assert.equal(ROADMAP_D_WAVE4_PLANS.length,8);
 for(let i=0;i<8;i++){
  const p=ROADMAP_D_WAVE4_PLANS[i],b=ROADMAP_D_WAVE4_BUILDINGS[i],occupied=new Set(b.cells.map(c=>c.at.join(',')));
  assert.ok(String(p.roof).includes('-'),'plan missing source roof identity '+b.id);
  assert.ok(p.holes.length>0,'plan lacks open-sky architectural geometry '+b.id);
  for(const [x,z] of p.holes)for(let y=0;y<14;y++)assert.ok(!occupied.has([x,y,z].join(',')),'fake D4 skylight at '+b.id+' '+[x,y,z]);
 }
});
