import test from 'node:test';
import assert from 'node:assert/strict';
import {forwardVector} from '../../../src/camera.mjs';
import {originalShaderCenterTriangleDistance}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-game-camera-projection-producer.mjs';
import {attestOriginalMainPixelCenterRayContract,originalPhysicalPixelSample,
 originalSourcePixelRay,originalSourceProjectedPixelTriangleDistance,
 originalGameFramebufferProfiles,auditOriginalPack5FramePixelWarningReadiness}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-framebuffer-pixel-risk-producer.mjs';

const profiles=originalGameFramebufferProfiles();
const evidence=auditOriginalPack5FramePixelWarningReadiness();

test('unchanged original main source contracts for player forward ray and render-budget pixel dimensions are authenticated',()=>{
 const c=attestOriginalMainPixelCenterRayContract();
 assert.equal(c.authenticatedMainContracts,10);
 assert.equal(c.exactOriginalRenderBudgetSourceRead,true);
 assert.equal(c.exactOriginalCameraSourceRead,true);
 assert.equal(c.mathOnlyNoBrowserOrPlayerInteraction,true);
});
test('original balanced/battery/economy iPhone-like DPR ratios produce real rounded framebuffer dimensions',()=>{
 assert.deepEqual(profiles.map(p=>[p.width,p.height]),[
  [844,390],[1266,585],[717,331],[548,253]]);
 assert.deepEqual(profiles.map(p=>p.centralPixelAddresses.length),[4,2,1,2]);
 assert.deepEqual(profiles.map(p=>p.mathematicalCrosshairHasExactPixelCenter),
  [false,false,true,false]);
 assert.deepEqual(profiles.map(p=>p.originalRenderScale),[1,1.5,.85,.65]);
 assert.equal(evidence.profiles.reduce((a,p)=>a+p.centerPixelCount,0),9);
});
test('original 844x390 canvas even dimensions place mathematical crosshair BETWEEN actual pixel centers',()=>{
 const original=profiles[0];
 const nearest=original.centralPixelAddresses;
 assert.deepEqual(nearest.map(p=>[p.i,p.j]),[
  [421,194],[421,195],[422,194],[422,195]]);
 const ordered=nearest.map(p=>[p.ndcX,p.ndcY]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const expected=[[-1/844,-1/390],[-1/844,1/390],
  [1/844,-1/390],[1/844,1/390]];
 for(let k=0;k<4;k++)for(let axis=0;axis<2;axis++)
  assert.ok(Math.abs(ordered[k][axis]-expected[k][axis])<2e-15,
   'original exact-fraction NDC half-pixel agreement');
 assert.ok(nearest.every(p=>p.ndcX!==0&&p.ndcY!==0));
 const odd=profiles[2].centralPixelAddresses;
 assert.equal(odd.length,1);
 assert.deepEqual([odd[0].ndcX,odd[0].ndcY],[0,0]);
});
test('original shader pixel ray derives exact forward camera direction at odd framebuffer center',()=>{
 const p=profiles[2].centralPixelAddresses[0];
 for(const [yaw,pitch] of [[Math.PI,0],[1,.27],[-1.5,-.3]]){
  const pixel=originalSourcePixelRay([.5,.5,2],yaw,pitch,p);
  const forward=forwardVector(yaw,pitch);
  for(let j=0;j<3;j++)assert.ok(Math.abs(pixel[j]-forward[j])<1e-12);
  assert.ok(Math.abs(Math.hypot(...pixel)-1)<1e-12);
 }
});
test('original offaxis GLSL pixel projected triangle distance agrees with independent original source ray on unambiguous planar triangle',()=>{
 const eye=[.5,.5,2],yaw=Math.PI,pitch=0;
 const a=[-3,-3,0],b=[4,-3,0],c=[.5,4,0];
 for(const p of profiles[0].centralPixelAddresses){
  const ray=originalSourcePixelRay(eye,yaw,pitch,p);
  const projected=originalSourceProjectedPixelTriangleDistance(a,b,c,eye,yaw,pitch,p);
  assert.ok(projected!==null);
  const z=2/(-ray[2]);
  assert.ok(Math.abs(projected-z)<1e-10);
 }
 const center=profiles[2].centralPixelAddresses[0];
 assert.ok(Math.abs(originalSourceProjectedPixelTriangleDistance(a,b,c,eye,yaw,pitch,center)-
  originalShaderCenterTriangleDistance(a,b,c,eye,yaw,pitch,717/331).distance)<1e-10);
});
test('all 12 exact original source selection warnings are sampled at 108 nearest framebuffer pixel centers',()=>{
 assert.equal(evidence.totals.originalWarningWitnesses,12);
 assert.equal(evidence.warningEvidence.length,12);
 assert.equal(evidence.totals.actualFramePixelSamples,108);
 assert.equal(evidence.totals.sourceOriginalCenterRayWarningRemains,12);
 assert.equal(evidence.totals.pixelSourceVsProjectedTriangleDisagreements,0);
 assert.ok(evidence.totals.pixelSourceTriangleHits<=108);
 assert.ok(evidence.totals.pixelSourceSelectionHits<=108);
 assert.ok(evidence.totals.selectionVsProjectedPixelTriangleWarnings<=108);
 assert.equal(evidence.totals.warningsWithAnyNearPixelSourceTriangleHit+
  evidence.totals.warningsWithNoNearPixelSourceTriangleHit,12);
 assert.ok(evidence.warningEvidence.every(w=>w.sourceOnlyFrameProfiles.length===4&&
  w.originalCenterRayDiffersFromSource===true));
});
test('source physical and analytical projected pixel results remain separated from original player ray and real GPU fragments',()=>{
 for(const w of evidence.warningEvidence){
  assert.ok(['hearth-running-bond','kiln-soldier-course'].includes(w.variant));
  assert.ok([2,3].includes(w.yaw));
  for(const profile of w.sourceOnlyFrameProfiles){
   assert.ok([1,2,4].includes(profile.pixels.length));
   for(const px of profile.pixels){
    assert.equal(px.sourceVersusAnalyticalProjectionWarning,false);
    assert.equal(px.actualGpuRasterPixelObserved,false);
    assert.ok(px.ndcX>=-1&&px.ndcX<=1&&px.ndcY>=-1&&px.ndcY<=1);
   }
  }
  const battery=w.sourceOnlyFrameProfiles[2].pixels[0];
  assert.equal(battery.ndcX,0);
  assert.equal(battery.ndcY,0);
  // Only the odd-by-odd canvas has a true center pixel, so it should
  // reproduce the same source hit/mismatch as the original player center ray.
  assert.equal(battery.selectionVersusAnalyticalProjectedWarning,true);
 }
 console.log('ROADMAP_A_ORIGINAL_GAME_FRAMEBUFFER_SOURCE_PIXEL_RISK '+JSON.stringify({
  profileSizes:evidence.profiles.map(x=>({preset:x.preset,dpr:x.dpr,
   framebuffer:x.framebuffer,crosshairAtPixelCenter:x.crosshairExactPixelCenter})),
  totals:evidence.totals,
  priorIndependent3600SourceGridWarnings:evidence.historicalDifferentSource3600GridWarnings,
  realGpuPixelsObserved:false
 }));
});
test('reject invalid pixel indices, nonfinite original eye and fake framebuffer coordinates',()=>{
 assert.throws(()=>originalPhysicalPixelSample({width:844,height:390},844,195),
  /framebuffer source pixel/);
 assert.throws(()=>originalPhysicalPixelSample({width:844,height:390},421,-1),
  /framebuffer source pixel/);
 assert.throws(()=>originalPhysicalPixelSample({width:NaN,height:390},0,0),
  /framebuffer source pixel/);
 assert.throws(()=>originalSourcePixelRay([NaN,0,0],Math.PI,0,profiles[0].centralPixelAddresses[0]),
  /framebuffer source pixel/);
 assert.throws(()=>originalSourcePixelRay([0,0,0],Math.PI,0,
  {ndcX:Infinity,ndcY:0,framebufferWidth:844,framebufferHeight:390}),
  /framebuffer source pixel/);
});
test('framebuffer source-only warning census never claims original raster, world mutation, approved structures or iPhone PWA',()=>{
 assert.equal(evidence.noGpuFragmentsSampled,true);
 assert.equal(evidence.noWebGLRasterOrDepthExecuted,true);
 assert.equal(evidence.noOriginalMainGameWorldOrPlayerEdited,true);
 assert.equal(evidence.noSavedSidecarOrSchemaChanged,true);
 assert.equal(evidence.noPack5ArtOrStructureChanged,true);
 assert.equal(evidence.noActualIphonePwaTested,true);
 assert.equal(evidence.noA5YawOrVariantChosen,true);
 assert.equal(evidence.noCreatorOrStructuralAcceptance,true);
 assert.equal(evidence.sourceOnly,true);
 assert.equal(evidence.historicalDifferentSource3600GridWarnings,88);
});
