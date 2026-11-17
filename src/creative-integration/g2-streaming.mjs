// G2A detached streaming planner. No chunk creation, GPU uploads or world writes.
export const G2_CHUNK_EDGE=16;
export const G2_MAX_NEW_PREFETCH=2;
export const G2_MAX_PENDING_PREFETCH=6;
export const G2_MAX_LOOKAHEAD=16;
const fail=s=>{throw new TypeError('G2 streaming: '+s);};
const validPoint=p=>p&&typeof p==='object'&&['x','y','z'].every(k=>Number.isFinite(p[k]));
const token=t=>typeof t==='string'&&t.length>0&&t.length<=128;
const frozen=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
export function g2RegionKey(point,sectionForY){
  if(!validPoint(point)||typeof sectionForY!=='function')fail('valid point and real sectionForY reader required');
  const section=sectionForY(point.y);
  if(!Number.isSafeInteger(section)||section>0)fail('invalid streamed vertical section');
  return Math.floor(point.x/G2_CHUNK_EDGE)+','+Math.floor(point.z/G2_CHUNK_EDGE)+','+section;
}
export function createG2PrefetchState(worldToken='unbound',intentToken='idle'){
  if(!token(worldToken)||!token(intentToken))fail('world and direction tokens required');
  return Object.freeze({worldToken,intentToken,pending:Object.freeze([])});
}
export function planG2Prefetch(state,{worldToken,intentToken,points=[],sectionForY,isRegionReady}={}){
  if(!state||!token(worldToken)||!token(intentToken)||!Array.isArray(points)||points.length>8||
     typeof sectionForY!=='function'||typeof isRegionReady!=='function')
    fail('invalid planning context');
  // Stale world/flight directions invalidate old requests. Host must cancel
  // returned keys; planning does not issue or cancel real chunk work.
  const stale=state.worldToken!==worldToken||state.intentToken!==intentToken;
  const cancelled=stale?state.pending.map(p=>p.key):[];
  const active=stale?[]:state.pending.filter(p=>!isRegionReady(p.point));
  const seen=new Set(active.map(p=>p.key));
  const requests=[];
  for(const p of points){
    if(!validPoint(p))fail('non-finite candidate');
    if(requests.length>=G2_MAX_NEW_PREFETCH||active.length>=G2_MAX_PENDING_PREFETCH)break;
    const key=g2RegionKey(p,sectionForY);
    if(isRegionReady(p)||seen.has(key))continue;
    const row=Object.freeze({key,point:frozen(p)});
    active.push(row);requests.push(row);seen.add(key);
  }
  const next=Object.freeze({worldToken,intentToken,pending:Object.freeze(active)});
  return Object.freeze({state:next,requests:Object.freeze(requests),
    cancelled:Object.freeze([...new Set(cancelled)])});
}
export function settleG2Prefetch(state,readyKeys=[]){
  if(!state||!Array.isArray(readyKeys)||!readyKeys.every(k=>typeof k==='string'))
    fail('invalid completion keys');
  const done=new Set(readyKeys);
  return Object.freeze({...state,pending:Object.freeze(state.pending.filter(p=>!done.has(p.key)))});
}
export function cancelG2Prefetch(state){
  if(!state||!Array.isArray(state.pending))fail('invalid state');
  return Object.freeze({state:createG2PrefetchState(state.worldToken,state.intentToken),
    cancelled:Object.freeze(state.pending.map(p=>p.key))});
}
