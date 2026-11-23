// D36 genuine original W16/W17 *read-only* wall-root socket feasibility audit.
// No original wall cut, new registered Block/Pack2 ID or world/save mutation.
import {pack2Shape,pack2Asset,pack2PreviewMesh} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination}
 from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket,previewD36PaletteAndRay,d36SocketHitsOwner}
 from './d36-wall-socket-convex-preview.mjs';
const ROOT_ROLES=new Set(['foundation','floor','wall','column','partition','beam']);
const grounded=(get,p)=>p[1]===6&&get(p[0],0,p[2])?.role==='foundation'&&
 get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>ROOT_ROLES.has(get(p[0],y,p[2])?.role)).every(Boolean);
/** A native source survey, NOT acceptance of material strength or actual placement. */
export function auditD36OriginalWallSocketTransitions(b,p,s,d25,{maxMeshSamples=1,maxSourceCells=256}={}){
 if(!Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>4||
    !Number.isSafeInteger(maxSourceCells)||maxSourceCells<24||maxSourceCells>256)
  throw RangeError('D36 original socket source and mesh budgets invalid');
 const a61=pack2Asset(61),a62=pack2Asset(62),sh61=pack2Shape(61,0),sh62=pack2Shape(62,0);
 if(BLOCK.WOOD!==4||a61?.key!=='ironbound-heartwood-beam'||a61.roster!==15||
   a62?.key!=='dovetailed-support-post'||a62.roster!==22||
   JSON.stringify(sh61.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
   JSON.stringify(sh62.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes)||
   (maxMeshSamples&&pack2PreviewMesh(61,0).triangles!==156))
  throw Error('D36 genuine original Pack2 owner or renderer source changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),source=indexD29OriginalRoof(b),
  before={n:b.cells.length,first:b.cells[0],last:b.cells.at(-1),nav:b.navigation.length,navFirst:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.allOriginalY7WoodPreserved!==true||
    d29.allOriginalAuthorNavigationPreserved!==true||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D36 original W16/W17 roof / nonapproval provenance invalid');
 const totals={buildings:1,originalRoofCells:d29.sourceRoofCells,
  originalUncertifiedFarRoofCells:d29.originalFarZoneCellsStillUncertified,
  originalFarZones:d29.originalFarZones,longBays:0,theoreticalMembers:0,
  pinNodes:0,rootDiagonals:0,sourceClearTrimmedRoots:0,sourceRootStillBlocked:0,
  attemptedIndependentSockets:0,socketsWithSourceCellClashes:0,
  socketsWithOwnerMemberClashes:0,sourceClearWallSocketCandidates:0,
  originalRootWallCollisionEvents:0,originalRoofTierCollisionEvents:0,
  conservativeWalkBodyClashes:0,remainingUnapprovedRootConnections:0,
  sourceOnlyWallFaceContactArea:0,sourceOnlyWebFaceContactArea:0,
  samplePalettedMeshAndColliderRays:0,maximumRayError:0,
  unsupportedActualFastenerCount:0,originalCellsModified:0};
 const bins=[];let samples=0;
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(source,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
    !grounded(source.get,row.sourceOriginalStartBearing)||!grounded(source.get,row.sourceOriginalEndBearing))
   throw Error('D36 authentic root wall, Y5/Y6 clearance and authored WALK veto');
  const solver=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(solver.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
    sz+.5+(axis==='z'?n.x:0)]])),
   members=solver.members.map(m=>({member:m,shape:m.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(nodes.get(m.from),nodes.get(m.to),sh62.boxes):
    deriveD31OriginalPack2Oblique(nodes.get(m.from),nodes.get(m.to),axis,sh61.boxes)}));
  let roots=0,clear=0,clashes=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const atStart=member.from==='T0',atEnd=member.to===`T${solver.panelCount}`;
   if(!atStart&&!atEnd)continue;
   roots++;totals.rootDiagonals++;
   const wall=atStart?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,axis,source,
     {rootWall:wall,rootAtEnd:atEnd,maxCells:128}).selected;
   if(!selected){totals.sourceRootStillBlocked++;continue;}
   totals.sourceClearTrimmedRoots++;
   if(!(selected.wallCutback>.2)||selected.geometry.sourceOwnerId!==61||!selected.sourceClear)
    throw Error('D36 source-clear original wall end must be trimmed, not forged');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,
    {plane:axis,rootAtEnd:atEnd,palette:a61.palette});
   const scan=probeD36OriginalSocket(socket,source,selected.geometry,{maxCells:maxSourceCells});
   if(scan.constructionAllowed!==false||socket.approvedPack2Variant!==false||
      socket.realRatedJoint!==false||scan.sourceClashes.length>8||
      scan.geometricWallFaceArea<=0||scan.geometricWebFaceArea<=0)
    throw Error('D36 fraudulent uninstalled socket structural acceptance');
   totals.attemptedIndependentSockets++;
   totals.sourceOnlyWallFaceContactArea+=scan.geometricWallFaceArea;
   totals.sourceOnlyWebFaceContactArea+=scan.geometricWebFaceArea;
   totals.originalRootWallCollisionEvents+=scan.originalRootWallClashes;
   totals.originalRoofTierCollisionEvents+=scan.originalY7RoofClashes;
   totals.conservativeWalkBodyClashes+=scan.originalWalkBodyClashes;
   if(scan.originalAuthoredCellClashes)totals.socketsWithSourceCellClashes++;
   // An independent wall socket must not overlap ANY other proposed original
   // geometry, including chord/post and the uninstalled other ID61 webs.
   const overlaps=members.filter(x=>x.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,x.shape)).length;
   if(overlaps)totals.socketsWithOwnerMemberClashes++;
   if(scan.sourceClear&&!overlaps){totals.sourceClearWallSocketCandidates++;clear++;}
   else clashes++;
   // Even a clean geometry match is not an authenticated fastener.
   totals.unsupportedActualFastenerCount++;
   if(samples<maxMeshSamples){const mesh=previewD36PaletteAndRay(socket);
    totals.samplePalettedMeshAndColliderRays++;totals.maximumRayError=Math.max(totals.maximumRayError,mesh.rayDelta);samples++;}
  }
  totals.pinNodes+=solver.nodes.length;totals.longBays++;totals.theoreticalMembers+=members.length;
  bins.push(Object.freeze({spanCells:row.spanCells,axis,rootDiagonals:roots,
   geometricSocketEnvelopesClear:clear,unapprovedOrCollidingSockets:clashes,
   allConnectionsUnrated:true,worldChanges:0}));
 }
 totals.remainingUnapprovedRootConnections=totals.rootDiagonals;
 if(totals.longBays!==d29.unapprovedLongCandidateSpans||
    totals.rootDiagonals!==2*totals.longBays||
    totals.sourceRootStillBlocked+totals.sourceClearTrimmedRoots!==totals.rootDiagonals||
    totals.attemptedIndependentSockets!==totals.sourceClearTrimmedRoots||
    totals.sourceClearWallSocketCandidates>totals.attemptedIndependentSockets||
    b.cells.length!==before.n||b.cells[0]!==before.first||b.cells.at(-1)!==before.last||
    b.navigation.length!==before.nav||b.navigation[0]!==before.navFirst)
  throw Error('D36 original wall source ledger or strict no-write contract changed');
 return Object.freeze({format:'mythwrought.builder-d.d36.native-original-convex-wall-socket-study.v1',
  blueprintId:b.id,...totals,perSpan:Object.freeze(bins),
  originalAuthoredWallsAndFoundationUnchanged:true,
  originalY7WoodAndUpperRoofTiersUnchanged:true,
  originalAuthoredWALKUnchanged:true,originalPack2Id61And62AndPaletteUnchanged:true,
  originalSourceNoNewIdOrPhysicalVariant:true,derivedColoredMeshNotOriginalApprovedUV:true,
  engineeringMaterialRatingsAndActualFastenersMissing:true,
  originalRoofGravityUpliftBucklingFoundationUnknown:true,
  productionMeshCollisionAndRayAcceptanceNotDone:true,
  structuralCertification:false,constructionAllowed:false,
  sourceBuildsRegistered:0,originalSaveWrites:0,webgl2NotRun:true,
  installedIphonePwaNotRun:true});
}
