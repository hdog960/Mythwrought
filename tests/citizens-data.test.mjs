import assert from 'node:assert/strict';
import test from 'node:test';
import {BIOMES, PROFESSIONS, RACES, citizenBiome} from '../src/citizens/registry.mjs';
import {assignWorkplace, createCitizen, workplaceCompatible} from '../src/citizens/entity.mjs';

const base = {
  worldSeed: 2026, settlementId: 'test-village', slot: 4, race: 'dwarf',
  biome: 'desert', style: 'village', profession: 'blacksmith',
};

test('the roadmap roster has 82 careers and exactly the five designated defenders', () => {
  const professions = Object.values(PROFESSIONS);
  assert.equal(professions.length, 82);
  assert.deepEqual(
    professions.filter(profession => profession.threatResponse === 'defend').map(profession => profession.id).sort(),
    ['gatekeeper', 'guard', 'ranger', 'soldier', 'watchman'],
  );
  const groupCounts = new Map();
  for (const {group, workplaceTags, activity} of professions) {
    groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
    assert(workplaceTags.length > 0);
    assert(activity);
  }
  assert.deepEqual([...groupCounts.values()], [12, 13, 11, 9, 10, 9, 8, 10]);
  assert.equal(PROFESSIONS.banker.dependency, 'banking');
  assert.equal(PROFESSIONS['crystal-attuner'].dependency, 'resonance');
});

test('appearance inputs cover all 4,920 worker tuples and recognize actual biome identifiers', () => {
  assert.deepEqual(Object.keys(RACES), ['human', 'elf', 'dwarf', 'thornkin', 'asteri', 'glassborn']);
  assert.deepEqual(BIOMES, ['temperate', 'desert', 'snow', 'enchanted-forest', 'mountain']);
  assert.equal(citizenBiome('plains'), 'temperate');
  assert.equal(citizenBiome('enchantedForest'), 'enchanted-forest');
  assert.equal(citizenBiome('mountains'), 'mountain');
  assert.throws(() => citizenBiome('ocean'), /biome/i);
  let combinations = 0;
  for (const profession of Object.keys(PROFESSIONS)) for (const race of Object.keys(RACES)) {
    for (const biome of BIOMES) for (const variant of [1, 2]) {
      const citizen = createCitizen({...base, profession, race, biome, variant});
      assert.deepEqual([citizen.profession, citizen.race, citizen.biome, citizen.variant], [profession, race, biome, variant]);
      combinations++;
    }
  }
  assert.equal(combinations, 4920);
});

test('settlement identity and appearance are repeatable and ordinary citizens have no career', () => {
  const professional = createCitizen(base);
  assert.deepEqual(professional, createCitizen(base));
  assert.notEqual(professional.id, createCitizen({...base, slot: 5}).id);
  assert.notEqual(professional.id, createCitizen({...base, settlementId: 'test-town'}).id);
  assert.notEqual(professional.appearanceSeed, createCitizen({...base, biome: 'snow'}).appearanceSeed);
  assert.equal(professional.workplaceId, null);
  assert.equal(professional.type, 'worker');
  const ordinary = createCitizen({...base, profession: null});
  assert.equal(ordinary.type, 'ordinary');
  assert.equal(ordinary.profession, null);
  assert.throws(() => createCitizen({...base, profession: 'unregistered'}), /profession/i);
  assert.throws(() => createCitizen({...base, variant: 3}), /variant/i);
  assert.throws(() => createCitizen({...base, race: 'toString'}), /race/i);
  assert.throws(() => createCitizen({...base, style: 'fortress'}), /style/i);
});

test('workplace assignment preserves career and refuses foreign or incompatible anchors', () => {
  const smith = createCitizen(base);
  const forge = {id: 'forge-a', settlementId: 'test-village', tags: ['anvil']};
  const assigned = assignWorkplace(smith, forge);
  assert.equal(assigned.workplaceId, 'forge-a');
  assert.equal(assigned.profession, 'blacksmith');
  assert.equal(assigned.appearanceSeed, smith.appearanceSeed);
  assert.equal(smith.workplaceId, null);
  assert.deepEqual(assignWorkplace(assigned, null), smith);
  for (const workplace of [{...forge, tags:['bakery']}, {...forge, settlementId:'other'}]) {
    assert.equal(workplaceCompatible(smith, workplace), false);
    assert.throws(() => assignWorkplace(smith, workplace), /workplace/i);
  }
  assert.throws(() => assignWorkplace(createCitizen({...base, profession:null}), forge), /workplace/i);
});
