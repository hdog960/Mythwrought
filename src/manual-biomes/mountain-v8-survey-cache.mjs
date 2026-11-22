// Detached V8 audit-only memo. Never writes to VoxelWorld or persists a cache.
// Cache null rejections as well as successful surveys: caves/biome borders often
// trigger the same expensive negative source read from adjacent test sites.
const valid=n=>Number.isSafeInteger(n);
export function createMountainV8SurveyCache({seed,read,maxSites=576}={}){
  if(!valid(seed)||seed!==(seed|0)||typeof read!=='function'||
     !valid(maxSites)||maxSites<1||maxSites>576)return null;
  const samples=new Map();
  let hits=0,misses=0;
  function survey(x,z){
    if(!valid(x)||!valid(z))return null;
    const k=x+','+z;
    if(samples.has(k)){hits++;return samples.get(k);}
    if(misses>=maxSites)return null; // fail closed, no unbounded iPhone work
    misses++;
    const answer=read(x,z,seed);
    // An anomalous foreign/forged source is not eligible for V8 admission.
    const candidate=answer&&answer.x===x&&answer.z===z&&
      answer.seed===seed&&answer.safeToIntegrate===false&&
      answer.generatorIdentityRequired==='v8-new-opt-in'?answer:null;
    samples.set(k,candidate);
    return candidate;
  }
  return Object.freeze({
    survey,
    stats:()=>Object.freeze({uniqueSites:misses,cacheHits:hits,
      cachedRejections:[...samples.values()].filter(v=>v===null).length,
      limit:maxSites}),
    safeToIntegrate:false
  });
}
