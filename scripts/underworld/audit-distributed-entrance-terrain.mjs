// Geographic independent cohort — NOT the old biased first-six border scan.
// Strict real-source M7 read-only envelope checks for all five named biomes,
// three distance tiers and up to 16 deterministic candidate approaches.
// No new-world creation bypass; failed constructors remain FAILURES.
import fs from 'node:fs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,baseBlock,VoxelWorld} from '../../src/voxel.mjs';
import {selectDistributedUnderworldRegions,UNDERWORLD_DISTRIBUTED_BIOMES}
 from '../../src/living-underworld/distributed-biome-regions.mjs';
import {searchExtendedProtectedEntrances}
 from '../../src/living-underworld/entrance-candidate-search.mjs';

const seeds=[179,-17,2026,314159,8675309,13579];
const readBiome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const tally=()=>({tested:0,fourWaySafe:0,sixteenWaySafe:0,
 additionalByRadial:0,totalExamined:0});
const report={schema:'living-underworld-worldwide-protected-entrance-cohort-v1',
 provenance:'genuine original FourRegionWorld naturalAndLandmarkBlock',
 candidateGeneration:'fully detached; never carved, deployed, or registered',
 regionSelection:'2 near + 2 middle + 2 remote per biome per constructible seed',
 seeds:[],constructorFailures:[],byBiome:Object.fromEntries(
  UNDERWORLD_DISTRIBUTED_BIOMES.map(b=>[b,tally()])),
 byTier:Object.fromEntries(['near','middle','remote'].map(t=>[t,tally()])),
 realOriginalMaterialProtectionPreserved:true,
 actualPlayerPhysicsVerified:false,iPhonePWAValidated:false};
for(const seed of seeds){
 let world;
 try{world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));}
 catch(error){
  const msg=String(error.message);
  report.constructorFailures.push({seed,reason:msg});
  report.seeds.push({seed,status:'M7_CONSTRUCTOR_FAILED',reason:msg});
  continue;
 }
 const selection=selectDistributedUnderworldRegions(seed,readBiome);
 const original=new VoxelWorld(seed),ground=new Map();
 const heightAt=(x,z)=>{
  const k=x+','+z;if(ground.has(k))return ground.get(k);
  let y=19;
  for(;y>=-3;y--){
   const b=world.naturalAndLandmarkBlock(x,y,z);
   if(b===BLOCK.AIR||b===BLOCK.WOOD||b===BLOCK.LEAVES||
     b===BLOCK.CRYSTAL||b===76)continue;
   break;
  }
  ground.set(k,y);
  if(ground.size>8192)ground.delete(ground.keys().next().value);
  return y;
 };
 const rows=[];
 for(const biome of UNDERWORLD_DISTRIBUTED_BIOMES)for(const point of selection[biome]){
  const {rx,rz,tier}=point;
  const result=searchExtendedProtectedEntrances(seed,rx,rz,{
   surfaceHeightAt:heightAt,biomeAt:readBiome,requiredBiome:biome,
   protectedAt:(x,y,z)=>world.edits.has(x+','+y+','+z)||
     [BLOCK.WOOD,BLOCK.LEAVES].includes(world.naturalAndLandmarkBlock(x,y,z)),
   naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
   authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
   editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
   existingLandmarkAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==
     baseBlock(x,y,z,seed)
  });
  const firstFour=result.audited[0]?.passes===true;
  const row={seed,biome,rx,rz,tier,fourWaySafe:firstFour,
   sixteenWaySafe:result.ok,attempts:result.attempts,
   acceptedMouth:result.accepted?.proposal.mouth??null,
   acceptedDirection:result.accepted?.proposal.direction??null,
   acceptedRadialVariant:result.accepted?.proposal.radialVariant??null,
   failureStages:result.audited.flatMap(g=>g.uniqueExamined)
     .filter(x=>!x.ok).map(x=>({stage:x.stage,
       unsafe:x.unsafeMaterials??0,
       protectedOriginal:x.protectedOriginal??0,
       source:x.sourceOwned??0,edits:x.edits??0}))};
  rows.push(row);
  for(const key of [biome,tier]){
   const group=key===biome?report.byBiome[key]:report.byTier[key];
   group.tested++;group.totalExamined+=row.attempts;
   group.fourWaySafe+=Number(firstFour);
   group.sixteenWaySafe+=Number(result.ok);
   group.additionalByRadial+=Number(result.ok&&!firstFour);
  }
 }
 report.seeds.push({seed,status:'SOURCE_SURVEY_COMPLETE',rows});
}
for(const biome of UNDERWORLD_DISTRIBUTED_BIOMES){
 const g=report.byBiome[biome];
 if(g.tested!==24)throw Error('Incomplete geographically balanced '+biome+
  ' survey: '+g.tested);
 if(g.sixteenWaySafe<g.fourWaySafe)
  throw Error('Expanded protected search lost an original safe proposal');
}
if(report.constructorFailures.length>0)report.allM7SeedsAccepted=false;
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({
 schema:report.schema,byBiome:report.byBiome,byTier:report.byTier,
 constructorFailures:report.constructorFailures.map(x=>x.seed),
 newWorldCavesActuallyCarved:false
}));
