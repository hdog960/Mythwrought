// Focused reproducible ORIGINAL M7 source generation cost measurements.
// No browser/device claims, no fragile wall-clock pass/fail thresholds.
// Original terrain/cave reader and true candidate chunks; report actual
// callback pressure, cold/warm CPU time and source retention by seed.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BLOCK} from '../../src/voxel.mjs';

const chunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
const seeds=[179,7919,-88];

test('measure actual cold and warm original M7 experimental canopy source cost without modifying world',()=>{
 const measurements=[];
 let checked=0,candidateCells=0,sourceReads=0,retainedLeaves=0;
 for(const seed of seeds){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:true});
  const column=(x,z)=>world._columnPlan(x,z);
  let callbacks=0;
  const baseline=(x,y,z)=>{
    callbacks++;
    return column(x,z).get(y)??world._environmentBaseline(x,y,z);
  };
  const onePass=()=>{
    const first=performance.now();
    let cells=0,leaves=0;
    for(const [cx,cz] of chunks){
      const planned=environmentalTreesForChunk(cx,cz,seed,column,baseline,
        {experimentalEnchantedTrees:true});
      for(const [at,id] of planned){
        const [x,y,z]=at.split(',').map(Number);
        assert.equal(world.get(x,y,z),id,
          'real reader must expose exact planned material at the original source coordinate');
        if(id===G.aetherLeaves||id===G.moonLeaves)leaves++;
      }
      cells+=planned.size;
    }
    return {ms:+(performance.now()-first).toFixed(3),cells,leaves};
  };
  const cold=onePass(),coldReads=callbacks;
  callbacks=0;
  const warm=onePass(),warmReads=callbacks;
  assert.deepEqual([warm.cells,warm.leaves],[cold.cells,cold.leaves],
    'repeated native source trees must not vary by cache or time');
  assert.ok(warmReads>0&&coldReads>0);
  const normal=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  assert.doesNotThrow(()=>normal.save());
  assert.throws(()=>world.save(),/cannot be saved as historical M7/);
  const row={seed,coldMs:cold.ms,warmMs:warm.ms,
    firstPassSourceReads:coldReads,secondPassSourceReads:warmReads,
    candidateCells:cold.cells,leafCells:cold.leaves,measuredChunks:chunks.length};
  measurements.push(row);
  checked+=chunks.length*2;candidateCells+=cold.cells;
  retainedLeaves+=cold.leaves;sourceReads+=coldReads+warmReads;
 }
 assert.ok(candidateCells>100&&retainedLeaves>80);
 console.log('# ENCHANTED M7 SOURCE COST NODE22 RUNNER ONLY '+JSON.stringify({
  sampledChunkPasses:checked,candidateCells,leafCells:retainedLeaves,
  totalOriginalSourceCallbacks:sourceReads,measurements,
  notIphoneFps:true,notPhysicalIphone:true
 }));
});
