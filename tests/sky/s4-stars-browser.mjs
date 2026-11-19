// Genuine Mythwrought S4 panoramic-star + clock-driven-cloud acceptance.
// Real S1 menu clicks, real live original WebGL2, no mocked screenshots.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const SOURCE=process.env.GITHUB_SHA||'UNVERIFIED';
const OUT='artifacts/sky-s4';
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const manifest={stage:'S4',head:SOURCE,renderer:'authentic original-game Chromium WebGL2 SwiftShader',
  actualIPhone:false,images:[],viewports:[],errors:[]};
const sha=b=>createHash('sha256').update(b).digest('hex');
function luminance(img,x,y){
  const px=Math.max(0,Math.min(img.width-1,Math.round(x)));
  const py=Math.max(0,Math.min(img.height-1,Math.round(y)));
  const i=(py*img.width+px)*4;
  return (.2126*img.data[i]+.7152*img.data[i+1]+.0722*img.data[i+2])/255;
}
function countHighContrastStars(img){
  // Confine to upper celestial sky, away from 3 moons and voxel horizon.
  // A genuine star is a localized bright peak, not a flat colored sky.
  let bright=0;
  for(let y=8;y<Math.floor(img.height*.30);y+=2)
    for(let x=8;x<img.width-8;x+=2){
      const c=luminance(img,x,y);
      if(c<.22)continue;
      const bg=(luminance(img,x-4,y)+luminance(img,x+4,y)+
        luminance(img,x,y-4)+luminance(img,x,y+4))/4;
      if(c-bg>.095)bright++;
    }
  return bright;
}
function skyMovementPixels(a,b){
  assert.deepEqual([a.width,a.height],[b.width,b.height]);
  let changed=0,total=0;
  for(let y=12;y<Math.floor(a.height*.36);y+=2)
    for(let x=12;x<a.width-12;x+=2){
      const l=Math.abs(luminance(a,x,y)-luminance(b,x,y));
      if(l>.045)changed++;
      total++;
    }
  return {changed,total,percentage:100*changed/total};
}
async function shot(page,w,h,kind,canvas=false){
  const path=OUT+'/s4-'+w+'x'+h+'-'+kind+'-'+(canvas?'canvas':'full')+'.png';
  const bytes=await (canvas?page.locator('#scene'):page).screenshot({path,animations:'disabled'});
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const img=PNG.sync.read(bytes);
  if(!canvas)assert.deepEqual([img.width,img.height],[w,h]);
  const rec={path,kind,viewport:[w,h],canvas,bytes:bytes.length,
    dimensions:[img.width,img.height],sha256:sha(bytes)};
  manifest.images.push(rec);
  return {rec,img};
}
const nonSky=page=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)
  .filter(([k])=>!k.startsWith('mythwrought-sky-s1-clock-')&&
    !k.startsWith('mythwrought-sky-s3-lunar-'))));
