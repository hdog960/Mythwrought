import { getSpecies } from './species.mjs';
import { moveBody } from './movement.mjs';
import { validPoint } from './world-query.mjs';

export const FIXED_STEP = 1 / 30;
export const DEFAULT_ACTIVE_MOBS = 8;
const MAX_STEPS = 4;
const MAX_EVENTS = 256;
const awake = new Set(['active', 'idle']);
const NO_MOVEMENT = Object.freeze([0, 0]);
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
    homeChunk: mob.homeChunk, important: mob.important, juvenile: mob.juvenile, motionMode: mob.motionMode
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

  constructor(world, seed = 179, { maxEntities = 64, maxActive = DEFAULT_ACTIVE_MOBS } = {}) {
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

  spawn(speciesId, point, { dormant = false, homeChunk = null, juvenile = false } = {}) {
    if (this.#disposed || this.#entities.size >= this.#maxEntities ||
        this.#next >= Number.MAX_SAFE_INTEGER-1 || !validPoint(point)) return null;
    const species = getSpecies(speciesId);
    if (!species || species.implementation !== 'preview') return null;
    // Admission is read-only until every physical-world supplier completes.
    // Do not reserve an identity, awake slot or event for a stale sample.
    const originalPoint = [...point];
    const hasRevision = typeof this.#world.revision === 'function';
    const version = hasRevision ? this.#world.revision() : null;
    if (this.#world.volume(point, species.body) !== 'clear') return null;
    const grounded = this.#world.grounded(point, species.body);
    if (typeof this.#world.residentAt === 'function' &&
        this.#world.residentAt(point) !== true) return null;
    if (hasRevision && !Object.is(this.#world.revision(), version)) return null;
    if (!validPoint(point) ||
        originalPoint.some((value, axis) => !Object.is(value, point[axis])) ||
        this.#disposed || this.#entities.size >= this.#maxEntities ||
        this.#next >= Number.MAX_SAFE_INTEGER-1) return null;
    const count = ++this.#next;
    const id = 'mob-' + (this.#seed >>> 0).toString(36) + '-' + count.toString(36);
    const state = dormant || this.#awake >= this.#maxActive ? 'dormant' : 'idle';
    const entity = {
      id, species, origin: Object.freeze([...point]), position: [...point], juvenile: juvenile === true,
      velocity: [0, 0, 0], yaw: 0, health: species.combat.health, state,
      grounded, homeChunk, important: false, motionMode: 'walk',
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
        if (this.#entities.get(mob.id) !== mob) continue;
        if (mob.state === 'downed') {
          // Downing stops voluntary movement. A body that was falling still
          // settles on real ground before it can become eligible for rescue.
          if (this.#world.volume(mob.position, mob.species.body) === 'clear' &&
              (mob.velocity[1] < 0 || !this.#world.grounded(mob.position, mob.species.body))) {
            moveBody(this.#world, mob, NO_MOVEMENT, FIXED_STEP);
          }
          continue;
        }
        if (!awake.has(mob.state)) continue;
        if (this.#world.volume(mob.position, mob.species.body) !== 'clear') {
          this.transition(mob.id, 'dormant');
          continue;
        }
        const command = controller?.(snapshot(mob), FIXED_STEP);
        const direction = Array.isArray(command) ? command : command?.direction;
        const heading = Array.isArray(direction) && direction.length === 2 &&
          direction.every(Number.isFinite) ? direction : NO_MOVEMENT;
        if (awake.has(mob.state) && this.#entities.get(mob.id) === mob) {
          const moving = heading.some(Boolean) || (Number.isFinite(command?.vertical) && command.vertical !== 0);
          const state = moving ? 'active' : 'idle';
          if (state !== mob.state) this.transition(mob.id, state);
          moveBody(this.#world, mob, heading, FIXED_STEP, Array.isArray(command) ? undefined : command);
        }
      }
      steps++;
    }
    return steps;
  }

  checkpoint() {
    if (this.#disposed) throw TypeError('Cannot snapshot a disposed mob engine');
    return {
      seed: this.#seed, next: this.#next, maxEntities: this.#maxEntities, maxActive: this.#maxActive,
      entities: Array.from(this.#entities.values(),mob=>({
        id:mob.id,species:mob.species.id,origin:[...mob.origin],position:[...mob.position],
        velocity:[...mob.velocity],yaw:mob.yaw,state:mob.state,health:mob.health,
        homeChunk:mob.homeChunk,important:mob.important,juvenile:mob.juvenile,randomState:mob.randomState
      }))
    };
  }

  static fromCheckpoint(world, state) {
    if (!state || !limits(state.seed,-2147483648,2147483647) ||
        !limits(state.next,0,Number.MAX_SAFE_INTEGER-1) || !Array.isArray(state.entities) ||
        state.entities.length > state.maxEntities) throw TypeError('Invalid mob engine checkpoint');
    const engine=new MobEngine(world,state.seed,{maxEntities:state.maxEntities,maxActive:state.maxActive});
    const identityPrefix='mob-'+(state.seed>>>0).toString(36)+'-';
    engine.#next=state.next;
    for (const row of state.entities) {
      const key=typeof row?.id==='string' && row.id.startsWith(identityPrefix)
        ? row.id.slice(identityPrefix.length) : '';
      const serial=Number.parseInt(key,36);
      if (!limits(serial,1,state.next) || serial.toString(36)!==key || engine.#entities.has(row.id))
        throw TypeError('Invalid or duplicate mob identity');
      const species=getSpecies(row.species);
      if (species?.implementation!=='preview' || !Object.hasOwn(transitions,row.state) ||
          !validPoint(row.origin) || !validPoint(row.position) || !validPoint(row.velocity) ||
          row.velocity.some(value=>Math.abs(value)>16) || !Number.isFinite(row.yaw) ||
          Math.abs(row.yaw)>Math.PI || !Number.isFinite(row.health) || row.health<0 ||
          row.health>species.combat.health || (row.state!=='downed' && row.health===0) ||
          !limits(row.randomState,0,0xffffffff) || typeof row.important!=='boolean' ||
          typeof row.juvenile!=='boolean' || (row.important&&!species.bonding.eligible) ||
          (row.juvenile&&!species.breeding.eligible) ||
          (row.homeChunk!==null && (typeof row.homeChunk!=='string' || !/^-?\d+,-?\d+,-?\d+$/.test(row.homeChunk) ||
            row.homeChunk.length>64))) throw TypeError('Invalid mob state');
      let nextState=row.state;
      const resident=world.volume(row.position,species.body)==='clear';
      if (awake.has(nextState) && !resident) nextState='dormant';
      if (awake.has(nextState) && ++engine.#awake > engine.#maxActive)
        throw TypeError('Mob checkpoint exceeds active capacity');
      engine.#entities.set(row.id,{
        ...row,species,state:nextState,origin:Object.freeze([...row.origin]),position:[...row.position],
        velocity:nextState===row.state && resident ? [...row.velocity] : [0,0,0],
        grounded:resident && world.grounded(row.position,species.body),motionMode:'walk'
      });
    }
    return engine;
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
