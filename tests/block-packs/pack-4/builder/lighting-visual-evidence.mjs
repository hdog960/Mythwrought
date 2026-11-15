// Real Chromium WebGL2 source-exact Pack4 fixture comparisons for R2.
// No fake lighting models; building supports are verified from the authored
// source voxels; unbuilt structural materials are NOT rendered as finished.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
const out=resolve(process.cwd(),'artifacts/pack-4/lighting-review');
await mkdir(out,{recursive:true});
const sourceFile=resolve(process.cwd(),'../consumers/r2/src/building-pool/roadmap-2/m1-pack4-physical.mjs');
const {getM1Pack4Construction}=await import(pathToFileURL(sourceFile).href);
const views=getM1Pack4Construction(pack4),key=p=>p.join(',');
const pairs=views.flatMap(view=>(view.physicalLanternAlternatives??[]).map(alt=>({view,alt})));
const presets=[['general-store','temperate','small'],['general-store','snow','medium'],
 ['temple','desert','medium'],['temple','enchanted-forest','large']];
const selected=[];
for(const [category,biome,size] of presets){
 const match=pairs.find(p=>p.view.source.category===category&&p.view.source.biome===biome&&p.view.source.size===size);
 if(match)selected.push(match);
}
if(selected.length<3||new Set(selected.map(x=>x.view.source.category)).size<2)
 throw Error('Distinct authenticated commerce/temple wall-lantern review cases missing');
