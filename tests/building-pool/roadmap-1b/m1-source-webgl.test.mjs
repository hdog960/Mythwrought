// Genuine Chromium WebGL2 source-module proof, no Playwright dependency or CI workflow changes.
// GitHub Ubuntu system Chrome is exercised directly through Node's built-in CDP WebSocket.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile,rm,mkdtemp,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';

const wait=ms=>new Promise(r=>setTimeout(r,ms));
const root=process.cwd();
const ids=[
 'r1:stable:temperate:small:001',
 'r1:bathhouse:temperate:small:001',
 'r1:farm-barn:temperate:small:001',
 'r1:greenhouse:enchanted-forest:small:001',
 'r1:fishing-lodge:temperate:small:001',
 'r1:harbor-office:temperate:small:001',
 'r1:lighthouse:mountain:small:001',
 'r1:bathhouse:desert:medium:001',
 'r1:stable:snow:medium:004',
 'r1:farm-barn:mountain:medium:001',
 'r1:greenhouse:mountain:large:001',
 'r1:fishing-lodge:desert:medium:001',
 'r1:harbor-office:enchanted-forest:medium:001',
 'r1:lighthouse:snow:medium:001',
 'r1:bathhouse:snow:small:001',
 'r1:bathhouse:enchanted-forest:medium:001',
 'r1:bathhouse:mountain:large:001',
 'r1:stable:desert:small:004',
 'r1:stable:mountain:large:004',
 'r1:stable:enchanted-forest:small:004',
 'r1:farm-barn:desert:large:001',
 'r1:farm-barn:snow:small:001',
 'r1:farm-barn:enchanted-forest:medium:001',
 'r1:bathhouse:temperate:medium:001',
 'r1:bathhouse:desert:small:001',
 'r1:bathhouse:snow:medium:001',
 'r1:stable:temperate:large:004',
 'r1:stable:desert:large:004',
 'r1:stable:snow:small:004',
 'r1:farm-barn:temperate:medium:001',
 'r1:farm-barn:mountain:small:001',
 'r1:farm-barn:enchanted-forest:large:001',
 'r1:bathhouse:temperate:large:001',
 'r1:bathhouse:desert:large:001',
 'r1:bathhouse:snow:large:001',
 'r1:stable:temperate:medium:004',
 'r1:stable:snow:large:004',
 'r1:stable:enchanted-forest:medium:004',
 'r1:farm-barn:temperate:large:001',
 'r1:farm-barn:desert:medium:001',
 'r1:farm-barn:snow:medium:001',
 'r1:bathhouse:enchanted-forest:small:001',
 'r1:bathhouse:enchanted-forest:large:001',
 'r1:bathhouse:mountain:small:001',
 'r1:stable:temperate:small:004',
 'r1:stable:desert:medium:004',
 'r1:stable:mountain:small:004',
 'r1:farm-barn:desert:small:001',
 'r1:farm-barn:snow:large:001',
 'r1:farm-barn:enchanted-forest:small:001',
 'r1:greenhouse:temperate:medium:001',
 'r1:greenhouse:desert:large:001',
 'r1:greenhouse:snow:small:001',
 'r1:fishing-lodge:temperate:large:001',
 'r1:fishing-lodge:mountain:medium:001',
 'r1:harbor-office:desert:small:001',
 'r1:harbor-office:snow:large:001',
 'r1:lighthouse:temperate:medium:001',
 'r1:lighthouse:enchanted-forest:large:001',
 'r1:greenhouse:mountain:medium:001',
 'r1:greenhouse:enchanted-forest:large:001',
 'r1:greenhouse:snow:large:001',
 'r1:fishing-lodge:snow:medium:001',
 'r1:fishing-lodge:enchanted-forest:medium:001',
 'r1:harbor-office:temperate:large:001',
 'r1:harbor-office:mountain:medium:001',
 'r1:lighthouse:desert:large:001',
 'r1:lighthouse:snow:large:001',
 'r1:greenhouse:temperate:large:001',
 'r1:greenhouse:desert:medium:001',
 'r1:greenhouse:mountain:small:001',
 'r1:fishing-lodge:desert:large:001',
 'r1:fishing-lodge:mountain:small:001',
 'r1:harbor-office:desert:large:001',
 'r1:harbor-office:enchanted-forest:large:001',
 'r1:lighthouse:temperate:small:001',
 'r1:lighthouse:mountain:large:001'
];
const sizes=[[667,375],[844,390],[932,430]];
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json'};
function bin(){
 for(const name of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){
  try{return execFileSync('which',[name],{encoding:'utf8',timeout:2000}).trim();}catch{}
 }
 throw Error('Genuine Chromium binary missing; dedicated 1B proof cannot pass');
}
async function localSite(){
 const missing=[];
 const server=createServer(async(req,res)=>{
  try{
   const uri=new URL(req.url,'http://127.0.0.1');
   // Chrome's default icon probe is harmless UI metadata, not a missing source module.
   if(uri.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
   const path=resolve(root,'.'+decodeURIComponent(uri.pathname));
   if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
   const data=await readFile(path);
   res.writeHead(200,{'Content-Type':mime[extname(path)]??'application/octet-stream','Cache-Control':'no-store'});
   res.end(data);
  }catch(e){missing.push(req.url);res.writeHead(404);res.end('Not found');}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 return {server,missing,port:server.address().port};
}
async function chromeStart(profile){
 const command=bin();
 let stderr='';
 const child=spawn(command,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
  '--disable-gpu-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--remote-debugging-port=0','--user-data-dir='+profile,
  '--no-first-run','--no-default-browser-check','about:blank'],{stdio:['ignore','ignore','pipe']});
 child.stderr.on('data',b=>{stderr=(stderr+String(b)).slice(-3000);});
 const probe=join(profile,'DevToolsActivePort');
 let url;
 for(let i=0;i<200;i++){
  if(child.exitCode!==null)throw Error('Chrome exited before CDP port: '+stderr);
  try{const [port,ws]=String(await readFile(probe,'utf8')).trim().split('\n');
   if(port&&ws){url='ws://127.0.0.1:'+port+ws;break;}
  }catch{}
  await wait(100);
 }
 if(!url){child.kill('SIGKILL');throw Error('No Chrome CDP port within 20s: '+stderr);}
 return {child,url};
}
async function makeCDP(url){
 const ws=new WebSocket(url),pending=new Map();let seq=0;const exceptions=[];
 await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail;});
 ws.onmessage=e=>{const m=JSON.parse(e.data);
  if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params?.exceptionDetails?.text??'Browser script exception');
  if(m.id&&pending.has(m.id)){const cb=pending.get(m.id);pending.delete(m.id);cb(m);}
 };
 function send(method,params={},sessionId=null){
  return new Promise((ok,fail)=>{
   const id=++seq,msg={id,method,params};if(sessionId)msg.sessionId=sessionId;
   const timeout=setTimeout(()=>{pending.delete(id);fail(Error('CDP timed out: '+method));},30000);
   pending.set(id,m=>{clearTimeout(timeout);m.error?fail(Error(method+': '+JSON.stringify(m.error))):ok(m.result);});
   ws.send(JSON.stringify(msg));
  });
 }
 return {send,exceptions,close:()=>ws.close()};
}
test('M1/M2 77 genuine source-served WebGL2 candidates × 3 iPhone landscapes × exterior/cutaway', {timeout:240000},async()=>{
 const profile=await mkdtemp(join(tmpdir(),'mythwrought-r1b-chrome-')),site=await localSite();
 const out=resolve(root,'artifacts/roadmap-1b');
 let chrome,cdp;
 try{
  await mkdir(out,{recursive:true});chrome=await chromeStart(profile);
  cdp=await makeCDP(chrome.url);
  const target=await cdp.send('Target.createTarget',{url:'about:blank'});
  const attachment=await cdp.send('Target.attachToTarget',{targetId:target.targetId,flatten:true});
  const session=attachment.sessionId;
  await cdp.send('Page.enable',{},session);await cdp.send('Runtime.enable',{},session);
  const evidence=[];
  for(const id of ids)for(const [width,height] of sizes)for(const view of ['exterior','cutaway']){
   await cdp.send('Emulation.setDeviceMetricsOverride',
    {width,height,deviceScaleFactor:1,mobile:false,screenWidth:width,screenHeight:height},session);
   const query=new URLSearchParams({candidate:id,view});
   await cdp.send('Page.navigate',{url:'http://127.0.0.1:'+site.port+
    '/tests/building-pool/roadmap-1b/m1-preview.html?'+query.toString()},session);
   let state;
   for(let attempt=0;attempt<150;attempt++){
    const v=await cdp.send('Runtime.evaluate',{expression:'JSON.stringify(window.__M1_PREVIEW||null)',
     returnByValue:true,awaitPromise:false},session);
    const raw=v.result?.value;
    if(raw&&raw!=='null'){
     state=JSON.parse(raw);
     if(state.ready)break;
    }
    await wait(80);
   }
   assert.ok(state?.ready,'Missing executed candidate JS module: '+id+' '+view+' '+width+'x'+height);
   assert.equal(state.webgl2,true,'Actual WebGL2 context missing');
   assert.equal(state.id,id);assert.equal(state.view,view);
   assert.deepEqual(state.viewport,[width,height]);
   assert.equal(state.glError,0);
   assert.ok(state.sourceCells>300&&state.proxyCells>100&&state.triangles>500,'Candidate geometry missing');
   if(id==='r1:lighthouse:mountain:large:001'){
    assert.ok(Number.isFinite(state.hornGapPx)&&state.hornGapPx>=9.5,
     'Highcairn genuine projected horn silhouette overlap at '+width+'x'+height+' '+view+': '+state.hornGapPx+'px');
   }
   const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},session);
   const png=Buffer.from(shot.data,'base64');
   assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Not an authentic Chrome PNG');
   assert.equal(png.readUInt32BE(16),width,'PNG viewport width mismatch');
   assert.equal(png.readUInt32BE(20),height,'PNG viewport height mismatch');
   assert.ok(png.length>2000,'Empty actual screenshot');
   const file=id.replaceAll(':','-')+'-'+view+'-'+width+'x'+height+'.png';
   await writeFile(join(out,file),png);
   evidence.push({...state,file,sha256:createHash('sha256').update(png).digest('hex'),
    rendererCategory:'source-authored-full-cell-proxy',physicalIPhone:false,physicalFamilyMeshes:false});
  }
  assert.equal(evidence.length,462);
  assert.equal(site.missing.length,0,'Missing module responses: '+site.missing.join(';'));
  assert.deepEqual(cdp.exceptions,[],'Unexpected Chromium errors');
  for(const id of ids)for(const [width,height] of sizes){
   const pair=evidence.filter(e=>e.id===id&&e.viewport[0]===width&&e.viewport[1]===height);
   assert.equal(pair.length,2);
   assert.ok(pair[0].proxyCells>pair[1].proxyCells,'No source geometry removed for cutaway: '+id);
   assert.notEqual(pair[0].sha256,pair[1].sha256,'Exterior/cutaway screenshot indistinguishable: '+id);
  }
  await writeFile(join(out,'M1_WEBGL2_CAPTURE_MANIFEST.json'),
   JSON.stringify({schema:'mythwrought.builder-1b.browser-evidence.v1',candidates:ids.length,
    viewportSizes:sizes,views:['exterior','cutaway'],captures:evidence.length,
    physicalIPhone:false,physicalFamilyMeshes:false,source:'real 1B ES module coordinates in Chromium WebGL2',
    notes:'Proxy cube faces; cannot certify real Pack 4/5 parts, gameplay movement, or creator art.',
    evidence},null,2));
  console.log('BUILDER 1B genuine source WebGL2 exterior+cutaway 462/462 PASS',
   JSON.stringify({candidates:ids.length,viewports:sizes,captures:evidence.length}));
 }finally{
  try{cdp?.close();}catch{}
  // Chromium can still be writing its user profile after the final screenshot.
  // Await the actual Chrome child exit BEFORE removing the profile; a bare
  // SIGKILL followed by immediate rm races and intermittently throws ENOTEMPTY.
  const child=chrome?.child;
  if(child&&child.exitCode===null&&child.signalCode===null){
   const exited=new Promise(resolve=>child.once('exit',resolve));
   child.kill('SIGKILL');
   await exited;
  }
  await new Promise(resolve=>site.server.close(resolve));
  // Node's recursive fs.rm retries ENOTEMPTY/EBUSY from Chromium's short-lived
  // helper processes. This is cleanup only; screenshot assertions still fail closed.
  await rm(profile,{recursive:true,force:true,maxRetries:12,retryDelay:150});
 }
});
