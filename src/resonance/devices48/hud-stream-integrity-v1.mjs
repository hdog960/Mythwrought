/** Read-only structural audit for untrusted D6 HUD stream checkpoints. No gameplay authority. */
const VP = Object.freeze(['667x375','844x390','932x430']);
const uint = x => Number.isSafeInteger(x) && x >= 0;
const id = x => typeof x === 'string' && x.length > 0 && x.length <= 128 && /^[a-zA-Z0-9._:/-]+$/.test(x);
const plain = x => x !== null && typeof x === 'object' && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
const exact = (x, names) => plain(x) && Object.keys(x).length === names.length && names.every(k => Object.hasOwn(x,k));
const rootKeys = ['kind','authority','provenance','world','layout','capacity','lastTick','lastRevision','everBlocked','frames'];
const frameKeys = ['tick','revision','safe','blockedViewports'];
/**
 * Check structural invariants without trusting caller-supplied authority or provenance.
 * A valid result does NOT authenticate screenshots, reports, history, or real game state.
 * Sticky everBlocked cannot be proven once old frames roll out; false with visible blocked frames is invalid.
 */
export function auditHudAdmissionStreamIntegrity48(checkpoint) {
  const failures = [];
  const fail = reason => { if (!failures.includes(reason)) failures.push(reason); };
  if (!exact(checkpoint,rootKeys)) fail('invalid-checkpoint-shape');
  if (!plain(checkpoint)) return Object.freeze({valid:false,failures:Object.freeze(failures),authority:'display-only'});
  if (checkpoint.kind !== 'resonance48-hud-admission-stream-v1' || checkpoint.authority !== 'display-only' ||
      checkpoint.provenance !== 'caller-supplied-unverified') fail('invalid-provenance');
  if (!id(checkpoint.world) || !id(checkpoint.layout)) fail('invalid-identity');
  if (!uint(checkpoint.capacity) || checkpoint.capacity < 1 || checkpoint.capacity > 32) fail('invalid-capacity');
  if (typeof checkpoint.everBlocked !== 'boolean') fail('invalid-sticky-flag');
  if (!Array.isArray(checkpoint.frames) || checkpoint.frames.length > 32 ||
      (uint(checkpoint.capacity) && checkpoint.frames.length > checkpoint.capacity)) fail('invalid-history-length');
  const frames = Array.isArray(checkpoint.frames) && checkpoint.frames.length <= 32 ? checkpoint.frames : [];
  let priorTick = -1, priorRevision = -1, visibleBlocked = false;
  for (const f of frames) {
    if (!exact(f,frameKeys) || !uint(f?.tick) || !uint(f?.revision) || typeof f?.safe !== 'boolean' ||
        !Array.isArray(f?.blockedViewports) || f.blockedViewports.length > 3 ||
        !f.blockedViewports.every((v,i) => VP.includes(v) && (i === 0 || VP.indexOf(f.blockedViewports[i-1]) < VP.indexOf(v))) ||
        f.safe !== (f.blockedViewports.length === 0)) { fail('invalid-history-frame'); continue; }
    if (f.tick <= priorTick || f.revision <= priorRevision) fail('nonmonotonic-history');
    priorTick = f.tick; priorRevision = f.revision;
    if (!f.safe) visibleBlocked = true;
  }
  if (checkpoint.lastTick === null || checkpoint.lastRevision === null) {
    if (checkpoint.lastTick !== null || checkpoint.lastRevision !== null || frames.length) fail('invalid-empty-tail');
  } else if (!uint(checkpoint.lastTick) || !uint(checkpoint.lastRevision) || !frames.length ||
             frames.at(-1)?.tick !== checkpoint.lastTick || frames.at(-1)?.revision !== checkpoint.lastRevision) fail('invalid-tail');
  if (visibleBlocked && checkpoint.everBlocked !== true) fail('inconsistent-sticky-flag');
  return Object.freeze({valid:failures.length===0,failures:Object.freeze(failures),authority:'display-only'});
}
