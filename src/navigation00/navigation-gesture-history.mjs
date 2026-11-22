// Opt-in stateful map tap recognizer. No DOM listeners, save access, or gameplay hooks.
import {dispatchNavigationMapPointer} from './navigation-map-pointer.mjs';
export const NAV00_GESTURE_HISTORY_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function createNavigationGestureHistory({maxTravel=12, dispatch=dispatchNavigationMapPointer}={}) {
  if (!finite(maxTravel) || maxTravel < 0 || maxTravel > 64 || typeof dispatch !== 'function') throw Error('Invalid gesture configuration');
  let tracked=null, poisoned=false;
  const clear=()=>{tracked=null;poisoned=false;};
  const none=session=>Object.freeze({version:NAV00_GESTURE_HISTORY_VERSION,action:null,session});
  function handle(session,event,options={}) {
    if (!event || !['start','move','end','cancel'].includes(event.phase) ||
        ![event.x,event.y].every(finite) || !Number.isSafeInteger(event.id) ||
        !Number.isInteger(event.activeTouches) || event.activeTouches<0 ||
        typeof event.movementTouchActive !== 'boolean') throw Error('Invalid gesture event');
    const {phase,id,x,y,activeTouches,movementTouchActive}=event;
    if (!session?.open) {clear();return none(session);}
    if (phase==='cancel') {clear();return none(session);}
    if (movementTouchActive || activeTouches>1) poisoned=true;
    if (phase==='start') {
      if (tracked || poisoned || activeTouches!==1 || movementTouchActive) {poisoned=true;return none(session);}
      tracked={id,x,y,startX:x,startY:y};
      return none(session);
    }
    if (!tracked || tracked.id!==id) {poisoned=true;return none(session);}
    if (Math.hypot(x-tracked.startX,y-tracked.startY)>maxTravel) poisoned=true;
    if (phase==='move') {tracked.x=x;tracked.y=y;return none(session);}
    const valid=!poisoned && activeTouches===0 && !movementTouchActive;
    clear();
    if (!valid) return none(session);
    const result=dispatch(session,{x,y},options);
    return Object.freeze({version:NAV00_GESTURE_HISTORY_VERSION,action:result.action,session:result.session});
  }
  return Object.freeze({handle,reset:clear});
}
