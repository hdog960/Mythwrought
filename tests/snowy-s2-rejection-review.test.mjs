import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {reviewSnowS2RejectedGrass} from '../src/manual-biomes/snowy-s2-rejection-review.mjs';
const census=JSON.parse(readFileSync(new URL('./fixtures/snow-s2-head-59e449b-real-census.json',import.meta.url)));
test('S2 genuine exact-revision seed 179 and 2026 census conserves protected classes',()=>{
  assert.equal(census.head,'59e449be7e73b25f259c4c72855cfb638a056517');
  assert.equal(census.sourceArtifactId,14737638885);
  const a=reviewSnowS2RejectedGrass(census);
  assert.equal(a.state,'detached-read-only-no-M7-writes');
  assert.deepEqual(a.seeds,[179,2026]);
  assert.equal(a.sampled,3362);
  assert.equal(a.grass,97);
  assert.equal(a.eligibleFutureCaps,17);
  assert.equal(a.protectedGrass,80);
  assert.deepEqual(a.categories,{
    'protect-cave-air':23,'protect-legacy-stone':30,
    'protect-legacy-wood':23,'protect-legacy-leaves':4
  });
  assert.equal(Object.isFrozen(a),true);
});
test('S2 fail-closed census refuses unknown source, inaccurate counts and witness collisions',()=>{
  const mutate=fn=>{const copy=structuredClone(census);fn(copy);return copy;};
  for(const bad of [
    mutate(a=>{a.records[0].skippedProtected--}),
    mutate(a=>{a.records[0].rejectedReasons['protected-above-3']--}),
    mutate(a=>{a.records[1].rejectedReasons['new-unverified-protection']=1}),
    mutate(a=>{a.records[1].seed=179}),
    mutate(a=>{a.records[0].rejectionExamples[1].blockAbove.id=7}),
    mutate(a=>{a.records[0].rejectionExamples[0].support=2}),
    mutate(a=>{a.records[0].rejectionExamples[1].at=[3,5,'z']})
  ])assert.throws(()=>reviewSnowS2RejectedGrass(bad),/S2|seed|source|surface|AIR|above/i);
  assert.throws(()=>reviewSnowS2RejectedGrass({records:[]}),/Missing/);
});
