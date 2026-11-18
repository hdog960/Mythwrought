// MYTHWROUGHT M5: profile-aware ink for already-discovered map cells ONLY.
// The exploration-map caller must check map.seen BEFORE invoking this helper.
// Read the SAME authoritative physical world.get() as collision and mining;
// do not reveal unvisited regions, auto-generate preview terrain or write saves.
import {WORLD_MAX_Y} from '../depth.mjs';

const DESERT=new Map([
  [256,'#d5b276'],[257,'#bd765c'],[258,'#aa8a63'],[259,'#dfd4ae'],
  [260,'#998276'],[261,'#c3a181'],[262,'#b18b71'],[263,'#876c60'],
  [264,'#b19a78'],[266,'#e2d4c2']
]);
const SNOW=new Map([
  [272,'#e0edf0'],[277,'#a7d5df'],[278,'#b7c3c4'],[279,'#d2ddde']
]);
const MOUNTAIN=new Map([
  [302,'#858995'],[303,'#676d7c'],[305,'#686c7a'],[307,'#a87866']
]);
const ENCHANTED=new Map([
  [286,'#8e6ca8'],[293,'#a184bf'],[294,'#9278ac'],[289,'#6a758d']
]);
const GROUPS=[DESERT,SNOW,MOUNTAIN,ENCHANTED];
/** Return null for any legacy/non-profiled cell. The map draws it with its
 * exact old surfaceInk path to preserve prior-world rendering behavior.
 * For an authored biome, return ink ONLY for the material actually found
 * in the authoritative column. Never paint a protected legacy landmark as
 * an authored biome. Cannot change gameplay voxels or edit records.
 */
export function profiledDiscoveredCellInk(world,cx,cz,cellSize=4){
  const base=world?.base||world;
  if(base?.generationProfile?.kind!=='mythwrought-generation-profile'||
     typeof world?.get!=='function')return null;
  if(!Number.isInteger(cx)||!Number.isInteger(cz)||
     !Number.isInteger(cellSize)||cellSize<1||cellSize>16)
    throw Error('Invalid discovered map tile');
  const x=cx*cellSize+Math.floor(cellSize/2),
    z=cz*cellSize+Math.floor(cellSize/2);
  // Trees, canopies, real cactus and shaped non-block objects can sit above
  // the ground. Only registered physical GEOLOGY is painted as a biome.
  for(let y=WORLD_MAX_Y;y>=0;y--){
    const id=world.get(x,y,z);
    for(const group of GROUPS)if(group.has(id))return group.get(id);
  }
  return null;
}
