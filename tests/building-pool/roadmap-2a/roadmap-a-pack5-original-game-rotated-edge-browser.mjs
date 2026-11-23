/**
 * Creator-authorized R-A test ONLY. Genuine original main.mjs in ONE entirely
 * new localhost-only Chromium context. Research-only Pack5:080
 * kiln-soldier-course/yaw2; no original gameplay source or real save edits.
 *
 * Source triangle/selection census from actual game player pose, then
 * genuine original canvas pixels and original MINE away/edge/center.
 * Source ray mismatch ≠ proven GPU pixel bug. Never claim iPhone results.
 */
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const out=path.resolve(process.argv[2]||'artifacts/roadmap-a-pack5-actual-yaw2-edge');
await mkdir(out,{recursive:true});
const host='http://127.0.0.1:4206/';
const server=spawn('python3',['-m','http.server','4206','--bind','127.0.0.1','--directory',root],
 {cwd:root,stdio:'ignore'});
const hash=b=>createHash('sha256').update(b).digest('hex');
let browser=null,context=null,page=null;
const errors={page:[],console:[]};
const report={
 schema:'mythwrought.roadmap-a.pack5-original-disposable-yaw2-pixel-vs-player.v1',
 sourceCommitContext:'68f83033163bed63a1c9fe5056bfe2ba32a5a891',
 creatorAuthorizedDisposableOriginalGame:true,
 originalGameCodeModified:false,profile:'one new isolated chromium private context',
 viewport:[844,390],devicePixelRatio:1,
 browser:'headless original game Chromium SwiftShader',realIphoneSafari:false,
 exactTestOnlySymbol:'pack5:080',testOnlyVariant:'kiln-soldier-course',
 testOnlyRotation:2,productionA5VariantYawChosen:false,
 userWorldAccessed:false,userSaveAccessed:false,originalSchema1Preserved:true,
 stage:'init',passed:false
};
const sleep=async(ms)=>page.waitForTimeout(ms);
const snap=()=>page.evaluate(()=>{
 const c=document.getElementById('scene'),d=c.dataset,api=window.__mythwroughtTest;
 const info=api.snapshot();
 return {seed:info.seed,gameShaderReady:info.graphics.shaderReady,
  webgl2:Boolean(c.getContext('webgl2') instanceof WebGL2RenderingContext),
  frames:Number(d.renderedFrames),chunks:Number(d.loadedChunks),
  sourceResidentVertices:Number(d.pack5MeshVertices),
  pack5Instances:Number(d.pack5VisibleInstances),
  residentBytes:Number(d.pack5GpuBytes),drawCalls:Number(d.pack5DrawCalls),
  pendingPages:Number(d.pack5PendingPages),gpuExcluded:Number(d.pack5BudgetExcluded),
  eye:[Number(d.playerX),Number(d.playerFeet)+1.55,Number(d.playerZ)],
  yaw:Number(d.cameraYaw),pitch:Number(d.cameraPitch),
  sourceSidecarKeys:Object.keys(localStorage).filter(k=>k.startsWith('mythwrought.pack5.builder.seed.')),
  editorEnabled:document.getElementById('pack5Enabled').checked,
  status:document.getElementById('status')?.textContent};
});
function imageDifference(a,b){
 const p=PNG.sync.read(a),q=PNG.sync.read(b);
 assert.equal(p.width,q.width);assert.equal(p.height,q.height);
 const width=p.width,height=p.height;
 assert.ok(width>=320&&width<=844&&height>=200&&height<=390,
  'actual original game scene canvas dimensions invalid');
 let changed=0,strong=0,central=0,center9x9=0,maxDelta=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const k=4*(y*width+x);
  const d=Math.abs(p.data[k]-q.data[k])+
   Math.abs(p.data[k+1]-q.data[k+1])+
   Math.abs(p.data[k+2]-q.data[k+2]);
  if(d)changed++;
  if(d>=48){
   strong++;
   if(x>width*.3&&x<width*.7&&y>height*.25&&y<height*.75)central++;
   if(Math.abs(x+0.5-width/2)<=4.5&&Math.abs(y+0.5-height/2)<=4.5)
    center9x9++;
  }
  maxDelta=Math.max(maxDelta,d);
 }
 return {actualGameCanvas:[width,height],changedPixels:changed,strongDiffPixels:strong,
  centralStrongPixels:central,center9x9StrongPixels:center9x9,maxRgbSumDelta:maxDelta,
  actualOriginalGameCanvasPngPixelsCompared:true};
}
async function capture(label){
 const png=await page.locator('#scene').screenshot({animations:'disabled'});
 await writeFile(path.join(out,label+'.png'),png);
 return {png,sha256:hash(png)};
}
async function orient(yaw,pitch){
 await page.evaluate(({yaw,pitch})=>window.__mythwroughtTest.setOrientation(yaw,pitch),{yaw,pitch});
 await page.waitForFunction(({yaw,pitch})=>{
  const d=document.getElementById('scene').dataset;
  return Math.abs(Number(d.cameraYaw)-yaw)<1e-8&&Math.abs(Number(d.cameraPitch)-pitch)<1e-8;
 },{yaw,pitch},{timeout:10000});
}
function consistentMeta(e){assert.ok(e.webgl2&&e.gameShaderReady&&e.frames>3&&e.chunks>0);}

