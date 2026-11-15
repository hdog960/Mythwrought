// Genuine source-exact Chromium/WebGL2 deep-world smoke. Run in the dedicated
// depth workflow; never interpret this as physical-iPhone certification.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({
  headless:true,
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
  await mkdir('artifacts',{recursive:true});
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
      await page.waitForFunction(()=>window.__mythwroughtTest &&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
        null,{timeout:60000});
      const first=await page.evaluate(()=>{
        const scene=document.querySelector('#scene');
        return {count:Number(scene.dataset.loadedChunks),
          center:scene.dataset.chunkCenter,
          gl:!!scene.getContext('webgl2')};
      });
      assert.equal(first.count,25);
      assert.ok(first.gl);
      // Local-only source hook: carve a genuinely editable 3x3x3 room, with
      // a solid floor below it, inside a deep section instead of teleporting
      // into or painting a fake geometry illustration.
      await page.evaluate(()=>{
        const t=window.__mythwroughtTest;
        for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
          for(let y=-78;y<=-76;y++)t.placeFixture(x,y,z,0);
        t.teleportCave(1,-78,1);
      });
      await page.waitForFunction(()=>{
        const scene=document.querySelector('#scene');
        return scene?.dataset.chunkCenter?.includes('|') &&
          Number(scene.dataset.loadedChunks)===27 &&
          Number(scene.dataset.playerFeet)<-70 &&
          Number(scene.dataset.renderedFrames)>40;
      },null,{timeout:90000});
      await page.waitForTimeout(400);
      const deep=await page.evaluate(()=>{
        const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
        const left=document.querySelector('.left').getBoundingClientRect();
        const right=document.querySelector('.right').getBoundingClientRect();
        const center=scene.getBoundingClientRect();
        return {count:Number(scene.dataset.loadedChunks),
          active:scene.dataset.chunkCenter,
          vertices:Number(scene.dataset.renderedMeshVertices),
          y:Number(scene.dataset.playerFeet),
          saved:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}'),
          air:t.block(1,-78,1),floor:t.block(1,-79,1),
          layout:left.right<=center.left+3&&right.left>=center.right-3,
          noticeHidden:document.querySelector('#notice').hidden,
          gpu:!!scene.getContext('webgl2')};
      });
      assert.equal(deep.count,27,'Vertical window should be 3 sections by 9 chunks');
      assert.ok(deep.vertices>0,'Editable deep room has no rendered block faces');
      assert.ok(deep.active.includes('-5'),'Deep section was not streamed');
      assert.ok(deep.y<-70,'Player was bounced to the surface');
      assert.equal(deep.air,0);
      assert.ok(deep.floor>0);
      assert.equal(deep.saved.schema,1,'Save schema must stay at 1');
      assert.ok(deep.saved.edits.some(row=>row[0]===1&&row[1]===-78&&row[2]===1&&row[3]===0));
      assert.ok(deep.gpu&&deep.layout&&deep.noticeHidden,'WebGL2/layout/notice fault');
      const raw=await page.screenshot({
        path:'artifacts/mythwrought-depth-'+width+'x'+height+'.png',fullPage:true
      });
      const png=PNG.sync.read(raw),samples=new Set();
      for(let y=Math.floor(png.height*.25);y<Math.floor(png.height*.75);y+=12)
        for(let x=Math.floor(png.width*.30);x<Math.floor(png.width*.70);x+=12){
          const i=(y*png.width+x)*4;
          samples.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
        }
      assert.ok(samples.size>=3,'Deep screenshot appears blank');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:30000});
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-78,1)),0,
        'Deep schema-1 edit lost after reload');
      assert.deepEqual(errors,[],'Browser JavaScript errors at '+width+'x'+height);
      console.log('PASS depth Chromium WebGL2',width+'x'+height,
        JSON.stringify({deepChunks:deep.count,deepVertices:deep.vertices,
          cameraY:deep.y,samples:samples.size,schema:deep.saved.schema}));
    }finally{await context.close();}
  }
}finally{await browser.close();}
