import test from 'node:test';
import assert from 'node:assert/strict';
import { ShatteredPeaksColossalWorld } from '../src/manual-biomes/shattered-peaks-colossal.mjs';
import { ShatteredPeaksTerraceWorld, SP2_SLOPE } from '../src/manual-biomes/shattered-peaks-terrace.mjs';
import { inspectPhysicalMountainRange } from '../src/manual-biomes/shattered-peaks-range-connectivity.mjs';
import { chunkWindow, collides, meshChunk, raycast } from '../src/voxel.mjs';
import { physicalBodyRegions, runtimeMeshKey } from '../src/world-height.mjs';
import { UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES, validateUpperSectionGeometry } from '../src/world-height-budget.mjs';
import { planHeightStream } from '../src/world-height-stream.mjs';

test('rare connected Y220 crests keep original basal protection and native owner limits', () => {
  const results = [];
  for (const [seed, x, z, originalPeak, crest] of [[19777, -2085, -6157, 217, 221], [33571, -3083, -3049, 212, 220]]) {
    const before = new ShatteredPeaksTerraceWorld(seed), after = new ShatteredPeaksColossalWorld(seed);
    assert.notEqual(before.generationProfile.sourceVersion, after.generationProfile.sourceVersion);
    const baseline = inspectPhysicalMountainRange(before, { x, z });
    const candidate = inspectPhysicalMountainRange(after, { x, z });
    assert.equal(baseline.peak.y, originalPeak);
    assert.equal(candidate.peak.y, crest);
    assert.equal(candidate.protectedChecks, baseline.protectedChecks);
    assert.equal(candidate.admitted, baseline.admitted);
    const high = candidate.components.find(row => row.level === 220);
    assert.equal(high.count, 1);
    assert.ok(high.largest.cells >= 4 && !high.largest.touchesBoundary);
    let raised = 0;
    for (let wz = z - 24; wz <= z + 24; wz++) for (let wx = x - 24; wx <= x + 24; wx++) {
      const old = before.terraceColumn(wx, wz), next = after.terraceColumn(wx, wz);
      if (!old) {
        assert.equal(next, null);
        continue;
      }
      assert.deepEqual([next.cap, next.rawTopY, next.clearance], [old.cap, old.rawTopY, old.clearance]);
      if (next.topY === old.topY) continue;
      raised++;
      assert.ok(next.rawTopY > 202 && next.topY > old.topY && next.topY - old.topY <= 14);
      assert.ok(next.topY <= Math.min(240, next.cap + (next.clearance - 1) * SP2_SLOPE));
    }
    assert.ok(raised >= high.total);

    const { x: px, y, z: pz } = candidate.peak;
    const player = { x: px + .5, feet: y + 1, z: pz + .5 };
    assert.deepEqual(raycast(after, [player.x, y + 3, player.z], [0, -1, 0], 5)?.hit, [px, y, pz]);
    assert.equal(collides(after, player.x, player.feet, player.z), false);
    assert.ok(collides(after, player.x, player.feet - .065, player.z));

    const plan = planHeightStream(after, player, chunkWindow(player.x, player.z, 2).map(owner => ({ ...owner, section: 0 })));
    assert.ok(plan.length <= 25);
    const keys = new Set(plan.map(owner => runtimeMeshKey(owner.cx, owner.cz, owner.section)));
    assert.ok(physicalBodyRegions(player).every(owner => keys.has(owner.key)));
    let upperOwners = 0, upperBytes = 0;
    for (const owner of plan.filter(owner => owner.section > 0)) {
      const vertices = meshChunk(after, owner.cx, owner.cz, owner.section);
      const bytes = validateUpperSectionGeometry(vertices, new Float32Array());
      if (bytes) upperOwners++;
      upperBytes += bytes;
    }
    assert.ok(upperOwners > 0 && upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.throws(() => after.save(), /research requires/);
    results.push({ seed, peak: candidate.peak, previousPeak: baseline.peak.y, raised, connected220: high.largest,
      protectedChecks: candidate.protectedChecks, owners: plan.length, upperOwners, upperBytes });
  }
  console.log('SHATTERED PEAKS COLOSSAL ' + JSON.stringify(results));
});
