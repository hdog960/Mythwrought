import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { BLOCK } from '../../src/voxel.mjs';
import { exactQualifiedInterlayer, exactQualifiedSocket } from '../../src/living-underworld/exact-qualified-socket.mjs';
import { auditGalleryEngineWorkingSet } from '../../src/living-underworld/gallery-streaming-working-set.mjs';
import { SOCKET_UNION_PROFILES } from '../../src/living-underworld/grade-hall-geometry.mjs';
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
const profile = SOCKET_UNION_PROFILES.find(({ id }) => id === 'socket-union-tapered');
const result = inspectRetainedDeckCandidate({ capture, profile, joinAir: true, inspectProjection: value => { projection = value; } });
const workingSet = auditGalleryEngineWorkingSet(result.rows.map(row => {
  const [cx, cz, section] = row.key.split(',').map(Number);
  return { key: row.key, cx, cz, section, cuts: row.combinedCuts, faces: row.combinedGrowth };
}));
const owners = new Map(result.rows.map(row => [row.key, row]));
const keys = workingSet.peakEdit.staged;
assert.ok(keys.every(key => owners.has(key)), 'Peak edit must be inside the captured owner union');
let directOriginalCalls = 0;
const view = Object.create(projection.original, {
  get: { value(x, y, z) {
    const key = `${x},${y},${z}`;
    if (capture.cuts.has(key) || projection.future.has(key)) return BLOCK.AIR;
    directOriginalCalls++;
    return projection.original.get(x, y, z);
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
  ok: batch.ok && directOriginalCalls <= limits.originalNaturalReads && meshes.every(mesh => mesh.vertices === mesh.expectedVertices),
  reason: batch.reason ?? null, sharedHalo: batch.theoretical, projectionReads: batch.calls,
  directOriginalCalls, cacheHits: batch.hits, meshes,
};
const budgetPassed = result.peakCost.withinLimits && result.selectedCost.withinLimits &&
  workingSet.maxEditStagedFaces <= limits.faceGrowth && workingSet.maxResidentFaces <= limits.faceGrowth &&
  workingSet.maxEditStagedCuts <= limits.ownedCarves && workingSet.maxResidentCuts <= limits.ownedCarves &&
  workingSet.maxOwnerFaces <= limits.perChunkFaceGrowth && workingSet.maxFullReplacementFaces <= limits.faceGrowth && nativeBatch.ok;

const output = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'world-ascension-interlayer-union');
await mkdir(output, { recursive: true });
const report = { ...result, workingSet, nativeBatch, budgetPassed };
await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  socket: result.socketReplay, interlayer: result.interlayerReplay, joined: result.joinedReplay,
  lowerRoutes: result.lowerRoutes.map(({ label, ok }) => ({ label, ok })), westPatch: result.westPatch,
  airComponents: result.airConnectivity.revisedComponents, lostBoundaryPatches: result.seams.lostPatches,
  stagedFaces: workingSet.maxEditStagedFaces, maxOwnerFaces: workingSet.maxOwnerFaces,
  nativeBatch, budgetPassed, constructionAdmission: result.constructionAdmission,
}, null, 2));

assert.equal(result.socketReplay.ok, true);
assert.equal(result.interlayerReplay.ok, true);
assert.equal(result.joinedReplay?.ok, true);
assert.equal(result.joinedReplay.stations, 211);
assert.equal(result.walking.routes.find(({ label }) => label === 'middle hub')?.ok, true);
assert.equal(result.lowerRoutes.filter(({ ok }) => ok).length, 3);
assert.equal(result.airConnectivity.revisedComponents, 1);
assert.equal(result.seams.lostPatches, 0);
assert.ok(result.westPatch.actualOpenPairs > 0);
assert.equal(nativeBatch.ok, true);
assert.equal(result.sourceSaveUnchanged, true);
assert.equal(result.floorReadback, true);
assert.equal(result.constructionAdmission, false);
assert.equal(JSON.stringify(capture.original.save()), capture.p.initial);