const dirs={north:0,east:1,south:2,west:3};
const cases=[];
for(const [index,{view,alt}] of selected.entries()){
 const blueprint=view.source;
 const occupied=new Map(blueprint.voxels.map(v=>[key([v.x,v.y,v.z]),v]));
 const source=occupied.get(key(alt.from));
 const wall=occupied.get(key(alt.backing));
 if(!source||source.material!==alt.source||!wall||wall.material!==alt.supportRef||
  !['wall','roof','foundation','support'].includes(wall.kind)||
  occupied.has(key([alt.from[0],alt.from[1]-1,alt.from[2]]))||
  alt.requiresCreatorArtReview!==true)
  throw Error('Source lantern or wall-backed alternative provenance invalid: '+blueprint.id);
 const candidates=blueprint.voxels.filter(v=>v.y===1&&v.kind==='floor'&&
  v.x>=2&&v.x<=blueprint.extents.x-3&&v.z>=2&&v.z<=blueprint.extents.z-3&&
  !occupied.has(key([v.x,2,v.z]))&&!occupied.has(key([v.x,3,v.z]))&&
  !blueprint.openings.some(o=>['entrance','internal-doorway'].includes(o.type)&&
   Math.abs(o.x-v.x)<=1&&Math.abs(o.z-v.z)<=1))
  .sort((a,b)=>Math.abs(a.x-alt.from[0])+Math.abs(a.z-alt.from[2])-
       Math.abs(b.x-alt.from[0])-Math.abs(b.z-alt.from[2])||
       a.z-b.z||a.x-b.x);
 if(!candidates.length)throw Error('No genuinely floor-supported original alternative in '+blueprint.id);
 const floor=candidates[0],original=pack4.pack4BuilderAsset(alt.source,{rotation:0});
 const sconce=pack4.pack4BuilderAsset(alt.replacement,{rotation:dirs[alt.facing]});
 if(![165,167].includes(original.id)||sconce.id!==166||
  original.mount!=='floor'||sconce.mount!=='wall-face')
  throw Error('Unexpected Pack4 physical source geometry');
 const models=[original,sconce,original].map(m=>{
  if(m.previewMesh.stride!==10||!(m.previewMesh.opaque instanceof Float32Array)||
   !m.previewMesh.opaque.length)throw Error('Source mesh missing');
  return {id:m.id,opaque:Array.from(m.previewMesh.opaque),
   translucent:Array.from(m.previewMesh.translucent)};
 });
 cases.push({id:index+1,blueprint:blueprint.id,category:blueprint.category,
  biome:blueprint.biome,
  source:{id:original.id,ref:alt.source,at:alt.from,backingPresent:false},
  installedBuilderAlternative:{id:166,at:alt.to,facing:alt.facing,
   backing:alt.backing,backingRef:wall.material,source:'pack4:036',
   requiresCreatorArtworkApproval:true},
  proposedOriginalFloor:{id:original.id,at:[floor.x,2,floor.z],
   backing:[floor.x,1,floor.z],backingRef:floor.material,
   reviewOnly:true},
  models});
}
const html='<!doctype html><html><head><meta charset="utf-8">'+
'<meta name="viewport" content="width=device-width,initial-scale=1">'+
'<style>*{box-sizing:border-box}body{margin:0;background:#14232a;color:#f2efe6;font:12px system-ui}'+
'header{padding:12px;background:#243842;border-bottom:1px solid #556d75}h1{font-size:17px;margin:0 0 4px}'+
'header p{margin:0;color:#baccce;font-size:10px}.meta{padding:9px 12px;background:#22333c}'+
'main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:9px}'+
'section{min-width:0;background:#263b46;border:1px solid #5d7180;border-radius:8px;overflow:hidden}'+
'h2{font-size:11px;padding:8px;margin:0;min-height:46px;background:#314752}'+
'canvas{width:100%;aspect-ratio:300/230;display:block;background:#1f2e36}'+
'.detail{padding:8px;font-size:10px;line-height:1.55;min-height:113px;word-break:break-word}'+
'.bad{border-color:#b67972}.good{border-color:#6eae92}.proposal{border-color:#dbb26e}'+
'footer{padding:9px 12px;font-size:10px;color:#becbcd;border-top:1px solid #50656d}</style></head><body>'+
'<header><h1>MYTHWROUGHT · PACK 4 LIGHTING REVIEW</h1>'+
'<p>Genuine original Pack4 voxel meshes (WebGL2) · source-authentic support cell evidence · DRAFT ONLY</p></header>'+
'<div class="meta" id="meta"></div><main id="grid"></main>'+
'<footer>Source floor lantern and wall sconce are authentic Pack4 physical assets. Other-pack structural cells are verified as authored but NOT rendered as invented blocks. Floor relocation is a proposal. No creator artwork signoff, live placement or illumination gameplay.</footer>'+
'</body></html>';
const vs=['#version 300 es','precision highp float;',
'layout(location=0) in vec3 aPosition;layout(location=1) in vec3 aNormal;',
'layout(location=2) in vec4 aColor;out vec4 vColor;',
'void main(){vec3 p=aPosition-vec3(.5);',
'vec3 yaw=vec3(.79*p.x+.61*p.z,p.y,-.61*p.x+.79*p.z);',
'vec3 tilt=vec3(yaw.x,.94*yaw.y-.34*yaw.z,.34*yaw.y+.94*yaw.z);',
'gl_Position=vec4(tilt.x*1.34,tilt.y*1.34,tilt.z*.55,1.);',
'vColor=vec4(aColor.rgb*(.82+.18*abs(aNormal.y)),aColor.a);',
'}'].join('\n');
const fs=['#version 300 es','precision highp float;',
'in vec4 vColor;out vec4 color;void main(){color=vColor;}'].join('\n');
const sizes=[[667,375],[844,390],[932,430]];
const images=[];
let browser;
try{
 browser=await chromium.launch({headless:process.env.PACK4_CHROMIUM_HEADFUL!=='1',
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--no-sandbox']});
 for(const [width,height] of sizes)for(const c of cases){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,
   hasTouch:true,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  try{
   await page.setContent(html);
   const results=await page.evaluate(({c,vs,fs})=>{
    const compile=(gl,type,src)=>{
     const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);
     if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(sh));
     return sh;
    };
    const labels=['Original lantern (unsupported)',
      'Existing wall-sconce substitution','Original lantern on real floor (proposal)'];
    const descriptions=[
      'Source '+c.source.ref+' at '+c.source.at.join(',')+'; NO occupied support below',
      'Physical wall sconce ID 166 at '+c.installedBuilderAlternative.at.join(',')+
      '; '+c.installedBuilderAlternative.facing+'; backing cell '+
      c.installedBuilderAlternative.backing.join(',')+' is '+c.installedBuilderAlternative.backingRef+
      '; ARTWORK NOT APPROVED',
      'Original asset ID '+c.proposedOriginalFloor.id+' at '+c.proposedOriginalFloor.at.join(',')+
      '; floor below at '+c.proposedOriginalFloor.backing.join(',')+
      ' is '+c.proposedOriginalFloor.backingRef+'; UNAPPROVED PROPOSAL'
    ];
    document.getElementById('meta').textContent=c.blueprint+
      ' · source ID '+c.source.id+' vs wall sconce ID 166 · real authored backing checks';
    const metrics=[];
    for(let i=0;i<3;i++){
      const section=document.createElement('section');section.className=['bad','good','proposal'][i];
      const heading=document.createElement('h2');heading.textContent=labels[i];
      const canvas=document.createElement('canvas');canvas.width=300;canvas.height=230;
      const detail=document.createElement('div');detail.className='detail';detail.textContent=descriptions[i];
      section.append(heading,canvas,detail);document.getElementById('grid').append(section);
      const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,preserveDrawingBuffer:true});
      if(!gl)throw Error('A real WebGL2 canvas is mandatory');
      const prog=gl.createProgram();
      gl.attachShader(prog,compile(gl,gl.VERTEX_SHADER,vs));
      gl.attachShader(prog,compile(gl,gl.FRAGMENT_SHADER,fs));
      gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog,gl.LINK_STATUS))
       throw Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const buffer=gl.createBuffer(),vao=gl.createVertexArray();
      gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,40,0);
      gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,40,12);
      gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.FLOAT,false,40,24);
      gl.viewport(0,0,300,230);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
      gl.depthMask(true);gl.clearColor(.12,.18,.21,1);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const mesh=c.models[i];
      if(mesh.opaque.length%10||mesh.translucent.length%10)throw Error('Broken source vertex ABI');
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.opaque),gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES,0,mesh.opaque.length/10);
      if(mesh.translucent.length){
       gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
       gl.depthMask(false);
       gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.translucent),gl.STATIC_DRAW);
       gl.drawArrays(gl.TRIANGLES,0,mesh.translucent.length/10);
      }
      gl.finish();
      if(gl.getError()!==gl.NO_ERROR)throw Error('GPU rendering error');
      const pixels=new Uint8Array(300*230*4);
      gl.readPixels(0,0,300,230,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let pixelsWithShape=0,hash=2166136261;
      for(let j=0;j<pixels.length;j+=4){
       if(Math.abs(pixels[j]-31)+Math.abs(pixels[j+1]-46)+Math.abs(pixels[j+2]-54)>30)
        pixelsWithShape++;
       hash=Math.imul(hash^pixels[j],16777619)>>>0;
       hash=Math.imul(hash^pixels[j+1],16777619)>>>0;
       hash=Math.imul(hash^pixels[j+2],16777619)>>>0;
      }
      if(pixelsWithShape<160)throw Error('Insufficient real GPU foreground');
      metrics.push({id:mesh.id,version:gl.getParameter(gl.VERSION),
       opaqueVertices:mesh.opaque.length/10,alphaVertices:mesh.translucent.length/10,
       foregroundPixels:pixelsWithShape,hash});
      gl.bindVertexArray(null);gl.bindBuffer(gl.ARRAY_BUFFER,null);
      gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(prog);
    }
    if(metrics.length!==3||metrics[0].hash===metrics[1].hash)
     throw Error('Source lantern and wall fixture render identically');
    return metrics;
   },{c,vs,fs});
   if(errors.length)throw Error('Browser page errors: '+errors.join(' | '));
   const filename='r2-'+c.id+'-'+width+'x'+height+'-real-webgl2.png',file=resolve(out,filename);
   await page.screenshot({path:file,fullPage:true});
   const bytes=await readFile(file);
   if(!bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))||
     bytes.length<10000)throw Error('Screenshot is not real nonempty PNG');
   images.push({file:filename,blueprint:c.blueprint,viewport:[width,height],
    sha256:createHash('sha256').update(bytes).digest('hex'),
    bytes:bytes.length,gpu:results});
  }finally{await page.close();}
 }
}finally{await browser?.close();}
if(images.length!==cases.length*sizes.length||new Set(images.map(i=>i.sha256)).size!==images.length)
 throw Error('Missing or duplicate real fixture comparison screenshots');
const roadmap2SourceHead=execFileSync('git',['-C','../consumers/r2','rev-parse','HEAD'],{encoding:'utf8'}).trim();
const report={status:'PASS',source:'Real Chromium WebGL2, original Pack4 candidate meshes',
 screenshots:images.length,landscapeSizes:sizes,
 pack4Head:process.env.GITHUB_SHA,roadmap2SourceHead,
 cases:cases.map(({models,...rest})=>rest),images,
 noProductionInstall:true,creatorArtworkApproval:false,
 allStructuralSupportCoordinatesFromActualRoadmap2Source:true,
 unbuiltOtherPackArchitectureNotDepicted:true};
await writeFile(resolve(out,'review-manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log('PACK4_R2_LIGHTING_REVIEW '+JSON.stringify({
 status:'PASS',cases:cases.length,images:images.length,
 buildings:cases.map(c=>c.blueprint),
 allRealChromiumWebGL2:images.every(i=>i.gpu.every(g=>g.version.includes('WebGL 2.0'))),
 sourceExact:true,creatorApproved:false
}));
