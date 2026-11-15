/**
 * Real HTTP-served Chromium WebGL2 capture of the 18 canonical Pack 5 meshes.
 * Explicitly run after Playwright install:
 *   node tests/pack5-integration-browser.mjs [output-directory]
 * Never conflates these source-authentic captures with an actual iPhone GPU.
 */
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(process.argv[2]||'artifacts/pack5-integration');
await mkdir(output,{recursive:true});
const server=spawn('python3',['-m','http.server','4179','--bind','127.0.0.1','--directory',root],{
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
    let ok=false;
    for(let i=0;i<30&&!ok;i++){
      try{
        await page.goto('http://127.0.0.1:4179/tests/pack5-integration-preview.html',{
          waitUntil:'load',timeout:5000});
        ok=true;
      }catch(err){
        if(i===29)throw err;
        await new Promise(resolve=>setTimeout(resolve,100));
      }
    }
    await page.waitForFunction(()=>document.body.dataset.completed!==undefined,{timeout:30000});
    const evidence=await page.evaluate(()=>window.PACK5_BUILDER_PREVIEW);
    assert.equal(evidence?.webgl2,true);
    assert.equal(evidence.cards,18);
    assert.equal(evidence.complete,true,JSON.stringify(evidence.results.filter(r=>r.foreground<=40)));
    assert.equal(new Set(evidence.results.map(r=>r.id)).size,18);
    await page.screenshot({path:path.join(output,`pack5-builder-${width}x${height}.png`)});
    console.log('PASS authentic HTTP-served Pack5 WebGL2',width,height,
      '18 models',evidence.results.reduce((sum,r)=>sum+r.triangles,0),'triangles');
    await page.close();
  }
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
