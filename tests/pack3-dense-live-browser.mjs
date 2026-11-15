// Browser-only dense Pack 3 acceptance. A source-authentic bulk builder
// blueprint is staged into this isolated browser context, then loaded by
// Mythwrought's real game, real section mesher and WebGL2 render pipeline.
// NOT physical iPhone testing, NOT an automated settlement placement feature.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {mkdir,writeFile} from 'node:fs/promises';
const {PNG}=pngjs;
const views=[[667,375],[844,390],[932,430]],evidence=[];
await mkdir('artifacts/pack3-dense-browser',{recursive:true});
const browser=await chromium.launch({headless:true,
 args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
       '--enable-unsafe-swiftshader']});
async function sampleFrames(page,howMany=28){
 return page.evaluate(async n=>{
  const frames=[];let last=0;
  for(let i=0;i<n;i++){
   const now=await new Promise(resolve=>requestAnimationFrame(resolve));
   if(last)frames.push(now-last);
   last=now;
  }
  const sorted=frames.slice().sort((a,b)=>a-b);
  return {samples:sorted.length,p50Ms:sorted[Math.floor(sorted.length*.5)],
   p95Ms:sorted[Math.ceil(sorted.length*.95)-1],
   worstMs:sorted.at(-1),
   slowerThan33ms:sorted.filter(ms=>ms>33.4).length};
 },howMany);
}
try{
 for(const [width,height] of views){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
    hasTouch:true,isMobile:true});
  const page=await context.newPage(),faults=[],badResponses=[];
  page.on('pageerror',e=>faults.push(e.message));
  page.on('response',r=>{if(r.status()>=400)badResponses.push(r.url()+' '+r.status());});
  try{
   await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__mythwroughtTest&&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
     null,{timeout:60000});
   const initial=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,c=document.querySelector('#scene');
    return {seed:t.snapshot().seed,chunks:t.snapshot().chunks,
     gpu:!!c.getContext('webgl2'),vertices:Number(c.dataset.renderedMeshVertices),
     canonical:localStorage.getItem('mythwrought-v002-world-179'),
     originalSidecar:localStorage.getItem('mythwrought-pack3-construction-v1:179')};
   });
   assert.equal(initial.gpu,true);
   assert.equal(initial.seed,179);
   assert.equal(initial.chunks.length,25);
   assert.equal(initial.originalSidecar,null);
   const baseline=await sampleFrames(page);
   const staged=await page.evaluate(async ()=>{
    const {createPack3RuntimeStage,meshPack3PhysicalAsset,
      PACK3_RUNTIME_CHUNK_VERTEX_LIMIT}=await import('/src/builder-assets/pack3-runtime.mjs');
    const t=window.__mythwroughtTest,seed=t.snapshot().seed;
    const chunks=t.snapshot().chunks.filter(k=>k.split(',').length===2)
     .map(k=>k.split(',').map(Number))
     .sort((a,b)=>(Math.abs(a[0])+Math.abs(a[1]))-
       (Math.abs(b[0])+Math.abs(b[1]))||a[0]-b[0]||a[1]-b[1]);
    const shape=meshPack3PhysicalAsset('pack3:069',1);
    if(shape.vertexCount*16>PACK3_RUNTIME_CHUNK_VERTEX_LIMIT)
      throw Error('Dense physical building exceeds budget before browser launch');
    const records=[],chunkCounts=[];
    const fakeWorld={seed,edits:new Map(),get:(x,y,z)=>t.block(x,y,z)};
    for(const [cx,cz] of chunks){
      const selected=[];
      for(let dz=0;dz<16&&selected.length<16;dz++)
       for(let dx=0;dx<16&&selected.length<16;dx++){
        const x=cx*16+dx,y=19,z=cz*16+dz;
        if(t.block(x,y,z)===0)selected.push({at:[x,y,z],
          asset:'pack3:069',orientation:1});
       }
      if(selected.length<16)continue;
      records.push(...selected);
      chunkCounts.push({cx,cz,count:selected.length});
      if(chunkCounts.length===16)break;
    }
    if(records.length!==256)throw Error('Need 256 genuinely vacant cells in 16 visible surface chunks, found '+records.length);
    const stage=createPack3RuntimeStage(fakeWorld,{worldId:'seed-'+seed});
    const start=performance.now();
    if(stage.placeMany(records)!==256)throw Error('Bulk source stage incomplete');
    const stageMs=performance.now()-start;
    const predicted=shape.vertexCount*256;
    const serialized=stage.serialize();
    if(serialized.length>400000)throw Error('Physical save too large');
    const key='mythwrought-pack3-construction-v1:'+seed;
    if(localStorage.getItem(key)!==null)throw Error('Existing construction must never be replaced by acceptance test');
    localStorage.setItem(key,serialized);
    if(localStorage.getItem(key)!==serialized)throw Error('Physical save readback mismatch');
    return {records,stageMs,bytes:serialized.length,predicted,chunkCounts,
      perChunkVertices:shape.vertexCount*16};
   });
   assert.equal(staged.records.length,256);
   assert.equal(staged.chunkCounts.length,16);
   assert.ok(staged.perChunkVertices<=12000);
   await page.reload({waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__mythwroughtTest&&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
     Number(document.querySelector('#scene')?.dataset.pack3PhysicalCount)===256,
     null,{timeout:90000});
   const live=await page.evaluate(records=>{
    const t=window.__mythwroughtTest,c=document.querySelector('#scene');
    return {count:Number(c.dataset.pack3PhysicalCount),
     chunks:Number(c.dataset.loadedChunks),
     vertices:Number(c.dataset.renderedMeshVertices),
     gpu:!!c.getContext('webgl2'),
     positions:records.map(r=>t.pack3Block(...r.at)?.id??null),
     rotations:records.map(r=>t.pack3Block(...r.at)?.yaw??null),
     canonical:localStorage.getItem('mythwrought-v002-world-179')};
   },staged.records);
   assert.equal(live.count,256);assert.equal(live.chunks,25);
   assert.equal(live.gpu,true);
   assert.deepEqual(live.positions,Array(256).fill(116));
   assert.deepEqual(live.rotations,Array(256).fill(1));
   assert.ok(live.vertices>=initial.vertices+staged.predicted,
     'Full source-authentic dense mesh was not uploaded to real WebGL2 chunks');
   assert.equal(live.canonical,initial.canonical);
   const busy=await sampleFrames(page);
   const centered=staged.records[Math.floor(staged.records.length/2)].at;
   await page.evaluate(at=>{
     const t=window.__mythwroughtTest;t.teleport(at[0]-2,at[2]-2);t.aimAt(...at);
   },centered);
   await page.waitForTimeout(600);
   const png=PNG.sync.read(await page.screenshot({
     path:`artifacts/pack3-dense-browser/dense-real-webgl2-${width}x${height}.png`}));
   assert.equal(png.width,width);assert.equal(png.height,height);
   const distinct=new Set();
   for(let y=Math.floor(height*.2);y<Math.floor(height*.8);y+=7)
    for(let x=Math.floor(width*.17);x<Math.floor(width*.83);x+=7){
     const i=(y*png.width+x)*4;
     distinct.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
    }
   assert.ok(distinct.size>=6,'Actual game screenshot lacks visible scene variation');
   assert.deepEqual(faults,[],'Live game threw a JavaScript exception');
   assert.deepEqual(badResponses,[],'Game requested unavailable source assets');
   const row={viewport:`${width}x${height}`,backend:'Chromium SwiftShader WebGL2',
    physicalIPhoneTested:false,framePacingCertified:false,
    physicalBlocks:256,visibleChunkBudget:live.chunks,
    predictedAddedVertices:staged.predicted,actualAddedVertices:live.vertices-initial.vertices,
    perChunkAddedVertices:staged.perChunkVertices,
    stageMs:staged.stageMs,sidecarBytes:staged.bytes,
    screenshotColorBuckets:distinct.size,canonicalSaveUnchanged:true,
    baselineFrames:baseline,denseFrames:busy};
   evidence.push(row);
   console.log('PASS Pack3 256-voxel live WebGL2 scene',JSON.stringify(row));
  }finally{await context.close();}
 }
}finally{await browser.close();}
await writeFile('artifacts/pack3-dense-browser/evidence.json',
 JSON.stringify({description:'Real game with 256 separately saved Pack 3 voxels',
  userHardwareFPSMeasured:false,evidence},null,2)+'\n');
