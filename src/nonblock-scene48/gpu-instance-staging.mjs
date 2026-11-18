// Opt-in GPU instance staging for nonblock-object-v1. No production GL or world writes.
// The caller owns actual WebGL2 buffer creation, context restoration and draw calls.
import {NONBLOCK_OBJECT_VERSION} from './nonblock-object-v1.mjs';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function stagePreparedBreakableDraws(prepared,{maxBytes=262144}={}){
 if(!Number.isSafeInteger(maxBytes)||maxBytes<12||maxBytes>16777216)throw new RangeError('invalid instance byte cap');
 if(!prepared||!Array.isArray(prepared.draws)||!prepared.stats||!Number.isSafeInteger(prepared.stats.selected))throw new TypeError('invalid prepared draws');
 let used=0,instances=0;
 const batches=[];
 for(const draw of prepared.draws){
  if(typeof draw.sceneId!=='string'||!Number.isSafeInteger(draw.variant)||!Array.isArray(draw.instances)||
    !(draw.mesh?.positions instanceof Float32Array)||!(draw.mesh?.materials instanceof Uint8Array))throw new TypeError('invalid draw batch');
  const bytes=draw.instances.length*12;
  if(used+bytes>maxBytes)throw new RangeError('instance byte cap exceeded');
  const offsets=new Float32Array(draw.instances.length*3);
  for(let i=0;i<draw.instances.length;i++){
   const item=draw.instances[i];
   if(typeof item?.instanceKey!=='string'||!Array.isArray(item.anchor)||item.anchor.length!==3||
      !item.anchor.every(finite)||item.anchor.some(n=>Math.abs(n)>16777216))throw new TypeError('invalid instance anchor');
   offsets.set(item.anchor,i*3);
  }
  used+=bytes;instances+=draw.instances.length;
  batches.push(Object.freeze({sceneId:draw.sceneId,variant:draw.variant,mesh:draw.mesh,offsets,instanceCount:draw.instances.length}));
 }
 if(instances!==prepared.stats.selected)throw new TypeError('instance census mismatch');
 return Object.freeze({batches:Object.freeze(batches),bytes:used,instances});
}
