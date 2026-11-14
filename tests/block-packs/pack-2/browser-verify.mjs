// Optional authentic Chromium smoke for Pack 2's isolated triangle preview.
// Run in an authorized repo checkout with Playwright/Chromium installed:
// node tests/block-packs/pack-2/browser-verify.mjs
// This is NOT the production WebGL2/Pages world, offline or iPhone certification.
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {strict as assert} from 'node:assert';
import {pathToFileURL} from 'node:url';

export async function runPack2BrowserVerification(){
  const root=resolve('.');
  const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
    '.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
  const server=createServer(async(req,res)=>{
    try{
      const target=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if(!target.startsWith(root+sep))throw new Error('Not a repository file');
      const type=mime[extname(target)];
      if(!type)throw new Error('Not an inspector asset');
      const content=await readFile(target);
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});
      res.end(content);
    }catch(error){res.writeHead(404);res.end('Not found');}
  });
  let browser;
  const results=[];
  try{
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
    const base='http://127.0.0.1:'+server.address().port;
    for(const [width,height] of [[667,375],[844,390],[932,430]]){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',error=>errors.push(String(error)));
      const response=await page.goto(base+'/tests/block-packs/pack-2/preview.html');
      assert.equal(response.status(),200);
      await page.locator('#asset option').first().waitFor();
      assert.equal(await page.locator('#asset option').count(),17);
      for(const id of [73,74,75]){
        await page.selectOption('#asset',String(id));
        assert.equal(await page.evaluate(()=>window.pack2Fixture.selection().id),id);
        await page.click('#variant');
        assert.notEqual(await page.evaluate(()=>window.pack2Fixture.selection().variant),null);
        await page.click('#rotate');
        const s=await page.evaluate(()=>window.pack2Fixture.selection());
        assert.equal(s.id,id);
        assert.equal(s.rotation,1);
        await page.click('#place');
        const data=await page.evaluate(()=>window.pack2Fixture.serialize());
        assert.ok(data.cells.some(c=>c[3]===id));
      }
      const mesh=await page.evaluate(async()=>{
        const {infrastructurePreviewMesh}=await import('/src/block-packs/pack-2/infrastructure.mjs');
        const values=[73,74,75].map(id=>infrastructurePreviewMesh(id));
        const pixels=document.querySelector('#preview').getContext('2d')
          .getImageData(120,100,600,300).data;
        let visible=0;for(let i=0;i<pixels.length;i+=4)
          if(pixels[i]>100&&pixels[i+1]>70&&pixels[i+2]>35)visible++;
        return {triangles:values.map(x=>x.triangles),visible};
      });
      assert.ok(mesh.triangles.every(x=>x>=60&&x<=900));
      assert.ok(mesh.visible>200,'Candidate canvas must draw visible asset geometry');
      assert.deepEqual(errors,[],'No browser module/runtime errors');
      if(process.env.MYTHWROUGHT_PACK2_SCREENSHOTS){
        const dir=resolve(process.env.MYTHWROUGHT_PACK2_SCREENSHOTS);
        await mkdir(dir,{recursive:true});
        await page.screenshot({path:resolve(dir,'pack2-infrastructure-'+width+'x'+height+'.png')});
      }
      results.push({viewport:width+'x'+height,ids:[73,74,75],triangleCounts:mesh.triangles});
      await page.close();
    }
    return results;
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){
  runPack2BrowserVerification().then(result=>console.log(JSON.stringify({status:'pass',result})),
    error=>{console.error(error);process.exitCode=1;});
}
