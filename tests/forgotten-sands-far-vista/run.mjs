import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  await mkdir('p0-far-evidence',{recursive:true});const page=await browser.newPage({viewport:{width:956,height:440}});
  for(const [group,distance] of [[1,48],[3,48],[1,25],[3,25]]){
    const name='g'+group+'-d'+distance;await page.goto('http://127.0.0.1:8765/tests/forgotten-sands-far-vista/index.html?group='+group+'&distance='+distance);
    await page.waitForFunction(()=>window.p0Result||window.p0Error,{},{timeout:180000});
    const err=await page.evaluate(()=>window.p0Error);if(err)throw Error(err);
    const result=await page.evaluate(()=>window.p0Result),images=await page.evaluate(()=>window.p0Images);
    console.log('P0 FAR VISTA',JSON.stringify(result));await writeFile('p0-far-evidence/'+name+'.json',JSON.stringify(result,null,2));
    for(const [mode,data] of Object.entries(images))await writeFile('p0-far-evidence/'+name+'-'+mode+'.png',Buffer.from(data.split(',')[1],'base64'));
  }
}finally{await browser.close();}
