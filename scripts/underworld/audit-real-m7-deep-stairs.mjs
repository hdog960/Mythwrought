// Read-only, source-authentic legacy M7 deep ramp provenance census.
// A refused old M7 source cell is preserved, NOT deleted, moved or bypassed.
// This is research only: never author a cave or stair in the existing world.
import fs from 'node:fs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock} from '../../src/voxel.mjs';
import {optimizeDetachedPedestrianSwitchback,
 planDetachedPedestrianSwitchback}
 from '../../src/living-underworld/pedestrian-switchback.mjs';
import {auditProtectedSubsurfaceStairs}
 from '../../src/living-underworld/protected-subsurface-stairs.mjs';

const seeds=[179,-17,2026,314159],regions=[[0,0],[-7,13]],
 indices=[16,25,34,35],rows=[],failures=[];
for(const seed of seeds){
 let world;
 try{world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));}
 catch(error){
  failures.push({seed,reason:String(error.message)});
  continue;
 }
 const original=new VoxelWorld(seed);
 for(const [rx,rz] of regions)for(const index of indices){
  const chosen=optimizeDetachedPedestrianSwitchback(seed,rx,rz,index);
  const plan=planDetachedPedestrianSwitchback(seed,rx,rz,index,{
   radius:chosen.selectedRadius,cornerFlat:chosen.selectedCornerFlat});
  const audit=auditProtectedSubsurfaceStairs(plan,{
   naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
   authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
   editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
   protectedAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==
    baseBlock(x,y,z,seed),
   maxCells:20000
  });
  rows.push({
   seed,rx,rz,index,protectedSourceSafeCandidate:audit.ok,
   reason:audit.reason??null,
   sourceChecks:audit.sourceChecks??0,
   counts:audit.counts??null,
   examples:audit.examples??[],
   savedSupportCells:chosen.savedProposedSupportCells,
   socketStopsBeforeLegacySurface:index===35&&plan.to.y===-7,
   sourceEdited:false,stairsPlaced:false
  });
 }
}
const count={total:rows.length,sourceProtected:rows.filter(r=>r.protectedSourceSafeCandidate).length,
 sourceRejected:rows.filter(r=>!r.protectedSourceSafeCandidate).length,
 failures:failures.length,
 authorshipConflicts:rows.reduce((n,r)=>n+(r.counts?.authored??0),0),
 protectedLandmarkConflicts:rows.reduce((n,r)=>n+(r.counts?.protected??0),0),
 oreOrUnsafeMaterial:rows.reduce((n,r)=>n+(r.counts?.unsafeMaterial??0),0),
 playerEdits:rows.reduce((n,r)=>n+(r.counts?.edited??0),0),
 authoredAIRSupportRejected:rows.reduce((n,r)=>n+(r.counts?.authoredAirSupport??0),0),
 oldNaturalCaveAIRSupportRejected:rows.reduce((n,r)=>n+(r.counts?.existingAirSupport??0),0),
 inconsistentOriginalSourceRejected:rows.reduce((n,r)=>n+(r.counts?.sourceInconsistency??0),0)};
if(rows.length!==32||failures.length>0)
 throw Error('Invalid genuine-source old-M7 underground survey cohort');
const report={
 schema:'living-underworld-original-m7-deep-ramp-provenance-v1',
 authenticOldWorldSourceCallbacks:true,
 oldM7GeneratorModified:false,oldWorldEditsWritten:false,
 originalProtectionBypassed:false,
 successfulPrototypeApprovalNotEquivalentToPlayability:true,
 dryRunOnly:true,notARealInGameRamp:true,
 count,rows,constructorFailures:failures};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({schema:report.schema,count,
 noOriginalWorldEdited:true,noActualStepsPlaced:true}));
