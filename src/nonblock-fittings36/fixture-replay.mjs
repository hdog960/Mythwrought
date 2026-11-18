// :36 isolated deterministic fixture runner. No production raycast, save, or renderer writes.
import {createGuardedFittingSession} from './guarded-break-session.mjs';

// The fixture only accepts externally verified mounts and synchronous :00-style approval.
// Every frame recomputes visible geometry after an authorized removal or sidecar restore.
export function createFittingReplayFixture({seed,objects,inspectMount,authorizeRemoval,maximumReach=5}){
 const session=createGuardedFittingSession({seed,objects,inspectMount,authorizeRemoval,maximumReach});
 const frames=[];
 function frame(label){
  if(typeof label!=='string'||!label||label.length>80)throw new TypeError('invalid frame label');
  const visible=session.visible();
  const snapshot=session.snapshot();
  const entry=Object.freeze({label,visibleKeys:Object.freeze(visible.map(o=>o.instanceKey).sort()),
   tombstones:Object.freeze([...snapshot.tombstones]),visibleCount:visible.length});
  frames.push(entry);
  return entry;
 }
 return Object.freeze({
  frame,
  pick:ray=>session.pick(ray),
  breakPicked:ray=>session.breakPicked(ray),
  snapshot:()=>session.snapshot(),
  restore:sidecar=>session.restore(sidecar),
  visible:()=>session.visible(),
  timeline:()=>Object.freeze([...frames])
 });
}
