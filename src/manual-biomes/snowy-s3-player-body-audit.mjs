// SNOW S3 DETACHED ORIGINAL PLAYER-BODY ACCEPTANCE PRIMITIVE.
// The caller MUST supply the actual voxel.collides function when running the
// genuine world acceptance test; this file never imports/mutates M7 or saves.
// Unlike the early one-cell footstep proxy, samples full player AABB collision
// at both stand positions and swept quarter-edges in a bounded 9x9 window.
// Local mock collision tests establish only adapter behavior, NOT true engine.
import {reviewSnowS3CandidateSelection} from './snowy-s3-collision-review.mjs';

const RADIUS=4,TOP=19,STEP=1.01;
const DIR=[[1,0],[-1,0],[0,1],[0,-1]];
const PORTALS=[[-4,0],[4,0],[0,-4],[0,4]];
const key=(x,y,z)=>x+','+y+','+z;
const pos=(dx,dz)=>dx+','+dz;
const stop=(reason)=>Object.freeze({kind:'detached-S3-player-body-walk-audit',safe:false,reason});

export function auditSnowS3OriginalPlayerBody(world,candidate,{collides}={}){
  if(!world||typeof world.get!=='function'||typeof collides!=='function'||
    !reviewSnowS3CandidateSelection(candidate))
    return stop('missing-original-engine-body-contract');
  const {x:originX,z:originZ,floor}=candidate;
  if(!Number.isSafeInteger(floor)||floor<2||floor>13)
    return stop('invalid-authored-surface');
  const originalSave=typeof world.save==='function'?JSON.stringify(world.save()):null;
  const cells=new Map(candidate.cells.map(([x,y,z,id])=>[key(x,y,z),id]));
  const overlay=Object.create(world);
  overlay.get=(x,y,z)=>cells.get(key(x,y,z))??world.get(x,y,z);
  const certificate=[new Map(),new Map()],routes=[new Map(),new Map()];
  let collisionProbes=0;
  const bodyFits=(after,x,y,z)=>{
    // Real original engine: radius=.28, height=1.78, Pack2/manual overlays
    // and registered nonblock collision all resolve from the passed callback.
    collisionProbes++;
    return !collides(after?overlay:world,x,y,z);
  };
  function feet(dx,dz,after){
    const map=certificate[Number(after)],k=pos(dx,dz);
    if(map.has(k))return map.get(k);
    const x=originX+dx,z=originZ+dz;
    let chosen=null;
    for(let feet=Math.min(TOP-1,floor+3);feet>=floor;feet--){
      if((after?overlay:world).get(x,feet-1,z)===0)continue;
      if(!bodyFits(after,x+.5,feet,z+.5))continue;
      // Highest safely supported standing position within one block of the
      // original known source floor. Steep vertical cliff moves are excluded.
      if(feet>floor+2)continue;
      chosen=feet;break;
    }
    map.set(k,chosen);return chosen;
  }
  function edgeClear(x,z,nx,nz,feetA,feetB,after){
    if(Math.abs(feetA-feetB)>STEP)return false;
    const higher=Math.max(feetA,feetB);
    for(const t of [.25,.5,.75]){
      const px=originX+x+.5+(nx-x)*t,pz=originZ+z+.5+(nz-z)*t;
      if(!bodyFits(after,px,higher,pz))return false;
    }
    return true;
  }
  function reachable(source,after){
    const [sx,sz]=source,start=feet(sx,sz,after);
    if(start===null)return new Set();
    const seen=new Set([pos(sx,sz)]),queue=[[sx,sz]];
    for(let i=0;i<queue.length;i++){
      const [dx,dz]=queue[i],y=feet(dx,dz,after);
      for(const [ox,oz] of DIR){
        const nx=dx+ox,nz=dz+oz,k=pos(nx,nz);
        if(Math.abs(nx)>RADIUS||Math.abs(nz)>RADIUS||seen.has(k))continue;
        const ny=feet(nx,nz,after);
        if(ny===null||!edgeClear(dx,dz,nx,nz,y,ny,after))continue;
        seen.add(k);queue.push([nx,nz]);
      }
    }
    return seen;
  }
  try{
    for(let i=0;i<PORTALS.length;i++){
      routes[0].set(i,reachable(PORTALS[i],false));
      routes[1].set(i,reachable(PORTALS[i],true));
    }
  }catch{return stop('original-player-collision-callback-failed')}
  if(originalSave!==null&&JSON.stringify(world.save())!==originalSave)
    return stop('original-schema-1-save-mutated-during-body-review');
  let oldPairs=0,keptPairs=0;
  for(let i=0;i<PORTALS.length;i++)for(let j=i+1;j<PORTALS.length;j++){
    const end=pos(...PORTALS[j]);
    if(!routes[0].get(i).has(end))continue;
    oldPairs++;
    if(!routes[1].get(i).has(end))return stop('original-player-body-passage-severed');
    keptPairs++;
  }
  return Object.freeze({kind:'detached-S3-player-body-walk-audit',safe:true,
    protectedOldPairs:oldPairs,preservedPairs:keptPairs,
    collisionProbes,sites:81,worldEdited:false,
    originalEngineCallbackRequired:true,
    fullWorldAndActualStepPlayerAccepted:false});
}
