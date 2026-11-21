// Enchanted Forest Phase 0/1: exact-source, seed+coordinate read-only audit.
// No world writes, no save mutations, no rendering mockups.
// Run: node scripts/ci/enchanted-forest-phase1-audit.mjs
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {VoxelWorld,terrainHeight,baseBlock,BLOCK} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';

const SEEDS=[179,7919,-88];
const HEAD=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const pairs=[[0,-512],[512,-512],[-512,-512],[512,0],[0,512],[-512,512],[1024,-1024],[-1024,1024],[1536,-512],[-1536,-512]];
function findRegions(seed){
  const pool=[];
  for(const [x,z] of pairs)for(const dx of [-64,0,64])for(const dz of [-64,0,64]){
    const bx=x+dx,bz=z+dz,b=v6BiomeAt(bx,bz,seed);
    if(b?.name==='enchanted'&&b.weight>.96)pool.push([bx,bz]);
  }
  const selected=[];
  for(const [x,z] of pool){
    if(selected.every(([a,b])=>Math.hypot(x-a,z-b)>300))selected.push([x,z]);
    if(selected.length===2)break;
  }
  assert.ok(selected.length>=1,'No reproducible enchanted biome interior found for seed '+seed);
  return selected;
}
const evidence={schema:'mythwrought-enchanted-phase1-readonly-v1',head:HEAD,seedCount:SEEDS.length,
 seeds:SEEDS,worldGenerator:M7_ENVIRONMENT_GENERATOR,columns:0,interiorColumns:0,
 interiorGrass:0,expectedSoil:0,otherSoil:{},soilIds:{},grassWitnesses:[],seedRegions:[],
 legacyTreeInvestigations:[],repeatabilityChecks:0,invalidCanopies:0};
