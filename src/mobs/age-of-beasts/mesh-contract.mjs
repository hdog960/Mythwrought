// AB3 authored voxel-fantasy meshes. Same seven-float vertex layout and joint
// vocabulary as original live-render.mjs; no alternate runtime renderer.
// Lazy per-model construction, no global GPU buffers, no live species admission.
const faces=[[[1,5,6,2],.75],[[4,0,3,7],.60],[[5,4,7,6],.91],
 [[0,1,2,3],.70],[[4,5,1,0],.48],[[3,2,6,7],1]];
const MAX_PARTS=64;
export const MODEL_LIMITS=Object.freeze({parts:MAX_PARTS,vertices:MAX_PARTS*36,bytes:MAX_PARTS*36*7*4});
const joints=new Set([-4, -3, -2,-1,0,1,2,3,4,5,6,7]);
export function buildBeastMesh(author){
 if(typeof author!=='function')throw TypeError('Expected authored model');
 const data=[];let parts=0;
 const box=(x,y,z,w,h,d,hex,joint=0,tilt=0,taper=1)=>{
  if(![x,y,z,w,h,d,tilt,taper].every(Number.isFinite)||[w,h,d].some(n=>n<=0||n>6)||
    !/^[a-f0-9]{6}$/i.test(hex)||!joints.has(joint)||taper<=0||taper>1.5||Math.abs(tilt)>Math.PI||
    ++parts>MAX_PARTS)throw TypeError('Invalid or excessive authored part');
  const c=[0,2,4].map(o=>parseInt(hex.slice(o,o+2),16)/255);
  const corners=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([a,b,k])=>{
   const scale=b>0?taper:1,u=a*w*scale*.5,v=b*h*.5;
   return [x+u*Math.cos(tilt)-v*Math.sin(tilt),y+u*Math.sin(tilt)+v*Math.cos(tilt),z+k*d*scale*.5];
  });
  for(const [indices,shade] of faces)for(const i of [0,1,2,0,2,3])data.push(...corners[indices[i]],...c.map(n=>n*shade),joint);
 };
 author(box);
 if(!parts)throw TypeError('Empty model');
 return new Float32Array(data);
}
// Conservative static envelope for all yaw angles, not animation certification.
export function inspectBeastMesh(data){
 if(!(data instanceof Float32Array)||!data.length||data.length%21!==0||data.length/7>MODEL_LIMITS.vertices)throw TypeError('Invalid mesh');
 let minY=Infinity,maxY=-Infinity,radius=0;const used=new Set();
 for(let i=0;i<data.length;i+=7){
  const [x,y,z,r,g,b,j]=data.subarray(i,i+7);
  if(![x,y,z,r,g,b,j].every(Number.isFinite)||[r,g,b].some(n=>n<0||n>1)||!joints.has(j))throw TypeError('Invalid vertex');
  minY=Math.min(minY,y);maxY=Math.max(maxY,y);radius=Math.max(radius,Math.hypot(x,z));used.add(j);
 }
 for(let i=0;i<data.length;i+=21){
  const a=data.subarray(i,i+3),b=data.subarray(i+7,i+10),c=data.subarray(i+14,i+17);
  const u=b.map((x,k)=>x-a[k]),v=c.map((x,k)=>x-a[k]);
  if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])<=1e-8)throw TypeError('Degenerate triangle');
 }
 return Object.freeze({vertices:data.length/7,triangles:data.length/21,bytes:data.byteLength,minY,maxY,radius,joints:Object.freeze([...used].sort((a,b)=>a-b))});
}
