import test from 'node:test';
import assert from 'node:assert/strict';
import {examineAllM1,examineBlueprint} from '../../../src/building-pool/roadmap-4/m1-readiness.mjs';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
test('each of 30 M1 candidates gives independent entrance-to-room route evidence',()=>{
  const reports=allM1().map(examineBlueprint);
  assert.equal(reports.length,30);
  for(const r of reports){
    assert.equal(r.entrances,1,r.id);
    assert.ok(r.navigation>0&&r.cells>0,r.id);
    assert.ok(r.rooms.length>=2,r.id);
    assert.ok(r.rooms.every(s=>s.fromEntrance>=0),r.id);
    assert.ok(r.rooms.every(s=>s.tiles>=2),r.id);
    assert.ok(r.rooms.every(s=>s.level===1||s.stairEdges>0),r.id+' upper room bypasses stairs');
  }
});
test('geometry census reports real exposed cube faces and proposed preview buffer volume, not GPU FPS',()=>{
  const audit=examineAllM1();
  assert.equal(audit.designs,30);
  assert.equal(audit.cells,129484);
  assert.equal(audit.navigation,36385);
  assert.equal(audit.rooms,95);
  assert.ok(audit.exposedQuads>150000&&audit.exposedQuads<300000);
  assert.ok(audit.largestPreviewBufferBytes>0);
  // A broad engineering sanity ceiling only, not an iPhone memory-perf acceptance budget.
  assert.ok(audit.largestPreviewBufferBytes<64*1024*1024);
  assert.equal(audit.actualGPUFrameTime,null);
  assert.equal(audit.webgl2Certified,false);
  assert.equal(audit.creatorAccepted,false);
});
test('every symbolic asset actually used records explicit roles, orientations and unresolved contracts',()=>{
  for(const report of examineAllM1().reports){
    for(const asset of report.symbolicAssets){
      assert.ok(/^(pack[1-5]|biome130):\d{3}$/.test(asset.ref),report.id);
      assert.ok(asset.count>0,report.id);
      assert.ok(asset.roles.length&&asset.orientations.length,report.id);
      assert.ok(asset.unresolved.length>0,report.id);
    }
  }
});
test('M1 quality census is deterministic and does not depend on browser, random seeds or game saves',()=>{
  const a=examineBlueprint(allM1()[0]);
  const b=examineBlueprint(allM1()[0]);
  assert.deepEqual(a,b);
  assert.equal(a.worldPlaced,false);
  assert.equal(a.physicalAssetAcceptance,false);
  assert.equal(a.webgl2Measured,false);
});
