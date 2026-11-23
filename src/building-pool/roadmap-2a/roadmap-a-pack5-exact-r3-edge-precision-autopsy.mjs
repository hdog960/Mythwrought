/**
 * Roadmap A -- read-only ORIGINAL R3 real-game triangle-only edge autopsy.
 * The exact witness below was recovered from authenticated actual-game
 * Chromium Actions #45092582089 / artifact #14782385585 (SHA256 of original
 * JSON 62708fb82618278225cbc1b092ba68e4ff204ced436fed2fa30f2de2e6d5103d).
 *
 * Replays the unchanged original Pack5:080 kiln-soldier-course / yaw2
 * geometry from original catalog, fixture, original Float32 9-float GPU
 * staging and original camera. No synthetic geometry or production edits.
 *
 * The original source triangle helper admits 1e-7 barycentric slack,
 * while authored selection AABB uses exact slab boundaries; strict triangle
 * and Float32-quantized box are deliberately SEPARATE non-production models.
 */
import {readFileSync} from 'node:fs';
import {forwardVector} from '../../camera.mjs';
import {makePack5Fixture,orientedParts,rotateLocalBox} from '../../block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {pack5TerrainVertices} from '../../pack5-integration/terrain-buffer.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';

const fail=(ok,msg)=>{if(!ok)throw Error('Roadmap A original exact R3 shape/mesh edge diagnosis: '+msg);};
const finiteVec=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,s)=>a.map(x=>x*s);
const near=(a,b,tol=2e-7)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=tol;

export const ORIGINAL_R3_REAL_GAME_EDGE=Object.freeze({
 artifact:'github-actions-45092582089-artifact-14782385585',
 evidenceJsonSha256:'62708fb82618278225cbc1b092ba68e4ff204ced436fed2fa30f2de2e6d5103d',
 family:'pack5:080',variant:'kiln-soldier-course',previewYaw:2,
 anchor:Object.freeze([3,14,0]),eye:Object.freeze([.5,13.55,.5]),
 yaw:1.757786033928741,pitch:.5099378275702837,
 localFaceTarget:Object.freeze([0,.972998,.027]),
 actualOriginalSourceTriangleDistance:2.915244810989979,
 actualOriginalDetailedSelectionDistance:null,
 originalActualGameMineRemoved:false,
 actualOriginalGameNearby9x9StrongPixels:37,
 actualGameGPUVertices:1908,actualGameGPUBytes:68688
});

/** Same original double-precision AABB slab semantics, with explicit
 * independent parameterized boxes; NEVER writes or changes fixture internals.
 */
