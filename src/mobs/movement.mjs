import { GRAVITY } from '../physics.mjs';

const PRECISION = .0001;
const RISE_SAMPLE = .05;

function attemptAxis(world, mob, axis, displacement) {
  if (!displacement) return;
  const start = mob.position;
  const next = [...start];
  next[axis] += displacement;
  const collision = world.volume(next, mob.species.body);
  if (collision === 'clear') {
    mob.position = next;
    return;
  }
  if (axis !== 1 && collision === 'solid' && mob.grounded) {
    const maxRise = mob.species.movement.stepHeight;
    for (let rise = Math.min(RISE_SAMPLE, maxRise); rise > 0; rise = Math.min(maxRise, rise + RISE_SAMPLE)) {
      const raised = [start[0], start[1] + rise, start[2]];
      if (world.volume(raised, mob.species.body) !== 'clear') break;
      const raisedDestination = [...next];
      raisedDestination[1] += rise;
      if (world.grounded(raisedDestination, mob.species.body)) {
        mob.position = raisedDestination;
        return;
      }
      if (rise >= maxRise) break;
    }
  }
  let low = 0;
  let high = 1;
  for (let i = 0; i < 10 && (high - low) * Math.abs(displacement) > PRECISION; i++) {
    const midpoint = (low + high) / 2;
    const point = [...start];
    point[axis] += displacement * midpoint;
    if (world.volume(point, mob.species.body) === 'clear') low = midpoint;
    else high = midpoint;
  }
  const clipped = [...start];
  clipped[axis] += displacement * low;
  mob.position = clipped;
  mob.velocity[axis] = 0;
}

export function moveBody(world, mob, heading, dt) {
  const [dx, dz] = Array.isArray(heading) && heading.length === 2 &&
    heading.every(Number.isFinite) ? heading : [0, 0];
  const magnitude = Math.hypot(dx, dz);
  const speed = mob.species.movement.speed;
  const scale = Number.isFinite(magnitude) ? speed / Math.max(1, magnitude) : 0;
  if (magnitude > 0 && scale) mob.yaw = Math.atan2(dx, dz);
  mob.grounded = world.grounded(mob.position, mob.species.body);
  mob.velocity[0] = dx * scale;
  mob.velocity[2] = dz * scale;
  mob.velocity[1] = Math.max(-10, (mob.grounded ? 0 : mob.velocity[1]) - GRAVITY * dt);
  const distance = Math.max(...mob.velocity.map(Math.abs)) * dt;
  // Narrow registered planes can be crossed between frame endpoints. Slice
  // motion below the minimum body diameter and test each axis independently.
  const substeps = Math.max(1, Math.ceil(distance / .065));
  for (let i = 0; i < substeps; i++) {
    const time = dt / substeps;
    for (const axis of [0, 2, 1]) attemptAxis(world, mob, axis, mob.velocity[axis] * time);
    mob.grounded = world.grounded(mob.position, mob.species.body);
  }
}

export function supportedPosition(world, x, z, high, low, body) {
  if (![x, z, high, low].every(Number.isFinite) || high < low || high - low > 5)
    return null;
  let upper = high;
  if (world.volume([x, high, z], body) !== 'clear') return null;
  for (let y = high; ; y = Math.max(low, y - .125)) {
    const status = world.volume([x, y, z], body);
    if (status === 'unknown') return null;
    if (status === 'solid') {
      let bottom = y;
      for (let i = 0; i < 11; i++) {
        const midpoint = (bottom + upper) / 2;
        if (world.volume([x, midpoint, z], body) === 'clear') upper = midpoint;
        else bottom = midpoint;
      }
      const point = [x, upper, z];
      return world.grounded(point, body) ? point : null;
    }
    if (world.grounded([x, y, z], body)) return [x, y, z];
    if (y === low) return null;
    upper = y;
  }
}

export function supportsMovement(species, mode) {
  return species.movement.capabilities.includes(mode);
}
