// Five-system release: actual original index.html/src/main.mjs WebGL2 scene.
// All forty source creature meshes must be visible on REAL live world voxels.
// No preview page, no synthetic 2D overlay, no screenshot substitution.
// The localhost-only acceptance hook inserts a physically grounded entity;
// the existing game depth renderer draws it with original camera + fog.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {speciesRegistry} from '../src/mobs/species.mjs';

const {PNG}=pngjs;
const OUT=resolve('artifacts/five-systems-live-mobs');
const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const report={kind:'MYTHWROUGHT_LIVE_40_MOB_ACTUAL_GAME_WEBGL2',head:commit,
  source:'original index.html/src/main.mjs with real voxel world and actual camera',
  browser:'Chromium software WebGL2',physicalIphone:false,productionPublished:false,
  canonicalSavesPreserved:false,status:'BLOCKED',screenshots:[],errors:[],viewports:[]};
const SHA=value=>createHash('sha256').update(value).digest('hex');
await mkdir(OUT,{recursive:true});
const root=resolve('.'),mimes={'.html':'text/html; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.json':'application/json','.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml','.png':'image/png',
  '.webmanifest':'application/manifest+json'};
const server=createServer(async(request,response)=>{
  try{
    const url=new URL(request.url,'http://localhost');
    const localPath=url.pathname==='/'?'/index.html':url.pathname;
    const file=resolve(root,'.'+decodeURIComponent(localPath));
    if(!file.startsWith(root+sep)||!mimes[extname(file)])throw Error('Rejected asset');
    const bytes=await readFile(file);
    response.writeHead(200,{'Content-Type':mimes[extname(file)],'Cache-Control':'no-store'});
    response.end(bytes);
  }catch(_){response.writeHead(404);response.end('Not found');}
});
await new Promise(resolve=>server.listen(4179,'127.0.0.1',resolve));
const ids=speciesRegistry.map(x=>x.id);
assert.equal(ids.length,40);
const browser=await chromium.launch({headless:true,args:[
  '--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
async function rendered(page,actors){
  await page.waitForFunction(expected=>{
    const c=document.querySelector('#scene');
    return c?.dataset.skyDrawn==='true'&&+c.dataset.mobActors===expected &&
      (expected===0||+c.dataset.mobDrawCalls>=1);
  },actors,{timeout:30000});
  await page.waitForTimeout(80);
}
function differences(a,b){
  const x=PNG.sync.read(a),y=PNG.sync.read(b);
  assert.equal(x.width,y.width);
  assert.equal(x.height,y.height);
  let changed=0,box=[Infinity,Infinity,-Infinity,-Infinity];
  for(let row=0;row<x.height;row++)
    for(let col=0;col<x.width;col++){
      const offset=(row*x.width+col)*4;
      const diff=[0,1,2].reduce((n,i)=>n+
        Math.abs(x.data[offset+i]-y.data[offset+i]),0);
      if(diff<35)continue;
      changed++;
      box=[Math.min(box[0],col),Math.min(box[1],row),
        Math.max(box[2],col),Math.max(box[3],row)];
    }
  return {changed,box,width:x.width,height:x.height};
}
let error=null;
try{
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const ctx=await browser.newContext({
      viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true
    });
    try{
      const page=await ctx.newPage();
      await page.goto('http://127.0.0.1:4179/',{waitUntil:'load',timeout:90000});
      await page.waitForFunction(()=>Boolean(window.__mythwroughtTest?.mobAcceptanceFixture),
        null,{timeout:60000});
      await page.waitForFunction(()=>{
        const c=document.querySelector('#scene');
        return +c?.dataset.loadedChunks>=20&&c?.dataset.skyDrawn==='true' &&
          +c.dataset.renderedFrames>=25;
      },null,{timeout:90000});
      if(await page.locator('#help').isVisible())
        await page.locator('#closeHelp').click();
      await page.locator('#menu').click();
      await page.locator('#skySetDay').click();
      await page.locator('#closeHelp').click();
      const original=await page.evaluate(()=>({
        world:localStorage.getItem('mythwrought-v002-world-179'),
        schema:window.__mythwroughtTest.snapshot().seed,
        saveKeyCount:Object.keys(localStorage).filter(x=>x.startsWith('mythwrought-v002-world-')).length
      }));
      const viewport={width,height,scenes:0};
      for(const id of ids){
        const scene=await page.evaluate(name=>
          window.__mythwroughtTest.mobAcceptanceFixture(name),id);
        assert.equal(scene.speciesId,id);
        assert.equal(scene.worldSeed,179);
        assert.equal(scene.schema,1);
        await rendered(page,1);
        const before=await page.evaluate(()=>
          window.__mythwroughtTest.mobAcceptanceVisible(false));
        assert.equal(before,false);
        await rendered(page,0);
        const empty=await page.locator('#scene').screenshot({animations:'disabled'});
        const shown=await page.evaluate(()=>
          window.__mythwroughtTest.mobAcceptanceVisible(true));
        assert.equal(shown,true);
        await rendered(page,1);
        const png=await page.locator('#scene').screenshot({animations:'disabled'});
        const evidence=await page.evaluate(()=>
          window.__mythwroughtTest.mobAcceptanceSnapshot());
        assert.equal(evidence.contextLost,false,'WebGL context lost at '+id);
        assert.equal(evidence.glError,0,'WebGL invalid error at '+id);
        assert.equal(evidence.drawn,1,'Source model not sent to GPU at '+id);
        assert.ok(evidence.gpuBytes>0&&evidence.gpuBytes<=1_000_000,
          'Creature GPU budget incorrect for '+id+': '+evidence.gpuBytes);
        const stats=differences(empty,png);
        assert.ok(stats.changed>=25,
          'No source-identical gameplay render difference for '+id+
          ' at '+width+'x'+height+': '+JSON.stringify(stats));
        const filename='actual-game-'+id+'-'+width+'x'+height+'.png';
        await writeFile(join(OUT,filename),png);
        report.screenshots.push({species:id,name:filename,sha256:SHA(png),
          bytes:png.length,viewport:[width,height],canvas:[stats.width,stats.height],
          realGroundedPosition:scene.position,meshDrawCalls:evidence.drawCalls,
          residentCreatureCount:evidence.counts.total,
          changedPixels:stats.changed,pixelBounds:stats.box,glError:0});
        viewport.scenes++;
      }
      const preserved=await page.evaluate(()=>({
        world:localStorage.getItem('mythwrought-v002-world-179'),
        saveKeyCount:Object.keys(localStorage).filter(x=>x.startsWith('mythwrought-v002-world-')).length,
        seed:window.__mythwroughtTest.snapshot().seed
      }));
      assert.equal(preserved.world,original.world,'Original Schema-1 save bytes changed');
      assert.equal(preserved.seed,179);
      assert.equal(preserved.saveKeyCount,original.saveKeyCount);
      assert.equal(viewport.scenes,40);
      report.viewports.push(viewport);
    }finally{await ctx.close();}
  }
  assert.equal(report.screenshots.length,120);
  assert.equal(new Set(report.screenshots.map(x=>x.name)).size,120);
  assert.equal(new Set(report.screenshots.map(x=>x.sha256)).size,120);
  report.canonicalSavesPreserved=true;
  report.status='ACTUAL_LIVE_GAME_120_SOURCE_AUTHENTIC_WEBGL2_PNG_PASS';
}catch(e){
  error=e;report.errors.push(String(e?.stack||e));
  console.error('FIVE_SYSTEM_LIVE_MOBS_BLOCKED',String(e?.stack||e));
}finally{
  await writeFile(join(OUT,'manifest.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
if(error)process.exitCode=1;
