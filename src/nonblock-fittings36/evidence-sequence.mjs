// :36 opt-in witness consistency audit; never certifies production integration.
import {LANDSCAPE_VIEWPORTS, REQUIRED_STAGES} from './browser-evidence-audit.mjs';
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export function auditFittingInteractionSequence(captures){
 if(!Array.isArray(captures)||captures.length!==12)throw new Error('12 stage witnesses required');
 const reports=[];
 for(const {width,height} of LANDSCAPE_VIEWPORTS){
  const frames=REQUIRED_STAGES.map(stage=>{
   const matches=captures.filter(c=>c.width===width&&c.height===height&&c.stage===stage);
   if(matches.length!==1)throw new Error('missing or duplicated stage witness');
   return matches[0];
  });
  const [visible,selected,removed,restored]=frames;
  if(frames.some(c=>!c.instanceKey||c.instanceKey!==visible.instanceKey||c.sourceSha!==visible.sourceSha))throw new Error('witness identity drift');
  if(frames.some(c=>!integer(c.frameNumber)||!integer(c.editRevision)))throw new Error('frame or edit revision missing');
  if(frames.some((c,i)=>i>0&&c.frameNumber<=frames[i-1].frameNumber))throw new Error('non-monotonic capture order');
  if(frames.some(c=>c.editRevision!==visible.editRevision))throw new Error('player edits changed during witness');
  if(visible.tombstonePresent!==false||selected.tombstonePresent!==false||removed.tombstonePresent!==true||restored.tombstonePresent!==true)throw new Error('invalid tombstone transition');
  if(visible.visibleAfter!==true||selected.visibleAfter!==true||removed.visibleAfter!==false||restored.visibleAfter!==false)throw new Error('invalid visibility transition');
  if(selected.selectedKey!==visible.instanceKey||removed.selectedKey!==visible.instanceKey||restored.selectedKey!==visible.instanceKey)throw new Error('selection target drift');
  if(removed.breakAccepted!==true||restored.breakAccepted!==true||removed.removalKey!==visible.instanceKey||restored.removalKey!==visible.instanceKey)throw new Error('authorized removal evidence missing');
  if(removed.tombstoneKey!==visible.instanceKey||restored.tombstoneKey!==visible.instanceKey)throw new Error('tombstone identity drift');
  if(restored.coldReload!==true||restored.rehydratedFromSidecar!==true)throw new Error('cold-reload sidecar witness missing');
  reports.push(Object.freeze({viewport:`${width}x${height}`,instanceKey:visible.instanceKey,sourceSha:visible.sourceSha}));
 }
 if(reports.some(r=>r.instanceKey!==reports[0].instanceKey||r.sourceSha!==reports[0].sourceSha))throw new Error('cross-viewport identity drift');
 return Object.freeze({fixtureWitnesses:12,viewports:Object.freeze(reports),productionIntegrationReady:false});
}
