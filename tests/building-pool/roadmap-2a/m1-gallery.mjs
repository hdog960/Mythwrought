import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_LATERAL_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
import {M1_ARCADED_FRONT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-arcaded-front-shops.mjs';
import {M1_TOWER_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-tower-court-shops.mjs';
import {M1_SCULPTED_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-sculpted-markets.mjs';
import {M1_SIGNATURE_SKYLINE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-signature-skyline.mjs';
import {M1_LANDMARK_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
// WebGL2 renders the ACTUAL source-authored integer cells as simple opaque
// cube proxies. This is not final physical Pack family geometry/collision.
const designs=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_LANDMARK_SHOPS,...M1_SIGNATURE_SKYLINE_SHOPS,...M1_SCULPTED_MARKETS,...M1_TOWER_COURT_SHOPS,...M1_ARCADED_FRONT_SHOPS];
const byId=new Map(designs.map(x=>[x.id,x]));
if(designs.length!==122||byId.size!==122)throw Error('Unexpected authored building count');
const select=document.getElementById('building'),mode=document.getElementById('view');
for(const b of designs){const el=document.createElement('option');el.value=b.id;el.textContent=b.title+' · '+b.biome+'/'+b.size;select.append(el);}
const params=new URLSearchParams(location.search);
select.value=byId.has(params.get('id'))?params.get('id'):designs[15].id;
mode.value=params.get('view')==='cutaway'?'cutaway':'exterior';
const canvas=document.getElementById('scene'),evidence=document.getElementById('evidence');
const gl=canvas.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true,antialias:true});
if(!gl)throw Error('WebGL2 not supported. No visual acceptance evidence.');
const VS=[
'#version 300 es','precision highp float;',
'layout(location=0) in vec4 aVertex;','layout(location=1) in vec4 aInstance;',
'uniform vec3 uBounds; uniform float uAspect; out vec3 vColor;',
'void main(){vec3 p=aInstance.xyz+aVertex.xyz-vec3(uBounds.x*.5,uBounds.y*.38,uBounds.z*.5);',
'float screenX=(p.x-p.z)*.88, screenZ=(p.x+p.z)*.47;',
'float span=max(uBounds.x,uBounds.z)*1.38+uBounds.y*.55;',
'vec2 screen=vec2(screenX,p.y*.90-screenZ)*2.0/span;',
'screen.x/=max(1.0,uAspect/1.65);',
'float depth=(-screenZ*.44-p.y*.22)/span;',
'gl_Position=vec4(screen,depth,1.0);',
'int k=int(aInstance.w+.5);',
'vec3 color=k==0?vec3(.43,.45,.44):k==1?vec3(.63,.51,.39):k==2?vec3(.65,.61,.54):',
'k==3?vec3(.39,.32,.32):k==4?vec3(.24,.76,.84):k==5?vec3(.96,.68,.23):vec3(.65,.77,.41);',
'vColor=color*aVertex.w;}'
].join('\n');
const FS=['#version 300 es','precision highp float;','in vec3 vColor; out vec4 color;','void main(){color=vec4(vColor,1.0);}'].join('\n');
function shader(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const base=[];
const faces=[
 [[0,0,0],[1,0,0],[1,1,0],[0,1,0],.79],
 [[1,0,1],[0,0,1],[0,1,1],[1,1,1],.93],
 [[0,0,1],[0,0,0],[0,1,0],[0,1,1],.72],
 [[1,0,0],[1,0,1],[1,1,1],[1,1,0],.95],
 [[0,1,0],[1,1,0],[1,1,1],[0,1,1],1.16],
 [[0,0,1],[1,0,1],[1,0,0],[0,0,0],.59]
];
for(const [a,b,c,d,shade] of faces)for(const v of [a,b,c,a,c,d])base.push(v[0],v[1],v[2],shade);
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
const vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertices);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(base),gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);
const instances=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,instances);gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1,4,gl.FLOAT,false,16,0);gl.vertexAttribDivisor(1,1);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
const bounds=gl.getUniformLocation(program,'uBounds'),aspect=gl.getUniformLocation(program,'uAspect');
const colorIds={foundation:0,floor:1,wall:2,roof:3,window:4,fixture:5,decor:6};
function draw(){
 const b=byId.get(select.value);if(!b)throw Error('Invalid blueprint source ID');
 const cut=mode.value==='cutaway';
 const shown=b.voxels.filter(v=>!cut||(v.kind!=='roof'&&!(v.kind==='wall'&&(v.z===b.extents.z-1||v.x===b.extents.x-1))&&!(v.kind==='window'&&(v.z===b.extents.z-1||v.x===b.extents.x-1))));
 const data=new Float32Array(shown.length*4);for(let i=0;i<shown.length;i++){const v=shown[i];data.set([v.x,v.y,v.z,colorIds[v.kind]??6],i*4);}
 gl.bindBuffer(gl.ARRAY_BUFFER,instances);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
 const dpr=Math.min(window.devicePixelRatio||1,2),w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);
 if(w<1||h<1)throw Error('No canvas pixels');
 canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);
 gl.clearColor(.07,.13,.16,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniform3f(bounds,b.extents.x,b.extents.y,b.extents.z);gl.uniform1f(aspect,w/h);
 gl.drawArraysInstanced(gl.TRIANGLES,0,36,shown.length);
 const error=gl.getError();if(error!==gl.NO_ERROR)throw Error('WebGL2 GL error: '+error);
 evidence.textContent=b.id+' · '+shown.length+'/'+b.voxels.length+' physical-coordinate cells · '+b.rooms.length+' rooms · '+mode.value+' · cube proxies ONLY';
 window.__MW2A_GALLERY={ready:true,renderer:'WebGL2 coordinate-authored cube proxy',webgl2:true,glError:error,id:b.id,view:mode.value,drawn:shown.length,total:b.voxels.length,designCount:designs.length,viewport:[innerWidth,innerHeight],productionPhysicalFamilyGeometry:false,realIphone:false};
}
select.addEventListener('change',draw);mode.addEventListener('change',draw);addEventListener('resize',draw);draw();