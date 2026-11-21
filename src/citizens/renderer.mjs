import {buildCitizenMesh, citizenPose, CITIZEN_VERTEX_FLOATS} from './appearance.mjs';

const vertex = `#version 300 es
precision highp float;
layout(location=0) in vec3 position;
layout(location=1) in vec3 color;
layout(location=2) in float joint;
layout(location=3) in vec2 pivot;
layout(location=4) in vec4 transformData;
layout(location=5) in vec4 poseData;
layout(location=6) in float hurtData;
uniform vec3 eye, forward, right, up;
uniform vec2 scale;
uniform bool terrainPass;
out vec3 lit;
void main() {
  vec3 p=position;
  vec4 pose=terrainPass ? vec4(0.) : poseData;
  vec3 origin=terrainPass ? vec3(0.) : transformData.xyz;
  float heading=terrainPass ? 0. : transformData.w;
  float hurt=terrainPass ? 0. : hurtData;
  float swing=pose.x;
  float angle=0.;
  if(joint==1.) angle=swing;
  if(joint==2.) angle=-swing;
  if(joint==3.) angle=-swing;
  if(joint==4.) angle=swing-pose.z*1.06;
  if(joint>=1. && joint<=4.) {
    vec2 limb=p.yz-pivot;
    p.yz=mat2(cos(angle),sin(angle),-sin(angle),cos(angle))*limb+pivot;
  }
  if(joint==5.) p.xz=mat2(cos(pose.w),-sin(pose.w),sin(pose.w),cos(pose.w))*p.xz;
  p.y+=pose.y;
  p.x+=hurt*p.y*.075;
  float c=cos(heading), s=sin(heading);
  vec3 delta=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z)+origin-eye;
  float z=dot(delta,forward);
  gl_Position=vec4(dot(delta,right)*scale.x,dot(delta,up)*scale.y,1.003*z-.2,z);
  lit=mix(color,vec3(.86,.38,.28),hurt*.5);
}`;

const fragment = `#version 300 es
precision highp float;
in vec3 lit;
out vec4 rgba;
void main(){rgba=vec4(lit,1.);}
`;

const attributes = [[0,3,0],[1,3,3],[2,1,6],[3,2,7]];
const uniformNames = ['eye','forward','right','up','scale','terrainPass'];
const modelKey = (c,detail) => [c.race,c.biome,c.profession,c.variant,c.style,detail].join(':');
const instanceAttributes = [[4,4,0],[5,4,4],[6,1,8]];
const FLOATS_PER_INSTANCE = 9;

