// CURRENT experimental M7 three-species visual milestone on the ORIGINAL
// game WebGL2 mesher. Only ephemeral localhost profile-module response is
// rewritten; there are no checkout edits, merges, saved-world mutations,
// old-generator changes or installed-iPhone assertions.
// Three genuinely matched camera pairs only; reuse old broad 12-image proof.
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

const root=process.cwd();
const out=path.join(root,'artifacts/enchanted-forest/phase2-three-tree-matched');
await mkdir(out,{recursive:true});
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const hash=data=>createHash('sha256').update(data).digest('hex');
const head=git('rev-parse','HEAD');
const sourceBlobs=Object.fromEntries([
 'src/manual-biomes/environment-v7.mjs',
 'src/manual-biomes/enchanted-tree-candidates.mjs',
 'src/manual-biomes/enchanted-tree-walking-clearance.mjs',
 'src/manual-biomes/enchanted-tree-source-cache.mjs',
 'src/manual-biomes/profile-world.mjs','src/main.mjs'
].map(p=>[p,git('hash-object',p)]));
const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const historic=new FourRegionWorld(seed,profile);
const candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
const sites=[
 {species:'starspire',x:-38,y:7,z:-525},
 {species:'moonwillow',x:-36,y:10,z:-499},
 {species:'ancient-giant',x:20,y:6,z:-525}
];
function roll(tx,tz,seed){
 let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
 n=Math.imul(n^(n>>>16),0x45d9f3b);
 return ((n^(n>>>16))>>>0)/4294967296;
}
function authenticCandidateSite(site){
 const {x,y,z,species}=site;
 let tx=null,tz=null;
 for(let a=Math.floor((x-5)/8)-1;a<=Math.floor((x-2)/8)+1;a++)
  for(let b=Math.floor((z-5)/8)-1;b<=Math.floor((z-2)/8)+1;b++)
   if(a*8+2+Math.floor(roll(a,b,seed+51)*4)===x&&
      b*8+2+Math.floor(roll(a,b,seed+89)*4)===z){tx=a;tz=b;}
 assert.ok(tx!==null&&tz!==null,'real original 8x8 source site missing '+species);
 const tree=buildEnchantedTreeCandidate(x,y,z,roll(tx,tz,seed+151));
 assert.equal(tree?.species,species,'real source style species changed');
 const witnesses=tree.cells.filter(([a,b,c,id])=>candidate.get(a,b,c)===id&&
   historic.get(a,b,c)!==id).slice(0,16);
 assert.ok(witnesses.length>=12,'real original source must expose 12 distinct candidate voxels '+species);
 const anchors=[];
 // Candidate roots are physical. Choose the same actually supported spawn
 // pose in both modes, outside the center crown, not a floating camera.
 for(let dx=-11;dx>=-21;dx--)for(let dz=-15;dz>=-23;dz--){
  if(anchors.length>=4)break;
  let a,b;
  try{
   a=findSafeSpawn(historic,x+dx,z+dz);
   b=findSafeSpawn(candidate,x+dx,z+dz);
  }catch(_){continue;}
  if(a.x===b.x&&a.z===b.z&&a.feet===b.feet&&
     a.feet>=4&&a.feet<=14&&Math.hypot(a.x-x,a.z-z)>=13)
    anchors.push({request:[x+dx,z+dz],pose:a});
 }
 assert.ok(anchors.length,'no shared original-source safe camera pose '+species);
 return {...site,witnesses,treeCells:tree.cells.length,anchor:anchors[0]};
}
const evidence=sites.map(authenticCandidateSite);
const profileSource=await readFile(path.join(root,'src/manual-biomes/profile-world.mjs'),'utf8');
const needle='{experimentalEnchantedTrees:this.experimentalEnchantedTrees});';
const changed='{experimentalEnchantedTrees:true});';
assert.equal(profileSource.split(needle).length,2,'unexpected profile source; refuse intervention');
const instrumented=profileSource.replace(needle,changed);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
 '.css':'text/css','.json':'application/json','.png':'image/png',
 '.webmanifest':'application/manifest+json','.svg':'image/svg+xml'};
