// Opt-in read-only chunk invalidation plan. No game-world or save authority.
export const CHUNK_INVALIDATION_CONTRACT='resonance-network36-chunk-invalidation-v1';
const id=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const order=(a,b)=>a<b?-1:a>b?1:0;
function index(snapshot,maxChunks) {
 if(!Array.isArray(snapshot)||snapshot.length>maxChunks)throw Error('invalid chunk envelope');
 const seen=new Set(),out=new Map();
 for(const c of snapshot){
  if(!c||!id(c.key)||!integer(c.epoch)||typeof c.loaded!=='boolean'||seen.has(c.key))throw Error('invalid chunk descriptor');
  seen.add(c.key);out.set(c.key,{epoch:c.epoch,loaded:c.loaded});
 }
 return out;
}
// Caller supplies externally authenticated monotonically increasing epochs.
// This function only identifies work; it never claims a topology rebuild occurred.
export function planChunkInvalidation({previous=[],current=[],maxChunks=25,maxChanges=25}={}){
 if(!integer(maxChunks)||maxChunks<1||maxChunks>25||!integer(maxChanges)||maxChanges<1||maxChanges>25)throw Error('invalid budget');
 const old=index(previous,maxChunks),now=index(current,maxChunks),changes=[];
 for(const key of new Set([...old.keys(),...now.keys()])){
  const before=old.get(key),after=now.get(key);
  if(before&&after&&after.epoch<before.epoch)throw Error('stale chunk epoch');
  if(!before||!after||before.epoch!==after.epoch||before.loaded!==after.loaded)
   changes.push({key,reason:!after||!after.loaded?'unload':!before||!before.loaded?'load':'edit'});
 }
 changes.sort((a,b)=>order(a.key,b.key));
 // Fail closed instead of publishing a partial graph when the work budget is exceeded.
 return {contract:CHUNK_INVALIDATION_CONTRACT,changed:changes.length>0,admitted:changes.length<=maxChanges,
  changes:changes.length<=maxChanges?changes:[],required:changes.length,reason:changes.length>maxChanges?'budget-exceeded':null};
}
