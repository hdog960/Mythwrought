// Genuine 1A-source Chromium WebGL2 GPU screenshot acceptance; original cube-envelope diagnostics.
// NOT Pack1–5 physical AABB meshes, live gameplay geometry, creator art signoff or an iPhone test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {access,mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,sep,extname} from 'node:path';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';

const root=resolve('.');
const wanted=[
 'r1:house:enchanted-forest:medium:002',
 'r1:tavern:enchanted-forest:small:001',
 getM1InnExemplars()[0].id,
 ...getM2Originals().map(b=>b.id),
 ...getM2HousingTranche().map(b=>b.id),
 ...getM2HousingWave2().map(b=>b.id)
];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const dest=resolve('artifacts/building-roadmap-1a-m2/chromium-webgl2-cube');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function chromeExecutable(){
 for(const path of [process.env.MYTHWROUGHT_CHROME_BIN,
  '/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean))
  try{await access(path);return path}catch{}
 throw Error('Chromium required for real Builder 1A WebGL2 screenshot acceptance');
}
function localServer(){return createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+pathname);
  if(!(file===root||file.startsWith(root+sep)))throw Error('preview URL outside repo');
  const body=await readFile(file);
  res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
   '.json':'application/json','.js':'text/javascript; charset=utf-8'}[extname(file)]||'application/octet-stream'));
  res.end(body);
 }catch{res.writeHead(404);res.end('Missing 1A asset')}
});}
async function connect(port){
 const response=await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'});
 if(!response.ok)throw Error('CDP browser page failed '+response.status);
 const tab=await response.json(),socket=new WebSocket(tab.webSocketDebuggerUrl),pending=new Map();
 let number=0;
 socket.onmessage=e=>{const msg=JSON.parse(e.data),p=pending.get(msg.id);if(p){pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result)}};
 await new Promise((ok,fail)=>{socket.onopen=ok;socket.onerror=fail});
 return {send(method,params={}){const id=++number;return new Promise((ok,fail)=>{pending.set(id,{resolve:ok,reject:fail});socket.send(JSON.stringify({id,method,params}))})},
  close(){socket.close()}};
}
async function evalIn(cdp,expression){
 const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('1A browser runtime error '+JSON.stringify(r.exceptionDetails).slice(0,1300));
 return r.result?.value;
}
async function awaitReady(cdp){
 for(let i=0;i<180;i++){
  const status=await evalIn(cdp,'document.getElementById("details")?.textContent||""');
  if(typeof status==='string'&&status.includes('WebGL2 active'))return;
  if(typeof status==='string'&&status.includes('unavailable'))throw Error(status);
  await sleep(100);
 }
 throw Error('Timed out awaiting actual 1A-source WebGL2 rendering');
}
function chooseExpression(id,view){
 return '(()=>{const b=document.getElementById("blueprint"),v=document.getElementById("view");'
 +'const desired='+JSON.stringify({id,view})+';'
 +'if(![...b.options].some(o=>o.value===desired.id))throw Error("not in authored 1A gallery "+desired.id);'
 +'b.value=desired.id;v.value=desired.view;v.dispatchEvent(new Event("change",{bubbles:true}));'
 +'const canvas=document.getElementById("render"),gl=canvas?.getContext("webgl2");'
 +'if(!gl)return {webgl2:false};gl.finish();'
 +'const pixels=new Uint8Array(canvas.width*canvas.height*4);'
 +'gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);'
 +'let foreground=0;for(let i=0;i<pixels.length;i+=128){'
 +'if(Math.abs(pixels[i]-18)>17||Math.abs(pixels[i+1]-28)>17||Math.abs(pixels[i+2]-41)>17)foreground++;}'
 +'return {webgl2:true,details:document.getElementById("details").textContent,'
 +'viewport:[innerWidth,innerHeight],canvas:[canvas.width,canvas.height],'
 +'foreground,gpuError:gl.getError(),options:b.options.length};})()';
}
test('246 actual source-authored 1A WebGL2 cuboid-proxy exteriors/cutaways across three phone-landscape sizes',
 {timeout:360000},async()=>{
 let child,cdp,site,temp;const captures=[];
 try{
  const executable=await chromeExecutable();
  site=localServer();await new Promise(ok=>site.listen(0,'127.0.0.1',ok));
  temp=await mkdtemp(join(tmpdir(),'mythwrought-1a-cdp-'));
  child=spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
   '--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let port=null;
  for(let i=0;i<180;i++){
   try{port=(await readFile(join(temp,'DevToolsActivePort'),'utf8')).split('\n')[0];break}
   catch{if(child.exitCode!==null)throw Error('Chromium terminated before CDP');await sleep(100)}
  }
  assert.ok(port,'No Chromium debugging port');cdp=await connect(port);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  await mkdir(dest,{recursive:true});
  const url='http://127.0.0.1:'+site.address().port+'/tests/building-pool/roadmap-1a/m2-preview.html';
  assert.equal(wanted.length,41);
  for(const [width,height] of sizes){
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
   await cdp.send('Page.navigate',{url});await awaitReady(cdp);
   for(const id of wanted)for(const view of views){
    const result=await evalIn(cdp,chooseExpression(id,view));
    assert.equal(result.webgl2,true,id+' WebGL2 missing');
    assert.ok(result.details.includes(id),id+' wrong source');
    assert.ok(result.details.includes('WebGL2 active · '+view),id+' wrong renderer');
    assert.equal(result.options,41,'wrong source gallery list');
    assert.deepEqual(result.viewport,[width,height]);
    assert.ok(result.canvas[0]>100&&result.canvas[1]>100,'zero-sized canvas');
    assert.equal(result.gpuError,0,'WebGL2 GPU reported error');
    assert.ok(result.foreground>20,id+' blank GPU render');
    const img=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
    const bytes=Buffer.from(img.data,'base64');
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.ok(bytes.length>2048,'blank screenshot');
    const stem=id.replaceAll(':','-');
    const filename=stem+'-'+view+'-'+width+'x'+height+'.png';
    await writeFile(join(dest,filename),bytes);
    captures.push({id,view,viewport:[width,height],filename,bytes:bytes.length,foreground:result.foreground,
     renderer:'CHROMIUM_WEBGL2_AUTHORED_CELL_CUBE_DIAGNOSTIC',physicalPackGeometry:false});
   }
  }
  assert.equal(captures.length,246);
  assert.equal(new Set(captures.map(x=>x.filename)).size,246);
  await writeFile(join(dest,'source-acceptance.json'),JSON.stringify({
   count:captures.length,source:'original coordinate-authored Builder 1A blueprints',
   sourceIds:wanted,renderer:'CHROMIUM_WEBGL2_AUTHORED_CELL_CUBE_DIAGNOSTIC',
   familyPhysicalAABBsRendered:false,liveGameRendered:false,creatorAccepted:false,physicalIPhoneTested:false,
   captures},null,2)+'\n');
  console.log('MYTHWROUGHT_1A_M2_SOURCE_WEBGL2_CUBE_DIAGNOSTICS='+captures.length+'/246');
 }finally{
  if(cdp)cdp.close();
  if(child){child.kill('SIGTERM');await Promise.race([new Promise(ok=>child.once('close',ok)),sleep(2500)])}
  if(site)await new Promise(ok=>site.close(ok));
  if(temp)await rm(temp,{recursive:true,force:true,maxRetries:5,retryDelay:200});
 }
});


