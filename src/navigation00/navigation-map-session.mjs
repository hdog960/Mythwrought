// Opt-in expanded-map session state. Pure state transitions: no DOM, save or world mutation.
import {layoutNavigationSafeArea} from './navigation-safe-area.mjs';
export const NAV00_MAP_SESSION_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function createNavigationMapSession({width,height,insets,thumbRails,zoom=1}={}) {
  if (!finite(zoom) || zoom < 0.5 || zoom > 4) throw Error('Invalid map zoom');
  const layout=layoutNavigationSafeArea({width,height,insets,thumbRails});
  return Object.freeze({version:NAV00_MAP_SESSION_VERSION,open:false,zoom,layout});
}
export function transitionNavigationMapSession(session,action) {
  if (!session || session.version!==NAV00_MAP_SESSION_VERSION || !action || typeof action.type!=='string') throw Error('Invalid map transition');
  let open=session.open, zoom=session.zoom;
  switch(action.type) {
    case 'open': if (session.layout.controls===null) return session; open=true; break;
    case 'close': open=false; break;
    case 'zoom-in': if (!open) return session; zoom=Math.min(4,Math.round((zoom+0.25)*100)/100); break;
    case 'zoom-out': if (!open) return session; zoom=Math.max(0.5,Math.round((zoom-0.25)*100)/100); break;
    default: throw Error('Unknown map action');
  }
  return Object.freeze({...session,open,zoom});
}
