// MANUAL M1: canonical, editable four-region world baseline for explicitly NEW profiles.
// Not loaded by production src/main.mjs until the separately reviewed M2 integration.
// Legacy VoxelWorld remains unchanged. Schema-1 edit deltas keep their original shape.
import {VoxelWorld,BLOCK,chunkCoord,terrainHeight,worldKey} from '../voxel.mjs';
import {LEGACY_WORLD_MIN_Y,WORLD_MAX_Y,WORLD_MIN_Y} from '../depth.mjs';
import {isBiome130BlockId} from '../biome130-registry.mjs';
import {surfaceBiomeFreshColumn,surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {m3DesertFreshColumn,M3_XERIC_IDS} from './desert-m3.mjs';
import {m4ThreeRegionFreshColumn,M4_REGION_NAMES} from './three-regions-m4.mjs';
import {m5V5MountainFreshColumn} from './mountain-pass-v5.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {environmentalTreesForChunk,keepLegacyGroveTree,planEnvironmentalColumn} from './environment-v7.mjs';
import {OASIS_WATER,nearOasisSite,oasisSites,planOasis} from './environment-oasis.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {LIVE_DISTRICT_SIZE} from '../live-voxel-world.mjs';
import {combinedEnvironmentCaves} from '../manual-caves/opt-in-runtime.mjs';

// NEVER change a legacy generation profile's physical natural baseline.
// M4 created worlds use v4; existing M3 (v3) Desert and M2 (v2) profiles
// are explicitly supported as-is, without automatic upgrades on open/save.
// Experimental v5 is opt-in via an EXPLICIT generated-world profile only.
// The default new-world action and all historical saves stay on accepted v4.
export {M7_ENVIRONMENT_GENERATOR};
export const M6_BALANCED_GENERATOR='mythwrought-five-surface-regions-v6';
export const M5_EXPERIMENTAL_GENERATOR='mythwrought-four-surface-regions-v5';
export const FOUR_REGION_GENERATOR='mythwrought-four-surface-regions-v4';
export const M3_FOUR_REGION_GENERATOR='mythwrought-four-surface-regions-v3';
export const M2_FOUR_REGION_GENERATOR='mythwrought-four-surface-regions-v2';
const ACCEPTED_GENERATORS=new Set([
  M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR,M5_EXPERIMENTAL_GENERATOR,FOUR_REGION_GENERATOR,
  M3_FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR
]);
const MAX_EDIT_ROWS=300000;
const MAX_COLUMNS=1024;
export function fourRegionProfile(seed,generator=FOUR_REGION_GENERATOR){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw Error('Invalid biome profile seed');
  if(!ACCEPTED_GENERATORS.has(generator))throw Error('Unknown biome generator');
  return Object.freeze({kind:'mythwrought-generation-profile',version:1,
    generator,seed});
}
export function validateFourRegionProfile(input,seed){
  if(!input||typeof input!=='object'||Array.isArray(input)||
     Object.keys(input).sort().join(',')!=='generator,kind,seed,version'||
     input.kind!=='mythwrought-generation-profile'||input.version!==1||
     !ACCEPTED_GENERATORS.has(input.generator)||!Number.isInteger(input.seed)||
     input.seed!==(input.seed|0)||(seed!==undefined&&seed!==input.seed))
    throw Error('Unsupported or mismatched biome generation profile');
  return fourRegionProfile(input.seed,input.generator);
}

/** A real VoxelWorld subclass: super.get/set/save use this canonical natural
 * baseline, NOT a read-only mesh view. Changing a generated shelf creates
 * a normal schema-1 edit. Rebuilding a column never hides that edit.
 * All four biomes are deterministic; only bounded column plans are cached.
 */
export class FourRegionWorld extends VoxelWorld{
  constructor(seed,profile=fourRegionProfile(seed),{maxCachedColumns=MAX_COLUMNS}={}){
    super(seed);
    this.profile=validateFourRegionProfile(profile,seed);
    if(!Number.isInteger(maxCachedColumns)||maxCachedColumns<1||
       maxCachedColumns>4096)throw Error('Invalid biome column budget');
    this.maxCachedColumns=maxCachedColumns;
    this._biomeColumns=new Map();
    if(this.profile.generator===M7_ENVIRONMENT_GENERATOR){
      this.environmentCaves=combinedEnvironmentCaves(seed);
      this._environmentGroveMasks=new Map();
      this._environmentTreeChunks=new Map();
      this._environmentOases=new Map();
    }
  }
  _columnPlan(x,z){
    const key=x+','+z;
    if(this._biomeColumns.has(key))return this._biomeColumns.get(key);
    let lookup;
    if(this.profile.generator===M7_ENVIRONMENT_GENERATOR){
      const region=v6BiomeAt(x,z,this.seed);
      lookup=this._oasisNear(x,z,0,region)?.columns.get(key)??
        planEnvironmentalColumn(x,z,this.seed,(a,b,c)=>this._environmentBaseline(a,b,c),region);
    }else lookup=this._existingBiomeColumn(x,z);
    this._biomeColumns.set(key,lookup);
    if(this._biomeColumns.size>this.maxCachedColumns)
      this._biomeColumns.delete(this._biomeColumns.keys().next().value);
    return lookup;
  }
  _oasisNear(x,z,padding=0,region=v6BiomeAt(x,z,this.seed)){
    if(!this._environmentOases||region?.name!=='desert')return null;
    const sites=oasisSites(region.center,this.seed);
    if(!nearOasisSite(sites,x,z,padding))return null;
    const key=region.center.join(',');
    if(!this._environmentOases.has(key)){
      this._environmentOases.set(key,planOasis(sites,this.seed,(a,b,c)=>this._environmentBaseline(a,b,c)));
      if(this._environmentOases.size>32)this._environmentOases.delete(this._environmentOases.keys().next().value);
    }
    return this._environmentOases.get(key);
  }
  environmentOasisWaterEntries(cx,cz){
    if(!this._environmentOases)return [];
    const site=this._oasisNear(cx*16+8,cz*16+8,8);
    return (site?.water??[]).filter(([x,,z,key])=>chunkCoord(x)===cx&&chunkCoord(z)===cz&&
      !this.edits.has(key)).map(([,,,key])=>[key,OASIS_WATER]);
  }
  environmentWaterState(x,y,z){
    if(!this._environmentOases||y<2||y>13)return null;
    const cell=this._oasisNear(x,z)?.columns.get(x+','+z);
    return cell?.get(y)===OASIS_WATER.id&&!this.edits.has(worldKey(x,y,z))?OASIS_WATER:null;
  }
  environmentOasisShore(cx,cz){
    if(!this._environmentOases)return [];
    const site=this._oasisNear(cx*16+8,cz*16+8,8);
    return (site?.shore??[]).filter(([x,z])=>chunkCoord(x)===cx&&chunkCoord(z)===cz);
  }
  _existingBiomeColumn(x,z){
    // The authoritative non-profile baseline includes existing seeded
    // landmarks/districts and caves, so the proposal cannot bury their AIR,
    // replace their blocks or silently lift their geometry.
    const isV6=this.profile.generator===M6_BALANCED_GENERATOR;
    const biomeAt=isV6?v6BiomeAt:surfaceBiomeAt;
    const opts={
      enabled:true,profileIsFresh:true,
      readBaseline:(a,b,c)=>super.naturalAndLandmarkBlock(a,b,c),
      hasEdit:()=>false,isProtected:()=>false,biomeAt
    };
    const region=biomeAt(x,z,this.seed);
    const isV5=this.profile.generator===M5_EXPERIMENTAL_GENERATOR;
    const newOrM3=isV6||isV5||this.profile.generator===FOUR_REGION_GENERATOR||
      this.profile.generator===M3_FOUR_REGION_GENERATOR;
    const isM3Desert=newOrM3&&region?.name==='desert';
    const isM4Interior=(isV6||isV5||this.profile.generator===FOUR_REGION_GENERATOR)&&
      M4_REGION_NAMES.includes(region?.name);
    const plan=isM3Desert?m3DesertFreshColumn(x,z,this.seed,opts):
      isM4Interior?(isV5&&region.name==='mountain'?
        m5V5MountainFreshColumn(x,z,this.seed,opts):
        m4ThreeRegionFreshColumn(x,z,this.seed,opts)):
        surfaceBiomeFreshColumn(x,z,this.seed,opts);
    // M2 GPU and support correction: preserve every source-authored visible
    // Mountain top, while filling *concealed raised interiors* with real
    // full-cube stone instead of thousands of partial cliffstone surfaces.
    // This is canonical physical terrain (mineable, saved and collidable),
    // not hidden/painted shader geometry or a raised per-chunk GPU limit.
    // Scope only the new mountain shelf ABOVE the untouched legacy top;
    // leave top/one subsoil layer and all unraised existing cells source-exact.
    // The generator identity is deliberately v2 to prevent loading an older
    // v1-profile world with different natural baselines.
    return new Map(plan?.writes?.map(p=>[
      p.y,
      plan.name==='mountain'&&p.y>plan.oldTop&&p.y<plan.top-1?
        BLOCK.STONE:p.to
    ])??[]);
  }
  _environmentBaseline(x,y,z,block=super.naturalAndLandmarkBlock(x,y,z)){
    const cave=this.environmentCaves.get(x,y,z);
    if(cave!==undefined)return cave;
    // Only ordinary grove provenance can be suppressed. Named old landmarks,
    // player edits and cave geometry continue through their original readers.
    if(block!==BLOCK.WOOD&&block!==BLOCK.LEAVES)return block;
    const districtKey=Math.floor(x/LIVE_DISTRICT_SIZE)+','+Math.floor(z/LIVE_DISTRICT_SIZE);
    let hidden=this._environmentGroveMasks.get(districtKey);
    if(!hidden){
      hidden=new Set();
      const district=this.liveDistrictCache.get(districtKey);
      for(const tree of district?.trees??[]){
        if(keepLegacyGroveTree(this.seed,tree))continue;
        for(const [tx,ty,tz] of tree.cells)hidden.add(worldKey(tx,ty,tz));
      }
      this._environmentGroveMasks.set(districtKey,hidden);
      if(this._environmentGroveMasks.size>48)
        this._environmentGroveMasks.delete(this._environmentGroveMasks.keys().next().value);
    }
    return hidden.has(worldKey(x,y,z))?BLOCK.AIR:block;
  }
  _environmentTreeAt(x,y,z){
    const cx=chunkCoord(x),cz=chunkCoord(z),key=cx+','+cz;
    let cells=this._environmentTreeChunks.get(key);
    if(!cells){
      cells=environmentalTreesForChunk(cx,cz,this.seed,
        (a,c)=>this._columnPlan(a,c),
        (a,b,c)=>this._columnPlan(a,c).get(b)??this._environmentBaseline(a,b,c));
      this._environmentTreeChunks.set(key,cells);
      if(this._environmentTreeChunks.size>64)
        this._environmentTreeChunks.delete(this._environmentTreeChunks.keys().next().value);
    }
    return cells.get(worldKey(x,y,z))??BLOCK.AIR;
  }
  naturalAndLandmarkBlock(x,y,z){
    const cave=this.environmentCaves?.get(x,y,z);
    if(cave!==undefined)return cave;
    const base=super.naturalAndLandmarkBlock(x,y,z);
    // Critical collision/mesh fast path: deep sections never scan a surface
    // column. Only natural topsoil and potentially raised shelves are sampled.
    if(![x,y,z].every(Number.isInteger)||y<LEGACY_WORLD_MIN_Y||
       y>WORLD_MAX_Y||y<terrainHeight(x,z,this.seed)-2)
      return base;
    const overlay=this._columnPlan(x,z).get(y);
    if(this.profile.generator!==M7_ENVIRONMENT_GENERATOR)return overlay??base;
    const ground=overlay??this._environmentBaseline(x,y,z,base);
    return ground===BLOCK.AIR&&y>terrainHeight(x,z,this.seed)?this._environmentTreeAt(x,y,z):ground;
  }
  set(x,y,z,id,rotation=0){
    // Original setter knows the original block registry, validation,
    // schema-1 delta format and rotation restrictions. The profile baseline
    // is virtual, so original setter's biomeCellCount can overcount on a
    // no-op that places the same biome ID as the natural surface.
    const key=worldKey(x,y,z),previous=this.edits.get(key);
    const count=this.biomeCellCount;
    const ok=super.set(x,y,z,id,rotation);
    if(!ok)return false;
    const next=this.edits.get(key);
    this.biomeCellCount=count-Number(isBiome130BlockId(previous))+
      Number(isBiome130BlockId(next));
    if(!this.edits.has(key))this.rotations.delete(key);
    if((this.profile.generator===M6_BALANCED_GENERATOR||
        this.profile.generator===M5_EXPERIMENTAL_GENERATOR||
        this.profile.generator===FOUR_REGION_GENERATOR||
        this.profile.generator===M3_FOUR_REGION_GENERATOR)&&id===BLOCK.AIR){
      // When the player mines the support of a naturally authored xeric
      // formation, persist AIR edits for its supported stack, too. No fake
      // floating cactus after mining or after a cold world reload.
      for(let above=y+1;above<=WORLD_MAX_Y;above++){
        const k=worldKey(x,above,z);
        if(this.edits.has(k))break; // never remove a player-made structure
        const natural=this.naturalAndLandmarkBlock(x,above,z);
        if(!M3_XERIC_IDS.includes(natural)||this.get(x,above,z)!==natural)
          break;
        if(!this.set(x,above,z,BLOCK.AIR))
          throw Error('Could not persist removed xeric support');
      }
    }
    return true;
  }
  get cachedBiomeColumns(){return this._biomeColumns.size;}
  get generationProfile(){return this.profile;}
}

/** Restore exact saved schema-1 rows against the PROFILED natural baseline.
 * Never restore first through VoxelWorld.restore: it would discard an edit
 * equal to old legacy terrain, even when that differs from the new biome.
 */
export function restoreFourRegionWorld(payload,profile){
  const canonical=validateFourRegionProfile(profile);
  if(!payload||payload.schema!==1||payload.seed!==canonical.seed||
     !Array.isArray(payload.edits)||payload.edits.length>MAX_EDIT_ROWS)
    throw Error('Invalid saved four-region world');
  const world=new FourRegionWorld(canonical.seed,canonical),seen=new Set();
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4||
       !row.every(Number.isInteger))throw Error('Malformed biome edit');
    const [x,y,z,id]=row,key=worldKey(x,y,z);
    if(seen.has(key)||y<WORLD_MIN_Y||y>WORLD_MAX_Y||
       !world.set(x,y,z,id)||!world.edits.has(key))
      throw Error('Duplicate, out-of-range or noncanonical biome edit');
    seen.add(key);
  }
  if(payload.rotations!==undefined){
    if(!Array.isArray(payload.rotations)||payload.rotations.length>MAX_EDIT_ROWS)
      throw Error('Malformed biome rotations');
    const rotated=new Set();
    for(const row of payload.rotations){
      if(!Array.isArray(row)||row.length!==4||
         !row.every(Number.isInteger)||row[3]<1||row[3]>3)
        throw Error('Malformed biome rotation');
      const key=worldKey(row[0],row[1],row[2]);
      if(rotated.has(key)||!world.edits.has(key)||
         !isBiome130BlockId(world.edits.get(key)))
        throw Error('Stale or duplicate biome rotation');
      rotated.add(key);
      world.rotations.set(key,row[3]);
    }
  }
  if(Object.keys(payload).some(k=>!['schema','seed','edits','rotations'].includes(k)))
    throw Error('Unexpected biome world save fields');
  return world;
}
