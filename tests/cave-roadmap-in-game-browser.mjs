// Roadmap #240 C5: REAL original Mythwrought game, index.html/main.mjs,
// production UI, original player, meshes, controller and iPhone landscape rails.
// NO fake cave preview. This runs only in a new isolated Chromium test storage.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,sep,extname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {descentRoute} from '../src/underground-switchback-descent.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';
import {HISTORIC_NAMED_TARGETS,findNamedCavePlayerRoute}
 from '../src/manual-caves/named-destination-audit.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {historicSecondaryScenes,inspectDeepSkySourceBoundary}
 from './cave-roadmap-secondary-browser-evidence.mjs';
import {C6_STABLE_RENDERED_FRAMES,expectedDeepSceneResidency,
 assessDeepSceneFrame,verifyStableDeepSceneFrames}
 from './cave-roadmap-depth-frame-gate.mjs';
const {PNG}=pngjs;
const head=process.env.CAVE_EXPECTED_HEAD||'';
assert.match(head,/^[0-9a-f]{40}$/,'Actual game source exact checkout required');
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);
const sizes=[[667,375],[844,390],[932,430]],seed=314159;
const folder=resolve('artifacts/cave-roadmap-actual-game');
await mkdir(folder,{recursive:true});
const report={status:'UNVERIFIED',kind:'ACTUAL_INDEX_MAIN_GAME_WEBGL2',
 head,productionDeployed:false,actualIPhone:false,
 preservesLegacySave:true,sizes,images:[],mobileProxy:[],
 namedSitesRequested:HISTORIC_NAMED_TARGETS.length,
 secondarySitesRequested:16,
 secondarySource:'Protected tests/cave-roadmap-named-secondary-arms.test.mjs 16-case original #173 fixture',
 secondaryCaptureMethod:'Original game diagnostic camera, not a controller walk; four-seed native C separately verified',
 deepSkySourceProbes:[],
 deepVisualGate:'STRICT_FULL_RESIDENCY_FOUR_ADVANCING_RENDERED_FRAMES',
 deepResidencyChecks:[],deepResidencyFailures:[],
 farRockGpuWitnesses:[],
 namedCaptureMethod:'Original index.html/main.mjs game renderer; diagnostic camera placement only; separate native stepPlayer routes supply C proof',
 timingSource:'Headless Chromium SwiftShader requestAnimationFrame; NOT physical iPhone FPS',
 errors:[]};
