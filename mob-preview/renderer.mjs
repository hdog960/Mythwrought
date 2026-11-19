import { bufferDimensions } from '../src/render-budget.mjs';
import { meshes } from './models.mjs';

const project = `
uniform vec3 uEye, uForward, uRight, uUp;
uniform float uAspect;
vec4 project(vec3 point) {
  vec3 relative = point - uEye;
  float z = dot(relative, uForward);
  return vec4(dot(relative,uRight)/(uAspect*.47),dot(relative,uUp)/.47,
    z*1.004-.16,z);
}
`;

const terrain = `#version 300 es
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aColor;
${project}
out vec3 vColor;
out float vDistance;
void main() {
  gl_Position=project(aPosition);
  vColor=aColor*vec3(.77,.86,.83);
  vDistance=gl_Position.w;
}`;

const animals = `#version 300 es
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aColor;
layout(location=2) in float aJoint;
layout(location=3) in vec4 aTransform;
layout(location=4) in vec4 aMotion;
${project}
uniform float uTime;
out vec3 vColor;
out float vDistance;
void main() {
  float cycle = sin(uTime*11.0+aMotion.w);
  vec3 p = aPosition;
  if (abs(aJoint) > 1.5) {
    p.x += sin(uTime*3.0+aMotion.w)*.10;
  } else {
    p.z += aJoint*cycle*aMotion.x*.12*max(0.0,.9-p.y);
  }
  p.y += sin(uTime*3.0+aMotion.w)*.015+abs(cycle)*aMotion.x*.016;
  if (aMotion.z > .5) {
    p=vec3(-p.y,p.x+.24,p.z);
  } else {
    p.z += aMotion.y*.16*p.y;
  }
  float s=sin(aTransform.w),c=cos(aTransform.w);
  gl_Position=project(vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z)+aTransform.xyz);
  vColor=mix(aColor,vec3(.94,.45,.19),aMotion.y*.36);
  vDistance=gl_Position.w;
}`;

const fragment = `#version 300 es
precision highp float;
in vec3 vColor;
in float vDistance;
out vec4 color;
void main() {
  float fog=smoothstep(10.0,45.0,vDistance);
  color=vec4(mix(vColor,vec3(.29,.39,.38),fog),1.0);
}`;

const MAX_INSTANCES = 32;
const unit = v => { const length = Math.hypot(...v); return v.map(n => n / length); };
const cross = ([a,b,c], [x,y,z]) => [b*z-c*y, c*x-a*z, a*y-b*x];

function camera(point, species, cameraClear) {
  const distance = species === 'glownewt' ? .68 : species === 'goblin' ? .89 : 1;
  const focus = [point[0], point[1] + (species === 'glownewt' ? .23 : .66), point[2]];
  const choices = [[3.4,1.85,4.7],[-3.4,2.2,4.5],[4.7,2,-2.7],[-4.3,2,-3.3],[1.15,1.6,2.4]];
  const eyes = choices.map(offset => focus.map((value, axis) => value + offset[axis] * distance));
  const eye = eyes.find(candidate => cameraClear(candidate, focus)) ?? eyes[4];
  const forward = unit(focus.map((value, i) => value - eye[i]));
  const right = unit(cross(forward, [0, 1, 0]));
  return { eye, forward, right, up: cross(right, forward) };
}

