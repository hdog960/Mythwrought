// S0 only: read-only, genuine ORIGINAL game Chromium WebGL2 and frame-time baseline.
// This runner never edits terrain or persisted world slots. Do not use it for
// physical-iPhone certification; SwiftShader timings are hardware-specific.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const out='artifacts/sky-s0';
await mkdir(out,{recursive:true});
const source=process.env.GITHUB_SHA||'unknown';
const productionBase='e9223217ef1e91d282900c3fc13a21eeda316b63';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const sizes=[[667,375],[844,390],[932,430]];
const result={stage:'S0',sourceHead:source,productionBase,platform:'Chromium SwiftShader software WebGL2, not physical iPhone',results:[]};
let failed=false;
try {
  for (const [width,height] of sizes) {
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[],badRequests=[];
    page.on('pageerror',e=>errors.push('pageerror: '+e.message));
    page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
    try {
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await page.waitForFunction(()=>{
        const c=document.getElementById('scene');
        return c?.dataset.skyDrawn==='true' && +c.dataset.loadedChunks===25 &&
          c.width>0 && c.height>0 && document.getElementById('notice').hidden;
      },null,{timeout:45000});
      // Sampling from the real game's 360-frame foreground ring buffer.
      await page.waitForTimeout(8500);
      const scene=await page.evaluate(()=>{
        const c=document.getElementById('scene'),v=c.getBoundingClientRect(),
          l=document.querySelector('.left').getBoundingClientRect(),
          r=document.querySelector('.right').getBoundingClientRect(),gl=c.getContext('webgl2');
        return {webgl2:Boolean(gl),glError:gl?.getError(),glNoError:gl?.NO_ERROR,
          glVersion:gl?.getParameter(gl.VERSION),loadedChunks:+c.dataset.loadedChunks,
          renderedFrames:+c.dataset.renderedFrames,skyDrawn:c.dataset.skyDrawn,
          framebuffer:[c.width,c.height],viewport:[v.width,v.height],
          gripClearance:[v.left-l.right,r.left-v.right],
          preset:c.dataset.renderPreset,seed:document.querySelector('#seed').textContent,
          saveSchema:localStorage.getItem('mythwrought-v002-world-179'),
          noticeHidden:document.querySelector('#notice').hidden};
      });
      assert.equal(scene.webgl2,true,'No WebGL2 context');
      assert.equal(scene.glError,scene.glNoError,'GL error in original scene');
      assert.equal(scene.loadedChunks,25,'Not all original-world chunks loaded');
      assert.equal(scene.skyDrawn,'true','Original sky did not draw');
      assert.equal(scene.noticeHidden,true,'Fatal notice visible');
      assert.ok(scene.gripClearance.every(v=>v>=-2),'Touch rail overlaps scene');
      assert.ok(scene.renderedFrames>=30,'Insufficient real renderer frames');
      const prefix=`${out}/sky-s0-${width}x${height}`;
      const screenshots=[];
      for (const [kind,locator] of [['full',page],['canvas',page.locator('#scene')]]) {
        const path=prefix+'-'+kind+'.png';
        const bytes=await locator.screenshot({path});
        const pngWidth=bytes.readUInt32BE(16),pngHeight=bytes.readUInt32BE(20);
        assert.ok(pngWidth>100&&pngHeight>100,'Invalid screenshot dimensions');
        if(kind==='full')assert.deepEqual([pngWidth,pngHeight],[width,height]);
        screenshots.push({kind,path,sha256:createHash('sha256').update(bytes).digest('hex'),
          width:pngWidth,height:pngHeight,bytes:bytes.length});
      }
      // The built-in diagnostic is the primary measured frame-time source.
      const keysBefore=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
      await page.locator('#menu').click();
      await page.locator('#runAudit').click();
      await page.waitForFunction(()=>document.querySelector('#auditReport')?.value.includes('Foreground play frames:'),
        null,{timeout:10000});
      const report=await page.locator('#auditReport').inputValue();
      const m=/Foreground play frames: (\d+); approx (\d+) FPS; p50 ([\d.]+) ms; p95 ([\d.]+) ms; worst ([\d.]+) ms; >33ms frames (\d+)/.exec(report);
      assert.ok(m,'Game's FrameHistory diagnostic did not report measured frame times');
      const frames={samples:Number(m[1]),approxFps:Number(m[2]),p50Ms:Number(m[3]),
        p95Ms:Number(m[4]),worstMs:Number(m[5]),slowFrames:Number(m[6])};
      assert.ok(frames.samples>=60&&frames.p50Ms>0&&frames.p95Ms>=frames.p50Ms&&frames.worstMs>=frames.p95Ms);
      const keysAfter=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
      assert.deepEqual(keysAfter,keysBefore,'S0 audit modified browser storage');
      assert.deepEqual(errors,[],'JS runtime errors');
      assert.deepEqual(badRequests,[],'HTTP missing resource errors');
      result.results.push({width,height,scene,frames,screenshots,report,errors,badRequests});
      console.log('SKY_S0_BASELINE',JSON.stringify({source,width,height,frames,scene,screenshots}));
    } finally {await context.close();}
  }
} catch(error) {
  failed=true;result.failure=String(error?.stack||error);
  console.error('SKY_S0_FAILED',result.failure);
} finally {
  await browser.close();
  await writeFile(out+'/baseline.json',JSON.stringify(result,null,2)+'\n');
}
if(failed)process.exitCode=1;
