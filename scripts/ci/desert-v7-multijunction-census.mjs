// Source-only Desert V7 multi-biome junction audit. Do not change world terrain.
// V6 Plains is null; the V7 shoulder helper checks neighbors in fixed order
// and can prematurely choose hardpan before checking Mountain scree.
import assert from 'node:assert/strict';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
const SEEDS=[179,2026,2201,-443,77];
const OFFSETS=[[14,0],[-14,0],[0,14],[0,-14]];
const label=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const specials=new Set(['mountain','snow','enchanted']);
function candidateCorners(seed){
  const corners=[];
  for(let ix=-6;ix<6;ix++)for(let iz=-6;iz<6;iz++){
    const labels=new Set([[ix,iz],[ix+1,iz],[ix,iz+1],[ix+1,iz+1]]
      .map(([x,z])=>label(x*512,z*512,seed)));
    if(!labels.has('desert')||!labels.has('mountain')||
       ![...labels].some(x=>x==='snow'||x==='enchanted'))continue;
    corners.push([(ix*512)+256,(iz*512)+256]);
  }
  return corners;
}
for(const seed of SEEDS){
  const corners=candidateCorners(seed);
  let desertJunction=0,mountainPlusSpecial=0,orderDisagreements=0,
    sourcePlanEligible=0,protectedVeto=0,firstSpecialMountain=0;
  const examples=[],world=new FourRegionWorld(seed,
    fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const visited=new Set();
  for(const [cx,cz] of corners){
    for(let z=cz-112;z<=cz+112;z+=2)
      for(let x=cx-112;x<=cx+112;x+=2){
        const key=x+','+z;
        if(visited.has(key))continue;
        visited.add(key);
        const biome=v6BiomeAt(x,z,seed);
        if(biome?.name!=='desert'||biome.weight>.50)continue;
        const neighbors=OFFSETS.map(([dx,dz])=>label(x+dx,z+dz,seed));
        const diverse=[...new Set(neighbors.filter(n=>n!=='desert'))];
        if(diverse.length<2)continue;
        desertJunction++;
        if(!neighbors.includes('mountain')||
           !neighbors.some(n=>n==='snow'||n==='enchanted'))continue;
        mountainPlusSpecial++;
        const first=neighbors.find(n=>specials.has(n)&&n!=='desert');
        if(first==='mountain')firstSpecialMountain++;
        else{
          orderDisagreements++;
          // Evaluate real world overlay only for a bounded list of genuine
          // original V7 cells, not for millions of speculative candidates.
          if(examples.length<24){
            const plan=world._columnPlan(x,z);
            if(plan.size)sourcePlanEligible++;else protectedVeto++;
            examples.push({seed,x,z,weight:biome.weight,
              neighbors,firstSpecial:first,planSize:plan.size,
              actualTopCap:plan.size?plan.get(Math.max(...plan.keys())):null});
          }
        }
      }
  }
  assert.deepEqual(world.save().edits,[]);
  const report={seed,corners:corners.length,visitedColumns:visited.size,
    desertJunction,mountainPlusSpecial,firstSpecialMountain,
    orderDisagreements,sampledRealPlanEligible:sourcePlanEligible,
    sampledProtectedVeto:protectedVeto,examples};
  console.log('DESERT_V7_JUNCTION_SOURCE '+JSON.stringify(report));
}
