// D51: uninstalled original-source W16/W17 full convex ARTICULATED joint study.
// Isolated owner-independent evidence: never load-bearing acceptance, no writes.
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
import {deriveD51ArticulatedExteriorLink,deriveD51DoglegActualBoundaryCap,
 inspectD51ArticulatedPhysicalPath,sampleD51OriginalPaletteTriangleParity}
 from './d51-articulated-true-endface-link.mjs';
const roles=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>roles.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
/** Each authentic root: two courses × two actual dogleg exposed end faces ×
 * two hinge directions × two rotation angles = 16 complete proposals. The
 * independently built supporting convex hull may reject nonconvex twists. */
export function auditD51AuthenticRotatedCapBuilding(b,primary,secondary,d25,{maxRaySamples=1}={}){
 if(!Number.isSafeInteger(maxRaySamples)||maxRaySamples<0||maxRaySamples>3)
  throw RangeError('D51 narrow original owner-palette ray budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||pack2Asset(61)?.roster!==15||
  pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D51 original Pack2 source/owners mutated');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  pre=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
  !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
  d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D51 authentic original protected Y7 roof and WALK contract lost');
 const t={bays:0,roots:0,tensileRoots:0,sourceClearSockets:0,
  D48PatchTrials:0,D48PatchesSourceClear:0,rootsWithSourceClearPatch:0,
  doglegsY5:0,doglegsY6:0,actualDoglegEndcaps:0,
  proposals:0,Y5:0,Y6:0,firstAxial:0,secondLateral:0,
  validConvexRotatedHulls:0,nonconvexOrNonSupportingCapRejected:0,
  authenticFaceContacts:0,authenticEndcapContacts:0,articulatedSharedCaps:0,
  originalSourceHits:0,originalWalkHits:0,originalSocketIntrusions:0,
  sourceMemberHits:0,doglegVolumeIntrusions:0,
  overlapStage12:0,overlapStage23:0,overlapStage13:0,
  sourceSocketClearRotatedHulls:0,fullPhysicalCandidates:0,rootsWithPhysicalCandidate:0,
  raySamples:0,maxRayDelta:0,originalSourceWrites:0,realFasteners:0,footingRatings:0};
 const exampleFailures=[],perRoot=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
   !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D51 missing original untouched rooted beam corridor');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),plane=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(plane==='x'?n.x:0),n.y,
    sz+.5+(plane==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),plane,beam.boxes)}));
  let rootsInBay=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,plane,src,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)
    throw Error('D51 original wall-root source-clear D35 termination absent');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,selected.geometry),
    force=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
     !(force.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||force.constructionAllowed!==false)
    throw Error('D51 source-clear original D36 + positive tensile root proof changed');
   const nearby=members.filter(m=>m.member.memberId!==member.memberId&&
    m.shape.bounds.min.every((v,i)=>v<socket.bounds.max[i]+2&&m.shape.bounds.max[i]>socket.bounds.min[i]-2))
     .map(m=>m.shape),
    saddle=deriveD47UnregisteredCongruentSaddle(socket,selected.side,palette);
   let patch=null;
   for(const variant of ['center','corner0','corner1','corner2']){
    const attempt=deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette),
     check=inspectD48ExactConvexSourceAndOwnerHits(attempt,src,wall,{otherOwners:nearby});
    t.D48PatchTrials++;if(check.sourceAndOwnerClear){t.D48PatchesSourceClear++;if(!patch)patch=attempt;}
   }
   if(!patch)throw Error('D51 original D48 source-clear physical patch missing');
   t.roots++;t.tensileRoots++;t.sourceClearSockets++;t.rootsWithSourceClearPatch++;rootsInBay++;
   let rootClear=false,rootProposals=0;
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,
     {side:selected.side,height});
    if(!dog.allPhysicalVolumesClear)throw Error('D51 original D45 real dogleg source-clear lost');
    if(height===5)t.doglegsY5++;else t.doglegsY6++;
    for(const entry of ['first-axial','second-lateral']){
     const endcap=deriveD51DoglegActualBoundaryCap(dog,{entry});
     if(!(endcap.contactArea>.001))throw Error('D51 original dogleg exposed endface missing');
     t.actualDoglegEndcaps++;
     for(const hingeSide of [-1,1])for(const hingeAngle of [12,24]){
      t.proposals++;rootProposals++;if(height===5)t.Y5++;else t.Y6++;
      if(entry==='first-axial')t.firstAxial++;else t.secondLateral++;
      let link;
      try{
       link=deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry,hingeSide,hingeAngle,
        normalLength:.16,offset:.24});
      }catch(e){
       if(!/nonconvex\/twisted union or degenerate non-supporting connector cap/.test(e.message))throw e;
       t.nonconvexOrNonSupportingCapRejected++;
       if(exampleFailures.length<8)exampleFailures.push({wall:[...wall],height,entry,hingeSide,
        hingeAngle,failure:'non-supporting or nonconvex rotated transition'});
       continue;
      }
      t.validConvexRotatedHulls++;
      const proof=inspectD51ArticulatedPhysicalPath(link,patch,dog,socket,src,wall,{otherOwners:nearby});
      t.authenticFaceContacts+=Number(link.originalPatchArea>.008);
      t.authenticEndcapContacts+=Number(link.realDoglegArea>.001&&proof.endcapMatches);
      t.articulatedSharedCaps+=link.genuineSharedCapTriangles;
      t.originalSourceHits+=proof.solid;t.originalWalkHits+=proof.walk;
      t.originalSocketIntrusions+=proof.socket;t.sourceMemberHits+=proof.member;
      t.doglegVolumeIntrusions+=proof.dogleg;
      t.overlapStage12+=Number(link.selfOverlaps[0]);
      t.overlapStage23+=Number(link.selfOverlaps[1]);
      t.overlapStage13+=Number(link.selfOverlaps[2]);
      t.sourceSocketClearRotatedHulls+=Number(proof.solid===0&&proof.walk===0&&proof.socket===0);
      if(proof.geometricCandidateClear){t.fullPhysicalCandidates++;rootClear=true;}
      if(t.raySamples<maxRaySamples){const ray=sampleD51OriginalPaletteTriangleParity(link);
       t.raySamples++;t.maxRayDelta=Math.max(t.maxRayDelta,ray.rayDelta);}
      if(proof.constructionAllowed!==false||proof.approvedFastener!==false||proof.ratedFoundation!==false||
       proof.ownerRegistration!==false||proof.realWebGL2AndPwaAccepted!==false||proof.sourceEdits!==0)
       throw Error('D51 forged physical load/path approval in original source');
      if(exampleFailures.length<8)exampleFailures.push({wall:[...wall],height,entry,hingeSide,hingeAngle,
       stageOverlaps:link.selfOverlaps,socketHits:proof.socket,wallHits:proof.solid,
       memberHits:proof.member,doglegPenetrations:proof.dogleg,
       firstOriginalSource:proof.sourceExamples[0]??null});
     }
    }
   }
   if(rootProposals!==16)throw Error('D51 original per-root articulation census undercount');
   t.rootsWithPhysicalCandidate+=Number(rootClear);
   perRoot.push({wall:[...wall],plane,rootClear,candidates:rootProposals,sourceClearPatch:true});
  }
  if(rootsInBay!==2)throw Error('D51 two original positive-tension roots per authentic long bay required');
  t.bays++;
 }
 if(t.roots!==t.bays*2||t.proposals!==t.roots*16||
  t.D48PatchTrials!==t.roots*4||t.rootsWithSourceClearPatch!==t.roots||
  t.validConvexRotatedHulls+t.nonconvexOrNonSupportingCapRejected!==t.proposals||
  b.cells.length!==pre[0]||b.navigation.length!==pre[1]||b.cells[0]!==pre[2]||
  b.cells.at(-1)!==pre[3]||b.navigation[0]!==pre[4])
  throw Error('D51 original Wave16/17 exact source or accounting changed');
 return Object.freeze({format:'mythwrought.d51.authentic-original-unapproved-articulated-endface-census.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  originalUncertifiedFarRoof:d29.originalFarZoneCellsStillUncertified,originalFarZones:d29.originalFarZones,
  ...t,perRoot,exampleFailures,
  originalPack2OwnerShapesUntouched:true,weatherPlaneAndOriginalWALKPreserved:true,
  noActualMechanicalOrRatedFoundationConnection:true,installedIphoneAndWebGL2Untested:true,
  sourceWrites:0,saveWrites:0,constructionAllowed:false});
}
