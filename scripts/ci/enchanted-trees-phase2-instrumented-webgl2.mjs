// Strict Phase 2 comparison: genuine original game and original WebGL2 mesher
// on a disposable localhost source-instrumented browser. Production files,
 // M7 historical default loader and user saves are NEVER modified.
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
import {buildEnchantedTreeCandidate}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {environmentalTreesForChunk} from '../../src/manual-biomes/environment-v7.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';

const root=process.cwd(),out=path.join(root,'artifacts/enchanted-forest/phase2-real-webgl2');
await mkdir(out,{recursive:true});
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const head=git('rev-parse','HEAD'),sourceBlob=git('hash-object','src/manual-biomes/environment-v7.mjs'),
  candidateBlob=git('hash-object','src/manual-biomes/enchanted-tree-candidates.mjs'),
  profileBlob=git('hash-object','src/manual-biomes/profile-world.mjs'),
  mainBlob=git('hash-object','src/main.mjs');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const profileSource=await readFile(path.join(root,'src/manual-biomes/profile-world.mjs'),'utf8');
const needle='{experimentalEnchantedTrees:this.experimentalEnchantedTrees});';
const rewrite='{experimentalEnchantedTrees:true});';
assert.equal(profileSource.split(needle).length,2,
  'refuse to instrument unexpected original M7 source or more than one tree site');
const instrumentedProfile=profileSource.replace(needle,rewrite);
assert.notEqual(instrumentedProfile,profileSource);
const instrumentation={kind:'one-in-memory-localhost-module-response-substitution',
  originalProfileBlob:profileBlob,originalProfileSHA256:digest(profileSource),
  instrumentedResponseSHA256:digest(instrumentedProfile),exactStringBefore:needle,
  exactStringAfter:rewrite,scriptOriginalMainBlob:mainBlob,
  modifiesOnlyOriginalTreePlannerOption:true,
  historicDefaultBranchFileUnchanged:true,persistentWrites:false,
  thisIsNotUnmodifiedOriginalGameSource:true,
  originalEngineRendererAndMainSourceUnmodified:true};

function hashRoll(tx,tz,seed){
  let n=Math.imul(tx,0x7feb352d)^Math.imul(tz,0x846ca68b)^(seed|0);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
}
function chooseSites(){
 const result={},seeded=[];
 for(const seed of [179,7919,-88]){
  const gen=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const proto=new FourRegionWorld(seed,gen,{experimentalEnchantedTrees:true}),
    original=new FourRegionWorld(seed,gen);
  const undulation=n=>.5+.5*Math.sin(n);
  for(let tx=-5;tx<=5;tx++)for(let tz=-69;tz<=-59;tz++){
    const roll=hashRoll(tx,tz,seed),x=tx*8+2+Math.floor(hashRoll(tx,tz,seed+51)*4),
      z=tz*8+2+Math.floor(hashRoll(tx,tz,seed+89)*4),
      biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='enchanted'||biome.weight<.65)continue;
    const canopy=undulation(x*.051+z*.037+Math.sin(z*.031));
    if(roll>=.52+canopy*.34)continue;
    const column=proto._columnPlan(x,z);
    if(!column.size)continue;
    const floor=Math.max(...column.keys());
    const read=(a,b,c)=>proto._columnPlan(a,c).get(b)??proto._environmentBaseline(a,b,c);
    if(read(x,floor,z)!==column.get(floor)||read(x,floor-1,z)===BLOCK.AIR)continue;
    const shaped=buildEnchantedTreeCandidate(x,floor,z,hashRoll(tx,tz,seed+151));
    if(!shaped)continue;
    if(shaped.footprint.some(([dx,dz])=>read(x+dx,floor,z+dz)===BLOCK.AIR||
      read(x+dx,floor+1,z+dz)!==BLOCK.AIR))continue;
    if(shaped.cells.some(([a,b,c])=>read(a,b,c)!==BLOCK.AIR))continue;
    const witnesses=shaped.cells.filter(([a,b,c,id])=>proto.get(a,b,c)===id&&
      original.get(a,b,c)!==id).slice(0,24);
    if(witnesses.length<8)continue;
    const site={species:shaped.species,seed,origin:[x,floor,z],
      highestY:shaped.highestY,rawVoxelCount:shaped.cells.length,
      witnessCells:witnesses,footprint:shaped.footprint};
    if(!result[shaped.species])result[shaped.species]=site;
    seeded.push(site);
    if(Object.keys(result).length===3)return result;
  }
 }
 return result;
}
const sites=chooseSites();
assert.deepEqual(Object.keys(sites).sort(),['ancient-giant','moonwillow','starspire'],
  'the 3 authentic naturally eligible tall-tree silhouettes must be present');

