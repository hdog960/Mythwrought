// Real original-game M7 enchanted forest, source-bound WebGL2 visual proof.
// Localhost-only camera relocation is evidence, not ordinary player traversal.
// No save edits, production deployment, or physical iPhone claims.
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
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BLOCK,terrainHeight,chunkCoord} from '../../src/voxel.mjs';
import {SELECTED_SEED_KEY} from '../../src/seeds.mjs';

const seed=7919,root=process.cwd(),out=path.join(root,'artifacts/enchanted-forest/real-webgl2');
await mkdir(out,{recursive:true});
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceBlob=execFileSync('git',['hash-object','src/manual-biomes/environment-v7.mjs'],{encoding:'utf8'}).trim();
const physical=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const witnesses=[[-58,5,-568],[-57,5,-568],[-55,5,-568],[-54,5,-568],[-59,4,-567]];
const soils=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss]);
for(const [x,y,z] of witnesses){
  assert.equal(v6BiomeAt(x,z,seed)?.name,'enchanted');
  assert.ok(soils.has(physical.get(x,y,z)),
    'Unfixed M7 original source grass witness '+[x,y,z]);
}
const forestCenter=[0,-512];
assert.equal(v6BiomeAt(...forestCenter,seed)?.name,'enchanted');
const oldY=terrainHeight(...forestCenter,seed);
const forestCap=physical._columnPlan(...forestCenter);
const lookY=forestCap.size?Math.max(...forestCap.keys()):oldY;
const scenes=[
  {id:'repaired-landmark-footprint',camera:[-74,-585],aim:[-56,6,-568]},
  {id:'enchanted-forest-interior',camera:[-24,-537],aim:[0,lookY,-512]}
];
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml',
  '.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    const name=decodeURIComponent(url.pathname);
    const file=path.resolve(root,'.'+name);
    if(file!==root&&!file.startsWith(root+path.sep))throw Error('outside project');
    const target=file===root?path.join(root,'index.html'):file;
    const bytes=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',
      'Cache-Control':'no-store'});res.end(bytes);
  }catch(e){res.writeHead(404);res.end('Missing file');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox'
]});
const captures=[],errors=[];
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
try{
  for(const [width,height] of [[844,390],[932,430]]){
    const context=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
    await context.addInitScript(({key,seed})=>{
      localStorage.setItem(key,String(seed));
    },{key:SELECTED_SEED_KEY,seed});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(width+'x'+height+': '+e.message));
    page.on('dialog',dialog=>dialog.accept());
    await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForFunction(generator=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,
      M7_ENVIRONMENT_GENERATOR,{timeout:100000});
    const initial=await page.evaluate(points=>{
      const test=window.__mythwroughtTest;
      const canvas=document.getElementById('scene');
      return {seed:test.snapshot().seed,generator:test.fourBiomeProfile()?.generator,
        webgl2:Boolean(canvas?.getContext('webgl2')),
        blocks:points.map(([x,y,z])=>({x,y,z,id:test.block(x,y,z)})),
        save:localStorage.getItem('mythwrought-v002-world-'+test.snapshot().seed)};
    },witnesses);
    assert.equal(initial.seed,seed);
    assert.equal(initial.generator,M7_ENVIRONMENT_GENERATOR);
    assert.equal(initial.webgl2,true,'actual Chromium original-game WebGL2 missing');
    assert.ok(initial.blocks.every(b=>soils.has(b.id)),
      'Actual original game did not render repaired physical ground '+JSON.stringify(initial.blocks));
    for(const scene of scenes){
      const camera=await page.evaluate(({camera,aim})=>{
        const api=window.__mythwroughtTest;
        const position=api.teleport(...camera);
        api.aimAt(...aim);
        return position;
      },scene);
      const center=chunkCoord(camera.x)+','+chunkCoord(camera.z);
      await page.waitForFunction(required=>{
        const d=document.getElementById('scene').dataset;
        return d.chunkCenter===required&&Number(d.pendingChunks)===0&&
          Number(d.loadedChunks)>=4&&Number(d.renderedMeshVertices)>0&&
          Number(d.renderedFrames)>10;
      },center,{timeout:110000});
      await page.waitForTimeout(600);
      const result=await page.evaluate(()=>{
        const api=window.__mythwroughtTest,canvas=document.getElementById('scene');
        return {generator:api.fourBiomeProfile()?.generator,seed:api.snapshot().seed,
          biome:canvas.dataset.skyS6WorldBiomeName,
          chunks:Number(canvas.dataset.loadedChunks),
          vertices:Number(canvas.dataset.renderedMeshVertices),
          scenery:Number(canvas.dataset.nonblockInstances??0),
          faults:api.gpuUploadFaults(),
          save:localStorage.getItem('mythwrought-v002-world-'+api.snapshot().seed)};
      });
      assert.equal(result.generator,M7_ENVIRONMENT_GENERATOR);
      assert.equal(result.biome,'enchanted','original-game camera left enchanted interior');
      assert.equal(result.faults.length,0,'GPU errors in real Chromium');
      assert.equal(result.save,initial.save,'source proof may not mutate saves');
      const name=scene.id+'-'+width+'x'+height+'.png';
      const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
      const png=PNG.sync.read(bytes),buckets=new Set();
      assert.equal(png.width,width);
      assert.equal(png.height,height);
      for(let y=Math.floor(height*.20);y<Math.floor(height*.85);y+=7)
        for(let x=Math.floor(width*.18);x<Math.floor(width*.82);x+=7){
          const i=(y*width+x)*4;
          buckets.add((png.data[i]>>4)+','+(png.data[i+1]>>4)+','+(png.data[i+2]>>4));
        }
      assert.ok(buckets.size>=18,'Real-game image lacks expected physical color diversity');
      captures.push({name,width,height,sha256:hash(bytes),bytes:bytes.length,
        colorBuckets:buckets.size,scene:scene.id,camera,biome:result.biome,
        residentChunks:result.chunks,renderedMeshVertices:result.vertices,
        nonblockInstances:result.scenery,realChromium:true,webgl2:true,
        testOnlyCameraRelocation:true,ordinaryFootTravel:false,physicalIphone:false});
    }
    await context.close();
  }
  assert.equal(captures.length,4);
  assert.equal(new Set(captures.map(x=>x.sha256)).size,captures.length,
    'repeated screenshot hashes indicate invalid distinct visual proof');
  assert.deepEqual(errors,[]);
  const manifest={kind:'mythwrought-enchanted-phase1-actual-game-webgl2',head,sourceBlob,seed,
    generator:M7_ENVIRONMENT_GENERATOR,allFiveWitnessesVerified:true,
    physicalIphone:false,simulatedLandscapeTouch:true,
    browserTestDoesNotCertifyInstalledHomeScreenPWA:true,
    sourceWorldRendering:true,realOriginalGame:true,
    screenshots:captures,errors};
  await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('ENCHANTED PHASE1 REAL WEBGL2 '+JSON.stringify(manifest));
}catch(error){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({head,error:String(error),
    captures,errors},null,2)+'\n');
  throw error;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
