// Opt-in, pure iPhone touch guard for expanded-map controls. No DOM subscriptions or save access.
import {dispatchNavigationMapPointer} from './navigation-map-pointer.mjs';
export const NAV00_TOUCH_GUARD_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function dispatchNavigationMapTouch(session, touch, options = {}) {
  if (!options || typeof options !== 'object' || !touch || typeof touch !== 'object') throw Error('Invalid map touch');
  const {activeTouches, movementTouchActive = false, phase, x, y} = touch;
  if (!Number.isInteger(activeTouches) || activeTouches < 0 || typeof movementTouchActive !== 'boolean' ||
      !['start','move','end','cancel'].includes(phase) || !finite(x) || !finite(y)) throw Error('Invalid touch metadata');
  // Only a completed single-finger tap may operate the expanded map. Movement thumb is authoritative.
  if (phase !== 'end' || activeTouches !== 0 || movementTouchActive || !session?.open) {
    return Object.freeze({version:NAV00_TOUCH_GUARD_VERSION,action:null,session});
  }
  const result = dispatchNavigationMapPointer(session,{x,y},options);
  return Object.freeze({version:NAV00_TOUCH_GUARD_VERSION,action:result.action,session:result.session});
}
