// Non-authoritative, source-only D1 lamp budget preview.
const validInt=n=>Number.isSafeInteger(n)&&n>=0;
const validId=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(s);
export function summarizeLampBudget(input){
 if(!input||!validId(input.worldId)||!validInt(input.tick)||!Array.isArray(input.lamps)||input.lamps.length<1||input.lamps.length>8)throw new TypeError('invalid preview frame');
 if(input.activationAuthorized===true||input.authoritativeDelivery===true||input.productionBound===true)throw new TypeError('forged authority');
 const seen=new Set();
 const lamps=input.lamps.map(l=>{
  if(!l||!validId(l.deviceId)||seen.has(l.deviceId)||typeof l.desiredOn!=='boolean'||!validInt(l.demand)||!validInt(l.observedGrant)||l.demand>1000||l.observedGrant>1000||(!l.desiredOn&&l.demand!==0))throw new TypeError('invalid lamp');
  seen.add(l.deviceId);
  const used=Math.min(l.demand,l.observedGrant);
  return Object.freeze({deviceId:l.deviceId,desiredOn:l.desiredOn,demand:l.demand,observedGrant:l.observedGrant,previewLit:l.desiredOn&&l.demand>0&&l.observedGrant>=l.demand,previewUsed:used,previewDeficit:l.demand-used});
 }).sort((a,b)=>a.deviceId<b.deviceId?-1:a.deviceId>b.deviceId?1:0);
 const sum=key=>lamps.reduce((n,l)=>n+l[key],0);
 return Object.freeze({schema:'resonance48-lamp-budget-preview-v1',worldId:input.worldId,tick:input.tick,lamps:Object.freeze(lamps),previewDemand:sum('demand'),previewUsed:sum('previewUsed'),previewDeficit:sum('previewDeficit'),previewLitCount:lamps.filter(l=>l.previewLit).length,activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
}