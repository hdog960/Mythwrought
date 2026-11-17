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

      // Source-specific same-chunk water/ice order audit on the actual game
      // renderer. Pack 2 water ID 76 and biome130 ice ID 275 are placed
      // alternately near/far; screenshots use one unchanged eye/camera pose.
      // This records the documented chunk-level sorting limitation without
      // claiming a per-face GPU sort or injecting diagnostic mock fragments.
      const overlap={};
      const auditPoints=[[16,fixtureY,0],[17,fixtureY,0]];
      const captureAudit=async label=>{
        await page.waitForTimeout(170);
        const shot=PNG.sync.read(await page.screenshot({path:
          `artifacts/biome130-fidelity/ice-water-${label}-${width}x${height}.png`}));
        assert.equal(shot.width,width);assert.equal(shot.height,height);
        return shot;
      };
      const pixelChanges=(a,b)=>{
        let changed=0;
        for(let py=Math.floor(height*.18);py<Math.floor(height*.82);py++)
          for(let px=Math.floor(width*.14);px<Math.floor(width*.86);px++){
            const k=(py*width+px)*4;
            if(Math.abs(a.data[k]-b.data[k])+
               Math.abs(a.data[k+1]-b.data[k+1])+
               Math.abs(a.data[k+2]-b.data[k+2])>=28)changed++;
          }
        return changed;
      };
      try{
        for(const [name,nearId,farId] of [
          ['ice-front',275,76],['water-front',76,275]
        ]){
          await page.evaluate(({y})=>{
            const t=window.__mythwroughtTest;
            t.placeFixture(16,y,0,0);t.placeFixture(17,y,0,0);
            // Off-axis ray avoids block-select outlines polluting A/B pixels.
            t.aimAt(17,y,1);
          },{y:fixtureY});
          const empty=await captureAudit(name+'-empty');
          await page.evaluate(({y,id})=>
            window.__mythwroughtTest.placeFixture(16,y,0,id),
            {y:fixtureY,id:nearId});
          const near=await captureAudit(name+'-near');
          await page.evaluate(({y})=>
            window.__mythwroughtTest.placeFixture(16,y,0,0),
            {y:fixtureY});
          await page.evaluate(({y,id})=>
            window.__mythwroughtTest.placeFixture(17,y,0,id),
            {y:fixtureY,id:farId});
          const far=await captureAudit(name+'-far');
          await page.evaluate(({y,id})=>
            window.__mythwroughtTest.placeFixture(16,y,0,id),
            {y:fixtureY,id:nearId});
          const both=await captureAudit(name+'-both');
          assert.deepEqual(await page.evaluate(y=>[
            window.__mythwroughtTest.block(16,y,0),
            window.__mythwroughtTest.block(17,y,0)
          ],fixtureY),[nearId,farId],'Wrong live Pack2 water/ice IDs');
          const report={
            nearId,farId,sameChunk:true,renderPath:'actual-water-ice-blend',
            nearPixels:pixelChanges(empty,near),
            farPixels:pixelChanges(empty,far),
            combinedPixels:pixelChanges(empty,both),
            combinedVsNearPixels:pixelChanges(near,both),
            combinedVsFarPixels:pixelChanges(far,both),
            gpuIceVertices:Number(await page.locator('#scene')
              .getAttribute('data-biome130-ice-vertices')),
          };
          assert.ok(report.nearPixels>30&&report.farPixels>30,
            'Actual water or ice not visible independently in '+name);
          assert.ok(report.combinedPixels>30,
            'Water/ice composite invisible in '+name);
          assert.ok(report.gpuIceVertices>0,'Ice absent from live transparent GPU upload');
          overlap[name]=report;
        }
      }finally{
        // Preserve the accepted source ice and foliage fixtures and their save.
        await page.evaluate(y=>{
          const t=window.__mythwroughtTest;
          t.placeFixture(16,y,0,350);t.placeFixture(17,y,0,377);
          t.aimAt(16,y,0);
        },fixtureY);
      }
      console.log('PASS biome130 authentic water/ice overlap audit',
        JSON.stringify({viewport:`${width}x${height}`,overlap,
          knownLimit:'chunk-sorted; no per-face translucent sorting'}));
      assert.deepEqual(errors,[],'Runtime JS errors');assert.deepEqual(missing,[],'404 resources');
      evidence.push({viewport:`${width}x${height}`,webgl2:true,fixtureY,iceVertices:state.iceVertices,
        iceIds:[275,276,277,280,281,282,350],foliageIds:[377,385],
        reloaded:true,colors:colors.size,visibleFoliagePixels:speciesPixels[377],
        allNineFoliagePixels:speciesPixels,waterIceOverlap:overlap,
        loadedChunks:residentChunks,surfaceChunkBudget:25,
        physicalIPhoneTested:false});
      console.log('PASS biome130 live WebGL2',JSON.stringify(evidence.at(-1)));
    }finally{await ctx.close();}
  }
}finally{await browser.close();}
await writeFile('artifacts/biome130-fidelity/evidence.json',
  JSON.stringify({evidence,renderPath:'live-game-WebGL2'},null,2)+'\n');
