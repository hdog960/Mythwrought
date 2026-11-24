// Original game, one seed, native-certified FULL S12 trees. Browser-only
// local diagnostic hook, never a production source or persisted edit.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
import {mkdir} from 'node:fs/promises';
import {composeSnowS15CertifiedNeedleMesh} from '../../src/manual-biomes/snowy-s15-certified-needle-material.mjs';
const dir='artifacts/snow-s16';
await mkdir(dir,{recursive:true});
const manifestBytes=await readFile('accepted-s13/forest-179.json');
assert.equal(sha(manifestBytes),'a75bc1ddc4e40e0bfb2c878c2ccaeb0659c5d9bd39f0ea709feb40a4832a79ac');
const manifest=JSON.parse(manifestBytes);
const voxel=await readFile('production-readonly/src/voxel.mjs','utf8');
assert.equal(sha(voxel),'3632db528a42d4fd9349f8cb78b0193dcd4b9c0b3112a0857f1532552e0f1dd3');
const needleVoxel=composeSnowS15CertifiedNeedleMesh(voxel);
assert.equal(sha(needleVoxel),'395fc767290132b9438cbe5c9117b01c381e4019a00c621f0a599c3f48df384b');
const indexSource=await readFile('src/manual-biomes/snowy-s14-indexed-forest.mjs','utf8');
const needleSource=await readFile('src/manual-biomes/snowy-s15-certified-needle-material.mjs','utf8');
assert.equal(manifest.seed,179);assert.equal(manifest.cells.length,203);
const main=await readFile('production-readonly/src/main.mjs','utf8');
const anchor='window.__mythwroughtTest=Object.freeze({';
assert.equal(main.split(anchor).length-1,1);
const hook=`window.__mythwroughtTest=Object.freeze({
  snowS13InstallPreview(manifest,measure,preferred){
    const base=world.base;
    if(world.seed!==manifest.seed||base?.generationProfile?.generator!==manifest.profile||
       manifest.cells.length!==203||manifest.trees.length!==4)
      throw Error('S13 original certificate identity mismatch');
    const source=world.get.bind(world),cells=new Map(),before=JSON.stringify(world.save());
    const key=(x,y,z)=>[x,y,z].join(',');
    for(const row of manifest.cells){
      const [x,y,z,id]=row,k=key(x,y,z);
      if(row.length!==4||!row.every(Number.isSafeInteger)||y<1||y>19||
         ![4,406,407].includes(id)||cells.has(k)||source(x,y,z)!==0||
         base.edits.has(k)||world.edits?.has(k)||
         base.environmentCaves.get(x,y,z)!==undefined)
        throw Error('S13 original browser certificate source veto '+k);
      cells.set(k,id);
    }
    const staged=Object.create(world);
    staged.get=(x,y,z)=>cells.get(key(x,y,z))??source(x,y,z);
    let camera=preferred;
    if(!camera){
      outer:for(const tree of manifest.trees){
        const top=manifest.cells.filter(c=>c[0]===tree.x&&c[2]===tree.z)
          .reduce((m,c)=>Math.max(m,c[1]),tree.floor);
        const target=[tree.x,top-2,tree.z];
        for(const [dx,dz] of [[0,-8],[-8,0],[8,0],[0,8],[-6,-6],[6,6]]){
          const x=tree.x+dx,z=tree.z+dz;
          for(let y=Math.min(19,tree.floor+3);y>=Math.max(3,tree.floor-3);y--){
            if(collides(world,x+.5,y+.01,z+.5)||collides(staged,x+.5,y+.01,z+.5)||
              !collides(world,x+.5,y-.055,z+.5))continue;
            // Real original line to selected new canopy: reject terrain/groves
            // between the original eye and candidate target.
            let clear=true;
            for(let f=.05;f<.95;f+=.025){
              const a=Math.floor(x+.5+(target[0]-x)*f),
                b=Math.floor(y+1.56+(target[1]+.5-y-1.56)*f),
                c=Math.floor(z+.5+(target[2]-z)*f);
              if(source(a,b,c)!==0){clear=false;break;}
            }
            if(clear){camera={position:[x,y,z],target,treeKey:tree.key};break outer;}
          }
        }
      }
    }
    if(!camera)throw Error('No genuine body-safe tree viewpoint');
    const [x,y,z]=camera.position;
    if(collides(world,x+.5,y+.01,z+.5)||collides(staged,x+.5,y+.01,z+.5))
      throw Error('S13 preferred camera is blocked');
    // Immutable S13 artifact, revalidated against the ORIGINAL Pack2 wrapper.
    // Index adapter preserves original wrapper read semantics outside the forest.
    const original=Object.create(base);
    Object.defineProperty(original,'get',{value:source});
    const frozen=Object.freeze({...manifest,cells:Object.freeze(manifest.cells.map(c=>Object.freeze([...c])))});
    const indexed=createSnowS14IndexedForest(original,{manifest:frozen,overlay:staged});
    const fast=Object.create(world);
    Object.defineProperty(fast,'get',{value:indexed.overlay.get});
    const reader=createSnowS15NeedleReader(original,frozen);
    let costs=null;
    if(measure){
      // Fresh paired original/string/indexed builds on the one historical
      // p95 outlier, native browser CPU only. No hard release gate inferred.
      const arms=[world,staged,fast],samples=[[],[],[]];
      for(const arm of arms)meshChunk(arm,-2,32);
      for(let n=0;n<24;n++)for(let j=0;j<3;j++){
        const k=(n+j)%3,t=performance.now();
        meshChunk(arms[k],-2,32);
        samples[k].push(performance.now()-t);
      }
      const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.ceil(a.length*p)-1];
      costs=samples.map(a=>({p50:q(a,.5),p95:q(a,.95),samples:a}));
    }
    Object.defineProperty(world,'get',{configurable:true,value:indexed.overlay.get});
    Object.defineProperty(world,'snowS15CertifiedNeedleAt',{configurable:true,value:reader});
    for(const c of chunks.values())deleteChunkBuffers(c);
    chunks.clear();pending.clear();wanted.clear();lastStreamingCenter='';gpuRetry.clear();
    if(JSON.stringify(world.save())!==before)throw Error('S13 preview wrote original save');
    return {camera,originalSave:before,costs,indexBytes:indexed.allocatedBytes,certifiedCells:cells.size,
      stagedWitnesses:manifest.cells.filter(c=>world.get(c[0],c[1],c[2])===c[3]).length};
  },
  async snowS16Mesh(){
    const m=meshChunk(world,-2,32),raw=new Uint32Array(m.buffer,m.byteOffset,m.length),nonTag=new Uint32Array(m.length/9*8),tags=[];
    let n=0;for(let i=0;i<m.length;i+=9){for(let j=0;j<8;j++)nonTag[n++]=raw[i+j];tags.push(m[i+8]);}
    const digest=await crypto.subtle.digest('SHA-256',nonTag);
    return {nonTagSha:Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join(''),vertices:tags.length,tags};
  },
  snowS13Observe(){return {save:JSON.stringify(world.save()),
    pose:{x:player.x,feet:player.feet,z:player.z,yaw:player.yaw,pitch:player.pitch},
    bodyClear:!collides(world,player.x,player.feet,player.z)};},
`;
const modified="import {createSnowS14IndexedForest} from './manual-biomes/snowy-s14-indexed-forest.mjs';\nimport {createSnowS15NeedleReader} from './manual-biomes/snowy-s15-certified-needle-material.mjs';\n"+main.replace(anchor,hook);
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const viewport={width:956,height:440};
async function capture(stage,preferred){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 try{
 const page=await context.newPage(),errors=[];let requests=0,voxelRequests=0;
 page.on('pageerror',e=>errors.push(String(e.message??e)));
 await page.route('**/src/main.mjs*',async route=>{
  const resp=await route.fetch(),body=await resp.text();assert.equal(resp.status(),200);
  assert.equal(sha(Buffer.from(body)),sha(Buffer.from(main)));requests++;
  await route.fulfill({status:200,contentType:'text/javascript',body:modified});
 });
 await page.route('**/src/manual-biomes/snowy-s14-indexed-forest.mjs',route=>route.fulfill({status:200,contentType:'text/javascript',body:indexSource}));
 await page.route('**/src/manual-biomes/snowy-s15-certified-needle-material.mjs',route=>route.fulfill({status:200,contentType:'text/javascript',body:needleSource}));
 await page.route('**/src/voxel.mjs',async route=>{
  const resp=await route.fetch(),body=await resp.text();assert.equal(resp.status(),200);assert.equal(sha(Buffer.from(body)),sha(voxel));voxelRequests++;
  await route.fulfill({status:200,contentType:'text/javascript',body:stage==='neutral'?needleVoxel:voxel});
 });
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot().seed===179&&
 Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&
 Number(document.querySelector('#scene').dataset.pendingChunks)===0,null,{timeout:110000});
 const preview=await page.evaluate(({manifest,stage,preferred})=>{
  const api=window.__mythwroughtTest;
  const p=api.snowS13InstallPreview(manifest,stage==='shared18',preferred);
  api.teleportCave(...p.camera.position);api.aimAt(...p.camera.target);
  return p;
 },{manifest,stage,preferred});
 assert.equal(preview.stagedWitnesses,203);
 await page.waitForFunction(()=>{
  const c=document.querySelector('#scene');return Number(c.dataset.loadedChunks)>=25&&
  Number(c.dataset.pendingChunks)===0;
 },null,{timeout:110000});
 const frame=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
 await page.waitForFunction(f=>Number(document.querySelector('#scene').dataset.renderedFrames)>=f+8,frame,{timeout:60000});
 const observation=await page.evaluate(()=>window.__mythwroughtTest.snowS13Observe());
 assert.equal(observation.save,preview.originalSave);assert.equal(observation.bodyClear,true);
 const gl=await page.evaluate(()=>{const c=document.querySelector('#scene'),g=c.getContext('webgl2');return {version:g?.getParameter(g.VERSION),loaded:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks),region:c.dataset.skyS6WorldBiomeName};});
 assert.ok(gl.version?.includes('WebGL 2'));assert.equal(gl.pending,0);assert.equal(gl.region,'snow');
 assert.equal(requests,1);assert.equal(voxelRequests,1);assert.deepEqual(errors,[]);
 const mesh=await page.evaluate(()=>window.__mythwroughtTest.snowS16Mesh());
 const name=stage+'-seed179-956x440.png',bytes=await page.screenshot({path:dir+'/'+name,timeout:90000});
 const png=pngjs.PNG.sync.read(bytes);assert.deepEqual([png.width,png.height],[956,440]);
 return {stage,name,sha256:sha(bytes),camera:preview.camera,pose:observation.pose,
   witnesses:preview.stagedWitnesses,gl,mesh,costs:preview.costs,indexBytes:preview.indexBytes,originalSaveUnchanged:true};
 }finally{await context.close()}
}
try{
 const camera={position:[-28,6,507],target:[-28,11,515],treeKey:'-4,64'};
 const original=await capture('shared18',camera),forest=await capture('neutral',camera);
 assert.equal(original.mesh.nonTagSha,forest.mesh.nonTagSha);
 assert.equal(original.mesh.vertices,forest.mesh.vertices);
 let retagged=0;for(let i=0;i<original.mesh.tags.length;i++){
  if(original.mesh.tags[i]!==forest.mesh.tags[i]){assert.equal(original.mesh.tags[i],18);assert.equal(forest.mesh.tags[i],0);retagged++;}
 }
 assert.ok(retagged>0);
 delete original.mesh.tags;delete forest.mesh.tags;
 assert.deepEqual(original.camera,forest.camera);
 for(const k of ['x','feet','z','yaw','pitch'])assert.ok(Math.abs(original.pose[k]-forest.pose[k])<.05,'Actual camera drift '+k);
 const a=pngjs.PNG.sync.read(await readFile(dir+'/'+original.name)),b=pngjs.PNG.sync.read(await readFile(dir+'/'+forest.name));
 let changed=0,n=0;
 for(let y=60;y<410;y++)for(let x=140;x<816;x++){
  const i=(y*956+x)*4;if(Math.max(...[0,1,2].map(k=>Math.abs(a.data[i+k]-b.data[i+k])))>=12)changed++;n++;
 }
 const report={original,forest,comparedPixels:n,changedFraction:changed/n,
   originalMainSha256:sha(Buffer.from(main)),sourceManifestSha256:sha(manifestBytes),retagged,
   realIphoneAcceptance:false};
 console.log('SNOW_S16_REAL_NEEDLE_PAIR '+JSON.stringify(report));
 await writeFile(dir+'/browser-report.json',JSON.stringify(report,null,2));
 assert.ok(changed/n>.005,'Scoped certified needle view did not exceed 0.5% central ROI >=12 RGB difference');
}finally{await browser.close()}
