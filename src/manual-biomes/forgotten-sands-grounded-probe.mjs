// Isolated Phase 0 original M7 footprint survey. No production import,
// world mutation, placement authority, persistence, or settlement generation.
import {BLOCK,baseBlock,terrainHeight,VoxelWorld,worldKey} from '../voxel.mjs';
import {LEGACY_WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {oasisSites,nearOasisSite} from './environment-oasis.mjs';
import {biome130Block} from '../biome130-registry.mjs';
import {definePrototypePyramid,prototypePyramidBlock} from './forgotten-sands-monument-prototype.mjs';

export const P0_MAX_COLUMNS_PER_STEP=32;
export const P0_MAX_EDIT_ROWS_PER_STEP=256;
export const P0_MAX_SITE_WIDTH=111;
const int=Number.isSafeInteger;
const GROUND=new Set([BLOCK.STONE,BLOCK.DIRT,BLOCK.GRASS,256,257,258,259,260,261]);
const fullGround=id=>GROUND.has(id)&&(id<256||(
  biome130Block(id).solid&&biome130Block(id).boxes.some(b=>b.every((v,i)=>v===(i<3?0:1)))));
const key=(x,z)=>x+','+z;

export function defineP0Footprint({seed,x,z,size=15,height=12}){
  if(![seed,x,z,size,height].every(int)||seed!==(seed|0)||
      Math.abs(x)>1000000||Math.abs(z)>1000000||size<15||size>P0_MAX_SITE_WIDTH||
      size%2!==1||height<12||height>size)throw Error('Invalid grounded research footprint');
  const r=(size-1)/2;
  return Object.freeze({seed,x,z,size,height,minX:x-r,maxX:x+r,minZ:z-r,maxZ:z+r});
}

export function p0FootprintContains(site,x,z){
  return x>=site.minX&&x<=site.maxX&&z>=site.minZ&&z<=site.maxZ;
}

// Compact bounds index: at most 64 immutable nonoverlapping proposals; no
// per-voxel index, no load-order-dependent winner. Overlap fails closed.
export function createP0FootprintIndex(sites,{clearance=8}={}){
  if(!Array.isArray(sites)||sites.length>64||!int(clearance)||clearance<0||clearance>32)
    throw Error('Invalid footprint index');
  const list=sites.map(defineP0Footprint).sort((a,b)=>a.seed-b.seed||a.x-b.x||a.z-b.z||a.size-b.size);
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
    const a=list[i],b=list[j];
    if(a.seed===b.seed&&a.minX<=b.maxX+clearance&&b.minX<=a.maxX+clearance&&
      a.minZ<=b.maxZ+clearance&&b.minZ<=a.maxZ+clearance)
      throw Error('Overlapping or insufficiently separated footprint');
  }
  return Object.freeze({
    size:list.length,
    forChunk(seed,cx,cz){
      if(![seed,cx,cz].every(int))throw Error('Invalid index query');
      return Object.freeze(list.filter(s=>s.seed===seed&&s.minX<=cx*16+15&&
        s.maxX>=cx*16&&s.minZ<=cz*16+15&&s.maxZ>=cz*16));
    }
  });
}

export function inspectP0GroundColumn(world,site,x,z,reserved){
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    world.seed!==site.seed||!p0FootprintContains(site,x,z)||!int(x)||!int(z)||
    typeof reserved!=='function')throw Error('Expected exact M7 research source and reservation callback');
  const reject=(reason,y=null)=>Object.freeze({ok:false,reason,x,z,y});
  const region=v6BiomeAt(x,z,world.seed);
  if(region?.name!=='desert'||region.weight<.85)return reject('non-core-desert');
  if(reserved(x,z))return reject('reserved-column');
  if(nearOasisSite(oasisSites(region.center,world.seed),x,z,2))return reject('oasis-reservation');
  // Explicit source cave AIR and solid geometry are equally protected.
  for(let y=LEGACY_WORLD_MIN_Y;y<=WORLD_MAX_Y;y++)
    if(world.environmentCaves.get(x,y,z)!==undefined)return reject('authored-cave',y);
  const plan=world._columnPlan(x,z);
  if(!plan.size)return reject('unverified-terrain-plan');
  const cap=Math.max(...plan.keys()),id=plan.get(cap);
  if(!fullGround(id)||cap<2||cap>WORLD_MAX_Y-2)return reject('unsupported-cap',cap);
  if(world.get(x,cap,z)!==id)return reject('cap-occupancy',cap);
  // Require an intact physical two-cell support envelope. Natural lower
  // caves remain exactly as generated; this does not certify load capacity.
  for(let y=cap-2;y<=cap;y++){
    if(world.edits.has(worldKey(x,y,z)))return reject('player-edit',y);
    if(!fullGround(world.get(x,y,z)))return reject('unsupported-or-cave-air',y);
  }
  // Compare original legacy/district source to bare terrain near the cap;
  // do not mistake a seeded ruin or its AIR for natural buildable space.
  const old=terrainHeight(x,z,world.seed);
  for(let y=old-2;y<=WORLD_MAX_Y;y++){
    if(VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)!==baseBlock(x,y,z,world.seed))
      return reject('legacy-landmark-or-carve',y);
  }
  for(let y=cap+1;y<=WORLD_MAX_Y;y++){
    if(world.edits.has(worldKey(x,y,z)))return reject('player-edit',y);
    if(world.get(x,y,z)!==BLOCK.AIR)return reject('occupied-air-column',y);
  }
  return Object.freeze({ok:true,x,z,cap,id});
}

