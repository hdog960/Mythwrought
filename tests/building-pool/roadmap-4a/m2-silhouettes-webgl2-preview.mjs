// ROADMAP 4 ISOLATED WEBGL2 REVIEW: fail-closed, no game/runtime/save imports.
// Rendering a shape prototype is NOT live Pack 1–5/biome130 integration.
// Full-cell exposed faces and reusable source-box templates are sent as separate
// GPU buffers, with instancing for candidate slabs, stairs, roofs and panes.
// Browser and physical iPhone acceptance must be recorded separately.
import {buildM2Silhouette} from '../../../src/building-pool/roadmap-4a/m2-silhouettes.mjs';
import {candidatePreviewShape,candidateBatchedPreviewBudget} from '../../../src/building-pool/roadmap-4a/m1-preview-shapes.mjs';
const params=new URLSearchParams(location.search);
const type=params.get('type')||'castle-palace';
const biome=params.get('biome')||'temperate';
const size=params.get('size')||'small';
const cutaway=params.get('cutaway')==='1';
const variant=Number(params.get('variant')||1);
const b=buildM2Silhouette('r4:'+type+':'+biome+':'+size+':'+String(variant).padStart(2,'0'));
const storyCount=b.architecturalNotes.storyCount;
const floorIndex=cutaway?Math.max(0,Math.min(storyCount-1,Number(params.get('floor')??0)|0)):0;
const canvas=document.querySelector('#view'),metrics=document.querySelector('#metrics');
document.querySelector('#label').textContent=[biome,size,type,cutaway?'floor '+(floorIndex+1):'exterior'].join(' · ');
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
const SHADES=[.75,.64,1,.38,.84,.7];
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
 for(const room of b.spaces.filter(room=>room.level===floorIndex*4+1)){
  for(const [x,z] of room.footprint)roomPaint.set([x,room.level-1,z].join(','),colors[i%colors.length]);i++;
 }}
const sourcePaletteFor=c=>roomPaint.get(c.at.join(','))||(c.role==='roof'?R[biome]:c.role==='window'?[.32,.8,.9]:c.role==='stair'?[.93,.77,.44]:c.role==='landing'?[.8,.71,.56]:c.role==='partition'?[.68,.52,.33]:c.asset==='base:wood'?[.66,.41,.26]:P[biome]);
const fullBox=box=>box.length===6&&box[0]===0&&box[1]===0&&box[2]===0&&box[3]===1&&box[4]===1&&box[5]===1;
const shapeFor=c=>candidatePreviewShape(c);
const triangles=[0,1,2,0,2,3];
const fullVertices=[];
const groups=new Map();
let proxyCells=0,fullQuads=0;
function pushFace(verts, origin, box, face,color){
 const [,points]=FACES[face];
 const [x0,y0,z0,x1,y1,z1]=box;
 for(const i of triangles){
  const v=points[i];
  verts.push(origin[0]+x0+(x1-x0)*v[0],origin[1]+y0+(y1-y0)*v[1],origin[2]+z0+(z1-z0)*v[2],
    ...color.map(v=>v*SHADES[face]));
 }
}
for(const c of cells){
 const shape=shapeFor(c);
 if(shape.fidelity==='unresolved-full-cell-proxy')proxyCells++;
 if(shape.boxes.length===1&&fullBox(shape.boxes[0])){
  const [x,y,z]=c.at,color=sourcePaletteFor(c);
  for(let face=0;face<6;face++){
   const d=FACES[face][0],neighbor=cellSet.get([x+d[0],y+d[1],z+d[2]].join(','));
   if(neighbor){const other=shapeFor(neighbor);
    if(other.boxes.length===1&&fullBox(other.boxes[0]))continue;
   }
   pushFace(fullVertices,c.at,shape.boxes[0],face,color);fullQuads++;
  }
 }else{
  const groupKey=c.asset+':'+c.facing;
  if(!groups.has(groupKey))groups.set(groupKey,{boxes:shape.boxes,color:sourcePaletteFor(c),offsets:[]});
  groups.get(groupKey).offsets.push(...c.at);
 }
}
const VS=`#version 300 es
in vec3 a_pos;in vec3 a_rgb;in vec3 a_offset;out vec3 v_col;
uniform vec2 u_center;uniform float u_scale;uniform float u_aspect;
void main(){vec3 q=a_pos+a_offset;
 float x=(q.x-q.z)*0.70710678;float y=q.y*1.10-(q.x+q.z)*.37;
 gl_Position=vec4((x-u_center.x)*u_scale/u_aspect,(y-u_center.y)*u_scale,-(q.x+q.z)*.005+q.y*.001,1.0);v_col=a_rgb;}`;
