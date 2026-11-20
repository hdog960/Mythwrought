// MYTHWROUGHT SKY S1 — deterministic 24-minute world clock.
// Pure time calculations, and a strictly separate per-seed localStorage sidecar.
// Never touch original schema-1 world saves, journals or builder sidecars.
export const SKY_DAY_MS=24*60*1000;
export const SKY_DAY_TARGET_MS=SKY_DAY_MS/2; // local in-world noon, 12:00.
export const SKY_NIGHT_TARGET_MS=0;          // local in-world midnight, 00:00.
export const SKY_CLOCK_KEY_PREFIX='mythwrought-sky-s1-clock-';

function finiteTime(n,name){
  if(!Number.isFinite(n)||n<0||!Number.isSafeInteger(Math.floor(n)))
    throw Error('Invalid sky clock '+name);
  return n;
}
export function skyClockKey(seed){
  if(!Number.isSafeInteger(seed))throw Error('Invalid world seed for sky clock');
  return SKY_CLOCK_KEY_PREFIX+seed;
}
export function normalizeSkyPhase(ms){
  if(!Number.isFinite(ms))throw Error('Invalid sky phase');
  return ((ms%SKY_DAY_MS)+SKY_DAY_MS)%SKY_DAY_MS;
}
export function phaseAfterMs(phaseMs,elapsedMs){
  finiteTime(elapsedMs,'elapsed time');
  // Modulo first to avoid loss of precision on very long-running sessions.
  return normalizeSkyPhase(normalizeSkyPhase(phaseMs)+(elapsedMs%SKY_DAY_MS));
}
export function formatSkyTime(phaseMs){
  const minutes=Math.floor(normalizeSkyPhase(phaseMs)/SKY_DAY_MS*1440);
  return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
}
export function sampleSkyClock(clock,monoNowMs){
  finiteTime(monoNowMs,'monotonic timestamp');
  // Never reverse time if a synthetic timer or browser clock moves backward.
  return phaseAfterMs(clock.anchorPhaseMs,Math.max(0,monoNowMs-clock.monoAnchorMs));
}
function validRecord(record,seed){
  return record?.version===1&&record.seed===seed&&
    Number.isSafeInteger(record.wallAnchorMs)&&record.wallAnchorMs>=0&&
    Number.isFinite(record.anchorPhaseMs)&&record.anchorPhaseMs>=0&&
    record.anchorPhaseMs<SKY_DAY_MS&&
    Object.keys(record).length===4;
}
function persistedRecord(seed,anchorPhaseMs,wallAnchorMs){
  return {version:1,seed,wallAnchorMs:Math.floor(wallAnchorMs),
    anchorPhaseMs:normalizeSkyPhase(anchorPhaseMs)};
}
function storageCommit(storage,key,record){
  const raw=JSON.stringify(record);
  storage.setItem(key,raw);
  if(storage.getItem(key)!==raw)throw Error('Sky clock sidecar readback mismatch');
}
export function loadSkyClock({seed,storage,wallNowMs,monoNowMs,allowWrites=true}){
  const key=skyClockKey(seed);
  finiteTime(wallNowMs,'wall timestamp');
  finiteTime(monoNowMs,'monotonic timestamp');
  const fresh={seed,anchorPhaseMs:SKY_DAY_TARGET_MS,monoAnchorMs:monoNowMs,
    persistence:'session-only',source:'default',warning:'',key};
  if(!allowWrites)return {...fresh,persistence:'protected',
    warning:'Protected world: sky clock is session-only; no storage writes'};
  let raw;
  try{raw=storage.getItem(key);}
  catch(_){return {...fresh,warning:'Sky clock storage unavailable; session-only'};}
  if(raw!==null){
    try{
      const parsed=JSON.parse(raw);
      if(!validRecord(parsed,seed))throw Error('Malformed sky clock sidecar');
      return {...fresh,anchorPhaseMs:phaseAfterMs(parsed.anchorPhaseMs,
        Math.max(0,wallNowMs-parsed.wallAnchorMs)),source:'loaded',persistence:'saved'};
    }catch(_){return {...fresh,persistence:'protected',
      warning:'Invalid sky clock sidecar preserved unchanged; session-only'};}
  }
  try{
    storageCommit(storage,key,persistedRecord(seed,SKY_DAY_TARGET_MS,wallNowMs));
    return {...fresh,persistence:'saved',source:'new'};
  }catch(_){return {...fresh,warning:'Sky clock sidecar could not be saved; session-only'};}
}
export function selectSkyClockTime(clock,targetPhaseMs,{storage,monoNowMs,wallNowMs,allowWrites=true}){
  if(targetPhaseMs!==SKY_DAY_TARGET_MS&&targetPhaseMs!==SKY_NIGHT_TARGET_MS)
    throw Error('Unsupported sky time selection');
  finiteTime(monoNowMs,'monotonic timestamp');
  finiteTime(wallNowMs,'wall timestamp');
  const updated={...clock,anchorPhaseMs:targetPhaseMs,monoAnchorMs:monoNowMs,
    source:'manual'};
  if(!allowWrites||clock.persistence!=='saved')
    return {...updated,persistence:clock.persistence==='protected'||!allowWrites?'protected':'session-only'};
  try{
    storageCommit(storage,clock.key,persistedRecord(clock.seed,targetPhaseMs,wallNowMs));
    return {...updated,persistence:'saved',warning:''};
  }catch(_){return {...updated,persistence:'session-only',
    warning:'Sky clock selection is active but could not be saved'};}
}
