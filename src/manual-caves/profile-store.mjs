// Roadmap #240 C4: isolated, versioned NEW cave-world profile sidecar.
// This module does NOT register in the released game's seed selector,
// write traditional schema-1/Pack2 slots, or mutate an existing profile.
// Journal-first writes, strict checksum and previous-good rollback protection.
import {worldSlotKey} from '../seeds.mjs';
import {VoxelWorld} from '../voxel.mjs';
import {saveFingerprint} from '../persistence.mjs';
import {checkNewCaveWorldAdmission,CAVE_PROFILE_KIND} from './cave-voxel-world.mjs';
import {createStagedCaveRuntime,restoreStagedCaveRuntime} from './opt-in-runtime.mjs';

export const CAVE_PROFILE_STORAGE_PREFIX='mythwrought-caves-v1-seed-';
export const CAVE_PROFILE_STORE_VERSION=1;
const JOURNAL='.journal',BACKUP='.backup';
const MAX_CAVE_PROFILE_BYTES=20*1024*1024;
const exactKeys=(obj,expected)=>Object.keys(obj).sort().join(',')===expected.slice().sort().join(',');
const isSeed=x=>Number.isSafeInteger(x)&&x===(x|0);
const checkStorage=(storage,write=false)=>{
  if(!storage||typeof storage.getItem!=='function'||
     (write&&(typeof storage.setItem!=='function'||typeof storage.removeItem!=='function')))
    throw Error('Cave profile requires explicit compatible storage');
};
export function caveProfileStorageKey(seed){
  if(!isSeed(seed))throw Error('Invalid cave seed');
  return CAVE_PROFILE_STORAGE_PREFIX+seed;
}
function sidecarPayload(runtime){
  if(runtime?.profile!==CAVE_PROFILE_KIND||runtime.registeredInHomeScreen!==false||
     !runtime.world||!isSeed(runtime.world.seed)||typeof runtime.world.save!=='function')
    throw Error('Not an isolated explicit cave runtime');
  return {kind:CAVE_PROFILE_KIND,version:CAVE_PROFILE_STORE_VERSION,
    seed:runtime.world.seed,world:runtime.world.save()};
}
function encodeProfile(runtime){
  const payload=sidecarPayload(runtime),raw=JSON.stringify(payload);
  if(raw.length>MAX_CAVE_PROFILE_BYTES)throw Error('Cave profile exceeds size cap');
  const record={version:1,seed:payload.seed,checksum:saveFingerprint(raw),raw};
  return JSON.stringify(record);
}
function decodeRecord(text,seed){
  if(typeof text!=='string'||text.length>MAX_CAVE_PROFILE_BYTES)throw Error('Invalid cave profile record');
  const record=JSON.parse(text);
  if(!record||Array.isArray(record)||!exactKeys(record,['version','seed','checksum','raw'])||
     record.version!==1||record.seed!==seed||typeof record.raw!=='string'||
     record.checksum!==saveFingerprint(record.raw))throw Error('Cave profile checksum or seed mismatch');
  const payload=JSON.parse(record.raw);
  if(!payload||Array.isArray(payload)||!exactKeys(payload,['kind','version','seed','world'])||
     payload.kind!==CAVE_PROFILE_KIND||payload.version!==CAVE_PROFILE_STORE_VERSION||
     payload.seed!==seed||payload.world?.seed!==seed||payload.world?.schema!==1)
    throw Error('Cave profile kind or payload mismatch');
  // Validate the canonical save envelope WITHOUT materializing five giant
  // cave meshes for every journal/backup inspection. Materialize exactly one
  // selected profile on load, not two or three per atomic save.
  VoxelWorld.restore(payload.world);
  return {payload,raw:record.raw,encoded:text};
}
function readExisting(storage,seed){
  const key=caveProfileStorageKey(seed),values=[key,key+JOURNAL,key+BACKUP]
    .map(k=>storage.getItem(k));
  const state=values.map((raw,i)=>{
    if(raw===null)return null;
    try{return decodeRecord(raw,seed)}catch(error){
      return {error:String(error),slot:i};
    }
  });
  return {key,primary:state[0],journal:state[1],backup:state[2],
    rawPrimary:values[0],rawJournal:values[1],rawBackup:values[2]};
}
function assertNoOldWorld(storage,seed){
  const admission=checkNewCaveWorldAdmission(storage,seed,{approved:true});
  if(!admission.ok)throw Error('Cannot use existing world for cave profile: '+admission.reason);
  // Ensure the original canonical v0.02 slot is never accidentally touched.
  if(storage.getItem(worldSlotKey(seed))!==null)
    throw Error('Canonical old world exists at this seed');
}
export function loadStagedCaveProfile(storage,seed,{approved=false}={}){
  checkStorage(storage);
  if(approved!==true)throw Error('Explicit cave profile selection required');
  assertNoOldWorld(storage,seed);
  const state=readExisting(storage,seed);
  if(state.journal?.error)throw Error('Damaged uncommitted cave journal preserved');
  // A valid pending journal is the latest attempted transaction; the older
  // committed primary may never shadow it and silently lose a player's edits.
  const selected=state.journal?.payload?['pending-journal',state.journal]:
    state.primary?.payload?['primary',state.primary]:
    state.backup?.payload?['previous-good-backup',state.backup]:null;
  if(selected){
    const [recovery,candidate]=selected;
    const runtime=restoreStagedCaveRuntime(candidate.payload.world,
      {approved:true,profile:CAVE_PROFILE_KIND});
    return Object.freeze({...candidate,runtime,
      recovered:recovery!=='primary',recovery:recovery==='primary'?null:recovery,
      needsCommit:recovery!=='primary'});
  }
  if(state.primary?.error||state.backup?.error)
    throw Error('Cave profile damaged; preserve primary and backup for manual recovery');
  throw Error('No registered cave profile for this seed');
}
function commitRecord(storage,seed,encoded,{creating=false}={}){
  checkStorage(storage,true);
  assertNoOldWorld(storage,seed);
  const s=readExisting(storage,seed);
  if(s.journal?.error)throw Error('Refusing to erase damaged cave journal');
  if(s.primary?.error)throw Error('Refusing to overwrite corrupt cave profile');
  if(s.backup?.error)throw Error('Refusing to replace corrupted cave backup');
  if(creating&&(s.rawPrimary!==null||s.rawJournal!==null||s.rawBackup!==null))
    throw Error('Cave profile already has stored data');
  if(!creating&&s.rawPrimary===null&&s.rawJournal===null)
    throw Error('Missing committed cave profile; use explicit creation');
  // No implicit overwrite of a previous pending transaction.
  if(s.journal?.payload&&s.journal.encoded!==s.rawPrimary&&s.journal.encoded!==encoded)
    throw Error('An uncommitted new cave save must be recovered first');
  decodeRecord(encoded,seed);
  // Journal-first, verify before setting primary. If a write throws, leave
  // the previous verified canonical record or recoverable pending journal.
  storage.setItem(s.key+JOURNAL,encoded);
  if(storage.getItem(s.key+JOURNAL)!==encoded)throw Error('Cave journal write did not persist');
  // Preserve previous-good *before* primary replacement. Never replace an
  // existing good backup with a damaged or unverified canonical record.
  if(s.primary?.payload&&s.rawPrimary!==encoded){
    storage.setItem(s.key+BACKUP,s.rawPrimary);
    if(storage.getItem(s.key+BACKUP)!==s.rawPrimary)
      throw Error('Cave backup write did not persist');
  }
  storage.setItem(s.key,encoded);
  if(storage.getItem(s.key)!==encoded)throw Error('Cave primary write did not persist');
  storage.removeItem(s.key+JOURNAL);
  if(storage.getItem(s.key+JOURNAL)!==null)
    throw Error('Cave journal cleanup incomplete; recover explicitly');
  return Object.freeze({ok:true,seed,key:s.key,profile:CAVE_PROFILE_KIND,
    schema:1,canonicalSlotUnchanged:true});
}
export function createStagedCaveProfile(storage,seed,{approved=false}={}){
  checkStorage(storage,true);
  if(approved!==true)throw Error('Explicit CREATE NEW CAVE WORLD approval required');
  assertNoOldWorld(storage,seed);
  const world=createStagedCaveRuntime(seed,storage,{approved:true});
  const encoded=encodeProfile(world);
  const saved=commitRecord(storage,seed,encoded,{creating:true});
  return Object.freeze({runtime:world,...saved});
}
export function saveStagedCaveProfile(storage,runtime,{approved=false}={}){
  checkStorage(storage,true);
  if(approved!==true)throw Error('Explicit cave-world save selection required');
  const encoded=encodeProfile(runtime);
  return commitRecord(storage,runtime.world.seed,encoded);
}
