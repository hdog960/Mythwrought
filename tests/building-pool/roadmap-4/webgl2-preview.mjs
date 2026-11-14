// Candidate-only actual WebGL2 mesh visualization; fails closed when the context is unavailable.
// Does not import the engine, mutate world data, register blocks, or touch saves.
import {buildM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
const params=new URLSearchParams(location.search);
const type=params.get('type')||'castle-palace';
const biome=params.get('biome')||'temperate';
const size=params.get('size')||'small';
const cutaway=params.get('cutaway')==='1';
const b=buildM1(type,biome,size);
const floorIndex=cutaway?Math.max(0,Math.min(b.architecturalNotes.storyCount-1,Number(params.get('floor')??0)|0)):0;
const canvas=document.querySelector('#view'),metrics=document.querySelector('#metrics');
document.querySelector('#label').textContent=[b.biome,b.size,b.type,cutaway?'floor '+(floorIndex+1):'exterior'].join(' · ');
const gl=canvas.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true,antialias:false,depth:true});
if(!gl){metrics.textContent='WebGL2 unsupported — screenshot NOT ACCEPTED';throw Error('Real WebGL2 context unavailable');}
const base=new Set(b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>c.at.join(',')));
const visible=c=>{
 if(!cutaway)return true;
 if(c.role==='roof'||c.at[1]>=(floorIndex+1)*4)return false;
 const [x,y,z]=c.at;
 return !(y>0&&['wall','window','parapet'].includes(c.role)&&
   (!base.has([x+1,0,z].join(','))||!base.has([x,0,z+1].join(','))));
};
const cells=b.cells.filter(visible),cellSet=new Map(cells.map(c=>[c.at.join(','),c]));
const SHADES=[0.75,0.64,1,0.38,0.84,0.7];
const FACES=[
 [[1,0,0],[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]],
 [[-1,0,0],[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]],
 [[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],
 [[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]],
 [[0,0,1],[[1,0,1],[1,1,1],[0,1,1],[0,0,1]]],
 [[0,0,-1],[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]]
];
const P={temperate:[.71,.58,.42],desert:[.84,.65,.37],snow:[.66,.73,.84],'enchanted-forest':[.45,.67,.54],mountain:[.57,.60,.68]};
const R={temperate:[.69,.28,.27],desert:[.73,.48,.25],snow:[.39,.48,.62],'enchanted-forest':[.36,.42,.64],mountain:[.45,.41,.50]};
const roomPaint=new Map();
if(cutaway){let i=0;const colors=[[.91,.68,.41],[.51,.79,.88],[.57,.77,.57],[.77,.6,.86]];
 for(const s of b.spaces.filter(s=>s.level===floorIndex*4+1)){
  for(const [x,z] of s.footprint)roomPaint.set([x,s.level-1,z].join(','),colors[i%colors.length]);i++;
 }}
function paint(c){return roomPaint.get(c.at.join(','))|| (c.role==='roof'?R[biome]:c.role==='window'?[.32,.8,.9]:c.role==='stair'?[.93,.77,.44]:c.role==='partition'?[.68,.52,.33]:c.asset==='base:wood'?[.66,.41,.26]:P[biome]);}
const vertices=[];let quads=0;
for(const c of cells){const [x,y,z]=c.at,col=paint(c);
 for(let face=0;face<6;face++){
  const [d,v]=FACES[face];if(cellSet.has([x+d[0],y+d[1],z+d[2]].join(',')))continue;
  for(const i of [0,1,2,0,2,3]){const p=v[i];vertices.push(x+p[0],y+p[1],z+p[2],...col.map(q=>q*SHADES[face]));}quads++;
 }}
const VS=`#version 300 es
in vec3 a_pos;in vec3 a_rgb;out vec3 v_col;
uniform vec2 u_center;uniform float u_scale;uniform float u_aspect;
void main(){float x=(a_pos.x-a_pos.z)*0.70710678;float y=a_pos.y*1.10-(a_pos.x+a_pos.z)*.37;
 gl_Position=vec4((x-u_center.x)*u_scale/u_aspect,(y-u_center.y)*u_scale,-(a_pos.x+a_pos.z)*.005+a_pos.y*.001,1.0);v_col=a_rgb;}`;
const FS=`#version 300 es
precision highp float;in vec3 v_col;out vec4 fragColor;void main(){fragColor=vec4(v_col,1.0);}`;
function shader(kind,src){const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('WebGL2 shader: '+gl.getShaderInfoLog(s));return s;}
const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error('WebGL2 link: '+gl.getProgramInfoLog(prog));
gl.useProgram(prog);const data=new Float32Array(vertices),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
for(const [attribute,offset] of [['a_pos',0],['a_rgb',12]]){const loc=gl.getAttribLocation(prog,attribute);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,24,offset);}
const points=[];for(const x of [0,b.bounds[0]])for(const y of [0,b.bounds[1]])for(const z of [0,b.bounds[2]])points.push([(x-z)*.70710678,y*1.10-(x+z)*.37]);
const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
const width=innerWidth,height=innerHeight,aspect=width/height,scale=Math.min(1.75/(maxY-minY),1.84*aspect/(maxX-minX));
gl.uniform2f(gl.getUniformLocation(prog,'u_center'),(minX+maxX)/2,(minY+maxY)/2);gl.uniform1f(gl.getUniformLocation(prog,'u_scale'),scale);gl.uniform1f(gl.getUniformLocation(prog,'u_aspect'),aspect);
canvas.width=width;canvas.height=height;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.08,.12,.18,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.drawArrays(gl.TRIANGLES,0,data.length/6);
if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 draw returned GPU error');
metrics.textContent=`WebGL2 · ${cells.length} occupied voxels · ${quads} exposed quads`;
window.__roadmap4Webgl2={id:b.id,webgl2:true,cutaway,floorIndex,quads,triangles:data.length/18,canvasSize:[canvas.width,canvas.height],lost:gl.isContextLost(),error:gl.getError()};
