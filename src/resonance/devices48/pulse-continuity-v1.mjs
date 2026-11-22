// Fail-closed validation of consecutive D5 advisory pulses; no activation authority.
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
const safe=n=>Number.isSafeInteger(n)&&n>=0;
const colors={idle:['none',0],'observed-satisfied':['rune-blue',2],'observed-partial':['rune-gold',1],'observed-unpowered':['rune-dim',0]};
export function auditPulseContinuity(events){
  if(!Array.isArray(events)||events.length<1||events.length>16)throw new TypeError('invalid pulse batch');
  let prior=null;const transitions=[];
  for(const e of events){
    if(!e||e.schema!=='resonance48-pulse-descriptor-v1'||!validId(e.worldId)||
      !safe(e.simulationTick)||!safe(e.requested)||!safe(e.observed)||!safe(e.deficit)||
      e.observed>e.requested||e.deficit!==e.requested-e.observed||
      !Object.hasOwn(colors,e.status)||e.palette!==colors[e.status][0]||
      e.intensity!==colors[e.status][1]||
      e.status!==(e.requested===0?'idle':e.deficit===0?'observed-satisfied':e.observed===0?'observed-unpowered':'observed-partial')||
      e.advisoryOnly!==true||e.authoritativeDelivery!==false||e.energized!==false||
      e.movementAuthorized!==false||e.productionBound!==false||
      (prior&&(prior.worldId!==e.worldId||e.simulationTick!==prior.simulationTick+1))||
      e.kind!==(prior&&prior.status===e.status?'steady':'status-change'))
      throw new TypeError('invalid pulse continuity');
    if(e.kind==='status-change')transitions.push(Object.freeze({tick:e.simulationTick,status:e.status}));
    prior=e;
  }
  return Object.freeze({schema:'resonance48-pulse-continuity-v1',worldId:events[0].worldId,
    firstTick:events[0].simulationTick,lastTick:prior.simulationTick,
    transitions:Object.freeze(transitions),advisoryOnly:true,authoritativeDelivery:false,
    energized:false,movementAuthorized:false,productionBound:false});
}
