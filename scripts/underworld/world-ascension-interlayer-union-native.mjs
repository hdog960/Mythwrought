import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { editAffectedChunks } from '../../src/chunks.mjs';
import { depthMeshKey, verticalEditSections } from '../../src/depth.mjs';
import { BLOCK } from '../../src/voxel.mjs';
import { exactQualifiedInterlayer, exactQualifiedSocket } from '../../src/living-underworld/exact-qualified-socket.mjs';
import { auditGalleryEngineWorkingSet } from '../../src/living-underworld/gallery-streaming-working-set.mjs';
import { EXACT_STAIR_HALL_PROFILE } from '../../src/living-underworld/grade-hall-geometry.mjs';
import { GALLERY_CONSTRUCTION_LIMITS as limits } from '../../src/living-underworld/physical-gallery-construction.mjs';
import { captureRetainedDeckSource, inspectRetainedDeckCandidate } from '../../src/living-underworld/retained-deck-combined-candidate.mjs';
import { meshReadOnlySharedBatch } from '../../src/living-underworld/shared-native-mesh-snapshot.mjs';

const extraOwners = [];
for (let cx = -41; cx <= -39; cx++) {
  for (let cz = -136; cz <= -134; cz++) extraOwners.push(`${cx},${cz},-5`);
}
extraOwners.push('-42,-135,-4', '-42,-135,-5', '-42,-136,-4', '-42,-136,-5', '-42,-134,-5', '-43,-135,-4', '-43,-135,-5');

const socket = exactQualifiedSocket();
const interlayer = exactQualifiedInterlayer();
const capture = captureRetainedDeckSource({ extraOwners, socket, interlayer });
assert.equal(capture.owners.length, 58);
assert.equal(capture.cuts.size, 18390);
assert.equal(capture.socketConflicts.addedCuts, 693);
assert.deepEqual(capture.interlayerSource, { checkedSupport: 277, checkedAir: 831, addedCuts: 813 });

let projection;
const profile = EXACT_STAIR_HALL_PROFILE;
assert.throws(() => inspectRetainedDeckCandidate({ capture: { ...capture, interlayer: null }, profile }), /HALL_REQUIRES_BOTH_STAIRWAYS/);
const result = inspectRetainedDeckCandidate({ capture, profile, joinAir: true, inspectProjection: value => { projection = value; } });
const workingSet = auditGalleryEngineWorkingSet(result.rows.map(row => {
  const [cx, cz, section] = row.key.split(',').map(Number);
  return { key: row.key, cx, cz, section, cuts: row.combinedCuts, faces: row.combinedGrowth };
}));
const owners = new Map(result.rows.map(row => [row.key, row]));
const { staged: keys, edit } = workingSet.peakEdit;
assert.ok(keys.every(key => owners.has(key)), 'Peak edit must be inside the captured owner union');
const originalByCell = new Map();
const view = Object.create(projection.original, {
  get: { value(x, y, z) {
    const key = `${x},${y},${z}`;
    if (capture.cuts.has(key) || projection.future.has(key)) return BLOCK.AIR;
    if (!originalByCell.has(key)) {
      assert.ok(originalByCell.size < limits.originalNaturalReads, 'Combined original read budget exceeded');
      originalByCell.set(key, projection.original.get(x, y, z));
    }
    return originalByCell.get(key);
  } },
  set: { value() { throw Error('READ_ONLY_NATIVE_PROJECTION'); } },
});
const batch = meshReadOnlySharedBatch(view, keys);
const meshes = batch.meshes.map(({ key, vertices }) => ({
  key, bytes: vertices.byteLength, vertices: vertices.length / 9,
  expectedVertices: owners.get(key).combinedFaces * 6,
  digest: createHash('sha256').update(Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength)).digest('hex'),
}));
const nativeBatch = {
  ok: batch.ok && meshes.every(mesh => mesh.vertices === mesh.expectedVertices),
  reason: batch.reason ?? null, sharedHalo: batch.theoretical, projectionReads: batch.calls,
  directOriginalCalls: originalByCell.size, cacheHits: batch.hits, meshes,
};
assert.equal(nativeBatch.ok, true);

