// Diagnose authentic Phase 1 evidence before touching source. TEST ONLY.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK,terrainHeight} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';

// Exact ten Desert-side points from artifact #14727906444, report.json.
// This census deliberately reconstructs the same 7x7 footprint and heights.
const evidence=[
 [179,'interior',512,0],[179,'plains',268,-24],
 [179,'snow',216,-228],[179,'mountain',312,236],
 [179,'enchanted',-24,-821],[2026,'interior',384,0],
 [2026,'plains',233,24],[2026,'snow',240,312],
 [2026,'mountain',764,24],[2026,'enchanted',1822,312]
];
const smooth=t=>t*t*(3-2*t);
const histogram=new Map(),details=[],sampleSummary=[];
const bump=(key,n=1)=>histogram.set(key,(histogram.get(key)??0)+n);

test('real V7 grass provenance for 67 verified original Desert-side blocks',()=>{
  const worlds=new Map([[179,new FourRegionWorld(179,fourRegionProfile(179,M7_ENVIRONMENT_GENERATOR))],
    [2026,new FourRegionWorld(2026,fourRegionProfile(2026,M7_ENVIRONMENT_GENERATOR))]]);
  let grass=0;
  for(const [seed,neighbor,px,pz] of evidence){
    const world=worlds.get(seed);
    let siteCount=0;
    for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
      const x=px+dx,z=pz+dz,biome=v6BiomeAt(x,z,seed);
      if(biome?.name!=='desert')continue;
      const old=terrainHeight(x,z,seed);
      const blend=smooth(Math.max(0,Math.min(1,(biome.weight-.35)/.65)));
      const plan=world._columnPlan(x,z);
      for(let y=Math.max(2,old-2);y<=WORLD_MAX_Y;y++){
        if(world.naturalAndLandmarkBlock(x,y,z)!==BLOCK.GRASS)continue;
        grass++;siteCount++;
        let blocker=null;
        for(let h=old-2;h<=WORLD_MAX_Y;h++){
          const id=world._environmentBaseline(x,h,z);
          if(h>old?id!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(id)){
            blocker={height:h,id,category:h>old?'headroom':'protected-substrate'};break;
          }
        }
        const classification=plan.has(y)?'plan-grass':
          blocker?'protected-column-veto':
          blend<.065?'weak-blend-early-exit':
          'unclassified-empty-or-missing-plan';
        bump(classification);
        bump('near:'+neighbor);
        if(blocker)bump('blocker:'+blocker.category+':'+blocker.id);
        if(blend<.065)bump('tiny-blend');
        const row={seed,neighbor,x,y,z,old,weight:biome.weight,
          blend:+blend.toFixed(7),planSize:plan.size,
          planAtY:plan.get(y)??null,classification,blocker};
        details.push(row);
      }
    }
    sampleSummary.push({seed,neighbor,grass:siteCount});
  }
  const diagnostic={totalGrass:grass,summary:sampleSummary,
    categories:Object.fromEntries([...histogram].sort((a,b)=>a[0].localeCompare(b[0]))),
    allGrassRows:details};
  console.log('DESERT_V7_GRASS_PROVENANCE '+JSON.stringify(diagnostic));
  assert.equal(grass,67,'Phase 1 original source footprint unexpectedly changed');
  for(const world of worlds.values())assert.equal(world.save().edits.length,0);
});
