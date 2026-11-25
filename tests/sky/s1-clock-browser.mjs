// S1: original, production-game Chromium WebGL2 clock/menu acceptance.
// Synthetic mobile landscape is NOT physical iPhone Safari.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const dir='artifacts/sky-s1';
await mkdir(dir,{recursive:true});
const source=process.env.GITHUB_SHA||'unverified';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const summary={stage:'S1',source,platform:'Headless Chromium SwiftShader WebGL2; NOT physical iPhone',
  cycleMs:1440000,viewportResults:[]};
const sizes=[[667,375],[844,390],[932,430]];
let error=null;
const digest=b=>createHash('sha256').update(b).digest('hex');
try{
  for(const [width,height] of sizes){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
      isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[],missing=[],images=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
    const state=()=>page.evaluate(()=>{
      const c=document.querySelector('#scene'),gl=c.getContext('webgl2');
      const v=c.getBoundingClientRect(),left=document.querySelector('.left').getBoundingClientRect(),
        right=document.querySelector('.right').getBoundingClientRect();
      return {phase:+c.dataset.skyClockPhaseMs,cycle:+c.dataset.skyClockCycleMs,
        time:c.dataset.skyClockTime,seed:c.dataset.skyClockSeed,
        persistence:c.dataset.skyClockPersistence,
        label:document.querySelector('#skyClockStatus').textContent,
        glError:gl.getError(),glNoError:gl.NO_ERROR,glVersion:gl.getParameter(gl.VERSION),
        skyDrawn:c.dataset.skyDrawn,chunks:+c.dataset.loadedChunks,drawn:+c.dataset.renderedFrames,
        framebuffer:[c.width,c.height],gripGaps:[v.left-left.right,right.left-v.right],
        noticeHidden:document.querySelector('#notice').hidden};
    });
    // Mob ecology independently checkpoints its own checksummed sidecar
    // about every 12s. Sky commands cannot be charged for that autonomous
    // activity; still compare ALL canonical world, pack and other sidecars.
    // Mob sidecar validity and schema-1 isolation have separate strict gates.
    const storageExceptClock=()=>page.evaluate(()=>Object.fromEntries(
      Object.entries(localStorage).filter(([key])=>
        !key.startsWith('mythwrought-sky-s1-clock-')&&
        !key.startsWith('mythwrought-mobs-v1-'))));
    const shot=async(kind)=>{
      const path=dir+'/s1-'+width+'x'+height+'-'+kind+'.png';
      const b=await page.screenshot({path,animations:'disabled'});
      const dimensions=[b.readUInt32BE(16),b.readUInt32BE(20)];
      assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
      assert.deepEqual(dimensions,[width,height],'Screenshot viewport mismatch');
      images.push({kind,path,sha256:digest(b),dimensions,bytes:b.length});
    };
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
      await page.waitForFunction(()=>{
        const c=document.querySelector('#scene');
        return c?.dataset.skyDrawn==='true'&&c.dataset.skyClockCycleMs==='1440000'&&
          +c.dataset.loadedChunks===25 && document.querySelector('#notice').hidden;
      },null,{timeout:45000});
      const initial=await state();
      assert.equal(initial.cycle,1440000);
      assert.ok(initial.phase>=720000&&initial.phase<750000,'Fresh sky clock should begin around noon');
      assert.equal(initial.persistence,'saved');
      assert.ok(initial.gripGaps.every(n=>n>=-2),'Thumb rail covers original viewport');
      assert.equal(initial.skyDrawn,'true');
      assert.equal(initial.glError,initial.glNoError);
      await page.locator('#menu').click(); await page.locator('#advancedMenu > summary').click();
      assert.equal(await page.locator('#help').isVisible(),true);
      assert.equal(await page.locator('#skySetDay').count(),1);
      assert.equal(await page.locator('#skySetNight').count(),1);
      await page.locator('#save').click();
      const worldBefore=await storageExceptClock();
      assert.ok(worldBefore['mythwrought-v002-world-179'],'Test canonical save not available');
      assert.equal(JSON.parse(worldBefore['mythwrought-v002-world-179']).schema,1);
      // NIGHT first: instant midnight jump, advancing even behind the open modal.
      await page.locator('#skySetNight').click();
      const night=await state();
      assert.ok(night.phase>=0&&night.phase<20000,'SET NIGHT did not jump to midnight');
      assert.equal(night.time,'00:00');
      assert.match(night.label,/24-MIN CYCLE RUNNING/);
      assert.equal(night.persistence,'saved');
      await shot('night-menu');
      const phaseOpenBefore=(await state()).phase;
      await page.waitForTimeout(600);
      const phaseOpenAfter=(await state()).phase;
      assert.ok(phaseOpenAfter>phaseOpenBefore,
        'Clock paused while settings were open');
      await page.locator('#closeHelp').click();
      assert.equal(await page.locator('#help').isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'scene');
      await shot('night-world');
      // DAY: no extra frame-loop registration and no pause. Existing shader unchanged.
      await page.locator('#menu').click(); await page.locator('#advancedMenu > summary').click();
      await page.locator('#skySetDay').click();
      const day=await state();
      assert.ok(day.phase>=720000&&day.phase<740000,'SET DAY did not jump to noon');
      assert.equal(day.time,'12:00');
      assert.match(day.label,/24-MIN CYCLE RUNNING/);
      await shot('day-menu');
      await page.locator('#closeHelp').click();
      await shot('day-world');
      const worldAfter=await storageExceptClock();
      assert.deepEqual(worldAfter,worldBefore,'Sky controls changed non-sky storage');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
        null,{timeout:45000});
      const reload=await state();
      assert.equal(reload.seed,'179');
      assert.ok(reload.phase>=720000&&reload.phase<750000,'Per-seed day choice not retained after reload');
      assert.equal(reload.persistence,'saved');
      assert.deepEqual(await storageExceptClock(),worldBefore,'Reload changed canonical save bytes');
      // Cross-world isolation: only in the largest viewport to keep evidence focused.
      let seedIsolation=null;
      if(width===932){
        const clockRaw=seed=>page.evaluate(seed=>localStorage.getItem('mythwrought-sky-s1-clock-'+seed),seed);
        const originalClock=await clockRaw(179);
        assert.ok(originalClock,'Missing original persisted clock');
        const originalRecord=JSON.parse(originalClock);
        assert.equal(originalRecord.seed,179);
        assert.equal(originalRecord.anchorPhaseMs,720000);
        await page.locator('#menu').click(); await page.locator('#advancedMenu > summary').click();
        await page.locator('#seedInput').fill('Moonlit Vale');
        await page.locator('#switchWorld').click();
        await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.skyClockSeed!=='179');
        await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
          null,{timeout:45000});
        const other=await state();
        assert.ok(other.phase>=720000&&other.phase<750000,'New world did not receive its own noon');
        await page.locator('#skySetNight').click();
        const otherNight=await state();
        assert.ok(otherNight.phase<20000);
        const otherClock=await clockRaw(other.seed);
        assert.equal(JSON.parse(otherClock).anchorPhaseMs,0);
        assert.equal(await clockRaw(179),originalClock,'Night in other world overwrote seed179 clock');
        await page.locator('#seedInput').fill('179');
        await page.locator('#switchWorld').click();
        await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.skyClockSeed==='179');
        await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
          null,{timeout:45000});
        const back=await state();
        assert.equal(back.seed,'179');
        assert.equal(await clockRaw(179),originalClock,'Returning to seed179 rewrote its saved clock');
        assert.equal(await clockRaw(other.seed),otherClock,'Returning to seed179 rewrote other saved clock');
        // A world clock deliberately advances during time spent in another world.
        // Compare the measured renderer phase to its own immutable persisted wall anchor,
        // not an arbitrary 30-second noon window on slow software-rendered runners.
        const receipt=await page.evaluate(record=>{
          const cycle=1440000,now=Date.now(),phase=Number(document.querySelector('#scene').dataset.skyClockPhaseMs);
          const expected=(record.anchorPhaseMs+Math.max(0,now-record.wallAnchorMs))%cycle;
          const delta=Math.abs(phase-expected);
          return {phase,expected,wallNow:now,wallAnchorMs:record.wallAnchorMs,phaseError:Math.min(delta,cycle-delta)};
        },originalRecord);
        assert.ok(receipt.phaseError<2000,'Returned renderer clock disagrees with original saved wall anchor '+JSON.stringify(receipt));
        seedIsolation={otherSeed:other.seed,otherPhase:other.phase,otherNightPhase:otherNight.phase,
          returningSeed:back.seed,returnPhase:back.phase,originalClockPreserved:true,otherClockPreserved:true,receipt};
        await page.locator('#closeHelp').click();
      }
      // Measure actual game FrameHistory rather than claiming FPS from CI success.
      // These are software Chromium/SwiftShader observations, not iPhone results.
      await page.waitForTimeout(4000);
      const beforeAudit=await storageExceptClock();
      await page.locator('#menu').click(); await page.locator('#advancedMenu > summary').click();
      await page.locator('#runAudit').click();
      await page.waitForFunction(()=>document.querySelector('#auditReport')?.value.includes('Foreground play frames:'),
        null,{timeout:10000});
      const audit=await page.locator('#auditReport').inputValue();
      const perfMatch=/Foreground play frames: (\d+); approx (\d+) FPS; p50 ([\d.]+) ms; p95 ([\d.]+) ms; worst ([\d.]+) ms; >33ms frames (\d+)/.exec(audit);
      assert.ok(perfMatch,"Actual game FrameHistory failed to return performance data");
      const performance={samples:+perfMatch[1],approxFps:+perfMatch[2],p50Ms:+perfMatch[3],
        p95Ms:+perfMatch[4],worstMs:+perfMatch[5],slowFrames:+perfMatch[6]};
      assert.ok(performance.samples>=30&&performance.p95Ms>=performance.p50Ms);
      await page.locator('#closeHelp').click();
      assert.deepEqual(await storageExceptClock(),beforeAudit,
        'Read-only performance audit changed non-clock saved data');
      await page.waitForFunction(()=>{const c=document.querySelector('#scene');return +c.dataset.loadedChunks===25&&+c.dataset.pendingChunks===0;},null,{timeout:45000});
      const end=await state();
      assert.equal(end.glError,end.glNoError,'WebGL error after S1 controls');
      assert.equal(end.chunks,25);
      assert.deepEqual(errors,[]);
      assert.deepEqual(missing,[]);
      const entry={width,height,initial,night,day,reload,end,phaseOpenDeltaMs:phaseOpenAfter-phaseOpenBefore,
        canonicalWorldSha256:digest(Buffer.from(worldBefore['mythwrought-v002-world-179'])),
        seedIsolation,performance,images,errors,missing};
      summary.viewportResults.push(entry);
      console.log('SKY_S1_BROWSER_PASS',JSON.stringify({
        head:source,width,height,screenshots:images.length,openDeltaMs:entry.phaseOpenDeltaMs,
        glError:end.glError,chunks:end.chunks,performance,seedIsolation}));
    }finally{await context.close();}
  }
}catch(e){error=e;summary.error=String(e?.stack||e);console.error('SKY_S1_BROWSER_FAIL',summary.error);}
finally{
  await browser.close();
  await writeFile(dir+'/s1-manifest.json',JSON.stringify(summary,null,2)+'\n');
}
if(error)process.exitCode=1;
