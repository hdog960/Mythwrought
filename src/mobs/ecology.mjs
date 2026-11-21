import { CHUNK_SIZE } from '../voxel.mjs';
import { sectionForY } from '../depth.mjs';
import { getSpecies, speciesRegistry } from './species.mjs';
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
const implementedIds=speciesRegistry.filter(species=>species.implementation==='preview').map(species=>species.id);

// Opt-in, fixed-size native spawn diagnostic counters; no logging, persistence
// or extra world probes in ordinary gameplay.
const DIAGNOSTIC_REASONS=Object.freeze([
  'invalid-input','empty-regions','invalid-region','region-cap','region-cooldown',
  'population','rarity','unknown-voxels','unsupported-terrain','wrong-section',
  'too-near','too-far','hazard','biome','light','depth','clearance','overlap',
  'engine-rejected','unclassified'
]);
function diagnoseEligibility(world,species,point,observer){
  if(!validPoint(point)||!validPoint(observer)||!species?.lifecycle?.replenishes)
    return 'unclassified';
  const distance=distanceTo(point,observer);
  if(distance<MIN_SPAWN_DISTANCE)return 'too-near';
  if(distance>MAX_SPAWN_DISTANCE)return 'too-far';
  const env=world.environment(point);
  if(env.hazard)return 'hazard';
  if(!species.habitat.biomes.includes(env.biome))return 'biome';
  if(!Number.isFinite(env.light)||env.light<species.habitat.light[0]||
      env.light>species.habitat.light[1])return 'light';
  if(point[1]<species.habitat.depth[0]||point[1]>species.habitat.depth[1])
    return 'depth';
  return 'clearance';
}

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
    point[1] <= depth[1] && (world.grounded(point, species.body) ||
      (species.movement.capabilities.includes('swim') && world.volume(point,species.body) === 'clear' &&
        world.medium?.([point[0],point[1] + Math.min(.18,species.body.height*.3),point[2]]) === 'water'));
}

export class PopulationManager {
  #engine;
  #world;
  #species;
  #seed;
  #isProtected;
  #spawnOnFirstVisit;
  #cursor = 0;
  #regions = new Map();
  #away = new Map();
  #time = 0;
  #next = INTERVAL;
  #metrics = null;

