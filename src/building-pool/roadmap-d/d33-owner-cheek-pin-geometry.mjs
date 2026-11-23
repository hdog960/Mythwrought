// MYTHWROUGHT Builder D33. Only exact original Pack2 ID62 source-owned THREE
// boxes may be translated as tentative OUTBOARD pin cheeks. No block variant,
// renderer, CSG fastener, rated joint, save or terrain edit is registered.
// ID61 oblique owner and D32 axial-cut source remain byte-for-byte unchanged.
import {d31OBBsOverlap,d31PreviewHitsAABB,d31RayOwnerPreview,
 d31TransformOriginalPack2Mesh,d31RayPreviewTriangles}
 from './d31-pack2-owner-oblique-preview.mjs';
import {clipD32OriginalOwnerAxially} from './d32-pack2-wall-seat-joint-ports.mjs';
const EPS=1e-8;
const THREE_ID62=Object.freeze([
 Object.freeze([.33,0,.33,.67,1,.67]),
 Object.freeze([.23,0,.23,.77,.14,.77]),
 Object.freeze([.27,.86,.27,.73,1,.73])
]);
const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const canonical=boxes=>Array.isArray(boxes)&&boxes.length===THREE_ID62.length&&
 boxes.every((b,i)=>Array.isArray(b)&&b.length===6&&
 b.every((x,j)=>Number.isFinite(x)&&Math.abs(x-THREE_ID62[i][j])<EPS));
