// Genuine live-game WebGL2 proof, not a Canvas2D gallery or an iPhone approval.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
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
      await page.locator('#playerMenu').waitFor({state:'visible',timeout:45000});
      assert.equal(await page.locator('#help').isVisible(),true,
        'Legacy preview entered gameplay before current-only admission');
      page.once('dialog',dialog=>dialog.accept());
      await page.getByRole('button',{name:/NEW WORLD/}).click();
      await page.locator('#help').waitFor({state:'hidden',timeout:45000});
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),
        M6_BALANCED_GENERATOR,'Pack3 original game did not load current V6');
      const selectedSeed=await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed);
      const canonicalKey='mythwrought-v002-world-'+selectedSeed;
      const pack3SidecarKey='mythwrought-pack3-construction-v1:'+selectedSeed;
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
      const canonicalBefore=await page.evaluate(key=>localStorage.getItem(key),canonicalKey);
      assert.ok(canonicalBefore,'Actual V6 canonical schema-1 save absent');
      const verticesBefore=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedMeshVertices));
      await page.locator('#menu').click();
      await page.locator('#pack3Material').selectOption('116');
      await page.locator('#pack3Rotation').selectOption('1');
      await page.locator('#playerMenu .player-menu-close').click();
      await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.canPlace==='true');
      // The ray/face normal chooses the actual highlighted adjacent cell.
      // It is not necessarily the western cell of our legacy stone anchor.
      const targetPlace=await page.evaluate(()=>{
        const c=document.querySelector('#scene');
        return {key:c.dataset.targetPlace,selected:c.dataset.pack3SelectedId};
      });
      assert.equal(targetPlace.selected,'116');
      const placedCell=targetPlace.key.split(',').map(Number);
      assert.equal(placedCell.length,3);
      assert.ok(placedCell.every(Number.isInteger));
      await page.evaluate(cell=>{window.__pack3PlacedCell=cell;},placedCell);
      await page.locator('#place').click();
      await page.waitForFunction(cell=>
        window.__mythwroughtTest.pack3Block(...cell)?.id===116 ||
        document.querySelector('#status')?.textContent?.includes('rolled back'),
        placedCell,{timeout:15000});
      assert.equal(await page.evaluate(cell=>window.__mythwroughtTest.pack3Block(...cell)?.id,placedCell),
        116,'Physical block was not placed at the actual highlighted cell');
      const now=await page.evaluate(([worldKey,sidecarKey])=>({
        entry:window.__mythwroughtTest.pack3Block(...window.__pack3PlacedCell),
        count:Number(document.querySelector('#scene').dataset.pack3PhysicalCount),
        vertices:Number(document.querySelector('#scene').dataset.renderedMeshVertices),
        saved:localStorage.getItem(worldKey),
        sidecar:localStorage.getItem(sidecarKey)
      }),[canonicalKey,pack3SidecarKey]);
      assert.equal(now.entry.id,116);
      assert.equal(now.entry.yaw,1);
      assert.equal(now.count,1);
      const changedChunks=await page.evaluate(()=>window.__mythwroughtTest.snapshot().lastEditMeshKeys);
      assert.ok(changedChunks.length<=1,'Pack3 physical edit rebuilt unrelated GPU chunks');
      assert.ok(now.vertices>verticesBefore,'Physical WebGL2 chunk vertices not uploaded');
      assert.equal(now.saved,canonicalBefore,'Physical placement rewrote V6 schema-1 save');
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
      await page.evaluate(cell=>{window.__pack3PlacedCell=cell;},placedCell);
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:45000});
      const restored=await page.evaluate(worldKey=>({
        entry:window.__mythwroughtTest.pack3Block(...window.__pack3PlacedCell),
        saved:localStorage.getItem(worldKey),
        generator:window.__mythwroughtTest.fourBiomeProfile()?.generator
      }),canonicalKey);
      assert.equal(restored.entry.id,116);
      assert.equal(restored.entry.yaw,1,'Yaw state lost after reload');
      assert.equal(restored.saved,canonicalBefore,
        'Original V6 canonical save was changed on reload');
      assert.equal(restored.generator,M6_BALANCED_GENERATOR,
        'Pack3 physical scene reload no longer uses current V6 generator');
      const removed=await page.evaluate(()=>window.__mythwroughtTest.removePack3Fixture(...window.__pack3PlacedCell));
      assert.equal(removed.ok,true);
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.pack3Block(...window.__pack3PlacedCell)),null);
      assert.deepEqual(errors,[],'Browser JS faults');
      assert.deepEqual(missing,[],'Missing gameplay source');
      evidence.push({viewport:`${width}x${height}`,webgl2:gpu,
        physicalId:116,yaw:1,placed:true,meshVerticesDelta:now.vertices-verticesBefore,
        reload:true,removed:true,canvasColorSamples:colors.size,
        currentV6Seed:selectedSeed,canonicalSaveUnchanged:true});
      console.log('PASS Pack3 live WebGL2',JSON.stringify(evidence.at(-1)));
    }finally{await context.close();}
  }
}finally{await browser.close();}
await import('node:fs/promises').then(fs=>fs.writeFile('artifacts/pack3-live/evidence.json',
  JSON.stringify({renderer:'actual Mythwrought WebGL2 game',physicalIPhoneTested:false,
    testedId:116,all17PhysicalIdNodeProofRequired:true,evidence},null,2)+'\n'));
