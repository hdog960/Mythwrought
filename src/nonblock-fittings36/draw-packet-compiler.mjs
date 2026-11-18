// :36 opt-in canonical draw packet compiler. No GL calls, spawning, or save writes.
import {CONTRACT} from './fittings-phase1.mjs';
import {planFittingBatches} from './mobile-batch-plan.mjs';
const finite = n => typeof n==='number' && Number.isFinite(n);
function same(a,b){return a.length===b.length && a.every((v,i)=>v===b[i]);}
export function compileFittingDrawPackets(objects,options={}){
 const plan=planFittingBatches(objects,options);
 const byKey=new Map(objects.map(o=>[o.instanceKey,o]));
 const packets=[];
 for(const batch of plan.batches){
  const members=batch.instanceKeys.map(k=>byKey.get(k));
  const first=members[0],mesh=first.render.localMesh;
  // Enforce exact local->world parity, including rotation and float32 quantization.
  for(const o of members){
   if(o.contract!==CONTRACT || !same(Array.from(o.render.localMesh.positions),Array.from(mesh.positions)) ||
      !same(Array.from(o.render.localMesh.materials),Array.from(mesh.materials)))
    throw new TypeError('noncanonical draw mesh');
   const p=o.render.localMesh.positions,w=o.render.mesh.positions,r=o.render.transform.quarterTurnsY,t=o.render.transform.translation;
   for(let i=0;i<p.length;i+=3){
    const x=p[i],y=p[i+1],z=p[i+2];
    const rx=r===0?x:r===1?-z:r===2?-x:z;
    const rz=r===0?z:r===1?x:r===2?-z:-x;
    const expected=[Math.fround(t[0]+rx),Math.fround(t[1]+y),Math.fround(t[2]+rz)];
    for(let k=0;k<3;k++)if(!finite(w[i+k]) || Math.abs(w[i+k]-expected[k])>0.000002)
     throw new TypeError('local/world transform mismatch');
   }
  }
  packets.push(Object.freeze({
   group:batch.group,
   // Copy data: callers cannot mutate original source geometry through packets.
   positions:new Float32Array(mesh.positions),
   materials:new Uint8Array(mesh.materials),
   triangleCount:mesh.triangleCount,
   instances:Object.freeze(members.map(o=>Object.freeze({
    instanceKey:o.instanceKey,
    translation:Object.freeze([...o.render.transform.translation]),
    quarterTurnsY:o.render.transform.quarterTurnsY
   })))
  }));
 }
 return Object.freeze({contract:CONTRACT,objectCount:plan.objectCount,
  totalTriangles:plan.totalTriangles,packets:Object.freeze(packets)});
}
