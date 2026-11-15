/**
 * Genuine HTTP-served Chromium acceptance of the ACTUAL Mythwrought main
 * renderer with its opt-in Pack 5 sidecar, not only an isolated object gallery.
 * Does NOT replace physical iPhone/Safari testing or authorize deployment.
 */
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(process.argv[2]||'artifacts/pack5-integration/game');
await mkdir(output,{recursive:true});
const server=spawn('python3',['-m','http.server','4181','--bind','127.0.0.1','--directory',root],{
  cwd:root,stdio:'ignore'
});
let browser;
try{
  browser=await chromium.launch({headless:true,args:[
    '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
    '--enable-webgl','--ignore-gpu-blocklist'
  ]});
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    let opened=false;
    for(let i=0;i<35&&!opened;i++){
      try{
        await page.goto('http://127.0.0.1:4181/',{waitUntil:'load',timeout:7000});
        opened=true;
      }catch(err){
        if(i===34)throw err;
        await new Promise(resolve=>setTimeout(resolve,100));
      }
    }
    await page.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.renderedFrames)>2,
      {timeout:30000});
    await page.locator('#menu').click();
    await page.evaluate(()=>{
      const checkbox=document.getElementById('pack5Enabled');
      checkbox.checked=true;checkbox.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await page.waitForFunction(()=>
      document.getElementById('pack5Status')?.textContent.includes('Pack 5 ON'),
      {timeout:30000});
    assert.equal(await page.locator('#pack5Family option').count(),18);
    await page.locator('#closeHelp').click();
    const placement=await page.evaluate(()=>{
      const api=window.__mythwroughtTest;
      const canvas=document.getElementById('scene');
      const x=Math.floor(Number(canvas.dataset.playerX))+3;
      const z=Math.floor(Number(canvas.dataset.playerZ));
      const feet=Number(canvas.dataset.playerFeet);
      const y=Math.min(18,Math.floor(feet)+2);
      return api.placePack5TestFixture(x,y,z);
    });
    assert.equal(placement.ok,true,'Real game Pack 5 test shape placement');
    assert.equal(placement.worldSchema,1,'Legacy world schema preserved');
    await page.waitForFunction(()=>Number(document.getElementById('scene').dataset.pack5MeshVertices)>0,
      {timeout:30000});
    const evidence=await page.evaluate(()=>{
      const c=document.getElementById('scene');
      return {vertices:Number(c.dataset.pack5MeshVertices),
        instances:Number(c.dataset.pack5VisibleInstances),
        frames:Number(c.dataset.renderedFrames),rendered:c.dataset.skyDrawn==='true',
        sidecar:Object.keys(localStorage).some(k=>k.startsWith('mythwrought.pack5.builder.seed.'))};
    });
    assert.ok(evidence.vertices>0&&evidence.instances===1&&evidence.rendered);
    assert.equal(evidence.sidecar,true);
    await page.screenshot({path:path.join(output,'pack5-live-game-'+width+'x'+height+'.png')});
    // A saved physical structure must reload visibly even though editing starts OFF.
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>
      Number(document.getElementById('scene')?.dataset.pack5MeshVertices)>0,
      null,{timeout:30000});
    assert.equal(await page.locator('#pack5Enabled').isChecked(),false);
    const recovered=await page.evaluate(()=>({
      instances:Number(document.getElementById('scene').dataset.pack5VisibleInstances),
      status:document.getElementById('pack5Status').textContent
    }));
    assert.equal(recovered.instances,1);
    assert.match(recovered.status,/restored and physically solid/);
    console.log('PASS independent Pack5 sidecar reload with editing OFF',width,height);
    console.log('PASS actual Mythwrought game Pack5 WebGL2',width,height,evidence);
    await page.close();
  }
  // Browser touch emulation is a useful regression, not physical iPhone proof.
  // Keep the real game's original two-thumb rails visible in landscape.
  const mobile=await browser.newPage({viewport:{width:844,height:390},
    deviceScaleFactor:3,hasTouch:true,isMobile:true});
  await mobile.goto('http://127.0.0.1:4181/',{waitUntil:'load'});
  await mobile.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.renderedFrames)>2);
  const layout=await mobile.evaluate(()=>{
    const left=document.querySelector('.left').getBoundingClientRect(),
      right=document.querySelector('.right').getBoundingClientRect(),
      canvas=document.querySelector('#scene').getBoundingClientRect();
    return {leftClear:left.right<=canvas.left+2,rightClear:right.left>=canvas.right-2,
      viewport:[innerWidth,innerHeight],loaded:Number(document.getElementById('scene').dataset.loadedChunks)};
  });
  assert.equal(layout.leftClear,true,'Left touch grip overlaps world');
  assert.equal(layout.rightClear,true,'Right touch grip overlaps world');
  await mobile.locator('#menu').tap();
  await mobile.locator('#pack5Enabled').check();
  await mobile.waitForFunction(()=>
    document.getElementById('pack5Status').textContent.includes('Pack 5 ON'));
  await mobile.locator('#closeHelp').tap();
  assert.equal(await mobile.locator('#scene').isVisible(),true);
  await mobile.screenshot({path:path.join(output,'pack5-touch-emulated-844x390.png')});
  console.log('PASS Chromium iPhone-style touch emulation (NOT physical iPhone)',layout);
  await mobile.close();
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
