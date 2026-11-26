// Opt-in bridge from an actual observed player frame to ephemeral waypoint history.
// No terrain generation, save writes, map discovery or production UI registration.
export const NAV00_OBSERVED_MARKER_ADAPTER_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function pinObservedPlayerMarker(history, id, frame) {
  if (!history || typeof history.pin !== 'function' || !frame || typeof frame !== 'object') throw Error('Invalid navigation marker frame');
  const {player, observed, worldSeed} = frame;
  if (observed !== true || !player || typeof player !== 'object' || !finite(player.x) || !finite(player.z) || (player.y !== undefined && !finite(player.y))) throw Error('Marker requires observed player position');
  if (worldSeed === undefined) throw Error('World seed required');
  const point = {x:player.x,z:player.z,...(player.y===undefined?{}:{y:player.y})};
  return history.pin(id,point,{observed:true,seed:worldSeed});
}
