import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {buildCreativeCatalog} from '../../src/creative-integration/creative-catalog.mjs';
const catalog=buildCreativeCatalog();
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const active=()=>page.locator('#creativeQuickbar .mw-inventory-slot[aria-current="true"]');
async function choose(key){
  await page.locator('#creativeInventoryToggle').click();
  await page.locator('.mw-inventory-search').fill(key);
  await page.locator('.mw-inventory-item[data-key="'+key+'"]').click();
  await page.waitForFunction(k=>document.querySelector('.mw-inventory-item[data-key="'+k+'"]')?.getAttribute('aria-selected')==='true',key);
  await page.locator('.mw-inventory-close').click();
  assert.equal(await active().getAttribute('data-key'),key);
}
async function advancedSelect(id){
  await page.locator('#menu').click();
  await page.locator('#advancedMenu summary').click();
  await page.locator('[data-block="'+id+'"]').click();
  await page.locator('#closeHelp').click();
  assert.equal(await active().getAttribute('data-key'),'block:'+id);
}
try{
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:90000});
  await page.locator('#g2bFlightEnable').check();
  await choose('block:4');
  await advancedSelect(3);
  await page.evaluate(()=>{
    const t=window.__mythwroughtTest;
    t.placeFixture(14,13,0,3);t.placeFixture(17,18,0,3);
    if(t.block(16,18,0)!==0)t.placeFixture(16,18,0,0);
    t.teleport(14.5,.5);t.aimAt(17,18,0);
  });
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='17,18,0'&&document.querySelector('#scene')?.dataset.canPlace==='true',null,{timeout:20000});
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),3);
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='16,18,0');
  await page.locator('#dig').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),0);
  const pack5=catalog.blocks.find(x=>x.owner==='pack5');
  await choose(pack5.key);
  assert.equal(await page.locator('#pack5Enabled').isChecked(),true);
  await advancedSelect(4);
  assert.equal(await page.locator('#pack5Enabled').isChecked(),false);
  await choose(pack5.key);
  await page.locator('#g2bFlightEnable').uncheck();
  assert.equal(await page.locator('#pack5Enabled').isChecked(),false);
  assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
  await page.locator('#g2bFlightEnable').check();
  assert.equal(await active().getAttribute('data-key'),'block:4');
  assert.deepEqual(errors,[]);
  console.log('CREATIVE_PHASE5_BUILD_CONTROLS '+JSON.stringify({livePalette:true,placed:3,mined:true,pack5OverrideReleased:true,creativeExit:true,errors}));
}finally{await browser.close();}
