import {buildStatusDelta} from './status-delta-v1.mjs';

// Presentation descriptors only: no renderer mutation, particles, power grants, or actuator control.
export const PULSE_TIMELINE_V1 = Object.freeze({
  id:'resonance-devices48-pulse-timeline-v1',productionBound:false,authoritative:false,
  maxPulses:16,maxDurationTicks:8
});
const palette=Object.freeze({
  'candidate-restored':Object.freeze({tone:'rune-blue',glyph:'rune-ring',durationTicks:8}),
  'candidate-interrupted':Object.freeze({tone:'amber',glyph:'broken-ring',durationTicks:6}),
  'candidate-changed':Object.freeze({tone:'gold',glyph:'gear-ring',durationTicks:4})
});
const safeTick=n=>Number.isSafeInteger(n)&&n>=0;
export function buildPulseTimeline(previous,current,options={}) {
  const delta=buildStatusDelta(previous,current);
  const {maxPulses=8,reducedMotion=false}=options;
  if(!Number.isSafeInteger(maxPulses)||maxPulses<0||maxPulses>16||typeof reducedMotion!=='boolean')
    throw new Error('invalid presentation budget');
  if(!safeTick(delta.toTick))throw new Error('invalid tick');
  // Explicit truncation metadata makes a crowded scene auditable rather than silently hiding pulses.
  const pulses=delta.events.slice(0,maxPulses).map(event=>{
    const style=palette[event.kind];
    if(!style)throw new Error('unknown transition');
    return Object.freeze({
      id:event.id,kind:event.kind,tick:delta.toTick,
      tone:style.tone,glyph:style.glyph,
      durationTicks:reducedMotion?0:style.durationTicks,
      intensity:reducedMotion?0:1,
      source:'candidate-only'
    });
  });
  return Object.freeze({
    contract:PULSE_TIMELINE_V1.id,seed:delta.seed,fromTick:delta.fromTick,toTick:delta.toTick,
    authoritative:false,productionBound:false,reducedMotion,
    omitted:delta.events.length-pulses.length,
    pulses:Object.freeze(pulses)
  });
}
