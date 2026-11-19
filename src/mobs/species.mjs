const movements = ['walk', 'swim', 'fly', 'climb', 'jump', 'crawl'];
const biomes = ['meadow', 'forest', 'wetland', 'alpine', 'desert', 'snow', 'cave', 'volcanic'];
const interactions = ['door', 'switch', 'climb-surface'];
const implementations = ['preview', 'definition'];

function check(condition, field) {
  if (!condition) throw new TypeError('Invalid mob species ' + field);
}

function object(value, field) {
  check(value && typeof value === 'object' && !Array.isArray(value), field);
  return value;
}

function number(value, min, max, field) {
  check(Number.isFinite(value) && value >= min && value <= max, field);
  return value;
}

function integer(value, min, max, field) {
  check(Number.isInteger(value), field);
  return number(value, min, max, field);
}

function choice(value, options, field) {
  check(options.includes(value), field);
  return value;
}

function tags(value, options, field, minimum = 0) {
  check(Array.isArray(value) && value.length >= minimum &&
    new Set(value).size === value.length && value.every(tag => options.includes(tag)), field);
  return Object.freeze([...value].sort());
}

function range(value, min, max, field) {
  check(Array.isArray(value) && value.length === 2 && value[0] <= value[1], field);
  return Object.freeze(value.map(entry => number(entry, min, max, field)));
}

function flag(value, field) {
  check(typeof value === 'boolean', field);
  return value;
}

export function normalizeSpecies(input) {
  const {
    id, displayName, classification, body, movement, habitat, combat, perception,
    population, behavior, bonding, breeding, riding, interactions: permissions,
    render, lifecycle, implementation
  } = object(input, 'record');
  check(typeof id === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) && id.length <= 40, 'id');
  check(typeof displayName === 'string' && displayName.trim().length > 0 && displayName.trim().length <= 48, 'name');
  for (const [key, value] of Object.entries({ body, movement, habitat, combat, perception,
    population, behavior, bonding, breeding, riding, render, lifecycle })) object(value, key);
  const entry = {
    id,
    displayName: displayName.trim(),
    classification: choice(classification, ['passive', 'hostile'], 'classification'),
    body: Object.freeze({
      radius: number(body.radius, .08, 1.25, 'radius'),
      height: number(body.height, .12, 3.5, 'height'),
      collision: choice(body.collision, ['aabb'], 'collision profile')
    }),
    movement: Object.freeze({
      capabilities: tags(movement.capabilities, movements, 'movement capabilities', 1),
      speed: number(movement.speed, .2, 8, 'speed'),
      stepHeight: number(movement.stepHeight, 0, 1.01, 'step height')
    }),
    habitat: Object.freeze({
      biomes: tags(habitat.biomes, biomes, 'habitat biomes', 1),
      depth: range(habitat.depth, -230, 32, 'depth'),
      light: range(habitat.light, 0, 1, 'light')
    }),
    combat: Object.freeze({
      health: number(combat.health, 1, 500, 'health'),
      damage: number(combat.damage, 0, 100, 'damage'),
      reach: number(combat.reach, .1, 5, 'reach'),
      windup: number(combat.windup, .1, 5, 'windup'),
      cooldown: number(combat.cooldown, .1, 15, 'cooldown')
    }),
    perception: Object.freeze({
      sight: number(perception.sight, 1, 24, 'sight'),
      hearing: number(perception.hearing, 0, 24, 'hearing'),
      threat: choice(perception.threat, ['avoid', 'defend', 'hunt'], 'threat')
    }),
    population: Object.freeze({
      localLimit: integer(population.localLimit, 1, 16, 'local population limit'),
      rarity: number(population.rarity, .01, 1, 'rarity')
    }),
    behavior: Object.freeze({
      social: choice(behavior.social, ['solitary', 'pair', 'herd', 'pack'], 'social behavior'),
      territory: number(behavior.territory, 2, 40, 'territory'),
      defensive: flag(behavior.defensive, 'defensive behavior'),
      grazes: flag(behavior.grazes, 'grazing')
    }),
    bonding: Object.freeze({ eligible: flag(bonding.eligible, 'bonding') }),
    breeding: Object.freeze({ eligible: flag(breeding.eligible, 'breeding') }),
    riding: Object.freeze({ eligible: flag(riding.eligible, 'riding') }),
    interactions: tags(permissions, interactions, 'environment interactions'),
    render: Object.freeze({
      model: choice(render.model, ['deer', 'goblin', 'glownewt', 'unassigned'], 'render model'),
      animation: choice(render.animation, ['biped', 'quadruped', 'crawler', 'winged', 'floating'], 'animation')
    }),
    lifecycle: Object.freeze({
      replenishes: flag(lifecycle.replenishes, 'replenishment'),
      persistence: choice(lifecycle.persistence, ['transient', 'bonded'], 'persistence eligibility')
    }),
    implementation: choice(implementation, implementations, 'implementation')
  };
  check(entry.bonding.eligible === (entry.lifecycle.persistence === 'bonded'), 'bonded persistence');
  check(!entry.riding.eligible || entry.movement.capabilities.includes('walk'), 'riding capability');
  check(entry.implementation === 'definition' ? entry.render.model === 'unassigned' :
    entry.render.model === entry.id && entry.movement.capabilities.includes('walk'), 'implementation model');
  return Object.freeze(entry);
}

