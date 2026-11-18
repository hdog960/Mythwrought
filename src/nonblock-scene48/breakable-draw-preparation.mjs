// Opt-in draw submission for breakable nonblock-object-v1 descriptors.
// Does not register production GL, spawn world objects or modify save-core.
import {NONBLOCK_OBJECT_VERSION} from './nonblock-object-v1.mjs';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(finite);
// Exact bytewise geometry equivalence only. A family/variant label is not a mesh identity.
// This intentionally avoids hash collisions and preserves source-specific procedural shapes.
function sameMesh(a,b){
 if(a===b)return true;
 if(a.positions.length!==b.positions.length||a.materials.length!==b.materials.length)return false;
 for(let i=0;i<a.positions.length;i++)if(!Object.is(a.positions[i],b.positions[i]))return false;
 for(let i=0;i<a.materials.length;i++)if(a.materials[i]!==b.materials[i])return false;
 return true;
}
export function prepareBreakableObjectDraws(session,camera,{radius=48,maxInstances=512,maxTriangles=120000}={}){
 if(!session||session.contract!==NONBLOCK_OBJECT_VERSION||typeof session.visible!=='function'||!camera||!vec(camera.position))throw new TypeError('invalid session or camera');
 if(!finite(radius)||radius<=0||!Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>2048||!Number.isSafeInteger(maxTriangles)||maxTriangles<1||maxTriangles>1000000)throw new RangeError('invalid draw limits');
 const objects=session.visible(),radius2=radius*radius,within=[];
 for(const obj of objects){
  if(obj.contract!==NONBLOCK_OBJECT_VERSION||!vec(obj.anchor)||!obj.render?.mesh||!Number.isSafeInteger(obj.render.triangleCount)||obj.render.triangleCount<1)throw new TypeError('invalid object descriptor');
  const d2=obj.anchor.reduce((s,n,i)=>s+(n-camera.position[i])**2,0);
  if(!Array.isArray(obj.selectionAabbs)||obj.selectionAabbs.length===0||obj.selectionAabbs.length>16)throw new TypeError('invalid selection bounds');
  let extent=0;
  for(const a of obj.selectionAabbs){
   if(!vec(a?.min)||!vec(a?.max)||a.min.some((n,i)=>n>a.max[i]))throw new TypeError('invalid selection bounds');
   for(let i=0;i<3;i++)extent=Math.max(extent,Math.abs(a.min[i]-obj.anchor[i]),Math.abs(a.max[i]-obj.anchor[i]));
  }
  if(d2<=(radius+extent)**2)within.push({obj,d2});
 }
 within.sort((a,b)=>a.d2-b.d2||a.obj.instanceKey.localeCompare(b.obj.instanceKey));
 const groups=[];let triangles=0,selected=0;
 for(const {obj} of within){
  const count=obj.render.triangleCount;
  if(!(obj.render.mesh.positions instanceof Float32Array)||!(obj.render.mesh.materials instanceof Uint8Array)||obj.render.mesh.positions.length!==count*9||obj.render.mesh.materials.length!==count)throw new TypeError('invalid triangle buffers');
  if(selected>=maxInstances||triangles+count>maxTriangles)continue;
  // Batch only byte-identical meshes with the same scene family and stable variant.
  // Anchors are still per-instance; no geometry is mutated or deduplicated by tint alone.
  let group=groups.find(g=>g.sceneId===obj.sceneId&&g.variant===obj.variant&&sameMesh(g.mesh,obj.render.mesh));
  if(!group){group={sceneId:obj.sceneId,variant:obj.variant,mesh:obj.render.mesh,instances:[]};groups.push(group);}
  group.instances.push({instanceKey:obj.instanceKey,anchor:[...obj.anchor],selectionAabbs:obj.selectionAabbs});
  triangles+=count;selected++;
 }
 return {draws:groups.map(g=>({...g,instances:Object.freeze(g.instances)})),
  stats:Object.freeze({submitted:objects.length,withinRadius:within.length,selected,triangles,budgetDropped:within.length-selected,culled:objects.length-within.length,radius,maxInstances,maxTriangles})};
}
