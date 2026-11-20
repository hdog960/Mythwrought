// S6 same-run A/B performance comparison using the exact V6 production code
// served separately from read-only git archive. No merge, checkout or rebase.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const V6='64245c76a9e265f17bf387e3fd209bbfc9f6d950';
const S6=process.env.GITHUB_SHA||'unknown';
const output='artifacts/sky-s6-v6-paired';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const result={stage:'S6+V6 paired-performance',baselineSource:V6,candidateSource:S6,
  browser:'Original-game Chromium WebGL2 SwiftShader, not physical iPhone',
  order:'V6/S6 ABBA / BAAB on identical real V6 five-biome world',viewports:[],errors:[]};
const urlFor={V6:'http://127.0.0.1:4174/',S6:'http://127.0.0.1:4173/'};
async function sample(source,width,height){
  const context=await browser.newContext({viewport:{width,height},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[],missing=[];
  // The genuine V6 unused-seed creation button requires user confirmation.
  // Playwright dismisses dialogs by default; explicitly accept this test-only
  // world creation just as the protected original V6 real-game runner does.
  page.on('dialog',dialog=>dialog.accept());
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
  try{
    // Both baselines create the same unused-seed V6 profile through real UI.
    await page.addInitScript(()=>localStorage.setItem(
      'mythwrought-v002-selected-seed','7'));
    await page.goto(urlFor[source],{waitUntil:'networkidle',timeout:45000});
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill('179');
    await page.locator('#createBalancedV6World').click();
    await page.waitForFunction(()=>window.__mythwroughtTest
      ?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-v6',
      null,{timeout:90000});
    await page.locator('#closeHelp').click();
    // Same authentic V6 Desert scene on both sides. Test-only camera move,
    // never represented as natural player walking evidence.
    await page.evaluate(()=>window.__mythwroughtTest.teleport(512,0));
    await page.waitForFunction(()=>{
      const c=document.querySelector('#scene');
      return c?.dataset.skyDrawn==='true'&&+c.dataset.loadedChunks===25&&
        document.querySelector('#notice').hidden;
    },null,{timeout:45000});
    await page.waitForTimeout(8000);
    const state=await page.evaluate(()=>{
      const c=document.querySelector('#scene'),gl=c.getContext('webgl2');
      return {chunks:+c.dataset.loadedChunks,skyDrawn:c.dataset.skyDrawn,
        framebuffer:[c.width,c.height],error:gl.getError(),noError:gl.NO_ERROR};
    });
    assert.equal(state.chunks,25);assert.equal(state.error,state.noError);
    await page.locator('#menu').click();
    await page.locator('#runAudit').click();
    await page.waitForFunction(()=>document.querySelector('#auditReport')
      ?.value.includes('Foreground play frames:'),null,{timeout:10000});
    const report=await page.locator('#auditReport').inputValue();
    const match=/Foreground play frames: (\d+); approx (\d+) FPS; p50 ([\d.]+) ms; p95 ([\d.]+) ms; worst ([\d.]+) ms; >33ms frames (\d+)/.exec(report);
    assert.ok(match,'Missing real original-game frame history');
    const frames={samples:+match[1],approxFps:+match[2],p50Ms:+match[3],
      p95Ms:+match[4],worstMs:+match[5],slowFrames:+match[6]};
    assert.ok(frames.samples>=60&&frames.approxFps>0);
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    const entry={source,width,height,frames,state,
      sourceGenerator:'mythwrought-five-surface-regions-v6',
      matchedPhysicalBiome:'desert',testOnlyRelocation:true};
    console.log('SKY_S6_AB_SAMPLE',JSON.stringify(entry));
    return entry;
  }finally{await context.close();}
}
const median2=ns=>(ns[0]+ns[1])/2;
let failure=null;
try{
  for(const [width,height,order] of [
    [667,375,['V6','S6','S6','V6']],
    [844,390,['S6','V6','V6','S6']],
    [932,430,['V6','S6','S6','V6']]
  ]){
    const trials=[];
    for(const source of order)trials.push(await sample(source,width,height));
    const before=trials.filter(x=>x.source==='V6').map(x=>x.frames.approxFps);
    const after=trials.filter(x=>x.source==='S6').map(x=>x.frames.approxFps);
    const beforeP95=trials.filter(x=>x.source==='V6').map(x=>x.frames.p95Ms);
    const afterP95=trials.filter(x=>x.source==='S6').map(x=>x.frames.p95Ms);
    const comparison={baselineFps:median2(before),s6Fps:median2(after),
      fpsRatio:median2(after)/median2(before),
      baselineP95:median2(beforeP95),s6P95:median2(afterP95)};
    result.viewports.push({width,height,trials,comparison});
    console.log('SKY_S6_AB_PAIRED',JSON.stringify({width,height,comparison}));
    // Paired-source workload gate: tolerate normal runner variability, but
    // never accept a repeatable >20% FPS loss or severe p95 degradation.
    assert.ok(comparison.fpsRatio>=.80,
      'V6+S6 five-biome matched software WebGL2 FPS regressed >20% at '+width+'x'+height);
    assert.ok(comparison.s6P95<=comparison.baselineP95*1.30+10,
      'V6+S6 matched frame p95 regressed excessively at '+width+'x'+height);
  }
}catch(err){failure=err;result.errors.push(String(err?.stack||err));}
finally{
  await browser.close();
  await writeFile(output+'/paired.json',JSON.stringify(result,null,2)+'\n');
}
if(failure){console.error('SKY_S6_AB_FAIL',String(failure?.stack||failure));process.exitCode=1;}
