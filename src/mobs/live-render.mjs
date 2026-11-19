// Live Mythwrought WebGL2 creatures. Model geometry is the accepted 40-species
// authored preview catalog; this draw path shares the REAL voxel depth buffer.
// The old preview renderer is deliberately not used as a second game canvas.
import {meshes} from '../../mob-preview/models.mjs';
import {speciesRegistry} from './species.mjs';

const MAX_VISIBLE=8, MAX_GPU_MODELS=12, MAX_DISTANCE=32;
const modelIds=new Set(speciesRegistry.map(s=>s.id));
if(modelIds.size!==40 || [...modelIds].some(id=>!(meshes[id] instanceof Float32Array)))
  throw Error('Incomplete original 40-creature 3D model registry');

const VS=String.raw`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aColor;
layout(location=2) in float aJoint;
layout(location=3) in vec4 aTransform;
layout(location=4) in vec4 aMotion;
uniform vec3 uEye,uForward,uRight,uUp;
uniform float uAspect,uTan,uTime;
out vec3 vColor;
out float vDistance;
void main(){
  vec3 p=aPosition;
  float cycle=sin(uTime*11.0+aMotion.w);
  if(aJoint>6.5) p.y+=max(0.0,aMotion.y)*(.14+.22*max(0.0,p.z));
  else if(aJoint>5.5){
    float stretch=sin(uTime*9.0)*aMotion.x*.19;
    p.y*=1.0+stretch;p.x*=1.0-stretch*.55;
  }else if(aJoint>4.5){p.y+=max(0.0,aMotion.y)*.22;}
  else if(abs(aJoint)>3.5) p.y+=sin(uTime*23.0)*aMotion.x*abs(p.x)*.5;
  else if(abs(aJoint)>2.5) p.y+=aMotion.y<0.0?(-aMotion.y)*-.08:sin(uTime*4.0)*.016;
  else if(abs(aJoint)>1.5) p.x+=sin(uTime*3.0+aMotion.w)*.10;
  else p.z+=aJoint*cycle*aMotion.x*.12*max(0.0,.9-p.y);
  p.y+=sin(uTime*3.0+aMotion.w)*.015+abs(cycle)*aMotion.x*.016;
  if(aMotion.z>.5) p=vec3(-p.y,p.x+.24,p.z);
  if(aMotion.z<-.5) p*=.65;
  float sy=sin(aTransform.w),cy=cos(aTransform.w);
  vec3 pos=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z)+aTransform.xyz;
  vec3 d=pos-uEye;
  float x=dot(d,uRight),y=dot(d,uUp),z=dot(d,uForward);
  gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-.1501,z);
  vColor=mix(aColor,vec3(.94,.45,.19),max(0.0,aMotion.y)*.36);
  vDistance=length(d);
}`;
const FS=String.raw`#version 300 es
precision highp float;
in vec3 vColor;
in float vDistance;
uniform vec3 uFog,uLight;
out vec4 outColor;
void main(){
  float fog=smoothstep(25.0,68.0,vDistance);
  outColor=vec4(mix(vColor*uLight,uFog,fog),1.0);
}`;

function makeProgram(gl){
  const shaders=[];
  try{
    for(const [kind,source] of [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,FS]]){
      const shader=gl.createShader(kind);
      if(!shader)throw Error('Mob shader unavailable');
      shaders.push(shader);
      gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        throw Error('Mob shader: '+gl.getShaderInfoLog(shader));
    }
    const program=gl.createProgram();
    if(!program)throw Error('Mob WebGL2 program unavailable');
    try{
      for(const shader of shaders)gl.attachShader(program,shader);
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))
        throw Error('Mob shader link: '+gl.getProgramInfoLog(program));
      return program;
    }catch(error){gl.deleteProgram(program);throw error;}
  }finally{for(const shader of shaders)gl.deleteShader(shader);}
}

