// MYTHWROUGHT Floating Islands: a PROVISIONAL, isolated upper-cell edit ledger.
// Not Codex's save format. Never writes existing Schema-1 saves, generator
// voxels, localStorage, WebGL, or world cells. This layer is opt-in only.
// A stable original-world identity AND generator fingerprint are mandatory.
export const SKY_SIDECAR_FORMAT='mythwrought-floating-islands-provisional-1';
export const SKY_SIDECAR_MAX_EDITS=8192;
export const SKY_SIDECAR_MIN_Y=20;
export const SKY_SIDECAR_MAX_Y=256;
const cache=new WeakMap();
const safe=Number.isSafeInteger;
const int32=n=>safe(n)&&n===(n|0);
const string=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const key=(x,y,z)=>x+','+y+','+z;
const fail=s=>{throw new TypeError('Sky sidecar: '+s);};
const within=(x,y,z)=>[x,y,z].every(safe)&&Math.abs(x)<=1e7&&Math.abs(z)<=1e7&&
  y>=SKY_SIDECAR_MIN_Y&&y<=SKY_SIDECAR_MAX_Y;
const sorted=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
function sourceContext(ctx){
  if(!ctx||typeof ctx.naturalAt!=='function'||typeof ctx.validateId!=='function'||
     typeof ctx.rotationAllowed!=='function')fail('source-owned reader and block/rotation validation required');
  return ctx;
}
const record=([x,y,z,id,rotation])=>Object.freeze([x,y,z,id,rotation]);
function construct({seed,worldId,generatorFingerprint,revision=0,rows=[],maxEdits=SKY_SIDECAR_MAX_EDITS}){
  if(!int32(seed)||!string(worldId)||!string(generatorFingerprint)||
     !safe(revision)||revision<0||!safe(maxEdits)||maxEdits<1||maxEdits>SKY_SIDECAR_MAX_EDITS||
     !Array.isArray(rows)||rows.length>maxEdits)fail('bounded identity, revision and edits required');
  const previous=new Set(),ordered=[];
  for(const item of rows){
    if(!Array.isArray(item)||item.length!==5||!within(...item.slice(0,3))||
      !safe(item[3])||item[3]<0||item[3]>65534||!safe(item[4])||item[4]<0||item[4]>3)
      fail('invalid upper edit row');
    const k=key(...item.slice(0,3));if(previous.has(k))fail('duplicate upper edit');
    previous.add(k);ordered.push(record(item));
  }
  ordered.sort(sorted);
  const result=Object.freeze({format:SKY_SIDECAR_FORMAT,seed,worldId,generatorFingerprint,
    revision,maxEdits,edits:Object.freeze(ordered)});
  cache.set(result,new Map(ordered.map(row=>[key(...row.slice(0,3)),row])));
  return result;
}
function sourceCheck(ctx,id,rotation){
  const src=sourceContext(ctx);
  if(!safe(id)||id<0||id>65534||src.validateId(id)!==id)fail('not an original source-registered physical block');
  if(!safe(rotation)||rotation<0||rotation>3||
    (rotation!==0&&!src.rotationAllowed(id)))fail('unapproved physical rotation');
}
export function createSkySidecar({seed,worldId,generatorFingerprint,maxEdits}={}){
  return construct({seed,worldId,generatorFingerprint,maxEdits});
}
export function readSkyEdit(state,x,y,z,ctx){
  if(!cache.has(state)||!within(x,y,z))fail('out-of-bounds upper lookup');
  const row=cache.get(state).get(key(x,y,z));
  return row?Object.freeze({id:row[3],rotation:row[4],edited:true}):
    Object.freeze({id:sourceContext(ctx).naturalAt(x,y,z),rotation:0,edited:false});
}
export function planSkyCellEdit(state,{x,y,z,id,rotation=0,expectedRevision,worldId,
  generatorFingerprint},ctx){
  if(!cache.has(state)||!within(x,y,z)||!safe(expectedRevision)||
    !string(worldId)||!string(generatorFingerprint))fail('invalid cell edit identity');
  if(worldId!==state.worldId||generatorFingerprint!==state.generatorFingerprint||
     expectedRevision!==state.revision)
    return Object.freeze({ok:false,reason:'Stale world, generator or revision',state,changed:false});
  sourceCheck(ctx,id,rotation);
  const old=cache.get(state),k=key(x,y,z),previous=old.get(k);
  const original=sourceContext(ctx).naturalAt(x,y,z);
  sourceCheck(ctx,original,0);
  const redundant=id===original&&rotation===0;
  if((redundant&&!previous)||
     (!redundant&&previous?.[3]===id&&previous?.[4]===rotation))
    return Object.freeze({ok:true,changed:false,state,reason:'No cell change'});
  const rows=new Map(old);
  if(redundant)rows.delete(k);
  else rows.set(k,record([x,y,z,id,rotation]));
  if(rows.size>state.maxEdits)return Object.freeze({ok:false,changed:false,state,
    reason:'Sky sidecar edit budget exhausted'});
  if(state.revision===Number.MAX_SAFE_INTEGER)fail('revision overflow');
  const next=construct({...state,revision:state.revision+1,rows:[...rows.values()]});
  return Object.freeze({ok:true,changed:true,state:next,previous:previous??null,
    change:Object.freeze({x,y,z,id,rotation}),reason:'Prepared separate upper edit'});
}
export function exportSkySidecar(state,ctx){
  if(!cache.has(state))fail('unknown sidecar state');
  for(const row of state.edits)sourceCheck(ctx,row[3],row[4]);
  // Plain serializable data, not an alias to caller-owned state.
  return {format:state.format,seed:state.seed,worldId:state.worldId,
    generatorFingerprint:state.generatorFingerprint,revision:state.revision,
    edits:state.edits.map(row=>[...row])};
}
export function restoreSkySidecar(payload,{seed,worldId,generatorFingerprint,
  maxEdits=SKY_SIDECAR_MAX_EDITS}={},ctx){
  if(!payload||payload.format!==SKY_SIDECAR_FORMAT||
    payload.seed!==seed||payload.worldId!==worldId||
    payload.generatorFingerprint!==generatorFingerprint||
    !Array.isArray(payload.edits)||!safe(payload.revision)||payload.revision<0)
    fail('wrong source world, format or generator; restore refused');
  const state=construct({seed,worldId,generatorFingerprint,
    revision:payload.revision,maxEdits,rows:payload.edits});
  for(const row of state.edits)sourceCheck(ctx,row[3],row[4]);
  // No original VoxelWorld.restore, no edits to groundWorld, no localStorage.
  return state;
}
