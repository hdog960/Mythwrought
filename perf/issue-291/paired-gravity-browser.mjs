// Existing #291 release gate: 12 paired genuine UI MINE + gravity cases.
// Isolated browser qualification only. Run with original game served on :4173.
// Actual source collision, gravity, renderer, source save and reload. Fixture
// preparation and starting camera positioning are not measured gameplay.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {sectionWindow,sectionChunkRadius} from '../../src/depth.mjs';

const origin='http://127.0.0.1:4173/';
const devices=[[667,375],[844,390],[932,430],[956,440]];
const cases=[
  {name:'vertical-horizontal-seam',x:16,z:1,feet:-19,land:-22,id:3},
  {name:'deep-interior',x:2,z:1,feet:-78,land:-81,id:8},
  {name:'bottom-negative-seam',x:-16,z:1,feet:-206,land:-209,id:8}
];
const key='mythwrought-v002-world-179';
const modes={control:'',candidate:'?near-vao-291=1&fast-depth-291=1&reuse-water-291=1'};
const count=feet=>{const s=sectionWindow(feet,false);
  return s.reduce((n,k)=>n+(2*sectionChunkRadius(k,s[0])+1)**2,0);};
const opts=([width,height])=>({viewport:{width,height},deviceScaleFactor:1,
  hasTouch:true,isMobile:true,serviceWorkers:'block'});
