// Opt-in responsive map reflow. No world, DOM, or save writes.
import {layoutNavigationSafeArea} from './navigation-safe-area.mjs';
import {NAV00_MAP_SESSION_VERSION} from './navigation-map-session.mjs';
export const NAV00_MAP_REFLOW_VERSION = 1;
export function reflowNavigationMapSession(session, geometry) {
  if (!session || session.version !== NAV00_MAP_SESSION_VERSION ||
      typeof session.open !== 'boolean' || !Number.isFinite(session.zoom) ||
      session.zoom < 0.5 || session.zoom > 4) throw Error('Invalid navigation map session');
  const layout = layoutNavigationSafeArea(geometry);
  // On rotation or changing thumb rails, never leave an open map with inaccessible close controls.
  const open = session.open && layout.controls !== null;
  return Object.freeze({version:NAV00_MAP_SESSION_VERSION,open,zoom:session.zoom,layout});
}