const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json',
  '.svg':'image/svg+xml'};
async function serverFor(instrumented){
 const server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1');
   const relative=decodeURIComponent(url.pathname);
   const file=path.resolve(root,'.'+relative);
   if(file!==root&&!file.startsWith(root+path.sep))throw Error('invalid path');
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
}
const originalServer=await serverFor(false),instrumentedServer=await serverFor(true);
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox'
]});
const captures=[],pageErrors=[],checks=[];
async function visit(origin,width,height,site,prototype){
 const context=await browser.newContext({viewport:{width,height},
  deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);pageErrors.push(e.message);});
 page.on('dialog',d=>d.accept());
 try{
  await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  const waitWorld=async seed=>page.waitForFunction(({seed,generator})=>
    window.__mythwroughtTest?.snapshot()?.seed===seed&&
    window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,
    {seed,generator:M7_ENVIRONMENT_GENERATOR},{timeout:65000});
  await waitWorld(179);
  if(site.seed!==179){
   await page.locator('#menu').click();
   await page.locator('#seedInput').fill(String(site.seed));
   await page.locator('#switchWorld').click();
   await waitWorld(site.seed);
  }
  if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
  const initial=await page.evaluate(cells=>{
    const a=window.__mythwroughtTest,c=document.getElementById('scene');
    return {seed:a.snapshot().seed,generator:a.fourBiomeProfile()?.generator,
      webgl2:!!c.getContext('webgl2'),
      voxels:cells.map(([x,y,z,id])=>({x,y,z,want:id,actual:a.block(x,y,z)})),
      save:localStorage.getItem('mythwrought-v002-world-'+a.snapshot().seed)};
  },site.witnessCells);
  assert.equal(initial.seed,site.seed);assert.equal(initial.webgl2,true);
  const expected=new FourRegionWorld(site.seed,fourRegionProfile(site.seed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:prototype});
  for(const voxel of initial.voxels){
   assert.equal(voxel.actual,expected.get(voxel.x,voxel.y,voxel.z),
    'actual original-game WebGL2 voxel reader disagrees with source experimental mode');
   if(prototype)assert.equal(voxel.actual,voxel.want,'candidate tree voxel not visible in game source');
  }
  const [x,floor,z]=site.origin;
  const c=await page.evaluate(({x,z,y})=>{
    const api=window.__mythwroughtTest;
    const camera=api.teleport(x-11,z-15);
    api.aimAt(x,y,z);return camera;
  },{x,z,y:Math.min(19,floor+7)});
  const center=chunkCoord(c.x)+','+chunkCoord(c.z);
  await page.waitForFunction(required=>{
    const d=document.getElementById('scene').dataset;
    return d.chunkCenter===required&&Number(d.pendingChunks)===0&&
      Number(d.loadedChunks)>=4&&Number(d.renderedMeshVertices)>0&&
      Number(d.renderedFrames)>10;
  },center,{timeout:120000});
  await page.waitForTimeout(500);
  const state=await page.evaluate(()=>{
    const a=window.__mythwroughtTest,d=document.getElementById('scene').dataset;
    return {seed:a.snapshot().seed,biome:d.skyS6WorldBiomeName,
      chunks:Number(d.loadedChunks),vertices:Number(d.renderedMeshVertices),
      gpuFaults:a.gpuUploadFaults(),
      afterSave:localStorage.getItem('mythwrought-v002-world-'+a.snapshot().seed)};
  });
  assert.equal(state.seed,site.seed);assert.equal(state.biome,'enchanted');
  assert.deepEqual(state.gpuFaults,[]);assert.equal(state.afterSave,initial.save);
  assert.equal(errors.length,0,'real Chromium page JavaScript errors');
  const name=site.species+'-'+(prototype?'candidate':'historical')+'-'+width+'x'+height+'.png';
  const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
  const png=PNG.sync.read(bytes),colors=new Set();
  assert.equal(png.width,width);assert.equal(png.height,height);
  for(let py=Math.floor(height*.2);py<Math.floor(height*.85);py+=7)
   for(let px=Math.floor(width*.15);px<Math.floor(width*.85);px+=7){
    const i=(py*width+px)*4;
    colors.add((png.data[i]>>4)+','+(png.data[i+1]>>4)+','+(png.data[i+2]>>4));
   }
  assert.ok(colors.size>=18,'source-authentic WebGL2 screenshot unexpectedly flat');
  const capture={name,sha256:digest(bytes),byteLength:bytes.length,
    species:site.species,seed:site.seed,mode:prototype?'test-only-instrumented':'historical-original',
    viewport:[width,height],physicalIphone:false,originalMainSource:true,
    simulatedTouch:true,realOriginalGameRenderer:true,
    instrumentedModuleResponse:prototype,site:site.origin,lookAt:[x,Math.min(19,floor+7),z],
    camera:c,realGameTreeWitnesses:initial.voxels.length,
    checkedBlockIds:initial.voxels,
    unchangedSaveBytes:true,sourceWorldMode:state.biome,
    residentChunks:state.chunks,renderedMeshVertices:state.vertices,
    gpuUploadFaults:state.gpuFaults,colors:colors.size,errors};
  captures.push(capture);
  return {capture,png};
 }finally{await context.close();}
}
try{
 for(const species of ['starspire','moonwillow','ancient-giant']){
  const site=sites[species];
  for(const [width,height] of [[932,430],[844,390]]){
   const original=await visit(originalServer.url,width,height,site,false);
   const candidate=await visit(instrumentedServer.url,width,height,site,true);
   const a=original.png.data,b=candidate.png.data;
   let different=0;
   for(let i=0;i<a.length;i+=4){
    if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>24)
      different++;
   }
   const fraction=different/(width*height);
   assert.ok(fraction>.002,'actual original-game scene barely changes with tree prototype '+species);
   checks.push({species,viewport:[width,height],differentPixels:different,
     differentShare:+fraction.toFixed(5),historicalPNG:original.capture.name,
     prototypePNG:candidate.capture.name,allWitnessBlockIdsMatched:true});
  }
 }
 assert.equal(captures.length,12);
 assert.equal(new Set(captures.map(x=>x.sha256)).size,12);
 assert.deepEqual(pageErrors,[]);
 const manifest={kind:'mythwrought-enchanted-phase2-actual-engine-instrumented-prototype',
   head,sourceBlob,candidateBlob,profileBlob,mainBlob,siteEvidence:sites,
   instrumentation,numberOfRealBrowserCaptures:captures.length,
   comparisons:checks,captures,pageErrors,
   allTestsEphemeral:true,doesNotCertifyPhysicalIphone:true,
   historicalM7SourceUnmodified:true,noProductionMergeOrDeployment:true,
   sourceInstrumentationRequiredToSeeDraftCandidate:true};
 await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('ENCHANTED PHASE2 ORIGINAL ENGINE REAL WEBGL2 '+JSON.stringify({
  head,sourceBlob,candidateBlob,profileBlob,mainBlob,
  instrumentedResponseSHA256:instrumentation.instrumentedResponseSHA256,
  speciesSites:Object.values(sites).map(({species,seed,origin,witnessCells})=>({
    species,seed,origin,witnessCells:witnessCells.length})),
  screenshots:captures.length,checks,
  noPageErrors:pageErrors.length===0,noGPUFaults:captures.every(x=>!x.gpuUploadFaults.length),
  allSavesUnchanged:captures.every(x=>x.unchangedSaveBytes)}));
}catch(err){
 await writeFile(path.join(out,'failure.json'),JSON.stringify({
   head,error:String(err),stack:err.stack,captures,checks,pageErrors},null,2)+'\n');
 throw err;
}finally{
 await browser.close();
 await new Promise(resolve=>originalServer.server.close(resolve));
 await new Promise(resolve=>instrumentedServer.server.close(resolve));
}
