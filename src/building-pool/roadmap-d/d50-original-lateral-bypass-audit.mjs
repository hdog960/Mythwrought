// D50 source-authentic, uninstalled three-stage lateral bypass audit.
// No earlier broad test suite imported, no original owner/source edits.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD45FractionalExteriorDogleg} from './d45-source-blocker-and-face-egress.mjs';
import {deriveD47UnregisteredCongruentSaddle} from './d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch,inspectD48ExactConvexSourceAndOwnerHits} from './d48-original-saddle-patches-and-bridge.mjs';
import {inspectD50DoglegSlopedPlaneSeparation,deriveD50ThreeStageLateralCandidate,
 inspectD50SourceAndSocketContinuity,sampleD50OriginalPaletteMeshRay} from './d50-lateral-three-stage-connector.mjs';
const roles=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>roles.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
/** 128 original roots, 2 real D45 courses, 2 lateral bypass signs and
 * 2 genuine target dogleg volumes = 1024 source-authentic 3-stage proposals.
 * Each stage is a complete convex swept triangle, not ray/centerline sampling. */
export function auditD50AuthenticOriginalThreeStageBuilding(b,primary,secondary,d25,{maxRaySamples=1}={}){
 if(!Number.isSafeInteger(maxRaySamples)||maxRaySamples<0||maxRaySamples>3)
  throw RangeError('D50 narrow original-source ray budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||pack2Asset(61)?.roster!==15||
  pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D50 original Pack2 ID61/62 ownership or geometry changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
   !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
   d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D50 original protected Y7 roof/WALK/uncertified source lost');
 const total={bays:0,roots:0,tensileRoots:0,socketsSourceClear:0,
  patchProposals:0,sourceClearPatches:0,rootsWithSourceClearPatch:0,
  originalDoglegsY5Clear:0,originalDoglegsY6Clear:0,
  firstDoglegEntirelyBehindFace:0,secondDoglegEntirelyBehindFace:0,
  candidates:0,candidatesY5:0,candidatesY6:0,positiveCapContacts:0,
  firstStagesOutward:0,secondStagesOutward:0,thirdStagesOutward:0,
  firstSecondStageSelfOverlap:0,secondThirdStageSelfOverlap:0,firstThirdStageSelfOverlap:0,
  actualSocketIntrusions:0,authoredSolidHits:0,authoredWALKHits:0,otherMemberHits:0,
  firstDoglegOverlaps:0,secondDoglegOverlaps:0,fullyPhysicalGeometryCandidates:0,
  rootsWithOnePhysicalCandidate:0,raySamples:0,maxRayDelta:0,
  registeredFasteners:0,foundationRatings:0,sourceWrites:0};
 const failures=[],perRoot=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
    !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D50 unaltered original W16/17 rooted bearer corridor absent');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),plane=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(plane==='x'?n.x:0),n.y,sz+.5+(plane==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),plane,beam.boxes)}));
  let rootCount=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,plane,src,{rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)throw Error('D50 authentic unmodified rooted split web absent');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,selected.geometry),
    tensile=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
      !(tensile.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||tensile.constructionAllowed!==false)
    throw Error('D50 source-clear actual D36 rooted positive tensile path not preserved');
   const nearby=members.filter(m=>m.member.memberId!==member.memberId&&
     m.shape.bounds.min.every((v,i)=>v<socket.bounds.max[i]+2&&m.shape.bounds.max[i]>socket.bounds.min[i]-2)).map(m=>m.shape),
    saddle=deriveD47UnregisteredCongruentSaddle(socket,selected.side,palette);
   let patch=null;
   for(const variant of ['center','corner0','corner1','corner2']){
    const candidate=deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette),
     physical=inspectD48ExactConvexSourceAndOwnerHits(candidate,src,wall,{otherOwners:nearby});
    total.patchProposals++;if(physical.sourceAndOwnerClear){total.sourceClearPatches++;if(!patch)patch=candidate;}
   }
   if(!patch)throw Error('D50 missing D48 128-root source-clear positive face patch');
   total.roots++;total.tensileRoots++;total.socketsSourceClear++;total.rootsWithSourceClearPatch++;rootCount++;
   let rootFull=false,rootCourses=0;
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,{side:selected.side,height}),
     separator=inspectD50DoglegSlopedPlaneSeparation(patch,dog);
    if(!dog.allPhysicalVolumesClear)throw Error('D50 original D45 selected side dogleg no longer source clear');
    total.firstDoglegEntirelyBehindFace+=Number(separator.bySweptPrism[0].maxSignedDistance<0);
    total.secondDoglegEntirelyBehindFace+=Number(separator.bySweptPrism[1].maxSignedDistance<0);
    if(height===5)total.originalDoglegsY5Clear++;else total.originalDoglegsY6Clear++;
    for(const lateralSign of [-1,1])for(const targetIndex of [0,2]){
     const c=deriveD50ThreeStageLateralCandidate(patch,dog,palette,{normalLength:.16,lateralReach:.48,lateralSign,targetIndex}),
      proof=inspectD50SourceAndSocketContinuity(c,patch,dog,socket,src,wall,{otherOwners:nearby});
     rootCourses++;total.candidates++;if(height===5)total.candidatesY5++;else total.candidatesY6++;
     total.positiveCapContacts+=Number(proof.positiveAreaAuthenticSocketCap>.008&&proof.positiveAreaElbowEndcaps===2);
     total.firstStagesOutward+=Number(c.signedFaceNormalTravel[0]>0);
     total.secondStagesOutward+=Number(c.signedFaceNormalTravel[1]>0);
     total.thirdStagesOutward+=Number(c.signedFaceNormalTravel[2]>0);
     total.firstSecondStageSelfOverlap+=Number(c.selfOverlaps[0]);
     total.secondThirdStageSelfOverlap+=Number(c.selfOverlaps[1]);
     total.firstThirdStageSelfOverlap+=Number(c.selfOverlaps[2]);
     total.actualSocketIntrusions+=proof.existingSocket;
     total.authoredSolidHits+=proof.authoredSolid;total.authoredWALKHits+=proof.authoredWalk;
     total.otherMemberHits+=proof.otherProposedMembers;
     total.firstDoglegOverlaps+=Number(proof.doglegPhysicalOverlap[0]);
     total.secondDoglegOverlaps+=Number(proof.doglegPhysicalOverlap[1]);
     if(proof.physicalGeometryCandidateClear){total.fullyPhysicalGeometryCandidates++;rootFull=true;}
     if(failures.length<14)failures.push({wall:[...wall],plane,height,lateralSign,targetIndex,
      signedNormalTravel:c.signedFaceNormalTravel,stageOverlap:c.selfOverlaps,
      socketHits:proof.existingSocket,source:proof.authoredSolid,member:proof.otherProposedMembers,
      dogVolumeOverlap:proof.doglegPhysicalOverlap,sourceBlocker:proof.sourceBlockerExamples[0]??null});
     if(total.raySamples<maxRaySamples){const ray=sampleD50OriginalPaletteMeshRay(c);
      total.raySamples++;total.maxRayDelta=Math.max(total.maxRayDelta,ray.maxRayDelta);}
     if(proof.constructionAllowed!==false||proof.ownerApprovedConnection!==false||
       proof.registeredBlockId!==null||proof.realTerrainAndCaveFootingAuthenticated!==false||
       proof.productionPlayerNPCWebGLAndPwaTested!==false)
      throw Error('D50 source-only geometry forged authorization or gameplay acceptance');
    }
   }
   if(rootCourses!==8)throw Error('D50 only 8 original three-stage paths per root');
   total.rootsWithOnePhysicalCandidate+=Number(rootFull);
   perRoot.push({wall:[...wall],plane,candidates:rootCourses,rootFull,originalSlopedPatchClear:true});
  }
  if(rootCount!==2)throw Error('D50 2 original rooted diagonals per long span absent');
  total.bays++;
 }
 if(total.roots!==total.bays*2||total.candidates!==total.roots*8||
   total.patchProposals!==total.roots*4||total.rootsWithSourceClearPatch!==total.roots||
   total.originalDoglegsY5Clear!==total.roots||total.originalDoglegsY6Clear!==total.roots||
   b.cells.length!==snapshot[0]||b.navigation.length!==snapshot[1]||b.cells[0]!==snapshot[2]||
   b.cells.at(-1)!==snapshot[3]||b.navigation[0]!==snapshot[4])
  throw Error('D50 original source W16/W17 conservation/ledger failure');
 return Object.freeze({format:'mythwrought.d50.authentic-original-uninstalled-three-stage-census.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,uncertifiedFarRoof:d29.originalFarZoneCellsStillUncertified,
  uncertifiedZones:d29.originalFarZones,...total,firstFailures:failures,perRoot,
  noOriginalWorldOrSaveMutation:true,uninstalledOwnerAndOriginalPack2Unchanged:true,
  weatherAndNavigationSourcePreserved:true,noApprovedTensileConnectionOrGroundFooting:true,
  actualWebGL2PlayerAndInstalledPwaUntested:true,constructionAllowed:false});
}
