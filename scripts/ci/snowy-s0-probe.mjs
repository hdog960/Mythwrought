// Real M7 reader audit. Diagnostic only: no mutation, no mocks, no saved worlds.
// Produces reproducible seed/coordinate/block-ID evidence for S0.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {BLOCK,terrainHeight,VoxelWorld} from '../../src/voxel.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';

const output='artifacts/snowy-s0-provenance';
await mkdir(output,{recursive:true});
const results=[];
for(const seed of [179,2026]){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const m={seed,anchor:[0,512],step:8,validInterior:0,allSnow:0,
    caps:{},uncoveredGrass:0,emptyColumns:0,blockedAbove:0,
    otherProtected:0,glacierSites:[],grassSites:[],blockedSites:[],rockSites:[],
    rejectionReasons:{},rejectionExamples:[]};
  for(let x=-160;x<=160;x+=8)for(let z=352;z<=672;z+=8){
    const climate=v6BiomeAt(x,z,seed);
    if(climate?.name!=='snow')continue;
    m.allSnow++;
    if(climate.weight<.8)continue;
    m.validInterior++;
    const old=terrainHeight(x,z,seed);
    const column=world._columnPlan(x,z);
    let final=null;
    if(column.size){
      const top=Math.max(...column.keys()); final={y:top,id:column.get(top)};
      const key=String(final.id);m.caps[key]=(m.caps[key]??0)+1;
      if(final.id===276&&m.glacierSites.length<25)m.glacierSites.push([x,top,z]);
      if(final.id===279&&m.rockSites.length<20)m.rockSites.push([x,top,z]);
    }else{
      m.emptyColumns++;
      const legacy=VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,old,z);
      const baseline=world._environmentBaseline(x,old,z);
      const actual=world.get(x,old,z);
      if(baseline===BLOCK.GRASS&&actual===BLOCK.GRASS){
        m.uncoveredGrass++;
        if(m.grassSites.length<25)m.grassSites.push([x,old,z]);
      }
      let obstruction=null;
      for(let y=old+1;y<=19;y++){
        const block=world._environmentBaseline(x,y,z);
        if(block!==BLOCK.AIR){obstruction=[y,block];break;}
      }
      if(obstruction){m.blockedAbove++;
        if(m.blockedSites.length<25)m.blockedSites.push({xyz:[x,old,z],
          legacy,baseline,obstruction});
      }
      else m.otherProtected++;
      // A column is rejected by its first baseline cell that would be
      // overwritten/buried. Classify each genuine prior block, including
      // below-old protected cave/structure cells, rather than guessing trees.
      let rejection=null;
      for(let y=old-2;y<=19;y++){
        const id=world._environmentBaseline(x,y,z);
        if(y>old?id!==BLOCK.AIR:
           ![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(id)){
          const original=VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z);
          const cave=world.environmentCaves?.get(x,y,z);
          rejection={y,id,original,cave:cave===undefined?null:cave,
            location:y>old?'above-old-ground':'protected-old-substrate'};
          break;
        }
      }
      const reason=rejection?
        rejection.location+':'+rejection.id+':'+
          (rejection.cave!==null?'cave':rejection.original!==rejection.id?'masked':'original'):
        'no-rejection-found';
      m.rejectionReasons[reason]=(m.rejectionReasons[reason]??0)+1;
      if(m.rejectionExamples.length<35)
        m.rejectionExamples.push({at:[x,old,z],reason,rejection});
    }
  }
  assert.ok(m.validInterior>=200,'Snow survey must sample a real M7 interior');
  assert.ok(m.glacierSites.length>0,'Real M7 survey did not encounter block 276; enlarge bounds rather than invent data');
  assert.ok(Object.keys(m.caps).length>0,'No physical top material sampled');
  results.push(m);
  console.log('SNOW_S0_PROVENANCE '+JSON.stringify(m));
}
const report={kind:'snowy-biome-s0-source-evidence',
  exactHead:process.env.SNOW_EXPECTED_HEAD??null,seedResults:results};
await writeFile(output+'/reader-metrics.json',JSON.stringify(report,null,2)+'\n');
console.log('SNOW_S0_PROVENANCE_COMPLETE '+JSON.stringify({seeds:results.map(r=>r.seed),
  iceSamples:results.reduce((n,r)=>n+r.glacierSites.length,0),
  uncoveredGrass:results.reduce((n,r)=>n+r.uncoveredGrass,0)}));
