import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  for(const [width,height] of [[568,320],[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0);
      const start=Number(await page.locator('#miniMap').getAttribute('data-discovered'));
      assert.ok(start>0&&start<60,'fresh seed must reveal only nearby spawn cells');
      const placement=await page.evaluate(()=>{
        const b=document.querySelector('#miniMapButton').getBoundingClientRect();
        const l=document.querySelector('.left').getBoundingClientRect();
        const w=document.querySelector('#scene').getBoundingClientRect();
        return {contained:b.left>=l.left&&b.right<=l.right&&b.top>=l.top&&b.bottom<=l.bottom,
          separate:b.right<=w.left+2,
          mapWidth:b.width,sceneWidth:w.width};
      });
      assert.ok(placement.contained,'minimap escapes left controller at '+width+'x'+height);
      assert.ok(placement.separate,'minimap obstructs central 3D view');
      assert.ok(placement.sceneWidth>230,'map squeezes center gameplay viewport');
      await page.locator('#miniMapButton').click();
      assert.equal(await page.locator('#explorationOverlay').isVisible(),true);
      assert.equal(await page.locator('#expandedMap').isVisible(),true);
      const before=await page.locator('#scene').getAttribute('data-player-z');
      await page.keyboard.down('w');await page.waitForTimeout(220);await page.keyboard.up('w');
      const after=await page.locator('#scene').getAttribute('data-player-z');
      assert.equal(after,before,'movement leaked behind expanded map');
      await mkdir('artifacts',{recursive:true});
      if(width===932)await page.screenshot({path:'artifacts/mythwrought-exploration-expanded.png'});
      await page.locator('#mapZoomIn').click();
      await page.locator('#mapZoomOut').click();
      await page.locator('#mapRecenter').click();
      await page.locator('#closeExploration').click();
      assert.equal(await page.locator('#explorationOverlay').isVisible(),false);
      await page.evaluate(()=>window.__mythwroughtTest.teleport(120,120));
      await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>n,start);
      const explored=Number(await page.locator('#miniMap').getAttribute('data-discovered'));
      assert.ok(explored>start);
      await page.locator('#miniMapButton').click(); // flush discovery synchronously
      await page.locator('#closeExploration').click();
      assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-exploration-v1-179')).cells.length)>start);
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>=n,explored);
      await page.locator('#menu').click();
      await page.locator('#seedInput').fill('28629');
      await page.locator('#switchWorld').click();
      await page.locator('#closeHelp').click();
      await page.waitForFunction(()=>document.querySelector('#seed')?.textContent==='WORLD 28629');
      await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0);
      assert.ok(Number(await page.locator('#miniMap').getAttribute('data-discovered'))<explored,
        'different seed must begin unexplored');
      assert.deepEqual(errors,[],'Map browser JavaScript errors at '+width+'x'+height);
      console.log('PASS exploration map',width+'x'+height,{start,explored,placement});
    }finally{await context.close();}
  }
}finally{await browser.close();}
