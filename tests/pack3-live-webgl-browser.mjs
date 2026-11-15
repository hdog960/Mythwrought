// Genuine live-game WebGL2 proof, not a Canvas2D gallery or an iPhone approval.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({headless:true,
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir('artifacts/pack3-live',{recursive:true});
const evidence=[];
try {
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[],missing=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)missing.push(r.url()+' '+r.status());});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:60000});
      const gpu=await page.evaluate(()=>!!document.querySelector('#scene').getContext('webgl2'));
      assert.equal(gpu,true,'Actual gameplay WebGL2 unavailable');
      assert.equal(await page.locator('#pack3Material option').count(),18);
      // Place a source-true legacy anchor, as the existing genuine blocks-browser
      // test does; the normal on-screen PLACE control must add the physical roof.
      await page.evaluate(()=>{
        const t=window.__mythwroughtTest;
        t.placeFixture(16,18,0,3);
        t.teleport(14.5,.5);t.aimAt(16,18,0);
      });
      await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='16,18,0',
        null,{timeout:12000});
      const legacyBefore=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
      const verticesBefore=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedMeshVertices));
      await page.locator('#menu').click();
      await page.locator('#pack3Material').selectOption('116');
      await page.locator('#pack3Rotation').selectOption('1');
      await page.locator('#closeHelp').click();
      await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.canPlace==='true');
      await page.locator('#place').click();
      await page.waitForFunction(()=>window.__mythwroughtTest.pack3Block(15,18,0)?.id===116,
        null,{timeout:15000});
      const now=await page.evaluate(()=>({
        entry:window.__mythwroughtTest.pack3Block(15,18,0),
        count:Number(document.querySelector('#scene').dataset.pack3PhysicalCount),
        vertices:Number(document.querySelector('#scene').dataset.renderedMeshVertices),
        saved:localStorage.getItem('mythwrought-v002-world-179'),
        sidecar:localStorage.getItem('mythwrought-pack3-construction-v1:179')
      }));
      assert.equal(now.entry.id,116);
      assert.equal(now.entry.yaw,1);
      assert.equal(now.count,1);
      assert.ok(now.vertices>verticesBefore,'Physical WebGL2 chunk vertices not uploaded');
      assert.equal(now.saved,legacyBefore,'Physical placement rewrote schema-1 save');
      assert.ok(JSON.parse(now.sidecar).entries.some(e=>e.asset==='pack3:069'&&e.orientation===1));
      const pngBytes=await page.screenshot({path:`artifacts/pack3-live/pack3-webgl2-${width}x${height}.png`});
      const image=PNG.sync.read(pngBytes);
      assert.equal(image.width,width);
      assert.equal(image.height,height);
      const colors=new Set();
      for(let y=Math.floor(height*.20);y<Math.floor(height*.75);y+=8)
        for(let x=Math.floor(width*.20);x<Math.floor(width*.80);x+=8){
          const i=(y*image.width+x)*4;
          colors.add([image.data[i]>>4,image.data[i+1]>>4,image.data[i+2]>>4].join(','));
        }
      assert.ok(colors.size>=5,'Actual WebGL2 evidence appears blank');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:45000});
      const restored=await page.evaluate(()=>({
        entry:window.__mythwroughtTest.pack3Block(15,18,0),
        saved:localStorage.getItem('mythwrought-v002-world-179')
      }));
      assert.equal(restored.entry.id,116);
      assert.equal(restored.entry.yaw,1,'Yaw state lost after reload');
      assert.equal(restored.saved,legacyBefore,'Original canonical save was changed on reload');
      const removed=await page.evaluate(()=>window.__mythwroughtTest.removePack3Fixture(15,18,0));
      assert.equal(removed.ok,true);
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.pack3Block(15,18,0)),null);
      assert.deepEqual(errors,[],'Browser JS faults');
      assert.deepEqual(missing,[],'Missing gameplay source');
      evidence.push({viewport:`${width}x${height}`,webgl2:gpu,
        physicalId:116,yaw:1,placed:true,meshVerticesDelta:now.vertices-verticesBefore,
        reload:true,removed:true,canvasColorSamples:colors.size,legacySaveUnchanged:true});
      console.log('PASS Pack3 live WebGL2',JSON.stringify(evidence.at(-1)));
    }finally{await context.close();}
  }
}finally{await browser.close();}
await import('node:fs/promises').then(fs=>fs.writeFile('artifacts/pack3-live/evidence.json',
  JSON.stringify({renderer:'actual Mythwrought WebGL2 game',physicalIPhoneTested:false,
    testedId:116,all17PhysicalIdNodeProofRequired:true,evidence},null,2)+'\n'));
