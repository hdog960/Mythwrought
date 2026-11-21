import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';

const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  for(const [width,height] of [[568,320],[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
      await page.locator('#playerMenu').waitFor({state:'visible',timeout:45000});
      assert.equal(await page.locator('#help').isVisible(),true,
        'Archived world bypassed mandatory current-world admission');
      page.once('dialog',d=>d.accept());
      await page.getByRole('button',{name:/NEW WORLD/}).click();
      await page.locator('#help').waitFor({state:'hidden',timeout:45000});
      const seed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),M6_BALANCED_GENERATOR);
      assert.equal(await page.evaluate(seed=>JSON.parse(localStorage.getItem('mythwrought-v002-world-'+seed)||'null')?.schema,seed),1);
      await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0);
      const start=Number(await page.locator('#miniMap').getAttribute('data-discovered'));
      assert.ok(start>0&&start<60,'fresh seed must reveal only nearby spawn cells');
      const placement=await page.evaluate(()=>{
        const button=document.querySelector('#miniMapButton');
        const b=button.getBoundingClientRect();
        const viewport=document.querySelector('.viewport').getBoundingClientRect();
        const left=document.querySelector('.left').getBoundingClientRect();
        const right=document.querySelector('.right').getBoundingClientRect();
        const scene=document.querySelector('#scene').getBoundingClientRect();
        return {
          parent:button.parentElement?.className,
          position:getComputedStyle(button).position,
          contained:b.left>=viewport.left&&b.right<=viewport.right&&b.top>=viewport.top&&b.bottom<=viewport.bottom,
          top:b.top-viewport.top,right:viewport.right-b.right,
          separated:b.left>=left.right&&b.right<=right.left,
          mapWidth:b.width,sceneWidth:scene.width,viewportWidth:viewport.width,
          clearWorldWidth:scene.width-b.width
        };
      });
      assert.equal(placement.parent,'viewport','minimap must live inside the game screen');
      assert.equal(placement.position,'absolute','minimap should float in upper-right corner');
      assert.ok(placement.contained,'minimap clips outside game screen at '+width+'x'+height);
      assert.ok(placement.top>=0&&placement.top<=16&&placement.right>=0&&placement.right<=16,
        'minimap is not anchored to the upper right at '+width+'x'+height);
      assert.ok(placement.separated,'minimap overlaps the controller rails at '+width+'x'+height);
      assert.equal(placement.sceneWidth,placement.viewportWidth,'minimap must not resize the 3D canvas');
      assert.ok(placement.clearWorldWidth>=230,'minimap consumes too much of compact game view');
      assert.ok(placement.mapWidth>=48&&placement.mapWidth<=90,'minimap touch target is outside compact target budget');
      if(width===932||width===568){
        await mkdir('artifacts',{recursive:true});
        await page.screenshot({path:'artifacts/mythwrought-minimap-upper-right-'+width+'.png'});
      }
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
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'scene','Close must restore world keyboard focus');
      await page.evaluate(()=>window.__mythwroughtTest.teleport(120,120));
      await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>n,start);
      const explored=Number(await page.locator('#miniMap').getAttribute('data-discovered'));
      assert.ok(explored>start);
      await page.locator('#miniMapButton').click(); // flush discovery synchronously
      await page.locator('#closeExploration').click();
      assert.ok(await page.evaluate(({seed,start})=>{
        const raw=localStorage.getItem('mythwrought-exploration-v1-'+seed);
        return raw!==null&&JSON.parse(raw).cells.length>start;
      },{seed,start}),'Actual source visited-fog expansion not durably saved');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>=n,explored);
      // The old seed switch is no longer playable. Use actual NEW WORLD UI
      // and retain the prior V6 world and fog bytes without mutation.
      const priorFog=await page.evaluate(seed=>
        localStorage.getItem('mythwrought-exploration-v1-'+seed),seed);
      await page.locator('#menu').click();
      page.once('dialog',d=>d.accept());
      await page.getByRole('button',{name:/NEW WORLD/}).click();
      await page.locator('#help').waitFor({state:'hidden',timeout:45000});
      const newer=await page.evaluate(()=>({seed:window.__mythwroughtTest.snapshot().seed,
        generator:window.__mythwroughtTest.fourBiomeProfile()?.generator}));
      assert.notEqual(newer.seed,seed,'NEW WORLD reused previous saved world');
      assert.equal(newer.generator,M6_BALANCED_GENERATOR);
      await page.waitForFunction(seed=>document.querySelector('#miniMap')?.dataset.seed===String(seed),newer.seed);
      assert.ok(Number(await page.locator('#miniMap').getAttribute('data-discovered'))<explored,
        'Different current V6 world must start with fresh map discovery');
      assert.equal(await page.evaluate(seed=>localStorage.getItem('mythwrought-exploration-v1-'+seed),seed),priorFog,
        'NEW WORLD modified previous current-V6 discovery bytes');
      assert.deepEqual(errors,[],'Map browser JavaScript errors at '+width+'x'+height);
      console.log('PASS exploration map',width+'x'+height,{start,explored,placement});
    }finally{await context.close();}
  }
}finally{await browser.close();}
