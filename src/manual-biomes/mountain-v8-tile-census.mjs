// Read-only Mountain V8 tile census. Not connected to the live V7 engine.
// This deliberately calls the genuine read-only adapter with ONE shared
// original VoxelWorld per seed. No save, edit, chunk mesh, or profile mutation.
import {VoxelWorld,BLOCK,terrainHeight} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {surveyMountainV8OriginalWorld} from './mountain-v8-original-world.mjs';
import {mountainV8TileRoot} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PlantCells} from './mountain-v8-vegetation-cells.mjs';

const TILE=8;
const valid=n=>Number.isSafeInteger(n);
const key=(x,z)=>x+','+z;
/** Every tile candidate is sampled at its single source-selected root.
 * No hypothetical random tree height is assumed; all plant cells are
 * verified against the untouched original world's existing AIR/landmarks.
 * The caller can inspect per-seed veto counts before any V8 integration.
 * Bounded to 64 tiles and exactly one source-backed site per tile.
 */
export function censusMountainV8Tiles({seed,tileX,tileZ,width=4,height=4,
  world,inspect=sourcSurvey}={}){
  if(!valid(seed)||seed!==(seed|0)||![tileX,tileZ,width,height].every(valid)||
     width<1||height<1||width*height>64||typeof inspect!=='function')return null;
  const source=world??new VoxelWorld(seed);
  if(source.constructor!==VoxelWorld||source.seed!==seed||
     source.edits.size||source.rotations.size)return null;
  const before=source.save(),sites=[],stats={
    tiles:width*height,eligible:0,plants:0,plantCells:0,
    rejected:0,nonMeadow:0,occupied:0,rock:0,snow:0,meadow:0,
    cliff:0,seen:0
  };
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++){
    const tx=tileX+dx,tz=tileZ+dz;
    // One source-backed read at the unique owner site: 64x fewer
    // candidate surveys than scanning every square of each 8x8 tile.
    const {rootX,rootZ}=mountainV8TileRoot(tx,tz,seed);
    const chosen=inspect(rootX,rootZ,seed,{world:source});
    stats.seen++;
    if(chosen&&(chosen.x!==rootX||chosen.z!==rootZ||
       !chosen.vegetationSite?.chosen))
      throw Error('V8 tile root or provenance mismatch');
    if(!chosen){stats.rejected++;continue;}
    stats.eligible++;
    if(chosen.cliff)stats.cliff++;
    if(chosen.cap==='snow')stats.snow++;
    else if(chosen.cap==='alpine-grass')stats.meadow++;
    else stats.rock++;
    if(!chosen.vegetation){stats.nonMeadow++;continue;}
    const physical=planMountainV8PlantCells(chosen,{
      worldMaxY:WORLD_MAX_Y,airId:BLOCK.AIR,
      readOriginalBlock:(x,y,z)=>source.naturalAndLandmarkBlock(x,y,z),
      protectedAt:()=>false,
      mountainAt:(x,z)=>{const b=v6BiomeAt(x,z,seed);
        return b?.name==='mountain'&&b.weight>=.82;}
    });
    if(!physical){stats.occupied++;continue;}
    stats.plants++;stats.plantCells+=physical.estimatedCells;
    if(stats.plantCells>64*18)throw Error('Unbounded vegetation cells');
    sites.push(Object.freeze({tileX:tx,tileZ:tz,x:chosen.x,z:chosen.z,
      top:chosen.top,cap:chosen.cap,kind:physical.kind,
      cells:physical.estimatedCells}));
  }
  if(source.save()!==before||source.edits.size||source.rotations.size)
    throw Error('Read-only Mountain V8 census changed a schema-1 save');
  return Object.freeze({seed,stats:Object.freeze(stats),
    sites:Object.freeze(sites),source:'original-VoxelWorld-readonly',
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
function sourcSurvey(x,z,seed,options){
  return surveyMountainV8OriginalWorld(x,z,seed,options);
}
