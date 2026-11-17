import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-3b/roster.mjs';
import {createLegacyWatchtowerBlueprint,createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {serializeBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';

// These are Git blob hashes of verbatim sections extracted at the pinned original
// PR #122 exact HEAD e35b8eca644f6de06e76ab946103ce64a6b7fb91.
// Independent remote fetch and SHA verification established BOTH the exact fragments.
// The original combined module is never copied into this new lane.
const witness=Object.freeze({
 sourcePR:122,
 sourceHead:'e35b8eca644f6de06e76ab946103ce64a6b7fb91',
 sourceBlob:'189ac4deb11042534743045b5087a7a7525e3bf1',
 helperCharacters:4151,
 helperGitBlob:'df0e19da6d8263f99ec77b8cdde9e9e9cf416d06',
 watchtowerCharacters:6121,
 watchtowerGitBlob:'febd8388f51bb42e1a9b4ef0aa5914facc2dc336'
});
const text=readFileSync(new URL('../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs',import.meta.url),'utf8');
const fixture=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-3b/M1_GEOMETRY_WITNESSES.json',import.meta.url),'utf8'));

const gitBlobHash=(s)=>createHash('sha1').update(`blob ${Buffer.byteLength(s,'utf8')}\0`,'utf8').update(s,'utf8').digest('hex');
test('M1 original PR 122 helper and full watchtower geometry implementations remain byte-exact',()=>{
 const a=text.indexOf('const PROFILES=');
 const b=text.indexOf('function buildWatchtower(');
 const end=text.indexOf('export function createLegacyWatchtowerBlueprint(');
 assert.ok(a>0&&b>a&&end>b,'expected unique original source boundaries');
 const helper=text.slice(a,a+witness.helperCharacters);
 const tower=text.slice(b,b+witness.watchtowerCharacters);
 assert.equal(gitBlobHash(helper),witness.helperGitBlob);
 assert.equal(gitBlobHash(tower),witness.watchtowerGitBlob);
 assert.equal(text.slice(b+witness.watchtowerCharacters,end).trim(),'');
 assert.ok(!text.includes('function buildBlacksmith('),'3A blacksmith copied into 3B');
 assert.ok(!text.includes("return buildBlacksmith("),'3A implementation copied into 3B');
});
test('M1 original watchtower ID and exact source-authored geometry are deterministic for all biome × size pairs',()=>{
 const first=createLegacyWatchtowerPool(),second=createLegacyWatchtowerPool();
 assert.equal(first.length,15);assert.equal(second.length,15);
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createLegacyWatchtowerBlueprint(biome,size);
  assert.equal(b.id,`r3:watchtower:${biome}:${size}:1`);
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(serializeBlueprint(b),serializeBlueprint(second.find(x=>x.id===b.id)));
 }
 const fingerprint=first.map(geometryFingerprint);
 assert.equal(new Set(fingerprint).size,15,'15 different architectural layouts');
});
test('M1 per-blueprint source-exact canonical geometry SHA-256 witnesses can be regenerated',()=>{
 const rows=createLegacyWatchtowerPool().map(b=>({
  id:b.id,
  fingerprint:createHash('sha256').update(geometryFingerprint(b)).digest('hex'),
  serialized:createHash('sha256').update(serializeBlueprint(b)).digest('hex'),
  occupied:b.modules.reduce((n,m)=>n+m.cells.length,0)
 }));
 assert.equal(new Set(rows.map(r=>r.fingerprint)).size,15);
 assert.ok(rows.every(r=>r.occupied>1000));
 assert.equal(fixture.sourceHead,witness.sourceHead);
 assert.equal(fixture.originalCombinedSourceBlob,witness.sourceBlob);
 assert.equal(fixture.generatorFragments.helpers.gitBlobSha,witness.helperGitBlob);
 assert.equal(fixture.generatorFragments.watchtower.gitBlobSha,witness.watchtowerGitBlob);
 assert.equal(fixture.importedCount,15);
 assert.equal(fixture.importedOccupiedCoordinates,rows.reduce((n,r)=>n+r.occupied,0));
 assert.deepEqual(fixture.designs.map(x=>({
  id:x.originalId,fingerprint:x.geometryFingerprintSha256,
  serialized:x.canonicalBlueprintSha256,occupied:x.occupiedCoordinates
 })),rows,'physical coordinate output changed from exact-head native witness');
 // Measurable source-derived witness in Actions logs. Do not call this physical-family
 // rendering or a comparison against a separately executed original PR binary.
 console.log('MYTHWROUGHT_3B_M1_WITNESSES='+JSON.stringify(rows));
});
