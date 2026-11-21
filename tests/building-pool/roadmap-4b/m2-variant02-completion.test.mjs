// Builder 4B M2: ten hand-authored variant-02 biome/size completions.
// This asserts real source coordinates; all creative asset dependencies remain provisional.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT02_COMPLETION,M2_63_ALL,M2_63_CENSUS,M2_VARIANT02_COMPLETION_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant02-completion.mjs';
import {M2_53_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant02-expansion.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=x=>x.join(',');
const getFootprint=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const normalized=(points,t)=>{
 const tr=points.map(([x,z])=>{
  let a=t&1?-x:x,b=z;
  if(t&2)[a,b]=[b,a];
  if(t&4)b=-b;
  return [a,b];
 });
 const mx=Math.min(...tr.map(p=>p[0])),mz=Math.min(...tr.map(p=>p[1]));
 return new Set(tr.map(([x,z])=>(x-mx)+','+(z-mz)));
};
const maxD4Jaccard=(left,right)=>{
 const a=getFootprint(left),b=normalized(getFootprint(right),0);
 let greatest=0;
 for(let t=0;t<8;t++){
  const s=normalized(a,t);let intersection=0;
  for(const key of s)if(b.has(key))intersection++;
  greatest=Math.max(greatest,intersection/(s.size+b.size-intersection));
 }
 return greatest;
};
test('full 63 original models: preserve previous 53, two truly independent variants for every regional healer/library size',()=>{
 assert.equal(M2_VARIANT02_COMPLETION.length,10);
 assert.equal(new Set(M2_VARIANT02_COMPLETION_NAMES).size,10);
 assert.equal(M2_63_ALL.length,63);
 assert.equal(M2_63_CENSUS.authored,63);assert.equal(M2_63_CENSUS.remaining,222);
 assert.equal(M2_63_CENSUS.healers,30);assert.equal(M2_63_CENSUS.libraries,30);
 assert.equal(M2_63_CENSUS.creatorApproved,0);assert.equal(M2_63_CENSUS.integrated,0);
 assert.equal(new Set(M2_63_ALL.map(geometrySignature)).size,63);
 assert.deepEqual(validateCollection(M2_63_ALL),{authored:63,remaining:222,creatorApproved:0,integrated:0});
 for(let i=0;i<53;i++)assert.equal(M2_63_ALL[i],M2_53_ALL[i]);
 for(const category of ['healers-house','library'])
   for(const biome of BIOMES)for(const size of SIZES){
     const here=M2_63_ALL.filter(b=>b.type===category&&b.biome===biome&&b.size===size);
     assert.equal(here.length,2,category+' '+biome+' '+size+' must contain original 01 and independent 02');
     assert.deepEqual(here.map(b=>b.variant).sort(),[1,2]);
   }
 for(const b of M2_VARIANT02_COMPLETION){
   assert.ok(expectedIds().includes(b.id));assert.match(b.id,/:02$/);
   assert.equal(b.variant,2);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
 }
});
for(const b of M2_VARIANT02_COMPLETION)test(b.id+': physically coordinate-authored roof, navigable rooms and open two-cell door access',()=>{
 const report=validateBlueprint(b);
 assert.equal(report.id,b.id);
 assert.ok(b.cells.length>1000);
 assert.ok(b.navigation.length>=150);
 assert.ok(b.spaces.length>=4);
 const occupied=new Map(b.cells.map(c=>[key(c.at),c]));
 const navigable=new Set(b.navigation.map(n=>key(n.at)));
 const floors=b.cells.filter(c=>c.role==='floor');
 const foundations=b.cells.filter(c=>c.role==='foundation');
 const weather=b.cells.filter(c=>c.role==='roof'&&c.at[1]===7);
 assert.equal(floors.length,foundations.length);
 assert.equal(floors.length,weather.length);
 for(const c of floors)assert.equal(occupied.get(key([c.at[0],7,c.at[2]]))?.role,'roof','roof leak');
 assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===10));
 for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7))
   assert.ok(occupied.has(key([c.at[0],c.at[1]-1,c.at[2]])),'unsupported roof mass');
 assert.ok(b.openings.some(o=>o.kind==='door'),'actual interior doorway missing');
 for(const o of b.openings.filter(o=>o.kind!=='window')){
   assert.ok(navigable.has(key(o.at)),'inaccessible aperture');
   assert.ok(!occupied.has(key(o.at)));
   assert.ok(!occupied.has(key([o.at[0],o.at[1]+1,o.at[2]])),'obstructed door head');
 }
 for(const room of b.spaces){
   assert.ok(room.footprint.length>=4);
   assert.ok(navigable.has(key(room.access)));
   for(const [x,z] of room.footprint){
     assert.equal(occupied.get(key([x,1,z]))?.role,'floor');
     assert.ok(!occupied.has(key([x,2,z]))&&!occupied.has(key([x,3,z])));
   }
 }
 assert.deepEqual([...new Set(b.dependencies.map(d=>d.ref))].sort(),['pack4:030','pack4:058','pack4:059']);
 assert.ok(b.dependencies.every(d=>d.status==='catalog-provisional'&&d.unresolved.length>=2));
 assert.ok(b.features.every(f=>f.active===false));
 assert.equal(b.worldPlaced,false);
});
test('true sky-light courtyards, rounded regional pavilions and no D4 near-duplicates at footprint Jaccard >= 0.89',()=>{
 const courtyard=M2_VARIANT02_COMPLETION.find(b=>b.provenance.originalPlan==='Sirocco Twin-Courtyard Archive');
 assert.ok(courtyard);
 for(const [x,z] of [[13,17],[27,17]])
   assert.ok(!courtyard.cells.some(c=>c.at[0]===x&&c.at[2]===z),'courtyard sealed');
 const circular=M2_VARIANT02_COMPLETION.filter(b=>/Dual-Round|Round Reading|Round Archive|Greenhush|Moonpetal/.test(b.provenance.originalPlan));
 assert.ok(circular.length>=4);
 for(let i=0;i<M2_VARIANT02_COMPLETION.length;i++){
   const b=M2_VARIANT02_COMPLETION[i];
   for(const other of M2_63_ALL){
     if(b.id===other.id)continue;
     assert.ok(maxD4Jaccard(b,other)<0.89,
       b.id+' near-duplicate of '+other.id+' normalized footprint Jaccard='+maxD4Jaccard(b,other).toFixed(4));
   }
 }
});
