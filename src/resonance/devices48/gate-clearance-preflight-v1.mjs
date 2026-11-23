// :48 isolated source-only gate clearance preflight. No physical authorization.
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_-]{0,47}$/.test(x);
const fail=s=>{throw new TypeError(s)};
const bound=b=>{
 if(!b||!Array.isArray(b.min)||!Array.isArray(b.max)||b.min.length!==3||b.max.length!==3||
 !b.min.every(Number.isSafeInteger)||!b.max.every(Number.isSafeInteger)||
 !b.min.every((n,i)=>n<b.max[i]&&n>=-1000000&&b.max[i]<=1000000&&b.max[i]-n<=16))fail('invalid bounds');
 return {min:[...b.min],max:[...b.max]};
};
const overlap=(a,b)=>a.min.every((n,i)=>n<b.max[i]&&a.max[i]>b.min[i]);
export function preflightCandidateGateClearance({worldId,tick,intents,paths,obstacles,actors}){
 if(!validId(worldId)||!Number.isSafeInteger(tick)||tick<0||!Array.isArray(intents)||!Array.isArray(paths)||
 !Array.isArray(obstacles)||!Array.isArray(actors)||intents.length>16||paths.length>16||
 obstacles.length>256||actors.length>64)fail('invalid frame');
 const pathMap=new Map(),seen=new Set();
 for(const p of paths){
  if(!p||!validId(p.id)||pathMap.has(p.id)||!Array.isArray(p.swept)||p.swept.length<1||p.swept.length>32)fail('invalid path');
  pathMap.set(p.id,p.swept.map(bound));
 }
 const blockers=[...obstacles.map(o=>({id:o?.id,kind:'obstacle',bounds:bound(o?.bounds)})),
 ...actors.map(a=>({id:a?.id,kind:'actor',bounds:bound(a?.bounds)}))],blockerIds=new Set();
 for(const b of blockers){
  if(!validId(b.id)||blockerIds.has(b.kind+':'+b.id))fail('invalid blocker');
  blockerIds.add(b.kind+':'+b.id);
 }
 const results=[];
 for(const intent of intents){
  if(!intent||!validId(intent.id)||seen.has(intent.id)||typeof intent.requestedOpen!=='boolean'||
  intent.movementAuthorized!==false||intent.collisionCleared!==false||intent.authority!=='candidate-only')fail('untrusted intent');
  seen.add(intent.id);
  const swept=pathMap.get(intent.id);
  if(!swept)fail('missing path');
  const hits=blockers.filter(b=>swept.some(s=>overlap(s,b.bounds))).map(b=>b.kind+':'+b.id).sort();
  results.push(Object.freeze({id:intent.id,requestedOpen:intent.requestedOpen,candidatePathClear:hits.length===0,
   blockers:Object.freeze(hits),movementAuthorized:false,collisionCleared:false,authoritativeDelivery:false,
   reason:hits.length?'candidate-path-blocked':'awaiting-authoritative-physics-and-delivery'}));
 }
 if(seen.size!==pathMap.size)fail('unmatched path');
 return Object.freeze({worldId,tick,results:Object.freeze(results.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)),
  productionBound:false,physicsBound:false,authoritativeDelivery:false});
}