const root=resolve('.'),mimes={'.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8',
 '.json':'application/json','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
 try{
  const request=new URL(req.url,'http://127.0.0.1'),p=request.pathname==='/'?'/index.html':request.pathname;
  const file=resolve(root,'.'+decodeURIComponent(p));
  if(!file.startsWith(root+sep)||!mimes[extname(file)])throw Error('Request blocked');
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mimes[extname(file)],'Cache-Control':'no-store'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
let browser=null;
function inspect(raw,w,h){
 const png=PNG.sync.read(raw);
 assert.equal(png.width,w);assert.equal(png.height,h);
 const values=new Set();let pixelCount=0;
 // Measured against original-game prior screenshots at all three viewports:
 // bright cyan/white deep openings remained despite valid hashes, 27/27
 // near buffers and positive real far GPU draws. The sampling region is
 // inside #scene, away from phone rails, minimap and gold UI elements.
 // This is an ADDITIONAL fail-closed visual gate, not a geometry substitute.
 let brightCyanGapPixels=0,originalOpenSkyPixels=0;
 for(let y=Math.floor(h*.09);y<Math.floor(h*.56);y++)
  for(let x=Math.floor(w*.19);x<Math.floor(w*.70);x++){
   const i=(y*w+x)*4,r=png.data[i],g=png.data[i+1],b=png.data[i+2];
   if(r>=140&&g>=155&&b>=170&&b-r>=10)brightCyanGapPixels++;
   if(r>=60&&g>=115&&b>=150&&b-r>=35)originalOpenSkyPixels++;
  }
 for(let y=Math.floor(h*.27);y<Math.floor(h*.77);y+=7)
  for(let x=Math.floor(w*.22);x<Math.floor(w*.78);x+=7){
   const i=(y*w+x)*4;values.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
   if(png.data[i]>35||png.data[i+1]>35||png.data[i+2]>35)pixelCount++;
  }
 return {width:w,height:h,paletteBins:values.size,litSamples:pixelCount,
  brightCyanGapPixels,originalOpenSkyPixels,
  sha256:createHash('sha256').update(raw).digest('hex')};
}
function locators(reportFromGame){
 const original=deepCaveRoute(),i=original.findIndex(p=>p.floor===-80);
 const desc=descentRoute(),j=desc.findIndex(p=>p.floor===-80);
 const east=reportFromGame.sourceCounts.eastGalleryOrigin;
 const a=east.length-9,f=caveRoute(seed,east).floorAt(a);
 const entrance=reportFromGame.entranceSites[0].mouth;
 return [
  {name:'surface-entry',surface:true,at:{x:entrance.x,z:entrance.z}},
  {name:'original-deep-spiral',at:{x:original[i].x,y:original[i].floor+1,z:original[i].z},
   to:{x:original[i+7].x,y:original[i+7].floor+2,z:original[i+7].z}},
  {name:'switchback-80',at:{x:desc[j].x,y:desc[j].floor+1,z:desc[j].z},
   to:{x:desc[j+7].x,y:desc[j+7].floor+2,z:desc[j+7].z}},
  {name:'historic-east-gallery',at:{x:east.x+a+3,y:f+1,z:east.z+8},
   to:{x:east.x+a+7,y:f+2,z:east.z+8}}
 ];
}
function historicNamedLocators(){
 // Independent physical source-backed route checks are required before any
 // named chamber is allowed to count as a rendered in-game site.
 // The photo camera is diagnostic; no claim of player walking in Chromium.
 const runtime=createStagedCaveRuntime(seed,null,{approved:true}),slugs=new Set();
 assert.equal(runtime.registeredInHomeScreen,false);
 const scenes=HISTORIC_NAMED_TARGETS.map(feature=>{
  const proof=findNamedCavePlayerRoute(runtime.world,feature);
  assert.equal(proof.ok,true,'Cannot frame unsupported historic site '+feature.name+
   ': '+JSON.stringify(proof));
  assert.ok(proof.route.length>5,'Named target is not an independent chamber '+feature.name);
  const source=proof.target,back=proof.route[Math.max(0,proof.route.length-4)];
  const slug=feature.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  assert.ok(!slugs.has(slug),'Duplicate named photo slot '+slug);
  slugs.add(slug);
  return {name:'named-'+slug,named:feature.name,
   proofSeed:seed,physicalPathSteps:proof.route.length,
   // The localhost-only original game camera accepts integer voxel positions;
   // it moves to cell center internally and rejects fractional coordinates.
   at:{x:source.x,y:source.floor+1,z:source.z},
   to:{x:back.x,y:back.floor+2,z:back.z}};
 });
 assert.equal(scenes.length,21);
 return scenes;
}

async function readActualGameFrame(page){
 return page.evaluate(()=>{
  const canvas=document.querySelector('#scene'),v=canvas?.dataset;
  const gl=canvas?.getContext('webgl2');
  if(!v)return null;
  return {center:v.chunkCenter??null,
   loadedChunks:Number(v.loadedChunks),pendingChunks:Number(v.pendingChunks),
   renderedMeshVertices:Number(v.renderedMeshVertices),
   renderedFrames:Number(v.renderedFrames),playerFeet:Number(v.playerFeet),
   webgl2:!!gl,contextLost:gl?.isContextLost()??true};
 });
}
// Strict test-only C6: never substitutes fake meshes, edits physical caves,
// hides the sky, or changes shared production renderer budgets.
async function requireSettledDeepGameFrame(page,shot,viewport){
 // Only measured original-game physics feet establish the live depth
 // section. A collider can settle just under a seam (e.g. -19.00001),
 // even when the protected authored camera request was y=-19.
 const liveStart=await readActualGameFrame(page);
 const expected=expectedDeepSceneResidency(shot.at,liveStart?.playerFeet);
 try{
  await page.waitForFunction(expected=>{
   const canvas=document.querySelector('#scene'),v=canvas?.dataset,
    gl=canvas?.getContext('webgl2');
   return !!v&&!!gl&&!gl.isContextLost()&&
    v.chunkCenter===expected.expectedCenter &&
    Number(v.loadedChunks)===expected.requiredChunks &&
    Number(v.pendingChunks)===0 &&
    Number(v.renderedMeshVertices)>800 &&
    Number(v.renderedFrames)>0 &&
    Math.abs(Number(v.playerFeet)-expected.feet)<=.2;
  },expected,{timeout:90000,polling:'raf'});
  const samples=[];
  for(let i=0;i<C6_STABLE_RENDERED_FRAMES;i++){
   await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(ok)));
   samples.push(await readActualGameFrame(page));
  }
  return {expected,receipt:verifyStableDeepSceneFrames(samples,expected)};
 }catch(error){
  const actual=await readActualGameFrame(page).catch(()=>null);
  const failure={scene:shot.name,viewport,expected,actual,
   cause:String(error.message||error)};
  report.deepResidencyFailures.push(failure);
  console.error('C6_DEEP_RESIDENCY_BLOCKED',JSON.stringify(failure));
  throw Error('C6_DEEP_RESIDENCY_BLOCKED '+JSON.stringify(failure));
 }
}

