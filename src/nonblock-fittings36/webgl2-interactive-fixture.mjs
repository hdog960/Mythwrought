// :36 opt-in WebGL2 fixture renderer. Not imported by production and never spawns objects.
// Uses the exact authored triangle meshes, not cubes or decorative substitutes.
import {compileFittingDrawPackets} from './draw-packet-compiler.mjs';

export function flattenFittingTriangles(objects, options={}){
 const compiled=compileFittingDrawPackets(objects,options);
 const vertices=[], colors=[];
 const selectedKey=options.selectedKey??null;
 if(selectedKey!==null && (typeof selectedKey!=='string'||!objects.some(o=>o.instanceKey===selectedKey)))
  throw new RangeError('selected object must be visible');
 for(const packet of compiled.packets){
  const p=packet.positions, m=packet.materials;
  if(p.length!==packet.triangleCount*9||m.length!==packet.triangleCount)
   throw new TypeError('invalid triangle packet');
  for(const instance of packet.instances){
   const [tx,ty,tz]=instance.translation, turn=instance.quarterTurnsY;
   if(![tx,ty,tz].every(Number.isFinite)||![0,1,2,3].includes(turn))
    throw new TypeError('invalid instance transform');
   for(let i=0;i<p.length;i+=3){
    const x=p[i],y=p[i+1],z=p[i+2];
    vertices.push(tx+(turn===0?x:turn===1?-z:turn===2?-x:z),
      ty+y,tz+(turn===0?z:turn===1?x:turn===2?-z:-x));
    const material=m[Math.floor(i/9)];
    // Stable material palette; every triangle remains real mesh geometry.
    const palette=[[0.55,0.37,0.21],[0.77,0.67,0.45],[0.36,0.43,0.49],
      [0.62,0.25,0.19],[0.31,0.48,0.32],[0.74,0.73,0.68]];
    const base=palette[material%palette.length];
    colors.push(...(instance.instanceKey===selectedKey ? [Math.min(1,base[0]*0.35+0.65),Math.min(1,base[1]*0.35+0.58),base[2]*0.25] : base));
   }
  }
 }
 if(vertices.length/3!==compiled.totalTriangles*3)throw new TypeError('triangle count mismatch');
 const positions=new Float32Array(vertices),rgb=new Float32Array(colors);
 if(!positions.every(Number.isFinite))throw new TypeError('nonfinite vertices');
 const uploadBytes=positions.byteLength+rgb.byteLength;
 if(uploadBytes>4*1024*1024)throw new RangeError('mobile fixture upload cap');
 return {positions,rgb,triangleCount:compiled.totalTriangles,uploadBytes,
  instanceCount:compiled.objectCount};
}

const VS=`#version 300 es
in vec3 aPosition;
in vec3 aColor;
uniform mat4 uViewProjection;
out vec3 vColor;
void main(){gl_Position=uViewProjection*vec4(aPosition,1.0);vColor=aColor;}`;
const FS=`#version 300 es
precision mediump float;
in vec3 vColor;
out vec4 outColor;
void main(){outColor=vec4(vColor,1.0);}`;

function shader(gl,type,source){
 const s=gl.createShader(type);if(!s)throw new Error('shader allocation failed');
 gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
  const log=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error('shader compile: '+log);
 }
 return s;
}
export function createFittingsWebGL2Fixture(canvas){
 const gl=canvas?.getContext?.('webgl2',{antialias:false,alpha:false,preserveDrawingBuffer:true});
 if(!gl)throw new Error('real WebGL2 required');
 const v=shader(gl,gl.VERTEX_SHADER,VS),f=shader(gl,gl.FRAGMENT_SHADER,FS);
 const program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);
 gl.linkProgram(program);gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('link: '+gl.getProgramInfoLog(program));
 const vao=gl.createVertexArray(),buffers=[gl.createBuffer(),gl.createBuffer()];
 const attribs=['aPosition','aColor'];
 gl.bindVertexArray(vao);
 for(let i=0;i<2;i++){
  const location=gl.getAttribLocation(program,attribs[i]);
  if(location<0)throw new Error('missing attribute '+attribs[i]);
  gl.bindBuffer(gl.ARRAY_BUFFER,buffers[i]);gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);
 }
 gl.bindVertexArray(null);
 let count=0,stats={triangleCount:0,uploadBytes:0,instanceCount:0};
 function upload(objects,options){
  const data=flattenFittingTriangles(objects,options);
  gl.bindVertexArray(vao);
  for(const [i,values] of [data.positions,data.rgb].entries()){
   gl.bindBuffer(gl.ARRAY_BUFFER,buffers[i]);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);
  }
  gl.bindVertexArray(null);count=data.positions.length/3;
  stats={triangleCount:data.triangleCount,uploadBytes:data.uploadBytes,instanceCount:data.instanceCount};
  return Object.freeze({...stats});
 }
 function draw(viewProjection){
  if(!Array.isArray(viewProjection)&&!(viewProjection instanceof Float32Array))
   throw new TypeError('viewProjection must be a 16-element matrix');
  if(viewProjection.length!==16||![...viewProjection].every(Number.isFinite))
   throw new TypeError('invalid viewProjection');
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(0.12,0.16,0.22,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.useProgram(program);
  gl.uniformMatrix4fv(gl.getUniformLocation(program,'uViewProjection'),false,viewProjection);
  gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLES,0,count);gl.bindVertexArray(null);
  const error=gl.getError();if(error!==gl.NO_ERROR)throw new Error('WebGL2 error '+error);
  return Object.freeze({...stats,webgl2:true,drawCalls:count?1:0});
 }
 function dispose(){buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteVertexArray(vao);gl.deleteProgram(program);}
 return Object.freeze({upload,draw,dispose,context:gl});
}
