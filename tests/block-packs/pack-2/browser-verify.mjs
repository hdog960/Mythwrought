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
      await page.waitForFunction(()=>document.querySelectorAll('#asset option').length===18);
      assert.equal(await page.locator('#asset option').count(),18);
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
      await page.selectOption('#asset','76');
      await page.click('#waterLevel');
      await page.click('#waterFlow');
      const waterState=await page.evaluate(()=>window.pack2Fixture.selection());
      assert.equal(waterState.id,76);
      assert.equal(waterState.level,1);
      assert.equal(waterState.flow,'north');
      await page.click('#place');
      const full=await page.evaluate(()=>window.pack2Fixture.serialize());
      assert.ok(full.cells.some(row=>row[3]===76&&row.length===7));
      const mesh=await page.evaluate(async()=>{
        const {infrastructurePreviewMesh}=await import('/src/block-packs/pack-2/infrastructure.mjs');
        const values=[73,74,75].map(id=>infrastructurePreviewMesh(id));
        // Center crop excludes the label text; canvas is transparent where
        // geometry was NOT drawn. Water's RGB is low-red, so never test "red>100".
        const pixels=document.querySelector('#preview').getContext('2d')
          .getImageData(250,100,390,220).data;
        let visible=0,translucent=0;
        for(let i=0;i<pixels.length;i+=4){
          if(pixels[i+3]>5)visible++;
          if(pixels[i+3]>5&&pixels[i+3]<250)translucent++;
        }
        const {waterPreviewMesh,waterShape}=await import('/src/block-packs/pack-2/water.mjs');
        const w=waterPreviewMesh({level:1,flow:'north'});
        const volume=waterShape({level:1,flow:'north'});
        return {triangles:values.map(x=>x.triangles),visible,
          fluidTriangles:w.triangles,alphaMin:Math.min(...w.alpha),
          fluidSolid:volume.solidCollision,fluidTop:volume.broadPhaseBox[4],translucent};
      });
      assert.ok(mesh.triangles.every(x=>x>=60&&x<=900));
      assert.ok(mesh.visible>500,'Fluid preview must draw actual center-area geometry');
      assert.ok(mesh.translucent>200,'Fluid preview must retain transparency in rendered pixels');
      assert.equal(mesh.fluidTriangles,18);
      assert.ok(mesh.alphaMin>0&&mesh.alphaMin<1);
      assert.equal(mesh.fluidSolid,false);
      assert.ok(mesh.fluidTop>0&&mesh.fluidTop<1);
      assert.deepEqual(errors,[],'No browser module/runtime errors');
      if(process.env.MYTHWROUGHT_PACK2_SCREENSHOTS){
        const dir=resolve(process.env.MYTHWROUGHT_PACK2_SCREENSHOTS);
        await mkdir(dir,{recursive:true});
        await page.screenshot({path:resolve(dir,'pack2-infrastructure-water-'+width+'x'+height+'.png')});
      }
      results.push({viewport:width+'x'+height,ids:[73,74,75,76],triangleCounts:mesh.triangles,waterState});
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
