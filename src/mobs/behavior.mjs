import { LocalNavigator } from './navigation.mjs';
import { supportedPosition } from './movement.mjs';
import { validPoint } from './world-query.mjs';

export const distanceTo = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const atEye = (point, height) => [point[0], point[1] + height * .72, point[2]];

export function eligibleTarget(target) {
  return typeof target?.id === 'string' && target.id.length > 0 && validPoint(target.position) &&
    Number.isFinite(target.height) && target.height > 0 && target.height <= 3.5 && target.alive !== false;
}

export function sense(world, mob, context = {}) {
  const target = eligibleTarget(context.target) ? context.target : null;
  const distance = target ? distanceTo(mob.position, target.position) : Infinity;
  const { sight, hearing } = mob.species.perception;
  const environment = world.environment(mob.position);
  const visible = distance <= sight && world.lineOfSight(atEye(mob.position, mob.species.body.height),
    atEye(target.position, target.height));
  let heard = null;
  let closest = Infinity;
  const sounds = Array.isArray(context.disturbances) ? context.disturbances : [];
  for (let i = 0; i < Math.min(8, sounds.length); i++) {
    const sound = sounds[i];
    if (!validPoint(sound?.position) || !Number.isFinite(sound.loudness) || sound.loudness <= 0) continue;
    const range = distanceTo(mob.position, sound.position);
    if (range <= Math.min(1, sound.loudness) * hearing && range < closest) {
      closest = range;
      heard = [...sound.position];
    }
  }
  return { target, distance, visible, heard, ...environment, depth: mob.position[1] };
}

function setState(memory, state) {
  if (memory.state === state) return;
  memory.state = state;
  memory.age = 0;
}

function positionNear(world, mob, center, angle, radius) {
  const position = [center[0] + Math.cos(angle) * radius, center[1], center[2] + Math.sin(angle) * radius];
  if (world.environment(position).hazard) return null;
  return supportedPosition(world, position[0], position[2],
    position[1] + .5, position[1] - .65, mob.species.body);
}

export class BehaviorController {
  #engine;
  #world;
  #navigator;
  #memory = new Map();

  constructor(engine, world) {
    this.#engine = engine;
    this.#world = world;
    this.#navigator = new LocalNavigator(world);
  }

  state(id) {
    return this.#engine.get(id)?.state === 'downed' ? 'downed' : this.#memory.get(id)?.state;
  }

  get navigationWork() {
    return this.#navigator.work;
  }

  forget(id) {
    this.#memory.delete(id);
    this.#navigator.forget(id);
  }

  #wander(mob, memory) {
    if (!memory.destination) {
      const angle = this.#engine.random(mob.id) * Math.PI * 2;
      const radius = 1.4 + this.#engine.random(mob.id) * 2;
      memory.destination = positionNear(this.#world, mob, mob.origin, angle, radius);
    }
    return memory.destination;
  }

  #passive(mob, memory, seen) {
    const looksThreatening = seen.visible &&
      (seen.target.threatening === true ||
        (mob.species.perception.threat === 'avoid' && seen.target.threatening !== false));
    if (looksThreatening && seen.distance < 6) {
      if (!['observe', 'flee'].includes(memory.state)) setState(memory, 'observe');
      if (seen.distance < 4 && memory.age >= .13) setState(memory, 'flee');
      if (memory.state === 'flee') {
        if (!memory.destination || memory.age < .06 || distanceTo(mob.position, memory.destination) < .45) {
          const angle = Math.atan2(mob.position[2] - seen.target.position[2],
            mob.position[0] - seen.target.position[0]);
          memory.destination = null;
          for (const turn of [0, .7, -.7]) {
            const point = positionNear(this.#world, mob, mob.position, angle + turn, 3.1);
            if (point) { memory.destination = point; break; }
          }
        }
        return memory.destination;
      }
      return null;
    }
    if (['observe', 'flee'].includes(memory.state)) setState(memory, 'calm-down');
    if (memory.state === 'calm-down') {
      if (memory.age >= .65) setState(memory, 'rest');
      return null;
    }
    if (seen.heard && ['idle', 'rest', 'wander'].includes(memory.state)) {
      memory.destination = seen.heard;
      setState(memory, 'investigate');
    }
    if (memory.state === 'investigate') {
      if (memory.age < 1.5 && distanceTo(mob.position, memory.destination) > .5) return memory.destination;
      setState(memory, 'rest');
    }
    if (memory.state === 'rest' && memory.age > 1.1) setState(memory, 'idle');
    if (memory.state === 'idle' && memory.age > .8) {
      memory.destination = null;
      setState(memory, 'wander');
    }
    if (memory.state === 'wander') {
      const point = this.#wander(mob, memory);
      if (point && memory.age < 2.6 && distanceTo(mob.position, point) > .35) return point;
      setState(memory, 'rest');
    }
    return null;
  }

