import {buildPulseTimeline} from './pulse-timeline-v1.mjs';

// Pure presentation budget for iPhone landscape. Never drives power, movement, WebGL, or saves.
export const MOBILE_PULSE_BUDGET_V1=Object.freeze({id:'resonance-devices48-mobile-pulse-budget-v1',productionBound:false,authoritative:false,maxVisible:8});
const SIZES=Object.freeze([[667,375],[844,390],[932,430]]);
const valid=n=>Number.isSafeInteger(n)&&n>=0;
export function buildMobilePulseBudget(previous,current,{width,height,reducedMotion=false}={}){
  if(!valid(width)||!valid(height)||!SIZES.some(([w,h])=>w===width&&h===height))
    throw new Error('unsupported landscape viewport');
  if(typeof reducedMotion!=='boolean')throw new Error('invalid reduced motion');
  // Conservative on-screen descriptor limits; avoid competing with two-thumb rails.
  const maxVisible=width===667?3:width===844?5:8;
  const timeline=buildPulseTimeline(previous,current,{maxPulses:16,reducedMotion});
  const rank=Object.freeze({'candidate-interrupted':0,'candidate-restored':1,'candidate-changed':2});
  const ordered=[...timeline.pulses].sort((a,b)=>rank[a.kind]-rank[b.kind]||a.id.localeCompare(b.id));
  const visible=ordered.slice(0,maxVisible).map(p=>Object.freeze({...p}));
  const dropped=ordered.length-visible.length+timeline.omitted;
  return Object.freeze({
    contract:MOBILE_PULSE_BUDGET_V1.id,seed:timeline.seed,fromTick:timeline.fromTick,toTick:timeline.toTick,
    viewport:Object.freeze({width,height}),authoritative:false,productionBound:false,reducedMotion,
    maxVisible,omitted:dropped,visible:Object.freeze(visible),
    // Deliberately no x/y coordinates: gameplay owns safe-area and rail layout.
    placement:'gameplay-owned-safe-area',rendererBound:false
  });
}
