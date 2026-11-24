// D49 original W16/W17 only. No D48 broad suite replay or world mutation.
// A physical 2-stage connector preview is not a load-bearing tensile fastener.
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
import {deriveD48UnregisteredSlopedContactPatch,inspectD48ExactConvexSourceAndOwnerHits}
 from './d48-original-saddle-patches-and-bridge.mjs';
import {deriveD49NormalDepartureAndElbow,inspectD49FullVolumeConnection,sampleD49StageTriangleRay}
 from './d49-two-stage-normal-elbow.mjs';
const rootRoles=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>rootRoles.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
/** Genuine original root census: every root with D48 positive-area clear patch,
 * both original dogleg courses, four fixed outward lengths, all actual SAT
 * volumes and real original authored blockers. Source/color/roof/WALK immutable.
 */
export function auditD49OriginalNormalElbowBuilding(b,primary,secondary,d25,{maxRaySamples=1}={}){
 if(!Number.isSafeInteger(maxRaySamples)||maxRaySamples<0||maxRaySamples>3)throw TypeError('D49 bounded original ray sampling');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||pack2Asset(61)?.roster!==15||
  pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D49 immutable original Pack2 source owner shape/ID contract');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
  !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
  d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D49 original W16/17 Y7 roof and WALK preservation gate');
 const total={bays:0,roots:0,positiveTension:0,originalD36SourceClear:0,
  slopedSubpatchesTested:0,sourceClearSubpatches:0,rootsWithClearSubpatch:0,
  sourceClearDogsY5:0,sourceClearDogsY6:0,
  candidates:0,candidatesY5:0,candidatesY6:0,positiveAreaEndcaps:0,
  sourceSolidHitEvents:0,authoredWalkHitEvents:0,nearbyMemberHitEvents:0,
  socketPositiveVolumeIntrusions:0,stageSelfOverlapEvents:0,
  trulyOutwardFirstStages:0,elbowContinuesOutward:0,
  actualDoglegPositiveVolumeOverlap:0,fullyPhysicalGeometricCandidates:0,
  rootsWithAnyFullyGeometricCandidate:0,
  rayStageSamples:0,maximumMeshRayDelta:0,
  approvedTensileFasteners:0,authenticatedFoundations:0,sourceWorldWrites:0};
 const witnesses=[], perRoot=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
   !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D49 original source rooted Y5/Y6/Y7 WALK/roof identity lost');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),plane=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(plane==='x'?n.x:0),n.y,sz+.5+(plane==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),plane,beam.boxes)}));
  let bayRoots=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,plane,src,{rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)throw Error('D49 unchanged genuine split original ID61 rooted web missing');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,selected.geometry),
    tensile=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
     !(tensile.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||tensile.constructionAllowed!==false)
    throw Error('D49 original D36 source clear, rooted normalized positive tension required');
   const nearby=members.filter(m=>m.member.memberId!==member.memberId&&
     m.shape.bounds.min.every((v,i)=>v<socket.bounds.max[i]+2&&m.shape.bounds.max[i]>socket.bounds.min[i]-2))
     .map(m=>m.shape);
   const saddle=deriveD47UnregisteredCongruentSaddle(socket,selected.side,palette);
   let chosen=null;
   for(const variant of ['center','corner0','corner1','corner2']){
    const patch=deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette),
     original=inspectD48ExactConvexSourceAndOwnerHits(patch,src,wall,{otherOwners:nearby});
    total.slopedSubpatchesTested++;
    if(original.sourceAndOwnerClear){total.sourceClearSubpatches++;if(!chosen)chosen=patch;}
   }
   if(!chosen)throw Error('D49 D48 authenticated all 128 roots with at least one source-clear sloped patch');
   bayRoots++;total.roots++;total.positiveTension++;total.originalD36SourceClear++;total.rootsWithClearSubpatch++;
   let rootAny=false, rootC=0;
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,{side:selected.side,height});
    if(!dog.allPhysicalVolumesClear)throw Error('D49 D46 genuine selected-side dogleg source clearance regression');
    if(height===5)total.sourceClearDogsY5++;else total.sourceClearDogsY6++;
    for(const normalLength of [.08,.16,.32,.48]){
     const elbow=deriveD49NormalDepartureAndElbow(chosen,dog,palette,{normalLength}),
      proof=inspectD49FullVolumeConnection(elbow,chosen,dog,socket,src,wall,{otherOwners:nearby});
     rootC++;total.candidates++;if(height===5)total.candidatesY5++;else total.candidatesY6++;
     total.positiveAreaEndcaps+=Number(proof.positiveAreaStageToStageEndcap>.008);
     total.sourceSolidHitEvents+=proof.solid;total.authoredWalkHitEvents+=proof.walk;
     total.nearbyMemberHitEvents+=proof.otherMember;total.socketPositiveVolumeIntrusions+=proof.socket;
     total.stageSelfOverlapEvents+=Number(!proof.noStageSelfOverlap);
     total.trulyOutwardFirstStages+=Number(proof.outwardNormalDepartureValid);
     total.elbowContinuesOutward+=Number(proof.secondElbowContinuesOutward);
     total.actualDoglegPositiveVolumeOverlap+=Number(proof.fullPhysicalDoglegPositiveVolumeOverlap);
     if(proof.physicalGeometryCandidateClear){total.fullyPhysicalGeometricCandidates++;rootAny=true;}
     if(witnesses.length<16&&(proof.socket||proof.solid||!proof.secondElbowContinuesOutward))
      witnesses.push({wall:[...wall],plane,height,normalLength,stageHits:proof.stages,
       sourceFirst:proof.solidCoordinates[0]??null,outwardElbow:proof.secondElbowContinuesOutward,
       geometricAccept:proof.physicalGeometryCandidateClear,constructionAllowed:false});
     if(total.rayStageSamples<maxRaySamples){
      const ray=sampleD49StageTriangleRay(elbow);total.rayStageSamples++;
      total.maximumMeshRayDelta=Math.max(total.maximumMeshRayDelta,ray.maxRayDelta);
     }
     if(proof.constructionAllowed!==false||proof.loadBearingMechanicalFastenerPresent!==false||
       proof.foundationAndRoofRatingPresent!==false)throw Error('D49 no authenticated tensile fastener/footing');
    }
   }
   total.rootsWithAnyFullyGeometricCandidate+=Number(rootAny);
   perRoot.push({wall:[...wall],plane,proposals:rootC,sourceClearPatch:true,anyFullyPhysical:rootAny});
  }
  if(bayRoots!==2)throw Error('D49 genuine original long bay does not have exactly two anchored tensile diagonals');
  total.bays++;
 }
 if(total.roots!==total.bays*2||total.candidates!==total.roots*8||total.sourceClearDogsY5!==total.roots||
   total.sourceClearDogsY6!==total.roots||total.slopedSubpatchesTested!==total.roots*4||
   total.positiveAreaEndcaps!==total.candidates||total.rootsWithClearSubpatch!==total.roots||
   b.cells.length!==snapshot[0]||b.navigation.length!==snapshot[1]||b.cells[0]!==snapshot[2]||
   b.cells.at(-1)!==snapshot[3]||b.navigation[0]!==snapshot[4])
  throw Error('D49 original-source 16-building root/cap/roof/navigation conservation violated');
 return Object.freeze({format:'mythwrought.d49.original-source-unapproved-two-stage-elbow-census.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  stillUncertifiedRoof:d29.originalFarZoneCellsStillUncertified,farZones:d29.originalFarZones,
  ...total,firstFailureWitnesses:witnesses,perRoot,
  sourceOwnersAndPack2ShapesUnchanged:true,originalY7WoodRoofPreserved:true,
  noOriginalWALKOrWorldSaveWrites:true,noInstalledFittingsOrRatedLoadPath:true,
  actualGameRendererRayAndIphonePwaUntested:true,constructionAllowed:false});
}
