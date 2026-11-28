// Resonance B: host-owned finite material proposals; no network conversion or writes.
const freeze=Object.freeze;
const token=v=>typeof v==='string'&&v.length>0&&v.length<=128;
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const adjacent=(a,b)=>a.reduce((sum,v,i)=>sum+Math.abs(v-b[i]),0)===1;

export function createResonanceMaterialAdapter({physics,readEndpoint,authorize,
  enableTransfer=false,enableInfusion=false,allowedMaterials=[],maxUnits=2,maxEnergy=64}={}){
  if(physics?.RESONANCE_ID!=='liquid-resonance'||
    ['restoreResonanceStore','readResonanceCell','restoreInfusionMineral','planResonanceTransfer','planMineralInfusion'].some(k=>typeof physics[k]!=='function')||
    typeof readEndpoint!=='function'||typeof authorize!=='function'||
    typeof enableTransfer!=='boolean'||typeof enableInfusion!=='boolean'||
    !Array.isArray(allowedMaterials)||allowedMaterials.length>64||!Array.from(allowedMaterials).every(token)||
    !int(maxUnits,1,8)||!int(maxEnergy,1,physics.ENERGY_SCALE))throw new TypeError('Invalid material adapter policy');
  const materials=freeze([...new Set(allowedMaterials)]);
  function endpoint(kind,id){
    const e=readEndpoint(kind,id);
    if(!e||e.kind!==kind||e.id!==id||!point(e.point)||!token(e.anchor)||!token(e.ownerKey)||!token(e.revision)||
      e.loaded!==true||e.permitted!==true||e.contained!==true)return null;
    let state;
    try{
      if(kind==='store'){
        state=physics.restoreResonanceStore(e.state);
        if(state.anchor!==e.anchor)return null;
      }else if(kind==='cell'){
        if(e.open!==true)return null;
        state=physics.readResonanceCell(e.state);
        if(![state.x,state.y,state.z].every((v,i)=>v===e.point[i]))return null;
      }else state=physics.restoreInfusionMineral(e.state);
    }catch(err){if(err instanceof TypeError||err instanceof RangeError)return null;throw err;}
    return freeze({kind,id,point:freeze([...e.point]),anchor:e.anchor,ownerKey:e.ownerKey,revision:e.revision,state});
  }
  function plan(raw){
    if(!raw||!['transfer','infusion'].includes(raw.kind)||!token(raw.actor)||!token(raw.from)||!token(raw.to)||raw.from===raw.to)return null;
    const transfer=raw.kind==='transfer';
    if(transfer?!enableTransfer:!enableInfusion)return null;
    if(transfer&&(!int(raw.requested,1,8)||(raw.allowPartial!==undefined&&typeof raw.allowPartial!=='boolean')))return null;
    const request=freeze({kind:raw.kind,actor:raw.actor,from:raw.from,to:raw.to,
      ...(transfer?{requested:raw.requested,allowPartial:raw.allowPartial===true}:{})});
    if(authorize(request)!==true)return null;
    const from=endpoint(transfer?'store':'cell',request.from),to=endpoint(transfer?'store':'mineral',request.to);
    if(!from||!to||from.anchor===to.anchor||!adjacent(from.point,to.point))return null;
    const operation=transfer?physics.planResonanceTransfer(from.state,to.state,{permitted:true,fromLoaded:true,toLoaded:true,contained:true,requested:request.requested,maxPerVisit:maxUnits}):
      physics.planMineralInfusion(from.state,to.state,{enabled:true,permitted:true,loaded:true,adjacent:true,cellRevision:from.revision,allowedMaterials:materials,maxEnergy});
    if(!operation||(transfer&&!request.allowPartial&&operation.units!==request.requested))return null;
    return freeze({version:1,id:physics.RESONANCE_ID,request,from,to,operation,
      changed:freeze(transfer?[]:[from.point]),changedEndpoints:freeze([from.id,to.id])});
  }
  // Host holds one atomic lease, revalidates both endpoint generations and
  // applies BOTH replacements and persistence before emitting dirty receipts.
  function revalidate(candidate){
    if(candidate?.version!==1||candidate.id!==physics.RESONANCE_ID)return null;
    const fresh=plan(candidate.request);
    return fresh&&JSON.stringify(fresh)===JSON.stringify(candidate)?fresh:null;
  }
  return freeze({plan,revalidate});
}
