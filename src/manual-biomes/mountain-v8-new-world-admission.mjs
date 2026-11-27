import {usesMountainV8Terrain} from '../environment-ground.mjs';
// Candidate-only explicit V8 seed admission. Native browser APIs, no
// creation/upgrade/deletion of optional Vault/Mirror databases. The Web Lock
// serializes cooperating V8 callers only; legacy tabs do NOT honor it.
// Do not mount the public creation button until all relevant writers cooperate.
import {DEFAULT_WORLD_SEED,worldSeedFromText,worldSlotKey} from '../seeds.mjs';
import {saveFingerprint,saveWorldSafe} from '../persistence.mjs';
import {VAULT_DB,VAULT_STORE} from '../vault.mjs';
import {MIRROR_DB,MIRROR_STORE} from '../mirror.mjs';
import {M8_MOUNTAIN_GENERATOR,FourRegionWorld,fourRegionProfile} from './profile-world.mjs';
import {BIOME_PROFILE_SUFFIX,isUnclaimedWorldSeed,readFourRegionProfile} from './profile-storage.mjs';
import {openM2World,planM2WorldChoice,saveM2World,inspectM2WorldExport,exportM2World} from './m2-runtime-bridge.mjs';
export const V8_ADMISSION_LOCK='mythwrought-v8-new-world-admission-v1';
const checkSeed=seed=>{if(!Number.isSafeInteger(seed)||seed!==(seed|0)||seed===DEFAULT_WORLD_SEED)
  throw Error('V8 requires a non-default signed 32-bit unused seed');};
async function inventory(factory){
  if(typeof factory?.databases!=='function'||typeof factory.open!=='function')
    throw Error('Noncreating IndexedDB enumeration unavailable');
  const list=await factory.databases();
  if(!Array.isArray(list))throw Error('IndexedDB inventory unavailable');
  const selected=list.filter(x=>x.name===VAULT_DB||x.name===MIRROR_DB);
  if(selected.some(x=>x.version!==1)||new Set(selected.map(x=>x.name)).size!==selected.length)
    throw Error('Unexpected optional database schema');
  return selected.sort((a,b)=>a.name.localeCompare(b.name)).map(x=>x.name);
}
function openExisting(factory,name){
  return new Promise((resolve,reject)=>{
    let req,settled=false;
    const timer=setTimeout(()=>fail(Error('Existing IndexedDB open timed out')),5000);
    function fail(e){if(!settled){settled=true;clearTimeout(timer);reject(e);}}
    try{req=factory.open(name);}catch(e){fail(e);return;}
    req.onupgradeneeded=()=>{try{req.transaction.abort();}catch{}fail(Error('Optional database changed or absent; schema creation refused'));};
    req.onblocked=()=>fail(Error('Optional database is blocked'));
    req.onerror=()=>fail(Error('Optional database read open failed'));
    req.onsuccess=()=>{
      const db=req.result;
      if(settled){db.close();return;}
      if(db.version!==1){db.close();fail(Error('Unexpected optional database version'));return;}
      settled=true;clearTimeout(timer);resolve(db);
    };
  });
}
function scanExisting(db,storeName,seed){
  return new Promise((resolve,reject)=>{
    let tx,request,claimed=false,count=0,error=null;
    try{
      tx=db.transaction(storeName,'readonly');
      const store=tx.objectStore(storeName);
      if(store.keyPath!==(storeName===VAULT_STORE?'id':'seed'))
        throw Error('Optional database key schema mismatch');
      request=store.openCursor();
    }catch(e){reject(e);return;}
    tx.oncomplete=()=>resolve({claimed,records:count});
    tx.onabort=()=>reject(error??Error('Optional database read aborted'));
    tx.onerror=()=>{error??=Error('Optional database read failed');};
    request.onsuccess=()=>{
      try{
        const c=request.result;
        if(!c)return;
        if(++count>10000)throw Error('Optional database audit exceeds bounded record limit');
        const v=c.value;
        if(!v||!Number.isInteger(v.seed)||v.seed!==(v.seed|0))
          throw Error('Unknown seed ownership in optional database');
        if(v.seed===seed)claimed=true;
        // A mismatched raw seed is ambiguous ownership, even if metadata says
        // another seed. Check both current and previous mirror copies.
        const snapshots=storeName===VAULT_STORE?[v]:[v.current,v.previous];
        for(const s of snapshots){
          if(s===null)continue;
          if(!s||typeof s.raw!=='string'||s.raw.length>20*1024*1024)
            throw Error('Unreadable optional snapshot ownership');
          const parsed=JSON.parse(s.raw);
          const rawSeed=parsed?.kind==='mythwrought-four-biomes-export'?parsed.profile?.seed:parsed?.seed;
          if(rawSeed!==v.seed||s.checksum!==saveFingerprint(s.raw))
            throw Error('Ambiguous optional snapshot ownership');
        }
        c.continue();
      }catch(e){error=e;try{tx.abort();}catch{reject(e);}}
    };
  });
}
export async function inspectMountainV8OptionalSeed(seed,factory=globalThis.indexedDB){
  checkSeed(seed);
  const names=await inventory(factory),records={};
  for(const name of names){
    const db=await openExisting(factory,name);
    try{records[name]=await scanExisting(db,name===VAULT_DB?VAULT_STORE:MIRROR_STORE,seed);}
    finally{db.close();}
  }
  if(JSON.stringify(await inventory(factory))!==JSON.stringify(names))
    throw Error('Optional database inventory changed during inspection');
  return Object.freeze({claimed:Object.values(records).some(x=>x.claimed),records,
    absent:[VAULT_DB,MIRROR_DB].filter(x=>!names.includes(x)),crossStoreAtomic:false});
}
function assertLocalUnused(storage,seed){
  if(!isUnclaimedWorldSeed(storage,seed)||readFourRegionProfile(storage,seed))
    throw Error('Existing local world or sidecar claims this seed');
  // Fail closed on additional seed-bearing Mythwrought keys not yet known to
  // the legacy prefix inventory. Numeric boundaries avoid matching seed 12
  // against 123; false positives are acceptable for unused-seed admission.
  const token=new RegExp('(^|[^0-9])'+String(seed)+'($|[^0-9])');
  for(let i=0;i<storage.length;i++){
    const key=storage.key(i);
    if(typeof key!=='string')throw Error('Local storage inventory changed');
    if(key.toLowerCase().startsWith('mythwrought')&&token.test(key))
      throw Error('Additional local seed ownership: '+key);
  }
}
/** Explicit candidate API; returns the real profile-aware Pack2 world.
 * No public UI hook, no default switch, no legacy conversion. On interrupted
 * writes leave verified/partial evidence in place, never delete or overwrite.
 */
