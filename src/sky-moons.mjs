// MYTHWROUGHT SKY S3: exactly three original orbiting moons.
// Separate per-seed immutable lunar epoch: never modifies S1 clock, world saves,
// journal, backup, mirror or block catalog. No I/O during an animation frame.
import {SKY_DAY_MS,normalizeSkyPhase} from './world-clock.mjs';
const TAU=Math.PI*2;
const clamp01=n=>Math.max(0,Math.min(1,n));
const smooth=(a,b,n)=>{const t=clamp01((n-a)/(b-a));return t*t*(3-2*t);};
const finite=(v,name)=>{if(!Number.isFinite(v)||v<0||!Number.isSafeInteger(Math.floor(v)))
  throw Error('Invalid lunar '+name);return v;};
export const LUNAR_EPOCH_KEY_PREFIX='mythwrought-sky-s3-lunar-';
export const MOON_FAMILIES=Object.freeze([
  Object.freeze({id:'aurel',name:'Aurel the Pearl Crown',periodDays:7,phaseOffset:.50,
    inclination:1.00,longitude:2.70,radius:.043,color:Object.freeze([.97,.94,.81])}),
  Object.freeze({id:'vesper',name:'Vesper the Amethyst Veil',periodDays:11,phaseOffset:.20,
    inclination:1.10,longitude:3.10,radius:.035,color:Object.freeze([.73,.60,.96])}),
  Object.freeze({id:'thal',name:'Thal the Verdant Lantern',periodDays:17,phaseOffset:.66,
    inclination:1.18,longitude:3.50,radius:.029,color:Object.freeze([.59,.93,.81])})
]);
export const S3_LUNAR_CONTRACT=Object.freeze({
  count:3,dayMs:SKY_DAY_MS,noAdditionalDrawCalls:true,noTextures:true,
  moonPeriodDays:Object.freeze(MOON_FAMILIES.map(m=>m.periodDays)),
  preservesS1Clock:true,preservesSchemaOne:true,starsDeferredToS4:true
});
export function lunarEpochKey(seed){
  if(!Number.isSafeInteger(seed))throw Error('Invalid lunar seed');
  return LUNAR_EPOCH_KEY_PREFIX+seed;
}
export function loadLunarEpoch({seed,storage,wallNowMs,monoNowMs,allowWrites=true}){
  const key=lunarEpochKey(seed);
  finite(wallNowMs,'wall time');finite(monoNowMs,'monotonic time');
  const fresh={seed,key,anchorAgeMs:0,monoAnchorMs:monoNowMs,
    persistence:'session-only',warning:'',source:'new'};
  if(!allowWrites)return {...fresh,persistence:'protected',
    warning:'Protected world: lunar epoch session-only; no writes'};
  let raw;
  try{raw=storage.getItem(key);}catch(_){
    return {...fresh,warning:'Lunar epoch storage inaccessible; session-only'};
  }
  if(raw!==null){
    try{
      const x=JSON.parse(raw);
      if(x===null||typeof x!=='object'||Object.keys(x).length!==3||
        x.version!==1||x.seed!==seed||!Number.isSafeInteger(x.wallEpochMs)||
        x.wallEpochMs<0||x.wallEpochMs>wallNowMs+SKY_DAY_MS)
        throw Error('Damaged lunar epoch');
      return {...fresh,anchorAgeMs:Math.max(0,wallNowMs-x.wallEpochMs),
        persistence:'saved',source:'loaded'};
    }catch(_){return {...fresh,persistence:'protected',
      warning:'Invalid lunar epoch preserved unchanged; session-only'};}
  }
  const record=JSON.stringify({version:1,seed,wallEpochMs:Math.floor(wallNowMs)});
  try{
    storage.setItem(key,record);
    if(storage.getItem(key)!==record)throw Error('Lunar epoch readback mismatch');
    return {...fresh,persistence:'saved'};
  }catch(_){return {...fresh,warning:'Lunar epoch could not be saved; session-only'};}
}
export function sampleLunarAge(clock,monoNowMs){
  finite(monoNowMs,'monotonic time');
  return finite(clock.anchorAgeMs+Math.max(0,monoNowMs-clock.monoAnchorMs),'age');
}
const wrap01=n=>((n%1)+1)%1;
export function lunarIllumination(phaseFraction){
  if(!Number.isFinite(phaseFraction))throw Error('Invalid moon phase');
  return .5*(1-Math.cos(TAU*phaseFraction));
}
export function sampleThreeMoons(phaseMs,lunarAgeMs,daylight=0){
  const phase=normalizeSkyPhase(phaseMs);
  finite(lunarAgeMs,'age');
  if(!Number.isFinite(daylight)||daylight<0||daylight>1)throw Error('Invalid lunar daylight');
  const dailyAngle=TAU*(phase/SKY_DAY_MS-.25)+Math.PI;
  const moons=MOON_FAMILIES.map(m=>{
    const ageDays=lunarAgeMs/SKY_DAY_MS;
    const drift=TAU*wrap01(ageDays/m.periodDays);
    const theta=dailyAngle+drift;
    const s=Math.sin(theta),c=Math.cos(theta);
    const si=Math.sin(m.inclination),ci=Math.cos(m.inclination);
    const sl=Math.sin(m.longitude),cl=Math.cos(m.longitude);
    const direction=[c*cl-s*si*sl,s*ci,c*sl+s*si*cl];
    const phaseFraction=wrap01(m.phaseOffset+ageDays/m.periodDays);
    const illumination=lunarIllumination(phaseFraction);
    const visibility=smooth(-.09,.08,direction[1])*(1-.82*daylight);
    // A planar phase term plus the true spherical terminator in one shader pass.
    const terminator=[-Math.cos(TAU*phaseFraction),Math.sin(TAU*phaseFraction)];
    return {...m,direction,phaseFraction,illumination,visibility,terminator};
  });
  // S2's navigable minimum remains authoritative; three moons supply only
  // bounded extra ambient light, so moon phases matter without torch-like beams.
  const moonlight=Math.min(.105,
    moons.reduce((v,m)=>v+m.visibility*m.illumination*.058,0))*(1-daylight);
  return {moons,moonlight,ageDays:lunarAgeMs/SKY_DAY_MS,phaseMs:phase};
}
