// Autonomous medium-specific local destinations, not another physics engine.
// Candidate engineering fixture only. No terrain changes or reward effects.
import {expansionSupport} from './environment-support.mjs';
import {planBodyVolume,bodiesOverlap} from './body-contract.mjs';
import {matchesRequiredTime} from './roster-contract.mjs';
const modes=Object.freeze({'blind-cavefish':'water','ceiling-lurker':'ceiling','skyray':'air','aurora-wisp':'air','storm-elemental':'air','dreamweaver':'air','mirage-djinn':'air','wyvern':'air','blizzard-drake':'air'});
const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
const distance=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
export function chooseSpatialGoal(actor,view,roster,tick){
 const q=view.query,r=actor.species,p=actor.position,mode=modes[r.id],env=q.environment(p);
 if(!mode||!Number.isSafeInteger(tick)||env?.hazard!==false||env.biome!==actor.candidate.requirement.biome||
 !matchesRequiredTime(actor.candidate.requirement,env.dayPhase,Number.isFinite(env.light)&&env.light<=.3)||
 (mode==='ceiling'&&actor.dropState)||!expansionSupport(q,p,r.body,mode))return null;
 const rev=view.revision(),home=actor.home;
 const offset=(tick+String(actor.id).split('').reduce((n,c)=>n+c.charCodeAt(0),0))%4;
 for(let k=0;k<4;k++){
  const [dx,dz]=dirs[(offset+k)%4];let goal=null;
  for(let i=1;i<=6;i++){
   const at=[p[0]+dx*i*.25,p[1],p[2]+dz*i*.25];
   const plan=planBodyVolume(at,r.body),e=q.environment(at);
   if(!plan||distance(at,home)>5||e?.hazard!==false||e.biome!==env.biome||
     !expansionSupport(q,at,r.body,mode)||plan.cells.some(({x,y,z})=>view.materialAt(x,y,z)===undefined)||
     roster.some(other=>other.id!==actor.id&&bodiesOverlap(at,r.body,other.position,other.species.body)!==false))break;
   goal=at;
  }
  if(goal&&distance(goal,p)>=.75&&view.revision()===rev)return Object.freeze(goal);
 }
 return null;
}
export function refreshSpatialGoal(actor,view,roster,tick){
 const mode=modes[actor.species.id];if(!mode)return null;
 const rev=view.revision();
 if(actor.spatialRevision!==rev||!Number.isSafeInteger(actor.spatialUntil)||tick>=actor.spatialUntil){
  actor.spatialGoal=chooseSpatialGoal(actor,view,roster,tick);
  actor.spatialRevision=rev;actor.spatialUntil=tick+30;
 }
 const p=actor.spatialGoal;
 return p&&distance(p,actor.position)>.18&&expansionSupport(view.query,actor.position,actor.species.body,mode)?p:null;
}