const physicalWanted=["r1:house:temperate:small:003","r1:house:desert:small:004","r1:house:snow:small:003","r1:house:enchanted-forest:small:003","r1:house:mountain:small:003"];
const physicalDest=resolve('artifacts/building-roadmap-1a-m2/chromium-webgl2-source-pack-aabb');
function choosePhysicalExpression(id,view){
 return '(()=>{const b=document.getElementById("blueprint"),v=document.getElementById("view"),m=document.getElementById("geometry");'
  +'const desired='+JSON.stringify({id,view})+';'
  +'if(![...b.options].some(o=>o.value===desired.id))throw Error("physical source not in authored gallery");'
  +'m.value="physical";b.value=desired.id;v.value=desired.view;v.dispatchEvent(new Event("change",{bubbles:true}));'
  +'const canvas=document.getElementById("render"),gl=canvas.getContext("webgl2");gl.finish();'
  +'const pixels=new Uint8Array(canvas.width*canvas.height*4);'
  +'gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);'
  +'let foreground=0;for(let i=0;i<pixels.length;i+=128){'
  +'if(Math.abs(pixels[i]-18)>17||Math.abs(pixels[i+1]-28)>17||Math.abs(pixels[i+2]-41)>17)foreground++;}'
  +'return {renderer:document.getElementById("details").textContent,'
  +'viewport:[innerWidth,innerHeight],foreground,gpuError:gl.getError(),'
  +'canvas:[canvas.width,canvas.height],sourceOptions:b.options.length};})()';
}
test('30 true source Pack1-5 visibleBoxes WebGL2 AABB candidate screenshots, not final game art',
 {timeout:300000},async()=>{
 let child,cdp,site,temp;const captures=[];
 try{
  const executable=await chromeExecutable();
  site=localServer();await new Promise(ok=>site.listen(0,'127.0.0.1',ok));
  temp=await mkdtemp(join(tmpdir(),'mythwrought-1a-aabb-'));
  child=spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
   '--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let port=null;
  for(let i=0;i<180;i++){
   try{port=(await readFile(join(temp,'DevToolsActivePort'),'utf8')).split('\n')[0];break}
   catch{if(child.exitCode!==null)throw Error('Chromium terminated before CDP');await sleep(100)}
  }
  assert.ok(port,'No Chromium physical AABB preview debugger');
  cdp=await connect(port);await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  await mkdir(physicalDest,{recursive:true});
  const url='http://127.0.0.1:'+site.address().port+'/tests/building-pool/roadmap-1a/m2-preview.html';
  assert.equal(physicalWanted.length,5);
  for(const [width,height] of sizes){
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
   await cdp.send('Page.navigate',{url});await awaitReady(cdp);
   for(const id of physicalWanted)for(const view of views){
    const a=await evalIn(cdp,choosePhysicalExpression(id,view));
    assert.ok(a.renderer.includes(id),'incorrect physical source ID');
    assert.ok(a.renderer.includes('Pack source AABBs WebGL2 active · '+view),'not physical AABB WebGL2');
    assert.deepEqual(a.viewport,[width,height]);
    assert.equal(a.sourceOptions,41);
    assert.equal(a.gpuError,0);
    assert.ok(a.foreground>20,'blank source-AABB WebGL2 framebuffer');
    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
    const bytes=Buffer.from(shot.data,'base64'),filename=id.replaceAll(':','-')+'-'+view+'-'+width+'x'+height+'.png';
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.ok(bytes.length>2048,'empty physical AABB capture');
    await writeFile(join(physicalDest,filename),bytes);
    captures.push({id,view,viewport:[width,height],filename,bytes:bytes.length,foreground:a.foreground,
     renderer:'CHROMIUM_WEBGL2_SOURCE_PACK_VISIBLE_AABB_CANDIDATE_DIAGNOSTIC',sourceVisibleBoxes:true,
     finalTexturedArt:false,loadAndCollisionApproved:false,liveWorld:false,creatorAccepted:false});
   }
  }
  assert.equal(captures.length,30);
  assert.equal(new Set(captures.map(x=>x.filename)).size,30);
  await writeFile(join(physicalDest,'source-aabb-acceptance.json'),JSON.stringify({
   captures,total:captures.length,sourceIDs:physicalWanted,
   renderer:'CHROMIUM_WEBGL2_SOURCE_PACK_VISIBLE_AABB_CANDIDATE_DIAGNOSTIC',
   sourceVisibleAABBs:true,textureApproval:false,weatherAndStructuralAcceptance:false,
   doorAndSaveABIUnresolved:true,liveGameWorld:false,physicalIPhoneTested:false
  },null,2)+'\n');
  console.log('MYTHWROUGHT_1A_M2_SOURCE_PACK_AABB_WEBGL2='+captures.length+'/30');
 }finally{
  if(cdp)cdp.close();
  if(child){child.kill('SIGTERM');await Promise.race([new Promise(ok=>child.once('close',ok)),sleep(2500)])}
  if(site)await new Promise(ok=>site.close(ok));
  if(temp)await rm(temp,{recursive:true,force:true,maxRetries:5,retryDelay:200});
 }
});
