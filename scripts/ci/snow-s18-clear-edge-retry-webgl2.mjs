// Actual current release source, using the real S17 natural world class.
// Localhost-only disposable renderer hook, NO profile registration, UI
// changes, storage loader, manifest forest overlay or production writes.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const dir='artifacts/snow-s18-edge-retry';
await mkdir(dir,{recursive:true});
const main=await readFile('src/main.mjs','utf8');
const anchor='window.__mythwroughtTest=Object.freeze({';
assert.equal(main.split(anchor).length-1,1);
const hook=`window.__mythwroughtTest=Object.freeze({
  snowS17Preview(seed,stage,kind,preferred){
    const baseline=new FourRegionWorld(seed,{kind:'mythwrought-generation-profile',version:1,generator:ENCHANTED_P2_GENERATOR,seed});
    const candidate=new ExperimentalSnowS17World(seed);
    let camera=preferred;
    // Every candidate target is an actual measured physical taper from the
    // accepted original seed2026 desert/snow transect, not a fixture.
    const targets=[];
    for(let d=0;d<=60;d++)for(let lateral=-4;lateral<=4;lateral++){
      const x=320+lateral,z=-1805-d,a=baseline._columnPlan(x,z),b=candidate._columnPlan(x,z);
      if(!a.size||!b.size)continue;
      const oldTop=Math.max(...a.keys()),top=Math.max(...b.keys()),id=b.get(top);
      if(oldTop!==top+1||![272,279].includes(id)||a.get(oldTop)!==id||
        baseline.get(x,oldTop,z)!==id||candidate.get(x,oldTop,z)!==0||
        candidate.get(x,top,z)!==id)continue;
      targets.push([x,top,z]);
    }
    if(targets.length<1)throw Error('No actual source taper witnesses');
    const visible=(x,y,z,target,aim)=>{
      const eye=[x+.5,y+1.56,z+.5],direction=aim.map((v,i)=>v+.5-eye[i]);
      const distance=Math.hypot(...direction);
      const hits=[baseline,candidate].map(w=>{
        const hit=raycast(w,eye,direction,distance+2.5);
        if(!hit)return null;
        const [a,b,c]=hit.hit,id=w.get(a,b,c);
        if(![272,276,279].includes(id)||Math.abs(a-target[0])>2||
           Math.abs(c-target[2])>2||hit.distance<5)return null;
        return {at:hit.hit,id,distance:hit.distance};
      });
      return hits.every(Boolean)?hits:null;
    };
    const grounded=(x,y,z)=>!collides(baseline,x+.5,y+.01,z+.5)&&!collides(candidate,x+.5,y+.01,z+.5)&&
      collides(baseline,x+.5,y-.055,z+.5)&&collides(candidate,x+.5,y-.055,z+.5);
    if(!camera){
      outer:for(const target of targets){
        for(const radius of [6,8,10,12,14,16]){
          for(const [dx,dz] of [[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1],[-.5,-1],[.5,-1],[-1,.5],[1,.5],[-.5,1],[.5,1],[-1,-.5],[1,-.5]]){
            const x=target[0]+Math.round(dx*radius),z=target[2]+Math.round(dz*radius);
            for(let y=19;y>=3;y--){
              if(!grounded(x,y,z))continue;
              // One fixed aim for BOTH worlds. Aim at different heights
              // within the physical changed shelf, not different cameras.
              for(const lift of [0,.5,1,-.25]){
                const aim=[target[0],target[1]+lift,target[2]],hits=visible(x,y,z,target,aim);
                if(hits){camera={position:[x,y,z],target,aim,hits};break outer;}
              }
            }
          }
        }
      }
    }
    if(!camera)throw Error('No common grounded terrain-visible camera across '+targets.length+' actual taper columns');
    const {target,aim}=camera,[x,y,z]=camera.position;
    if(!targets.some(t=>t.every((v,i)=>v===target[i]))||!grounded(x,y,z)||!visible(x,y,z,target,aim))
      throw Error('Preferred actual generated camera unsafe or occluded');
    const selected=stage==='snow'?candidate:baseline;
    // Save refusal is deliberate for BOTH preview arms. Do not call a normal
    // world selector or enterPreparedM2World (which assumes durable saves).
    storageReadOnly=true;changed=false;
    disposeLiveMobSession();g2NewWorld();caveFarGpu.invalidate();retireLiveScenery();
    for(const c of chunks.values())deleteChunkBuffers(c);
    chunks.clear();pending.clear();wanted.clear();lastStreamingCenter='';gpuRetry.clear();
    outlineKey='';outlineCount=0;lastEditMeshKeys=[];caveSession=null;
    world=new Pack2LiveWorld(selected);world.nextPack2State=pack2Selection;
    pack3=createPack3LiveBridge(world,localStorage);
    resetManual14ForWorld();resetPack5ForWorld();
    reactivateSkyClock();
    Object.assign(player,{x:x+.5,feet:y+.01,z:z+.5,vX:0,vY:0,vZ:0,onGround:true});
    jumpQueued=false;
    const [gx,gy,gz]=target,ax=aim[0]+.5-player.x,ay=aim[1]+.5-(player.feet+1.55),az=aim[2]+.5-player.z;
    player.yaw=Math.atan2(ax,az);player.pitch=Math.atan2(ay,Math.hypot(ax,az));
    seedLabel.textContent='WORLD '+seed;
    // Original source mesh calls: no staged fixture geometry.
    const cx=Math.floor(gx/16),cz=Math.floor(gz/16);
    const original=new Pack2LiveWorld(baseline),newWorld=new Pack2LiveWorld(candidate);
    const a=meshChunk(original,cx,cz),b=meshChunk(newWorld,cx,cz);
    const tags=[0,0];
    for(let i=8;i<a.length;i+=9)if(a[i]===44)tags[0]++;
    for(let i=8;i<b.length;i+=9)if(b[i]===44)tags[1]++;
    if(tags[0]!==0||tags[1]===0)throw Error('Wind tag scope missing or leaked');
    const counts=[0,0];
    if(kind==='forest'){
      for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++)
        for(let y=4;y<=19;y++){
          if([406,407].includes(baseline.get(x,y,z)))counts[0]++;
          if([406,407].includes(candidate.get(x,y,z)))counts[1]++;
        }
    }
    return {camera,eligibleTaperTargets:targets.length,seed,stage,kind,originalMeshBytes:a.byteLength,candidateMeshBytes:b.byteLength,
      originalAndCandidateNeedleCells:counts,windVertices:tags,
      actualExperimental:world.base.experimentalSnowS17===true,
      readOnly:storageReadOnly,edits:world.edits.size};
  },
  snowS17Observe(){return {seed:world.seed,actualExperimental:world.base.experimentalSnowS17===true,
    readOnly:storageReadOnly,edits:world.edits.size,
    pose:{x:player.x,feet:player.feet,z:player.z,yaw:player.yaw,pitch:player.pitch},
    bodyClear:!collides(world,player.x,player.feet,player.z)};},
`;
const modified="import {ExperimentalSnowS17World} from './manual-biomes/snowy-s17-experimental-world.mjs';\n"+main.replace(anchor,hook);
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const viewport={width:956,height:440};
async function capture(seed,kind,stage,preferred){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 try{
  const page=await context.newPage(),errors=[];let requests=0;
  page.on('pageerror',e=>errors.push(String(e.message??e)));
  await page.route('**/src/main.mjs*',async route=>{
   const resp=await route.fetch(),body=await resp.text();assert.equal(resp.status(),200);assert.equal(sha(Buffer.from(body)),sha(Buffer.from(main)));requests++;
   await route.fulfill({status:200,contentType:'text/javascript',body:modified});
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&Number(document.querySelector('#scene').dataset.pendingChunks)===0,null,{timeout:110000});
  const preview=await page.evaluate(({seed,stage,kind,preferred})=>window.__mythwroughtTest.snowS17Preview(seed,stage,kind,preferred),{seed,stage,kind,preferred});
  assert.equal(preview.actualExperimental,stage==='snow');assert.equal(preview.readOnly,true);assert.equal(preview.edits,0);
  await page.waitForFunction(()=>{const c=document.querySelector('#scene');return Number(c.dataset.loadedChunks)>=25&&Number(c.dataset.pendingChunks)===0;},null,{timeout:110000});
  const frame=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
  await page.waitForFunction(f=>Number(document.querySelector('#scene').dataset.renderedFrames)>=f+8,frame,{timeout:60000});
  const observation=await page.evaluate(()=>window.__mythwroughtTest.snowS17Observe());
  assert.equal(observation.bodyClear,true);assert.equal(observation.edits,0);assert.equal(observation.readOnly,true);
  assert.equal(observation.seed,seed);assert.equal(observation.actualExperimental,stage==='snow');
  const gl=await page.evaluate(()=>{const c=document.querySelector('#scene'),g=c.getContext('webgl2');return {version:g?.getParameter(g.VERSION),loaded:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks),region:c.dataset.skyS6WorldBiomeName};});
  assert.ok(gl.version?.includes('WebGL 2'));assert.equal(gl.pending,0);assert.equal(requests,1);assert.deepEqual(errors,[]);
  const name=kind+'-'+stage+'-seed'+seed+'.png',bytes=await page.screenshot({path:dir+'/'+name,timeout:90000});
  const png=pngjs.PNG.sync.read(bytes);assert.deepEqual([png.width,png.height],[956,440]);
  return {name,sha256:sha(bytes),preview,observation,gl,localReadOnly:true};
 }finally{await context.close()}
}
try{
 const reports=[];
 for(const [seed,kind] of [[2026,'edge']]){
  const original=await capture(seed,kind,'original',null);
  const snow=await capture(seed,kind,'snow',original.preview.camera);
  assert.deepEqual(original.preview.camera,snow.preview.camera);
  for(const k of ['x','feet','z','yaw','pitch'])assert.ok(Math.abs(original.observation.pose[k]-snow.observation.pose[k])<.05,'Camera drift '+k);
  const a=pngjs.PNG.sync.read(await readFile(dir+'/'+original.name)),b=pngjs.PNG.sync.read(await readFile(dir+'/'+snow.name));
  let changed=0,n=0;
  for(let y=60;y<410;y++)for(let x=140;x<816;x++){
   const i=(y*956+x)*4;if(Math.max(...[0,1,2].map(k=>Math.abs(a.data[i+k]-b.data[i+k])))>=12)changed++;n++;
  }
  const report={seed,kind,original,snow,comparedPixels:n,changedFraction:changed/n,
   actualSourceGenerated:true,readOnlySceneryDisabled:true,realIphoneAcceptance:false};
  reports.push(report);console.log('SNOW_S18_CLEAR_EDGE_PAIR '+JSON.stringify(report));
  await writeFile(dir+'/report.json',JSON.stringify(reports,null,2));
  assert.ok(changed/n>.005,'Actual generated view insufficient visible difference');
 }
}finally{await browser.close()}
