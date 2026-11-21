// Read-only disaster-recovery export for the entire Mythwrought-owned
// localStorage namespace. Other GitHub Pages apps share the origin, so do NOT
// copy any keys outside the exact Mythwrought namespace. Never import/replay
// these archived bytes as a new generation or overwrite a saved seed.
import {saveFingerprint} from '../persistence.mjs';

export const GAME_ARCHIVE_FORMAT='mythwrought-storage-archive-v1';
const gameKey=key=>/^mythwrought(?:[-.]|$)/.test(key);
function validStorage(storage){
  if(!storage||typeof storage.key!=='function'||
     typeof storage.getItem!=='function'||!Number.isSafeInteger(storage.length)||
     storage.length<0||storage.length>10000)
    throw TypeError('Safe local storage enumeration unavailable');
}

export function buildReadOnlyGameArchive(storage,now=new Date()){
  validStorage(storage);
  const stamp=new Date(now).toISOString();
  const entries=[],seen=new Set(),count=storage.length;
  for(let i=0;i<count;i++){
    const key=storage.key(i);
    if(typeof key!=='string')throw Error('Stored world key could not be read');
    if(!gameKey(key))continue;
    if(seen.has(key))throw Error('Duplicate stored world key; refusing incomplete archive');
    const raw=storage.getItem(key);
    if(typeof raw!=='string')throw Error('Stored world changed during archive inspection');
    seen.add(key);entries.push([key,raw]);
  }
  entries.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
  const payload=JSON.stringify({capturedAt:stamp,entries});
  const text=JSON.stringify({format:GAME_ARCHIVE_FORMAT,
    payload,checksum:saveFingerprint(payload)});
  // A downloaded archive is evidence; it is NOT a verified playable save.
  return Object.freeze({text,count:entries.length,checksum:saveFingerprint(payload),
    filename:'mythwrought-local-saves-'+stamp.slice(0,10)+'.json'});
}

export function inspectReadOnlyGameArchive(text){
  if(typeof text!=='string'||text.length>20_000_000)
    throw TypeError('Unrecognized or oversized storage archive');
  const envelope=JSON.parse(text);
  if(envelope?.format!==GAME_ARCHIVE_FORMAT||
     typeof envelope.payload!=='string'||
     envelope.checksum!==saveFingerprint(envelope.payload))
    throw Error('Storage archive checksum or format failed');
  const parsed=JSON.parse(envelope.payload);
  if(!parsed||!Number.isFinite(Date.parse(parsed.capturedAt))||
     !Array.isArray(parsed.entries))
    throw Error('Storage archive metadata invalid');
  let previous=null;
  for(const entry of parsed.entries){
    if(!Array.isArray(entry)||entry.length!==2||
       typeof entry[0]!=='string'||!gameKey(entry[0])||
       typeof entry[1]!=='string'||(previous!==null&&entry[0]<=previous))
      throw Error('Invalid, duplicate or non-game archive storage key');
    previous=entry[0];
  }
  return Object.freeze({capturedAt:parsed.capturedAt,
    entries:Object.freeze(parsed.entries.map(([key,raw])=>Object.freeze([key,raw]))),
    checksum:envelope.checksum});
}
