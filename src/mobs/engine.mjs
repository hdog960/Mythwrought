import { getSpecies } from './species.mjs';
import { moveBody } from './movement.mjs';
import { validPoint } from './world-query.mjs';

export const FIXED_STEP = 1 / 30;
const MAX_STEPS = 4;
const MAX_EVENTS = 256;
const awake = new Set(['active', 'idle']);
const transitions = Object.freeze({
  active: ['idle', 'dormant', 'downed', 'removed'],
  idle: ['active', 'dormant', 'downed', 'removed'],
  dormant: ['idle', 'removed'],
  downed: ['removed']
});

function snapshot(mob) {
  return Object.freeze({
    id: mob.id, species: mob.species, position: Object.freeze([...mob.position]),
    velocity: Object.freeze([...mob.velocity]), yaw: mob.yaw, state: mob.state,
    health: mob.health, grounded: mob.grounded, origin: mob.origin,
    homeChunk: mob.homeChunk, important: mob.important
  });
}

function limits(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

export class MobEngine {
  #world;
  #seed;
  #next = 0;
  #entities = new Map();
  #awake = 0;
  #events = [];
  #time = 0;
  #maxEntities;
  #maxActive;
  #disposed = false;

  constructor(world, seed = 179, { maxEntities = 64, maxActive = 16 } = {}) {
    if (typeof world?.volume !== 'function' || typeof world?.grounded !== 'function' ||
        !Number.isSafeInteger(seed) || !limits(maxEntities, 1, 128) ||
        !limits(maxActive, 1, 32)) throw new TypeError('Invalid mob engine options');
    this.#world = world;
    this.#seed = seed | 0;
    this.#maxEntities = maxEntities;
    this.#maxActive = Math.min(maxActive, maxEntities);
  }

  #emit(event) {
    if (this.#events.length === MAX_EVENTS) this.#events.shift();
    this.#events.push(Object.freeze(event));
  }

  spawn(speciesId, point, { dormant = false, homeChunk = null } = {}) {
    if (this.#disposed || this.#entities.size >= this.#maxEntities || !validPoint(point)) return null;
    const species = getSpecies(speciesId);
    if (!species || species.implementation !== 'preview' ||
        this.#world.volume(point, species.body) !== 'clear') return null;
    const count = ++this.#next;
    const id = 'mob-' + (this.#seed >>> 0).toString(36) + '-' + count.toString(36);
    const state = dormant || this.#awake >= this.#maxActive ? 'dormant' : 'idle';
    const entity = {
      id, species, origin: Object.freeze([...point]), position: [...point],
      velocity: [0, 0, 0], yaw: 0, health: species.combat.health, state,
      grounded: this.#world.grounded(point, species.body), homeChunk, important: false,
      randomState: (this.#seed ^ Math.imul(count, 0x9e3779b9)) >>> 0
    };
    if (awake.has(state)) this.#awake++;
    this.#entities.set(id, entity);
    this.#emit({ type: 'spawn', id, state });
    return id;
  }

  get(id) {
    const mob = this.#entities.get(id);
    return mob ? snapshot(mob) : undefined;
  }

  all() {
    return Array.from(this.#entities.values(), snapshot);
  }

  counts() {
    return Object.freeze({ total: this.#entities.size, awake: this.#awake });
  }

  random(id) {
    const mob = this.#entities.get(id);
    if (!mob) return undefined;
    mob.randomState = (Math.imul(mob.randomState, 1664525) + 1013904223) >>> 0;
    return mob.randomState / 2 ** 32;
  }

  protectIdentity(id) {
    const mob = this.#entities.get(id);
    if (!mob?.species.bonding.eligible) return false;
    mob.important = true;
    return true;
  }

  transition(id, state) {
    const mob = this.#entities.get(id);
    if (!mob || !transitions[mob.state].includes(state) ||
        (state === 'removed' && mob.important)) return false;
    const wasAwake = awake.has(mob.state);
    const willBeAwake = awake.has(state);
    if (willBeAwake && !wasAwake &&
        (this.#awake >= this.#maxActive ||
          this.#world.volume(mob.position, mob.species.body) !== 'clear')) return false;
    this.#awake += Number(willBeAwake) - Number(wasAwake);
    if (!willBeAwake) mob.velocity.fill(0);
    if (state === 'removed') this.#entities.delete(id);
    else mob.state = state;
    this.#emit({ type: 'state', id, state });
    return true;
  }

  damage(id, amount, { recoverable = false } = {}) {
    const mob = this.#entities.get(id);
    if (!mob || !awake.has(mob.state) || !Number.isFinite(amount) || amount <= 0) return false;
    mob.health = Math.max(0, mob.health - amount);
    this.#emit({ type: 'hurt', id, health: mob.health });
    if (!mob.health) this.transition(id, recoverable || mob.important ? 'downed' : 'removed');
    return true;
  }

  recover(id, fraction = .5) {
    const mob = this.#entities.get(id);
    if (mob?.state !== 'downed' || !Number.isFinite(fraction) || fraction <= 0 || fraction > 1 ||
        this.#awake >= this.#maxActive || !this.#world.grounded(mob.position, mob.species.body))
      return false;
    mob.health = mob.species.combat.health * fraction;
    mob.state = 'idle';
    this.#awake++;
    this.#emit({ type: 'state', id, state: 'idle' });
    return true;
  }

  advance(seconds, controller) {
    if (this.#disposed || !Number.isFinite(seconds) || seconds < 0) return 0;
    this.#time += Math.min(seconds, MAX_STEPS * FIXED_STEP);
    let steps = 0;
    while (steps < MAX_STEPS && this.#time + 1e-10 >= FIXED_STEP) {
      this.#time = Math.max(0, this.#time - FIXED_STEP);
      // An event or controller may alter admission. Snapshot the bounded roster
      // so entities created by a controller do not receive a same-tick step.
      for (const mob of [...this.#entities.values()]) {
        if (!awake.has(mob.state) || this.#entities.get(mob.id) !== mob) continue;
        if (this.#world.volume(mob.position, mob.species.body) !== 'clear') {
          this.transition(mob.id, 'dormant');
          continue;
        }
        const command = controller?.(snapshot(mob), FIXED_STEP);
        const heading = Array.isArray(command) && command.length === 2 &&
          command.every(Number.isFinite) ? command : [0, 0];
        if (awake.has(mob.state) && this.#entities.get(mob.id) === mob) {
          const state = heading.some(Boolean) ? 'active' : 'idle';
          if (state !== mob.state) this.transition(mob.id, state);
          moveBody(this.#world, mob, heading, FIXED_STEP);
        }
      }
      steps++;
    }
    return steps;
  }

  drainEvents() {
    const events = this.#events;
    this.#events = [];
    return events;
  }

  dispose() {
    for (const mob of this.#entities.values()) this.#emit({ type: 'state', id: mob.id, state: 'removed' });
    this.#entities.clear();
    this.#awake = 0;
    this.#disposed = true;
    this.#time = 0;
  }
}
