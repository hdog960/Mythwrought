// Actual original game loop / streaming / meshing / sky / camera, served on a
// fresh loopback origin. ONLY the startup world is substituted, read-only.
// No production source modification, save profile, UI button or vista owner.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),out=path.resolve('artifacts/shattered-peaks-session6');
await mkdir(out,{recursive:true});
const [range]=JSON.parse(await readFile(path.join(out,'range.json'),'utf8'));
const main=await readFile(path.join(root,'src/main.mjs'),'utf8');
const anchor='  function loadWorld(seed){';
assert.equal(main.split(anchor).length,2,'unique startup injection anchor');
const injected="import {ShatteredPeaksTerraceWorld} from './manual-biomes/shattered-peaks-terrace.mjs';\n"+
 main.replace(anchor,anchor+"\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('sp6-fixture')){\n      storageReadOnly=true;return new Pack2LiveWorld(new ShatteredPeaksTerraceWorld("+range.seed+"));\n    }");
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{
 const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).slice(1)||'index.html';
 const file=path.resolve(root,name);
 if(!file.startsWith(root+path.sep))throw Error('Outside root');
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
 res.end(name==='src/main.mjs'?injected:await readFile(file));
}catch(e){if(!res.headersSent)res.writeHead(404);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
 const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:'+server.address().port+'/?sp6-fixture=1',{waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>0,null,{timeout:120000});
 if(await page.locator('#help').isVisible())await page.locator('#closeHelp').click();
 const records=[];
 for(const [label,pos,target] of [['lower-approach',range.approach,range.peak],['summit',range.peak,range.approach]]){
  const pose=await page.evaluate(({pos,target})=>{
   const t=window.__mythwroughtTest;
   const here=t.teleportCave(pos.x,pos.y+1,pos.z);
   t.aimAt(target.x,target.y,target.z);
   return here;
  },{pos,target});
  await page.waitForFunction(({x,z,y})=>{
   const t=window.__mythwroughtTest,s=t.snapshot(),p=t.m5ObservedPose(),d=document.querySelector('#scene').dataset;
   return s.pending.length===0&&s.chunks.length>0&&Math.abs(p.feet-y-1)<.2&&
    Math.abs(p.x-x-.5)<.2&&Math.abs(p.z-z-.5)<.2&&Number(d.upperMeshVertices)>0;
  },pos,{timeout:120000});
  const record=await page.evaluate(({pos})=>{
   const t=window.__mythwroughtTest,c=document.querySelector('#scene'),d=c.dataset,g=c.getContext('webgl2'),s=t.snapshot();
   return {pose:t.m5ObservedPose(),chunks:s.chunks,pending:s.pending,upperOwners:Number(d.upperGpuOwners),upperBytes:Number(d.upperGpuBytes),upperVertices:Number(d.upperMeshVertices),meshVertices:Number(d.renderedMeshVertices),glError:g.getError(),graphics:s.graphics,physical:t.block(pos.x,pos.y,pos.z),worldKeys:Object.keys(localStorage).filter(k=>k.includes('-world-')||k.includes('selected-seed'))};
  },{pos});
  assert.equal(record.pose.seed,range.seed);assert.ok(record.physical>0);
  assert.ok(record.chunks.length<=25&&record.upperOwners<=8&&record.upperBytes<=7077888&&record.glError===0&&!record.graphics.lost);
  assert.equal(record.worldKeys.length,0,'read-only fixture created no world save');
  const png=await page.screenshot({path:path.join(out,label+'.png')});
  records.push({label,initialPose:pose,...record,sha256:createHash('sha256').update(png).digest('hex')});
  console.log('SP6_REAL_GAME',JSON.stringify(records.at(-1)));
 }
 assert.deepEqual(errors,[]);
 await writeFile(path.join(out,'real-game.json'),JSON.stringify({scope:'original main with loopback-only read-only startup source substitution; existing detailed renderer, no vista mount or physical iPhone',mainSha256:createHash('sha256').update(main).digest('hex'),records},null,2));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
