import {previewStatusTransitionPulses} from './status-transition-pulses-v1.mjs';
const deny=reason=>Object.freeze({ok:false,reason,canActuate:false});
const sizes=Object.freeze([{width:667,height:375},{width:844,height:390},{width:932,height:430}]);
const validCount=n=>Number.isSafeInteger(n)&&n>=0&&n<=1_000_000_000;
/** Display-only layout descriptor, never a power receipt or a renderer command. */
export function previewResonanceHud(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))return deny('invalid-input');
 const {viewport,worldId,networkId,observations}=input;
 if(!viewport||!sizes.some(s=>s.width===viewport.width&&s.height===viewport.height))return deny('unsupported-viewport');
 const pulses=previewStatusTransitionPulses({worldId,networkId,observations,maxPulses:32});
 if(!pulses.ok)return deny('pulses:'+pulses.reason);
 const latest=observations[observations.length-1];
 if(![latest.produced,latest.used,latest.stored,latest.missing].every(validCount))return deny('invalid-metrics');
 const low=latest.missing>0;
 const width=Math.min(196,Math.floor(viewport.width*.27));
 const box=Object.freeze({x:Math.floor((viewport.width-width)/2),y:8,width,height:40});
 const labels=Object.freeze([
  Object.freeze({key:'produced',text:`IN ${latest.produced}`}),
  Object.freeze({key:'used',text:`OUT ${latest.used}`}),
  Object.freeze({key:'stored',text:`BANK ${latest.stored}`}),
  Object.freeze({key:'missing',text:`NEED ${latest.missing}`})
 ]);
 return Object.freeze({ok:true,schema:'resonance48.hud-preview.v1',worldId,networkId,tick:pulses.latestTick,viewport:Object.freeze({width:viewport.width,height:viewport.height}),box,state:low?'POWER LOW':'POWER OK',palette:low?'amber-gold':'rune-blue',labels,pulseCount:pulses.pulses.length,visualOnly:true,canActuate:false,rendererIntegrated:false});
}