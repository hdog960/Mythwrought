import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {HISTORIC_NAMED_TARGETS,findNamedCavePlayerRoute} from '../src/manual-caves/named-destination-audit.mjs';
import {expectedDeepSceneResidency} from './cave-roadmap-depth-frame-gate.mjs';

const origin=process.env.MYTHWROUGHT_TEST_ORIGIN??'http://127.0.0.1:4173/';
const output='artifacts/unified-world';
const legacy='{"schema":1,"seed":7,"edits":[]}';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
try{
  const context=await browser.newContext({viewport:{width:844,height:390},
    deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
  await context.addInitScript(raw=>{
    const key='mythwrought-v002-world-7';
    if(localStorage.getItem(key)===null)localStorage.setItem(key,raw);
  },legacy);
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('dialog',dialog=>dialog.accept());
  const wait=(predicate,arg)=>page.waitForFunction(predicate,arg,{timeout:95000});
  const inspect=()=>page.evaluate(()=>{
    const api=window.__mythwroughtTest,c=document.querySelector('#scene');
    return {generator:api.fourBiomeProfile()?.generator??null,seed:api.snapshot().seed,
      entrances:api.environmentEntrances(),mobs:api.mobStatus(),webgl:!!c.getContext('webgl2'),
      biome:c.dataset.skyS6WorldBiomeName,scenery:Number(c.dataset.nonblockInstances??0),
      sun:Number(c.dataset.skyDaylight),frames:Number(c.dataset.renderedFrames),
      oldSave:localStorage.getItem('mythwrought-v002-world-7')};
  });
  const ready=()=>wait(()=>{
    const data=document.querySelector('#scene').dataset;
    return Number(data.loadedChunks)>=25&&Number(data.pendingChunks)===0&&
      Number(data.nonblockInstances)>0&&data.skyDrawn==='true';
  });
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:90000});
  await ready();
  const initial=await inspect();
  assert.equal(initial.generator,M7_ENVIRONMENT_GENERATOR);
  assert.equal(initial.seed,179);
  assert.equal(initial.biome,'plains');
  assert.equal(initial.entrances.length,4);
  assert.equal(initial.mobs.species,40);
  assert.equal(initial.mobs.readonly,false);
  assert.ok(initial.webgl);
  await page.screenshot({path:output+'/fresh-default-844x390.png',timeout:90000});
  const oasis=await page.evaluate(()=>{
    const api=window.__mythwroughtTest,p=api.teleport(570,68);
    api.aimAt(572,7,63);
    return {pose:p,fluid:api.block(572,7,63)};
  });
  assert.equal(oasis.fluid,76);
  await wait(()=>{
    const d=document.querySelector('#scene').dataset;
    return d.skyS6WorldBiomeName==='desert'&&Number(d.waterSections)>0&&
      Number(d.nonblockWaterEffects)>0&&Number(d.pendingChunks)===0;
  });
  await page.screenshot({path:output+'/ordinary-desert-oasis-844x390.png',timeout:90000});
  const originalCaves=createStagedCaveRuntime(initial.seed,undefined,{approved:true}).world;
  const chamber=HISTORIC_NAMED_TARGETS.find(entry=>entry.name==='Stepped Echo Hall');
  const route=findNamedCavePlayerRoute(originalCaves,chamber);
  assert.equal(route.ok,true);
  const at={x:route.target.x,y:route.target.floor+1,z:route.target.z};
  const aim=route.route.at(-4);
  await page.evaluate(({at,aim})=>{
    const api=window.__mythwroughtTest;
    api.teleportCave(at.x,at.y,at.z);
    api.aimAt(aim.x,aim.floor+2,aim.z);
  },{at,aim});
  const depth=expectedDeepSceneResidency(at);
  await wait(({expectedCenter,requiredChunks})=>{
    const d=document.querySelector('#scene').dataset;
    return d.chunkCenter===expectedCenter&&Number(d.loadedChunks)===requiredChunks&&
      Number(d.pendingChunks)===0&&d.skyBackdrop==='deep-cave';
  },depth);
  // Preserve the actual ordinary gameplay screenshot before isolating actor
  // draws. Creature eyes share the sky classifier's color range; the source
  // camera, terrain, sky, residency and zero-pixel threshold must not change.
  const deepPng=await page.screenshot({path:output+'/ordinary-stepped-echo-hall-844x390.png',timeout:90000});
  const countBrightSky=raw=>{
    const pixels=pngjs.PNG.sync.read(raw);
    let count=0;
    for(let y=Math.floor(pixels.height*.09);y<Math.floor(pixels.height*.56);y++){
      for(let x=Math.floor(pixels.width*.19);x<Math.floor(pixels.width*.70);x++){
        const i=4*(y*pixels.width+x),[r,g,b]=pixels.data.subarray(i,i+3);
        if(r>=140&&g>=155&&b>=170&&b-r>=10)count++;
      }
    }
    return count;
  };
  const normalBrightPixels=countBrightSky(deepPng);
  const captureState=()=>page.evaluate(()=>{
    const api=window.__mythwroughtTest,d=document.querySelector('#scene').dataset;
    return {pose:api.m5ObservedPose(),actor:api.mobAcceptanceSnapshot(),
      center:d.chunkCenter,loaded:Number(d.loadedChunks),pending:Number(d.pendingChunks),
      sky:d.skyBackdrop,vertices:Number(d.renderedMeshVertices)};
  });
  const originalFrame=await captureState();
  assert.equal(originalFrame.actor.visible,true);
  let isolatedFrame,brightSkyPixels;
  const requireSameScene=frame=>{
    assert.equal(frame.center,depth.expectedCenter);
    assert.equal(frame.loaded,depth.requiredChunks);
    assert.equal(frame.pending,0);
    assert.equal(frame.sky,'deep-cave');
    assert.ok(frame.vertices>800);
    assert.equal(frame.pose.seed,originalFrame.pose.seed);
    assert.equal(frame.pose.x,originalFrame.pose.x);
    assert.equal(frame.pose.z,originalFrame.pose.z);
    assert.equal(frame.pose.yaw,originalFrame.pose.yaw);
    assert.ok(Math.abs(frame.pose.feet-originalFrame.pose.feet)<=.05);
    assert.equal(frame.actor.glError,0);
    assert.equal(frame.actor.contextLost,false);
  };
  try{
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.mobAcceptanceVisible(false)),false);
    await wait(({previous,expectedCenter,requiredChunks})=>{
      const d=document.querySelector('#scene').dataset;
      return Number(d.renderedFrames)>previous&&d.mobActors==='0'&&
        d.mobDrawCalls==='0'&&d.chunkCenter===expectedCenter&&
        Number(d.loadedChunks)===requiredChunks&&Number(d.pendingChunks)===0&&
        d.skyBackdrop==='deep-cave';
    },{previous:originalFrame.actor.renderedFrames,...depth});
    // Require four distinct real rendered frames with the unchanged source
    // scene and the same established test-only actor visibility fence.
    let previous=originalFrame.actor.renderedFrames;
    for(let i=0;i<4;i++){
      await wait(frame=>Number(document.querySelector('#scene').dataset.renderedFrames)>frame,previous);
      isolatedFrame=await captureState();
      requireSameScene(isolatedFrame);
      assert.equal(isolatedFrame.actor.visible,false);
      assert.equal(isolatedFrame.actor.drawn,0);
      assert.equal(isolatedFrame.actor.drawCalls,0);
      assert.ok(isolatedFrame.actor.renderedFrames>previous);
      previous=isolatedFrame.actor.renderedFrames;
    }
    const isolatedPng=await page.screenshot({path:output+'/sky-only-stepped-echo-hall-844x390.png',timeout:90000});
    const after=await captureState();
    requireSameScene(after);
    assert.equal(after.actor.visible,false);
    assert.equal(after.actor.drawn,0);
    assert.equal(after.actor.drawCalls,0);
    brightSkyPixels=countBrightSky(isolatedPng);
    console.log('UNIFIED_DEEP_SKY_ACTOR_ISOLATION',JSON.stringify({normalBrightPixels,brightSkyPixels,originalFrame,isolatedFrame,after}));
    assert.equal(brightSkyPixels,0,'Procedural outdoor sky leaked into the sealed deep chamber');
  }finally{
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.mobAcceptanceVisible(true)),true);
    await wait(frame=>Number(document.querySelector('#scene').dataset.renderedFrames)>frame,isolatedFrame?.actor.renderedFrames??originalFrame.actor.renderedFrames);
    assert.equal((await captureState()).actor.visible,true);
  }

  async function switchSeed(seed){
    await page.locator('#menu').click();
  await page.locator('#advancedMenu > summary').click();
    await page.locator('#seedInput').fill(String(seed));
    await page.locator('#switchWorld').click();
    await wait(value=>window.__mythwroughtTest.snapshot().seed===value,seed);
    await page.locator('#closeHelp').click();
  }
  await switchSeed(7);
  await wait(()=>document.querySelector('#scene').dataset.nonblockInstances==='0');
  const existing=await inspect();
  assert.equal(existing.generator,null);
  assert.equal(existing.oldSave,legacy);
  await switchSeed(2026);
  await ready();
  const created=await inspect();
  assert.equal(created.generator,initial.generator);
  assert.equal(created.entrances.length,4);
  assert.equal(created.oldSave,legacy);

  await page.locator('#menu').click();
  await page.locator('#advancedMenu > summary').click();
  await page.locator('#skySetNight').click();
  await page.locator('#vaultBackup').click();
  await wait(()=>document.querySelector('#vaultStatus').textContent.includes('Verified device backup'));
  await page.locator('#vaultRestore').click();
  await wait(()=>document.querySelector('#vaultStatus').textContent.includes('matching generation profile'));
  await page.locator('#mirrorSync').click();
  await wait(()=>document.querySelector('#mirrorStatus').textContent.includes('Verified mirror synced'));
  await page.locator('#mirrorRestore').click();
  await wait(()=>document.querySelector('#mirrorStatus').textContent.includes('matching generation profile'));
  await page.locator('#closeHelp').click();
  await ready();
  await wait(()=>Number(document.querySelector('#scene').dataset.skyDaylight)<.15);
  const night=await inspect();
  assert.equal(night.generator,initial.generator);
  assert.equal(night.seed,2026);
  await page.screenshot({path:output+'/ordinary-second-seed-night-844x390.png',timeout:90000});
  await page.reload({waitUntil:'domcontentloaded'});
  await ready();
  const reopened=await inspect();
  assert.equal(reopened.seed,2026);
  assert.equal(reopened.generator,initial.generator);
  assert.equal(reopened.oldSave,legacy);
  assert.deepEqual(errors,[]);
  const deep={chamber:chamber.name,at,normalBrightPixels,brightSkyPixels,requiredChunks:depth.requiredChunks};
  await writeFile(output+'/report.json',JSON.stringify({initial,oasis,deep,existing,created,night,reopened},null,2)+'\n');
  console.log('Verified ordinary creation, legacy seed bytes, day/night and generation-aware vault and mirror in WebGL2');
}finally{await browser.close();}
