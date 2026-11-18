// Mythwrought #240 genuine source-authored cave voxel WebGL2 preview.
// This is a separate opt-in visual fixture, NOT the deployed game's main.mjs.
import {BLOCK,raycast} from '../voxel.mjs';
import {sectionForY,WORLD_MIN_Y} from '../depth.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {deepCaveRoute} from '../deep-cave-network.mjs';
import {descentRoute} from '../underground-switchback-descent.mjs';
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {createStagedCaveProfile,loadStagedCaveProfile,saveStagedCaveProfile} from './profile-store.mjs';
const seed=179,canvas=document.getElementById('cave'),details=document.getElementById('details');
const picker=document.getElementById('scene');
const gl=canvas.getContext('webgl2',{alpha:false,depth:true,antialias:false});
if(!gl)throw Error('WebGL2 required: no 2D fake preview');
const vs=[
 '#version 300 es','precision highp float;',
 'in vec3 aPos;in vec3 aColor;uniform vec3 uEye,uForward,uRight,uUp;',
 'uniform float uAspect,uTan;out vec3 vColor;out float vDepth;',
 'void main(){vec3 d=aPos-uEye;float z=dot(d,uForward);',
 'gl_Position=vec4(dot(d,uRight)/(uAspect*uTan),dot(d,uUp)/uTan,z*1.002-0.10,z);',
 'vColor=aColor;vDepth=length(d);}'
].join('\n');
const fs=[
 '#version 300 es','precision mediump float;','in vec3 vColor;in float vDepth;',
 'out vec4 frag;','void main(){float f=smoothstep(10.0,68.0,vDepth);',
 'frag=vec4(mix(vColor,vec3(.11,.16,.23),f),1.0);}'
].join('\n');
function shader(type,src){
 const out=gl.createShader(type);gl.shaderSource(out,src);gl.compileShader(out);
 if(!gl.getShaderParameter(out,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(out));
 return out;
}
const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));
gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));
const pos=gl.getAttribLocation(prog,'aPos'),color=gl.getAttribLocation(prog,'aColor');
const uniforms=Object.fromEntries(['uEye','uForward','uRight','uUp','uAspect','uTan']
 .map(n=>[n,gl.getUniformLocation(prog,n)]));
