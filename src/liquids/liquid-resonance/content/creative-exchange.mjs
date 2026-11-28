// Resonance B: finite creative-tool proposals, not an inventory or world executor.
const freeze=Object.freeze;
const token=v=>typeof v==='string'&&v.length>0&&v.length<=128;
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const validPoint=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const samePoint=(a,b)=>validPoint(a)&&a.every((v,i)=>v===b[i]);

export function createResonanceCreativeAdapter({physics,exchange,readTarget,readSlot,authorize,maxPerAction=2}={}){
  if(physics?.RESONANCE_ID!=='liquid-resonance'||typeof physics.restoreResonanceStore!=='function'||
    typeof exchange?.planResonanceCellExchange!=='function'||
    [readTarget,readSlot,authorize].some(f=>typeof f!=='function')||!int(maxPerAction,1,8))
    throw new TypeError('Invalid creative exchange host');
  // Read callbacks must be pure, synchronous and stable under the host edit lease.
  function plan(raw){
    if(!raw||!['collect','inject'].includes(raw.direction)||!validPoint(raw.point)||
      !token(raw.actor)||!token(raw.slot)||!int(raw.requested,1,8)||
      (raw.allowPartial!==undefined&&typeof raw.allowPartial!=='boolean'))return null;
    const request=freeze({direction:raw.direction,point:freeze([...raw.point]),actor:raw.actor,
      slot:raw.slot,requested:raw.requested,allowPartial:raw.allowPartial===true});
    // Authorize first; do not disclose cell or inventory state for denied requests.
    if(authorize(request)!==true)return null;
    const slot=readSlot(request.actor,request.slot);
    if(slot?.actor!==request.actor||slot.slot!==request.slot||slot.loaded!==true||
      slot.permitted!==true||!token(slot.revision)||!token(slot.anchor)||
      slot.store?.id!==physics.RESONANCE_ID)return null;
    const target=readTarget(request.point);
    if(!target||!samePoint(target.point,request.point)||target.loaded!==true||target.open!==true||
      target.contained!==true||target.permitted!==true||!token(target.ownerKey)||
      !token(target.cellRevision)||!(target.cell===null||target.cell?.id===physics.RESONANCE_ID))return null;
    let transfer;
    try{
      const store=physics.restoreResonanceStore(slot.store);
      transfer=exchange.planResonanceCellExchange({direction:request.direction,point:request.point,
        cell:target.cell,ownerKey:target.ownerKey,cellRevision:target.cellRevision,store,
        storeAnchor:slot.anchor,permitted:true,loaded:true,open:true,contained:true,
        requested:request.requested,maxPerVisit:maxPerAction});
    }catch(e){if(e instanceof TypeError||e instanceof RangeError)return null;throw e;}
    if(!transfer||(!request.allowPartial&&transfer.units!==request.requested))return null;
    return freeze({version:1,id:physics.RESONANCE_ID,request,slotRevision:slot.revision,
      transfer,changed:freeze([request.point])});
  }
  // Recompute against fresh authorized state. Use ONLY the returned canonical
  // proposal inside the host's atomic terrain/inventory commit. Dirty coordinates
  // are candidates until commit succeeds; host then feeds shared dirty expansion.
  function revalidate(candidate){
    if(!candidate||candidate.version!==1||candidate.id!==physics.RESONANCE_ID)return null;
    const fresh=plan(candidate.request);
    return fresh&&JSON.stringify(fresh)===JSON.stringify(candidate)?fresh:null;
  }
  return freeze({plan,revalidate});
}
