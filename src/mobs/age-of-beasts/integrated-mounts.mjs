// Original AnimalInteractions owns taming and mount directives. This adapter
// uses engine snapshots and runs mount motion only inside the original tick.
// No actual player movement, saves, inventory, XP or aerial riding.
import {AnimalInteractions} from '../animal-interactions.mjs';
import {moveBody} from '../movement.mjs';
import {expansionSupport} from './environment-support.mjs';
import {bodiesOverlap} from './body-contract.mjs';
const awake=m=>m&&['active','idle'].includes(m.state);
const valid=o=>typeof o?.id==='string'&&o.id.length>0&&o.id.length<=128&&Array.isArray(o.position)&&o.position.length===3&&o.position.every(Number.isFinite)&&o.alive!==false&&Number.isFinite(o.height)&&o.height>=.12&&o.height<=3.5;
const body=h=>({radius:.24,height:h,collision:'aabb'});
const seat=m=>[m.position[0],m.position[1]+m.species.body.height,m.position[2]];
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const tameable=new Set(['camel','unicorn','yak','griffin','woolly-mammoth']);
export function createIntegratedMounts(engine,query){
 const animals=new AnimalInteractions(engine,query),bindings=new Map();
 function prune(){animals.advance(0);for(const [owner,b] of bindings)if(!awake(engine.get(b.id))){bindings.delete(owner);animals.dismount({id:owner});}}
 function near(m,o){
  return awake(m)&&valid(o)&&tameable.has(m.species.id)&&query.residentAt(o.position)===true&&
    query.volume(o.position,body(o.height))==='clear'&&expansionSupport(query,m.position,m.species.body,'ground')&&
    bodiesOverlap(m.position,m.species.body,o.position,body(o.height))===false;
 }
 function tame(id,o){prune();const m=engine.get(id),rev=query.revision();return near(m,o)&&query.revision()===rev&&animals.tame(id,o);}
 function mount(id,o){
  prune();const m=engine.get(id),rev=query.revision();
  if(!near(m,o)||!['camel','unicorn'].includes(m.species.id)||bindings.has(o.id)||query.volume(seat(m),body(o.height))!=='clear'||query.revision()!==rev)return false;
  if(!animals.mount(id,o))return false;
  bindings.set(o.id,Object.freeze({id,height:o.height}));return true;
 }
 function riderPose(o){
  prune();const b=bindings.get(o?.id),m=b&&engine.get(b.id),rev=query.revision();
  if(!awake(m)||!valid(o)||o.height!==b.height||!animals.isTamed(b.id,o)||!expansionSupport(query,m.position,m.species.body,'ground')||query.volume(seat(m),body(b.height))!=='clear'||query.revision()!==rev)return null;
  return Object.freeze({id:b.id,position:Object.freeze(seat(m)),revision:rev});
 }
 function steer(o,dir,run=false){
  const pose=riderPose(o);
  if(!pose||dist(o.position,pose.position)>.25||!Array.isArray(dir)||dir.length!==2||!dir.every(n=>Number.isFinite(n)&&Math.abs(n)<=1)||typeof run!=='boolean')return false;
  return animals.steer(o,dir,run);
 }
 function dismount(o){
  const pose=riderPose(o);if(!pose||dist(o.position,pose.position)>.25)return null;
  const m=engine.get(pose.id),r=m.species.body.radius+.40,b=body(o.height);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[m.position[0]+r*dx,m.position[1],m.position[2]+r*dz];
   if(!expansionSupport(query,p,b,'ground')||engine.all().some(e=>awake(e)&&bodiesOverlap(p,b,e.position,e.species.body)!==false)||query.revision()!==pose.revision)continue;
   if(!animals.dismount(o))return null;bindings.delete(o.id);
   return Object.freeze({position:Object.freeze(p),revision:pose.revision});
  }
  return null;
 }
 function step(actor,roster){
  const directive=animals.directive(actor);
  if(!directive)return undefined;
  const rev=query.revision(),r=actor.species.body,h=directive.heading.riderHeight,rb=body(h);
  if(!expansionSupport(query,actor.position,r,'ground')||query.volume(seat(actor),rb)!=='clear')return null;
  const peers=roster.filter(e=>e.id!==actor.id&&awake(e));
  const peerClear=(p,b)=>peers.every(e=>bodiesOverlap(p,b,e.position,e.species.body)===false);
  // Both envelopes checked at original integrator probes; no extra motion.
  const movement={...query,grounded:(p,b)=>expansionSupport(query,p,b,'ground'),
   volume:(p,b)=>{const s=query.volume(p,b);return s==='clear'&&!peerClear(p,{...b,collision:'aabb'})?'solid':s;}};
  moveBody(movement,actor,directive.heading.direction,1/30,directive.heading);
  if(query.revision()!==rev||!expansionSupport(query,actor.position,r,'ground')||query.volume(seat(actor),rb)!=='clear'||!peerClear(actor.position,r)||!peerClear(seat(actor),rb))return null;
  actor.action=directive.state;actor.visual='walk';return {motion:actor,state:actor,hit:null};
 }
 return Object.freeze({tame,mount,steer,dismount,riderPose,step,isTamed:(id,o)=>animals.isTamed(id,o),prune});
}