const vao=gl.createVertexArray(),vbo=gl.createBuffer();
gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,36,0);
gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,3,gl.FLOAT,false,36,12);
gl.bindVertexArray(null);gl.enable(gl.DEPTH_TEST);
let runtime=null,view='olddeep',state=null;
const norm=a=>{const n=Math.hypot(...a)||1;return a.map(x=>x/n)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function scene(name){
 const old=deepCaveRoute().find(p=>p.floor===-80);
 const route=descentRoute(),idx=route.findIndex(p=>p.floor===-80);
 if(name==='olddeep')return {label:'Historical :24 deep descent',eye:[old.x+.5,old.floor+2.5,old.z+.5],
   target:[old.x+8.5,old.floor+2.0,old.z+.5]};
 if(name==='switchback')return {label:'Historical :36 switchback',eye:[route[idx].x+.5,route[idx].floor+2.5,route[idx].z+.5],
   target:[route[idx+9].x+.5,route[idx+9].floor+2.5,route[idx+9].z+.5]};
 if(name==='whisper'){
  const p=route.find(p=>p.floor===-202),lx=p.x-192,lz=p.z-192;
  const out=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0],tan=[out[1],-out[0]];
  const at=(d,t)=>[p.x+out[0]*d+tan[0]*t+.5,-199.5,p.z+out[1]*d+tan[1]*t+.5];
  return {label:'Bedrock Whisper Gallery',eye:at(20,-18),target:at(39,-31)};
 }
 if(name==='windcut'){
  const s=UPPER_SITES[0],z=d=>s.z+Math.round(3*Math.sin(d/13));
  return {label:'Windcut upper gallery',eye:[s.x+90.5,-20.5,z(90)+.5],
   target:[s.x+103.5,-22.5,z(103)+.5]};
 }
 if(name==='vault')return {label:'Historic four vault gallery',
   eye:[116.5,-27.5,79.5],target:[121.5,-27.5,83.5]};
 if(name==='entrance'){
  const arr=runtime.entrancePlan.entrances[0].route;
  const n=Math.floor(arr.length*.48),p=arr[n],q=arr[Math.min(arr.length-1,n+5)];
  return {label:'Protected surface cave stair',
   eye:[p.x+.5,p.floor+2.5,p.z+.5],target:[q.x+.5,q.floor+2,q.z+.5]};
 }
 throw Error('Unknown authored cave location');
}
function composeMesh(world,cam){
 const cx=Math.floor(cam.eye[0]/16),cz=Math.floor(cam.eye[2]/16);
 const sec=sectionForY(Math.floor(cam.eye[1])-1),min=sectionForY(WORLD_MIN_Y);
 const parts=[];let total=0;
 for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++)
  for(let s=sec-1;s<=sec+1;s++){
   if(s<min||s>=0)continue;
   const mesh=meshDepthSection(world,x,z,s);
   if(mesh.length%9)throw Error('Nontriangular source mesh');
   total+=mesh.length;
   if(total>3000000)throw Error('Strict cave preview GPU budget exceeded');
   parts.push(mesh);
  }
 const all=new Float32Array(total);let i=0;
 for(const part of parts){all.set(part,i);i+=part.length}
 return all;
}
function draw(name=view){
 if(!runtime)throw Error('Explicit cave world selection required');
 view=name;picker.value=name;
 const cam=scene(name),world=runtime.world,mesh=composeMesh(world,cam);
 canvas.width=Math.max(1,Math.round(canvas.clientWidth));
 canvas.height=Math.max(1,Math.round(canvas.clientHeight));
 gl.viewport(0,0,canvas.width,canvas.height);
 gl.clearColor(.07,.105,.15,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const forward=norm(cam.target.map((x,i)=>x-cam.eye[i]));
 const right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward));
 gl.useProgram(prog);gl.uniform3fv(uniforms.uEye,cam.eye);
 gl.uniform3fv(uniforms.uForward,forward);
 gl.uniform3fv(uniforms.uRight,right);gl.uniform3fv(uniforms.uUp,up);
 gl.uniform1f(uniforms.uAspect,canvas.width/canvas.height);
 gl.uniform1f(uniforms.uTan,Math.tan(.65));
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
 gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
 gl.drawArrays(gl.TRIANGLES,0,mesh.length/9);gl.bindVertexArray(null);
 if(gl.getError()!==gl.NO_ERROR)throw Error('Actual WebGL2 GPU error');
 state={seed,profile:runtime.profile,scene:name,label:cam.label,
  sourceCount:runtime.world.base.cavePlanReport.sourceCount,canvas:[canvas.width,canvas.height],
  webgl2:/WebGL 2/i.test(gl.getParameter(gl.VERSION)),
  vertices:mesh.length/9,triangles:mesh.length/27,
  editCount:world.base.edits.size,registeredInHomeScreen:false,
  realVoxelMesher:true,eye:cam.eye};
 if(state.vertices<100)throw Error('Cave geometry missing or empty');
 details.textContent=cam.label+' · '+state.vertices+' vertices · '+state.editCount+' edits';
 canvas.dataset.caveScene=name;canvas.dataset.caveVertices=String(state.vertices);
 return state;
}
function bind(r){runtime=r.runtime||r;return draw(picker.value)}
document.getElementById('create').onclick=()=>{
 try{bind(createStagedCaveProfile(localStorage,seed,{approved:true}))}
 catch(e){details.textContent='CREATE REFUSED: '+e.message;throw e}
};
document.getElementById('load').onclick=()=>{
 try{bind(loadStagedCaveProfile(localStorage,seed,{approved:true}))}
 catch(e){details.textContent='LOAD REFUSED: '+e.message;throw e}
};
picker.onchange=()=>{if(runtime)draw(picker.value)};
document.getElementById('save').onclick=()=>{
 if(!runtime)throw Error('Explicit cave selection required');
 saveStagedCaveProfile(localStorage,runtime,{approved:true});draw();
};
function mine(){
 if(!runtime)throw Error('Select new cave world first');
 const cam=scene(view),dirs=[norm(cam.target.map((x,i)=>x-cam.eye[i])),
  [1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]];
 let hit=null;for(const dir of dirs){
  const h=raycast(runtime.world,cam.eye,dir,5);
  if(h?.hit){hit=h;break}
 }
 if(!hit)throw Error('No authentic voxel target in mining range');
 const prior=runtime.world.get(...hit.hit);
 if(prior===BLOCK.AIR||!runtime.world.set(...hit.hit,BLOCK.AIR))
  throw Error('Real-world voxel mining failed');
 draw();return {hit:hit.hit,prior,after:runtime.world.get(...hit.hit)};
}
document.getElementById('mine').onclick=()=>mine();
window.CAVE_PREVIEW={status:()=>state,show:draw,mine,
 save:()=>saveStagedCaveProfile(localStorage,runtime,{approved:true}),
 load:()=>bind(loadStagedCaveProfile(localStorage,seed,{approved:true})),
 profileKey:'mythwrought-caves-v1-seed-'+seed,oldSaveKey:'mythwrought-v002-world-'+seed};
window.CAVE_PREVIEW_READY=true;
// No automatic selection or save, no manipulation of real Home Screen data.
