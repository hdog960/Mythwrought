// :48 visual-only WebGL2 upload contract. No GL context creation, world writes, or block IDs.
import {SCENE_FAMILIES,makeSceneBatch} from './flora-phase1.mjs';
const finite = n => typeof n === 'number' && Number.isFinite(n);
const validVec = v => Array.isArray(v) && v.length === 3 && v.every(finite);
export function prepareSceneDraws(instances, camera, options={}) {
  if (!Array.isArray(instances)) throw new TypeError('instances must be an array');
  if (!camera || !validVec(camera.position)) throw new TypeError('finite camera position required');
  const radius = options.radius ?? 48, maxInstances = options.maxInstances ?? 2048;
  if (!finite(radius) || radius<=0 || !Number.isSafeInteger(maxInstances) || maxInstances<1) throw new RangeError('invalid scene draw budget');
  const radius2=radius*radius;
  const visible=[];
  for(const item of instances){
    if(!item || !Object.hasOwn(SCENE_FAMILIES,item.id) || ![item.seed,item.x,item.y,item.z].every(Number.isSafeInteger)) throw new TypeError('invalid scene anchor');
    const [px,py,pz]=camera.position,dx=item.x-px,dy=item.y-py,dz=item.z-pz;
    const reach=radius+Math.max(...SCENE_FAMILIES[item.id].footprint);
    if(dx*dx+dy*dy+dz*dz<=reach*reach) visible.push({item,distance2:dx*dx+dy*dy+dz*dz});
  }
  // Stable near-first density cap, with deterministic tie-breaking regardless of input order.
  visible.sort((a,b)=>a.distance2-b.distance2 || a.item.id.localeCompare(b.item.id) || a.item.x-b.item.x || a.item.y-b.item.y || a.item.z-b.item.z || a.item.seed-b.item.seed);
  const selected=visible.slice(0,maxInstances).map(v=>v.item);
  const batches=makeSceneBatch(selected);
  return {draws:batches.map(batch=>{
    const count=batch.instances.length, data=new Float32Array(count*8);
    for(let i=0;i<count;i++){
      const v=batch.instances[i],o=i*8;
      data[o]=v.anchor[0];data[o+1]=v.anchor[1];data[o+2]=v.anchor[2];
      data[o+3]=v.yaw;data[o+4]=v.scale;data[o+5]=v.bend;data[o+6]=v.variant;data[o+7]=0;
    }
    return {id:batch.id,mesh:batch.mesh,instanceData:data,instanceStrideFloats:8,count,triangleCount:batch.mesh.triangleCount};
  }),stats:{submitted:instances.length,withinRadius:visible.length,selected:selected.length,culled:instances.length-visible.length,budgetDropped:Math.max(0,visible.length-selected.length),maxInstances,radius}};
}
// Upload once per family: positions are xyz triplets, materials are per triangle;
// use divisor=1 for the 8-float instance attributes. The authorized integrator owns GL registration.
export function validateSceneDraw(draw){
 if(!draw || !Object.hasOwn(SCENE_FAMILIES,draw.id) || !(draw.instanceData instanceof Float32Array) || !(draw.mesh?.positions instanceof Float32Array) || !(draw.mesh?.materials instanceof Uint8Array)) throw new TypeError('invalid draw');
 if(draw.instanceStrideFloats!==8 || draw.instanceData.length!==draw.count*8 || draw.mesh.positions.length!==draw.triangleCount*9 || draw.mesh.materials.length!==draw.triangleCount) throw new RangeError('draw buffer shape mismatch');
 for(const n of draw.instanceData) if(!finite(n)) throw new RangeError('nonfinite instance data');
 return true;
}
