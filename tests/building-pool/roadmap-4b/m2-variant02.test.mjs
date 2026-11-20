// Builder 4B M2 variant02 — committed coordinate-backed 43-design native checks.
import test from 'node:test';import assert from 'node:assert/strict';
import {M2_VARIANT_02,M2_43_ALL,M2_43_CENSUS,M2_VARIANT_02_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant02.mjs';
import {M2_33_ALL} from '../../../src/building-pool/roadmap-4b/m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=at=>at.join(',');
test('ten genuinely distinct variant 02 source plans, no changes to 33 accepted designs',()=>{
 assert.equal(M2_VARIANT_02.length,10);
 assert.equal(M2_43_CENSUS.authored,43);assert.equal(M2_43_CENSUS.remaining,242);
 assert.equal(M2_43_CENSUS.healers,20);assert.equal(M2_43_CENSUS.libraries,20);
 assert.equal(new Set(M2_VARIANT_02_NAMES).size,10);
 assert.equal(new Set(M2_43_ALL.map(geometrySignature)).size,43);
 assert.deepEqual(validateCollection(M2_43_ALL),{authored:43,remaining:242,creatorApproved:0,integrated:0});
 for(let i=0;i<33;i++)assert.equal(M2_43_ALL[i],M2_33_ALL[i]);
 for(const m of M2_VARIANT_02){assert.match(m.id,/:02$/);assert.equal(m.variant,2);assert.ok(expectedIds().includes(m.id));}
});
for(const b of M2_VARIANT_02)test(b.id+': actual supported voxel rooms, real open doors and typed physical blockers',()=>{
 const report=validateBlueprint(b);
 const at=new Map(b.cells.map(c=>[key(c.at),c])),nav=new Set(b.navigation.map(n=>key(n.at)));
 assert.equal(report.id,b.id);
 assert.ok(b.cells.length>900);assert.ok(b.spaces.length>=4);assert.ok(b.navigation.length>90);
 assert.ok(b.openings.some(o=>o.kind==='door'));
 assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);assert.equal(b.worldPlaced,false);
 const floors=b.cells.filter(c=>c.role==='floor'),foundations=b.cells.filter(c=>c.role==='foundation');
 assert.equal(floors.length,foundations.length);
 assert.equal(floors.length,b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
 for(const f of floors)assert.equal(at.get(key([f.at[0],7,f.at[2]]))?.role,'roof');
 for(const high of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7))
   assert.ok(at.has(key([high.at[0],high.at[1]-1,high.at[2]])),'unsupported elevated roof tier');
 for(const o of b.openings.filter(o=>o.kind!=='window')){
   assert.ok(nav.has(key(o.at)),'door not walkable');assert.ok(!at.has(key(o.at)));
   assert.ok(!at.has(key([o.at[0],o.at[1]+1,o.at[2]])),'headroom missing');
 }
 for(const s of b.spaces){
  assert.ok(s.footprint.length>=4);assert.ok(nav.has(key(s.access)));
  for(const [x,z] of s.footprint)assert.equal(at.get(key([x,1,z]))?.role,'floor');
 }
 assert.deepEqual(b.dependencies.map(x=>x.ref).sort(),['pack4:030','pack4:058','pack4:059']);
 assert.ok(b.dependencies.every(x=>x.status==='catalog-provisional'&&x.unresolved.length>=2));
 assert.ok(b.features.every(x=>x.active===false));
});
test('two genuinely open-air courtyard plans and independent climate-specific roof masses',()=>{
 const ring=M2_VARIANT_02.find(x=>x.provenance.originalPlan==='Oasis Ring Recovery Court');
 const moon=M2_VARIANT_02.find(x=>x.provenance.originalPlan==='Moonwell Open-Air Lore Library');
 for(const b of [ring,moon]){
   assert.ok(b);const [cx,cz]=b===ring?[18,19]:[19,19];
   assert.ok(!b.cells.some(c=>c.at[0]===cx&&c.at[2]===cz),'courtyard must remain open');
 }
 assert.ok(M2_VARIANT_02.every(b=>b.cells.some(c=>c.at[1]===10&&c.role==='roof')));
 assert.equal(new Set(M2_VARIANT_02.map(x=>x.provenance.roofProfile)).size,10);
});
