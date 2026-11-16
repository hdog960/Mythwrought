import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROGRAM,PLANNED_TOTAL,expectedIds} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {M2_73_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant03-first10.mjs';
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
  assert.equal(manifest.inherited,0);assert.equal(manifest.authored,73);
  assert.equal(manifest.remaining,212);assert.equal(manifest.creatorAccepted,0);
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
test('manifest records five original M1 categories without phantom inherited designs',()=>{
  assert.equal(manifest.authoredIds.length,73);
  assert.equal(new Set(manifest.authoredIds).size,73);
  assert.equal(Object.values(manifest.byCategoryAuthorCount).reduce((a,b)=>a+b,0),73);
  assert.equal(Object.values(manifest.byBiomeSizeAuthorCount).flatMap(x=>Object.values(x)).reduce((a,b)=>a+b,0),73);
  assert.match(manifest.milestones.M2,/IN PROGRESS/);
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

test('manifest exactly matches independently authored committed M1 plus M2 source IDs and per-cell quotas',()=>{
 assert.deepEqual(manifest.authoredIds,M2_73_ALL.map(x=>x.id));
 for(const category of manifest.categories)
  assert.equal(manifest.byCategoryAuthorCount[category.type],M2_73_ALL.filter(b=>b.type===category.type).length);
 for(const biome of manifest.biomes)for(const size of manifest.sizes)
  assert.equal(manifest.byBiomeSizeAuthorCount[biome][size],M2_73_ALL.filter(b=>b.biome===biome&&b.size===size).length);
 assert.equal(manifest.m2Candidate.newModels,68);
 assert.equal(manifest.m2Candidate.technicalAccepted,false);
 assert.equal(manifest.m2Candidate.newThisPass,10);
 assert.equal(manifest.m2Candidate.targetDistinctiveBrowserCaptures,72);
 assert.equal(manifest.m2Candidate.targetVariant02BrowserCaptures,60);
 assert.equal(manifest.m2Candidate.targetVariant02ExpansionBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.targetVariant02CompletionBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.prior53TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior63TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.targetVariant03BrowserCaptures,60);

 assert.equal(manifest.m2Candidate.prior43TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior33TechnicallyAccepted,true);
 for(const category of ['healers-house','library'])assert.equal(manifest.byCategoryAuthorCount[category],35);
 assert.equal(manifest.m2Candidate.creatorApproved,0);
});
