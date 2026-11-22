// MYTHWROUGHT: standalone, never-dispatched Mountain V8 terrain proposal.
// No imports from V7, no profile registration, no writes, and no save migration.
// The caller must own generator versioning before this may alter world blocks.
// Every result is descriptive only; not a replacement for V7 natural terrain.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=t=>t*t*(3-2*t);
function hash(ix,iz,seed){
  let h=Math.imul(ix|0,0x27d4eb2d)^Math.imul(iz|0,0x165667b1)^(seed|0);
  h=Math.imul(h^(h>>>16),0x85ebca6b);
  h=Math.imul(h^(h>>>13),0xc2b2ae35);
  return ((h^(h>>>16))>>>0)/4294967295;
}
function noise(x,z,seed){
  const ix=Math.floor(x),iz=Math.floor(z),tx=smooth(x-ix),tz=smooth(z-iz);
  const a=hash(ix,iz,seed)*(1-tx)+hash(ix+1,iz,seed)*tx;
  const b=hash(ix,iz+1,seed)*(1-tx)+hash(ix+1,iz+1,seed)*tx;
  return a*(1-tz)+b*tz;
}
function field(x,z,seed,scale){return noise(x/scale,z/scale,seed);}
/**
 * Source-owned opt-in V8 planning proposal, not a live biome generator.
 * Caller must supply real baseline heights and protected/cave provenance.
 * Existing V7 world reads must never call this function.
 *
 * Neighbor tops must contain source-backed elevations at +/-4 x/z (in order).
 * Unknown / protected locations fail closed to null rather than guessing.
 */
export function planMountainV8Candidate({x,z,seed,legacyTop,biomeWeight,
  neighborTops,neighborBiomeWeights,protectedColumn=false,biomeName='mountain',worldMaxY=30}={}){
  if(![x,z,seed,legacyTop,worldMaxY].every(Number.isInteger)||
     !Number.isFinite(biomeWeight)||!Number.isInteger(worldMaxY)||
     !Array.isArray(neighborTops)||neighborTops.length!==4||
     !neighborTops.every(n=>Number.isInteger(n)&&n>=0&&n<worldMaxY-2)||
     (neighborBiomeWeights!==undefined&&
      (!Array.isArray(neighborBiomeWeights)||neighborBiomeWeights.length!==4||
       !neighborBiomeWeights.every(w=>Number.isFinite(w)&&w>=.82&&w<=1))))return null;
  if(biomeName!=='mountain'||biomeWeight<.82||protectedColumn||
     legacyTop<0||legacyTop>=worldMaxY-2)return null;
  const edge=smooth(clamp((biomeWeight-.82)/.18));
  const upliftAt=(px,pz,weight)=>{
    const spine=field(px,pz,seed+3101,110);
    const ridge=1-Math.abs(2*field(px,pz,seed+3163,59)-1);
    const broken=field(px,pz,seed+3229,21);
    return smooth(clamp((weight-.82)/.18))*
      (2.5+10.2*ridge*ridge+4.1*spine+2.3*broken);
  };
  // Predict both sides independently, without recursion or chunk-coordinate
  // lookups. Comparing a V8 center height to V7 neighbor heights falsely
  // labels gently raised meadows as cliffs.
  const offsets=[[4,0],[-4,0],[0,4],[0,-4]];
  const top=Math.min(worldMaxY-2,Math.max(legacyTop,
    Math.round(legacyTop+upliftAt(x,z,biomeWeight))));
  const proposedNeighbors=neighborTops.map((old,i)=>{
    const [dx,dz]=offsets[i];
    const weight=neighborBiomeWeights?.[i]??biomeWeight;
    return Math.min(worldMaxY-2,Math.max(old,
      Math.round(old+upliftAt(x+dx,z+dz,weight))));
  });
  const slope=Math.max(...proposedNeighbors.map(n=>Math.abs(top-n)))/4;
  const aspect=field(x,z,seed+3301,73);
  const meadow=field(x,z,seed+3449,68)*.73+field(x,z,seed+3467,19)*.27;
  // Deterministic, irregular snowline; independent of the tree system.
  const snowline=17.0+(aspect-.5)*5.4+(field(x,z,seed+3527,43)-.5)*2.4;
  const snowy=top>=snowline;
  const cliff=slope>.8||top>=worldMaxY-4;
  const grassy=!snowy&&!cliff&&top<=13&&slope<=.52&&meadow>.47;
  const stone=field(x,z,seed+3659,29);
  const cap=snowy?'snow':grassy?'alpine-grass':
    slope>1.1?'scree':stone>.64?'gneiss':stone<.31?'scree':'slate';
  return Object.freeze({x,z,seed,legacyTop,top,biome:'mountain',
    cap,subsoil:grassy?'dirt':'stone',slope,
    proposedNeighborTops:Object.freeze(proposedNeighbors),snowline,
    cliff,snowy,meadowScore:meadow,edge,
    // Explicitly material-only proposal until legacy V7 parity is secured.
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
