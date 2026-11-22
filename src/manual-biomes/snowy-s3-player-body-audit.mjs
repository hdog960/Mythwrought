// SNOW S3 DETACHED ORIGINAL PLAYER-BODY ACCEPTANCE PRIMITIVE.
// The caller MUST supply the authentic voxel.collides function for the real
// full-world acceptance gate. Local stand-ins establish only adapter safety.
// This diagnostic has no imports into current M7 and never changes saves.
import {reviewSnowS3CandidateSelection} from './snowy-s3-collision-review.mjs';

const RADIUS=4,TOP=19,STEP=1.01,MAX_PROBES=6000;
const DIR=[[1,0],[-1,0],[0,1],[0,-1]];
// Every boundary opening matters. The previous midpoint-only, four-portal
// proxy could silently sever off-axis trails through winter tree branches.
const PORTALS=Object.freeze(Array.from({length:2*RADIUS+1},(_,i)=>i-RADIUS)
  .flatMap(v=>[[-RADIUS,v],[RADIUS,v],[v,-RADIUS],[v,RADIUS]])
  .filter((p,i,a)=>a.findIndex(q=>q[0]===p[0]&&q[1]===p[1])===i)
  .map(p=>Object.freeze(p)));
const key=(x,y,z)=>x+','+y+','+z;
const pos=(dx,dz)=>dx+','+dz;
const stop=(reason,more={})=>Object.freeze({kind:'detached-S3-player-body-walk-audit',safe:false,reason,...more});

export function auditSnowS3OriginalPlayerBody(world,candidate,{collides}={}){
  if(!world||typeof world.get!=='function'||typeof collides!=='function'||
    typeof world.save!=='function'||!(world.edits instanceof Map)||
    !reviewSnowS3CandidateSelection(candidate))
    return stop('missing-original-engine-body-contract');
  const {x:originX,z:originZ,floor}=candidate;
  if(!Number.isSafeInteger(floor)||floor<2||floor>13)
    return stop('invalid-authored-surface');
  let originalSave;
  try{originalSave=JSON.stringify(world.save())}
  catch{return stop('original-schema-1-save-source-failed')}
  const cells=new Map(candidate.cells.map(([x,y,z,id])=>[key(x,y,z),id]));
  const overlay=Object.create(world);
  overlay.get=(x,y,z)=>cells.get(key(x,y,z))??world.get(x,y,z);
  const floorCache=[new Map(),new Map()];
  const edgeCache=[new Map(),new Map()];
  let collisionProbes=0,edgeEvaluations=0;
  const bodyFits=(after,x,y,z)=>{
    if(++collisionProbes>MAX_PROBES)
      throw new RangeError('original-player-collision-probe-budget-exceeded');
    const blocked=collides(after?overlay:world,x,y,z);
    if(typeof blocked!=='boolean')throw new TypeError('Nonboolean original collision result');
    return !blocked;
  };
  function feet(dx,dz,after){
    const map=floorCache[Number(after)],k=pos(dx,dz);
    if(map.has(k))return map.get(k);
    const x=originX+dx,z=originZ+dz;
    let chosen=null;
    for(let feet=Math.min(TOP-1,floor+2);feet>=floor;feet--){
      if((after?overlay:world).get(x,feet-1,z)===0)continue;
      if(!bodyFits(after,x+.5,feet,z+.5))continue;
      chosen=feet;break;
    }
    map.set(k,chosen);return chosen;
  }
  function edgeClear(x,z,nx,nz,feetA,feetB,after){
    // Movement is directional: stepping UP a partial-height obstruction
    // requires vertical clearance at the player's CURRENT location. Do not
    // share an uphill certificate with its downhill reverse traversal.
    const cache=edgeCache[Number(after)],k=pos(x,z)+'>'+pos(nx,nz);
    if(cache.has(k))return cache.get(k);
    edgeEvaluations++;
    let clear=Math.abs(feetA-feetB)<=STEP;
    if(clear&&feetB>feetA){
      for(const t of [.25,.5,.75,1]){
        if(!bodyFits(after,originX+x+.5,feetA+(feetB-feetA)*t,originZ+z+.5)){
          clear=false;break;
        }
      }
    }
    if(clear){
      const higher=Math.max(feetA,feetB);
      for(const t of [.25,.5,.75]){
        const px=originX+x+.5+(nx-x)*t,pz=originZ+z+.5+(nz-z)*t;
        if(!bodyFits(after,px,higher,pz)){clear=false;break;}
      }
    }
    cache.set(k,clear);
    // With equal feet, reverse horizontal sampling has exactly the same
    // quarter-edge points and body height. The AUTHENTIC original collides
    // contract is read-only: reuse the result, but never for an uphill edge.
    if(feetA===feetB)cache.set(pos(nx,nz)+'>'+pos(x,z),clear);
    return clear;
  }
  function reachable(start,after){
    // Directed, cached graph walk: stepping UP and stepping DOWN need not
    // have the same physics clearance. Every boundary portal gets its own
    // reachability set, but costly body/edge probes are reused across sets.
    const [sx,sz]=start,initial=feet(sx,sz,after);
    if(initial===null)return new Set();
    const visited=new Set([pos(sx,sz)]),queue=[[sx,sz]];
    for(let i=0;i<queue.length;i++){
      const [x,z]=queue[i],y=feet(x,z,after);
      for(const [dx,dz] of DIR){
        const nx=x+dx,nz=z+dz,k=pos(nx,nz);
        if(Math.abs(nx)>RADIUS||Math.abs(nz)>RADIUS||visited.has(k))continue;
        const next=feet(nx,nz,after);
        if(next===null||!edgeClear(x,z,nx,nz,y,next,after))continue;
        visited.add(k);queue.push([nx,nz]);
      }
    }
    return visited;
  }
  let original,withTree;
  try{
    original=PORTALS.map(portal=>reachable(portal,false));
    withTree=PORTALS.map(portal=>reachable(portal,true));
  }catch(e){
    return stop(e?.message==='original-player-collision-probe-budget-exceeded'?
      'original-player-collision-probe-budget-exceeded':
      'original-player-collision-callback-failed',{collisionProbes});
  }
  try{
    if(JSON.stringify(world.save())!==originalSave)
      return stop('original-schema-1-save-mutated-during-body-review');
  }catch{return stop('original-schema-1-save-source-failed')}
  let oldPairs=0,keptPairs=0;
  // Both directions must be examined: a one-block rise with an obstructed
  // vertical step can be traversable DOWNHILL, but not UPHILL. Checking
  // undirected components would wrongly certify such one-way losses.
  for(let i=0;i<PORTALS.length;i++)for(let j=0;j<PORTALS.length;j++){
    if(i===j)continue;
    const destination=pos(...PORTALS[j]);
    if(!original[i].has(destination))continue;
    oldPairs++;
    if(!withTree[i].has(destination))
      return stop('original-player-body-passage-severed',
        {portals:Object.freeze([Object.freeze([...PORTALS[i]]),
          Object.freeze([...PORTALS[j]])]),protectedOldPairs:oldPairs,
          collisionProbes});
    keptPairs++;
  }
  return Object.freeze({kind:'detached-S3-player-body-walk-audit',safe:true,
    protectedOldPairs:oldPairs,preservedPairs:keptPairs,
    collisionProbes,edgeEvaluations,sites:81,boundaryPortals:PORTALS.length,
    worldEdited:false,originalEngineCallbackRequired:true,
    fullWorldAndActualStepPlayerAccepted:false});
}
