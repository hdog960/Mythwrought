// One bounded real original-engine browser streaming program.
// Route is matched safe-spawn waypoints, NOT uninterrupted player walking.
// Native WebGL2 calls are observed, not replaced with simulated GPU results.
// Only candidate localhost profile response opts in; original save guard stays.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {activateFourRegionProfile,saveFourRegionWorld} from '../../src/manual-biomes/profile-storage.mjs';
import {findSafeSpawn} from '../../src/physics.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {chunkCoord} from '../../src/voxel.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../../src/seeds.mjs';
const root=process.cwd(),out=path.join(root,'artifacts/enchanted-forest/phase2-live-stream');
await mkdir(out,{recursive:true});
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const digest=x=>createHash('sha256').update(x).digest('hex');
const head=git('rev-parse','HEAD'),seed=-88;
const paths=['src/main.mjs','src/physics.mjs','src/voxel.mjs','src/manual-biomes/profile-world.mjs',
 'src/manual-biomes/environment-v7.mjs','src/manual-biomes/enchanted-tree-candidates.mjs',
 'src/nonblock/staged-habitats.mjs','src/nonblock/candidate-scene.mjs','src/gpu-recovery.mjs'];
const sourceBlobs=Object.fromEntries(paths.map(p=>[p,git('hash-object',p)]));
const original=await readFile(path.join(root,'src/manual-biomes/profile-world.mjs'),'utf8');
const needle='maxCachedColumns=MAX_COLUMNS,experimentalEnchantedTrees=false';
assert.equal(original.split(needle).length,2);
const candidateResponse=original.replace(needle,
 'maxCachedColumns=MAX_COLUMNS,experimentalEnchantedTrees=profile?.generator===M7_ENVIRONMENT_GENERATOR');
assert.ok(candidateResponse.includes("throw Error('Experimental enchanted tree candidate cannot be saved as historical M7')"));
const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const historic=new FourRegionWorld(seed,profile),candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
// Seed a genuine original empty saved world, including verified profile and
// journal, in a new memory-only storage. Never open any user-origin storage.
const map=new Map(),storage={get length(){return map.size;},key:i=>[...map.keys()][i]??null,
 getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
const baseline=activateFourRegionProfile(storage,seed,{explicitNewWorld:true,generator:M7_ENVIRONMENT_GENERATOR});
assert.equal(saveFourRegionWorld(storage,baseline).ok,true);
assert.equal(storage.getItem(SELECTED_SEED_KEY),String(seed));
const fixture=[...map],prefix=worldSlotKey(seed);
const protectedFixture=fixture.filter(([k])=>k.startsWith(prefix)).sort((a,b)=>a[0].localeCompare(b[0]));
// Same six accepted native windows, plus return to first for genuine reload.
// Prefer actual shared safe pose at each chunk's center; exact native pose
// and both climate classes must match. No generated terrain alteration.
const chunks=[[-18,-37],[-17,-37],[-16,-37],[15,-38],[16,-38],[17,-38],[-18,-37]];
const route=chunks.map(([cx,cz])=>{
 const want=v6BiomeAt(cx*16+8,cz*16+8,seed)?.name??'plains';
 for(const dx of [8,4,12,2,14])for(const dz of [8,4,12,2,14]){
  const request=[cx*16+dx,cz*16+dz];let a,b;
  try{a=findSafeSpawn(historic,...request);b=findSafeSpawn(candidate,...request);}catch{continue;}
  if(a.x!==b.x||a.z!==b.z||a.feet!==b.feet||a.feet<3||
     chunkCoord(a.x)!==cx||chunkCoord(a.z)!==cz||
     (v6BiomeAt(Math.floor(a.x),Math.floor(a.z),seed)?.name??'plains')!==want)continue;
  return {chunk:[cx,cz],request,pose:a,climate:want};
 }
 throw Error('No shared original-source safe pose in '+cx+','+cz);
});
assert.equal(new Set(route.map(r=>r.climate)).size,2);
const witness=[];
for(const [cx,cz] of chunks.slice(0,-1)){
 candidate._environmentTreeAt(cx*16,19,cz*16);
 for(const [k,id] of candidate._environmentTreeChunks.get(cx+','+cz)??[]){
  const p=k.split(',').map(Number),old=historic.get(...p);
  if(candidate.get(...p)===id&&old!==id&&witness.length<24)
   witness.push({p,historical:old,candidate:id});
 }
}
assert.ok(witness.length>=4,'actual changed tree voxels must be present near route');
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
 '.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml',
 '.webmanifest':'application/manifest+json'};