export function createLiveMobRenderer(gl){
  if(!gl || typeof gl.drawArraysInstanced!=='function')
    throw TypeError('Real WebGL2 instancing required for live mobs');
  const program=makeProgram(gl),cache=new Map();
  const uniforms=Object.fromEntries(
    ['uEye','uForward','uRight','uUp','uAspect','uTan','uTime','uLight','uFog']
      .map(name=>[name,gl.getUniformLocation(program,name)]));
  let frame=0,disposed=false,bytes=0,highWater=0;
  function evict(id){
    const m=cache.get(id);if(!m)return;
    gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.vertices);
    gl.deleteBuffer(m.instances);cache.delete(id);bytes-=m.bytes;
  }
  function geometry(id){
    let item=cache.get(id);
    if(item){item.last=frame;return item;}
    const data=meshes[id];
    if(!modelIds.has(id)||!data||data.length%7!==0) return null;
    if(cache.size===MAX_GPU_MODELS){
      const old=[...cache].sort((a,b)=>a[1].last-b[1].last)[0][0];
      evict(old);
    }
    let vao=null,vertices=null,instances=null;
    try{
      vao=gl.createVertexArray();vertices=gl.createBuffer();instances=gl.createBuffer();
      if(!vao||!vertices||!instances)throw Error('Mob GPU allocation failed');
      gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,vertices);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      for(const [loc,size,offset] of [[0,3,0],[1,3,3],[2,1,6]]){
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc,size,gl.FLOAT,false,28,offset*4);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER,instances);
      gl.bufferData(gl.ARRAY_BUFFER,MAX_VISIBLE*8*4,gl.DYNAMIC_DRAW);
      for(const [loc,offset] of [[3,0],[4,4]]){
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc,4,gl.FLOAT,false,32,offset*4);
        gl.vertexAttribDivisor(loc,1);
      }
      gl.bindVertexArray(null);
      item={vao,vertices,instances,count:data.length/7,bytes:data.byteLength+MAX_VISIBLE*32,last:frame};
      cache.set(id,item);bytes+=item.bytes;highWater=Math.max(highWater,bytes);
      return item;
    }catch(error){
      gl.bindVertexArray(null);
      if(vao)gl.deleteVertexArray(vao);
      if(vertices)gl.deleteBuffer(vertices);
      if(instances)gl.deleteBuffer(instances);
      throw error;
    }
  }
  function render(entities,{eye,forward,right,up,aspect,light,fog,time,restoreProgram}){
    if(disposed||gl.isContextLost())return {draws:0,actors:0,bytes};
    frame++;
    const groups=new Map(),selected=[];
    for(const e of entities){
      if(!modelIds.has(e?.species?.id)||e.state==='dormant'||e.state==='removed')continue;
      const dx=e.position[0]-eye[0],dy=e.position[1]-eye[1],dz=e.position[2]-eye[2];
      if(dx*dx+dy*dy+dz*dz>MAX_DISTANCE*MAX_DISTANCE)continue;
      selected.push({e,d:dx*dx+dy*dy+dz*dz});
    }
    selected.sort((a,b)=>a.d-b.d);
    for(const {e} of selected.slice(0,MAX_VISIBLE)){
      const id=e.species.id;
      if(!groups.has(id))groups.set(id,[]);
      groups.get(id).push(e);
    }
    if(!groups.size)return {draws:0,actors:0,bytes};
    const scratch=new Float32Array(MAX_VISIBLE*8);
    let draws=0,actors=0;
    try{
      gl.useProgram(program);
      for(const [name,data] of [['uEye',eye],['uForward',forward],['uRight',right],
        ['uUp',up],['uLight',light],['uFog',fog]])
        gl.uniform3fv(uniforms[name],data);
      gl.uniform1f(uniforms.uAspect,aspect);
      gl.uniform1f(uniforms.uTan,Math.tan(Math.PI/5));
      gl.uniform1f(uniforms.uTime,time);
      for(const [id,list] of groups){
        const mesh=geometry(id);
        if(!mesh)continue;
        let n=0;
        for(const entity of list){
          const motion=Math.min(1,Math.hypot(...entity.velocity)/2);
          const state=entity.visual||'';
          const foraging=['graze','forage','peck','browse','sniff','scent','stalk'].includes(state);
          const intent=state==='attack'?1:state==='prepare-attack'?.7:foraging?-.7:0;
          scratch.set([entity.position[0],entity.position[1],entity.position[2],
            entity.yaw||0,motion,intent,entity.state==='downed'?1:entity.juvenile?-1:0,
            n*.67],n*8);
          n++;
        }
        gl.bindVertexArray(mesh.vao);gl.bindBuffer(gl.ARRAY_BUFFER,mesh.instances);
        gl.bufferSubData(gl.ARRAY_BUFFER,0,scratch,0,n*8);
        gl.drawArraysInstanced(gl.TRIANGLES,0,mesh.count,n);
        actors+=n;draws++;
      }
      return {draws,actors,bytes,highWater,models:cache.size};
    }finally{
      gl.bindVertexArray(null);
      if(restoreProgram)gl.useProgram(restoreProgram);
    }
  }
  function dispose(){
    if(disposed)return;
    disposed=true;
    for(const id of [...cache.keys()])evict(id);
    gl.deleteProgram(program);
  }
  return {render,dispose,stats:()=>({bytes,highWater,models:cache.size,disposed})};
}