// A disposable edit overlay measures byte-identical owner retention. Old
// resident faces are still charged when a changed owner needs a staging copy.
const [editX, editY, editZ] = edit;
const originalValue = view.get(editX, editY, editZ);
assert.equal(originalValue, BLOCK.DEEPSTONE, 'Measured mining fixture changed');
const edited = Object.create(view, { get: { value(x, y, z) {
  return x === editX && y === editY && z === editZ ? BLOCK.AIR : view.get(x, y, z);
} } });
const editedBatch = meshReadOnlySharedBatch(edited, keys);
assert.equal(editedBatch.ok, true);
const buffer = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength);
const floatsPerFace = 6 * 9;
function changedFaces(before, after) {
  const faceBytes = floatsPerFace * Float32Array.BYTES_PER_ELEMENT;
  const oldBytes = buffer(before), newBytes = buffer(after);
  assert.equal(oldBytes.length % faceBytes, 0);
  assert.equal(newBytes.length % faceBytes, 0);
  const counts = new Map();
  for (const [bytes, delta] of [[oldBytes, -1], [newBytes, 1]]) {
    for (let offset = 0; offset < bytes.length; offset += faceBytes) {
      const record = bytes.toString('base64', offset, offset + faceBytes);
      counts.set(record, (counts.get(record) ?? 0) + delta);
    }
  }
  let removed = 0, added = 0;
  for (const count of counts.values()) {
    removed += Math.max(0, -count);
    added += Math.max(0, count);
  }
  return { removed, added };
}
const editedOwners = editedBatch.meshes.map(({ key, vertices }, index) => {
  const previous = batch.meshes[index];
  assert.equal(previous.key, key);
  const unchanged = buffer(previous.vertices).equals(buffer(vertices));
  const editedFaces = vertices.length / floatsPerFace;
  return { key, unchanged, oldFaces: previous.vertices.length / floatsPerFace, editedFaces,
    changedFaces: changedFaces(previous.vertices, vertices),
    stagedGrowth: unchanged ? 0 : Math.max(0, editedFaces - owners.get(key).oldFaces) };
});
const residentFaces = workingSet.peakEdit.faces - keys.reduce((total, key) => total + owners.get(key).combinedGrowth, 0);
const editReuse = {
  edit, directOriginalCalls: originalByCell.size, owners: editedOwners,
  residentPlusChangedStaging: residentFaces + editedOwners.reduce((total, owner) => total + owner.stagedGrowth, 0),
};
// Measure only the old and new records of this full-cube edit. A renderer
// that patches slots must separately prove buffer capacity and atomicity.
const changedFaceTotal = editedOwners.reduce((total, { changedFaces: { removed, added } }) => total + removed + added, 0);
assert.equal(changedFaceTotal, 6, 'Single deepstone mine should change the six incident face records');
const faceDelta = { changedFaceTotal, residentPlusChangedRecords: residentFaces + changedFaceTotal };
const residentBudgetPassed = workingSet.maxResidentFaces <= limits.faceGrowth &&
  workingSet.maxResidentCuts <= limits.ownedCarves && workingSet.maxOwnerFaces <= limits.perChunkFaceGrowth;
const budgetPassed = residentBudgetPassed && result.peakCost.withinLimits && result.selectedCost.withinLimits &&
  workingSet.maxEditStagedFaces <= limits.faceGrowth && workingSet.maxEditStagedCuts <= limits.ownedCarves &&
  workingSet.maxFullReplacementFaces <= limits.faceGrowth && nativeBatch.ok;

