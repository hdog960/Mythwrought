// S6 DETACHED actual-game WebGL2 browser-color research; NOT a shipping
// renderer change. Both paths load the original full game at localhost.
// Only the candidate page intercepts src/voxel.mjs IN MEMORY, then calls
// the exact existing detached S6 winter-tone proposal for original M7
// unedited snow caps. This cannot edit M7 saves, the repo or user PWA.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';

const root='artifacts/snow-s6-original-webgl2',seed=179;
await mkdir(root,{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex');
const head=process.env.GITHUB_SHA||process.env.SNOW_S6_EXACT_HEAD||null;
const source=await readFile('src/voxel.mjs','utf8');
const needle='const groundColor=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?BIOME_GROUND_COLORS.get(id):undefined;';
const hits=source.split(needle).length-1;
assert.equal(hits,1,'Exact original M7 renderer color selection changed; refuse intercept');
const injection=`import {previewSnowS6WinterTone as proposedWinterTone} from './manual-biomes/snowy-s6-winter-tone-proposal.mjs';
import {v6BiomeAt as snowClimateAt} from './manual-biomes/v6-balanced-biomes.mjs';
`;
const replacement=`const winterZone=unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))&&
  (id===272||id===276||id===279)?snowClimateAt(x,z,world.seed):null;
const winterColor=winterZone?.name==='snow'?
  proposedWinterTone(world.seed,x,z,id,winterZone.weight).proposedLinearRgb:undefined;
const groundColor=winterColor??(unifiedTerrain&&!world.edits?.has(worldKey(x,y,z))?
  BIOME_GROUND_COLORS.get(id):undefined);`;
const modified=injection+source.replace(needle,replacement);
assert.equal(modified.split('proposedWinterTone(world.seed').length-1,1);
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
const aim=[-144,8,528],viewport={width:844,height:390};
const metrics=[];
let chosen=null;
async function capture(stage){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,
    hasTouch:true,isMobile:true,serviceWorkers:'block'});
  try{
    const page=await context.newPage(),errors=[];
    page.on('pageerror',err=>errors.push(String(err?.message??err)));
    page.on('dialog',dialog=>dialog.accept());
    let intercepted=0;
    if(stage==='candidate'){
      await page.route('**/src/voxel.mjs',async route=>{
        intercepted++;
        const response=await route.fetch();
        assert.equal(response.status(),200,'Original source module unavailable');
        const actual=await response.text();
        assert.equal(sha(Buffer.from(actual)),sha(Buffer.from(source)),
          'Browser source does not match pinned real repository voxel module');
        await route.fulfill({status:200,contentType:'text/javascript',
          body:modified});
      });
    }
    await page.goto('http://127.0.0.1:4173/',{
      waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForFunction(()=>{
      const api=window.__mythwroughtTest,canvas=document.querySelector('#scene');
      return api?.snapshot().seed===179&&
        api.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-v7'&&
        Number(canvas?.dataset.renderedFrames)>2&&
        Number(canvas?.dataset.loadedChunks)>=25&&
        Number(canvas?.dataset.pendingChunks)===0;
    },null,{timeout:110000});
    const scene=await page.evaluate(({aim,chosen})=>{
      const api=window.__mythwroughtTest;
      const ice=api.block(...aim);
      if(ice!==276)throw Error('Actual original physical glacier ID276 disappeared');
      const sites=chosen?[chosen]:[
        [aim[0],17,aim[2]-12],[aim[0]+3,17,aim[2]-11],
        [aim[0]-4,17,aim[2]-10],[aim[0],16,aim[2]-8],
        [aim[0]+6,18,aim[2]-8],[aim[0]-6,18,aim[2]-8],
        [aim[0],19,aim[2]-12],[aim[0]-6,19,aim[2]-10]
      ];
      let selected=null,pose=null;
      for(const c of sites){
        try{pose=api.teleportCave(...c);selected=c;break;}catch{}
      }
      if(!selected)throw Error('No exact collision-safe original glacier overlook');
      api.aimAt(...aim);
      return {selected,pose,aim,ice,seed:api.snapshot().seed,
        profile:api.fourBiomeProfile()?.generator};
    },{aim,chosen});
    if(chosen===null)chosen=scene.selected;
    assert.deepEqual(scene.selected,chosen,'Candidate did not use original camera');
    assert.equal(scene.ice,276);assert.equal(scene.seed,179);
    assert.equal(scene.profile,'mythwrought-five-surface-regions-v7');
    await page.waitForFunction(()=>{
      const canvas=document.querySelector('#scene');
      return canvas?.dataset.skyS6WorldBiomeName==='snow'&&
        Number(canvas.dataset.pendingChunks)===0&&
        Number(canvas.dataset.loadedChunks)>=25;
    },null,{timeout:110000});
    const frames=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
    await page.waitForFunction(n=>Number(document.querySelector('#scene').dataset.renderedFrames)>=n+8,
      frames,{timeout:60000});
    const gl=await page.evaluate(()=>{
      const canvas=document.querySelector('#scene'),
        context=canvas.getContext('webgl2');
      return {present:!!context,version:context?.getParameter(context.VERSION),
        width:canvas.width,height:canvas.height,
        loadedChunks:Number(canvas.dataset.loadedChunks),
        pendingChunks:Number(canvas.dataset.pendingChunks),
        biome:canvas.dataset.skyS6WorldBiomeName,
        renderedFrames:Number(canvas.dataset.renderedFrames)};
    });
    assert.ok(gl.present&&gl.version.includes('WebGL 2'),'Real game WebGL2 not loaded');
    assert.equal(gl.biome,'snow');assert.equal(gl.pendingChunks,0);
    assert.deepEqual(errors,[],'Real game page errors');
    assert.equal(intercepted,stage==='candidate'?1:0);
    const filename=stage+'-snow-real-game-844x390.png';
    const bytes=await page.screenshot({path:root+'/'+filename,timeout:90000});
    const png=pngjs.PNG.sync.read(bytes);
    assert.deepEqual([png.width,png.height],[viewport.width,viewport.height]);
    const metadata={stage,filename,sha256:sha(bytes),
      sourceSha256:sha(Buffer.from(stage==='candidate'?modified:source)),
      originalSourceSha256:sha(Buffer.from(source)),
      injectedScriptOnly:stage==='candidate',intercepted,
      viewport,scene,gl,captureErrors:errors};
    metrics.push(metadata);
    console.log('SNOW_S6_REAL_WEBGL2_CAPTURE '+JSON.stringify(metadata));
  }finally{await context.close()}
}
try{
  await capture('original');
  await capture('candidate');
}finally{await browser.close()}
assert.equal(metrics.length,2);
const original=metrics[0],candidate=metrics[1];
assert.deepEqual(original.scene,candidate.scene,
  'Real game viewport/camera/ice/profile source not identical');
assert.deepEqual(original.viewport,candidate.viewport);
const a=pngjs.PNG.sync.read(await readFile(root+'/'+original.filename));
const b=pngjs.PNG.sync.read(await readFile(root+'/'+candidate.filename));
let different=0,changedStrong=0,skyExcluded=0,colorShift=0;
const x0=Math.round(a.width*.18),x1=Math.round(a.width*.82);
const y0=Math.round(a.height*.22),y1=Math.round(a.height*.9);
for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const i=(y*a.width+x)*4;
  const d=Math.max(Math.abs(a.data[i]-b.data[i]),
    Math.abs(a.data[i+1]-b.data[i+1]),
    Math.abs(a.data[i+2]-b.data[i+2]));
  if(d>0)different++;
  if(d>=10)changedStrong++;
  colorShift+=d;
  skyExcluded++;
}
const result={kind:'detached-S6-injected-source-actual-game-WebGL2',
  head,original,candidate,roiPixels:skyExcluded,
  roiChangedFraction:different/skyExcluded,
  roiStrongChangedFraction:changedStrong/skyExcluded,
  roiMeanMaxChannelDifference:colorShift/skyExcluded,
  actualGameAndOriginalPhysicalWorld:true,
  inMemoryBrowserOnly:true,notIntegratedIntoLiveM7:true,
  noSourceFileOrSchemaChanges:true,
  noIPhoneHomeScreenAcceptance:true};
console.log('SNOW_S6_REAL_WEBGL2_PAIR '+JSON.stringify(result));
assert.notEqual(original.sha256,candidate.sha256,
  'Candidate did not produce any visual change in real game');
assert.ok(result.roiChangedFraction>.005,
  'Original real-game snow scene did not exhibit a measurable candidate change');
await writeFile(root+'/evidence.json',JSON.stringify(result,null,2)+'\n');
