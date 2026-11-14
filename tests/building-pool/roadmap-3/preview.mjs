import {createM1Blueprint} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
const canvas=document.getElementById('render'),details=document.getElementById('details');
const selections=Object.fromEntries(['type','biome','size','view'].map(k=>[k,document.getElementById(k)]));
const gl=canvas.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true,alpha:false});
if(!gl){details.textContent='WebGL2 unavailable — no candidate image evidence';throw new Error('WebGL2 unavailable');}
const vs=`#version 300 es
precision highp float;
layout(location=0) in vec3 a_xyz; layout(location=1) in vec3 a_rgb;
uniform mat4 u_mvp; out vec3 v_rgb;
void main(){gl_Position=u_mvp*vec4(a_xyz,1.);v_rgb=a_rgb;}`;
const fs=`#version 300 es
precision highp float; in vec3 v_rgb;out vec4 frag;
void main(){frag=vec4(v_rgb,1.);}`;
function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(program);
const uMVP=gl.getUniformLocation(program,'u_mvp');
const unit=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function lookAt(eye,at){const f=unit(sub(at,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);
 return [s[0],u[0],-f[0],0, s[1],u[1],-f[1],0, s[2],u[2],-f[2],0, -dot(s,eye),-dot(u,eye),dot(f,eye),1];}
function ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1];}
function multiply(a,b){const out=new Array(16).fill(0);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)out[j*4+i]+=a[k*4+i]*b[j*4+k];return out;}
let current=null;
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(2,Math.floor(canvas.clientWidth*dpr)),h=Math.max(2,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
function draw(){
 resize();const {width:w,height:h,depth:d}=current.b.envelope;
 const aspect=canvas.width/canvas.height,span=Math.max(w,d,h)*.87;
 const eye=[w*1.8,h*1.6,d*1.8],look=[w*.5,h*.48,d*.5];
 gl.uniformMatrix4fv(uMVP,false,multiply(ortho(-span*aspect,span*aspect,-span,span,-150,150),lookAt(eye,look)));
 gl.clearColor(.07,.11,.16,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,current.geometry.vertices.length/6);
}
function update(){
 const type=selections.type.value,biome=selections.biome.value,size=selections.size.value;
 const b=createM1Blueprint(type,biome,size),geometry=createPreviewMesh(b,{cutaway:selections.view.value==='cutaway'});
 gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
 current={b,geometry};
 details.textContent=`${b.id} · ${geometry.sourceCells.toLocaleString()} displayed envelope voxels · ${geometry.triangleCount.toLocaleString()} visible triangles · WebGL2 active · ${selections.view.value}`;
 draw();
}
for(const select of Object.values(selections))select.addEventListener('change',update);
window.addEventListener('resize',()=>{if(current)draw();});
window.addEventListener('webglcontextlost',e=>{e.preventDefault();details.textContent='WebGL2 context lost — preview not certified';});
update();