// Profile values are provisional gameplay parameters for the isolated foundation.
const passive = [
  ['cow', 'Cow', 'meadow forest', .47, 1.45, 31, 1.4, 'herd', 'walk', true, true],
  ['sheep', 'Sheep', 'meadow alpine', .33, 1.02, 22, 1.5, 'herd', 'walk', true, true],
  ['pig', 'Pig', 'meadow forest', .34, .90, 23, 1.5, 'herd', 'walk', true, false],
  ['chicken', 'Chicken', 'meadow forest', .18, .49, 8, 1.7, 'herd', 'walk', true, false, false, 'biped'],
  ['horse', 'Horse', 'meadow alpine', .48, 1.72, 42, 2.5, 'herd', 'walk jump', true, true, true],
  ['deer', 'Deer', 'forest meadow', .38, 1.46, 26, 2.65, 'herd', 'walk', true, true],
  ['rabbit', 'Rabbit', 'meadow forest', .17, .38, 7, 2.4, 'pair', 'walk jump', true, true],
  ['fox', 'Fox', 'forest snow', .24, .62, 15, 2.65, 'pair', 'walk jump', true, false],
  ['mountain-goat', 'Mountain Goat', 'alpine snow', .30, .97, 24, 1.9, 'herd', 'walk climb', true, true],
  ['wolf', 'Wolf', 'forest snow', .34, .82, 26, 2.5, 'pack', 'walk jump', true, false],
  ['duskhorn', 'Duskhorn', 'forest meadow', .43, 1.58, 35, 1.9, 'herd', 'walk', true, true],
  ['moonmoth', 'Moonmoth', 'forest cave', .16, .25, 6, 1.5, 'pair', 'fly', false, false],
  ['glassback', 'Glassback', 'desert cave', .38, .74, 29, 1.1, 'solitary', 'walk crawl', false, false],
  ['frosthorn', 'Frosthorn', 'snow alpine', .53, 1.73, 42, 1.55, 'herd', 'walk', true, true],
  ['mossback', 'Mossback', 'wetland forest', .50, .83, 36, .85, 'pair', 'walk swim', false, true],
  ['sunskipper', 'Sunskipper', 'meadow desert', .22, .46, 10, 2.8, 'pair', 'walk jump', true, false],
  ['cloudfinch', 'Cloudfinch', 'alpine forest', .15, .31, 7, 2.15, 'herd', 'fly', false, false],
  ['glownewt', 'Glownewt', 'cave wetland', .22, .38, 18, 1.95, 'pair', 'walk', false, false, false, 'crawler'],
  ['reedwhisker', 'Reedwhisker', 'wetland', .25, .48, 16, 1.8, 'pair', 'walk swim', true, false],
  ['emberwing', 'Emberwing', 'volcanic alpine', .24, .51, 18, 2.1, 'pair', 'fly', false, false]
];

