// S1: original, production-game Chromium WebGL2 clock/menu acceptance.
// Synthetic mobile landscape is NOT physical iPhone Safari.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {waitForRealStableMap} from './source-map-stability.mjs';
import {M6_BALANCED_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';

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
    page.on('dialog',d=>d.accept());
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
      await page.locator('#playerMenu').waitFor({state:'visible',timeout:45000});
      assert.equal(await page.locator('#help').isVisible(),true,
        'V6-only admission required for original S1 sky clock test');
      await page.getByRole('button',{name:/NEW WORLD/}).click();
      await page.locator('#help').waitFor({state:'hidden',timeout:45000});
      const seed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),
        M6_BALANCED_GENERATOR);
      const worldKey='mythwrought-v002-world-'+seed;
      await page.waitForFunction(()=>{
        const c=document.querySelector('#scene');
        return c?.dataset.skyDrawn==='true'&&c.dataset.skyClockCycleMs==='1440000'&&
          +c.dataset.loadedChunks===25 && document.querySelector('#notice').hidden;
      },null,{timeout:45000});
      const initial=await state();
      assert.equal(initial.cycle,1440000);
      assert.ok(initial.phase>=720000&&initial.phase<750000,'Fresh sky clock should begin around noon');
      assert.equal(initial.persistence,'saved');
      assert.equal(initial.seed,String(seed));
      assert.ok(initial.gripGaps.every(n=>n>=-2),'Thumb rail covers original viewport');
      assert.equal(initial.skyDrawn,'true');
      assert.equal(initial.glError,initial.glNoError);
      await page.locator('#menu').click();
      assert.equal(await page.locator('#help').isVisible(),true);
      assert.equal(await page.locator('#skySetDay').count(),1);
      assert.equal(await page.locator('#skySetNight').count(),1);
      await page.locator('.player-menu-safety-link').click();
      await page.getByRole('button',{name:'SAVE CURRENT WORLD'}).click();
      await page.locator('.player-safety-back').click();
      const originalMap=await waitForRealStableMap(page,seed);
      const worldBefore=await storageExceptClock();
      assert.ok(worldBefore[worldKey],'Current V6 canonical save not available');
      assert.equal(JSON.parse(worldBefore[worldKey]).schema,1);
      // NIGHT first: instant midnight jump, advancing even behind the open modal.
      await page.locator('#playerMenu .player-menu-times button').nth(1).click();
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
      await page.locator('.player-menu-close').click();
      assert.equal(await page.locator('#help').isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'scene');
      await shot('night-world');
      // DAY: no extra frame-loop registration and no pause. Existing shader unchanged.
      await page.locator('#menu').click();
      await page.locator('#playerMenu .player-menu-times button').nth(0).click();
      const day=await state();
      assert.ok(day.phase>=720000&&day.phase<740000,'SET DAY did not jump to noon');
      assert.equal(day.time,'12:00');
      assert.match(day.label,/24-MIN CYCLE RUNNING/);
      await shot('day-menu');
      await page.locator('.player-menu-close').click();
      await shot('day-world');
      const worldAfter=await storageExceptClock();
      assert.equal(worldAfter[originalMap.key],originalMap.raw,
        'Original current-world fog changed due to DAY/NIGHT sky controls');
      assert.deepEqual(worldAfter,worldBefore,'Sky controls changed non-sky storage');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
        null,{timeout:45000});
      const reload=await state();
      assert.equal(reload.seed,String(seed));
      assert.ok(reload.phase>=720000&&reload.phase<750000,'Per-seed day choice not retained after reload');
      assert.equal(reload.persistence,'saved');
      assert.deepEqual(await storageExceptClock(),worldBefore,'Reload changed canonical save bytes');
      // Current-only worlds deliberately cannot reopen older generations or
      // use the obsolete seed switch. Prove a second *actual* V6 world has its
      // own independent saved clock while the first V6 clock bytes remain exact.
      let seedIsolation=null;
      if(width===932){
        const originalClockKey='mythwrought-sky-s1-clock-'+seed;
        const originalClockBytes=await page.evaluate(key=>localStorage.getItem(key),originalClockKey);
        assert.ok(originalClockBytes,'Original current-V6 clock sidecar missing');
        await page.locator('#menu').click();
        await page.getByRole('button',{name:/NEW WORLD/}).click();
        await page.locator('#help').waitFor({state:'hidden',timeout:45000});
        await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
          null,{timeout:45000});
        const other=await state();
        assert.notEqual(other.seed,String(seed),'Second current V6 world reused prior seed');
        assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),
          M6_BALANCED_GENERATOR,'Cross-world clock test must use a real current V6 world');
        assert.ok(other.phase>=720000&&other.phase<750000,
          'New current V6 world did not receive independently initialized noon');
        await page.locator('#menu').click();
        await page.locator('#playerMenu .player-menu-times button').nth(1).click();
        const otherNight=await state();
        assert.ok(otherNight.phase<20000,'Second current world night choice failed');
        assert.equal(await page.evaluate(key=>localStorage.getItem(key),originalClockKey),originalClockBytes,
          'Second current-world sky controls mutated the first seed clock record');
        assert.equal(await page.evaluate(key=>localStorage.getItem(key),worldKey),worldBefore[worldKey],
          'Second current-world sky controls mutated original schema-1 world');
        seedIsolation={otherSeed:other.seed,otherPhase:other.phase,
          otherNightPhase:otherNight.phase,firstSeed:String(seed),
          firstClockBytePreserved:true,firstWorldBytePreserved:true,
          olderWorldsNeverReopened:true};
        await page.locator('.player-menu-close').click();
      }
      // Measure actual game FrameHistory rather than claiming FPS from CI success.
      // These are software Chromium/SwiftShader observations, not iPhone results.
      await page.waitForTimeout(4000);
      // The second genuine V6 world may naturally commit its map before
      // the read-only diagnostic; await its actual first persistent snapshot.
      await waitForRealStableMap(page,await page.evaluate(()=>
        window.__mythwroughtTest.snapshot().seed));
      const beforeAudit=await storageExceptClock();
      await page.locator('#menu').click();
      await page.locator('.player-menu-safety-link').click();
      await page.locator('#runAudit').click();
      await page.waitForFunction(()=>document.querySelector('#auditReport')?.value.includes('Foreground play frames:'),
        null,{timeout:10000});
      const audit=await page.locator('#auditReport').inputValue();
      const perfMatch=/Foreground play frames: (\d+); approx (\d+) FPS; p50 ([\d.]+) ms; p95 ([\d.]+) ms; worst ([\d.]+) ms; >33ms frames (\d+)/.exec(audit);
      assert.ok(perfMatch,"Actual game FrameHistory failed to return performance data");
      const performance={samples:+perfMatch[1],approxFps:+perfMatch[2],p50Ms:+perfMatch[3],
        p95Ms:+perfMatch[4],worstMs:+perfMatch[5],slowFrames:+perfMatch[6]};
      assert.ok(performance.samples>=30&&performance.p95Ms>=performance.p50Ms);
      await page.locator('.player-safety-back').click();
      await page.locator('.player-menu-close').click();
      assert.deepEqual(await storageExceptClock(),beforeAudit,
        'Read-only performance audit changed non-clock saved data');
      const end=await state();
      assert.equal(end.glError,end.glNoError,'WebGL error after S1 controls');
      assert.equal(end.chunks,25);
      assert.deepEqual(errors,[]);
      assert.deepEqual(missing,[]);
      const entry={width,height,initial,night,day,reload,end,phaseOpenDeltaMs:phaseOpenAfter-phaseOpenBefore,
        canonicalWorldSha256:digest(Buffer.from(worldBefore[worldKey])),
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
