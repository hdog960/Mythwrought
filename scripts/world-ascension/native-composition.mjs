// Native proof on the release generator and five detached regional sources.
// Run with the directory containing the six pinned worktrees as its argument.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openCompositionReader, openCompositionSurfaces } from './composition-reader.mjs';

const pins = {
  'release-main': 'aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7',
  'forgotten-sands': '610f18959b59cb17c61d4cbabadb5cdc7650e307',
  frostbound: 'a85fb52c8c1bb00ec78d90c1a8583f13ecdb035e',
  'enchanted-wilds': '8b36b96939d65b39d24305a30a38bcac207e1b9e',
  'shattered-peaks': '74e138c980ca3c0f266e2228210f88ef4d112129',
  underworld: 'bdd83e39790add4e337462176e7b0ac7dd340621'
};
assert.ok(process.argv[2], 'Pass the directory containing the pinned worktrees');
const root = resolve(process.argv[2]);
for (const [directory, head] of Object.entries(pins)) {
  const cwd = resolve(root, directory);
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim(), head, directory);
  assert.equal(execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd, encoding: 'utf8' }).trim(), '', directory);
}
const load = (repo, file) => import(pathToFileURL(resolve(root, repo, 'src', file)).href);
const [profile, { VEILREACH_GENERATOR }, V, H, stream, budget,
  { v6BiomeAt }, { Pack2LiveWorld }, liquids, { meshDepthSection }] = await Promise.all([
  'manual-biomes/profile-world.mjs', 'environment-ground.mjs', 'voxel.mjs', 'world-height.mjs',
  'world-height-stream.mjs', 'world-height-budget.mjs', 'manual-biomes/v6-balanced-biomes.mjs',
  'pack2-world.mjs', 'pack2-integration.mjs', 'depth-mesh.mjs'
].map(file => load('release-main', file)));
const [sands, frost, frostProfile, ponds, wilds, wildsProfile, peaks, decks, stairs, grade] = await Promise.all([
  load('forgotten-sands', 'manual-biomes/forgotten-sands-restored-ground.mjs'),
  load('frostbound', 'frostbound/s4-silverwood-barrens.mjs'),
  load('frostbound', 'manual-biomes/profile-world.mjs'),
  load('frostbound', 'frostbound/s5-frozen-pond.mjs'),
  load('enchanted-wilds', 'manual-biomes/enchanted-wilds-family-source.mjs'),
  load('enchanted-wilds', 'manual-biomes/profile-world.mjs'),
  load('shattered-peaks', 'manual-biomes/shattered-peaks-strata.mjs'),
  load('underworld', 'living-underworld/retained-deck-combined-candidate.mjs'),
  load('underworld', 'living-underworld/exact-qualified-socket.mjs'),
  load('underworld', 'living-underworld/grade-hall-geometry.mjs')
]);
const seed = 179, { BLOCK } = V, { FourRegionWorld, fourRegionProfile } = profile;
const current = new FourRegionWorld(seed, fourRegionProfile(seed, VEILREACH_GENERATOR));
const initialWorld = JSON.stringify(current.save());
const { pond, frozen, surfaceSources } = openCompositionSurfaces(current, V.terrainHeight,
  { sands, frost, frostProfile, ponds, wilds, wildsProfile, peaks });
const { desert: { candidate: desert }, enchanted: { candidate: enchanted }, mountain: { candidate: mountain } } = surfaceSources;

const extraOwners = [];
for (let cx = -41; cx <= -39; cx++) for (let cz = -136; cz <= -134; cz++) extraOwners.push([cx, cz, -5].join(','));
extraOwners.push('-42,-135,-4', '-42,-135,-5', '-42,-136,-4', '-42,-136,-5', '-42,-134,-5', '-43,-135,-4', '-43,-135,-5');
const capture = decks.captureRetainedDeckSource({
  extraOwners, socket: stairs.exactQualifiedSocket(), interlayer: stairs.exactQualifiedInterlayer()
});
let projection;
const caveProof = decks.inspectRetainedDeckCandidate({
  capture, profile: grade.EXACT_STAIR_HALL_PROFILE, joinAir: true,
  inspectProjection: value => { projection = value; }
});
assert.equal(capture.original.seed, seed);
const cuts = new Set([...capture.cuts, ...projection.future]);
assert.equal(cuts.size, 20328);
assert.equal(capture.halo.size, 265096);
for (const [key, expected] of capture.halo) {
  assert.equal(current.get(...key.split(',').map(Number)), expected, 'Released terrain change at ' + key);
}
const caveBelowSurface = [...cuts].filter(key => Number(key.split(',')[1]) < 0);
assert.equal(caveBelowSurface.length, cuts.size);

