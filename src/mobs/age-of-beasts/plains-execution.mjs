// AB4 isolated execution of a single candidate using the ORIGINAL moveBody.
// Not a new population manager. Only owner-provided target damage commit;
// no world edits or production admission. Special abilities not yet executed.
import {moveBody} from '../movement.mjs';
import {nextPlainsIntent} from './plains-intents.mjs';
import {nextDesertIntent} from './desert-intents.mjs';
import {nextSnowIntent} from './snow-intents.mjs';
import {nextForestIntent} from './forest-intents.mjs';
import {nextAlpineIntent,nextCaveIntent} from './alpine-cave-intents.mjs';
import {hearExpansionDisturbance} from './sound-perception.mjs';
import {expansionSupport} from './environment-support.mjs';
const dt=1/30;
const attackActions=new Set(['claw','ambush','heavy-melee','lunge','restrain','defend','melee','pincer','tail-strike','branch-strike','drop-attack']);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(n=>Number.isFinite(n)&&Math.abs(n)<2**26);
function createActor(candidate,position,query,biome){
 if(candidate?.requirement?.biome!==biome)throw TypeError('Wrong candidate biome');
 if(!candidate?.record||!point(position)||query.volume(position,candidate.record.body)!=='clear')throw TypeError('Invalid actor spawn');
 if(biome==='cave'){
  const {record:r,capability:c}=candidate,env=query.environment(position);
  if(env?.biome!=='cave'||env.hazard!==false||position[1]<c.depth[0]||position[1]>c.depth[1]||!c.spawnSupport.some(k=>expansionSupport(query,position,r.body,k)))throw TypeError('Invalid cave habitat');
 }
 return {candidate,species:candidate.record,position:[...position],velocity:[0,0,0],yaw:0,grounded:false,cooldown:0,windup:0,windupTarget:null,dropState:null,dropTarget:null,visual:'idle',state:'idle',action:'idle'};
}
function stepActor(actor,query,{target,threat,goal,facts={},commitDamage,readDisturbances}={},biome,decide){
 if(actor?.candidate?.requirement?.biome!==biome)return false;
 const r=actor.species,rev=query.revision();
 if(!Number.isSafeInteger(rev)||query.volume(actor.position,r.body)!=='clear')return false;
 const start={...actor,position:[...actor.position],velocity:[...actor.velocity]};
 const distance=p=>point(p)?Math.hypot(...p.map((n,i)=>n-actor.position[i])):1e6;
 const sight=p=>point(p)&&distance(p)<=r.perception.sight&&query.lineOfSight([actor.position[0],actor.position[1]+r.body.height*.6,actor.position[2]],p)===true;
 const env=query.environment(actor.position);
 const visible=sight(target?.position),threatVisible=sight(threat?.position);
 const grounded=expansionSupport(query,actor.position,r.body,'ground');
 const attackTarget=['bison','dunewalker','woolly-mammoth','griffin','geodeback'].includes(r.id)?threat:target;
 const heard=hearExpansionDisturbance(query,actor,readDisturbances,rev);
 const reattachWall=r.id==='ceiling-lurker'&&actor.dropState==='recovering'&&expansionSupport(query,actor.position,r.body,'climb-surface')?
  [[1,0],[-1,0],[0,1],[0,-1]].find(([x,z])=>query.volume([actor.position[0]+x*.18,actor.position[1],actor.position[2]+z*.18],r.body)==='solid'):null;
 const obs={...facts,heard,reattachWall:Boolean(reattachWall),
  climbContact:r.id==='cliff-reaver'&&expansionSupport(query,actor.position,r.body,'climb-surface'),
  climbGoal:point(goal)&&goal[1]>actor.position[1]+.1,
  dropState:actor.dropState,dropTargetMatches:actor.dropTarget===target,
  targetBelow:visible&&target.position[1]<actor.position[1]-.5&&Math.hypot(target.position[0]-actor.position[0],target.position[2]-actor.position[2])<=.8,
  ceilingContact:biome==='cave'&&expansionSupport(query,actor.position,r.body,'ceiling'),ready:env?.hazard===false&&env.biome===biome&&(biome!=='cave'||actor.position[1]>=actor.candidate.capability.depth[0]&&actor.position[1]<=actor.candidate.capability.depth[1]),dayPhase:env?.dayPhase,darkness:Number.isFinite(env?.light)&&env.light<=.3,targetVisible:visible,targetDistance:visible?distance(target.position):1e6,threatDistance:threatVisible?distance(threat.position):1e6,grounded,cooldownRemaining:Math.max(0,actor.cooldown-dt),windupElapsed:actor.windupTarget===attackTarget?actor.windup:0};
 const intent=decide(actor.candidate,obs);
 actor.cooldown=obs.cooldownRemaining;
 actor.windup=intent.action==='prepare-attack'?obs.windupElapsed+dt:0;
 actor.windupTarget=intent.action==='prepare-attack'?attackTarget:null;
 actor.action=intent.action;actor.visual=intent.visual;
 let destination=null,away=false;
 if(['pursue','pack-flank','charge'].includes(intent.action)&&visible)destination=target.position;
 if(['flee','evade'].includes(intent.action)&&threatVisible){destination=threat.position;away=true;}
 if(['herd','forage','fly','land','return-hive','flower-visit','swim','ceiling-crawl','climb'].includes(intent.action)&&point(goal))destination=goal;
 if(intent.action==='investigate'&&heard)destination=heard;
 let heading=[0,0],vertical=0;
 if(destination){let dx=destination[0]-actor.position[0],dz=destination[2]-actor.position[2],n=Math.hypot(dx,dz);if(n>1e-5)heading=[dx/n*(away?-1:1),dz/n*(away?-1:1)];vertical=Math.sign(destination[1]-actor.position[1]);}
 if(intent.action==='reattach-climb'&&reattachWall)heading=reattachWall;
 const flying=r.movement.capabilities.includes('fly')&&(!grounded||['fly','land','evade','return-hive','pursue','flower-visit'].includes(intent.action));
 if(intent.action==='land')vertical=-1;
 if(biome==='cave'&&r.id==='cave-bat'&&obs.ceilingContact&&intent.action==='fly')vertical=-1;
 if(intent.action==='pack-flank'&&visible&&destination){const [x,z]=heading;heading=[x*.55-z*.835,z*.55+x*.835];}
 const jump=intent.action==='evade'&&r.movement.capabilities.includes('jump')&&grounded;
 if(intent.action==='fly'&&grounded&&vertical<=0)vertical=1;
 try{
  const waterOnly=r.id==='blind-cavefish',roost=intent.action==='roost',climbing=['climb','reattach-climb'].includes(intent.action);
  if(r.id==='ceiling-lurker'){
   if(intent.action==='drop-fall'&&actor.dropState!=='descending'){actor.dropState='descending';actor.dropTarget=target;actor.velocity=[0,0,0];}
   if(intent.action==='drop-recover'){actor.dropState='recovering';actor.dropTarget=null;}
   if(intent.action==='ceiling-crawl'&&obs.ceilingContact){actor.dropState=null;actor.dropTarget=null;}
  }
  const ceilingOnly=r.id==='ceiling-lurker'&&!actor.dropState;
  const support=waterOnly?'water':ceilingOnly||roost?'ceiling':null;
  if(support&&!expansionSupport(query,actor.position,r.body,support)){Object.assign(actor,start);return false;}
  if(!obs.ready&&biome==='cave'){Object.assign(actor,start);return false;}
  const movementQuery={...query,grounded:(p,b)=>expansionSupport(query,p,b,ceilingOnly||roost?'ceiling':'ground'),
   volume:(p,b)=>{const state=query.volume(p,b);return state==='clear'&&support&&!expansionSupport(query,p,b,support)?'solid':state;},
   environment:p=>({...query.environment(p),climbable:climbing&&expansionSupport(query,p,r.body,'climb-surface')})};
  if(roost){actor.velocity=[0,0,0];actor.motionMode='roost';actor.grounded=false;}
  else moveBody(movementQuery,actor,heading,dt,{mode:waterOnly?'swim':flying?'fly':'walk',vertical:ceilingOnly?0:vertical,jump,climb:climbing,pace:intent.action==='charge'?1.5:away?1.2:1});
  if(support&&!expansionSupport(query,actor.position,r.body,support)){Object.assign(actor,start);return false;}
  if(climbing&&(!expansionSupport(query,actor.position,r.body,'climb-surface')||actor.motionMode!=='climb')){Object.assign(actor,start);return false;}
  if(waterOnly&&actor.motionMode!=='swim'){Object.assign(actor,start);return false;}
  if(ceilingOnly||intent.action==='reattach-climb'&&expansionSupport(query,actor.position,r.body,'ceiling')){actor.dropState=null;actor.dropTarget=null;actor.motionMode='ceiling-crawl';actor.velocity=[0,0,0];actor.grounded=false;}
  if(query.revision()!==rev||query.volume(actor.position,r.body)!=='clear'||query.revision()!==rev){Object.assign(actor,start);return false;}
  if(attackActions.has(intent.action)){
   const victim=intent.action==='defend'?threat:target;
   if(!victim||!sight(victim.position)||distance(victim.position)>r.combat.reach||query.revision()!==rev||typeof commitDamage!=='function'){Object.assign(actor,start);return false;}
   // Commit must atomically check owner revision and identity; false is no mutation.
   if(commitDamage(victim,r.combat.damage,rev,intent.action)!==true){Object.assign(actor,start);return false;}
   actor.cooldown=r.combat.cooldown;
   if(intent.action==='drop-attack'){actor.dropState='recovering';actor.dropTarget=null;}
  }
  return true;
 }catch{Object.assign(actor,start);return false;}
}

export const createPlainsActor=(c,p,q)=>createActor(c,p,q,'meadow');
export const stepPlainsActor=(a,q,o)=>stepActor(a,q,o,'meadow',nextPlainsIntent);
export const createDesertActor=(c,p,q)=>createActor(c,p,q,'desert');
export const stepDesertActor=(a,q,o)=>stepActor(a,q,o,'desert',nextDesertIntent);

export const createSnowActor=(c,p,q)=>createActor(c,p,q,'snow');
export const stepSnowActor=(a,q,o)=>stepActor(a,q,o,'snow',nextSnowIntent);

export const createForestActor=(c,p,q)=>createActor(c,p,q,'forest');
export const stepForestActor=(a,q,o)=>stepActor(a,q,o,'forest',nextForestIntent);

export const createAlpineActor=(c,p,q)=>createActor(c,p,q,'alpine');
export const stepAlpineActor=(a,q,o)=>stepActor(a,q,o,'alpine',nextAlpineIntent);
export const createCaveActor=(c,p,q)=>createActor(c,p,q,'cave');
export const stepCaveActor=(a,q,o)=>stepActor(a,q,o,'cave',nextCaveIntent);