async function serve(proto){
 const server=createServer(async(req,res)=>{
  try{
   const uri=new URL(req.url,'http://127.0.0.1'),rel=decodeURIComponent(uri.pathname);
   const file=path.resolve(root,'.'+rel);
   if(file!==root&&!file.startsWith(root+path.sep))throw Error('outside checkout');
   const target=file===root?path.join(root,'index.html'):file;
   const bytes=proto&&rel==='/src/manual-biomes/profile-world.mjs'?Buffer.from(candidateResponse):await readFile(target);
   res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(bytes);
  }catch(e){res.writeHead(404);res.end(String(e));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {server,url:'http://127.0.0.1:'+server.address().port};
}
const results=[],faults=[];
let browser=null,servers=[];
async function run(origin,proto){
 const mode=proto?'candidate':'historical';
 const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,
  isMobile:true,hasTouch:true,serviceWorkers:'block'});
 // Instrument browser-owned methods only by forwarding the exact native call
 // and recording successful JS return. No getError drain, injected faults,
 // false upload success, synthetic rendering or modified original main.
 await context.addInitScript(({fixture})=>{
  for(const [k,v] of fixture)localStorage.setItem(k,v);
  const p=WebGL2RenderingContext.prototype,states=new WeakMap(),records=new Map();
  let bytes=0,peak=0,creates=0,deletes=0,uploads=0,subUploads=0,uploadBytes=0,maxUpload=0;
  const state=g=>{if(!states.has(g))states.set(g,new Map());return states.get(g);};
  function wrap(n,fn){const orig=p[n];p[n]=function(...args){const ret=Reflect.apply(orig,this,args);fn(this,args,ret);return ret;};}
  wrap('createBuffer',(_,a,b)=>{if(b){creates++;records.set(b,0);}});
  wrap('bindBuffer',(g,[target,b])=>state(g).set(target,b));
  wrap('bufferData',(g,a)=>{
   const b=state(g).get(a[0]),data=a[1];if(!b)return;
   const size=typeof data==='number'?data:(data?.byteLength??0);
   const prior=records.get(b)??0;records.set(b,size);bytes+=size-prior;
   peak=Math.max(peak,bytes);uploads++;uploadBytes+=size;maxUpload=Math.max(maxUpload,size);
  });
  wrap('bufferSubData',(_,a)=>{subUploads++;});
  wrap('deleteBuffer',(_,a)=>{const b=a[0];if(records.has(b)){bytes-=records.get(b);records.delete(b);deletes++;}});
  Object.defineProperty(window,'__enchantedUploadObservation',{value:()=>({
   logicalBufferBytes:bytes,peakLogicalBufferBytes:peak,trackedBuffers:records.size,
   creates,deletes,uploads,subUploads,uploadBytes,maxUpload})});
 },{fixture});
 const page=await context.newPage(),errors=[],warnings=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(/upload failed|staging scene disabled|webgl.*error/i.test(m.text()))warnings.push(m.text());});
 const rows=[];
 const record={mode,rows,errors,warnings};results.push(record);
 const readProtected=()=>page.evaluate(prefix=>Object.keys(localStorage).filter(k=>k.startsWith(prefix)).sort((a,b)=>a.localeCompare(b)).map(k=>[k,localStorage.getItem(k)]),prefix);
 try{
  await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(({seed,generator})=>window.__mythwroughtTest?.snapshot()?.seed===seed&&
   window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,{seed,generator:M7_ENVIRONMENT_GENERATOR},{timeout:90000});
  if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
  assert.deepEqual(await readProtected(),protectedFixture,'startup changed protected save/profile bytes');
  const actual=await page.evaluate(w=>w.map(r=>window.__mythwroughtTest.block(...r.p)),witness);
  assert.deepEqual(actual,witness.map(r=>r[mode]),'actual original browser block reader differs from source');
  record.treeWitnesses=actual.length;
  let previous=null;
  for(const stop of route){
   const t=await page.evaluate(({request,pose})=>{
    const a=window.__mythwroughtTest,pos=a.teleport(...request);
    a.setOrientation(Math.PI/2,0);
    return {pos,frame:Number(document.getElementById('scene').dataset.renderedFrames||0),gl:window.__enchantedUploadObservation()};
   },stop);
   assert.deepEqual({x:t.pos.x,z:t.pos.z,feet:t.pos.feet},{x:stop.pose.x,z:stop.pose.z,feet:stop.pose.feet});
   const key=stop.chunk.join(',');
   await page.waitForFunction(({key,frame})=>{
    const d=document.getElementById('scene').dataset;
    return d.chunkCenter===key&&Number(d.pendingChunks)===0&&Number(d.loadedChunks)===25&&
     Number(d.renderedMeshVertices)>0&&Number(d.renderedFrames)>=frame+3;
   },{key,frame:t.frame},{timeout:180000});
   const row=await page.evaluate(async()=>{
    const a=window.__mythwroughtTest,c=document.getElementById('scene');
    // Sample actual animation callbacks, without stepping or faking physics.
    const times=[];await new Promise(resolve=>{
     function frame(now){times.push(now);if(times.length<13)requestAnimationFrame(frame);else resolve();}
     requestAnimationFrame(frame);
    });
    const d=c.dataset,s=a.snapshot(),gl=c.getContext('webgl2');
    const n=k=>Number(d[k]??0),intervals=times.slice(1).map((v,i)=>v-times[i]).sort((a,b)=>a-b);
    return {pose:a.m5ObservedPose(),center:d.chunkCenter,biome:d.skyS6WorldBiomeName,
     loaded:n('loadedChunks'),pending:n('pendingChunks'),terrainVertices:n('renderedMeshVertices'),
     sceneryVertices:n('nonblockVertices'),sceneryBytes:n('nonblockGpuBytes'),
     instances:n('nonblockInstances'),farInstances:n('nonblockFarInstances'),
     sceneryDraws:n('nonblockDrawCalls'),effects:n('nonblockEffects'),effectVertices:n('nonblockEffectVertices'),
     sceneState:d.nonblockSaveState,effectFrame:n('nonblockEffectFrame'),
     gpuRetry:s.gpuRetry,gpuFaults:a.gpuUploadFaults(),graphics:s.graphics,
     chunkKeys:s.chunks,meshCadence:s.meshCadence,webgl2:!!gl,
     glContextLost:gl.isContextLost(),gl:window.__enchantedUploadObservation(),
     rafSampleCount:intervals.length,rafP95Ms:intervals[Math.ceil(intervals.length*.95)-1],
     framebuffer:[c.width,c.height]};
   });
   row.uploadsSinceWaypoint=row.gl.uploads-t.gl.uploads;
   row.retiredPriorKeys=previous?previous.filter(k=>!row.chunkKeys.includes(k)).length:0;
   row.request=stop.request;rows.push(row);
   assert.equal(row.center,key);assert.equal(row.biome,stop.climate);
   assert.equal(row.loaded,25);assert.equal(row.pending,0);
   assert.equal(row.chunkKeys.length,25);
   assert.equal(new Set(row.chunkKeys).size,25);
   assert.equal(row.webgl2,true);assert.equal(row.glContextLost,false);
   assert.equal(row.graphics.shaderReady,true);assert.equal(row.graphics.lossCount,0);
   assert.equal(row.gpuRetry.failures,0);assert.deepEqual(row.gpuFaults,[]);
   assert.equal(row.sceneState,'ready');
   assert.ok(row.sceneryBytes===row.sceneryVertices*36&&row.sceneryBytes<=8*1024*1024);
   assert.ok(row.farInstances<=row.instances&&row.effects<=16);
   assert.ok(row.gl.logicalBufferBytes>=row.terrainVertices*36);
   // Original 25 * 8 MiB per terrain upload is a theoretical maximum, not
   // measured GPU RAM. Strict diagnostic cap for this specific small sample.
   assert.ok(row.gl.peakLogicalBufferBytes<=64*1024*1024,'logical buffer staging budget exceeded');
   if(previous){assert.ok(row.retiredPriorKeys>0);assert.ok(row.uploadsSinceWaypoint>0);}
   previous=row.chunkKeys;
   assert.deepEqual(await readProtected(),protectedFixture);
   assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
  }
  assert.ok(rows.some(r=>r.instances>0&&r.sceneryDraws===1));
  assert.ok(rows.some(r=>r.farInstances>0),'no actual far-LOD witness');
  // Effects may legitimately be zero at sampled positions; record rather
  // than manufacture a luminous parent. Verify candidate real save action.
  if(proto){
   await page.evaluate(()=>document.getElementById('save').click());
   const status=await page.locator('#saveHealth').textContent();
   assert.match(status,/SAVE PROTECTION.*Experimental enchanted tree candidate cannot be saved as historical M7/s);
   record.experimentalSaveRefused=true;record.saveStatus=status;
  }
  assert.deepEqual(await readProtected(),protectedFixture);
  assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
  record.protectedBytesUnchanged=true;
 }finally{await context.close();}
}
try{
 servers=[await serve(false),await serve(true)];
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 await run(servers[0].url,false);await run(servers[1].url,true);
 for(let i=0;i<route.length;i++){
  const a=results[0].rows[i],b=results[1].rows[i];
  assert.deepEqual(a.request,b.request);assert.equal(a.center,b.center);assert.equal(a.biome,b.biome);
  assert.deepEqual(a.framebuffer,b.framebuffer);
  assert.ok(Math.abs(a.pose.x-b.pose.x)<.01&&Math.abs(a.pose.z-b.pose.z)<.01&&Math.abs(a.pose.feet-b.pose.feet)<.05,'settled pose drift');
 }
 const manifest={head,sourceBlobs,seed,route,witness,
  profileResponse:{historical:digest(original),candidate:digest(candidateResponse),constructorOnly:true,saveGuardRetained:true},
  results,desktopChromiumSwiftShader:true,physicalIphone:false,installedPwa:false,
  continuousPlayerWalking:false,actualOriginalMain:true,logicalBufferBytesNotDriverMemory:true};
 await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('ENCHANTED LIVE STREAM RESULT '+JSON.stringify({head,seed,waypoints:route.length,witnesses:witness.length,
  results:results.map(r=>({mode:r.mode,saveUnchanged:r.protectedBytesUnchanged,saveRefused:r.experimentalSaveRefused??false,
   rows:r.rows.map(x=>({center:x.center,biome:x.biome,loaded:x.loaded,terrainVertices:x.terrainVertices,
    sceneryBytes:x.sceneryBytes,instances:x.instances,far:x.farInstances,effects:x.effects,
    effectVertices:x.effectVertices,uploads:x.uploadsSinceWaypoint,retired:x.retiredPriorKeys,
    peakBytes:x.gl.peakLogicalBufferBytes,liveBytes:x.gl.logicalBufferBytes,rafP95Ms:x.rafP95Ms})),
   errors:r.errors,warnings:r.warnings}))}));
}catch(e){
 await writeFile(path.join(out,'failure.json'),JSON.stringify({head,route,witness,results,error:String(e),stack:e.stack},null,2)+'\n');
 console.error('ENCHANTED LIVE STREAM FAILURE '+JSON.stringify({error:String(e),results:results.map(r=>({mode:r.mode,rows:r.rows,errors:r.errors,warnings:r.warnings}))}));
 throw e;
}finally{
 if(browser)await browser.close();
 for(const s of servers)await new Promise(resolve=>s.server.close(resolve));
}
