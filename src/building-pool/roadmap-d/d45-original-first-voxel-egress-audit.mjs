// D45 authentic original W16/W17 FIRST blocked unit-segment physical contact
// and alternative fractional wall-face egress. No rating/placement/registry IO.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD43IndependentOutboardSupport} from './d43-source-backed-outboard-support.mjs';
import {inspectD45OriginalSourceLAnatomy,inspectD45FractionalExteriorDogleg,
 sampleD45OriginalPaletteFractionalRay}
 from './d45-source-blocker-and-face-egress.mjs';
const ROOT=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>ROOT.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
/** This file calls genuine ORIGINAL source pipelines and reproduces D43/44
 * 1455 candidate studies/2910 failed Y6 Ls, WITHOUT redundantly running
 * historical full test suites or the unrelated D44 BFS. */
export function auditD45OriginalFirstVoxelAndFractionalEgress(b,p,s,d25,{
 maxTieCandidates=12,maxWitnesses=6
}={}){
 if(!Number.isSafeInteger(maxTieCandidates)||maxTieCandidates<1||maxTieCandidates>12||
  !Number.isSafeInteger(maxWitnesses)||maxWitnesses<0||maxWitnesses>16)
  throw RangeError('D45 narrowly bounded original footprint and voxel witness budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
  pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D45 authentic original ID61/62 owner shapes/IDs/roster drifted');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),source=indexD29OriginalRoof(b),
  old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
   d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true||
   d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
   throw Error('D45 immutable original wood roof/WALK/source authority drift');
 const sum={bays:0,roots:0,candidateOriginalFootprints:0,y6PhysicalLAttempts:0,
  socketAdjacentFirstFailedSegments:0,midRouteFirstFailedSegments:0,nearSupportFirstFailedSegments:0,
  sourceFirstSolidAtY6:0,sourceFirstSolidAtY5:0,sourceFirstSolidAtY4:0,
  sourceWallRole:0,sourcePartitionRole:0,sourceColumnRole:0,sourceBeamRole:0,
  sourceOtherAuthoredRole:0,firstContactAtSegmentStart:0,firstContactBeyondSegmentStart:0,
  duplicateFirstContactWitnessPairs:0,authoredVoxelFirstContactEvents:0,
  fractionalExteriorY6Samples:0,fractionalExteriorY5Samples:0,
  fractionalY6SourceClear:0,fractionalY5SourceClear:0,
  fractionalY6FullyClear:0,fractionalY5FullyClear:0,
  fractionalOriginalSolidEvents:0,fractionalWalkingBodyEvents:0,fractionalSocketEvents:0,
  genuineOriginalTensileRoots:0,originalSourceCellWrites:0,sourceAuthorizedFootings:0,
  mechanicallyInstalledTies:0,sourceValidatedGroundAndCaves:0,
  originalSourceColoredRaySamples:0,maximumSourcePaletteMeshRayDelta:0};
 const witnesses=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(source,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
   !rooted(source,row.sourceOriginalStartBearing)||!rooted(source,row.sourceOriginalEndBearing))
   throw Error('D45 genuine Y0/Y1 foundations, Y5/6 corridor, WALK or Y7 wood missing');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
    sz+.5+(axis==='z'?n.x:0)]]));
  let rootCount=0;
  for(const m of math.members){
   if(m.type!=='diagonal-web')continue;
   const start=m.from==='T0',end=m.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    shape=deriveD31OriginalPack2Oblique(nodes.get(m.from),nodes.get(m.to),axis,beam.boxes),
    chosen=inspectD35OriginalSplitWebWallTermination(shape,axis,source,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!chosen?.sourceClear||!(chosen.wallCutback>.2))
    throw Error('D45 original source-authoritative trimmed diagonal drifted');
   const socket=deriveD36IndependentRootSocket(chosen.geometry,wall,{plane:axis,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,source,chosen.geometry),
    force=screenD37OriginalRootTensilePath(socket,m,math,shape);
   if(!fit.sourceClear||fit.constructionAllowed!==false||
     !(force.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||force.constructionAllowed!==false)
    throw Error('D45 real original D36 socket or D37 normalized tension veto drift');
   sum.genuineOriginalTensileRoots++;sum.roots++;rootCount++;
   const candidate=inspectD43IndependentOutboardSupport(wall,axis,end,source,
    {socketBounds:socket.bounds,radius:4,maxTieCandidates,maxSamples:maxTieCandidates});
   if(candidate.constructionAllowed!==false||candidate.sourceClearExternalTieCorridors!==0||
      candidate.candidates.length!==candidate.candidateFootprintsExaminedForTies)
    throw Error('D45 genuine original D43 Y6 blocked layout or candidate provenance drift');
   sum.candidateOriginalFootprints+=candidate.candidates.length;
   for(const c of candidate.candidates){
    const test=inspectD45OriginalSourceLAnatomy(wall,axis,end,c.at,source,socket.bounds);
    if(test.constructionAllowed!==false||test.twoSourceOriginalOrders.length!==2)
     throw Error('D45 original two Ls cannot be treated as approved independent ties');
    sum.y6PhysicalLAttempts+=2;
    if(witnesses.length<maxWitnesses)witnesses.push(Object.freeze({root:Object.freeze([...wall]),
     candidateFooting:Object.freeze([...c.at]),
     originalTwoFirstPhysicalSegments:test.twoSourceOriginalOrders,
     actualGeneratedTerrainFootingAccepted:false,originalWallsUnchanged:true}));
    for(const w of test.twoSourceOriginalOrders){
     if(w.class==='socket-adjacent-first-segment')sum.socketAdjacentFirstFailedSegments++;
     else if(w.class==='mid-route')sum.midRouteFirstFailedSegments++;
     else if(w.class==='near-proposed-support')sum.nearSupportFirstFailedSegments++;
     else throw Error('D45 unrecognized original source first blocker distance class');
     const f=w.representativeExactFirstContact;
     if(!f)throw Error('D45 original D44 first Y6 blocked path has no authentic source voxel');
     sum.authoredVoxelFirstContactEvents++;
     if(f.at[1]===6)sum.sourceFirstSolidAtY6++;
     else if(f.at[1]===5)sum.sourceFirstSolidAtY5++;
     else if(f.at[1]===4)sum.sourceFirstSolidAtY4++;
     else throw Error('D45 original Y6 prism first voxel at impossible Y');
     if(f.role==='wall')sum.sourceWallRole++;
     else if(f.role==='partition')sum.sourcePartitionRole++;
     else if(f.role==='column')sum.sourceColumnRole++;
     else if(f.role==='beam')sum.sourceBeamRole++;
     else sum.sourceOtherAuthoredRole++;
     if(f.firstFraction<=1e-8)sum.firstContactAtSegmentStart++;
     else sum.firstContactBeyondSegmentStart++;
     if(w.originalSolidHits>1)sum.duplicateFirstContactWitnessPairs++;
    }
   }
   for(const height of [5,6])for(const side of [-1,1]){
    const e=inspectD45FractionalExteriorDogleg(wall,axis,end,source,socket.bounds,{height,side});
    if(e.constructionAllowed!==false||e.originalCellsWritten!==0||
       e.sourceToSocketPhysicalFastenerAbsent!==true)
     throw Error('D45 fractional experimental egress falsely approved or modified source');
    sum[`fractionalExteriorY${height}Samples`]++;
    if(e.sourceAndWalkingClear)sum[`fractionalY${height}SourceClear`]++;
    if(e.allPhysicalVolumesClear)sum[`fractionalY${height}FullyClear`]++;
    sum.fractionalOriginalSolidEvents+=e.originalSourceSolidCollisionEvents;
    sum.fractionalWalkingBodyEvents+=e.authoredWalkingBodyCollisionEvents;
    sum.fractionalSocketEvents+=e.originalD36SocketVolumeCollisionEvents;
    if(sum.originalSourceColoredRaySamples<1){
     const r=sampleD45OriginalPaletteFractionalRay(e,palette);
     if(r.coloredTriangles!==24||r.actualRegisteredVariant!==false||r.maxRayDisagreement>1e-5)
      throw Error('D45 original ID61 palette mesh/ray geometry drift');
     sum.originalSourceColoredRaySamples++;
     sum.maximumSourcePaletteMeshRayDelta=Math.max(sum.maximumSourcePaletteMeshRayDelta,r.maxRayDisagreement);
    }
   }
  }
  if(rootCount!==2)throw Error('D45 original long bay must have two tensile wall roots');
  sum.bays++;
 }
 if(sum.bays!==d29.unapprovedLongCandidateSpans||sum.roots!==sum.bays*2||
   sum.y6PhysicalLAttempts!==2*sum.candidateOriginalFootprints||
   sum.y6PhysicalLAttempts!==sum.socketAdjacentFirstFailedSegments+
     sum.midRouteFirstFailedSegments+sum.nearSupportFirstFailedSegments||
   sum.authoredVoxelFirstContactEvents!==sum.y6PhysicalLAttempts||
   sum.sourceFirstSolidAtY6+sum.sourceFirstSolidAtY5+sum.sourceFirstSolidAtY4!==sum.y6PhysicalLAttempts||
   sum.fractionalExteriorY5Samples!==sum.roots*2||sum.fractionalExteriorY6Samples!==sum.roots*2||
   sum.firstContactAtSegmentStart+sum.firstContactBeyondSegmentStart!==sum.y6PhysicalLAttempts||
   b.cells.length!==old[0]||b.navigation.length!==old[1]||
   b.cells[0]!==old[2]||b.cells.at(-1)!==old[3]||b.navigation[0]!==old[4])
  throw Error('D45 source first segment and original cells/WALK immutability failed');
 return Object.freeze({format:'mythwrought.builder-d.d45.authentic-first-source-voxel-egress-only.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  structurallyUncertifiedDistantWoodRoof:d29.originalFarZoneCellsStillUncertified,
  structurallyUncertifiedRoofZones:d29.originalFarZones,...sum,
  noOriginalPack2IDOrOwnerChanged:true,originalY7WoodUnmodified:true,
  protectedOriginalWALKUnmodified:true,firstPhysicalVoxelMeasuredNotFabricated:true,
  fractionalRailNotAFullSocketToFootingTie:true,
  sourceVacantFootprintIsNotGeneratedWorldGround:true,
  noRatingsForTensionCompressionShearPulloutOrFoundation:true,
  originalRegistryAndSavesUnchanged:true,webgl2AndIphonePwaNotTested:true,
  structuralReleaseAllowed:false,constructionAllowed:false,
  samples:Object.freeze(witnesses)});
}
