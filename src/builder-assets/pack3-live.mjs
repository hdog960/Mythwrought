// Pack 3 live-game construction overlay. The canonical VoxelWorld schema-1
// format is NEVER extended: shaped IDs 109–125 are held in a verified, seed-bound
// independent sidecar. No terrain or legacy block edits are synthesized.
import {createPack3RuntimeStage,PACK3_RUNTIME_LIMIT} from './pack3-runtime.mjs';
import {resolvePack3BuilderAsset,PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS} from './pack3.mjs';

export const PACK3_OVERLAY_STORAGE_PREFIX='mythwrought-pack3-construction-v1:';
export const PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX=':previous-good';
export const PACK3_MAX_ADDED_VERTICES_PER_CHUNK=12000;
const allowed=new Map(PACK3_BUILDER_IDS.map((id,i)=>[id,PACK3_BUILDER_SYMBOLS[i]]));
export function isPack3BlockId(id){return Number.isInteger(id)&&allowed.has(id);}
export function pack3SymbolForId(id){return allowed.get(id)??null;}
export function pack3OverlayKey(seed){
  if(!Number.isSafeInteger(seed))throw new TypeError('Invalid Pack 3 seed');
  return PACK3_OVERLAY_STORAGE_PREFIX+seed;
}
function playerBounds(player){
  if(!player||![player.x,player.feet,player.z].every(Number.isFinite))
    throw new TypeError('Invalid player for physical placement');
  return [player.x-.28,player.feet,player.z-.28,
    player.x+.28,player.feet+1.78,player.z+.28];
}
// One existing GPU buffer per (chunk,vertical-section), not a parallel draw
// pass or extra streaming budget. Fail before upload if the added geometry is
// too expensive. The legacy mesh remains byte-for-byte unchanged when empty.
export function combinePack3ChunkMesh(legacy,runtime,cx,cz,section=0){
  if(!(legacy instanceof Float32Array)||legacy.length%9||!runtime)
    throw new TypeError('Invalid Pack 3 meshing inputs');
  if(!runtime.size())return legacy;
  const extra=runtime.chunkMesh(cx,cz,section,{maxVertices:PACK3_MAX_ADDED_VERTICES_PER_CHUNK});
  if(!extra.length)return legacy;
  if(extra.length%9||extra.length/9>PACK3_MAX_ADDED_VERTICES_PER_CHUNK)
    throw new RangeError('Pack 3 GPU chunk vertex budget');
  const combined=new Float32Array(legacy.length+extra.length);
  combined.set(legacy);combined.set(extra,legacy.length);
  return combined;
}
// Only this live bridge performs storage writes, with readback verification,
// rollback and a hard read-only stop on ambiguous storage failure.
export function createPack3LiveBridge(world,storage,{worldId='seed-'+world?.seed}={}){
  if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
      !(world.edits instanceof Map)||!storage||
      typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||
      typeof storage.removeItem!=='function')
    throw new TypeError('Invalid Pack 3 live bridge inputs');
  const runtime=createPack3RuntimeStage(world,{worldId,maxCells:PACK3_RUNTIME_LIMIT});
  const key=pack3OverlayKey(world.seed);
  const backupKey=key+PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX;
  let blocked=null;
  try{
    const raw=storage.getItem(key);
    if(raw!==null && raw!=='')runtime.restore(raw);
    else if(raw==='')throw new TypeError('Empty, unverified Pack 3 overlay');
  }catch(err){
    blocked='Pack 3 saved overlay protected: '+String(err?.message||err);
  }
  // Other engine APIs can locate actual partial shapes without changing
  // world.get(), world.set(), world.save() or world.restore().
  world.pack3Runtime=runtime;
  function mutate({mode,cell,id=null,orientation=0,player=null,rebuild}){
    if(blocked)return {ok:false,reason:blocked};
    if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger)||
       !['mine','place'].includes(mode)||typeof rebuild!=='function')
      return {ok:false,reason:'Invalid Pack 3 construction action'};
    if(mode==='place'&&!isPack3BlockId(id))
      return {ok:false,reason:'Unknown physical building block'};
    let oldRaw,prior=null,changed=false;
    try{
      oldRaw=storage.getItem(key);
      // Never clobber a newer tab's physical construction save. This check
      // also rejects deletion of a previously verified primary record.
      if(oldRaw!==null&&oldRaw!==runtime.serialize())
        throw Error('Pack 3 construction changed outside this session; reload before editing');
      if(oldRaw===null&&runtime.size()>0)
        throw Error('Pack 3 construction save disappeared; reload before editing');
      // Preserve one confirmed previous-good copy in its own scoped key.
      // Failure to secure/read it back is a failed edit, not silent data loss.
      if(oldRaw!==null){
        storage.setItem(backupKey,oldRaw);
        if(storage.getItem(backupKey)!==oldRaw)
          throw Error('Pack 3 previous-good backup readback mismatch');
      }
      if(mode==='place'){
        runtime.placeMany([{at:cell,asset:pack3SymbolForId(id),orientation}],
          {playerBody:playerBounds(player)});
      }else{
        prior=runtime.get(cell);
        if(!prior)return {ok:false,reason:'No shaped block at target'};
        runtime.remove(cell);
      }
      changed=true;
      const next=runtime.serialize();
      storage.setItem(key,next);
      if(storage.getItem(key)!==next)throw Error('Physical block save readback mismatch');
      rebuild(cell[0],cell[2],cell[1]);
      return {ok:true,mode,cell:[...cell],previous:prior?.id??0,
        next:mode==='place'?id:0,block:mode==='place'?id:prior.id};
    }catch(error){
      if(changed){
        try{
          if(mode==='place')runtime.remove(cell);
          else runtime.placeMany([{at:prior.at,asset:prior.asset,orientation:prior.yaw}]);
          if(oldRaw===null)storage.removeItem(key);
          else storage.setItem(key,oldRaw);
          if(storage.getItem(key)!==oldRaw)throw Error('Rollback readback mismatch');
        }catch(rollbackError){
          blocked='Pack 3 storage rollback not verified; editing disabled: '+String(rollbackError);
        }
      }
      return {ok:false,reason:blocked||'Physical block edit rolled back: '+String(error?.message||error)};
    }
  }
  return Object.freeze({
    runtime,key,backupKey,mutate,
    get blocked(){return blocked;},
    getAt:(x,y,z)=>runtime.get([x,y,z]),
    getId:(x,y,z)=>runtime.get([x,y,z])?.id??world.get(x,y,z),
    physicalShape:(x,y,z)=>runtime.readShape(x,y,z),
    raycast:(eye,direction,reach)=>runtime.target(eye,direction,reach)
  });
}
