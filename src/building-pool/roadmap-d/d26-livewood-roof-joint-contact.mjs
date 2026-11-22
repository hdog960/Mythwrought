// MYTHWROUGHT D26: exact original Pack2 ID61/62 geometric interface to an
// ordinary original-game WOOD full voxel at Y7. READ ONLY. The Blueprint
// 'live:wood' alias remains UNREGISTERED: contact != structural load,
// collision certification, renderer, placement, or release authorization.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf,pack2BodyIntersects} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
const EPS=1e-7,KEY=p=>p.join(','),K=(x,y,z)=>`${x},${y},${z}`;
const R=new Set(['wall','column','partition']);
const V=new Set(['foundation','floor','wall','column','partition','beam']);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const valid=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const intersection=(a,b,axis)=>Math.min(a[axis+3],b[axis+3])-Math.max(a[axis],b[axis]);
const volume=(a,b)=>[0,1,2].every(i=>intersection(a,b,i)>EPS);
const linked=(a,b)=>{
 const overlaps=[0,1,2].map(i=>intersection(a,b,i));
 return overlaps.every(x=>x>=-EPS)&&overlaps.filter(x=>x>EPS).length>=2;
};
function subtract(box,blade){
 if(!volume(box,blade))return [box];
 const crop=[0,1,2].map(i=>[Math.max(box[i],blade[i]),Math.min(box[i+3],blade[i+3])]);
 const c=[...box],out=[];
 for(let a=0;a<3;a++){
  if(c[a]<crop[a][0]-EPS){const p=[...c];p[a+3]=crop[a][0];out.push(p);c[a]=crop[a][0];}
  if(c[a+3]>crop[a][1]+EPS){const p=[...c];p[a]=crop[a][1];out.push(p);c[a+3]=crop[a][1];}
 }
 return out;
}
function topUnionArea(parts){
 const tops=parts.filter(b=>Math.abs(b[4]-1)<=EPS);
 const xs=[...new Set(tops.flatMap(b=>[b[0],b[3]]))].sort((a,b)=>a-b);
 const zs=[...new Set(tops.flatMap(b=>[b[2],b[5]]))].sort((a,b)=>a-b);
 let sum=0;
 for(let x=0;x<xs.length-1;x++)for(let z=0;z<zs.length-1;z++){
  const mx=(xs[x]+xs[x+1])/2,mz=(zs[z]+zs[z+1])/2;
  if(tops.some(b=>mx>b[0]+EPS&&mx<b[3]-EPS&&mz>b[2]+EPS&&mz<b[5]-EPS))
   sum+=(xs[x+1]-xs[x])*(zs[z+1]-zs[z]);
 }
 return sum;
}
function physicalInterface(axis){
 const rotation=axis==='x'?0:axis==='z'?1:null;
 if(rotation===null)throw Error('D26 beam axis must be x/z');
 const beam=pack2Shape(61,rotation).boxes,post=pack2Shape(62).boxes;
 const registered=pack2ShapeOf(61,{rotation}).boxes;
 const registeredPost=pack2ShapeOf(62,{rotation:0}).boxes;
 if(BLOCK.WOOD!==4||beam.length!==3||post.length!==3||
    JSON.stringify(beam)!==JSON.stringify(registered)||
    JSON.stringify(post)!==JSON.stringify(registeredPost)||
    ![...beam,...post].every(valid)||
    pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22)
  throw Error('D26 original Pack2/wood collision owner changed');
 const direct=beam.some(b=>Math.abs(b[4]-1)<=EPS);
 let cut=[];
 for(let i=0;i<post.length;i++){
  let parts=[post[i]];
  for(const b of beam)parts=parts.flatMap(p=>subtract(p,b));
  cut.push(...parts.map(box=>({box,postPart:i})));
 }
 if(cut.length<3||cut.length>18||cut.some(p=>beam.some(b=>volume(p.box,b))))
  throw Error('D26 connector collided with original ID61 beam');
 const all=[...beam,...cut.map(p=>p.box)],seen=new Set(),stack=[0];
 while(stack.length){const i=stack.pop();if(seen.has(i))continue;seen.add(i);
  for(let j=0;j<all.length;j++)if(!seen.has(j)&&linked(all[i],all[j]))stack.push(j);
 }
 if(seen.size!==all.length)throw Error('D26 original connector has detached material');
 const topArea=topUnionArea(cut.map(p=>p.box));
 if(topArea<=EPS||direct)throw Error('D26 no novel exact Pack2 connector-to-WOOD face');
 const lo=axis==='x'?0:2,hi=axis==='x'?3:5;
 const faceArea=at=>beam.reduce((sum,b)=>sum+((Math.abs(b[at]- (at===lo?0:1))<=EPS)?
   (b[4]-b[1])*(b[axis==='x'?5:3]-b[axis==='x'?2:0]):0),0);
 if(faceArea(lo)<=EPS||faceArea(hi)<=EPS)throw Error('D26 source beam cannot join wall or neighbor end faces');
 return Object.freeze({axis,rotation,directBeamRoofContact:direct,
  connectorPieces:Object.freeze(cut.map(p=>Object.freeze({box:Object.freeze(p.box),postPart:p.postPart}))),
  originalBeamBoxes:beam,sourceTopWoodFaceUnionArea:topArea,
  originalBeamNearEndFaceArea:faceArea(lo),originalBeamFarEndFaceArea:faceArea(hi),
  exactPack2ID61And62OwnerShape:true,noPositiveVolumeBeamPostOverlap:true,
  allCutPiecesConnectedToBeam:true,actualWoodRoofLoadCertified:false});
}
const face=Object.freeze([
 {n:[-1,0,0],v:[0,4,7,3]},{n:[1,0,0],v:[1,2,6,5]},
 {n:[0,-1,0],v:[0,1,5,4]},{n:[0,1,0],v:[3,7,6,2]},
 {n:[0,0,-1],v:[0,3,2,1]},{n:[0,0,1],v:[4,5,6,7]}
]);
function sampleMesh(at,parts){
 const p=pack2Asset(62).palette,cols=[p.base,p.grain,p.edge];
 const out=new Float32Array(parts.length*36*10);let t=0;
 for(const {box:b,postPart} of parts){
  const [x,y,z,X,Y,Z]=b,corners=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
  const col=cols[postPart];if(!Array.isArray(col)||col.length!==3)throw Error('D26 original palette missing');
  for(const f of face)for(const j of [f.v[0],f.v[1],f.v[2],f.v[0],f.v[2],f.v[3]]){
   for(let k=0;k<3;k++)out[t++]=corners[j][k]+at[k];
   for(const v of f.n)out[t++]=v;
   for(const v of col)out[t++]=v;
   out[t++]=1;
  }
 }
 if(t!==out.length)throw Error('D26 sample mesh stride mismatch');
 return out;
}
/** Audit original D19, D22 and D25 cells without placing anything. */
export function auditD26OriginalWoodRoofJoints(b,primary,secondary,d25,{maxPreviewSites=2}={}){
 if(!Number.isSafeInteger(maxPreviewSites)||maxPreviewSites<0||maxPreviewSites>8)
  throw RangeError('D26 bounded source preview budget');
 if(!b||b.integrated!==false||b.worldPlaced!==false||b.creatorApproved!==false||
   !b.id||!Array.isArray(b.cells)||!Array.isArray(b.navigation)||
   d25?.blueprintId!==b.id||d25.actualRoofMaterial!=='live:wood'||
   d25.realPack2ToActualLiveWoodPhysicalContactCertified!==false||
   d25.actualLiveWoodGravityLoadAccepted!==false)
  throw Error('D26 requires unplaced authentic D25 unapproved live:wood roof source');
 const src=new Map(),nav=new Set();
 for(const c of b.cells){if(!point(c.at)||src.has(KEY(c.at)))throw Error('D26 duplicate original cell');src.set(KEY(c.at),c);}
 let authoredWeather=0;
 for(const c of b.cells)if(c.at[1]===7&&c.role==='roof'&&c.feature==='weather-plane'){
  if(c.asset!=='live:wood')throw Error('D26 altered original roof material');
  authoredWeather++;
 }
 if(authoredWeather!==d25.originalRoofCells||authoredWeather<100)
  throw Error('D26 original roof census is not exact D25 source');
 for(const n of b.navigation){if(!point(n.at)||n.mode!=='walk'||nav.has(KEY(n.at)))throw Error('D26 duplicate original walking node');nav.add(KEY(n.at));}
 const get=(x,y,z)=>src.get(K(x,y,z));
 const rooted=p=>point(p)&&p[1]===6&&R.has(get(...p)?.role)&&
  Array.from({length:7},(_,y)=>V.has(get(p[0],y,p[2])?.role)).every(Boolean);
 const spanGroups=[['D19',primary],['D22',secondary],['D25',{
   blueprintId:b.id,proposedTrussSpans:d25.thirdLaneProposedSpans,
   proposedBeamCells:d25.thirdLaneProposedCells}]];
 const used=new Set(),totals={D19:0,D22:0,D25:0},spans={D19:0,D22:0,D25:0};
 const interfaces={x:physicalInterface('x'),z:physicalInterface('z')};
 let possibleContactCount=0,meshBytes=0,firstMeshes=[],navigationOffsets=0,beamOnlyGapCount=0;
 const fingerprint=b.cells.length+'|'+b.navigation.length+'|'+b.cells[0]?.asset;
 for(const [lane,plan] of spanGroups){
  if(plan?.blueprintId!==b.id||!Array.isArray(plan.proposedTrussSpans)||
     !Array.isArray(plan.proposedBeamCells))throw Error('D26 source lane or original ID changed');
  const candidateMap=new Map();
  for(const c of plan.proposedBeamCells){
   if(!point(c.at)||c.at[1]!==6||c.asset!=='pack2:015'||
      (c.candidateId!==undefined&&c.candidateId!==61)||src.has(KEY(c.at))||
      get(c.at[0],7,c.at[2])?.asset!=='live:wood'||used.has(KEY(c.at))||candidateMap.has(KEY(c.at)))
     throw Error('D26 forged candidate, duplicate beam or altered roof material');
   candidateMap.set(KEY(c.at),c);
  }
  const walked=new Set();
  for(const s of plan.proposedTrussSpans){
   if(!Array.isArray(s.points)||s.points.length!==s.spanCells||s.points.length<2||
     s.points.length>12||!rooted(s.bearingStart)||!rooted(s.bearingEnd)||
     s.bothBearingsReachUnbrokenOriginalFoundation!==true||
     !['x','z'].includes(s.axis))throw Error('D26 ungrounded or oversized real source span');
   const axis=s.axis,dx=axis==='x'?1:0,dz=axis==='z'?1:0;
   if(s.bearingEnd[0]!==s.bearingStart[0]+dx*(s.points.length+1)||
      s.bearingEnd[2]!==s.bearingStart[2]+dz*(s.points.length+1))
    throw Error('D26 source beam endpoint continuity invalid');
   const shape=interfaces[axis];spans[lane]++;
   for(let i=0;i<s.points.length;i++){
    const p=s.points[i],c=candidateMap.get(KEY(p));
    if(!point(p)||p[1]!==6||p[0]!==s.bearingStart[0]+dx*(i+1)||
       p[2]!==s.bearingStart[2]+dz*(i+1)||!c||walked.has(KEY(p))||
       (c.orientation&&c.orientation!==(axis==='x'?'north':'east')))
     throw Error('D26 interrupted physical source Pack2 beam run');
    walked.add(KEY(p));used.add(KEY(p));totals[lane]++;
    possibleContactCount++;
    if(!shape.directBeamRoofContact)beamOnlyGapCount++;
    // Compare actual Pack2 gameplay body collision on original Y6 sample versus
    // a representative, explicitly non-certified player-shaped Y2 envelope.
    if(pack2BodyIntersects(61,{rotation:shape.rotation},p,
       {x:p[0]+.5,z:p[2]+.5,feet:2,radius:.3,height:1.8}))navigationOffsets++;
    if(firstMeshes.length<maxPreviewSites){const vertices=sampleMesh(p,shape.connectorPieces);
      meshBytes+=vertices.byteLength;firstMeshes.push(Object.freeze({at:Object.freeze([...p]),
       lane,axis,vertices,bytes:vertices.byteLength,sourceStride:10}));}
   }
  }
  if(walked.size!==candidateMap.size)throw Error('D26 orphan candidate cell has no real source span');
 }
 if(navigationOffsets)throw Error('D26 source ID61 collision entered representative walking envelope');
 if(totals.D19+totals.D22!==d25.originalPrimaryAndSecondaryBeamCells||
    totals.D25!==d25.thirdLaneProposedCells.length||
    spans.D19+spans.D22!==d25.originalPrimaryAndSecondarySpanCount)
  throw Error('D26 original D25 source counts drifted');
 if(fingerprint!==b.cells.length+'|'+b.navigation.length+'|'+b.cells[0]?.asset)
  throw Error('D26 mutated original source');
 return Object.freeze({format:'mythwrought.builder-d.d26.wood-cube-contact-source-only.v1',
  blueprintId:b.id,originalRoofAsset:'live:wood',originalRuntimeWoodBlockId:BLOCK.WOOD,
  originalRuntimeWoodAssumedFullCube:true,unregisteredBlueprintToRuntimeWoodBinding:false,
  originalPack2BeamId:61,originalPack2ConnectorPostId:62,
  originalSpans:Object.freeze(spans),originalBeamCells:Object.freeze(totals),
  verifiedGeometricProposedSites:possibleContactCount,standaloneBeamHasGapAtSites:beamOnlyGapCount,
  proposedCutPostRoofFaceUnionAreaPerSite:interfaces.x.sourceTopWoodFaceUnionArea,
  exactlyOriginalPack2CollisionOwner:true,sourceGeometricJointPossible:possibleContactCount,
  realRuntimeInstalledSleeveCount:0,worldCellChanges:0,allAuthoredNavigationPreserved:true,
  representativeY2BodyCollisions:navigationOffsets,
  sampledSourceMeshCount:firstMeshes.length,sampledSourceMeshBytes:meshBytes,
  sampledSourceMeshBuffers:Object.freeze(firstMeshes),
  actualPlayerPhysicsAndPickingUncertified:true,materialInterfaceRegistered:false,
  actualLiveWoodRoofGravityLoadsCertified:false,
  sourceSpanBearingStrengthCertified:false,originalFullRoofAccepted:false,
  sourceToWorldPlacementAccepted:false,webgl2Accepted:false,installedIphonePwaAccepted:false});
}
