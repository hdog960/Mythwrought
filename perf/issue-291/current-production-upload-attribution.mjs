// Issue #291 targeted diagnostic: actual current-production mine events,
// exact native calls forwarded once, no extra GL queries during an edit.
// Diagnostic only: browser software renderer, not a performance acceptance run.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const output='artifacts/issue291-upload-attribution';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},
  deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push([r.url(),r.status()]);});
const report={kind:'current production source actual UI mine native GL call timing',
  browser:browser.version(),samples:[],physicalIPhoneProven:false,releaseCertified:false};
const plan=Array.from({length:12},(_,i)=>({pose:[10+i,-78,1],
  cell:[10+i,-77,3],previous:i%2?8:3}));
const key='mythwrought-v002-world-179';
try{
  await page.addInitScript(()=>{
    const state={armed:false,active:null,events:[],overflow:false};
    Object.defineProperty(window,'__issue291CallTrace',{value:state});
    const proto=WebGL2RenderingContext.prototype;
    for(const name of ['createBuffer','bindBuffer','bufferData','getError',
      'deleteBuffer','isContextLost','bufferSubData']){
      const native=proto[name];
      if(typeof native!=='function')throw Error('Unavailable native GL method '+name);
      Object.defineProperty(proto,name,{configurable:true,writable:true,
        value:function(...args){
          if(!state.active)return Reflect.apply(native,this,args);
          const at=performance.now();let value,failed=false;
          try{value=Reflect.apply(native,this,args);return value;}
          catch(error){failed=true;throw error;}
          finally{
            const duration=performance.now()-at;
            if(state.active.calls.length>=256)state.overflow=true;
            else state.active.calls.push({name,duration,failed,
              code:name==='getError'?value:null,
              bytes:name==='bufferData'||name==='bufferSubData'?
                (typeof args[name==='bufferData'?1:2]==='number'?
                  args[name==='bufferData'?1:2]:args[name==='bufferData'?1:2]?.byteLength??null):null});
          }
        }});
    }
    // Both real touchscreen pointerdown and its optional subsequent click.
    // Restrict capture to the exact synchronous source event dispatch;
    // earlier/later RAF work is not mislabelled as mining calls.
    for(const type of ['pointerdown','click']){
      document.addEventListener(type,e=>{
        if(!state.armed||e.target?.closest?.('#dig')?.id!=='dig')return;
        state.active={type,start:performance.now(),calls:[]};
      },true);
      document.addEventListener(type,e=>{
        if(!state.active||state.active.type!==type)return;
        state.events.push({...state.active,eventMs:performance.now()-state.active.start});
        state.active=null;
      });
    }
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  const ready=()=>page.waitForFunction(()=>window.__mythwroughtTest&&
    Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
    Number(document.querySelector('#scene')?.dataset.pendingChunks)===0&&
    document.querySelector('#notice').hidden&&!document.hidden,null,{timeout:90000});
  await ready();
  report.initial=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,c=document.querySelector('#scene'),gl=c.getContext('webgl2');
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {seed:t.m5ObservedPose().seed,worldMode:t.fourBiomeMode(),
      renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
      canvas:[c.width,c.height],css:[c.clientWidth,c.clientHeight]};
  });
  assert.equal(report.initial.seed,179);
  await page.evaluate(plan=>{
    const t=window.__mythwroughtTest;
    const set=(x,y,z,id)=>{
      if(t.block(x,y,z)!==id&&!t.editBiomeCell(x,y,z,id))throw Error('setup rejected');
      if(t.block(x,y,z)!==id)throw Error('setup readback mismatch');
    };
    for(let x=9;x<=22;x++)for(let z=0;z<=2;z++){
      set(x,-79,z,3);
      for(let y=-78;y<=-76;y++)set(x,y,z,0);
    }
    for(const p of plan)set(...p.cell,p.previous);
  },plan);
  await page.locator('#menu').click();await page.locator('#save').click();
  await page.locator('#closeHelp').click();
  await page.reload({waitUntil:'domcontentloaded'});await ready();
  const readSave=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),key);
  const original=await readSave();assert.equal(original.schema,1);assert.equal(original.seed,179);
  report.startingSave=original;
  for(const [i,item] of plan.entries()){
    await page.evaluate(({pose,cell})=>{
      const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...cell);
    },item);
    await page.waitForFunction(({pose,cell})=>{
      const c=document.querySelector('#scene'),t=window.__mythwroughtTest;
      const p=t.m5ObservedPose();
      return c.dataset.targetBlock===cell.join(',')&&
        Number(c.dataset.loadedChunks)===27&&Number(c.dataset.pendingChunks)===0&&
        c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false'&&
        Math.abs(p.feet-pose[1])<.1&&!p.creative;
    },item,{timeout:90000});
    assert.equal(await page.evaluate(cell=>window.__mythwroughtTest.block(...cell),item.cell),item.previous);
    const before=await readSave();
    await page.evaluate(()=>{const s=window.__issue291CallTrace;
      s.events=[];s.overflow=false;s.active=null;s.armed=true;});
    await page.locator('#dig').tap({timeout:30000});
    const observed=await page.evaluate(cell=>{
      const s=window.__issue291CallTrace;s.armed=false;
      return {events:s.events,overflow:s.overflow,active:s.active!==null,
        block:window.__mythwroughtTest.block(...cell),
        status:document.querySelector('#status').textContent,
        meshKeys:document.querySelector('#scene').dataset.lastEditedChunks};
    },item.cell);
    assert.equal(observed.block,0);assert.match(observed.status,/Removed .* · saved/);
    assert.equal(observed.overflow,false);assert.equal(observed.active,false);
    const after=await readSave();assert.equal(after.schema,1);assert.notDeepEqual(after,before);
    const events=observed.events.filter(e=>e.calls.some(c=>c.name==='bufferData'));
    assert.equal(events.length,1,'Expected exactly one source mining event with GPU uploads');
    const calls=events[0].calls;
    assert.ok(calls.every(c=>!c.failed&&(c.name!=='getError'||c.code===0)));
    // Map the observed guard calls by actual order, not assumed timing.
    const uploads=[];
    for(let j=0;j<calls.length;j++)if(calls[j].name==='bufferData'){
      const pre=calls.slice(0,j).findLast(c=>c.name==='getError');
      const post=calls.slice(j+1).find(c=>c.name==='getError');
      assert.ok(pre&&post,'Original guarded upload must retain both error checks');
      uploads.push({bytes:calls[j].bytes,preErrorMs:pre.duration,
        bufferDataMs:calls[j].duration,postErrorMs:post.duration});
    }
    assert.ok(uploads.length>=1&&uploads.length<=8);
    const sample={i:i+1,cell:item.cell,previous:item.previous,
      eventMs:events[0].eventMs,uploads,events:observed.events,meshKeys:observed.meshKeys};
    report.samples.push(sample);
    console.log('291 CALL ATTRIBUTION',JSON.stringify(sample));
    await writeFile(output+'/report.json',JSON.stringify(report,null,2)+'\n');
  }
  const last=await readSave();
  await page.reload({waitUntil:'domcontentloaded'});await ready();
  assert.deepEqual(await readSave(),last);
  assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),Array(12).fill(0));
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  report.reloadReadback=12;
  const rows=report.samples.flatMap(s=>s.uploads);
  const p95=a=>a.slice().sort((x,y)=>x-y)[Math.ceil(a.length*.95)-1];
  report.summary={actions:12,uploads:rows.length,bytesMax:Math.max(...rows.map(r=>r.bytes)),
    preErrorP95:p95(rows.map(r=>r.preErrorMs)),bufferDataP95:p95(rows.map(r=>r.bufferDataMs)),
    postErrorP95:p95(rows.map(r=>r.postErrorMs)),eventP95:p95(report.samples.map(s=>s.eventMs))};
  console.log('291 CALL ATTRIBUTION SUMMARY',JSON.stringify({initial:report.initial,summary:report.summary,reloadReadback:12}));
}catch(error){report.error=String(error?.stack??error);console.error('291 CALL ATTRIBUTION FAILURE',report.error);throw error;}
finally{
  report.errors=errors;report.missing=missing;
  await writeFile(output+'/report.json',JSON.stringify(report,null,2)+'\n');
  await context.close();await browser.close();
}
