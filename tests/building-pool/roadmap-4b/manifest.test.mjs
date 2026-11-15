import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROGRAM,PLANNED_TOTAL,expectedIds} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const load=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const manifest=load('../../../src/building-pool/roadmap-4b/manifest.json');
const legacy=load('../../../src/building-pool/roadmap-4b/legacy-source.json');
const roster=load('../../../docs/building-pool/EIGHT_LANE_ROSTER.json');
const lane=roster.lanes.find(x=>x.lane==='roadmap-4b');
test('manifest totals and original category IDs exactly match executable schema',()=>{
  assert.equal(manifest.owner,'roadmap-4b');
  assert.equal(manifest.quota,PLANNED_TOTAL);
  assert.equal(expectedIds().length,285);
  assert.deepEqual(manifest.categories.map(x=>[x.type,x.perBiomeSize,x.total]),
    PROGRAM.map(x=>[x.type,x.perCombination,x.perCombination*15]));
  assert.equal(manifest.inherited,0);assert.equal(manifest.authored,0);
  assert.equal(manifest.remaining,285);assert.equal(manifest.creatorAccepted,0);
  assert.equal(manifest.integrated,0);assert.equal(manifest.worldPlaced,false);
});
test('read-only legacy PR source is pinned and zero-migration is explicit',()=>{
  assert.equal(manifest.originalPR,123);
  assert.equal(legacy.originalPR,123);
  assert.equal(legacy.originalHeadAudited,manifest.originalHeadAudited);
  assert.equal(legacy.originalCategoryIdPrefix,'r4:');
  assert.deepEqual(legacy.originalCategoryMatchingCandidateIds,[]);
  assert.equal(legacy.importedCount,0);
  assert.equal(legacy.geometryCopied,false);
  assert.equal(legacy.originalPRModified,false);
});
test('eight-lane roster grants no sibling-owned categories to Builder 4B',()=>{
  assert.ok(lane);
  assert.equal(lane.inherited,0);
  assert.equal(lane.planned,285);
  assert.deepEqual(lane.categories,Object.fromEntries(PROGRAM.map(x=>[x.type,x.perCombination*15])));
  for(const other of roster.lanes.filter(x=>x.lane!=='roadmap-4b'))
    assert.deepEqual(Object.keys(other.categories).filter(x=>Object.hasOwn(lane.categories,x)),[],other.lane);
});
test('only 4B-owned paths and unapproved Gate A are declared',()=>{
  assert.deepEqual(manifest.ownedPaths,['src','tests','docs'].map(root=>root+'/building-pool/roadmap-4b/'));
  assert.equal(manifest.gates.merge,false);assert.equal(manifest.gates.deployment,false);
  assert.equal(manifest.gates.creatorArtApproval,false);
  assert.equal(manifest.gates.physicalIphoneApproval,false);
  assert.equal(manifest.gates.v011,'locked');
  assert.equal(manifest.gates.gateA,'open');
});