export function pureOriginalRayBoxDistance(eye,unit,box){
 fail(finiteVec(eye)&&finiteVec(unit)&&dot(unit,unit)>0&&
  Array.isArray(box)&&box.length===6&&box.every(Number.isFinite)&&
  [0,1,2].every(k=>box[k]<box[k+3]),'finite valid ray/box required');
 let lo=-Infinity,hi=Infinity;
 for(let k=0;k<3;k++){
  const d=unit[k];
  if(Math.abs(d)<1e-12){
   if(eye[k]<box[k]||eye[k]>box[k+3])return null;
   continue;
  }
  const a=(box[k]-eye[k])/d,b=(box[k+3]-eye[k])/d;
  lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
  if(hi<lo)return null;
 }
 return hi<0?null:Math.max(0,lo);
}
export function originalTriangleBarycentric(eye,ray,a,b,c){
 fail([eye,ray,a,b,c].every(finiteVec)&&dot(ray,ray)>0,'finite triangle/ray required');
 const uEdge=sub(b,a),vEdge=sub(c,a),
  p=cross(ray,vEdge),det=dot(uEdge,p);
 if(Math.abs(det)<1e-12)return null;
 const diff=sub(eye,a),inv=1/det,u=dot(diff,p)*inv;
 const q=cross(diff,uEdge),v=dot(ray,q)*inv,t=dot(vEdge,q)*inv;
 return {t,u,v,w:1-u-v,minimumBarycentric:Math.min(u,v,1-u-v),
  originalSourceToleranceAdmits:u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7&&t>=-1e-7,
  strictlyInsideTriangle:u>=0&&v>=0&&u+v<=1&&t>=0,
  nearlyParallel:false};
}
export function buildOriginalR3BrickSourcePreview(){
 const w=ORIGINAL_R3_REAL_GAME_EDGE;
 const originalFixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
 fail(originalFixture.place(w.family,[...w.anchor],w.previewYaw,w.variant).ok===true,
  'original in-memory R3 rotated brick fixture refused');
 const asset=resolvePack5BuilderAsset(w.family,w.variant);
 const originalMesh=asset.mesh(asset.descriptor,{rotation:w.previewYaw});
 const staged=pack5TerrainVertices(originalMesh);
 const parts=orientedParts(asset.descriptor,w.previewYaw);
 fail(parts.length===1&&staged instanceof Float32Array&&
  staged.length%27===0&&staged.length/9===w.actualGameGPUVertices&&
  parts[0].boxes.length===originalMesh.vertexCount/24,
  'R3 original physical authored boxes or Float32 GPU source unexpectedly changed');
 const boxes=parts.flatMap(part=>part.boxes.map(box=>
  box.map((v,k)=>v+w.anchor[k%3])));
 // Same TWO Float32 boundaries as unchanged construction-layer.meshAt:
 // local rotated source box -> local Float32, + anchor -> world Float32.
 const float32Boxes=parts.flatMap(part=>part.boxes.map(box=>box.map((v,k)=>
  Math.fround(Math.fround(v)+w.anchor[k%3]))));
 return {fixture:originalFixture,asset,staged,boxes,float32Boxes};
}
/** True source-owned original GPU world-coordinate staging contract:
 * actual construction-layer.meshAt writes each local Float32 vertex plus
 * world anchor INTO a new Float32Array before terrain-buffer packs it.
 * This is intentionally distinct from R3 research's double addition.
 */
export function originalR3ActualGpuWorldFloat32Staging(localStaged,anchor){
 fail(localStaged instanceof Float32Array&&localStaged.length%27===0&&
  finiteVec(anchor),'original Float32 local staged authored triangles required');
 const world=new Float32Array(localStaged);
 for(let base=0;base<world.length;base+=9)
  for(let axis=0;axis<3;axis++)world[base+axis]=
   Math.fround(world[base+axis]+anchor[axis]);
 return world;
}
function nearestBox(eye,ray,boxes){
 // Authentic original fixture.raycast first normalizes even the ostensibly
 // unit forwardVector. Its IEEE-754 normalization can change a grazing box
 // hit: do not silently skip this step in our independent slab comparison.
 const length=Math.hypot(...ray);
 fail(Number.isFinite(length)&&length>0,'original source ray normalization must remain finite');
 const unit=ray.map(v=>v/length);
 let best=null,index=null;
 for(let k=0;k<boxes.length;k++){
  const t=pureOriginalRayBoxDistance(eye,unit,boxes[k]);
  if(t!==null&&(best===null||t<best)){best=t;index=k;}
 }
 return {distance:best,index};
}
function nearestTriangles(eye,ray,staged,anchor){
 let exact=null,relaxed=null,relaxedSource=null;
 let closestMargin=Infinity,minimumViolation=Infinity;
 for(let i=0;i<staged.length;i+=27){
  const v=k=>[
   staged[i+k*9]+anchor[0],
   staged[i+k*9+1]+anchor[1],
   staged[i+k*9+2]+anchor[2]
  ];
  const a=v(0),b=v(1),c=v(2);
  const original=sourceRayTriangleDistance(eye,ray,a,b,c);
  const strict=originalTriangleBarycentric(eye,ray,a,b,c);
  if(strict){
   minimumViolation=Math.min(minimumViolation,Math.max(0,-strict.minimumBarycentric));
   if(strict.strictlyInsideTriangle&&
    (exact===null||strict.t<exact.distance))exact={distance:strict.t,triangle:i/27,barycentric:strict};
  }
  if(original!==null&&(relaxed===null||original<relaxed.distance)){
   relaxed={distance:original,triangle:i/27,barycentric:strict};
   relaxedSource=sourceRayTriangleDistance(eye,ray,a,b,c);
  }
  if(strict)closestMargin=Math.min(closestMargin,Math.abs(strict.minimumBarycentric));
 }
 return {originalRelaxed:relaxed,strict:exact,relaxedSource,closestMargin:
  Number.isFinite(closestMargin)?closestMargin:null,
  minViolation:Number.isFinite(minimumViolation)?minimumViolation:null,
  totalOriginalStagedTriangles:staged.length/27};
}
/** How far the actual tested source intersection lies outside the union of
 * authored AABBs. Zero means on/in at least one original authored selection
 * box; positive is a real spatial gap to all boxes.
 */
