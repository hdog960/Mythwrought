// SKY S6 real original-game LEGACY acceptance only.
// Do not mislabel a default terrain screenshot as an M5 four-biome world.
// This physically proves fail-closed S5 parity until separately authorized
// four-biome runtime source exists in the same repository.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const HEAD=process.env.GITHUB_SHA||'UNVERIFIED';
const OUT='artifacts/sky-s6';
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest={stage:'S6_SOURCE_ADAPTER_CANDIDATE',sourceHead:HEAD,
  biomeSource:'M5 experimental v5 NOT incorporated into this sky branch',
  genuineProfiledBiomeScreenshots:false,
  rendering:'Original game legacy-world WebGL2, not fake M5 terrain',
  phoneHardware:false,images:[],viewports:[],errors:[]};
async function state(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),gl=c.getContext('webgl2');
    const vec=k=>{try{return JSON.parse(c.dataset[k]);}catch{return null;}};
    return {source:c.dataset.skyS6SourceStatus,biome:c.dataset.skyS6BiomeName,
      strength:+c.dataset.skyS6BiomeStrength,profile:c.dataset.skyS6Profile,
      biomeCount:+c.dataset.skyS6BiomeCount,horizon:vec('skyS6Horizon'),
      fog:vec('skyFog'),stars:+c.dataset.skyS4StarVisibility,
      moonCount:+c.dataset.skyMoonCount,moonPhases:vec('skyMoonPhases'),
      skyEventType:+c.dataset.skyS5EventType,
      daylight:+c.dataset.skyDaylight,phase:+c.dataset.skyClockPhaseMs,
      renderFrames:+c.dataset.renderedFrames,chunks:+c.dataset.loadedChunks,
      glError:gl.getError(),glNoError:gl.NO_ERROR,
      canvas:[c.width,c.height],noticeHidden:document.querySelector('#notice').hidden
    };
  });
}
async function waitStage(page){
  await page.waitForFunction(()=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyDrawn==='true'&&+c.dataset.loadedChunks===25&&
      c.dataset.skyS6BiomeCount==='4'&&
      c.dataset.skyS6SourceStatus==='legacy-unchanged'&&
      document.querySelector('#notice').hidden;
  },null,{timeout:60000});
}
async function selectTime(page,time){
  await page.locator('#menu').click();
  await page.locator(time==='night'?'#skySetNight':'#skySetDay').click();
  await page.locator('#closeHelp').click();
  await page.waitForFunction(time=>{
    const c=document.querySelector('#scene');
    const p=+c.dataset.skyClockPhaseMs,d=+c.dataset.skyDaylight;
    return time==='night'?(p>=0&&p<18000&&d<.01):
      (p>=720000&&p<738000&&d>.99);
  },time,{timeout:20000});
}
async function capture(page,w,h,label,canvas){
  const path=OUT+'/s6-'+w+'x'+h+'-'+label+'-'+(canvas?'canvas':'full')+'.png';
  const buf=await (canvas?page.locator('#scene'):page).screenshot({path,animations:'disabled'});
  assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const png=PNG.sync.read(buf);
  if(!canvas)assert.deepEqual([png.width,png.height],[w,h]);
  manifest.images.push({path,sha256:sha(buf),bytes:buf.length,
    dimensions:[png.width,png.height],viewport:[w,h],label,canvas});
}
const nonClock=page=>page.evaluate(()=>Object.fromEntries(
  Object.entries(localStorage).filter(([k])=>
    !k.startsWith('mythwrought-sky-s1-clock-')&&
    !k.startsWith('mythwrought-sky-s3-lunar-'))));
let failed=null;
try{
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
    const ctx=await browser.newContext({viewport:{width:w,height:h},
      deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const page=await ctx.newPage(),errors=[],missing=[];
    page.on('pageerror',e=>errors.push(String(e.message)));
    page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await waitStage(page);
      await page.locator('#menu').click();
      await page.locator('#save').click();
      await page.locator('#closeHelp').click();
      const saved=await nonClock(page);
      const worldKey='mythwrought-v002-world-179';
      assert.equal(JSON.parse(saved[worldKey]).schema,1);
      await selectTime(page,'night');
      await page.locator('#scene').focus();
      await page.keyboard.down('ArrowUp');
      try{await page.waitForFunction(()=>
        +document.querySelector('#scene')?.dataset.cameraPitch>.42,
        null,{timeout:20000});
      }finally{await page.keyboard.up('ArrowUp');}
      const night=await state(page);
      assert.equal(night.source,'legacy-unchanged');
      assert.equal(night.biome,'none');
      assert.equal(night.profile,'none');
      assert.equal(night.strength,0);
      assert.equal(night.biomeCount,4);
      assert.ok(night.stars>.9&&night.moonCount===3);
      assert.equal(night.glError,night.glNoError);
      assert.equal(night.chunks,25);
      await capture(page,w,h,'authentic-legacy-night',false);
      await capture(page,w,h,'authentic-legacy-night',true);
      await selectTime(page,'day');
      const day=await state(page);
      assert.equal(day.source,'legacy-unchanged');
      assert.equal(day.biome,'none');
      assert.equal(day.strength,0);
      assert.ok(day.daylight>.99&&day.stars===0);
      assert.equal(day.glError,day.glNoError);
      assert.equal(day.chunks,25);
      assert.deepEqual(day.moonPhases.map((x,i)=>Math.abs(x-night.moonPhases[i])<.002),
        [true,true,true]);
      await capture(page,w,h,'authentic-legacy-day',false);
      await capture(page,w,h,'authentic-legacy-day',true);
      assert.deepEqual(await nonClock(page),saved,'Legacy world save changed under S6');
      assert.deepEqual(errors,[]);
      assert.deepEqual(missing,[]);
      manifest.viewports.push({w,h,night,day,
        originalSaveSha256:sha(Buffer.from(saved[worldKey])),
        actualM5Terrain:false,glError:day.glError});
      console.log('SKY_S6_AUTHENTIC_LEGACY_PASS',
        JSON.stringify({head:HEAD,w,h,source:night.source,
          activeBiome:night.biome,profile:night.profile,
          skyMoonCount:night.moonCount,starsAtNight:night.stars,
          starsAtDay:day.stars,glError:day.glError,chunks:day.chunks}));
    }finally{await ctx.close();}
  }
}catch(error){failed=error;manifest.errors.push(String(error?.stack||error));
  console.error('SKY_S6_AUTHENTIC_LEGACY_FAIL',String(error?.stack||error));}
finally{
  await browser.close();
  await writeFile(OUT+'/s6-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
if(failed)process.exitCode=1;
