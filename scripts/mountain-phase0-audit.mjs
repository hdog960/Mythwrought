// MYTHWROUGHT mountain Phase 0: source-derived, read-only terrain probe.
// Run: node scripts/mountain-phase0-audit.mjs
// Purpose: reproducible evidence, not a replacement for authentic WebGL2
// screenshots or physical iPhone/Home Screen testing.
// This script does not write saves, edits, commits or generation metadata.
import {BLOCK, VoxelWorld, terrainHeight} from '../src/voxel.mjs';
import {WORLD_MAX_Y} from '../src/depth.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';

const seed=179;
const center=[-512,0];
const sites=[];
for(let dz=-64;dz<=64;dz+=8)
  for(let dx=-64;dx<=64;dx+=8)sites.push([center[0]+dx,center[1]+dz]);
const baseline=new VoxelWorld(seed);
const materialNames=new Map([
  [BLOCK.GRASS,'legacy grass'],[BLOCK.DIRT,'legacy dirt'],
  [BLOCK.STONE,'stone'],[272,'snow cap'],
  [G.slate,'slate'],[G.scree,'scree'],[G.gneiss,'gneiss']
]);
const counts={};
const emptyOnActualBaseline=[];
const topCap= WORLD_MAX_Y-2;
let sampled=0,clipped=0,legacyGrassCaps=0,valid=0,forcedTreeCancellation=0;
for(const [x,z] of sites){
  const biome=v6BiomeAt(x,z,seed);
  if(biome?.name!=='mountain'||biome.weight<.65)continue;
  sampled++;
  const old=terrainHeight(x,z,seed);
  // Deliberately clean legacy baseline to isolate the mountain planner's
  // elevation/material formula from preexisting caves/landmarks.
  const ordinary=(a,y,c)=>{
    const h=terrainHeight(a,c,seed);
    return y>h?BLOCK.AIR:y===h?BLOCK.GRASS:y>=h-2?BLOCK.DIRT:BLOCK.STONE;
  };
  const proposal=planEnvironmentalColumn(x,z,seed,ordinary,biome);
  if(!proposal.size)continue;
  valid++;
  const top=Math.max(...proposal.keys());
  if(top===topCap)clipped++;
  const cap=proposal.get(top);
  counts[materialNames.get(cap)??String(cap)]=(counts[materialNames.get(cap)??String(cap)]??0)+1;
  if(cap===BLOCK.GRASS)legacyGrassCaps++;
  // Reproduce the documented all-or-nothing guard for an original tree.
  if(old+1<=WORLD_MAX_Y){
    const withWood=(a,y,c)=>a===x&&c===z&&y===old+1?BLOCK.WOOD:ordinary(a,y,c);
    const attempted=planEnvironmentalColumn(x,z,seed,withWood,biome);
    if(!attempted.size)forcedTreeCancellation++;
  }
  // Actual untouched VoxelWorld contains real legacy groves, landmarks and
  // cave cells. This is a source clue, not proof of any specific filmed cut;
  // the combined environment cave override has additional protection.
  const actual=planEnvironmentalColumn(x,z,seed,
    (a,y,c)=>baseline.naturalAndLandmarkBlock(a,y,c),biome);
  if(!actual.size&&emptyOnActualBaseline.length<30)
    emptyOnActualBaseline.push({x,z,old,proposedTop:top});
}
console.log(JSON.stringify({
  title:'MOUNTAIN PHASE 0 -- OBSERVATIONAL SOURCE PROBE',
  source:'production V7 planner and legacy baseline, seed 179',
  target:'mountain macrocell at x=-512,z=0',
  sampleStep:8,sampled,valid,
  ceiling:{worldMaxY:WORLD_MAX_Y,mountainTopLimit:topCap,atLimit:clipped},
  groundCaps:counts,grassCapCount:legacyGrassCaps,
  artificialWoodCausedFullColumnCancellation:forcedTreeCancellation,
  actualLegacyBaselineCancellationSamples:emptyOnActualBaseline,
  caveat:'Mountain macrocell geometry only. Reproduce filmed rectangular cuts with exact recorded positions, real environmental-cave overlay and gameplay screenshots before declaring a root cause.'
},null,2));
