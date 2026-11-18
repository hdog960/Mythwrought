// S2 source-specific visual acceptance: real original-game WebGL2, never mock art.
// Real mouse/keyboard input aims at sunrise/sunset; ONLY the isolated clock
// sidecar is seeded for deterministic twilight times. No world edits/teleports.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const SOURCE=process.env.GITHUB_SHA||'UNVERIFIED';
const OUT='artifacts/sky-s2';
const widths=[[667,375],[844,390],[932,430]];
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const manifest={stage:'S2',head:SOURCE,softwareOnly:true,renderer:'real WebGL2 with SwiftShader',
  images:[],results:[],errors:[]};
const sha=b=>createHash('sha256').update(b).digest('hex');
function stats(png){
  const pix=PNG.sync.read(png),pixels=pix.data;
  let l=0,lo=0,hi=0,samples=0;
  for(let y=0;y<pix.height;y+=2)for(let x=0;x<pix.width;x+=2){
    const i=(y*pix.width+x)*4;
    const brightness=(.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2])/255;
    l+=brightness;lo+=brightness<.03?1:0;hi+=brightness>.9?1:0;samples++;
  }
  return {mean:l/samples,pitchBlackPercent:100*lo/samples,brightPercent:100*hi/samples,
    width:pix.width,height:pix.height};
}
async function capture(page,viewport,kind,which='full'){
  const [w,h]=viewport,path=[viewport.join('x'),kind,which].join('-'),
    name=OUT+'/s2-'+path+'.png';
  const data=await (which==='canvas'?page.locator('#scene'):page).screenshot({path:name,animations:'disabled'});
  const metric=stats(data);
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Not a valid PNG');
  if(which==='full')assert.deepEqual([metric.width,metric.height],[w,h]);
  assert.ok(metric.mean>0,'Black image');
  const rec={name,kind,viewport:[w,h],which,sha256:sha(data),bytes:data.length,...metric};
  manifest.images.push(rec);
  return rec;
}
async function scene(page){
  return page.evaluate(()=>{
    const c=document.querySelector('#scene'),gl=c?.getContext('webgl2');
    const v=c.getBoundingClientRect(),left=document.querySelector('.left').getBoundingClientRect(),
      right=document.querySelector('.right').getBoundingClientRect();
    const vec=(key)=>{try{return JSON.parse(c.dataset[key]);}catch{return null;}};
    return {
      phase:+c.dataset.skyClockPhaseMs,cycle:+c.dataset.skyClockCycleMs,
      time:c.dataset.skyClockTime,seed:c.dataset.skyClockSeed,
      sunAltitude:+c.dataset.skySunAltitude, sunScreen:vec('skySunScreen'),
      daylight:+c.dataset.skyDaylight, ambient:vec('skyAmbient'),fog:vec('skyFog'),
      yaw:+c.dataset.cameraYaw,pitch:+c.dataset.cameraPitch,
      webgl:!!gl,glError:gl?.getError(),noError:gl?.NO_ERROR,
      loaded:+c.dataset.loadedChunks,rendered:+c.dataset.renderedFrames,
      skyDrawn:c.dataset.skyDrawn,noticeHidden:document.querySelector('#notice').hidden,
      controls:[v.left-left.right,right.left-v.right],
      framebuffer:[c.width,c.height],
      currentSeed:document.querySelector('#seed').textContent
    };
  });
}
const nonSky=page=>page.evaluate(()=>Object.fromEntries(
  Object.entries(localStorage).filter(([k])=>!k.startsWith('mythwrought-sky-s1-clock-'))));
