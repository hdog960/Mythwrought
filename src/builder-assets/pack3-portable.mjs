// Standalone, user-directed Pack 3 backup/restore contract for the coordinated
// five-pack integrator. Never bundle new voxel IDs into schema-1 JSON.
import {createPack3RuntimeStage} from './pack3-runtime.mjs';
import {pack3OverlayKey} from './pack3-live.mjs';

export const PACK3_PORTABLE_FORMAT='mythwrought.pack3-portable.v1';
export const PACK3_PORTABLE_MAX_BYTES=450000;
export const PACK3_PRE_IMPORT_SUFFIX=':pre-import';

function currentRaw(storage,key){
  if(!storage||typeof storage.getItem!=='function'||
     typeof storage.setItem!=='function'||typeof storage.removeItem!=='function')
    throw new TypeError('Invalid portable storage');
  return storage.getItem(key);
}
function bridgeFor(bridge,world,storage){
  if(!bridge||!world||!Number.isSafeInteger(world.seed)||!bridge.runtime||
    bridge.key!==pack3OverlayKey(world.seed))
    throw new TypeError('Pack 3 bridge or seed mismatch');
  const existing=currentRaw(storage,bridge.key);
  // Reject an external tab's writes even when they are syntactically valid.
  if(existing!==bridge.lastSeenRaw)
    throw new Error('Pack 3 physical construction changed outside this tab; reload first');
  return existing;
}
export function exportPack3Portable(bridge,world,storage){
  const existing=bridgeFor(bridge,world,storage);
  if(bridge.blocked)throw Error('Protected Pack 3 data: import a verified backup first');
  const snapshot=bridge.runtime.serialize();
  if((existing===null&&bridge.runtime.size()>0)||
     (existing!==null&&existing!==snapshot))
    throw Error('Physical construction is not identical to the verified storage record');
  const result=JSON.stringify({
    format:PACK3_PORTABLE_FORMAT,schema:1,seed:world.seed,
    overlay:JSON.parse(snapshot)
  });
  if(result.length>PACK3_PORTABLE_MAX_BYTES)throw RangeError('Pack 3 backup exceeds size limit');
  return result;
}
// Pure validation: checking an imported file must not mutate storage, the
// player's in-memory construction, or the canonical schema-1 VoxelWorld.
export function inspectPack3Portable(raw,world){
  if(typeof raw!=='string'||raw.length===0||raw.length>PACK3_PORTABLE_MAX_BYTES)
    throw new TypeError('Invalid or oversized Pack 3 backup');
  if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
     !(world.edits instanceof Map))
    throw new TypeError('Invalid destination world');
  let file;
  try{file=JSON.parse(raw);}catch{throw new TypeError('Malformed Pack 3 backup');}
  if(!file||file.format!==PACK3_PORTABLE_FORMAT||file.schema!==1||
     file.seed!==world.seed||!file.overlay||typeof file.overlay!=='object')
    throw new Error('Pack 3 backup format, schema or world seed mismatch');
  const overlay=JSON.stringify(file.overlay);
  const prospective=createPack3RuntimeStage(world,{worldId:'seed-'+world.seed});
  // Full geometry, symbol, height, overlap, orientation and world-edit checks.
  prospective.restore(overlay);
  return Object.freeze({seed:world.seed,count:prospective.size(),overlay});
}
export function restorePack3Portable(raw,bridge,world,storage,{approved=false}={}){
  if(approved!==true)throw Error('Explicit user approval is required to restore Pack 3 blocks');
  const previous=bridgeFor(bridge,world,storage);
  const examined=inspectPack3Portable(raw,world);
  if(previous===examined.overlay)
    return Object.freeze({seed:world.seed,count:examined.count,requiresReload:false});
  const key=bridge.key,backupKey=key+PACK3_PRE_IMPORT_SUFFIX;
  let startedWrite=false;
  try{
    // Preserve the current exact bytes (even if corrupt) before replacing them.
    // This never destroys the existing :previous-good record.
    if(previous!==null){
      storage.setItem(backupKey,previous);
      if(storage.getItem(backupKey)!==previous)
        throw Error('Pre-import backup verification failed');
    }
    if(storage.getItem(key)!==previous)
      throw Error('Another tab modified the Pack 3 save during import');
    startedWrite=true;
    storage.setItem(key,examined.overlay);
    if(storage.getItem(key)!==examined.overlay)
      throw Error('Pack 3 restored save failed readback');
    // Caller must reload the game immediately; an old in-memory overlay
    // must never be represented as the newly restored physical construction.
    return Object.freeze({seed:world.seed,count:examined.count,requiresReload:true});
  }catch(error){
    if(startedWrite){
      try{
        if(previous===null)storage.removeItem(key);
        else storage.setItem(key,previous);
        if(storage.getItem(key)!==previous)
          throw Error('Pack 3 import rollback could not be verified');
      }catch(rollback){
        throw Error('Pack 3 restore storage uncertain: '+String(rollback)+
          '; leave this world untouched and export the saved record');
      }
    }
    throw error;
  }
}
