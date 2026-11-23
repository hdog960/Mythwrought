import {createHudAdmissionSequence48} from './hud-admission-sequence-v1.mjs';

export const REQUIRED_VIEWPORTS48 = Object.freeze([
  Object.freeze({width:667,height:375}),
  Object.freeze({width:844,height:390}),
  Object.freeze({width:932,height:430})
]);

// A read-only, all-or-nothing audit of caller-supplied HUD geometry.
// This does not establish that reservations were measured on a real device.
export function auditHudViewports48({tick,revision,fixtures}) {
  if (!Number.isSafeInteger(tick) || tick < 0 ||
      !Number.isSafeInteger(revision) || revision < 0 ||
      !Array.isArray(fixtures) || fixtures.length !== REQUIRED_VIEWPORTS48.length)
    throw new TypeError('invalid-audit');
  const seen = new Set();
  const results = [];
  for (const fixture of fixtures) {
    if (!fixture || typeof fixture !== 'object' || !fixture.viewport)
      throw new TypeError('invalid-fixture');
    const {width,height} = fixture.viewport;
    const key = width + 'x' + height;
    if (!REQUIRED_VIEWPORTS48.some(v => v.width === width && v.height === height) || seen.has(key))
      throw new TypeError('duplicate-or-unsupported-viewport');
    seen.add(key);
    const observation = createHudAdmissionSequence48().observe({
      tick,revision,viewport:{width,height},
      panel:fixture.panel,reservedRects:fixture.reservedRects
    });
    results.push(Object.freeze({
      viewport:key,
      admitted:observation.admission.admitted,
      reason:observation.reason
    }));
  }
  results.sort((a,b)=>REQUIRED_VIEWPORTS48.findIndex(v=>v.width+'x'+v.height===a.viewport)-
    REQUIRED_VIEWPORTS48.findIndex(v=>v.width+'x'+v.height===b.viewport));
  return Object.freeze({
    authority:'display-only',
    admitted:results.every(r=>r.admitted),
    results:Object.freeze(results)
  });
}
