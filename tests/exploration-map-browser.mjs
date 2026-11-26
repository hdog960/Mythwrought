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
      // Do not mistake continued discovery near spawn for a remote witness.
      // Try a bounded set of actual safe source spawn positions, without editing terrain.
      const remoteAttempts=[];let witnessedRemote=null;
      for(const [x,z] of [[120,120],[128,120],[120,128],[136,128],[144,144]]){
        const pos=await page.evaluate(([x,z])=>{const t=window.__mythwroughtTest;t.teleport(x,z);return t.m5ObservedPose();},[x,z]);
        const target=[Math.floor(pos.x/4),Math.floor(pos.z/4)];
        assert.ok(Math.abs(pos.x)>80&&Math.abs(pos.z)>80,'Actual remote player pose not reached');
        try{
          await page.waitForFunction(({target})=>{
            const c=document.querySelector('#scene'),p=window.__mythwroughtTest.m5ObservedPose();
            const fog=JSON.parse(localStorage.getItem('mythwrought-exploration-v1-179')||'null');
            return Math.floor(p.x/4)===target[0]&&Math.floor(p.z/4)===target[1]&&
              Number(c.dataset.pendingChunks)===0&&fog?.cells.includes(target.join(','));
          },{target},{timeout:20000});
          witnessedRemote=target.join(',');break;
        }catch(e){remoteAttempts.push({pos,target,error:String(e)});}
      }
      assert.ok(witnessedRemote,'No actual remote fog witnessed: '+JSON.stringify(remoteAttempts));
      console.log('NAV REMOTE WITNESS',width,height,witnessedRemote);
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
      await page.locator('#menu').click();
      // Settings stops exploration admission. A final syncSeed flush may
      // persist already witnessed cells from the original world's spawn.
      const oldMap=await page.evaluate(()=>({fog:localStorage.getItem('mythwrought-exploration-v1-179'),
        pins:localStorage.getItem('mythwrought-navigation00-v1-179'),
        pose:window.__mythwroughtTest.m5ObservedPose()}));
      assert.ok(oldMap.fog&&oldMap.pins);assert.equal(oldMap.pose.seed,179);
      await page.locator('#seedInput').fill('28629');
      page.once('dialog',dialog=>dialog.accept());
      await page.locator('#switchWorld').click();
      await page.locator('#closeHelp').click();
      await page.waitForFunction(()=>document.querySelector('#seed')?.textContent==='WORLD 28629');
      await page.waitForFunction(()=>document.querySelector('#miniMap')?.dataset.seed==='28629');
      // A fresh seed can see more nearby cells than an older fog sample.
      // Compare actual saved cells, origin and pin namespaces, not timing-dependent totals.
      await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0);
      await page.locator('#miniMapButton').tap();
      assert.equal(await page.locator('#navMarkerList option').count(),1,'Old waypoint leaked into different seed');
      await page.locator('#closeExploration').tap();
      const isolated=await page.evaluate(()=>({fog:JSON.parse(localStorage.getItem('mythwrought-exploration-v1-28629')),
        pose:window.__mythwroughtTest.m5ObservedPose(),
        old:{fog:localStorage.getItem('mythwrought-exploration-v1-179'),pins:localStorage.getItem('mythwrought-navigation00-v1-179')}}));
      assert.equal(isolated.fog.seed,28629);assert.equal(isolated.pose.seed,28629);
      const cx=Math.floor(isolated.pose.x/4),cz=Math.floor(isolated.pose.z/4);
      assert.ok(isolated.fog.cells.length>0&&isolated.fog.cells.length<=29);
      assert.ok(isolated.fog.cells.every(k=>{const [x,z]=k.split(',').map(Number);return (x-cx)**2+(z-cz)**2<=9;}),'Fresh world revealed cells outside actual spawn radius');
      assert.equal(isolated.old.pins,oldMap.pins,'Switching seeds changed prior waypoint bytes');
      const former=JSON.parse(oldMap.fog),flushed=JSON.parse(isolated.old.fog);
      assert.deepEqual([flushed.version,flushed.seed,flushed.cellSize],[former.version,former.seed,former.cellSize]);
      const formerCells=new Set(former.cells),flushedCells=new Set(flushed.cells);
      assert.equal(flushedCells.size,flushed.cells.length);
      assert.ok(former.cells.every(k=>flushedCells.has(k)),'Original fog cell lost during final flush');
      const oldCx=Math.floor(oldMap.pose.x/4),oldCz=Math.floor(oldMap.pose.z/4);
      assert.ok(flushed.cells.filter(k=>!formerCells.has(k)).every(k=>{
        const [x,z]=k.split(',').map(Number);return Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&(x-oldCx)**2+(z-oldCz)**2<=9;
      }),'Final old-world flush contains cells outside original spawn radius');
      // After the seed handoff and new discovery, the old record must be
      // byte-for-byte stable through continued new-world activity and flush.
      await page.waitForTimeout(1200);
      await page.locator('#miniMapButton').tap();await page.locator('#closeExploration').tap();
      const oldAfter=await page.evaluate(()=>({fog:localStorage.getItem('mythwrought-exploration-v1-179'),pins:localStorage.getItem('mythwrought-navigation00-v1-179')}));
      assert.deepEqual(oldAfter,isolated.old,'New-world activity rewrote old-world records');
      assert.ok(JSON.parse(oldMap.fog).cells.includes(witnessedRemote),'Remote fog lost on original-world reload');
      const remote=JSON.parse(oldMap.fog).cells.filter(k=>{const [x,z]=k.split(',').map(Number);return (x-cx)**2+(z-cz)**2>9;});
      assert.ok(remote.includes(witnessedRemote),'Remote witness overlaps new world spawn');
      assert.ok(remote.every(k=>!isolated.fog.cells.includes(k)),'Old remote exploration leaked into new seed');
      assert.deepEqual(errors,[],'Map browser JavaScript errors at '+width+'x'+height);
      console.log('PASS exploration map',width+'x'+height,{start,explored,placement});
    }finally{await context.close();}
  }
}finally{await browser.close();}
