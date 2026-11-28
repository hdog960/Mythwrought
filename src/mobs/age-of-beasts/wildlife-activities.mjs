// Candidate-only physical wildlife activities. Existing movement and world
// owners stay authoritative; no new blocks, pollination rewards or save keys.
import {expansionSupport} from './environment-support.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../../manual-biomes/mountain-v8-materials.mjs';
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const flowers=new Set([M['flower-petal'],M['heather-tip']]);
const refuges=new Set(['badger','gravehand','dune-serpent','burrowing-horror','sproutling','rime-widow','golden-scarab']);
export function shallowWade(query,p,body){
 if(!point(p)||!body||!expansionSupport(query,p,body,'ground'))return false;
 const lower=Math.min(.2,body.height*.25),top=body.height*.5;
 if(lower<.12||top<lower+.12)return false;
 return expansionSupport(query,p,{...body,height:lower},'water')&&
  expansionSupport(query,[p[0],p[1]+top,p[2]],{...body,height:body.height-top},'air');
}
export function shelteredAt(query,p,body){
 if(!point(p)||!expansionSupport(query,p,body,'ground'))return false;
 // Search only a one-block gap for full overhead physical support.
 for(let i=0;i<=20;i++){
  const at=[p[0],p[1]+i*.05,p[2]];
  if(query.volume(at,body)!=='clear')return false;
  if(expansionSupport(query,at,body,'ceiling'))return true;
 }
 return false;
}
function flowerAt(view,cell){
 if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))return null;
 if(!flowers.has(view.materialAt(...cell)))return null;
 return cell.map((n,i)=>n+(i===1?.38:.5));
}
export function observeWildlife(actor,query,view,{goal,flowerCell,threatVisible,targetVisible,target,revision}){
 const r=actor.species,p=actor.position;
 if(!view||view.query!==query||typeof view.materialAt!=='function'||view.revision()!==revision)return null;
 if(r.id==='oasis-ibis'){
  if(threatVisible)return null;
  const wading=shallowWade(query,p,r.body);
  const validGoal=point(goal)&&shallowWade(query,goal,r.body);
  return wading&&validGoal?{action:'wade',destination:goal}:null;
 }
 if(['honeybee','faerie','prismwing'].includes(r.id)){
  const blossom=flowerAt(view,flowerCell);
  if(threatVisible)return null;
  if(!blossom||r.id==='honeybee'&&query.environment(p)?.dayPhase!=='day')return {action:'fly',destination:null};
  // Fly just above the actual blossom instead of entering its collision shape.
  const at=[blossom[0],blossom[1]+.34,blossom[2]];
  if(distance(p,at)>r.perception.sight||!expansionSupport(query,at,r.body,'air')||query.lineOfSight(p,at)!==true)return {action:'fly',destination:null};
  const arrived=distance(p,at)<=.15;
  return {action:arrived?'flower-contact':'flower-approach',destination:at,flower:Object.freeze([...flowerCell])};
 }
 if(!refuges.has(r.id))return null;
 const covered=shelteredAt(query,p,r.body),safeGoal=point(goal)&&expansionSupport(query,goal,r.body,'ground');
 const hostile=r.classification==='hostile';
 if(hostile&&targetVisible){
  if(actor.refugeState==='concealed'||actor.refugeState==='emerging'){
   return {action:'emerge-walk',destination:safeGoal?goal:target.position};
  }
  return null;
 }
 if(!hostile&&!threatVisible&&r.id!=='golden-scarab')return null;
 if(covered)return {action:'shelter-rest',destination:null};
 if(safeGoal&&shelteredAt(query,goal,r.body))return {action:'shelter-approach',destination:goal};
 return null;
}
export function settleWildlife(actor,query,view,activity,revision,commitPollination){
 if(!activity)return true;
 if(view.revision()!==revision)return false;
 const p=actor.position,b=actor.species.body;
 if(activity.action==='wade')return shallowWade(query,p,b);
 if(activity.action==='shelter-rest'){
  if(!shelteredAt(query,p,b))return false;
  actor.refugeState='concealed';actor.motionMode='shelter';return true;
 }
 if(activity.action==='emerge-walk'){
  actor.refugeState=shelteredAt(query,p,b)?'emerging':'exposed';return true;
 }
 if(activity.action==='flower-contact'){
  const f=flowerAt(view,activity.flower);
  if(!f||distance(p,[f[0],f[1]+.34,f[2]])>.18||view.revision()!==revision)return false;
  const key=activity.flower.join(',');
  if(actor.flowerKey!==key){actor.flowerKey=key;actor.flowerTicks=0;}
  actor.flowerTicks=Math.min(12,(actor.flowerTicks??0)+1);
  if(actor.flowerTicks===12&&actor.species.id==='honeybee'){
   if(!actor.pollenOrigin)actor.pollenOrigin=key;
   else if(actor.pollenOrigin!==key&&typeof commitPollination==='function'){
    const receipt=Object.freeze({sourceId:actor.id,from:actor.pollenOrigin,to:key,revision});
    if(typeof actor.id!=='string'||!actor.id||commitPollination(receipt)!==true)return false;
    actor.pollenOrigin=key; // accepted transfer once, even during further contact
   }
  }
 }else if(activity.action==='flower-approach'){actor.flowerKey=null;actor.flowerTicks=0;}
 return true;
}
