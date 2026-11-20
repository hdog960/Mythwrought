// Optional explicit browser acceptance runner. Never invoked automatically in main CI.
// Example from repository root after installing free Playwright:
//   python3 -m http.server 4173 &
//   node tests/building-pool/roadmap-3b/preview-browser.mjs
// Must fail loudly on any unsupported/no-WebGL2 runtime, no fabricated screenshots.
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const url=process.env.MYTHWROUGHT_R3B_PREVIEW_URL||'http://127.0.0.1:4173/tests/building-pool/roadmap-3b/preview.html';
const out=resolve('artifacts/building-roadmap-3b-m1');
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
   const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
   try{
    await page.goto(url,{waitUntil:'networkidle',timeout:15000});
    for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])for(const size of ['small','medium','large']){
     await page.selectOption('#biome',biome);await page.selectOption('#size',size);
     for(const view of ['exterior','cutaway']){
      await page.selectOption('#view',view);
      const evidence=await page.evaluate(()=>{
       const canvas=document.getElementById('render'),gl=canvas.getContext('webgl2'),details=document.getElementById('details').textContent;
       if(!gl)return {webgl2:false,details};
       gl.finish();
       const pixels=new Uint8Array(canvas.width*canvas.height*4);
       gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
       const gpuError=gl.getError();let foreground=0;
       // Clear color is RGB(18,28,41); sample all viewports, including tall cutaways.
       for(let i=0;i<pixels.length;i+=4*32)
        if(Math.abs(pixels[i]-18)>17||Math.abs(pixels[i+1]-28)>17||Math.abs(pixels[i+2]-41)>17)foreground++;
       return {webgl2:true,details,foreground,gpuError,width:canvas.width,height:canvas.height};
      });
      const id=`r3:watchtower:${biome}:${size}:1`;
      if(pageErrors.length||!evidence.webgl2||!evidence.details.includes(id)||
         !evidence.details.includes(`WebGL2 active · ${view}`)||evidence.gpuError!==0||evidence.foreground<20)
       throw new Error('Invalid/blank genuine WebGL2 render: '+JSON.stringify({evidence,pageErrors}));
      await page.screenshot({path:resolve(out,`watchtower-${biome}-${size}-${view}-${width}x${height}.png`)});
      completed++;
     }
    }
   }finally{await page.close();}
  }
  if(completed!==90)throw new Error(`Only ${completed}/90 authentic browser specimens`);
  console.log('Real WebGL2 screenshot files:',completed,'in',out);
 }finally{await browser.close();}
}
