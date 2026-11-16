// Genuine game WebGL2 (SwiftShader Chromium) at iPhone landscape CSS sizes.
// Art is NOT approved by screenshots, and no physical iPhone is claimed.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({headless:true,
 args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const evidence=[];
await mkdir('artifacts/biome130-fidelity',{recursive:true});
try{
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const ctx=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1,hasTouch:true,isMobile:true});
    const page=await ctx.newPage(),errors=[],missing=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)missing.push(r.url()+' '+r.status());});
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
        null,{timeout:60000});
      assert.equal(await page.evaluate(()=>!!document.querySelector('#scene').getContext('webgl2')),true);
      // Spawn-relative eye-level fixtures: close enough to visually inspect.
      const fixtureY=await page.evaluate(()=>{
        const t=window.__mythwroughtTest;
        const spawn=t.teleport(14.5,.5);
        const y=Math.min(19,Math.floor(spawn.feet)+1);
        t.placeFixture(16,y,0,350);
        t.placeFixture(17,y,0,377);
        t.placeFixture(18,y,0,385);
        [275,276,277,280,281,282].forEach((id,i)=>t.placeFixture(16+i,y,3,id));
        t.aimAt(16,y,0);
        return y;
      });
      await page.waitForFunction(()=>
        Number(document.querySelector('#scene')?.dataset.biome130IceVertices)>0,
        null,{timeout:12000});
      const state=await page.evaluate(y=>({
        iceVertices:Number(document.querySelector('#scene').dataset.biome130IceVertices),
        ice:window.__mythwroughtTest.block(16,y,0),
        oak:window.__mythwroughtTest.block(17,y,0),
        moonwillow:window.__mythwroughtTest.block(18,y,0)
      }),fixtureY);
      assert.equal(state.ice,350);assert.equal(state.oak,377);assert.equal(state.moonwillow,385);
      assert.ok(state.iceVertices>0);
      assert.deepEqual(await page.evaluate(y=>[275,276,277,280,281,282].map((id,i)=>
        window.__mythwroughtTest.block(16+i,y,3)),fixtureY),[275,276,277,280,281,282]);
      await page.waitForTimeout(250);
      const png=PNG.sync.read(await page.screenshot({
        path:`artifacts/biome130-fidelity/biome130-${width}x${height}.png`}));
      assert.equal(png.width,width);assert.equal(png.height,height);
      const colors=new Set();
      for(let y=Math.floor(height*.18);y<Math.floor(height*.77);y+=7)
        for(let x=Math.floor(width*.15);x<Math.floor(width*.85);x+=7){
          const i=(y*width+x)*4;
          colors.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
        }
      assert.ok(colors.size>=6,'Physical scene render appears blank');
      // Unobstructed real-game foliage gallery: test all nine authored species,
      // not merely an oak/ice combo. Keep camera fixed for real pixel A/B.
      await page.evaluate(y=>{
        const t=window.__mythwroughtTest;
        t.placeFixture(16,y,0,0);t.placeFixture(17,y,0,0);
        // Look past the adjacent empty cell: leaf stays on screen but the
        // gold target outline cannot contaminate the source-versus-empty A/B.
        t.aimAt(17,y,1);
      },fixtureY);
      await page.waitForTimeout(200);
      const empty=PNG.sync.read(await page.screenshot({
        path:'artifacts/biome130-fidelity/biome130-leaf-empty-'+width+'x'+height+'.png'}));
      const speciesPixels={};
      for(let id=377;id<=385;id++){
        await page.evaluate(({y,id})=>
          window.__mythwroughtTest.placeFixture(17,y,0,id),{y:fixtureY,id});
        await page.waitForTimeout(140);
        const leaf=PNG.sync.read(await page.screenshot({
          path:`artifacts/biome130-fidelity/leaf-${id}-${width}x${height}.png`}));
        assert.equal(leaf.width,width);assert.equal(leaf.height,height);
        let changed=0,unchanged=0;
        for(let py=Math.floor(height*.22);py<Math.floor(height*.73);py++)
          for(let px=Math.floor(width*.22);px<Math.floor(width*.78);px++){
            const i=(py*width+px)*4;
            const delta=Math.abs(leaf.data[i]-empty.data[i])+
              Math.abs(leaf.data[i+1]-empty.data[i+1])+
              Math.abs(leaf.data[i+2]-empty.data[i+2]);
            if(delta>=28)changed++;else unchanged++;
          }
        assert.ok(changed>45,'Foliage '+id+' invisible on real WebGL2 canvas');
        assert.ok(unchanged>100,'Foliage '+id+' obscured the complete gameplay scene');
        speciesPixels[id]=changed;
      }
      await page.evaluate(y=>window.__mythwroughtTest.placeFixture(17,y,0,377),fixtureY);
      await page.waitForTimeout(120);
      await page.screenshot({path:`artifacts/biome130-fidelity/biome130-foliage-${width}x${height}.png`});
      await page.evaluate(y=>{
        const t=window.__mythwroughtTest;
        t.placeFixture(17,y,0,377);t.placeFixture(16,y,0,350);
      },fixtureY);
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.biome130IceVertices)>0,
        null,{timeout:60000});
      assert.deepEqual(await page.evaluate(y=>[
        window.__mythwroughtTest.block(16,y,0),
        window.__mythwroughtTest.block(17,y,0),
        window.__mythwroughtTest.block(18,y,0)
      ],fixtureY),[350,377,385],'Source blocks were not saved/restored');
      assert.deepEqual(await page.evaluate(y=>[275,276,277,280,281,282].map((id,i)=>
        window.__mythwroughtTest.block(16+i,y,3)),fixtureY),[275,276,277,280,281,282],
        'Additional source ice blocks missing after browser save/reload');
      const residentChunks=Number(await page.locator('#scene').getAttribute('data-loaded-chunks'));
      assert.ok(Number.isInteger(residentChunks)&&residentChunks>0&&residentChunks<=25,
        'Landscape streaming exceeded 25 surface GPU chunks');
      assert.deepEqual(errors,[],'Runtime JS errors');assert.deepEqual(missing,[],'404 resources');
      evidence.push({viewport:`${width}x${height}`,webgl2:true,fixtureY,iceVertices:state.iceVertices,
        iceIds:[275,276,277,280,281,282,350],foliageIds:[377,385],
        reloaded:true,colors:colors.size,visibleFoliagePixels:speciesPixels[377],
        allNineFoliagePixels:speciesPixels,
        loadedChunks:residentChunks,surfaceChunkBudget:25,
        physicalIPhoneTested:false});
      console.log('PASS biome130 live WebGL2',JSON.stringify(evidence.at(-1)));
    }finally{await ctx.close();}
  }
}finally{await browser.close();}
await writeFile('artifacts/biome130-fidelity/evidence.json',
  JSON.stringify({evidence,renderPath:'live-game-WebGL2'},null,2)+'\n');
