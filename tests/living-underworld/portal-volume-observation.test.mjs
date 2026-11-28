import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { BLOCK, baseBlock, VoxelWorld } from '../../src/voxel.mjs';
import { FourRegionWorld, fourRegionProfile, M7_ENVIRONMENT_GENERATOR } from '../../src/manual-biomes/profile-world.mjs';
import { openPortalVolumeObservation } from '../../src/living-underworld/portal-volume-observation.mjs';
import { surveyCrossRegionGallery } from '../../src/living-underworld/cross-region-gallery.mjs';
import { traverseRetainedDescent } from '../../src/living-underworld/retained-switchback-descent-route.mjs';

test('released cave identity qualifies a bounded socket and holds other candidate volumes', async () => {
  const root = process.env.UNIFIED_GAME_SOURCE, sourceRevision = 'aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7';
  assert.ok(root, 'UNIFIED_GAME_SOURCE must point to the pinned release checkout');
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), sourceRevision);
  const load = file => import(pathToFileURL(resolve(root, 'src', file)).href);
  const [P, { VEILREACH_GENERATOR }] = await Promise.all(['manual-biomes/profile-world.mjs', 'environment-ground.mjs'].map(load));
  const seed = 179, original = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
  const released = new P.FourRegionWorld(seed, P.fourRegionProfile(seed, VEILREACH_GENERATOR));
  const saved = JSON.stringify(released.save()), legacy = new VoxelWorld(seed);
  const originalProtected = (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed);
  const gallery = surveyCrossRegionGallery(original, { rx: -3, rz: -9, axis: 'x', level: 0, reach: 16, originalProtected });
  assert.equal(gallery?.cuts.size, 297);
  assert.equal(traverseRetainedDescent(gallery.witness, gallery.route).ok, true);
  assert.equal(traverseRetainedDescent(gallery.witness, [...gallery.route].reverse()).ok, true);
  const survey = openPortalVolumeObservation({ original, released, sourceRevision, gallery, originalProtected });
  assert.equal(survey.observedCells, 2205);
  const { socket, identity, coverage } = survey, { x, feet, z } = socket;
  assert.deepEqual(socket, { x: -512, feet: -30, z: -2178, axis: 'x', routeStations: 33,
    support: [-512, -31, -2178], body: [[-512, -30, -2178], [-512, -29, -2178]] });
  assert.ok(socket.body.every(point => gallery.witness.get(...point) === BLOCK.AIR));
  assert.notEqual(gallery.witness.get(...socket.support), BLOCK.AIR);
  const point = (x, y, z) => ({ minX: x, maxX: x, minY: y, maxY: y, minZ: z, maxZ: z });
  assert.deepEqual(survey.inspect(point(x, feet, z), identity),
    { state: 'conflict', reason: 'reserved-cave-route', cell: [x, feet, z] });
  assert.deepEqual(survey.inspect(point(...socket.support), identity),
    { state: 'conflict', reason: 'reserved-cave-route', cell: socket.support });
  const wider = { minX: x - 128, maxX: x + 127, minY: feet - 40, maxY: feet, minZ: z - 128, maxZ: z + 127 };
  assert.equal(survey.inspect(wider, identity).state, 'conflict');
  assert.deepEqual(survey.inspect(point(x + 1000, feet, z + 1000), identity), { state: 'unknown', reason: 'outside-survey' });
  assert.deepEqual(survey.inspect(point(x, feet, z), { ...identity, revision: '0'.repeat(40) }),
    { state: 'unknown', reason: 'source-identity' });
  const clear = [coverage.minX, coverage.minY, coverage.minZ], existing = released.get(...clear);
  assert.deepEqual(survey.inspect(point(...clear), identity), { state: 'observed-clear' });
  assert.equal(released.set(...clear, BLOCK.AIR), true);
  assert.deepEqual(survey.inspect(point(...clear), identity), { state: 'conflict', reason: 'player-edit', cell: clear });
  assert.equal(released.set(...clear, existing), true);
  assert.equal(JSON.stringify(released.save()), saved);
  assert.throws(() => openPortalVolumeObservation({ original, released, sourceRevision, gallery,
    originalProtected: (...cell) => cell.every((coordinate, i) => coordinate === socket.support[i]) || originalProtected(...cell) }),
  /Portal source changed/);
  console.log('LIVING UNDERWORLD PORTAL OBSERVATION ' + JSON.stringify({ identity, coverage, socket,
    observedCells: survey.observedCells, verifiedRouteCells: gallery.support.size + gallery.clearance.size, clear }));
});
