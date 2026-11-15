// Pack 1-only genuine Chromium WebGL2 acceptance runner: never certifies production integration.
// Opt-in on an authorized checkout/runner with Node 22 and Playwright:
// PACK1_EXPECTED_HEAD=<exact PR SHA> node tests/block-packs/pack-1/webgl2-browser.mjs
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {resolve,join,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {PACK1_GPU_IDS,candidateSurface} from '../../../src/block-packs/pack-1/webgl2-candidates.mjs';
import {verifyScreenshotPng} from './png-proof.mjs';

const root=resolve(process.cwd()),owned=resolve(root,'src/block-packs/pack-1');
const output=resolve(process.env.PACK1_GPU_ARTIFACT_DIR||'artifacts/pack-1-webgl2');
const viewports=[[667,375],[844,390],[932,430]];
const expectedHead=process.env.PACK1_EXPECTED_HEAD;
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
assert.match(expectedHead||'',/^[0-9a-f]{40}$/,'Exact PACK1_EXPECTED_HEAD required');
assert.equal(git('rev-parse','HEAD'),expectedHead,'Not the verified Pack 1 PR head');
assert.ok(['HEAD','manual-pack-1-stone-nature-core-masonry-20261114']
 .includes(git('rev-parse','--abbrev-ref','HEAD')),'Wrong branch');
assert.equal(git('status','--porcelain','--','src/block-packs/pack-1','tests/block-packs/pack-1'),
 '','Pack 1 checkout is dirty; refuse stale or modified source evidence');
assert.deepEqual(PACK1_GPU_IDS,Array.from({length:30},(_,i)=>i+9));
let server,browser;
const report={status:'BLOCKED',type:'pack1-source-candidate-webgl2-not-production',
 gitHead:expectedHead,renderer:'actual WebGL2 GPU using Pack 1 authored AABBs and textures',
 productionRegistration:false,physicalIPhone:false,creatorSignoff:false,
 viewports,expectedCandidates:30,expectedOrientations:4,views:[],
 screenshots:[],renderCount:0,consoleErrors:[],requestErrors:[]};
function mime(path){return extname(path)==='.html'?'text/html; charset=utf-8':
 extname(path)==='.mjs'?'text/javascript; charset=utf-8':'application/octet-stream';}
async function startServer(){
 const s=createServer(async(req,res)=>{
  try{
   const path=new URL(req.url,'http://127.0.0.1').pathname;
   const target=resolve(root,'.'+decodeURIComponent(path));
   if(!target.startsWith(owned+sep)){res.writeHead(403);res.end('Pack 1 only');return;}
   const data=await readFile(target);
   res.writeHead(200,{'Content-Type':mime(target),'Cache-Control':'no-store'});
   res.end(data);
  }catch(e){res.writeHead(404);res.end('Missing source file');}
 });
 await new Promise((ok,fail)=>{s.once('error',fail);s.listen(0,'127.0.0.1',ok);});
 return s;
}
async function main(){
 await mkdir(output,{recursive:true});
 await rm(join(output,'webgl2-acceptance-PASS.json'),{force:true});
 const old=await (await import('node:fs/promises')).readdir(output);
 for(const name of old)if(/^pack1-real-webgl2-id\d{2}-\d+x\d+\.png$/.test(name))
  await rm(join(output,name),{force:true});
 server=await startServer();
 const port=server.address().port;
 browser=await chromium.launch({headless:true,
  ...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const [width,height] of viewports){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const page=await context.newPage();
  const errors=[],requests=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  page.on('requestfailed',r=>requests.push('failed '+r.url()+': '+(r.failure()?.errorText||'')));
  page.on('response',r=>{if(r.status()>=400)requests.push('HTTP '+r.status()+' '+r.url());});
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'+port+'/'))
    requests.push('unexpected external '+r.url());});
  try{
   const url='http://127.0.0.1:'+port+
     '/src/block-packs/pack-1/webgl2-preview.html?candidate=9&rotation=0';
   const pageResponse=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
   assert.equal(pageResponse?.status(),200,'WebGL2 page failed to load');
   await page.waitForFunction(()=>Boolean(window.PACK1_WEBGL2_STATE?.webgl2),null,{timeout:30000});
   assert.ok(await page.locator('canvas#view').count(),'Missing visible real GPU canvas');
   const hashes=new Set();
   for(const id of PACK1_GPU_IDS){
    for(let turn=0;turn<4;turn++){
     const actual=await page.evaluate(([candidate,rotation])=>
      window.PACK1_WEBGL2_RENDER(candidate,rotation),[id,turn]);
     const source=candidateSurface(id,turn);
     assert.equal(actual.candidateId,id);assert.equal(actual.rotation,turn);
     assert.equal(actual.webgl2,true);assert.equal(actual.productionIntegrated,false);
     assert.match(actual.gpuVersion,/WebGL 2/i);
     assert.equal(actual.glError,0);assert.equal(actual.contextLost,false);
     assert.equal(actual.triangles,source.triangles);
     assert.equal(actual.vertices,source.triangles*3);
     assert.equal(actual.sourcePartCount,source.partsCount);
     assert.ok(actual.sourceMaterialFaces>0);
     assert.ok(actual.readbackColoredSamples>=100);
     assert.ok(actual.readbackUniqueColors>=12);
     assert.deepEqual(actual.canvas,[width,await page.locator('#view').evaluate(el=>el.height)]);
     report.views.push({viewport:[width,height],...actual});
     report.renderCount++;
     if(turn===0){
      const filename='pack1-real-webgl2-id'+String(id).padStart(2,'0')+
       '-'+width+'x'+height+'.png';
      const screenshot=await page.screenshot({fullPage:false});
      const integrity=verifyScreenshotPng(screenshot,{width,minHeight:height});
      const hash=createHash('sha256').update(screenshot).digest('hex');
      assert.ok(!hashes.has(hash),'Duplicate candidate GPU capture '+id);
      hashes.add(hash);
      await writeFile(join(output,filename),screenshot);
      report.screenshots.push({id,viewport:[width,height],filename,sha256:hash,integrity});
     }
    }
   }
   assert.equal(hashes.size,30,'Missing uniquely rendered candidates at this viewport');
   assert.deepEqual(errors,[],width+'x'+height+' browser errors');
   assert.deepEqual(requests,[],width+'x'+height+' missing/external requests');
   report.consoleErrors.push(...errors);report.requestErrors.push(...requests);
   console.log('PACK1_REAL_WEBGL2_VIEWPORT_PASS',width+'x'+height,
    '30 IDs x 4 rotations, 30 authenticated PNGs');
  }finally{await context.close();}
 }
 assert.equal(report.renderCount,360,'30 candidates x 4 rotations x 3 viewports required');
 assert.equal(report.screenshots.length,90,'90 actual browser screenshots required');
 assert.equal(report.consoleErrors.length+report.requestErrors.length,0);
 report.status='CANDIDATE_WEBGL2_PREVIEW_PASS';
 await writeFile(join(output,'webgl2-acceptance-PASS.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PACK1_SOURCE_CANDIDATE_WEBGL2_PASS',expectedHead,
  '360 actual GPU renders, 90 screenshots; NOT live game/physical iPhone approval');
}
try{await main();}catch(e){
 report.status='BLOCKED';report.reason=String(e?.stack||e);
 await mkdir(output,{recursive:true});
 await writeFile(join(output,'webgl2-acceptance-BLOCKED.json'),JSON.stringify(report,null,2)+'\n');
 console.error('PACK1_SOURCE_CANDIDATE_WEBGL2_BLOCKED:',e);
 process.exitCode=1;
}finally{
 if(browser)await browser.close();
 if(server)await new Promise(done=>server.close(done));
}