  #hostile(mob, memory, seen, context) {
    const { combat, behavior } = mob.species;
    const territory = distanceTo(mob.position, mob.origin) <= behavior.territory;
    const canSee = seen.visible && territory &&
      distanceTo(seen.target.position, mob.origin) <= behavior.territory;
    const inReach = canSee && seen.distance <= combat.reach;
    if (canSee) {
      memory.lastSeen = [...seen.target.position];
      memory.lost = 0;
    } else {
      memory.lost += memory.dt;
    }

    if (memory.state === 'attack') {
      setState(memory, 'recover');
      return null;
    }
    if (memory.state === 'prepare-attack') {
      if (!inReach) setState(memory, 'pursue');
      else if (memory.age >= combat.windup) {
        setState(memory, 'attack');
        context.onAttack?.(mob, seen.target);
      }
      return null;
    }
    if (memory.state === 'recover') {
      if (memory.age >= combat.cooldown) setState(memory, 'pursue');
      return null;
    }
    if (memory.state === 'disengage') {
      if (memory.age >= .3) setState(memory, 'return');
      return null;
    }
    if (memory.state === 'return') {
      if (distanceTo(mob.position, mob.origin) > .45 && memory.age < 8) return mob.origin;
      setState(memory, 'idle');
      return null;
    }
    if (['detect', 'acquire', 'pursue', 'investigate'].includes(memory.state)) {
      if (!territory || memory.lost >= 1.25 || memory.engaged >= 16) {
        setState(memory, 'disengage');
        return null;
      }
      memory.engaged += memory.dt;
      if (memory.state === 'detect' && canSee && memory.age >= .12) setState(memory, 'acquire');
      else if (memory.state === 'acquire' && memory.age >= .12) setState(memory, 'pursue');
      else if (memory.state === 'investigate' && canSee) setState(memory, 'detect');
      if (memory.state === 'pursue' && inReach) {
        setState(memory, 'prepare-attack');
        return null;
      }
      return ['pursue', 'investigate'].includes(memory.state) ? memory.lastSeen : null;
    }
    if (canSee || seen.heard) {
      memory.engaged = 0;
      memory.lost = 0;
      if (!canSee) memory.lastSeen = seen.heard;
      setState(memory, canSee ? 'detect' : 'investigate');
      return null;
    }
    if (memory.state === 'idle' && memory.age > 1.15) {
      memory.destination = null;
      setState(memory, 'patrol');
    }
    if (memory.state === 'patrol') {
      const point = this.#wander(mob, memory);
      if (point && memory.age < 3 && distanceTo(mob.position, point) > .35) return point;
      setState(memory, 'idle');
    }
    return null;
  }

  advance(seconds, context = {}) {
    const alive = new Set(this.#engine.all().map(mob => mob.id));
    for (const id of this.#memory.keys()) if (!alive.has(id)) this.forget(id);
    this.#navigator.beginTick();
    return this.#engine.advance(seconds, (mob, dt) => {
      let memory = this.#memory.get(mob.id);
      if (!memory) {
        memory = { state: 'idle', age: 0, dt, lost: 0, engaged: 0 };
        this.#memory.set(mob.id, memory);
      }
      memory.age += dt;
      const seen = sense(this.#world, mob, context);
      const override = context.override?.(mob, seen);
      if (override) {
        setState(memory, override.state);
        return override.destination ? this.#navigator.steer(mob, override.destination) : [0, 0];
      }
      const destination = mob.species.classification === 'hostile' ?
        this.#hostile(mob, memory, seen, context) : this.#passive(mob, memory, seen);
      if (!destination) return [0, 0];
      const heading = this.#navigator.steer(mob, destination);
      if (mob.species.classification === 'hostile' && ['pursue', 'investigate'].includes(memory.state) &&
          !heading.some(Boolean)) context.onBlocked?.(mob, seen);
      return heading;
    });
  }
}
