// AB2 physical habitat predicates. No spawn admission or world writes.
import {planBodyVolume,inspectBodyVolume} from './body-contract.mjs';
import {waterSurfaceHeight,parseWaterCell} from '../../block-packs/pack-2/water.mjs';
import {matchesRequiredTime} from './roster-contract.mjs';
import {physicalRegionAt} from '../../world-height.mjs';
const EPS=1e-5,CONTACT=.035;
function intersect(a,b,c,d){return [Math.max(a,c),Math.min(b,d)];}
// Union coverage of the full footprint, not merely a center contact.
function covers(rects,x0,x1,z0,z1){
 if(!rects.length)return false;
 const xs=[x0,x1,...rects.flatMap(r=>[Math.max(x0,r[0]),Math.min(x1,r[2])])].filter(x=>x>=x0&&x<=x1).sort((a,b)=>a-b);
 for(let i=1;i<xs.length;i++){
  if(xs[i]-xs[i-1]<=EPS)continue;
  const mid=(xs[i]+xs[i-1])/2;
  const zs=rects.filter(r=>r[0]<=mid&&mid<=r[2]).map(r=>[Math.max(z0,r[1]),Math.min(z1,r[3])]).sort((a,b)=>a[0]-b[0]);
  let end=z0;
  for(const [lo,hi] of zs){if(hi<=end)continue;if(lo>end+EPS)return false;end=Math.max(end,hi);}
  if(end<z1-EPS)return false;
 }
 return true;
}
function validShape(s){return s&&Array.isArray(s.boxes)&&s.boxes.length<=16&&s.boxes.every(b=>Array.isArray(b)&&b.length===6&&b.every(n=>Number.isFinite(n)&&n>=0&&n<=1)&&[0,1,2].every(i=>b[i]<b[i+3]));}
function supportFace(plan,g,side,touched){
 const [x0,y0,z0,x1,y1,z1]=plan.bounds,face=side==='ground'?y0:y1;
 const low=Math.floor(face+(side==='ground'?-CONTACT:-EPS)),high=Math.floor(face+(side==='ground'?EPS:CONTACT));
 for(let x=Math.floor(x0+EPS);x<=Math.floor(x1-EPS);x++)for(let z=Math.floor(z0+EPS);z<=Math.floor(z1-EPS);z++){
  const [a,b]=intersect(x0,x1,x,x+1),[c,d]=intersect(z0,z1,z,z+1);
  const rects=[];
  for(let y=low;y<=high;y++){
   const owner=physicalRegionAt(x,y,z);
   if(!owner||g.resident(owner)!==true)return false;
   touched.set(owner.key,owner);
   const shape=g.shapeAt(x,y,z);if(!validShape(shape))return false;
   for(const box of shape.boxes){
    const surface=y+box[side==='ground'?4:1];
    const gap=side==='ground'?face-surface:surface-face;
    if(gap>=-EPS&&gap<=CONTACT)rects.push([x+box[0],z+box[2],x+box[3],z+box[5]]);
   }
  }
  if(!covers(rects,a,b,c,d))return false;
 }
 return true;
}
function mediumFits(plan,g,kind){
 const [x0,y0,z0,x1,y1,z1]=plan.bounds;
 for(const cell of plan.cells){
  const {x,y,z}=cell,state=g.waterStateAt(x,y,z);
  if(state===undefined)return false;
  if(state===null){if(kind==='water')return false;continue;}
  const s=parseWaterCell(state);
  const [a,b]=intersect(x0,x1,x,x+1),[c,d]=intersect(z0,z1,z,z+1);
  const heights=[a,b].flatMap(px=>[c,d].map(pz=>waterSurfaceHeight(s,px-x,pz-z)));
  const top=Math.min(y1,y+1)-y,bottom=Math.max(y0,y)-y;
  if(kind==='water'&&top>Math.min(...heights)+EPS)return false;
  if(kind==='air'&&bottom<Math.max(...heights)-EPS)return false;
 }
 return true;
}
export function expansionSupport(query,point,body,kind){
 const g=query?.expansionGeometry,plan=planBodyVolume(point,body);
 if(!g||!plan||!['ground','ceiling','water','air'].includes(kind))return false;
 try{
  const rev=g.revision(),before=[...point],bodyBefore=[body.radius,body.height,body.collision];
  const touched=new Map(plan.owners.map(o=>[o.key,o]));
  if(!Number.isSafeInteger(rev)||rev<0||inspectBodyVolume(point,body,g)!=='clear')return false;
  const ok=kind==='ground'||kind==='ceiling'?supportFace(plan,g,kind,touched):mediumFits(plan,g,kind);
  return ok&&[...touched.values()].every(o=>g.resident(o)===true)&&Object.is(g.revision(),rev)&&before.every((n,i)=>Object.is(n,point[i]))&&bodyBefore.every((n,i)=>Object.is(n,[body.radius,body.height,body.collision][i]));
 }catch{return false;}
}
// Explicit facts from the habitat owner: missing facts never imply suitability.
export function expansionHabitatEligible(query,point,capability,requirement,{facts,lightRange,observer}={}){
 if(!capability||!requirement||capability.id!==requirement.id||typeof facts!=='function'||!Array.isArray(lightRange)||lightRange.length!==2||
 !lightRange.every(n=>Number.isFinite(n)&&n>=0&&n<=1)||lightRange[0]>lightRange[1]||
 !Array.isArray(observer)||observer.length!==3||!observer.every(Number.isFinite)||
 !Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))return false;
 const range=Math.hypot(...point.map((n,i)=>n-observer[i]));
 if(range<5||range>26)return false;
 try{
  const g=query.expansionGeometry,rev=g.revision(),p=Object.freeze([...point]),o=[...observer];
  if(!Number.isSafeInteger(rev)||rev<0)return false;
  const env=query.environment(p);
  if(env?.hazard!==false||env.biome!==requirement.biome||!Number.isFinite(env.light)||
   env.light<lightRange[0]||env.light>lightRange[1]||p[1]<capability.depth[0]||p[1]>capability.depth[1])return false;
  const observed=facts(p,requirement);
  if(!observed||!matchesRequiredTime(requirement,env.dayPhase,observed.darkness===true)||
   !requirement.habitat.every(tag=>Object.hasOwn(observed,tag)&&observed[tag]===true))return false;
  const physical=capability.spawnSupport.some(kind=>expansionSupport(query,p,capability.body,kind));
  return physical&&query.residentAt(p)===true&&Object.is(g.revision(),rev)&&p.every((n,i)=>Object.is(n,point[i]))&&o.every((n,i)=>Object.is(n,observer[i]));
 }catch{return false;}
}
