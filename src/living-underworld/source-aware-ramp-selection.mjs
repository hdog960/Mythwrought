// Conservative bounded source-aware pedestrian connector selection.
// The first candidate satisfying ALL original geology ownership, independently
// walkable grade AND combined route support/headroom is a dry-run proposal.
// This changes no historical M7 cave authoring or actual terrain.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {planDetachedPedestrianSwitchback}
 from './pedestrian-switchback.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
import {auditCaveCenterline}
 from './physical-connectivity-audit.mjs';
import {proposedSurfaceAirAt}
 from './surface-entrance-proposal.mjs';
import {auditCombinedStairFootprints}
 from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs}
 from './protected-subsurface-stairs.mjs';
const INT=Number.isSafeInteger;
const xyz=(p,q)=>p&&q&&p.x===q.x&&p.y===q.y&&p.z===q.z;
const SOURCE_KEYS=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const RADII=Object.freeze([14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44]);
const FLATS=Object.freeze([6,8,10,4]);
export function selectSourceProtectedInterlevelRamps(seed,rx,rz,{
 source=null,entranceProposal=null,includeSocket=false,
 maxCandidatesPerLink=64,maxCells=20000,maxSourceChecks=30000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !(source===null||(typeof source==='object'&&
    SOURCE_KEYS.every(k=>typeof source[k]==='function')))||
  !(entranceProposal===null||(entranceProposal.ok===true&&
    Array.isArray(entranceProposal.segments)))||
  typeof includeSocket!=='boolean'||!INT(maxCandidatesPerLink)||
  maxCandidatesPerLink<4||maxCandidatesPerLink>256||
  !INT(maxCells)||maxCells<100||maxCells>20000||
  !INT(maxSourceChecks)||maxSourceChecks<1000||maxSourceChecks>200000)
  throw TypeError('Invalid source-safe linked ramp selection');
 const region=planUnderworldRegion(seed,rx,rz);
 if(entranceProposal&&(entranceProposal.seed!==seed||
  entranceProposal.rx!==rx||entranceProposal.rz!==rz||
  !xyz(entranceProposal.start,region.layers[0].hub)))
  return Object.freeze({ok:false,reason:'ENTRANCE_REGION_OR_HUB_MISMATCH',
   inspected:0,approvedLinkCount:0,noWorldEdits:true});
 const proposed=entranceProposal?[entranceProposal]:[];
 const results=[],ids=includeSocket?[16,25,34,35]:[16,25,34];
 let totalCandidates=0,sourceCellsChecked=0,sourceRejected=0;
 let geometryRejected=0,crossRouteRejected=0,boundsRejected=0;
 const readers=source?{
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,protectedAt:source.protectedAt,
  maxCells,minY:-210,maxY:19,stopOnFirstUnsafe:true
 }:null;
 for(const index of ids){
  let accepted=null,examined=0,lastRefusal=null;
  const rejectedCounts={unsafeMaterial:0,authored:0,edited:0,
   protected:0,authoredAirSupport:0,existingAirSupport:0,
   sourceInconsistency:0,bounds:0};
  outer:for(const radius of RADII)for(const cornerFlat of FLATS){
   if(radius<cornerFlat+5)continue;
   for(let quarterTurns=0;quarterTurns<4;quarterTurns++){
    if(examined>=maxCandidatesPerLink)break outer;
    examined++;totalCandidates++;
    const proposal=planDetachedPedestrianSwitchback(seed,rx,rz,index,{
     radius,cornerFlat,quarterTurns
    });
    const grade=auditSupportedEntranceStairs(proposal,{maxCells:20000});
    if(!grade.ok){geometryRejected++;lastRefusal='STAIR_GEOMETRY';continue;}
    const inside=proposal.segments.every(({a,b})=>
     [a,b].every(p=>
      Math.floor(p.x/UNDERWORLD_REGION_SIDE)===rx&&
      Math.floor(p.z/UNDERWORLD_REGION_SIDE)===rz&&
      p.y>=-210&&p.y<=-4));
    if(!inside){boundsRejected++;lastRefusal='REGION_BOUNDARY';continue;}
    if(index!==35){
     const layer=[16,25,34].indexOf(index);
     if(!xyz(proposal.from,region.layers[layer].hub)||
        !xyz(proposal.to,region.layers[layer+1].hub)){
      boundsRejected++;lastRefusal='HUB_MISMATCH';continue;
     }
    }
    // An approved grade alone does not prove that the planned voxel AIR
    // has real six-face connection between every consecutive ramp segment.
    const futureAir=(x,y,z)=>proposedSurfaceAirAt(proposal,x,y,z);
    const airConnected=proposal.segments.every(({a,b})=>
     auditCaveCenterline(a,b,futureAir).ok);
    if(!airConnected){geometryRejected++;
     lastRefusal='CANDIDATE_VOXEL_AIR_DISCONNECTED';continue;}
    const network=auditCombinedStairFootprints([...proposed,proposal],{
     maxCells:50000
    });
    if(!network.ok){crossRouteRejected++;
     lastRefusal=network.reason;continue;}
    let safety=null;
    if(readers){
     safety=auditProtectedSubsurfaceStairs(proposal,readers);
     sourceCellsChecked+=safety.sourceChecks??0;
     if(sourceCellsChecked>maxSourceChecks){
      lastRefusal='SOURCE_AUDIT_WORK_BUDGET';break outer;
     }
     if(!safety.ok){sourceRejected++;
      for(const name of Object.keys(rejectedCounts))
       rejectedCounts[name]+=safety.counts?.[name]??0;
      lastRefusal=safety.reason;continue;}
    }
    accepted=Object.freeze({index,radius,cornerFlat,quarterTurns,
     supportCells:grade.supportCells,
     clearanceCells:grade.clearanceCells,
     sourceSafe:safety?.ok===true,
     sourceCellsChecked:safety?.sourceChecks??0,
     sourceConflictCount:safety?.ok?0:null,
     independentlyWalkableGeometry:true,
     candidateSixFaceVoxelAirContinuous:true,
     nonblockingRelativeToPreviousRoutes:true,
     proposal,stepsActuallyPlaced:false});
    proposed.push(proposal);break outer;
   }
  }
  results.push(Object.freeze({index,examined,ok:!!accepted,
   rejectedCounts:Object.freeze(rejectedCounts),
   selected:accepted,reason:accepted?null:
    lastRefusal??'NO_NONBLOCKING_CANDIDATE'}));
  if(!accepted)return Object.freeze({
   ok:false,seed,rx,rz,reason:'NO_SOURCE_SAFE_NONBLOCKING_RAMP',
   failedIndex:index,refusal:lastRefusal,
   inspected:totalCandidates,sourceCellsChecked,maxSourceChecks,
   sourceRejected,geometryRejected,crossRouteRejected,boundsRejected,
   approvedLinkCount:results.filter(x=>x.ok).length,
   links:Object.freeze(results),
   completeNetworkCollisionFree:false,
   genuineM7SourceVerified:false,
   noWorldEdits:true,stepsActuallyPlaced:false
  });
 }
 const combined=auditCombinedStairFootprints(proposed,{maxCells:50000});
 if(!combined.ok)throw Error('Combined ramp selection lost source-safe geometry');
 return Object.freeze({ok:true,seed,rx,rz,
  inspected:totalCandidates,
  sourceCellsChecked,maxSourceChecks,sourceRejected,geometryRejected,crossRouteRejected,boundsRejected,
  approvedLinkCount:ids.length,
  links:Object.freeze(results),
  combined,
  distinctProposedSupportCells:combined.distinctSupportCells,
  sumProposedSupportCells:results.reduce((n,r)=>n+r.selected.supportCells,0),
  previousEntranceIncluded:!!entranceProposal,
  initialEntranceSourceProvenanceVerifiedByCaller:false,
  linkSourceOwnershipChecked:!!readers,
  completeNetworkCollisionFree:true,
  allSelectedCandidateVoxelAirFaceConnected:true,
  genuineM7SourceVerified:false,
  noWorldEdits:true,stepsActuallyPlaced:false,
  playerPhysicsUnverified:true,iphoneGPUUnverified:true
 });
}
