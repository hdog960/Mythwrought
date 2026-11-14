// Optional explicit browser acceptance runner. Never invoked automatically in main CI.
// Example from repository root after installing free Playwright:
//   python3 -m http.server 4173 &
//   node tests/building-pool/roadmap-3/preview-browser.mjs
// Must fail loudly on any unsupported/no-WebGL2 runtime, no fabricated screenshots.
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const url=process.env.MYTHWROUGHT_R3_PREVIEW_URL||'http://127.0.0.1:4173/tests/building-pool/roadmap-3/preview.html';
const out=resolve('artifacts/building-roadmap-3-m1');
let chromium;
try{({chromium}=await import('playwright'));}catch{
 console.error('Playwright not installed; no Chromium preview evidence created');process.exitCode=1;
}
if(chromium){
 await mkdir(out,{recursive:true});
 const browser=await chromium.launch({headless:true});let completed=0;
 try{
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror',e=>console.error('Page error:',e.message));
   try{
    await page.goto(url,{waitUntil:'networkidle',timeout:15000});
    for(const type of ['blacksmith','watchtower'])for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])for(const size of ['small','medium','large']){
     await page.selectOption('#type',type);await page.selectOption('#biome',biome);await page.selectOption('#size',size);
     for(const view of ['exterior','cutaway']){
      await page.selectOption('#view',view);
      const evidence=await page.evaluate(()=>({webgl2:!!document.getElementById('render').getContext('webgl2'),details:document.getElementById('details').textContent}));
      if(!evidence.webgl2||!evidence.details.includes('WebGL2 active'))throw new Error('No genuine WebGL2 render: '+JSON.stringify(evidence));
      await page.screenshot({path:resolve(out,`${type}-${biome}-${size}-${view}-${width}x${height}.png`)});
      completed++;
     }
    }
   }finally{await page.close();}
  }
  if(completed!==180)throw new Error(`Only ${completed}/180 authentic browser specimens`);
  console.log('Real WebGL2 screenshot files:',completed,'in',out);
 }finally{await browser.close();}
}
