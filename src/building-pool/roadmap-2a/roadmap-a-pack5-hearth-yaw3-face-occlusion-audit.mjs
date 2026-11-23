/**
 * Roadmap A ORIGINAL Pack5 hearth-running-bond rotation 3:
 * the 208 previously authenticated BOTH-HIT source distance warnings are
 * traced to exact nearest physical box *intervals*, renderer-world Float32
 * triangle faces, ray-facing orientation, source seam/tangency and whether
 * a triangle's ray contact is already inside another authored physical box.
 *
 * This models source analytic depth ONLY. It does not observe WebGL raster
 * coverage, draw-order, depth-test precision, back-face culling, in-game HUD,
 * non-air terrain or an iPhone. NO game files, saved worlds or art modified.
 */
import {readFileSync} from 'node:fs';
import {forwardVector} from '../../camera.mjs';
import {rotateLocalBox} from '../../block-packs/pack-5/fixture.mjs';
import {originalTriangleBarycentric} from './roadmap-a-pack5-exact-r3-edge-precision-autopsy.mjs';
import {
 ORIGINAL_HEARTH_YAW3_SOURCE,buildOriginalHearthYaw3ReadOnlyLayer,
 attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners,
 auditOriginalHearthYaw3StrictWorldRayGrid
} from './roadmap-a-pack5-hearth-yaw3-strict-world-ray-audit.mjs';

const ensure=(x,msg)=>{if(!x)throw Error('Roadmap A original hearth yaw3 source first-face ownership: '+msg);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[
 a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]
];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,t)=>a.map(v=>v*t);
const round=x=>Math.round(x*1e6)/1e6;
const same=(a,b,tol=2e-7)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=tol;

export const HEARTH_SOURCE_FACE_STUDY=Object.freeze({
 symbolicId:'pack5:080',variant:'hearth-running-bond',yaw:3,
 anchor:Object.freeze([3,14,0]),eye:Object.freeze([.5,13.55,.5]),
 sampleOffsets:Object.freeze([-.000002,0,.000002]),
 maxRayReach:6,firstFaceProbeDistance:1e-5,
 exactPreviousSourceStrictTwoHitWarnings:208,
 exactPreviousSourceDifferentBoxOwners:97,
 exactPreviousSourceSameBoxOwners:111,
 exactPreviousSourceSelectionNearTangentialSeam:93
});
function coords(source,axis){
 const vals=new Set([.02,.03,.035,.065,.1,.231,.5,.535,.58,.91,.97,.98]);
 for(const art of source)for(const x of [art[axis],art[axis+3]])
  if(x>=0&&x<=1)vals.add(round(x));
 const sorted=[...vals].sort((a,b)=>a-b),step=Math.max(1,Math.floor(sorted.length/28));
 return sorted.filter((v,i)=>v>=.01&&v<=.99&&i%step===0).slice(0,30);
}
function unitRay(eye,aim){
 const d=minus(aim,eye),yaw=Math.atan2(d[0],d[2]),
  pitch=Math.atan2(d[1],Math.hypot(d[0],d[2]));
 const vector=forwardVector(yaw,pitch),length=Math.hypot(...vector);
 ensure(Number.isFinite(length)&&length>0,'finite source camera direction');
 return {yaw,pitch,vector,unit:vector.map(v=>v/length)};
}
/** The ORIGINAL exact double-AABB slab geometry, independent of original
 * construction layer. Entry/exit is retained for physical thickness.
 */
