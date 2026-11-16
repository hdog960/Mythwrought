import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {BIOMES,SIZES,CATEGORY_QUOTAS,SOURCE_HEAD,blueprintId,plannedSlots,inventory} from "../../../src/building-pool/roadmap-2a/catalog.mjs";
const manifest=JSON.parse(readFileSync(new URL("../../../src/building-pool/roadmap-2a/manifest.json",import.meta.url),"utf8"));
const roster=JSON.parse(readFileSync(new URL("../../../docs/building-pool/EIGHT_LANE_ROSTER.json",import.meta.url),"utf8"));
const slots=plannedSlots();
test("M0 has exactly 420 unique reserved IDs, not fake authored blueprints",()=>{
 assert.equal(slots.length,420);
 assert.equal(new Set(slots.map(x=>x.id)).size,420);
 assert.equal(slots.filter(x=>x.status==="authored-candidate"&&x.authoredHere).length,32);
 assert.equal(slots.filter(x=>x.status==="reserved-not-authored"&&!x.authoredHere).length,388);
 assert.deepEqual(inventory().byCategory,{"general-store":75,"pet-shop":75,"magic-shop":75,"potion-shop":75,"bakery":75,"bank":45});
});
test("every category has its exact biome/size distribution",()=>{
 for(const [category,count] of Object.entries(CATEGORY_QUOTAS))for(const biome of BIOMES)for(const size of SIZES){
  const pool=slots.filter(x=>x.category===category&&x.biome===biome&&x.size===size);
  assert.equal(pool.length,count);
  assert.deepEqual(pool.map(x=>x.variation),Array.from({length:count},(_,i)=>i+1));
 }
});
test("15 original store identities carried as a read-only migration queue, no temples",()=>{
 assert.equal(manifest.legacyCandidates.length,15);
 assert.deepEqual(new Set(manifest.legacyCandidates.map(x=>x.id)),new Set(slots.filter(x=>x.legacySourceCandidate).map(x=>x.id)));
 assert.ok(manifest.legacyCandidates.every(x=>x.id===blueprintId("general-store",x.biome,x.size,1)&&x.migrationState==="source-exact-parity-verified"&&/^[0-9a-f]{64}$/.test(x.geometryFingerprint)&&/^[0-9a-f]{64}$/.test(x.fullBlueprintSHA256)));
 assert.ok(slots.every(x=>!x.id.includes(":temple:")));
});
test("legacy exact source HEAD, blob provenance and safe destination prefixes are pinned",()=>{
 assert.equal(manifest.sourcePr,124);
 assert.equal(manifest.sourceHead,SOURCE_HEAD);
 assert.match(SOURCE_HEAD,/^[0-9a-f]{40}$/);
 assert.ok(manifest.legacyCandidates.every(x=>x.sourcePath.startsWith("src/building-pool/roadmap-2/")&&x.destination.startsWith("src/building-pool/roadmap-2a/")&&/^[0-9a-f]{40}$/.test(x.sourceBlob)));
 assert.equal(manifest.legacyCandidates.filter(x=>x.sourcePath.endsWith("/temperate-store.mjs")).length,1);
 assert.equal(manifest.legacyCandidates.filter(x=>x.sourcePath.endsWith("/m1-representatives.mjs")).length,14);
});
test("no inherited design silently marked migrated, accepted or integrated",()=>{
 assert.equal(manifest.legacySourceCandidates,15);
 assert.equal(manifest.locallyMigratedAndParityVerified,15);
 assert.equal(manifest.authoredCandidateTotal,32);
 assert.equal(manifest.newlyAuthored,17);
 assert.equal(manifest.creatorApproved,0);
 assert.equal(manifest.integratedIntoGame,0);
 assert.equal(manifest.unwrittenNewCandidates,388);
 assert.equal(inventory().legacySourceCandidates,15);
 assert.equal(inventory().locallyMigrated,15);
 assert.equal(inventory().authoredCandidateTotal,32);
});
test("all eight builders have exclusive categories and correct shared roster totals",()=>{
 assert.equal(roster.lanes.length,8);
 const used=new Map();
 for(const lane of roster.lanes){for(const category of Object.keys(lane.categories)){
  assert.equal(used.has(category),false,`collision: ${category} in ${lane.lane} and ${used.get(category)}`);used.set(category,lane.lane);
 }}
 const lane=roster.lanes.find(x=>x.lane==="roadmap-2a");
 assert.deepEqual(lane.categories,inventory().byCategory);
 assert.equal(roster.lanes.reduce((a,x)=>a+x.planned,0),3030);
 assert.equal(roster.lanes.reduce((a,x)=>a+x.inherited,0),135);
 assert.equal(roster.lanes.reduce((a,x)=>a+x.remaining,0),2895);
});
test("no shared source ownership, production edits or save/ID registration",()=>{
 assert.deepEqual(manifest.ownerPaths,["src/building-pool/roadmap-2a/","tests/building-pool/roadmap-2a/","docs/building-pool/roadmap-2a/"]);
 assert.equal(manifest.integratedIntoGame,0);
 assert.ok(!Object.values(manifest).some(x=>x==="ready-for-production"));
});
