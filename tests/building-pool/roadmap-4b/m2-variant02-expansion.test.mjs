// Builder 4B: ten additional author-drawn variant-02 buildings, no inherited side effects.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT02_EXPANSION,M2_53_ALL,M2_53_CENSUS,M2_VARIANT02_EXPANSION_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant02-expansion.mjs';
import {M2_43_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant02.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=a=>a.join(',');
test('ten original variant-02 structures complete remaining five biome-size combinations per category and preserve all 43 earlier IDs',()=>{
 assert.equal(M2_VARIANT02_EXPANSION.length,10);
 assert.equal(M2_53_CENSUS.authored,53);
 assert.equal(M2_53_CENSUS.remaining,232);
 assert.equal(M2_53_CENSUS.healers,25);
 assert.equal(M2_53_CENSUS.libraries,25);
 assert.equal(M2_53_CENSUS.creatorApproved,0);assert.equal(M2_53_CENSUS.integrated,0);
 assert.equal(M2_53_CENSUS.fingerprints,53);
 assert.equal(new Set(M2_VARIANT02_EXPANSION_NAMES).size,10);
 assert.deepEqual(validateCollection(M2_53_ALL),{authored:53,remaining:232,creatorApproved:0,integrated:0});
 for(let i=0;i<43;i++)assert.equal(M2_53_ALL[i],M2_43_ALL[i]);
 for(const b of M2_VARIANT02_EXPANSION){
  assert.ok(expectedIds().includes(b.id));
  assert.equal(b.variant,2);
  assert.match(b.id,/:02$/);
 }
 for(const type of ['healers-house','library']){
   for(const biome of BIOMES)for(const size of SIZES){
     assert.equal(M2_53_ALL.filter(x=>x.type===type&&x.biome===biome&&x.size===size).length,
       M2_43_ALL.some(x=>x.type===type&&x.biome===biome&&x.size===size&&x.variant===2)?2:
       M2_VARIANT02_EXPANSION.some(x=>x.type===type&&x.biome===biome&&x.size===size)?2:1,
       'unplanned duplicate biome/size quota '+type+' '+biome+' '+size);
   }
 }
});
for(const b of M2_VARIANT02_EXPANSION)test(b.id+': real voxel support, skylights, walkable doors, reachable rooms and unresolved real-world manual families',()=>{
 const r=validateBlueprint(b);
 assert.equal(r.id,b.id);
 assert.ok(b.cells.length>=1000);
 assert.ok(b.spaces.length>=4);
 assert.ok(b.navigation.length>=140);
 assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);assert.equal(b.worldPlaced,false);
 assert.ok(b.provenance.originalPlan);
 const occupied=new Map(b.cells.map(c=>[key(c.at),c]));
 const nav=new Set(b.navigation.map(n=>key(n.at)));
 const foundation=b.cells.filter(c=>c.role==='foundation');
 const floor=b.cells.filter(c=>c.role==='floor');
 const weather=b.cells.filter(c=>c.role==='roof'&&c.at[1]===7);
 assert.equal(foundation.length,floor.length);assert.equal(floor.length,weather.length);
 for(const c of floor)assert.equal(occupied.get(key([c.at[0],7,c.at[2]]))?.role,'roof','weather plane missing');
 assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===10),'elevated roof profile missing');
 for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7)){
  assert.ok(occupied.has(key([c.at[0],c.at[1]-1,c.at[2]])),'unsupported elevated roof');
 }
 const apertures=b.openings.filter(o=>o.kind!=='window');
 assert.ok(apertures.some(o=>o.kind==='door'),'interior circulation aperture missing');
 for(const o of apertures){
  assert.ok(nav.has(key(o.at)),'door feet blocked');
  assert.ok(!occupied.has(key(o.at)));
  assert.ok(!occupied.has(key([o.at[0],o.at[1]+1,o.at[2]])),'door headroom blocked');
 }
 for(const s of b.spaces){
  assert.ok(s.footprint.length>=4);
  assert.ok(nav.has(key(s.access)));
  for(const [x,z] of s.footprint)assert.equal(occupied.get(key([x,1,z]))?.role,'floor');
 }
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(x=>x.status==='catalog-provisional'&&x.unresolved.length>=2));
 assert.ok(b.features.every(x=>x.active===false));
});
test('source-authored courtyards remain actually open sky; all exterior silhouettes are unique up to rotations/reflections',()=>{
 const court=M2_VARIANT02_EXPANSION.filter(b=>b.provenance.originalPlan.includes('Hollow-Court')||b.provenance.originalPlan.includes('Garden Archive'));
 assert.equal(court.length,2);
 for(const b of court){
  const [x,z]=b.type==='healers-house'?[14,13]:[18,16];
  assert.ok(!b.cells.some(c=>c.at[0]===x&&c.at[2]===z),'theoretical open-air courtyard unexpectedly sealed');
 }
 assert.equal(new Set(M2_53_ALL.map(geometrySignature)).size,53);
});
