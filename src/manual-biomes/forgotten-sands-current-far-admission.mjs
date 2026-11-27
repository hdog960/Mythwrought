// Advisory admission against the released shared-height owner budget.
// This does not reserve a slot, remove a selected owner, or allocate a buffer.
export function planP0CurrentFarAdmission({selected,resident,farBytes,sourceCurrent,canonicalKey,upperOccupied}={}){
 if(!Array.isArray(selected)||!Array.isArray(resident)||typeof sourceCurrent!=='function'||
 typeof canonicalKey!=='function'||typeof upperOccupied!=='function'||!Number.isSafeInteger(farBytes)||farBytes<=0||farBytes>524288)
  throw Error('Invalid current far admission');
 const deny=reason=>Object.freeze({allowed:false,reason,placementAuthority:false});
 if(sourceCurrent()!==true)return deny('stale-source');
 const keys=new Set(),actual=new Set();let upper=0,upperBytes=0,bytes=0;
 for(const s of selected){
  if(![s.cx,s.cz,s.section].every(Number.isSafeInteger))return deny('invalid-owner');
  const k=canonicalKey(s.cx,s.cz,s.section);
  if(typeof k!=='string'||keys.has(k))return deny('duplicate-selected-owner');
  keys.add(k);
  if(s.section>0){const occupied=upperOccupied(k);if(typeof occupied!=='boolean')return deny('unknown-upper-occupancy');if(occupied)upper++;}
 }
 if(keys.size>25||upper>8)return deny('shared-owner-cap');
 // Full plan has no free owner, even if a future planned mesh is empty.
 if(keys.size===25)return deny('no-spare-shared-owner');
 for(const r of resident){
  if(![r.cx,r.cz,r.section,r.bytes].every(Number.isSafeInteger)||r.bytes<0)return deny('invalid-resident');
  const k=canonicalKey(r.cx,r.cz,r.section);if(!keys.has(k)||actual.has(k))return deny('unsettled-or-duplicate-owner');actual.add(k);
  bytes+=r.bytes;
  if(r.section>0){if(r.bytes>884736)return deny('upper-section-byte-cap');upperBytes+=r.bytes;}
 }
 if(actual.size!==keys.size)return deny('unsettled-owner-set');
 if(upperBytes>7077888||bytes+farBytes>2610144)return deny('byte-cap');
 if(sourceCurrent()!==true)return deny('stale-source');
 return Object.freeze({allowed:true,reason:'advisory-only-spare-owner',owners:keys.size+1,bytes:bytes+farBytes,placementAuthority:false});
}
