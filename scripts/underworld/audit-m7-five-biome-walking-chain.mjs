// Genuine original M7, READ-ONLY five-biome full walking-chain study.
// Five coordinates were independently authenticated in the parent exact-head
// SHA256-verified 120-site/64-route M7 source artifact; NOT invented sites.
// No full 120-region rerun, no save writes, no production registration.
import fs from 'node:fs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt}
 from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {VoxelWorld,BLOCK,baseBlock}
 from '../../src/voxel.mjs';
import {searchWideProtectedEntrances}
 from '../../src/living-underworld/entrance-candidate-search.mjs';
import {auditProtectedUnderworldWalkingChain}
 from '../../src/living-underworld/protected-walking-chain.mjs';

// Authentic parent-head successful original-M7 sites, one per biome.
// Dataset artifact #14733859064, checked-out HEAD f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0.
const sites=Object.freeze([
 Object.freeze({seed:179,biome:'plains',rx:-9,rz:0,mouth:{x:-2149,y:5,z:181}}),
 Object.freeze({seed:179,biome:'desert',rx:-3,rz:-9,mouth:{x:-547,y:4,z:-2150}}),
 Object.freeze({seed:179,biome:'snow',rx:-6,rz:3,mouth:{x:-1428,y:6,z:785}}),
 Object.freeze({seed:179,biome:'mountain',rx:6,rz:9,mouth:{x:1669,y:6,z:2346}}),
 Object.freeze({seed:179,biome:'enchanted',rx:-9,rz:-6,mouth:{x:-2182,y:7,z:-1463}})
]);
const seed=179,world=new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const original=new VoxelWorld(seed),ground=new Map();
const heightAt=(x,z)=>{
 const key=x+','+z;
 if(ground.has(key))return ground.get(key);
 let y=19;
 for(;y>=-3;y--){
  const block=world.naturalAndLandmarkBlock(x,y,z);
  if(block===BLOCK.AIR||block===BLOCK.WOOD||
   block===BLOCK.LEAVES||block===BLOCK.CRYSTAL||block===76)continue;
  break;
 }
 ground.set(key,y);
 if(ground.size>8192)ground.delete(ground.keys().next().value);
 return y;
};
const biomeAt=(x,z)=>v6BiomeAt(x,z,seed)?.name??'plains';
const source=Object.freeze({
 naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
 authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
 editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
 protectedAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==
  baseBlock(x,y,z,seed)
});
const rows=[];
for(const site of sites){
 const result=searchWideProtectedEntrances(seed,site.rx,site.rz,{
  surfaceHeightAt:heightAt,biomeAt,requiredBiome:site.biome,
  protectedAt:(x,y,z)=>source.editedAt(x,y,z)||
   [BLOCK.WOOD,BLOCK.LEAVES].includes(source.naturalAt(x,y,z)),
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,existingLandmarkAt:source.protectedAt
 });
 const actual=result.accepted?.proposal?.mouth;
 if(result.ok!==true||!actual||
  ['x','y','z'].some(k=>actual[k]!==site.mouth[k]))
  throw Error('Authentic prior M7 safe-mouth evidence has drifted: '+
   JSON.stringify({site,actual,ok:result.ok}));
 const full=auditProtectedUnderworldWalkingChain(seed,site.rx,site.rz,{
  entrance:result,source});
 rows.push({biome:site.biome,seed,rx:site.rx,rz:site.rz,
  originalM7SafeSurfaceMouth:true,
  acceptedMouth:actual,
  oldM7FullRouteCandidateSafe:full.ok,
  mutuallyNonblockingStairs:full.combinedNetworkSupportAndHeadroomSafe,
  proposedRampVoxelAirFaceConnected:full.combinedSelectedRampAirFaceConnected,
  sourceCheckedFullCorridorCount:full.sourceProtectedRoutes,
  reason:full.reason,
  safeRouteComponents:full.sourceProtectedRoutes,
  routeComponents:full.routeCount,
  strictOldWorldSourceCellsExamined:full.originalM7SourceChecks,
  deepLinks:full.connectors?.map(c=>({
   index:c.index,sourceSafe:c.sourceSafe,reason:c.reason,
   authenticatedCallbacksChecked:c.originalM7SourceVisited,
   authoredAirSupportRejected:c.rejectsAuthoredCaveAir,
   existingAirSupportRejected:c.rejectsExistingCaveAir,
   originalAuthoringRejected:c.rejectsOldAuthored,
   oldLandmarksRejected:c.rejectsLandmarks,
   unsafeOreAndMaterialRejected:c.rejectsOreOrUnsafe
  }))??[],
  livePlayerWalkable:false,
  originalWorldEdited:false});
}
if(rows.length!==5)throw Error('Incomplete five-biome source-safe route sample');
const summary={originalSafeMouths:rows.length,
 fullFourComponentCandidateSourceSafe:rows.filter(r=>r.oldM7FullRouteCandidateSafe).length,
 sourceRejected:rows.filter(r=>!r.oldM7FullRouteCandidateSafe).length,
 sourceCellsChecked:rows.reduce((n,r)=>n+r.strictOldWorldSourceCellsExamined,0)};
const report={schema:'living-underworld-authentic-5-biome-full-stair-chain-v1',
 exactHistoricalSourceArtifactId:14733859064,
 historicalArtifactExactHead:'f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0',
 trueOriginalM7ReadOnly:true,sourceScope:'five historical verified safe mouths',
 summary,rows,
 noExistingWorldEdits:true,noStairBlocksPlaced:true,
 noReleaseApproval:true,iPhonePhysicsNotMeasured:true,
 allOriginalAuthoredCaveAirPreserved:true};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({schema:report.schema,summary,
 realOldWorldNotEdited:true}));