const { fixture, conflicts } = openCompositionReader({
  current, surfaceSources, pond, frozen, cuts, v6BiomeAt, worldKey: V.worldKey,
  legacyCeiling: H.LEGACY_GENERATION_MAX_Y, air: BLOCK.AIR
});
const world = new Pack2LiveWorld(fixture), released = new Pack2LiveWorld(current);
assert.strictEqual(fixture.upperSourceProfile, current.upperSourceProfile);
let desertCap;
for (let z = -24; z <= 24 && !desertCap; z++) for (let x = 480; x <= 544 && !desertCap; x++) {
  const column = current._columnPlan(x, z), y = Math.max(...column.keys());
  if (column.get(y) === 256 && desert.get(x, y, z) !== 256) desertCap = [x, y, z];
}
assert.ok(desertCap);
const circle = enchanted.wildsSource.landmark(-9, -46);
assert.equal(circle?.name, 'Runestone Circle');
const peaksCap = mountain.terraceColumn(-548, 17);
assert.ok(peaksCap.topY >= 100);
const cut = caveBelowSurface.find(key => {
  const [x, y, z] = key.split(',').map(Number);
  return y < -24 && current.get(x, y, z) !== BLOCK.AIR;
}).split(',').map(Number);
const points = [
  ['sands', desertCap], ['frostbound', [142, pond.iceY, 322]],
  ['wilds', circle.cells[0].slice(0, 3)], ['peaks', [-548, peaksCap.topY, 17]], ['underworld', cut]
];
const digest = array => createHash('sha256').update(Buffer.from(array.buffer, array.byteOffset, array.byteLength)).digest('hex');
const witnesses = [];
for (const [region, point] of points) {
  const [x, y, z] = point, before = released.get(...point), after = world.get(...point);
  assert.notEqual(before, after, region);
  const section = H.runtimeSectionForY(y), cx = Math.floor(x / 16), cz = Math.floor(z / 16);
  const mesh = section < 0 ? meshDepthSection : V.meshChunk;
  const oldVertices = mesh(released, cx, cz, section), vertices = mesh(world, cx, cz, section);
  assert.notEqual(digest(oldVertices), digest(vertices), region);
  witnesses.push({ region, point, before, after, owner: H.runtimeMeshKey(cx, cz, section),
    bytes: vertices.byteLength, hash: digest(vertices) });
}
const water = liquids.pack2WaterSectionVertices(world, 8, 20, 0);
assert.ok(water.byteLength > 0);
assert.deepEqual(world.getPack2State(142, pond.iceY - 1, 322), { id: 76, level: 0, flow: 'still', source: true });

const windows = [];
for (const [region, x, feet, z] of [['sands', desertCap[0] + .5, desertCap[1] + 1, desertCap[2] + .5],
  ['frostbound', 145.5, 8, 323.5], ['wilds', -140.5, 10, -724.5], ['peaks', -547.5, peaksCap.topY + 1, 17.5]]) {
  const visible = stream.planHeightStream(world, { x, feet, z },
    V.chunkWindow(x, z, 2).map(row => ({ ...row, section: 0 })));
  assert.ok(visible.length <= 25);
  let upperOwners = 0, upperBytes = 0;
  for (const { cx, cz, section } of visible.filter(row => row.section > 0)) {
    const bytes = budget.validateUpperSectionGeometry(V.meshChunk(world, cx, cz, section), new Float32Array());
    if (bytes) upperOwners++;
    upperBytes += bytes;
  }
  assert.ok(upperOwners <= budget.UPPER_GPU_OWNERS && upperBytes <= budget.UPPER_RESIDENT_BYTES);
  if (region === 'peaks') assert.ok(upperOwners > 0);
  windows.push({ region, owners: visible.length, upperOwners, upperBytes });
}
for (const [cx, cz] of [[0, 0], [1, 0], [0, -1]]) {
  assert.equal(digest(V.meshChunk(world, cx, cz, 0)), digest(V.meshChunk(released, cx, cz, 0)));
}
for (const point of [desertCap, cut]) {
  const natural = current.get(...point), candidate = world.get(...point);
  assert.ok(current.set(...point, BLOCK.WOOD));
  assert.equal(world.get(...point), BLOCK.WOOD);
  assert.ok(current.set(...point, natural));
  assert.equal(world.get(...point), candidate);
}
assert.equal(JSON.stringify(current.save()), initialWorld);
assert.throws(() => fixture.save(), /no durable world profile/);
console.log(JSON.stringify({ seed, pins, witnesses, pondBytes: water.byteLength,
  caveCells: capture.halo.size, cuts: cuts.size, protectedFloors: capture.floors.size,
  caveJoinedStations: caveProof.joinedReplay.stations,
  windows, disposableEditPrecedence: true,
  historicalSourceConflicts: conflicts.size, releasedSaveUnchanged: true }, null, 2));

if (process.argv.includes('--webgl')) {
  const { qualifyCompositionWebGL } = await import('./webgl-composition.mjs');
  const report = await qualifyCompositionWebGL({ root, pins, seed, witnesses, cuts, world, V });
  console.log(JSON.stringify(report, null, 2));
}
