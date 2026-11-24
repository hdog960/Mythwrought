import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  await mkdir('p0-mixed-vista-evidence',{recursive:true});const page=await browser.newPage({viewport:{width:956,height:440}});
  page.on('pageerror',e=>console.log('P0 PAGE ERROR',String(e)));
  for(const [path,name] of [['overview.html?group=1','seed179-vista'],['overview.html?group=3','seed2026-vista'],['recovery.html','recovery']]){
    await page.goto('http://127.0.0.1:8765/tests/forgotten-sands-mixed-vista/'+path);
    await page.waitForFunction(()=>window.p0Result||window.p0Error,{},{timeout:180000});
    const err=await page.evaluate(()=>window.p0Error);if(err)throw Error(err);
    const result=await page.evaluate(()=>window.p0Result);console.log('P0 VISTA '+name,JSON.stringify(result));
    await writeFile('p0-mixed-vista-evidence/'+name+'.json',JSON.stringify(result,null,2));
    if(name!=='recovery')await page.screenshot({path:'p0-mixed-vista-evidence/'+name+'.png'});
  }
}finally{await browser.close();}
