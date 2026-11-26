import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {buildCreativeCatalog} from '../../src/creative-integration/creative-catalog.mjs';
import {M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const catalog=buildCreativeCatalog();
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const OUT='artifacts/creative-building';await mkdir(OUT,{recursive:true});
const report={head:process.env.GITHUB_SHA??null,phase5:false,phase6:{},errors:[]};
const active=()=>page.locator('#creativeQuickbar .mw-inventory-slot[aria-current="true"]');
const history=direction=>page.locator('#creativeQuickbar [data-history="'+direction+'"]');
async function choose(key){
  await page.locator('#creativeInventoryToggle').click();
  await page.locator('.mw-inventory-search').fill(key);
  await page.locator('.mw-inventory-item[data-key="'+key+'"]').click();
  await page.waitForFunction(k=>document.querySelector('.mw-inventory-item[data-key="'+k+'"]')?.getAttribute('aria-selected')==='true',key,{timeout:30000});
  await page.locator('.mw-inventory-close').click();
  assert.equal(await active().getAttribute('data-key'),key);
}
async function advancedSelect(id){
  await page.locator('#menu').click();
  await page.locator('#advancedMenu summary').click();
  await page.locator('#advancedMenu [data-block="'+id+'"]').click();
  await page.locator('#closeHelp').click();
  assert.equal(await active().getAttribute('data-key'),'block:'+id);
}
async function prepare(){
  await page.evaluate(()=>{
    const t=window.__mythwroughtTest;
    for(let x=15;x<=17;x++)for(let z=-1;z<=1;z++)for(let y=16;y<=19;y++)
      if(t.block(x,y,z)!==0)t.placeFixture(x,y,z,0);
    for(let z=1;z<=3;z++)for(let y=18;y<=19;y++)
      if(t.block(16,y,z)!==0)t.placeFixture(16,y,z,0);
    t.placeFixture(16,15,0,3);t.placeFixture(16,17,3,3);
    t.teleportCave(16,18,3);t.aimAt(16,15,0);
  });
  await target();
}
async function target(){
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetPlace==='16,16,0',null,{timeout:60000});
}
async function read(owner){
  return page.evaluate(owner=>{
    const t=window.__mythwroughtTest;
    const e=owner==='pack3'?t.pack3Block(16,16,0):t.manual14Block(16,16,0);
    if(!e)return null;
    return owner==='pack3'?{id:e.id,yaw:e.yaw}:{id:e.numericId,yaw:e.orientation,variant:e.variant,support:e.supportAt};
  },owner);
}
async function undoRedo(owner,key){
  await choose(key);await target();
  await page.locator('#place').click();
  const before=await read(owner);assert.ok(before,'real placement did not reach '+owner);
  assert.equal(await history('undo').isEnabled(),true);
  await history('undo').click();assert.equal(await read(owner),null);
  assert.equal(await history('redo').isEnabled(),true);
  await history('redo').click();assert.deepEqual(await read(owner),before);
  await history('undo').click();assert.equal(await read(owner),null);
  report.phase6[owner]={original:before,undo:true,redo:true,removed:true};
}
try{
  await page.goto('http://127.0.0.1:4174/?production-ui=1',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(profile=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===profile&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,M8_MOUNTAIN_GENERATOR,{timeout:180000});
  await page.locator('#g2bFlightEnable').check();
  await choose('block:4');await advancedSelect(7);
  await prepare();await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,16,0)),7);
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='16,16,0');
  await page.locator('#dig').click();assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,16,0)),0);
  const pack5=catalog.blocks.find(x=>x.owner==='pack5');
  await choose(pack5.key);assert.equal(await page.locator('#pack5Enabled').isChecked(),true);
  await advancedSelect(8);assert.equal(await page.locator('#pack5Enabled').isChecked(),false);
  await choose(pack5.key);await page.locator('#g2bFlightEnable').uncheck();
  assert.equal(await page.locator('#pack5Enabled').isChecked(),false);
  assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
  await page.locator('#g2bFlightEnable').check();assert.equal(await active().getAttribute('data-key'),'block:8');
  report.phase5=true;
  for(const item of [catalog.blocks.find(x=>x.id===4),catalog.blocks.find(x=>x.owner==='biome130'),catalog.blocks.find(x=>x.id===76)]){
    assert.ok(item);await choose(item.key);await target();
    await page.locator('#place').click();
    const readBlock=()=>page.evaluate(()=>window.__mythwroughtTest.block(16,16,0));
    assert.equal(await readBlock(),item.id);
    await history('undo').click();assert.equal(await readBlock(),0);
    await history('redo').click();assert.equal(await readBlock(),item.id);
    await history('undo').click();assert.equal(await readBlock(),0);
    report.phase6[item.owner]={id:item.id,undo:true,redo:true};
  }
  await undoRedo('manual14','block:159');
  report.phase6.pack4=report.phase6.manual14;
  await undoRedo('pack3','block:109');
  await undoRedo('manual14','block:15');
  // Keep a redone real Pack1 object through the original cold save/reload.
  await history('redo').click();const persisted=await read('manual14');assert.equal(persisted?.id,15);
  await page.screenshot({path:OUT+'/creative-controls.png'});
  await page.reload({waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(profile=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===profile,M8_MOUNTAIN_GENERATOR,{timeout:180000});
  assert.deepEqual(await read('manual14'),persisted);
  assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
  assert.deepEqual(errors,[]);
  report.reloaded=true;report.complete=true;
  console.log('CREATIVE_PHASE5_6 '+JSON.stringify(report));
}catch(e){
  report.errors.push(String(e.stack||e),...errors);
  console.error('CREATIVE_PHASE5_6_FAILURE '+JSON.stringify(report));
  process.exitCode=1;
}finally{await writeFile(OUT+'/manifest.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
