import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  await mkdir('p0-webgl-evidence',{recursive:true});
  const page=await browser.newPage({viewport:{width:956,height:440}});
  page.on('pageerror',e=>console.log('P0 PAGE ERROR',String(e)));
  await page.goto('http://127.0.0.1:8765/tests/forgotten-sands-webgl/index.html');
  await page.waitForFunction(()=>window.p0Result||window.p0Error,{},{timeout:180000});
  const error=await page.evaluate(()=>window.p0Error);if(error)throw Error(error);
  const metrics=await page.evaluate(()=>window.p0Result);
  console.log('P0 WEBGL',JSON.stringify(metrics));
  await writeFile('p0-webgl-evidence/metrics.json',JSON.stringify(metrics,null,2));
  await page.screenshot({path:'p0-webgl-evidence/negative-site-956x440.png'});
}finally{await browser.close();}
