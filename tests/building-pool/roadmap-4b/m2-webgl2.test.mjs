// Builder 4B: independent 30-frame GENUINE Chromium WebGL2 cube-proxy audit.
// Runs only inside the 4B native suite, using a headless browser and the real
// committed M2 source. Never interprets cube proxies as final physical-family meshes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import {createServer} from 'node:http';
import {join,resolve,extname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {setTimeout as sleep} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
import {M2_HEALING_LIBRARY} from '../../../src/building-pool/roadmap-4b/m2-healing-library.mjs';

const root=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
const viewports=[[667,375],[844,390],[932,430]];
const output=resolve(root,'artifacts/building-pool/roadmap-4b/m2-webgl2-cube-proxy');
const MIME={'.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8'};
function launchServer(){
  const server=createServer((req,res)=>{
    try {
      const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
      if(!path.startsWith(root+'/')||!existsSync(path)){res.writeHead(404);res.end('not found');return;}
      res.setHeader('Content-Type',MIME[extname(path)]||'application/octet-stream');
      res.end(readFileSync(path));
    }catch(e){res.writeHead(500);res.end(String(e));}
  });
  return new Promise((resolve,reject)=>{
    server.once('error',reject);
    server.listen(0,'127.0.0.1',()=>resolve({server,url:'http://127.0.0.1:'+server.address().port}));
  });
}
async function launchChrome(){
  const binary=[
    process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable',
    '/usr/bin/chromium','/usr/bin/chromium-browser'
  ].find(x=>x&&existsSync(x));
  if(!binary)throw Error('real Chromium binary unavailable; cannot pass M2 renderer acceptance');
  const dir=mkdtempSync(join(tmpdir(),'mythwrought-4b-real-gl-'));
  const child=spawn(binary,[
    '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox',
    '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
    '--enable-webgl','--ignore-gpu-blocklist','--remote-allow-origins=*',
    '--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'
  ],{stdio:'ignore'});
  let port;
  for(let i=0;i<140;i++){
    if(existsSync(join(dir,'DevToolsActivePort'))){
      port=Number(readFileSync(join(dir,'DevToolsActivePort'),'utf8').split('\n')[0]);break;
    }
    if(child.exitCode!==null)break;
    await sleep(100);
  }
  if(!port){child.kill();rmSync(dir,{recursive:true,force:true});
    throw Error('Chromium did not expose a DevTools port (no simulated browser fallback)');}
  const version=await (await fetch('http://127.0.0.1:'+port+'/json/version')).json();
  const ws=new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((ok,bad)=>{
    ws.addEventListener('open',ok,{once:true});
    ws.addEventListener('error',bad,{once:true});
  });
  let next=0;
  const pending=new Map();
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id)return;
    const p=pending.get(msg.id);if(!p)return;
    pending.delete(msg.id);
    msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);
  });
  const send=(method,params={},sessionId)=>new Promise((ok,bad)=>{
    const id=++next;pending.set(id,{resolve:ok,reject:bad});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  return {send,close:()=>{ws.close();child.kill();rmSync(dir,{recursive:true,force:true});},binary};
}
async function waitPreview(cmd,where,expected){
  let last;
  for(let i=0;i<100;i++){
    const a=await cmd('Runtime.evaluate',{expression:'JSON.stringify(window.__m2Preview || null)',returnByValue:true});
    const str=a?.result?.value;
    if(str&&str!=='null'){
      const v=JSON.parse(str);if(v.ready&&v.sourceId===expected.id&&v.view===expected.view&&v.width===expected.width&&v.height===expected.height)return v;
    }
    if(a?.exceptionDetails)last=a.exceptionDetails.text;
    await sleep(100);
  }
  throw Error('No complete source-specific WebGL2 frame at '+where+(last?' — '+last:''));
}
test('five 4B-owned blueprints × exterior/section × three real Chromium landscape sizes', {timeout:240000},async()=>{
  assert.equal(M2_HEALING_LIBRARY.length,16);
  assert.equal(typeof WebSocket,'function','Node 22 CDP WebSocket is required');
  const site=await launchServer();
  let browser;
  const captures=[];
  const source=readFileSync(resolve(root,'src/building-pool/roadmap-4b/m2-healing-library.mjs'));
  const sourceSha256=createHash('sha256').update(source).digest('hex');
  mkdirSync(output,{recursive:true});
  try{
    browser=await launchChrome();
    const {targetId}=await browser.send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await browser.send('Target.attachToTarget',{targetId,flatten:true});
    const cmd=(method,params)=>browser.send(method,params,sessionId);
    await cmd('Page.enable');await cmd('Runtime.enable');
    for(const [width,height] of viewports){
      await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      for(let i=0;i<M2_HEALING_LIBRARY.length;i++){
        for(const view of ['exterior','section']){
          const b=M2_HEALING_LIBRARY[i];
          const url=site.url+'/tests/building-pool/roadmap-4b/m2-preview.html?index='+i+'&view='+view;
          const navigation=await cmd('Page.navigate',{url});
          assert.ok(!navigation.errorText,JSON.stringify(navigation));
          const evidence=await waitPreview(cmd,b.id+' '+view+' '+width+'x'+height,{id:b.id,view,width,height});
          assert.deepEqual([evidence.width,evidence.height],[width,height]);
          assert.equal(evidence.sourceId,b.id);
          assert.equal(evidence.renderer,'genuine-webgl2-cube-proxy');
          assert.equal(evidence.glError,0);
          assert.equal(evidence.contextLost,false);
          assert.equal(evidence.notPhysical,true);
          assert.equal(evidence.drawCalls,1);
          assert.ok(evidence.triangles>300);
          assert.ok(evidence.cells>100);
          assert.equal(evidence.roomCount,b.spaces.length);
          const {data}=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
          const png=Buffer.from(data,'base64');
          assert.ok(png.length>1000,'empty/blank screenshot payload');
          assert.equal(png.subarray(1,4).toString('ascii'),'PNG');
          assert.equal(png.readUInt32BE(16),width);
          assert.equal(png.readUInt32BE(20),height);
          const name=i+'-'+b.type+'-'+view+'-'+width+'x'+height+'.png';
          writeFileSync(join(output,name),png);
          captures.push({...evidence,png:name,byteCount:png.length});
        }
      }
    }
    await browser.send('Target.closeTarget',{targetId});
  }finally{
    if(browser)browser.close();
    await new Promise(done=>site.server.close(done));
  }
  assert.equal(captures.length,96);
  writeFileSync(join(output,'results.json'),JSON.stringify({
    exactSourceSHA256:sourceSha256,
    previewCategory:'Chromium WebGL2 with cube proxies, not actual physical manual pack meshes',
    physicalFamilyRendering:false,liveGameplay:false,physicalIphone:false,
    dimensions:viewports,views:['exterior','section'],captureCount:captures.length,captures
  },null,2)+'\n');
  console.log('4B M2: 96/96 real Chromium WebGL2 cube-proxy captures, no GL errors; source SHA256 '+sourceSha256);
  console.log('4B M2 diagnostic artifact: '+output);
});