evidence.unexpectedSoilWitnesses=[];
const groundSet=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss]);
for(const seed of SEEDS){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const legacy=new VoxelWorld(seed);
  const regions=findRegions(seed);
  const seedResult={seed,centers:regions.map(([x,z])=>({x,z,biome:v6BiomeAt(x,z,seed)})),
    columns:0,grass:0,soilIds:{}};
  for(const [cx,cz] of regions){
    for(let z=cz-10;z<=cz+10;z++)for(let x=cx-10;x<=cx+10;x++){
      const biome=v6BiomeAt(x,z,seed);
      if(biome?.name!=='enchanted'||biome.weight<.70)continue;
      const oldTop=terrainHeight(x,z,seed);
      const plan=world._columnPlan(x,z);
      const plannedTop=plan.size?Math.max(...plan.keys()):oldTop;
      const final=world.naturalAndLandmarkBlock(x,plannedTop,z);
      evidence.columns++;evidence.interiorColumns++;seedResult.columns++;
      evidence.soilIds[final]=(evidence.soilIds[final]??0)+1;
      seedResult.soilIds[final]=(seedResult.soilIds[final]??0)+1;
      if(groundSet.has(final))evidence.expectedSoil++;
      else {
        evidence.otherSoil[final]=(evidence.otherSoil[final]??0)+1;
        if(evidence.unexpectedSoilWitnesses.length<30){
          const baselineRejections=[];
          for(let y=oldTop-2;y<=19;y++){
            const raw=legacy.naturalAndLandmarkBlock(x,y,z);
            const prior=world._environmentBaseline(x,y,z);
            const rejects=y>oldTop?prior!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior);
            if(rejects)baselineRejections.push({y,prior,raw,original:baseBlock(x,y,z,seed),cave:world.environmentCaves?.get(x,y,z)});
          }
          const district=world.liveDistrictCache.get(Math.floor(x/128)+','+Math.floor(z/128));
          evidence.unexpectedSoilWitnesses.push({seed,x,z,oldTop,plannedTop,final,biomeWeight:biome.weight,
            reasons:baselineRejections.slice(0,8),districtLandmarks:{court:district?.court?.origin,
              rotunda:district?.rotunda?.origin,twinwood:district?.twinwood?.origin,
              canopyGate:district?.canopyGate?.origin,archwood:district?.archwood?.origin,
              fallenGiant:district?.fallenGiant?.origin}});
        }
      }
      let foundGrass=false;
      for(let y=oldTop-2;y<=Math.min(oldTop+5,19);y++){
        if(world.naturalAndLandmarkBlock(x,y,z)!==BLOCK.GRASS)continue;
        foundGrass=true;
        evidence.interiorGrass++;
        seedResult.grass++;
        if(evidence.grassWitnesses.length<60){
          const legacyAbove=[];
          for(let a=oldTop+1;a<=Math.min(oldTop+9,19);a++){
            const before=legacy.naturalAndLandmarkBlock(x,a,z);
            if(before===BLOCK.WOOD||before===BLOCK.LEAVES){
              const afterMask=world._environmentBaseline(x,a,z,before);
              legacyAbove.push({y:a,original:before,masked:afterMask});
            }
          }
          evidence.grassWitnesses.push({
            seed,x,y,z,biomeWeight:biome.weight,oldTop,plannedTop,overlaySize:plan.size,
            legacyBase:baseBlock(x,y,z,seed),legacyNatural:legacy.naturalAndLandmarkBlock(x,y,z),
            environmentBaseline:world._environmentBaseline(x,y,z),
            final:world.naturalAndLandmarkBlock(x,y,z),
            savedEdit:world.edits.has(x+','+y+','+z),legacyAbove
          });
        }
      }
      if(foundGrass&&evidence.legacyTreeInvestigations.length<12){
        const district=world.liveDistrictCache.get(Math.floor(x/128)+','+Math.floor(z/128));
        const trees=(district?.trees??[]).filter(t=>
          Math.abs(t.origin[0]-x)<=10&&Math.abs(t.origin[2]-z)<=10);
        evidence.legacyTreeInvestigations.push({seed,x,z,legacyTrees:trees.map(t=>({
          origin:t.origin,variant:t.variant,blocks:t.cells.length
        }))});
      }
    }
  }
  assert.ok(seedResult.columns>0,'seed has no sampled interior');
  // Production generation is deterministic; compare a fresh, independent world.
  const again=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  for(const [x,z] of regions){
    const y=terrainHeight(x,z,seed);
    const one=world.naturalAndLandmarkBlock(x,y,z);
    const two=again.naturalAndLandmarkBlock(x,y,z);
    assert.equal(one,two,'same-seed repeatability regression');
    evidence.repeatabilityChecks++;
  }
  evidence.seedRegions.push(seedResult);
}
assert.equal(evidence.columns,evidence.interiorColumns);
assert.equal(evidence.interiorGrass,0,'Unexpected original GRASS inside sampled enchanted interior; inspect artifact witnesses');
assert.ok(evidence.expectedSoil>0,'not sampling the enchanted ground');
mkdirSync('artifacts/enchanted-forest',{recursive:true});
writeFileSync('artifacts/enchanted-forest/phase1-source-audit.json',
  JSON.stringify(evidence,null,2)+'\n');
console.log('ENCHANTED PHASE1 SOURCE AUDIT '+JSON.stringify({
  head:HEAD,seeds:evidence.seedCount,regions:evidence.seedRegions.map(x=>({seed:x.seed,centers:x.centers,columns:x.columns,grass:x.grass,soilIds:x.soilIds})),
  columns:evidence.columns,expectedSoil:evidence.expectedSoil,
  interiorGrass:evidence.interiorGrass,soilIds:evidence.soilIds,
  otherSoil:evidence.otherSoil,repeatability:evidence.repeatabilityChecks,
  grassWitnesses:evidence.grassWitnesses.slice(0,10),
  legacyTreeInvestigations:evidence.legacyTreeInvestigations.slice(0,8),
  unexpectedSoilWitnesses:evidence.unexpectedSoilWitnesses
}));
