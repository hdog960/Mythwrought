// Builder 3A only: exact checked-out source-driven Chromium software-WebGL2 evidence.
// Uses about:blank injection of unmodified module bodies (only imports/exports wrapped).
// Emits actual CDP screenshot PNGs; never substitutes native camera projections.
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const ROOT=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
function chromeBinary(){
 for(const cmd of [process.env.CHROME_BIN,process.env.CHROMIUM_BIN,'google-chrome','google-chrome-stable','chromium','chromium-browser']){
  if(!cmd)continue;
  const r=spawnSync(cmd,['--version'],{encoding:'utf8',timeout:7000});
  if(!r.error&&r.status===0)return cmd;
 }
 throw Error('Real Chromium unavailable: cannot claim source-driven WebGL2 evidence');
}
function source(path,before,after){
 const input=readFileSync(join(ROOT,path),'utf8');
 const js=input.replace(/^import\s+.*?;\s*$/gm,'').replace(/\bexport\s+(?=const\b|function\b|class\b|let\b)/g,'');
 return {sha:hash(input),script:'(()=>{'+before+'\n'+js+'\n'+after+'\n})()'};
}
function bundle(){
 const p='src/building-pool/roadmap-3a/',t='tests/building-pool/roadmap-3a/';
 const list=[
  [p+'roster.mjs','','globalThis.R={BIOMES,SIZES,slotId,assertSlot}'],
  [p+'contract.mjs','const {assertSlot,slotId}=globalThis.R;','globalThis.C={validateBlueprint}'],
  [p+'m4-mining-fourth-variants.mjs','const {BIOMES,SIZES,slotId}=globalThis.R;const {validateBlueprint}=globalThis.C;','globalThis.B={createM4MiningFourthVariant}'],
  [t+'preview-mesh.mjs','','globalThis.M={createPreviewMesh}'],
  [t+'preview-camera.mjs','','globalThis.A={fitPreviewCamera}'],
  [t+'preview-m4-fourth-mesh.mjs','const {createPreviewMesh}=globalThis.M;','globalThis.F={createM4MiningFourthPreviewMesh}'],
  [t+'preview-m4-fourth.mjs','const {createM4MiningFourthVariant}=globalThis.B;const {createM4MiningFourthPreviewMesh}=globalThis.F;const {fitPreviewCamera}=globalThis.A;','globalThis.V={ok:true}']
 ];
 const objs=list.map(a=>source(...a));
 const html=readFileSync(join(ROOT,t+'preview-m4-fourth.html'),'utf8').replace(/<script\s+type="module"\s+src="\.\/preview-m4-fourth\.mjs"><\/script>/,'');
 return {html,scripts:objs.map(o=>o.script),sourceSHA:Object.fromEntries(list.map((a,i)=>[a[0],objs[i].sha]))};
}
async function launchChrome(){
 const chrome=chromeBinary(),profile=mkdtempSync(join(tmpdir(),'r3a-cdp-'));
 const child=spawn(chrome,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage',
  '--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--remote-allow-origins=*','--no-first-run',
  '--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'
 ],{stdio:['ignore','ignore','pipe']});
 let err='';child.stderr.on('data',c=>{err+=c.toString();if(err.length>12000)err=err.slice(-12000)});
 let wsUrl;
 try{
  for(let i=0;i<100;i++){
   if(child.exitCode!==null)throw Error('Chrome exited: '+err.slice(-1500));
   const m=err.match(/DevTools listening on (ws:\/\/[^\s]+)/);
   if(m){
    const origin=m[1].replace('ws://','http://').replace(/\/devtools\/browser\/.*/, '');
    try{
     const r=await fetch(origin+'/json/list',{signal:AbortSignal.timeout(1000)});
     if(r.ok){const tabs=await r.json();wsUrl=tabs.find(x=>x.type==='page')?.webSocketDebuggerUrl;if(wsUrl)break;}
    }catch{}
   }
   await sleep(125);
  }
  if(!wsUrl)throw Error('No Chromium debugging page target '+err.slice(-1200));
  const ws=new WebSocket(wsUrl);
  await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad});
  let seq=0;const pending=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){
   const p=pending.get(m.id);pending.delete(m.id);m.error?p.bad(Error(JSON.stringify(m.error))):p.ok(m.result);
  }};
  const call=(method,params={})=>new Promise((ok,bad)=>{
   const id=++seq;pending.set(id,{ok,bad});ws.send(JSON.stringify({id,method,params}));
  });
  return {call,chrome,close:async()=>{
   try{ws.close()}catch{}child.kill();
   await sleep(800);if(child.exitCode===null)child.kill('SIGKILL');
   try{rmSync(profile,{recursive:true,force:true,maxRetries:6,retryDelay:100})}catch{}
  }};
 }catch(e){child.kill('SIGKILL');throw e}
}
async function evaluate(call,expression){
 const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('Chromium source JS failed: '+(r.exceptionDetails.exception?.description||r.exceptionDetails.text));
 return r.result?.value;
}
export async function captureMiningFourth(){
 const b=bundle(),browser=await launchChrome();
 const output=resolve('artifacts/building-roadmap-3a-m4-fourth-chromium');
 mkdirSync(output,{recursive:true});const records=[];
 try{
  await browser.call('Page.enable');await browser.call('Runtime.enable');
  await evaluate(browser.call,'document.open();document.write('+JSON.stringify(b.html)+');document.close();');
  for(const script of b.scripts)await evaluate(browser.call,script);
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
   await browser.call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
   for(const type of ['mining-workshop'])
    for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
     for(const size of ['small','medium','large'])
      for(const view of ['exterior','cutaway']){
       const vals={type,biome,size,view};
       const expr='(()=>{Object.entries('+JSON.stringify(vals)+').forEach(([k,v])=>document.getElementById(k).value=v);'
       +'document.getElementById("view").dispatchEvent(new Event("change"));'
       +'const c=document.getElementById("render"),gl=c.getContext("webgl2");'
       +'if(!gl)return {webgl2:false};gl.finish();'
       +'const p=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,p);'
       +'let fg=0;for(let i=0;i<p.length;i+=128)if(Math.abs(p[i]-18)>17||Math.abs(p[i+1]-28)>17||Math.abs(p[i+2]-41)>17)fg++;'
       +'return {webgl2:true,foreground:fg,error:gl.getError(),details:document.getElementById("details").textContent,'
       +'viewport:[innerWidth,innerHeight],canvas:[c.width,c.height]}})()';
       const e=await evaluate(browser.call,expr);
       const id='r3a:'+type+':'+biome+':'+size+':4';
       if(!e||!e.webgl2||e.error!==0||e.foreground<20||
          !e.details.includes(id)||!e.details.includes('WebGL2 active · '+view)||
          e.viewport[0]!==width||e.viewport[1]!==height)
        throw Error('Not a genuine source-driven nonblank WebGL2 render: '+JSON.stringify({id,view,e}));
       const response=await browser.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
       const img=Buffer.from(response.data||'','base64');
       if(img.length<1500||img.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')
        throw Error('Invalid Chromium PNG '+id+' '+view);
       const name=type+'-'+biome+'-'+size+'-'+view+'-'+width+'x'+height+'.png';
       writeFileSync(join(output,name),img);
       records.push({name,id,view,width,height,foreground:e.foreground,canvas:e.canvas,sha256:hash(img)});
      }
  }
  if(records.length!==90)throw Error('Only '+records.length+' of 90 genuine WebGL2 source views');
  const manifest={schema:'mythwrought.builder3a.m4.fourth.chromium.real.v1',
   commit:process.env.GITHUB_SHA||null,chrome:browser.chrome,sourceSHA:b.sourceSHA,
   sourceInjection:'about:blank, exact module bodies with import/export wrapper only',
   nonBlank:true,zeroGLErrors:true,webgl2:true,diagnosticCubesNotPackShapes:true,
   productionIntegrated:false,physicalIPhoneTested:false,count:records.length,records};
  writeFileSync(join(output,'CAPTURE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('REAL SOURCE CHROMIUM M4 MINING FOURTH 90/90 nonblank/WebGL2/zero GL errors; source hashes recorded');
  return manifest;
 }finally{await browser.close()}
}
