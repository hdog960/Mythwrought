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

// Localhost-only WebGL2 acceptance functions. Function.toString() sends their
// actual JavaScript source into the existing real production Chromium page.
async function preparePack2DenseLive(anchorCell){
  const t=window.__mythwroughtTest;
  const {PACK2_BUILDER_SYMBOLS,planPack2BuilderStructure}=
    await import('./src/builder-assets/pack2.mjs');
  let origin=null;
  for(const y of [19,18,17,16,15,14]){
    for(let shift=2;shift<=14;shift+=3){
      const a=[anchorCell[0]+shift,y,anchorCell[2]+shift];
      if(Array.from({length:64},(_,i)=>[a[0]+i%8,y,a[2]+Math.floor(i/8)])
          .every(cell=>t.block(...cell)===0)){origin=a;break;}
    }
    if(origin)break;
  }
  if(!origin)throw Error('No safe 8x8 air footprint near player');
  const placements=Array.from({length:64},(_,i)=>({
    asset:PACK2_BUILDER_SYMBOLS[i%PACK2_BUILDER_SYMBOLS.length],
    at:[i%8,0,Math.floor(i/8)]
  }));
  const plan=planPack2BuilderStructure(placements,{origin,maxCells:64});
  if(plan.cells.length!==64||plan.fluidVolumes.length<2||
     new Set(plan.cells.map(c=>c.blockId)).size!==18)
    throw Error('Source-exact builder planner did not return all physical assets');
  window.__pack2DenseFixture=plan.cells.map(c=>({
    at:c.at,id:c.blockId,state:c.state,symbol:c.asset
  }));
  return {origin,cells:64,solidBoxes:plan.worldBoxes.length,
    waterCells:plan.fluidVolumes.length,uniqueIds:18};
}
function placePack2DenseBatch(batch){
  const t=window.__mythwroughtTest,fixtures=window.__pack2DenseFixture;
  if(!fixtures||fixtures.length!==64)throw Error('Missing authored builder plan');
  const before=t.snapshot(),start=performance.now();
  for(const p of fixtures.slice(batch*8,(batch+1)*8)){
    t.placeFixture(...p.at,p.id);
    if(t.block(...p.at)!==p.id)throw Error('Live placement failed '+p.symbol);
    if(!t.snapshot().lastEditMeshKeys.length)
      throw Error('Live builder edit did not trigger a GPU mesh rebuild');
  }
  const after=t.snapshot();
  return {durationMs:Math.round((performance.now()-start)*10)/10,
    chunks:after.chunks.length,meshBatches:after.editMeshBatches-before.editMeshBatches,
    gpuErrors:after.gpuRetry.failures,
    frame:Number(document.querySelector('#scene').dataset.renderedFrames)};
}
function inspectPack2DenseCells(){
  const cells=window.__pack2DenseFixture,t=window.__mythwroughtTest,
    key=Object.keys(localStorage).find(x=>x.endsWith('-pack2-live-v1')),
    rows=JSON.parse(localStorage.getItem(key)).cells;
  const matched=cells.filter(p=>rows.some(r=>
    r[0]===p.at[0]&&r[1]===p.at[1]&&r[2]===p.at[2]&&
    r[3]===p.id&&JSON.stringify(r[4])===JSON.stringify(p.state))&&
    t.block(...p.at)===p.id);
  const snap=t.snapshot(),canvas=document.querySelector('#scene');
  return {count:matched.length,totalSidecarRows:rows.length,
    chunks:snap.chunks.length,gpuErrors:snap.gpuRetry.failures,
    vertices:Number(canvas.dataset.renderedMeshVertices)};
}
function inspectPack2MobileLayout(){
  const m=document.querySelector('#movePad').getBoundingClientRect(),
    l=document.querySelector('#lookPad').getBoundingClientRect(),
    c=document.querySelector('#scene').getBoundingClientRect();
  return {width:innerWidth,height:innerHeight,
    overflow:document.documentElement.scrollWidth-innerWidth,
    separateThumbRails:m.right<l.left,
    moveVisible:m.left>=0&&m.right<=innerWidth,
    lookVisible:l.left>=0&&l.right<=innerWidth,
    worldWidth:Math.round(c.width)};
}
function verifyPack2DenseAfterReload(expected){
  const t=window.__mythwroughtTest,
    key=Object.keys(localStorage).find(x=>x.endsWith('-pack2-live-v1')),
    rows=JSON.parse(localStorage.getItem(key)).cells;
  return {count:expected.filter(p=>t.block(...p.at)===p.id&&
    rows.some(r=>r[0]===p.at[0]&&r[1]===p.at[1]&&r[2]===p.at[2]&&
      r[3]===p.id&&JSON.stringify(r[4])===JSON.stringify(p.state))).length,
    chunks:t.snapshot().chunks.length,gpuErrors:t.snapshot().gpuRetry.failures};
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

      // The earlier same-CDP-evaluation benchmark had a first-in-pair GPU
      // synchronization artifact. Time each placement in an independent CDP
      // call, separated by three ACTUAL game rendering frames on each side of
      // each cleanup. Alternate legacy/Pack 2 order. No new screenshots.
      const pairs=[],ordinary=[3,4,5,6,7,8],settleFrames=3;
      const percentile=(values,p)=>{
        const a=[...values].sort((x,y)=>x-y);
        return Math.round(a[Math.min(a.length-1,Math.ceil(a.length*p)-1)]*10)/10;
      };
      const legacyBefore=await c.eval("localStorage.getItem('mythwrought-v002-world-179')");
      const settle=async(frame,label)=>await until(()=>
        c.eval("Number(document.querySelector('#scene').dataset.renderedFrames)").then(n=>n>=frame+settleFrames),
        label+' actual WebGL2 redraw');
      const trial=async id=>{
        const prepared=await c.eval("(() => {"+
          "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
          "if(t.block(...cell)!==0)t.placeFixture(...cell,0);"+
          "if(t.block(...cell)!==0)throw Error('Expected AIR before measuring');"+
          "return Number(document.querySelector('#scene').dataset.renderedFrames)})()");
        await settle(prepared,'before block '+id);
        const measured=await c.eval("(() => {"+
          "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
          "const before=t.snapshot(),start=performance.now();"+
          "t.placeFixture(...cell,"+id+");"+
          "const durationMs=Math.round((performance.now()-start)*10)/10;"+
          "const after=t.snapshot();"+
          "return {id:t.block(...cell),durationMs,chunks:after.chunks.length,"+
          "meshBatches:after.editMeshBatches-before.editMeshBatches,"+
          "gpuFaults:after.gpuRetry.failures-before.gpuRetry.failures,"+
          "frame:Number(document.querySelector('#scene').dataset.renderedFrames)}})()");
        assert.equal(measured.id,id,'Production placement was not retained');
        assert.equal(measured.chunks,25,'Surface chunk budget exceeded');
        assert.equal(measured.meshBatches,1,'GPU edit mesh rebuild mismatch');
        assert.equal(measured.gpuFaults,0,'GPU retry invalidates benchmark');
        assert.ok(Number.isFinite(measured.durationMs)&&measured.durationMs>=0);
        await settle(measured.frame,'after placing block '+id);
        const removed=await c.eval("(() => {"+
          "const t=window.__mythwroughtTest,cell="+JSON.stringify(cell)+";"+
          "t.placeFixture(...cell,0);"+
          "if(t.block(...cell)!==0)throw Error('Cleanup failed');"+
          "return Number(document.querySelector('#scene').dataset.renderedFrames)})()");
        await settle(removed,'after removing block '+id);
        assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
          legacyBefore,'Original schema-1 save bytes changed');
        return measured;
      };
      for(let i=0;i<18;i++){
        const oldId=ordinary[i%ordinary.length],packId=59+i;
        const first=i%2===0?'legacy':'pack2';
        const a=await trial(first==='legacy'?oldId:packId);
        const b=await trial(first==='legacy'?packId:oldId);
        const legacy=first==='legacy'?a:b,pack2=first==='pack2'?a:b;
        pairs.push({trial:i,first,legacy,pack2,
          differenceMs:Math.round((pack2.durationMs-legacy.durationMs)*10)/10});
      }
      const legacyTimes=pairs.map(p=>p.legacy.durationMs),packTimes=pairs.map(p=>p.pack2.durationMs);
      const diffs=pairs.map(p=>p.differenceMs);
      const performanceComparison={
        source:'real production WebGL2 placeFixture+GPU rebuild+save; same cell and SwiftShader',
        methodology:'separate CDP calls and 3 actual rendered frames between each placement/cleanup; alternating order',
        originalIds:ordinary,approvedIds:allApproved,settleFrames,
        legacy:{p50Ms:percentile(legacyTimes,.5),p95Ms:percentile(legacyTimes,.95),maxMs:Math.max(...legacyTimes)},
        pack2:{p50Ms:percentile(packTimes,.5),p95Ms:percentile(packTimes,.95),maxMs:Math.max(...packTimes)},
        paired:{medianDeltaMs:percentile(diffs,.5),p95DeltaMs:percentile(diffs,.95),
          packSlowerCount:diffs.filter(x=>x>0).length,legacySlowerCount:diffs.filter(x=>x<0).length,
          firstLegacyMedianDeltaMs:percentile(pairs.filter(p=>p.first==='legacy').map(p=>p.differenceMs),.5),
          firstPack2MedianDeltaMs:percentile(pairs.filter(p=>p.first==='pack2').map(p=>p.differenceMs),.5)},
        sampleCount:pairs.length,trialPairs:pairs,physicalIPhone:false
      };
      console.log('PASS PACK2 FRAME-SETTLED PAIRED WEBGL2 PERF '+JSON.stringify({
        n:pairs.length,legacy:performanceComparison.legacy,
        pack2:performanceComparison.pack2,paired:performanceComparison.paired}));
      console.log('PASS PACK2 18-ID ORIGINAL LIVE WEBGL2 EVIDENCE '+JSON.stringify({
        view:'932x430',images:gallery.length,ids:gallery.map(x=>x.id),
        maxEditMs:Math.max(...gallery.map(x=>x.editMs)),
        maxMeshMs:Math.max(...gallery.map(x=>x.meshSlowestMs)),
        maxChunks:Math.max(...gallery.map(x=>x.chunks)),restoredId:reloaded.id}));

      // Real 64-cell live construction follows the already-passed 256-cell
      // blueprint-source stress test; no duplicate authored-gallery testing.
      const livePlan=await c.eval('('+preparePack2DenseLive.toString()+')('+
        JSON.stringify(cell)+')');
      assert.equal(livePlan.cells,64);
      assert.equal(livePlan.uniqueIds,18);
      const oldBytes=await c.eval("localStorage.getItem('mythwrought-v002-world-179')");
      const denseMeasurements=[];
      for(let batch=0;batch<8;batch++){
        const result=await c.eval('('+placePack2DenseBatch.toString()+')('+batch+')');
        assert.equal(result.chunks,25,'Dense building exceeded surface streaming budget');
        assert.equal(result.meshBatches,8,'Each physical block must rebuild its loaded GPU chunk');
        assert.equal(result.gpuErrors,0,'GPU upload retry failed during construction');
        assert.ok(Number.isFinite(result.durationMs)&&result.durationMs>=0);
        denseMeasurements.push(result);
        await until(()=>c.eval("Number(document.querySelector('#scene').dataset.renderedFrames)>"+
          result.frame),'live GPU redraw after dense batch '+batch);
      }
      const densePre=await c.eval('('+inspectPack2DenseCells.toString()+')()');
      assert.equal(densePre.count,64,'Real GPU construction not persisted');
      assert.equal(densePre.chunks,25);
      assert.equal(densePre.gpuErrors,0);
      assert.ok(densePre.vertices>0);
      assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
        oldBytes,'Builder edit modified existing schema-1 world');
      const denseFull=await c.send('Page.captureScreenshot',
        {format:'png',fromSurface:true,captureBeyondViewport:false});
      await writeFile(join(out,'pack2-live-dense-932x430.png'),
        Buffer.from(denseFull.data,'base64'));
      const expected=await c.eval("window.__pack2DenseFixture.map(p=>({at:p.at,id:p.id,state:p.state}))");
      await c.send('Emulation.setDeviceMetricsOverride',
        {width:667,height:375,deviceScaleFactor:1,mobile:false});
      const denseLayout=await c.eval('('+inspectPack2MobileLayout.toString()+')()');
      assert.equal(denseLayout.width,667);
      assert.equal(denseLayout.height,375);
      assert.ok(denseLayout.overflow<=1&&denseLayout.worldWidth>=150);
      assert.ok(denseLayout.separateThumbRails&&denseLayout.moveVisible&&denseLayout.lookVisible,
        'Simulated iPhone landscape controls overlap or are clipped');
      await until(()=>c.eval("Number(document.querySelector('#scene').dataset.loadedChunks)===25"),
        'dense surface chunk stream at 667 CSS width');
      const denseSmall=await c.send('Page.captureScreenshot',
        {format:'png',fromSurface:true,captureBeyondViewport:false});
      await writeFile(join(out,'pack2-live-dense-667x375.png'),
        Buffer.from(denseSmall.data,'base64'));
      await c.send('Page.reload');
      await until(()=>c.eval("Boolean(window.__mythwroughtTest)&&Number(document.querySelector('#scene')?.dataset.loadedChunks)===25"),
        'live dense construction reload');
      const denseAfter=await c.eval('('+verifyPack2DenseAfterReload.toString()+')('+
        JSON.stringify(expected)+')');
      assert.equal(denseAfter.count,64,'64 source-authentic Pack 2 states not restored');
      assert.equal(denseAfter.chunks,25);
      assert.equal(denseAfter.gpuErrors,0);
      assert.equal(await c.eval("localStorage.getItem('mythwrought-v002-world-179')"),
        oldBytes,'Dense builder reload changed protected legacy save bytes');
      const denseAcceptance={source:'actual production Mythwrought WebGL2 game',
        sizes:['932x430','667x375'],physicalIPhone:false,
        ...livePlan,layout:denseLayout,batches:denseMeasurements,
        restoredStates:denseAfter.count,originalSchema1BytesPreserved:true,
        screenshots:['pack2-live-dense-932x430.png','pack2-live-dense-667x375.png']};
      console.log('PASS PACK2 64-CELL LIVE BUILDER WEBGL2 '+JSON.stringify({
        cells:livePlan.cells,boxes:livePlan.solidBoxes,water:livePlan.waterCells,
        restored:denseAfter.count,chunkMax:25,
        maxBatchMs:Math.max(...denseMeasurements.map(x=>x.durationMs)),
        phoneSizedLayoutPassed:true,physicalIPhone:false}));
      assert.deepEqual(c.errors,[],'browser JS exceptions');
      await writeFile(join(out,'manifest.json'),JSON.stringify({
        label:'Mythwrought real WebGL2 Pack 2, not Canvas2D or physical iPhone',
        CIHead:process.env?.GITHUB_SHA||'local',candidateIds:[59,63,66,73,76],
        viewports:screenshots,fullLiveGallery:gallery,
        performanceComparison,denseAcceptance,
        originalSaveSchema:1,liveDeployment:false,physicalIPhone:false
      },null,2));
      console.log('PASS PACK2 LIVE WEBGL2 '+JSON.stringify(screenshots));
    }finally{
      if(c)c.close();process.kill('SIGTERM');
      await new Promise(ok=>app.close(ok));
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
    }
  });
