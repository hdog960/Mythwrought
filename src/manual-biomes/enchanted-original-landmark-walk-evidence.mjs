// MYTHWROUGHT isolated Enchanted P2 read-only landmark approach source.
// Source identity comes from the ORIGINAL deterministic voxelLandmarksForChunk
// (five legacy kinds), and every sampled artifact voxel is compared to
// original legacyBlockAt, unmodified M7 _environmentBaseline, and world.get.
// A physical adjacency witness requires continuous original stepPlayer;
// being within sight of an AIR cell or a proposed generator site never counts.
// No landmark placement, main integration, save, new block, generated footpath,
// altered physics, or persistent cache.
import {baseBlock,terrainHeight,chunkCoord} from '../voxel.mjs';
import {voxelLandmarksForChunk,VOXEL_LANDMARK_KINDS}
  from '../voxel-landmarks.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {originalM7PhysicalGroundCap}
  from './enchanted-original-standing-diagnostic.mjs';
import {originalM7PhysicsRouteReplay}
  from './enchanted-original-physics-route.mjs';

const schedule=Object.freeze({
  waystone:Object.freeze([4,1,2]),watchtower:Object.freeze([12,5,7]),
  shrine:Object.freeze([10,2,4]),arch:Object.freeze([13,9,3]),
  causeway:Object.freeze([17,11,6])
});
const mod=(n,k)=>((n%k)+k)%k;
const directions=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
const original=(w)=>w?.profile?.generator===M7_ENVIRONMENT_GENERATOR&&
  w.experimentalEnchantedTrees===false&&
  Number.isInteger(w.seed)&&w.seed===(w.seed|0)&&
  typeof w.legacyBlockAt==='function'&&
  typeof w._environmentBaseline==='function';

export const ENCHANTED_LANDMARK_RESEARCH_LIMITS=Object.freeze({
  chunkRadius:64,sites:72,approachAttempts:512,walks:3
});

// Read-only source identity; NO source mutation. A documented site without
// surviving authored voxels is not a physically preserved landmark.
export function originalM7LandmarkSourceAt(world,cx,cz,kind){
  if(!original(world)||!Number.isSafeInteger(cx)||!Number.isSafeInteger(cz)||
     !VOXEL_LANDMARK_KINDS.includes(kind))
    throw Error('Original M7 landmark source query invalid');
  const pattern=schedule[kind];
  if(mod(cx,pattern[0])!==pattern[1]||
     mod(cz,pattern[0])!==pattern[2])return null;
  const plan=voxelLandmarksForChunk(cx,cz,world.seed,{
    heightAt:terrainHeight,baseAt:baseBlock});
  const site=plan.sites.find(s=>s.kind===kind);
  if(!site)return null;
  const voxels=[];
  for(const [key,id] of plan.blocks){
    const [x,y,z]=key.split(',').map(Number);
    if(Math.abs(x-site.x)>5||Math.abs(z-site.z)>5)continue;
    if(chunkCoord(x)!==cx||chunkCoord(z)!==cz)continue;
    if(world.legacyBlockAt(x,y,z)!==id||
       world._environmentBaseline(x,y,z)!==id||
       world.get(x,y,z)!==id||
       world.environmentCaves?.get(x,y,z)!==undefined)continue;
    voxels.push(Object.freeze({x,y,z,id}));
  }
  if(voxels.length<2)return null;
  return Object.freeze({kind,chunk:[cx,cz],x:site.x,z:site.z,
    groundY:site.groundY,originalSiteVoxelCount:site.voxelCount,
    preservedOriginalVoxels:voxels.length,
    voxels:Object.freeze(voxels),
    biome:v6BiomeAt(site.x,site.z,world.seed)?.name??'plains'});
}

