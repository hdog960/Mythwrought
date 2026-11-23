/**
 * Roadmap A -- NEW source-only original brick variant/yaw experiment.
 *
 * Faithful ORIGINAL live Pack5 construction-layer.meshAt() creates WORLD
 * Float32 GPU geometry from a private, read-only all-air host; its raycast()
 * retains actual <=6 block reach and the legacy terrain-occlusion gate.
 *
 * This is deliberately a different authentic unapproved source variant/yaw
 * from actual game R3: hearth-running-bond, yaw THREE. NO world/player saved,
 * no original renderer edits, no scene/PNG/iPhone evidence claimed.
 */
import {readFileSync} from 'node:fs';
import {forwardVector} from '../../camera.mjs';
import {rotateLocalBox,orientedParts} from '../../block-packs/pack-5/fixture.mjs';
import {createPack5ConstructionLayer} from '../../pack5-integration/construction-layer.mjs';
import {resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {pack5TerrainVertices} from '../../pack5-integration/terrain-buffer.mjs';
import {originalTriangleBarycentric,originalR3ActualGpuWorldFloat32Staging,
 pureOriginalRayBoxDistance} from './roadmap-a-pack5-exact-r3-edge-precision-autopsy.mjs';

const must=(ok,msg)=>{if(!ok)throw Error('Roadmap A original hearth yaw3 strict source admission: '+msg);};
const near=(a,b,tol=2e-7)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=tol;
const clampSample=x=>Math.round(x*1e6)/1e6;
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=a=>Math.hypot(...a);
const from=(a,b)=>{const d=sub(b,a);return forwardVector(Math.atan2(d[0],d[2]),Math.atan2(d[1],Math.hypot(d[0],d[2])));};
export const ORIGINAL_HEARTH_YAW3_SOURCE=Object.freeze({
 symbol:'pack5:080',variant:'hearth-running-bond',rotation:3,
 anchor:Object.freeze([3,14,0]),originalR3EyeOnlyAsResearchPose:Object.freeze([.5,13.55,.5]),
 maxDistance:6,originalDepthOcclusionProductionContractMustRemain:true,
 originalStructuralCollisionIsFullCube:true,
 sourceOnlyNoA5VariantOrYawDecision:true
});
const coords=(art,axis)=>{
 const values=new Set([.02,.03,.035,.065,.1,.231,.5,.535,.58,.91,.97,.98]);
 for(const item of art)for(const v of [item[axis],item[axis+3]])
  if(v>=0&&v<=1)values.add(clampSample(v));
 const list=[...values].sort((a,b)=>a-b);
 const step=Math.max(1,Math.floor(list.length/28));
 return list.filter((v,i)=>v>=.01&&v<=.99&&i%step===0).slice(0,30);
};
const pointsOf=(stage,i)=>[
 [stage[i],stage[i+1],stage[i+2]],
 [stage[i+9],stage[i+10],stage[i+11]],
 [stage[i+18],stage[i+19],stage[i+20]]
];
const closestOriginalBox=(eye,ray,boxes)=>{
 const length=norm(ray);must(Number.isFinite(length)&&length>0,'nonfinite source ray');
 const unit=ray.map(x=>x/length);
 let dist=null,index=null;
 for(let k=0;k<boxes.length;k++){
  const d=pureOriginalRayBoxDistance(eye,unit,boxes[k]);
  if(d!==null&&(dist===null||d<dist)){dist=d;index=k;}
 }
 return {distance:dist,index};
};
const separation=(point,boxes)=>{
 let distance=Infinity,index=-1;
 for(let k=0;k<boxes.length;k++){
  const b=boxes[k],axisDistance=[0,1,2].map(i=>
   Math.max(b[i]-point[i],0,point[i]-b[i+3]));
  const d=Math.hypot(...axisDistance);
  if(d<distance){distance=d;index=k;}
 }
 return {distance,index};
};
/**
 * Original source box exact slab *entry* tangential clearance: when a ray
 * enters an original AABB at a tangential corner/edge, selection can report
 * an earlier distance than a STRICT triangle whose barycentric boundary
 * rejects that exact entry surface. No padding, no actual GPU simulation.
 */
function originalAuthoredSlabEntrySeam(eye,ray,box){
 const length=norm(ray),dir=ray.map(v=>v/length);
 let entryT=-Infinity,entryAxis=null;
 for(let a=0;a<3;a++){
  if(Math.abs(dir[a])<1e-12)continue;
  const plane=dir[a]>0?box[a]:box[a+3];
  const t=(plane-eye[a])/dir[a];
  if(t>entryT){entryT=t;entryAxis=a;}
 }
 if(entryAxis===null)return {entryAxis:null,tangentialMargin:null,atSeam:false};
 const point=add(eye,dir.map(v=>v*entryT));
 const margin=Math.min(...[0,1,2].filter(a=>a!==entryAxis).flatMap(a=>[
  Math.abs(point[a]-box[a]),Math.abs(point[a]-box[a+3])
 ]));
 return {entryAxis,tangentialMargin:margin,atSeam:margin<=.000002,
  originalSlabEntryWorldDistance:entryT};
}

/** This source directly uses the unchanged ORIGINAL construction-layer,
 * never a substitute geometry registry, and only a freshly allocated
 * throw-away all-air world. No VoxelWorld/set/localStorage.
 */
export function buildOriginalHearthYaw3ReadOnlyLayer(){
 const v=ORIGINAL_HEARTH_YAW3_SOURCE;
 let readCalls=0;
 const world=Object.freeze({seed:20261122,get(x,y,z){
  must([x,y,z].every(Number.isSafeInteger),'invalid read-only air cell');
  readCalls++;return 0;
 }});
 const layer=createPack5ConstructionLayer(world);
 const placement=layer.place(v.symbol,[...v.anchor],v.rotation,v.variant);
 must(placement.ok===true&&layer.count()===1,'original temporary physical source placement denied');
 const asset=resolvePack5BuilderAsset(v.symbol,v.variant);
 const originalParts=orientedParts(asset.descriptor,v.rotation);
 must(originalParts.length===1&&
  asset.descriptor.attachment==='none'&&
  originalParts[0].collisionBoxes.length===1&&
  JSON.stringify(originalParts[0].collisionBoxes[0])===JSON.stringify([0,0,0,1,1,1]),
  'original hearth full cell collision or body ownership changed');
 const originalMesh=asset.mesh(asset.descriptor,{rotation:v.rotation});
 const trueWorldMesh=layer.meshAt([...v.anchor]);
 must(trueWorldMesh&&trueWorldMesh.variant===v.variant&&
  trueWorldMesh.rotation===v.rotation,'actual original construction meshAt identity changed');
 const trueWorldStage=pack5TerrainVertices(trueWorldMesh);
 const localStage=pack5TerrainVertices(originalMesh);
 const independentlyTranslated=originalR3ActualGpuWorldFloat32Staging(localStage,[...v.anchor]);
 must(trueWorldStage.length===independentlyTranslated.length&&trueWorldStage.length%27===0,
  'actual original GPU staging and independent world-F32 lengths drifted');
 let xyzDifferences=0;
 for(let i=0;i<trueWorldStage.length;i+=9)
  for(let a=0;a<3;a++)if(trueWorldStage[i+a]!==independentlyTranslated[i+a])
   xyzDifferences++;
 must(xyzDifferences===0,'ACTUAL original construction-layer world GPU vertex differs from independently reconstructed Float32 position');
 const boxes=originalParts.flatMap(p=>p.boxes.map(b=>
  b.map((x,i)=>x+v.anchor[i%3])));
 const worldF32Boxes=originalParts.flatMap(p=>p.boxes.map(b=>
  b.map((x,i)=>Math.fround(Math.fround(x)+v.anchor[i%3]))));
 must(boxes.length*36===trueWorldStage.length/9&&
  trueWorldStage.byteLength<=384*1024,
  'original authored 12 triangles per source box or one-page GPU budget violated');
 return {layer,asset,originalParts,trueWorldStage,localStage,boxes,worldF32Boxes,
  getReadCount:()=>readCalls,independentOriginalGpuWorldXYZDifferences:xyzDifferences,
  inMemoryOriginalPack5Count:layer.count()};
}
function strictAndRelaxed(eye,ray,staged){
 let strict=null,tolerant=null,strictTriangleIndex=null,tolerantTriangleIndex=null;
 let nearNegMargin=null,strictMargin=null;
 for(let i=0;i<staged.length;i+=27){
  const [a,b,c]=pointsOf(staged,i);
  const data=originalTriangleBarycentric(eye,ray,a,b,c);
  if(!data)continue;
  if(data.strictlyInsideTriangle&&(!strict||data.t<strict)){
   strict=data.t;strictTriangleIndex=i/27;strictMargin=data.minimumBarycentric;
  }
  if(data.originalSourceToleranceAdmits&&(!tolerant||data.t<tolerant)){
   tolerant=Math.max(0,data.t);tolerantTriangleIndex=i/27;
   nearNegMargin=data.minimumBarycentric;
  }
 }
 return {strictDistance:strict,tolerantDistance:tolerant,
  strictTriangleIndex,tolerantTriangleIndex,strictMargin,
  tolerantMargin:nearNegMargin};
}
/** Each source art box produces exactly 12 triangles. Prove its *actual
 * ORIGINAL meshAt Float32 vertex positions* use only endpoints from that
 * same source-authored rotated box; catches rotated visual/physical drift.
 */
export function attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners(source){
 must(source?.trueWorldStage instanceof Float32Array&&
  source.originalParts?.length===1,'authentic source mesh and parts required');
 let checked=0;
 const part=source.originalParts[0],stage=source.trueWorldStage;
 for(let boxIndex=0;boxIndex<part.boxes.length;boxIndex++){
  const box=part.boxes[boxIndex];
  const endpoints=[0,1,2].map(axis=>[
   Math.fround(Math.fround(box[axis])+ORIGINAL_HEARTH_YAW3_SOURCE.anchor[axis]),
   Math.fround(Math.fround(box[axis+3])+ORIGINAL_HEARTH_YAW3_SOURCE.anchor[axis])
  ]);
  for(let n=0;n<36;n++){
   const offset=(boxIndex*36+n)*9;
   for(let axis=0;axis<3;axis++){
    const v=stage[offset+axis];
    must(v===endpoints[axis][0]||v===endpoints[axis][1],
     'actual original world GPU triangle vertex is not source-authored rotated box endpoint');
   }
   checked++;
  }
 }
 must(checked===stage.length/9,'full original source-authoring vertex audit incomplete');
 return {sourceAuthoredBoxCount:part.boxes.length,actualWorldGpuVerticesChecked:checked,
  actualWorldGpuTriangleCount:checked/3,
  originalBoxAndWorldFloat32FaceEndpointsIdentical:true};
}
/** Investigates one NEW research-only variant/yaw and ONE original R3 camera
 * pose. It never executes an in-game camera, GPU, pixel, or pointer event.
 * The original live layer raycast independently checks source target picking
 * INCLUDING the unchanged legacy terrain occlusion gate (on this empty host).
 */
export function auditOriginalHearthYaw3StrictWorldRayGrid(){
 const cfg=ORIGINAL_HEARTH_YAW3_SOURCE,s=buildOriginalHearthYaw3ReadOnlyLayer();
 const face= s.asset.descriptor.art.map(a=>rotateLocalBox(a.box,cfg.rotation));
 const y=coords(face,1),z=coords(face,2);
 const originalEye=[...cfg.originalR3EyeOnlyAsResearchPose];
 const offsets=[-.000002,0,.000002];
 const totals={rays:0,strictTriangleHits:0,tolerantTriangleHits:0,
  originalDetailedHits:0,bothStrictAndDetailedHits:0,bothStrictAndDetailedMisses:0,
  strictTriangleOnlySelectionMisses:0,sourceToleranceOnlySelectionMisses:0,
  detailedSelectionOnlyAgainstStrict:0,strictDistanceWarningsOver2e7:0,
  strictGapWithMarginAtLeast1e5:0,strictGapWithBoxSeparationOver1e5:0,
  originalAndIndependentBoxDistanceDisagreements:0,
  distanceSelectionAheadOfStrictTriangles:0,
  distanceStrictTrianglesAheadOfSelection:0,
  distanceSameAuthoredSourceBox:0,
  distanceDifferentAuthoredSourceBoxes:0,
  distanceOnAuthoredTangentialSelectionSeam:0,
  distanceAwayFromAuthoredTangentialSelectionSeam:0,
  largestDistanceDisagreementBlockUnits:0};
 const strictW=[],toleranceW=[],distanceW=[];
 for(const ly of y)for(const lz of z)for(const shift of offsets){
  const aim=[cfg.anchor[0],cfg.anchor[1]+ly+shift,cfg.anchor[2]+lz];
  const ray=from(originalEye,aim);
  const detail=s.layer.raycast(originalEye,ray,cfg.maxDistance)?.distance??null;
  const independent=closestOriginalBox(originalEye,ray,s.boxes).distance;
  if(!near(detail,independent))totals.originalAndIndependentBoxDistanceDisagreements++;
  const triangle=strictAndRelaxed(originalEye,ray,s.trueWorldStage);
  const strict=triangle.strictDistance,tolerant=triangle.tolerantDistance;
  totals.rays++;
  if(strict!==null&&strict<=cfg.maxDistance)totals.strictTriangleHits++;
  if(tolerant!==null&&tolerant<=cfg.maxDistance)totals.tolerantTriangleHits++;
  if(detail!==null)totals.originalDetailedHits++;
  if(strict!==null&&detail!==null) {
   totals.bothStrictAndDetailedHits++;
   if(Math.abs(strict-detail)>2e-7){
    totals.strictDistanceWarningsOver2e7++;
    const diff=strict-detail;
    if(diff>0)totals.distanceSelectionAheadOfStrictTriangles++;
    else totals.distanceStrictTrianglesAheadOfSelection++;
    const selectedBox=closestOriginalBox(originalEye,ray,s.boxes);
    must(selectedBox.index!==null,'original detailed hit has no authored selection box owner');
    const triBox=Math.floor(triangle.strictTriangleIndex/12);
    if(triBox===selectedBox.index)totals.distanceSameAuthoredSourceBox++;
    else totals.distanceDifferentAuthoredSourceBoxes++;
    const seam=originalAuthoredSlabEntrySeam(originalEye,ray,s.boxes[selectedBox.index]);
    if(seam.atSeam)totals.distanceOnAuthoredTangentialSelectionSeam++;
    else totals.distanceAwayFromAuthoredTangentialSelectionSeam++;
    totals.largestDistanceDisagreementBlockUnits=Math.max(
     totals.largestDistanceDisagreementBlockUnits,Math.abs(diff));
    if(distanceW.length<12)distanceW.push({localAim:[0,ly+shift,lz],
     triangleDistance:strict,selectionDistance:detail,margin:triangle.strictMargin,
     signedTriangleMinusSelectionBlockUnits:diff,sourceSelectionBoxIndex:selectedBox.index,
     sourceStrictTriangleBoxIndex:triBox,originalAuthoredSelectionSeam:seam,
     researchOnlyNotAPixelObservation:true});
   }
  }else if(strict===null&&detail===null)totals.bothStrictAndDetailedMisses++;
  else if(strict!==null&&detail===null){
   totals.strictTriangleOnlySelectionMisses++;
   const point=add(originalEye,ray.map(q=>q*strict)),gap=separation(point,s.boxes);
   if(triangle.strictMargin>=1e-5)totals.strictGapWithMarginAtLeast1e5++;
   if(gap.distance>=1e-5)totals.strictGapWithBoxSeparationOver1e5++;
   if(strictW.length<12)strictW.push({localAim:[0,ly+shift,lz],eye:originalEye,
    cameraYaw:Math.atan2(ray[0],ray[2]),cameraPitch:Math.atan2(ray[1],Math.hypot(ray[0],ray[2])),
    strictTriangleDistance:strict,originalSourceSelectionDistance:null,
    strictMinimumBarycentric:triangle.strictMargin,nearestOriginalAuthoredBoxSeparation:gap.distance,
    triangleIndex:triangle.strictTriangleIndex,point});
  }else totals.detailedSelectionOnlyAgainstStrict++;
  if(strict===null&&tolerant!==null&&detail===null){
   totals.sourceToleranceOnlySelectionMisses++;
   if(toleranceW.length<12)toleranceW.push({localAim:[0,ly+shift,lz],
    relaxedTriangleDistance:tolerant,negativeBarycentricMargin:triangle.tolerantMargin});
  }
 }
 must(totals.rays===y.length*z.length*offsets.length&&
  totals.rays>=300&&totals.rays<=2700,
  'original source rotated authored grid sample bounds changed');
 must(totals.originalAndIndependentBoxDistanceDisagreements===0,
  'original live construction layer detailed-ray / independent original slab fidelity diverged');
 must(totals.bothStrictAndDetailedHits+totals.bothStrictAndDetailedMisses+
  totals.strictTriangleOnlySelectionMisses+totals.detailedSelectionOnlyAgainstStrict===totals.rays,
  'strict mesh/selection source accounting incomplete');
 must(totals.strictTriangleHits===
  totals.bothStrictAndDetailedHits+totals.strictTriangleOnlySelectionMisses,
  'strict authored original triangle hit census incomplete');
 must(totals.distanceSelectionAheadOfStrictTriangles+
  totals.distanceStrictTrianglesAheadOfSelection===
  totals.strictDistanceWarningsOver2e7 &&
  totals.distanceSameAuthoredSourceBox+
  totals.distanceDifferentAuthoredSourceBoxes===
  totals.strictDistanceWarningsOver2e7 &&
  totals.distanceOnAuthoredTangentialSelectionSeam+
  totals.distanceAwayFromAuthoredTangentialSelectionSeam===
  totals.strictDistanceWarningsOver2e7,
  'genuine original source both-hit distance discrepancies are incompletely classified');
 must(totals.strictDistanceWarningsOver2e7===208,
  'original source alternative yaw3 208 measured two-hit distance warning reference unexpectedly drifted');
 const center=from(originalEye,
  [cfg.anchor[0]+.5,cfg.anchor[1]+.5,cfg.anchor[2]+.5]);
 const away=forwardVector(0,0);
 const centerDetail=s.layer.raycast(originalEye,center,cfg.maxDistance)?.distance??null;
 const awayDetail=s.layer.raycast(originalEye,away,cfg.maxDistance)?.distance??null;
 must(centerDetail!==null&&centerDetail<=6&&awayDetail===null,
  'original non-mutating true-player style positive/negative source selection controls fail');
 const authored=attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners(s);
 return {schema:'mythwrought.roadmap-a.pack5-original-hearth-yaw3-strict-world-ray.v1',
  identity:{symbol:cfg.symbol,sourceVariant:cfg.variant,researchYaw:cfg.rotation,
   sourceOnlyAnchor:[...cfg.anchor],researchEye:[...originalEye],samePoseAsR3ButNewVariant:true},
  actualOriginalConstructionLayerWorldFloat32:true,
  originalOnePageGpuBytes:s.trueWorldStage.byteLength,
  sourceAuthoredOriginalPartBoxes:authored.sourceAuthoredBoxCount,
  ...authored,
  sourceRayGrid:{yLevels:y.length,zLevels:z.length,sourceOffsets:offsets,
   exactRayCount:totals.rays},
  ...totals,firstStrictGaps:strictW,firstToleranceOnly: toleranceW,
  firstSourceHitDistanceWarnings:distanceW,
  originalSelectionCenteredRayDistance:centerDetail,
  originalSelectionAimAwayDistance:awayDetail,
  originalReadOnlyWorldGetCount:s.getReadCount(),
  originalLiveLayerCount:s.inMemoryOriginalPack5Count,
  originalUserWorldReadOrWritten:false,
  realWorldTerrainOcclusionTested:false,
  sourceOnlyMathNotActualGpuPixelProof:true,
  realGameChromiumRunPerformedNow:false,
  realIphoneHomeScreenPwaTested:false,
  noProductionSelectionChanges:true,
  noA5VariantYawOrStructuralDecision:true,
  noMergeOrDeployment:true};
}
export function attestUnchangedOriginalHearthYaw3Producer(){
 const construction=readFileSync(new URL('../../pack5-integration/construction-layer.mjs',import.meta.url),'utf8');
 const physical=readFileSync(new URL('../../block-packs/pack-5/architectural-surfaces.mjs',import.meta.url),'utf8');
 const fixture=readFileSync(new URL('../../block-packs/pack-5/fixture.mjs',import.meta.url),'utf8');
 const camera=readFileSync(new URL('../../camera.mjs',import.meta.url),'utf8');
 const expected=[
  [construction,'const translated=new Float32Array(result.positions.length);'],
  [construction,'translated[i]=result.positions[i]+record.anchor[i%3];'],
  [construction,'const obstruction=raycastLegacy(world,origin,direction,maxDistance);'],
  [construction,'return obstruction&&obstruction.distance<=hit.distance+1e-8?null:hit;'],
  [fixture,'const unit=direction.map(v=>v/length);'],
  [physical,"'pack5:080':['hearth-running-bond','kiln-soldier-course']"],
  [physical,'for(const part of descriptor.art){'],
  [camera,'export function forwardVector(yaw,pitch)']
 ];
 for(const [source,needle] of expected)
  must(source.includes(needle),'original production source drift: '+needle);
 return {authenticatedOriginalSourceContracts:expected.length,
  originalRuntimeRendererMeshAtSelected:true,originalTerrainOcclusionGateSourcePreserved:true,
  originalMaxReachUnchanged:true};
}
