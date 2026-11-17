import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROGRAM,PLANNED_TOTAL,expectedIds} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {M3_143_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-first5.mjs';
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
  assert.equal(manifest.inherited,0);assert.equal(manifest.authored,143);
  assert.equal(manifest.remaining,142);assert.equal(manifest.creatorAccepted,0);
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
  assert.equal(manifest.authoredIds.length,143);
  assert.equal(new Set(manifest.authoredIds).size,143);
  assert.equal(Object.values(manifest.byCategoryAuthorCount).reduce((a,b)=>a+b,0),143);
  assert.equal(Object.values(manifest.byBiomeSizeAuthorCount).flatMap(x=>Object.values(x)).reduce((a,b)=>a+b,0),143);
  assert.match(manifest.milestones.M2,/SOURCE-AUTHORED COMPLETE/);
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
 assert.deepEqual(manifest.authoredIds,M3_143_ALL.map(x=>x.id));
 for(const category of manifest.categories)
  assert.equal(manifest.byCategoryAuthorCount[category.type],M3_143_ALL.filter(b=>b.type===category.type).length);
 for(const biome of manifest.biomes)for(const size of manifest.sizes)
  assert.equal(manifest.byBiomeSizeAuthorCount[biome][size],M3_143_ALL.filter(b=>b.biome===biome&&b.size===size).length);
 assert.equal(manifest.m2Candidate.newModels,133);
 assert.equal(manifest.m2Candidate.technicalAccepted,true);
 assert.equal(manifest.m2Candidate.newThisPass,15);
 assert.equal(manifest.m2Candidate.targetDistinctiveBrowserCaptures,72);
 assert.equal(manifest.m2Candidate.targetVariant02BrowserCaptures,60);
 assert.equal(manifest.m2Candidate.targetVariant02ExpansionBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.targetVariant02CompletionBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.prior53TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior63TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior83TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior83ExactHead,'b347aeb9bcc1f24c417e769579579d30879ff822');
 assert.equal(manifest.m2Candidate.prior83Actions,43915128712);
 assert.equal(manifest.m2Candidate.prior83VerifiedGenuineChromiumCaptures,498);
 assert.equal(manifest.m2Candidate.targetVariant03BrowserCaptures,180);

 assert.equal(manifest.m2Candidate.prior43TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior33TechnicallyAccepted,true);
 for(const category of ['healers-house','library'])assert.equal(manifest.byCategoryAuthorCount[category],category==='healers-house'?75:60);
 assert.equal(manifest.m2Candidate.authoredTotal,138);
 assert.equal(manifest.m2Candidate.healers,75);
 assert.equal(manifest.m2Candidate.libraries,60);
 assert.equal(manifest.m2Candidate.variant03BrowserExecuted,true);
 assert.equal(manifest.m2Candidate.prior93TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior93ExactHead,'1153d3ae333fbc5c7cd264d8e1516f857af352bf');
 assert.equal(manifest.m2Candidate.prior93Actions,43983601156);
 assert.equal(manifest.m2Candidate.prior93VerifiedGenuineChromiumCaptures,558);
 assert.equal(manifest.m2Candidate.targetVariant04BrowserCaptures,180);
 assert.equal(manifest.m2Candidate.targetTotalBrowserCaptures,828);
 assert.equal(manifest.m2Candidate.variant04BrowserExecuted,true);
 assert.equal(manifest.m2Candidate.prior103TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior103ExactHead,'19dab19609f4b494a6a6b39cb38f3128f7267822');
 assert.equal(manifest.m2Candidate.prior103Actions,43988856027);
 assert.equal(manifest.m2Candidate.prior103VerifiedGenuineChromiumCaptures,618);
 assert.equal(manifest.m2Candidate.variant04SecondBrowserExecuted,true);
 assert.equal(manifest.m2Candidate.targetVariant04SecondBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.prior113TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior113ExactHead,'6dd5ffbef5e0761e220eb0b7c4eba6374545c779');
 assert.equal(manifest.m2Candidate.prior113Actions,44122763543);
 assert.equal(manifest.m2Candidate.prior113VerifiedGenuineChromiumCaptures,678);
 assert.equal(manifest.m2Candidate.prior113CameraFitVerifiedCaptures,678);
 assert.equal(manifest.m2Candidate.prior113ArtifactId,14347791524);
 assert.equal(manifest.m2Candidate.variant04FinalBrowserExecuted,true);
 assert.equal(manifest.m2Candidate.targetVariant04FinalBrowserCaptures,60);
 assert.equal(manifest.m2Candidate.prior123TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior123ExactHead,'59e347358134b07efe1b32e5a55eaaab19100a94');
 assert.equal(manifest.m2Candidate.prior123Actions,44138509135);
 assert.equal(manifest.m2Candidate.prior123VerifiedGenuineChromiumCaptures,738);
 assert.equal(manifest.m2Candidate.prior123CameraFitVerifiedCaptures,738);
 assert.equal(manifest.m2Candidate.prior123ArtifactId,14355030879);
 assert.equal(manifest.m2Candidate.variant05BrowserExecuted,true);
 assert.equal(manifest.m2Candidate.targetVariant05BrowserCaptures,90);
 assert.equal(manifest.m2Candidate.prior138TechnicallyAccepted,true);
 assert.equal(manifest.m2Candidate.prior138ExactHead,'f799de3f877679bd3be89f228dd3eb048464fb6b');
 assert.equal(manifest.m2Candidate.prior138Actions,44197912371);
 assert.equal(manifest.m2Candidate.prior138VerifiedGenuineChromiumCaptures,828);
 assert.equal(manifest.m2Candidate.prior138CameraFitVerifiedCaptures,828);
 assert.equal(manifest.m2Candidate.prior138ArtifactId,14380927446);
 assert.equal(manifest.m2Candidate.sourceAuthorshipComplete,true);
 assert.equal(manifest.m3Candidate.newModels,5);
 assert.equal(manifest.m3Candidate.totalSchoolhouses,6);
 assert.equal(manifest.m3Candidate.authoredTotal,143);
 assert.equal(manifest.m3Candidate.technicalAccepted,false);
 assert.equal(manifest.m3Candidate.targetNewBrowserCaptures,30);
 assert.equal(manifest.m3Candidate.targetTotalBrowserCaptures,858);
 assert.equal(manifest.m3Candidate.browserExecuted,false);
 assert.equal(manifest.m2Candidate.creatorApproved,0);
});
