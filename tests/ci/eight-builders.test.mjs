import test from 'node:test';
import assert from 'node:assert/strict';
import {BUILDER_LANES,LANES,laneForPath,classifyPaths} from '../../scripts/ci/scope.mjs';
test('eight isolated owners and documented branches',()=>{
 assert.equal(BUILDER_LANES.length,8);assert.equal(LANES.length,17);
 for(const l of BUILDER_LANES){
  for(const root of ['src','tests','docs'])assert.equal(laneForPath(root+'/building-pool/'+l+'/x.mjs'),l);
  assert.deepEqual(classifyPaths(['src/building-pool/'+l+'/x.mjs']).lanes,[l]);
 }
});
test('docs only and shared fallback are never confused',()=>{
 assert.equal(classifyPaths(['docs/building-pool/roadmap-1a/notes.md']).mode,'docs-only');
 assert.equal(classifyPaths(['docs/building-pool/roadmap-1a/meta.json']).mode,'isolated');
 for(const p of ['src/main.mjs','src/builder-assets/manual-five-pack.mjs','docs/building-pool/README.md','.github/workflows/ci.yml','src/building-pool/roadmap-2c/a.mjs','src/building-pool/roadmap-1a/../roadmap-1b/x.mjs'])assert.equal(classifyPaths([p]).mode,'full',p);
 assert.deepEqual(classifyPaths(['src/building-pool/roadmap-1a/a.mjs','tests/building-pool/roadmap-4b/b.test.mjs']).lanes,['roadmap-1a','roadmap-4b']);
});