export function originalSourceBoxInterval(eye,dir,box){
 ensure(Array.isArray(eye)&&eye.length===3&&
  Array.isArray(dir)&&dir.length===3&&
  Array.isArray(box)&&box.length===6&&
  [...eye,...dir,...box].every(Number.isFinite)&&
  [0,1,2].every(i=>box[i]<box[i+3])&&
  Math.hypot(...dir)>0,'valid physical ray/box interval');
 const length=Math.hypot(...dir),v=dir.map(n=>n/length);
 let low=-Infinity,high=Infinity,entryAxis=null;
 for(let i=0;i<3;i++){
  if(Math.abs(v[i])<1e-12){
   if(eye[i]<box[i]||eye[i]>box[i+3])return null;
   continue;
  }
  const a=(box[i]-eye[i])/v[i],b=(box[i+3]-eye[i])/v[i],
   nextLo=Math.min(a,b),nextHi=Math.max(a,b);
  if(nextLo>low){low=nextLo;entryAxis=i;}
  high=Math.min(high,nextHi);
  if(high<low)return null;
 }
 if(high<0)return null;
 const enter=Math.max(0,low);
 return {enter,exit:high,throughThickness:Math.max(0,high-enter),
  entryAxis,entryNormalDirection:entryAxis===null?null:
   v[entryAxis]>0?'-axis':'+axis'};
}
const sourceBoxFirst=(eye,unit,boxes)=>{
 let first=null;
 for(let i=0;i<boxes.length;i++){
  const iv=originalSourceBoxInterval(eye,unit,boxes[i]);
  if(iv&&(first===null||iv.enter<first.distance))
   first={distance:iv.enter,boxIndex:i,...iv};
 }
 return first;
};
const triangleCorners=(staged,tri)=>{
 const i=tri*27;
 return [[staged[i],staged[i+1],staged[i+2]],
 [staged[i+9],staged[i+10],staged[i+11]],
 [staged[i+18],staged[i+19],staged[i+20]]];
};
function originalStrictFirstFace(eye,unit,stage){
 let first=null;
 for(let tri=0;tri<stage.length/27;tri++){
  const [a,b,c]=triangleCorners(stage,tri);
  const hit=originalTriangleBarycentric(eye,unit,a,b,c);
  if(!hit||!hit.strictlyInsideTriangle||hit.t>6)continue;
  if(!first||hit.t<first.distance){
   const normal=cross(minus(b,a),minus(c,a));
   first={distance:hit.t,triangleIndex:tri,boxIndex:Math.floor(tri/12),
    boxFaceIndex:Math.floor((tri%12)/2),triangleWithinBoxFace:tri%2,
    minimumBarycentric:hit.minimumBarycentric,
    normalDotIncomingRay:dot(normal,unit),
    faceTowardEye:dot(normal,unit)<0,
    faceAwayFromEye:dot(normal,unit)>0};
  }
 }
 return first;
}
/** No epsilon expansion. Strict INSIDE means a point must lie more than the
 * stated 1e-9 world units inside EVERY boundary of the original authored box.
 */
