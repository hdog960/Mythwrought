// Six genuine Chromium software-WebGL2 screenshot captures of original C-owned Riverbend tailor source.
// These are source cube diagnostic renders, not physical producer meshes or art approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {extname,resolve,sep,join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';

const root=resolve('.'),id='r2:tailor:temperate:small:03',sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const output=resolve('artifacts/roadmap-c-trade-riverbend-tailor/chromium-webgl2-source');
const createSite=()=>createServer(async(req,res)=>{
 try{
  const raw=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+raw);
  if(!(file===root||file.startsWith(root+sep)))throw Error('out of root request');
  const bytes=await readFile(file);
  res.setHeader('content-type',({'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.json':'application/json'}[extname(file)]||'application/octet-stream')+'; charset=utf-8');
  res.end(bytes);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
test('Roadmap C temperate tailor: six authentic Chromium source-specific WebGL2 exterior/cutaway screenshots', {timeout:300000},async()=>{
 const site=createSite();
 let browser;
 try{
  await new Promise((ok,fail)=>{site.once('error',fail);site.listen(0,'127.0.0.1',ok)});
  browser=await chromium.launch({headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--disable-dev-shm-usage']});
  await mkdir(output,{recursive:true});
  const manifest=[];
  for(const [width,height] of sizes)for(const view of views){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const address='http://127.0.0.1:'+site.address().port+'/tests/building-pool/roadmap-c-trades/tailor-preview.html?id='+encodeURIComponent(id)+'&view='+view;
   await page.goto(address,{waitUntil:'load',timeout:30000});
   await page.waitForFunction(()=>document.body.dataset.ready==='yes',null,{timeout:30000});
   const info=await page.evaluate(()=>{
    const scene=document.getElementById('scene'),gl=scene.getContext('webgl2',{preserveDrawingBuffer:true});
    const pixels=new Uint8Array(scene.width*scene.height*4);
    gl.finish();gl.readPixels(0,0,scene.width,scene.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let colored=0;
    for(let i=0;i<pixels.length;i+=128)if(Math.abs(pixels[i]-16)>15||Math.abs(pixels[i+1]-30)>15||Math.abs(pixels[i+2]-45)>15)colored++;
    return {id:document.body.dataset.blueprint,view:document.body.dataset.view,webgl:document.body.dataset.webgl,
     gpuError:gl.getError(),canvasWidth:scene.width,canvasHeight:scene.height,windowWidth:innerWidth,windowHeight:innerHeight,
     sourceVisibleCells:Number(document.body.dataset.voxels),coloredSamples:colored};
   });
   assert.equal(info.id,id);assert.equal(info.view,view);assert.equal(info.webgl,'WebGL2');
   assert.equal(info.windowWidth,width);assert.equal(info.windowHeight,height);
   assert.equal(info.canvasWidth,width);assert.equal(info.canvasHeight,height);
   assert.equal(info.gpuError,0);assert.ok(info.coloredSamples>120,'blank source render');
   assert.ok(info.sourceVisibleCells>120,'missing authentic source cube mesh');
   const png=await page.screenshot({type:'png'});
   assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
   assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),height);
   assert.ok(png.length>2048,'underfilled screenshot');
   const filename='temperate-small-tailor-'+view+'-'+width+'x'+height+'.png';
   await writeFile(join(output,filename),png);
   manifest.push({file:filename,id,view,viewport:[width,height],bytes:png.length,
    sha256:createHash('sha256').update(png).digest('hex'),...info,
    approval:'SOURCE-CUBE-DIAGNOSTIC-ONLY',producerMeshApproved:false,saveApproved:false,creatorArtApproved:false});
   await page.close();
  }
  assert.equal(manifest.length,6);assert.equal(new Set(manifest.map(m=>m.sha256)).size,6);
  const exactSourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  assert.match(exactSourceCommit,/^[0-9a-f]{40}$/);
  const sourceModulePath='src/building-pool/roadmap-c-trades/wave2-riverbend-tailor.mjs';
  const sourceModuleSha256=createHash('sha256').update(await readFile(sourceModulePath)).digest('hex');
  await writeFile(join(output,'acceptance.json'),JSON.stringify({exactSourceCommit,sourceModulePath,sourceModuleSha256,schema:'mythwrought.roadmap-c.trade-wave2.webgl2.v1',id,
    sourceOnly:true,approved:false,captured:manifest.length,records:manifest},null,2)+'\n');
  console.log('MYTHWROUGHT_ROADMAP_C_RIVERBEND_TAILOR_SOURCE_WEBGL2=6/6');
 }finally{
  if(browser)await browser.close();
  if(site.listening)await new Promise(ok=>site.close(ok));
 }
});
