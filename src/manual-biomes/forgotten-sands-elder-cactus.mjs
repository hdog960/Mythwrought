// A detached elder candidate based on Mythwrought's existing ribbed column
// cactus. Its render and collision geometry share the same bend and rotation.
import { BLOCK, worldKey } from '../voxel.mjs';
import { makeColumnCactus } from '../nonblock-environments24/column-cactus.mjs';
import { candidateVertices } from '../nonblock/candidate-scene.mjs';
import { raycastShapes } from '../voxel-shape-interactions.mjs';

const palette = [[.24, .40, .29], [.34, .53, .34], [.44, .59, .40], [.56, .68, .46]];
const overlap = (body, box) =>
  body[0] < box[3] && body[3] > box[0] && body[1] < box[4] &&
  body[4] > box[1] && body[2] < box[5] && body[5] > box[2];

function turn(x, z, orientation) {
  switch (orientation) {
    case 1: return [-z, x];
    case 2: return [-x, -z];
    case 3: return [z, -x];
    default: return [x, z];
  }
}

export function surveyElderCactus(world, stand, { height = 17, orientation = 0 } = {}) {
  if (stand?.age !== 'ancient' || !Number.isInteger(height) || height < 12 || height > 18 ||
      !Number.isInteger(orientation) || orientation < 0 || orientation > 3) return null;
  const [x, soil, z] = stand.support, y = soil + 1;
  if (![x, y, z].every(Number.isSafeInteger) || ![256, 257, 258, 260, 261, 262].includes(world.get(x, soil, z)) ||
      world.get(x, soil - 1, z) === BLOCK.AIR || world.environmentCaves.get(x, soil, z) !== undefined ||
      world.environmentCaves.get(x, soil - 1, z) !== undefined || world.edits.has(worldKey(x, soil, z))) return null;
  const source = makeColumnCactus({ seed: world.seed, anchor: [x, y, z], variant: 3 });
  const original = source.mesh.positions;
  let originalHeight = 0;
  for (let i = 1; i < original.length; i += 3) originalHeight = Math.max(originalHeight, original[i]);
  function transform(a, b, c) {
    const t = Math.max(0, Math.min(1, b / originalHeight));
    const [dx, dz] = turn(5.25 * a + 1.8 * t * t, 5.25 * c + .7 * t * t, orientation);
    return [x + .5 + dx, y + t * height, z + .5 + dz];
  }
  const positions = new Float32Array(original.length);
  for (let i = 0; i < original.length; i += 3) positions.set(transform(...original.slice(i, i + 3)), i);
  const colliders = [];
  for (const { min, max } of source.selectionAabbs) {
    const start = Math.max(0, min[1] * height / originalHeight);
    const end = Math.min(height, max[1] * height / originalHeight);
    for (let low = start; low < end;) {
      const high = Math.min(Math.floor(low) + 1, end);
      const corners = [];
      for (const a of [min[0], max[0]]) for (const b of [low, high]) for (const c of [min[2], max[2]]) {
        corners.push(transform(a, b * originalHeight / height, c));
      }
      colliders.push([0, 1, 2].map(axis => Math.min(...corners.map(point => point[axis])))
        .concat([0, 1, 2].map(axis => Math.max(...corners.map(point => point[axis])))));
      low = high;
    }
  }
  const localShapes = new Map();
  for (const box of colliders) {
    for (let a = Math.floor(box[0]); a < Math.ceil(box[3]); a++)
      for (let b = Math.floor(box[1]); b < Math.ceil(box[4]); b++)
        for (let c = Math.floor(box[2]); c < Math.ceil(box[5]); c++) {
          const cell = [a, b, c], key = worldKey(...cell);
          if (world.get(...cell) !== BLOCK.AIR || world.environmentCaves.get(...cell) !== undefined ||
              world.edits.has(key)) return null;
          if (!localShapes.has(key)) localShapes.set(key, { boxes: [] });
          const clipped = cell.map((value, axis) => Math.max(0, box[axis] - value))
            .concat(cell.map((value, axis) => Math.min(1, box[axis + 3] - value)));
          localShapes.get(key).boxes.push(clipped);
        }
  }
  const mesh = candidateVertices([{ positions, materials: source.mesh.materials, palette }]);
  const witness = Object.create(world, {
    get: { value: (...point) => world.get(...point) },
    naturalAndLandmarkBlock: { value: (...point) => world.naturalAndLandmarkBlock(...point) },
    stagedNonblockCollision: { value: body => colliders.some(box => overlap(body, box)) },
    set: { value() { throw Error('Read-only elder cactus witness'); } },
    save: { value() { throw Error('Elder cactus research requires a durable object profile'); } }
  });
  function pick(origin, direction, reach) {
    return raycastShapes(origin, direction, (...point) => localShapes.get(worldKey(...point)) ?? null, reach);
  }
  return { anchor: [x, y, z], height, orientation, mesh, positions, colliders,
    collisionCells: [...localShapes.keys()], triangles: source.mesh.triangleCount, witness, pick };
}