try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
  '--enable-webgl','--ignore-gpu-blocklist'
 ]});
 context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,
  serviceWorkers:'block',permissions:[]});
 page=await context.newPage();
 page.on('pageerror',e=>errors.page.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')errors.console.push(m.text())});
 for(let tries=0;tries<25;tries++){
  try{await page.goto(host,{waitUntil:'load',timeout:6500});break;}
  catch(e){if(tries===24)throw e;await sleep(150);}
 }
 await page.waitForFunction(()=>{
  const d=document.getElementById('scene')?.dataset;
  const s=window.__mythwroughtTest?.snapshot?.();
  return Number(d?.renderedFrames)>3&&Number(d?.loadedChunks)>0&&s?.graphics?.shaderReady;
 },null,{timeout:30000});
 const initial=await snap();
 consistentMeta(initial);assert.equal(initial.pack5Instances,0);
 assert.equal(initial.sourceSidecarKeys.length,0);
 report.initial=initial;report.stage='original-game-booted';
 await page.locator('#menu').click();
 await page.evaluate(()=>{
  const el=document.getElementById('pack5Enabled');
  el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));
 });
 await page.waitForFunction(()=>document.getElementById('pack5Status')?.textContent.includes('Pack 5 ON'),
  null,{timeout:30000});
 await page.locator('#closeHelp').click();
 const cell=await page.evaluate(()=>{
  const d=document.getElementById('scene').dataset;
  return [Math.floor(Number(d.playerX))+3,
   Math.min(18,Math.floor(Number(d.playerFeet))+2),
   Math.floor(Number(d.playerZ))];
 });
 const [cx,cy,cz]=cell;
 const study=await page.evaluate(async cell=>{
  const [{forwardVector},{makePack5Fixture},
    {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset},
    {pack5TerrainVertices},{sourceRayTriangleDistance},{rotateLocalBox}]
   =await Promise.all([
    import('/src/camera.mjs'),import('/src/block-packs/pack-5/fixture.mjs'),
    import('/src/pack5-integration/catalog.mjs'),import('/src/pack5-integration/terrain-buffer.mjs'),
    import('/src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.mjs'),
    import('/src/block-packs/pack-5/fixture.mjs')
   ]);
  const d=document.getElementById('scene').dataset;
  const eye=[Number(d.playerX),Number(d.playerFeet)+1.55,Number(d.playerZ)],
    fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES),
    original=fixture.place('pack5:080',cell,2,'kiln-soldier-course');
  if(!original.ok)throw Error('Research-only source fixture rejected: '+original.reason);
  const prod=resolvePack5BuilderAsset('pack5:080','kiln-soldier-course');
  const stage=pack5TerrainVertices(prod.mesh(prod.descriptor,{rotation:2}));
  const sourceV=j=>[stage[j*9]+cell[0],stage[j*9+1]+cell[1],stage[j*9+2]+cell[2]];
  const triangles=(origin,ray)=>{
   let nearest=null;
   for(let k=0;k<stage.length/9;k+=3){
    const dist=sourceRayTriangleDistance(origin,ray,
     sourceV(k),sourceV(k+1),sourceV(k+2));
    if(dist!==null&&(nearest===null||dist<nearest))nearest=dist;
   }
   return nearest;
  };
  const same=(a,b)=>a===null&&b===null||
   a!==null&&b!==null&&Math.abs(a-b)<=2e-7;
  const tests=[],firstByCategory=Object.create(null),faceX=cell[0];
  // Eye is 3+ cells to the left in the genuine original game.
  // 6x authored seam coordinates on the rotated original brick face.
  const source=prod.descriptor;
  const parts=source.art.map(a=>rotateLocalBox(a.box,2));
  const edgesByAxis=axis=>{
   const vals=new Set([.02,.03,.035,.065,.1,.231,.5,.535,.58,.91,.97,.98]);
   for(const b of parts){
    for(const x of [b[axis],b[axis+3]])if(x>=0&&x<=1)
     vals.add(Math.round(x*1e6)/1e6);
   }
   return [...vals].sort((a,b)=>a-b).filter((v,i,arr)=>v>=.01&&v<=.99&&
    i%Math.max(1,Math.floor(arr.length/28))===0).slice(0,30);
  };
  const levels=edgesByAxis(1),lateral=edgesByAxis(2);
  let variantTriangleOnly=0,differentDistance=0,selectionOnly=0,bothHit=0,
   bothMiss=0,rays=0;
  for(const y of levels)for(const z of lateral){
   for(const shift of [-.000002,0,.000002]){
    const aim=[faceX,cell[1]+y+shift,cell[2]+z],
      dv=aim.map((x,i)=>x-eye[i]),length=Math.hypot(...dv),
      yaw=Math.atan2(dv[0],dv[2]),pitch=Math.atan2(dv[1],Math.hypot(dv[0],dv[2])),
      ray=forwardVector(yaw,pitch);
    const triangle=triangles(eye,ray),
      selection=fixture.raycast(eye,ray,6)?.distance??null;
    rays++;
    const mismatch=!same(triangle,selection);
    if(triangle!==null&&selection===null)variantTriangleOnly++;
    else if(triangle===null&&selection!==null)selectionOnly++;
    else if(triangle!==null&&selection!==null){
     bothHit++;
     if(mismatch)differentDistance++;
    }else bothMiss++;
    if(mismatch){
     const witness={classification:triangle!==null&&selection===null?'triangle-only':
      triangle===null?'selection-only':'hit-distance-difference',
      yaw,pitch,eye,localTarget:[0,y+shift,z],
      projectedTriangleDistance:triangle,sourceSelectionDistance:selection,
      originalSourceResearchOnly:true};
     // The first 20 diagnostic samples may all have the same category.
     // Never silently lose the rare triangle-only warning that the actual
     // game edge-MINE behavior is supposed to validate.
     if(!firstByCategory[witness.classification])
      firstByCategory[witness.classification]=witness;
     if(tests.length<20)tests.push(witness);
    }
   }
  }
  // Pick an actual-world-pose triangle hit missed by original detailed
  // selection if possible. Fallback: a real near-seam BOTH-hit candidate.
  const miss=firstByCategory['triangle-only'];
  const edge=miss??firstByCategory['hit-distance-difference'];
  if(variantTriangleOnly>0&&edge?.classification!=='triangle-only')
   throw Error('Original source triangle-only cases were found but not selected for actual game proof');
  const target=[cell[0]+.5,cell[1]+.5,cell[2]+.5],
    v=target.map((x,i)=>x-eye[i]);
  const center={yaw:Math.atan2(v[0],v[2]),
   pitch:Math.atan2(v[1],Math.hypot(v[0],v[2]))};
  const centralRay=forwardVector(center.yaw,center.pitch);
  const expectedCenter=fixture.raycast(eye,centralRay,6)?.distance??null;
  return {variant:'kiln-soldier-course',rotation:2,cell,eye,
   sourceTriangleCount:stage.length/27,scan:{
    sourceOriginalVariantYawResearchOnly:true,rayProbes:rays,levelCount:levels.length,
    lateralCount:lateral.length,triangleOnly:variantTriangleOnly,
    differentDistance,selectionOnly,bothHit,bothMiss,
    firstDisagreements:tests,actualGameBrowserRays:false},
   edge:edge??null,chosenEdgeClass:edge?.classification??'none',
   center,expectedCenterSelectionDistance:expectedCenter,
   firstPersonActualGameCenterRay:centralRay};
 },cell);
 report.sourceScan=study;report.stage='source-ray-exact-game-player-pose-scanned';
 assert.ok(study.scan.rayProbes>=250&&study.scan.rayProbes<=2700);
 assert.ok(study.expectedCenterSelectionDistance!==null&&study.expectedCenterSelectionDistance<=6,
  'original builder source center cannot target selected research brick');
 // If a source-predicted triangle-only edge exists, test it with original game.
 // Otherwise use the real center target for visual and definitive MINE path.
 const edgeAim=study.edge??study.center;
 await orient(edgeAim.yaw,edgeAim.pitch);await sleep(260);
 const baseline=await snap();consistentMeta(baseline);
 assert.equal(baseline.pack5Instances,0);
 const before=await capture('original-game-yaw2-kiln-before');
 report.before={...baseline,pngSha256:before.sha256};
 const placed=await page.evaluate(record=>window.__mythwroughtTest.placeBuilderAsset(record),{
  asset:'pack5:080',at:cell,orientation:2,variant:'kiln-soldier-course'
 });
 assert.equal(placed.ok,true,'original five-pack live bridge rejected one test-only authoring variant');
 assert.equal(placed.worldSchema,1);assert.equal(placed.verifiedSave,true);
 await page.waitForFunction(()=>{
  const d=document.getElementById('scene').dataset;
  return Number(d.pack5VisibleInstances)===1&&Number(d.pack5MeshVertices)>0&&
   Number(d.pack5PendingPages)===0;
 },null,{timeout:30000});
 await sleep(240);
 const real=await snap();consistentMeta(real);
 assert.equal(real.pack5Instances,1);assert.ok(real.sourceResidentVertices>0);
 assert.ok(real.residentBytes>0&&real.residentBytes<=2*1024*1024);
 assert.ok(real.drawCalls>=1&&real.drawCalls<=8);
 assert.ok(real.sourceSidecarKeys.length>=1&&real.sourceSidecarKeys.length<=3);
 const sidecarHasOriginalVariant=await page.evaluate(()=>
  Object.keys(localStorage).filter(k=>k.startsWith('mythwrought.pack5.builder.seed.'))
   .some(k=>localStorage.getItem(k)?.includes('kiln-soldier-course')));
 assert.equal(sidecarHasOriginalVariant,true,
  'genuine original private sidecar did not preserve the test-only brick variant');
 const after=await capture('original-game-yaw2-kiln-after');
 const pixels=imageDifference(before.png,after.png);
 report.placed={result:placed,...real,pngSha256:after.sha256,
  realCanvasPixelDelta:pixels,sidecarContainsExactOriginalVariant:sidecarHasOriginalVariant};
 assert.ok(pixels.strongDiffPixels>=100&&pixels.centralStrongPixels>=40,
  'original live WebGL2 canvas does not visibly distinguish true alternate Pack5 fixture');
 report.stage='genuine-alternate-variant-webgl2-pixel-evidence';
 // Actual original editor MINE is the authority. Never shortcut to layer.remove.
 if(study.edge?.classification==='triangle-only'){
  await page.locator('#dig').click();await sleep(320);
  const edgeOutcome=await snap();
  report.boundaryRealGame={
   sourcePredictedTriangleOnly:true,sourceExpectedSelectionMiss:true,
   sourceActualTriangleDistance:study.edge.projectedTriangleDistance,
   sourceActualSelectionDistance:study.edge.sourceSelectionDistance,
   actualGameMineRemoved:edgeOutcome.pack5Instances===0,
   retainedOriginalFixture:edgeOutcome.pack5Instances===1,
   actualGameStatus:edgeOutcome.status,
   actualOriginalCanvasNearCrosshairStrongChangedPixels:pixels.center9x9StrongPixels,
   realOriginalMainMineControlClicked:true,
   originalFramebufferCenterPixelNotEqualToMathAim:true};
  assert.ok(study.edge.projectedTriangleDistance!==null&&
   study.edge.sourceSelectionDistance===null,
   'Selected source ray must actually be triangle-only, never an invented miss');
  assert.ok(pixels.center9x9StrongPixels>=1,
   'Rendered original Pack5 brick is not distinguishable within 9x9 canvas pixel centers surrounding crosshair');
  assert.equal(edgeOutcome.pack5Instances,1,
   'actual original Pack5 MINE removed a source-predicted selection-miss edge');
 }else{
  report.boundaryRealGame={
   sourcePredictedTriangleOnly:false,
   actualGameEdgeMineNotExercised:true,reason:'No genuine source triangle-only ray was found from this original player pose',
   actualGpuEdgePixelCoverageNotYetCertified:true};
 }
 // Negative control: aim away and press original real MINE button.
 await orient(0,0);
 await page.locator('#dig').click();await sleep(220);
 const away=await snap();
 assert.equal(away.pack5Instances,1,'actual game removed brick while aiming away');
 report.aimAway={retained:away.pack5Instances===1,gameStatus:away.status};
 // Positive control: aim real original player center at selected physical brick.
 await orient(study.center.yaw,study.center.pitch);
 const aimed=await snap();
 assert.ok(Number.isFinite(aimed.yaw)&&Number.isFinite(aimed.pitch));
 await page.locator('#dig').click();
 await page.waitForFunction(()=>
  Number(document.getElementById('scene')?.dataset.pack5VisibleInstances)===0,
  null,{timeout:20000});
 const mined=await snap();
 assert.equal(mined.pack5Instances,0);
 report.actualPlayerMine={clickedOriginalMineButton:true,removed:true,
  sourceExpectedDistance:study.expectedCenterSelectionDistance,gameStatus:mined.status};
 report.stage='real-original-game-mine-removed-alternate-source-variant';
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.renderedFrames)>3,
  null,{timeout:30000});
 const reloaded=await snap();
 assert.equal(reloaded.pack5Instances,0);
 assert.equal(reloaded.editorEnabled,false);
 report.reloaded={fixtureAbsent:true,editorOff:true,worldSchema1Untouched:true};
 assert.deepEqual(errors.page,[]);
 report.errors=errors;
 report.passed=true;
 report.stage='completed';
 console.log('ROADMAP_A_REAL_GAME_PACK5_ROTATED_EDGE '+JSON.stringify({
  result:'PASS',viewport:report.viewport,canvas:pixels.actualGameCanvas,
  variant:study.variant,rotation:study.rotation,
  originalPoseSourceRayCount:study.scan.rayProbes,
  sourceTriangleOnly:study.scan.triangleOnly,
  sourceBothHitDistanceWarnings:study.scan.differentDistance,
  selectionOnly:study.scan.selectionOnly,
  chosenEdgeClass:study.chosenEdgeClass,
  trueTriangleOnlyEdgeMineTested:report.boundaryRealGame.sourcePredictedTriangleOnly===true,
  originalRealMineRetainedOnSourceTriangleOnlyEdge:report.boundaryRealGame.retainedOriginalFixture??null,
  realGpuVertices:real.sourceResidentVertices,
  realGpuBytes:real.residentBytes,
  realGpuDrawCalls:real.drawCalls,
  strongChangedActualCanvasPixels:pixels.strongDiffPixels,
  center9x9StrongChangedPixels:pixels.center9x9StrongPixels,
  trueEdgeMineRetainedIfSourceMiss:report.boundaryRealGame.retainedOriginalFixture??null,
  aimAwayRetained:true,actualGameMineRemoved:true,temporaryReloadAbsent:true,
  realIphoneSafari:false
 }));
}catch(e){
 report.failure=String(e?.stack||e);report.errors=errors;
 console.error('ROADMAP_A_REAL_GAME_PACK5_ROTATED_EDGE_BLOCKER',report.stage,report.failure);
 process.exitCode=1;
}finally{
 report.privateContextClosedInFinally=true;
 await writeFile(path.join(out,'ROADMAP_A_REAL_GAME_PACK5_YAW2_EDGE_EVIDENCE.json'),
  JSON.stringify(report,null,2)+'\n');
 if(context)await context.close();
 if(browser)await browser.close();
 server.kill('SIGTERM');
}
