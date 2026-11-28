/** D6 incremental, bounded source-only HUD admission monitor; no gameplay authority. */
import {bridgeHudAdmissionEvidence} from './hud-admission-evidence-bridge-v1.mjs';
const id = x => typeof x === 'string' && x.length > 0 && x.length <= 128 && /^[a-zA-Z0-9._:/-]+$/.test(x);
const uint = x => Number.isSafeInteger(x) && x >= 0;
const plain = x => x !== null && typeof x === 'object' && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
const keys = (x, ks) => plain(x) && Object.keys(x).length === ks.length && ks.every(k=>Object.hasOwn(x,k));
const freeze = x => Object.freeze(x);
export function startHudAdmissionStream48({world,layout,capacity=16}) {
  if (!id(world) || !id(layout) || !uint(capacity) || capacity < 1 || capacity > 32) throw new TypeError('invalid stream configuration');
  return freeze({kind:'resonance48-hud-admission-stream-v1',authority:'display-only',provenance:'caller-supplied-unverified',
    world,layout,capacity,lastTick:null,lastRevision:null,everBlocked:false,frames:freeze([])});
}
export function appendHudAdmissionFrame48(previous, frame) {
  if (!keys(previous,['kind','authority','provenance','world','layout','capacity','lastTick','lastRevision','everBlocked','frames']) ||
      previous.kind !== 'resonance48-hud-admission-stream-v1' || previous.authority !== 'display-only' ||
      previous.provenance !== 'caller-supplied-unverified' || !id(previous.world) || !id(previous.layout) ||
      !uint(previous.capacity) || previous.capacity < 1 || previous.capacity > 32 ||
      typeof previous.everBlocked !== 'boolean' || !Array.isArray(previous.frames) || previous.frames.length > previous.capacity ||
      (previous.lastTick !== null && !uint(previous.lastTick)) || (previous.lastRevision !== null && !uint(previous.lastRevision)) ||
      (previous.lastTick === null) !== (previous.lastRevision === null) ||
      !keys(frame,['tick','revision','reports']) || !uint(frame.tick) || !uint(frame.revision) ||
      (previous.lastTick !== null && (frame.tick <= previous.lastTick || frame.revision <= previous.lastRevision)))
    throw new TypeError('invalid or stale HUD stream frame');
  if (previous.frames.length && (previous.frames.at(-1).tick !== previous.lastTick || previous.frames.at(-1).revision !== previous.lastRevision))
    throw new TypeError('inconsistent HUD stream checkpoint');
  if (previous.lastTick !== null && !previous.frames.length) throw new TypeError('missing HUD stream history');
  const evidence = bridgeHudAdmissionEvidence({world:previous.world,layout:previous.layout,tick:frame.tick,revision:frame.revision,reports:frame.reports});
  const e = evidence.evidence.frames[0];
  const sample = freeze({tick:e.tick,revision:e.revision,safe:e.safe,
    blockedViewports:freeze(e.samples.filter(s=>!s.safe).map(s=>s.viewport))});
  const frames = freeze([...previous.frames,sample].slice(-previous.capacity));
  const transition = previous.lastTick === null ? (sample.safe?'initial-safe':'initial-blocked') :
    previous.frames.at(-1).safe === sample.safe ? 'unchanged' : sample.safe ? 'recovered' : 'blocked';
  const state = freeze({...previous,lastTick:frame.tick,lastRevision:frame.revision,
    everBlocked:previous.everBlocked || !sample.safe,frames});
  return freeze({state,transition,displayOnly:true});
}