function minUnionSeparation(point,boxes){
 let closest=Infinity,index=-1,components=null;
 boxes.forEach((b,k)=>{
  const dx=[0,1,2].map(i=>Math.max(b[i]-point[i],0,point[i]-b[i+3]));
  const d=Math.hypot(...dx);
  if(d<closest){closest=d;index=k;components=dx;}
 });
 return {distance:closest,nearestBoxIndex:index,outsideByAxis:components};
}
export function auditExactOriginalR3MeshBoxPrecision(){
 const w=ORIGINAL_R3_REAL_GAME_EDGE,source=buildOriginalR3BrickSourcePreview(),
  ray=forwardVector(w.yaw,w.pitch);
 const fixtureSelection=source.fixture.raycast([...w.eye],ray,6)?.distance??null;
 const authored=nearestBox([...w.eye],ray,source.boxes);
 const f32=nearestBox([...w.eye],ray,source.float32Boxes);
 const triangles=nearestTriangles([...w.eye],ray,source.staged,[...w.anchor]);
 const gpuWorldStaged=originalR3ActualGpuWorldFloat32Staging(source.staged,[...w.anchor]);
 const originalActualWorldGpuTriangles=nearestTriangles([...w.eye],ray,gpuWorldStaged,[0,0,0]);
 fail(fixtureSelection===null&&authored.distance===null&&
  triangles.originalRelaxed?.distance!==null&&
  Math.abs(triangles.originalRelaxed.distance-w.actualOriginalSourceTriangleDistance)<=2e-6,
  'authenticated original R3 real-game ray no longer reproduces physical mesh/selection discrepancy');
 const contact=add([...w.eye],scale(ray,triangles.originalRelaxed.distance));
 const authoredContact=minUnionSeparation(contact,source.boxes);
 const float32Contact=minUnionSeparation(contact,source.float32Boxes);
 const deltas=[];
 for(const targetDelta of [-.00001,-.000002,-.000001,0,.000001,.000002,.00001]){
  const target=[w.anchor[0]+w.localFaceTarget[0],
   w.anchor[1]+w.localFaceTarget[1]+targetDelta,
   w.anchor[2]+w.localFaceTarget[2]];
  const toward=sub(target,w.eye),look=[Math.atan2(toward[0],toward[2]),
   Math.atan2(toward[1],Math.hypot(toward[0],toward[2]))],
   direction=forwardVector(...look);
  const original=source.fixture.raycast([...w.eye],direction,6)?.distance??null;
  const authoredRay=nearestBox([...w.eye],direction,source.boxes).distance;
  const f32Ray=nearestBox([...w.eye],direction,source.float32Boxes).distance;
  const sourceTriangles=nearestTriangles([...w.eye],direction,source.staged,[...w.anchor]);
  fail(near(original,authoredRay),'original fixture vs independent authored slab test diverged');
  deltas.push({originalFaceTargetYShift:targetDelta,
   originalAuthoredSelectionDistance:original,
   originalFloat32BoxSourceDistance:f32Ray,
   originalTriangleWithPreviousBarycentricTolerance:sourceTriangles.originalRelaxed?.distance??null,
   originalStrictBarycentricTriangleDistance:sourceTriangles.strict?.distance??null,
   sourceRelaxedTriangleOnly:sourceTriangles.originalRelaxed!==null&&original===null,
   strictTriangleOnly:sourceTriangles.strict!==null&&original===null});
 }
 const strictHit=triangles.strict!==null;
 const float32BoxHit=f32.distance!==null;
 let classification;
 if(!strictHit&&triangles.originalRelaxed!==null)classification='relaxed-barycentric-original-source-only-hit';
 else if(strictHit&&float32BoxHit)classification='float32-box-intersects-but-original-authored-aabb-misses';
 else if(strictHit&&!float32BoxHit)classification='strict-float32-triangle-versus-box-union-gap';
 else classification='unresolved-original-boundary-numerical-condition';
 return {schema:'mythwrought.roadmap-a.pack5-exact-real-game-r3-precision-autopsy.v1',
  authenticatedOriginalActionRun:45092582089,
  originalGithubArtifact:14782385585,
  originalEvidenceJsonSha256:w.evidenceJsonSha256,
  originalWitness:{variant:w.variant,rotation:w.previewYaw,anchor:[...w.anchor],
   eye:[...w.eye],yaw:w.yaw,pitch:w.pitch,
   previouslyMeasuredOriginalTriangleDistance:w.actualOriginalSourceTriangleDistance,
   previousGameSelectionDistance:w.actualOriginalDetailedSelectionDistance,
   originalRealGameMINEWasNotRemoved:true},
  authenticPartBoxes:source.boxes.length,originalGpuStagedVertices:source.staged.length/9,
  originalStagedTriangles:source.staged.length/27,
  originalDetailedRayDistance:fixtureSelection,
  independentOriginalAuthoredBoxRay:authored,
  float32QuantizedAuthoredBoxRay:f32,
  originalSourceTriangleWithBarycentricTolerance:triangles.originalRelaxed,
  strictlyInsideAuthoredFloat32SourceTriangle:triangles.strict,
  originalActualGpuWorldFloat32StagedTriangle:originalActualWorldGpuTriangles.originalRelaxed,
  strictOriginalActualGpuWorldFloat32StagedTriangle:originalActualWorldGpuTriangles.strict,
  originalR3ResearchStagedWorldAdditionWasDouble:true,
  originalRealGpuWorldStagingWritesFloat32Again:true,
  relaxedOriginalTriangleHitBarycentricMargin:triangles.originalRelaxed?.barycentric?.minimumBarycentric??null,
  originalSourceTriangleContact:contact,
  originalContactVsAuthoredSelectionBoxUnion:authoredContact,
  originalContactVsFloat32BoxUnion:float32Contact,
  exactOriginalEdgeShiftGrid:deltas,
  diagnosedSourceRayClassification:classification,
  repairProposals:{
   artificialPaddingOfSelectionBoxesRejected:true,
   candidateA_readonlyExactFloat32TriangleRayModelOnly:true,
   candidateB_readonlyFloat32SlabQuantizationModelOnly:true,
   wouldNeedOriginalTerrainOcclusionAndSixBlockReach:true,
   noProductionSelectionImplementationChanged:true
  },
  originalGameWebgl2ExecutedInThisAudit:false,actualGpuPixelCenterCoverageMeasuredInThisAudit:false,
  originalPhysicalIphoneTested:false,originalSourceAssetOrBuildingEdited:false,
  sourceOnly:true,productionReady:false,creatorApprovedStructuralLoad:false};
}
export function attestUnchangedOriginalRayImplementations(){
 const fixture=readFileSync(new URL('../../block-packs/pack-5/fixture.mjs',import.meta.url),'utf8');
 const ray=readFileSync(new URL('./roadmap-a-pack5-ray-selection-core.mjs',import.meta.url),'utf8');
 const mesh=readFileSync(new URL('../../block-packs/pack-5/architectural-surfaces.mjs',import.meta.url),'utf8');
 const required=[
  [fixture,"if(Math.abs(d)<1e-12){if(origin[a]<box[a]||origin[a]>box[a+3])return null;continue;}"],
  [fixture,"const unit=direction.map(v=>v/length);"],
  [ray,"if(u < -1e-7||u>1+1e-7)return null;"],
  [ray,"if(v < -1e-7||u+v>1+1e-7)return null;"],
  [mesh,"p.push(vertex[0]?x1:x0,vertex[1]?y1:y0,vertex[2]?z1:z0);"],
  [readFileSync(new URL('../../pack5-integration/construction-layer.mjs',import.meta.url),'utf8'),
   "translated[i]=result.positions[i]+record.anchor[i%3];"]
 ];
 for(const [src,needle] of required)
  fail(src.includes(needle),'exact unchanged original selection/triangle/mesher source drift: '+needle);
 return {originalAuthoredSelectionSlabsUnchanged:true,
  originalBarycentricToleranceExactlyRead:true,
  originalMeshFloat32PositionsExactlyRead:true,contractCount:required.length};
}

