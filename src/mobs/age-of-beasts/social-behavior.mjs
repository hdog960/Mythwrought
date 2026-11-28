// Actual peer snapshots and physical ground; no second population manager.
import {BLOCK} from '../../voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../../manual-biomes/mountain-v8-materials.mjs';
import {expansionSupport} from './environment-support.mjs';
import {planBodyVolume,bodiesOverlap} from './body-contract.mjs';
const herdIds=new Set(['bison','golden-antelope','camel','dunewalker','woolly-mammoth','snowdrifter','glimmerstag','yak']);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
export function observeExpansionSocial(actor,query,view,readPeers,revision){
 const r=actor.species,result={herdSeparated:false,goal:null,grazing:false};
 if(!herdIds.has(r.id)||typeof readPeers!=='function'||!view||view.query!==query||typeof view.materialAt!=='function')return result;
 try{
  const s=readPeers();
  if(s?.revision!==revision||!Array.isArray(s.entities)||s.entities.length>32||query.revision()!==revision)return result;
  const distance=e=>Math.hypot(...e.position.map((n,i)=>n-actor.position[i]));
  const peers=s.entities.filter(e=>e!==actor&&e.id!==actor.id&&e.species===r&&['idle','active'].includes(e.state)&&point(e.position)&&query.residentAt(e.position)===true&&distance(e)<=r.perception.sight).sort((a,b)=>distance(a)-distance(b));
  if(peers.length){
   const nearest=peers[0],dx=nearest.position[0]-actor.position[0],dz=nearest.position[2]-actor.position[2],d=Math.hypot(dx,dz),separation=r.body.radius*2+.5;
   if(d>separation+.5){
    const goal=[nearest.position[0]-dx/d*separation,actor.position[1],nearest.position[2]-dz/d*separation];
    if(expansionSupport(query,goal,r.body,'ground')&&peers.every(e=>bodiesOverlap(goal,r.body,e.position,e.species.body)===false)){
     result.herdSeparated=true;result.goal=Object.freeze(goal);
    }
   }
  }
  if(r.behavior.grazes&&expansionSupport(query,actor.position,r.body,'ground')){
   const b=planBodyVolume(actor.position,r.body).bounds,y=Math.floor(b[1]-.035);
   let grass=true;
   for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)
    for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)
     if(![BLOCK.GRASS,M['alpine-grass']].includes(view.materialAt(x,y,z)))grass=false;
   result.grazing=grass;
  }
  return query.revision()===revision?result:{herdSeparated:false,goal:null,grazing:false};
 }catch{return {herdSeparated:false,goal:null,grazing:false};}
}
