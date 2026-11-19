import { supportedPosition } from './movement.mjs';
import { validPoint } from './world-query.mjs';

const offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const horizontal = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);
const key = ([x, y, z]) => [Math.floor(x), Math.round(y * 16), Math.floor(z)].join(',');
const budgetValue = (value, fallback, max) => Number.isInteger(value) && value > 0 ?
  Math.min(value, max) : fallback;

function elevation(world, species, from, x, z) {
  const body = species.body;
  const rise = species.movement.stepHeight;
  const current = from[1];
  const high = current + rise;
  const low = current - .72;
  const level = [x, current, z];
  if (world.environment(level).hazard) return null;
  if (world.grounded(level, body)) return level;
  const highStatus = world.volume([x, high, z], body);
  if (highStatus === 'unknown') return null;
  return supportedPosition(world, x, z, highStatus === 'clear' ? high : current, low, body);
}

function transition(world, species, start, end) {
  const body = species.body;
  let previous = start;
  const samples = Math.max(1, Math.ceil(horizontal(start, end) / .2));
  for (let i = 1; i <= samples; i++) {
    const fraction = i / samples;
    const x = start[0] + (end[0] - start[0]) * fraction;
    const z = start[2] + (end[2] - start[2]) * fraction;
    let next = [x, previous[1], z];
    if (world.environment(next).hazard) return false;
    if (!world.grounded(next, body))
      next = elevation(world, species, previous, x, z);
    if (!next || next[1] > start[1] + species.movement.stepHeight + 1e-4 ||
        next[1] < start[1] - .72 ||
        world.volume([previous[0], Math.max(previous[1], next[1]), previous[2]], body) !== 'clear' ||
        world.volume([x, Math.max(previous[1], next[1]), z], body) !== 'clear') return false;
    previous = next;
  }
  return Math.abs(previous[1] - end[1]) <= .075;
}

function flatConnection(world, species, from, to) {
  const distance = horizontal(from, to);
  if (distance > 5 || Math.abs(from[1] - to[1]) > .03) return false;
  const samples = Math.max(1, Math.ceil(distance / .2));
  for (let i = 1; i <= samples; i++) {
    const fraction = i / samples;
    const point = from.map((value, axis) => value + (to[axis] - value) * fraction);
    if (world.environment(point).hazard || !world.grounded(point, species.body)) return false;
  }
  return true;
}

export function findRoute(world, species, from, target, { quota = 72, radius = 9 } = {}) {
  const maxWork = budgetValue(quota, 72, 128);
  const maxRadius = budgetValue(radius, 9, 14);
  let work = 0;
  const failure = status => ({ status, nodes: [], work });
  if (!validPoint(from) || !validPoint(target) || !species?.movement.capabilities.includes('walk') ||
      !world.grounded(from, species.body) || !world.residentAt(target) ||
      world.environment(target).hazard || horizontal(from, target) > maxRadius)
    return failure('unreachable');
  if (flatConnection(world, species, from, target))
    return { status: 'complete', nodes: [[...target]], work: 1 };
  const heuristic = point => horizontal(point, target) + Math.abs(point[1] - target[1]) * .3;
  const first = { point: [...from], cost: 0, score: heuristic(from), previous: null };
  const open = [first];
  const visited = new Map([[key(from), 0]]);
  while (open.length && work < maxWork) {
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i].score < open[best].score) best = i;
    const node = open.splice(best, 1)[0];
    if (node.cost !== visited.get(key(node.point))) continue;
    work++;
    if (horizontal(node.point, target) < .74 && Math.abs(node.point[1] - target[1]) < .62 &&
        world.grounded(target, species.body) && transition(world, species, node.point, target)) {
      const nodes = [[...target]];
      for (let path = node; path.previous; path = path.previous) nodes.unshift(path.point);
      return { status: 'complete', nodes, work };
    }
    for (const [dx, dz] of offsets) {
      const x = Math.floor(node.point[0]) + .5 + dx;
      const z = Math.floor(node.point[2]) + .5 + dz;
      if (Math.hypot(x - from[0], z - from[2]) > maxRadius) continue;
      const point = elevation(world, species, node.point, x, z);
      if (!point || !transition(world, species, node.point, point)) continue;
      const label = key(point);
      const cost = node.cost + horizontal(node.point, point) + Math.abs(point[1] - node.point[1]) * .4;
      if (cost >= (visited.get(label) ?? Infinity)) continue;
      visited.set(label, cost);
      open.push({ point, cost, score: cost + heuristic(point), previous: node });
    }
  }
  return failure(open.length ? 'budget' : 'unreachable');
}

export class LocalNavigator {
  #world;
  #paths = new Map();
  #tick = 0;
  #left = 0;
  #searches = 0;
  #work = 0;

  constructor(world) {
    this.#world = world;
  }

  beginTick() {
    this.#tick++;
    this.#left = 96;
    this.#searches = 2;
    this.#work = 0;
  }

  get work() {
    return this.#work;
  }

  inspect(id) {
    const route = this.#paths.get(id);
    return route ? structuredClone(route) : undefined;
  }

  forget(id) {
    this.#paths.delete(id);
  }

  steer(mob, target) {
    if (!validPoint(target)) return [0, 0];
    const revision = this.#world.revision();
    let route = this.#paths.get(mob.id);
    const expired = !route || route.revision !== revision || horizontal(route.target, target) > .85 ||
      Math.abs(route.target[1] - target[1]) > .5;
    if (expired || (!route.nodes.length && this.#tick >= route.retry)) {
      if (!this.#searches || !this.#left) return [0, 0];
      this.#searches--;
      const { nodes, work } = findRoute(this.#world, mob.species, mob.position, target,
        { quota: Math.min(72, this.#left) });
      this.#left -= work;
      this.#work += work;
      route = { nodes, revision, target: [...target], retry: this.#tick + 15, position: mob.position, stuck: 0 };
      this.#paths.set(mob.id, route);
    }
    while (route.nodes.length && horizontal(mob.position, route.nodes[0]) < .12) route.nodes.shift();
    const next = route.nodes[0];
    if (!next) return [0, 0];
    route.stuck = horizontal(mob.position, route.position) < .008 ? route.stuck + 1 : 0;
    route.position = mob.position;
    if (route.stuck >= 12 || this.#world.environment(next).hazard) {
      route.nodes = [];
      route.retry = this.#tick + 8;
      return [0, 0];
    }
    const dx = next[0] - mob.position[0];
    const dz = next[2] - mob.position[2];
    const scale = Math.max(.15, Math.hypot(dx, dz));
    return [dx / scale, dz / scale];
  }
}
