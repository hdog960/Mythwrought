// Candidate-only territory and pack execution. Existing scheduler supplies
// authoritative observations and tick. No secondary population/HP authority.
import {expansionSupport} from './environment-support.mjs';
import {planBodyVolume} from './body-contract.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../../manual-biomes/mountain-v8-materials.mjs';
const territorial=new Set(['sand-colossus','chimera','abyssal-sentinel']);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
export function territoryDecision(actor,query,target,revision){
 const r=actor.species,home=actor.home;
 if(!territorial.has(r.id)||!point(home))return null;
 const radius=r.behavior.territory;
 if(!Number.isFinite(radius)||radius<=0)return null;
 const outside=point(target?.position)&&dist(home,target.position)>radius;
 const displaced=dist(home,actor.position)>.18;
 if(dist(home,actor.position)>radius||outside||!target&&displaced&&actor.returningHome){
  const safe=displaced&&expansionSupport(query,home,r.body,'ground')&&query.revision()===revision;
  return {action:safe?'return-territory':'guard-territory',destination:safe?home:null};
 }
 return null;
}
export function observeDirePack(actor,query,target,readPeers,revision,tick){
 if(actor.species.id!=='dire-hound'||!id(actor.id)||!id(target?.id)||target.alive===false||!Number.isSafeInteger(tick)||tick<0||typeof readPeers!=='function')return null;
 try{
  const snapshot=readPeers();
  if(snapshot?.revision!==revision||snapshot.tick!==tick||!Array.isArray(snapshot.entities)||snapshot.entities.length>32)return null;
  const peers=snapshot.entities.filter(e=>e?.id!==actor.id&&id(e?.id)&&e.species===actor.species&&['active','idle'].includes(e.state)&&e.targetId===target.id&&point(e.position)&&dist(actor.position,e.position)<=actor.species.perception.sight&&query.residentAt(e.position)===true);
  const ids=[actor.id,...peers.map(e=>e.id)].sort();
  if(ids.length<2||ids.length>3||new Set(ids).size!==ids.length||query.revision()!==revision)return null;
  const rank=ids.indexOf(actor.id),slot=Math.floor(tick/4)%ids.length;
  return Object.freeze({rank,size:ids.length,mayStrike:slot===rank,flank:rank%2===0?1:-1});
 }catch{return null;}
}
const snow=new Set([272,276,279,M.snow]);
export function snowRollSurface(query,view,position,body,revision){
 if(!view||view.query!==query||view.revision()!==revision||!expansionSupport(query,position,body,'ground'))return false;
 const b=planBodyVolume(position,body)?.bounds;if(!b)return false;
 for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)
  if(!snow.has(view.materialAt(x,Math.floor(b[1]-.035),z)))return false;
 return query.revision()===revision;
}
