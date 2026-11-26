// Finite actual WebGL2 renderer-only qualification, not a physical iPhone or
// whole-game frame benchmark. Run in an authorized exact candidate checkout.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const root=resolve('.'),out=resolve('artifacts/mob-projectile-webgl2');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const report={head,kind:'original-renderer-real-webgl2-eight-plus-four',
  originalGamePipeline:false,physicalIphone:false,productionPublished:false,
  cases:[],status:'BLOCKED'};
await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{
  try{
    const path=new URL(req.url,'http://localhost').pathname;
    if(path==='/'){
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      return res.end('<!doctype html><style>body{margin:0}canvas{display:block}</style><canvas id="scene"></canvas>');
    }
    const file=resolve(root,'.'+decodeURIComponent(path));
    if(!file.startsWith(root+sep)||extname(file)!=='.mjs')throw Error('Asset denied');
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});
    res.end(bytes);
  }catch(_){res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
    '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    try{
      await page.goto('http://127.0.0.1:'+server.address().port+'/');
      const result=await page.evaluate(async({width,height})=>{
        const {createLiveMobRenderer}=await import('/src/mobs/live-render.mjs');
        const {speciesRegistry}=await import('/src/mobs/species.mjs');
        const {LIVE_PROJECTILE_IDS}=await import('/src/mobs/live-projectile-budget.mjs');
        const canvas=document.querySelector('#scene');canvas.width=width;canvas.height=height;
        const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false});
        if(!gl)throw Error('Real WebGL2 unavailable');
        const renderer=createLiveMobRenderer(gl);
        gl.viewport(0,0,width,height);gl.enable(gl.DEPTH_TEST);
        gl.clearColor(.03,.04,.07,1);
        const entity=(id,species,x,y,z)=>({id,species:{id:species},position:[x,y,z],
          velocity:[0,0,0],state:'idle',yaw:0});
        const creatures=speciesRegistry.slice(0,8).map((s,i)=>
          entity('creature-'+i,s.id,(i-3.5)*1.5,0,9));
        const shots=LIVE_PROJECTILE_IDS.map((id,i)=>
          entity('shot-'+i,id,(i-1.5)*2.6,5,11));
        const camera={eye:[0,2,0],forward:[0,0,1],right:[1,0,0],up:[0,1,0],
          aspect:width/height,light:[1,1,1],fog:[.03,.04,.07],time:0};
        const frame=(actors,read=true)=>{
          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
          const start=performance.now(),draw=renderer.render(actors,camera);
          gl.finish();const elapsed=performance.now()-start;
          if(gl.getError()!==gl.NO_ERROR||gl.isContextLost())throw Error('WebGL error');
          const pixels=read?new Uint8Array(width*height*4):null;
          if(pixels)gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
          return {draw,pixels,elapsed};
        };
        const base=frame(creatures),combined=frame([...creatures,...shots]);
        const perShot=shots.map(shot=>{
          const single=frame([...creatures,shot]).pixels;
          let witness=0;
          for(let i=0;i<single.length;i+=4){
            const differs=Math.abs(single[i]-base.pixels[i])+Math.abs(single[i+1]-base.pixels[i+1])+Math.abs(single[i+2]-base.pixels[i+2])>12;
            if(differs&&single[i]===combined.pixels[i]&&single[i+1]===combined.pixels[i+1]&&single[i+2]===combined.pixels[i+2])witness++;
          }
          return {species:shot.species.id,visiblePixels:witness};
        });
        // Same authored 12 models, bounded fixed sample, no threshold borrowed
        // from physical iPhone FPS. gl.finish includes GPU synchronization.
        const samples=[];
        for(let i=0;i<90;i++){
          const f=frame([...creatures,...shots],false);
          if(f.draw.actors!==12||f.draw.models>12||f.draw.bytes>1_000_000)
            throw Error('Unbounded 8+4 renderer');
          samples.push(f.elapsed);
        }
        samples.sort((a,b)=>a-b);
        frame([...creatures,...shots],false);
        const stats=renderer.stats();
        const device=gl.getExtension('WEBGL_debug_renderer_info');
        const gpu=device?gl.getParameter(device.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
        // Keep the actual final framebuffer available for the screenshot.
        window.__mobQualificationDispose=()=>{renderer.dispose();return renderer.stats();};
        return {width,height,gpu,base:base.draw,combined:combined.draw,perShot,stats,
          samples:samples.length,p50:samples[Math.floor(samples.length*.5)],
          p95:samples[Math.ceil(samples.length*.95)-1],contextLost:gl.isContextLost(),glError:gl.getError()};
      },{width,height});
      assert.equal(result.base.actors,8);assert.equal(result.combined.actors,12);
      assert.equal(result.combined.models,12);assert.ok(result.combined.bytes<=1_000_000);
      assert.equal(result.contextLost,false);assert.equal(result.glError,0);
      assert.equal(result.perShot.length,4);
      for(const shot of result.perShot)assert.ok(shot.visiblePixels>=4,'No actual combined projectile pixels: '+shot.species);
      const png=await page.locator('#scene').screenshot();
      const file=width+'x'+height+'.png';await writeFile(resolve(out,file),png);
      const disposed=await page.evaluate(()=>window.__mobQualificationDispose());
      assert.equal(disposed.disposed,true);assert.equal(disposed.models,0);assert.equal(disposed.bytes,0);
      report.cases.push({...result,disposed,file,sha256:createHash('sha256').update(png).digest('hex')});
    }finally{await page.close();}
  }
  report.status='PASS';
}catch(e){report.error=String(e);throw e;}
finally{
  await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  await browser?.close();await new Promise(r=>server.close(r));
}
