import {PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
const canvas=document.querySelector('#gallery'),names=document.querySelector('#names');
const dpr=Math.min(2,window.devicePixelRatio||1);
canvas.width=Math.floor(canvas.clientWidth*dpr);
canvas.height=Math.floor(canvas.clientHeight*dpr);
const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:true,alpha:false});
if(!gl)throw Error('A genuine WebGL2 GPU context is required');
const vertexSource=`#version 300 es
precision highp float;
in vec3 a_position;in vec4 a_color;out vec4 v_color;
uniform vec3 u_center;uniform float u_scale;
void main(){
 vec3 p=a_position-u_center;
 gl_Position=vec4((p.x-p.z)*u_scale*.94,
  (p.x+p.z)*u_scale*.34+p.y*u_scale*.96,
  (p.x+p.z)*u_scale*.24-p.y*u_scale*.08,1.);
 v_color=a_color;
}`;
const fragmentSource=`#version 300 es
precision highp float;in vec4 v_color;out vec4 color;
void main(){color=vec4(v_color.rgb*.95+.04,1.);}`;
function shader(type,source){
 const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
 return s;
}
const program=gl.createProgram();
gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource));
gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource));
gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const pLoc=gl.getAttribLocation(program,'a_position'),cLoc=gl.getAttribLocation(program,'a_color');
const centerLoc=gl.getUniformLocation(program,'u_center'),scaleLoc=gl.getUniformLocation(program,'u_scale');
gl.enable(gl.SCISSOR_TEST);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
const cols=6,rows=6,results=[];
for(let i=0;i<PACK5_BUILDER_CATALOG.length*2;i++){
 const f=PACK5_BUILDER_CATALOG[Math.floor(i/2)],asset=resolvePack5BuilderAsset(f.symbolicId,f.variants[i%2]);
 const m=asset.mesh(asset.descriptor,{rotation:i%4});
 const box=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
 for(let k=0;k<m.positions.length;k+=3)for(let a=0;a<3;a++){
  const x=m.positions[k+a];box[a]=Math.min(box[a],x);box[a+3]=Math.max(box[a+3],x);
 }
 const center=box.slice(0,3).map((v,a)=>(v+box[a+3])/2);
 const dx=box[3]-box[0],dy=box[4]-box[1],dz=box[5]-box[2];
 const scale=Math.min(1.35/Math.max(dx+dz,.8),1.3/Math.max(dy+.35*(dx+dz),.8));
 const x=Math.floor((i%cols)*canvas.width/cols);
 const y=Math.floor((rows-1-Math.floor(i/cols))*canvas.height/rows);
 const width=Math.floor((i%cols+1)*canvas.width/cols)-x;
 const height=Math.floor((rows-Math.floor(i/cols))*canvas.height/rows)-y;
 gl.viewport(x,y,width,height);gl.scissor(x,y,width,height);
 gl.clearColor(.09+(i%2)*.023,.14,.18,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniform3fv(centerLoc,center);gl.uniform1f(scaleLoc,scale);
 function buffer(loc,size,data){
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);
  return b;
 }
 const position=buffer(pLoc,3,m.positions),color=buffer(cLoc,4,m.colors);
 const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
 gl.drawElements(gl.TRIANGLES,m.indices.length,gl.UNSIGNED_SHORT,0);
 const pixels=new Uint8Array(width*height*4);gl.readPixels(x,y,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
 const bg=Math.round((.09+(i%2)*.023)*255);
 let foreground=0;
 for(let k=0;k<pixels.length;k+=4)
  if(Math.abs(pixels[k]-bg)>30||Math.abs(pixels[k+1]-36)>30)foreground++;
 gl.deleteBuffer(position);gl.deleteBuffer(color);gl.deleteBuffer(ib);
 results.push({id:f.symbolicId,variant:asset.variant,rotation:i%4,
  triangles:m.indices.length/3,foreground,width,height});
 const label=document.createElement('div');label.className='name';
 label.textContent=f.symbolicId+' '+asset.variant;names.append(label);
}
gl.finish();
window.PACK5_BUILDER_PREVIEW={webgl2:true,cards:results.length,results,
  complete:results.length===36&&new Set(results.map(r=>r.id+'/'+r.variant)).size===36&&results.every(r=>r.triangles>0&&r.foreground>40)};
document.body.dataset.completed=String(window.PACK5_BUILDER_PREVIEW.complete);
