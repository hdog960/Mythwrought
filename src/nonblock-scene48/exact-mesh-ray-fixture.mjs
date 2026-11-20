// :48 opt-in exact triangle hit test after bounded AABB broadphase.
// Never binds production raycasting or modifies schema-1 saves.
import {intersectSelectionAabb} from './ray-pick-fixture.mjs';
export const MESH_RAY_VERSION='nonblock-mesh-ray-v1';
const valid=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
function triangleHit(o,d,a,b,c){
 const e1=b.map((v,i)=>v-a[i]),e2=c.map((v,i)=>v-a[i]);
 const cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const dot=(u,v)=>u.reduce((n,x,i)=>n+x*v[i],0);
 const p=cross(d,e2),det=dot(e1,p);
 if(Math.abs(det)<1e-9)return null;
 const inv=1/det,tvec=o.map((v,i)=>v-a[i]),u=dot(tvec,p)*inv;
 if(u<0||u>1)return null;
 const q=cross(tvec,e1),v=dot(d,q)*inv;
 if(v<0||u+v>1)return null;
 const t=dot(e2,q)*inv;
 return t>=0?t:null;
}
export function pickExactMeshRay(fixture,{origin,direction,maxDistance=6}={}){
 if(!fixture||typeof fixture.visible!=='function'||!valid(origin)||!valid(direction)||
    direction.every(v=>v===0)||!Number.isFinite(maxDistance)||maxDistance<0)
  throw new TypeError('invalid exact mesh ray');
 const length=Math.hypot(...direction),unit=direction.map(v=>v/length);
 let winner=null;
 for(const obj of fixture.visible()){
  if(!obj||!valid(obj.anchor)||!obj.mesh||!obj.mesh.positions||
     obj.mesh.positions.length%9!==0||!obj.mesh.positions.length||
     !obj.selectionAabb)throw new TypeError('invalid shaped object');
  if(intersectSelectionAabb(origin,unit,obj.selectionAabb,maxDistance)===null)continue;
  const p=obj.mesh.positions;
  let best=Infinity;
  for(let i=0;i<p.length;i+=9){
   const coords=Array.from(p.slice(i,i+9));
   if(!coords.every(Number.isFinite))throw new TypeError('nonfinite triangle');
   const verts=[0,3,6].map(j=>coords.slice(j,j+3).map((v,k)=>v+obj.anchor[k]));
   const distance=triangleHit(origin,unit,...verts);
   if(distance!==null&&distance<=maxDistance)best=Math.min(best,distance);
  }
  if(best===Infinity)continue;
  if(!winner||best<winner.distance-1e-9||
    (Math.abs(best-winner.distance)<=1e-9&&obj.instanceKey<winner.instanceKey))
   winner={sceneId:obj.sceneId,instanceKey:obj.instanceKey,distance:best};
 }
 return winner?Object.freeze(winner):null;
}
export function breakExactMeshRay(fixture,ray){
 if(typeof fixture?.breakByKey!=='function')throw new TypeError('invalid fixture');
 const hit=pickExactMeshRay(fixture,ray);
 return hit&&fixture.breakByKey(hit.instanceKey)?hit:null;
}
