// Read-only real M7 terrain probe, separate from the honest 20-seed baseline.
// This survey NEVER generates an entrance into a game or changes world blocks.
// Existing M7 seed constructor failures are retained in results, not bypassed.
import fs from 'node:fs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,baseBlock,VoxelWorld} from '../../src/voxel.mjs';
import {planUnderworldSurfaceEntrance}
 from '../../src/living-underworld/surface-entrance-proposal.mjs';
import {auditProtectedEntranceEnvelope} from '../../src/living-underworld/protected-entrance-envelope.mjs';
import {searchProtectedEntranceCandidates} from '../../src/living-underworld/entrance-candidate-search.mjs';
import {auditProposedSurfaceConnection}
 from '../../src/living-underworld/physical-connectivity-audit.mjs';

const seeds=[179,-17,2026,314159,8675309,13579];
const biomes=['plains','desert','snow','mountain','enchanted'];
const getBiome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const report={schema:'living-underworld-m7-surface-entrance-source-survey-v1',
 status:'READ_ONLY_STRICT_SURFACE_ENVELOPE_PROPOSALS',seeds:[],totalAccepted:0,
 byBiome:Object.fromEntries(biomes.map(x=>[x,{tested:0,accepted:0,rejected:0}])),
 constructorFailures:[],
 alternateSearch:Object.fromEntries(biomes.map(x=>[x,{tested:0,accepted:0,rejected:0,
   additionalAcceptedBeyondFirst:0,totalAttempts:0}])),
 sourceProvenanceProtectionVerified:false,
 liveGameCarvingVerified:false,actualTraversalVerified:false};
for(const seed of seeds){
 let world;
 try{world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));}
 catch(error){
  const failure={seed,reason:String(error.message)};
  report.constructorFailures.push(failure);
  report.seeds.push({seed,status:'INHERITED_M7_CONSTRUCTOR_FAILURE',reason:failure.reason});
  continue;
 }
 const selection=Object.fromEntries(biomes.map(x=>[x,[]]));
 for(let rz=-10;rz<=10;rz++)for(let rx=-10;rx<=10;rx++){
  const biome=getBiome(rx*256+128,rz*256+128,seed);
  if(selection[biome].length>=6)continue;
  selection[biome].push({rx,rz});
 }
 const seedReport={seed,status:'PROBED',biomes:{}};
 const original=new VoxelWorld(seed);
 const ground=new Map();
 const heightAt=(x,z)=>{
  const k=x+','+z;if(ground.has(k))return ground.get(k);
  let h=-100;
  for(let y=19;y>=-3;y--){
   const block=world.naturalAndLandmarkBlock(x,y,z);
   if(block===BLOCK.AIR||block===BLOCK.WOOD||block===BLOCK.LEAVES||
     block===BLOCK.CRYSTAL||block===76)continue;
   h=y;break;
  }
  ground.set(k,h);
  if(ground.size>8192)ground.delete(ground.keys().next().value);
  return h;
 };
 for(const biome of biomes){
  const outcomes=[];
  for(const {rx,rz} of selection[biome]){
   const result=planUnderworldSurfaceEntrance(seed,rx,rz,{
    surfaceHeightAt:heightAt,biomeAt:(x,z)=>getBiome(x,z,seed),requiredBiome:biome,
    protectedAt:(x,y,z)=>world.edits.has(x+','+y+','+z)||
      [BLOCK.WOOD,BLOCK.LEAVES].includes(world.naturalAndLandmarkBlock(x,y,z))
   });
   const route=result.ok?auditProposedSurfaceConnection(seed,result):null;
   const safe=result.ok&&route?.pass?auditProtectedEntranceEnvelope(result,{
    naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
    authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
    editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
    protectedAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==
      baseBlock(x,y,z,seed)
   }):null;
   const status=!result.ok?'PROPOSAL_REJECTED':!route?.pass?
    'PROPOSAL_ROUTE_DISCONTINUITY':safe?.ok?
    'SOURCE_ENVELOPE_SAFETY_CANDIDATE':'SOURCE_ENVELOPE_REJECTED';
   const alternate=searchProtectedEntranceCandidates(seed,rx,rz,{
    surfaceHeightAt:heightAt,
    biomeAt:(x,z)=>getBiome(x,z,seed),
    requiredBiome:biome,
    protectedAt:(x,y,z)=>world.edits.has(x+','+y+','+z)||
      [BLOCK.WOOD,BLOCK.LEAVES].includes(world.naturalAndLandmarkBlock(x,y,z)),
    naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
    authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
    editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
    existingLandmarkAt:(x,y,z)=>
      original.naturalAndLandmarkBlock(x,y,z)!==baseBlock(x,y,z,seed)
   });
   const a=report.alternateSearch[biome];
   a.tested++;a.totalAttempts+=alternate.tested;
   if(alternate.ok){a.accepted++;if(status!=='SOURCE_ENVELOPE_SAFETY_CANDIDATE')
    a.additionalAcceptedBeyondFirst++;}
   else a.rejected++;
   outcomes.push({rx,rz,status,biome:result.biome??biome,
    alternateSearch:{ok:alternate.ok,tested:alternate.tested,
     acceptedDirection:alternate.accepted?.proposal.direction??null,
     acceptedMouth:alternate.accepted?.proposal.mouth??null,
     reasons:alternate.examined.map(e=>({stage:e.stage,reason:e.reason,
      unsafeMaterials:e.unsafeMaterials,protectedOriginal:e.protectedOriginal,
      sourceOwned:e.sourceOwned,edits:e.edits}))},
    mouth:result.mouth??null,reasons:result.rejectionHistory??[],
    routeFailure:route?.failures??[],envelope:safe?{
     ok:safe.ok,checkedCells:safe.checkedCells,reason:safe.reason,
     sourceOwned:safe.sourceOwned,edits:safe.edits,
     protectedOriginal:safe.protectedOriginal,unsafeMaterials:safe.unsafeMaterials,
     examples:safe.examples}:null});
   const totals=report.byBiome[biome];totals.tested++;
   if(status==='SOURCE_ENVELOPE_SAFETY_CANDIDATE'){totals.accepted++;report.totalAccepted++;}
   else totals.rejected++;
  }
  seedReport.biomes[biome]=outcomes;
 }
 report.seeds.push(seedReport);
}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,byBiome:report.byBiome,
 failures:report.constructorFailures,totalAccepted:report.totalAccepted,
 alternateSearch:report.alternateSearch}));
if(biomes.some(name=>report.byBiome[name].tested<6))
 throw Error('Incomplete five-biome real-source entrance survey');
