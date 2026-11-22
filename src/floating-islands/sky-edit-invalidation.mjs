// Upper-world physical edit invalidation. Read-only; do not touch saves or GPU.
// A y=20 sky edit can change both sky bottom and original ground top faces.
import {skyIslandSectionForY,skyIslandMeshKey} from './sky-runtime-adapter.mjs';
const fail=s=>{throw new TypeError('Sky edit invalidation: '+s);};
const valid=n=>Number.isSafeInteger(n);
const chunkCoord=n=>Math.floor(n/16);
function neighboringChunks(x,z){
  const cx=chunkCoord(x),cz=chunkCoord(z);
  const sx=x-cx*16,sz=z-cz*16;
  const locations=[[cx,cz]];
  if(sx===0)locations.push([cx-1,cz]);
  if(sx===15)locations.push([cx+1,cz]);
  if(sz===0)locations.push([cx,cz-1]);
  if(sz===15)locations.push([cx,cz+1]);
  return locations;
}
export function planSkyIslandEditInvalidation({x,y,z,loadedSkyKeys,loadedGroundKeys}={}){
  if(![x,y,z].every(valid)||Math.abs(x)>1e7||Math.abs(z)>1e7||
     !(loadedSkyKeys instanceof Set)||!(loadedGroundKeys instanceof Set))
    fail('bounded integer edit and authoritative loaded-key sets required');
  // The sky source is only Y20..256. A ground edit on Y19 can change
  // the first upper section's bottom occlusion, even if no sky cell changed.
  if(y<19||y>256)return Object.freeze({skyKeys:Object.freeze([]),groundKeys:Object.freeze([])});
  const sections=new Set();
  for(const delta of [-1,0,1]){
    const index=skyIslandSectionForY(y+delta);
    if(index!==null)sections.add(index);
  }
  const locations=neighboringChunks(x,z),sky=[],ground=[];
  for(const section of [...sections].sort((a,b)=>a-b))
    for(const [cx,cz] of locations){
      const key=skyIslandMeshKey(cx,cz,section);
      if(loadedSkyKeys.has(key))sky.push(key);
    }
  if(y<=20)for(const [cx,cz] of locations){
    const key=cx+','+cz;
    if(loadedGroundKeys.has(key))ground.push(key);
  }
  return Object.freeze({skyKeys:Object.freeze(sky),groundKeys:Object.freeze(ground)});
}
