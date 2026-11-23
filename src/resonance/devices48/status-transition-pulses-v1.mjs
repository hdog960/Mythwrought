import {previewStatusObservationSequence} from './status-observation-sequence-v1.mjs';
// Display-only bounded transitions; never authorizes power or renderer mutation.
const deny=reason=>Object.freeze({ok:false,reason,canActuate:false});
export function previewStatusTransitionPulses(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))return deny('invalid-input');
 const status=previewStatusObservationSequence(input);
 if(!status.ok)return deny('status:'+status.reason);
 const budget=input.maxPulses??16;
 if(!Number.isSafeInteger(budget)||budget<1||budget>32)return deny('invalid-budget');
 const pulses=[];let last=null;
 for(const f of status.frames){
  if(last!==null&&last===f.deficit)continue;
  if(pulses.length>=budget)return deny('pulse-budget-exceeded');
  const kind=last===null?(f.deficit?'initial-low':'initial-ok'):(f.deficit?'shortage':'recovery');
  pulses.push(Object.freeze({tick:f.tick,revision:f.revision,kind,palette:f.deficit?'amber-gold':'rune-blue',missing:f.missing,visualOnly:true,canActuate:false}));
  last=f.deficit;
 }
 return Object.freeze({ok:true,schema:'resonance48.status-transition-pulses.v1',worldId:status.worldId,networkId:status.networkId,latestTick:status.latestTick,pulses:Object.freeze(pulses),canActuate:false,rendererIntegrated:false});
}
