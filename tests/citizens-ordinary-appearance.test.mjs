import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {buildCitizenMesh} from '../src/citizens/appearance.mjs';
import {createCitizen} from '../src/citizens/entity.mjs';
import {ordinaryAppearancePool} from '../src/citizens/ordinary-appearance.mjs';

test('ordinary pool provides ten distinct nonworkers per biome and supports six races', () => {
  const races = new Set();
  const meshes = new Set();
  for (const biome of ['temperate','desert','snow','enchanted-forest','mountain']) {
    const pool = ordinaryAppearancePool(biome);
    assert.equal(pool.length,10);
    for (const config of pool) {
      const citizen = createCitizen({worldSeed:179,settlementId:'gallery',slot:0,style:'village',...config});
      assert.equal(citizen.profession,null);
      assert.equal(citizen.type,'ordinary');
      races.add(citizen.race);
      meshes.add(createHash('sha256').update(Buffer.from(buildCitizenMesh(citizen).buffer)).digest('hex'));
    }
    assert.deepEqual(pool,ordinaryAppearancePool(biome));
  }
  assert.equal(races.size,6);
  assert.equal(meshes.size,50);
  assert.deepEqual(ordinaryAppearancePool('plains'),ordinaryAppearancePool('temperate'));
});
