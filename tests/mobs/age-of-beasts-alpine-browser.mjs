// AB3 renderer-only fixture, not a full game or physical iPhone claim.
// The original module is served verbatim except two exact registry seams.
// Original shader, instancing, draw selection and resource lifetime unmodified.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {ALPINE_MODEL_IDS} from '../../src/mobs/age-of-beasts/alpine-models.mjs';
const {PNG}=pngjs,root=resolve('.'),out=resolve('artifacts/age-of-beasts-alpine');
const sha=b=>createHash('sha256').update(b).digest('hex');
const original=await readFile('src/mobs/live-render.mjs','utf8');
function patch(src,from,to){assert.equal(src.split(from).length,2);return src.replace(from,to);}
let patched=patch(original,"import {meshes} from '../../mob-preview/models.mjs';","import {meshes as originalMeshes} from '../../mob-preview/models.mjs';\nimport {ALPINE_MODEL_IDS,buildAlpineModel} from './age-of-beasts/alpine-models.mjs';\nconst meshes=Object.freeze({...originalMeshes,...Object.fromEntries(ALPINE_MODEL_IDS.map(id=>[id,buildAlpineModel(id)]))});");
patched=patch(patched,"const renderIds=new Set([...modelIds,...projectileIds]);","const renderIds=new Set([...modelIds,...projectileIds,...ALPINE_MODEL_IDS]);");
const report={head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),originalSourceSHA256:sha(original),fixtureSourceSHA256:sha(patched),scope:'original renderer shader and draw path with test-only model registry injection; no world terrain or real-device claim',screenshots:[],status:'failed'};
await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{
 try{const p=new URL(req.url,'http://localhost').pathname;
  if(p==='/'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><html><body style="margin:0;background:#172432"><canvas id="scene"></canvas></body></html>');return;}
  const file=resolve(root,'.'+decodeURIComponent(p));
  if(!file.startsWith(root+sep)||extname(file)!=='.mjs')throw Error('Rejected path');
  res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});
  res.end(p==='/src/mobs/live-render.mjs'?patched:await readFile(file));
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(4182,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const [width,height] of [[956,440],[667,375]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4182/');
  await page.evaluate(async({width,height})=>{
   const {createLiveMobRenderer}=await import('/src/mobs/live-render.mjs');
   const {alpineModelEnvelope}=await import('/src/mobs/age-of-beasts/alpine-models.mjs');
   const c=document.querySelector('canvas');c.width=width;c.height=height;
   const gl=c.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false});
   if(!gl)throw Error('No WebGL2');
   const renderer=createLiveMobRenderer(gl);
   window.drawBeast=(id,pose)=>{
    gl.viewport(0,0,width,height);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.clearColor(.09,.14,.20,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const env=alpineModelEnvelope(id).info,scale=Math.max(env.radius*2,env.maxY),d=Math.max(.8,scale*1.7);
    const eye=[0,env.maxY*.5,-d],forward=[0,0,1],right=[1,0,0],up=[0,1,0];
    const actor={species:{id},position:[0,0,0],yaw:pose===0?Math.PI*.83:Math.PI*.63,
      velocity:pose===0?[0,0,0]:[1.6,0,0],state:'idle',visual:pose===0?'idle':'attack'};
    const s=renderer.render([actor],{eye,forward,right,up,aspect:width/height,light:[1,1,1],fog:[.09,.14,.20],time:pose===0?.25:.63});
    gl.finish();return {...s,error:gl.getError()};
   };
   window.disposeBeasts=()=>{renderer.dispose();return renderer.stats();};
  },{width,height});
  for(const id of ALPINE_MODEL_IDS){
   const hashes=[];
   for(let pose=0;pose<2;pose++){
    const s=await page.evaluate(({id,pose})=>window.drawBeast(id,pose),{id,pose});
    assert.equal(s.actors,1);assert.equal(s.draws,1);assert.equal(s.error,0);assert.ok(s.models<=12);
    const bytes=await page.locator('canvas').screenshot(),png=PNG.sync.read(bytes);
    let changed=0;
    for(let i=0;i<png.data.length;i+=4)if(Math.abs(png.data[i]-23)+Math.abs(png.data[i+1]-36)+Math.abs(png.data[i+2]-51)>35)changed++;
    assert.ok(changed>100,id+' invisible');
    const name=id+'-'+width+'x'+height+'-pose'+pose+'.png',digest=sha(bytes);
    await writeFile(resolve(out,name),bytes);hashes.push(digest);
    report.screenshots.push({id,pose,width,height,name,sha256:digest,changedPixels:changed,stats:s});
   }
   assert.notEqual(hashes[0],hashes[1],id+' unchanged poses');
  }
  const disposed=await page.evaluate(()=>window.disposeBeasts());assert.equal(disposed.bytes,0);assert.equal(disposed.models,0);
  await page.close();
 }
 report.status='passed';console.log('AB3 original renderer fixture screenshots',report.screenshots.length);
}finally{await writeFile(resolve(out,'manifest.json'),JSON.stringify(report,null,2)+'\n');await browser?.close();await new Promise(r=>server.close(r));}
