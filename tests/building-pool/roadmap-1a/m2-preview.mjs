import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {makeM2DiagnosticMesh} from './m2-preview-mesh.mjs';
import {fitM2Camera} from './m2-preview-camera.mjs';
const inherited=getM1Blueprints().filter(b=>[
 'r1:house:enchanted-forest:medium:002','r1:tavern:enchanted-forest:small:001'].includes(b.id));
const buildings=[...inherited,...getM1InnExemplars(),...getM2Originals()];
const unique=new Map(buildings.map(b=>[b.id,b]));
if(unique.size!==11)throw Error('Expected 11 distinct source-authored QA candidates');
const input=document.getElementById('blueprint'),view=document.getElementById('view');
const canvas=document.getElementById('render'),details=document.getElementById('details');
for(const b of buildings){const o=document.createElement('option');o.value=b.id;o.textContent=b.title+' ('+b.biome+', '+b.size+')';input.add(o);}
const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:true,alpha:false});
if(!gl){details.textContent='WebGL2 unavailable — NO candidate screenshot certification';throw Error('WebGL2 unavailable');}
const vs=String.raw`#version 300 es
precision highp float;
layout(location=0) in vec3 a_xyz;layout(location=1) in vec3 a_rgb;
uniform mat4 u_mvp;out vec3 v_rgb;
void main(){gl_Position=u_mvp*vec4(a_xyz,1.);v_rgb=a_rgb;}`;
const fs=String.raw`#version 300 es
precision highp float;in vec3 v_rgb;out vec4 frag;
void main(){frag=vec4(v_rgb,1.);}`;
function shader(kind,src){const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();
gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.useProgram(program);
const mvp=gl.getUniformLocation(program,'u_mvp');
let current=null;
function draw(){
 if(!current)return;
 const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(2,Math.floor(canvas.clientWidth*dpr)),h=Math.max(2,Math.floor(canvas.clientHeight*dpr));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 gl.viewport(0,0,w,h);
 const cam=fitM2Camera(current.building,current.geometry.vertices,w,h);
 gl.uniformMatrix4fv(mvp,false,cam.matrix);
 gl.clearColor(18/255,28/255,41/255,1);
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.drawArrays(gl.TRIANGLES,0,current.geometry.vertices.length/6);
}
function update(){
 const b=unique.get(input.value);if(!b)throw Error('Unknown authored blueprint '+input.value);
 const geometry=makeM2DiagnosticMesh(b,{cutaway:view.value==='cutaway'});
 gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
 current={building:b,geometry};
 details.textContent=b.id+' · '+geometry.displayedCells+'/'+geometry.sourceCells+
  ' authored cells · '+geometry.triangles+' cube triangles · WebGL2 active · '+view.value;
 draw();
}
input.addEventListener('change',update);view.addEventListener('change',update);
window.addEventListener('resize',draw);
window.addEventListener('webglcontextlost',e=>{e.preventDefault();details.textContent='WebGL2 lost — screenshot invalid';});
update();
