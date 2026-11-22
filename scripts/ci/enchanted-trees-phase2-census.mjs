// Phase 2 read-only natural-placement census, on real M7 terrain and caves.
// Prototype trees require explicit in-memory opt-in. No save writes or UI.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {environmentalTreesForChunk} from '../../src/manual-biomes/environment-v7.mjs';
import {buildEnchantedTreeCandidate} from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seeds=[179,7919,-88];
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceBlob=execFileSync('git',['hash-object','src/manual-biomes/environment-v7.mjs'],{encoding:'utf8'}).trim();
const candidateBlob=execFileSync('git',['hash-object','src/manual-biomes/enchanted-tree-candidates.mjs'],{encoding:'utf8'}).trim();
function roll(tx,tz,seed){
  let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
}
const undulation=n=>.5+.5*Math.sin(n);
const summary={kind:'enchanted-phase2-natural-physical-tree-feasibility-v1',
  head,sourceBlob,candidateBlob,worldMaxY:WORLD_MAX_Y,
  seeds,totals:{potential:0,densityEligible:0,ceilingRejected:0,
    footprintRejected:0,collisionRejected:0,accepted:0},
  acceptedBySpecies:{'ancient-giant':0,starspire:0,moonwillow:0},
  sampleNaturalAccepted:[],chunkSamples:[],treeVoxels:{historical:0,optIn:0},
  aboveWorldCells:0,sourceWorldsOptInOnly:true,saved:false};
for(const seed of seeds){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:true});
  const baseline=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  // Independently enumerate actual 8x8 site grid across central 80x80 forest.
  for(let tx=-5;tx<=5;tx++)for(let tz=-69;tz<=-59;tz++){
    const raw=roll(tx,tz,seed);
    const x=tx*8+2+Math.floor(roll(tx,tz,seed+51)*4);
    const z=tz*8+2+Math.floor(roll(tx,tz,seed+89)*4);
    const biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='enchanted'||biome.weight<.65)continue;
    summary.totals.potential++;
    const canopy=undulation(x*.051+z*.037+Math.sin(z*.031));
    if(raw>=.52+canopy*.34)continue;
    summary.totals.densityEligible++;
    const column=world._columnPlan(x,z);
    if(!column.size)continue;
    const floor=Math.max(...column.keys());
    const read=(a,b,c)=>world._columnPlan(a,c).get(b)??world._environmentBaseline(a,b,c);
    const root=read(x,floor,z);
    if(root!==column.get(floor)||read(x,floor-1,z)===BLOCK.AIR)continue;
    const shaped=buildEnchantedTreeCandidate(x,floor,z,roll(tx,tz,seed+151));
    if(!shaped){summary.totals.ceilingRejected++;continue;}
    if(shaped.footprint.some(([dx,dz])=>
      read(x+dx,floor,z+dz)===BLOCK.AIR||
      read(x+dx,floor+1,z+dz)!==BLOCK.AIR)){
      summary.totals.footprintRejected++;continue;
    }
    if(shaped.cells.some(([a,b,c])=>b>WORLD_MAX_Y||read(a,b,c)!==BLOCK.AIR)){
      summary.totals.collisionRejected++;continue;
    }
    summary.totals.accepted++;
    summary.acceptedBySpecies[shaped.species]++;
    if(summary.sampleNaturalAccepted.length<32)summary.sampleNaturalAccepted.push({
      seed,origin:[x,floor,z],species:shaped.species,
      highestY:shaped.highestY,voxelCount:shaped.cells.length,
      chunk:[chunkCoord(x),chunkCoord(z)]
    });
  }
  // Actual chunk-local planned cells, not synthetic geometry, for old vs
  // opt-in M7, including negative XY grid boundaries.
  for(let cx=-3;cx<=1;cx++)for(let cz=-35;cz<=-31;cz++){
    const original=environmentalTreesForChunk(cx,cz,seed,
      (x,z)=>baseline._columnPlan(x,z),
      (x,y,z)=>baseline._columnPlan(x,z).get(y)??baseline._environmentBaseline(x,y,z));
    const newTrees=environmentalTreesForChunk(cx,cz,seed,
      (x,z)=>world._columnPlan(x,z),
      (x,y,z)=>world._columnPlan(x,z).get(y)??world._environmentBaseline(x,y,z),
      {experimentalEnchantedTrees:true});
    summary.treeVoxels.historical+=original.size;
    summary.treeVoxels.optIn+=newTrees.size;
    if(seed===179&&summary.chunkSamples.length<25)summary.chunkSamples.push({
      cx,cz,historical:original.size,optIn:newTrees.size
    });
    for(const key of newTrees.keys()){
      const [x,y,z]=key.split(',').map(Number);
      assert.equal(chunkCoord(x),cx);
      assert.equal(chunkCoord(z),cz);
      if(y>WORLD_MAX_Y)summary.aboveWorldCells++;
    }
  }
  assert.throws(()=>world.save(),/cannot be saved as historical M7/);
  assert.equal(baseline.experimentalEnchantedTrees,false);
}
mkdirSync('artifacts/enchanted-forest',{recursive:true});
writeFileSync('artifacts/enchanted-forest/phase2-tree-feasibility.json',
  JSON.stringify(summary,null,2)+'\n');
console.log('ENCHANTED PHASE2 GENUINE TREE FEASIBILITY '+JSON.stringify(summary));
assert.ok(summary.totals.accepted>0,
  'no actual physical tall trees survive authentic cave and canopy clearance');
assert.equal(summary.aboveWorldCells,0,'candidate cannot exceed Y=19');
assert.ok(summary.treeVoxels.optIn>0,'no actual source-generated enchanted tree chunks');
