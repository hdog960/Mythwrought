// Opt-in, renderer-neutral ray selection for breakable non-block fixture objects.
// Does not register with the production :00 raycaster.
export const RAY_PICK_VERSION='nonblock-ray-pick-v1';
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
export function intersectSelectionAabb(origin,direction,aabb,maxDistance=Infinity){
 if(!vec(origin)||!vec(direction)||!aabb||!vec(aabb.min)||!vec(aabb.max)||
    !Number.isFinite(maxDistance)&&maxDistance!==Infinity||maxDistance<0||
    direction.every(v=>v===0)||aabb.min.some((v,i)=>v>aabb.max[i]))
   throw new TypeError('invalid ray selection input');
 let near=-Infinity,far=Infinity;
 for(let i=0;i<3;i++){
  if(direction[i]===0){if(origin[i]<aabb.min[i]||origin[i]>aabb.max[i])return null;continue;}
  const t1=(aabb.min[i]-origin[i])/direction[i],t2=(aabb.max[i]-origin[i])/direction[i];
  near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));
  if(near>far)return null;
 }
 if(far<0)return null;
 const t=Math.max(0,near),distance=t*Math.hypot(...direction);
 return distance<=maxDistance?distance:null;
}
export function pickBreakableRay(fixture,{origin,direction,maxDistance=6}){
 if(!fixture||typeof fixture.visible!=='function'||typeof fixture.breakByKey!=='function')
  throw new TypeError('invalid opt-in fixture');
 if(!Number.isFinite(maxDistance)||maxDistance<0)throw new TypeError('invalid reach');
 let nearest=null;
 for(const object of fixture.visible()){
  const distance=intersectSelectionAabb(origin,direction,object.selectionAabb,maxDistance);
  if(distance===null)continue;
  if(!nearest||distance<nearest.distance-1e-9||
    (Math.abs(distance-nearest.distance)<=1e-9&&object.instanceKey<nearest.instanceKey))
   nearest={instanceKey:object.instanceKey,sceneId:object.sceneId,distance};
 }
 return nearest===null?null:Object.freeze(nearest);
}
export function breakPickedRay(fixture,ray){
 const target=pickBreakableRay(fixture,ray);
 return target&&fixture.breakByKey(target.instanceKey)?target:null;
}
