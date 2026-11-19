// MYTHWROUGHT SKY S6: source-proven, read-only four-biome atmospheric adapter.
// Biome authority is NOT this source: exact PR #265 HEAD 0140db9ad5e599ac84850fdb17529b7f4d96e4f4
// src/surface-regions/regions.mjs::surfaceBiomeAt, usable only for a verified
// original FourRegionWorld generationProfile. Legacy worlds are unchanged.
export const S6_BIOME_SOURCE_HEAD='0140db9ad5e599ac84850fdb17529b7f4d96e4f4';
export const S6_BIOME_SOURCE_PATH='src/surface-regions/regions.mjs';
export const S6_GENERATORS=Object.freeze([2,3,4,5].map(n=>'mythwrought-four-surface-regions-v'+n));
export const S6_ANCHORS=Object.freeze([
  Object.freeze({name:'desert',x:512,z:0}),
  Object.freeze({name:'snow',x:0,z:512}),
  Object.freeze({name:'mountain',x:-512,z:0}),
  Object.freeze({name:'enchanted',x:0,z:-512})
]);
export const S6_SKY_CONTRACT=Object.freeze({
  count:4,sourceHead:S6_BIOME_SOURCE_HEAD,sourcePath:S6_BIOME_SOURCE_PATH,
  actualBiomeIntegration:'requires-separately-incorporated-M5',
  legacyBehavior:'identical-S5',additionalDrawCalls:0,texturesAdded:0,
  persistentStateAdded:0,weatherDeferred:true,
  globalSunMoonsClockStarsEventsUnchanged:true
});
const accents=Object.freeze({
  desert:Object.freeze({horizon:[.088,.038,-.026],zenith:[.025,-.005,-.027],
    fog:[.070,.025,-.028],cloud:[.038,.016,-.020],ridge:[.033,.015,-.022]}),
  snow:Object.freeze({horizon:[-.028,.039,.083],zenith:[-.027,.033,.078],
    fog:[-.018,.040,.071],cloud:[.047,.053,.077],ridge:[-.020,.026,.053]}),
  mountain:Object.freeze({horizon:[-.016,-.008,.044],zenith:[-.029,-.006,.050],
    fog:[-.029,-.012,.038],cloud:[-.020,-.015,.030],ridge:[-.020,-.012,.060]}),
  enchanted:Object.freeze({horizon:[.040,-.010,.073],zenith:[.013,-.012,.077],
    fog:[.026,-.016,.052],cloud:[.048,-.008,.063],ridge:[.020,-.016,.050]})
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
const int32=v=>Number.isInteger(v)&&v===(v|0);
function verifiedProfile(world){
  const p=world?.base?.generationProfile;
  if(!p||typeof p!=='object'||Array.isArray(p)||
     Object.keys(p).sort().join(',')!=='generator,kind,seed,version'||
     p.kind!=='mythwrought-generation-profile'||p.version!==1||
     !S6_GENERATORS.includes(p.generator)||!int32(p.seed)||
     !int32(world?.seed)||world.seed!==p.seed||world.base?.seed!==p.seed)
    return null;
  return p;
}
export const hasValidatedFourBiomeProfile=world=>verifiedProfile(world)!==null;
export function resolveS6Biome(world,x,z,authoritativeSurfaceBiomeAt){
  if(!verifiedProfile(world)||!Number.isFinite(x)||!Number.isFinite(z)||
     typeof authoritativeSurfaceBiomeAt!=='function')return null;
  const b=authoritativeSurfaceBiomeAt(x,z,world.seed);
  if(b===null)return null;
  const anchor=S6_ANCHORS.find(a=>a.name===b?.name);
  if(!anchor||!Number.isFinite(b.weight)||b.weight<.35||b.weight>1||
     !Array.isArray(b.center)||b.center.length!==2||
     b.center[0]!==anchor.x||b.center[1]!==anchor.z)return null;
  return Object.freeze({name:anchor.name,strength:smooth(.35,.95,b.weight),
    weight:b.weight,generator:world.base.generationProfile.generator,
    seed:world.seed,center:anchor});
}
export function sampleS6BiomeSky(atmosphere,region){
  if(!atmosphere||!Number.isFinite(atmosphere.daylight)||
     !Array.isArray(atmosphere.horizon))throw Error('Invalid S6 atmosphere');
  if(region===null)return atmosphere; // Identical S0–S5 object, not a copy.
  if(!region||!Object.hasOwn(accents,region.name)||
     !Number.isFinite(region.strength)||region.strength<0||region.strength>1)
    throw Error('Untrusted S6 biome');
  const factor=region.strength*(.55+.45*clamp(atmosphere.daylight,0,1));
  const tinted={};
  for(const field of ['horizon','zenith','fog','cloud','ridge']){
    const original=atmosphere[field],offset=accents[region.name][field];
    if(!Array.isArray(original)||original.length!==3||
       !original.every(v=>Number.isFinite(v)&&v>=0&&v<=1))
      throw Error('Invalid S6 '+field+' RGB');
    tinted[field]=original.map((v,i)=>clamp(v+offset[i]*factor,0,1));
  }
  // Sun, moon orbits, rare events, starfield, time and terrain light unchanged.
  return {...atmosphere,...tinted};
}
