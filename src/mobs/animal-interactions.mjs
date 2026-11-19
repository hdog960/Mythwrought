import { distanceTo, eligibleTarget } from './behavior.mjs';

const isAwake = mob => mob && ['idle', 'active'].includes(mob.state);

export class AnimalInteractions {
  #engine;
  #world;
  #tamed = new Map();
  #recentParents = new Map();
  #mounts = new Map();
  #time = 0;

  constructor(engine, world) {
    this.#engine = engine;
    this.#world = world;
  }

  checkpoint() {
    return [...this.#tamed.entries()].filter(([id])=>this.#engine.get(id));
  }

  static fromCheckpoint(engine,world,records) {
    if (!Array.isArray(records) || records.length>128) throw TypeError('Invalid tame checkpoint');
    const animals=new AnimalInteractions(engine,world);
    for (const row of records) {
      if (!Array.isArray(row) || row.length!==2) throw TypeError('Invalid tame ownership');
      const [id,owner]=row;
      const mob=engine.get(id);
      if (!mob?.species.taming.eligible || mob.juvenile || typeof owner!=='string' ||
          !owner.length || owner.length>128 || animals.#tamed.has(id)) throw TypeError('Invalid tame ownership');
      animals.#tamed.set(id,owner);
    }
    return animals;
  }

  advance(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return;
    this.#time += Math.min(.2, seconds);
    for (const id of this.#tamed.keys()) if (!this.#engine.get(id)) this.#tamed.delete(id);
    for (const [id, until] of this.#recentParents) if (this.#time >= until) this.#recentParents.delete(id);
    for (const [owner, mount] of this.#mounts) if (!isAwake(this.#engine.get(mount.id))) this.#mounts.delete(owner);
  }

  #near(mob, owner) {
    if (!isAwake(mob) || !eligibleTarget(owner) || mob.juvenile ||
        distanceTo(mob.position, owner.position) > 2) return false;
    const [x, y, z] = mob.position;
    const [ox, oy, oz] = owner.position;
    return this.#world.lineOfSight([x, y + mob.species.body.height * .6, z], [ox, oy + owner.height * .5, oz]);
  }

  tame(id, owner) {
    const mob = this.#engine.get(id);
    if (!mob?.species.taming.eligible || !this.#near(mob, owner) || this.#tamed.has(id) ||
        this.#world.environment(mob.position).hazard) return false;
    this.#tamed.set(id, owner.id);
    return true;
  }

  isTamed(id, owner) {
    return Boolean(owner?.id && this.#tamed.get(id) === owner.id);
  }

  mount(id, owner) {
    const mob = this.#engine.get(id);
    if (!mob?.species.riding.eligible || !this.isTamed(id, owner) || !this.#near(mob, owner) ||
        this.#mounts.has(owner.id) || [...this.#mounts.values()].some(mount => mount.id === id)) return false;
    const [x, y, z] = mob.position;
    if (this.#world.volume([x, y + mob.species.body.height, z], { radius: .24, height: owner.height }) !== 'clear')
      return false;
    this.#mounts.set(owner.id, { id, height: owner.height, direction: [0, 0], pace: 1 });
    return true;
  }

  steer(owner, direction, run = false) {
    const mount = this.#mounts.get(owner?.id);
    if (!mount || !Array.isArray(direction) || direction.length !== 2 || !direction.every(Number.isFinite)) return false;
    mount.direction = [...direction];
    mount.pace = run ? 1.55 : 1;
    return true;
  }

  dismount(owner) {
    return this.#mounts.delete(owner?.id);
  }

  riderPosition(owner) {
    const mount = this.#mounts.get(owner?.id);
    const mob = mount && this.#engine.get(mount.id);
    if (!isAwake(mob)) return null;
    const [x, y, z] = mob.position;
    return [x, y + mob.species.body.height, z];
  }

  directive(mob) {
    for (const mount of this.#mounts.values()) {
      if (mount.id === mob.id) return {
        state: mount.pace > 1 ? 'mounted-run' : 'mounted-walk',
        heading: { direction: mount.direction, pace: mount.pace, riderHeight: mount.height }
      };
    }
    return null;
  }

  breed(firstId, secondId) {
    const first = this.#engine.get(firstId);
    const second = this.#engine.get(secondId);
    if (firstId === secondId || !isAwake(first) || !isAwake(second) || first.species !== second.species ||
        first.juvenile || second.juvenile || !first.species.breeding.eligible ||
        this.#recentParents.has(firstId) || this.#recentParents.has(secondId) ||
        distanceTo(first.position, second.position) > 2.4) return null;
    const { species } = first;
    const nearby = this.#engine.all().filter(mob =>
      mob.species === species && distanceTo(first.position, mob.position) <= 12);
    if (nearby.length >= Math.max(3, species.population.localLimit)) return null;
    const [x, y, z] = first.position;
    for (const [dx, dz] of [[0, 1.4], [0, -1.4], [-1.4, 0], [1.4, 0]]) {
      const point = [x + dx, y, z + dz];
      const { biome, light, hazard } = this.#world.environment(point);
      const { biomes, light: bounds, depth } = species.habitat;
      if (hazard || !biomes.includes(biome) || light === null ||
          light < bounds[0] || light > bounds[1] || y < depth[0] || y > depth[1] ||
          (!this.#world.grounded(point,species.body) &&
            !(species.movement.capabilities.includes('swim') && this.#world.volume(point,species.body)==='clear' &&
              this.#world.medium?.([point[0],point[1]+Math.min(.18,species.body.height*.3),point[2]])==='water')) ||
          nearby.some(mob => distanceTo(point, mob.position) < species.body.radius * 2)) continue;
      const child = this.#engine.spawn(species.id, point, { juvenile: true });
      if (!child) return null;
      for (const id of [firstId, secondId]) this.#recentParents.set(id, this.#time + 18);
      return child;
    }
    return null;
  }
}
