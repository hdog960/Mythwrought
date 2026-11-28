// Bounded autonomous foraging for the original-engine fixture. No new
// navigation engine, rewards, block mutations or artificial terrain.
import {expansionSupport} from './environment-support.mjs';
import {planBodyVolume,bodiesOverlap} from './body-contract.mjs';
const ids=new Set(['badger','jerboa','golden-scarab','ermine','sproutling','pika','crystal-snail','lantern-beetle','geodeback']);
const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
export function chooseForageGoal(actor,view,roster,tick){
 const q=view.query,r=actor.species,p=actor.position;
 if(!ids.has(r.id)||!Number.isSafeInteger(tick)||!expansionSupport(q,p,r.body,'ground'))return null;
 const rev=view.revision(),offset=(tick+String(actor.id).split('').reduce((n,c)=>n+c.charCodeAt(0),0))%4;
 for(let k=0;k<4;k++){
  const [dx,dz]=dirs[(offset+k)%4];let goal=null;
  for(let i=1;i<=6;i++){
   const at=[p[0]+dx*i*.25,p[1],p[2]+dz*i*.25],plan=planBodyVolume(at,r.body),env=q.environment(at);
   if(!plan||env.biome!==actor.candidate.requirement.biome||env.hazard!==false||!expansionSupport(q,at,r.body,'ground')||
      plan.cells.some(({x,y,z})=>view.materialAt(x,y,z)===undefined)||
      roster.some(e=>e.id!==actor.id&&bodiesOverlap(at,r.body,e.position,e.species.body)!==false))break;
   goal=at;
  }
  if(goal&&Math.hypot(goal[0]-p[0],goal[2]-p[2])>=.75&&view.revision()===rev)return Object.freeze(goal);
 }
 return null;
}
export function refreshForageGoal(actor,view,roster,tick){
 if(!ids.has(actor.species.id))return null;
 const rev=view.revision();
 if(actor.forageRevision!==rev||!Number.isSafeInteger(actor.forageUntil)||tick>=actor.forageUntil){
  actor.forageGoal=chooseForageGoal(actor,view,roster,tick);
  actor.forageRevision=rev;actor.forageUntil=tick+30;
 }
 const p=actor.forageGoal;
 return p&&Math.hypot(...p.map((v,i)=>v-actor.position[i]))>.12?p:null;
}