const FS=`#version 300 es
precision highp float;in vec3 v_col;out vec4 fragColor;void main(){fragColor=vec4(v_col,1.0);}`;
function shader(kind,source){const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('WebGL2 shader: '+gl.getShaderInfoLog(s));return s;}
const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error('WebGL2 link: '+gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const posLoc=gl.getAttribLocation(prog,'a_pos'),rgbLoc=gl.getAttribLocation(prog,'a_rgb'),offsetLoc=gl.getAttribLocation(prog,'a_offset');
if(posLoc<0||rgbLoc<0||offsetLoc<0)throw Error('Shader input attribute missing');
const points=[];for(const x of [0,b.bounds[0]])for(const y of [0,b.bounds[1]])for(const z of [0,b.bounds[2]])points.push([(x-z)*.70710678,y*1.10-(x+z)*.37]);
const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
canvas.width=innerWidth;canvas.height=innerHeight;
const aspect=canvas.width/canvas.height,scale=Math.min(1.75/(maxY-minY),1.84*aspect/(maxX-minX));
gl.uniform2f(gl.getUniformLocation(prog,'u_center'),(minX+maxX)/2,(minY+maxY)/2);gl.uniform1f(gl.getUniformLocation(prog,'u_scale'),scale);gl.uniform1f(gl.getUniformLocation(prog,'u_aspect'),aspect);
gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.08,.12,.18,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
const vertexBuffer=gl.createBuffer();const instanceBuffer=gl.createBuffer();let submittedBytes=0,drawCalls=0,renderedTriangles=0;
function setVertices(floatArray){
 gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,floatArray,gl.STATIC_DRAW);
 submittedBytes+=floatArray.byteLength;
 gl.enableVertexAttribArray(posLoc);gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,24,0);
 gl.enableVertexAttribArray(rgbLoc);gl.vertexAttribPointer(rgbLoc,3,gl.FLOAT,false,24,12);
}
const fullArray=new Float32Array(fullVertices);setVertices(fullArray);
gl.disableVertexAttribArray(offsetLoc);gl.vertexAttribDivisor(offsetLoc,0);gl.vertexAttrib3f(offsetLoc,0,0,0);
if(fullArray.length){gl.drawArrays(gl.TRIANGLES,0,fullArray.length/6);drawCalls++;renderedTriangles+=fullArray.length/18;}
for(const group of groups.values()){
 const vertices=[];
 for(const box of group.boxes)for(let face=0;face<6;face++)pushFace(vertices,[0,0,0],box,face,group.color);
 const template=new Float32Array(vertices);setVertices(template);
 const offsets=new Float32Array(group.offsets);gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer);gl.bufferData(gl.ARRAY_BUFFER,offsets,gl.STATIC_DRAW);
 submittedBytes+=offsets.byteLength;
 gl.enableVertexAttribArray(offsetLoc);gl.vertexAttribPointer(offsetLoc,3,gl.FLOAT,false,12,0);gl.vertexAttribDivisor(offsetLoc,1);
 gl.drawArraysInstanced(gl.TRIANGLES,0,template.length/6,offsets.length/3);
 drawCalls++;renderedTriangles+=template.length/18*(offsets.length/3);
}
if(gl.getError()!==gl.NO_ERROR)throw Error('WebGL2 draw returned GPU error');
const budget=candidateBatchedPreviewBudget(b);
metrics.textContent=`WebGL2 candidate · ${cells.length} occupied cells · ${drawCalls} draw calls · ${Math.round(submittedBytes/1024)} KiB submitted · ${proxyCells} material proxy cells`;
window.__roadmap4aM2SilhouetteWebgl2={id:b.id,webgl2:true,cutaway,floorIndex,fullQuads,templateGroups:groups.size,
 drawnTriangles:renderedTriangles,drawCalls,submittedBufferBytes:submittedBytes,
 budgetModelBytes:budget.estimatedUploadBytes,unresolvedFullCellProxyCount:proxyCells,
 canvasSize:[canvas.width,canvas.height],lost:gl.isContextLost(),error:gl.getError(),
 actualGpuResidencyBytes:null,actualFrameTimeMs:null,liveAssetIntegration:false};