async function state(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),gl=c?.getContext('webgl2');
    const vec=k=>{try{return JSON.parse(c.dataset[k])}catch{return null}};
    return {headlessWebgl:!!gl,glError:gl?.getError(),glNoError:gl?.NO_ERROR,
      chunks:+c.dataset.loadedChunks,rendered:+c.dataset.renderedFrames,
      moonCount:+c.dataset.skyMoonCount,moonPhases:vec('skyMoonPhases'),
      moonScreens:vec('skyMoonScreens'),
      starVisibility:+c.dataset.skyS4StarVisibility,
      starFamilyCount:+c.dataset.skyS4StarCount,
      fieldCells:+c.dataset.skyS4FieldCells,
      cloudA:vec('skyS4CloudA'),cloudB:vec('skyS4CloudB'),
      phase:+c.dataset.skyClockPhaseMs,daylight:+c.dataset.skyDaylight,
      yaw:+c.dataset.cameraYaw,pitch:+c.dataset.cameraPitch,
      lunarPersistence:c.dataset.skyLunarPersistence,
      frame:[c.width,c.height],skyDrawn:c.dataset.skyDrawn,
      noticeHidden:document.querySelector('#notice').hidden
    };
  });
}
async function settle(page){
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyDrawn==='true'&&c.dataset.skyMoonCount==='3'&&
      c.dataset.skyS4FieldCells==='73728'&&+c.dataset.loadedChunks===25&&
      document.querySelector('#notice').hidden;
  },null,{timeout:60000});
}
async function choose(page,which){
  await page.locator('#menu').click();
  assert.ok(await page.locator('#help').isVisible());
  await page.locator(which==='night'?'#skySetNight':'#skySetDay').click();
  await page.locator('#closeHelp').click();
  await page.waitForFunction(which=>{
    const c=document.querySelector('#scene'),phase=+c.dataset.skyClockPhaseMs,
      visibility=+c.dataset.skyS4StarVisibility;
    return which==='night'?phase>=0&&phase<16000&&visibility>.92:
      phase>=720000&&phase<736000&&visibility<.001;
  },which,{timeout:25000});
}
async function pitchUp(page){
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowUp');
  try{
    await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.cameraPitch>.42,
      null,{timeout:20000});
  }finally{await page.keyboard.up('ArrowUp');}
  await page.waitForTimeout(500);
}
async function clockOnlyJump(page,phaseMs){
  await page.evaluate(phaseMs=>{
    localStorage.setItem('mythwrought-sky-s1-clock-179',
      JSON.stringify({version:1,seed:179,anchorPhaseMs:phaseMs,wallAnchorMs:Date.now()}));
  },phaseMs);
  await page.reload({waitUntil:'networkidle',timeout:45000});
  await settle(page);
  await page.waitForFunction(expected=>{
    const p=+document.querySelector('#scene').dataset.skyClockPhaseMs;
    return Math.abs(p-expected)<18000;
  },phaseMs,{timeout:10000});
  await page.waitForTimeout(400);
}
let failure=null;
try{
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
    const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,
      hasTouch:true,isMobile:true}),page=await ctx.newPage();
    const errors=[],bad=[];
    page.on('pageerror',e=>errors.push(String(e.message)));
    page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await settle(page);
      await page.locator('#menu').click();
      await page.locator('#save').click();
      await page.locator('#closeHelp').click();
      const original=await nonSky(page),key='mythwrought-v002-world-179';
      assert.equal(JSON.parse(original[key]).schema,1);
      await choose(page,'night');
      await pitchUp(page);
      const night=await state(page);
      assert.ok(night.headlessWebgl&&night.noticeHidden);
      assert.equal(night.glError,night.glNoError);
      assert.equal(night.chunks,25);
      assert.equal(night.fieldCells,73728);
      assert.equal(night.moonCount,3);
      assert.equal(night.starFamilyCount,3);
      assert.equal(night.lunarPersistence,'saved');
      assert.ok(night.moonScreens.every(([x,y])=>x>.04&&x<.96&&y>.04&&y<.96));
      const nightFull=await shot(page,w,h,'starry-moonlit-night');
      const nightCanvas=await shot(page,w,h,'starry-moonlit-night',true);
      const starPeaks=countHighContrastStars(nightCanvas.img);
      assert.ok(starPeaks>=10,
        'Expected actual bright procedural star pixels in original WebGL2 framebuffer: '+starPeaks);
      await choose(page,'day');
      const day=await state(page);
      assert.equal(day.moonCount,3);
      assert.equal(day.starVisibility,0);
      await shot(page,w,h,'clean-daylight');
      const dayCanvas=await shot(page,w,h,'clean-daylight',true);
      assert.deepEqual(await nonSky(page),original,'S4 day/night modified original saves');
      // Advance only the S1 phase to 04:00: both states still nocturnal but
      // cloud positions must drift and the real GPU image must change.
      await clockOnlyJump(page,240000);
      await pitchUp(page);
      const dawn=await state(page);
      assert.ok(dawn.daylight<.05);
      assert.ok(dawn.starVisibility>.92);
      assert.ok(Math.abs(night.cloudA[0]-dawn.cloudA[0])>.04);
      assert.ok(Math.abs(night.cloudB[0]-dawn.cloudB[0])>.002);
      const moved=await shot(page,w,h,'four-hours-cloud-drift');
      const movedCanvas=await shot(page,w,h,'four-hours-cloud-drift',true);
      const movement=skyMovementPixels(nightCanvas.img,movedCanvas.img);
      assert.ok(movement.percentage>.25,
        'No real moving cloud/night sky pixels after 4 in-game hours');
      assert.ok(dawn.moonCount===3&&dawn.glError===dawn.glNoError);
      assert.ok(dawn.moonPhases.every((p,i)=>Math.abs(p-night.moonPhases[i])<.002),
        'Cloud movement must not reset or modify lunar age');
      assert.deepEqual(await nonSky(page),original,'S4 moved canonical save bytes');
      let rotated=null;
      if(w===932){
        await page.locator('#scene').focus();
        await page.keyboard.down('ArrowLeft');
        try{
          await page.waitForFunction(start=>{
            const yaw=+document.querySelector('#scene').dataset.cameraYaw;
            return Math.abs(yaw-start)>.44;
          },dawn.yaw,{timeout:20000});
        }finally{await page.keyboard.up('ArrowLeft');}
        rotated=await state(page);
        await shot(page,w,h,'view-relative-stars');
        await shot(page,w,h,'view-relative-stars',true);
        assert.ok(Math.abs(rotated.yaw-dawn.yaw)>.4);
      }
      assert.deepEqual(errors,[],'Browser JavaScript errors');
      assert.deepEqual(bad,[],'Missing game resources');
      manifest.viewports.push({w,h,night,day,dawn,rotated,
        nightStarPeakCount:starPeaks,cloudMovement:movement,
        canonicalSchema1Sha256:sha(Buffer.from(original[key]))});
      console.log('SKY_S4_REAL_WEBGL_PASS',JSON.stringify({
        head:SOURCE,w,h,starPeaks,fieldCells:night.fieldCells,
        moonCount:night.moonCount,nightGlow:night.starVisibility,
        daytimeGlow:day.starVisibility,cloudShift:[night.cloudA,dawn.cloudA],
        cloudMotionPixels:movement.changed,glError:dawn.glError,chunks:dawn.chunks}));
    }finally{await ctx.close();}
  }
}catch(e){failure=e;manifest.errors.push(String(e?.stack||e));console.error('SKY_S4_REAL_WEBGL_FAIL',String(e?.stack||e));}
finally{
  await browser.close();
  await writeFile(OUT+'/s4-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
if(failure)process.exitCode=1;
