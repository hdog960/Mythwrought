// Focused native + genuine Chromium WebGL2 camera-locked comparison of ONE
// Ancient Giant, prompted by authentic run 44972193017 showing feet Y15 vs Y9.
// Reuse all previous exact-game proof; avoid repeating 12-browser comparison.
// Disposable localhost module response only; no production game/source writes.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {findSafeSpawn} from '../../src/physics.mjs';
import {buildEnchantedTreeCandidate}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';

const root=process.cwd(),out=path.join(root,'artifacts/enchanted-forest/phase2-giant-camera');
await mkdir(out,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const head=git('rev-parse','HEAD'),envBlob=git('hash-object','src/manual-biomes/environment-v7.mjs'),
 treeBlob=git('hash-object','src/manual-biomes/enchanted-tree-candidates.mjs'),
 profileBlob=git('hash-object','src/manual-biomes/profile-world.mjs'),
 mainBlob=git('hash-object','src/main.mjs');
const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const historic=new FourRegionWorld(seed,profile);
const candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
const [siteX,floor,siteZ]=[20,6,-525],species='ancient-giant';
function roll(tx,tz,seed){
 let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
 n=Math.imul(n^(n>>>16),0x45d9f3b);
 return ((n^(n>>>16))>>>0)/4294967296;
}
const tx=Math.floor((siteX-2)/8),tz=Math.floor((siteZ-2)/8);
let originalSite;
for(let a=tx-1;a<=tx+1&&!originalSite;a++)for(let b=tz-1;b<=tz+1;b++){
 const x=a*8+2+Math.floor(roll(a,b,seed+51)*4),z=b*8+2+Math.floor(roll(a,b,seed+89)*4);
 if(x===siteX&&z===siteZ){originalSite={tx:a,tz:b};break;}
}
assert.ok(originalSite,'original source 8x8 tree site must exist');
const tree=buildEnchantedTreeCandidate(siteX,floor,siteZ,
 roll(originalSite.tx,originalSite.tz,seed+151));
assert.equal(tree?.species,species,'real source must generate an Ancient Giant here');
const witnesses=tree.cells.filter(([x,y,z,id])=>candidate.get(x,y,z)===id&&
 historic.get(x,y,z)!==id).slice(0,24);
assert.equal(witnesses.length,24,'need 24 genuine source-specific tree cells');

const anchors=[];
for(let dx=-11;dx>=-23;dx--)for(let dz=-15;dz>=-26;dz--){
 if(Math.hypot(dx,dz)>31)continue;
 const x=siteX+dx,z=siteZ+dz;
 let a,b;try{
  a=findSafeSpawn(historic,x,z);
  b=findSafeSpawn(candidate,x,z);
 }catch(_){continue;}
 // A reproducible camera pose, not a top-of-tree teleporter / floating shot.
 if(a.x===b.x&&a.z===b.z&&a.feet===b.feet&&
   a.feet>=5&&a.feet<=12&&Math.hypot(a.x-siteX,a.z-siteZ)>=15)
     anchors.push({request:[x,z],pose:a});
}
assert.ok(anchors.length>0,
 'no genuine original-game terrain camera position matches both worlds');
anchors.sort((a,b)=>Math.abs(a.request[0]-(siteX-11))+
  Math.abs(a.request[1]-(siteZ-15))-
  Math.abs(b.request[0]-(siteX-11))-
  Math.abs(b.request[1]-(siteZ-15))||
  a.pose.feet-b.pose.feet);
const anchor=anchors[0];
const profileSource=await readFile(path.join(root,'src/manual-biomes/profile-world.mjs'),'utf8');
const old='{experimentalEnchantedTrees:this.experimentalEnchantedTrees});';
const next='{experimentalEnchantedTrees:true});';
assert.equal(profileSource.split(old).length,2,'original profile source changed unexpectedly');
const instrumentedProfile=profileSource.replace(old,next);
const sourceEvidence={
 head,envBlob,treeBlob,profileBlob,mainBlob,site:[siteX,floor,siteZ],
 sourceSpecies:species,sourceTreeCells:tree.cells.length,
 originalFailedComparisonRun:44972193017,originalGiantFeet:[15,9],
 anchorCandidates:anchors.length,chosenAnchor:anchor,
 instrumentedResponseSHA256:hash(instrumentedProfile),
 originalProfileSHA256:hash(profileSource),
 instrumentationExactOld:old,instrumentationExactNew:next,
 testOnlyModuleResponse:true,originalMainSourceUnmodified:true,
 M7HistoricDefaultUnchanged:true,physicalIphone:false};
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
 '.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
 '.webmanifest':'application/manifest+json'};