export async function createMountainV8CandidateWorld(seedText,{
  confirmed=false,generator=M8_MOUNTAIN_GENERATOR,storage=globalThis.localStorage,factory=globalThis.indexedDB,
  locks=globalThis.navigator?.locks
}={}){
  if(confirmed!==true)throw Error('Explicit NEW Mountain V8 confirmation required');
  if(!usesMountainV8Terrain(generator))throw Error('Invalid combined world generator');
  const seed=worldSeedFromText(seedText);checkSeed(seed);
  if(typeof locks?.request!=='function')throw Error('Web Locks unavailable; V8 admission refused');
  return locks.request(V8_ADMISSION_LOCK,{mode:'exclusive'},async lock=>{
    if(!lock||lock.name!==V8_ADMISSION_LOCK||lock.mode!=='exclusive')
      throw Error('V8 admission lock unavailable');
    assertLocalUnused(storage,seed);
    const evidence=await inspectMountainV8OptionalSeed(seed,factory);
    if(evidence.claimed)throw Error('Existing Vault/Mirror snapshot claims this seed');
    assertLocalUnused(storage,seed);
    const profile=fourRegionProfile(seed,generator);
    const raw=JSON.stringify(profile),record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
    const key=worldSlotKey(seed)+BIOME_PROFILE_SUFFIX;
    const world=new FourRegionWorld(seed,profile);
    // No await between final local audit and checked journal/primary writes.
    // This protects cooperating candidate callers, NOT uncoordinated old tabs.
    storage.setItem(key+'-journal',record);
    if(storage.getItem(key+'-journal')!==record||storage.getItem(key)!==null)
      throw Error('V8 profile journal conflict; preserve existing bytes');
    storage.setItem(key,record);
    if(storage.getItem(key)!==record||readFourRegionProfile(storage,seed)?.profile.generator!==generator)
      throw Error('V8 profile readback failed');
    const saved=saveWorldSafe(storage,world,{select:false});
    if(!saved.ok)throw Error('V8 initial save failed; profile reservation retained: '+saved.detail);
    const opened=openM2World(storage,planM2WorldChoice(String(seed)));
    if(opened.base.generationProfile.generator!==generator||
       JSON.stringify(opened.world.save())!==JSON.stringify(world.save()))
      throw Error('V8 initial profile reload mismatch');
    return Object.freeze({...opened,created:true,admissionEvidence:evidence,
      cooperatingLockOnly:true,publicActivationAuthorized:false});
  });
}

