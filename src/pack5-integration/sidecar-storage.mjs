/**
 * Separate, checksummed Pack 5 builder storage. NEVER writes schema-1 world
 * keys or silently overwrites damaged source data. This sidecar is not a world
 * save, not a numeric ID registry, and not a migration of old player edits.
 */
import {PACK5_BUILDER_SIDECAR,PACK5_BUILDER_MAX_INSTANCES} from './construction-layer.mjs';
import {saveFingerprint} from '../persistence.mjs';
export const PACK5_MAX_SIDECAR_BYTES=2*1024*1024;
const baseKey=seed=>'mythwrought.pack5.builder.seed.'+seed;
export function pack5SidecarKey(seed){
  if(!Number.isSafeInteger(seed))throw Error('Invalid Pack 5 seed');
  return baseKey(seed);
}
function parseRaw(raw,seed){
  if(typeof raw!=='string'||raw.length>PACK5_MAX_SIDECAR_BYTES)throw Error('Damaged or oversized Pack 5 sidecar');
  const data=JSON.parse(raw);
  if(!data||data.format!==PACK5_BUILDER_SIDECAR||data.seed!==seed||data.schema!==undefined||
      !Array.isArray(data.entries)||data.entries.length>PACK5_BUILDER_MAX_INSTANCES)
    throw Error('Invalid Pack 5 sidecar envelope');
  return data;
}
function readJournal(raw,seed){
  const journal=JSON.parse(raw);
  if(!journal||journal.version!==1||journal.seed!==seed||typeof journal.raw!=='string'||
      journal.checksum!==saveFingerprint(journal.raw))throw Error('Pack 5 sidecar checksum mismatch');
  parseRaw(journal.raw,seed);
  return journal.raw;
}
export function loadPack5SidecarSafe(storage,layer){
  if(!storage||typeof storage.getItem!=='function'||!layer||!Number.isSafeInteger(layer.seed))
    throw Error('Invalid Pack 5 sidecar loader');
  const key=pack5SidecarKey(layer.seed);
  const primary=storage.getItem(key),journal=storage.getItem(key+'.journal'),
    backup=storage.getItem(key+'.backup');
  if(primary===null&&journal===null&&backup===null)return {source:'new',recovered:false,count:layer.count()};
  const errors=[];
  const entries=[];
  if(journal!==null){try{entries.push({source:'journal',raw:readJournal(journal,layer.seed)});}catch(e){errors.push(String(e));}}
  if(primary!==null){try{parseRaw(primary,layer.seed);entries.push({source:'primary',raw:primary});}catch(e){errors.push(String(e));}}
  if(backup!==null){try{parseRaw(backup,layer.seed);entries.push({source:'backup',raw:backup});}catch(e){errors.push(String(e));}}
  for(const entry of entries){
    try{
      layer.restore(parseRaw(entry.raw,layer.seed));
      return {source:entry.source,recovered:entry.source!=='primary'||(journal!==null&&entry.raw!==primary),
        count:layer.count()};
    }catch(e){errors.push(String(e));}
  }
  throw Error('Stored Pack 5 construction is damaged or unsupported; no saved bytes changed: '+errors.join('; ').slice(0,200));
}
/**
 * Explicit sidecar import. Does not modify schema-1 saves or another pack.
 * Input is validated against the physical fixture before touching storage.
 */
export function importPack5SidecarSafe(storage,layer,raw,{confirmReplace=false,playerBox=null}={}){
  if(confirmReplace!==true)throw Error('Explicit Pack 5 import confirmation required');
  if(!layer||!Number.isSafeInteger(layer.seed))throw Error('Invalid Pack 5 import layer');
  const incoming=parseRaw(raw,layer.seed);
  const previous=layer.snapshot();
  try{
    layer.restore(incoming);
    if(playerBox!==null&&layer.collidesPack5(playerBox))
      throw Error('Imported Pack 5 layout overlaps the player');
    const result=savePack5SidecarSafe(storage,layer);
    return {...result,imported:true};
  }catch(error){
    if(error.rollbackVerified!==false)layer.restore(previous);
    throw error;
  }
}
export function savePack5SidecarSafe(storage,layer){
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||
     !layer||!Number.isSafeInteger(layer.seed))throw Error('Invalid Pack 5 sidecar saver');
  const key=pack5SidecarKey(layer.seed),raw=JSON.stringify(layer.snapshot());
  parseRaw(raw,layer.seed);
  const journalKey=key+'.journal',backupKey=key+'.backup',
    old=storage.getItem(key),previousJournal=storage.getItem(journalKey),
    previousBackup=storage.getItem(backupKey);
  if(old!==null)parseRaw(old,layer.seed);
  if(previousJournal!==null){
    const pending=readJournal(previousJournal,layer.seed);
    if(pending!==old&&pending!==raw)throw Error('Unreconciled Pack 5 sidecar journal: export before replacing');
  }
  const before=new Map([[key,old],[journalKey,previousJournal],[backupKey,previousBackup]]);
  const touched=[];
  function write(item,value){
    touched.push(item);
    storage.setItem(item,value);
    if(storage.getItem(item)!==value)throw Error('Pack 5 storage readback failed');
  }
  try{
    if(old!==null&&old!==raw)write(backupKey,old);
    const record=JSON.stringify({version:1,seed:layer.seed,checksum:saveFingerprint(raw),raw});
    write(journalKey,record);
    write(key,raw);
    return {ok:true,seed:layer.seed,count:layer.count(),bytes:raw.length};
  }catch(cause){
    // Without compensation, a successful journal followed by a failed primary
    // silently reappears after reload despite the game reporting a rollback.
    let rollbackVerified=true;
    for(const item of [...new Set(touched)].reverse()){
      try{
        const value=before.get(item);
        if(value===null){
          if(typeof storage.removeItem!=='function')throw Error('No removal support');
          storage.removeItem(item);
        }else storage.setItem(item,value);
        if(storage.getItem(item)!==value)throw Error('Rollback readback mismatch');
      }catch(_){rollbackVerified=false;}
    }
    const error=new Error(rollbackVerified?
      'Pack 5 save failed; previous sidecar and journal verified intact':
      'Pack 5 save interrupted; journal recovery uncertain. Export current session.');
    error.rollbackVerified=rollbackVerified;
    error.cause=cause;
    throw error;
  }
}
