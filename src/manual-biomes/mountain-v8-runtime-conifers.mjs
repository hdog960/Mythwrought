// Actual candidate-only Mountain V8 conifer generation.
// Keep the prior exact 13-cell authored pattern and use already registered
// physical pine blocks. New V8 flora IDs and flower/heather remain pending.
// This generation never reads edits or writes a save.
import {BLOCK,CHUNK_SIZE,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {biome130Block} from '../biome130-registry.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {naturalTreeTouchesDesert} from './environment-v7.mjs';
import {mountainV8TileRoot,surveyMountainV8Column} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PlantCells} from './mountain-v8-vegetation-cells.mjs';
// Resolve actual source symbolic identities; these are NOT newly allocated IDs.
const trunk=biome130Block('biome130:115'),needles=biome130Block('biome130:124');
export const MOUNTAIN_V8_EXISTING_PINE=Object.freeze({trunk:trunk.blockId,needles:needles.blockId});
if(trunk.name!=='Pine logs'||!trunk.solid||needles.name!=='Pine needle clusters'||needles.solid)
  throw Error('Original pine physical ownership changed');
const core=(x,z,seed)=>{const b=v6BiomeAt(x,z,seed);return b?.name==='mountain'&&b.weight>=.82;};
export function mountainV8ConifersForChunk(cx,cz,seed,{readOriginal,protectedAt,readColumn,readGround,readExistingTree}){
  const out=new Map();
  if(![cx,cz,seed].every(Number.isSafeInteger))return out;
  const minX=cx*CHUNK_SIZE,minZ=cz*CHUNK_SIZE;
  // Original source root lies 2..5 inside each 8x8 tile; +/-1 canopy
  // stays inside its owner tile and hence one 16x16 chunk, even negative.
  for(let tz=cz*2;tz<cz*2+2;tz++)for(let tx=cx*2;tx<cx*2+2;tx++){
    const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
    if(!core(x,z,seed))continue;
    const p=surveyMountainV8Column({x,z,seed,worldMaxY:WORLD_MAX_Y,
      biomeAt:v6BiomeAt,heightAt:terrainHeight,readBlock:readOriginal,protectedAt,ids:BLOCK});
    if(!p||p.vegetation!=='dwarf-conifer')continue;
    const surface=(a,c)=>{
      const column=readColumn(a,c);
      return column.size?Math.max(...column.keys()):terrainHeight(a,c,seed);
    };
    if(surface(x,z)!==p.top||readGround(x,p.top,z)!==BLOCK.GRASS)continue;
    const plant=planMountainV8PlantCells(p,{worldMaxY:WORLD_MAX_Y,airId:BLOCK.AIR,
      readOriginalBlock:readOriginal,protectedAt,mountainAt:(a,c)=>core(a,c,seed),
      proposedSurfaceAt:surface});
    if(!plant||naturalTreeTouchesDesert(seed,plant.cells.map(c=>[c.x,c.y,c.z]),[x,p.top,z]))continue;
    // Preserve old environmental tree ownership and all real final terrain.
    // Whole candidate rejected on ANY overlap, not clipped leaf-by-leaf.
    if(plant.cells.some(c=>c.x<minX||c.x>=minX+CHUNK_SIZE||
      c.z<minZ||c.z>=minZ+CHUNK_SIZE||
      readGround(c.x,c.y,c.z)!==BLOCK.AIR||readExistingTree(c.x,c.y,c.z)!==BLOCK.AIR||
      out.has(worldKey(c.x,c.y,c.z))))continue;
    for(const c of plant.cells)out.set(worldKey(c.x,c.y,c.z),
      c.material==='conifer-trunk'?trunk.blockId:needles.blockId);
  }
  return out;
}
