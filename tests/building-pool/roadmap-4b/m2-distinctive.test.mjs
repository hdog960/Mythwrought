// Builder 4B M2 distinctiveness: true-coordinate, no stage promotion or shared writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_DISTINCTIVE,M2_33_ALL,M2_33_CENSUS,M2_DISTINCTIVE_NAMES}
 from '../../../src/building-pool/roadmap-4b/m2-distinctive.mjs';
import {M2_ALL_AUTHORED} from '../../../src/building-pool/roadmap-4b/m2-healing-library.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES}
 from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=a=>a.join(',');
test('all twelve previously missing healer/library biome-size first-variant slots are original source geometry',()=>{
 assert.equal(M2_DISTINCTIVE.length,12);
 assert.equal(new Set(M2_DISTINCTIVE_NAMES).size,12);
 assert.equal(M2_33_ALL.length,33);
 assert.equal(M2_33_CENSUS.authored,33);
 assert.equal(M2_33_CENSUS.remaining,252);
 assert.equal(M2_33_CENSUS.healer,15);
 assert.equal(M2_33_CENSUS.library,15);
 assert.equal(M2_33_CENSUS.creatorApproved,0);
 assert.equal(M2_33_CENSUS.integrated,0);
 assert.equal(M2_33_CENSUS.fingerprints,33);
 assert.deepEqual(M2_33_ALL.slice(0,21),M2_ALL_AUTHORED);
 for(const type of ['healers-house','library'])
  for(const biome of BIOMES)for(const size of SIZES)
    assert.equal(M2_33_ALL.filter(x=>x.type===type&&x.biome===biome&&x.size===size).length,1,
      'missing or inflated first-variant biome×size slot '+type+' '+biome+' '+size);
 assert.deepEqual(validateCollection(M2_33_ALL),{authored:33,remaining:252,creatorApproved:0,integrated:0});
});
for(const b of M2_DISTINCTIVE){
 test(b.id+': actual original authored cells, supported roofs, accessible rooms and symbolic ledger',()=>{
  const report=validateBlueprint(b);
  const occupied=new Map(b.cells.map(c=>[key(c.at),c]));
  const nav=new Set(b.navigation.map(n=>key(n.at)));
  assert.equal(report.id,b.id);
  assert.ok(report.physicalCells>=900);
  assert.ok(b.spaces.length>=4);
  assert.ok(b.provenance.originalPlan);
  assert.equal(b.provenance.milestone,'M2');
  assert.equal(b.creatorApproved,false);
  assert.equal(b.integrated,false);
  assert.equal(b.worldPlaced,false);
  assert.ok(expectedIds().includes(b.id));
  const count=role=>b.cells.filter(c=>c.role===role).length;
  assert.equal(count('floor'),count('foundation'));
  assert.equal(count('floor'),b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===8));
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===9));
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===10));
  assert.ok(count('wall')>30);
  assert.ok(count('window')>=6);
  assert.ok(count('fixture')===2);
  assert.ok(count('partition')>=2);
  assert.ok(b.openings.some(x=>x.kind==='door'));
  assert.ok(b.navigation.length>100);
  for(const c of b.cells.filter(x=>x.role==='roof'&&x.at[1]>7)){
   const [x,y,z]=c.at;
   assert.ok(occupied.has(key([x,y-1,z])), 'disconnected overhead roof tier '+key(c.at));
  }
  for(const c of b.cells.filter(x=>x.role==='floor')){
   assert.equal(occupied.get(key([c.at[0],7,c.at[2]]))?.role,'roof','nonweatherproof roof');
  }
  for(const o of b.openings.filter(x=>x.kind!=='window')){
   assert.ok(nav.has(key(o.at)),'door not connected to walk graph');
   assert.ok(!occupied.has(key(o.at))&&!occupied.has(key([o.at[0],o.at[1]+1,o.at[2]])),'door obstructed');
  }
  for(const r of b.spaces){
   assert.ok(r.footprint.length>=4);
   assert.ok(nav.has(key(r.access)));
   for(const [x,z] of r.footprint){
    assert.equal(occupied.get(key([x,1,z]))?.role,'floor');
    assert.ok(!occupied.has(key([x,2,z]))&&!occupied.has(key([x,3,z])));
   }
  }
  const symbolic=new Set(b.dependencies.map(x=>x.ref));
  assert.deepEqual([...symbolic].sort(),['pack4:030','pack4:058','pack4:059']);
  assert.ok(b.dependencies.every(x=>x.status==='catalog-provisional'&&x.shape==='unknown'&&x.orientation==='unknown'));
  assert.ok(b.features.every(x=>x.active===false));
 });
}
test('distinctive M2 includes true open-air courtyard, multiple rounded pavilions and supported stepped roof silhouettes',()=>{
 const group=M2_DISTINCTIVE;
 const moon=group.find(x=>x.provenance.originalPlan==='Moonring Healing Sanctuary');
 const sun=group.find(x=>x.provenance.originalPlan==='Sun Court Double Cloister');
 const oct=group.find(x=>x.provenance.originalPlan==='Twin-Octagon Lore Exchange');
 const bastion=group.find(x=>x.provenance.originalPlan==='Four-Bastion Archive');
 for(const [b,voidAt] of [[moon,[17,7,17]],[sun,[18,7,17]]]){
  assert.ok(b,'source courtyard omitted');
  assert.ok(!b.cells.some(c=>key(c.at)===key(voidAt)),'open-sky void unexpectedly sealed');
 }
 assert.ok(oct&&oct.cells.some(c=>c.at[1]===10),'twin domes missing');
 assert.ok(bastion&&bastion.cells.filter(c=>c.role==='roof'&&c.at[1]===10).length>=12);
 assert.equal(new Set(M2_33_ALL.map(geometrySignature)).size,33);
});
test('all previous 21 source objects and original IDs are retained unchanged',()=>{
 assert.ok(M2_ALL_AUTHORED.every((x,i)=>M2_33_ALL[i]===x));
 for(const old of M2_ALL_AUTHORED)assert.ok(!M2_DISTINCTIVE.some(x=>x.id===old.id));
});
