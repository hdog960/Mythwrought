// AB4 isolated execution of a single candidate using the ORIGINAL moveBody.
// Not a new population manager. Only owner-provided target damage commit;
// no world edits or production admission. Special abilities not yet executed.
import {moveBody} from '../movement.mjs';
import {nextPlainsIntent} from './plains-intents.mjs';
import {nextDesertIntent} from './desert-intents.mjs';
import {expansionSupport} from './environment-support.mjs';
const dt=1/30;
const attackActions=new Set(['claw','ambush','heavy-melee','lunge','restrain','defend','melee','pincer','tail-strike']);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(n=>Number.isFinite(n)&&Math.abs(n)<2**26);
function createActor(candidate,position,query,biome){
 if(candidate?.requirement?.biome!==biome)throw TypeError('Wrong candidate biome');
 if(!candidate?.record||!point(position)||query.volume(position,candidate.record.body)!=='clear')throw TypeError('Invalid actor spawn');
 return {candidate,species:candidate.record,position:[...position],velocity:[0,0,0],yaw:0,grounded:false,cooldown:0,windup:0,windupTarget:null,visual:'idle',state:'idle',action:'idle'};
}
function stepActor(actor,query,{target,threat,goal,facts={},commitDamage}={},biome,decide){
 if(actor?.candidate?.requirement?.biome!==biome)return false;
 const r=actor.species,rev=query.revision();
 if(!Number.isSafeInteger(rev)||query.volume(actor.position,r.body)!=='clear')return false;
 const start={...actor,position:[...actor.position],velocity:[...actor.velocity]};
 const distance=p=>point(p)?Math.hypot(...p.map((n,i)=>n-actor.position[i])):1e6;
 const sight=p=>point(p)&&distance(p)<=r.perception.sight&&query.lineOfSight([actor.position[0],actor.position[1]+r.body.height*.6,actor.position[2]],p)===true;
 const env=query.environment(actor.position);
 const visible=sight(target?.position),threatVisible=sight(threat?.position);
 const grounded=expansionSupport(query,actor.position,r.body,'ground');
 const attackTarget=['bison','dunewalker'].includes(r.id)?threat:target;
 const obs={...facts,ready:env?.hazard===false&&env.biome===biome,dayPhase:env?.dayPhase,darkness:Number.isFinite(env?.light)&&env.light<=.3,targetVisible:visible,targetDistance:visible?distance(target.position):1e6,threatDistance:threatVisible?distance(threat.position):1e6,grounded,cooldownRemaining:Math.max(0,actor.cooldown-dt),windupElapsed:actor.windupTarget===attackTarget?actor.windup:0};
 const intent=decide(actor.candidate,obs);
 actor.cooldown=obs.cooldownRemaining;
 actor.windup=intent.action==='prepare-attack'?obs.windupElapsed+dt:0;
 actor.windupTarget=intent.action==='prepare-attack'?attackTarget:null;
 actor.action=intent.action;actor.visual=intent.visual;
 let destination=null,away=false;
 if(['pursue','pack-flank'].includes(intent.action)&&visible)destination=target.position;
 if(['flee','evade'].includes(intent.action)&&threatVisible){destination=threat.position;away=true;}
 if(['herd','forage','fly','land','return-hive'].includes(intent.action)&&point(goal))destination=goal;
 let heading=[0,0],vertical=0;
 if(destination){let dx=destination[0]-actor.position[0],dz=destination[2]-actor.position[2],n=Math.hypot(dx,dz);if(n>1e-5)heading=[dx/n*(away?-1:1),dz/n*(away?-1:1)];vertical=Math.sign(destination[1]-actor.position[1]);}
 const flying=r.movement.capabilities.includes('fly')&&(!grounded||['fly','land','evade','return-hive','pursue'].includes(intent.action));
 if(intent.action==='land')vertical=-1;
 if(intent.action==='pack-flank'&&visible&&destination){const [x,z]=heading;heading=[x*.55-z*.835,z*.55+x*.835];}
 const jump=intent.action==='evade'&&r.movement.capabilities.includes('jump')&&grounded;
 if(intent.action==='fly'&&grounded&&vertical<=0)vertical=1;
 try{
  const movementQuery={...query,grounded:(p,b)=>expansionSupport(query,p,b,'ground')};
  moveBody(movementQuery,actor,heading,dt,{mode:flying?'fly':'walk',vertical,jump,pace:away?1.2:1});
  if(query.revision()!==rev||query.volume(actor.position,r.body)!=='clear'||query.revision()!==rev){Object.assign(actor,start);return false;}
  if(attackActions.has(intent.action)){
   const victim=intent.action==='defend'?threat:target;
   if(!victim||!sight(victim.position)||distance(victim.position)>r.combat.reach||query.revision()!==rev||typeof commitDamage!=='function'){Object.assign(actor,start);return false;}
   // Commit must atomically check owner revision and identity; false is no mutation.
   if(commitDamage(victim,r.combat.damage,rev,intent.action)!==true){Object.assign(actor,start);return false;}
   actor.cooldown=r.combat.cooldown;
  }
  return true;
 }catch{Object.assign(actor,start);return false;}
}

export const createPlainsActor=(c,p,q)=>createActor(c,p,q,'meadow');
export const stepPlainsActor=(a,q,o)=>stepActor(a,q,o,'meadow',nextPlainsIntent);
export const createDesertActor=(c,p,q)=>createActor(c,p,q,'desert');
export const stepDesertActor=(a,q,o)=>stepActor(a,q,o,'desert',nextDesertIntent);
