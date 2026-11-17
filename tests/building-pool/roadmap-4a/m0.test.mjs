import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {SCHEMA,PROGRAM,BIOMES,SIZES,PLANNED_TOTAL,expectedIds,validateBlueprint,validateCollection,serializeBlueprint,geometrySignature} from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {buildM1,allM1,auditM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS} from '../../../src/builder-assets/manual-five-pack.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};
import provenance from '../../../src/building-pool/roadmap-4a/provenance.json' with {type:'json'};

const TYPES=['civic-hall','guildhall','embassy','castle-palace','grand-archive','observatory'];
const CARRIED=['civic-hall','castle-palace'];
test('4A owns exactly 315 allocated designs, never sibling 4B slots',()=>{
  assert.equal(SCHEMA,'mythwrought.building-pool.roadmap-4.v1');
  assert.deepEqual(PROGRAM.map(x=>x.type).sort(),[...TYPES].sort());
  assert.equal(PLANNED_TOTAL,315);
  assert.equal(expectedIds().length,315);
  assert.equal(new Set(expectedIds()).size,315);
  assert.equal(manifest.counts.legacyAuthored,30);
  assert.equal(manifest.counts.totalAuthored,manifest.counts.legacyAuthored+manifest.counts.newlyAuthored);
  assert.equal(manifest.counts.remaining,PLANNED_TOTAL-manifest.counts.totalAuthored);
  assert.equal(manifest.counts.creatorAccepted,0);
  assert.equal(manifest.counts.integratedBuildings,0);
  assert.equal(manifest.categories.reduce((n,c)=>n+c.total,0),315);
  for (const c of manifest.categories)assert.equal(c.total,c.perBiomeSize*BIOMES.length*SIZES.length);
});
test('preserved legacy generator is exact Git blob bytes from PR #123',()=>{
  const bytes=readFileSync(new URL('../../../src/building-pool/roadmap-4a/m1-blueprints.mjs',import.meta.url));
  const blob=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length),Buffer.from([0])])).update(bytes).digest('hex');
  assert.equal(blob,'14ecb6fcfbe5cfeea97976670d14afb93bc6fe45');
  assert.equal(provenance.sourceBlobSha,blob);
  assert.equal(provenance.legacyHead,'564330635f18e10215a3bf93901923fbf5af528d');
});
test('every inherited 4A original ID has a unique source-exact profile in owned code',()=>{
  assert.equal(provenance.records.length,30);
  const expected=CARRIED.flatMap(type=>BIOMES.flatMap(biome=>SIZES.map(size=>'r4:'+type+':'+biome+':'+size+':01')));
  assert.deepEqual(provenance.records.map(x=>x.originalId),expected);
  assert.ok(provenance.records.every(x=>x.ownedModule==='src/building-pool/roadmap-4a/m1-blueprints.mjs'&&x.sourceBlobSha===provenance.sourceBlobSha));
  assert.equal(new Set(provenance.records.map(x=>x.sourceProfile)).size,30);
});
test('30 inherited voxel blueprints validate as occupied coordinate designs, not shells',()=>{
  const all=allM1();
  assert.deepEqual(all.map(x=>x.id),provenance.records.map(x=>x.originalId));
  assert.deepEqual(auditM1(),{verified:30,expected:315,complete:false});
  assert.equal(all.reduce((n,x)=>n+x.cells.length,0),126278);
  assert.equal(all.reduce((n,x)=>n+x.navigation.length,0),36385);
  assert.equal(all.reduce((n,x)=>n+x.spaces.length,0),95);
  for(const b of all){
    const v=validateBlueprint(b);
    assert.equal(v.theoreticalOnly,true);
    assert.ok(v.rooms>=2);
    assert.ok(b.cells.some(x=>x.role==='roof')&&b.cells.some(x=>x.role==='wall')&&b.cells.some(x=>x.role==='floor'));
    assert.equal(b.variant,1);
  }
});
test('source-exact 30 candidates remain spatially distinct after palette-neutral rotation normalization',()=>{
  const all=allM1();
  const fingerprints=new Set();
  for(const b of all){
    const fingerprint=geometrySignature(b);
    assert.ok(!fingerprints.has(fingerprint),b.id);
    fingerprints.add(fingerprint);
  }
  assert.equal(fingerprints.size,30);
  assert.equal(validateCollection(all).expected,315);
});
test('serialization stays deterministic for selected original climate/size plans',()=>{
  for(const [type,biome,size] of [['civic-hall','temperate','small'],['civic-hall','desert','medium'],
  ['castle-palace','snow','large'],['castle-palace','enchanted-forest','medium'],['castle-palace','mountain','small']]){
    const a=buildM1(type,biome,size),b=buildM1(type,biome,size);
    assert.equal(serializeBlueprint(a),serializeBlueprint(b));
  }
});
test('integrated 96-family/106-variant manual registry is consumed read-only; biome130 not silently promoted',()=>{
  assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
  assert.equal(MANUAL_FIVE_PACK_COUNTS.numericVariants,106);
  assert.equal(MANUAL_FIVE_PACK_COUNTS.worldPlaced,false);
  const roster=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
  for(const b of allM1())for(const d of b.dependencies){
    if(d.ref.startsWith('pack'))assert.ok(roster.has(d.ref),'missing integrated manual family '+d.ref);
    else assert.ok(d.ref.startsWith('biome130:'),'unexpected dependency '+d.ref);
    assert.equal(Object.hasOwn(d,'numericId'),false,'legacy candidates may not invent persistent IDs');
  }
});
