/** Source-only D6 HUD admission sequence. Never grants game/render authority. */
import {admitResonanceHud48} from './viewport-admission-v1.mjs';
const uint = n => Number.isSafeInteger(n) && n >= 0;
export function createHudAdmissionSequence48() {
  let previous = null;
  return Object.freeze({
    observe(input) {
      if (!input || !uint(input.tick) || !uint(input.revision)) throw Error('invalid-observation');
      if (previous && input.tick <= previous.tick) throw Error('stale-tick');
      if (previous && input.revision < previous.revision) throw Error('stale-revision');
      const admission = admitResonanceHud48(input);
      const key = JSON.stringify([admission.viewport.width,admission.viewport.height,input.panel, input.reservedRects,admission.admitted,admission.blockers]);
      const changed = !previous || key !== previous.key;
      const reason = !admission.admitted ? 'blocked' : changed ? 'updated' : 'unchanged';
      const result = Object.freeze({schema:'resonance48-hud-sequence-v1',tick:input.tick,revision:input.revision,changed,reason,admission,authority:'display-only'});
      previous = {tick:input.tick,revision:input.revision,key};
      return result;
    },
    reset() { previous = null; }
  });
}
