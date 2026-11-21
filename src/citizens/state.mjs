import {saveFingerprint} from '../persistence.mjs';
import {validPoint} from '../mobs/world-query.mjs';
import {createCitizen} from './entity.mjs';

const version=1;
const maxSize=4*1024*1024;
const validId = value => typeof value==='string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(value);

function keyFor({worldSeed,settlementId}) {
  if (!Number.isInteger(worldSeed) || worldSeed!==(worldSeed|0) || !validId(settlementId))
    throw RangeError('Invalid citizen save scope');
  return `mythwrought-citizens-v1:${worldSeed}:${settlementId}`;
}

function validateRows(rows,scope) {
  if (!Array.isArray(rows)) throw TypeError('Invalid citizen save rows');
  const ids=new Set();
  return rows.map(({citizen,position,health})=>{
    if (!citizen || citizen.worldSeed!==scope.worldSeed || citizen.settlementId!==scope.settlementId ||
        !validPoint(position) || !Number.isFinite(health) || health<0 || health>1000)
      throw RangeError('Invalid citizen save record');
    const checked=createCitizen(citizen);
    if (citizen.id!==checked.id || citizen.type!==checked.type || citizen.appearanceSeed!==checked.appearanceSeed ||
        (citizen.workplaceId!==null && !validId(citizen.workplaceId)) || ids.has(checked.id))
      throw RangeError('Invalid citizen identity or appearance');
    ids.add(checked.id);
    return {
      citizen:Object.freeze({...checked,workplaceId:citizen.workplaceId}),
      position:[...position], health,
    };
  }).sort((a,b)=>a.citizen.slot-b.citizen.slot);
}

function decode(bytes,scope) {
  if (typeof bytes!=='string' || bytes.length>maxSize) throw Error('Invalid citizen save bytes');
  const parsed=JSON.parse(bytes);
  if (parsed?.version!==version || typeof parsed.raw!=='string' ||
      parsed.checksum!==saveFingerprint(parsed.raw)) throw Error('Invalid citizen save integrity');
  const payload=JSON.parse(parsed.raw);
  if (payload.worldSeed!==scope.worldSeed || payload.settlementId!==scope.settlementId)
    throw Error('Mismatched citizen save scope');
  return validateRows(payload.citizens,scope);
}

function read(storage,scope,key) {
  const primary=storage.getItem(key);
  const previous=storage.getItem(key+':previous');
  if (primary===null && previous===null) return {source:'new',citizens:[],bytes:null};
  for (const [source,bytes] of [['primary',primary],['previous',previous]]) {
    if (bytes===null) continue;
    try { return {source,citizens:decode(bytes,scope),bytes}; }
    catch { /* Fall back to an independently verified generation. */ }
  }
  throw Error('Citizen sidecar is corrupt');
}

export function loadCitizenState(storage,scope) {
  const {source,citizens}=read(storage,scope,keyFor(scope));
  return {source,citizens};
}

export function saveCitizenState(storage,scope,rows) {
  const key=keyFor(scope);
  const old=read(storage,scope,key);
  const citizens=validateRows(rows,scope);
  const oldById=new Map(old.citizens.map(({citizen})=>[citizen.id,citizen]));
  for (const {citizen} of citizens) {
    const previous=oldById.get(citizen.id);
    if (previous && (previous.race!==citizen.race || previous.profession!==citizen.profession ||
        previous.appearanceSeed!==citizen.appearanceSeed))
      throw RangeError('Citizen race, profession and appearance are permanent');
  }
  const raw=JSON.stringify({worldSeed:scope.worldSeed,settlementId:scope.settlementId,citizens});
  const bytes=JSON.stringify({version,checksum:saveFingerprint(raw),raw});
  if (bytes.length>maxSize) throw RangeError('Citizen sidecar exceeds supported size');
  if (old.bytes===bytes) return {key,citizens};
  if (old.bytes!==null && old.source==='primary') {
    storage.setItem(key+':previous',old.bytes);
    if (storage.getItem(key+':previous')!==old.bytes) throw Error('Citizen backup failed verification');
  }
  storage.setItem(key,bytes);
  if (storage.getItem(key)!==bytes) throw Error('Citizen save failed verification');
  return {key,citizens};
}