async function serve(isCandidate){
 const server=createServer(async(req,res)=>{
  try{
   const uri=new URL(req.url,'http://127.0.0.1');
   const relative=decodeURIComponent(uri.pathname);
   const file=path.resolve(root,'.'+relative);
   if(file!==root&&!file.startsWith(root+path.sep))throw Error('outside repository');
   const target=file===root?path.join(root,'index.html'):file;
   const bytes=isCandidate&&relative==='/src/manual-biomes/profile-world.mjs'?
      Buffer.from(instrumented):await readFile(target);
   res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',
      'Cache-Control':'no-store'});
   res.end(bytes);
  }catch(err){res.writeHead(404);res.end(String(err));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {server,url:'http://127.0.0.1:'+server.address().port};
}
let browser=null,historicServer=null,candidateServer=null;
const captures=[],comparisons=[],pageFaults=[];
async function capture(origin,site,prototype){
 const width=932,height=430;
 const context=await browser.newContext({viewport:{width,height},
   deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await context.newPage();
 const localFaults=[];
 page.on('pageerror',e=>{localFaults.push(e.message);pageFaults.push(e.message);});
 page.on('dialog',d=>d.accept());
 try{
  await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(({seed,generator})=>
   window.__mythwroughtTest?.snapshot()?.seed===seed&&
   window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,
   {seed,generator:M7_ENVIRONMENT_GENERATOR},{timeout:70000});
  if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
  const initial=await page.evaluate(witnesses=>{
   const a=window.__mythwroughtTest,can=document.getElementById('scene');
   return {webgl2:!!can.getContext('webgl2'),
     save:localStorage.getItem('mythwrought-v002-world-'+a.snapshot().seed),
     blocks:witnesses.map(([x,y,z,id])=>({x,y,z,want:id,actual:a.block(x,y,z)}))};
  },site.witnesses);
  assert.equal(initial.webgl2,true,'must use real renderer');
  const expected=prototype?candidate:historic;
  for(const block of initial.blocks){
    assert.equal(block.actual,expected.get(block.x,block.y,block.z),
      'actual original-game browser M7 source mismatch '+site.species);
    if(prototype)assert.equal(block.actual,block.want,'candidate witness not visible');
  }
  const pos=await page.evaluate(({request,lookAt})=>{
    const api=window.__mythwroughtTest;
    const position=api.teleport(...request);
    api.aimAt(...lookAt);
    return position;
  },{request:site.anchor.request,lookAt:[site.x,Math.min(19,site.y+7),site.z]});
  assert.deepEqual({x:pos.x,z:pos.z,feet:pos.feet},site.anchor.pose,
    'camera must exactly match original source anchor '+site.species);
  const center=chunkCoord(pos.x)+','+chunkCoord(pos.z);
  await page.waitForFunction(required=>{
    const d=document.getElementById('scene').dataset;
    return d.chunkCenter===required&&Number(d.pendingChunks)===0&&
      Number(d.loadedChunks)>=4&&Number(d.renderedMeshVertices)>0&&
      Number(d.renderedFrames)>10;
  },center,{timeout:120000});
  await page.waitForTimeout(450);
  const live=await page.evaluate(()=>{
   const a=window.__mythwroughtTest,d=document.getElementById('scene').dataset;
   return {biome:d.skyS6WorldBiomeName,
     gpuFaults:a.gpuUploadFaults(),residentChunks:Number(d.loadedChunks),
     meshVertices:Number(d.renderedMeshVertices),
     save:localStorage.getItem('mythwrought-v002-world-'+a.snapshot().seed)};
  });
  assert.equal(live.biome,'enchanted');
  assert.deepEqual(live.gpuFaults,[],'GPU faults in original renderer');
  assert.equal(live.save,initial.save,'player world saved unexpectedly');
  assert.deepEqual(localFaults,[],'page JS faults');
  const name=site.species+'-'+(prototype?'candidate':'historic')+'-932x430.png';
  const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
  const png=PNG.sync.read(bytes);
  assert.equal(png.width,width);assert.equal(png.height,height);
  const record={name,sha256:hash(bytes),bytes:bytes.length,site:site.species,
    source:[site.x,site.y,site.z],mode:prototype?'instrumented-prototype':'unaltered-historical',
    camera:{x:pos.x,z:pos.z,feet:pos.feet},
    realOriginalGameWebGL2:true,realMainSource:true,simulatedMobileViewport:true,
    physicalIphone:false,pwaShortcut:false,
    witnesses:initial.blocks.length,allWitnessBlockIDsMatched:true,
    savedWorldBytesUnchanged:true,biome:live.biome,
    residentChunks:live.residentChunks,renderedMeshVertices:live.meshVertices,
    pageErrors:[],gpuFaults:[]};
  captures.push(record);
  return {png,record};
 }finally{await context.close();}
}
try{
 historicServer=await serve(false);candidateServer=await serve(true);
 browser=await chromium.launch({headless:true,args:[
   '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
   '--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox'
 ]});
 for(const site of evidence){
  const old=await capture(historicServer.url,site,false);
  const now=await capture(candidateServer.url,site,true);
  assert.deepEqual(old.record.camera,now.record.camera,'browser comparison camera drift');
  let diff=0,visibleColors=new Set();
  for(let i=0;i<old.png.data.length;i+=4){
   const a=old.png.data,b=now.png.data;
   if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+
      Math.abs(a[i+2]-b[i+2])>24)diff++;
   if(i%(4*137)===0)visibleColors.add((b[i]>>4)+','+(b[i+1]>>4)+','+(b[i+2]>>4));
  }
  const fraction=diff/(932*430);
  assert.ok(fraction>.002&&fraction<.72,'prototype change outside expected visible range '+site.species);
  assert.ok(visibleColors.size>18,'renderer scene unexpectedly flat '+site.species);
  comparisons.push({species:site.species,source:[site.x,site.y,site.z],
    viewport:[932,430],matchedCamera:true,
    changedPixels:diff,changedFraction:+fraction.toFixed(6),
    candidateColors:visibleColors.size,
    old:old.record.name,new:now.record.name});
 }
 assert.equal(captures.length,6);assert.deepEqual(pageFaults,[]);
 const manifest={kind:'enchanted-phase2-three-species-current-source-original-engine',
   head,sourceBlobs,seed,sites:evidence.map(({species,x,y,z,treeCells,witnesses,anchor})=>({
      species,source:[x,y,z],treeCells,witnesses:witnesses.length,anchor})),
   profileResponseInstrumentation:{unmodifiedHash:hash(profileSource),
     ephemeralCandidateHash:hash(instrumented),needle,replacement:changed},
   comparisons,captures,pageFaults,changedOnlyDisposableResponse:true,
   noProductionEdit:true,saveBytesUnchanged:true,
   physicalIphone:false,installedPWA:false};
 await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('ENCHANTED THREE-TREE MATCHED WEBGL2 '+JSON.stringify({
   head,sourceBlobs,comparisons,captures:captures.length,
   noGPUFaults:true,noPageErrors:true,saveBytesUnchanged:true}));
}catch(err){
 await writeFile(path.join(out,'failure.json'),JSON.stringify({
   head,error:String(err),stack:err.stack,evidence,comparisons,captures,
   pageFaults},null,2)+'\n');
 throw err;
}finally{
 if(browser)await browser.close();
 if(historicServer)await new Promise(resolve=>historicServer.server.close(resolve));
 if(candidateServer)await new Promise(resolve=>candidateServer.server.close(resolve));
}
