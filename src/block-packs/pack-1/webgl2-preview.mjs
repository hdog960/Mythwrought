// Opt-in WebGL2 proof of the actual Pack 1 candidate AABB surfaces and authored pixels.
// This diagnostic does NOT register IDs, modify the live engine, or certify iPhone gameplay.
import {PACK1_GPU_IDS,candidateSurface,candidateFaceTexture} from './webgl2-candidates.mjs';
const canvas=document.querySelector('#view'),status=document.querySelector('#status');
const select=document.querySelector('#candidate'),rotate=document.querySelector('#rotate');
const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false,alpha:false,depth:true});
if(!gl)throw new Error('WebGL2 required: Canvas2D fallback prohibited');
const FACE_LIGHT={west:.78,east:.91,bottom:.54,top:1,north:.84,south:.94};
const VERT=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 aPosition;',
 'layout(location=1) in vec2 aUV;',
 'layout(location=2) in float aLight;',
 'uniform float uAspect;','out vec2 vUV;','out float vLight;',
 'void main(){',
 'vec3 p=aPosition-vec3(0.5);',
 'float ca=cos(0.72),sa=sin(0.72),cp=cos(0.42),sp=sin(0.42);',
 'float xx=ca*p.x-sa*p.z,zz=sa*p.x+ca*p.z;',
 'float yy=cp*p.y-sp*zz,depth=sp*p.y+cp*zz;',
 // Keep the full source model clear of the lower status overlay on 667x375 iPhone landscape.
 'gl_Position=vec4(xx*1.43/uAspect,yy*1.28,-depth*0.65,1.0);',
 'vUV=aUV;vLight=aLight;','}'
].join('\n');
const FRAG=[
 '#version 300 es','precision highp float;',
 'in vec2 vUV;','in float vLight;','uniform sampler2D uAtlas;',
 'out vec4 outColor;','void main(){',
 'vec4 t=texture(uAtlas,vUV);','if(t.a<0.5)discard;',
 'outColor=vec4(t.rgb*vLight,1.0);','}'
].join('\n');
function shader(type,source){
 const s=gl.createShader(type);
 gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))
  throw new Error('Pack 1 WebGL2 shader failed: '+gl.getShaderInfoLog(s));
 return s;
}
const program=gl.createProgram();
gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));
gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))
 throw new Error('Pack 1 WebGL2 program link failed: '+gl.getProgramInfoLog(program));
