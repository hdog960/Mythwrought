import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {buildCreativeCatalog} from '../../src/creative-integration/creative-catalog.mjs';
const c=buildCreativeCatalog();assert.equal(c.blocks.length,241);
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block'});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:90000});
  assert.equal(await page.locator('#creativeInventoryToggle').isVisible(),false);
  await page.locator('#g2bFlightEnable').check();
  await page.locator('#creativeInventoryToggle').click();
  assert.ok(await page.locator('#creativeInventory').isVisible());
  assert.equal(await page.locator('.mw-inventory-category').count(),9);
  assert.equal(await page.locator('#help').isVisible(),false);
  assert.equal(await page.locator('.mw-inventory-item').count(),48);
  for(let i=0;i<10;i++){
    if(await page.locator('.mw-inventory-item').count()===241)break;
    await page.locator('.mw-inventory-grid').evaluate(el=>{el.scrollTop=el.scrollHeight;});
    await page.waitForTimeout(150);
  }
  const proof=await page.locator('.mw-inventory-item').evaluateAll(items=>items.map(b=>{
    const canvas=b.querySelector('canvas');
    return {key:b.dataset.key,nonblank:canvas&&canvas.getContext('2d').getImageData(0,0,48,48).data.some((v,i)=>i%4===3&&v>0),fallback:canvas?.dataset.fallback==='true'};
  }));
  assert.equal(proof.length,241);assert.deepEqual(proof.map(x=>x.key).sort(),c.blocks.map(x=>x.key).sort());
  assert.ok(proof.every(x=>x.nonblank&&!x.fallback));
  await page.locator('.mw-inventory-grid').evaluate(el=>el.scrollTop=0);
  await mkdir('artifacts/creative-phase3',{recursive:true});
  await page.screenshot({path:'artifacts/creative-phase3/inventory-956x440.png'});
  const search=page.locator('.mw-inventory-search');
  for(const owner of ['core','biome130','pack2','pack1','pack3','pack4','pack5']){
    const item=c.blocks.find(x=>x.owner===owner);await search.fill(item.key);
    await page.locator('.mw-inventory-item[data-key="'+item.key+'"]').click();
    await page.waitForFunction(key=>document.querySelector('.mw-inventory-item[data-key="'+key+'"]')?.getAttribute('aria-selected')==='true',item.key,{timeout:20000});
  }
  await search.fill('block:4');await page.locator('.mw-inventory-item[data-key="block:4"]').click();
  await page.waitForFunction(()=>document.querySelector('.mw-inventory-item[data-key="block:4"]')?.getAttribute('aria-selected')==='true');
  await page.locator('.mw-inventory-close').click();
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.placeFixture(14,13,0,3);dev.placeFixture(17,18,0,3);
    if(dev.block(16,18,0)!==0)dev.placeFixture(16,18,0,0);
    dev.teleport(14.5,.5);dev.aimAt(17,18,0);
  });
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='17,18,0'&&document.querySelector('#scene')?.dataset.canPlace==='true',null,{timeout:20000});
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),4);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:90000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),4);
  assert.equal(await page.locator('#creativeInventoryToggle').isVisible(),false);
  await page.locator('#menu').click();
  assert.equal(await page.locator('#advancedMenu').evaluate(e=>e.open),false);
  assert.ok(await page.locator('#newWorld').isVisible());
  assert.equal(await page.locator('#g2bFlightProfile').count(),0);
  assert.deepEqual(errors,[]);
  console.log('CREATIVE_PHASE3 '+JSON.stringify({blocks:proof.length,owners:7,physicalPlacement:4,reloaded:true,compactMenu:true,eggsDeferred:true,errors}));
}finally{await browser.close();}
