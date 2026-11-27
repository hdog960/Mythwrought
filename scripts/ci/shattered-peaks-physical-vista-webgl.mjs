// Isolated original-pipeline WebGL2 witness. Run only after physical-face
// native acceptance. Does not start, mount or modify the production game.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../../src/storybook-materials.mjs';
import {NONBLOCK_SCENERY_MATERIAL} from '../../src/nonblock/candidate-scene.mjs';
const root=process.cwd(),out=path.join(root,'artifacts/shattered-peaks-vista');
await mkdir(out,{recursive:true});
// Read EXACT current original terrain expressions instead of copying a
// simplified shader. Fail closed on source layout changes.
const main=await readFile(path.join(root,'src/main.mjs'),'utf8');
const start=main.indexOf('const VS=['),end=main.indexOf('let program,skyProgram',start);
if(start<0||end<start)throw Error('Original terrain shader extraction failed');
const expression=main.slice(start,end);
const shaders=Function('STORYBOOK_MATERIAL_FRAGMENT_SHADER','nonblockGeometry',expression+'return {VS,FS};')(
 STORYBOOK_MATERIAL_FRAGMENT_SHADER,{NONBLOCK_SCENERY_MATERIAL});
const server=createServer(async(req,res)=>{
 try{
  const p=new URL(req.url,'http://127.0.0.1').pathname;
  if(p==='/sp-vista-fixture'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><canvas id="scene" width="956" height="440" style="display:block"></canvas>');return;}
  const filename=path.resolve(root,'.'+decodeURIComponent(p));
  if(!filename.startsWith(root+path.sep))throw Error('Outside repo');
  res.writeHead(200,{'Content-Type':p.endsWith('.mjs')?'text/javascript':'application/octet-stream'});
  res.end(await readFile(filename));
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;const failures=[];
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--no-sandbox']});
 const page=await browser.newPage({viewport:{width:956,height:440},deviceScaleFactor:1});
 page.on('pageerror',e=>failures.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/sp-vista-fixture');
 const initial=await page.evaluate(async({VS,FS})=>{
  const {buildGpuPipeline}=await import('/src/gpu-pipeline.mjs');
  const {uploadChunkBuffer}=await import('/src/gpu-recovery.mjs');
  const {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER}=await import('/src/sky.mjs');
  const {ShatteredPeaksTerraceWorld}=await import('/src/manual-biomes/shattered-peaks-terrace.mjs');
  const {planPhysicalMountainVista}=await import('/src/manual-biomes/shattered-peaks-physical-vista.mjs');
  const {checkVistaBudget}=await import('/src/manual-biomes/shattered-peaks-vista.mjs');
  const {planHeightStream}=await import('/src/world-height-stream.mjs');
  const {runtimeMeshKey,runtimeSectionForY}=await import('/src/world-height.mjs');
  const {meshChunk}=await import('/src/voxel.mjs');
  const {MOUNTAIN_V8_MATERIAL:M}=await import('/src/manual-biomes/mountain-v8-materials.mjs');
  const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2',{alpha:false,depth:true,preserveDrawingBuffer:true});
  if(!gl)throw Error('WebGL2 unavailable');
  const p=buildGpuPipeline(gl,{terrainVertex:VS,terrainFragment:FS,skyVertex:SKY_VERTEX_SHADER,skyFragment:SKY_FRAGMENT_SHADER});
  const w=new ShatteredPeaksTerraceWorld(179),x=-548,z=17,cx=Math.floor(x/16),cz=Math.floor(z/16),legacy=[];
  for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
  const selected=planHeightStream(w,{x:x+.5,z:z+.5,feet:150},legacy);
  const key=c=>runtimeMeshKey(c.cx,c.cz,c.section),empty=selected.findLast(c=>c.section>0&&!w.upperNaturalOccupied(key(c)));
  if(!empty)throw Error('No genuine empty reservation');
  const retained=selected.filter(c=>c!==empty),nearKeys=new Set(retained.map(key));
  const near=[],owned=[];
  let detailedUpperBytes=0;
  for(const c of retained)if(c.section>0&&w.upperNaturalOccupied(key(c))){
   const v=meshChunk(w,c.cx,c.cz,c.section);
   if(v.byteLength){const buffer=uploadChunkBuffer(gl,v);near.push({buffer,count:v.length/9});owned.push(buffer);detailedUpperBytes+=v.byteLength;}
  }
  const budget={detailedUpperOwners:near.length,totalDetailedOwners:retained.length,detailedUpperBytes};
  const build=()=>{const result=planPhysicalMountainVista(w,{x,z,nearKeys});if(!checkVistaBudget(result,budget))throw Error('Physical vista failed budget '+JSON.stringify(result.stats));return result;};
  let result=build(),vista=uploadChunkBuffer(gl,result.vertices);owned.push(vista);
  function draw(includeVista){
   gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.61,.72,.81,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.useProgram(p.terrainProgram);const U=p.uniforms,eye=[x-12,173,z-20];
   const raw=[12,-38,20],len=Math.hypot(...raw),forward=raw.map(n=>n/len);
   const rlen=Math.hypot(forward[0],forward[2]),right=[-forward[2]/rlen,0,forward[0]/rlen];
   const up=[right[1]*forward[2]-right[2]*forward[1],right[2]*forward[0]-right[0]*forward[2],right[0]*forward[1]-right[1]*forward[0]];
   gl.uniform3fv(U.uEye,eye);gl.uniform3fv(U.uForward,forward);gl.uniform3fv(U.uRight,right);gl.uniform3fv(U.uUp,up);
   gl.uniform1f(U.uAspect,canvas.width/canvas.height);gl.uniform1f(U.uTan,Math.tan(72*Math.PI/360));
   gl.uniform3fv(U.uFog,[.61,.72,.81]);gl.uniform3fv(U.uSkyLight,[1,1,1]);gl.uniform1f(U.uCaveHaze,0);gl.uniform1f(U.uArtQuality,1);
   function drawBuffer(buffer,count){
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    for(const [a,n,o] of [[p.atPos,3,0],[p.atColor,3,12],[p.atUv,2,24],[p.atMat,1,32]])gl.vertexAttribPointer(a,n,gl.FLOAT,false,36,o);
    gl.drawArrays(gl.TRIANGLES,0,count);
   }
   for(const n of near)drawBuffer(n.buffer,n.count);
   if(includeVista)drawBuffer(vista,result.vertices.length/9);
   const pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
   if(gl.getError()!==gl.NO_ERROR)throw Error('Original pipeline GL error');
   return pixels;
  }
  const before=draw(false),after=draw(true);
  let changed=0;for(let i=0;i<before.length;i+=4)if(before[i]!==after[i]||before[i+1]!==after[i+1]||before[i+2]!==after[i+2])changed++;
  if(changed===0)throw Error('Vista made no actual framebuffer contribution');
  window.spVistaWitness={
   nearOnly:()=>draw(false),combined:()=>draw(true),
   editAndRestore:()=>{
    let c;
    for(let dz=-8;dz<=8&&!c;dz++)for(let dx=-8;dx<=8;dx++){
     const a=x+dx,b=z+dz,q=w.terraceColumn(a,b);
     if(q?.topY>22&&!nearKeys.has(runtimeMeshKey(Math.floor(a/16),Math.floor(b/16),runtimeSectionForY(q.topY)))){c=[a,q.topY,b];break;}
    }
    if(!c)throw Error('No omitted edit witness');
    const [a,y,b]=c,id=w.get(a,y,b),initial=result.vertices;
    const replace=()=>{
     const next=build();
     if(result.vertices.byteLength+next.vertices.byteLength>2097152)throw Error('Replacement staging cap');
     const buffer=uploadChunkBuffer(gl,next.vertices),old=vista;vista=buffer;result=next;gl.deleteBuffer(old);
     if(gl.isBuffer(old))throw Error('Old vista not retired');
     owned.splice(owned.indexOf(old),1,buffer);
    };
    if(!w.set(a,y,b,0)||!w.set(a,y+2,b,M.stone))throw Error('Physical edit refused');
    replace();draw(true);
    const changed=result.vertices.length!==initial.length||result.vertices.some((v,i)=>v!==initial[i]);
    if(!changed)throw Error('Stale edited vista');
    if(!w.set(a,y,b,id)||!w.set(a,y+2,b,0))throw Error('Restore refused');
    replace();draw(true);
    if(result.vertices.length!==initial.length||result.vertices.some((v,i)=>v!==initial[i]))throw Error('Restore bytes differ');
    return {cell:c,changed,restoredBytes:result.vertices.byteLength};
   },
   dispose:()=>{for(const n of owned)gl.deleteBuffer(n);gl.deleteBuffer(p.outlineBuffer);gl.deleteProgram(p.terrainProgram);gl.deleteProgram(p.skyProgram);return {retired:owned.every(n=>!gl.isBuffer(n)),error:gl.getError()};}
  };
  return {changedPixels:changed,bytes:result.vertices.byteLength,stats:result.stats,budget,webgl2:true};
 },shaders);
 const files=[];
 for(const [label,fn] of [['near','nearOnly'],['vista','combined']]){
  await page.evaluate(fn=>{window.spVistaWitness[fn]();},fn);
  const file=label+'.png',png=await page.locator('#scene').screenshot({path:path.join(out,file)});
  files.push({file,sha256:createHash('sha256').update(png).digest('hex')});
 }
 const edit=await page.evaluate(()=>window.spVistaWitness.editAndRestore());
 const retirement=await page.evaluate(()=>window.spVistaWitness.dispose());
 if(!retirement.retired||retirement.error!==0||failures.length)throw Error(JSON.stringify({retirement,failures}));
 const report={initial,edit,retirement,files,shaderSha256:createHash('sha256').update(shaders.VS+shaders.FS).digest('hex'),scope:'isolated original shader/pipeline, not production main or iPhone'};
 await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
 console.log('SP5_ORIGINAL_PIPELINE',JSON.stringify(report));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
