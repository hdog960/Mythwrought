// Opt-in pointer-to-session adapter. Does not subscribe to DOM events or write saves.
import {hitTestNavigationMapControl} from './navigation-map-hit-test.mjs';
import {transitionNavigationMapSession} from './navigation-map-session.mjs';
export const NAV00_MAP_POINTER_VERSION = 1;
const finite = value => typeof value === 'number' && Number.isFinite(value);
export function dispatchNavigationMapPointer(session, pointer, options={}) {
  if (!options || typeof options !== 'object') throw Error('Invalid pointer options');
  const {scale=1, offsetX=0, offsetY=0} = options;
  if (![scale,offsetX,offsetY].every(finite) || scale <= 0) throw Error('Invalid pointer transform');
  if (!pointer || !finite(pointer.x) || !finite(pointer.y)) throw Error('Invalid pointer');
  const local = {x:(pointer.x-offsetX)/scale,y:(pointer.y-offsetY)/scale};
  if (![local.x,local.y].every(finite)) throw Error('Invalid transformed pointer');
  const action = hitTestNavigationMapControl(session,local);
  if (action === null) return Object.freeze({version:NAV00_MAP_POINTER_VERSION,action:null,session});
  if (!['close','zoom-in','zoom-out'].includes(action)) throw Error('Unknown navigation control action');
  return Object.freeze({version:NAV00_MAP_POINTER_VERSION,action,
    session:transitionNavigationMapSession(session,{type:action})});
}
