import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 await mkdir('p0-grounded-evidence',{recursive:true});const page=await browser.newPage({viewport:{width:956,height:440}});
 for(const group of [1,3]){
  await page.goto('http://127.0.0.1:8765/tests/forgotten-sands-grounded-vista/index.html?group='+group);
  await page.waitForFunction(()=>window.p0Result||window.p0Error,{},{timeout:180000});
  const error=await page.evaluate(()=>window.p0Error);if(error)throw Error(error);
  const r=await page.evaluate(()=>window.p0Result),images=await page.evaluate(()=>window.p0Images);
  console.log('P0 GROUNDED WEBGL',JSON.stringify(r));await writeFile('p0-grounded-evidence/group'+group+'.json',JSON.stringify(r,null,2));
  for(const [name,data] of Object.entries(images))await writeFile('p0-grounded-evidence/g'+group+'-'+name+'.png',Buffer.from(data.split(',')[1],'base64'));
 }
}finally{await browser.close();}
