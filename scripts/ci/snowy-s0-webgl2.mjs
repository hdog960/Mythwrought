// Read-only, actual original-game Chromium WebGL2 snow scene evidence.
// Two modes are run in separate processes against base and draft voxel sources.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';

const stage=process.argv[2];
const seed=process.argv[3]===undefined?179:Number(process.argv[3]);
assert.ok(['before','after'].includes(stage),'Expected before or after');
assert.ok([179,2026].includes(seed),'Strict real M7 seeds 179 and 2026 only');
const suffix=seed===179?'':'-seed'+seed;
const info=JSON.parse(await readFile('artifacts/snowy-s0-provenance/reader-metrics.json','utf8'));
const sites=info.seedResults.find(s=>s.seed===seed);
assert.ok(sites?.glacierSites?.length,'No genuine physical glacier cap sampled');
const [gx,gy,gz]=sites.glacierSites[Math.floor(sites.glacierSites.length/2)];
const out='artifacts/snowy-s0-provenance';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[];
try{
  for(const viewport of [{width:844,height:390},{width:956,height:440}]){
    const context=await browser.newContext({
      viewport,deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e?.message??e)));
    page.on('dialog',d=>d.accept());
    // Never preseed SELECTED_SEED_KEY: the production `isUnclaimedWorldSeed`
    // guard intentionally treats any previously selected seed as protected.
    // To prove seed 2026, switch from the real booted M7 seed 179 using the
    // ORIGINAL GAME menu; never manufacture a profile or bypass a save gate.
    try{
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:90000});
      await page.waitForFunction(()=>{
        const api=window.__mythwroughtTest,canvas=document.querySelector('#scene');
        return api&&api.snapshot().seed===179&&
          api.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-v7'&&
          canvas&&Number(canvas.dataset.renderedFrames)>2&&
          Number(canvas.dataset.loadedChunks)>=25&&Number(canvas.dataset.pendingChunks)===0;
      },null,{timeout:110000});
      if(seed!==179){
        await page.locator('#menu').click();
        await page.locator('#seedInput').fill(String(seed));
        await page.locator('#switchWorld').click();
        await page.waitForFunction(chosen=>{
          const api=window.__mythwroughtTest,canvas=document.querySelector('#scene');
          return api&&api.snapshot().seed===chosen&&
            api.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-v7'&&
            canvas&&Number(canvas.dataset.loadedChunks)>=25&&
            Number(canvas.dataset.pendingChunks)===0;
        },seed,{timeout:110000});
        await page.locator('#closeHelp').click();
      }
      const scene=await page.evaluate(({gx,gy,gz})=>{
        const api=window.__mythwroughtTest;
        const profile=api.fourBiomeProfile();
        const target=api.block(gx,gy,gz);
        const pose=api.teleport(gx+10,gz-13);
        api.aimAt(gx,gy,gz);
        return {seed:api.snapshot().seed,profile,iceBlock:target,pose,aim:[gx,gy,gz]};
      },{gx,gy,gz});
      assert.equal(scene.seed,seed);
      assert.equal(scene.profile?.generator,'mythwrought-five-surface-regions-v7');
      assert.equal(scene.iceBlock,276,'Actual game voxel must be genuine glacier ice');
      await page.waitForFunction(()=>{
        const data=document.querySelector('#scene').dataset;
        return data.skyS6WorldBiomeName==='snow'&&
          Number(data.pendingChunks)===0&&Number(data.loadedChunks)>=25;
      },null,{timeout:110000});
      const first=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
      await page.waitForFunction(before=>
        Number(document.querySelector('#scene').dataset.renderedFrames)>=before+8,
        first,{timeout:60000});
      const glinfo=await page.evaluate(()=>{
        const canvas=document.querySelector('#scene'),gl=canvas.getContext('webgl2');
        return {exists:!!gl,version:gl?.getParameter(gl.VERSION)??null,
          viewport:[canvas.width,canvas.height],landscape:[window.innerWidth,window.innerHeight],
          loadedChunks:Number(canvas.dataset.loadedChunks),
          pendingChunks:Number(canvas.dataset.pendingChunks),
          biome:canvas.dataset.skyS6WorldBiomeName,
          renderedFrames:Number(canvas.dataset.renderedFrames)};
      });
      assert.ok(glinfo.exists&&String(glinfo.version).includes('WebGL 2'),'Authentic WebGL2 rendering required');
      assert.equal(glinfo.biome,'snow');
      assert.deepEqual(errors,[],'Actual game Javascript errors');
      const name=stage+'-snowy-ice'+suffix+'-'+viewport.width+'x'+viewport.height+'.png';
      const bytes=await page.screenshot({path:out+'/'+name,timeout:90000});
      const png=pngjs.PNG.sync.read(bytes);
      assert.equal(png.width,viewport.width);
      assert.equal(png.height,viewport.height);
      const capture={stage,name,sha256:createHash('sha256').update(bytes).digest('hex'),
        pngSize:bytes.length,dimensions:[png.width,png.height],scene,glinfo};
      captures.push(capture);
      console.log('SNOW_S0_REAL_WEBGL2 '+JSON.stringify(capture));
      // The ground-level angle sees only a narrow edge of the ice field.
      // Inspect it again from a real original-game elevated camera, without
      // modifying the game, world, local saves, or its render pipeline.
      const look=await page.evaluate(({gx,gy,gz})=>{
        const api=window.__mythwroughtTest;
        const candidates=[[gx,17,gz-12],[gx+3,17,gz-11],[gx-4,17,gz-10],
          [gx,16,gz-8],[gx+6,18,gz-8],[gx-6,18,gz-8],
          // Extra fail-closed physical/collision-safe alternatives only if
          // the real seed-2026 flora occupies the first chosen sky position.
          ...[18,19].flatMap(y=>[[gx,y,gz-12],[gx-6,y,gz-10],
            [gx+6,y,gz-10],[gx,y,gz-8]])];
        let pose=null,chosen=null;
        for(const candidate of candidates){
          try{
            pose=api.teleportCave(...candidate);
            chosen=candidate;break;
          }catch(_error){ /* protected player collisions reject this site */ }
        }
        if(!pose)throw Error('No real collision-safe elevated lookout above the glacier');
        api.aimAt(gx,gy,gz);
        return {pose,chosen,aim:[gx,gy,gz],iceBlock:api.block(gx,gy,gz)};
      },{gx,gy,gz});
      assert.equal(look.iceBlock,276);
      const atStart=await page.evaluate(()=>
        Number(document.querySelector('#scene').dataset.renderedFrames));
      await page.waitForFunction(start=>Number(document.querySelector('#scene').dataset.renderedFrames)>start,
        atStart,{timeout:60000});
      const overlookName=stage+'-snowy-overlook'+suffix+'-'+viewport.width+'x'+viewport.height+'.png';
      const overlookBytes=await page.screenshot({path:out+'/'+overlookName,timeout:90000});
      const overlookPng=pngjs.PNG.sync.read(overlookBytes);
      assert.deepEqual([overlookPng.width,overlookPng.height],[viewport.width,viewport.height]);
      assert.deepEqual(errors,[],'Lookout introduced game JS errors');
      const overlook={stage,view:'overlook',name:overlookName,
        sha256:createHash('sha256').update(overlookBytes).digest('hex'),
        pngSize:overlookBytes.length,dimensions:[overlookPng.width,overlookPng.height],
        scene:{...scene,lookout:look},glinfo};
      captures.push(overlook);
      console.log('SNOW_S0_REAL_WEBGL2_OVERLOOK '+JSON.stringify(overlook));
    }finally{await context.close();}
  }
}finally{await browser.close();}
await writeFile(out+'/'+stage+'-webgl2'+suffix+'.json',JSON.stringify({
  exactHead:process.env.SNOW_EXPECTED_HEAD??null,
  base:process.env.SNOW_BASE??null,stage,seed,captures
},null,2)+'\n');
assert.equal(captures.length,4);
