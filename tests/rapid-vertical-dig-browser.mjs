// Source-authentic rapid vertical dig workload. No fake mesh or renderer.
// The debug fixture uses actual world.set, synchronous edit remeshing,
// and schema-1 journaled persistence (same production paths as mining).
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  await mkdir('artifacts',{recursive:true});
  const context=await browser.newContext({viewport:{width:667,height:375},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest &&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
      null,{timeout:90000});
    // Genuine deep room and collision-safe descent column. This fixture is
    // deterministic; it never edits the real player's installed save.
    await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
        for(let y=-78;y<=-76;y++){
          const result=t.placeFixture(x,y,z,0);
          if(!result?.saved)throw Error('Initial fixture did not persist');
        }
      t.teleportCave(1,-78,1);
    });
    await page.waitForFunction(()=>{
      const c=document.querySelector('#scene');
      return Number(c.dataset.loadedChunks)===27&&Number(c.dataset.playerFeet)<-70;
    },null,{timeout:90000});
    const summary=await page.evaluate(async()=>{
      const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
      const samples=[];
      let lastFrame=await new Promise(resolve=>requestAnimationFrame(resolve));
      for(let y=-79;y>=-126;y--){
        const start=performance.now();
        const report=t.placeFixture(1,y,1,0);
        t.teleportCave(1,y,1);
        const actionMs=performance.now()-start;
        const nextFrame=await new Promise(resolve=>requestAnimationFrame(resolve));
        samples.push({y,actionMs,meshMs:report.meshMs,saveMs:report.saveMs,
          persisted:report.saved,frameMs:nextFrame-lastFrame,
          resident:Number(scene.dataset.loadedChunks),
          pending:Number(scene.dataset.pendingChunks)});
        lastFrame=nextFrame;
      }
      const stat=key=>{
        const arr=samples.map(s=>s[key]).sort((a,b)=>a-b);
        return {max:+arr.at(-1).toFixed(2),
          p95:+arr[Math.floor((arr.length-1)*.95)].toFixed(2),
          avg:+(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2)};
      };
      return {count:samples.length,action:stat('actionMs'),
        mesh:stat('meshMs'),save:stat('saveMs'),frame:stat('frameMs'),
        over16:samples.filter(s=>s.frameMs>16.7).length,
        over33:samples.filter(s=>s.frameMs>33).length,
        maxResident:Math.max(...samples.map(s=>s.resident)),
        maxPending:Math.max(...samples.map(s=>s.pending)),
        verified:samples.every(s=>s.persisted),
        atSectionBoundaries:samples.filter(s=>[-83,-99,-115].includes(s.y)),
        finalFeet:Number(scene.dataset.playerFeet)};
    });
    assert.equal(summary.count,48);
    assert.ok(summary.verified,'At least one mining action failed to persist');
    assert.ok(summary.maxResident<=27,'Exceeded underground GPU chunk budget');
    assert.ok(summary.finalFeet<-120,'Did not descend into lower deep sections');
    await page.waitForFunction(()=>Number(document.querySelector('#scene')
      ?.dataset.loadedChunks)===27,null,{timeout:90000});
    const save=await page.evaluate(()=>JSON.parse(
      localStorage.getItem('mythwrought-v002-world-179')||'{}'));
    assert.equal(save.schema,1);
    assert.ok(save.edits.some(r=>r[0]===1&&r[1]===-126&&r[2]===1&&r[3]===0),
      'Last underground edit missing from canonical save');
    await page.screenshot({path:'artifacts/rapid-dig-deep-667x375.png',fullPage:true});
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:30000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-126,1)),
      0,'Last edit disappeared on browser reload');
    assert.deepEqual(errors,[],'Real Chromium JS errors');
    await writeFile('artifacts/rapid-dig-metrics.json',JSON.stringify(summary,null,2)+'\n');
    console.log('RAPID_DIG_METRICS',JSON.stringify(summary));
    console.log('PASS 48 deep vertical mine+teleport+schema1 actions across four sections');
  }finally{await context.close();}
}finally{await browser.close();}
