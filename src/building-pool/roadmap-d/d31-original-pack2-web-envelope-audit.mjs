// MYTHWROUGHT Builder D31: genuine 4B original-source player and material
// clearance for UNREGISTERED Pack2-original-section oblique truss hypotheses.
// Derived 3-D source mesh is NOT an approved Pack2 angled member or joint.
// Original W16/W17 cells, 285 IDs, 3644 D4 pairs and worlds are read-only.
import {pack2Shape,pack2Asset,pack2PreviewMesh} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,d31PreviewHitsAABB,d31OBBsOverlap,
 d31TransformOriginalPack2Mesh,d31RayOwnerPreview,d31RayPreviewTriangles}
 from './d31-pack2-owner-oblique-preview.mjs';
const K=(x,y,z)=>`${x},${y},${z}`;
const abs0=n=>Math.floor(n+1e-7),abs1=n=>Math.ceil(n-1e-7)-1;
const backed=new Set(['foundation','floor','wall','column','partition','beam']);
const bearing=new Set(['wall','column','partition']);
const assertOwner=()=>{
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
   JSON.stringify(pack2Shape(61,0).boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes))
  throw Error('D31 true Pack2 timber source/collision owner changed');
 if(pack2Asset(62)?.roster!==22||pack2Asset(62)?.key!=='dovetailed-support-post'||
    JSON.stringify(pack2Shape(62,0).boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D31 true Pack2 post physical owner changed');
 return {beam:pack2Shape(61,0).boxes,post:pack2Shape(62,0).boxes};
};
function rooted(src,[x,y,z]){
 if(y!==6||!bearing.has(src.get(x,6,z)?.role)||
    src.get(x,0,z)?.role!=='foundation'||src.get(x,1,z)?.role!=='floor')return false;
 for(let h=0;h<=6;h++)if(!backed.has(src.get(x,h,z)?.role))return false;
 return true;
}
function originalIntersection(g,src,limit){
 const low=g.bounds.min.map(abs0),high=g.bounds.max.map(abs1);
 const count=high.reduce((p,h,i)=>p*(h-low[i]+1),1);
 if(!Number.isSafeInteger(count)||count<1||count>limit)throw RangeError('D31 transformed original owner sweep exceeds bounded source-cell budget');
 const hits=[];
 for(let x=low[0];x<=high[0];x++)for(let y=low[1];y<=high[1];y++)for(let z=low[2];z<=high[2];z++){
  const c=src.get(x,y,z);if(!c)continue;
  if(d31PreviewHitsAABB(g,[x,y,z],[x+1,y+1,z+1]))hits.push({at:[x,y,z],role:c.role,asset:c.asset});
 }
 return hits;
}
/** One original source building only; W16/W17 aggregate belongs in exact-source tests. */
export function auditD31OriginalPack2ObliqueWebEnvelopes(blueprint,primary,secondary,d25,{maxSourceCellsPerMember=96,maxMeshSamples=2}={}){
 if(!Number.isSafeInteger(maxSourceCellsPerMember)||maxSourceCellsPerMember<32||maxSourceCellsPerMember>192||
    !Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>8)
  throw RangeError('D31 per-source and physical mesh budget refused');
 const owners=assertOwner(),d29=auditD29OriginalLongBayBearingAndTierClearance(blueprint,primary,secondary,d25),
  src=indexD29OriginalRoof(blueprint),beforeCells=blueprint.cells.length,beforeNav=blueprint.navigation.length;
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius||
    d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true)
  throw Error('D31 requires the real unapproved D25–D29 W16/W17 original source proof');
 const mesh=maxMeshSamples?pack2PreviewMesh(61,0):null;
 if(mesh&&(mesh.triangles!==156||mesh.indices.length!==468||mesh.candidateOnly!==true))
  throw Error('D31 original Pack2 visual owner source triangles changed');
 const totals={longBays:0,originalRoof:d29.sourceRoofCells,far:d29.originalFarZoneCellsStillUncertified,
  zones:d29.originalFarZones,pinNodes:0,members:0,obliqueDiagonals:0,
  ownerBoxes:0,nonUnitAxialTransforms:0,originalSolidClashes:0,
  clashAtRootedWall:0,otherOriginalCellClashes:0,roofWoodClashes:0,
  upperTierClashes:0,authoredWalkBodyConflicts:0,unratedPinJoints:0,
  physicallyOverlappingJointPairs:0,roofFaceGapTopChordMembers:0,
  sampledOriginalOwnerMeshes:0,originalMeshTriangles:0,
  meshBytes:0,meshRayVsColliderMaxDelta:0,sourceCellsModified:0};
 const bins=[];let testedMesh=0;
 for(const row of d29.proposedOriginalLongBays){
  const check=inspectD30OriginalUnderslungCorridor(src,row);
  if(!check.exactOriginalY5Y6CourseFree||check.originalY5InteriorObstructedCells!==0||
     check.originalY5Y6OverheadWalkConflicts!==0||row.clearance.realRootedOriginalEndpoints!==2||
     !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D31 original wall or Y5/Y6 route needs impossible authored source mutation');
  const statics=solveD30IdealizedUnderslungTruss(row.spanCells),
   [sx,,sz]=row.sourceOriginalStartBearing,axis=row.clearance.axis,
   coords=new Map(statics.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,sz+.5+(axis==='z'?n.x:0)]]));
  const physical=[],nodeToMembers=new Map();let clashes=0,wall=0,other=0,roof=0,upper=0,walk=0,diags=0,stretched=0;
  for(const member of statics.members){
   const shape=member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(coords.get(member.from),coords.get(member.to),owners.post):
    deriveD31OriginalPack2Oblique(coords.get(member.from),coords.get(member.to),axis,owners.beam);
   const hit=originalIntersection(shape,src,maxSourceCellsPerMember);
   for(const c of hit){clashes++;
    if((c.at[0]===row.sourceOriginalStartBearing[0]&&c.at[2]===row.sourceOriginalStartBearing[2])||
      (c.at[0]===row.sourceOriginalEndBearing[0]&&c.at[2]===row.sourceOriginalEndBearing[2]))wall++;
    else other++;
    if(c.at[1]===7&&c.asset==='live:wood')roof++;
    if(c.at[1]>=8)upper++;
   }
   // The source WALK node is at Y2. The test envelope is a 2.5-cell-tall,
   // 0.6-cell-wide conservative corridor probe, NOT original game player physics.
   const low=shape.bounds.min.map(abs0),high=shape.bounds.max.map(abs1);
   for(let x=low[0];x<=high[0];x++)for(let z=low[2];z<=high[2];z++){
    if(src.nav.has(K(x,2,z))&&d31PreviewHitsAABB(shape,[x+.2,2,z+.2],[x+.8,4.5,z+.8]))walk++;
   }
   for(const id of [member.from,member.to]){const v=nodeToMembers.get(id)||[];v.push(physical.length);nodeToMembers.set(id,v);}
   if(member.type==='diagonal-web')diags++;
   if(Math.abs(shape.centerlineLength-1)>1e-7)stretched++;
   if(member.type==='top-chord'&&shape.bounds.max[1]<7)totals.roofFaceGapTopChordMembers++;
   if(testedMesh<maxMeshSamples){
    const derivative=d31TransformOriginalPack2Mesh(shape,mesh),
     mid=shape.start.map((v,i)=>(v+shape.end[i])/2),from=mid.map((v,i)=>v+shape.ownerOBBs[0].axes[2][i]*2),
     direction=shape.ownerOBBs[0].axes[2].map(v=>-v),colliderT=d31RayOwnerPreview(shape,from,direction,4),
     meshT=d31RayPreviewTriangles(derivative,from,direction,4);
    if(colliderT===null||meshT===null||Math.abs(colliderT-meshT)>.004)
      throw Error('D31 owner-derived actual mesh/ray disagrees with physical oblique collider');
    totals.meshRayVsColliderMaxDelta=Math.max(totals.meshRayVsColliderMaxDelta,Math.abs(colliderT-meshT));
    totals.sampledOriginalOwnerMeshes++;totals.originalMeshTriangles+=mesh.triangles;
    totals.meshBytes+=derivative.byteLength;testedMesh++;
   }
   physical.push({member,shape});
  }
  let overlapPairs=0;
  for(const ids of nodeToMembers.values())for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
   const a=physical[ids[i]].shape,b=physical[ids[j]].shape;
   if(a.ownerOBBs.some(p=>b.ownerOBBs.some(q=>d31OBBsOverlap(p,q))))overlapPairs++;
  }
  totals.longBays++;totals.pinNodes+=statics.numberOfNodes;
  totals.unratedPinJoints+=statics.numberOfJointsRequiringValidatedAxialTransfer;
  totals.members+=statics.numberOfMembers;totals.obliqueDiagonals+=diags;
  totals.ownerBoxes+=statics.numberOfMembers*3;
  totals.nonUnitAxialTransforms+=stretched;totals.originalSolidClashes+=clashes;
  totals.clashAtRootedWall+=wall;totals.otherOriginalCellClashes+=other;
  totals.roofWoodClashes+=roof;totals.upperTierClashes+=upper;
  totals.authoredWalkBodyConflicts+=walk;totals.physicallyOverlappingJointPairs+=overlapPairs;
  bins.push(Object.freeze({spanCells:row.spanCells,axis,originalSourcedMembers:physical.length,
    obliqueDiagonals:diags,originalSourceConflicts:clashes,
    anchoredWallConflicts:wall,interiorSourceConflicts:other,
    overlappingJointPairs:overlapPairs,walkBodyConflicts:walk,
    packageRated:false,constructionApproved:false}));
 }
 if(blueprint.cells.length!==beforeCells||blueprint.navigation.length!==beforeNav||
    totals.roofWoodClashes!==0||totals.upperTierClashes!==0||
    totals.authoredWalkBodyConflicts!==0||totals.pinNodes!==totals.unratedPinJoints||
    totals.longBays!==d29.unapprovedLongCandidateSpans)
  throw Error('D31 authored roof, upper-tier, original WALK or ledger safety veto');
 return Object.freeze({format:'mythwrought.builder-d.d31.source-owned-oblique-pack2-triage.v1',
  blueprintId:blueprint.id,...totals,candidates:Object.freeze(bins),
  allCandidateWebMeshesDerivedFromOriginalPack2Owner:true,
  physicallyTransformedVariantUnregistered:true,
  originalSourceCollisionsNeedRatedJointAndBearingResolution:true,
  originalOneCellPack2BlocksCannotRepresentObliqueMultiCellMembers:true,
  unapprovedPinJointClashesDoNotCertifyARealConnection:true,
  exactAuthoredWALKPreserved:true,originalY7LiveWoodUntouched:true,
  requiresRealSourcePhysicalPlayerAABBAndSelectionAcceptance:true,
  ratedMemberMaterialsAndPinJointsUnavailable:true,
  originalWorldCellsWritten:0,sourceGeometryModified:false,
  roofLoadAcceptance:false,constructionAllowed:false,webgl2Accepted:false,
  installedIphonePwaAccepted:false});
}
