import { bufferDimensions } from '../src/render-budget.mjs';
import { meshes } from './models.mjs';
import { familiarWildlife } from '../src/mobs/familiar-wildlife.mjs';
import { originalWildlife } from '../src/mobs/original-wildlife.mjs';
import { hostileTactics } from '../src/mobs/hostile-tactics.mjs';

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
  if (aJoint > 6.5) {
    p.y += max(0.0,aMotion.y)*(.14+.22*max(0.0,p.z));
    p.z -= max(0.0,aMotion.y)*.09;
  } else if (aJoint > 5.5) {
    float stretch=sin(uTime*9.0)*aMotion.x*.19;
    p.y *= 1.0+stretch;
    p.x *= 1.0-stretch*.55;
  } else if (aJoint > 4.5) {
    p.y += max(0.0,aMotion.y)*.22;
    p.z += max(0.0,aMotion.y)*.11;
  } else if (abs(aJoint) > 3.5) {
    float stroke = sin(uTime*23.0)*aMotion.x;
    p.y += stroke*max(0.0,abs(p.x)-.075)*.68;
  } else if (abs(aJoint) > 2.5) {
    if (aMotion.y < 0.0) {
      p.y -= (-aMotion.y)*(.08 + abs(sin(uTime*7.0))*.12);
      p.z += (-aMotion.y)*.07;
    } else {
      p.y += sin(uTime*4.0)*.016;
    }
  } else if (abs(aJoint) > 1.5) {
    p.x += sin(uTime*3.0+aMotion.w)*.10;
  } else {
    p.z += aJoint*cycle*aMotion.x*.12*max(0.0,.9-p.y);
  }
  p.y += sin(uTime*3.0+aMotion.w)*.015+abs(cycle)*aMotion.x*.016;
  if (aMotion.z > .5) {
    p=vec3(-p.y,p.x+.24,p.z);
  } else {
    p.z += max(0.0,aMotion.y)*.16*p.y;
  }
  if (aMotion.z < -.5) p *= .65;
  float s=sin(aTransform.w),c=cos(aTransform.w);
  gl_Position=project(vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z)+aTransform.xyz);
  vColor=mix(aColor,vec3(.94,.45,.19),max(0.0,aMotion.y)*.36);
  vDistance=gl_Position.w;
}`;

const fragment = `#version 300 es
precision highp float;
in vec3 vColor;
in float vDistance;
uniform float uOpacity;
out vec4 color;
void main() {
  float fog=smoothstep(10.0,45.0,vDistance);
  color=vec4(mix(vColor,vec3(.29,.39,.38),fog),uOpacity);
}`;

const MAX_INSTANCES = 32;
const unit = v => { const length = Math.hypot(...v); return v.map(n => n / length); };
const cross = ([a,b,c], [x,y,z]) => [b*z-c*y, c*x-a*z, a*y-b*x];

function camera(point, species, cameraClear) {
  const id = species.id;
  const familiar = Object.hasOwn(familiarWildlife, id) || Object.hasOwn(originalWildlife,id) || Object.hasOwn(hostileTactics,id);
  const distance = familiar ? Math.max(.58, Math.min(1.08, .45 + species.body.height * .35)) :
    id === 'glownewt' ? .68 : id === 'goblin' ? .89 : 1;
  const level = familiar ? species.body.height * .57 : id === 'glownewt' ? .23 : .66;
  const focus = [point[0], point[1] + level, point[2]];
  const choices = [[3.4,1.85,4.7],[-3.4,2.2,4.5],[4.7,2,-2.7],[-4.3,2,-3.3],[1.15,1.6,2.4],
    [.05,3.1,.85],[-.25,2.65,-.6],[.05,2.9,-.13]];
  const eyes = choices.map(offset => focus.map((value, axis) => value + offset[axis] * distance));
  const eye = eyes.find(candidate => cameraClear(candidate, focus)) ?? eyes[4];
  const forward = unit(focus.map((value, i) => value - eye[i]));
  const right = unit(cross(forward, [0, 1, 0]));
  return { eye, forward, right, up: cross(right, forward) };
}

export function createRenderer(gl, terrainMeshes, cameraClear, waterMeshes = [], caveMeshes = []) {
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
    return { handle, uniforms: Object.fromEntries(['uEye','uForward','uRight','uUp','uAspect','uTime','uOpacity']
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

  let scene, animalsProgram, scenery, caveScenery, fluids, models;
  try {
    scene = program(terrain);
    animalsProgram = program(animals);
    scenery = terrainMeshes.map(mesh => geometry(mesh, 9, false));
    caveScenery = caveMeshes.map(mesh=>geometry(mesh,9,false));
    fluids = waterMeshes.map(mesh => geometry(mesh,9,false));
    models = Object.fromEntries(Object.entries(meshes).map(([id, mesh]) => [id, geometry(mesh, 7, true)]));
  } catch (error) {
    dispose();
    throw error;
  }

  const scratch = new Float32Array(MAX_INSTANCES * 8);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(.29, .39, .38, 1);

  function bind(shader, view, aspect, time, opacity = 1) {
    gl.useProgram(shader.handle);
    for (const [key, value] of [['uEye',view.eye],['uForward',view.forward],['uRight',view.right],['uUp',view.up]])
      gl.uniform3fv(shader.uniforms[key], value);
    gl.uniform1f(shader.uniforms.uAspect, aspect);
    gl.uniform1f(shader.uniforms.uOpacity, opacity);
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
    const view = camera(subject.position, subject.species, cameraClear);
    bind(scene, view, aspect, time);
    const underground=subject.position[1] < -3.5;
    const visibleTerrain=underground ? caveScenery : scenery;
    for (const mesh of visibleTerrain) {
      gl.bindVertexArray(mesh.array);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }
    bind(animalsProgram, view, aspect, time);
    let draws = visibleTerrain.length;
    let actors = 0;
    const batches=new Map();
    for (const entity of entities) {
      const id=entity.species.id;
      if (!Object.hasOwn(models,id) || Math.hypot(...entity.position.map((value,axis)=>value-view.eye[axis])) > 34) continue;
      if (!batches.has(id)) batches.set(id,[]);
      if (batches.get(id).length<MAX_INSTANCES) batches.get(id).push(entity);
    }
    for (const [id, batch] of batches) {
      const mesh=models[id];
      let count = 0;
      for (const entity of batch) {
        const moving = Math.min(1, Math.max(entity.motionMode === 'fly' ? .6 : 0, Math.hypot(...entity.velocity) / 2));
        const foraging = ['graze','forage','peck','browse','sniff','scent','stalk','dusk-watch','shell-retreat','snow-browse','gather'].includes(entity.visual);
        const intent = entity.visual === 'prepare-attack' ? .7 : entity.visual === 'attack' ? 1 : ['reveal','awaken','uncoil','unmask','hurt'].includes(entity.visual) ? .55 : foraging ? -.75 : 0;
        const idleYaw = entity.state === 'idle' && !entity.velocity.some(Boolean) && !entity.yaw ? .56 : entity.yaw;
        scratch.set([...entity.position, idleYaw, moving, intent, (entity.state === 'downed' || entity.visual === 'defeat') ? 1 : entity.juvenile ? -1 : 0, count * .68], count++ * 8);
      }
      if (!count) continue;
      gl.bindVertexArray(mesh.array);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, scratch, 0, count * 8);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.count, count);
      actors += count;
      draws++;
    }
    if (!underground && fluids.length) {
      bind(scene,view,aspect,time,.38);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      for (const mesh of fluids) {
        gl.bindVertexArray(mesh.array);
        gl.drawArrays(gl.TRIANGLES,0,mesh.count);
        draws++;
      }
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }
    return { draws, actors };
  }

  return {
    render, dispose,
    resources: () => ({ buffers: buffers.length, arrays: arrays.length, programs: programs.length, bytes })
  };
}
