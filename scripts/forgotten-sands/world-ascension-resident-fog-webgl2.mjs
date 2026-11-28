import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openP0CompositeFixture, P0_CURRENT_BASE } from '../../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import { annotateP0ResidentLandmarks, p0ResidentLandmarkShaders } from '../../src/manual-biomes/forgotten-sands-resident-landmark.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),P0_CURRENT_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P,V,H,N,S,P2,E,story,geometry] = await Promise.all([
  'src/manual-biomes/profile-world.mjs','src/voxel.mjs','src/world-height.mjs',
  'src/world-height-natural-contract.mjs','src/world-height-stream.mjs',
  'src/pack2-world.mjs','src/mobs/source-edit-epoch.mjs','src/storybook-materials.mjs','src/nonblock/candidate-scene.mjs',
].map(load));
const main = await readFile(resolve(root,'src/main.mjs'),'utf8');
const start = main.indexOf('  const VS=['), end = main.indexOf('  let program,skyProgram',start);
assert.ok(start >= 0 && end > start);
const original = Function('STORYBOOK_MATERIAL_FRAGMENT_SHADER','nonblockGeometry',
  main.slice(start,end)+';return {terrainVertex:VS,terrainFragment:FS};')(story.STORYBOOK_MATERIAL_FRAGMENT_SHADER,geometry);
