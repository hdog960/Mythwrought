// Floating Islands: renderer-owned, compare-and-swap GPU publication.
// The original WebGL owner supplies getChunks/setChunks/deleteBuffer; no
// hidden GPU allocations, no changes to main.mjs, saves or PWA cache.
const used=new WeakSet();
const fail=s=>{throw new TypeError('Sky frame publish: '+s);};
const validToken=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const entriesMatch=(map,entries)=>map instanceof Map&&map.size===entries.length&&
  entries.every(([key,value])=>map.has(key)&&map.get(key)===value);
const returned=(status,reason,extra={})=>Object.freeze({status,reason,...extra});
export function publishSkyIslandGpuFrame({transaction,getChunks,setChunks,
  deleteBuffer,worldToken,expectedWorldToken,contextToken,expectedContextToken,
  epoch,expectedEpoch}={}){
  if(!transaction||!(transaction.baseChunks instanceof Map)||
     !Array.isArray(transaction.baseEntries)||!(transaction.nextChunks instanceof Map)||
     !Array.isArray(transaction.nextEntries)||
     !Array.isArray(transaction.stagedBuffers)||!Array.isArray(transaction.obsoleteBuffers)||
     transaction.stagedBuffers.length>2||transaction.nextChunks.size>25||
     typeof getChunks!=='function'||typeof setChunks!=='function'||
     typeof deleteBuffer!=='function'||![worldToken,expectedWorldToken,
       contextToken,expectedContextToken].every(validToken)||
     !Number.isSafeInteger(epoch)||!Number.isSafeInteger(expectedEpoch))
    fail('exact staged renderer, identity and epoch required');
  if(used.has(transaction))return returned('refused','Staged transaction was already finalized');
  const uniqueStage=new Set(transaction.stagedBuffers);
  if(uniqueStage.size!==transaction.stagedBuffers.length||
     transaction.stagedBuffers.some(b=>!b)||
     transaction.obsoleteBuffers.some(b=>!b||uniqueStage.has(b)))
    fail('staged buffer ownership is inconsistent');
  if(!entriesMatch(transaction.nextChunks,transaction.nextEntries))
    fail('staged next-chunk map was modified after GPU upload');
  // Mark as consumed BEFORE callbacks: a renderer callback may recurse.
  used.add(transaction);
  const contextValid=contextToken===expectedContextToken;
  const released=[],releaseFailed=[];
  const release=buffers=>{
    for(const buffer of buffers)try{deleteBuffer(buffer);released.push(buffer);}
      catch(_){releaseFailed.push(buffer);}
  };
  if(!contextValid)
    return returned('refused','WebGL context changed; no unsafe GPU deletion',
      {released:Object.freeze([]),abandonedOnContextLoss:true});
  let current;
  try{current=getChunks();}catch(_){
    release(transaction.stagedBuffers);
    return returned('refused','Renderer map unavailable; staged buffers released',
      {released:Object.freeze(released),releaseFailed:Object.freeze(releaseFailed)});
  }
  if(worldToken!==expectedWorldToken||epoch!==expectedEpoch||
     current!==transaction.baseChunks||
     !entriesMatch(current,transaction.baseEntries)){
    release(transaction.stagedBuffers);
    return returned('stale','Renderer owner, world or epoch changed; old map preserved',
      {released:Object.freeze(released),releaseFailed:Object.freeze(releaseFailed)});
  }
  // The new map is the exact staged buffer map, never recomputed after
  // upload. No old buffer may be disposed until the renderer owns nextChunks.
  try{
    setChunks(transaction.nextChunks);
  }catch(_){
    let observed;
    try{observed=getChunks();}catch(_){
      return returned('fatal','Renderer state inaccessible after failed publish',
        {needsRendererReset:true});
    }
    if(observed===transaction.nextChunks){
      try{setChunks(transaction.baseChunks);}catch(_){
        return returned('fatal','Renderer rejected publication and rollback; buffers retained',
          {needsRendererReset:true});
      }
      let restored;
      try{restored=getChunks()===transaction.baseChunks;}catch(_){restored=false;}
      if(!restored)return returned('fatal','Rollback did not restore original chunk owner',
        {needsRendererReset:true});
    }
    release(transaction.stagedBuffers);
    return returned('refused','Renderer publish failed; original chunks restored',
      {released:Object.freeze(released),releaseFailed:Object.freeze(releaseFailed)});
  }
  let retained;
  try{retained=getChunks()===transaction.nextChunks;}catch(_){retained=false;}
  if(!retained)return returned('fatal','Renderer did not retain published chunks; buffers retained',
    {needsRendererReset:true});
  release(transaction.obsoleteBuffers);
  return returned('published','Renderer owns staged world; superseded buffers released',
    {resident:transaction.nextChunks.size,disposeFailed:Object.freeze(releaseFailed),
      released:Object.freeze(released)});
}
