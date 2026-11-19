import { distanceTo, eligibleTarget } from './behavior.mjs';
import { supportedPosition } from './movement.mjs';

const commands = ['follow', 'stay', 'return'];
const awake = mob => mob && ['idle', 'active'].includes(mob.state);

export function wildlifeActions(species) {
  if (species?.classification !== 'passive') return null;
  return Object.freeze({
    grazes: species.behavior.grazes, group: species.behavior.social,
    breeds: species.breeding.eligible, rides: species.riding.eligible, bonds: species.bonding.eligible
  });
}

export class CompanionManager {
  #engine;
  #world;
  #combat;
  #capacity;
  #slots = new Map();
  #time = 0;

  constructor(engine, world, combat, { capacity = 2 } = {}) {
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 4)
      throw new TypeError('Invalid pet slot count');
    this.#engine = engine;
    this.#world = world;
    this.#combat = combat;
    this.#capacity = capacity;
  }

  advance(seconds) {
    if (Number.isFinite(seconds) && seconds >= 0) this.#time += Math.min(seconds, 4 / 30);
  }

  slots() {
    return [...this.#slots.values()].map(({ id, owner, mode, anchor }) =>
      Object.freeze({ id, owner, mode, anchor: Object.freeze([...anchor]) }));
  }

  #near(mob, owner) {
    if (!mob || !eligibleTarget(owner) || distanceTo(mob.position, owner.position) > 1.85)
      return false;
    const a = [mob.position[0], mob.position[1] + mob.species.body.height * .6, mob.position[2]];
    const b = [owner.position[0], owner.position[1] + owner.height * .5, owner.position[2]];
    return this.#world.lineOfSight(a, b);
  }

  befriend(id, owner) {
    const mob = this.#engine.get(id);
    if (this.#slots.has(id) || this.#slots.size >= this.#capacity || !awake(mob) ||
        !mob.species.bonding.eligible || !this.#near(mob, owner) ||
        this.#world.environment(mob.position).hazard || !this.#engine.protectIdentity(id))
      return false;
    this.#slots.set(id, { id, owner: owner.id, mode: 'follow', anchor: [...mob.position],
      rescueAt: 0, immuneUntil: 0, defendAt: 0 });
    return true;
  }

  command(id, owner, command) {
    const slot = this.#slots.get(id);
    const mob = this.#engine.get(id);
    if (!slot || slot.owner !== owner?.id || !awake(mob) || !commands.includes(command)) return false;
    slot.mode = command;
    return true;
  }

  hurt(id, amount) {
    const slot = this.#slots.get(id);
    if (!slot || this.#time < slot.immuneUntil || !this.#engine.damage(id, amount)) return false;
    if (this.#engine.get(id)?.state === 'downed') slot.rescueAt = this.#time + 1;
    return true;
  }

  rescue(id, owner) {
    const slot = this.#slots.get(id);
    const mob = this.#engine.get(id);
    if (!slot || slot.owner !== owner?.id || mob?.state !== 'downed' ||
        this.#time < slot.rescueAt || !this.#near(mob, owner) ||
        this.#world.environment(mob.position).hazard || !this.#engine.recover(id))
      return false;
    slot.immuneUntil = this.#time + 3;
    slot.rescueAt = 0;
    slot.mode = 'follow';
    return true;
  }

  directive(mob, owner, threatId) {
    const slot = this.#slots.get(mob.id);
    if (!slot) return null;
    if (slot.mode === 'stay' || !eligibleTarget(owner) || owner.id !== slot.owner)
      return { state: 'stay' };
    if (slot.mode === 'return') {
      if (distanceTo(mob.position, slot.anchor) < .4) {
        slot.mode = 'stay';
        return { state: 'stay' };
      }
      return { state: 'return', destination: slot.anchor };
    }
    if (threatId && distanceTo(mob.position, owner.position) < 3.2 && this.#time >= slot.defendAt) {
      if (this.#combat.defend(mob, threatId)) slot.defendAt = this.#time + mob.species.combat.cooldown;
    }
    const distance = distanceTo(mob.position, owner.position);
    if (distance <= 1.25) return { state: 'follow' };
    const [x, y, z] = mob.position;
    const scale = Math.min(7, distance - .9) / distance;
    const walkX = x + (owner.position[0] - x) * scale;
    const walkZ = z + (owner.position[2] - z) * scale;
    const destination = supportedPosition(this.#world, walkX, walkZ, y + .65, y - .72, mob.species.body);
    return { state: 'follow', destination };
  }
}
