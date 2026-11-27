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
      await page.locator('#navMarkerHere').tap();
      await page.locator('#navMarkerName').fill('First camp');
      await page.locator('#navMarkerAdd').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),2);
      await page.locator('#navMarkerName').fill('Renamed camp');
      await page.locator('#navMarkerRename').tap();
      assert.equal(await page.locator('#navMarkerList option:checked').textContent(),'Renamed camp');
      await page.locator('#navMarkerRemove').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),1);
      await page.locator('#navMarkerUndo').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),2);
      await page.locator('#navMarkerList').selectOption({label:'Renamed camp'});
      await page.locator('#navMarkerFocus').tap();
      const canvas=await page.locator('#expandedMap').boundingBox();
      const cdp=await context.newCDPSession(page),x=canvas.x+canvas.width/2,y=canvas.y+canvas.height/2;
      const touch=async(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
      await touch('touchStart',[{x:x-20,y,id:1},{x:x+20,y,id:2}]);
      await touch('touchMove',[{x:x-33,y,id:1},{x:x+33,y,id:2}]);
      await touch('touchEnd',[]);
      await page.waitForFunction(()=>Number(document.getElementById('expandedMap').dataset.navigationZoom)>7);
      await page.locator('#mapRecenter').tap();
      assert.equal(Number(await page.locator('#expandedMap').getAttribute('data-navigation-zoom')),7);
      const diagnostics=await page.evaluate(async()=>{
        const ms=[];let last=performance.now();for(let i=0;i<30;i++)await new Promise(r=>requestAnimationFrame(t=>{ms.push(t-last);last=t;r();}));
        const sorted=ms.slice(1).sort((a,b)=>a-b);return {samples:sorted.length,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],tiles:Number(document.getElementById('expandedMap').dataset.observedTiles)};
      });
      assert.ok(diagnostics.samples===29&&diagnostics.p95>0&&diagnostics.tiles>0);
      console.log('NAV MAP FRAME INTERVALS',width,height,JSON.stringify(diagnostics));
      await page.screenshot({path:'artifacts/navigation-waypoints-'+width+'.png'});
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
      assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-exploration-v1-179')).cells.length)>start);
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>=n,explored);
      await page.locator('#miniMapButton').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),2,'waypoint survives cold reload');
      await page.locator('#closeExploration').tap();
      const oldFog=await page.evaluate(()=>localStorage.getItem('mythwrought-exploration-v1-179'));
      assert.ok(JSON.parse(oldFog).cells.some(k=>{const [x,z]=k.split(',').map(Number);return Math.abs(x-30)<=3&&Math.abs(z-30)<=3;}),'Old seed must contain remote visited cells');
      assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-exploration-v1-28629')),null,'New seed was not fresh');
      await page.locator('#menu').click();
      await page.locator('#seedInput').fill('28629');
      page.once('dialog',dialog=>dialog.accept());
      await page.locator('#switchWorld').click();
      await page.locator('#closeHelp').click();
      await page.waitForFunction(()=>document.querySelector('#seed')?.textContent==='WORLD 28629');
      await page.waitForFunction(()=>document.querySelector('#miniMap')?.dataset.seed==='28629');
      // Terrain visibility differs by seed and elapsed sampling. A total
      // count comparison cannot prove isolation. Require the actual saved
      // new-seed cells to lie in the original source's 3-cell reveal radius.
      await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0,null,{timeout:30000});
      await page.locator('#miniMapButton').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),1,'Old waypoint leaked into new seed');
      const witness=await page.evaluate(()=>{
        const c=document.querySelector('#scene'),m=document.querySelector('#miniMap');
        return {x:Number(c.dataset.playerX),z:Number(c.dataset.playerZ),
          displayed:Number(m.dataset.discovered),raw:localStorage.getItem('mythwrought-exploration-v1-28629'),
          old:localStorage.getItem('mythwrought-exploration-v1-179')};
      });
      const fresh=JSON.parse(witness.raw);
      assert.ok(Number.isFinite(witness.x)&&Number.isFinite(witness.z));
      assert.equal(fresh.seed,28629);assert.equal(fresh.cellSize,4);
      assert.equal(fresh.cells.length,witness.displayed);
      assert.ok(fresh.cells.length>0&&fresh.cells.length<=29);
      const cx=Math.floor(witness.x/4),cz=Math.floor(witness.z/4);
      assert.ok(fresh.cells.every(k=>{const [x,z]=k.split(',').map(Number);return (x-cx)**2+(z-cz)**2<=9;}),'New seed contains cells beyond its actual spawn reveal radius');
      const remote=JSON.parse(oldFog).cells.filter(k=>{const [x,z]=k.split(',').map(Number);return (x-cx)**2+(z-cz)**2>9;});
      assert.ok(remote.length>0);
      assert.ok(remote.every(k=>!fresh.cells.includes(k)),'Remote old-seed discovery leaked');
      assert.equal(witness.old,oldFog,'Switch altered old seed fog bytes');
      console.log('MAP_SEED_ISOLATION_WITNESS',JSON.stringify({width,height,oldCount:JSON.parse(oldFog).cells.length,newCount:fresh.cells.length,cx,cz,remoteExcluded:remote.length}));
      await page.locator('#closeExploration').tap();
      assert.deepEqual(errors,[],'Map browser JavaScript errors at '+width+'x'+height);
      console.log('PASS exploration map',width+'x'+height,{start,explored,placement});
    }finally{await context.close();}
  }
}finally{await browser.close();}
