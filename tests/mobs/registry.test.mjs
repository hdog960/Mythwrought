import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpecies, normalizeSpecies, speciesRegistry } from '../../src/mobs/species.mjs';

const passive = 'cow sheep pig chicken horse deer rabbit fox mountain-goat wolf duskhorn moonmoth glassback frosthorn mossback sunskipper cloudfinch glownewt reedwhisker emberwing'.split(' ');
const hostile = 'zombie skeleton giant-spider goblin slime wraith troll harpy mimic gargoyle shardmaw thornwraith hollowbound sandstalker frostwraith stoneclaw gloomcrawler ashfang briarlurker voidmoth'.split(' ');

test('the approved symbolic roster has exactly 20 passive and 20 hostile species', () => {
  assert.deepEqual(speciesRegistry.filter(entry => entry.classification === 'passive').map(entry => entry.id), passive);
  assert.deepEqual(speciesRegistry.filter(entry => entry.classification === 'hostile').map(entry => entry.id), hostile);
  assert.equal(new Set(speciesRegistry.map(entry => entry.id)).size, 40);
  assert.equal(getSpecies(6), undefined);
  assert.equal(getSpecies('constructor'), undefined);
});

test('only Deer, Goblin and Glownewt have an implementation scheduled for the preview', () => {
  assert.deepEqual(speciesRegistry.filter(entry => entry.implementation === 'preview').map(entry => entry.id).sort(),
    ['deer', 'glownewt', 'goblin']);
  assert.equal(getSpecies('deer').bonding.eligible, false);
  assert.equal(getSpecies('glownewt').bonding.eligible, true);
  assert.deepEqual(getSpecies('goblin').interactions, ['door']);
});

test('normalization is deterministic, independent of input ordering, and deeply immutable', () => {
  const deer = getSpecies('deer');
  const copy = structuredClone(deer);
  copy.habitat.biomes.reverse();
  const reordered = Object.fromEntries(Object.entries(copy).reverse());
  assert.deepEqual(normalizeSpecies(reordered), deer);
  assert.throws(() => deer.body.radius = 9, TypeError);
  assert.throws(() => deer.habitat.biomes.push('unknown'), TypeError);
});

test('malformed data and unrecognized world interactions fail closed', () => {
  const invalid = [
    { id: '12' }, { id: 'bad_id' }, { classification: 'neutral' },
    { displayName: '   ' }, { body: { radius: Infinity, height: 1 } },
    { movement: { ...getSpecies('deer').movement, capabilities: ['warp'] } },
    { habitat: { ...getSpecies('deer').habitat, depth: [3, -20] } },
    { population: { localLimit: -1, rarity: .5 } },
    { interactions: ['mine'] }, { combat: { ...getSpecies('deer').combat, damage: -1 } },
    { implementation: 'shipped' }
  ];
  for (const patch of invalid) assert.throws(() => normalizeSpecies({ ...getSpecies('deer'), ...patch }), TypeError);
});