const dir='artifacts/issue291-gravity';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={seed:179,devices,cases,runs:[],physicalIPhoneProven:false,releaseCertified:false};
const ready=page=>page.waitForFunction(()=>window.__mythwroughtTest&&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
  Number(document.querySelector('#scene')?.dataset.pendingChunks)===0&&
  document.querySelector('#notice').hidden&&!document.hidden,null,{timeout:90000});
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),key);
const pose=page=>page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose());
async function setup(){
  const context=await browser.newContext(opts(devices[3]));
  const page=await context.newPage();
  try{
    await page.goto(origin,{waitUntil:'domcontentloaded'});await ready(page);
    assert.equal((await pose(page)).seed,179);
    await page.evaluate(cases=>{
      const t=window.__mythwroughtTest;
      const set=(x,y,z,id)=>{
        if(t.block(x,y,z)!==id&&!t.editBiomeCell(x,y,z,id))
          throw Error('Original setter rejected fixture '+[x,y,z,id]);
        if(t.block(x,y,z)!==id)throw Error('Fixture readback mismatch');
      };
      for(const c of cases){
        for(let x=c.x-1;x<=c.x+1;x++)for(let z=c.z-1;z<=c.z+1;z++){
          set(x,c.land-1,z,3);
          for(let y=c.land;y<=c.feet+2;y++)set(x,y,z,0);
        }
        set(c.x,c.feet-1,c.z,c.id);
      }
    },cases);
    await page.locator('#menu').click();
    await page.locator('#save').click();
    await page.locator('#closeHelp').click();
    const save=await saved(page);
    assert.equal(save.schema,1);assert.equal(save.seed,179);
    return {state:await context.storageState(),save};
  }finally{await context.close();}
}
async function run(device,mode,fixture){
  const label=device.join('x')+'-'+mode;
  const context=await browser.newContext({...opts(device),storageState:fixture.state});
  const page=await context.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push([r.url(),r.status()]);});
  const result={device,mode,query:modes[mode],cases:[]};
  try{
    await page.goto(origin+modes[mode],{waitUntil:'domcontentloaded'});await ready(page);
    assert.deepEqual(await saved(page),fixture.save);
    assert.equal(await page.evaluate(()=>!!document.querySelector('#scene').getContext('webgl2')),true);
    const near=await page.evaluate(()=>window.__mythwroughtTest.nearOpaque291());
    if(mode==='candidate')assert.equal(near?.phase,'ready');else assert.equal(near,null);
    for(const c of cases){
      const target=[c.x,c.feet-1,c.z],landing=[c.x,c.land-1,c.z];
      // Grounded start only; never teleport, move or set a block after MINE.
      await page.evaluate(({c,target})=>{
        const t=window.__mythwroughtTest;t.teleportCave(c.x,c.feet,c.z);t.aimAt(...target);
      },{c,target});
      await page.waitForFunction(({c,target,resident})=>{
        const t=window.__mythwroughtTest,scene=document.querySelector('#scene'),p=t.m5ObservedPose();
        return t.block(...target)===c.id&&scene.dataset.targetBlock===target.join(',')&&
          Number(scene.dataset.loadedChunks)===resident&&Number(scene.dataset.pendingChunks)===0&&
          scene.dataset.playerGrounded==='true'&&scene.dataset.playerColliding==='false'&&
          Math.abs(p.feet-c.feet)<.05&&!p.creative;
      },{c,target,resident:count(c.feet)},{timeout:90000});
      const priorSave=await saved(page);
      const before=await page.evaluate(()=>{
        const d=document.querySelector('#scene').dataset;
        return {feet:Number(d.playerFeet),landings:Number(d.landings)||0,
          batches:Number(d.meshEditBatches)};
      });
      // Read-only observer of original renderer-owned player dataset, one
      // bounded trace. Never overwrite clocks, simulation state or witness.
      await page.evaluate(()=>{
        const scene=document.querySelector('#scene'),rows=[];
        window.__gravity291Readback={rows,active:true};
        const poll=()=>{
          const p=window.__gravity291Readback;
          if(!p.active||rows.length>=2048)return;
          const d=scene.dataset;
          rows.push([Number(d.playerFeet),Number(d.playerVelocityY),
            d.playerGrounded==='true',d.playerColliding==='true',Number(d.landings)||0]);
          requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      });
      await page.locator('#dig').tap({timeout:30000});
      assert.equal(await page.evaluate(target=>window.__mythwroughtTest.block(...target),target),0);
      assert.match(await page.locator('#status').textContent(),/Removed .* · saved/);
      const afterSave=await saved(page);assert.equal(afterSave.schema,1);
      const atTarget=row=>row.length===4&&row[0]===target[0]&&
        row[1]===target[1]&&row[2]===target[2];
      const priorRow=priorSave.edits.find(atTarget),afterRow=afterSave.edits.find(atTarget);
      // Source saves canonicalize edits: mining an authored block in
      // natural AIR removes its previous edit rather than retaining AIR.
      assert.ok(afterRow?.[3]===0||(!afterRow&&priorRow?.[3]===c.id),
        'Missing canonical source save change for removed support');
      assert.notDeepEqual(afterSave,priorSave);
      await page.waitForFunction(({c,before,resident})=>{
        const d=document.querySelector('#scene').dataset;
        return Math.abs(Number(d.playerFeet)-c.land)<.05&&
          d.playerGrounded==='true'&&d.playerColliding==='false'&&
          Math.abs(Number(d.playerVelocityY))<.001&&Number(d.landings)>before.landings&&
          Number(d.loadedChunks)===resident&&Number(d.pendingChunks)===0;
      },{c,before,resident:count(c.land)},{timeout:90000});
      const trace=await page.evaluate(()=>{
        window.__gravity291Readback.active=false;
        return window.__gravity291Readback.rows;
      });
      assert.ok(trace.length>2&&trace.length<2048);
      assert.ok(trace.some(row=>row[0]<c.feet-.05&&row[1]<0&&!row[2]),'No observed real falling frame');
      assert.ok(trace.every(row=>!row[3]),'Original collision penetrated during fall');
      const p=await pose(page);
      assert.ok(Math.abs(p.x-c.x-.5)<.05&&Math.abs(p.z-c.z-.5)<.05);
      assert.equal(await page.evaluate(landing=>window.__mythwroughtTest.block(...landing),landing),3);
      const after=await page.evaluate(()=>{const d=document.querySelector('#scene').dataset;
        return {feet:Number(d.playerFeet),landings:Number(d.landings)||0,
          batches:Number(d.meshEditBatches),keys:d.lastEditedChunks};});
      assert.ok(after.batches>before.batches&&after.landings>before.landings);
      result.cases.push({name:c.name,target,landing,before,after,trace});
      await page.screenshot({path:dir+'/'+label+'-'+c.name+'.png'});
      console.log('291 GRAVITY PASS',label,c.name,JSON.stringify({before,after,frames:trace.length}));
    }
    const finalSave=await saved(page);
    await page.reload({waitUntil:'domcontentloaded'});await ready(page);
    assert.deepEqual(await saved(page),finalSave);
    assert.deepEqual(await page.evaluate(cases=>cases.map(c=>window.__mythwroughtTest.block(c.x,c.feet-1,c.z)),cases),[0,0,0]);
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    result.reloadReadback=3;return result;
  }catch(error){
    result.error=String(error?.stack??error);result.errors=errors;result.missing=missing;
    throw error;
  }finally{
    await writeFile(dir+'/'+label+'.json',JSON.stringify(result,null,2)+'\n');
    await context.close();
  }
}
try{
  const fixture=await setup();
  for(const device of devices)for(const mode of ['control','candidate']){
    report.runs.push(await run(device,mode,fixture));
    await writeFile(dir+'/report.json',JSON.stringify(report,null,2)+'\n');
  }
  assert.equal(report.runs.length,8);
  assert.equal(report.runs.reduce((n,r)=>n+r.cases.length,0),24);
  report.pairedCases=12;
}catch(error){report.error=String(error?.stack??error);throw error;}
finally{await writeFile(dir+'/report.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
