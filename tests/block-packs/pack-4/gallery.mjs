// An isolated WebGL2 visual inspection harness; NEVER imported by production main.
import {PACK4_WINDOW_ASSETS,windowPreviewMesh} from '../../../src/block-packs/pack-4/windows.mjs';
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
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(prog)||'Link failed');
  return prog;
}
function drawOne(canvas,id){
  const gl=canvas.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true,antialias:true});
  if(!gl)throw Error('WebGL2 unavailable; cannot validate real candidate preview');
  const mesh=windowPreviewMesh(id,0),prog=buildProgram(gl);
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(.12,.18,.21,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  gl.useProgram(prog);
  const vao=gl.createVertexArray(),buf=gl.createBuffer();
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
  gl.bufferData(gl.ARRAY_BUFFER,mesh.translucent,gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES,0,mesh.translucent.length/mesh.stride);
  gl.depthMask(true);
  const err=gl.getError();
  if(err!==gl.NO_ERROR)throw Error('WebGL error '+err);
  return {opaqueVertices:mesh.opaque.length/mesh.stride,
          transparentVertices:mesh.translucent.length/mesh.stride};
}
const grid=document.querySelector('#gallery');
const outcomes=[];
for(const a of PACK4_WINDOW_ASSETS){
  const card=document.createElement('article');
  card.className='item';
  const canvas=document.createElement('canvas');
  canvas.width=340;canvas.height=296;
  canvas.setAttribute('aria-label','3D candidate '+a.name);
  const heading=document.createElement('h2');
  heading.textContent=a.name+' · ID '+a.id;
  const description=document.createElement('p');
  description.textContent=a.profile+' • '+a.parts.length+' physical/decorative pieces';
  card.append(canvas,heading,description);grid.append(card);
  try{outcomes.push({id:a.id,ok:true,...drawOne(canvas,a.id)});}
  catch(e){outcomes.push({id:a.id,ok:false,error:String(e)});description.textContent=String(e);}
}
const success=outcomes.filter(x=>x.ok).length;
document.querySelector('#status').textContent=
  success+'/'+outcomes.length+' candidate models rendered in isolated WebGL2. Not deployed.';
window.__PACK4_GALLERY_RESULT=Object.freeze({ready:true,success,results:outcomes});
