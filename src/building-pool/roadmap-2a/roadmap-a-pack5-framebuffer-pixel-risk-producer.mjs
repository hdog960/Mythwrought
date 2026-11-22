/**
 * Roadmap A: original framebuffer CENTER-PIXEL vs player CENTER-RAY witness.
 *
 * Original main.mjs uses bufferDimensions, projects triangle fragments using
 * uAspect/uTan and selects blocks through the exact forwardVector at (0,0).
 * The real player ray is NOT a nearest rendered pixel-center ray.
 *
 * Source-authored Pack5 physical meshes and their original selection fixture
 * remain wholly unchanged. No WebGL2, software raster, world, saves or input.
 */
import {readFileSync} from 'node:fs';
import {bufferDimensions} from '../../render-budget.mjs';
import {clampLook,forwardVector} from '../../camera.mjs';
import {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {makePack5Fixture} from '../../block-packs/pack-5/fixture.mjs';
import {pack5TerrainVertices} from '../../pack5-integration/terrain-buffer.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';
import {originalGameProjectVertex,
 originalShaderCenterTriangleDistance} from './roadmap-a-pack5-game-camera-projection-producer.mjs';
import {auditOriginalPack5CameraWarningForensics} from './roadmap-a-pack5-camera-warning-forensics-producer.mjs';

const ensure=(v,why)=>{if(!v)throw Error('Roadmap A real-framebuffer source pixel witness: '+why);};
const fovTan=Math.tan(72*Math.PI/360);
const tolerance=2e-7;
const equals=(a,b)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=tolerance;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const scaled=(a,s)=>a.map(v=>v*s);
const unit=a=>{const n=Math.hypot(...a);ensure(Number.isFinite(n)&&n>0,'nonfinite pixel ray');return a.map(v=>v/n);};
const configs=Object.freeze([
 Object.freeze({preset:'balanced',dpr:1}),
 Object.freeze({preset:'balanced',dpr:3}),
 Object.freeze({preset:'battery',dpr:3}),
 Object.freeze({preset:'economy',dpr:3})
]);
const count=(n)=>n%2===0?2:1;
const center=(n)=>n%2===0?[n/2-1,n/2]:[Math.floor(n/2)];

export function attestOriginalMainPixelCenterRayContract(){
 const main=readFileSync(new URL('../../main.mjs',import.meta.url),'utf8');
 const render=readFileSync(new URL('../../render-budget.mjs',import.meta.url),'utf8');
 const camera=readFileSync(new URL('../../camera.mjs',import.meta.url),'utf8');
 const exact=[
  "import {normalizeRenderPreset,bufferDimensions,RENDER_PREF} from './render-budget.mjs';",
  "const buffer=bufferDimensions(canvas.clientWidth,canvas.clientHeight,renderPreset,devicePixelRatio||1);",
  "canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);",
  "gl.uniform3fv(U.uForward,facing());",
  "gl.uniform3fv(U.uRight,[-Math.cos(player.yaw),0,Math.sin(player.yaw)]);",
  "gl.uniform3fv(U.uUp,[-Math.sin(player.pitch)*Math.sin(player.yaw),Math.cos(player.pitch),-Math.sin(player.pitch)*Math.cos(player.yaw)]);",
  "gl.uniform1f(U.uAspect,w/h);",
  "gl.uniform1f(U.uTan,Math.tan(72*Math.PI/360));",
  "const shape=pack5Builder.layer.raycast(eye(),facing(),6);",
  "canvas.dataset.cameraYaw=String(player.yaw);"
 ];
 for(const x of exact)ensure(main.includes(x),'original main render/player-ray contract drift: '+x);
 ensure(render.includes("const cap=mode==='economy'?0.65:mode==='battery'?0.85:1.5;")&&
  render.includes('Math.floor(cssWidth*ratio)')&&render.includes('Math.floor(cssHeight*ratio)'),
  'original framebuffer scale/rounding producer drift');
 ensure(camera.includes('export function forwardVector(yaw,pitch)')&&
  camera.includes('export function clampLook(yaw,pitch,dx,dy'),
  'original first-person camera source drift');
 return {authenticatedMainContracts:exact.length,
  exactOriginalRenderBudgetSourceRead:true,
  exactOriginalCameraSourceRead:true,
  mathOnlyNoBrowserOrPlayerInteraction:true};
}
/** Browser canvas CSS top-left pixel (i,j), *not* an actual emitted fragment.
 * Original GL drawable physical framebuffer dimensions from bufferDimensions.
 * No assumption that the center of an EVEN framebuffer is a fragment center.
 */
export function originalPhysicalPixelSample({width,height},i,j){
 ensure([width,height,i,j].every(Number.isSafeInteger)&&
  width>=2&&height>=2&&width<=4096&&height<=2160&&
  i>=0&&i<width&&j>=0&&j<height,
  'invalid original framebuffer pixel address');
 return Object.freeze({i,j,ndcX:2*(i+.5)/width-1,
  ndcY:1-2*(j+.5)/height,
  framebufferWidth:width,framebufferHeight:height,
  pointIsExactFramebufferCenterPixel:true,realGLSampled:false});
}
export function originalSourcePixelRay(eye,yaw,pitch,pixel){
 ensure(Array.isArray(eye)&&eye.length===3&&eye.every(Number.isFinite)&&
  [yaw,pitch].every(Number.isFinite)&&
  pixel&&Number.isFinite(pixel.ndcX)&&Number.isFinite(pixel.ndcY)&&
  Number.isSafeInteger(pixel.framebufferWidth)&&Number.isSafeInteger(pixel.framebufferHeight)&&
  Math.abs(pixel.ndcX)<=1&&Math.abs(pixel.ndcY)<=1,
  'invalid real framebuffer camera math input');
 const forward=forwardVector(yaw,pitch),
  right=[-Math.cos(yaw),0,Math.sin(yaw)],
  up=[-Math.sin(pitch)*Math.sin(yaw),Math.cos(pitch),
   -Math.sin(pitch)*Math.cos(yaw)],
  aspect=pixel.framebufferWidth/pixel.framebufferHeight;
 return unit(plus(forward,plus(
  scaled(right,pixel.ndcX*aspect*fovTan),
  scaled(up,pixel.ndcY*fovTan))));
}
export function originalSourceProjectedPixelTriangleDistance(a,b,c,eye,yaw,pitch,pixel){
 const {ndcX:screenX,ndcY:screenY,framebufferWidth,framebufferHeight}=pixel;
 ensure([screenX,screenY].every(Number.isFinite)&&
  Number.isSafeInteger(framebufferWidth)&&Number.isSafeInteger(framebufferHeight),
  'invalid original framebuffer projected sampling');
 const aspect=framebufferWidth/framebufferHeight;
 const projected=[a,b,c].map(p=>originalGameProjectVertex(p,eye,yaw,pitch,aspect));
 if(projected.some(x=>x===null||x.clipped))return null;
 const [p,q,r]=projected;
 const denom=(q.y-r.y)*(p.x-r.x)+(r.x-q.x)*(p.y-r.y);
 if(Math.abs(denom)<1e-16)return null;
 const l0=((q.y-r.y)*(screenX-r.x)+(r.x-q.x)*(screenY-r.y))/denom;
 const l1=((r.y-p.y)*(screenX-r.x)+(p.x-r.x)*(screenY-r.y))/denom;
 const l2=1-l0-l1;
 if(Math.min(l0,l1,l2)<-1e-8)return null;
 const inv=l0/p.z+l1/q.z+l2/r.z;
 if(!Number.isFinite(inv)||inv<=0)return null;
 const ray=originalSourcePixelRay(eye,yaw,pitch,pixel);
 const forward=forwardVector(yaw,pitch);
 const rayDotForward=dot(ray,forward);
 if(rayDotForward<=0)return null;
 const distance=(1/inv)/rayDotForward;
 return Number.isFinite(distance)&&distance>=0?distance:null;
}
function originalTriangleAtPixel(staged,eye,yaw,pitch,pixel){
 let best=null;
 for(let i=0;i<staged.length;i+=27){
  const v=j=>[staged[i+j*9],staged[i+j*9+1],staged[i+j*9+2]];
  const hit=originalSourceProjectedPixelTriangleDistance(
   v(0),v(1),v(2),eye,yaw,pitch,pixel);
  if(hit!==null&&(best===null||hit<best))best=hit;
 }
 return best;
}
function originalRayTriangle(staged,eye,ray){
 let best=null;
 for(let i=0;i<staged.length;i+=27){
  const v=j=>[staged[i+j*9],staged[i+j*9+1],staged[i+j*9+2]];
  const t=sourceRayTriangleDistance(eye,ray,v(0),v(1),v(2));
  if(t!==null&&(best===null||t<best))best=t;
 }
 return best;
}
export function originalGameFramebufferProfiles(){
 attestOriginalMainPixelCenterRayContract();
 const rows=configs.map(cfg=>{
  const size=bufferDimensions(844,390,cfg.preset,cfg.dpr);
  const x=center(size.width),y=center(size.height);
  return {preset:cfg.preset,devicePixelRatio:cfg.dpr,
   originalCssViewport:[844,390],width:size.width,height:size.height,
   originalRenderScale:size.scale,centralPixelAddresses:
   x.flatMap(i=>y.map(j=>originalPhysicalPixelSample(size,i,j))),
   mathematicalCrosshairHasExactPixelCenter:
    size.width%2===1&&size.height%2===1};
 });
 ensure(rows.length===4&&
  rows[0].width===844&&rows[0].height===390&&
  rows[1].width===1266&&rows[1].height===585&&
  rows[2].width===717&&rows[2].height===331&&
  rows[3].width===548&&rows[3].height===253&&
  rows.reduce((a,r)=>a+r.centralPixelAddresses.length,0)===9,
  'unchanged original 844x390 canvas/pixelBudget quantization unexpected');
 return rows;
}
export function auditOriginalPack5FramePixelWarningReadiness(){
 const contract=attestOriginalMainPixelCenterRayContract();
 const baseline=auditOriginalPack5CameraWarningForensics();
 ensure(baseline.individuallyReconstructedWarnings===12&&
  baseline.originalSourceSelectionWarnings===12&&
  baseline.originalAuthenticatedSourceVsShaderDisagreements===0,
  'original 12-warning camera exact-source regression no longer trustworthy');
 const profiles=originalGameFramebufferProfiles(),cache=new Map();
 const aggregated={
  originalWarningWitnesses:0,
  actualFramePixelSamples:0,
  pixelSourceTriangleHits:0,
  pixelSourceSelectionHits:0,
  pixelSourceVsProjectedTriangleDisagreements:0,
  selectionVsProjectedPixelTriangleWarnings:0,
  sourceOriginalCenterRayWarningRemains:0,
  warningsWithAnyNearPixelSourceTriangleHit:0,
  warningsWithNoNearPixelSourceTriangleHit:0,
  originalCenterCrosshairAtPixelCenterProfiles:0
 };
 const rows=[];
 for(const warning of baseline.warningRows){
  const {variant,yaw,eyeX,originalLookDelta:[dx,dy]}=warning;
  const key=variant+'/'+yaw;
  if(!cache.has(key)){
   const original=resolvePack5BuilderAsset('pack5:080',variant);
   const mesh=original.mesh(original.descriptor,{rotation:yaw});
   const staged=pack5TerrainVertices(mesh);
   const fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
   ensure(fixture.place('pack5:080',[0,0,0],yaw,variant).ok===true,
    'temporary original Pack5 physical source placement failed');
   cache.set(key,{staged,fixture});
  }
  const {staged,fixture}=cache.get(key),eye=[eyeX,.5,2],
   look=clampLook(Math.PI,0,dx,dy,1,.008);
  const forward=forwardVector(look.yaw,look.pitch);
  const originalCenterSelection=fixture.raycast(eye,forward,6)?.distance??null;
  const originCenterSource=originalRayTriangle(staged,eye,forward);
  ensure(!equals(originalCenterSelection,originCenterSource)&&
   equals(originalCenterSelection,warning.originalSelectionDistance)&&
   equals(originCenterSource,warning.originalProjectedShaderDistance),
   'exact previous original source warning no longer independently reproduces');
  const item={variant,yaw,eyeX,originalLookDelta:[dx,dy],
   originalCenterSelectionDistance:originalCenterSelection,
   originalCenterTriangleDistance:originCenterSource,
   originalCenterRayDiffersFromSource:true,sourceOnlyFrameProfiles:[]};
  let anyTriangleHit=false;
  for(const profile of profiles){
   if(profile.mathematicalCrosshairHasExactPixelCenter)
    aggregated.originalCenterCrosshairAtPixelCenterProfiles++;
   const pixelEvidence=[];
   for(const px of profile.centralPixelAddresses){
    const direction=originalSourcePixelRay(eye,look.yaw,look.pitch,px);
    const triangle=originalRayTriangle(staged,eye,direction);
    const projected=originalTriangleAtPixel(staged,eye,look.yaw,look.pitch,px);
    const selection=fixture.raycast(eye,direction,6)?.distance??null;
    const sourceProjectedDifference=!equals(triangle,projected);
    if(sourceProjectedDifference)aggregated.pixelSourceVsProjectedTriangleDisagreements++;
    const warningAtSample=!equals(selection,projected);
    if(warningAtSample)aggregated.selectionVsProjectedPixelTriangleWarnings++;
    if(triangle!==null){aggregated.pixelSourceTriangleHits++;anyTriangleHit=true;}
    if(selection!==null)aggregated.pixelSourceSelectionHits++;
    aggregated.actualFramePixelSamples++;
    pixelEvidence.push({pixelX:px.i,pixelY:px.j,ndcX:px.ndcX,ndcY:px.ndcY,
     exactOriginalSourceTriangleDistance:triangle,
     analyticallyProjectedOriginalTriangleDistance:projected,
     originalSourceDetailedSelectionDistance:selection,
     sourceVersusAnalyticalProjectionWarning:sourceProjectedDifference,
     selectionVersusAnalyticalProjectedWarning:warningAtSample,
     actualGpuRasterPixelObserved:false});
   }
   item.sourceOnlyFrameProfiles.push({preset:profile.preset,
    devicePixelRatio:profile.devicePixelRatio,framebuffer:[profile.width,profile.height],
    crosshairLiesAtPixelCenter:profile.mathematicalCrosshairHasExactPixelCenter,
    pixels:pixelEvidence});
  }
  aggregated.originalWarningWitnesses++;
  aggregated.sourceOriginalCenterRayWarningRemains++;
  if(anyTriangleHit)aggregated.warningsWithAnyNearPixelSourceTriangleHit++;
  else aggregated.warningsWithNoNearPixelSourceTriangleHit++;
  rows.push(item);
 }
 ensure(aggregated.originalWarningWitnesses===12&&
  aggregated.actualFramePixelSamples===108&&
  aggregated.sourceOriginalCenterRayWarningRemains===12&&
  aggregated.warningsWithAnyNearPixelSourceTriangleHit+
  aggregated.warningsWithNoNearPixelSourceTriangleHit===12&&
  aggregated.pixelSourceVsProjectedTriangleDisagreements===0,
  'source-authentic real-framebuffer near-pixel parity not satisfied');
 return {schema:'mythwrought.roadmap-a.pack5-original-game-framebuffer-center-pixel-source.v1',
  ...contract,originalViewport:[844,390],profiles:profiles.map(x=>({
   preset:x.preset,dpr:x.devicePixelRatio,framebuffer:[x.width,x.height],
   centerPixelCount:x.centralPixelAddresses.length,
   crosshairExactPixelCenter:x.mathematicalCrosshairHasExactPixelCenter})),
  totals:aggregated,warningEvidence:rows,
  historicalDifferentSource3600GridWarnings:88,
  noGpuFragmentsSampled:true,noWebGLRasterOrDepthExecuted:true,
  noOriginalMainGameWorldOrPlayerEdited:true,
  noSavedSidecarOrSchemaChanged:true,noPack5ArtOrStructureChanged:true,
  noActualIphonePwaTested:true,noA5YawOrVariantChosen:true,
  noCreatorOrStructuralAcceptance:true,sourceOnly:true};
}
