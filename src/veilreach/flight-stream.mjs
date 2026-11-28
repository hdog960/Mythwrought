import {physicalBodyRegions,runtimeMeshKey,runtimeSectionBounds,upperOccupancy} from '../world-height.mjs';
import {UPPER_GPU_OWNERS,UPPER_RESIDENT_BYTES,upperGpuStats} from '../world-height-budget.mjs';

const maxOwners=25;
const maxLookaheadOwners=6;
const maxRetainedOwners=3;
const meshKey=({cx,cz,section})=>runtimeMeshKey(cx,cz,section);
const axisDistance=(v,min,max)=>Math.max(min-v,0,v-max);

function distanceToOwner(player,cx,cz,section){
  const {minY,maxY}=runtimeSectionBounds(section);
  return Math.hypot(axisDistance(player.x,cx*16,(cx+1)*16),
    axisDistance(player.feet+.89,minY,maxY+1),axisDistance(player.z,cz*16,(cz+1)*16));
}

// Consume the production Creative predictor's pending body samples, including
// its closer blocked pose. A point can span four columns and two Y sections.
export function veilreachFlightLookahead(requests,player){
  const candidates=new Map();
  for(const {point} of requests){
    for(const body of physicalBodyRegions({x:point.x,feet:point.y,z:point.z})??[]){
      if(body.kind!=='upper')continue;
      const section=body.section+1;
      candidates.set(body.key,{cx:body.cx,cz:body.cz,section,
        distance:distanceToOwner(player,body.cx,body.cz,section)});
    }
  }
  return new Map([...candidates].sort((a,b)=>a[1].distance-b[1].distance||
    a[0].localeCompare(b[0])).slice(0,maxLookaheadOwners));
}

export function planVeilreachFlightStream(world,player,desired,bodyKeys,lookahead,chunks){
  const selected=new Map();
  const compatibilityGround=c=>c.section===0&&player.feet<=52&&
    Math.max(Math.abs(c.cx-Math.floor(player.x/16)),Math.abs(c.cz-Math.floor(player.z/16)))<=1;
  let occupiedOwners=0;
  function insert(owner){
    const key=meshKey(owner);
    if(selected.has(key)||selected.size>=maxOwners)return false;
    const occupied=owner.section>0&&Boolean(owner.occupied??upperOccupancy(world,key));
    if(occupied&&occupiedOwners>=UPPER_GPU_OWNERS)return false;
    selected.set(key,owner);
    occupiedOwners+=Number(occupied);
    return true;
  }
  for(const owner of desired)if(bodyKeys.has(meshKey(owner))||compatibilityGround(owner))insert(owner);
  if(lookahead)for(const owner of lookahead.values())insert(owner);

  // Only keep nearby, committed upper geometry outside the new base window.
  // This prevents lateral and diagonal boundary oscillation from refilling
  // the queue on each pass. Explicit lookahead always outranks retention.
  const baseKeys=new Set(desired.map(meshKey));
  const retained=[];
  for(const [key,chunk] of chunks){
    if(chunk.section<=0||!chunk.count||baseKeys.has(key))continue;
    const distance=distanceToOwner(player,chunk.x,chunk.z,chunk.section);
    if(distance<=18)retained.push({cx:chunk.x,cz:chunk.z,section:chunk.section,occupied:true,distance});
  }
  retained.sort((a,b)=>a.distance-b.distance||meshKey(a).localeCompare(meshKey(b)));
  let kept=0;
  for(const owner of retained){
    if(insert(owner))kept++;
    if(kept>=maxRetainedOwners)break;
  }
  for(const owner of desired)insert(owner);
  return [...selected.values()];
}

// Keep outgoing buffers resident until replacement geometry uploads. Select
// only the losses required to fit steady-state limits, preferring owners that
// already have a visual substitute. Admission still validates staging bytes.
export function planVeilreachRetirement(chunks,wanted,player,incoming,hasVisual){
  const upper=upperGpuStats(chunks);
  const incomingUpper=incoming.section>0?incoming.bytes:0;
  let total=chunks.size+1,owners=upper.owners+Number(incomingUpper>0),bytes=upper.bytes+incomingUpper;
  const fits=()=>total<=maxOwners&&owners<=UPPER_GPU_OWNERS&&bytes<=UPPER_RESIDENT_BYTES;
  if(fits())return [];
  const outgoing=[];
  for(const [key,owner] of chunks){
    if(wanted.has(key))continue;
    const upperBytes=owner.section>0?(owner.count+owner.waterCount)*36:0;
    outgoing.push({key,upperBytes,safe:!upperBytes||hasVisual(key),
      distance:distanceToOwner(player,owner.x,owner.z,owner.section)});
  }
  outgoing.sort((a,b)=>Number(b.safe)-Number(a.safe)||b.distance-a.distance||a.key.localeCompare(b.key));
  const retiring=[];
  for(const candidate of outgoing){
    if(!candidate.upperBytes&&(owners>UPPER_GPU_OWNERS||bytes>UPPER_RESIDENT_BYTES)&&total<=maxOwners)continue;
    retiring.push(candidate.key);
    total--;
    owners-=Number(candidate.upperBytes>0);
    bytes-=candidate.upperBytes;
    if(fits())return retiring;
  }
  throw Error('Veilreach replacement cannot fit existing GPU residency budgets');
}
