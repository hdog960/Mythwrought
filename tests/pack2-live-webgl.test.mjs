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

      // Authored mesh evidence from the REAL playable WebGL2 renderer,
      // not candidate Canvas2D or generated stand-in geometry. Use only the
      // existing localhost-only in-game fixture API.
      const gallery=[];
      const cell=await c.eval("(() => {const key=Object.keys(localStorage).find(k=>k.endsWith('-pack2-live-v1'));const p=JSON.parse(localStorage.getItem(key));const a=p.cells.find(row=>row[3]===59);if(!a)throw Error('Missing real candidate fixture');return a.slice(0,3)})()");
      assert.equal(cell.length,3);
      const originalLegacy=await c.eval("localStorage.getItem('mythwrought-v002-world-179')");
      const allApproved=Array.from({length:18},(_,i)=>59+i);
      assert.equal(await c.eval("document.querySelectorAll('#pack2Materials [data-block]').length"),18);
      for(const id of allApproved){
        const placed=await c.eval("(() => {"+
          "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
          "const canvas=document.querySelector('#scene');"+
          "const previousFrame=Number(canvas.dataset.renderedFrames);"+
          "const before=t.snapshot(),start=performance.now();"+
          "t.placeFixture(...cell,"+id+");t.aimAt(...cell);"+
          "const elapsed=performance.now()-start;"+
          "const after=t.snapshot();"+
          "const key=Object.keys(localStorage).find(k=>k.endsWith('-pack2-live-v1'));"+
          "const row=JSON.parse(localStorage.getItem(key)).cells.find(p=>"+
          "p[0]===cell[0]&&p[1]===cell[1]&&p[2]===cell[2]);"+
          "return {id:t.block(...cell),savedId:row?.[3],previousFrame,"+
          "editMs:Math.round(elapsed*10)/10,"+
          "meshRebuilds:after.editMeshBatches-before.editMeshBatches,"+
          "chunks:after.chunks.length,failures:after.gpuRetry.failures,"+
          "meshSlowestMs:after.meshCadence.slowestMs}})()");
        assert.equal(placed.id,id,'Production world did not render candidate ID '+id);
        assert.equal(placed.savedId,id,'Separate Pack 2 save did not persist ID '+id);
        assert.equal(placed.meshRebuilds,1,'Expected one physical GPU mesh rebuild for '+id);
        assert.ok(placed.chunks>0&&placed.chunks<=25,'Surface streaming budget grew');
        assert.equal(placed.failures,0,'Production GPU upload failure for '+id);
        assert.ok(Number.isFinite(placed.editMs)&&placed.editMs>=0);
        await until(()=>c.eval("Number(document.querySelector('#scene').dataset.renderedFrames)>"+(placed.previousFrame+1)),
          'fresh live WebGL2 frames for approved ID '+id);
        const view=await c.eval("(() => {const e=document.querySelector('#scene'),t=window.__mythwroughtTest;return {frames:Number(e.dataset.renderedFrames),chunks:Number(e.dataset.loadedChunks),vertices:Number(e.dataset.renderedMeshVertices),gpu:!!e.getContext('webgl2'),fatal:!document.querySelector('#notice').hidden,retries:t.snapshot().gpuRetry.failures,target:e.dataset.targetBlock}})()");
        assert.ok(view.gpu&&!view.fatal&&view.vertices>0);
        assert.equal(view.chunks,25,'Excess loaded chunks after live ID '+id);
        assert.equal(view.retries,0,'GPU retry faults for live ID '+id);
        const bytes=Buffer.from((await c.send('Page.captureScreenshot',
          {format:'png',fromSurface:true,captureBeyondViewport:false})).data,'base64');
        assert.ok(bytes.length>9000,'Missing genuine game screenshot for ID '+id);
        const name='pack2-live-original-id-'+id+'-932x430.png';
        await writeFile(join(out,name),bytes);
        gallery.push({id,name,pngBytes:bytes.length,editMs:placed.editMs,
          meshSlowestMs:placed.meshSlowestMs,vertices:view.vertices,
          chunks:view.chunks,frame:view.frames,centerRayTarget:view.target});
      }
      assert.deepEqual(gallery.map(x=>x.id),allApproved);
      assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
        originalLegacy,'Original schema-1 bytes changed during candidate gallery placement');
      await c.send('Page.reload');
      await until(()=>c.eval("Boolean(window.__mythwroughtTest)&&Number(document.querySelector('#scene')?.dataset.loadedChunks)===25"),
        'Pack 2 exact sidecar persistence after full page reload');
      const reloaded=await c.eval("(() => {"+
        "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
        "const key=Object.keys(localStorage).find(k=>k.endsWith('-pack2-live-v1'));"+
        "const rows=JSON.parse(localStorage.getItem(key)).cells;"+
        "t.aimAt(...cell);"+
        "return {id:t.block(...cell),saved:rows.find(p=>"+
        "p[0]===cell[0]&&p[1]===cell[1]&&p[2]===cell[2])?.[3],"+
        "chunks:t.snapshot().chunks.length,"+
        "schema:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')).schema}})()");
      assert.deepEqual(reloaded,{id:76,saved:76,chunks:25,schema:1},
        'Final approved candidate and old world were not recovered on reload');
      assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
        originalLegacy,'Original schema-1 bytes changed during browser reload');

      // Like-for-like production performance comparison, not a new gallery:
      // same real 3D cell/chunk, same uploaded GPU buffers and synchronous
      // sidecar+legacy save hook in the same headless Chromium process.
      // Alternate placement order by trial; clear to the actual original AIR
      // between placements so legacy and Pack 2 compare identical context.
      const pairs=[],ordinary=[3,4,5,6,7,8];
      const percentile=(values,p)=>{
        const sorted=[...values].sort((a,b)=>a-b);
        return Math.round(sorted[Math.min(sorted.length-1,
          Math.ceil(sorted.length*p)-1)]*10)/10;
      };
      const legacyBefore=await c.eval("localStorage.getItem('mythwrought-v002-world-179')");
      for(let i=0;i<18;i++){
        const oldId=ordinary[i%ordinary.length],packId=59+i;
        const comparison=await c.eval("(() => {"+
          "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
          "const original="+oldId+",candidate="+packId+",trial="+i+";"+
          "const measure=(id)=>{"+
          "if(t.block(...cell)!==0)throw Error('Benchmark source must be AIR');"+
          "const before=t.snapshot(),start=performance.now();"+
          "t.placeFixture(...cell,id);"+
          "const durationMs=Math.round((performance.now()-start)*10)/10;"+
          "const after=t.snapshot();"+
          "if(t.block(...cell)!==id)throw Error('Benchmark block not installed');"+
          "const value={id,durationMs,chunks:after.chunks.length,"+
          "meshBatches:after.editMeshBatches-before.editMeshBatches,"+
          "gpuFaults:after.gpuRetry.failures-before.gpuRetry.failures};"+
          "t.placeFixture(...cell,0);"+
          "if(t.block(...cell)!==0)throw Error('Benchmark cleanup must restore AIR');"+
          "return value};"+
          "if(t.block(...cell)!==0)t.placeFixture(...cell,0);"+
          "const first=trial%2===0?original:candidate;"+
          "const a=measure(first),b=measure(first===original?candidate:original);"+
          "return {legacy:first===original?a:b,pack2:first===candidate?a:b,"+
          "first:first===original?'legacy':'pack2'}})()");
        assert.equal(comparison.legacy.id,oldId);
        assert.equal(comparison.pack2.id,packId);
        for(const result of [comparison.legacy,comparison.pack2]){
          assert.equal(result.chunks,25,'Benchmark left 25 chunk surface budget');
          assert.equal(result.meshBatches,1,'Benchmark rebuild wasn't identical');
          assert.equal(result.gpuFaults,0,'A GPU failure invalidates performance comparison');
          assert.ok(Number.isFinite(result.durationMs)&&result.durationMs>=0);
        }
        assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
          legacyBefore,'Legacy baseline modified original schema-1 bytes');
        pairs.push({trial:i,...comparison,
          differenceMs:Math.round((comparison.pack2.durationMs-
            comparison.legacy.durationMs)*10)/10});
      }
      assert.equal(await c.eval("window.__mythwroughtTest.block(..."+JSON.stringify(cell)+")"),0);
      const legacyTimes=pairs.map(p=>p.legacy.durationMs);
      const packTimes=pairs.map(p=>p.pack2.durationMs);
      const differences=pairs.map(p=>p.differenceMs);
      const performanceComparison={
        source:'real production placeFixture + GPU remesh + save, same cell, SwiftShader',
        originalIds:ordinary,approvedIds:allApproved,
        legacy:{p50Ms:percentile(legacyTimes,.5),p95Ms:percentile(legacyTimes,.95),
          maxMs:Math.max(...legacyTimes)},
        pack2:{p50Ms:percentile(packTimes,.5),p95Ms:percentile(packTimes,.95),
          maxMs:Math.max(...packTimes)},
        paired:{medianDeltaMs:percentile(differences,.5),
          p95DeltaMs:percentile(differences,.95),
          packSlowerCount:differences.filter(d=>d>0).length,
          legacySlowerCount:differences.filter(d=>d<0).length},
        sampleCount:pairs.length,trialPairs:pairs,physicalIPhone:false};
      console.log('PASS PACK2 PAIRED LIVE WEBGL2 PERF '+JSON.stringify({
        n:performanceComparison.sampleCount,
        legacy:performanceComparison.legacy,
        pack2:performanceComparison.pack2,
        paired:performanceComparison.paired}));
      console.log('PASS PACK2 18-ID ORIGINAL LIVE WEBGL2 EVIDENCE '+JSON.stringify({
        view:'932x430',images:gallery.length,ids:gallery.map(x=>x.id),
        maxEditMs:Math.max(...gallery.map(x=>x.editMs)),
        maxMeshMs:Math.max(...gallery.map(x=>x.meshSlowestMs)),
        maxChunks:Math.max(...gallery.map(x=>x.chunks)),restoredId:reloaded.id}));
      assert.deepEqual(c.errors,[],'browser JS exceptions');
      await writeFile(join(out,'manifest.json'),JSON.stringify({
        label:'Mythwrought real WebGL2 Pack 2, not Canvas2D or physical iPhone',
        CIHead:process.env?.GITHUB_SHA||'local',candidateIds:[59,63,66,73,76],
        viewports:screenshots,fullLiveGallery:gallery,
        performanceComparison,
        originalSaveSchema:1,liveDeployment:false,physicalIPhone:false
      },null,2));
      console.log('PASS PACK2 LIVE WEBGL2 '+JSON.stringify(screenshots));
    }finally{
      if(c)c.close();process.kill('SIGTERM');
      await new Promise(ok=>app.close(ok));
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
    }
  });
