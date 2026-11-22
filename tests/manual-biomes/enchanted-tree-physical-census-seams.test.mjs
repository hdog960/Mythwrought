// Focused actual-source M7 acceptance on current experimental branch.
// Distinguish real naturally eligible source roots from paper silhouettes.
// No browser, service-worker, edited saves, broad CI or other-biome changes.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {enchantedTreeFootingsSupported}
  from '../../src/manual-biomes/enchanted-tree-footings.mjs';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_CANDIDATE_KIND}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seeds=[179,7919,-88], key=(x,y,z)=>x+','+y+','+z;
const roll=(tx,tz,seed)=>{
  let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
};
const canopy=(x,z)=>.5+.5*Math.sin(x*.051+z*.037+Math.sin(z*.031));

test('actual three-seed source M7 Giant census remains physically rooted under strict cap/void checks',()=>{
 let oldEligible=0,newEligible=0,giantVisible=0,blockedByStrictRoots=0;
 let maxY=0,guardedRealCorners=0;
 const details=[];
 for(const seed of seeds){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:true});
  const readColumn=(x,z)=>world._columnPlan(x,z);
  const readCell=(x,y,z)=>readColumn(x,z).get(y)??world._environmentBaseline(x,y,z);
  let oldSeed=0,newSeed=0;
  for(let tx=-5;tx<=5;tx++)for(let tz=-69;tz<=-59;tz++){
   const x=tx*8+2+Math.floor(roll(tx,tz,seed+51)*4),
     z=tz*8+2+Math.floor(roll(tx,tz,seed+89)*4);
   const biome=v6BiomeAt(x,z,seed);
   if(biome?.name!=='enchanted'||biome.weight<.65||
      roll(tx,tz,seed)>=.52+canopy(x,z)*.34)continue;
   const column=readColumn(x,z);
   if(!column.size)continue;
   const floor=Math.max(...column.keys());
   if(readCell(x,floor,z)!==column.get(floor)||
      readCell(x,floor-1,z)===BLOCK.AIR)continue;
   const tree=buildEnchantedTreeCandidate(x,floor,z,roll(tx,tz,seed+151));
   if(tree?.species!==ENCHANTED_TREE_CANDIDATE_KIND.ANCIENT_GIANT)continue;
   const oldFooting=tree.footprint.every(([dx,dz])=>
      readCell(x+dx,floor,z+dz)!==BLOCK.AIR&&
      readCell(x+dx,floor+1,z+dz)===BLOCK.AIR);
   if(!oldFooting||
      tree.cells.some(([a,b,c])=>readCell(a,b,c)!==BLOCK.AIR))continue;
   oldEligible++;oldSeed++;
   const realFooting=enchantedTreeFootingsSupported(x,floor,z,tree.footprint,
      readColumn,readCell,BLOCK.AIR);
   if(!realFooting){blockedByStrictRoots++;continue;}
   newEligible++;newSeed++;
   assert.ok(tree.highestY<=WORLD_MAX_Y);
   maxY=Math.max(maxY,tree.highestY);
   for(const [dx,dz] of tree.footprint){
     assert.equal(readCell(x+dx,floor,z+dz),readColumn(x+dx,z+dz).get(floor));
     assert.notEqual(readCell(x+dx,floor-1,z+dz),BLOCK.AIR);
     guardedRealCorners++;
   }
   // Actual source reader and planner must expose the same physical bark.
   const trunk=[x,floor+1,z],id=world.get(...trunk);
   assert.notEqual(id,BLOCK.AIR,'accepted candidate must appear in the original source world');
   const cx=chunkCoord(x),cz=chunkCoord(z);
   const planned=environmentalTreesForChunk(cx,cz,seed,readColumn,readCell,
      {experimentalEnchantedTrees:true});
   assert.equal(planned.get(key(...trunk)),id,'real world and source chunk must agree');
   giantVisible++;
  }
  details.push({seed,oldEligible:oldSeed,strictEligible:newSeed});
  assert.throws(()=>world.save(),/cannot be saved as historical M7/);
 }
 assert.ok(oldEligible>=1,'previous source must have naturally viable Giants in these seeds');
 assert.ok(newEligible>=1,'root safety may not silently delete every naturally growing Giant');
 assert.ok(newEligible<=oldEligible);
 assert.equal(guardedRealCorners,newEligible*4);
 assert.equal(giantVisible,newEligible);
 console.log('# ENCHANTED GIANT REAL THREE-SEED CENSUS '+JSON.stringify({
  oldEligible,newEligible,blockedByStrictRoots,guardedRealCorners,
  highestRealY:maxY,details}));
});

test('real chunk-boundary tree voxels retain identical material in independent source readers',()=>{
 let realTrees=0,borderCells=0,adjacentPairs=0;
 for(const seed of seeds){
   const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
     {experimentalEnchantedTrees:true});
   const fresh=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
     {experimentalEnchantedTrees:true});
   const chunkCoords=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
   const plans=new Map();
   const readColumn=(x,z)=>world._columnPlan(x,z);
   const readCell=(x,y,z)=>readColumn(x,z).get(y)??world._environmentBaseline(x,y,z);
   for(const [cx,cz] of chunkCoords){
     const cells=environmentalTreesForChunk(cx,cz,seed,readColumn,readCell,
       {experimentalEnchantedTrees:true});
     const tag=cx+','+cz;
     plans.set(tag,cells);
     // Distinct real-source cache construction order must not affect content.
     const clone=environmentalTreesForChunk(cx,cz,seed,
       (x,z)=>fresh._columnPlan(x,z),
       (x,y,z)=>fresh._columnPlan(x,z).get(y)??fresh._environmentBaseline(x,y,z),
       {experimentalEnchantedTrees:true});
     assert.deepEqual([...cells.entries()],[...clone.entries()],
       'actual original M7 chunk outputs must be deterministic '+seed+' '+tag);
     for(const [at,id] of cells){
       const [x,y,z]=at.split(',').map(Number);
       assert.equal(chunkCoord(x),cx);assert.equal(chunkCoord(z),cz);
       assert.equal(world.get(x,y,z),id,
         'original M7 reader must resolve canopy overlap to same cell ID');
       assert.ok(y<=WORLD_MAX_Y);
       realTrees++;
       const edgeX=((x%16)+16)%16,edgeZ=((z%16)+16)%16;
       if(edgeX===0||edgeX===15||edgeZ===0||edgeZ===15)borderCells++;
     }
   }
   for(const [cx,cz] of chunkCoords){
     const plan=plans.get(cx+','+cz);
     const right=plans.get((cx+1)+','+cz),bottom=plans.get(cx+','+(cz+1));
     if(right){
       for(const [at] of plan){const [x,y,z]=at.split(',').map(Number);
         if(x!==cx*16+15)continue;
         if(right.has(key(x+1,y,z)))adjacentPairs++;
       }
     }
     if(bottom){
       for(const [at] of plan){const [x,y,z]=at.split(',').map(Number);
         if(z!==cz*16+15)continue;
         if(bottom.has(key(x,y,z+1)))adjacentPairs++;
       }
     }
   }
 }
 assert.ok(realTrees>=50,'test must include nontrivial natural enchanted tree source geometry');
 assert.ok(borderCells>0,'must sample actual original-game chunk-edge tree geometry');
 assert.ok(adjacentPairs>0,'must find a true connected canopy across a chunk seam');
 console.log('# ENCHANTED PHASE2 NATIVE SEAM CENSUS '+JSON.stringify({
   seedCount:seeds.length,realTreeVoxels:realTrees,borderCells,adjacentPairs}));
});
