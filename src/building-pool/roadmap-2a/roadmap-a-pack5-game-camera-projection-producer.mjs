/**
 * Roadmap A — original main-game terrain GLSL center-screen projection
 * versus ORIGINAL staged Pack5 triangle and ORIGINAL detailed fixture ray.
 *
 * Genuine shader formula is authenticated verbatim from unchanged main.mjs.
 * This evaluates its mathematical projection in Node Number precision using
 * exactly the original Float32 packed vertex POSITION data. No GL context,
 * no rasterization, no depth buffer, no gameplay, no world or save mutation.
 */
import {readFileSync} from 'node:fs';
import {clampLook,forwardVector} from '../../camera.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';
import {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {makePack5Fixture} from '../../block-packs/pack-5/fixture.mjs';
import {pack5TerrainVertices} from '../../pack5-integration/terrain-buffer.mjs';

const insist=(yes,why)=>{if(!yes)throw Error('Roadmap A original terrain projection witness: '+why);};
const valid=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const variants=['hearth-running-bond','kiln-soldier-course'];
const turns=[2,3];
const samples=[.01999995,.02,.02000005,.5,.97999995,.98,.98000005];
const yawTouch=[-2,-1,0,1,2];
const pitchTouch=[-2,0,2];
const nearEdgeNdc=0.00002;

export function attestOriginalGamePack5TerrainProjection(){
 const main=readFileSync(new URL('../../main.mjs',import.meta.url),'utf8');
 const pipeline=readFileSync(new URL('../../gpu-pipeline.mjs',import.meta.url),'utf8');
 const stream=readFileSync(new URL('../../pack5-integration/terrain-buffer.mjs',import.meta.url),'utf8');
 const guards=[
  "const eye=()=>[player.x,player.feet+1.55,player.z];",
  "const facing=()=>forwardVector(player.yaw,player.pitch);",
  "'float x=dot(d,uRight); float y=dot(d,uUp); float z=dot(d,uForward);',",
  "'gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z);',",
  "gl.uniform3fv(U.uEye,eye());",
  "gl.uniform3fv(U.uForward,facing());",
  "gl.uniform3fv(U.uRight,[-Math.cos(player.yaw),0,Math.sin(player.yaw)]);",
  "gl.uniform3fv(U.uUp,[-Math.sin(player.pitch)*Math.sin(player.yaw),Math.cos(player.pitch),-Math.sin(player.pitch)*Math.cos(player.yaw)]);",
  "gl.uniform1f(U.uAspect,w/h);",
  "gl.uniform1f(U.uTan,Math.tan(72*Math.PI/360));",
  "pack5Gpu.draw({atPos,atColor,atUv,atMat})"
 ];
 for(const g of guards)insist(main.includes(g),'original shader/camera/draw source drift: '+g);
 insist(pipeline.includes('gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);'),
  'real main terrain shader cull/depth contract changed');
 insist(stream.includes('gl.drawArrays(gl.TRIANGLES,0,entry.count)')&&
  stream.includes('gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);')&&
  stream.includes('gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);'),
  'original uploaded Pack5 source triangle vertex layout/draw changed');
 return {originalMainShaderExpressionsAuthenticated:guards.length,
  actualMainShaderSourceRead:true,originalGpuDepthTestAndDoubleSidedGeometryRead:true,
  shaderCompileOrWebGLExecution:false,realGamePlayerTargeted:false};
}
/**
 * Exact 72-degree game shader basis and perspective division. Returns null
 * for vertices with invalid/behind/clip-outside forward-z, deliberately no
 * near-plane triangle clipping (all authored test triangles must be in front).
 */
export function originalGameProjectVertex(point,eye,yaw,pitch,aspect=844/390){
 insist(valid(point)&&valid(eye)&&[yaw,pitch,aspect].every(Number.isFinite)&&
  aspect>0,'finite original shader projection coordinates required');
 const f=forwardVector(yaw,pitch);
 const right=[-Math.cos(yaw),0,Math.sin(yaw)];
 const up=[-Math.sin(pitch)*Math.sin(yaw),Math.cos(pitch),
  -Math.sin(pitch)*Math.cos(yaw)];
 const d=minus(point,eye),z=dot(d,f);
 if(z<=0)return null;
 const tan=Math.tan(72*Math.PI/360);
 const x=dot(d,right)/(aspect*tan*z),y=dot(d,up)/(tan*z);
 const depth=1.0015-0.1501/z;
 if(![x,y,depth].every(Number.isFinite))return null;
 return {x,y,z,depth,clipped:depth < -1||depth > 1};
}
/**
 * Analytical projected CENTER ray:
 * for perspective-correct projection, z_hit = 1 / sum(lambda_i / z_i).
 * Pixel coverage and raster rules are NOT claimed. No back-face removal:
 * the original main pipeline explicitly disables GL culling.
 */
export function originalShaderCenterTriangleDistance(a,b,c,eye,yaw,pitch,aspect=844/390){
 const v=[a,b,c].map(p=>originalGameProjectVertex(p,eye,yaw,pitch,aspect));
 if(v.some(x=>x===null||x.clipped))return null;
 const [p,q,r]=v;
 const denom=(q.y-r.y)*(p.x-r.x)+(r.x-q.x)*(p.y-r.y);
 if(Math.abs(denom)<1e-16)return null;
 const l0=((q.y-r.y)*(-r.x)+(r.x-q.x)*(-r.y))/denom;
 const l1=((r.y-p.y)*(-r.x)+(p.x-r.x)*(-r.y))/denom;
 const l2=1-l0-l1;
 const margin=Math.min(l0,l1,l2);
 if(margin < -1e-8)return null;
 const inv=l0/p.z+l1/q.z+l2/r.z;
 if(!Number.isFinite(inv)||inv<=0)return null;
 return {distance:1/inv,margin,ndcDepth:1.0015-.1501*inv};
}
const closestSource=(staged,eye,d)=>{
 let best=null;
 const v=(base,offset)=>[staged[base+offset*9],
  staged[base+offset*9+1],staged[base+offset*9+2]];
 for(let i=0;i<staged.length;i+=27){
  const dist=sourceRayTriangleDistance(eye,d,v(i,0),v(i,1),v(i,2));
  if(dist!==null&&(best===null||dist<best))best=dist;
 }
 return best;
};
const closestProjected=(staged,eye,yaw,pitch)=>{
 let best=null,nearMiss=false,smallestMargin=Infinity;
 const v=(base,offset)=>[staged[base+offset*9],
  staged[base+offset*9+1],staged[base+offset*9+2]];
 for(let i=0;i<staged.length;i+=27){
  const a=originalShaderCenterTriangleDistance(
   v(i,0),v(i,1),v(i,2),eye,yaw,pitch);
  if(!a)continue;
  smallestMargin=Math.min(smallestMargin,Math.abs(a.margin));
  if(Math.abs(a.margin)<=nearEdgeNdc)nearMiss=true;
  if(best===null||a.distance<best.distance)best=a;
 }
 return {distance:best?.distance??null,margin:best?.margin??null,
  anySampledTriangleNearScreenEdge:nearMiss,smallestHitMargin:
   Number.isFinite(smallestMargin)?smallestMargin:null};
};
const same=(a,b,epsilon=2e-7)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=epsilon;

export function auditPack5OriginalGameCenterScreenProjection(){
 const source=attestOriginalGamePack5TerrainProjection();
 let total=0,indexedTriangleHits=0,projectedCenterHits=0,
  actualSelectionHits=0,sourceVsProjection=0,selectionVsProjection=0,
  projectedNearEdgeWarnings=0,unclassifiedSourceProjectionMismatches=0,
  testOnlyFixtureCount=0;
 const rows=[],witnesses=[];
 for(const variant of variants)for(const yaw of turns){
  const asset=resolvePack5BuilderAsset('pack5:080',variant);
  const mesh=asset.mesh(asset.descriptor,{rotation:yaw});
  const packed=pack5TerrainVertices(mesh);
  const fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
  insist(fixture.place('pack5:080',[0,0,0],yaw,variant).ok===true,
   'test-only original source fixture refused');
  const row={variant,previewYaw:yaw,independentResearchOnly:true,
   originalSourceTriangleCount:mesh.triangles,
   stagedPositionValues:packed.length/9*3,
   rays:0,sourceVsProjectedCenter:0,selectionVsProjectedCenter:0,
   nearProjectedTriangleEdges:0,firstMismatchSamples:[]};
  for(const eyeX of samples)for(const dx of yawTouch)for(const dy of pitchTouch){
   // Exact main source eye() uses 1.55 above synthetic player's feet;
   // synthetic player's feet is -1.05 so test-only eye Y=.5.
   const feet=-1.05,eye=[eyeX,feet+1.55,2];
   const camera=clampLook(Math.PI,0,dx,dy,1,.008);
   const direction=forwardVector(camera.yaw,camera.pitch);
   const sourceDist=closestSource(packed,eye,direction);
   const result=closestProjected(packed,eye,camera.yaw,camera.pitch);
   const projectedDist=result.distance;
   const selected=fixture.raycast(eye,direction,6)?.distance??null;
   const sourceDisagree=!same(sourceDist,projectedDist);
   const selectionDisagree=!same(selected,projectedDist);
   const edge=result.anySampledTriangleNearScreenEdge;
   total++;row.rays++;
   if(sourceDist!==null)indexedTriangleHits++;
   if(projectedDist!==null)projectedCenterHits++;
   if(selected!==null)actualSelectionHits++;
   if(sourceDisagree){sourceVsProjection++;row.sourceVsProjectedCenter++;}
   if(selectionDisagree){selectionVsProjection++;row.selectionVsProjectedCenter++;}
   if(edge){projectedNearEdgeWarnings++;row.nearProjectedTriangleEdges++;}
   if(sourceDisagree&&!edge)unclassifiedSourceProjectionMismatches++;
   if(sourceDisagree||selectionDisagree){
    const warning={variant,yaw,eyeX,pointerDelta:[dx,dy],
     originalSourceTriangleDistance:sourceDist,
     originalShaderProjectedCenterDistance:projectedDist,
     originalSelectionDistance:selected,nearNdcTriangleEdge:edge,
     originalShaderTriangleDepth:result.distance===null?null:
       1.0015-.1501/result.distance};
    if(row.firstMismatchSamples.length<8)row.firstMismatchSamples.push(warning);
    if(witnesses.length<24)witnesses.push(warning);
   }
  }
  insist(row.rays===105,'source projection grid incomplete');
  rows.push(row);testOnlyFixtureCount++;
 }
 insist(total===420&&rows.length===4&&testOnlyFixtureCount===4&&
  [sourceVsProjection,selectionVsProjection,projectedNearEdgeWarnings,
   unclassifiedSourceProjectionMismatches].every(v=>Number.isSafeInteger(v)&&v>=0&&v<=total),
  'original source/game shader sample budget invalid');
 return {schema:'mythwrought.roadmap-a.pack5-original-terrain-projection-witness.v1',
  ...source,originalTestOnlyAlternatives:4,sourceCameraRayProbes:total,
  sourceMeshRayHits:indexedTriangleHits,
  originalShaderProjectedCenterHits:projectedCenterHits,
  originalDetailedPack5SelectionHits:actualSelectionHits,
  originalMeshRayVsShaderProjectionDisagreements:sourceVsProjection,
  originalSelectionVsShaderProjectionWarnings:selectionVsProjection,
  nearProjectedTriangleEdgeWarnings:projectedNearEdgeWarnings,
  nonNearEdgeSourceShaderProjectionDisagreements:unclassifiedSourceProjectionMismatches,
  rows,witnesses,originalMainCameraPerspectiveFormulaEvaluated:true,
  actualGLTriangleRasterizationVerified:false,actualPack5DrawOrDepthTestExecuted:false,
  originalGameDomEventOrPlayerSelectionExecuted:false,
  realWorldOrSidecarSaved:false,A5SourceMaterialYawAssigned:false,
  userApprovedActualBuildingOrSupport:false,iphoneOrPwaVerified:false,
  realGameplayVisualPickabilityReady:false};
}