export const d33SourcePostFingerprint=()=>JSON.stringify(THREE_ID62);
export function deriveD33UnregisteredSourcePostCheek(pin,plane,side,sourceBoxes,{offset=.7}={}){
 if(!finite3(pin)||!['x','z'].includes(plane)||![1,-1].includes(side)||
    !Number.isFinite(offset)||offset<.6||offset>1.2||!canonical(sourceBoxes))
  throw TypeError('D33 requires authentic canonical Pack2 ID62 source and bounded outboard offset');
 // D30 pins are at Y5.5 or Y6.5 and share each truss longitudinal center plane.
 if(![5.5,6.5].some(y=>Math.abs(pin[1]-y)<EPS))
  throw RangeError('D33 original theoretical pin elevation must remain Y5.5 or Y6.5');
 const outward=plane==='x'?[0,0,side]:[side,0,0];
 const origin=pin.map((v,i)=>v-.5+outward[i]*offset);
 const axes=Object.freeze([[1,0,0],[0,1,0],[0,0,1]].map(a=>Object.freeze(a)));
 const world=p=>p.map((v,i)=>v+origin[i]);
 const obbs=sourceBoxes.map((b,i)=>Object.freeze({ownerPart:i,
  center:Object.freeze(world([(b[0]+b[3])/2,(b[1]+b[4])/2,(b[2]+b[5])/2])),
  axes,half:Object.freeze([(b[3]-b[0])/2,(b[4]-b[1])/2,(b[5]-b[2])/2])}));
 const bounds=Object.freeze({min:Object.freeze([0,1,2].map(i=>Math.min(...sourceBoxes.map(b=>b[i]+origin[i])))),
  max:Object.freeze([0,1,2].map(i=>Math.max(...sourceBoxes.map(b=>b[i+3]+origin[i]))))});
 return Object.freeze({format:'mythwrought.builder-d.d33.unregistered-exact-id62-outboard-cheek.v1',
  sourceOwnerId:62,sourceOriginalBoxes:3,pin:Object.freeze([...pin]),plane,side,
  offset,origin:Object.freeze(origin),ownerOBBs:Object.freeze(obbs),bounds,
  transform:world,sourcePartGeometryChanged:false,sourceVertexColorsChanged:false,
  sourceGridPlacementProven:false,sourceJoineryRated:false,fullCollisionOwnerRegistered:false,
  actualJointFastenerExists:false,constructionAllowed:false});
}
const overlap=(a,b)=>a.ownerOBBs.some(x=>b.ownerOBBs.some(y=>d31OBBsOverlap(x,y)));
export function auditD33ClearanceOnlyPinPort(node,incidentMembers,sourcePostBoxes,{
 plane='x',offset=.7,cutback=.45,sourceCell=null,maxIncident=8
}={}){
 if(!node||typeof node.id!=='string'||!finite3(node.worldAt)||
    !Array.isArray(incidentMembers)||incidentMembers.length<2||
    incidentMembers.length>maxIncident||!Number.isSafeInteger(maxIncident)||
    maxIncident<2||maxIncident>8||!Number.isFinite(cutback)||cutback<0||cutback>.45||
    (sourceCell!==null&&typeof sourceCell!=='function'))
  throw TypeError('D33 source-pinned incident graph, trim or reader invalid');
 const pin=node.worldAt,
  left=deriveD33UnregisteredSourcePostCheek(pin,plane,-1,sourcePostBoxes,{offset}),
  right=deriveD33UnregisteredSourcePostCheek(pin,plane,1,sourcePostBoxes,{offset});
 if(overlap(left,right))throw Error('D33 original ID62 paired cheeks themselves overlap');
 const clipped=[];let ownerTypes=[];
 for(const row of incidentMembers){
  if(!row||!row.shape||!row.member||
     row.member.from!==node.id&&row.member.to!==node.id)
   throw Error('D33 incident member not part of source-authenticated original node');
  const g=row.shape,t=Math.min(cutback,(g.centerlineLength??Math.hypot(...g.start.map((v,i)=>v-g.end[i])))/2-.035);
  if(!(t>=0))throw Error('D33 member too short for source-preserving joint CSG');
  const c=clipD32OriginalOwnerAxially(g,t,t);
  clipped.push(c);ownerTypes.push(g.sourceOwnerId);
 }
 let residual=0,originalOverlap=0,postMember=0,sourceCollisions=0;
 for(let i=0;i<clipped.length;i++){
  for(let j=i+1;j<clipped.length;j++){
   if(overlap(incidentMembers[i].shape,incidentMembers[j].shape))originalOverlap++;
   if(overlap(clipped[i],clipped[j]))residual++;
  }
  if(overlap(left,clipped[i]))postMember++;
  if(overlap(right,clipped[i]))postMember++;
 }
 if(sourceCell){for(const cheek of [left,right]){
  const lo=cheek.bounds.min.map(v=>Math.floor(v+EPS)),hi=cheek.bounds.max.map(v=>Math.ceil(v-EPS)-1);
  let budget=0;
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   if(++budget>96)throw RangeError('D33 authentic source-cell intersection budget');
   if(sourceCell(x,y,z)&&d31PreviewHitsAABB(cheek,[x,y,z],[x+1,y+1,z+1]))sourceCollisions++;
  }
 }}
 return Object.freeze({nodeId:node.id,sourceNode:Object.freeze([...pin]),
  originalSourceOwnerIds:Object.freeze(ownerTypes),incidentCount:clipped.length,
  totalIncidentPairs:clipped.length*(clipped.length-1)/2,
  originalSourceOwnerOverlappingPairs:originalOverlap,
  remainingMemberIntersections:residual,ownerPostToMemberIntersections:postMember,
  originalAuthoredCellIntersections:sourceCollisions,
  freeOutboardCheekEnvelope:postMember===0&&sourceCollisions===0&&residual===0,
  bothCandidateCheeks:Object.freeze([left,right]),
  clippedOriginalMembers:Object.freeze(clipped),
  authenticPostShapeDerivedWithoutRecolor:true,
  intentionalOwnerId62NotALoadRatedPin:true,
  zeroOverlapDoesNotEstablishPositiveAreaContact:true,
  originalD32EndCapSourceMeshUnimplemented:true,
  noPositiveAreaRatedJointTransfer:true,sourceOwnerRegisteredVariant:false,
  actualJoinedConstructionApproved:false});
}
export function sampleD33OriginalOwnerMeshAndRay(cheek,authenticMesh,{maxDistance=4}={}){
 if(cheek?.sourceOwnerId!==62||!Number.isFinite(maxDistance)||maxDistance<=0||maxDistance>8)
  throw TypeError('D33 original owner mesh sample invalid');
 const visual=d31TransformOriginalPack2Mesh(cheek,authenticMesh),
  side=cheek.plane==='x'?[0,0,cheek.side]:[cheek.side,0,0],
  from=cheek.pin.map((v,i)=>v+side[i]*(cheek.offset+1.5)),dir=side.map(v=>-v),
  collider=d31RayOwnerPreview(cheek,from,dir,maxDistance),
  rendered=d31RayPreviewTriangles(visual,from,dir,maxDistance);
 if(collider===null||rendered===null||Math.abs(collider-rendered)>.004)
  throw Error('D33 source-ID62 physical owner mesh/picking disagreement');
 return Object.freeze({originalOwnerId:62,originalSourceColorArrayPreserved:true,
  exactOriginalSourceTriangleCount:authenticMesh.indices.length/3,
  previewBytes:visual.byteLength,rayDelta:Math.abs(collider-rendered),
  originalVertexColorsUnchanged:true,partOwnershipUnchanged:true,
  trueLiveRuntimePickingAccepted:false,sourceEndCapsApproved:false});
}
