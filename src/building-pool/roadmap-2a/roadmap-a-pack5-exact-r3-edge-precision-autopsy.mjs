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
import {makePack5Fixture,orientedParts} from '../../block-packs/pack-5/fixture.mjs';
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
 const float32Boxes=boxes.map(b=>b.map(Math.fround));
 return {fixture:originalFixture,asset,staged,boxes,float32Boxes};
}
function nearestBox(eye,ray,boxes){
 let best=null,index=null;
 for(let k=0;k<boxes.length;k++){
  const t=pureOriginalRayBoxDistance(eye,ray,boxes[k]);
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
  [ray,"if(u < -1e-7||u>1+1e-7)return null;"],
  [ray,"if(v < -1e-7||u+v>1+1e-7)return null;"],
  [mesh,"p.push(vertex[0]?x1:x0,vertex[1]?y1:y0,vertex[2]?z1:z0);"]
 ];
 for(const [src,needle] of required)
  fail(src.includes(needle),'exact unchanged original selection/triangle/mesher source drift: '+needle);
 return {originalAuthoredSelectionSlabsUnchanged:true,
  originalBarycentricToleranceExactlyRead:true,
  originalMeshFloat32PositionsExactlyRead:true,contractCount:required.length};
}
