import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_NEW_REGION_ARCHITECTURES} from '../../../src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
import {M1_SPECIALTY_COURTS} from '../../../src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
import {M1_GRAND_COMPLEXES} from '../../../src/building-pool/roadmap-2b/m1-grand-complexes.mjs';
import {M1_REGIONAL_GALLERIES} from '../../../src/building-pool/roadmap-2b/m1-regional-galleries.mjs';
import {M1_CLIFF_AND_FESTIVAL} from '../../../src/building-pool/roadmap-2b/m1-cliff-and-festival.mjs';
import {M1_CONCAVE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-concave-courts.mjs';
import {M1_SCULPTED_REGIONAL} from '../../../src/building-pool/roadmap-2b/m1-sculpted-regional.mjs';
import {M1_FIVE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-five-courts.mjs';
import {M1_BESPOKE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-bespoke-courts.mjs';
import {M1_RITUAL_TRADES} from '../../../src/building-pool/roadmap-2b/m1-ritual-trades.mjs';
import {M1_SHADOWSTAGE} from '../../../src/building-pool/roadmap-2b/m1-shadowstage.mjs';

// Browser source loads the REAL candidate blueprint modules from this draft PR.
// Draws only software-WebGL2 full-cube proxies, never producer-family AABBs,
// rotations, glass transparency, final artwork, or playable runtime placement.
const params=new URLSearchParams(location.search), models=[
 MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,...M1_CLIFF_AND_FESTIVAL,...M1_CONCAVE_COURTS,...M1_SCULPTED_REGIONAL,...M1_FIVE_COURTS,...M1_BESPOKE_COURTS,...M1_RITUAL_TRADES,...M1_SHADOWSTAGE
];
const modelId=params.get('id')||'r2:tailor:temperate:small:01';
const view=params.get('view')==='cutaway'?'cutaway':'exterior';
const model=models.find(x=>x.id===modelId);
if(!model)throw Error('Unknown 2B authored blueprint: '+modelId);
document.querySelector('#name').textContent=model.title;
document.querySelector('#kind').textContent=
 'M1 source-exact coordinates / '+view+' / software WebGL2 cube-proxy visualization';
const canvas=document.querySelector('#scene'),gl=canvas.getContext('webgl2',
 {alpha:false,antialias:true,depth:true,preserveDrawingBuffer:true});
if(!gl)throw Error('WebGL2 unavailable in preview browser');
canvas.width=Math.floor(innerWidth);canvas.height=Math.floor(innerHeight);
const vs=[
 '#version 300 es','in vec3 aPosition;in vec3 aColor;out vec3 vColor;',
 'uniform vec3 uMid; uniform vec2 uViewport;uniform float uScale;',
 'void main(){',
 ' vec3 p=aPosition-uMid;',
 ' vec2 screen=vec2((p.x-p.z)*0.87,(p.y*1.1-(p.x+p.z)*0.39));',
 ' gl_Position=vec4(2.0*screen*uScale/uViewport,clamp(-(p.x+p.z+p.y*1.4)*0.017,-0.95,0.95),1.0);',
 ' vColor=aColor;',
 '}'
].join('\n');
const fs=[
 '#version 300 es','precision mediump float;in vec3 vColor;out vec4 pixel;',
 'void main(){pixel=vec4(vColor,1.0);}'
].join('\n');
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));
gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const vertices=[];
const faces=[
 {q:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],shade:0.83},
 {q:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],shade:0.56},
 {q:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],shade:0.72},
 {q:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],shade:0.92},
 {q:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],shade:1.14}
];
function rgb(v){
 if(v.kind==='window')return [0.37,0.82,0.87];
 if(v.kind==='foundation')return [0.28,0.37,0.43];
 if(v.kind==='floor')return v.material==='pack1:005'?[0.61,0.64,0.66]:[0.55,0.43,0.31];
 if(v.kind==='roof')return [0.52,0.31,0.35];
 if(v.kind==='wall')return [0.71,0.60,0.42];
 if(v.kind==='decor')return [0.36,0.77,0.44];
 if(v.material==='pack1:008')return [0.36,0.74,0.82];
 if(v.material==='pack4:058')return [0.87,0.65,0.34];
 return [0.74,0.54,0.31];
}
const culled=model.voxels.filter(v=>{
 if(view!=='cutaway')return true;
 if(v.kind==='roof'&&v.y>=7)return false;
 if(v.kind==='wall'&&v.z<=Math.floor(model.extents.z/3)&&v.y>=3)return false;
 return true;
});
// Draw complete six-faced proxy cells. Occlusion is GPU-tested, not a
// painted/external art rendering.
for(const v of culled){
 const color=rgb(v);
 for(const f of faces){
  const corners=f.q.map(a=>[v.x+a[0],v.y+a[1],v.z+a[2]]);
  for(const i of [0,1,2,0,2,3]){
   const p=corners[i];vertices.push(...p,...color.map(c=>Math.min(1,c*f.shade)));
  }
 }
}
const data=new Float32Array(vertices);const vao=gl.createVertexArray();gl.bindVertexArray(vao);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
const stride=6*Float32Array.BYTES_PER_ELEMENT;
const pos=gl.getAttribLocation(program,'aPosition'),col=gl.getAttribLocation(program,'aColor');
gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,stride,0);
gl.enableVertexAttribArray(col);gl.vertexAttribPointer(col,3,gl.FLOAT,false,stride,3*4);
gl.uniform3f(gl.getUniformLocation(program,'uMid'),model.extents.x/2,
 Math.max(3,model.extents.y*.38),model.extents.z/2);
gl.uniform2f(gl.getUniformLocation(program,'uViewport'),canvas.width,canvas.height);
const width=model.extents.x+model.extents.z;
const s=Math.min(canvas.width/(width*0.92),canvas.height/(model.extents.y*1.7+width*.35));
gl.uniform1f(gl.getUniformLocation(program,'uScale'),s*1.23);
gl.viewport(0,0,canvas.width,canvas.height);
gl.clearColor(.061,.116,.167,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
gl.drawArrays(gl.TRIANGLES,0,data.length/6);
gl.flush();
if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 proxy draw failed');
const details=model.id+' · '+view+' · '+culled.length+' occupied proxies / '+
 model.voxels.length+' authored voxel cells / '+canvas.width+'×'+canvas.height;
document.querySelector('#status').textContent=details;
document.body.dataset.ready='yes';
document.body.dataset.webgl='WebGL2';
document.body.dataset.blueprint=model.id;
document.body.dataset.view=view;
document.body.dataset.voxels=String(culled.length);
