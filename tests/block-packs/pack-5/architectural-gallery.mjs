/** Pack 5 isolated real WebGL2 gallery. Only uses authored physical candidate triangle meshes. */
import {PACK5_SURFACES,surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
const gl=document.getElementById('gl').getContext('webgl2',{antialias:true,preserveDrawingBuffer:true});
const result=document.getElementById('result');
const labels=document.getElementById('labels');
if(!gl){result.textContent='WebGL2 unavailable — no verification';result.dataset.status='blocked';}
else{
 try{
  const vs=`#version 300 es
in vec3 aPos; in vec4 aColor; uniform vec2 uCenter; uniform float uScale;
out vec4 vColor;
void main(){
 vec3 p=aPos-vec3(.5);
 float rx=p.x*.866-p.z*.5; float rz=p.x*.5+p.z*.866;
 float sx=(rx-rz)*.70; float sy=p.y*.90-(rx+rz)*.40;
 gl_Position=vec4(uCenter.x+sx*uScale,uCenter.y+sy*uScale, (rx+rz+p.y)*-.12,1.0);
 vColor=vec4(aColor.rgb*(.90+.1*p.y),aColor.a);
}`;
  const fs=`#version 300 es
precision highp float; in vec4 vColor; out vec4 outColor;
void main(){outColor=vColor;}`;
  function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const position=gl.getAttribLocation(program,'aPos'),color=gl.getAttribLocation(program,'aColor'),center=gl.getUniformLocation(program,'uCenter'),scale=gl.getUniformLocation(program,'uScale');
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
  gl.enable(gl.SCISSOR_TEST);
  let rendered=0,triangles=0;
  PACK5_SURFACES.forEach((d,i)=>{
   const column=i%3,row=Math.floor(i/3),w=300,h=300,x=column*w,y=600-(row+1)*h;
   gl.viewport(x,y,w,h);gl.scissor(x,y,w,h);gl.clearColor(.14,.20,.24,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   const m=surfaceBoxMesh(d),vao=gl.createVertexArray();gl.bindVertexArray(vao);
   const pos=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pos);gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
   const col=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,col);gl.bufferData(gl.ARRAY_BUFFER,m.colors,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,4,gl.FLOAT,false,0,0);
   const elements=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elements);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
   gl.uniform2f(center,0,-.12);gl.uniform1f(scale,1.38);gl.drawElements(gl.TRIANGLES,m.indices.length,gl.UNSIGNED_SHORT,0);
   const pixels=new Uint8Array(4);gl.readPixels(x+w/2,y+h/2,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
   if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 draw or readback error');
   triangles+=m.triangles;rendered++;
   const span=document.createElement('span');span.textContent=`${d.symbolicId} • ${d.variant.replaceAll('-',' ')}`;labels.append(span);
   gl.deleteBuffer(pos);gl.deleteBuffer(col);gl.deleteBuffer(elements);gl.deleteVertexArray(vao);
  });
  result.dataset.status='pass';result.textContent=`WebGL2 drew ${rendered} authored variants (${triangles} triangles). This is an isolated gallery, NOT gameplay verification.`;
 }catch(e){result.dataset.status='fail';result.textContent='WebGL2 FAILED: '+e.message;}
}
