// Read-only E7 fixture admission. Run the existing player controller through
// the actual wilderness source and the landmark's reserved natural corridor.
import { collides } from '../voxel.mjs';
import { stepPlayer } from '../physics.mjs';

const directions = [[0, 1], [-1, 0], [0, -1], [1, 0]];
export function inspectWildsLandmarkWalk(world, landmark) {
  if (!world?.wildsSource || !landmark || !directions[landmark.turn]) throw TypeError('Expected a natural Wilds landmark');
  const [x, floor, z] = landmark.origin, feet = floor + 1, [dx, dz] = directions[landmark.turn];
  const radius = landmark.radius ?? 4, limit = 160 + 20 * radius;
  for (const lane of [-.5, -1, 0]) for (const start of [-radius - 2, -radius - 1]) {
    const from = { x: x + .5 + lane * dz + start * dx, z: z + .5 - lane * dx + start * dz, feet };
    if (collides(world, from.x, feet, from.z) || !collides(world, from.x, feet - .065, from.z)) continue;
    const actor = { ...from, yaw: Math.atan2(dx, dz), vX: 0, vY: 0, vZ: 0, onGround: true, coyote: .09, jumpBuffer: 0 };
    const distance = 1 - start;
    const progress = () => (actor.x - from.x) * dx + (actor.z - from.z) * dz;
    function walk(heading, unfinished) {
      let frames = 0;
      while (unfinished() && frames < limit) {
        stepPlayer(world, actor, { forward: heading }, 1 / 60);
        frames++;
        if (Math.abs(actor.feet - feet) > .12 || collides(world, actor.x, actor.feet, actor.z)) return null;
      }
      return unfinished() ? null : frames;
    }
    const forward = walk(1, () => progress() < distance);
    if (forward === null) continue;
    actor.vX = actor.vZ = 0;
    const reverse = walk(-1, () => progress() > .11);
    if (reverse !== null) return { from, distance, forward, reverse };
  }
  return null;
}
