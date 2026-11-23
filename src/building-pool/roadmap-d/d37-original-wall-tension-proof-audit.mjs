// D37 — read-only original W16/W17 ROOT TENSION source proof. A socket that
// geometrically touches two faces cannot transmit outward TENSION without an
// actual independently owned and rated tensile anchor. Do not register/place.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {inspectBodyFit} from '../../voxel-shape-fit.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination}
 from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket,d36SocketHitsOwner}
 from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath,inspectD37ConservativeOriginalBodyAdapter}
 from './d37-wall-pullout-fastener-contract.mjs';
const K=(x,y,z)=>`${x},${y},${z}`;
const rooted=new Set(['foundation','floor','wall','partition','beam','column']);
const isRoot=(src,[x,y,z])=>y===6&&src.get(x,0,z)?.role==='foundation'&&
 src.get(x,1,z)?.role==='floor'&&Array.from({length:7},(_,v)=>rooted.has(src.get(x,v,z)?.role)).every(Boolean);
const near=(a,b)=>Math.abs(a-b)<1e-7;
/** Refuses structural acceptance even when original geometry is source-clear.
 * The D30 unit roof load is only an algebraic normalization, not real loads. */
export function auditD37AuthenticOriginalWallPulloutAndBodyFit(b,p,s,d25,{maxBodyProbesPerSocket=6,maxCells=256}={}){
 if(!Number.isSafeInteger(maxBodyProbesPerSocket)||maxBodyProbesPerSocket<1||maxBodyProbesPerSocket>16||
    !Number.isSafeInteger(maxCells)||maxCells<24||maxCells>256)
  throw RangeError('D37 bounded ORIGINAL source member/player probe budget');
 const asset=pack2Asset(61),wood=pack2Shape(61,0),post=pack2Shape(62,0);
 if(BLOCK.WOOD!==4||asset?.key!=='ironbound-heartwood-beam'||asset.roster!==15||
  pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(62)?.roster!==22||
  JSON.stringify(wood.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D37 original Pack2 owner / runtime wood authority changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  saved={cells:b.cells.length,nav:b.navigation.length,first:b.cells[0],last:b.cells.at(-1),walk:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
   !d29.allOriginalAuthorNavigationPreserved||!d29.allOriginalY7WoodPreserved||
   d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D37 original source roof and author nav / release veto invalid');
 const totals={longBays:0,rootDiagonals:0,rootTensionWantsAnchors:0,compressionOnlyAdmittedRoots:0,
   socketCandidatesWithGenuineTwoFaceGeometry:0,verifiedSourceClearSockets:0,
   sourceOrOtherMemberClashes:0,originalWorldCellsChanged:0,
   minimumRootNormalizedTension:Infinity,maximumRootNormalizedTension:0,
   maximumOriginalWallPulloutStressCoefficient:0,maximumWebTensionStressCoefficient:0,
   wallGeometricFaceAreaSum:0,webGeometricFaceAreaSum:0,
   originalEngineBodyFitProbes:0,originalEngineBodyFitVetoes:0,
   validatedStructuralAnchors:0,ratedRoofOrFoundationLoads:0};
 const bins=[];
 for(const row of d29.proposedOriginalLongBays){
  const path=inspectD30OriginalUnderslungCorridor(src,row);
  if(!path.exactOriginalY5Y6CourseFree||path.originalY5Y6OverheadWalkConflicts!==0||
    !isRoot(src,row.sourceOriginalStartBearing)||!isRoot(src,row.sourceOriginalEndBearing))
   throw Error('D37 actual W16/W17 wall foundation or authored WALK lost');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,loc=new Map(math.nodes.map(n=>[n.id,
    [sx+.5+(axis==='x'?n.x:0),n.y,sz+.5+(axis==='z'?n.x:0)]]));
  const members=math.members.map(m=>({member:m,shape:m.type==='vertical-web'?
   deriveD31OriginalPack2Vertical(loc.get(m.from),loc.get(m.to),post.boxes):
   deriveD31OriginalPack2Oblique(loc.get(m.from),loc.get(m.to),axis,wood.boxes)}));
  let roots=0,bodyChecks=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   roots++;totals.rootDiagonals++;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing;
   const selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
    {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected||!selected.sourceClear||!(selected.wallCutback>.2))
    throw Error('D37 original D35 wall-root geometrical selection regressed');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,
    {plane:axis,rootAtEnd:end,palette:asset.palette});
   const fit=probeD36OriginalSocket(socket,src,selected.geometry,{maxCells});
   const intersects=members.some(x=>x.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,x.shape));
   if(!fit.sourceClear||intersects||fit.originalRootWallClashes||fit.originalY7RoofClashes||
     fit.originalWalkBodyClashes||fit.constructionAllowed!==false)
    throw Error('D37 candidate socket changed exact D36 geometric admissibility');
   const proof=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!proof.unitRoofLoadIsNOTCalibrated||proof.materialRatingInvented||
      proof.authenticatedRatedConnectionEdges!==0||proof.passesPhysicalStructuralApproval!==false||
      proof.constructionAllowed!==false||proof.requiredEvidence.length!==9)
    throw Error('D37 source-contact area was mistaken for authenticated tensile connector');
   totals.socketCandidatesWithGenuineTwoFaceGeometry++;
   totals.verifiedSourceClearSockets++;
   totals.rootTensionWantsAnchors++;
   totals.minimumRootNormalizedTension=Math.min(totals.minimumRootNormalizedTension,proof.tensileAxialForcePerUnknownUnitRoofLineLoad);
   totals.maximumRootNormalizedTension=Math.max(totals.maximumRootNormalizedTension,proof.tensileAxialForcePerUnknownUnitRoofLineLoad);
   totals.maximumOriginalWallPulloutStressCoefficient=Math.max(totals.maximumOriginalWallPulloutStressCoefficient,proof.necessaryWallAnchorTensionStressCoefficient);
   totals.maximumWebTensionStressCoefficient=Math.max(totals.maximumWebTensionStressCoefficient,proof.necessaryWebCutTensionStressCoefficient);
   totals.wallGeometricFaceAreaSum+=proof.wallFaceArea;totals.webGeometricFaceAreaSum+=proof.webCutFaceArea;
   // The genuine original opt-in runtime body-fit API is used as a conservative
   // AABB socket rejector. This does NOT certify player stepPlayer or collision.
   const low=socket.bounds.min,high=socket.bounds.max,nearby=[];
   for(let x=Math.floor(low[0])-1;x<=Math.ceil(high[0])+1;x++)
    for(let z=Math.floor(low[2])-1;z<=Math.ceil(high[2])+1;z++)
     if(src.nav.has(K(x,2,z)))nearby.push([x,z]);
   if(!nearby.length)throw Error('D37 original authored Y2 WALK evidence vanished near source socket');
   for(const [x,z] of nearby.slice(0,maxBodyProbesPerSocket)){
    const playerAABB=[x+.2,2,z+.2,x+.8,4.5,z+.8];
    const query=inspectD37ConservativeOriginalBodyAdapter(socket,playerAABB,inspectBodyFit);
    if(!query.originalRuntimeShapeFitAPICalled||query.passedForConstruction!==false)
      throw Error('D37 original source shape-fit API was bypassed');
    totals.originalEngineBodyFitProbes++;bodyChecks++;
    if(!query.conservativeAABBBodyFits)totals.originalEngineBodyFitVetoes++;
   }
  }
  totals.longBays++;
  bins.push(Object.freeze({axis,spanCells:row.spanCells,originalRootTensionMembers:roots,
    sourcePlayerFitSamples:bodyChecks,acceptedFasteners:0,constructionAllowed:false}));
 }
 if(!totals.longBays||totals.rootDiagonals!==totals.longBays*2||
    totals.rootDiagonals!==totals.rootTensionWantsAnchors||
    totals.rootDiagonals!==totals.socketCandidatesWithGenuineTwoFaceGeometry||
    totals.compressionOnlyAdmittedRoots!==0||
    b.cells.length!==saved.cells||b.navigation.length!==saved.nav||
    b.cells[0]!==saved.first||b.cells.at(-1)!==saved.last||b.navigation[0]!==saved.walk)
  throw Error('D37 original source load path or no-change invariants violated');
 return Object.freeze({format:'mythwrought.builder-d.d37.authentic-wall-tension-connector-gate.v1',
   blueprintId:b.id,originalRoofCells:d29.sourceRoofCells,
   originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
   originalUncertifiedFarZones:d29.originalFarZones,...totals,perSpan:Object.freeze(bins),
   wallFaceContactDoesNotAnchorTension:true,actualSocketFastenersMissing:true,
   originalSourcePack2ColorsAndShapesUntouched:true,originalRoofAndWALKUnchanged:true,
   noKnownRealUpliftOrLateralLoadRatings:true,realStructuralTensionConnectionsUnapproved:true,
   hypotheticalConservativeBodyDoesNotAcceptActualPlayerPhysics:true,
   noRegisteredConvexShapeIn32BoxOriginalRuntime:true,
   noOriginalSourceOrRuntimeEdits:true,
   physicalLoadCertification:false,constructionAllowed:false,webgl2NotRun:true,
   installedIphonePwaNotRun:true,worldSavesWritten:0});
}
