import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';

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

  async function switchSeed(seed){
    await page.locator('#menu').click();
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
  await writeFile(output+'/report.json',JSON.stringify({initial,oasis,existing,created,night,reopened},null,2)+'\n');
  console.log('Verified ordinary creation, legacy seed bytes, day/night and generation-aware vault and mirror in WebGL2');
}finally{await browser.close();}
