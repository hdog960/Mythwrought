// MYTHWROUGHT D52: authentic W16/W17 source-only exterior dogleg approach.
// EXACT D51 filter (only original 108 source/socket-clear articulated candidates).
// Original Pack2, roof, authored WALK, building pool and saves READ-ONLY.
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
import {deriveD51ArticulatedExteriorLink,inspectD51ArticulatedPhysicalPath}
 from './d51-articulated-true-endface-link.mjs';
import {deriveD52ExteriorDoglegApproach,inspectD52FullOriginalVolume,sampleD52ExteriorMeshRay}
 from './d52-exterior-terminal-approach.mjs';
const ROLES=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>ROLES.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
const recoverable=e=>/nonconvex\/twisted union or degenerate non-supporting connector cap|D52 non-supporting, zero-volume or nonconvex cap pair/.test(e.message);
/** Original SOURCE-only filter and route census. Does not import or rerun
 * historic test files; authentic original geometry is independently generated. */
export function auditD52OriginalExteriorDogleg(b,primary,secondary,d25,{maxRaySamples=1}={}){
 if(!Number.isSafeInteger(maxRaySamples)||maxRaySamples<0||maxRaySamples>2)
  throw RangeError('D52 original-source narrow ray budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(61)?.roster!==15||
  pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D52 immutable original Pack2 physical source ID61/62 failed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
  !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
  d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D52 original far roof, author walking and structural HOLD contract broken');
 const t={buildings:1,bays:0,roots:0,sourceClearSockets:0,tensileRoots:0,
  originalD48Patches:0,originalD48SourceClear:0,rootsWithSourceClearPatch:0,
  originalD51Proposals:0,originalD51SupportingHulls:0,originalD51Rejected:0,
  originalD51SourceSocketClear:0,originalD51FullyClear:0,
  D52Proposals:0,D52ValidSupportingHulls:0,D52RejectedHull:0,
  D52TrueExteriorDoglegEndCaps:0,D52TerminalDoglegClear:0,
  D52ActualSocketFaceContacts:0,D52ActualDoglegFaceContacts:0,D52FullSharedCapCount:0,
  D52SourceSolidHits:0,D52WalkingHits:0,D52SocketHits:0,D52MemberHits:0,D52DoglegHits:0,
  D52SelfOverlapEvents:0,D52SourceSocketClear:0,D52FullyGeometricClear:0,
  D52RootsWithAnyGeometryClear:0,D52SaddlesWithAllFourCourseCandidates:0,
  D52RaySamples:0,D52MaxRayDelta:0,realFasteners:0,registeredOwnerIDs:0,approvedFootings:0,
  buildingSourceWrites:0,gameplayWrites:0};
 const examples=[],perRoot=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
   !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D52 source-authentic Y5/Y6 bearing corridor/WALK/roof changed');
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
    selected=inspectD35OriginalSplitWebWallTermination(shape,plane,src,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)throw Error('D52 protected original D35 root trim missing');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,selected.geometry),
    force=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
      !(force.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||force.constructionAllowed!==false)
    throw Error('D52 real original root tension or source-clear socket lost');
   const nearby=members.filter(m=>m.member.memberId!==member.memberId&&
    m.shape.bounds.min.every((v,i)=>v<socket.bounds.max[i]+2&&m.shape.bounds.max[i]>socket.bounds.min[i]-2))
     .map(m=>m.shape),
    saddle=deriveD47UnregisteredCongruentSaddle(socket,selected.side,palette);
   let patch=null;
   for(const variant of ['center','corner0','corner1','corner2']){
    const p=deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette),
     r=inspectD48ExactConvexSourceAndOwnerHits(p,src,wall,{otherOwners:nearby});
    t.originalD48Patches++;if(r.sourceAndOwnerClear){t.originalD48SourceClear++;if(!patch)patch=p;}
   }
   if(!patch)throw Error('D52 D48 original-source clear positive-area socket patch absent');
   t.roots++;t.sourceClearSockets++;t.tensileRoots++;t.rootsWithSourceClearPatch++;bayRoots++;
   let preD51=0,rootNewClear=false,firstFailure=null,rootValid=0,rootTerminalClean=0;
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,{side:selected.side,height});
    if(!dog.allPhysicalVolumesClear)throw Error('D52 source-owned D45 full-thickness dogleg lost');
    for(const entry of ['first-axial','second-lateral'])for(const hingeSide of [-1,1])for(const hingeAngle of [12,24]){
     t.originalD51Proposals++;
     let old;
     try{old=deriveD51ArticulatedExteriorLink(patch,dog,palette,
      {entry,hingeSide,hingeAngle,normalLength:.16,offset:.24});}
     catch(e){if(!recoverable(e))throw e;t.originalD51Rejected++;continue;}
     t.originalD51SupportingHulls++;
     const historical=inspectD51ArticulatedPhysicalPath(old,patch,dog,socket,src,wall,{otherOwners:nearby});
     if(historical.sourceEdits!==0||historical.constructionAllowed!==false)
      throw Error('D52 D51 original geometry or protection invalid');
     if(historical.geometricCandidateClear)t.originalD51FullyClear++;
     if(historical.solid+historical.walk+historical.socket!==0)continue;
     t.originalD51SourceSocketClear++;preD51++;
     // Six bounded new alternative source-derived terminal approaches.
     for(const distance of [.16,.32])for(const offset of [-.12,0,.12]){
      t.D52Proposals++;
      let candidate;
      try{candidate=deriveD52ExteriorDoglegApproach(old,dog,palette,{outwardDistance:distance,offset});}
      catch(e){if(!recoverable(e))throw e;t.D52RejectedHull++;continue;}
      t.D52ValidSupportingHulls++;
      const proof=inspectD52FullOriginalVolume(candidate,patch,dog,socket,src,wall,{otherOwners:nearby});
      if(!proof.exactTerminus||!proof.exactSocket||!candidate.faceApproachedFromOutside||
       proof.sourceCellsModified!==0||proof.constructionAllowed!==false||
       proof.realFastenerRated!==false||proof.realFoundationRated!==false||
       proof.productionRendererColliderPwaAccepted!==false)
       throw Error('D52 actual original cap contact / structural HOLD fabricated');
      t.D52TrueExteriorDoglegEndCaps++;t.D52ActualSocketFaceContacts+=Number(proof.realSocketPatchArea>.008);
      t.D52ActualDoglegFaceContacts+=Number(proof.realEndcapArea>.001);
      t.D52FullSharedCapCount+=candidate.genuineSharedTriangleCaps;
      t.D52SourceSolidHits+=proof.solid;t.D52WalkingHits+=proof.walk;
      t.D52SocketHits+=proof.socket;t.D52MemberHits+=proof.member;t.D52DoglegHits+=proof.dogleg;
      t.D52SelfOverlapEvents+=proof.positiveVolumeSelfOverlapPairs.length;
      const terminal=proof.rows[3].dogleg===0;
      if(terminal){t.D52TerminalDoglegClear++;rootTerminalClean++;}
      if(proof.solid+proof.walk+proof.socket===0)t.D52SourceSocketClear++;
      if(proof.geometricConnectorClear){t.D52FullyGeometricClear++;rootNewClear=true;}
      if(t.D52RaySamples<maxRaySamples){const ray=sampleD52ExteriorMeshRay(candidate);
       t.D52RaySamples++;t.D52MaxRayDelta=Math.max(t.D52MaxRayDelta,ray.rayDelta);}
      rootValid++;
      if(!firstFailure)firstFailure={height,entry,hingeSide,hingeAngle,distance,offset,
       source:proof.solid,walk:proof.walk,socket:proof.socket,member:proof.member,dogleg:proof.dogleg,
       overlaps:proof.positiveVolumeSelfOverlapPairs.map(p=>[p.i,p.j]),
       exposedLastSegmentDoglegHit:proof.rows[3].dogleg,firstOriginalSource:proof.firstOriginalSolid};
     }
    }
   }
   if(rootNewClear)t.D52RootsWithAnyGeometryClear++;
   if(preD51>0&&rootValid>=4)t.D52SaddlesWithAllFourCourseCandidates++;
   perRoot.push({root:[...wall],plane,d51SourceSocketClear:preD51,d52ValidHulls:rootValid,
    d52TerminalDoglegClear:rootTerminalClean,newGeometricCandidateClear:rootNewClear});
   if(firstFailure&&examples.length<12)examples.push({root:[...wall],...firstFailure});
  }
  if(bayRoots!==2)throw Error('D52 original two end-root diagonal members per bay missing');
  t.bays++;
 }
 if(t.bays!==d29.unapprovedLongCandidateSpans||t.roots!==t.bays*2||
    t.originalD48Patches!==t.roots*4||t.originalD51Proposals!==t.roots*16||
    t.originalD51SupportingHulls+t.originalD51Rejected!==t.originalD51Proposals||
    t.D52ValidSupportingHulls+t.D52RejectedHull!==t.D52Proposals||
    b.cells.length!==snapshot[0]||b.navigation.length!==snapshot[1]||
    b.cells[0]!==snapshot[2]||b.cells.at(-1)!==snapshot[3]||b.navigation[0]!==snapshot[4])
  throw Error('D52 exact original source/ref or new isolated census changed');
 return Object.freeze({format:'mythwrought.d52.unrated-authentic-original-outer-endface-study.v1',
  blueprintId:b.id,originalRoofCells:d29.sourceRoofCells,
  originalFarRoofUncertified:d29.originalFarZoneCellsStillUncertified,
  originalFarRegions:d29.originalFarZones,...t,
  perRoot:Object.freeze(perRoot),examples:Object.freeze(examples),
  originalPack2AndRootedAuthoredSourceUnmodified:true,
  sourceOnlyExteriorFaceContactNotMechanicalRetention:true,
  noRealTerrainCaveFootingOrWallStrengthEvidence:true,
  originalAuthorWalkingAndWeatherPlanePreserved:true,
  productionRendererAndIphonePwaUntested:true,constructionAllowed:false});
}
