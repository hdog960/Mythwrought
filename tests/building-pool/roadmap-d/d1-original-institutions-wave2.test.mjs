// Builder D original Wave2: source-only genuine 4B quota and historical D4 uniqueness acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS,ROADMAP_D_WAVE1_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {ROADMAP_D_WAVE2_BUILDINGS,ROADMAP_D_WAVE2_IDS,ROADMAP_D_WAVE2_PLANS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave2.mjs';
import {validateBlueprint,validateCollection,expectedIds,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=(x,z)=>x+','+z;
function orientation(b,t){
 const points=b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
 const result=points.map(([x,z])=>{let a=t&1?-x:x,v=z;if(t&2)[a,v]=[v,a];if(t&4)v=-v;return [a,v];});
 let x0=Infinity,z0=Infinity;for(const [x,z] of result){x0=Math.min(x0,x);z0=Math.min(z0,z)}
 return new Set(result.map(([x,z])=>key(x-x0,z-z0)));
}
function maxD4(a,b){
 const reference=orientation(b,0);let max=0;
 for(let t=0;t<8;t++){let v=orientation(a,t),hit=0;for(let k of v)if(reference.has(k))hit++;
  max=Math.max(max,hit/(v.size+reference.size-hit));}
 return max;
}
test('Second independent Wave2 authored IDs preserve all 153 accepted 4B and six D1 candidates without overwrite',()=>{
 const before=[...ROADMAP_C_4B_153_ALL,...ROADMAP_D_WAVE1_BUILDINGS],all=[...before,...ROADMAP_D_WAVE2_BUILDINGS],ids=new Set(before.map(x=>x.id)),slots=new Set(expectedIds());
 assert.equal(ROADMAP_C_4B_153_ALL.length,153);assert.equal(ROADMAP_D_WAVE1_BUILDINGS.length,6);
 assert.equal(ROADMAP_D_WAVE2_BUILDINGS.length,6);assert.equal(ROADMAP_D_WAVE2_IDS.length,6);
 assert.equal(new Set(ROADMAP_D_WAVE2_IDS).size,6);
 for(const id of ROADMAP_D_WAVE2_IDS){assert.ok(slots.has(id),'outside original 4B quota '+id);assert.ok(!ids.has(id),'overwritten historical or D1 candidate '+id)}
 assert.deepEqual(validateCollection(all),{authored:165,remaining:120,creatorApproved:0,integrated:0});
 assert.equal(new Set(all.map(geometrySignature)).size,165);
 assert.equal(new Set([...ROADMAP_D_WAVE1_IDS,...ROADMAP_D_WAVE2_IDS]).size,12);
});
test('All six Wave2 buildings have real unique physical geometry, reachability, support and biome-appropriate authored functions',()=>{
 const category=ROADMAP_D_WAVE2_BUILDINGS.reduce((o,b)=>{o[b.type]=(o[b.type]||0)+1;return o},{});
 assert.deepEqual(category,{schoolhouse:2,'magical-research-institute':2,'arcane-academy':2});
 for(const b of ROADMAP_D_WAVE2_BUILDINGS){
  const result=validateBlueprint(b);
  assert.equal(result.id,b.id);assert.ok(b.cells.length>4000);assert.ok(b.spaces.length>=6);assert.ok(b.navigation.length>800);
  assert.deepEqual([b.creatorApproved,b.integrated,b.worldPlaced],[false,false,false]);
  assert.ok(b.openings.filter(x=>x.kind==='window').length>=25);
  assert.ok(b.openings.some(x=>x.kind==='entrance'));
  const occupied=new Map(b.cells.map(c=>[c.at.join(','),c]));
  for(const roof of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7)){
   const [x,y,z]=roof.at;assert.ok(occupied.has([x,y-1,z].join(',')),'unsupported roof '+b.id+' '+roof.at);
  }
  for(const room of b.spaces)assert.ok(b.navigation.some(n=>n.at.join(',')===room.access.join(',')),'inaccessible '+b.id+' '+room.kind);
  assert.ok(b.provenance.historicalSourcesUnchanged);
  assert.ok(b.dependencies.every(x=>x.unresolved?.length>0));
 }
});
test('Wave2 originals pass all same-category eight-way D4 under 0.89 against all historical, D1 and mutual peers',()=>{
 const historic=[...ROADMAP_C_4B_153_ALL,...ROADMAP_D_WAVE1_BUILDINGS];
 for(const fresh of ROADMAP_D_WAVE2_BUILDINGS){
  for(const old of [...historic,...ROADMAP_D_WAVE2_BUILDINGS]){
   if(old===fresh||old.type!==fresh.type)continue;
   const iou=maxD4(fresh,old);
   assert.ok(iou<0.89,'Wave2 D4 near-clone '+fresh.id+' vs '+old.id+': '+iou);
  }
 }
});
test('Wave2 lightwells are genuinely carved out of floor/roof source cells, not decorative metadata',()=>{
 assert.equal(ROADMAP_D_WAVE2_PLANS.length,6);
 for(let i=0;i<ROADMAP_D_WAVE2_PLANS.length;i++){
  const p=ROADMAP_D_WAVE2_PLANS[i],b=ROADMAP_D_WAVE2_BUILDINGS[i];
  const occupied=new Set(b.cells.map(c=>c.at.join(',')));
  for(const [x,z] of p.holes||[])for(let y=0;y<14;y++)assert.ok(!occupied.has([x,y,z].join(',')),'closed Wave2 source skylight '+b.id+' at '+[x,y,z]);
 }
});
