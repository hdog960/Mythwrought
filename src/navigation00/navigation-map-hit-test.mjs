// Opt-in expanded-map pointer dispatch; no DOM, globals, world or save access.
import {NAV00_MAP_SESSION_VERSION} from './navigation-map-session.mjs';
export const NAV00_MAP_HIT_TEST_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
const keys = Object.freeze(['close', 'zoomIn', 'zoomOut']);
export function hitTestNavigationMapControl(session, point) {
  if (!session || session.version !== NAV00_MAP_SESSION_VERSION ||
      typeof session.open !== 'boolean' || !finite(session.zoom) ||
      session.zoom < 0.5 || session.zoom > 4 || !session.layout ||
      !session.layout.frame) throw Error('Invalid navigation map session');
  if (!point || !finite(point.x) || !finite(point.y)) throw Error('Invalid navigation pointer');
  if (!session.open || !session.layout.controls) return null;
  const {frame, controls} = session.layout;
  if (![frame.x, frame.y, frame.width, frame.height].every(finite) ||
      frame.width <= 0 || frame.height <= 0) throw Error('Invalid navigation frame');
  if (point.x < frame.x || point.x >= frame.x + frame.width ||
      point.y < frame.y || point.y >= frame.y + frame.height) return null;
  let match = null;
  for (const key of keys) {
    const c = controls[key];
    if (!c || ![c.x,c.y,c.width,c.height].every(finite) ||
        c.width < 44 || c.height < 44) throw Error('Invalid navigation control');
    if (point.x >= c.x && point.x < c.x + c.width &&
        point.y >= c.y && point.y < c.y + c.height) {
      if (match !== null) throw Error('Overlapping navigation controls');
      match = c.action;
    }
  }
  return match;
}
