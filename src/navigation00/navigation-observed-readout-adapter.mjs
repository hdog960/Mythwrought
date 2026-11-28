// Opt-in adapter: caller-supplied observations only; never samples undiscovered terrain.
import {createNavigationLocationReadout} from './navigation-location-readout.mjs';
export const NAV00_OBSERVED_READOUT_ADAPTER_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function createObservedNavigationReadout(frame, options={}) {
  if (!frame || typeof frame !== 'object' || !frame.player || !options || typeof options !== 'object') throw Error('Invalid observed navigation frame');
  const {player, observedSurface=null, observedAt=null, worldSeed=null} = frame;
  if (observedSurface!==null) {
    if (!observedSurface || !finite(observedSurface.x) || !finite(observedSurface.z) || !finite(observedSurface.y)) throw Error('Invalid observed surface');
    if (Math.floor(observedSurface.x)!==Math.floor(player.x) || Math.floor(observedSurface.z)!==Math.floor(player.z)) throw Error('Surface observation belongs to another column');
    if (worldSeed!==null && observedSurface.worldSeed!==worldSeed) throw Error('Surface observation belongs to another seed');
  }
  if (observedAt!==null && (!Number.isSafeInteger(observedAt) || observedAt<0)) throw Error('Invalid observation timestamp');
  const readout=createNavigationLocationReadout(player,{headingOffset:options.headingOffset??0,decimals:options.decimals??0,surfaceY:observedSurface?.y??null});
  return Object.freeze({version:NAV00_OBSERVED_READOUT_ADAPTER_VERSION,readout,observedAt,source:'observed-player-frame'});
}
