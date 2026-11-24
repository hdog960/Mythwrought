// Shared live-game draw/admission budget. Preview combat keeps its own cap.
export const LIVE_CREATURE_DRAW_LIMIT = 8;
export const LIVE_PROJECTILE_LIMIT = 4;
export const LIVE_PROJECTILE_IDS = Object.freeze([
  'projectile', 'briar-spore', 'frost-splinter', 'void-mote'
]);
const projectileIds = new Set(LIVE_PROJECTILE_IDS);
export const isLiveProjectileId = id => projectileIds.has(id);

// Input is the renderer's already distance-sorted, valid candidate list.
// A projectile never competes with a creature for the eight creature slots.
export function selectLiveDrawEntries(ordered) {
  const result = [];
  let creatures = 0, projectiles = 0;
  for (const entry of ordered) {
    if (isLiveProjectileId(entry.e.species.id)) {
      if (projectiles >= LIVE_PROJECTILE_LIMIT) continue;
      projectiles++;
    } else {
      if (creatures >= LIVE_CREATURE_DRAW_LIMIT) continue;
      creatures++;
    }
    result.push(entry);
    if (creatures === LIVE_CREATURE_DRAW_LIMIT && projectiles === LIVE_PROJECTILE_LIMIT) break;
  }
  return result;
}
