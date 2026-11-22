// Source-exact S2 proposal census, no in-game writes or activation.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {proposedSnowS2Cap} from '../../src/manual-biomes/snowy-s2-cap-candidate.mjs';
import {BLOCK,terrainHeight} from '../../src/voxel.mjs';
const records=[];
for(const seed of [179,2026]){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const before=JSON.stringify(world.save()),row={seed,sampled:0,grass:0,
    proposed:0,skippedProtected:0,rejectedReasons:{},
    rejectionExamples:[],examples:[],protectedAirWitnesses:0};
  for(let x=-160;x<=160;x+=8)for(let z=352;z<=672;z+=8){
    row.sampled++;
    const old=terrainHeight(x,z,seed),b=world.get(x,old,z);
    if(b===BLOCK.GRASS){row.grass++;}
    const plan=proposedSnowS2Cap(world,x,z);
    if(plan){
      row.proposed++;
      assert.equal(plan.y,old);
      assert.equal(b,BLOCK.GRASS);
      assert.ok(world.get(x,old-1,z)!==BLOCK.AIR);
      if(world._environmentBaseline(x,old-2,z)===BLOCK.AIR)
        row.protectedAirWitnesses++;
      if(row.examples.length<16)row.examples.push([x,old,z]);
    }else if(b===BLOCK.GRASS){
      row.skippedProtected++;
      const baseline=world._environmentBaseline(x,old,z);
      const support=world._environmentBaseline(x,old-1,z);
      let blockAbove=null;
      for(let y=old+1;y<=19;y++){
        const above=world._environmentBaseline(x,y,z);
        if(above!==BLOCK.AIR||world.get(x,y,z)!==BLOCK.AIR){
          blockAbove={id:above,y};break;
        }
      }
      const reason=world.edits.has(x+','+old+','+z)?'edit':
        baseline!==BLOCK.GRASS?'not-natural-grass':
        blockAbove?'protected-above-'+blockAbove.id:
        ![BLOCK.DIRT,BLOCK.STONE,BLOCK.GRASS].includes(support)?'unsupported-subsoil-'+support:
        world.get(x,old-1,z)!==support?'subsoil-not-source-equal':
        world.environmentCaves?.get(x,old,z)!==undefined?'cave-at-cap':
        world._columnPlan(x,z).size!==0?'prior-environment-plan':
        'needs-further-source-review';
      row.rejectedReasons[reason]=(row.rejectedReasons[reason]??0)+1;
      if(row.rejectionExamples.length<24)
        row.rejectionExamples.push({at:[x,old,z],reason,blockAbove,support});
    }
  }
  assert.ok(row.proposed>0,'Source survey has no safely supported grass caps');
  assert.equal(Object.values(row.rejectedReasons).reduce((a,b)=>a+b,0),
    row.skippedProtected,'Every rejected grass cell needs auditable provenance');
  assert.equal(JSON.stringify(world.save()),before,'Real M7 save cannot mutate');
  assert.equal(row.grass,row.proposed+row.skippedProtected);
  records.push(row);console.log('SNOW_S2_REAL_CAP_CENSUS '+JSON.stringify(row));
}
await writeFile('artifacts/snowy-s0-provenance/snow-s2-cap-census.json',
  JSON.stringify({head:process.env.SNOW_EXPECTED_HEAD??null,
    state:'detached-only-no-M7-profile-update',records},null,2)+'\n');
