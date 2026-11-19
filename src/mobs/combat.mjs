import { FIXED_STEP } from './engine.mjs';
import { hostileTactics } from './hostile-tactics.mjs';
import { distanceTo, eligibleTarget } from './behavior.mjs';
import { validPoint } from './world-query.mjs';

const eye = (point, height) => [point[0], point[1] + height * .72, point[2]];
const methods = Object.freeze({ door: 'open', switch: 'activate' });
const active = mob => mob && (mob.state === 'active' || mob.state === 'idle');

export class DemoTarget {
  #position;
  #health;
  #maximum;

  constructor(position, { id = 'preview-target', health = 100, height = 1.7 } = {}) {
    if (!eligibleTarget({ id, position, height }) || !Number.isFinite(health) || health <= 0 || health > 1000)
      throw new TypeError('Invalid combat target');
    Object.defineProperties(this, { id: { value: id }, height: { value: height } });
    this.#position = [...position];
    this.#health = this.#maximum = health;
  }

  get health() { return this.#health; }
  get alive() { return this.#health > 0; }
  get position() { return [...this.#position]; }

  place(point) {
    if (!validPoint(point)) return false;
    this.#position = [...point];
    return true;
  }

  reset() { this.#health = this.#maximum; }

  damage(damage) {
    if (!this.alive || !Number.isFinite(damage) || damage <= 0) return false;
    this.#health = Math.max(0, this.#health - damage);
    return true;
  }
}

export class ObjectAccess {
  #world;
  #authorize;

  constructor(world, authorize) {
    if (typeof authorize !== 'function') throw new TypeError('Object requests require host authority');
    this.#world = world;
    this.#authorize = authorize;
  }

  request(mob, id) {
    if (!active(mob) || typeof id !== 'string' || id.length > 64) return false;
    const { objects } = this.#world.environment(mob.position);
    const object = objects.find(candidate => candidate?.id === id);
    if (!object || !Object.hasOwn(methods, object.kind) || !mob.species.interactions.includes(object.kind) ||
        !validPoint(object.position) || !this.#world.residentAt(object.position) ||
        distanceTo(mob.position, object.position) > 1.65) return false;
    // The host must validate the exact ID, state, and authorization. A
    // request contains no user-controlled voxel coordinates or block IDs.
    return this.#authorize(id, methods[object.kind], mob.id) === true;
  }
}

export class MobCombat {
  #world;
  #engine;
  #behavior;
  #access;
  #attempts = new Map();
  #events = [];
  #projectiles = [];
  #sequence = 0;
  #time = 0;

  constructor(engine, world, behavior, access = null) {
    this.#engine = engine;
    this.#world = world;
    this.#behavior = behavior;
    this.#access = access;
  }

  get events() { return [...this.#events]; }

  get projectiles() {
    return this.#projectiles.map(({id,position,velocity})=>({id,position:[...position],velocity:[...velocity]}));
  }

  clearProjectiles() {
    this.#projectiles.length = 0;
  }

  #launch(mob,target) {
    if (this.#projectiles.length >= 32 || !eligibleTarget(target) ||
        distanceTo(mob.position,target.position)>mob.species.combat.reach) return false;
    const position = eye(mob.position,mob.species.body.height);
    const aim = eye(target.position,target.height);
    if (!this.#world.lineOfSight(position,aim)) return false;
    const distance=distanceTo(position,aim);
    if (distance<.1) return false;
    const velocity=aim.map((value,axis)=>(value-position[axis])*8/distance);
    this.#projectiles.push({
      id:'bolt-'+(++this.#sequence),position,velocity,
      remaining:Math.min(1,(distance+.7)/8),targetId:target.id,
      source:mob.id,damage:mob.species.combat.damage
    });
    this.#events.push(Object.freeze({type:'projectile',source:mob.id,target:target.id}));
    return true;
  }

  #advanceProjectiles(target,seconds) {
    for (let index=this.#projectiles.length-1;index>=0;index--) {
      const bolt=this.#projectiles[index];
      const next=bolt.position.map((value,axis)=>value+bolt.velocity[axis]*seconds);
      if (!this.#world.residentAt(next) || !this.#world.lineOfSight(bolt.position,next) ||
          !eligibleTarget(target) || typeof target.damage!=='function' || target.id!==bolt.targetId) {
        this.#projectiles.splice(index,1);
        continue;
      }
      const center=eye(target.position,target.height);
      const displacement=next.map((value,axis)=>value-bolt.position[axis]);
      const projection=displacement.reduce((sum,value,axis)=>sum+value*(center[axis]-bolt.position[axis]),0) /
        (8*seconds)**2;
      const closest=bolt.position.map((value,axis)=>value+displacement[axis]*Math.max(0,Math.min(1,projection)));
      if (distanceTo(closest,center)<.29 && this.#world.lineOfSight(closest,center)) {
        if (target.damage(bolt.damage))
          this.#events.push(Object.freeze({type:'damage',source:bolt.source,target:bolt.targetId,amount:bolt.damage}));
        this.#projectiles.splice(index,1);
        continue;
      }
      bolt.position=next;
      bolt.remaining-=seconds;
      if (bolt.remaining<=0) this.#projectiles.splice(index,1);
    }
  }

  #strike(mob, target, applyDamage) {
    if (!active(mob) || !eligibleTarget(target) || target.id === mob.id ||
        distanceTo(mob.position, target.position) > mob.species.combat.reach ||
        !this.#world.lineOfSight(eye(mob.position, mob.species.body.height), eye(target.position, target.height)))
      return false;
    const { damage } = mob.species.combat;
    if (damage <= 0 || !applyDamage(damage)) return false;
    this.#events.push(Object.freeze({ type: 'damage', source: mob.id, target: target.id, amount: damage }));
    return true;
  }

  defend(companion, targetId) {
    const target = this.#engine.get(targetId);
    if (!companion?.important || !companion.species.behavior.defensive ||
        !active(target) || target.species.classification !== 'hostile') return false;
    return this.#strike(companion, { id: target.id, position: target.position, height: target.species.body.height },
      amount => this.#engine.damage(target.id, amount));
  }

  #tryObject(mob, seen) {
    if (!this.#access || this.#time < (this.#attempts.get(mob.id) ?? 0) ||
        !mob.species.interactions.length) return;
    this.#attempts.set(mob.id, this.#time + .55);
    for (const object of seen.objects) {
      if (this.#access.request(mob, object?.id)) {
        this.#events.push(Object.freeze({ type: 'object', source: mob.id, object: object.id }));
        break;
      }
    }
  }

  advance(seconds, target = null, context = {}) {
    this.#events = [];
    if (Number.isFinite(seconds) && seconds >= 0) this.#time += Math.min(seconds, 4 / 30);
    for (const id of this.#attempts.keys()) if (!this.#engine.get(id)) this.#attempts.delete(id);
    const steps = this.#behavior.advance(seconds, {
      ...context, target,
      onAttack: (mob, candidate) => {
        if (candidate !== target || typeof target.damage !== 'function') return;
        if (hostileTactics[mob.species.id]?.attack === 'ranged') this.#launch(mob,target);
        else this.#strike(mob,target,damage => target.damage(damage));
      },
      onBlocked: (mob, seen) => this.#tryObject(mob, seen)
    });
    for (let tick=0;tick<steps;tick++) this.#advanceProjectiles(target,FIXED_STEP);
    return steps;
  }
}
