// AB1 isolated physical-body contract. No live-game import or world ownership.
import {PHYSICAL_MIN_Y, PHYSICAL_MAX_Y, physicalRegionAt} from '../../world-height.mjs';
export const EXPANSION_BODY_LIMITS=Object.freeze({radius:2.5,height:6,maxCells:252,maxOwners:8});
const EPS=1e-5, LIMIT=2**26;
const pointValid=p=>Array.isArray(p)&&p.length===3&&p.every(n=>Number.isFinite(n)&&Math.abs(n)<LIMIT);
export function validExpansionBody(body){
 return !!body&&Number.isFinite(body.radius)&&body.radius>=.08&&body.radius<=EXPANSION_BODY_LIMITS.radius&&
 Number.isFinite(body.height)&&body.height>=.12&&body.height<=EXPANSION_BODY_LIMITS.height&&body.collision==='aabb';
}
export function planBodyVolume(point,body){
 if(!pointValid(point)||!validExpansionBody(body))return null;
 const [x,y,z]=point,{radius:r,height:h}=body;
 if(y<PHYSICAL_MIN_Y||y+h>PHYSICAL_MAX_Y+1)return null;
 const bounds=Object.freeze([x-r,y,z-r,x+r,y+h,z+r]);
 const lo=bounds.slice(0,3).map(n=>Math.floor(n+EPS)),hi=bounds.slice(3).map(n=>Math.floor(n-EPS));
 const count=lo.reduce((n,v,i)=>n*(hi[i]-v+1),1);
 if(count<1||count>EXPANSION_BODY_LIMITS.maxCells)return null;
 const owners=new Map(),cells=[];
 for(let bx=lo[0];bx<=hi[0];bx++)for(let bz=lo[2];bz<=hi[2];bz++)for(let by=lo[1];by<=hi[1];by++){
  const owner=physicalRegionAt(bx,by,bz);
  if(!owner)return null;
  if(!owners.has(owner.key)){if(owners.size>=EXPANSION_BODY_LIMITS.maxOwners)return null;owners.set(owner.key,owner);}
  cells.push(Object.freeze({x:bx,y:by,z:bz,key:owner.key}));
 }
 return Object.freeze({bounds,cells:Object.freeze(cells),owners:Object.freeze([...owners.values()])});
}
function validBox(b){
 return Array.isArray(b)&&b.length===6&&b.every(n=>Number.isFinite(n)&&n>=0&&n<=1)&&
 [0,1,2].every(i=>b[i]<b[i+3]);
}
function intersects(bounds,cell,b){
 const origin=[cell.x,cell.y,cell.z];
 return origin.every((n,i)=>bounds[i+3]>n+b[i]+EPS&&bounds[i]<n+b[i+3]-EPS);
}
// Adapter must supply authoritative cell shapes, residency, revision and full
// Pack3/Manual14/Pack5 overlay clearance. No fake AIR fallback or writes.
// At most 252 cell reads, 16 boxes/cell and two residency reads per owner.
export function inspectBodyVolume(point,body,authority){
 const plan=planBodyVolume(point,body);
 if(!plan||!authority||!['resident','shapeAt','overlayBlocked','revision'].every(k=>typeof authority[k]==='function'))return 'unknown';
 const original=[...point],bodyBefore=[body.radius,body.height,body.collision];
 try{
  const rev=authority.revision();
  if(!Number.isSafeInteger(rev)||rev<0)return 'unknown';
  if(plan.owners.some(o=>authority.resident(o)!==true))return 'unknown';
  let solid=false;
  for(const cell of plan.cells){
   const shape=authority.shapeAt(cell.x,cell.y,cell.z);
   if(!shape||!Array.isArray(shape.boxes)||shape.boxes.length>16||!shape.boxes.every(validBox))return 'unknown';
   if(shape.boxes.some(b=>intersects(plan.bounds,cell,b)))solid=true;
  }
  const overlay=authority.overlayBlocked(plan.bounds);
  if(typeof overlay!=='boolean'||plan.owners.some(o=>authority.resident(o)!==true)||
    !Object.is(authority.revision(),rev)||original.some((n,i)=>!Object.is(n,point[i]))||
    bodyBefore.some((n,i)=>!Object.is(n,[body.radius,body.height,body.collision][i])))return 'unknown';
  return solid||overlay?'solid':'clear';
 }catch{return 'unknown';}
}
export function bodiesOverlap(a,ab,b,bb){
 const ap=planBodyVolume(a,ab),bp=planBodyVolume(b,bb);
 if(!ap||!bp)return null;
 return [0,1,2].every(i=>ap.bounds[i+3]>bp.bounds[i]+EPS&&bp.bounds[i+3]>ap.bounds[i]+EPS);
}
