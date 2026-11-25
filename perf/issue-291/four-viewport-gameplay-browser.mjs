// Issue #291 existing four-viewport acceptance workload. No production imports.
// Run only from an authentic isolated checkout with Playwright 1.58.2,
// Chromium installed and the original game served at http://127.0.0.1:4173/.
// Controlled underground corridor and camera positioning, actual UI MINE,
// actual WebGL2 rendering and actual source saves. Not a natural traversal,
// physical iPhone, gravity, rollback, or screenshot parity certification.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {evaluateIssue291FourViewportAB} from './four-viewport-gate.mjs';

const origin='http://127.0.0.1:4173/';
const seed=179,saveKey='mythwrought-v002-world-'+seed;
const devices=[[667,375],[844,390],[932,430],[956,440]];
const candidateQuery='?measure-291=1&near-vao-291=1&fast-depth-291=1&reuse-water-291=1';
const controlQuery='?measure-291=1';
const plan=Array.from({length:50},(_,x)=>[-77,-78].map(y=>({
  pose:[x,-78,1],cell:[x,y,3],previous:(x+y)%2===0?3:8
}))).flat();
assert.equal(plan.length,100);
assert.equal(new Set(plan.map(p=>p.cell.join(','))).size,100);
const options=([width,height])=>({viewport:{width,height},deviceScaleFactor:1,
  hasTouch:true,isMobile:true,serviceWorkers:'block'});
const output='artifacts/issue291-four-viewport';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={kind:'real-source Chromium WebGL2 controlled corridor',seed,devices,
  plan,controlQuery,candidateQuery,browser:browser.version(),
  physicalIPhoneProven:false,releaseCertified:false,pairs:[],expectedViewports:[]};
const snap=page=>page.evaluate(()=>window.__mythwroughtTest.nearPerformance291());
const ready=page=>page.waitForFunction(()=>window.__mythwroughtTest&&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
  Number(document.querySelector('#scene')?.dataset.pendingChunks)===0&&
  document.querySelector('#notice').hidden&&!document.hidden,null,{timeout:90000});
