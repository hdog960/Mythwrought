// S5 authentic original-game celestial event vs non-event visual acceptance.
// No mock art, no teleports and no writes to canonical schema-1 saves.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const HEAD=process.env.GITHUB_SHA||'UNVERIFIED';
const OUT='artifacts/sky-s5';
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest={stage:'S5',sourceHead:HEAD,
  render:'real original-game Chromium WebGL2 SwiftShader',
  physicalIPhone:false,images:[],viewports:[],errors:[]};
const phaseToMs=phase=>Math.floor(phase*1440000);
const nonSky=page=>page.evaluate(()=>Object.fromEntries(
  Object.entries(localStorage).filter(([k])=>
    !k.startsWith('mythwrought-sky-s1-clock-')&&
    !k.startsWith('mythwrought-sky-s3-lunar-'))));
async function settle(page){
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyDrawn==='true'&&+c.dataset.loadedChunks===25&&
      c.dataset.skyMoonCount==='3'&&c.dataset.skyS4FieldCells==='73728'&&
      c.dataset.skyS5EventTypes==='4'&&document.querySelector('#notice').hidden;
  },null,{timeout:60000});
}
async function state(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),gl=c.getContext('webgl2');
    const vec=k=>{try{return JSON.parse(c.dataset[k])}catch{return null}};
    return {kind:+c.dataset.skyS5EventType,id:c.dataset.skyS5EventId,
      strength:+c.dataset.skyS5EventStrength,
      progress:+c.dataset.skyS5EventProgress,
      center:vec('skyS5EventCenter'),direction:vec('skyS5EventDirection'),
      cloudA:vec('skyS4CloudA'),stars:+c.dataset.skyS4StarVisibility,
      moonCount:+c.dataset.skyMoonCount,moonPhases:vec('skyMoonPhases'),
      lunarAgeDays:+c.dataset.skyLunarAgeDays,daylight:+c.dataset.skyDaylight,
      clockPhase:+c.dataset.skyClockPhaseMs,
      chunks:+c.dataset.loadedChunks,rendered:+c.dataset.renderedFrames,
      pitch:+c.dataset.cameraPitch,yaw:+c.dataset.cameraYaw,
      glError:gl.getError(),glNoError:gl.NO_ERROR,
      framebuffer:[c.width,c.height],
      schemaOneUnchanged:true
    };
  });
}
async function screenshot(page,viewport,kind,canvas){
  const [w,h]=viewport,filename=OUT+'/s5-'+w+'x'+h+'-'+kind+
    (canvas?'-canvas':'-full')+'.png';
  const buf=await (canvas?page.locator('#scene'):page).screenshot({
    path:filename,animations:'disabled'});
  assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const decoded=PNG.sync.read(buf);
  if(!canvas)assert.deepEqual([decoded.width,decoded.height],[w,h]);
  const item={filename,kind,canvas,viewport,sha256:sha(buf),
    bytes:buf.length,dimensions:[decoded.width,decoded.height]};
  manifest.images.push(item);
  return {item,decoded};
}
const brightness=(png,u,v)=>{
  const x=Math.max(0,Math.min(png.width-1,Math.round(u*png.width))),
    y=Math.max(0,Math.min(png.height-1,Math.round((1-v)*png.height)));
  const off=4*(y*png.width+x);
  return (.2126*png.data[off]+.7152*png.data[off+1]+.0722*png.data[off+2])/255;
};
// Compare genuine GPU pixels at the SAME phase and camera against an actual
// ordinary-night control. Moving streak heads cannot be validated by sampling
// only the unshifted anchor pixel; demand a coherent bright pixel population.
function eventContrast(eventCanvas,quietCanvas,center,kind){
  assert.deepEqual([eventCanvas.width,eventCanvas.height],
    [quietCanvas.width,quietCanvas.height]);
  const aspect=eventCanvas.width/eventCanvas.height;
  const u=center[0]+(kind===2?.19/aspect:0);
  const v=center[1]+(kind===2?.04:0);
  let brighter=0,peakDelta=0,maxLuminance=0;
  for(let dy=-19;dy<=19;dy++)for(let dx=-19;dx<=19;dx++){
    const x=u+dx/eventCanvas.width,y=v-dy/eventCanvas.height;
    if(x<=0||x>=1||y<=0||y>=1)continue;
    const actual=brightness(eventCanvas,x,y);
    const baseline=brightness(quietCanvas,x,y);
    const delta=actual-baseline;
    if(delta>.12)brighter++;
    peakDelta=Math.max(peakDelta,delta);
    maxLuminance=Math.max(maxLuminance,actual);
  }
  return {brighter,peakDelta,maxLuminance,comparison:'same-time-no-event-GPU-control'};
}
async function pose(page,alignment){
  await page.locator('#scene').focus();
  // Real source stepPlayer/look from genuine keyboard. Reloaded game cameras can
  // retain a previous pitch: blindly holding UP on each case climbs toward the
  // pitch clamp and pushes a world-space sky event out of view.
  const current=await page.evaluate(()=>{
    const c=document.querySelector('#scene');
    return {pitch:+c.dataset.cameraPitch,yaw:+c.dataset.cameraYaw};
  });
  if(current.pitch<.42){
    await page.keyboard.down('ArrowUp');
    try{await page.waitForFunction(()=>
      +document.querySelector('#scene').dataset.cameraPitch>.42,
      null,{timeout:23000});}finally{await page.keyboard.up('ArrowUp');}
  }else if(current.pitch>.54){
    await page.keyboard.down('ArrowDown');
    try{await page.waitForFunction(()=>
      +document.querySelector('#scene').dataset.cameraPitch<.54,
      null,{timeout:23000});}finally{await page.keyboard.up('ArrowDown');}
  }
  const yaw=+await page.evaluate(()=>
    document.querySelector('#scene').dataset.cameraYaw);
  if(alignment){
    if(!(yaw>2.28&&yaw<2.46)){
      await page.keyboard.down('ArrowLeft');
      try{await page.waitForFunction(()=>{
        const yaw=+document.querySelector('#scene').dataset.cameraYaw;
        return yaw>2.28&&yaw<2.46;
      },null,{timeout:22000});}finally{await page.keyboard.up('ArrowLeft');}
    }
  }else if(Math.abs(Math.abs(yaw)-Math.PI)>.14){
    // Restore the actual saved south-facing source camera using keyboard, not
    // injected player angles or a synthetic viewport.
    const key=yaw>=0?'ArrowRight':'ArrowLeft';
    await page.keyboard.down(key);
    try{await page.waitForFunction(()=>
      Math.abs(Math.abs(+document.querySelector('#scene').dataset.cameraYaw)-
        Math.PI)<.14,null,{timeout:22000});
    }finally{await page.keyboard.up(key);}
  }
  await page.waitForTimeout(420);
}
async function activate(page,phase,age,expected,alignment=false){
  await page.evaluate(({phase,age})=>{
    const wallNow=Date.now();
    localStorage.setItem('mythwrought-sky-s1-clock-179',
      JSON.stringify({version:1,seed:179,
        anchorPhaseMs:Math.floor(phase*1440000),wallAnchorMs:wallNow}));
    localStorage.setItem('mythwrought-sky-s3-lunar-179',
      JSON.stringify({version:1,seed:179,
        wallEpochMs:wallNow-Math.floor(age*1440000)}));
  },{phase,age});
  await page.reload({waitUntil:'networkidle',timeout:45000});
  await settle(page);
  await pose(page,alignment);
  await page.waitForFunction(({kind,phase})=>{
    const c=document.querySelector('#scene');
    return +c.dataset.skyS5EventType===kind&&
      Math.abs(+c.dataset.skyClockPhaseMs-phase*1440000)<16000;
  },{kind:expected,phase},{timeout:30000});
  const status=await state(page);
  assert.equal(status.kind,expected);
  assert.equal(status.glError,status.glNoError);
  assert.equal(status.chunks,25);
  assert.equal(status.moonCount,3);
  if(expected){
    assert.ok(status.center.every(x=>x>.07&&x<.93),
      'Event must actually appear in the physical phone landscape view: '+
      JSON.stringify({id:status.id,center:status.center,yaw:status.yaw,
        pitch:status.pitch,frame:status.framebuffer}));
    assert.ok(status.strength>.25,
      'Celestial event has insufficient physical WebGL visibility');
  }
  return status;
}
async function selectDay(page){
  await page.locator('#menu').click();
  await page.locator('#skySetDay').click();
  await page.locator('#closeHelp').click();
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return +c.dataset.skyDaylight>.9&&+c.dataset.skyS5EventType===0;
  },null,{timeout:25000});
}
let failure=null;
try{
  for(const viewport of [[667,375],[844,390],[932,430]]){
    const [w,h]=viewport,ctx=await browser.newContext({
      viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:true,isMobile:true
    });
    const page=await ctx.newPage(),errors=[],bad=[];
    page.on('pageerror',e=>errors.push(String(e.message)));
    page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await settle(page);
      await page.locator('#menu').click();
      await page.locator('#save').click();
      await page.locator('#closeHelp').click();
      const saved=await nonSky(page),key='mythwrought-v002-world-179';
      assert.equal(JSON.parse(saved[key]).schema,1);
      const ordinary=await activate(page,.055,12.25,0,false);
      await screenshot(page,viewport,'ordinary-night-no-event',false);
      const ordinaryImage=await screenshot(page,viewport,'ordinary-night-no-event',true);
      const cases=[
        {id:'ember-meteor',kind:1,phase:.055,age:11.25},
        {id:'luminous-arc',kind:2,phase:.125,age:18.25},
        {id:'silvertail-comet',kind:3,phase:.175,age:37.25},
        {id:'three-moon-conjunction',kind:4,phase:0,age:1.25,alignment:true}
      ];
      const proof=[];
      for(const entry of cases){
        const control=await activate(page,entry.phase,entry.age+1,0,
          entry.alignment||false);
        assert.equal(control.kind,0,'Control sky must have no celestial event');
        const quiet=await screenshot(page,viewport,'no-'+entry.id,false);
        const quietCanvas=await screenshot(page,viewport,'no-'+entry.id,true);
        const live=await activate(page,entry.phase,entry.age,entry.kind,
          entry.alignment||false);
        assert.equal(live.id,entry.id);
        const full=await screenshot(page,viewport,entry.id,false);
        const image=await screenshot(page,viewport,entry.id,true);
        const contrast=eventContrast(image.decoded,quietCanvas.decoded,
          live.center,entry.kind);
        assert.ok(contrast.brighter>=20&&contrast.peakDelta>.23&&
          contrast.maxLuminance>.30,
          'Real WebGL2 '+entry.id+' lacks a visible event-specific pixel cluster: '+
          JSON.stringify(contrast));
        proof.push({id:entry.id,kind:entry.kind,center:live.center,
          contrast,strength:live.strength,
          lunarAgeDays:live.lunarAgeDays,moonPhases:live.moonPhases,
          glError:live.glError,fullImage:full.item.sha256,
          sameTimeNoEventSha256:quiet.item.sha256});
        assert.deepEqual(await nonSky(page),saved,
          entry.id+' changed canonical schema-1 world data');
      }
      // Daytime S1 button must extinguish all S5 effects and preserve S3 age.
      const beforeDay=await state(page);
      await selectDay(page);
      const day=await state(page);
      assert.equal(day.kind,0);
      assert.ok(day.daylight>.9&&day.stars===0);
      assert.ok(day.moonPhases.every((p,i)=>
        Math.abs(p-beforeDay.moonPhases[i])<.002),
        'SET DAY reset three-moon phase age');
      await screenshot(page,viewport,'clean-daylight-no-event',false);
      await screenshot(page,viewport,'clean-daylight-no-event',true);
      // Recreate same meteor state after reload: exact deterministic identity.
      let repeat=null;
      if(w===932){
        const a=await activate(page,.055,11.25,1,false);
        await page.reload({waitUntil:'networkidle',timeout:45000});
        await settle(page);
        await pose(page,false);
        const b=await state(page);
        assert.equal(b.kind,1);
        assert.ok(Math.abs(b.strength-a.strength)<.01);
        repeat={sameKind:b.kind===a.kind,
          strengthDelta:Math.abs(b.strength-a.strength)};
        await screenshot(page,viewport,'meteor-reloaded-repeat',false);
        await screenshot(page,viewport,'meteor-reloaded-repeat',true);
      }
      assert.deepEqual(await nonSky(page),saved,
        'S5 did not protect original source world bytes');
      assert.deepEqual(errors,[],'JavaScript browser errors');
      assert.deepEqual(bad,[],'Missing original game resources');
      manifest.viewports.push({viewport,ordinary,proof,day,repeat,
        ordinarySha256:ordinaryImage.item.sha256,
        canonicalWorldSha256:sha(Buffer.from(saved[key]))});
      console.log('SKY_S5_REAL_WEBGL_PASS',JSON.stringify({
        head:HEAD,viewport,nonEvent:ordinary.kind,
        eventKinds:proof.map(p=>p.kind),
        eventBrightPixelCounts:proof.map(p=>p.contrast.brighter),
        glError:day.glError,chunks:day.chunks,
        protectedSchemaOne:true,repeat}));
    }finally{await ctx.close();}
  }
}catch(e){failure=e;manifest.errors.push(String(e?.stack||e));
  console.error('SKY_S5_REAL_WEBGL_FAIL',String(e?.stack||e));}
finally{
  await browser.close();
  await writeFile(OUT+'/s5-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
if(failure)process.exitCode=1;
