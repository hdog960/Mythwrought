import assert from 'node:assert/strict';
import test from 'node:test';
import { WildsFamilyResearchWorld } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { inspectWildsLandmarkWalk } from '../../src/manual-biomes/enchanted-wilds-landmark-walk.mjs';
import { surveyWildsMonumentSite } from '../../src/manual-biomes/enchanted-wilds-monument-site.mjs';
import { BLOCK, chunkWindow, meshChunk, raycast } from '../../src/voxel.mjs';
import { physicalRegionAt, runtimeMeshKey } from '../../src/world-height.mjs';
import { UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES, validateUpperSectionGeometry } from '../../src/world-height-budget.mjs';
import { planHeightStream } from '../../src/world-height-stream.mjs';

test('the Observatory proposal fits original supported ground and native owner budgets', () => {
  const world = new WildsFamilyResearchWorld(42), site = { id: 12, x: -204, z: -580, turn: 0 };
  const entry = surveyWildsMonumentSite(world, site);
  assert.ok(entry);
  const { witness, plan, support } = entry;
  assert.equal(plan.name, 'Amethyst Observatory');
  assert.deepEqual(plan.origin, [-204, 9, -580]);
  assert.equal(support, 47);
  const structureOwners = new Set();
  for (const [x, y, z, id] of plan.cells) {
    assert.equal(world.get(x, y, z), BLOCK.AIR);
    assert.equal(witness.get(x, y, z), id);
    structureOwners.add(physicalRegionAt(x, y, z).key);
  }
  assert.ok(structureOwners.size > 1);
  assert.ok(plan.approach.every(point => witness.get(...point) === BLOCK.AIR));
  const route = inspectWildsLandmarkWalk(witness, plan);
  assert.ok(route);
  assert.equal(route.distance, 11);
  assert.ok(route.forward > 0 && route.reverse > 0);

  const roof = plan.cells.find(([, y]) => y === 21);
  const [x, y, z] = roof;
  assert.deepEqual(raycast(witness, [x + .5, y + 3, z + .5], [0, -1, 0], 5)?.hit, [x, y, z]);
  const player = { x: -203.5, feet: 19, z: -579.5 };
  const legacyOwners = chunkWindow(player.x, player.z, 2).map(owner => ({ ...owner, section: 0 }));
  const owners = planHeightStream(witness, player, legacyOwners);
  assert.ok(owners.length <= 25);
  const keys = new Set(owners.map(owner => runtimeMeshKey(owner.cx, owner.cz, owner.section)));
  assert.ok([...structureOwners].every(key => keys.has(key)));
  let upperBytes = 0, usedUpper = 0;
  for (const owner of owners.filter(owner => owner.section > 0)) {
    const mesh = meshChunk(witness, owner.cx, owner.cz, owner.section);
    const bytes = validateUpperSectionGeometry(mesh, new Float32Array());
    if (bytes > 0) usedUpper++;
    upperBytes += bytes;
  }
  assert.ok(usedUpper > 0 && usedUpper <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
  assert.equal(world.edits.size, 0);
  assert.throws(() => witness.save(), /separate save profile/);

  const protectedAir = plan.approach[0];
  const guarded = Object.create(world, { environmentCaves: { value: { get(x, y, z) {
    return [x, y, z].every((value, i) => value === protectedAir[i])
      ? BLOCK.AIR : world.environmentCaves.get(x, y, z);
  } } } });
  assert.equal(surveyWildsMonumentSite(guarded, site), null);
  console.log('WILDS OBSERVATORY GROUND ' + JSON.stringify({
    seed: world.seed, site, cells: plan.cells.length, support, route,
    structureOwners: [...structureOwners].sort(), owners: owners.length, usedUpper, upperBytes
  }));
});
