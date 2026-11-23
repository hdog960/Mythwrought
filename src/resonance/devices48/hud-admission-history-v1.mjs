/** D6 source-only multi-frame admission history; caller reports are never attested. */
import {bridgeHudAdmissionEvidence} from './hud-admission-evidence-bridge-v1.mjs';
import {auditHudEvidenceSequence} from './hud-evidence-sequence-v1.mjs';
const plain = x => x !== null && typeof x === 'object' && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
const validId = x => typeof x === 'string' && x.length > 0 && x.length <= 128 && /^[a-zA-Z0-9._:/-]+$/.test(x);
const uint = x => Number.isSafeInteger(x) && x >= 0;
export function auditHudAdmissionHistory48({world,layout,frames}) {
  if (!validId(world) || !validId(layout) || !Array.isArray(frames) || frames.length < 1 || frames.length > 32)
    throw new TypeError('invalid admission history');
  const observations = [];
  let previousTick = -1, previousRevision = -1;
  for (const frame of frames) {
    if (!plain(frame) || Object.keys(frame).length !== 3 ||
        !Object.hasOwn(frame,'tick') || !Object.hasOwn(frame,'revision') || !Object.hasOwn(frame,'reports') ||
        !uint(frame.tick) || !uint(frame.revision) ||
        frame.tick <= previousTick || frame.revision <= previousRevision)
      throw new TypeError('stale or malformed admission frame');
    const bridge = bridgeHudAdmissionEvidence({world,layout,tick:frame.tick,revision:frame.revision,reports:frame.reports});
    observations.push(...bridge.evidence.frames[0].samples);
    previousTick = frame.tick;
    previousRevision = frame.revision;
  }
  const evidence = auditHudEvidenceSequence({expectedWorld:world,expectedLayout:layout,observations});
  return Object.freeze({kind:'resonance48-hud-admission-history-v1',authority:'display-only',
    provenance:'caller-supplied-unverified',safe:evidence.safe,frameCount:evidence.frames.length,evidence});
}
