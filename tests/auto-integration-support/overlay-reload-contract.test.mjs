import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyOverlayReload } from '../../src/auto-integration-support/overlay-reload-contract.mjs';
const base={seed:'fixed-001',natural:[{x:0,y:2,z:0,blockId:1}],overlay:[{x:0,y:2,z:0,blockId:2}]};
const edit={x:0,y:2,z:0,blockId:1,intent:'player'};
const run=(over={})=>verifyOverlayReload({seed:'fixed-001',initial:base,reloaded:structuredClone(base),edits:[edit],registry:[0,1,2],...over});
test('restoring natural material preserves player intent on reload',()=>{
  const r=run();assert.equal(r.ok,true);assert.equal(r.playerEditCount,1);
  assert.equal(r.saveSchemaVerified,false);assert.equal(r.integrationVerified,false);
});
test('rejects deterministic overlay drift',()=>{
  assert.equal(run({reloaded:{...base,overlay:[]}}).reason,'seeded-world-drift');
});
test('rejects changed seed',()=>{
  assert.equal(run({reloaded:{...base,seed:'different'}}).reason,'seed-or-snapshot-mismatch');
});
test('rejects absent edit provenance',()=>{
  assert.equal(run({edits:[{...edit,intent:undefined}]}).reason,'missing-durable-edit-intent');
});
test('rejects unknown material',()=>{
  assert.equal(run({registry:[0,1]}).reason,'arbitration-rejected');
});
test('does not mutate caller inputs',()=>{
  const initial=structuredClone(base), reloaded=structuredClone(base), edits=[structuredClone(edit)];
  assert.equal(run({initial,reloaded,edits}).ok,true);
  assert.deepEqual(initial,base);assert.deepEqual(reloaded,base);assert.deepEqual(edits,[edit]);
});