const output = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'world-ascension-interlayer-union');
await mkdir(output, { recursive: true });
const report = { ...result, workingSet, nativeBatch, editReuse, faceDelta, residentBudgetPassed, budgetPassed };
if (process.argv.includes('--with-webgl2')) {
  const adjacentY = editY + 1;
  assert.equal(view.get(editX, adjacentY, editZ), BLOCK.DEEPSTONE);
  const wanted = new Set(workingSet.peak.wanted);
  const adjacentOwners = verticalEditSections(adjacentY).flatMap(section => editAffectedChunks(editX, editZ)
    .map(({ cx, cz }) => depthMeshKey(cx, cz, section))).filter(key => wanted.has(key));
  assert.deepEqual(new Set(adjacentOwners), new Set(keys));
  const replaceAdjacent = id => Object.create(edited, { get: { value(x, y, z) {
    return x === editX && y === adjacentY && z === editZ ? id : edited.get(x, y, z);
  } } });
  const [otherX, otherY, otherZ] = [-655, -30, -2170];
  assert.equal(projection.projectedAt(otherX, otherY, otherZ), BLOCK.STONE);
  assert.equal(capture.floors.has([otherX, otherY, otherZ].join(',')), false);
  const otherKeys = verticalEditSections(otherY).flatMap(section => editAffectedChunks(otherX, otherZ)
    .map(({ cx, cz }) => depthMeshKey(cx, cz, section))).filter(key => wanted.has(key));
  assert.deepEqual(otherKeys, ['-41,-136,-2']);
  assert.ok(!keys.includes(otherKeys[0]));
  const otherView = Object.create(projection.view, { get: { value(x, y, z) {
    return x === otherX && y === otherY && z === otherZ ? BLOCK.AIR : projection.projectedAt(x, y, z);
  } } });
  const otherMined = meshReadOnlySharedBatch(otherView, otherKeys);
  const otherRestored = meshReadOnlySharedBatch(projection.view, otherKeys);
  const bothMined = meshReadOnlySharedBatch(replaceAdjacent(BLOCK.AIR), keys);
  assert.ok(bothMined.ok && otherMined.ok && otherRestored.ok);
  const nativeSequence = [
    ['mine', editedBatch],
    ['mine-adjacent', bothMined],
    ['refuse-third-mine', { ok: true, meshes: [...bothMined.meshes, ...otherMined.meshes] }, 'Shared slots refused'],
    ['place-stone', meshReadOnlySharedBatch(replaceAdjacent(BLOCK.STONE), keys)],
    ['restore-original', batch],
    ['mine-other-owner', otherMined],
    ['restore-other-owner', otherRestored],
  ];
  const edits = nativeSequence.map(([label, stage, refusal]) => {
    assert.equal(stage.ok, true, label);
    return { label, meshes: stage.meshes, refusal };
  });
  const { qualifyEditTransaction } = await import('./world-ascension-edit-transaction-webgl2.mjs');
  report.gpuEdit = await qualifyEditTransaction({ projection, workingSet, owners, edits, faceLimit: limits.faceGrowth });
  assert.equal(report.gpuEdit.residentFaces, residentFaces);
  assert.equal(report.gpuEdit.steps[0].uploads, faceDelta.changedFaceTotal);
  assert.ok(report.gpuEdit.peakStagedFaces <= limits.faceGrowth);
  assert.equal(report.gpuEdit.steps.at(-2).label, 'mine-other-owner');
  assert.ok(report.gpuEdit.steps.at(-2).uploads > 0);
  report.gpuEdit.otherEdit = { at: [otherX, otherY, otherZ], keys: otherKeys, sourceReads: otherMined.calls };
  report.gpuEdit.directOriginalCalls = originalByCell.size;
}
await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  socket: result.socketReplay, interlayer: result.interlayerReplay, joined: result.joinedReplay,
  lowerRoutes: result.lowerRoutes.map(({ label, ok }) => ({ label, ok })), westPatch: result.westPatch,
  airComponents: result.airConnectivity.revisedComponents, lostBoundaryPatches: result.seams.lostPatches,
  stagedFaces: workingSet.maxEditStagedFaces, maxOwnerFaces: workingSet.maxOwnerFaces,
  residentFaces: workingSet.maxResidentFaces, residentBudgetPassed,
  nativeBatch, editReuse, faceDelta, gpuEdit: report.gpuEdit, budgetPassed, constructionAdmission: result.constructionAdmission,
}, null, 2));

assert.equal(result.socketReplay.ok, true);
assert.equal(result.interlayerReplay.ok, true);
assert.equal(result.joinedReplay?.ok, true);
assert.equal(result.joinedReplay.stations, 211);
assert.equal(result.walking.routes.find(({ label }) => label === 'middle hub')?.ok, true);
const westernApproach = result.walking.routes.find(({ label }) => label === 'phase48 52-station endpoint');
assert.equal(westernApproach?.ok, true);
assert.equal(westernApproach.stations, 52);
assert.equal(result.lowerRoutes.filter(({ ok }) => ok).length, 3);
assert.equal(result.airConnectivity.revisedComponents, 1);
assert.equal(result.seams.lostPatches, 0);
assert.ok(result.westPatch.actualOpenPairs > 0);
assert.equal(result.sourceSaveUnchanged, true);
assert.equal(result.floorReadback, true);
assert.equal(residentBudgetPassed, true);
assert.equal(result.constructionAdmission, false);
assert.equal(JSON.stringify(capture.original.save()), capture.p.initial);
