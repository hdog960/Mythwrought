// Pack 2 M6: fail-closed authentic authored-mesh Chromium acceptance in GitHub CI.
// Only isolated candidate preview geometry; NOT live WebGL2, Safari or iPhone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {spawn,spawnSync} from 'node:child_process';
import {resolve,join,extname,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(import.meta.url),'../../../..');
const output=resolve('artifacts/pack2-authored-mesh');
const views=[[667,375],[844,390],[932,430]];
const allIDs=Array.from({length:18},(_,i)=>i+59);
function git(...args){const p=spawnSync('git',args,{cwd:root,encoding:'utf8'});
  assert.equal(p.status,0,'Git history required: '+args.join(' '));return p.stdout.trim();}
function browserBinary(){if(process.env.MYTHWROUGHT_PACK2_CHROMIUM)return process.env.MYTHWROUGHT_PACK2_CHROMIUM;
  for(const b of ['chromium','google-chrome','chromium-browser']){
    const p=spawnSync('which',[b],{encoding:'utf8'});if(p.status===0)return p.stdout.trim();}
  throw Error('No preinstalled Chromium on GitHub-hosted runner');}
async function until(fn,label){for(let i=0;i<180;i++){
  try{const x=await fn();if(x)return x}catch{} await delay(75);}throw Error('Timed out: '+label);}
function server(){const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript'};
  return createServer(async(req,res)=>{try{
    const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
    const type=mime[extname(path)];if(!type||!path.startsWith(root+sep))throw Error('not a source file');
    res.writeHead(200,{'content-type':type,'cache-control':'no-store'});res.end(await readFile(path));
  }catch{res.writeHead(404);res.end('not found');}});}
class ChromeProtocol{
  constructor(url){this.ws=new WebSocket(url);this.id=0;this.pending=new Map();this.exceptions=[];
    this.ws.addEventListener('message',event=>{const msg=JSON.parse(event.data);
      if(msg.id){const call=this.pending.get(msg.id);if(call){this.pending.delete(msg.id);
        msg.error?call.reject(Error(JSON.stringify(msg.error))):call.resolve(msg.result);}}
      else if(msg.method==='Runtime.exceptionThrown')this.exceptions.push(msg.params.exceptionDetails.text);
    });}
  async open(){await until(()=>this.ws.readyState===WebSocket.OPEN,'CDP WebSocket');}
  send(method,params={}){const id=++this.id;return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('CDP timeout: '+method));},15000);
    this.pending.set(id,{resolve:x=>{clearTimeout(timer);resolve(x)},reject:e=>{clearTimeout(timer);reject(e)}});
    this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(expression){const x=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(x.exceptionDetails)throw Error('Candidate JS exception: '+JSON.stringify(x.exceptionDetails));
    return x.result.value;}
  close(){this.ws.close();}
}
async function screenshot(c,name){
  const r=await c.eval("(() => {const p=document.querySelector('#preview').getBoundingClientRect();return {x:p.x,y:p.y,width:p.width,height:p.height}})()");
  assert.ok(r.width>250&&r.height>100,'responsive canvas must be visible');
  const image=await c.send('Page.captureScreenshot',{format:'png',fromSurface:true,
    captureBeyondViewport:true,clip:{...r,scale:1}});
  const png=Buffer.from(image.data,'base64');assert.ok(png.length>700,'empty screenshot');
  await writeFile(join(output,name),png);
}
async function choose(c,id){return c.eval("(() => {const e=document.querySelector('#asset');e.value='"+id+"';"+
  "e.dispatchEvent(new Event('change'));const s=window.pack2Fixture.selection();"+
  "const pixels=document.querySelector('#preview').getContext('2d').getImageData(230,90,430,230).data;"+
  "let hash=2166136261,painted=0,translucent=0;for(let i=0;i<pixels.length;i+=4){"+
  "if(pixels[i+3]>5)painted++;if(pixels[i+3]>5&&pixels[i+3]<250)translucent++;"+
  "for(let k=0;k<4;k++)hash=Math.imul(hash^pixels[i+k],16777619)}"+
  "return {id:s.id,painted,translucent,hash:hash>>>0,overflow:document.documentElement.scrollWidth-innerWidth}})()");}