function programFor(gl) {
  const shaders = [];
  let program;
  try {
    for (const [kind, source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
      const shader = gl.createShader(kind);
      if (!shader) throw Error('Citizen shader allocation failed');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    }
    program = gl.createProgram();
    if (!program) throw Error('Citizen renderer program allocation failed');
    for (const shader of shaders) gl.attachShader(program, shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    return program;
  } catch (error) {
    if (program) gl.deleteProgram(program);
    throw error;
  } finally {
    for (const shader of shaders) gl.deleteShader(shader);
  }
}

export function createCitizenRenderer(gl, {maxCachedMeshes=64,staticMesh=null,lodDistance=Infinity} = {}) {
  if (typeof gl?.createVertexArray !== 'function') throw TypeError('Citizen rendering requires WebGL2');
  if (!Number.isSafeInteger(maxCachedMeshes) || maxCachedMeshes < 1) throw RangeError('Invalid citizen mesh limit');
  const program = programFor(gl);
  const uniforms = Object.fromEntries(uniformNames.map(name => [name,gl.getUniformLocation(program,name)]));
  const meshes = new Map();
  const instanceBuffer=gl.createBuffer();
  if (!instanceBuffer) {
    gl.deleteProgram(program);
    throw Error('Citizen instance buffer allocation failed');
  }
  let instanceData=new Float32Array(0);
  let gpuBytes = 0;
  let disposed = false;

  function release(mesh) {
    gl.deleteVertexArray(mesh.vao);
    gl.deleteBuffer(mesh.buffer);
    gpuBytes -= mesh.bytes;
  }

  function upload(vertices) {
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vao || !buffer) {
      if (vao) gl.deleteVertexArray(vao);
      if (buffer) gl.deleteBuffer(buffer);
      throw Error('Citizen mesh allocation failed');
    }
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    for (const [location,size,offset] of attributes) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location,size,gl.FLOAT,false,CITIZEN_VERTEX_FLOATS*4,offset*4);
    }
    const mesh={vao,buffer,bytes:vertices.byteLength,count:vertices.length/CITIZEN_VERTEX_FLOATS};
    gpuBytes+=mesh.bytes;
    return mesh;
  }

  const terrain=staticMesh?upload(staticMesh):null;

  function meshFor(citizen,key,detail) {
    const cached = meshes.get(key);
    if (cached) {
      meshes.delete(key);
      meshes.set(key,cached);
      return cached;
    }
    const mesh = upload(buildCitizenMesh(citizen,{detail}));
    if (meshes.size === maxCachedMeshes) {
      const oldest = meshes.keys().next().value;
      release(meshes.get(oldest));
      meshes.delete(oldest);
    }
    meshes.set(key,mesh);
    return mesh;
  }

  return {
    draw(entities, {eye,forward,right,up,aspect,tanHalfFov,time}) {
      if (disposed) throw Error('Citizen renderer is disposed');
      gl.useProgram(program);
      for (const [name,value] of Object.entries({eye,forward,right,up})) gl.uniform3fv(uniforms[name],value);
      gl.uniform2f(uniforms.scale,1/(aspect*tanHalfFov),1/tanHalfFov);
      let vertices=0;
      let drawCalls=0;
      const groups=new Map();
      for (const entity of entities) {
        const [x,y,z]=entity.position;
        const far=(x-eye[0])**2+(y-eye[1])**2+(z-eye[2])**2>lodDistance**2;
        const detail=far?'far':'near';
        const key=modelKey(entity.citizen,detail);
        const group=groups.get(key);
        if (group) group.entities.push(entity);
        else groups.set(key,{detail,entities:[entity]});
      }
      const required=entities.length*FLOATS_PER_INSTANCE;
      gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer);
      if (required>instanceData.length) {
        const capacity=2**Math.ceil(Math.log2(entities.length))*FLOATS_PER_INSTANCE;
        instanceData=new Float32Array(capacity);
        gl.bufferData(gl.ARRAY_BUFFER,instanceData.byteLength,gl.DYNAMIC_DRAW);
      }
      let offset=0;
      for(const {entities:group} of groups.values()) for (const {position,heading=0,action='idle'} of group) {
        const pose=citizenPose(action,time);
        instanceData.set(position,offset);
        instanceData[offset+3]=heading;
        instanceData[offset+4]=pose.swing;
        instanceData[offset+5]=pose.lift;
        instanceData[offset+6]=pose.action;
        instanceData[offset+7]=pose.turn;
        instanceData[offset+8]=pose.hurt;
        offset+=FLOATS_PER_INSTANCE;
      }
      if (required) gl.bufferSubData(gl.ARRAY_BUFFER,0,instanceData,0,required);
      try {
        if (terrain) {
          gl.uniform1i(uniforms.terrainPass,1);
          gl.bindVertexArray(terrain.vao);
          gl.drawArrays(gl.TRIANGLES,0,terrain.count);
        }
        gl.uniform1i(uniforms.terrainPass,0);
        offset=0;
        for (const [key,{detail,entities:group}] of groups) {
          const mesh=meshFor(group[0].citizen,key,detail);
          gl.bindVertexArray(mesh.vao);
          gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer);
          for (const [location,size,start] of instanceAttributes) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location,size,gl.FLOAT,false,FLOATS_PER_INSTANCE*4,(offset+start)*4);
            gl.vertexAttribDivisor(location,1);
          }
          gl.drawArraysInstanced(gl.TRIANGLES,0,mesh.count,group.length);
          drawCalls++;
          vertices+=mesh.count*group.length;
          offset+=group.length*FLOATS_PER_INSTANCE;
        }
      } finally {
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
      }
      return {drawCalls,vertices,gpuBytes:gpuBytes+instanceData.byteLength,
        cachedMeshes:meshes.size,terrainBytes:terrain?.bytes??0};
    },
    dispose() {
      if (disposed) return;
      for (const mesh of meshes.values()) release(mesh);
      meshes.clear();
      if (terrain) release(terrain);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteProgram(program);
      disposed = true;
    },
  };
}
