import { CHUNK_SIZE } from '../voxel.mjs';
import { sectionForY } from '../depth.mjs';
import { getSpecies } from './species.mjs';
import { validPoint } from './world-query.mjs';
import { supportedPosition } from './movement.mjs';
import { distanceTo } from './behavior.mjs';

const MAX_REGIONS = 64;
const INTERVAL = .5;
const GRACE = 6;
const REPLENISH = 12;
const MAX_TESTS = 6;
const ACTIVE_RADIUS = 18;
const MIN_SPAWN_DISTANCE = 5;
const MAX_SPAWN_DISTANCE = 26;

function hash(seed, cx, cz, section, sequence) {
  let number = seed ^ Math.imul(cx, 0x9e3779b9) ^ Math.imul(cz, 0x85ebca6b) ^
    Math.imul(section, 0xc2b2ae35) ^ Math.imul(sequence, 0x27d4eb2d);
  number = Math.imul(number ^ (number >>> 16), 0x7feb352d);
  number = Math.imul(number ^ (number >>> 15), 0x846ca68b);
  return (number ^ (number >>> 16)) >>> 0;
}

function validRegion(region) {
  return [region?.cx, region?.cz, region?.section].every(Number.isSafeInteger) &&
    Math.abs(region.cx) < 2 ** 22 && Math.abs(region.cz) < 2 ** 22 &&
    Number.isFinite(region.feet) && sectionForY(Math.floor(region.feet)) === region.section;
}

export function spawnEligible(world, species, point, observer) {
  if (!validPoint(point) || !validPoint(observer) || species?.implementation !== 'preview' ||
      !species.lifecycle.replenishes) return false;
  const range = distanceTo(point, observer);
  if (range < MIN_SPAWN_DISTANCE || range > MAX_SPAWN_DISTANCE) return false;
  const { biome, light, hazard } = world.environment(point);
  const { biomes, depth, light: bounds } = species.habitat;
  return !hazard && biomes.includes(biome) && Number.isFinite(light) &&
    light >= bounds[0] && light <= bounds[1] && point[1] >= depth[0] &&
    point[1] <= depth[1] && world.grounded(point, species.body);
}

export class PopulationManager {
  #engine;
  #world;
  #species;
  #seed;
  #cursor = 0;
  #regions = new Map();
  #away = new Map();
  #time = 0;
  #next = INTERVAL;

  constructor(engine, world, { seed = 179, species = ['deer', 'goblin', 'glownewt'] } = {}) {
    if (!Number.isSafeInteger(seed) || !Array.isArray(species) ||
        !species.length || species.length > 40 || new Set(species).size !== species.length)
      throw new TypeError('Invalid ecology options');
    this.#engine = engine;
    this.#world = world;
    this.#seed = seed;
    this.#species = species.map(id => {
      const entry = getSpecies(id);
      if (entry?.implementation !== 'preview') throw new TypeError('Ecology requires an implemented species');
      return entry;
    });
  }

  #reconcile(observer, entities) {
    const live = new Set();
    for (const mob of entities) {
      live.add(mob.id);
      const nearby = distanceTo(observer, mob.position) <= ACTIVE_RADIUS;
      const resident = this.#world.residentAt(mob.position);
      if (nearby && resident) {
        this.#away.delete(mob.id);
        if (mob.state === 'dormant') this.#engine.transition(mob.id, 'idle');
        continue;
      }
      if (mob.state === 'active' || mob.state === 'idle') this.#engine.transition(mob.id, 'dormant');
      if (mob.important) continue;
      if (!this.#away.has(mob.id)) this.#away.set(mob.id, this.#time);
      if (this.#time - this.#away.get(mob.id) >= GRACE) {
        this.#engine.transition(mob.id, 'removed');
        this.#away.delete(mob.id);
      }
    }
    for (const id of this.#away.keys()) if (!live.has(id)) this.#away.delete(id);
  }

  advance(seconds, observer, regions) {
    if (!Number.isFinite(seconds) || seconds < 0 || !validPoint(observer) || !Array.isArray(regions))
      return { evaluated: 0, spawned: null };
    this.#time += Math.min(1, seconds);
    if (this.#time < this.#next) return { evaluated: 0, spawned: null };
    this.#next = this.#time + INTERVAL;
    const entities = this.#engine.all();
    this.#reconcile(observer, entities);
    if (!regions.length) return { evaluated: 0, spawned: null };

    const region = regions[this.#cursor++ % Math.min(regions.length, MAX_REGIONS)];
    if (!validRegion(region)) return { evaluated: 0, spawned: null };
    const { cx, cz, section, feet } = region;
    const name = [cx, cz, section].join(',');
    let record = this.#regions.get(name);
    if (!record) {
      if (this.#regions.size >= MAX_REGIONS) {
        const stale = [...this.#regions].find(([, entry]) => entry.next <= this.#time - REPLENISH);
        if (!stale) return { evaluated: 0, spawned: null };
        this.#regions.delete(stale[0]);
      }
      record = { serial: 0, next: this.#time + INTERVAL, high: new Map() };
      this.#regions.set(name, record);
    }
    const local = entities.filter(mob => mob.homeChunk === name);
    for (const entry of this.#species) {
      const count = local.filter(mob => mob.species === entry && !mob.important).length;
      if (count < (record.high.get(entry.id) ?? 0))
        record.next = Math.max(record.next, this.#time + REPLENISH);
      record.high.set(entry.id, count);
    }
    if (this.#time < record.next) return { evaluated: 0, spawned: null };

    for (let evaluated = 1; evaluated <= MAX_TESTS; evaluated++) {
      const random = hash(this.#seed, cx, cz, section, ++record.serial);
      const species = this.#species[random % this.#species.length];
      const count = record.high.get(species.id);
      if (count >= species.population.localLimit || (random >>> 16) / 65536 > species.population.rarity)
        continue;
      const x = cx * CHUNK_SIZE + (random & 15) + .5;
      const z = cz * CHUNK_SIZE + ((random >>> 4) & 15) + .5;
      const point = supportedPosition(this.#world, x, z, feet + 1, feet - 1.5, species.body);
      if (!point || sectionForY(Math.floor(point[1])) !== section ||
          !spawnEligible(this.#world, species, point, observer) ||
          entities.some(mob => distanceTo(mob.position, point) < 1.2)) continue;
      const spawned = this.#engine.spawn(species.id, point, {
        homeChunk: name, dormant: distanceTo(observer, point) > ACTIVE_RADIUS
      });
      if (!spawned) return { evaluated, spawned: null };
      record.high.set(species.id, count + 1);
      record.next = this.#time + 1.5;
      return { evaluated, spawned };
    }
    return { evaluated: MAX_TESTS, spawned: null };
  }
}