const candidate = p0ResidentLandmarkShaders(original);
const hash = data => createHash('sha256').update(data).digest('hex');
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
  args:['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const output = resolve(process.env.RUNNER_TEMP ?? 'artifacts','forgotten-sands-resident-fog');
await mkdir(output,{recursive:true});
const report = { chromium:browser.version(), gameSource:P0_CURRENT_BASE, originalMain:hash(main), scope:'native opaque resident meshes', views:[] };
try {
  const page = await browser.newPage();
  for (const { index, mid } of [{ index:1,mid:[504,-122] },{ index:3,mid:[-900,-2054] }]) {
    const fixture = await openP0CompositeFixture(index,{P,H,N,reserved:()=>false,revision:()=>'resident-webgl'});
    const w = new P2.Pack2LiveWorld(fixture.world);
    const source = new P2.Pack2LiveWorld(new P.FourRegionWorld(w.seed,P.fourRegionProfile(w.seed,P.M8_MOUNTAIN_GENERATOR)));
    const revision = E.createMobSourceRevision(w), epoch = revision(), cache = new Map();
    for (const distance of [48,16]) {
      const [x,z] = [mid[0]-distance,mid[1]], feet = 15;
      const player = {x,z,feet}, eye = [x,feet+1.55,z], pitch=.10;
      const plan = S.planHeightStream(w,player,V.chunkWindow(x,z,2).map(c=>({...c,section:0})));
      assert.equal(plan.length,25);
      const rows = plan.map(c=>{
        const owner=H.runtimeMeshKey(c.cx,c.cz,c.section);
        if(!cache.has(owner)){
          const vertices=V.meshChunk(w,c.cx,c.cz,c.section);
          const tagged=annotateP0ResidentLandmarks(vertices,{source,composed:w,owner,H,sourceCurrent:()=>revision()===epoch});
          assert.equal(tagged.bytes,vertices.byteLength);
          assert.equal(tagged.extraOwners,0);
          cache.set(owner,{original:encode(vertices),tagged:tagged.triangles?encode(tagged.vertices):null,
            triangles:tagged.triangles, bytes:tagged.bytes});
        }
        return cache.get(owner);
      });
      const result = await page.evaluate(({original,candidate,rows,eye,pitch})=>{
        const canvas=document.createElement('canvas');
        canvas.width=640;
        canvas.height=320;
        const gl=canvas.getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});
        if(!gl)throw Error('WebGL2 required');
        const compile=(kind,source)=>{
          const shader=gl.createShader(kind);
          gl.shaderSource(shader,source);
          gl.compileShader(shader);
          if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
          return shader;
        };
        const link=({terrainVertex,terrainFragment})=>{
          const program=gl.createProgram();
          const vs=compile(gl.VERTEX_SHADER,terrainVertex),fs=compile(gl.FRAGMENT_SHADER,terrainFragment);
          gl.attachShader(program,vs);
          gl.attachShader(program,fs);
          gl.linkProgram(program);
          if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          return program;
        };
        const upload=encoded=>{
          const data=Uint8Array.from(atob(encoded),s=>s.charCodeAt(0));
          const buffer=gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
          gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
          return {buffer,count:data.length/36};
        };
        const baseline=link(original), fog=link(candidate), mask=link({terrainVertex:candidate.terrainVertex,
          terrainFragment:'#version 300 es\nprecision highp float; flat in int vLandmark; in float vDistance; out vec4 p; void main(){p=vec4(float(vLandmark),vDistance>29.0?1.0:0.0,0.0,1.0);}'});
        const data=rows.map(({original,tagged})=>{
          const plain=upload(original);
          return {plain,tagged:tagged?upload(tagged):plain};
        });
        const read=()=>{
          const bytes=new Uint8Array(canvas.width*canvas.height*4);
          gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
          if(gl.getError()!==gl.NO_ERROR)throw Error('Failed WebGL2 drawing or readback');
          return bytes;
        };
        function draw(program,field,haze){
          gl.useProgram(program);
          gl.clearColor(...(program===mask?[0,0,0,0]:[.68,.76,.83,1]));
          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
          gl.enable(gl.DEPTH_TEST);
          gl.enable(gl.CULL_FACE);
          for(const [name,value] of Object.entries({uEye:eye,uForward:[Math.cos(pitch),Math.sin(pitch),0],
            uRight:[0,0,-1],uUp:[-Math.sin(pitch),Math.cos(pitch),0],uFog:[.68,.76,.83],uSkyLight:[1,1,1],
            uAspect:canvas.width/canvas.height,uTan:Math.tan(.56),uCaveHaze:haze})){
            const loc=gl.getUniformLocation(program,name);
            if(Array.isArray(value))gl.uniform3fv(loc,value);
            else gl.uniform1f(loc,value);
          }
          const attrs=[['aPos',3,0],['aColor',3,12],['aUv',2,24],['aMat',1,32]]
            .map(([name,size,off])=>[gl.getAttribLocation(program,name),size,off]).filter(([id])=>id>=0);
          for(const [id] of attrs)gl.enableVertexAttribArray(id);
          for(const row of data){
            const {buffer,count}=row[field];
            if(!count)continue;
            gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
            for(const [id,size,off] of attrs)gl.vertexAttribPointer(id,size,gl.FLOAT,false,36,off);
            gl.drawArrays(gl.TRIANGLES,0,count);
          }
          for(const [id] of attrs)gl.disableVertexAttribArray(id);
          return read();
        }
        const old=draw(baseline,'plain',0), oldImage=canvas.toDataURL();
        const next=draw(fog,'tagged',0), nextImage=canvas.toDataURL();
        const classification=draw(mask,'tagged',0);
        const oldCave=draw(baseline,'plain',1), nextCave=draw(fog,'tagged',1);
        let changed=0,farTagged=0,nearTagged=0,wrong=0,caveChanged=0;
        for(let i=0;i<old.length;i+=4){
          const tagged=classification[i]===255, far=classification[i+1]===255;
          if(tagged){if(far)farTagged++;else nearTagged++;}
          if(old[i]!==next[i]||old[i+1]!==next[i+1]||old[i+2]!==next[i+2]||old[i+3]!==next[i+3]){
            changed++;
            if(!tagged||!far)wrong++;
          }
          if(oldCave[i]!==nextCave[i]||oldCave[i+1]!==nextCave[i+1]||oldCave[i+2]!==nextCave[i+2]||oldCave[i+3]!==nextCave[i+3])caveChanged++;
        }
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return {changed,farTagged,nearTagged,wrong,caveChanged,oldImage,nextImage};
      },{original,candidate,rows,eye,pitch});
      const { oldImage,nextImage,...pixels }=result;
      assert.ok(pixels.changed > 0,'Expected a visible fog change in this fixture');
      if (distance === 16) assert.ok(pixels.nearTagged > 0,'Expected a visible near monument control');
      assert.equal(pixels.wrong,0,'Fog affected nearby or non-landmark pixels');
      assert.equal(pixels.caveChanged,0,'Cave fog pixels changed');
      const screenshots={};
      for(const [label,url] of [['original',oldImage],['candidate',nextImage]]){
        const bytes=Buffer.from(url.split(',')[1],'base64');
        const file='site-'+index+'-distance-'+distance+'-'+label+'.png';
        await writeFile(resolve(output,file),bytes);
        screenshots[label]={file,sha256:hash(bytes)};
      }
      report.views.push({index,seed:w.seed,distance,feet,owners:rows.length,
        bytes:rows.reduce((sum,r)=>sum+r.bytes,0),triangles:rows.reduce((sum,r)=>sum+r.triangles,0),...pixels,screenshots});
      console.log(JSON.stringify(report.views.at(-1)));
    }
  }
} finally {
  await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
