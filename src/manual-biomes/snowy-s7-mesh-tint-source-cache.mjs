// SNOW S7 DETACHED, source-owned per-mesh winter tint. NOT imported by M7.
// This candidate does not change material IDs, saved edits, caves, mesh,
// shader, profile registration, old snow, or the live world.
import {previewSnowS6WinterTone}
  from './snowy-s6-winter-tone-proposal.mjs';

export const S7_M7_SOURCE='mythwrought-five-surface-regions-v7';
const IDS=new Set([272,276,279]),SIDE=16,MAX_Y=19;
const integer=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const sourceKey=(x,z)=>x+','+z;
const readEdit=(world,x,y,z)=>world.edits.has(x+','+y+','+z);
const EMPTY=Object.freeze({approved:false});
const freeze=Object.freeze;

// One cache is explicitly scoped to ONE chunk mesh assembly; the caller
// must create a NEW instance after any edit/terrain reload. A single-cell
// halo is allowed for seam comparison, not editing a neighboring chunk.
export function createSnowS7MeshTintReview(world,cx,cz,{biomeAt}={},opts={}){
  const source=world?.base?.generationProfile?world.base:world;
  if(!integer(cx)||!integer(cz)||!integer(world?.seed)||
    world.seed!==(world.seed|0)||
    source?.generationProfile?.generator!==S7_M7_SOURCE||
    !(source.edits instanceof Map)||
    typeof source.get!=='function'||typeof source._columnPlan!=='function'||
    typeof source.environmentCaves?.get!=='function'||
    typeof biomeAt!=='function'||opts?.halo!==undefined&&opts.halo!==1)
    throw new TypeError('S7 requires the exact untouched original M7 biome/column source');
  const baseX=cx*SIDE,baseZ=cz*SIDE;
  if(!integer(baseX)||!integer(baseZ)||!integer(baseX+SIDE)||
    !integer(baseZ+SIDE))throw new RangeError('S7 original world coordinate limit');
  // read-only, lazy, bounded to at most 18x18 references for halo mode.
  const halo=opts.halo??0;
  const maxColumns=(SIDE+2*halo)**2;
  const cache=new Map();
  const counts={requests:0,misses:0,climateReads:0,planReads:0,
    approved:0,protected:0,denied:0};
  const inside=(x,z)=>integer(x)&&integer(z)&&
    x>=baseX-halo&&x<baseX+SIDE+halo&&
    z>=baseZ-halo&&z<baseZ+SIDE+halo;
  const review=(x,z)=>{
    const key=sourceKey(x,z);
    if(cache.has(key))return cache.get(key);
    if(cache.size>=maxColumns)throw new RangeError('S7 mesh cache source budget');
    counts.misses++;
    // Ordering intentionally excludes all non-snow source columns BEFORE
    // the expensive climate function. No protected top, saved edit, cavity,
    // old tree, stone, or unsupported snow shoulder can get an S7 color.
    let result=EMPTY;
    counts.planReads++;
    const plan=source._columnPlan(x,z);
    if(!(plan instanceof Map)||plan.size>21)
      throw new TypeError('S7 original M7 source plan malformed');
    let top=-Infinity,cap;
    for(const [y,id] of plan){
      if(!Number.isSafeInteger(y)||!Number.isSafeInteger(id)||
        y<-3||y>MAX_Y)throw new TypeError('S7 original M7 cap out of bounds');
      if(y>top){top=y;cap=id}
    }
    if(IDS.has(cap)&&top>=2&&top<=MAX_Y&&
      plan.get(top)===cap&&
      source.get(x,top,z)===cap&&
      source.get(x,top-1,z)!==0&&
      source.get(x,top+1,z)===0&&
      !readEdit(source,x,top,z)&&!readEdit(source,x,top-1,z)&&
      source.environmentCaves.get(x,top,z)===undefined&&
      source.environmentCaves.get(x,top-1,z)===undefined){
      counts.climateReads++;
      const climate=biomeAt(x,z,source.seed);
      if(climate?.name==='snow'&&Number.isFinite(climate.weight)&&
        climate.weight>=0&&climate.weight<=1){
        result=freeze({approved:true,top,cap,weight:climate.weight,
          color:previewSnowS6WinterTone(source.seed,x,z,cap,climate.weight)
            .proposedLinearRgb});
        counts.approved++;
      }else counts.denied++;
    }else counts.protected++;
    cache.set(key,result);
    return result;
  };
  const stillSafe=(x,y,z,id,v)=>{
    // Cached colors MUST NOT survive a late edit, cave or source change.
    // This tests the actual cell without recalculating expensive climate.
    return !readEdit(source,x,y,z)&&!readEdit(source,x,y-1,z)&&
      source.get(x,y,z)===id&&source.get(x,y-1,z)!==0&&
      source.get(x,y+1,z)===0&&
      source.environmentCaves.get(x,y,z)===undefined&&
      source.environmentCaves.get(x,y-1,z)===undefined&&
      source._columnPlan(x,z).get(y)===id;
  };
  const colorFor=(x,y,z,id)=>{
    counts.requests++;
    if(!inside(x,z))return undefined;
    if(!Number.isSafeInteger(y)||!IDS.has(id))return undefined;
    const v=review(x,z);
    if(!v.approved||v.top!==y||v.cap!==id)return undefined;
    if(!stillSafe(x,y,z,id,v))return undefined;
    return v.color;
  };
  return freeze({kind:'detached-S7-M7-mesh-owner-source-tint',
    cx,cz,halo,sourceSeed:source.seed,
    sourceProfile:S7_M7_SOURCE,cacheBound:maxColumns,
    colorFor,
    stats:()=>freeze({...counts,cachedColumns:cache.size}),
    noSaveWrites:true,liveGeneratorModified:false,
    noPlayerIceRecolor:true,noIPhoneOrGpuApproval:true});
}
