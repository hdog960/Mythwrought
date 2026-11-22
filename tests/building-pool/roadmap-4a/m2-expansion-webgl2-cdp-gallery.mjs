// Builder 4A — real isolated source-driven Chromium WebGL2 diagnostic gallery.
// CDP uses Node's native WebSocket, so focused CI needs no shared workflow edits.
// WebGL2 candidate/proxy screenshot proof IS NOT live physical-family rendering.
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
const SOURCE=join(ROOT,'src/building-pool/roadmap-4a');
const TESTS=join(ROOT,'tests/building-pool/roadmap-4a');
const OUT=join(ROOT,'artifacts/r4a-m2-expansion-webgl2-genuine');
const DESIGNS=[
  {
    "type": "civic-hall",
    "biome": "temperate",
    "size": "medium",
    "variant": 2
  },
  {
    "type": "civic-hall",
    "biome": "snow",
    "size": "small",
    "variant": 2
  },
  {
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2
  },
  {
    "type": "guildhall",
    "biome": "temperate",
    "size": "medium",
    "variant": 1
  },
  {
    "type": "guildhall",
    "biome": "snow",
    "size": "medium",
    "variant": 1
  },
  {
    "type": "guildhall",
    "biome": "mountain",
    "size": "medium",
    "variant": 1
  }
];
const VIEWPORTS=[[667,375],[844,390],[932,430]];
const EXPECTED_VIEWS=36;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function gitBlob(bytes){
 return createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
}
function bundle(){
 const schema=readFileSync(join(SOURCE,'schema.mjs'),'utf8');
 const blueprint=readFileSync(join(SOURCE,'m2-expansion.mjs'));
 const shapes=readFileSync(join(SOURCE,'m1-preview-shapes.mjs'),'utf8');
 const render=readFileSync(join(TESTS,'m2-expansion-webgl2-preview.mjs'),'utf8');
 let html=readFileSync(join(TESTS,'m2-expansion-webgl2-preview.html'),'utf8');
 if(gitBlob(blueprint)!=='07e37a38b87caf4173eb72bda40c824b0e5b104f')
   throw Error('M2 authored source differs from exact original authored SHA');
 const importBlueprint="import {SCHEMA,validateBlueprint} from './schema.mjs';";
 const importRender="import {buildM2Expansion} from '../../../src/building-pool/roadmap-4a/m2-expansion.mjs';";
 const importShapes="import {candidatePreviewShape,candidateBatchedPreviewBudget} from '../../../src/building-pool/roadmap-4a/m1-preview-shapes.mjs';";
 for(const [part,needle] of [[blueprint.toString(),importBlueprint],[render,importRender],[render,importShapes]]){
   if(!part.includes(needle))throw Error('Gallery source import not exact PR-head owned module: '+needle);
 }
 const code=[
  schema.replace(/\bexport (const|function) /g,'$1 '),
  blueprint.toString().replace(importBlueprint,'').replace(/export (function|const) /g,'$1 '),
  shapes.replace(/export function /g,'function '),
  render.replace(/^import .*?;\n/gm,'').replace('new URLSearchParams(location.search)',
        'new URLSearchParams(window.__roadmap4aM2ExpansionQuery)')
 ].join('\n');
 if(/(^|\n)\s*(?:import|export)\s/m.test(code))throw Error('Browser source bundle contains unhandled module syntax');
 const scriptTag='<script type="module" src="./m2-expansion-webgl2-preview.mjs"></script>';
 if(!html.includes(scriptTag))throw Error('Preview HTML no longer matches source');
 html=html.replace(scriptTag,'');
 return {html,code,sourceBundleSha256:createHash('sha256').update(code).digest('hex'),
  authoredGeneratorGitBlob:gitBlob(blueprint)};
}
function findBinary(list){
 for(const path of list)if(existsSync(path))return path;
 for(const name of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){
  const w=spawnSync('which',[name],{encoding:'utf8'});
  if(w.status===0&&w.stdout.trim())return w.stdout.trim();
 }
 throw Error('No genuine Chromium/Chrome executable on verification host');
}
class CDP {
 constructor(socket){this.socket=socket;this.counter=0;this.pending=new Map();
  socket.addEventListener('message',event=>{
   const msg=JSON.parse(event.data);if(!this.pending.has(msg.id))return;
   const p=this.pending.get(msg.id);this.pending.delete(msg.id);clearTimeout(p.timer);
   msg.error?p.reject(Error('CDP '+p.method+': '+msg.error.message)):p.resolve(msg.result);
  });
  socket.addEventListener('close',()=>{
   for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(Error('Chromium CDP disconnected'));}
   this.pending.clear();
  });
 }
 send(method,params={},timeout=60000){
  return new Promise((resolve,reject)=>{
   const id=++this.counter;
   const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('CDP timeout: '+method));},timeout);
   this.pending.set(id,{resolve,reject,timer,method});
   try{this.socket.send(JSON.stringify({id,method,params}));}
   catch(e){clearTimeout(timer);this.pending.delete(id);reject(e);}
  });
 }
}
async function openCDP(port){
 const endpoint='http://127.0.0.1:'+port;
 let targets=await (await fetch(endpoint+'/json/list')).json();
 if(!targets.some(x=>x.type==='page')){
  const made=await (await fetch(endpoint+'/json/new?about:blank',{method:'PUT'})).json();
  targets.push(made);
 }
 const target=targets.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
 if(!target)throw Error('No attached Chromium page CDP target');
 const ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{
  ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});
 });
 const cdp=new CDP(ws);
 await cdp.send('Page.enable');await cdp.send('Runtime.enable');
 return {cdp,ws};
}
async function runWithBrowser(){
 const {html,code,sourceBundleSha256,authoredGeneratorGitBlob}=bundle();
 const profile=mkdtempSync(join(tmpdir(),'mythwrought-r4a-m2-expansion-webgl2-'));
 const shots=[];
 let xvfb=null,chrome=null,ws=null;
 try{
  let display=process.env.DISPLAY||'';
  if(!display){
   const displayNo=100+(process.pid%2000);
   display=':'+displayNo;
   xvfb=spawn(findBinary(['/usr/bin/Xvfb','/usr/local/bin/Xvfb']),
    [display,'-screen','0','1280x720x24','-nolisten','tcp','-ac'],
    {stdio:'ignore'});
   await pause(450);
   if(xvfb.exitCode!==null)throw Error('Xvfb display server exited before WebGL2 test');
  }
  const executable=findBinary(['/usr/bin/chromium','/usr/bin/google-chrome','/usr/bin/google-chrome-stable',
                                '/opt/google/chrome/chrome']);
  chrome=spawn(executable,[
   '--no-sandbox','--disable-gpu-sandbox','--no-first-run','--disable-dev-shm-usage',
   '--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+profile,
   '--enable-webgl','--use-gl=angle','--use-angle=gl','--ignore-gpu-blocklist',
   '--enable-unsafe-swiftshader','about:blank'
  ],{stdio:'ignore',env:{...process.env,DISPLAY:display,LIBGL_ALWAYS_SOFTWARE:'1'}});
  let port=0;
  for(let i=0;i<200;i++){
   if(chrome.exitCode!==null)throw Error('Chromium exited before remote debugging started');
   const active=join(profile,'DevToolsActivePort');
   if(existsSync(active)){port=Number(readFileSync(active,'utf8').split('\n')[0]);break;}
   await pause(80);
  }
  if(!port)throw Error('Chromium CDP port unavailable');
  const opened=await openCDP(port);
  ws=opened.ws;const cdp=opened.cdp;
  mkdirSync(OUT,{recursive:true});
  for(const [width,height] of VIEWPORTS){
   await cdp.send('Emulation.setDeviceMetricsOverride',
    {width,height,deviceScaleFactor:1,mobile:true});
   for(const {type,biome,size,variant} of DESIGNS)for(const cutaway of [false,true]){
    const floor=size==='large'?2:(type==='castle-palace'||size==='medium'?1:0);
    const query=new URLSearchParams({type,biome,size,variant:String(variant),cutaway:String(Number(cutaway)),floor:String(floor)}).toString();
    const setup='document.open();document.write('+JSON.stringify(html)+');document.close();window.__roadmap4aM2ExpansionQuery='+JSON.stringify(query)+';';
    const reset=await cdp.send('Runtime.evaluate',{expression:setup,returnByValue:true,awaitPromise:true});
    if(reset.exceptionDetails)throw Error('Document creation: '+reset.exceptionDetails.text);
    const expr='(()=>{\n'+code+'\nreturn window.__roadmap4aM2ExpansionWebgl2;\n})()';
    const run=await cdp.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true},90000);
    if(run.exceptionDetails)throw Error('Candidate source JavaScript: '+run.exceptionDetails.text+' '+JSON.stringify(run.exceptionDetails.exception||{}));
    const data=run.result?.value;
    const id='r4:'+type+':'+biome+':'+size+':'+String(variant).padStart(2,'0');
    if(!data?.webgl2||data.lost||data.error!==0||data.id!==id||data.drawCalls<1||
       data.drawnTriangles<=100||JSON.stringify(data.canvasSize)!==JSON.stringify([width,height]))
      throw Error('Wrong or missing WebGL2 candidate draw '+JSON.stringify({query,data}));
    const sync=await cdp.send('Runtime.evaluate',{expression:`(()=>{
      const gl=document.querySelector('#view').getContext('webgl2');
      gl.finish();
      const ext=gl.getExtension('WEBGL_debug_renderer_info');
      return {version:gl.getParameter(gl.VERSION),renderer:ext?
       gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
       error:gl.getError(),lost:gl.isContextLost()};
    })()`,returnByValue:true});
    const proof=sync.result?.value;
    if(sync.exceptionDetails||!proof?.version?.startsWith('WebGL 2.0')||proof.error!==0||proof.lost)
      throw Error('Real WebGL2 synchronization failed '+JSON.stringify({query,proof}));
    const shot=await cdp.send('Page.captureScreenshot',
      {format:'png',captureBeyondViewport:false,fromSurface:true});
    const png=Buffer.from(shot.data,'base64');
    if(png.length<2400||png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||
       png.readUInt32BE(16)!==width||png.readUInt32BE(20)!==height)
      throw Error('Bad/blank screenshot PNG '+JSON.stringify({query,length:png.length}));
    const name=[type,biome,size,width+'x'+height,cutaway?'cutaway':'exterior'].join('-')+'.png';
    writeFileSync(join(OUT,name),png);
    shots.push({name,id,viewport:[width,height],cutaway,floor,renderer:proof.renderer,
      drawnTriangles:data.drawnTriangles,drawCalls:data.drawCalls,
      submittedBufferBytes:data.submittedBufferBytes,
      proxyCells:data.unresolvedFullCellProxyCount,
      pngSha256:createHash('sha256').update(png).digest('hex')});
    if(shots.length%6===0)console.log('4A M2 expansion Chromium WebGL2 candidate captures',shots.length,'/ 36');
   }
  }
  const distinctScreens=new Set(shots.map(x=>x.pngSha256)).size;
  const evidence={sourceBundleSha256,authoredGeneratorGitBlob,rendererClass:'genuine Chromium WebGL2 candidate/proxy geometry',
    actualViews:shots.length,expectedViews:EXPECTED_VIEWS,distinctScreenHashes:distinctScreens,
    viewports:VIEWPORTS,allGLChecksPassed:true,glFinishUsed:true,zeroLostContexts:true,
    productionPhysicalFamilyRenderer:false,realIphoneTested:false,creatorArtApproved:false,
    integratedIntoGame:false,schema1SaveCompatibilityVerified:false,results:shots};
  writeFileSync(join(OUT,'results-all.json'),JSON.stringify(evidence,null,2)+'\n');
  if(shots.length!==EXPECTED_VIEWS||distinctScreens<35)
   throw Error('Incomplete/visually duplicated gallery: '+shots.length+' captures, '+distinctScreens+' distinct PNGs');
  return evidence;
 }finally{
  if(ws)ws.close();
  if(chrome){chrome.kill('SIGTERM');await pause(400);if(chrome.exitCode===null)chrome.kill('SIGKILL');}
  if(xvfb){xvfb.kill('SIGTERM');await pause(150);if(xvfb.exitCode===null)xvfb.kill('SIGKILL');}
  try{rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}catch{}
 }
}
export async function runGallery(){
 const evidence=await runWithBrowser();
 console.log('4A M2 expansion source-driven 36/36 WebGL2 gallery PASSED',
  JSON.stringify({sha256:evidence.sourceBundleSha256,screens:evidence.actualViews,
   distinct:evidence.distinctScreenHashes,renderer:evidence.results[0]?.renderer,
   maxDrawCalls:Math.max(...evidence.results.map(x=>x.drawCalls)),
   maxTriangles:Math.max(...evidence.results.map(x=>x.drawnTriangles))}));
 return evidence;
}
