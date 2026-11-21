import assert from 'node:assert/strict';
import test from 'node:test';
import {createCitizen} from '../src/citizens/entity.mjs';
import {buildCitizenMesh, citizenPose, CITIZEN_VERTEX_FLOATS} from '../src/citizens/appearance.mjs';

const person = (overrides = {}) => createCitizen({
  worldSeed: 179, settlementId: 'fixture', slot: 0, race: 'human',
  profession: 'blacksmith', biome: 'temperate', style: 'village', variant: 1, ...overrides,
});

test('six races have distinct geometry and occupied joint groups', () => {
  const signatures = new Set();
  const heights = new Map();
  for (const race of ['human', 'elf', 'dwarf', 'thornkin', 'asteri', 'glassborn']) {
    const mesh = buildCitizenMesh(person({race}));
    assert.equal(mesh.length % (CITIZEN_VERTEX_FLOATS * 3), 0);
    assert(mesh.length > 0 && mesh.every(Number.isFinite));
    const positions = [];
    const joints = new Set();
    let height = 0;
    for (let i = 0; i < mesh.length; i += CITIZEN_VERTEX_FLOATS) {
      positions.push(mesh[i], mesh[i+1], mesh[i+2]);
      height = Math.max(height, mesh[i+1]);
      joints.add(mesh[i+6]);
    }
    signatures.add(positions.join(','));
    heights.set(race, height);
    assert.deepEqual([...joints].sort(), [0, 1, 2, 3, 4, 5]);
  }
  assert.equal(signatures.size, 6);
  assert(heights.get('dwarf') < heights.get('human') && heights.get('elf') > heights.get('human'));
});

test('biome, visible variant and settlement style change the mesh deterministically', () => {
  const original = buildCitizenMesh(person());
  assert.deepEqual(original, buildCitizenMesh(person()));
  for (const override of [{biome:'snow'}, {variant:2}, {style:'city'}, {profession:null}]) {
    assert.notDeepEqual(original, buildCitizenMesh(person(override)));
  }
});

test('walking alternates arms and legs, with distinct flee and action poses', () => {
  const walking = citizenPose('walk', 0.2);
  assert(walking.swing > 0);
  assert(citizenPose('walk', 0.6).swing < 0);
  assert(citizenPose('flee', 0.16).swing > walking.swing);
  assert(citizenPose('idle', 0.2).swing === 0);
  assert(citizenPose('work', 0.2).action > 0);
  assert(citizenPose('damage', 0.2).hurt > 0);
});
