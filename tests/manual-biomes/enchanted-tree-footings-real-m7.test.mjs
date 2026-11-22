// Real M7 source-only integration proof for the draft Ancient Giant root fix.
// No browser, screenshots, save mutations, generator version changes or reruns
// of unrelated biomes. This test must run on the exact future source revision.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {enchantedTreeFootingsSupported}
  from '../../src/manual-biomes/enchanted-tree-footings.mjs';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_CANDIDATE_KIND}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';

const roll=(tx,tz,seed)=>{
  let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
};
const key=(x,y,z)=>[x,y,z].join(',');
const canopy=(x,z)=>.5+.5*Math.sin(x*.051+z*.037+Math.sin(z*.031));

test('real M7 Giant roots have four genuine supported cap columns; one buried cavity rejects entire authored tree',()=>{
  let genuine=0,holesRejected=0;
  for(const seed of [179,7919,-88]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
      {experimentalEnchantedTrees:true});
    const readColumn=(x,z)=>world._columnPlan(x,z);
    const readCell=(x,y,z)=>readColumn(x,z).get(y)??world._environmentBaseline(x,y,z);
    // Use actual 8x8 seeded sites, never fabricated centers or independent
    // "expected" tree maps. This grid matches the source census horizon.
    for(let tx=-5;tx<=5;tx++)for(let tz=-69;tz<=-59;tz++){
      const x=tx*8+2+Math.floor(roll(tx,tz,seed+51)*4);
      const z=tz*8+2+Math.floor(roll(tx,tz,seed+89)*4);
      const biome=v6BiomeAt(x,z,seed),density=roll(tx,tz,seed);
      if(biome?.name!=='enchanted'||biome.weight<.65||
        density>=.52+canopy(x,z)*.34)continue;
      const column=readColumn(x,z);
      if(!column.size)continue;
      const floor=Math.max(...column.keys());
      const shape=buildEnchantedTreeCandidate(x,floor,z,roll(tx,tz,seed+151));
      if(shape?.species!==ENCHANTED_TREE_CANDIDATE_KIND.ANCIENT_GIANT)continue;
      if(!enchantedTreeFootingsSupported(x,floor,z,shape.footprint,
        readColumn,readCell,BLOCK.AIR))continue;
      if(shape.cells.some(([a,b,c])=>readCell(a,b,c)!==BLOCK.AIR))continue;
      const cx=chunkCoord(x),cz=chunkCoord(z),readChunk=reader=>
        environmentalTreesForChunk(cx,cz,seed,readColumn,reader,
          {experimentalEnchantedTrees:true});
      const trunk=key(x+1,floor+1,z);
      if(readChunk(readCell).get(trunk)!==G.aetherBark)continue;
      genuine++;
      for(const [dx,dz] of shape.footprint){
        const a=x+dx,c=z+dz;
        assert.equal(readCell(a,floor,c),readColumn(a,c).get(floor),
          'source must not root the Giant into a protected landmark roof');
        assert.notEqual(readCell(a,floor-1,c),BLOCK.AIR,
          'source must not root a Giant over a cave/gap');
        assert.equal(readCell(a,floor+1,c),BLOCK.AIR,
          'no elevated terrain or protected object may be overwritten');
      }
      const underCorner=(a,b,c)=>
        a===x+1&&b===floor-1&&c===z+1?BLOCK.AIR:readCell(a,b,c);
      const changed=readChunk(underCorner);
      assert.notEqual(changed.get(trunk),G.aetherBark,
        'one newly missing rear-root subsoil must remove the entire Giant, not leave floating bark');
      holesRejected++;
      assert.throws(()=>world.save(),/cannot be saved as historical M7/,
        'temporary giant baseline must remain incompatible with historical save identity');
    }
  }
  assert.ok(genuine>=1,'at least one physically supported naturally spawned Giant required across 3 seeds');
  assert.equal(holesRejected,genuine);
  console.log('# ENCHANTED PHASE2 REAL ROOT SAFETY '+JSON.stringify({
    genuineRootedGiants:genuine,rejectedSyntheticCaveCorners:holesRejected,
    seeds:[179,7919,-88],testOnly:true
  }));
});
