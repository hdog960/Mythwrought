import {createVariant4CompletionBlueprint} from '../../../src/building-pool/roadmap-3b/m2-variant4-completion.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const canvas=document.getElementById('render'),details=document.getElementById('details');
const selections=Object.fromEntries(['design','view'].map(k=>[k,document.getElementById(k)]));
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
gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.useProgram(program);
const uMVP=gl.getUniformLocation(program,'u_mvp');
let current=null;
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(2,Math.floor(canvas.clientWidth*dpr)),h=Math.max(2,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
function draw(){
 resize();
 const camera=fitPreviewCamera(current.b.envelope,current.geometry.vertices,canvas.width,canvas.height);
 gl.uniformMatrix4fv(uMVP,false,camera.matrix);
 gl.clearColor(.07,.11,.16,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,current.geometry.vertices.length/6);
}
function update(){
 const [type,biome,size]=selections.design.value.split(':');
 const b=createVariant4CompletionBlueprint(type,biome,size,4),geometry=createPreviewMesh(b,{cutaway:selections.view.value==='cutaway'});
 gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
 current={b,geometry};
 details.textContent=`${b.id} · ${geometry.sourceCells.toLocaleString()} displayed envelope voxels · ${geometry.triangleCount.toLocaleString()} visible triangles · WebGL2 active · ${selections.view.value}`;
 draw();
}
for(const select of Object.values(selections))select.addEventListener('change',update);
window.addEventListener('resize',()=>{if(current)draw();});
window.addEventListener('webglcontextlost',e=>{e.preventDefault();details.textContent='WebGL2 context lost — preview not certified';});
update();