const hostile = [
  ['zombie', 'Zombie', 'forest cave', .30, 1.66, 32, 1.25, 'solitary', 'walk', 5],
  ['skeleton', 'Skeleton', 'cave desert', .28, 1.63, 24, 1.55, 'solitary', 'walk', 5],
  ['giant-spider', 'Giant Spider', 'cave forest', .46, .68, 24, 2.3, 'solitary', 'walk climb crawl', 6],
  ['goblin', 'Goblin', 'cave forest', .28, 1.28, 31, 2.05, 'pack', 'walk', 7, ['door']],
  ['slime', 'Slime', 'wetland cave', .36, .58, 23, 1.2, 'solitary', 'walk jump', 3],
  ['wraith', 'Wraith', 'cave snow', .28, 1.57, 26, 1.7, 'solitary', 'fly', 8],
  ['troll', 'Troll', 'cave alpine', .59, 2.48, 74, 1.3, 'solitary', 'walk', 13],
  ['harpy', 'Harpy', 'alpine', .32, 1.35, 28, 2.5, 'pair', 'fly walk', 7],
  ['mimic', 'Mimic', 'cave', .36, .71, 42, 1.4, 'solitary', 'walk crawl', 10],
  ['gargoyle', 'Gargoyle', 'alpine cave', .43, 1.49, 48, 1.3, 'pair', 'fly walk', 9],
  ['shardmaw', 'Shardmaw', 'cave', .51, .93, 46, 1.65, 'solitary', 'walk crawl', 9],
  ['thornwraith', 'Thornwraith', 'forest', .30, 1.73, 32, 1.5, 'solitary', 'walk', 7],
  ['hollowbound', 'Hollowbound', 'cave forest', .36, 1.85, 38, 1.35, 'solitary', 'walk', 8],
  ['sandstalker', 'Sandstalker', 'desert', .35, .65, 29, 2.6, 'pair', 'walk crawl', 6],
  ['frostwraith', 'Frostwraith', 'snow cave', .30, 1.53, 34, 1.85, 'solitary', 'fly', 8],
  ['stoneclaw', 'Stoneclaw', 'alpine cave', .44, 1.19, 45, 1.55, 'pair', 'walk climb', 8, ['climb-surface']],
  ['gloomcrawler', 'Gloomcrawler', 'cave', .32, .48, 22, 2.05, 'pack', 'walk climb crawl', 5],
  ['ashfang', 'Ashfang', 'volcanic cave', .37, .83, 37, 2.35, 'pack', 'walk jump', 8],
  ['briarlurker', 'Briarlurker', 'forest wetland', .31, .72, 27, 1.85, 'solitary', 'walk crawl', 6],
  ['voidmoth', 'Voidmoth', 'cave', .22, .42, 24, 2.05, 'pair', 'fly', 6]
];

function baseProfile({
  id, displayName, habitatTags, radius, height, health, speed, social, modes,
  canBreed = false, grazes = false, rides = false, damage = 0, permissions = [], animation
}, classification, index) {
  const isHostile = classification === 'hostile';
  const canBond = id === 'glownewt';
  const model = ['deer', 'goblin', 'glownewt'].includes(id) ? id : 'unassigned';
  const habitatBiomes = habitatTags.split(' ');
  const capabilities = modes.split(' ');
  const cave = habitatBiomes.includes('cave');
  const grouped = social === 'herd' || social === 'pack';
  const animationStyle = animation ?? (capabilities.includes('fly') ?
    (id.endsWith('wraith') ? 'floating' : 'winged') :
    (isHostile ? (capabilities.includes('crawl') ? 'crawler' :
      (id === 'ashfang' ? 'quadruped' : 'biped')) : 'quadruped'));
  return normalizeSpecies({
    id, displayName, classification,
    body: { radius, height, collision: 'aabb' },
    movement: { capabilities, speed, stepHeight: id === 'glownewt' ? .51 : .76 },
    habitat: {
      biomes: habitatBiomes,
      depth: [cave ? (isHostile ? -216 : -120) : -8, habitatBiomes.length === 1 && cave ? -4 : 20],
      light: [cave ? 0 : .2, cave && habitatBiomes.length === 1 ? .45 : 1]
    },
    combat: {
      health, damage: canBond ? 2 : damage,
      reach: isHostile ? 1.35 : .8, windup: isHostile ? .55 : .4, cooldown: isHostile ? 1.1 : 3
    },
    perception: { sight: isHostile ? 11 : 8, hearing: isHostile ? 8 : 6,
      threat: isHostile ? 'hunt' : canBond || id === 'wolf' ? 'defend' : 'avoid' },
    population: { localLimit: grouped ? (isHostile ? 3 : 4) : social === 'pair' ? 2 : 1,
      rarity: index < 10 ? .75 : .35 },
    behavior: { social, territory: isHostile ? 14 : 9,
      defensive: isHostile || canBond || id === 'wolf', grazes },
    bonding: { eligible: canBond },
    breeding: { eligible: canBreed },
    riding: { eligible: rides },
    interactions: permissions,
    render: { model, animation: animationStyle },
    lifecycle: { replenishes: true, persistence: canBond ? 'bonded' : 'transient' },
    implementation: model === 'unassigned' ? 'definition' : 'preview'
  });
}

export const speciesRegistry = Object.freeze([
  ...passive.map(([id, displayName, habitatTags, radius, height, health, speed, social, modes,
    canBreed, grazes, rides, animation], index) => baseProfile({
    id, displayName, habitatTags, radius, height, health, speed, social, modes,
    canBreed, grazes, rides, animation
  }, 'passive', index)),
  ...hostile.map(([id, displayName, habitatTags, radius, height, health, speed, social, modes,
    damage, permissions], index) => baseProfile({
    id, displayName, habitatTags, radius, height, health, speed, social, modes, damage, permissions
  }, 'hostile', index))
]);

const byId = new Map(speciesRegistry.map(entry => [entry.id, entry]));
if (speciesRegistry.length !== 40 || byId.size !== 40 || passive.length !== 20 || hostile.length !== 20)
  throw new TypeError('Invalid approved mob roster');

export function getSpecies(id) {
  return byId.get(id);
}
