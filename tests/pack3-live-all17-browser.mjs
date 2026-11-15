// Genuine end-to-end gameplay WebGL2 acceptance of ALL 17 Pack 3 physical IDs.
// This complements the existing normal iPhone PLACE-button test for ID 116.
// It never claims performance results from software Chromium are physical iPhone FPS.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const dims=[[667,375],[844,390],[932,430]];
const browser=await chromium.launch({headless:true,
 args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const evidence=[];
await mkdir('artifacts/pack3-live-all17',{recursive:true});
try{
 for(const [width,height] of dims){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)requests.push(response.url()+' '+response.status());});
  try{
   await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__mythwroughtTest&&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:60000});
   const legacy=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
   const snapshot=await page.evaluate(()=>{
    const canvas=document.querySelector('#scene');
    return {webgl2:!!canvas.getContext('webgl2'),
      chunks:Number(canvas.dataset.loadedChunks),
      renderedVertices:Number(canvas.dataset.renderedMeshVertices),
      physical:Number(canvas.dataset.pack3PhysicalCount)};
   });
   assert.equal(snapshot.webgl2,true);
   assert.equal(snapshot.chunks,25);
   assert.equal(snapshot.physical,0);
   const created=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,records=[],durations=[];
    let i=0;
    // Deterministic, real empty live world cells; not painted mock geometry.
    for(let z=0;z<=10&&i<17;z++)for(let x=12;x<=26&&i<17;x++){
     const y=19;
     if(t.block(x,y,z)!==0)continue;
     const id=109+i,orientation=id<=112?0:i%4;
     const start=performance.now();
     t.placePack3Fixture(x,y,z,id,orientation);
     durations.push(performance.now()-start);
     const entry=t.pack3Block(x,y,z);
     if(!entry||entry.id!==id||entry.yaw!==orientation)
       throw Error('Wrong physical shape ID/yaw in real runtime at '+[x,y,z]);
     records.push({id,at:[x,y,z],orientation});
     i++;
    }
    if(i!==17)throw Error('Insufficient naturally empty source-world cells for all 17');
    return {records,durations};
   });
   assert.equal(created.records.length,17);
   assert.deepEqual(created.records.map(r=>r.id),Array.from({length:17},(_,i)=>109+i));
   await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.pack3PhysicalCount)===17);
   const initial=await page.evaluate(()=>{
    const c=document.querySelector('#scene');
    return {chunks:Number(c.dataset.loadedChunks),
      physical:Number(c.dataset.pack3PhysicalCount),
      vertices:Number(c.dataset.renderedMeshVertices),
      canonical:localStorage.getItem('mythwrought-v002-world-179'),
      overlay:JSON.parse(localStorage.getItem('mythwrought-pack3-construction-v1:179'))};
   });
   assert.equal(initial.chunks,25,'Physical building inflated the GPU chunk budget');
   assert.equal(initial.physical,17);
   assert.ok(initial.vertices>snapshot.renderedVertices,
     'Actual physical vertices not present in live gameplay WebGL2 chunks');
   assert.equal(initial.overlay.entries.length,17);
   assert.equal(initial.canonical,legacy,'Adding physical construction modified legacy schema-1 save');
   const target=created.records[8].at;
   await page.evaluate(cell=>{
    const d=window.__mythwroughtTest;
    d.teleport(cell[0]-1.5,cell[2]-1);
    d.aimAt(...cell);
   },target);
   await page.waitForTimeout(600);
   const png=await page.screenshot({path:`artifacts/pack3-live-all17/all17-game-webgl2-${width}x${height}.png`});
   const image=PNG.sync.read(png),samples=new Set();
   assert.equal(image.width,width);assert.equal(image.height,height);
   for(let y=Math.floor(height*.2);y<Math.floor(height*.8);y+=9)
    for(let x=Math.floor(width*.18);x<Math.floor(width*.82);x+=9){
     const off=(y*image.width+x)*4;
     samples.add([image.data[off]>>4,image.data[off+1]>>4,image.data[off+2]>>4].join(','));
    }
   assert.ok(samples.size>=5,'Gameplay screenshot is blank');
   await page.reload({waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__mythwroughtTest&&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:60000});
   const restored=await page.evaluate(records=>{
    const t=window.__mythwroughtTest;
    return records.map(r=>({
      id:t.pack3Block(...r.at)?.id,yaw:t.pack3Block(...r.at)?.yaw
    }));
   },created.records);
   for(let i=0;i<17;i++){
    assert.equal(restored[i].id,created.records[i].id);
    assert.equal(restored[i].yaw,created.records[i].orientation);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),legacy);
   const removed=await page.evaluate(records=>{
    const t=window.__mythwroughtTest;
    for(const r of records){if(!t.removePack3Fixture(...r.at).ok)throw Error('Remove failed');}
    return {remaining:Number(document.querySelector('#scene').dataset.pack3PhysicalCount),
      saved:JSON.parse(localStorage.getItem('mythwrought-pack3-construction-v1:179')).entries.length};
   },created.records);
   assert.equal(removed.saved,0);
   await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.pack3PhysicalCount)===0);
   assert.deepEqual(errors,[],'Game JS runtime errors');
   assert.deepEqual(requests,[],'Missing runtime assets');
   const ordered=created.durations.slice().sort((a,b)=>a-b);
   const p95=ordered[Math.ceil(ordered.length*.95)-1];
   evidence.push({viewport:`${width}x${height}`,gpu:'actual WebGL2',
     sourceIds:created.records.map(x=>x.id),yaw:created.records.map(x=>x.orientation),
     physicalPieces:17,verticesAdded:initial.vertices-snapshot.renderedVertices,
     chunks:initial.chunks,reloaded:17,removed:17,canonicalSchema1Unchanged:true,
     p95ConstructionEditMs:p95,maxConstructionEditMs:Math.max(...ordered),
     screenshotSamples:samples.size,physicalIPhoneTested:false});
   console.log('PASS Pack3 all17 live WebGL2',JSON.stringify(evidence.at(-1)));
  }finally{await context.close();}
 }
}finally{await browser.close();}
await writeFile('artifacts/pack3-live-all17/evidence.json',
 JSON.stringify({source:'Mythwrought real browser game',viewports:dims,
  physicalIPhoneTested:false,hardwareFPSApproved:false,
  softwareChromiumTimesAreNotHardwareFPS:true,evidence},null,2)+'\n');