function boxesContaining(point,boxes,{exclude=-1,inset=1e-9}={}){
 const owners=[];
 boxes.forEach((box,index)=>{
  if(index===exclude)return;
  if([0,1,2].every(i=>point[i]>box[i]+inset&&point[i]<box[i+3]-inset))
   owners.push(index);
 });
 return owners;
}
function distanceToBox(point,box){
 const dx=[0,1,2].map(i=>Math.max(box[i]-point[i],0,point[i]-box[i+3]));
 return Math.hypot(...dx);
}
function transverseClearance(eye,unit,box,entry){
 if(!entry||entry.entryAxis===null)return null;
 const point=add(eye,mul(unit,entry.distance));
 const margin=Math.min(...[0,1,2].filter(i=>i!==entry.entryAxis).flatMap(i=>[
  Math.abs(point[i]-box[i]),Math.abs(point[i]-box[i+3])
 ]));
 return {margin,seamWithin2e6:margin<=2e-6};
}
export function auditOriginalHearthYaw3SourceFirstFaceOwnership({includeFullWarningRows=false}={}){
 ensure(typeof includeFullWarningRows==='boolean','invalid witness option');
 const c=HEARTH_SOURCE_FACE_STUDY,original=buildOriginalHearthYaw3ReadOnlyLayer();
 const reference=auditOriginalHearthYaw3StrictWorldRayGrid();
 ensure(original.trueWorldStage.length/9===1512&&original.boxes.length===42&&
  original.layer.count()===1,'prior original full 42-box geometry changed');
 const authored=attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners(original);
 ensure(authored.actualWorldGpuVerticesChecked===1512,
  'authentic original source vertex identity changed');
 const source=original.asset.descriptor.art.map(a=>rotateLocalBox(a.box,c.yaw));
 const yy=coords(source,1),zz=coords(source,2);
 ensure(yy.length===29&&zz.length===30,'prior authored grid y/z points changed');
 const totals={rays:0,strictSourceHits:0,originalDetailedHits:0,bothHitWarnings:0,
  selectedBoxAhead:0,triangleAhead:0,samePhysicalBox:0,differentPhysicalBox:0,
  nearOriginalSelectedBoxTangentialSeam:0,farFromOriginalSelectedBoxTangentialSeam:0,
  exactOriginalSelectionVsIndependentFirstBoxDisagreement:0,
  actualStrictMeshVsOriginalSelectionHitMissDisagreement:0,
  selectedBoxThinRayIntersectionUnder1e5:0,
  selectedBoxRobustRayIntersectionAtLeast1e5:0,
  firstStrictTriangleFacesTowardEye:0,firstStrictTriangleFacesAwayFromEye:0,
  strictTrianglePointWithinOtherSourceBoxBeforeContact:0,
  strictTrianglePointWithinSameSourceBoxBeforeContact:0,
  strictTrianglePointWithoutBoxInteriorBeforeContact:0,
  firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e5:0,
  firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e7:0,
  triangleAheadAndNoPriorAuthoredBoxInterior:0,
  triangleAheadAndPriorAuthoredBoxInterior:0,
  selectedAheadButTriangleAlreadyInsideBoxUnion:0,
  selectedAheadAndTriangleOutsideAllBoxInteriors:0,
  warningGroups:0,threeShiftsWarnSameFaceOwner:0,
  maxPhysicalIntervalThickness:0,
  maxTriangleContactDistanceOutsideOwnAuthoredBox:0};
 const examples={differentBox:[],sameBox:[],triangleAhead:[],
  selectionAhead:[],priorBoxInterior:[],unoccludedTriangle:[]};
 const fullWarningRows=[];
 const rayGroup=new Map();
 for(let iy=0;iy<yy.length;iy++)for(let iz=0;iz<zz.length;iz++){
  const group=[];
  for(const shift of c.sampleOffsets){
   const localTarget=[0,yy[iy]+shift,zz[iz]],aim=add([...c.anchor],localTarget),
    {yaw,pitch,vector,unit}=unitRay([...c.eye],aim);
   const originalSelection=original.layer.raycast([...c.eye],vector,6)?.distance??null,
    // Original fixture normalizes forwardVector ONCE. Original earlier
    // source strict triangle comparator used RAW forwardVector, not a
    // mathematically unit-normalized vector: preserve those two paths.
    firstBox=sourceBoxFirst([...c.eye],vector,original.boxes),
    triangle=originalStrictFirstFace([...c.eye],vector,original.trueWorldStage),
    selection=firstBox?.distance??null,strict=triangle?.distance??null;
   totals.rays++;
   ensure(same(selection,originalSelection),
    'original layer raycast does not agree with independent first original authored box');
   if(!same(selection,originalSelection))
    totals.exactOriginalSelectionVsIndependentFirstBoxDisagreement++;
   if((strict===null)!==(selection===null))
    totals.actualStrictMeshVsOriginalSelectionHitMissDisagreement++;
   if(strict!==null)totals.strictSourceHits++;
   if(selection!==null)totals.originalDetailedHits++;
   if(strict===null||selection===null||Math.abs(strict-selection)<=2e-7){
    group.push(null);continue;
   }
   totals.bothHitWarnings++;
   const differentOwner=firstBox.boxIndex!==triangle.boxIndex;
   if(differentOwner)totals.differentPhysicalBox++;
   else totals.samePhysicalBox++;
   if(strict>selection)totals.selectedBoxAhead++;
   else totals.triangleAhead++;
   const seam=transverseClearance([...c.eye],unit,original.boxes[firstBox.boxIndex],firstBox);
   ensure(seam,'source selected box had no transverse face');
   if(seam.seamWithin2e6)totals.nearOriginalSelectedBoxTangentialSeam++;
   else totals.farFromOriginalSelectedBoxTangentialSeam++;
   if(firstBox.throughThickness<=1e-5)totals.selectedBoxThinRayIntersectionUnder1e5++;
   else totals.selectedBoxRobustRayIntersectionAtLeast1e5++;
   totals.maxPhysicalIntervalThickness=Math.max(totals.maxPhysicalIntervalThickness,firstBox.throughThickness);
   if(triangle.faceTowardEye)totals.firstStrictTriangleFacesTowardEye++;
   if(triangle.faceAwayFromEye)totals.firstStrictTriangleFacesAwayFromEye++;
   const triangleContact=add([...c.eye],mul(vector,strict));
   const pointBefore=add([...c.eye],mul(vector,Math.max(0,strict-c.firstFaceProbeDistance)));
   const priorSame=boxesContaining(pointBefore,original.boxes,{exclude:-1}).includes(triangle.boxIndex);
   const priorOther=boxesContaining(pointBefore,original.boxes,{exclude:triangle.boxIndex});
   if(priorSame)totals.strictTrianglePointWithinSameSourceBoxBeforeContact++;
   if(priorOther.length)totals.strictTrianglePointWithinOtherSourceBoxBeforeContact++;
   if(!priorSame&&!priorOther.length)
    totals.strictTrianglePointWithoutBoxInteriorBeforeContact++;
   if(strict>selection){
    if(priorSame||priorOther.length)
     totals.selectedAheadButTriangleAlreadyInsideBoxUnion++;
    else totals.selectedAheadAndTriangleOutsideAllBoxInteriors++;
   }else if(priorSame||priorOther.length)
    totals.triangleAheadAndPriorAuthoredBoxInterior++;
   else totals.triangleAheadAndNoPriorAuthoredBoxInterior++;
   const ownContactSeparation=distanceToBox(triangleContact,original.boxes[triangle.boxIndex]);
   if(ownContactSeparation>1e-5)totals.firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e5++;
   if(ownContactSeparation>1e-7)totals.firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e7++;
   totals.maxTriangleContactDistanceOutsideOwnAuthoredBox=Math.max(
    totals.maxTriangleContactDistanceOutsideOwnAuthoredBox,ownContactSeparation);
   const witness={localTarget,yaw,pitch,originalDetailedDistance:selection,
    strictOriginalGpuWorldTriangleDistance:strict,
    signedTriangleMinusSelectionDistance:strict-selection,
    originalSelectionSourceBox:firstBox.boxIndex,
    originalTriangleSourceBox:triangle.boxIndex,
    triangleIndex:triangle.triangleIndex,
    boxFaceIndex:triangle.boxFaceIndex,
    sourceStrictTriangleMinimumBarycentric:triangle.minimumBarycentric,
    authoredSelectedBoxThicknessAlongRay:firstBox.throughThickness,
    originalSelectedBoxTangentialClearance:seam.margin,
    originalSelectedBoxNearTangentialEdge:seam.seamWithin2e6,
    sourceTriangleNormalDotRay:triangle.normalDotIncomingRay,
    rayInsideSameAuthoredBoxBeforeTriangle:priorSame,
    otherSourceBoxesContainingRayBeforeTriangle:priorOther.slice(0,8),
    originalTriangleHitpointOutsideOwnAuthoredBoxDistance:ownContactSeparation,
    mathematicallyStrictSourceOnly:true,actualGpuRasterPixelMeasured:false};
   if(includeFullWarningRows)fullWarningRows.push({...witness,
     originalGridYIndex:iy,originalGridZIndex:iz,originalOffsetSourceY:shift});
   const groups=[
     differentOwner?'differentBox':'sameBox',
    strict<selection?'triangleAhead':'selectionAhead',
    priorSame||priorOther.length?'priorBoxInterior':'unoccludedTriangle'];
   for(const name of groups)if(examples[name].length<8)
    examples[name].push(witness);
   group.push({selectionBox:firstBox.boxIndex,
    triangleBox:triangle.boxIndex,triangleFace:triangle.boxFaceIndex,
    sign:Math.sign(strict-selection)});
  }
  rayGroup.set(iy+','+iz,group);
 }
 for(const three of rayGroup.values()){
  if(three.some(x=>x!==null))totals.warningGroups++;
  if(three.length===3&&three.every(x=>x!==null)&&
   three.every(x=>x.selectionBox===three[0].selectionBox&&
    x.triangleBox===three[0].triangleBox&&
    x.triangleFace===three[0].triangleFace&&x.sign===three[0].sign))
   totals.threeShiftsWarnSameFaceOwner++;
 }
 ensure(totals.rays===2610&&totals.strictSourceHits===2472&&
  totals.originalDetailedHits===2472&&totals.bothHitWarnings===208&&
  totals.differentPhysicalBox===97&&totals.samePhysicalBox===111&&
  totals.selectedBoxAhead===139&&totals.triangleAhead===69&&
  totals.nearOriginalSelectedBoxTangentialSeam===93&&
  totals.farFromOriginalSelectedBoxTangentialSeam===115&&
  totals.exactOriginalSelectionVsIndependentFirstBoxDisagreement===0&&
  totals.actualStrictMeshVsOriginalSelectionHitMissDisagreement===0,
  'source first-face ownership does not match prior authentic 208-warning original evidence');
 ensure(totals.selectedBoxThinRayIntersectionUnder1e5+
  totals.selectedBoxRobustRayIntersectionAtLeast1e5===208&&
  totals.firstStrictTriangleFacesTowardEye+totals.firstStrictTriangleFacesAwayFromEye===208&&
  totals.selectedAheadButTriangleAlreadyInsideBoxUnion+
  totals.selectedAheadAndTriangleOutsideAllBoxInteriors===139&&
  totals.triangleAheadAndPriorAuthoredBoxInterior+
  totals.triangleAheadAndNoPriorAuthoredBoxInterior===69,
  'original source visibility/face/box interval classifications incomplete');
 ensure(reference.strictDistanceWarningsOver2e7===totals.bothHitWarnings&&
  reference.distanceDifferentAuthoredSourceBoxes===totals.differentPhysicalBox&&
  reference.distanceAwayFromAuthoredTangentialSelectionSeam===
   totals.farFromOriginalSelectedBoxTangentialSeam,
  'original previously accepted reference source warning ownership changed');
 return {schema:'mythwrought.roadmap-a.pack5-original-hearth-yaw3-nearest-source-face-occlusion.v1',
  originalSourceIdentity:{symbol:c.symbolicId,variant:c.variant,rotation:c.yaw,
   anchor:[...c.anchor],researchEye:[...c.eye]},
  sourceShaContractGuarded:true,originalGpuWorldFloat32Vertices:1512,
  originalAuthenticatedWorldGpuBytes:54432,originalAuthoredPhysicalBoxes:42,
  originalRayGrid:{originalYLevels:yy.length,originalZLevels:zz.length,
   originalOffsets:[...c.sampleOffsets],total:totals.rays},
  totals,examples,
   ...(includeFullWarningRows?{fullWarningRows}:{}),
   interpretation:{
   insideOtherBoxBeforeTriangleIsSourceVolumeOcclusionOnlyNotGPUVisibility:true,
   strictTrianglePointMayBeOnAuthoredFaceButNotRenderedFragment:true,
   originalShaderCullingAndDepthNotExecuted:true,
   originalTerrainOcclusionNotTestedInAllAirHost:true,
   noRealUserWorldOrSavedStateReadOrWritten:true,
   noCreatorA5ArtYawOrStructuralDecision:true,
   noProductionPlayerMineOrRaycasterChange:true,
   noActualIphoneOrBrowserRunNow:true,
   noMergeOrDeploy:true
  }};
}
export function attestOriginalNearestFaceSourceOwnership(){
 const construction=readFileSync(new URL('../../pack5-integration/construction-layer.mjs',import.meta.url),'utf8');
 const originalMesh=readFileSync(new URL('../../block-packs/pack-5/architectural-surfaces.mjs',import.meta.url),'utf8');
 const originalFixture=readFileSync(new URL('../../block-packs/pack-5/fixture.mjs',import.meta.url),'utf8');
 const required=[
  [construction,'const translated=new Float32Array(result.positions.length);'],
  [construction,'return obstruction&&obstruction.distance<=hit.distance+1e-8?null:hit;'],
  [construction,'const unit=direction.map(v=>v/length);'],
  [originalMesh,'for(const quad of faces){'],
  [originalMesh,'indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;'],
  [originalMesh,"'pack5:080':['hearth-running-bond','kiln-soldier-course']"],
  [originalFixture,'const unit=direction.map(v=>v/length);']
 ];
 for(const [src,needle] of required)
  ensure(src.includes(needle),'unchanged original source proof changed: '+needle);
 return {unchangedOriginalSourceContracts:required.length,
  originalTriangleBoxGroupingTwelveTrianglesPerAuthoredBox:true,
  sourceMathAndGpuPixelEvidenceAreNeverEquated:true};
}


