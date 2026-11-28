// Detached U9 scenery for surveyed gallery air. The existing habitat and
// nonblock-scene owners still enforce native mounts, selection and removal.
import { BLOCK } from '../voxel.mjs';
import { describeCandidateObject } from '../nonblock/candidate-scene.mjs';
import { planStagedHabitat } from '../nonblock/staged-habitats.mjs';

const families = [
  ['scene48:cavecap', 1],
  ['nonblock:e:pebble-scatter', 1],
  ['nonblock:e:mineral-encrustation', 4],
];
const ownerOf = ([x,, z]) => Math.floor(x / 4) + ',' + Math.floor(z / 4);
const overlaps = (a, b) => a.min.every((value, axis) => value < b.max[axis] && a.max[axis] > b.min[axis]);

function rank([x, y, z], seed) {
  let value = Math.imul(x, 0x7feb352d) ^ Math.imul(z, 0x846ca68b) ^ Math.imul(y, 0x9e3779b1) ^ seed;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return (value ^ (value >>> 16)) >>> 0;
}

export function planRetainedGalleryScenery(world, anchors, { cx, cz, band, prior = [], occupied = () => false } = {}) {
  if (![cx, cz, band].every(Number.isSafeInteger) || !Array.isArray(anchors) || !Array.isArray(prior) ||
      prior.length > 27 || typeof occupied !== 'function') throw TypeError('Invalid detached gallery scene');
  const present = new Set(prior.map(row => ownerOf(row.anchor)));
  const mounted = prior.map(row => describeCandidateObject(world.seed, row));
  const nearby = anchors.filter(([x, y, z]) => y >= band * 8 && y < (band + 1) * 8 &&
    Math.abs(Math.floor(x / 16) - cx) <= 1 && Math.abs(Math.floor(z / 16) - cz) <= 1);
  nearby.sort((a, b) => rank(a, world.seed) - rank(b, world.seed) || a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const placements = [];
  for (const anchor of nearby.slice(0, 96)) {
    if (placements.length >= Math.min(6, 27 - prior.length)) break;
    const [x, y, z] = anchor, pocket = ownerOf(anchor);
    if (present.has(pocket) || world.get(x, y, z) !== BLOCK.AIR || world.get(x, y + 1, z) !== BLOCK.AIR) continue;
    const downwardSolid = world.get(x, y - 1, z) !== BLOCK.AIR;
    const choice = rank(anchor, world.seed), order = choice % families.length;
    for (let pass = 0; pass < families.length; pass++) {
      const [sceneId, turns] = families[(order + pass) % families.length];
      if (turns === 1 && !downwardSolid) continue;
      for (let turn = 0; turn < turns; turn++) {
        const orientation = (choice + turn) % turns;
        const request = { habitat: 'cave', sceneId, anchor, variant: (choice >>> 8) % 4, orientation };
        const [placement] = planStagedHabitat(world, [request], { occupied });
        if (!placement) continue;
        const object = describeCandidateObject(world.seed, placement);
        if (object.colliders.length || mounted.some(priorObject => overlaps(object, priorObject))) continue;
        placements.push(placement);
        mounted.push(object);
        present.add(pocket);
        break;
      }
      if (present.has(pocket)) break;
    }
  }
  return placements;
}
