// Targeted read-only loopback comparison. The original renderer/physics stay
// intact. Test server injects only the selected candidate world at boot.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FrostboundS3Candidate} from '../../src/frostbound/s3-ground.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
const root=process.cwd(),out=path.join(root,'artifacts/frostbound-s4');
await mkdir(out,{recursive:true});
const original=await readFile(path.join(root,'src/main.mjs'),'utf8');
const digest=s=>createHash('sha256').update(s).digest('hex');
const anchor='  let pack3=createPack3LiveBridge(world,localStorage);';
assert.equal(original.split(anchor).length,2);
const patch="  if(developerWorldFixtures){const mode=new URLSearchParams(location.search).get('frostbound-test');if(mode==='candidate'||mode==='baseline'){world=new Pack2LiveWorld(mode==='candidate'?new FrostboundS3Candidate(179):new FourRegionWorld(179,frostboundProfile(179,M8_MOUNTAIN_GENERATOR)));storageReadOnly=true;}}\n";
const injected="import {FrostboundS3Candidate} from './frostbound/s3-ground.mjs';\nimport {fourRegionProfile as frostboundProfile} from './manual-biomes/profile-world.mjs';\n"+original.replace(anchor,patch+anchor);
const source=new FrostboundS3Candidate(179),base=new FourRegionWorld(179,fourRegionProfile(179,M8_MOUNTAIN_GENERATOR));
const ancient=source.forestChunk(-13,23).site;
assert.deepEqual(ancient,{family:'frostfather',x:-200,floor:10,z:376,height:44,reservation:'ancient'});
const detail=[-180,10,371];assert.equal(source.get(...detail),281);assert.equal(base.get(...detail),0);
const witness=[-232,7,452],upper=[ancient.x,ancient.floor+ancient.height,ancient.z];
assert.notEqual(base.get(...witness),source.get(...witness));
assert.equal(base.get(...upper),0);assert.ok(source.get(...upper)>0);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://127.0.0.1'),rel=decodeURIComponent(u.pathname),file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));assert.ok(file.startsWith(root+path.sep));const bytes=rel==='/src/main.mjs'?injected:await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port,report={head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),originalMainSha256:digest(original),injectedMainSha256:digest(injected),bootInjection:true,readOnly:true,nonblockSceneryDisabled:true,physicalIphone:false,seed:179,ancient,witness,upper,detail,shots:[],errors:[],success:false};
let browser,ctx;
async function settled(page,requireUpper){
 await page.waitForFunction(required=>{const d=document.querySelector('#scene').dataset;return Number(d.loadedChunks)===25&&Number(d.pendingChunks)===0&&Number(d.renderedMeshVertices)>0&&(!required||Number(d.upperMeshVertices)>0);},requireUpper,{timeout:180000});
 const start=await page.locator('#scene').getAttribute('data-rendered-frames');
 await page.waitForFunction(n=>Number(document.querySelector('#scene').dataset.renderedFrames)>=Number(n)+4,start,{timeout:60000});
 const row=await page.evaluate(()=>{const a=window.__mythwroughtTest,c=document.querySelector('#scene'),d=c.dataset,g=c.getContext('webgl2');return {pose:a.m5ObservedPose(),frames:Number(d.renderedFrames),owners:Number(d.loadedChunks),pending:Number(d.pendingChunks),vertices:Number(d.renderedMeshVertices),upperOwners:Number(d.upperGpuOwners),upperVertices:Number(d.upperMeshVertices),upperBytes:Number(d.upperGpuBytes),faults:a.gpuUploadFaults(),lost:g.isContextLost(),error:g.getError(),graphics:a.snapshot().graphics};});
 assert.equal(row.lost,false);assert.equal(row.error,0);assert.equal(row.graphics.shaderReady,true);assert.equal(row.pending,0);assert.deepEqual(row.faults,[]);assert.ok(row.owners<=25&&row.upperOwners<=8&&row.upperBytes<=7077888);
 if(requireUpper)assert.ok(row.upperVertices>0&&row.upperOwners>0);return row;
}
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 for(const mode of ['baseline','candidate']){
  ctx=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(origin+'/?frostbound-test='+mode,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>!!window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady||!document.querySelector('#notice')?.hidden,null,{timeout:90000});
  assert.ok(await page.evaluate(()=>!!window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady),'Boot failed: '+await page.locator('#notice').textContent());
  if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
  for(const scene of [{name:'s1-shelf',camera:[-228,442],aim:[-232,7,452],cell:witness},{name:'s3-ice-spike',camera:[-180,365],aim:detail,cell:detail},{name:'s2-frostfather',camera:[-200,350],aim:[-200,28,376],cell:upper}]){
   await page.evaluate(({camera,aim})=>{const a=window.__mythwroughtTest;a.teleport(...camera);a.aimAt(...aim);},scene);
   const row=await settled(page,mode==='candidate'&&scene.name==='s2-frostfather');
   const id=await page.evaluate(cell=>window.__mythwroughtTest.block(...cell),scene.cell);
   assert.equal(id,(mode==='candidate'?source:base).get(...scene.cell));
   const filename=mode+'-'+scene.name+'.png';const bytes=await page.screenshot({path:path.join(out,filename)});report.shots.push({mode,scene:scene.name,file:filename,sha256:digest(bytes),cell:scene.cell,id,...row});console.log('FROSTBOUND VISUAL '+JSON.stringify(report.shots.at(-1)));
  }
  if(mode==='candidate'){
   const before=await page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose());await page.keyboard.down('KeyW');await page.waitForTimeout(600);await page.keyboard.up('KeyW');const after=await settled(page,true);
   assert.ok(Math.hypot(after.pose.x-before.x,after.pose.z-before.z)>.1,'Actual keyboard movement required');report.walk={before,after};
  }
  await ctx.close();ctx=null;
 }
 assert.equal(new Set(report.shots.map(s=>s.sha256)).size,6);assert.deepEqual(report.errors,[]);report.success=true;
}catch(e){report.error=String(e);report.stack=e.stack;throw e;}
finally{await writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2)+'\n');if(ctx)await ctx.close();if(browser)await browser.close();await new Promise(r=>server.close(r));}
