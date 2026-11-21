// Source-authentic full-game WebGL2 underground excavation performance.
 // Test uses production world.set, section streaming, atomic GPU rebuild and
 // real schema-1/profile-save writes; no fake frames or rasterized screenshots.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const port=Number(process.env.DIG_PORT||4173);
const label=process.env.DIG_BASELINE==='1'?'baseline':'candidate';
const viewports=[[667,375],[844,390],[932,430],[956,440]];
const browser=await chromium.launch({headless:true,
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
    '--enable-unsafe-swiftshader']});
const all=[];
try{
  await mkdir('artifacts',{recursive:true});
  for(const [width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try{
      await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle',timeout:30000});
      await page.waitForFunction(()=>window.__mythwroughtTest&&
        Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
        null,{timeout:120000});
      const fixture=await page.evaluate(()=>{
        const t=window.__mythwroughtTest;
        for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
          for(let y=-78;y<=-76;y++)t.placeFixture(x,y,z,0);
        t.teleportCave(1,-78,1);
        return {profile:t.fourBiomeMode()};
      });
      await page.waitForFunction(()=>{
        const c=document.querySelector('#scene');
        return Number(c.dataset.loadedChunks)<=27&&
          Number(c.dataset.loadedChunks)>=18&&Number(c.dataset.playerFeet)<-70;
      },null,{timeout:120000});
      const report=await page.evaluate(async()=>{
        const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
        const samples=[];
        let lastFrame=await new Promise(resolve=>requestAnimationFrame(resolve));
        for(let y=-79;y>=-178;y--){
          const start=performance.now();
          const result=t.placeFixture(1,y,1,0);
          if(t.block(1,y,1)!==0)throw Error('Excavation did not remove block at '+y);
          t.teleportCave(1,y,1);
          const actionMs=performance.now()-start;
          const nextFrame=await new Promise(resolve=>requestAnimationFrame(resolve));
          samples.push({y,actionMs,meshMs:result?.meshMs??null,
            uploadMs:result?.uploadMs??null,saveMs:result?.saveMs??null,
            saved:result?.saved??null,reusedGpuBuffers:result?.reusedGpuBuffers??null,
            gpuStageTimes:result?.gpuStageTimes??null,
            frameMs:nextFrame-lastFrame,
            resident:Number(scene.dataset.loadedChunks),
            pending:Number(scene.dataset.pendingChunks)});
          lastFrame=nextFrame;
        }
        const stat=key=>{
          const a=samples.map(s=>s[key]).filter(Number.isFinite).sort((a,b)=>a-b);
          if(!a.length)return null;
          return {p50:+a[Math.floor((a.length-1)*.5)].toFixed(2),
            p95:+a[Math.floor((a.length-1)*.95)].toFixed(2),
            max:+a.at(-1).toFixed(2),
            mean:+(a.reduce((s,n)=>s+n,0)/a.length).toFixed(2)};
        };
        return {count:samples.length,action:stat('actionMs'),
          mesh:stat('meshMs'),upload:stat('uploadMs'),
          save:stat('saveMs'),frame:stat('frameMs'),
          totalReusedGpuBuffers:samples.reduce((n,s)=>n+(s.reusedGpuBuffers??0),0),
          // Source GL function timings explain the real stalls; gate unchanged.
          gpuStageP95:Object.fromEntries(
            ['createBufferMs','drainErrorMs','bindBufferMs','allocateBufferMs',
              'bufferSubDataMs','checkErrorMs','batchDrainErrorMs','batchCheckErrorMs','fallbackUploadMs'].map(key=>{
              const values=samples.map(s=>s.gpuStageTimes?.[key]??0).sort((a,b)=>a-b);
              return [key,+values[Math.floor((values.length-1)*.95)].toFixed(2)];
            })),
          gpuUploadedBytes:samples.reduce((n,s)=>n+(s.gpuStageTimes?.uploadBytes??0),0),
          framesOver33:samples.filter(s=>s.frameMs>33).length,
          maxResident:Math.max(...samples.map(s=>s.resident)),
          maxPending:Math.max(...samples.map(s=>s.pending)),
          allCandidateSavesVerified:samples.every(s=>s.saved===true),
          atSectionBoundaries:samples.filter(s=>[-83,-99,-115,-131,-147,-163].includes(s.y)),
          finalFeet:Number(scene.dataset.playerFeet)};
      });
      assert.equal(report.count,100);
      assert.ok(report.maxResident<=27,'Exceeded established 27 GPU deep budget');
      assert.ok(report.finalFeet<-175,'Did not excavate across deep sections');
      if(label==='candidate')assert.equal(report.allCandidateSavesVerified,true);
      await page.screenshot({path:`artifacts/rapid-dig-${label}-${width}x${height}.png`,fullPage:true});
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
      assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-178,1)),
        0,'Deep edits did not survive save/reload');
      assert.deepEqual(errors,[],'WebGL2 gameplay page errors');
      all.push({label,viewport:`${width}x${height}`,profile:fixture.profile,...report});
      console.log('RAPID_DIG_METRICS',JSON.stringify(all.at(-1)));
    }finally{await context.close();}
  }
  await writeFile(`artifacts/rapid-dig-${label}-metrics.json`,JSON.stringify(all,null,2)+'\n');
  console.log('PASS authentic 100 edits x 4 viewports, real GPU, depth transitions and reload');
}finally{await browser.close();}
