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
export function savePack5SidecarSafe(storage,layer){
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||
     !layer||!Number.isSafeInteger(layer.seed))throw Error('Invalid Pack 5 sidecar saver');
  const key=pack5SidecarKey(layer.seed),raw=JSON.stringify(layer.snapshot());
  parseRaw(raw,layer.seed);
  const old=storage.getItem(key),priorJournal=storage.getItem(key+'.journal');
  if(old!==null)parseRaw(old,layer.seed); // fail closed on damaged original
  if(priorJournal!==null){
    const pending=readJournal(priorJournal,layer.seed);
    if(pending!==old&&pending!==raw)throw Error('Unreconciled Pack 5 sidecar journal: export before replacing');
  }
  if(old!==null&&old!==raw){
    storage.setItem(key+'.backup',old);
    if(storage.getItem(key+'.backup')!==old)throw Error('Pack 5 backup verification failed');
  }
  const record=JSON.stringify({version:1,seed:layer.seed,checksum:saveFingerprint(raw),raw});
  storage.setItem(key+'.journal',record);
  if(storage.getItem(key+'.journal')!==record)throw Error('Pack 5 journal verification failed');
  storage.setItem(key,raw);
  if(storage.getItem(key)!==raw)throw Error('Pack 5 sidecar verification failed');
  return {ok:true,seed:layer.seed,count:layer.count(),bytes:raw.length};
}
