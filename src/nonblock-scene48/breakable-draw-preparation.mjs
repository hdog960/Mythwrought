// Opt-in draw submission for breakable nonblock-object-v1 descriptors.
// Does not register production GL, spawn world objects or modify save-core.
import {NONBLOCK_OBJECT_VERSION} from './nonblock-object-v1.mjs';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(finite);
export function prepareBreakableObjectDraws(session,camera,{radius=48,maxInstances=512,maxTriangles=120000}={}){
 if(!session||session.contract!==NONBLOCK_OBJECT_VERSION||typeof session.visible!=='function'||!camera||!vec(camera.position))throw new TypeError('invalid session or camera');
 if(!finite(radius)||radius<=0||!Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>2048||!Number.isSafeInteger(maxTriangles)||maxTriangles<1||maxTriangles>1000000)throw new RangeError('invalid draw limits');
 const objects=session.visible(),radius2=radius*radius,within=[];
 for(const obj of objects){
  if(obj.contract!==NONBLOCK_OBJECT_VERSION||!vec(obj.anchor)||!obj.render?.mesh||!Number.isSafeInteger(obj.render.triangleCount)||obj.render.triangleCount<1)throw new TypeError('invalid object descriptor');
  const d2=obj.anchor.reduce((s,n,i)=>s+(n-camera.position[i])**2,0);
  const extent=Math.max(...obj.selectionAabbs.flatMap(a=>a.max.map((n,i)=>Math.abs(n-obj.anchor[i]))));
  if(d2<=(radius+extent)**2)within.push({obj,d2});
 }
 within.sort((a,b)=>a.d2-b.d2||a.obj.instanceKey.localeCompare(b.obj.instanceKey));
 const groups=new Map();let triangles=0,selected=0;
 for(const {obj} of within){
  const count=obj.render.triangleCount;
  if(selected>=maxInstances||triangles+count>maxTriangles)continue;
  // No geometry merging: each distinct mesh/variant has a stable keyed draw.
  // Reuse typed mesh buffers by object reference; renderer owns GPU upload/cache.
  const key=obj.sceneId+':'+obj.variant;
  let group=groups.get(key);
  if(!group){group={sceneId:obj.sceneId,variant:obj.variant,mesh:obj.render.mesh,instances:[]};groups.set(key,group);}
  group.instances.push({instanceKey:obj.instanceKey,anchor:[...obj.anchor],selectionAabbs:obj.selectionAabbs});
  triangles+=count;selected++;
 }
 return {draws:[...groups.values()].map(g=>({...g,instances:Object.freeze(g.instances)})),
  stats:Object.freeze({submitted:objects.length,withinRadius:within.length,selected,triangles,budgetDropped:within.length-selected,culled:objects.length-within.length,radius,maxInstances,maxTriangles})};
}
