/** Source-only deterministic lamp grant continuity; no authority. */
const integer = (n,max=1000000)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const id = s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(s);
const deny = reason=>Object.freeze({valid:false,reason,activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
export function inspectLampGrantContinuity(current,previous=null) {
 if(!current||!integer(current.tick,Number.MAX_SAFE_INTEGER)||!id(current.worldId)) return deny('invalid-context');
 if(!Array.isArray(current.lamps)||current.lamps.length<1||current.lamps.length>8) return deny('invalid-roster');
 if(previous!==null&&(!previous||previous.worldId!==current.worldId||!integer(previous.tick,Number.MAX_SAFE_INTEGER)||current.tick!==previous.tick+1||!Array.isArray(previous.lamps))) return deny('discontinuous-observation');
 const normalize=lamps=>{
  const seen=new Set();
  return lamps.map(l=>{
   if(!l||!id(l.id)||seen.has(l.id)||!integer(l.demand)||!integer(l.grant)||l.grant>l.demand||typeof l.requestedOn!=='boolean') throw Error('invalid-lamp');
   seen.add(l.id);return {id:l.id,demand:l.demand,grant:l.grant,requestedOn:l.requestedOn};
  }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 };
 let lamps,old;
 try {lamps=normalize(current.lamps);old=previous?normalize(previous.lamps):[];} catch {return deny('invalid-lamp');}
 if(previous&&(old.length!==lamps.length||old.some((l,i)=>l.id!==lamps[i].id))) return deny('roster-changed');
 const before=new Map(old.map(l=>[l.id,l]));
 const status=l=>!l.requestedOn?'off':l.grant<l.demand?'deficit':'observed-sufficient';
 const entries=Object.freeze(lamps.map(l=>{
  const prior=before.get(l.id),state=status(l),priorState=prior?status(prior):'unobserved';
  return Object.freeze({id:l.id,state,priorState,changed:state!==priorState,observedGrant:l.grant,requestedDemand:l.demand,deficit:l.requestedOn?l.demand-l.grant:0,activationAuthorized:false});
 }));
 const sum=k=>entries.reduce((n,e)=>n+e[k],0);
 return Object.freeze({valid:true,tick:current.tick,worldId:current.worldId,entries,observedGrant:sum('observedGrant'),requestedDemand:sum('requestedDemand'),deficit:sum('deficit'),activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
}