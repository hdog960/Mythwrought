// Detached S3 source-reader adapter: confirms actual M7 physical provenance.
// No write/read-through sidecars, no world profile changes, no gameplay imports.
// Callers provide the original game functions (biomeAt, terrainHeight,
// legacyNatural, proposedSnowTree) so the reader works with the REAL engine
// rather than a parallel fake terrain generator.
import {snowS3SitesForChunk,proposeSnowS3PhysicalSite}
  from './snowy-s3-sites-detached.mjs';

const M7='mythwrought-five-surface-regions-v7';
const AIR=0;
const SNOW_CAPS=new Set([272,276,279]);
const key=(x,y,z)=>x+','+y+','+z;
const validInt=n=>Number.isSafeInteger(n);

/** Pure read-only proposal for an existing original-world object. */
export function reviewSnowS3WorldSite(world,site,{biomeAt,terrainHeight,
  legacyNatural,proposedSnowTree}={}){
  if(!world||!validInt(world.seed)||
    world.generationProfile?.generator!==M7||
    !(world.edits instanceof Map)||
    typeof world._columnPlan!=='function'||
    typeof world._environmentBaseline!=='function'||
    typeof world.naturalAndLandmarkBlock!=='function'||
    typeof world.get!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    !site||!validInt(site.x)||!validInt(site.z)||
    typeof biomeAt!=='function'||typeof terrainHeight!=='function'||
    typeof legacyNatural!=='function'||typeof proposedSnowTree!=='function')
    return null;
  // A genuine M7 authored surface is mandatory. Preserve all old columns
  // which were intentionally not touched due to groves, caves or landmarks.
  const biome=biomeAt(site.x,site.z,world.seed);
  if(biome?.name!=='snow'||!Number.isFinite(biome.weight)||
    biome.weight<.8)return null;
  const old=terrainHeight(site.x,site.z,world.seed);
  const writes=world._columnPlan(site.x,site.z);
  if(!(writes instanceof Map)||writes.size<2||!validInt(old))return null;
  let floor=-Infinity;
  for(const y of writes.keys()){
    if(!validInt(y))return null;
    floor=Math.max(y,floor);
  }
  const cap=writes.get(floor);
  if(!SNOW_CAPS.has(cap)||floor<old||floor>13||
    world.environmentCaves.get(site.x,floor,site.z)!==undefined||
    world.environmentCaves.get(site.x,floor-1,site.z)!==undefined||
    world.naturalAndLandmarkBlock(site.x,floor,site.z)!==cap||
    world.get(site.x,floor,site.z)!==cap)return null;
  // This is a provenance veto, not the new visual baseline. Even old
  // suppressed groves and naturally carved AIR are respected when the
  // new voxel tree would have occupied their original physical blocks.
  const protectedAt=(x,y,z)=>{
    const cave=world.environmentCaves.get(x,y,z);
    if(cave!==undefined)return true;
    const original=legacyNatural(x,y,z);
    return original!==AIR||world._environmentBaseline(x,y,z)!==AIR;
  };
  const edited=(x,y,z)=>world.edits.has(key(x,y,z));
  return proposeSnowS3PhysicalSite(site,{
    inspect:()=>({generator:M7,biome:biome.name,weight:biome.weight,
      floor,ground:cap}),
    readCell:(x,y,z)=>world.get(x,y,z),
    isEdited:edited,isProtected:(x,y,z)=>
      y>=floor+1?protectedAt(x,y,z):world.environmentCaves.get(x,y,z)!==undefined,
    makeTree:proposedSnowTree
  });
}

/** Bounded one-chunk physical proposal survey. Stable in any build order. */
export function reviewSnowS3WorldChunk(world,cx,cz,deps){
  if(!world||!validInt(world.seed)||!Number.isInteger(cx)||
    !Number.isInteger(cz)||Math.abs(cx)>100000||Math.abs(cz)>100000)
    throw new RangeError('Invalid world/chunk for detached S3 review');
  const sites=snowS3SitesForChunk(world.seed,cx,cz);
  if(sites.length>24)throw new Error('Unexpected S3 candidate site budget');
  const accepted=[];
  for(const site of sites){
    const candidate=reviewSnowS3WorldSite(world,site,deps);
    if(candidate)accepted.push(candidate);
  }
  return Object.freeze({cx,cz,checked:sites.length,
    proposals:Object.freeze(accepted)});
}
