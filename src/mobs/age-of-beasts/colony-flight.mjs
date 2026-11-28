// Cave bat colony behavior inside the original engine fixture tick.
// Actual roof contact, full air clearance and existing flight integrator.
import {expansionSupport} from './environment-support.mjs';
import {planBodyVolume,bodiesOverlap} from './body-contract.mjs';
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const awake=e=>['idle','active'].includes(e.state);
export function colonyFlight(actor,view,roster,tick){
 if(actor.species.id!=='cave-bat'||!Number.isSafeInteger(tick))return null;
 const q=view.query,b=actor.species.body,home=actor.home,rev=view.revision();
 if(!expansionSupport(q,home,b,'ceiling'))return null;
 const peers=roster.filter(e=>e.id!==actor.id&&e.species===actor.species&&awake(e)&&distance(e.origin,home)<=8&&expansionSupport(q,e.origin,b,'ceiling'));
 const ids=[actor.id,...peers.map(e=>e.id)].sort();
 const rank=ids.indexOf(actor.id);
 const safe=p=>{
  const env=q.environment(p),plan=planBodyVolume(p,b);
  return !!plan&&env?.biome==='cave'&&env.hazard===false&&expansionSupport(q,p,b,'air')&&
    plan.cells.every(({x,y,z})=>view.materialAt(x,y,z)!==undefined)&&
    roster.every(e=>e.id===actor.id||!awake(e)||bodiesOverlap(p,b,e.position,e.species.body)===false);
 };
 const phase=((tick-1-rank*60)%Math.max(120,ids.length*60)+Math.max(120,ids.length*60))%Math.max(120,ids.length*60);
 // Select an actual clear sortie corridor only when a colony peer exists.
 if(ids.length>=2&&phase<30&&!actor.colonySortie){
  const sign=rank%2===0?-1:1;
  for(const [dx,dz] of [[0,sign],[sign,0],[0,-sign],[-sign,0]]){
   const p=[home[0]+dx*.75,home[1]-1.2,home[2]+dz*.75];
   if([.25,.5,.75,1].every(t=>safe(home.map((v,i)=>v+(p[i]-v)*t)))&&view.revision()===rev){
    actor.colonySortie=Object.freeze(p);break;
   }
  }
 }
 if(!actor.colonySortie)return null;
 if(ids.length>=2&&phase<30&&safe(actor.colonySortie)&&view.revision()===rev)return {goal:actor.colonySortie,departRoost:true};
 // Return even if peers retire during flight. Never teleport or claim a
 // blocked home is reachable; actual movement remains collision constrained.
 if(distance(actor.position,home)<=.035&&expansionSupport(q,actor.position,b,'ceiling')){
  actor.colonySortie=null;return {goal:home,departRoost:false};
 }
 return safe(home)&&view.revision()===rev?{goal:home,departRoost:false}:null;
}
