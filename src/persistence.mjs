// MYTHWROUGHT v0.09 — recoverable, backwards-compatible edit-delta persistence.
// The original schema-1 JSON remains at the unchanged v0.02 per-seed key.
// A verified sidecar journal and a previous-good backup protect those bytes.
// This is still prototype localStorage, NOT the future IndexedDB save system.
import {VoxelWorld} from './voxel.mjs';
import {worldSlotKey,LEGACY_WORLD_KEY,DEFAULT_WORLD_SEED,SELECTED_SEED_KEY} from './seeds.mjs';

export const SAVE_JOURNAL_SUFFIX='-integrity-v009';
export const SAVE_BACKUP_SUFFIX='-backup-v009';
export const SAVE_DAMAGED_SUFFIX='-damaged-v009';
export const MAX_IMPORT_BYTES=20*1024*1024;

export function saveFingerprint(raw){
  if(typeof raw!=='string')throw Error('Invalid save bytes');
  let h=2166136261;
  for(let i=0;i<raw.length;i++)h=Math.imul(h^raw.charCodeAt(i),16777619);
  return (h>>>0).toString(16).padStart(8,'0');
}
export function parseWorldData(raw,seed){
  if(typeof raw!=='string'||raw.length>MAX_IMPORT_BYTES)throw Error('Invalid or oversized world data');
  const parsed=JSON.parse(raw);
  if(!parsed||!Array.isArray(parsed.edits))throw Error('Missing voxel edit deltas');
  const seen=new Set();
  for(const edit of parsed.edits){
    if(!Array.isArray(edit)||edit.length!==4)throw Error('Malformed voxel edit');
    const key=edit.slice(0,3).join(',');
    if(seen.has(key))throw Error('Duplicate voxel edit coordinates');
    seen.add(key);
  }
  const world=VoxelWorld.restore(parsed);
  if(seed!==undefined&&world.seed!==seed)throw Error('World seed mismatch; kept existing save');
  return world;
}
function readCandidate(raw,seed){
  if(raw===null)return null;
  try{return {world:parseWorldData(raw,seed),raw};}catch(error){return {error:String(error)};}
}
function readJournal(raw,seed){
  if(raw===null)return null;
  try{
    const entry=JSON.parse(raw);
    if(!entry||entry.version!==1||entry.seed!==seed||typeof entry.raw!=='string'||
       entry.checksum!==saveFingerprint(entry.raw))throw Error('Journal checksum mismatch');
    const world=parseWorldData(entry.raw,seed);
    return {world,raw:entry.raw};
  }catch(error){return {error:String(error)};}
}
export function loadWorldSafe(storage,seed){
  const key=worldSlotKey(seed);
  const primaryRaw=storage.getItem(key);
  const journalRaw=storage.getItem(key+SAVE_JOURNAL_SUFFIX);
  const backupRaw=storage.getItem(key+SAVE_BACKUP_SUFFIX);
  const primary=readCandidate(primaryRaw,seed);
  const journal=readJournal(journalRaw,seed);
  // The verified write-ahead journal may be newer than a still-valid primary
  // when a quota/crash interrupts the final canonical write. Never silently
  // discard those edits: expose recovery without mutating either record.
  if(primary?.world){
    if(journal?.world&&journal.raw!==primary.raw)
      return {world:journal.world,source:'journal',recovered:true,
        warning:'Verified newer journal differs from primary; export a backup and SAVE to reconcile'};
    return {world:primary.world,source:'primary',recovered:false};
  }
  if(journal?.world)return {world:journal.world,source:'journal',recovered:true,
    warning:'Recovered from verified edit journal; export a backup'};
  const backup=readCandidate(backupRaw,seed);
  if(backup?.world)return {world:backup.world,source:'backup',recovered:true,
    warning:'Recovered previous good world backup; export and SAVE to repair'};
  if(primaryRaw!==null||journalRaw!==null||backupRaw!==null)
    throw Error('Saved world data is damaged. Existing data was NOT overwritten. Import a verified backup or choose another world.');
  if(seed===DEFAULT_WORLD_SEED){
    const legacy=readCandidate(storage.getItem(LEGACY_WORLD_KEY),seed);
    if(legacy?.world)return {world:legacy.world,source:'legacy',recovered:false};
    if(legacy?.error)throw Error('Legacy world data is damaged. Old data was NOT overwritten.');
  }
  return {world:new VoxelWorld(seed),source:'new',recovered:false};
}
export function saveWorldSafe(storage,world,{select=true,allowReplaceCorrupt=false}={}){
  let key,raw,oldPrimary;
  try{
    key=worldSlotKey(world.seed);
    raw=JSON.stringify(world.save());
    parseWorldData(raw,world.seed);
    oldPrimary=storage.getItem(key);
    if(oldPrimary!==null&&oldPrimary!==raw){
      // If the old key is damaged, save the exact damaged bytes before any
      // repair; otherwise preserve the last verified canonical world.
      let preserved=oldPrimary,backupKey=key+SAVE_BACKUP_SUFFIX;
      try{parseWorldData(oldPrimary,world.seed);}
      catch(_){
        let recovered={recovered:false};
        try{recovered=loadWorldSafe(storage,world.seed);}
        catch(error){if(!allowReplaceCorrupt)throw error;}
        preserved=oldPrimary;
        backupKey=key+SAVE_DAMAGED_SUFFIX;
        // Explicit user-approved import may replace damaged bytes only after
        // writing and verifying a separate copy of those original bytes.
        if(!recovered.recovered&&!allowReplaceCorrupt)throw Error('Damaged save has no valid recovery');
      }
      // A damaged original must not overwrite an earlier damaged snapshot on
      // repeated recovery attempts; keep the first exact evidence intact.
      if(backupKey===key+SAVE_DAMAGED_SUFFIX){
        const existing=storage.getItem(backupKey);
        if(existing!==null&&existing!==preserved)throw Error('Prior damaged bytes already preserved; export before replacing');
      }
      storage.setItem(backupKey,preserved);
      if(storage.getItem(backupKey)!==preserved)throw Error('Backup could not be verified');
    }
    const record=JSON.stringify({version:1,seed:world.seed,checksum:saveFingerprint(raw),raw});
    storage.setItem(key+SAVE_JOURNAL_SUFFIX,record);
    if(storage.getItem(key+SAVE_JOURNAL_SUFFIX)!==record)throw Error('Save journal could not be verified');
    storage.setItem(key,raw);
    if(storage.getItem(key)!==raw)throw Error('Primary world write could not be verified');
    let warning='';
    if(select){
      try{
        storage.setItem(SELECTED_SEED_KEY,String(world.seed));
        if(storage.getItem(SELECTED_SEED_KEY)!==String(world.seed))throw Error('Selected seed not recorded');
      }catch(_){warning='World saved, but last-selected world preference did not persist';}
    }
    return {ok:true,warning};
  }catch(error){
    return {ok:false,reason:'World storage verification failed; existing save and backup were not deleted',
      detail:String(error)};
  }
}
export function importWorldData(text){
  if(typeof text!=='string'||text.length>MAX_IMPORT_BYTES)throw Error('Import too large or unreadable');
  return parseWorldData(text);
}
