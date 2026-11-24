// D46: genuine W16/W17 original source-only geometric CONTINUITY census.
// D45's source-clear DOGLEG begins outside D36's socket and is NOT connected.
// No original author cells/voxel owners/numeric IDs/WALK/saves/world modified.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD45FractionalExteriorDogleg} from './d45-source-blocker-and-face-egress.mjs';
import {inspectD46ActualSocketDoglegGap,inspectD46FractionalExitToOutboard,
 inspectD46OriginalPaletteExtensionRay,listD46OriginalUnprovenOutboardFootprints} from './d46-socket-to-fractional-tie-contract.mjs';
const ROOT=new Set(['foundation','floor','wall','partition','column','beam']);
const isRoot=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,i)=>ROOT.has(src.get(p[0],i,p[2])?.role)).every(Boolean);
/** Only original authored W16/W17 roof math and original ID61/62 owners. */
export function auditD46OriginalSocketToProspectiveOutboard(b,p,s,d25,{
 maxCandidates=12,maxWitnesses=8,maxPaletteSamples=1
}={}){
 if(!Number.isSafeInteger(maxCandidates)||maxCandidates<1||maxCandidates>12||
    !Number.isSafeInteger(maxWitnesses)||maxWitnesses<0||maxWitnesses>20||
    !Number.isSafeInteger(maxPaletteSamples)||maxPaletteSamples<0||maxPaletteSamples>3)
  throw RangeError('D46 source-only geometry census budgets');
 const timber=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
  pack2Asset(62)?.roster!==22||JSON.stringify(timber.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D46 authentic registered ID61/62 exact original material fingerprint drift');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
   throw Error('D46 original roof and source WALK or nonapproval provenance changed');
 const t={bays:0,roots:0,unverifiedSourceFootprints:0,rootNormalizedTension:0,
  originalD45DoglegAttemptsY5:0,originalD45DoglegAttemptsY6:0,
  originalD45DoglegClearY5:0,originalD45DoglegClearY6:0,
  selectedSourceSideDoglegsY5:0,selectedSourceSideDoglegsY6:0,
  selectedSideSourceClearY5:0,selectedSideSourceClearY6:0,
  authenticatedD36ConvexSocketSamples:0,rootSocketPositiveVolumeDoglegContacts:0,
  selectedSideGapPositiveY5:0,selectedSideGapPositiveY6:0,
  sourceClearNeckCandidates:0,sourceClashingNeckCandidates:0,
  socketExteriorLateralZeroAreaWitnesses:0,realPositiveAreaSocketCouplers:0,
  prospectiveRoutePairs:0,fractionalOutboardSourceBodyClearRoutes:0,
  completeFractionalOutboardPhysicalRoutes:0,allOriginalProposedOwnerCollisionEvents:0,
  originalSolidRouteCollisionEvents:0,authoredWalkRouteCollisionEvents:0,
  originalSocketRouteCollisionEvents:0,
  geometricallyClearExtensionY5:0,geometricallyClearExtensionY6:0,
  physicallyConnectedFullAssembly:0,verifiedGroundFoundation:0,ratedTensionConnections:0,
  originalSourceWorldEdits:0,sourcePaletteRaySamples:0,maxMeshVsRayDelta:0};
 const witnesses=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
     !isRoot(src,row.sourceOriginalStartBearing)||!isRoot(src,row.sourceOriginalEndBearing))
    throw Error('D46 genuine original W16/W17 root Y0/Y1/Y5/Y6/WALK/Y7 roof not proven');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,sz+.5+(axis==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
      deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
      deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),axis,timber.boxes)}));
  let rootsHere=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
      {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)
    throw Error('D46 missing original D35 selected trimmed root owner and nonintrusive cut');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane:axis,rootAtEnd:end,palette}),
    fitting=probeD36OriginalSocket(socket,src,selected.geometry),
    tensile=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fitting.sourceClear||fitting.memberPositiveVolumeOverlap||
     !(tensile.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||tensile.constructionAllowed!==false)
    throw Error('D46 real source-authenticated D36 socket geometry or D37 tensile root rejected');
   t.roots++;t.rootNormalizedTension++;rootsHere++;t.authenticatedD36ConvexSocketSamples++;
   const sites=listD46OriginalUnprovenOutboardFootprints(wall,axis,end,src,socket,{limit:maxCandidates});
   t.unverifiedSourceFootprints+=sites.unverifiedCandidateCount;
   // Other theoretical D30 member volumes from THIS original span (not a full
   // world/chunk study); screen them, but do NOT call these installed members.
   const nearOwners=members.filter(x=>x.member.memberId!==member.memberId&&
     x.shape.bounds.min.every((v,j)=>v<socket.bounds.max[j]+5&&
       x.shape.bounds.max[j]>socket.bounds.min[j]-5)).map(x=>x.shape);
   for(const height of [5,6])for(const side of [-1,1]){
    const dog=inspectD45FractionalExteriorDogleg(wall,axis,end,src,socket.bounds,{height,side});
    t[`originalD45DoglegAttemptsY${height}`]++;
    if(dog.allPhysicalVolumesClear)t[`originalD45DoglegClearY${height}`]++;
    if(side!==selected.side)continue;
    t[`selectedSourceSideDoglegsY${height}`]++;
    const seam=inspectD46ActualSocketDoglegGap(socket,dog,src);
    if(seam.signedAxialSocketToDoglegGap>1e-8)t[`selectedSideGapPositiveY${height}`]++;
    if(seam.socketActualExtremeFaceArea===0)t.socketExteriorLateralZeroAreaWitnesses++;
    if(seam.neckSourceClear)t.sourceClearNeckCandidates++;else t.sourceClashingNeckCandidates++;
    if(seam.positiveAreaSocketToNeckAttachmentProven)t.realPositiveAreaSocketCouplers++;
    if(!dog.allPhysicalVolumesClear)continue;
    t[`selectedSideSourceClearY${height}`]++;
    for(const site of sites.prospectiveSites){
     const approach=inspectD46FractionalExitToOutboard(dog,site.at,src,{socket,otherOwners:nearOwners});
     t.prospectiveRoutePairs++;
     if(approach.approaches.some(r=>r.fullExtensionSourceAndBodyClear))t.fractionalOutboardSourceBodyClearRoutes++;
     if(approach.anyCompletelyClearExtension){t.completeFractionalOutboardPhysicalRoutes++;
      t[`geometricallyClearExtensionY${height}`]++;
      if(witnesses.length<maxWitnesses)witnesses.push(Object.freeze({originalWall:Object.freeze([...wall]),
       theoreticalOutboard:Object.freeze([...site.at]),height,selectedSide:side,
       sourceAndMembersClearOnly:true,socketToDoglegGap:seam.signedAxialSocketToDoglegGap,
       noPhysicalFastenerOrFooting:true,mechanicallyConnected:false}));}
     for(const leg of approach.approaches){t.originalSolidRouteCollisionEvents+=leg.sourceSolidIntersections;
      t.authoredWalkRouteCollisionEvents+=leg.walkingBodyIntersections;
      t.originalSocketRouteCollisionEvents+=leg.realD36SocketPositiveVolumeIntersections;
      t.allOriginalProposedOwnerCollisionEvents+=leg.otherProposedOwnerIntersections;}
    }
    if(t.sourcePaletteRaySamples<maxPaletteSamples&&sites.prospectiveSites.length){
     const first=inspectD46FractionalExitToOutboard(dog,sites.prospectiveSites[0].at,src,{socket});
     const pair=first.approaches.find(r=>r.points.length>1);
     if(pair){const q=inspectD46OriginalPaletteExtensionRay(pair.points[0],pair.points[1],palette);
      t.sourcePaletteRaySamples++;t.maxMeshVsRayDelta=Math.max(t.maxMeshVsRayDelta,q.physicalAABBVsActualTriangleDelta);}
    }
   }
  }
  if(rootsHere!==2)throw Error('D46 original long bay must have exactly two source-authentic tensile roots');
  t.bays++;
 }
 if(t.roots!==t.bays*2||t.bays!==d29.unapprovedLongCandidateSpans||
  t.originalD45DoglegAttemptsY5!==t.roots*2||t.originalD45DoglegAttemptsY6!==t.roots*2||
  t.selectedSourceSideDoglegsY5!==t.roots||t.selectedSourceSideDoglegsY6!==t.roots||
  t.fractionalOutboardSourceBodyClearRoutes>t.prospectiveRoutePairs||
  t.completeFractionalOutboardPhysicalRoutes>t.fractionalOutboardSourceBodyClearRoutes||
  b.cells.length!==old[0]||b.navigation.length!==old[1]||b.cells[0]!==old[2]||
  b.cells.at(-1)!==old[3]||b.navigation[0]!==old[4])
  throw Error('D46 original Y7 roof, authored WALK or source-owned continuity census drift');
 return Object.freeze({format:'mythwrought.d46.actual-original-D36-D45-D43-continuity-v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  originalFarRoofUncertified:d29.originalFarZoneCellsStillUncertified,
  originalFarRoofUncertifiedZones:d29.originalFarZones,...t,
  samples:Object.freeze(witnesses),originalPack2OwnerGeometryAndRGBUnchanged:true,
  originalNavigationAndY7WoodUnchanged:true,noActualSocketToRailRatedCoupler:true,
  noActualOriginalWorldTerrainGroundOrCaveProven:true,
  noMaterialStrengthShearUpliftOrFoundationRatings:true,
  noOriginalTrussMembersOrFootingsInstalled:true,
  noWebGL2PhysicalPlayerOrInstalledIphonePwaAcceptance:true,
  originalSavesUnwritten:true,constructionAllowed:false});
}
