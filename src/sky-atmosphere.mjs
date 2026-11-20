// MYTHWROUGHT Sky Roadmap S2 — original, CPU-cheap celestial atmosphere.
// No saves, terrain edits, world generation, textures, particles or new passes.
// Uses the authoritative 24-minute S1 phase; future moons remain S3-owned.
import {SKY_DAY_MS,normalizeSkyPhase} from './world-clock.mjs';

const TAU=Math.PI*2;
const DEG_TO_RAD=Math.PI/180;
const P=Object.freeze({
  day:Object.freeze({
    zenith:[.29,.53,.79], horizon:[.80,.81,.73],fog:[.73,.82,.70],
    ridge:[.49,.61,.67],cloud:[.99,.96,.91],light:[1,1,1]}),
  night:Object.freeze({
    zenith:[.022,.043,.102],horizon:[.104,.153,.245],fog:[.155,.204,.283],
    ridge:[.074,.110,.176],cloud:[.31,.39,.53],light:[.44,.55,.72]}),
  twilight:Object.freeze({
    zenith:[.35,.25,.48],horizon:[.99,.49,.32],fog:[.60,.40,.44],
    ridge:[.38,.28,.39],cloud:[.94,.66,.60],light:[.79,.72,.75]})
});
const clamp01=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const mix3=(a,b,t)=>a.map((n,i)=>mix(n,b[i],t));
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

// Midnight=0, sunrise=1/4, noon=1/2, sunset=3/4.
// Deterministic orbital angle, independent of user seed, FPS and real time of day.
export function solarDirection(phaseMs){
  const angle=TAU*(normalizeSkyPhase(phaseMs)/SKY_DAY_MS-.25);
  return [Math.cos(angle),Math.sin(angle),0];
}
export function sampleSkyAtmosphere(phaseMs){
  const sunDirection=solarDirection(phaseMs);
  const elevation=sunDirection[1];
  const daylight=smooth(-.16,.29,elevation);
  // Horizon colors peak shortly after sunrise / just before sunset, not at noon.
  const twilight=(1-smooth(.035,.40,Math.abs(elevation)))*smooth(-.25,-.02,elevation);
  const colors={};
  for(const key of ['zenith','horizon','fog','ridge','cloud','light'])
    colors[key]=mix3(mix3(P.night[key],P.day[key],daylight),
      P.twilight[key],twilight*.79);
  // Keep nights moonlit and traversable, never pitch black.
  colors.light=colors.light.map(v=>Math.max(.42,v));
  return {
    phaseMs:normalizeSkyPhase(phaseMs),elevation,daylight,twilight,
    sunDirection, sunVisibility:smooth(-.09,.08,elevation),
    sunColor:mix3([1,.94,.74],[1,.67,.43],twilight),
    ...colors
  };
}

// Project one world-space sun into the exact existing 72-degree voxel camera.
// The origin is the camera center, so the sun cannot "stick" to a fixed UV.
// Return offscreen coordinates whenever behind camera or below sky horizon.
export function projectSunToScreen(direction,yaw,pitch,aspect,tanHalfFov=Math.tan(36*DEG_TO_RAD)){
  if(!Array.isArray(direction)||direction.length!==3||
    !direction.every(Number.isFinite)||![yaw,pitch,aspect,tanHalfFov].every(Number.isFinite)||
    aspect<=0||tanHalfFov<=0)throw Error('Invalid sun projection');
  const sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);
  const forward=[sy*cp,sp,cy*cp];
  const right=[-cy,0,sy],up=[-sp*sy,cp,-sp*cy];
  const z=dot(direction,forward);
  if(z<=.001||direction[1]<-.09)return [-10,-10];
  return [
    .5+.5*dot(direction,right)/(z*aspect*tanHalfFov),
    .5+.5*dot(direction,up)/(z*tanHalfFov)
  ];
}

export const SKY_S2_CONTRACT=Object.freeze({
  dayLengthMs:SKY_DAY_MS,nightLightMinimum:.42,originalDrawCallsAdded:0,
  texturesAdded:0,originalDefaultRenderPreset:'balanced',
  sunOnly:true,moonsDeferredToS3:true
});