/** Original read-only source ray evaluator on genuine hearth/yaw3 Float32
 * renderer-world mesh and original Pack5 detailed 6-block raycast.
 * This neither reads/writes user worlds nor observes GPU pixels. */
export function createOriginalHearthYaw3SourceFaceProbe(){
 const c=HEARTH_SOURCE_FACE_STUDY,source=buildOriginalHearthYaw3ReadOnlyLayer();
 ensure(source.boxes.length===42&&source.trueWorldStage.length/9===1512,
  'original authenticated source mesh changed');
 return function inspect(localTarget){
  ensure(Array.isArray(localTarget)&&localTarget.length===3&&
   localTarget.every(Number.isFinite)&&localTarget[0]===0&&
   localTarget[1]>=-.01&&localTarget[1]<=1.01&&
   localTarget[2]>=-.01&&localTarget[2]<=1.01,
   'invalid bounded source-only local aim');
  const eye=[...c.eye],{yaw,pitch,vector,unit}=unitRay(eye,add([...c.anchor],localTarget)),
   original=source.layer.raycast(eye,vector,6)?.distance??null,
   box=sourceBoxFirst(eye,vector,source.boxes),
   triangle=originalStrictFirstFace(eye,vector,source.trueWorldStage),
   selected=box?.distance??null,rendered=triangle?.distance??null;
  ensure(same(original,selected),'source probe original physical box parity drift');
  if(!box||!triangle)return {localTarget,yaw,pitch,selected,rendered,
   sameHitMembership:box===null&&triangle===null,sourceOnly:true};
  const seam=transverseClearance(eye,unit,source.boxes[box.boxIndex],box);
  ensure(seam,'original selected physical box seam unavailable');
  return {localTarget,yaw,pitch,selected,rendered,
   signedTriangleMinusSelection:rendered-selected,
   originalDetailedSelectionBox:box.boxIndex,
   originalStrictTriangleBox:triangle.boxIndex,
   originalStrictTriangleFace:triangle.boxFaceIndex,
   originalStrictBarycentricMinimum:triangle.minimumBarycentric,
   originalNearestStrictTriangleFacesEye:triangle.faceTowardEye,
   originalSelectedBoxThickness:box.throughThickness,
   originalSelectedTangentialClearance:seam.margin,
   sameHitMembership:true,sourceOnly:true,
   actualGPUOrOriginalWorldPixelsMeasured:false};
 };
}
