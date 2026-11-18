// Mythwrought SKY S3: authentic 3-moon original-game WebGL2 evidence.
// Real 24-min S1 buttons, 25 chunks, exact graphics, no synthetic moon art.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const HEAD=process.env.GITHUB_SHA||'unverified',OUT='artifacts/sky-s3';
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const manifest={stage:'S3',head:HEAD,render:'real original-game Chromium WebGL2 SwiftShader',
  notPhysicalIPhone:true,screenshots:[],viewports:[],errors:[]};
const sum=b=>createHash('sha256').update(b).digest('hex');
const nonSky=page=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)
  .filter(([k])=>!k.startsWith('mythwrought-sky-s1-clock-')&&
    !k.startsWith('mythwrought-sky-s3-lunar-'))));
async function state(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),gl=c.getContext('webgl2');
    const vec=s=>{try{return JSON.parse(c.dataset[s])}catch{return null}};
    return {moonCount:+c.dataset.skyMoonCount,phases:vec('skyMoonPhases'),
      illuminations:vec('skyMoonIlluminations'),screens:vec('skyMoonScreens'),
      visibilities:vec('skyMoonVisibilities'),
      lunarAgeDays:+c.dataset.skyLunarAgeDays,lunarPersistence:c.dataset.skyLunarPersistence,
      phase:+c.dataset.skyClockPhaseMs,worldSeed:c.dataset.skyClockSeed,
      daylight:+c.dataset.skyDaylight,ambient:vec('skyAmbient'),fog:vec('skyFog'),
      pitch:+c.dataset.cameraPitch,yaw:+c.dataset.cameraYaw,
      chunks:+c.dataset.loadedChunks,rendered:+c.dataset.renderedFrames,
      skyDrawn:c.dataset.skyDrawn,glError:gl.getError(),glNoError:gl.NO_ERROR,
      noticeHidden:document.querySelector('#notice').hidden,
      canvas:[c.width,c.height],preset:c.dataset.renderPreset};
  });
}
async function settle(page){
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyDrawn==='true'&&c.dataset.skyMoonCount==='3'&&
      +c.dataset.loadedChunks===25&&document.querySelector('#notice').hidden;
  },null,{timeout:60000});
}
async function choose(page,which){
  await page.locator('#menu').click();
  assert.ok(await page.locator('#help').isVisible());
  await page.locator(which==='night'?'#skySetNight':'#skySetDay').click();
  await page.locator('#closeHelp').click();
  await page.waitForFunction(which=>{
    const c=document.querySelector('#scene'),phase=+c.dataset.skyClockPhaseMs;
    return which==='night'?phase>=0&&phase<16000:
      phase>=720000&&phase<736000;
  },which,{timeout:15000});
}
async function faceMoonSky(page){
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowUp');
  try{
    await page.waitForFunction(()=>{
      const pitch=+document.querySelector('#scene')?.dataset.cameraPitch;
      return pitch>.42;
    },null,{timeout:20000});
  }finally{await page.keyboard.up('ArrowUp');}
  await page.waitForTimeout(450);
}
function rgbAt(image,x,y){
  const px=Math.max(0,Math.min(image.width-1,Math.round(x)));
  const py=Math.max(0,Math.min(image.height-1,Math.round(y)));
  const i=(py*image.width+px)*4;
  return [...image.data.subarray(i,i+3)].map(v=>v/255);
}
const brightness=x=>.2126*x[0]+.7152*x[1]+.0722*x[2];
async function shot(page,w,h,name,canvas=false){
  const filename=OUT+'/s3-'+w+'x'+h+'-'+name+'-'+(canvas?'canvas':'full')+'.png';
  const bytes=await (canvas?page.locator('#scene'):page).screenshot({path:filename,animations:'disabled'});
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const decoded=PNG.sync.read(bytes);
  if(!canvas)assert.deepEqual([decoded.width,decoded.height],[w,h]);
  const item={filename,w:decoded.width,h:decoded.height,bytes:bytes.length,
    sha256:sum(bytes),name,canvas};
  manifest.screenshots.push(item);
  return {item,image:decoded};
}
let failure=null;
try{
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,
      isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[],bad=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url());});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await settle(page);
      // One authentic schema-1 save; sky controls must never change its bytes.
      await page.locator('#menu').click();
      await page.locator('#save').click();
      await page.locator('#closeHelp').click();
      const saved=await nonSky(page);
      const worldKey='mythwrought-v002-world-179';
      assert.equal(JSON.parse(saved[worldKey]).schema,1);
      await choose(page,'night');
      await faceMoonSky(page);
      const night=await state(page);
      assert.equal(night.moonCount,3);
      assert.equal(night.chunks,25);
      assert.equal(night.glError,night.glNoError);
      assert.equal(night.lunarPersistence,'saved');
      assert.ok(night.phases.length===3&&night.illuminations.length===3);
      assert.ok(night.visibilities.every(x=>x>.9));
      assert.ok(night.screens.every(([x,y])=>x>.06&&x<.94&&y>.06&&y<.94),
        'Exactly three real lunar directions must fit night-sky viewport');
      const fullNight=await shot(page,w,h,'three-moons-night');
      const moonCanvas=await shot(page,w,h,'three-moons-night',true);
      const im=moonCanvas.image;
      // Sample the REAL GPU framebuffer around the projected moon centers.
      // At least two illuminated/moonlit faces must be visibly distinct from
      // background sky pixels; the crescent can have a dark center by design.
      const pigments=night.screens.map(([u,v],i)=>{
        const cx=u*im.width,cy=(1-v)*im.height;
        const center=rgbAt(im,cx,cy),away=rgbAt(im,cx,cy+Math.max(18,im.height*.11));
        return {i,center,away,delta:brightness(center)-brightness(away)};
      });
      assert.ok(pigments.filter(p=>p.delta>.045).length>=2,
        'Moon uniforms did not produce distinct luminous moon pixels in real WebGL2 screenshot');
      // Day buttons work and astronomical phase never resets on time changes.
      await choose(page,'day');
      const day=await state(page);
      assert.ok(day.daylight>.9);
      assert.deepEqual(day.phases.map((x,i)=>Math.abs(x-night.phases[i])<.001),[true,true,true],
        'Manual SET DAY changed independent lunar age');
      await shot(page,w,h,'three-moons-day');
      await shot(page,w,h,'three-moons-day',true);
      assert.deepEqual(await nonSky(page),saved,'Moon controls changed schema-1 or other world data');
      // Two game days' lunar progression, installed only in independent lunar
      // sidecar; the S1 clock and saved voxel data are never rewritten.
      await page.evaluate(()=>{
        const key='mythwrought-sky-s3-lunar-179';
        localStorage.setItem(key,JSON.stringify({
          version:1,seed:179,wallEpochMs:Date.now()-2*1440000
        }));
      });
      await page.reload({waitUntil:'networkidle',timeout:45000});
      await settle(page);
      await choose(page,'night');
      await faceMoonSky(page);
      const progressed=await state(page);
      assert.ok(progressed.lunarAgeDays>=1.999&&progressed.lunarAgeDays<2.02);
      assert.ok(progressed.phases.every((p,i)=>Math.abs(p-night.phases[i])>.01),
        'Every lunar family needs an independent evolving phase');
      assert.equal(new Set(progressed.phases.map(x=>x.toFixed(3))).size,3);
      await shot(page,w,h,'two-days-later-night');
      await shot(page,w,h,'two-days-later-night',true);
      assert.deepEqual(await nonSky(page),saved,'Lunar-age change modified the original world save');
      assert.equal(progressed.glError,progressed.glNoError);
      assert.equal(progressed.chunks,25);
      // Corrupted lunar sidecar is never overwritten and the actual game still
      // presents a session-only sky rather than damaging saves.
      let corrupt=null;
      if(w===932){
        const corrupted='{"version":1,"seed":999,"wallEpochMs":1}';
        await page.evaluate(raw=>localStorage.setItem('mythwrought-sky-s3-lunar-179',raw),corrupted);
        await page.reload({waitUntil:'networkidle',timeout:45000});
        await settle(page);
        const broken=await state(page);
        const raw=await page.evaluate(()=>localStorage.getItem('mythwrought-sky-s3-lunar-179'));
        assert.equal(raw,corrupted);
        assert.equal(broken.lunarPersistence,'protected');
        assert.equal(broken.glError,broken.glNoError);
        corrupt={persistence:broken.lunarPersistence,preserved:raw===corrupted};
      }
      assert.deepEqual(errors,[],'Original game JavaScript errors');
      assert.deepEqual(bad,[],'Original game missing resources');
      manifest.viewports.push({w,h,night,day,progressed,pigments,corrupt,
        originalWorldSha256:sum(Buffer.from(saved[worldKey]))});
      console.log('SKY_S3_REAL_WEBGL_PASS',JSON.stringify({
        head:HEAD,w,h,moons:night.moonCount,moonPixels:pigments.map(x=>+x.delta.toFixed(3)),
        phases:night.phases,advancedPhases:progressed.phases,
        frames:progressed.rendered,glError:progressed.glError,chunks:progressed.chunks}));
    }finally{await context.close();}
  }
}catch(e){failure=e;manifest.errors.push(String(e?.stack||e));console.error('SKY_S3_REAL_WEBGL_FAIL',String(e?.stack||e));}
finally{
  await browser.close();
  await writeFile(OUT+'/s3-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
if(failure)process.exitCode=1;
