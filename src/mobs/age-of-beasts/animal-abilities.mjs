// AB10 candidate-only animal interactions. Original AnimalInteractions owns
// tame/mount state. No new live roster, player writes, inventory or save schema.
import {AnimalInteractions} from '../animal-interactions.mjs';
import {moveBody} from '../movement.mjs';
import {expansionSupport} from './environment-support.mjs';
import {bodiesOverlap} from './body-contract.mjs';
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const awake=a=>a&&['idle','active'].includes(a.state);
const id=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const allowed=new Set(['camel','unicorn','yak','griffin','woolly-mammoth']);
const ridingBody=height=>({radius:.24,height,collision:'aabb'});
// The original two-block center interaction gate is intentionally preserved.
// Oversized mammoth and aerial Griffin mounting need owner-approved reach and
// locomotion changes. No fabricated player position or movement authorization.
export function createCandidateAnimalInteractions(query,actors,{tamed=[]}={}){
 if(!Array.isArray(actors)||actors.length>32||new Set(actors.map(a=>a?.id)).size!==actors.length||
 actors.some(a=>!id(a?.id)||!allowed.has(a.species?.id)||a.candidate?.record!==a.species))throw TypeError('Invalid candidate actors');
 const byId=new Map(actors.map(a=>[a.id,a]));
 const engine=Object.freeze({get:id=>byId.get(id),all:()=>[...byId.values()]});
 const animals=AnimalInteractions.fromCheckpoint(engine,query,tamed);
 const mounted=new Map();
 const validOwner=o=>id(o?.id)&&point(o.position)&&o.alive!==false&&Number.isFinite(o.height)&&o.height>=.12&&o.height<=3.5;
 const clearOwner=o=>validOwner(o)&&query.residentAt(o.position)===true&&query.volume(o.position,ridingBody(o.height))==='clear';
 function near(a,o){
  return awake(a)&&clearOwner(o)&&query.residentAt(a.position)===true&&
   bodiesOverlap(a.position,a.species.body,o.position,ridingBody(o.height))===false&&
   expansionSupport(query,a.position,a.species.body,'ground');
 }
 function tame(id,o){
  const a=byId.get(id),rev=query.revision();
  if(!near(a,o)||!a.species.taming.eligible||query.revision()!==rev)return false;
  return animals.tame(id,o);
 }
 function mount(id,o){
  const a=byId.get(id),rev=query.revision();
  if(!near(a,o)||a.candidate.capability.mount!=='ground'||a.species.id==='woolly-mammoth'||
    mounted.has(o.id)||query.revision()!==rev)return false;
  if(!animals.mount(id,o))return false;
  mounted.set(o.id,{id,height:o.height});return true;
 }
 function step(o,direction,{run=false}={}){
  const m=mounted.get(o?.id),a=m&&byId.get(m.id);
  if(!awake(a)||!validOwner(o)||o.height!==m.height||!Array.isArray(direction)||direction.length!==2||
    !direction.every(Number.isFinite)||!animals.isTamed(m.id,o))return null;
  const rev=query.revision(),body=ridingBody(m.height),seat=()=>[a.position[0],a.position[1]+a.species.body.height,a.position[2]];
  if(query.volume(a.position,a.species.body)!=='clear'||query.volume(seat(),body)!=='clear'||!expansionSupport(query,a.position,a.species.body,'ground'))return null;
  const old={...a,position:[...a.position],velocity:[...a.velocity]};
  if(!animals.steer(o,direction,run))return null;
  const directive=animals.directive(a);
  try{
   moveBody({...query,grounded:(p,b)=>expansionSupport(query,p,b,'ground')},a,directive.heading.direction,1/30,directive.heading);
   if(query.revision()!==rev||query.volume(a.position,a.species.body)!=='clear'||query.volume(seat(),body)!=='clear'||
      !expansionSupport(query,a.position,a.species.body,'ground')||actors.some(b=>b!==a&&awake(b)&&bodiesOverlap(a.position,a.species.body,b.position,b.species.body)!==false)){
    Object.assign(a,old);return null;
   }
   a.action=directive.state;a.visual='walk';
   // Proposal only: movement owner decides actual player locomotion.
   return Object.freeze({id:m.id,position:Object.freeze(seat()),revision:rev});
  }catch{Object.assign(a,old);return null;}
 }
 function dismount(o){
  const m=mounted.get(o?.id),a=m&&byId.get(m.id);
  if(!awake(a)||!validOwner(o)||o.height!==m.height)return null;
  const rev=query.revision(),b=ridingBody(m.height),r=a.species.body.radius+.40;
  for(const [x,z] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[a.position[0]+r*x,a.position[1],a.position[2]+r*z];
   if(query.residentAt(p)!==true||!expansionSupport(query,p,b,'ground')||
    actors.some(c=>awake(c)&&bodiesOverlap(p,b,c.position,c.species.body)!==false)||query.revision()!==rev)continue;
   if(!animals.dismount(o))return null;
   mounted.delete(o.id);return Object.freeze({position:Object.freeze(p),revision:rev});
  }
  return null;
 }
 return Object.freeze({tame,mount,step,dismount,isTamed:(id,o)=>animals.isTamed(id,o),checkpoint:()=>animals.checkpoint()});
}
