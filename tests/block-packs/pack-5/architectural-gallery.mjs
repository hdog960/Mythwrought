/** Genuine WebGL2 preview of Pack 5 source-authored physical mesh triangles; NOT game integration. */
import {PACK5_SURFACES,surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
const canvas=document.getElementById('gl');
const labels=document.getElementById('labels');
const result=document.getElementById('result');
const gl=canvas.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true});
if(!gl){result.textContent='WebGL2 unavailable — no verification';result.dataset.status='blocked';}
else{
 try{
  const stage=document.getElementById('stage');
  const requestedRotation=window.PACK5_PREVIEW_ROTATION??new URLSearchParams(window.location.search).get('rotation')??0;
  const rotation=Number(requestedRotation);
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid preview rotation');
  const dpr=Math.min(1.5,window.devicePixelRatio||1);
  canvas.width=Math.max(6,Math.floor(stage.clientWidth*dpr));
  canvas.height=Math.max(4,Math.floor(stage.clientHeight*dpr));
  const vs=`#version 300 es
in vec3 aPos; in vec4 aColor;
uniform vec2 uScale;
out vec4 vColor;
void main(){
 vec3 p=aPos-vec3(.5);
 float sx=(p.x-p.z)*.85; float sy=p.y*.90-(p.x+p.z)*.38;
 gl_Position=vec4(sx*uScale.x,(sy-.02)*uScale.y,(p.x+p.z+p.y*.65)*-.12,1.0);
 vColor=vec4(aColor.rgb*(.90+.1*p.y),aColor.a);
}`;
  const fs=`#version 300 es
precision highp float; in vec4 vColor; out vec4 outColor;
void main(){outColor=vColor;}`;
  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const position=gl.getAttribLocation(program,'aPos'),color=gl.getAttribLocation(program,'aColor'),scale=gl.getUniformLocation(program,'uScale');
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.enable(gl.SCISSOR_TEST);
  let rendered=0,triangles=0;
  PACK5_SURFACES.forEach((d,i)=>{
   const col=i%3,row=Math.floor(i/3),W=canvas.width,H=canvas.height;
   const x=Math.floor(col*W/3),w=Math.floor((col+1)*W/3)-x;
   const y=Math.floor((1-row)*H/2),h=Math.floor((2-row)*H/2)-y;
   gl.viewport(x,y,w,h);gl.scissor(x,y,w,h);
   gl.clearColor(col%2?.13:.11,row?.18:.15,.20,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   const m=surfaceBoxMesh(d,{rotation}),vao=gl.createVertexArray();gl.bindVertexArray(vao);
   const pos=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pos);gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
   const colors=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,colors);gl.bufferData(gl.ARRAY_BUFFER,m.colors,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,4,gl.FLOAT,false,0,0);
   const indices=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
   const fit=Math.min(w,h);
   gl.uniform2f(scale,fit/w*.94,fit/h*.94);
   gl.drawElements(gl.TRIANGLES,m.indices.length,gl.UNSIGNED_SHORT,0);
   if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 draw failed');
   triangles+=m.triangles;rendered++;
   const span=document.createElement('span');span.textContent=`${d.symbolicId} · ${d.variant.replaceAll('-',' ')}`;labels.append(span);
   gl.deleteBuffer(pos);gl.deleteBuffer(colors);gl.deleteBuffer(indices);gl.deleteVertexArray(vao);
  });
  const sample=new Uint8Array(4);gl.readPixels(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1,gl.RGBA,gl.UNSIGNED_BYTE,sample);
  if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 readback failed');
  result.dataset.status='pass';
  result.textContent=`WebGL2 PASS — ${rendered} genuine physical meshes, ${triangles} unculled triangles; rotation ${rotation}; preview only, not live gameplay`;
 }catch(e){result.dataset.status='fail';result.textContent='WebGL2 FAILED — '+e.message;}
}