// Separate namespace for the real local candidate UI. Check old saves and optional
// databases before claiming, but subsequent old writers cannot reach these keys.
export async function createMountainV8IsolatedWorld(seedText,{confirmed=false,generator=M8_MOUNTAIN_GENERATOR,storage=globalThis.localStorage,factory=globalThis.indexedDB,locks=globalThis.navigator?.locks}={}){
 if(confirmed!==true)throw Error('Explicit NEW Mountain V8 confirmation required');
 const seed=worldSeedFromText(seedText);checkSeed(seed);
 assertLocalUnused(storage,seed);
 const old=await inspectMountainV8OptionalSeed(seed,factory);
 if(old.claimed)throw Error('Existing ordinary Vault/Mirror snapshot claims this seed');
 assertLocalUnused(storage,seed);
 const {mountainV8Storage,mountainV8DatabaseFactory}=await import('./mountain-v8-isolated-storage.mjs');
 return createMountainV8CandidateWorld(String(seed),{confirmed:true,generator,storage:mountainV8Storage(storage),factory:mountainV8DatabaseFactory(factory),locks});
}

// Verified portable profile import into the separate Mountain namespace.
// Existing ordinary and Mountain seeds, Vault/Mirror claims and all original
// bytes are preserved. Partial storage failure retains evidence; no deletion.
export async function importMountainV8IsolatedWorld(rawImport,{
 confirmed=false,storage=globalThis.localStorage,factory=globalThis.indexedDB,locks=globalThis.navigator?.locks
}={}){
 if(confirmed!==true)throw Error('Explicit Mountain V8 import confirmation required');
 const inspected=inspectM2WorldExport(rawImport);
 const generator=inspected.world.base?.generationProfile?.generator;
 if(!usesMountainV8Terrain(generator))
  throw Error('Only a verified Mountain V8 profile can enter the Mountain namespace');
 const seed=inspected.seed;checkSeed(seed);
 if(typeof locks?.request!=='function')throw Error('Web Locks unavailable; V8 import refused');
 const {mountainV8Storage,mountainV8DatabaseFactory}=await import('./mountain-v8-isolated-storage.mjs');
 const scope=mountainV8Storage(storage),db=mountainV8DatabaseFactory(factory);
 return locks.request(V8_ADMISSION_LOCK,{mode:'exclusive'},async lock=>{
  if(!lock||lock.name!==V8_ADMISSION_LOCK||lock.mode!=='exclusive')throw Error('V8 admission lock unavailable');
  assertLocalUnused(storage,seed);assertLocalUnused(scope,seed);
  for(const candidate of [factory,db])if((await inspectMountainV8OptionalSeed(seed,candidate)).claimed)
   throw Error('Existing Vault/Mirror snapshot claims import seed');
  assertLocalUnused(storage,seed);assertLocalUnused(scope,seed);
  const raw=JSON.stringify(inspected.world.base.generationProfile),record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
  const key=worldSlotKey(seed)+BIOME_PROFILE_SUFFIX;
  scope.setItem(key+'-journal',record);
  if(scope.getItem(key+'-journal')!==record||scope.getItem(key)!==null)throw Error('Mountain import profile journal conflict');
  scope.setItem(key,record);
  if(scope.getItem(key)!==record||readFourRegionProfile(scope,seed)?.profile.generator!==generator)
   throw Error('Mountain import profile readback failed');
  const saved=saveM2World(scope,inspected.world);
  if(!saved.ok)throw Error('Mountain import not verified; reservation retained: '+saved.reason);
  const reopened=openM2World(scope,planM2WorldChoice(String(seed)));
  if(exportM2World(reopened.world)!==exportM2World(inspected.world))
   throw Error('Mountain import exact profile/edits/Pack2 readback mismatch');
  return reopened;
 });
}
