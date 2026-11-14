// An isolated WebGL2 visual inspection harness; NEVER imported by production main.
import {PACK4_WINDOW_ASSETS,windowPreviewMesh} from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS,lightingPreviewMesh} from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS,furnishingPreviewMesh} from '../../../src/block-packs/pack-4/furnishings.mjs';
import {PACK4_CIVIC_ASSETS,civicPreviewMesh} from '../../../src/block-packs/pack-4/hearth-civic.mjs';
import {sortPack4PreviewTranslucent} from '../../../src/block-packs/pack-4/preview-utils.mjs';
const VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
out vec4 vColor;
void main(){
  vec3 p=aPosition-vec3(.5);
  vec3 yaw=vec3(.79*p.x+.61*p.z,p.y,-.61*p.x+.79*p.z);
  vec3 tilt=vec3(yaw.x,.94*yaw.y-.34*yaw.z,.34*yaw.y+.94*yaw.z);
  gl_Position=vec4(tilt.x*1.56,tilt.y*1.56,tilt.z*.55,1.);
  vColor=vec4(aColor.rgb*(.82+.18*abs(aNormal.y)),aColor.a);
}
`;
const FS = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 color;
void main(){color=vColor;}
`;
function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
    throw Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');
  return shader;
}
function buildProgram(gl){
  const prog=gl.createProgram();
  gl.attachShader(prog,compile(gl,gl.VERTEX_SHADER,VS));
  gl.attachShader(prog,compile(gl,gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(prog);
  // Defer shader destruction until program detaches them; avoid a shader leak per model.
  for(const shader of gl.getAttachedShaders(prog)||[])gl.deleteShader(shader);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(prog)||'Link failed');
  return prog;
}
function drawOne(canvas,id,rotation){
  const gl=canvas.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true,antialias:true});
  if(!gl)throw Error('WebGL2 unavailable; cannot validate real candidate preview');
  const mesh=id>=176?civicPreviewMesh(id,rotation):
    id>=169?furnishingPreviewMesh(id,rotation):
    id>=165?lightingPreviewMesh(id,rotation):windowPreviewMesh(id,rotation);
  const prog=buildProgram(gl);
  const vao=gl.createVertexArray(),buf=gl.createBuffer();
  if(!vao||!buf)throw Error('Pack 4 preview GPU allocation failed');
  try{
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(.12,.18,.21,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  gl.useProgram(prog);
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  const stride=mesh.stride*4;
  gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(1,3,gl.FLOAT,false,stride,12);gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(2,4,gl.FLOAT,false,stride,24);gl.enableVertexAttribArray(2);
  gl.disable(gl.BLEND);
  gl.bufferData(gl.ARRAY_BUFFER,mesh.opaque,gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES,0,mesh.opaque.length/mesh.stride);
  // Visual preview only: a sorted translucent pass is NOT integrated in live renderer.
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.depthMask(false);
  const sorted=sortPack4PreviewTranslucent(mesh.translucent,mesh.stride);
  gl.bufferData(gl.ARRAY_BUFFER,sorted,gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES,0,sorted.length/mesh.stride);
  gl.depthMask(true);
  const err=gl.getError();
  if(err!==gl.NO_ERROR)throw Error('WebGL error '+err);
  return {opaqueVertices:mesh.opaque.length/mesh.stride,
          transparentVertices:mesh.translucent.length/mesh.stride};
  }finally{
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(prog);
  }
}
const grid=document.querySelector('#gallery');
const outcomes=[];
const allAssets=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS];
// One WebGL2 drawing surface, never 23 simultaneous GPU contexts on mobile.
const sharedCanvas=document.createElement('canvas');
sharedCanvas.width=340;sharedCanvas.height=296;
for(const a of allAssets){
  const card=document.createElement('article');
  card.className='item';
  const canvas=document.createElement('canvas');
  canvas.width=340;canvas.height=296;
  canvas.setAttribute('aria-label','3D candidate '+a.name);
  const heading=document.createElement('h2');
  heading.textContent=a.name+' · ID '+a.id;
  const description=document.createElement('p');
  const light=a.light;
  description.textContent=(a.profile||a.description||a.detail||a.name)+' • '+a.parts.length+' source sub-parts'+
    (light?' • LIGHT METADATA ONLY':'');
  const select=document.createElement('select');
  select.setAttribute('aria-label','Rotate '+a.name);
  for(let r=0;r<4;r++){
    const option=document.createElement('option');
    option.value=String(r);option.textContent='Rotation '+r*90+'°';select.append(option);
  }
  card.append(canvas,heading,description,select);grid.append(card);
  const render=()=>{
    const metrics=drawOne(sharedCanvas,a.id,Number(select.value));
    const ctx=canvas.getContext('2d');
    if(!ctx)throw Error('Canvas snapshot surface unavailable');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(sharedCanvas,0,0,canvas.width,canvas.height);
    return metrics;
  };
  select.addEventListener('change',()=>{
    try{render();}catch(error){description.textContent=String(error);}
  });
  try{outcomes.push({id:a.id,ok:true,...render()});}
  catch(e){outcomes.push({id:a.id,ok:false,error:String(e)});description.textContent=String(e);}
}
const success=outcomes.filter(x=>x.ok).length;
document.querySelector('#status').textContent=
  success+'/'+outcomes.length+' candidate models rendered in isolated WebGL2. Not deployed.';
window.__PACK4_GALLERY_RESULT=Object.freeze({ready:true,success,results:outcomes,
  allIds:allAssets.map(a=>a.id), unmerged:true,
  sharedWebglSurface:true});