// Sample deterministic known-original legacy landmark candidates. Do not
// search arbitrary names or manufacture geometry: a successful witness is
// two actual physics legs ending within two horizontal and two vertical
// blocks of a source-authenticated landmark voxel. Negative signed chunks
// use floor/mod semantics from the real engine.
export function surveyOriginalM7LandmarkWalks(world,{
  kind='waystone',requiredBiome='enchanted',
  chunkRadius=40,maxSourceSites=24,
  maxApproachAttempts=256,maxWalks=2
}={}){
  if(!original(world)||!VOXEL_LANDMARK_KINDS.includes(kind)||
     (requiredBiome!==null&&typeof requiredBiome!=='string')||
     !Number.isInteger(chunkRadius)||chunkRadius<2||
     chunkRadius>ENCHANTED_LANDMARK_RESEARCH_LIMITS.chunkRadius||
     !Number.isInteger(maxSourceSites)||maxSourceSites<1||
     maxSourceSites>ENCHANTED_LANDMARK_RESEARCH_LIMITS.sites||
     !Number.isInteger(maxApproachAttempts)||maxApproachAttempts<1||
     maxApproachAttempts>ENCHANTED_LANDMARK_RESEARCH_LIMITS.approachAttempts||
     !Number.isInteger(maxWalks)||maxWalks<1||
     maxWalks>ENCHANTED_LANDMARK_RESEARCH_LIMITS.walks)
    throw Error('Invalid original M7 landmark walk research');
  const [period,rx,rz]=schedule[kind];
  const chunks=[];
  for(let cz=-chunkRadius;cz<=chunkRadius;cz++)
    for(let cx=-chunkRadius;cx<=chunkRadius;cx++)
      if(mod(cx,period)===rx&&mod(cz,period)===rz)
        chunks.push({cx,cz,r:cx*cx+cz*cz});
  chunks.sort((a,b)=>a.r-b.r||a.cz-b.cz||a.cx-b.cx);
  const stats={kind,requiredBiome,chunkRadius,
    scheduledChunks:chunks.length,sourceSites:0,
    realSourceVoxels:0,biomeSites:0,approachAttempts:0,
    originalPhysicsRejected:0,supportedApproachSegments:0,
    originalWalks:0,truncated:false};
  const walks=[];
  for(const {cx,cz} of chunks){
    if(stats.sourceSites>=maxSourceSites||
       stats.approachAttempts>=maxApproachAttempts||
       walks.length>=maxWalks){stats.truncated=true;break;}
    const source=originalM7LandmarkSourceAt(world,cx,cz,kind);
    if(!source)continue;
    stats.sourceSites++;stats.realSourceVoxels+=source.preservedOriginalVoxels;
    if(requiredBiome!==null&&source.biome!==requiredBiome)continue;
    stats.biomeSites++;
    // Choose genuine physical player-body supported end cells near a
    // preserved original-source voxel; the site center itself may be solid.
    for(let dz=-4;dz<=4;dz++){
      if(walks.length>=maxWalks||stats.approachAttempts>=maxApproachAttempts)break;
      for(let dx=-4;dx<=4;dx++){
        if(walks.length>=maxWalks||stats.approachAttempts>=maxApproachAttempts)break;
        const x=source.x+dx,z=source.z+dz;
        const end=originalM7PhysicalGroundCap(world,x,z);
        if(!end)continue;
        const near=source.voxels.find(v=>
          Math.hypot(v.x-x,v.z-z)<=2.01&&
          Math.abs(v.y-end.feet)<=2);
        if(!near)continue;
        for(const [sx,sz] of directions){
          const mid=originalM7PhysicalGroundCap(world,x+sx,z+sz);
          const start=originalM7PhysicalGroundCap(world,x+2*sx,z+2*sz);
          if(!start||!mid)continue;
          if(Math.abs(start.feet-mid.feet)>1||
             Math.abs(mid.feet-end.feet)>1)continue;
          if(stats.approachAttempts>=maxApproachAttempts)break;
          stats.approachAttempts++;
          const path=[start,mid,end];
          const proof=originalM7PhysicsRouteReplay(world,path,
            {groundMode:'physical'});
          if(!proof.ok){stats.originalPhysicsRejected++;continue;}
          stats.supportedApproachSegments++;
          // A canonical source voxel, matching original legacy & M7 get,
          // MUST be physically near the last real player waypoint.
          walks.push(Object.freeze({kind,source:Object.freeze({
            x:source.x,z:source.z,chunk:source.chunk,biome:source.biome,
            preservedOriginalVoxels:source.preservedOriginalVoxels
          }),nearOriginalVoxel:near,
            path:Object.freeze(path),physics:proof,
            maxApproachSourceHorizontalDistance:
              Math.hypot(near.x-end.x,near.z-end.z),
            claim:'original-legacy-landmark-adjacent-real-stepPlayer-only'}));
          stats.originalWalks++;
          break;
        }
      }
    }
  }
  return Object.freeze({walks:Object.freeze(walks),stats:Object.freeze(stats)});
}
