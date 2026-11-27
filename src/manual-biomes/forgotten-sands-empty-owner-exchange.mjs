// Detached admission for the shared height renderer. No required owner is
// removed. An optional *proven empty* upper placeholder alone may yield
// its slot. Unknown occupancy, body coverage, mesh bytes or epoch deny.
export function planP0EmptyOwnerExchange({selected,player,H,world,inspect,farBytes,sourceCurrent}={}){
 if(!Array.isArray(selected)||!H||!world||typeof inspect!=='function'||typeof sourceCurrent!=='function'||
 !Number.isSafeInteger(farBytes)||farBytes<=0||farBytes>524288)throw Error('Invalid empty-owner exchange');
 const deny=reason=>Object.freeze({allowed:false,reason,placementAuthority:false});
 if(sourceCurrent()!==true)return deny('stale-source');
 if(!Number.isFinite(player?.feet)||player.feet<16||player.feet>=20)return deny('outside-surface-upper-approach');
 const body=H.physicalBodyRegions(player);if(!body)return deny('unknown-body');
 const bodyKeys=new Set(body.map(r=>r.key)),keys=new Set();
 let upperCount=0,bytes=0,upperBytes=0;const empty=[];
 for(const s of selected){
  if(![s.cx,s.cz,s.section].every(Number.isSafeInteger))return deny('invalid-owner');
  const k=H.runtimeMeshKey(s.cx,s.cz,s.section);
  if(keys.has(k))return deny('duplicate-owner');keys.add(k);
  const evidence=inspect(s,k);
  if(!evidence||evidence.complete!==true||!Number.isSafeInteger(evidence.solidBytes)||!Number.isSafeInteger(evidence.waterBytes)||evidence.solidBytes<0||evidence.waterBytes<0)return deny('unknown-complete-mesh');
  const n=evidence.solidBytes+evidence.waterBytes;bytes+=n;
  if(s.section>0){
   if(n>884736)return deny('upper-section-cap');upperBytes+=n;if(n>0)upperCount++;
   if(n===0&&!H.upperOccupancy(world,k)&&!bodyKeys.has(k)&&s.required!==true)empty.push(k);
  }
 }
 if([...bodyKeys].some(k=>!keys.has(k)))return deny('missing-body-owner');
 if(keys.size>25||upperCount>8||upperBytes>7077888||bytes+farBytes>2610144)return deny('shared-budget');
 if(keys.size===25&&!empty.length)return deny('no-proven-empty-optional-owner');
 const removed=keys.size===25?empty[0]:null;
 if(sourceCurrent()!==true)return deny('stale-source');
 return Object.freeze({allowed:true,reason:removed?'optional-empty-upper-exchange':'spare-owner',removed,
  retained:Object.freeze(selected.filter(s=>H.runtimeMeshKey(s.cx,s.cz,s.section)!==removed)),
  owners:keys.size+1-Number(removed!==null),upperCount,bytes:bytes+farBytes,placementAuthority:false});
}
