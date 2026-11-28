import assert from 'node:assert/strict';
import test from 'node:test';
import { ShatteredPeaksSubregionWorld } from '../src/manual-biomes/shattered-peaks-subregions.mjs';
import { ShatteredPeaksStrataWorld } from '../src/manual-biomes/shattered-peaks-strata.mjs';
import { MOUNTAIN_V8_MATERIAL as rock } from '../src/manual-biomes/mountain-v8-materials.mjs';
import { BLOCK, meshChunk, raycast } from '../src/voxel.mjs';
import { runtimeSectionForY } from '../src/world-height.mjs';

test('tilted native rock beds create exposed material bands without changing cliff geometry', () => {
  const original = new ShatteredPeaksSubregionWorld(42), after = new ShatteredPeaksStrataWorld(42);
  const results = [];
  for (const [x, z, material] of [[-512, -154, rock.slate], [-392, -34, rock.gneiss]]) {
    let face, changed = 0;
    for (let dz = -7; dz <= 7; dz++) for (let dx = -7; dx <= 7; dx++) {
      const a = x + dx, b = z + dz, column = original.terraceColumn(a, b);
      assert.deepEqual(after.terraceColumn(a, b), column);
      for (let y = 15; y <= (column?.topY ?? 20) + 1; y++) {
        const before = original.get(a, y, b), next = after.get(a, y, b);
        assert.equal(before === BLOCK.AIR, next === BLOCK.AIR);
        if (before === next) continue;
        assert.ok(y >= 20 && y <= column.topY - 3);
        changed++;
        if (face || next !== material) continue;
        for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          if (after.get(a + dx, y, b + dz) !== BLOCK.AIR) continue;
          face = { point: [a, y, b], eye: [a + dx + .5, y + .5, b + dz + .5], ray: [-dx, 0, -dz] };
          break;
        }
      }
    }
    assert.ok(changed > 0 && face);
    assert.deepEqual(raycast(after, face.eye, face.ray, 2)?.hit, face.point);
    const [a, y, b] = face.point;
    const owner = [Math.floor(a / 16), Math.floor(b / 16), runtimeSectionForY(y)];
    const baseline = meshChunk(original, ...owner), candidate = meshChunk(after, ...owner);
    assert.equal(candidate.byteLength, baseline.byteLength);
    assert.notDeepEqual(candidate, baseline);
    for (let i = 0; i < candidate.length; i += 9) {
      for (const field of [0, 1, 2, 6, 7]) assert.equal(candidate[i + field], baseline[i + field]);
    }
    results.push({ material, changed, face: face.point, owner, bytes: candidate.byteLength });
  }
  assert.throws(() => after.save(), /research requires/);
  console.log('SHATTERED PEAKS NATIVE ROCK BEDS ' + JSON.stringify(results));
});