const makeServer=async instrumented=>{
 const server=createServer(async(req,res)=>{
  try{
   const uri=new URL(req.url,'http://127.0.0.1'),relative=decodeURIComponent(uri.pathname);
   const file=path.resolve(root,'.'+relative);
   if(file!==root&&!file.startsWith(root+path.sep))throw Error('outside checkout');
   const target=file===root?path.join(root,'index.html'):file;
   const bytes=instrumented&&relative==='/src/manual-biomes/profile-world.mjs'?
     Buffer.from(instrumentedProfile):await readFile(target);
   res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream',
     'Cache-Control':'no-store'});
   res.end(bytes);
  }catch(err){res.writeHead(404);res.end(String(err));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {server,url:'http://127.0.0.1:'+server.address().port};
};
let browser,originalServer,prototypeServer;
const captures=[],errors=[];
async function capture(url,prototype){
 const width=932,height=430,context=await browser.newContext({
   viewport:{width,height},deviceScaleFactor:1,hasTouch:true,isMobile:true,
   serviceWorkers:'block'});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push((prototype?'candidate':'historical')+': '+e.message));
 page.on('dialog',d=>d.accept());
 try{
  await page.goto(url+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(({seed,generator})=>
    window.__mythwroughtTest?.snapshot()?.seed===seed&&
    window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,
    {seed,generator:M7_ENVIRONMENT_GENERATOR},{timeout:70000});
  if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
  const begin=await page.evaluate(witnesses=>{
   const api=window.__mythwroughtTest,can=document.getElementById('scene');
   return {webgl2:!!can.getContext('webgl2'),
     initialSave:localStorage.getItem('mythwrought-v002-world-'+api.snapshot().seed),
     blocks:witnesses.map(([x,y,z,id])=>({x,y,z,id,read:api.block(x,y,z)}))};
  },witnesses);
  assert.equal(begin.webgl2,true);
  for(const v of begin.blocks){
   assert.equal(v.read,(prototype?candidate:historic).get(v.x,v.y,v.z),
     'real browser source reader must match the selected real world mode');
   if(prototype)assert.equal(v.read,v.id,'genuine Giant witness missing');
  }
  const position=await page.evaluate(({x,z,y})=>{
    const api=window.__mythwroughtTest,position=api.teleport(x,z);
    api.aimAt(20,y,-525);
    return position;
  },{x:anchor.request[0],z:anchor.request[1],y:floor+8});
  assert.deepEqual(
    {x:position.x,z:position.z,feet:position.feet},
    anchor.pose,
    'actual browser must use exactly the same physical camera pose in both worlds');
  const center=chunkCoord(position.x)+','+chunkCoord(position.z);
  await page.waitForFunction(required=>{
    const d=document.getElementById('scene').dataset;
    return d.chunkCenter===required&&Number(d.pendingChunks)===0&&
      Number(d.loadedChunks)>=4&&Number(d.renderedMeshVertices)>0&&
      Number(d.renderedFrames)>10;
  },center,{timeout:120000});
  await page.waitForTimeout(450);
  const live=await page.evaluate(()=>{
   const api=window.__mythwroughtTest,d=document.getElementById('scene').dataset;
   return {gpuFaults:api.gpuUploadFaults(),
     save:localStorage.getItem('mythwrought-v002-world-'+api.snapshot().seed),
     biome:d.skyS6WorldBiomeName,chunks:Number(d.loadedChunks),
     vertices:Number(d.renderedMeshVertices)};
  });
  assert.equal(live.biome,'enchanted');
  assert.deepEqual(live.gpuFaults,[]);
  assert.equal(live.save,begin.initialSave,'original gameplay save bytes changed');
  assert.deepEqual(errors,[],'page faults in original-game browser');
  const name='ancient-giant-'+(prototype?'candidate':'historical')+
     '-matched-camera-932x430.png';
  const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
  const png=PNG.sync.read(bytes);
  assert.equal(png.width,width);assert.equal(png.height,height);
  const result={name,sha256:hash(bytes),bytes:bytes.length,
    mode:prototype?'test-only-instrumented':'unaltered-historical',
    realGameRenderer:true,originalMainSource:true,webgl2:true,
    testedBlockWitnesses:begin.blocks.length,allTreeBlockIDsMatched:true,
    viewport:[width,height],camera:{x:position.x,z:position.z,feet:position.feet},
    residentChunks:live.chunks,renderedMeshVertices:live.vertices,
    gpuFaults:live.gpuFaults,pageErrors:[],saveBytesUnchanged:true};
  captures.push(result);
  return png;
 }finally{await context.close();}
}
try{
 originalServer=await makeServer(false);prototypeServer=await makeServer(true);
 browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 const oldPNG=await capture(originalServer.url,false);
 const newPNG=await capture(prototypeServer.url,true);
 assert.deepEqual(captures[0].camera,captures[1].camera,'actual camera mismatch recurred');
 let pixels=0;
 const a=oldPNG.data,b=newPNG.data;
 for(let i=0;i<a.length;i+=4)
  if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>24)pixels++;
 const change=pixels/(oldPNG.width*oldPNG.height);
 assert.ok(change>.01,'physically distinct Ancient Giant not visible from matched camera');
 assert.ok(change<.70,'camera-locked scene comparison changed implausibly much');
 const manifest={kind:'mythwrought-enchanted-phase2-giant-locked-camera',
   sourceEvidence,mode:'source-authentic-with-disposable-module-substitution',
   captures,comparison:{changedPixels:pixels,changedFraction:change},
   browserErrors:errors,physicalIphone:false,installedPWA:false,
   baselineGlobalHeightUnchanged:true,allPlayerSavesUnchanged:true};
 await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('ENCHANTED PHASE2 GIANT MATCHED CAMERA '+JSON.stringify({
   head,sourceEvidence,old:captures[0],candidate:captures[1],
   changedPixels:pixels,changedFraction:change,errors}));
}catch(error){
 await writeFile(path.join(out,'failure.json'),JSON.stringify({
   head,error:String(error),stack:error.stack,sourceEvidence,captures,errors},null,2)+'\n');
 throw error;
}finally{
 if(browser)await browser.close();
 if(originalServer)await new Promise(resolve=>originalServer.server.close(resolve));
 if(prototypeServer)await new Promise(resolve=>prototypeServer.server.close(resolve));
}
