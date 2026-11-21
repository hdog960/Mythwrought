import {buildCitizenMesh, citizenPose, CITIZEN_VERTEX_FLOATS} from './appearance.mjs';

const vertex = `#version 300 es
precision highp float;
layout(location=0) in vec3 position;
layout(location=1) in vec3 color;
layout(location=2) in float joint;
layout(location=3) in vec2 pivot;
uniform vec3 eye, forward, right, up, origin;
uniform vec4 pose;
uniform vec2 scale;
uniform float heading, hurt;
out vec3 lit;
void main() {
  vec3 p=position;
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
const uniformNames = ['eye','forward','right','up','origin','pose','scale','heading','hurt'];

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

export function createCitizenRenderer(gl, {maxCachedMeshes=32} = {}) {
  if (typeof gl?.createVertexArray !== 'function') throw TypeError('Citizen rendering requires WebGL2');
  if (!Number.isSafeInteger(maxCachedMeshes) || maxCachedMeshes < 1) throw RangeError('Invalid citizen mesh limit');
  const program = programFor(gl);
  const uniforms = Object.fromEntries(uniformNames.map(name => [name,gl.getUniformLocation(program,name)]));
  const meshes = new Map();
  let gpuBytes = 0;
  let disposed = false;

  function release(mesh) {
    gl.deleteVertexArray(mesh.vao);
    gl.deleteBuffer(mesh.buffer);
    gpuBytes -= mesh.bytes;
  }

  function meshFor(citizen) {
    const key = [citizen.race,citizen.biome,citizen.profession,citizen.variant,citizen.style].join(':');
    const cached = meshes.get(key);
    if (cached) {
      meshes.delete(key);
      meshes.set(key,cached);
      return cached;
    }
    const vertices = buildCitizenMesh(citizen);
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
    if (meshes.size === maxCachedMeshes) {
      const oldest = meshes.keys().next().value;
      release(meshes.get(oldest));
      meshes.delete(oldest);
    }
    const mesh = {vao,buffer,bytes:vertices.byteLength,count:vertices.length/CITIZEN_VERTEX_FLOATS};
    meshes.set(key,mesh);
    gpuBytes += mesh.bytes;
    return mesh;
  }

  return {
    draw(entities, {eye,forward,right,up,aspect,tanHalfFov,time}) {
      if (disposed) throw Error('Citizen renderer is disposed');
      gl.useProgram(program);
      for (const [name,value] of Object.entries({eye,forward,right,up})) gl.uniform3fv(uniforms[name],value);
      gl.uniform2f(uniforms.scale,1/(aspect*tanHalfFov),1/tanHalfFov);
      let vertices = 0;
      try {
        for (const {citizen,position,heading=0,action='idle'} of entities) {
          const mesh = meshFor(citizen);
          const pose = citizenPose(action,time);
          gl.bindVertexArray(mesh.vao);
          gl.uniform3fv(uniforms.origin,position);
          gl.uniform4f(uniforms.pose,pose.swing,pose.lift,pose.action,pose.turn);
          gl.uniform1f(uniforms.heading,heading);
          gl.uniform1f(uniforms.hurt,pose.hurt);
          gl.drawArrays(gl.TRIANGLES,0,mesh.count);
          vertices += mesh.count;
        }
      } finally {
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
      }
      return {drawCalls:entities.length,vertices,gpuBytes,cachedMeshes:meshes.size};
    },
    dispose() {
      if (disposed) return;
      for (const mesh of meshes.values()) release(mesh);
      meshes.clear();
      gl.deleteProgram(program);
      disposed = true;
    },
  };
}
