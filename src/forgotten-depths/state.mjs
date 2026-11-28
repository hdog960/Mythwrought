// Detached state codec. No storage writes, rewards or XP authority.
export const STATE_FIELDS=Object.freeze(["discovered","openDoors","disarmedTraps","solvedPuzzles","defeatedBosses","claimedRewards"]);
export function validateDungeonState(raw,identity,catalog){
 const keys=["schema","seed","profile","sourceVersion","dungeonId","layoutVersion","layoutDigest",...STATE_FIELDS];
 const token=v=>typeof v==="string"&&v.length>0&&v.length<=160&&/^[a-zA-Z0-9:_./-]+$/.test(v);
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||Object.keys(raw).length!==keys.length||keys.some(k=>!Object.hasOwn(raw,k))||raw.schema!==1||!Number.isInteger(raw.seed)||raw.seed!==(raw.seed|0)||!Number.isSafeInteger(raw.layoutVersion)||raw.layoutVersion<1)throw Error("invalid-state-envelope");
 for(const k of ["seed","profile","sourceVersion","dungeonId","layoutVersion","layoutDigest"])if(raw[k]!==identity?.[k]||(typeof raw[k]!=="number"&&!token(raw[k])))throw Error("state-identity-mismatch");
 const result={schema:1,seed:raw.seed,profile:raw.profile,sourceVersion:raw.sourceVersion,dungeonId:raw.dungeonId,layoutVersion:raw.layoutVersion,layoutDigest:raw.layoutDigest};
 for(const k of STATE_FIELDS){
  const ids=raw[k],allowed=catalog?.[k],limit=k==="discovered"?180:4096;
  if(!Array.isArray(ids)||ids.length>limit||!(allowed instanceof Set)||allowed.size>limit)throw Error("invalid-state-collection:"+k);
  const seen=new Set();
  for(const id of ids){if(!token(id)||!allowed.has(id)||seen.has(id))throw Error("invalid-state-member:"+k);seen.add(id);}
  result[k]=Object.freeze([...seen].sort());
 }
 return Object.freeze(result);
}

export function parseDungeonState(bytes,identity,catalog){if(typeof bytes!=="string"||bytes.length>4*1024*1024)throw Error("invalid-state-bytes");return validateDungeonState(JSON.parse(bytes),identity,catalog);}
