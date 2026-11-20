// MYTHWROUGHT SKY S4 — deterministic zero-I/O celestial starfield and cloud flow.
// Pure 24-minute S1-phase sampling; no save sidecars, new geometry, textures,
// weather, events, biome overrides, S3 lunar changes or additional render passes.
import {SKY_DAY_MS,normalizeSkyPhase} from './world-clock.mjs';
const TAU=Math.PI*2;
const clamp01=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t)};
export const S4_STARS=Object.freeze({
  columns:384,rows:192,threshold:.86,
  pigments:Object.freeze(['moonstone-blue','warm-gold','violet-silver']),
  cellCount:384*192
});
export const SKY_S4_CONTRACT=Object.freeze({
  priorSkyStages:Object.freeze(['S0','S1','S2','S3']),
  dayLengthMs:SKY_DAY_MS,additionalDrawCalls:0,newTextures:0,
  cloudLayers:4,starLayers:1,starFamilyCount:3,
  weatherDeferred:true,rareEventsDeferred:true,biomeDifferencesDeferred:true
});
const fract=n=>n-Math.floor(n);
// Matches the GLSL cheap multiplication-only scalar hash; cell positions are
// independent of seed and absolute wall time, so worlds share one night sky.
export function starHash(x,y){
  if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||x<0||y<0)
    throw Error('Invalid celestial star cell');
  let px=fract(x*.1031),py=fract(y*.103);
  const d=px*(py+33.33)+py*(px+33.33);
  px+=d;py+=d;
  return fract((px+py)*px);
}
export function countVirtualStars(){
  let count=0;
  for(let y=0;y<S4_STARS.rows;y++)for(let x=0;x<S4_STARS.columns;x++)
    if(starHash(x,y)>S4_STARS.threshold)count++;
  return count;
}
export function sampleS4Sky(phaseMs,daylight){
  const phase=normalizeSkyPhase(phaseMs);
  if(!Number.isFinite(daylight)||daylight<0||daylight>1)
    throw Error('Invalid S4 daylight');
  const u=phase/SKY_DAY_MS,t=TAU*u;
  // Smooth and cycle-seam continuous: constant time implies constant clouds.
  // No update tick and no accumulated drift/precision loss.
  return {
    phaseMs:phase,twinkleAngle:t*3,
    starVisibility:(1-smooth(.04,.66,daylight))*.94,
    cloudA:[Math.sin(t)*.068,Math.cos(t)*.014],
    cloudB:[Math.sin(t+1.17)*.061,Math.cos(t+1.17)*.018],
    starFieldCellCount:S4_STARS.cellCount
  };
}
