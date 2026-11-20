// M2 exact-source nested Node acceptance. Does not imply physical-family or iPhone validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_EXEMPLARS} from '../../../src/building-pool/roadmap-4b/m1-exemplars.mjs';
import {M2_HEALING_LIBRARY,M2_ALL_AUTHORED,M2_CENSUS,findM2Blueprint}
 from '../../../src/building-pool/roadmap-4b/m2-healing-library.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds}
 from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=p=>p.join(',');
test('M2 adds sixteen genuinely unique category-correct design records, preserving M1 identities',()=>{
 assert.equal(M2_HEALING_LIBRARY.length,16);
 assert.equal(M2_ALL_AUTHORED.length,21);
 assert.equal(M2_CENSUS.originalM2,16);
 assert.equal(M2_CENSUS.authored,21);
 assert.equal(M2_CENSUS.remaining,264);
 assert.equal(M2_CENSUS.healers,9);assert.equal(M2_CENSUS.libraries,9);
 assert.equal(M2_CENSUS.creatorApproved,0);assert.equal(M2_CENSUS.integrated,0);
 assert.equal(M2_CENSUS.fingerprints,21);
 assert.deepEqual(M2_ALL_AUTHORED.slice(0,5),M1_EXEMPLARS);
 assert.ok(M2_HEALING_LIBRARY.every(x=>expectedIds().includes(x.id)));
 assert.deepEqual(validateCollection(M2_ALL_AUTHORED),{authored:21,remaining:264,creatorApproved:0,integrated:0});
});
for(const p of M2_HEALING_LIBRARY){
 test(p.id+': native material, roof, room, circulation, physical coordinate witnesses',()=>{
  const report=validateBlueprint(p);
  const occupied=new Map(p.cells.map(c=>[key(c.at),c]));
  assert.equal(report.id,p.id);
  assert.ok(p.cells.length>=700);
  assert.ok(p.spaces.length>=4);
  assert.equal(p.cells.filter(c=>c.role==='foundation').length,p.cells.filter(c=>c.role==='floor').length);
  assert.equal(p.cells.filter(c=>c.role==='floor').length,p.cells.filter(c=>c.role==='roof'&&c.at[1]===6).length);
  assert.ok(p.cells.some(c=>c.role==='roof'&&c.at[1]===7));
  assert.ok(p.cells.filter(c=>c.role==='window').length>=6);
  assert.ok(p.cells.filter(c=>c.role==='fixture').length>=2);
  assert.ok(p.cells.some(c=>c.role==='partition'));
  assert.ok(p.openings.some(x=>x.kind==='door'));
  assert.ok(p.navigation.length>80);
  const nav=new Set(p.navigation.map(n=>key(n.at)));
  for(const o of p.openings.filter(x=>x.kind!=='window')){
   assert.ok(nav.has(key(o.at)),'unroutable door '+key(o.at));
   assert.ok(!occupied.has(key(o.at)),'blocked feet');
   assert.ok(!occupied.has(key([o.at[0],o.at[1]+1,o.at[2]])),'blocked head');
  }
  for(const s of p.spaces){
   assert.ok(s.footprint.length>=6);
   assert.ok(nav.has(key(s.access)));
   for(const [x,z] of s.footprint){
    assert.ok(occupied.has(key([x,1,z])),'floor missing');
    assert.ok(!occupied.has(key([x,2,z]))&&!occupied.has(key([x,3,z])),'room tile blocked');
   }
  }
  for(const c of p.cells.filter(x=>x.role==='floor')){
   const [x,,z]=c.at;
   assert.equal(occupied.get(key([x,6,z]))?.role,'roof','roof weather plane not covering floor');
  }
  const deps=new Set(p.dependencies.map(x=>x.ref));
  assert.ok(deps.has('pack4:030'));
  assert.ok(deps.has('pack4:058'));
  assert.ok(deps.has('pack4:059'));
  for(const dep of p.dependencies){
   assert.equal(dep.source,'manual-five-pack');
   assert.equal(dep.status,'catalog-provisional');
   assert.ok(dep.unresolved.length>=2);
   assert.ok(!Object.hasOwn(dep,'numericId'));
  }
  assert.ok(p.features.every(f=>f.active===false));
  assert.equal(p.worldPlaced,false);assert.equal(p.integrated,false);
  assert.equal(p.creatorApproved,false);
  assert.ok(p.provenance.originalPlan);
  assert.equal(p.provenance.milestone,'M2');
  assert.equal(findM2Blueprint(p.id),p);
 });
}
test('distinct building typologies, climate forms and five biome distributions',()=>{
 const ids=M2_ALL_AUTHORED.map(x=>x.id),signatures=M2_ALL_AUTHORED.map(geometrySignature);
 assert.equal(new Set(ids).size,21);
 assert.equal(new Set(signatures).size,21);
 assert.equal(new Set(M2_HEALING_LIBRARY.filter(x=>x.type==='healers-house').map(x=>x.biome)).size,5);
 assert.equal(new Set(M2_HEALING_LIBRARY.filter(x=>x.type==='library').map(x=>x.biome)).size,5);
 assert.deepEqual(new Set(M2_HEALING_LIBRARY.map(x=>x.size)),new Set(['small','medium','large']));
 assert.equal(M2_HEALING_LIBRARY.filter(x=>x.spaces.length===5).length>=8,true);
});
test('M1 model payload hashes and coordinates are unaffected by M2 authorship',()=>{
 assert.ok(M1_EXEMPLARS.every((b,i)=>M2_ALL_AUTHORED[i]===b));
 for(const b of M1_EXEMPLARS)assert.equal(b.provenance.milestone,'M1');
});
