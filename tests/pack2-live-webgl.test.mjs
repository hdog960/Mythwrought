// True Chromium WebGL2 app acceptance for creator-approved Pack 2.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {spawn,spawnSync} from 'node:child_process';
import {resolve,join,extname,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {setTimeout as delay} from 'node:timers/promises';

const root=process.cwd(),out=resolve('artifacts/pack2-live-webgl');
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript',
  '.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const until=async(fn,why)=>{
  for(let i=0;i<900;i++){try{const v=await fn();if(v)return v;}catch{}await delay(100);}
  throw Error('Timed out waiting for '+why);
};
class Chrome{
  constructor(uri){
    this.ws=new WebSocket(uri);this.id=0;this.pending=new Map();this.errors=[];
    this.ws.addEventListener('message',e=>{
      const m=JSON.parse(e.data);
      if(m.id){const p=this.pending.get(m.id);if(p){this.pending.delete(m.id);
        m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}
      else if(m.method==='Runtime.exceptionThrown')this.errors.push(m.params.exceptionDetails.text);
    });
  }
  async ready(){await until(()=>this.ws.readyState===WebSocket.OPEN,'CDP');}
  send(method,params={}){
    const id=++this.id;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('CDP timeout: '+method));},30000);
      this.pending.set(id,{resolve:x=>{clearTimeout(timer);resolve(x)},
        reject:e=>{clearTimeout(timer);reject(e)}});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  async eval(code){
    const x=await this.send('Runtime.evaluate',{expression:code,awaitPromise:true,returnByValue:true});
    if(x.exceptionDetails)throw Error('WebGL app exception '+JSON.stringify(x.exceptionDetails));
    return x.result.value;
  }
  close(){this.ws.close();}
}
const app=createServer(async(req,res)=>{
  try{
    const route=decodeURIComponent(new URL(req.url,'http://local').pathname);
    const file=resolve(root,'.'+(route==='/'?'/index.html':route));
    if(!file.startsWith(root+sep)||!mime[extname(file)])throw Error('not static source');
    res.writeHead(200,{'content-type':mime[extname(file)],'cache-control':'no-store'});
    res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('not found');}
});
test('approved Pack 2 real WebGL2 gameplay mesh, legacy save isolation, reload, and touch UI',
  {timeout:240000},async()=>{
    const executable=['chromium','google-chrome','chromium-browser']
      .map(n=>spawnSync('which',[n],{encoding:'utf8'}))
      .find(x=>x.status===0)?.stdout.trim();
    assert.ok(executable,'GitHub Chromium must be present; do not substitute Canvas2D');
    await mkdir(out,{recursive:true});
    await new Promise(ok=>app.listen(0,'127.0.0.1',ok));
    const profile=await mkdtemp(join(tmpdir(),'mythwrought-pack2-webgl2-'));
    const process=spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
      '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
      '--enable-unsafe-swiftshader','--no-first-run','--remote-debugging-port=0',
      '--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
    let c=null;
    try{
      const port=await until(async()=>{
        const txt=await readFile(join(profile,'DevToolsActivePort'),'utf8');
        return Number(txt.split('\n')[0])||null;
      },'Chromium debugger');
      const target=await until(async()=>{
        const j=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
        return j.find(v=>v.type==='page'&&v.webSocketDebuggerUrl);
      },'Chromium page');
      c=new Chrome(target.webSocketDebuggerUrl);await c.ready();
      await c.send('Page.enable');await c.send('Runtime.enable');
      const origin='http://127.0.0.1:'+app.address().port+'/';
      const screenshots=[];
      for(const [width,height] of [[667,375],[844,390],[932,430]]){
        await c.send('Emulation.setDeviceMetricsOverride',
          {width,height,deviceScaleFactor:1,mobile:false});
        await c.send('Page.navigate',{url:origin});
        await until(()=>c.eval("Boolean(window.__mythwroughtTest)&&Number(document.querySelector('#scene')?.dataset.loadedChunks)===25"),
          'live 25-chunk game '+width+'x'+height);
        const baseline=await c.eval("(() => {const e=document.querySelector('#scene');return {vertices:Number(e.dataset.renderedMeshVertices),gl:!!e.getContext('webgl2'),safe:document.querySelector('#notice').hidden}})()");
        assert.ok(baseline.gl&&baseline.safe&&baseline.vertices>0,'real game did not initialize WebGL2');
        if(width===667){
          const placed=await c.eval("(() => {const t=window.__mythwroughtTest,e=document.querySelector('#scene');const x=Math.floor(Number(e.dataset.playerX))+3,z=Math.floor(Number(e.dataset.playerZ))+3,y=Math.floor(Number(e.dataset.playerFeet))+2;const ids=[59,63,66,73,76],rows=ids.map((id,i)=>[x+i,y,z,id]);if(rows.some(([a,b,c])=>b>19||t.block(a,b,c)!==0))throw Error('unsafe placement coordinates');for(const [a,b,c,id] of rows)t.placeFixture(a,b,c,id);t.aimAt(x,y,z);return rows})()");
          assert.deepEqual(placed.map(x=>x[3]),[59,63,66,73,76]);
          await until(()=>c.eval("Object.keys(localStorage).some(k=>k.endsWith('-pack2-live-v1'))"),
            'verified Pack 2 sidecar');
          const controls=await c.eval("(() => {document.querySelector('#menu').click();const e=document.querySelector('#pack2Materials [data-block=\"66\"]');if(!e)throw Error('missing Pack 2 selector');e.click();const r={pressed:e.getAttribute('aria-pressed'),state:document.querySelector('#pack2StateText').textContent};document.querySelector('#closeHelp').click();return r})()");
          assert.equal(controls.pressed,'true');
          assert.ok(controls.state.includes('Latticed'),'creator-approved gate cannot be selected');
          await until(()=>c.eval("Number(document.querySelector('#scene')?.dataset.renderedMeshVertices)>0"),
            'candidate mesh redraw');
        }
        const result=await c.eval("(() => {const e=document.querySelector('#scene');const old=JSON.parse(localStorage.getItem('mythwrought-v002-world-179'));const k=Object.keys(localStorage).find(x=>x.endsWith('-pack2-live-v1'));const p=JSON.parse(localStorage.getItem(k));return {gl:!!e.getContext('webgl2'),chunks:Number(e.dataset.loadedChunks),vertices:Number(e.dataset.renderedMeshVertices),schema:old.schema,invalidLegacyEdits:old.edits.filter(row=>row[3]>=59).length,ids:p.cells.map(row=>row[3]),fatal:!document.querySelector('#notice').hidden}})()");
        assert.ok(result.gl&&!result.fatal);
        assert.equal(result.chunks,25);
        assert.equal(result.schema,1);
        assert.equal(result.invalidLegacyEdits,0);
        assert.deepEqual(result.ids,[59,63,66,73,76]);
        assert.ok(result.vertices>0);
        const img=await c.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
        const png=Buffer.from(img.data,'base64');
        assert.ok(png.length>9000,'No genuine composited WebGL2 screenshot');
        const name='pack2-live-'+width+'x'+height+'.png';
        await writeFile(join(out,name),png);
        screenshots.push({width,height,bytes:png.length,vertices:result.vertices});
      }
      assert.deepEqual(c.errors,[],'browser JS exceptions');
      await writeFile(join(out,'manifest.json'),JSON.stringify({
        label:'Mythwrought real WebGL2 Pack 2, not Canvas2D or physical iPhone',
        CIHead:process.env?.GITHUB_SHA||'local',candidateIds:[59,63,66,73,76],
        viewports:screenshots,originalSaveSchema:1,liveDeployment:false
      },null,2));
      console.log('PASS PACK2 LIVE WEBGL2 '+JSON.stringify(screenshots));
    }finally{
      if(c)c.close();process.kill('SIGTERM');
      await new Promise(ok=>app.close(ok));
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
    }
  });
