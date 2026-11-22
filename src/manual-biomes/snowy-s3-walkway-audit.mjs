// Detached S3 *diagnostic* of existing surface walking lanes. NOT a pathfinder
// or player-physics replacement. The live M7 world/generator is not imported,
// edited, or sampled beyond a bounded 9x9 region and Y=19 roof.
// Compare the same original-footstep graph BEFORE/AFTER already-certified
// physical tree voxels; never delete a preexisting cardinal passage.
import {reviewSnowS3CandidateSelection} from './snowy-s3-collision-review.mjs';

const AIR=0, MAX_Y=19, RADIUS=4;
const key=(x,y,z)=>x+','+y+','+z;
const id=(dx,dz)=>dx+','+dz;
const within=n=>Number.isSafeInteger(n)&&Math.abs(n)<=250000;
const DIRECTIONS=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
const PORTALS=Object.freeze([[-4,0],[4,0],[0,-4],[0,4]]);
const frozenReason=(reason,details={})=>Object.freeze({
  kind:'detached-s3-original-voxel-walking-proxy',safe:false,reason,...details
});

/** Read-only conservative headroom and one-step walking connectivity check.
 * Returns a strictly diagnostic certificate (never an active M7 placement).
 */
export function auditSnowS3Walkway(world,candidate){
  if(!world||typeof world.get!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    !(world.edits instanceof Map)||
    !within(candidate?.x)||!within(candidate?.z)||
    !Number.isSafeInteger(candidate.floor)||candidate.floor<2||candidate.floor>13||
    !reviewSnowS3CandidateSelection(candidate))
    return frozenReason('missing-source-or-invalid-S3-certificate');
  const {x:ox,z:oz,floor}=candidate;
  const saveBefore=typeof world.save==='function'?JSON.stringify(world.save()):null;
  // An old cave mouth, a carved cave AIR cell or an existing player edit
  // within two horizontal cells is cause to refuse, even if the new trunk
  // itself would technically fit. Never claim this is a source-genuine route.
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)
    for(let y=Math.max(1,floor-1);y<=Math.min(MAX_Y,floor+3);y++){
      const x=ox+dx,z=oz+dz,at=key(x,y,z);
      if(world.environmentCaves.get(x,y,z)!==undefined)
        return frozenReason('near-original-cave-override',{at:Object.freeze([x,y,z])});
      if(world.edits.has(at))
        return frozenReason('near-existing-player-edit',{at:Object.freeze([x,y,z])});
    }
  const future=new Map(candidate.cells.map(([x,y,z,block])=>[key(x,y,z),block]));
  const physical=(x,y,z,after)=>after&&future.has(key(x,y,z))?
    future.get(key(x,y,z)):world.get(x,y,z);
  const cache=[new Map(),new Map()];
  function footAt(dx,dz,after){
    const map=cache[Number(after)],k=id(dx,dz);
    if(map.has(k))return map.get(k);
    const x=ox+dx,z=oz+dz;
    // Highest support within one permitted step from the original floor;
    // never mistake a high branch or canopy for ordinary walking ground.
    const min=Math.max(2,floor),max=Math.min(MAX_Y-1,floor+2);
    let result=null;
    for(let feet=max;feet>=min;feet--){
      if(physical(x,feet-1,z,after)!==AIR&&
        physical(x,feet,z,after)===AIR&&
        physical(x,feet+1,z,after)===AIR){result=feet;break;}
    }
    map.set(k,result);return result;
  }
  function reach(start,after){
    const [sx,sz]=start,initial=footAt(sx,sz,after);
    if(initial===null)return new Set();
    const visited=new Set([id(sx,sz)]),queue=[[sx,sz]];
    for(let i=0;i<queue.length;i++){
      const [x,z]=queue[i],feet=footAt(x,z,after);
      for(const [dx,dz] of DIRECTIONS){
        const nx=x+dx,nz=z+dz,k=id(nx,nz);
        if(Math.abs(nx)>RADIUS||Math.abs(nz)>RADIUS||visited.has(k))continue;
        const next=footAt(nx,nz,after);
        if(next===null||Math.abs(feet-next)>1)continue;
        visited.add(k);queue.push([nx,nz]);
      }
    }
    return visited;
  }
  const before=new Map(),after=new Map(),baselinePairs=[];
  for(let i=0;i<PORTALS.length;i++){
    const start=PORTALS[i];before.set(i,reach(start,false));
    after.set(i,reach(start,true));
  }
  for(let i=0;i<PORTALS.length;i++)for(let j=i+1;j<PORTALS.length;j++){
    const to=id(...PORTALS[j]);
    if(!before.get(i).has(to))continue;
    baselinePairs.push(Object.freeze([i,j]));
    if(!after.get(i).has(to))return frozenReason('severs-original-cardinal-passage',{
      portals:Object.freeze([i,j]),baselineConnected:baselinePairs.length
    });
  }
  if(saveBefore!==null&&JSON.stringify(world.save())!==saveBefore)
    return frozenReason('world-mutated-during-detached-review');
  return Object.freeze({kind:'detached-s3-original-voxel-walking-proxy',
    safe:true,baselineConnectedPairs:baselinePairs.length,
    preservedConnectedPairs:baselinePairs.length,
    queryArea:81,originalM7Unchanged:true,
    note:'footstep proxy, not original stepPlayer or real player collision'});
}
