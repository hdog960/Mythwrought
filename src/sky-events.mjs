// MYTHWROUGHT S5 — pure, rare, visual-only celestial events.
// The only inputs are the authoritative S1 phase and S3 lunar positions/age.
// No RNG, new sidecars, player effects, save writes or shader draw calls.
import {SKY_DAY_MS,normalizeSkyPhase} from './world-clock.mjs';
const clamp01=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const normalize=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
export const S5_EVENT_TYPES=Object.freeze({none:0,meteor:1,aurora:2,comet:3,alignment:4});
export const S5_EVENT_SCHEDULE=Object.freeze([
  Object.freeze({id:'ember-meteor',kind:1,every:29,day:11,phase:.055,halfWindow:.018,
    color:Object.freeze([1,.75,.58]),direction:Object.freeze([.08,.66,-.747]),
    vector:Object.freeze([.90,-.436])}),
  Object.freeze({id:'luminous-arc',kind:2,every:53,day:18,phase:.125,halfWindow:.028,
    color:Object.freeze([.70,.70,1]),direction:Object.freeze([-.18,.73,-.659]),
    vector:Object.freeze([.95,.312])}),
  Object.freeze({id:'silvertail-comet',kind:3,every:97,day:37,phase:.175,halfWindow:.034,
    color:Object.freeze([.58,.89,1]),direction:Object.freeze([.17,.78,-.602]),
    vector:Object.freeze([.85,-.526])})
]);
export const S5_EVENT_CONTRACT=Object.freeze({
  kinds:4,dayMs:SKY_DAY_MS,additionalDrawCalls:0,texturesAdded:0,
  persistentStateAdded:0,visualOnly:true,weatherDeferred:true,
  biomeVariantsDeferred:true,conjunctionUsesRealMoonVectors:true
});
const NONE=Object.freeze({kind:0,id:'none',strength:0,progress:0,eligible:false,
  direction:Object.freeze([0,.7,-.71]),vector:Object.freeze([1,0]),
  color:Object.freeze([0,0,0]),rarity:'inactive',alignmentDot:-1});
export function sampleS5Events(phaseMs,lunar,daylight){
  const phase=normalizeSkyPhase(phaseMs);
  if(!lunar||!Number.isFinite(lunar.ageDays)||lunar.ageDays<0||
     !Array.isArray(lunar.moons)||lunar.moons.length!==3)
    throw Error('Invalid S5 lunar state');
  if(lunar.moons.some(m=>!Array.isArray(m.direction)||m.direction.length!==3||
     !m.direction.every(Number.isFinite)||!Number.isFinite(m.illumination)||
     !Number.isFinite(m.visibility)))throw Error('Invalid S5 moon vector');
  if(!Number.isFinite(daylight)||daylight<0||daylight>1)
    throw Error('Invalid S5 daylight');
  const darkness=1-smooth(.025,.20,daylight);
  if(darkness<=0)return NONE;
  const moons=lunar.moons;
  const alignmentDot=Math.min(
    dot(moons[0].direction,moons[1].direction),
    dot(moons[1].direction,moons[2].direction),
    dot(moons[0].direction,moons[2].direction)
  );
  // This is NOT date-faked: all THREE true S3 world-space moon vectors must
  // be nearly collinear, moonlit and physically above the visible horizon.
  if(alignmentDot>.980&&moons.every(m=>
    m.direction[1]>.12&&m.visibility>.70&&m.illumination>.45)){
    return {kind:4,id:'three-moon-conjunction',eligible:true,
      direction:normalize(moons[0].direction.map((x,i)=>
        x+moons[1].direction[i]+moons[2].direction[i])),
      vector:[1,0],color:[.94,.77,1],strength:
        darkness*smooth(.979,.989,alignmentDot)*.88,
      progress:.5,rarity:'true-triple-lunar-alignment',alignmentDot};
  }
  const lunarDay=Math.floor(lunar.ageDays);
  const phaseFraction=phase/SKY_DAY_MS;
  for(const spec of S5_EVENT_SCHEDULE){
    if(lunarDay%spec.every!==spec.day)continue;
    const distance=Math.abs(phaseFraction-spec.phase);
    if(distance>=spec.halfWindow)continue;
    const envelope=1-smooth(spec.halfWindow*.72,spec.halfWindow,distance);
    return {kind:spec.kind,id:spec.id,eligible:true,
      direction:spec.direction,vector:spec.vector,color:spec.color,
      strength:darkness*envelope*.82,
      progress:clamp01((phaseFraction-(spec.phase-spec.halfWindow))/
        (2*spec.halfWindow)),
      rarity:'one-window-every-'+spec.every+'-lunar-days',alignmentDot};
  }
  return NONE;
}
