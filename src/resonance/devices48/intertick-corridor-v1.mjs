import {previewCorridorReservation} from './corridor-reservation-v1.mjs';
/** Source-only multi-tick occupancy preflight; not a permit to move. */
export function previewIntertickCorridor(sequence) {
  if (!sequence || sequence.productionBound !== false || sequence.authoritativeDelivery === true || !Array.isArray(sequence.frames) || sequence.frames.length < 2 || sequence.frames.length > 16) throw new Error('bounded source-only sequence required');
  const {frames}=sequence;
  const first=frames[0];
  if (!first || !Number.isSafeInteger(first.tick) || first.tick<0 || first.tick>Number.MAX_SAFE_INTEGER-(frames.length-1)) throw new Error('safe initial tick required');
  const reports=[];
  const blockers=new Set();
  for(let i=0;i<frames.length;i++) {
    const f=frames[i];
    if(!f || f.tick!==first.tick+i || f.worldId!==first.worldId || f.deviceId!==first.deviceId || f.productionBound!==false || f.authoritativeDelivery===true) throw new Error('noncontiguous or inconsistent source-only frame');
    const r=previewCorridorReservation(f);
    reports.push(Object.freeze({tick:r.tick,previewClear:r.previewClear,blockers:r.blockers}));
    for(const id of r.blockers) blockers.add(id);
  }
  const sorted=Object.freeze([...blockers].sort());
  return Object.freeze({version:1,worldId:first.worldId,deviceId:first.deviceId,firstTick:first.tick,lastTick:frames.at(-1).tick,previewClear:sorted.length===0,blockers:sorted,frames:Object.freeze(reports),productionBound:false,authoritativeDelivery:false,mayActuate:false,requiresPhysicsOwnerApproval:true});
}
