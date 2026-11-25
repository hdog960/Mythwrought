import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=resolve(process.env.RUNNER_TEMP??'artifacts','phase43');
await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/phase43'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><canvas width="844" height="390"></canvas>');return;}
  const p=resolve(root,'.'+pathname);
  if(!p.startsWith(root+'/')){res.writeHead(403);res.end();return;}
  const body=await readFile(p);
  res.setHeader('Content-Type',extname(p)==='.mjs'||extname(p)==='.js'?'text/javascript':extname(p)==='.json'?'application/json':'application/octet-stream');
  res.end(body);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:844,height:390}});
 await page.goto('http://127.0.0.1:'+server.address().port+'/phase43');
 const result=await page.evaluate(async()=>{
  const gl=document.querySelector('canvas').getContext('webgl2',{preserveDrawingBuffer:true});
  if(!gl)throw Error('NO_WEBGL2');
  const {runPeakGalleryNativeAndGpu}=await import('/src/living-underworld/peak-gallery-acceptance-renderer.mjs');
  const r=runPeakGalleryNativeAndGpu(gl);
  return {...r,contextVersion:gl.getParameter(gl.VERSION),renderer:gl.getParameter(gl.RENDERER)};
 });
 console.log(JSON.stringify(result));
 await writeFile(resolve(out,'report.json'),JSON.stringify(result,null,2));
 await page.screenshot({path:resolve(out,'diagnostic.png')});
 assert.equal(result.haloParity,true);
 assert.equal(result.peakFaces,1546);
 assert.equal(result.peakCuts,843);
 assert.equal(result.originalSaveUnchanged,true);
 assert.equal(result.rollbackPreserved,true);
 assert.equal(result.nativeMeshCacheParity,true);
 assert.equal(result.actualGpuUploadsAndDraw,true);
 assert.equal(result.liveBuffersAfterDispose,0);
 assert.ok(result.maxRead<=40000);
 assert.equal(result.constructionAdmission,false);
}finally{await browser?.close();server.close();}