const settle=page=>page.waitForFunction(()=>{
  const c=document.querySelector('#scene');
  return c?.dataset.skyDrawn==='true'&&+c.dataset.loadedChunks===25&&
    c.dataset.skyFog&&c.dataset.skyAmbient&&document.querySelector('#notice').hidden;
},null,{timeout:60000});
async function open(page){await page.locator('#menu').click();assert.ok(await page.locator('#help').isVisible());}
async function close(page){await page.locator('#closeHelp').click();assert.ok(!(await page.locator('#help').isVisible()));}
async function select(page,which){
  await page.locator(which==='day'?'#skySetDay':'#skySetNight').click();
  await page.waitForFunction((target)=>{
    const p=+document.querySelector('#scene')?.dataset.skyClockPhaseMs;
    return target==='night'?p>=0&&p<15000:p>=720000&&p<735000;
  },which,{timeout:15000});
}
async function setPhaseBySidecar(page,phase){
  await page.evaluate(phase=>{
    const seed=179,key='mythwrought-sky-s1-clock-'+seed;
    localStorage.setItem(key,JSON.stringify({version:1,seed,anchorPhaseMs:phase,wallAnchorMs:Date.now()}));
  },phase);
  await page.reload({waitUntil:'networkidle',timeout:45000});
  await settle(page);
  await page.waitForTimeout(450); // wait for throttled read-only instrumentation
}
async function aim(page,dir){
  await page.locator('#scene').focus();
  const key=dir==='east'?'ArrowRight':'ArrowLeft';
  await page.keyboard.down(key);
  try{
    await page.waitForFunction(dir=>{
      const yaw=+document.querySelector('#scene')?.dataset.cameraYaw;
      return dir==='east'?yaw>1.19:yaw< -1.19;
    },dir,{timeout:22000});
  }finally{await page.keyboard.up(key);}
  await page.waitForFunction(()=>{
    let p;try{p=JSON.parse(document.querySelector('#scene').dataset.skySunScreen)}catch{return false;}
    return p&&p[0]>.06&&p[0]<.94&&p[1]>.06&&p[1]<.94;
  },null,{timeout:15000});
}
let failure=null;
try{
  for(const viewport of widths){
    const [w,h]=viewport;
    const ctx=await browser.newContext({viewport:{width:w,height:h},
      deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await ctx.newPage(),errors=[],badRequests=[];
    page.on('pageerror',err=>errors.push(err.message));
    page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await settle(page);
      const initial=await scene(page);
      assert.equal(initial.cycle,1440000);
      assert.ok(initial.loaded===25&&initial.webgl&&initial.skyDrawn==='true');
      assert.ok(initial.controls.every(g=>g>=-2));
      assert.equal(initial.glError,initial.noError);
      // Persist a genuine canonical schema-1 world, THEN verify sky actions never modify it.
      await open(page);
      await page.locator('#save').click();
      const protectedBytes=await nonSky(page);
      const primary=protectedBytes['mythwrought-v002-world-179'];
      assert.ok(primary&&JSON.parse(primary).schema===1,'Original schema-1 save missing');
      await select(page,'day');
      const dayMenu=await scene(page);
      await capture(page,viewport,'day-menu');
      await close(page);
      await page.waitForTimeout(550);
      const day=await scene(page);
      const dayImage=await capture(page,viewport,'day-world','canvas');
      assert.ok(day.daylight>.90&&day.ambient.every(n=>n>=.95));
      await open(page);
      await select(page,'night');
      const nightMenu=await scene(page);
      await capture(page,viewport,'night-menu');
      await close(page);
      await page.waitForTimeout(550);
      const night=await scene(page);
      const nightImage=await capture(page,viewport,'night-world','canvas');
      assert.ok(night.daylight<.1&&night.ambient[0]>=.42);
      assert.ok(night.sunAltitude<-.9,'Sun should be beneath world at midnight');
      assert.ok(dayImage.mean>nightImage.mean*1.20,
        'Real composed scene should become substantially darker at midnight');
      assert.ok(nightImage.mean>.06,'Moonlit world became pitch black');
      assert.ok(nightImage.pitchBlackPercent<60,
        'Most of the visible scene became effectively black at night');
      assert.notDeepEqual(day.fog,night.fog,'Terrain fog must track same clock');
      assert.notDeepEqual(day.ambient,night.ambient,'Terrain ambient must track sky clock');
      // Menu closes, real rendering and original save bytes remain untouched.
      assert.deepEqual(await nonSky(page),protectedBytes,'Sky lighting changed non-sky save bytes');
      const after=await scene(page);
      assert.equal(after.glError,after.noError);
      assert.equal(after.loaded,25);
      assert.deepEqual(errors,[],'JavaScript errors in original game');
      assert.deepEqual(badRequests,[],'Missing original game resources');
      const result={viewport,dayMenu,nightMenu,day,night,dayMean:dayImage.mean,
        nightMean:nightImage.mean,nightBlackPercent:nightImage.pitchBlackPercent};
      // True clock-driven orbital direction demonstrated by camera keys.
      // Visual scenes at two warm horizons are captured at the largest viewport.
      if(w===932){
        await setPhaseBySidecar(page,420000); // 07:00 sunrise glow
        await aim(page,'east');
        const rise=await scene(page);
        assert.ok(rise.sunAltitude>.15&&rise.sunAltitude<.5);
        assert.ok(rise.sunScreen[0]>.06&&rise.sunScreen[0]<.94);
        const sunrise=await capture(page,viewport,'sunrise-world');
        await setPhaseBySidecar(page,1020000); // 17:00 sunset glow
        await aim(page,'west');
        const set=await scene(page);
        assert.ok(set.sunAltitude>.15&&set.sunAltitude<.5);
        assert.ok(set.sunScreen[0]>.06&&set.sunScreen[0]<.94);
        const sunset=await capture(page,viewport,'sunset-world');
        assert.notEqual(sunrise.sha256,sunset.sha256,
          'Sunrise/sunset real directional captures must differ');
        assert.deepEqual(await nonSky(page),protectedBytes,'Sun orbit test mutated original world save');
        Object.assign(result,{sunrise:rise,sunset:set});
      }
      manifest.results.push(result);
      console.log('SKY_S2_REAL_WEBGL_PASS',JSON.stringify({
        head:SOURCE,viewport,dayMean:result.dayMean,nightMean:result.nightMean,
        moonlit:true,glError:after.glError,chunks:after.loaded,
        sunrise:result.sunrise?.sunScreen,sunset:result.sunset?.sunScreen}));
    }finally{await ctx.close();}
  }
}catch(e){
  failure=e;manifest.errors.push(String(e?.stack||e));
  console.error('SKY_S2_REAL_WEBGL_FAIL',String(e?.stack||e));
}finally{
  await browser.close();
  await writeFile(OUT+'/s2-manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
if(failure)process.exitCode=1;
