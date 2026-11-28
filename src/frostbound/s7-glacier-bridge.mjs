// The roadmap's Glacier Bridge, surveyed as a walkable natural ice span.
import { BLOCK, collides, worldKey } from '../voxel.mjs';
import { stepPlayer } from '../physics.mjs';
import { glacierlandsWeight } from './s4-glacierlands.mjs';
import { openFrostboundIceFormationWitness } from './s5-glacier-arch.mjs';

const nativeIce = new Set([272, 275, 276, 279]);

export function surveyGlacierBridge(world, { x, z, axis, span }) {
  if (![x, z, span].every(Number.isSafeInteger) || span < 5 || span > 11 || !['x', 'z'].includes(axis)) return null;
  const at = (run, across) => axis === 'x' ? [x + run, z + across] : [x + across, z + run];
  const protectedAt = (a, y, b) => world.environmentCaves.get(a, y, b) !== undefined ||
    world.edits.has(worldKey(a, y, b));
  function cap(a, b) {
    const column = world._columnPlan(a, b);
    if (!column.size || glacierlandsWeight(a, b, world.seed) < .53) return null;
    const y = Math.max(...column.keys());
    return nativeIce.has(world.get(a, y, b)) && !protectedAt(a, y, b) &&
      !protectedAt(a, y - 1, b) && world.get(a, y - 1, b) !== BLOCK.AIR ? y : null;
  }
  const near = cap(x, z), far = cap(...at(span + 1, 0));
  if (near === null || far === null || Math.abs(near - far) > 1) return null;
  const deck = Math.max(near, far) + 1;
  if (deck < 5 || deck > 16) return null;
  const cells = [], route = [], banks = [];
  let deepFloor = 0;
  const clear = (a, y, b) => world.get(a, y, b) === BLOCK.AIR && !protectedAt(a, y, b);
  for (let run = -2; run <= span + 3; run++) {
    const across = run >= 0 && run <= span + 1 ? [-1, 0, 1] : [0];
    for (const width of across) {
      const [a, b] = at(run, width), terrain = cap(a, b);
      if (terrain === null) return null;
      const bank = run === 0 || run === span + 1;
      const covered = run > 0 && run <= span;
      const floor = bank || covered ? deck : terrain;
      if (terrain > floor || (bank && floor - terrain > 3)) return null;
      if ((run === -1 || run === span + 2) && deck - terrain > 1) return null;
      if (!clear(a, floor + 1, b) || !clear(a, floor + 2, b)) return null;
      if (bank) {
        if (terrain === deck) return null;
        banks.push([a, terrain, b]);
        for (let y = terrain + 1; y < deck; y++) {
          if (!clear(a, y, b)) return null;
          cells.push([a, y, b, 276]);
        }
      }
      if (bank || covered) {
        if (!clear(a, deck, b)) return null;
        cells.push([a, deck, b, width === 0 ? 275 : 276]);
      }
      if (covered && width === 0 && terrain <= deck - 2 && clear(a, deck - 1, b)) deepFloor++;
      if (width === 0) route.push([a, floor + 1, b]);
    }
  }
  if (deepFloor < Math.ceil(span / 2) || route.some((point, index) =>
    index > 0 && Math.abs(point[1] - route[index - 1][1]) > 1)) return null;
  return { name: 'Glacier Bridge', origin: [x, deck, z], axis, span, cells, banks, route, deepFloor };
}

export const openGlacierBridgeWitness = openFrostboundIceFormationWitness;

export function inspectGlacierBridgeWalk(source, bridge) {
  const world = openGlacierBridgeWitness(source, bridge), xAxis = bridge.axis === 'x';
  function walk(route) {
    const [x, feet, z] = route[0], end = route.at(-1), component = xAxis ? 0 : 2;
    const direction = Math.sign(end[component] - route[0][component]);
    const yaw = xAxis ? direction * Math.PI / 2 : direction === 1 ? 0 : Math.PI;
    const player = { x: x + .5, z: z + .5, feet, yaw, vX: 0, vY: 0, vZ: 0, onGround: true, coyote: 0, jumpBuffer: 0 };
    const along = () => xAxis ? player.x : player.z;
    let frames = 0;
    while ((end[component] + .5 - along()) * direction > .1 && frames < 300) {
      const step = stepPlayer(world, player, { forward: 1 }, 1 / 60);
      if (step.hitWall || collides(world, player.x, player.feet, player.z)) return 0;
      frames++;
    }
    for (let tick = 0; tick < 25; tick++) stepPlayer(world, player, {}, 1 / 60);
    return frames < 300 && player.onGround && Math.abs(player.feet - end[1]) < .16 &&
      Math.abs(end[component] + .5 - along()) < .5 ? frames : 0;
  }
  const forward = walk(bridge.route), reverse = walk([...bridge.route].reverse());
  return forward && reverse ? { forward, reverse } : null;
}
