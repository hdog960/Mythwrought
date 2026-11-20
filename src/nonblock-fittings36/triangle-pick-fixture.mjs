// :36 isolated opt-in CPU triangle picker; does not touch production :00 raycast or saves.
// Triangle intersection prevents oversized cloth/chain AABBs from being mistaken for mesh hits.
import {CONTRACT} from './fittings-phase1.mjs';
const EPS=1e-8;
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function intersect(origin,dir,p,offset){
 const a=[p[offset],p[offset+1],p[offset+2]],b=[p[offset+3],p[offset+4],p[offset+5]],c=[p[offset+6],p[offset+7],p[offset+8]];
 const e1=sub(b,a),e2=sub(c,a),h=cross(dir,e2),det=dot(e1,h);
 if(Math.abs(det)<EPS)return null;
 const inv=1/det,s=sub(origin,a),u=inv*dot(s,h);
 if(u < -EPS||u>1+EPS)return null;
 const q=cross(s,e1),v=inv*dot(dir,q);
 if(v < -EPS||u+v>1+EPS)return null;
 const t=inv*dot(e2,q);return t>=0?t:null;
}
function inAabb(origin,dir,box,limit){
 let near=0,far=limit;
 for(let axis=0;axis<3;axis++){
  if(Math.abs(dir[axis])<EPS){if(origin[axis]<box.min[axis]||origin[axis]>box.max[axis])return false;continue;}
  const t1=(box.min[axis]-origin[axis])/dir[axis],t2=(box.max[axis]-origin[axis])/dir[axis];
  near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));
  if(far<near)return false;
 }
 return true;
}
export function pickFittingTriangle(objects,{origin,direction,maxDistance=5,blockedDistance=Infinity}){
 if(!Array.isArray(objects)||!Array.isArray(origin)||origin.length!==3||!Array.isArray(direction)||direction.length!==3||
 ![...origin,...direction,maxDistance].every(Number.isFinite)||maxDistance<=0||
 !(Number.isFinite(blockedDistance)||blockedDistance===Infinity)||blockedDistance<0)throw new TypeError('invalid pick ray');
 const length=Math.hypot(...direction);if(length<EPS)throw new RangeError('zero direction');
 const dir=direction.map(v=>v/length),limit=Math.min(maxDistance,blockedDistance);
 let hit=null;
 for(const object of objects){
  if(object?.contract!==CONTRACT||typeof object.instanceKey!=='string'||!object.render?.mesh?.positions||
  !Array.isArray(object.selectionAabbs))throw new TypeError('incompatible fitting descriptor');
  if(!object.selectionAabbs.some(box=>inAabb(origin,dir,box,limit)))continue;
  const p=object.render.mesh.positions;
  if(p.length%9!==0)throw new TypeError('invalid triangle positions');
  for(let i=0;i<p.length;i+=9){
   const t=intersect(origin,dir,p,i);
   if(t!==null&&t<=limit&&(hit===null||t<hit.distance-EPS||
   (Math.abs(t-hit.distance)<=EPS&&object.instanceKey<hit.instanceKey)))
    hit={instanceKey:object.instanceKey,sceneId:object.sceneId,distance:t,triangleIndex:i/9};
  }
 }
 return hit===null?null:Object.freeze(hit);
}
// The integrator must use :00 to authorize removal and persist a tombstone;
// this helper intentionally returns intent only and cannot mutate a world.
export function proposedBreakFromPick(hit){
 if(!hit||typeof hit.instanceKey!=='string'||!Number.isFinite(hit.distance)||hit.distance<0)throw new TypeError('invalid hit');
 return Object.freeze({action:'remove-object',targetKey:hit.instanceKey,requiresOwner:':00',persistVia:'schema1-external-tombstone-sidecar'});
}
