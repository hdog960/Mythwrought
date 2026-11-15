/** Pack 5-only shop fixture assets: actual authored triangle WebGL2; not world/engine renderer. */
import {SHOP_FIXTURES,shopBoxMesh} from '../../../src/block-packs/pack-5/shop-workshop.mjs';
const canvas=document.getElementById('gl'),labels=document.getElementById('labels'),result=document.getElementById('result');
const gl=canvas.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true});
if(!gl){result.textContent='BLOCKED: WebGL2 unavailable';result.dataset.status='blocked';}
else{
 try{
  const requested=window.PACK5_PREVIEW_ROTATION??new URLSearchParams(location.search).get('rotation')??0;
  const rotation=Number(requested);if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid orientation');
  const stage=document.getElementById('stage');
  const dpr=Math.min(1.5,devicePixelRatio||1);
  canvas.width=Math.max(8,Math.round(stage.clientWidth*dpr));canvas.height=Math.max(6,Math.round(stage.clientHeight*dpr));
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
   if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const vs=`#version 300 es
in vec3 aPos;in vec4 aColor;uniform vec2 uScale;uniform vec2 uOffset;uniform vec3 uMid;out vec4 vColor;
void main(){vec3 p=aPos-uMid;vec2 iso=vec2((p.x-p.z)*.85,p.y*.92-(p.x+p.z)*.38);
gl_Position=vec4((iso-uOffset)*uScale,(p.x+p.z+p.y*.65)*-.065,1.);vColor=vec4(aColor.rgb*(.94+.06*p.y),aColor.a);}`;
  const fs=`#version 300 es
precision highp float;in vec4 vColor;out vec4 outColor;void main(){outColor=vColor;}`;
  const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
  const atPosition=gl.getAttribLocation(prog,'aPos'),atColor=gl.getAttribLocation(prog,'aColor');
  const uScale=gl.getUniformLocation(prog,'uScale'),uMid=gl.getUniformLocation(prog,'uMid'),uOffset=gl.getUniformLocation(prog,'uOffset');
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.enable(gl.SCISSOR_TEST);
  let triangles=0,rendered=0;
  for(const [i,d] of SHOP_FIXTURES.entries()){
   const col=i%2,row=Math.floor(i/2),W=canvas.width,H=canvas.height;
   const x=Math.floor(col*W/2),w=Math.floor((col+1)*W/2)-x,y=Math.floor((1-row)*H/2),h=Math.floor((2-row)*H/2)-y;
   gl.viewport(x,y,w,h);gl.scissor(x,y,w,h);gl.clearColor(i%2?.13:.10,row?.20:.16,.24,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   const m=shopBoxMesh(d,{rotation});
   const pts=[];for(let v=0;v<m.positions.length;v+=3)pts.push(Array.from(m.positions.subarray(v,v+3)));
   const min=Array.from({length:3},(_,k)=>Math.min(...pts.map(p=>p[k]))),max=Array.from({length:3},(_,k)=>Math.max(...pts.map(p=>p[k])));
   const mid=min.map((v,k)=>(v+max[k])/2);
   const projected=pts.map(p=>{let xx=p[0]-mid[0],yy=p[1]-mid[1],zz=p[2]-mid[2];return [(xx-zz)*.85,yy*.92-(xx+zz)*.38]});
   const bounds=[0,1].map(k=>[Math.min(...projected.map(p=>p[k])),Math.max(...projected.map(p=>p[k]))]);
   const horizontal=Math.max(.01,bounds[0][1]-bounds[0][0]),vertical=Math.max(.01,bounds[1][1]-bounds[1][0]);
   const horizontalScale=1.55/horizontal,verticalScale=1.48/vertical;
   const fit=Math.min(horizontalScale,verticalScale);
   gl.uniform2f(uScale,fit,fit);gl.uniform2f(uOffset,(bounds[0][0]+bounds[0][1])/2,(bounds[1][0]+bounds[1][1])/2);
   gl.uniform3f(uMid,...mid);
   const vao=gl.createVertexArray();gl.bindVertexArray(vao);
   const pos=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pos);gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(atPosition);gl.vertexAttribPointer(atPosition,3,gl.FLOAT,false,0,0);
   const colors=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,colors);gl.bufferData(gl.ARRAY_BUFFER,m.colors,gl.STATIC_DRAW);
   gl.enableVertexAttribArray(atColor);gl.vertexAttribPointer(atColor,4,gl.FLOAT,false,0,0);
   const idx=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
   gl.drawElements(gl.TRIANGLES,m.indices.length,gl.UNSIGNED_SHORT,0);
   if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 draw error');
   const label=document.createElement('span');label.textContent=`${d.symbolicId} ${d.variant.replaceAll('-',' ')}`;labels.append(label);
   rendered++;triangles+=m.triangles;
   gl.deleteBuffer(pos);gl.deleteBuffer(colors);gl.deleteBuffer(idx);gl.deleteVertexArray(vao);
  }
  const pixel=new Uint8Array(4);gl.readPixels(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
  if(gl.getError()!==gl.NO_ERROR)throw Error('GPU readPixels failed');
  result.dataset.status='pass';result.textContent=`WebGL2 PASS — ${rendered} physical commercial fixture variants, ${triangles} source triangles, rotation ${rotation}; NOT playable`;
 }catch(e){result.dataset.status='fail';result.textContent='WebGL2 FAILED: '+e.message;}
}