/**
 * Replay the ENTIRE ORIGINAL R3 2430-ray live-player source grid (same eye,
 * same authored rotated brick, same axis coordinate and micro-offset
 * generator as the actual source-runner in Actions #45092582089).
 *
 * Unlike R3's earlier only-first-20 warning list, every raw triangle-only
 * source case is separately classified by STRICT triangle barycentrics and
 * by genuine Float32-quantized original box slabs. Does not run WebGL/scene.
 */
export function auditOriginalR3CompletePlayerPoseSeamGrid(){
 const w=ORIGINAL_R3_REAL_GAME_EDGE,s=buildOriginalR3BrickSourcePreview();
 const gpuWorldStaged=originalR3ActualGpuWorldFloat32Staging(s.staged,[...w.anchor]);
 const rotated=s.asset.descriptor.art.map(a=>rotateLocalBox(a.box,w.previewYaw));
 const coords=axis=>{
  const candidates=new Set([.02,.03,.035,.065,.1,.231,.5,.535,.58,.91,.97,.98]);
  for(const b of rotated)
   for(const x of [b[axis],b[axis+3]])if(x>=0&&x<=1)
    candidates.add(Math.round(x*1e6)/1e6);
  return [...candidates].sort((a,b)=>a-b)
   .filter((v,i,all)=>v>=.01&&v<=.99&&
    i%Math.max(1,Math.floor(all.length/28))===0)
   .slice(0,30);
 };
 const levels=coords(1),lateral=coords(2);
 const sum={sourceRays:0,originalRelaxedTriangleOnly:0,
  originalBothHitDistanceWarnings:0,originalSelectionOnly:0,
  originalBothHits:0,originalBothMiss:0,
  originalStrictTriangleOnly:0,
  originalRelaxedOnlyBecauseNegativeBarycentric:0,
  originalFloat32BoxWouldHitAtRelaxedOnly:0,
  originalTriangleVsFloat32BoxStrictGap:0,
  originalStrictTriangleHits:0,
  originalOriginalSourceTriangleHits:0,
  actualGpuWorldFloat32StrictTriangleHits:0,
  actualGpuWorldFloat32StrictTriangleOnly:0,
  actualGpuWorldFloat32RelaxedTriangleOnly:0,
  researchStrictVsWorldGpuStrictHitDifferences:0};
 const rare=[],strictGaps=[];
 for(const y of levels)for(const z of lateral)for(const dy of [-.000002,0,.000002]){
  const target=[w.anchor[0],w.anchor[1]+y+dy,w.anchor[2]+z];
  const toward=sub(target,w.eye),
   yaw=Math.atan2(toward[0],toward[2]),
   pitch=Math.atan2(toward[1],Math.hypot(toward[0],toward[2])),
   ray=forwardVector(yaw,pitch);
  const original=s.fixture.raycast([...w.eye],ray,6)?.distance??null;
  const triangles=nearestTriangles([...w.eye],ray,s.staged,[...w.anchor]);
  const relaxed=triangles.originalRelaxed?.distance??null;
  const strict=triangles.strict?.distance??null;
  const f32=nearestBox([...w.eye],ray,s.float32Boxes).distance;
  const worldGpuTriangles=nearestTriangles([...w.eye],ray,gpuWorldStaged,[0,0,0]);
  const gpuStrict=worldGpuTriangles.strict?.distance??null,
   gpuRelaxed=worldGpuTriangles.originalRelaxed?.distance??null;
  const authored=nearestBox([...w.eye],ray,s.boxes).distance;
  fail(near(original,authored),'original exact 2430-ray fixture differs from independent authored original AABB');
  sum.sourceRays++;
  if(relaxed!==null)sum.originalOriginalSourceTriangleHits++;
  if(strict!==null)sum.originalStrictTriangleHits++;
  if(gpuStrict!==null)sum.actualGpuWorldFloat32StrictTriangleHits++;
  if(gpuStrict!==null&&original===null)sum.actualGpuWorldFloat32StrictTriangleOnly++;
  if(gpuRelaxed!==null&&original===null)sum.actualGpuWorldFloat32RelaxedTriangleOnly++;
  if((gpuStrict===null)!==(strict===null))
   sum.researchStrictVsWorldGpuStrictHitDifferences++;
  if(relaxed!==null&&original===null){
   sum.originalRelaxedTriangleOnly++;
   if(strict===null&&triangles.originalRelaxed?.barycentric?.minimumBarycentric<0)
    sum.originalRelaxedOnlyBecauseNegativeBarycentric++;
   if(f32!==null)sum.originalFloat32BoxWouldHitAtRelaxedOnly++;
   if(rare.length<16)rare.push({localTarget:[0,y+dy,z],yaw,pitch,
    originalSourceTriangleDistance:relaxed,
    originalStrictTriangleDistance:strict,
    originalAuthoredSelectionDistance:original,
    originalFloat32BoxDistance:f32,
    originalGpuWorldFloat32StrictTriangleDistance:gpuStrict,
    originalGpuWorldFloat32RelaxedTriangleDistance:gpuRelaxed,
    relaxedTriangleMinimumBarycentric:triangles.originalRelaxed?.barycentric?.minimumBarycentric??null,
    strictTriangleWouldPick:strict!==null,previousSourceHelperWouldPick:true});
  }else if(relaxed===null&&original!==null)sum.originalSelectionOnly++;
  else if(relaxed!==null&&original!==null){
   sum.originalBothHits++;
   if(!near(relaxed,original))sum.originalBothHitDistanceWarnings++;
  }else sum.originalBothMiss++;
  if(strict!==null&&original===null){
   sum.originalStrictTriangleOnly++;
   if(f32===null)sum.originalTriangleVsFloat32BoxStrictGap++;
   if(strictGaps.length<16)strictGaps.push({localTarget:[0,y+dy,z],yaw,pitch,
    strictTriangleDistance:strict,originalSelectionDistance:original,
    originalFloat32BoxDistance:f32});
  }
 }
 fail(levels.length===27&&lateral.length===30&&sum.sourceRays===2430,
  'original actual-game grid provenance changes');
 fail(sum.originalRelaxedTriangleOnly===2&&sum.originalBothHitDistanceWarnings===146&&
  sum.originalSelectionOnly===0&&sum.originalBothHits===2301&&
  sum.originalBothMiss===127&&
  rare.length===2,
  'source grid no longer reconstructs exact authenticated R3 native/browser 2430-ray counters');
 return {schema:'mythwrought.roadmap-a.original-r3-all-2430-relaxed-versus-strict-player-rays.v1',
  exactAuthenticatedSourceCommitArtifact:w.artifact,exactOriginalEvidenceJsonSha256:w.evidenceJsonSha256,
  originalGameActualEye:[...w.eye],originalRotatedSourceVariant:w.variant,
  originalResearchOnlyYaw:w.previewYaw,authoringYCoordinateSamples:levels.length,
  authoringZCoordinateSamples:lateral.length,threeOriginalMicroOffsetsPerCoordinate:3,
  exactSourceCounters:sum,allOriginalTriangleOnlyWitnesses:rare,
  strictTriangleOriginalSelectionGaps:strictGaps,
  originalProductionSelectionOrMeshModified:false,
  originalGpuPixelsOrIphoneMeasuredNow:false,noWorldSaveOrPwaChanges:true,
  noA5AuthoringDecision:true,originalGameEngineRaycastOrOcclusionAltered:false,
  thisIsSourceOnlyStrictTriangleMathNotGpuProof:true};
}