async function waitRealMesh(page,x,z,depth=false){
 await page.waitForFunction(({x,z,depth})=>{
  const el=document.querySelector('#scene'),v=el?.dataset;
  if(!v||!window.__mythwroughtTest)return false;
  const key=Math.floor(x/16)+','+Math.floor(z/16);
  return v.chunkCenter?.startsWith(key) &&
   Number(v.renderedMeshVertices)>800 &&
   Number(v.loadedChunks)>10 && Number(v.pendingChunks)===0 &&
   (!depth||Number(v.playerFeet)<-10);
 },{x,z,depth},{timeout:90000});
 await page.waitForTimeout(180);
}
try{
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const origin='http://127.0.0.1:'+server.address().port;
 const namedScenes=historicNamedLocators();
 const sourceWorld=createStagedCaveRuntime(seed,null,{approved:true}).world;
 const secondaryScenes=await historicSecondaryScenes(sourceWorld,seed);
 report.deepSkySourceProbes=inspectDeepSkySourceBoundary(sourceWorld,seed);
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   hasTouch:true,isMobile:true,serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('dialog',dialog=>dialog.accept());
  page.on('pageerror',err=>errors.push('JS: '+err.message));
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
  page.on('requestfailed',r=>errors.push('FAILED '+r.url()));
  try{
   assert.equal((await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000}))?.status(),200);
   await page.waitForFunction(()=>window.__mythwroughtTest &&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
     null,{timeout:80000});
   const original=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
   assert.equal(await page.evaluate(()=>window.__mythwroughtTest.caveMode().enabled),false);
   assert.equal(await page.locator('#scene').evaluate(
     el=>Number(el.dataset.c6FarChunks||0)),0,
    'Ordinary original game must never activate cave-only far-rock GPU');
   assert.ok(await page.locator('#scene').evaluate(el=>!!el.getContext('webgl2')));
   assert.equal(await page.locator('#dig').textContent(),'MINE');
   assert.equal(await page.locator('#jump').textContent(),'JUMP');
   await page.evaluate(()=>document.getElementById('menu').click());
   await page.locator('#seedInput').fill(String(seed));
   await page.evaluate(()=>document.getElementById('caveCreateWorld').click());
   await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
    null,{timeout:90000});
   const status=await page.evaluate(()=>window.__mythwroughtTest.caveMode());
   assert.equal(status.seed,seed);
   assert.equal(status.saveIsolation,true);
   assert.equal(status.sourceCounts.vaultBridgeConnected,true);
   assert.equal(status.sourceCounts.eastGalleryConnected,true);
   assert.equal(status.sourceCounts.entrancesConnected,true);
   assert.equal(status.entranceSites.length,4);
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
   assert.ok(await page.evaluate(()=>localStorage.getItem('mythwrought-caves-v1-seed-'+314159)));
   if(width===667){
     // Use the *actual* Cave World menu handlers, not a fake API, to show
     // that legacy shaped construction and device vault/mirror writes
     // cannot mutate a cave save or the matching ordinary-world keys.
     const guards=await page.evaluate(()=>{
       const pack5=document.getElementById('pack5Enabled');
       pack5.checked=true;
       pack5.dispatchEvent(new Event('change',{bubbles:true}));
       document.getElementById('vaultBackup').click();
       document.getElementById('mirrorRestore').click();
       return {
         pack5Checked:pack5.checked,
         vaultStatus:document.getElementById('vaultStatus').textContent,
         mirrorStatus:document.getElementById('mirrorStatus').textContent,
         oldCanonical:localStorage.getItem('mythwrought-v002-world-'+314159),
         pack5Sidecar:localStorage.getItem('mythwrought.pack5.builder.seed.'+314159),
         pack3Sidecar:localStorage.getItem('mythwrought-pack3-construction-v1:'+314159)
       };
     });
     assert.equal(guards.pack5Checked,false,'Cave World unexpectedly enabled unsaved Pack5 construction');
     assert.match(guards.vaultStatus,/Cave World|Cave profile/i);
     assert.match(guards.mirrorStatus,/Cave World|Cave profile/i);
     assert.equal(guards.oldCanonical,null,'Legacy vault/mirror wrote the protected ordinary world');
     assert.equal(guards.pack5Sidecar,null,'Pack5 sidecar created in Cave World');
     assert.equal(guards.pack3Sidecar,null,'Pack3 sidecar created in Cave World');
   }
   await page.evaluate(()=>document.getElementById('closeHelp').click());
   const shots=[...locators(status),...namedScenes,...secondaryScenes],hashes=new Set();
   assert.equal(shots.length,41,
    'Four original scenes + 21 named chambers + 16 historical secondary arms');
   for(const shot of shots){
    if(shot.surface){
     const s=await page.evaluate(({x,z})=>window.__mythwroughtTest.teleport(x,z),shot.at);
     await waitRealMesh(page,shot.at.x,shot.at.z,false);
    }else{
     await page.evaluate(({at,to})=>{
      window.__mythwroughtTest.teleportCave(at.x,at.y,at.z);
      window.__mythwroughtTest.aimAt(to.x,to.y,to.z);
     },shot);
     await waitRealMesh(page,shot.at.x,shot.at.z,shot.at.y<-10);
    }
    // Only legitimate deep scenes must pass exact resident chunk budgets:
    // normally 27, or 18 beside the lowest bedrock floor. Preserve the
    // original East Gallery open-to-sky design and all surface behavior.
    const deepGate=!shot.surface&&shot.at.y<-3?
     await requireSettledDeepGameFrame(page,shot,width+'x'+height):null;
    const farExpected=new Set(['named-vaulted-stone-fan',
     'secondary-rift-terraces-second-offset-chamber',
     'secondary-crescent-refuge-secondary-refugial-pocket']);
    if(farExpected.has(shot.name)){
     await page.waitForFunction(()=>{
      const v=document.querySelector('#scene')?.dataset;
      return !!v&&Number(v.c6FarChunks)>0 &&
       Number(v.c6FarDrawn)>0&&Number(v.c6FarPending)===0;
     },null,{timeout:90000,polling:'raf'});
    }
    const snapshot=await page.evaluate(()=>{
     const el=document.querySelector('#scene'),t=window.__mythwroughtTest;
     return {mode:t.caveMode(),center:el.dataset.chunkCenter,
      verts:Number(el.dataset.renderedMeshVertices),
      chunks:Number(el.dataset.loadedChunks),
      playerFeet:Number(el.dataset.playerFeet),
      gl:!!el.getContext('webgl2'),
      noticeHidden:document.querySelector('#notice').hidden,
      farChunks:Number(el.dataset.c6FarChunks||0),
      farBytes:Number(el.dataset.c6FarBytes||0),
      farVertices:Number(el.dataset.c6FarVertices||0),
      farDrawn:Number(el.dataset.c6FarDrawn||0),
      farPending:Number(el.dataset.c6FarPending||0),
      farUncovered:Number(el.dataset.c6FarUncovered||0),
      farFailures:Number(el.dataset.c6FarFailures||0)};
    });
    assert.equal(snapshot.mode.enabled,true);
    assert.equal(snapshot.noticeHidden,true);
    assert.ok(snapshot.gl&&snapshot.verts>800);
    assert.ok(snapshot.farChunks<=4&&snapshot.farBytes<=1048576,
     'Original game far GPU budget violated: '+JSON.stringify(snapshot));
    assert.equal(snapshot.farFailures,0,'C6 far GPU upload failed');
    if(farExpected.has(shot.name)){
     assert.ok(snapshot.farChunks>0&&snapshot.farDrawn>0,
      'C6 far source-rock not drawn: '+shot.name);
     assert.equal(snapshot.farPending,0,'C6 far GPU still pending');
     report.farRockGpuWitnesses.push({scene:shot.name,
      viewport:width+'x'+height,chunks:snapshot.farChunks,
      bytes:snapshot.farBytes,vertices:snapshot.farVertices,
      drawn:snapshot.farDrawn,uncovered:snapshot.farUncovered});
    }
    if(shot.surface)assert.equal(snapshot.farChunks,0,
     'C6 far rock leaked into surface scene');
    if(shot.named||shot.secondary){
     assert.equal(snapshot.mode.seed,seed);
     assert.ok(snapshot.playerFeet<-10&&
       Math.abs(snapshot.playerFeet-shot.at.y)<2,
       'Original game camera not at protected source target '+(shot.named||shot.secondary)+
       ' '+JSON.stringify(snapshot));
    }
    const raw=await page.screenshot({
     path:join(folder,'realgame-'+shot.name+'-'+width+'x'+height+'.png'),fullPage:true});
    if(deepGate){
     const after=await readActualGameFrame(page);
     const state=assessDeepSceneFrame(after,deepGate.expected);
     if(!state.ok||after.renderedFrames<deepGate.receipt.lastFrame){
      const failure={scene:shot.name,viewport:width+'x'+height,
       reason:'C6_POST_CAPTURE_RESIDENCY_LOST',faults:state.faults,
       expected:deepGate.expected,actual:after};
      report.deepResidencyFailures.push(failure);
      throw Error('C6_POST_CAPTURE_RESIDENCY_LOST '+JSON.stringify(failure));
     }
     report.deepResidencyChecks.push({scene:shot.name,viewport:width+'x'+height,
      ...deepGate.receipt,afterCaptureFrame:after.renderedFrames,
      loadedChunks:after.loadedChunks,pendingChunks:after.pendingChunks});
    }
    const stats=inspect(raw,width,height);
    assert.ok(stats.paletteBins>=3,'Actual WebGL2 game cave screenshot appears blank: '+shot.name);
    // These deep named and secondary sites are protected authored caverns,
    // not the intentionally open-sky East Gallery. Assert REAL screenshot
    // closure, not just resident-count / far-GPU activity / image hashes.
    if(farExpected.has(shot.name))
     assert.equal(stats.brightCyanGapPixels,0,
      'C6_DEEP_SKY_VISUAL_LEAK '+shot.name+' '+width+'x'+height+
      ' bright source-world sky pixels='+stats.brightCyanGapPixels);
    if(shot.name==='historic-east-gallery')
     assert.ok(stats.originalOpenSkyPixels>500,
      'The historical East Gallery must retain its intentionally visible open sky');
    hashes.add(stats.sha256);
    report.images.push({scene:shot.name,...stats,renderedVertices:snapshot.verts,
     loadedChunks:snapshot.chunks,playerFeet:snapshot.playerFeet,sourceHead:head,
     fullyResidentAndFrameStable:Boolean(deepGate),
     requiredDepthChunks:deepGate?.expected.requiredChunks??null,
     farRockGpuChunks:snapshot.farChunks,
     farRockGpuBytes:snapshot.farBytes,
     farRockGpuDrawn:snapshot.farDrawn,
     actualIndexMain:true,namedSourceFeature:shot.named||null,
      secondarySourceFeature:shot.secondary||null,
      originalSecondarySourceFrame:shot.sourceFrame||null,
     diagnosticCameraCapture:Boolean(shot.named||shot.secondary),
     nativeControllerProvenSeparately:Boolean(shot.named||shot.secondary),
      nativeControllerProofSeeds:shot.named||shot.secondary?[179,1,2026,-77]:null,
     proofSeed:shot.proofSeed||null,
     physicalPathSteps:shot.physicalPathSteps||null});
   }
   assert.equal(hashes.size,shots.length,
    'Distinct original game scenes did not render distinctly');
   // Restore the original east-camera area for the legacy comparable frame
   // interval proxy; named screenshots are separate per-location visual proof.
   const east=shots.find(s=>s.name==='historic-east-gallery');
   await page.evaluate(({at,to})=>{
    window.__mythwroughtTest.teleportCave(at.x,at.y,at.z);
    window.__mythwroughtTest.aimAt(to.x,to.y,to.z);
   },east);
   await waitRealMesh(page,east.at.x,east.at.z,false);
   // Capture bounded, real rendered-frame cadence while the actual Cave World
   // remains active. This is SOFTWARE Chromium telemetry, not an iPhone
   // performance certification. Preserve the numbers for manual comparison.
   const mobileProxy=await page.evaluate(async()=>{
    const padIds=['movePad','lookPad','jump','dig','place'];
    const rects=padIds.map(id=>{
      const el=document.getElementById(id),r=el?.getBoundingClientRect();
      if(!el||!r)throw Error('Missing original game touch control '+id);
      return {id,width:r.width,height:r.height,
        visible:r.width>=24&&r.height>=24&&r.left>=-1&&r.top>=-1&&
        r.right<=innerWidth+1&&r.bottom<=innerHeight+1};
    });
    const canvas=document.querySelector('#scene'),gl=canvas.getContext('webgl2');
    if(!gl||gl.isContextLost())throw Error('Original WebGL2 context is lost');
    const intervals=[];
    await new Promise(resolve=>{
      let last=null,frames=0;
      const tick=now=>{
        if(last!==null)intervals.push(now-last);
        last=now;
        if(++frames>=91)resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    intervals.sort((a,b)=>a-b);
    const p=n=>Number(intervals[Math.min(intervals.length-1,
      Math.floor((intervals.length-1)*n))].toFixed(3));
    return {frames:intervals.length,p50Ms:p(.5),p95Ms:p(.95),
      worstMs:p(1),controls:rects,contextLost:gl.isContextLost(),
      renderer:String(gl.getParameter(gl.RENDERER))};
   });
   assert.equal(mobileProxy.frames,90,'Actual in-game frame telemetry incomplete');
   assert.ok(mobileProxy.controls.every(r=>r.visible),
      'Original iPhone touch rail clipped: '+JSON.stringify(mobileProxy.controls));
   assert.equal(mobileProxy.contextLost,false);
   assert.ok(mobileProxy.p50Ms>0&&mobileProxy.p95Ms>0&&
     mobileProxy.worstMs<2000,'No usable ongoing WebGL2 frames: '+JSON.stringify(mobileProxy));
   report.mobileProxy.push({width,height,...mobileProxy});
   if(width===667){
    const cell=shots.find(x=>x.name==='switchback-80').at;
    const before=await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]);
    assert.equal(before,0,'Actual game cave air must exist to place saved block');
    await page.evaluate(([x,y,z])=>window.__mythwroughtTest.placeFixture(x,y,z,8),
      [cell.x,cell.y,cell.z]);
    assert.equal(await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]),8);
    assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
    const previousCave=await page.evaluate(()=>localStorage.getItem('mythwrought-caves-v1-seed-'+314159));
    assert.ok(previousCave);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:70000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.caveMode().enabled),false,
      'Caves must never silently auto-enable on ordinary startup');
    await page.evaluate(()=>document.getElementById('menu').click());
    await page.locator('#seedInput').fill(String(seed));
    await page.evaluate(()=>document.getElementById('caveLoadWorld').click());
    await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
      null,{timeout:90000});
    assert.equal(await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]),8,'Block placement in real main.mjs cave was not preserved by reload');
    assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),original,
    'Existing normal-world canonical save bytes changed while exploring caves');
   assert.deepEqual(errors,[],'Actual game browser errors '+width+'x'+height);
   console.log('CAVE ACTUAL GAME PASS '+width+'x'+height+' · '+shots.length+
     ' authentic index.html/main.mjs WebGL2 screenshots; '+hashes.size+' unique SHA256');
  }finally{await context.close()}
 }
 assert.equal(report.images.length,(4+21+16)*sizes.length);
 for(const [width,height] of sizes){
  const named=report.images.filter(i=>i.width===width&&i.height===height&&i.namedSourceFeature);
  assert.equal(named.length,21,'Missing individual original-game named-site views');
  assert.equal(new Set(named.map(i=>i.namedSourceFeature)).size,21);
   const secondary=report.images.filter(i=>i.width===width&&i.height===height&&i.secondarySourceFeature);
   assert.equal(secondary.length,16,'Missing individual original-game historical secondary B views');
   assert.equal(new Set(secondary.map(i=>i.secondarySourceFeature)).size,16);
 }
 assert.equal(report.deepResidencyChecks.length,39*sizes.length,
  'C6 strict four-frame residency evidence missing from deep scenes');
 assert.deepEqual(report.deepResidencyFailures,[],
  'C6 accepted incomplete or unstable original-game depth meshes');
 assert.equal(report.farRockGpuWitnesses.length,3*sizes.length,
  'C6 missing genuine source far-rock GPU in three affected scenes');
 report.namedSitesCaptured=21;
 report.secondarySitesCaptured=16;
 report.gameSnapshots=report.images.length;
 assert.equal(report.mobileProxy.length,3,'Three landscape performance observations missing');
 report.status='ACTUAL_GAME_WEBGL2_STAGING_PASS';
}catch(e){
 report.status='BLOCKED';report.errors.push(String(e.stack||e));
 console.error('REAL CAVE GAME ACCEPTANCE BLOCKED',String(e.stack||e));
 process.exitCode=1;
}finally{
 await writeFile(join(folder,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
