import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BIOMES,SIZES,PER_BIOME_SIZE,TARGET,candidateId,allocatedIdentities,pendingLegacyImports,verifyM0Roster,LEGACY_ORIGIN} from '../../../src/building-pool/roadmap-1a/m0-contract.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-1a/manifest.json',import.meta.url),'utf8'));
test('1A exclusive quota is exactly 450 across all 15 biome-size combinations',()=>{
  assert.equal(BIOMES.length,5);assert.equal(SIZES.length,3);
  assert.deepEqual(PER_BIOME_SIZE,{house:20,tavern:5,inn:5});
  const ids=allocatedIdentities();assert.equal(ids.length,TARGET);
  assert.equal(new Set(ids).size,450);
  for(const category of Object.keys(PER_BIOME_SIZE))for(const biome of BIOMES)for(const size of SIZES)
    assert.equal(ids.filter(id=>id.startsWith('r1:'+category+':'+biome+':'+size+':')).length,PER_BIOME_SIZE[category]);
});
test('30 selectively identified house/tavern IDs come from exact legacy source (no stables)',()=>{
  const legacy=pendingLegacyImports(),set=new Set(legacy.map(x=>x.originalId));
  assert.equal(legacy.length,30);assert.equal(set.size,30);
  for(const category of ['house','tavern'])for(const biome of BIOMES)
    for(const [i,size] of SIZES.entries())assert.ok(set.has(candidateId(category,biome,size,i+1)));
  assert.ok(legacy.every(x=>!x.originalId.includes(':stable:')&&x.geometryImported===false&&x.geometryFingerprint===null));
  assert.equal(LEGACY_ORIGIN.head,manifest.sourcePR.head);
  assert.equal(LEGACY_ORIGIN.generatorBlob,manifest.sourceBlobs.generator);
});
test('historical M0 identity snapshot stays separate from current M1 migration',()=>{
  const result=verifyM0Roster();
  assert.equal(result.legacyMigrated,0);assert.equal(result.creatorApproved,0);
  assert.equal(manifest.originalCandidatesIdentified,30);
  assert.equal(manifest.originalGeometryMigrated,30);
  assert.equal(manifest.totalLaneGeometryAuthored,30);
  assert.equal(manifest.newDesignsAuthored,0);
  assert.equal(manifest.additionalDesignsRequired,420);
  assert.equal(manifest.creatorAccepted,0);
  assert.equal(manifest.integrated,0);
  assert.equal(manifest.geometryParityCertified,false);
  assert.equal(manifest.runtimeWorldPlaced,false);
});
test('1A refuses sibling categories and illegal ordinals',()=>{
  for(const category of ['stable','castle-palace','bakery','watchtower'])assert.throws(()=>candidateId(category,'temperate','small',1));
  assert.throws(()=>candidateId('house','swamp','small',1));
  assert.throws(()=>candidateId('inn','snow','huge',1));
  assert.throws(()=>candidateId('inn','snow','small',6));
  assert.throws(()=>candidateId('house','snow','small',0));
});