// Bounded incremental work on a disposable original world. No partial
// result is exposed as a valid placement. Final edit-map iteration catches
// footprint edits (including deep rows) added during the survey. This is
// NOT an atomic live writer fence; evidence is valid for a quiet snapshot.
export function beginP0GroundSurvey(world,input,{reserved,maxRelief=8}={}){
  const site=defineP0Footprint(input);
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
     world.seed!==site.seed||typeof reserved!=='function'||!int(maxRelief)||maxRelief<0||maxRelief>12)
    throw Error('Invalid original M7 survey');
  let cursor=0,edits=0,iterator=null,done=null,min=Infinity,max=-Infinity;
  const caps=new Map(),total=site.size*site.size;
  const fail=(reason,detail)=>done=Object.freeze({accepted:false,reason,detail,site,
    scannedColumns:cursor,scannedEdits:edits});
  return Object.freeze({
    step({columns=P0_MAX_COLUMNS_PER_STEP,editRows=P0_MAX_EDIT_ROWS_PER_STEP}={}){
      if(!int(columns)||columns<1||columns>P0_MAX_COLUMNS_PER_STEP||
         !int(editRows)||editRows<1||editRows>P0_MAX_EDIT_ROWS_PER_STEP)throw Error('Invalid survey step budget');
      if(done)return done;
      for(let n=0;n<columns&&cursor<total;n++){
        const x=site.minX+cursor%site.size,z=site.minZ+Math.floor(cursor/site.size);
        cursor++;
        const r=inspectP0GroundColumn(world,site,x,z,reserved);
        if(!r.ok)return fail(r.reason,r);
        caps.set(key(x,z),r.cap);min=Math.min(min,r.cap);max=Math.max(max,r.cap);
        if(max-min>maxRelief)return fail('excessive-relief',{min,max});
      }
      if(cursor===total){
        iterator??=world.edits.keys();
        for(let n=0;n<editRows;n++){
          const row=iterator.next();
          if(row.done){
            // Flat physical floor one above highest cap. Only vacant cells
            // above each original cap may be proposed as foundation.
            const floor=max+1,pyramid=definePrototypePyramid({...site,baseY:floor});
            if(pyramid.maxY>147)return fail('upper-research-envelope',pyramid.maxY);
            return done=Object.freeze({accepted:true,reason:'quiet original M7 footprint surveyed; no placement authority',
              site,scannedColumns:cursor,scannedEdits:edits,minCap:min,maxCap:max,floor,
              maxY:pyramid.maxY,
              capAt:(x,z)=>caps.get(key(x,z)),
              proposedBlock(x,y,z){
                if(![x,y,z].every(int)||!p0FootprintContains(site,x,z))return null;
                const cap=caps.get(key(x,z));
                if(y<=cap)return null;
                if(y<floor)return BLOCK.STONE;
                return prototypePyramidBlock(pyramid,x,y,z);
              }});
          }
          edits++;
          const [x,y,z]=row.value.split(',').map(Number);
          if(p0FootprintContains(site,x,z))return fail('player-edit',{x,y,z});
        }
      }
      return Object.freeze({accepted:null,scannedColumns:cursor,scannedEdits:edits});
    }
  });
}