async function captureAll(){
  assert.equal(git('status','--porcelain','--','src/block-packs/pack-2','tests/block-packs/pack-2'),'','candidate checkout must be clean');
  const checkout=git('rev-parse','HEAD');
  const event=process.env.GITHUB_EVENT_PATH?JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8')):{};
  const prHead=event.pull_request?.head?.sha||checkout;
  assert.match(prHead,/^[0-9a-f]{40}$/);
  // Pull-request checkout can be synthetic merge. Compare each authored file blob
  // to the original PR HEAD so an apparently green merge cannot substitute code.
  const paths=git('ls-tree','-r','--name-only',prHead,'--','src/block-packs/pack-2','tests/block-packs/pack-2').split('\n').filter(Boolean);
  assert.ok(paths.length>=21,'all Pack 2 candidate files required');
  const blobs={};for(const path of paths){
    const original=git('rev-parse',prHead+':'+path),actual=git('rev-parse',checkout+':'+path);
    assert.equal(actual,original,'PR-head source mismatch: '+path);blobs[path]=original;
  }
  const app=server();await new Promise(ok=>app.listen(0,'127.0.0.1',ok));
  const profile=await mkdtemp(join(tmpdir(),'pack2-chrome-'));
  let chrome=null,cdp=null;
  const results=[];
  try{
    chrome=spawn(browserBinary(),['--headless=new','--no-sandbox','--disable-dev-shm-usage',
      '--disable-background-networking','--no-first-run','--remote-debugging-port=0',
      '--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
    const port=await until(async()=>{
      const text=await readFile(join(profile,'DevToolsActivePort'),'utf8');return Number(text.split('\n')[0])||null;
    },'Chromium debugger');
    const target=await until(async()=>{
      const j=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
      return j.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
    },'Chromium page');
    cdp=new ChromeProtocol(target.webSocketDebuggerUrl);await cdp.open();
    await cdp.send('Page.enable');await cdp.send('Runtime.enable');
    await mkdir(output,{recursive:true});
    for(const [width,height] of views){
      await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      await cdp.send('Page.navigate',{url:'http://127.0.0.1:'+app.address().port+'/tests/block-packs/pack-2/preview.html'});
      await until(()=>cdp.eval("document.querySelectorAll('#asset option').length===18&&!!window.pack2Fixture"),'authored candidate modules');
      assert.deepEqual(await cdp.eval("Array.from(document.querySelectorAll('#asset option'),o=>Number(o.value))"),allIDs);
      const hashes=new Set();let minPainted=Infinity,waterAlpha=0;
      for(const id of allIDs){
        const v=await choose(cdp,id);assert.equal(v.id,id);assert.ok(v.painted>150,'blank candidate '+id);
        assert.ok(v.overflow<=4,'viewport overflow '+id);assert.ok(!hashes.has(v.hash),'duplicate authored geometry '+id);
        hashes.add(v.hash);minPainted=Math.min(minPainted,v.painted);
        if(id===76)waterAlpha=v.translucent;
        await screenshot(cdp,'pack2-'+id+'-'+width+'x'+height+'.png');
      }
      assert.ok(waterAlpha>200,'water alpha transparency missing');
      const special=[
        [66,'gate-open',"document.querySelector('#hinge').click()",'open',true],
        [73,'guardrail-terminal',"document.querySelector('#variant').click()",'variant','terminal'],
        [74,'parapet-drain',"document.querySelector('#variant').click()",'variant','drain-slot'],
        [76,'water-flow',"document.querySelector('#waterLevel').click();document.querySelector('#waterFlow').click()",'flow','north']
      ];
      for(const [id,name,action,key,value] of special){
        await choose(cdp,id);
        const state=await cdp.eval('(() => {'+action+';return window.pack2Fixture.selection()})()');
        assert.equal(state[key],value);if(id===76)assert.equal(state.level,1);
        await screenshot(cdp,'pack2-'+name+'-'+width+'x'+height+'.png');
      }
      assert.deepEqual(cdp.exceptions,[],'browser JavaScript errors');
      results.push({viewport:width+'x'+height,assets:18,uniqueHashes:hashes.size,
        minPainted,waterTranslucentPixels:waterAlpha,pngs:22});
    }
    const manifest={type:'Pack2 authored-mesh Chromium',prHead,checkout,
      verifiedPRBlobs:blobs,canvas2DOnly:true,liveWebGL2:false,physicalIPhone:false,
      registered:false,results};
    await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2));
    console.log('PASS PACK2 CHROMIUM GALLERY '+JSON.stringify({prHead,checkout,results}));
    return manifest;
  }finally{
    if(cdp)cdp.close();if(chrome)chrome.kill('SIGTERM');
    await new Promise(ok=>app.close(ok));
    await rm(profile,{recursive:true,force:true,maxRetries:4,retryDelay:100});
  }
}
test('18 authored Pack 2 meshes: authentic Chromium 3-view gallery and 4 physical variants',
  {timeout:150000},async()=>{
    const m=await captureAll();assert.equal(m.results.length,3);
    assert.equal(m.results.reduce((n,x)=>n+x.pngs,0),66);
  });