  constructor(engine, world, { seed = 179, species = implementedIds,
    isProtected = () => false, spawnOnFirstVisit = false, diagnostics = false } = {}) {
    if (typeof isProtected !== 'function' ||
        typeof spawnOnFirstVisit !== 'boolean' || typeof diagnostics !== 'boolean' ||
        !Number.isSafeInteger(seed) || !Array.isArray(species) ||
        !species.length || species.length > 40 || new Set(species).size !== species.length)
      throw new TypeError('Invalid ecology options');
    this.#engine = engine;
    this.#world = world;
    this.#seed = seed;
    if(diagnostics)this.#metrics={attempted:0,spawned:0,despawned:0,dormantTransitions:0,
      rejected:Object.fromEntries(DIAGNOSTIC_REASONS.map(name=>[name,0]))};
    // A tamed horse must be as persistent across chunk unload as a bonded
    // companion, but its schema-1 engine identity must NOT be forged into
    // a bonding-only important identity (checkpoint validation rejects that).
    // The gameplay host supplies the original AnimalInteractions ownership.
    this.#isProtected = isProtected;
    this.#spawnOnFirstVisit = spawnOnFirstVisit;
    this.#species = species.map(id => {
      const entry = getSpecies(id);
      if (entry?.implementation !== 'preview') throw new TypeError('Ecology requires an implemented species');
      return entry;
    });
  }

  #record(reason){
    if(this.#metrics)this.#metrics.rejected[reason]++;
  }

  diagnostics(){
    if(!this.#metrics)return null;
    const counts=this.#engine.counts();
    return Object.freeze({
      attempted:this.#metrics.attempted,spawned:this.#metrics.spawned,
      despawned:this.#metrics.despawned,dormantTransitions:this.#metrics.dormantTransitions,
      total:counts.total,awake:counts.awake,
      dormant:this.#engine.all().filter(m=>m.state==='dormant').length,
      rejected:Object.freeze({...this.#metrics.rejected})
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
      if (mob.state === 'active' || mob.state === 'idle') {
        if(this.#engine.transition(mob.id,'dormant')&&this.#metrics)
          this.#metrics.dormantTransitions++;
      }
      if (mob.important || this.#isProtected(mob)) {
        this.#away.delete(mob.id);
        continue;
      }
      if (!this.#away.has(mob.id)) this.#away.set(mob.id, this.#time);
      if (this.#time - this.#away.get(mob.id) >= GRACE) {
        if(this.#engine.transition(mob.id,'removed')&&this.#metrics)this.#metrics.despawned++;
        this.#away.delete(mob.id);
      }
    }
    for (const id of this.#away.keys()) if (!live.has(id)) this.#away.delete(id);
  }

  advance(seconds, observer, regions) {
    if (!Number.isFinite(seconds) || seconds < 0 || !validPoint(observer) || !Array.isArray(regions)) {
      this.#record('invalid-input');
      return { evaluated: 0, spawned: null };
    }
    this.#time += Math.min(1, seconds);
    if (this.#time < this.#next) return { evaluated: 0, spawned: null };
    this.#next = this.#time + INTERVAL;
    const entities = this.#engine.all();
    this.#reconcile(observer, entities);
    if (!regions.length) { this.#record('empty-regions'); return { evaluated: 0, spawned: null }; }

    const region = regions[this.#cursor++ % Math.min(regions.length, MAX_REGIONS)];
    if (!validRegion(region)) { this.#record('invalid-region'); return { evaluated: 0, spawned: null }; }
    const { cx, cz, section, feet } = region;
    const name = [cx, cz, section].join(',');
    let record = this.#regions.get(name);
    if (!record) {
      if (this.#regions.size >= MAX_REGIONS) {
        const stale = [...this.#regions].find(([, entry]) => entry.next <= this.#time - REPLENISH);
        if (!stale) { this.#record('region-cap'); return { evaluated: 0, spawned: null }; }
        this.#regions.delete(stale[0]);
      }
      // A complete new-world profile can survey freshly resident terrain
      // immediately. The original poll, range and per-tick ceiling remain.
      record = { serial: 0, next: this.#time+(this.#spawnOnFirstVisit?0:INTERVAL), high: new Map() };
      this.#regions.set(name, record);
    }
    const local = entities.filter(mob => mob.homeChunk === name);
    for (const entry of this.#species) {
      const count = local.filter(mob => mob.species === entry &&
        !mob.important && !this.#isProtected(mob)).length;
      if (count < (record.high.get(entry.id) ?? 0))
        record.next = Math.max(record.next, this.#time + REPLENISH);
      record.high.set(entry.id, count);
    }
    if (this.#time < record.next) { this.#record('region-cooldown'); return { evaluated: 0, spawned: null }; }

    for (let evaluated = 1; evaluated <= MAX_TESTS; evaluated++) {
      if(this.#metrics)this.#metrics.attempted++;
      const random = hash(this.#seed, cx, cz, section, ++record.serial);
      const species = this.#species[random % this.#species.length];
      const count = record.high.get(species.id);
      if(count>=species.population.localLimit){this.#record('population');continue;}
      if((random >>> 16) / 65536 > species.population.rarity){this.#record('rarity');continue;}
      const x = cx * CHUNK_SIZE + (random & 15) + .5;
      const z = cz * CHUNK_SIZE + ((random >>> 4) & 15) + .5;
      const point = supportedPosition(this.#world, x, z, feet + 1, feet - 1.5, species.body);
      if(!point){
        if(this.#metrics)this.#record(this.#world.volume([x,feet+1,z],species.body)==='unknown'?
          'unknown-voxels':'unsupported-terrain');
        continue;
      }
      if(sectionForY(Math.floor(point[1]))!==section){this.#record('wrong-section');continue;}
      if(!spawnEligible(this.#world,species,point,observer)){
        if(this.#metrics)this.#record(diagnoseEligibility(this.#world,species,point,observer));
        continue;
      }
      if(entities.some(mob=>distanceTo(mob.position,point)<1.2)){this.#record('overlap');continue;}
      const spawned = this.#engine.spawn(species.id, point, {
        homeChunk: name, dormant: distanceTo(observer, point) > ACTIVE_RADIUS
      });
      if(!spawned){this.#record('engine-rejected');return { evaluated, spawned:null };}
      if(this.#metrics)this.#metrics.spawned++;
      record.high.set(species.id, count + 1);
      record.next = this.#time + 1.5;
      return { evaluated, spawned };
    }
    return { evaluated: MAX_TESTS, spawned: null };
  }
}