export function createRenderer(gl, terrainMeshes, cameraClear) {
  const buffers = [];
  const arrays = [];
  const programs = [];
  let disposed = false;
  let bytes = 0;

  function dispose() {
    for (const handle of arrays.splice(0)) gl.deleteVertexArray(handle);
    for (const handle of buffers.splice(0)) gl.deleteBuffer(handle);
    for (const handle of programs.splice(0)) gl.deleteProgram(handle);
    bytes = 0;
    disposed = true;
  }

  function program(vertex) {
    const handle = gl.createProgram();
    if (!handle) throw Error('Could not allocate WebGL2 program');
    programs.push(handle);
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      if (!shader) throw Error('Could not allocate WebGL2 shader');
      try {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
        gl.attachShader(handle, shader);
      } finally {
        gl.deleteShader(shader);
      }
    }
    gl.linkProgram(handle);
    if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(handle));
    return { handle, uniforms: Object.fromEntries(['uEye','uForward','uRight','uUp','uAspect','uTime']
      .map(name => [name, gl.getUniformLocation(handle, name)])) };
  }

  function buffer(data, usage) {
    const handle = gl.createBuffer();
    if (!handle) throw Error('Could not allocate WebGL2 buffer');
    buffers.push(handle);
    gl.bindBuffer(gl.ARRAY_BUFFER, handle);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    bytes += typeof data === 'number' ? data : data.byteLength;
    return handle;
  }

  function attribute(location, size, stride, offset, divisor = 0) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4);
    if (divisor) gl.vertexAttribDivisor(location, divisor);
  }

  function geometry(data, stride, instanced) {
    const array = gl.createVertexArray();
    if (!array) throw Error('Could not allocate WebGL2 vertex array');
    arrays.push(array);
    gl.bindVertexArray(array);
    buffer(data, gl.STATIC_DRAW);
    attribute(0, 3, stride, 0);
    attribute(1, 3, stride, 3);
    let instanceBuffer = null;
    if (instanced) {
      attribute(2, 1, stride, 6);
      instanceBuffer = buffer(MAX_INSTANCES * 32, gl.DYNAMIC_DRAW);
      attribute(3, 4, 8, 0, 1);
      attribute(4, 4, 8, 4, 1);
    }
    return { array, count: data.length / stride, instanceBuffer };
  }

  let scene, animalsProgram, scenery, models;
  try {
    scene = program(terrain);
    animalsProgram = program(animals);
    scenery = terrainMeshes.map(mesh => geometry(mesh, 9, false));
    models = Object.fromEntries(Object.entries(meshes).map(([id, mesh]) => [id, geometry(mesh, 7, true)]));
  } catch (error) {
    dispose();
    throw error;
  }

  const scratch = new Float32Array(MAX_INSTANCES * 8);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(.29, .39, .38, 1);

  function bind(shader, view, aspect, time) {
    gl.useProgram(shader.handle);
    for (const [key, value] of [['uEye',view.eye],['uForward',view.forward],['uRight',view.right],['uUp',view.up]])
      gl.uniform3fv(shader.uniforms[key], value);
    gl.uniform1f(shader.uniforms.uAspect, aspect);
    if (shader.uniforms.uTime !== null) gl.uniform1f(shader.uniforms.uTime, time);
  }

  function render(canvas, subject, entities, time) {
    if (disposed || gl.isContextLost()) return { draws: 0, actors: 0 };
    const size = bufferDimensions(canvas.clientWidth, canvas.clientHeight, 'balanced', window.devicePixelRatio);
    if (canvas.width !== size.width || canvas.height !== size.height) {
      canvas.width = size.width;
      canvas.height = size.height;
    }
    gl.viewport(0, 0, size.width, size.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const aspect = size.width / size.height;
    const view = camera(subject.position, subject.species.id, cameraClear);
    bind(scene, view, aspect, time);
    for (const mesh of scenery) {
      gl.bindVertexArray(mesh.array);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }
    bind(animalsProgram, view, aspect, time);
    let draws = scenery.length;
    let actors = 0;
    for (const [id, mesh] of Object.entries(models)) {
      let count = 0;
      for (const entity of entities) {
        if (entity.species.id !== id || count === MAX_INSTANCES) continue;
        const moving = Math.min(1, Math.hypot(entity.velocity[0], entity.velocity[2]) / 2);
        const intent = entity.visual === 'prepare-attack' ? .7 : entity.visual === 'attack' ? 1 : 0;
        const idleYaw = entity.state === 'idle' && !entity.velocity.some(Boolean) && !entity.yaw ? .56 : entity.yaw;
        scratch.set([...entity.position, idleYaw, moving, intent, Number(entity.state === 'downed'), count * .68], count++ * 8);
      }
      if (!count) continue;
      gl.bindVertexArray(mesh.array);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, scratch, 0, count * 8);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.count, count);
      actors += count;
      draws++;
    }
    return { draws, actors };
  }

  return {
    render, dispose,
    resources: () => ({ buffers: buffers.length, arrays: arrays.length, programs: programs.length, bytes })
  };
}