gl.useProgram(program);
const vao=gl.createVertexArray(),vbo=gl.createBuffer();
gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,2,gl.FLOAT,false,24,12);
gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,24,20);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);
gl.uniform1i(gl.getUniformLocation(program,'uAtlas'),0);
const aspect=gl.getUniformLocation(program,'uAspect');
for(const id of PACK1_GPU_IDS){
 const option=document.createElement('option');
 option.value=String(id);option.textContent='Pack 1 candidate '+id;select.append(option);
}
let currentId=Number(new URL(location.href).searchParams.get('candidate')||9);
if(!PACK1_GPU_IDS.includes(currentId))currentId=9;
let rotation=Number(new URL(location.href).searchParams.get('rotation')||0);
if(!Number.isInteger(rotation)||rotation<0||rotation>3)rotation=0;
select.value=String(currentId);
const PITCH=28,TILE=24,COLUMNS=24;
function atlasFromSource(surface,id){
 const unique=new Map();
 for(const q of surface.quads){
  const key=q.role+':'+q.face;
  if(!unique.has(key))unique.set(key,candidateFaceTexture(id,q.role,q.face,TILE));
 }
 const width=PITCH*COLUMNS,height=PITCH*Math.ceil(unique.size/COLUMNS);
 if(width>gl.getParameter(gl.MAX_TEXTURE_SIZE)||height>gl.getParameter(gl.MAX_TEXTURE_SIZE))
  throw new Error('Candidate texture atlas larger than GPU maximum');
 const pixels=new Uint8Array(width*height*4),lookup=new Map();
 let n=0;
 for(const [key,t] of unique){
  if(t.width!==TILE||t.height!==TILE||t.pixels.length!==TILE*TILE*4)
   throw new Error('Invalid source face artwork '+key);
  const x=(n%COLUMNS)*PITCH+2,y=Math.floor(n/COLUMNS)*PITCH+2;
  for(let row=0;row<TILE;row++){
   const begin=row*TILE*4;
   pixels.set(t.pixels.subarray(begin,begin+TILE*4),((y+row)*width+x)*4);
  }
  lookup.set(key,{x,y});n++;
 }
 const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);
 gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
 return {texture,width,height,lookup,materialFaceCount:unique.size};
}
let lastTexture=null;
function render(id,turn=0){
 if(!PACK1_GPU_IDS.includes(id)||!Number.isInteger(turn)||turn<0||turn>3)
  throw new RangeError('Invalid Pack 1 candidate/orientation');
 const surface=candidateSurface(id,turn),atlas=atlasFromSource(surface,id);
 if(lastTexture)gl.deleteTexture(lastTexture);
 lastTexture=atlas.texture;
 const vertices=[];
 for(const q of surface.quads){
  const tile=atlas.lookup.get(q.role+':'+q.face);
  if(!tile)throw new Error('Missing source material '+q.role+':'+q.face);
  for(let i=0;i<6;i++){
   const p=q.positions[i],uv=q.uv[i];
   const u=(tile.x+.5+Math.max(0,Math.min(1,uv[0]))*(TILE-1))/atlas.width;
   const v=(tile.y+.5+Math.max(0,Math.min(1,uv[1]))*(TILE-1))/atlas.height;
   vertices.push(...p,u,v,FACE_LIGHT[q.face]);
  }
 }
 const data=new Float32Array(vertices),rect=canvas.getBoundingClientRect();
 canvas.width=Math.round(rect.width);canvas.height=Math.round(rect.height);
 if(canvas.width<100||canvas.height<100)throw new Error('Invalid viewport');
 gl.viewport(0,0,canvas.width,canvas.height);
 gl.uniform1f(aspect,canvas.width/canvas.height);
 gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
 gl.clearColor(.051,.09,.137,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.drawArrays(gl.TRIANGLES,0,data.length/6);gl.finish();
 const glError=gl.getError();
 if(glError!==gl.NO_ERROR||gl.isContextLost())throw new Error('WebGL2 error '+glError);
 const rgba=new Uint8Array(canvas.width*canvas.height*4);
 gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,rgba);
 const colors=new Set();let visible=0;
 for(let i=0;i<rgba.length;i+=12){
  const r=rgba[i],g=rgba[i+1],b=rgba[i+2];
  if(Math.abs(r-13)+Math.abs(g-23)+Math.abs(b-35)>28){
   visible++;if(colors.size<1024)colors.add(r+','+g+','+b);
  }
 }
 if(visible<100||colors.size<12)
  throw new Error('Candidate-specific GPU readback blank or monochrome '+id+
   ' turn '+turn+': '+visible+' samples / '+colors.size+' colors');
 const result={
  candidateId:id,rotation:turn,renderer:'true source-exact WebGL2 candidate preview',
  productionIntegrated:false,webgl2:true,gpuVersion:gl.getParameter(gl.VERSION),
  triangles:surface.triangles,vertices:data.length/6,
  sourcePartCount:surface.partsCount,sourceOccupiedCells:surface.occupiedCells,
  sourceMaterialFaces:atlas.materialFaceCount,
  glError,contextLost:false,canvas:[canvas.width,canvas.height],
  readbackColoredSamples:visible,readbackUniqueColors:colors.size
 };
 window.PACK1_WEBGL2_STATE=result;
 currentId=id;rotation=turn;select.value=String(id);
 status.textContent='ID '+id+' · turn '+turn+' · '+surface.triangles+
  ' source triangles · GPU '+visible+' samples / '+colors.size+' colors';
 return result;
}
window.PACK1_WEBGL2_RENDER=render;
select.addEventListener('change',()=>render(Number(select.value),0));
rotate.addEventListener('click',()=>render(currentId,(rotation+1)%4));
window.addEventListener('resize',()=>render(currentId,rotation));
render(currentId,rotation);
