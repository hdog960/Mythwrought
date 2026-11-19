import { BLOCK, chunkCoord } from '../voxel.mjs';
import { sectionForY } from '../depth.mjs';
import { biome130Block, isBiome130BlockId } from '../biome130-registry.mjs';
import { isPack2LiveId, pack2ShapeOf } from '../pack2-integration.mjs';
import { FULL_CUBE, raycastShapes } from '../voxel-shape-interactions.mjs';

const EPSILON = 1e-5;
const EMPTY = Object.freeze({ boxes: [] });
const BLOCKED = Object.freeze({ biome: null, light: null, hazard: true, objects: [] });

export function validPoint(point) {
  return Array.isArray(point) && point.length === 3 &&
    point.every(value => Number.isFinite(value) && Math.abs(value) < 2 ** 26);
}

function validBody(body) {
  return body && body.radius >= .08 && body.radius <= 1.25 &&
    body.height >= .12 && body.height <= 3.5;
}

function overlaps(body, cell, box) {
  return cell.every((value, axis) =>
    body[axis + 3] > value + box[axis] + EPSILON &&
    body[axis] < value + box[axis + 3] - EPSILON);
}

export function createWorldQuery(world, {
  resident, revision = () => 0, observe = () => BLOCKED, overlayRayHit
} = {}) {
  if (typeof world?.get !== 'function' || typeof resident !== 'function' ||
      typeof revision !== 'function' || typeof observe !== 'function')
    throw new TypeError('World queries require a voxel reader and explicit residency');

  function cellResident(x, y, z) {
    const section = sectionForY(y);
    return section !== null && resident(chunkCoord(x), chunkCoord(z), section) === true;
  }

  function shapeAt(x, y, z) {
    if (!cellResident(x, y, z)) return null;
    const id = world.get(x, y, z);
    if (id === BLOCK.AIR || id === 76) return EMPTY;
    if (isPack2LiveId(id)) {
      const state = world.getPack2State?.(x, y, z);
      return state ? pack2ShapeOf(id, state) : null;
    }
    if (isBiome130BlockId(id)) {
      const shape = biome130Block(id, world.rotationAt?.(x, y, z) ?? 0);
      return shape.solid ? shape : EMPTY;
    }
    return Number.isInteger(id) && id >= BLOCK.GRASS && id <= BLOCK.DEEPSTONE ? FULL_CUBE : null;
  }

  function volume(point, body) {
    if (!validPoint(point) || !validBody(body)) return 'unknown';
    const [x, y, z] = point;
    const { radius, height } = body;
    const bounds = [x - radius, y, z - radius, x + radius, y + height, z + radius];
    let solid = false;
    for (let bx = Math.floor(bounds[0] + EPSILON); bx <= Math.floor(bounds[3] - EPSILON); bx++) {
      for (let bz = Math.floor(bounds[2] + EPSILON); bz <= Math.floor(bounds[5] - EPSILON); bz++) {
        for (let by = Math.floor(bounds[1] + EPSILON); by <= Math.floor(bounds[4] - EPSILON); by++) {
          const shape = shapeAt(bx, by, bz);
          if (!shape) return 'unknown';
          if (!solid && shape.boxes.some(box => overlaps(bounds, [bx, by, bz], box))) solid = true;
        }
      }
    }
    if (solid || (world.pack3Runtime?.size?.() > 0 && !world.pack3Runtime.playerFits(bounds).fits) ||
        world.manual14Collision?.(bounds) || world.pack5Collision?.(bounds)) return 'solid';
    return 'clear';
  }

  function grounded(point, body) {
    return volume(point, body) === 'clear' &&
      volume([point[0], point[1] - .035, point[2]], body) === 'solid';
  }

  function lineOfSight(from, to) {
    if (!validPoint(from) || !validPoint(to)) return false;
    const vector = to.map((value, axis) => value - from[axis]);
    const distance = Math.hypot(...vector);
    if (distance > 24) return false;
    if (distance < EPSILON) return cellResident(...from.map(Math.floor));
    const hit = raycastShapes(from, vector, (x, y, z) => {
      const shape = shapeAt(x, y, z);
      return shape ? (shape.boxes.length ? shape : null) : FULL_CUBE;
    }, distance);
    if (hit && hit.distance < distance - EPSILON) return false;
    for (const layer of [world.pack3Runtime, world.manual14Layer]) {
      if (layer?.size?.() > 0 && layer.target?.(from, vector, distance)) return false;
    }
    // Pack 5 can be supplied an authoritative host ray service. Without it,
    // a populated Pack 5 overlay cannot certify that an attack ray is clear.
    if (world.pack5Collision && !overlayRayHit) return false;
    return !overlayRayHit?.(from, vector, distance);
  }

  function environment(point) {
    if (!validPoint(point) || !cellResident(...point.map(Math.floor))) return BLOCKED;
    const sample = observe([...point]);
    if (!sample || typeof sample !== 'object') return BLOCKED;
    return {
      biome: typeof sample.biome === 'string' ? sample.biome : null,
      light: Number.isFinite(sample.light) && sample.light >= 0 && sample.light <= 1 ? sample.light : null,
      hazard: sample.hazard !== false,
      objects: Array.isArray(sample.objects) ? sample.objects.slice(0, 8) : []
    };
  }

  return Object.freeze({ volume, grounded, lineOfSight, environment, revision,
    residentAt: point => validPoint(point) && cellResident(...point.map(Math.floor)) });
}
