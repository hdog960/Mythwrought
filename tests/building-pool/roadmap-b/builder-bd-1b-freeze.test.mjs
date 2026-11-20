// Builder B and D shared 1B ID freeze; protect source snapshots with exact ID list + FNV.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getBuilderBServiceOwnership,fnv64,SOURCE_HEADS} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
const f=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-b/BUILDER_BD_EXCLUSIVE_1B_FREEZE.json',import.meta.url),'utf8'));
const sorted=a=>a.slice().sort();
test('exact 115 Builder B / 92 Builder D ownership is frozen to source-accepted 228 historical IDs',()=>{
 const current=getBuilderBServiceOwnership();
 assert.equal(f.schema,'mythwrought.builder-bd.1b-exclusive-freeze.v1');
 assert.deepEqual([f.old169,f.stage59,f.previous228,f.unfilled207],[169,59,228,207]);
 assert.equal(SOURCE_HEADS.canonical1B,f.canonical1BSource);
 assert.equal(SOURCE_HEADS.acceptedStaging,f.acceptedStaging);
 assert.deepEqual(current.builderBIds,f.builderB.ids);
 assert.deepEqual(current.builderDAvailableIds,f.builderD.ids);
 assert.equal(f.builderB.checksumFNV64,'7b8923c6ad77b413');
 assert.equal(f.builderD.checksumFNV64,'8d01cf88aa785455');
 assert.equal(fnv64(current.builderBIds.join('\n')),f.builderB.checksumFNV64);
 assert.equal(fnv64(current.builderDAvailableIds.join('\n')),f.builderD.checksumFNV64);
 const inherited=new Set(get1BCandidates().map(x=>x.id));
 assert.equal(inherited.size,169);
 assert.ok([...inherited].every(id=>f.priorAcceptedIds.includes(id)));
 const complete=[...f.priorAcceptedIds,...f.builderB.ids,...f.builderD.ids];
 assert.equal(new Set(complete).size,435);
 assert.equal(f.builderB.ids.length,115);
 assert.equal(f.builderD.ids.length,92);
 assert.equal(f.priorAcceptedIds.length,228);
 assert.ok(f.builderB.ids.includes('r1:farm-barn:temperate:small:004'));
 assert.ok(!f.builderD.ids.includes('r1:farm-barn:temperate:small:004'));
 assert.equal(f.runtimeRegistration,false);
});
test('full static B/D reservation is preserved exactly through source-only acceptance and category quotas',()=>{
 const c=getBuilderBServiceOwnership();
 assert.deepEqual(Object.keys(f.counts),Object.keys(c.categoryQuotas));
 for(const category of Object.keys(f.counts)){
  const x=f.counts[category],y=c.categoryQuotas[category];
  assert.equal(x.priorOccupied,y.occupied);
  assert.equal(x.unfilled,y.free);
  assert.equal(x.builderB,y.b);
  assert.equal(x.builderD,y.d);
 }
 assert.equal(f.evidence.length,5);
 assert.equal(new Set(f.evidence.map(x=>x.gitBlob)).size,5);
});
