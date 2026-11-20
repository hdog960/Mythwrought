// :36 opt-in WebGL2 upload payload preparation. No GL context or production renderer access.
// Each packet retains a distinct instanceKey for picking and removal; no implicit spawning.
import {compileFittingDrawPackets} from './draw-packet-compiler.mjs';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function compileFittingGpuPayload(objects,options={}){
 const plan=compileFittingDrawPackets(objects,options);
 const maxUploadBytes=options.maxUploadBytes??(4*1024*1024);
 // Fail before allocating typed GPU buffers, including when callers request an unsafe cap.
 if(!Number.isSafeInteger(maxUploadBytes)||maxUploadBytes<1||maxUploadBytes>4*1024*1024)
  throw new RangeError('invalid GPU upload budget');
 let projectedBytes=0;
 for(const packet of plan.packets){
  const vertices=packet.positions.length/3;
  if(!Number.isSafeInteger(vertices)||vertices%3!==0||packet.materials.length!==vertices/3)
   throw new TypeError('invalid triangle payload');
  projectedBytes+=vertices*4*Float32Array.BYTES_PER_ELEMENT+packet.instances.length*16*Float32Array.BYTES_PER_ELEMENT;
  if(!Number.isSafeInteger(projectedBytes)||projectedBytes>maxUploadBytes)
   throw new RangeError('GPU upload budget exceeded before allocation');
 }
 const payloads=plan.packets.map(packet=>{
  const count=packet.instances.length,vertices=packet.positions.length/3;
  if(!Number.isSafeInteger(vertices)||vertices%3!==0||packet.materials.length!==vertices/3)
   throw new TypeError('invalid triangle payload');
  // Interleaved position + material (float) permits one bounded geometry upload.
  const vertexData=new Float32Array(vertices*4);
  for(let v=0;v<vertices;v++){
   for(let k=0;k<3;k++){const n=packet.positions[v*3+k];if(!finite(n))throw new TypeError('invalid vertex');vertexData[v*4+k]=n;}
   vertexData[v*4+3]=packet.materials[Math.floor(v/3)];
  }
  // Column-major rotation-Y and translation, one transform per instance.
  const transforms=new Float32Array(count*16);
  const instanceKeys=[];
  for(let i=0;i<count;i++){
   const o=packet.instances[i],r=o.quarterTurnsY,t=o.translation;
   if(!Number.isInteger(r)||r<0||r>3||t.length!==3||!t.every(finite))throw new TypeError('invalid transform');
   const c=[1,0,-1,0][r],s=[0,1,0,-1][r],j=i*16;
   transforms.set([c,0,s,0, 0,1,0,0, -s,0,c,0, t[0],t[1],t[2],1],j);
   instanceKeys.push(o.instanceKey);
  }
  return Object.freeze({group:packet.group,triangleCount:packet.triangleCount,
   vertexData,transforms,instanceKeys:Object.freeze(instanceKeys),instanceCount:count,
   bytes:vertexData.byteLength+transforms.byteLength});
 });
 const bytes=payloads.reduce((sum,p)=>sum+p.bytes,0);
 if(bytes!==projectedBytes||bytes>maxUploadBytes)
  throw new RangeError('GPU upload budget exceeded');
 return Object.freeze({contract:plan.contract,objectCount:plan.objectCount,totalTriangles:plan.totalTriangles,
  uploadBytes:bytes,payloads:Object.freeze(payloads)});
}