const verifySaved=page=>page.evaluate(key=>{
  const raw=localStorage.getItem(key);
  if(!raw)throw Error('Missing original source save');
  const parsed=JSON.parse(raw);
  return {schema:parsed.schema,seed:parsed.seed,edits:parsed.edits};
},saveKey);
const settleAim=async(page,item)=>{
  await page.evaluate(({pose,cell})=>{
    const dev=window.__mythwroughtTest;
    dev.teleportCave(...pose);dev.aimAt(...cell);
  },item);
  await page.waitForFunction(({pose,cell})=>{
    const c=document.querySelector('#scene'),t=window.__mythwroughtTest;
    const p=t.m5ObservedPose();
    return c.dataset.targetBlock===cell.join(',')&&
      c.dataset.chunkCenter.startsWith(Math.floor(pose[0]/16)+',0|')&&
      Number(c.dataset.loadedChunks)===27&&Number(c.dataset.pendingChunks)===0&&
      c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false'&&
      Math.abs(p.feet-pose[1])<.1&&Math.abs(p.x-pose[0]-.5)<.05&&
      Math.abs(p.z-pose[2]-.5)<.05&&!p.creative;
  },item,{timeout:90000});
};
async function setup(){
  const context=await browser.newContext(options(devices[3]));
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(origin,{waitUntil:'domcontentloaded'});await ready(page);
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose().seed),seed);
    // Setup is outside the measured page. Use actual original world setter;
    // no fixture edits, placement or reset are admitted during the 100 mines.
    await page.evaluate(plan=>{
      const t=window.__mythwroughtTest;
      const set=(x,y,z,id)=>{
        if(t.block(x,y,z)!==id&&!t.editBiomeCell(x,y,z,id))
          throw Error('Fixture rejected: '+[x,y,z,id]);
        if(t.block(x,y,z)!==id)throw Error('Fixture readback mismatch');
      };
      for(let x=-1;x<=50;x++)for(let z=0;z<=2;z++){
        set(x,-79,z,3);
        for(let y=-78;y<=-76;y++)set(x,y,z,0);
      }
      for(const p of plan)set(...p.cell,p.previous);
    },plan);
    await page.locator('#menu').click();
    await page.locator('#save').click();
    await page.locator('#closeHelp').click();
    const saved=await verifySaved(page);
    assert.equal(saved.schema,1);assert.equal(saved.seed,seed);
    assert.ok(Array.isArray(saved.edits));
    assert.deepEqual(errors,[]);
    // Every measured run starts from this same source-generated storage state.
    return {state:await context.storageState(),saved};
  }finally{await context.close();}
}
async function run(device,mode,fixture){
  const query=mode==='candidate'?candidateQuery:controlQuery;
  const context=await browser.newContext({...options(device),storageState:fixture.state});
  const page=await context.newPage(),errors=[],missing=[];
  const label=device.join('x')+'-'+mode;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push([r.url(),r.status()]);});
  let last=null,pre=null;
  try{
    await page.goto(origin+query,{waitUntil:'domcontentloaded'});await ready(page);
    assert.deepEqual(await verifySaved(page),fixture.saved,'starting schema-1 save differs');
    assert.equal(await page.evaluate(()=>!!document.querySelector('#scene').getContext('webgl2')),true);
    assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),
      plan.map(p=>p.previous),'starting target IDs differ');
    await settleAim(page,plan[0]);
    pre=await snap(page);
    assert.equal(pre.seed,seed);assert.equal(pre.trueSavedDeepMines,0);
    assert.equal(pre.mineFrameWindow.phase,'idle');assert.equal(pre.interruptionCount,0);
    assert.equal(pre.mode,mode==='candidate'?'experimental-vao':'original-control');
    if(mode==='candidate')assert.equal(pre.nearStatus?.phase,'ready');
    else assert.equal(pre.nearStatus,null);
    await page.screenshot({path:output+'/'+label+'-before.png'});
    console.log('291 TRIAL START',label,JSON.stringify({viewport:pre.viewportCss,pixels:pre.viewportPixels,seed:pre.seed,mode:pre.mode,query}));
    for(const [i,item] of plan.entries()){
      if(i!==0)await settleAim(page,item);
      assert.equal(await page.evaluate(cell=>window.__mythwroughtTest.block(...cell),item.cell),item.previous);
      // Real Playwright touch activation of the original source #dig control.
      // No direct edit or injected witness/measurement values.
      await page.locator('#dig').tap({timeout:30000});
      const result=await page.evaluate(({cell,key})=>{
        const t=window.__mythwroughtTest;
        const raw=localStorage.getItem(key),p=t.nearPerformance291();
        return {block:t.block(...cell),schema:raw?JSON.parse(raw).schema:null,
          count:p.trueSavedDeepMines,witness:p.mineWitness.at(-1),
          invalid:p.mineFrameWindow.invalid,interrupted:p.mineFrameWindow.interrupted,
          pending:p.mineFrameWindow.editPending,
          status:document.querySelector('#status').textContent};
      },{cell:item.cell,key:saveKey});
      assert.equal(result.block,0,label+' MINE '+(i+1));
      assert.equal(result.schema,1);assert.equal(result.count,i+1);
      assert.deepEqual(result.witness,[...item.cell,item.previous,0]);
      assert.equal(result.invalid,false);assert.equal(result.interrupted,false);
      assert.equal(result.pending,false);assert.match(result.status,/Removed .* · saved/);
      if((i+1)%25===0)console.log('291 MINE PROGRESS',label,i+1,JSON.stringify(result.witness));
    }
    await page.waitForFunction(()=>window.__mythwroughtTest.nearPerformance291().mineFrameWindow.phase==='complete',
      null,{timeout:30000});
    last=await snap(page);
    await writeFile(output+'/'+label+'.json',JSON.stringify({device,mode,query,pre,snapshot:last},null,2)+'\n');
    assert.equal(last.trueSavedDeepMines,100);assert.equal(last.mineFrameWindow.phaseMines,100);
    assert.deepEqual(last.mineWitness,plan.map(p=>[...p.cell,p.previous,0]));
    await page.screenshot({path:output+'/'+label+'-after.png'});
    const saved=await verifySaved(page);
    assert.equal(saved.schema,1);assert.equal(saved.seed,seed);
    await page.reload({waitUntil:'domcontentloaded'});await ready(page);
    assert.deepEqual(await verifySaved(page),saved,'saved edit data changed on reload');
    assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),
      Array(100).fill(0),'source-saved MINE readback after reload');
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    console.log('291 TRIAL COMPLETE',label,JSON.stringify({mines:last.trueSavedDeepMines,actionP95:last.miningActionP95Ms,frameP95:last.mineFrameWindow.frameP95Ms,uploadP95:last.mineFrameWindow.successfulGuardedUploadP95Ms,frameGaps:last.mineFrameWindow.frameGapsRecorded,slowFrames:last.mineFrameWindow.slowFrames,reloadReadback:100}));
    return {pre,snapshot:last,reloadReadback:100};
  }catch(error){
    const observed=last??await snap(page).catch(()=>null);
    await writeFile(output+'/'+label+'-failure.json',JSON.stringify({
      device,mode,query,pre,snapshot:observed,errors,missing,error:String(error?.stack??error)
    },null,2)+'\n');
    console.error('291 TRIAL FAILURE',label,String(error?.stack??error),JSON.stringify({snapshot:observed,errors,missing}));
    throw error;
  }finally{await context.close();}
}
try{
  const fixture=await setup();
  report.startingSchema=fixture.saved.schema;
  report.startingEdits=fixture.saved.edits;
  for(const [i,device] of devices.entries()){
    // Alternate mode order across viewport pairs to reduce directional warmup bias.
    const order=i%2===0?['control','candidate']:['candidate','control'];
    const pair={};
    for(const mode of order)pair[mode]=await run(device,mode,fixture);
    assert.deepEqual(pair.control.pre.viewportCss,pair.candidate.pre.viewportCss);
    report.expectedViewports.push(pair.control.pre.viewportCss);
    report.pairs.push({control:pair.control.snapshot,candidate:pair.candidate.snapshot,
      device,order,reloadReadback:[pair.control.reloadReadback,pair.candidate.reloadReadback]});
    await writeFile(output+'/report.json',JSON.stringify(report,null,2)+'\n');
  }
  report.evaluation=evaluateIssue291FourViewportAB(report);
  console.log('291 FOUR-VIEWPORT GATE',JSON.stringify(report.evaluation));
  assert.equal(report.evaluation.metricGatesPassed,true,JSON.stringify(report.evaluation.failures));
} catch(error){
  report.error=String(error?.stack??error);throw error;
} finally {
  await writeFile(output+'/report.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
