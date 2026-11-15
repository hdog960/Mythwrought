// Builder 3B lane-specific genuine Chromium/WebGL2 diagnostic screenshot acceptance.
// This captures ORIGINAL authored lumberyard/mill coordinates as cube envelopes only.
// No manual-pack physical shape approval, gameplay, save, or iPhone evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {access, mkdtemp, readFile, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep,extname} from 'node:path';

const root=resolve('.');
const viewports=[[667,375],[844,390],[932,430]];
const types=['lumberyard','mill'];
const views=['exterior','cutaway'];
const output=resolve('artifacts/building-roadmap-3b-m2/chromium-webgl2-industry');
const delay=ms=>new Promise(r=>setTimeout(r,ms));

async function findChrome(){
 const candidates=[process.env.MYTHWROUGHT_CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
 for(const p of candidates)try{await access(p);return p;}catch{}
 throw new Error('No Chrome/Chromium executable available for genuine 3B screenshot acceptance');
}
function server(){
 return createServer(async (req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const dest=resolve(root,'.'+pathname);
   if(!(dest===root||dest.startsWith(root+sep)))throw Error('Out-of-root browser request');
   const file=await readFile(dest);
   res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'}[extname(dest)]||'application/octet-stream'));
   res.end(file);
  }catch(e){res.writeHead(404);res.end('Not found');}
 });
}
async function createCDP(port){
 const response=await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'});
 if(!response.ok)throw Error('Chrome page creation failed '+response.status);
 const target=await response.json(),socket=new WebSocket(target.webSocketDebuggerUrl),pending=new Map();
 let serial=0;
 socket.onmessage=event=>{
  const msg=JSON.parse(event.data),p=pending.get(msg.id);
  if(p){pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}
 };
 const connected=new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 await connected;
 return {
  send(method,params={}){
   const id=++serial;
   return new Promise((resolve,reject)=>{
    pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
   });
  },
  close(){socket.close();}
 };
}
async function evaluate(cdp,expression){
 const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('Chromium runtime error '+JSON.stringify(r.exceptionDetails).slice(0,1200));
 return r.result?.value;
}
async function awaitUI(cdp){
 for(let i=0;i<150;i++){
  const info=await evaluate(cdp,'document.getElementById("details")?.textContent||""');
  if(typeof info==='string'&&info.includes('WebGL2 active'))return;
  if(typeof info==='string'&&info.includes('unavailable'))throw Error(info);
  await delay(100);
 }
 throw Error('3B source WebGL2 preview did not initialize');
}
function expressionFor(type,view){
 return '(()=>{const desired='+JSON.stringify({type,view})+';'
  +'for(const [key,value] of Object.entries(desired)){const element=document.getElementById(key);'
  +'if(!element||![...element.options].some(o=>o.value===value))throw Error("Missing 3B selector "+key+":"+value);'
  +'element.value=value;}'
  +'document.getElementById("view").dispatchEvent(new Event("change",{bubbles:true}));'
  +'const canvas=document.getElementById("render"),gl=canvas?.getContext("webgl2");'
  +'if(!gl)return {webgl2:false};gl.finish();'
  +'const pixels=new Uint8Array(canvas.width*canvas.height*4);'
  +'gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);'
  +'let foreground=0;for(let i=0;i<pixels.length;i+=128)'
  +'if(Math.abs(pixels[i]-18)>17||Math.abs(pixels[i+1]-28)>17||Math.abs(pixels[i+2]-41)>17)foreground++;'
  +'return {webgl2:true,details:document.getElementById("details").textContent,'
  +'foreground,gpuError:gl.getError(),canvasWidth:canvas.width,canvasHeight:canvas.height,'
  +'innerWidth:innerWidth,innerHeight:innerHeight};})()';
}

test('M2 captures 12 actual 3B source WebGL2 cube-diagnostic lumberyard/mill exteriors/cutaways', {timeout:240000}, async()=>{
 let chrome,cdp,site,temp;
 const reports=[];
 try{
  const executable=await findChrome();
  site=server();await new Promise(resolve=>site.listen(0,'127.0.0.1',resolve));
  temp=await mkdtemp(join(tmpdir(),'mythwrought-3b-cdp-'));
  chrome=spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
   '--remote-debugging-port=0','--user-data-dir='+temp,'about:blank'],{stdio:'ignore'});
  let debugPort=null;
  for(let i=0;i<150;i++){
   try{debugPort=(await readFile(join(temp,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}
   catch{if(chrome.exitCode!==null)throw Error('Chromium exited before CDP');await delay(100);}
  }
  assert.ok(debugPort,'Chromium CDP port missing');
  cdp=await createCDP(debugPort);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  const pageUrl='http://127.0.0.1:'+site.address().port+'/tests/building-pool/roadmap-3b/m2-preview.html';
  await mkdir(output,{recursive:true});
  for(const [width,height] of viewports){
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
   await cdp.send('Page.navigate',{url:pageUrl});
   await awaitUI(cdp);
   for(const type of types)for(const view of views){
    const expectedId='r3:'+type+':temperate:small:1';
    const data=await evaluate(cdp,expressionFor(type,view));
    assert.ok(data.webgl2,'Browser WebGL2 unavailable '+expectedId);
    assert.ok(data.details.includes(expectedId),expectedId+' wrong source blueprint');
    assert.ok(data.details.includes('WebGL2 active · '+view),expectedId+' wrong view');
    assert.equal(data.gpuError,0,expectedId+' GL error');
    assert.ok(data.foreground>20,expectedId+' blank render');
    assert.equal(data.innerWidth,width,'wrong viewport width');
    assert.equal(data.innerHeight,height,'wrong viewport height');
    assert.ok(data.canvasWidth>100&&data.canvasHeight>100,'invalid target canvas');
    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
    const png=Buffer.from(shot.data,'base64');
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','invalid PNG screenshot');
    assert.ok(png.length>2048,'empty screenshot');
    const filename=type+'-temperate-small-'+view+'-'+width+'x'+height+'.png';
    await writeFile(join(output,filename),png);
    reports.push({id:expectedId,type,biome:'temperate',size:'small',view,viewport:[width,height],filename,
     renderer:'CHROMIUM_WEBGL2_DIAGNOSTIC_CUBE_ENVELOPES',foreground:data.foreground,
     gpuError:data.gpuError,pngBytes:png.length});
   }
  }
  assert.equal(reports.length,12,'12 distinct Chromium M2 industry source views required');
  assert.equal(new Set(reports.map(r=>r.filename)).size,90);
  const summary={source:'Builder 3B authored lumberyard and mill coordinates',renderer:'CHROMIUM_WEBGL2_DIAGNOSTIC_CUBE_ENVELOPES',
   physicalFamilyShapesRendered:false,creatorArtApproved:false,physicalIPhoneTested:false,
   count:reports.length,reports};
  await writeFile(join(output,'acceptance.json'),JSON.stringify(summary,null,2)+'\n');
  console.log('MYTHWROUGHT_3B_M2_CHROMIUM_DIAGNOSTIC=12/12 ('+viewports.map(v=>v.join('x')).join(', ')+')');
 }finally{
  if(cdp)cdp.close();
  if(chrome){chrome.kill('SIGTERM');await Promise.race([new Promise(r=>chrome.once('close',r)),delay(2500)]);}
  if(site)await new Promise(resolve=>site.close(resolve));
  if(temp)await rm(temp,{recursive:true,force:true,maxRetries:5,retryDelay:200});
 }
});
