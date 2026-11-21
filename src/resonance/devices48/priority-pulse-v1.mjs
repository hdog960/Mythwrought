import {buildStatusDelta} from './status-delta-v1.mjs';

// Source-only alternative to mobile-pulse-budget-v1. Never authorizes an actuator.
export const PRIORITY_PULSE_V1=Object.freeze({id:'resonance-devices48-priority-pulse-v1',authoritative:false,productionBound:false,maxEvents:16});
const budgets=new Map([['667x375',3],['844x390',5],['932x430',8]]);
const styles=Object.freeze({
 'candidate-interrupted':Object.freeze({rank:0,tone:'amber',glyph:'broken-ring',durationTicks:6}),
 'candidate-restored':Object.freeze({rank:1,tone:'rune-blue',glyph:'rune-ring',durationTicks:8}),
 'candidate-changed':Object.freeze({rank:2,tone:'gold',glyph:'gear-ring',durationTicks:4})
});
export function buildPriorityPulseFrame(previous,current,{width,height,reducedMotion=false}={}){
 const budget=budgets.get(`${width}x${height}`);
 if(!budget||typeof reducedMotion!=='boolean')throw Error('unsupported viewport or motion preference');
 const delta=buildStatusDelta(previous,current);
 // Rank the COMPLETE validated event roster before applying the viewport budget.
 // Truncating a prior timeline first can silently discard critical interruptions.
 const events=[...delta.events].sort((a,b)=>{
  const x=styles[a.kind],y=styles[b.kind];
  if(!x||!y)throw Error('unknown candidate transition');
  return x.rank-y.rank||(a.id<b.id?-1:a.id>b.id?1:0);
 });
 const visible=events.slice(0,budget).map(e=>{
  const style=styles[e.kind];
  return Object.freeze({id:e.id,kind:e.kind,tick:delta.toTick,tone:style.tone,glyph:style.glyph,
   durationTicks:reducedMotion?0:style.durationTicks,intensity:reducedMotion?0:1,source:'candidate-only'});
 });
 return Object.freeze({contract:PRIORITY_PULSE_V1.id,seed:delta.seed,fromTick:delta.fromTick,toTick:delta.toTick,
  viewport:Object.freeze({width,height}),maxVisible:budget,omitted:events.length-visible.length,
  visible:Object.freeze(visible),reducedMotion,authoritative:false,productionBound:false,
  rendererBound:false,placement:'gameplay-owned-safe-area'});
}
