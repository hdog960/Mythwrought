// Detached U8 material trial. Replace only exposed, already solid gallery
// walls with original full-cube minerals. Leave the carved volume unchanged.
import { BLOCK } from '../voxel.mjs';
import { depthMeshKey, sectionForY } from '../depth.mjs';

const sides = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const keyOf = (x, y, z) => [x, y, z].join(',');
const isHost = id => id === BLOCK.STONE || id === BLOCK.DEEPSTONE;

function geologicalMaterial(x, y, z, seed) {
  // The shallow layer carries ore. Deeper seams feather into native crystal
  // along a world-space boundary that crosses depths and chunk edges.
  const seam = -47 + 4 * Math.sin(x * .17 + z * .13 + seed * .05);
  return y < seam ? BLOCK.CRYSTAL : BLOCK.ORE;
}

export function surveyGalleryWallGeology(world, { anchors, protectedCells, allowedOwners }) {
  const eligible = new Map();
  for (const [x, y, z] of anchors) {
    if (y > -18 || y < -76 || world.get(x, y, z) !== BLOCK.AIR) continue;
    for (const [dx, dz] of sides) {
      const a = x + dx, b = z + dz, key = keyOf(a, y, b);
      const owner = depthMeshKey(Math.floor(a / 16), Math.floor(b / 16), sectionForY(y));
      if (!allowedOwners.has(owner) || protectedCells.has(key) || eligible.has(key)) continue;
      const host = world.get(a, y, b);
      if (!isHost(host) || !isHost(world.get(a, y + 1, b)) || !isHost(world.get(a, y - 1, b))) continue;
      if (world.get(x, y - 1, z) !== BLOCK.AIR && world.get(x, y + 1, z) !== BLOCK.AIR) continue;
      const score = Math.sin(a * .39 + b * .26 + world.seed * .007) * Math.cos(y * .6 + b * .16);
      if (score < .55) continue;
      const id = geologicalMaterial(a, y, b, world.seed);
      eligible.set(key, { cell: [a, y, b], air: [x, y, z], owner, id, host, score });
    }
  }
  const changes = new Map(), ownerCounts = new Map();
  for (const [key, row] of [...eligible].sort(([left, a], [right, b]) => b.score - a.score || left.localeCompare(right))) {
    const count = ownerCounts.get(row.owner) ?? 0;
    if (count >= 8) continue;
    ownerCounts.set(row.owner, count + 1);
    changes.set(key, row);
  }
  return changes;
}
