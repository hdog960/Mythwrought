// Integrator-owned physical construction adapter for MANUAL Block Packs 1 and 4.
// Source geometry comes from the independent pack builders. This adapter never
// allocates biome130 IDs, writes schema-1, or registers candidate blocks in VoxelWorld.
import {BLOCK} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {isBiome130BlockId,biome130Block} from '../biome130-registry.mjs';
import {isPack2LiveId,pack2ShapeOf} from '../pack2-integration.mjs';
import {raycastShapes} from '../voxel-shape-interactions.mjs';
import {inspectBodyFit} from '../voxel-shape-fit.mjs';
import {saveFingerprint} from '../persistence.mjs';
import {MANUAL_FIVE_PACK_CATALOG,resolveManualFivePackAsset} from './manual-five-pack.mjs';

export const MANUAL14_FORMAT='mythwrought.manual-block-packs-1-and-4.v1';
export const MANUAL14_MAX_CELLS=2048;
export const MANUAL14_STORAGE_PREFIX='mythwrought.manual14.seed.';
const choices=new Map(MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===1||x.pack===4)
  .map(x=>[x.numericId,x]));
if(choices.size!==53)throw Error('Expected all 30 Pack1 + 23 Pack4 authored numeric variants');
const key=c=>c.join(',');
const coordinate=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger);
const bounded=c=>coordinate(c)&&c[1]>=WORLD_MIN_Y&&c[1]<=WORLD_MAX_Y;
const pointIn=(body,box)=>[0,1,2].every(i=>body[i]<box[i+3]-1e-8&&body[i+3]>box[i]+1e-8);
const worldBox=(box,at)=>box.map((v,i)=>v+at[i%3]);
const isBody=body=>Array.isArray(body)&&body.length===6&&body.every(Number.isFinite)&&
  [0,1,2].every(i=>body[i]<body[i+3]);
function decodeRecord(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||!bounded(row.at))
  throw TypeError('Invalid manual 1/4 placement coordinates');
 const id=row.numericId,source=choices.get(id);
 if(!source||row.asset!==source.symbol)throw RangeError('Unknown or mismatched manual 1/4 family ID');
 const turn=row.orientation??0;
 if(!Number.isInteger(turn)||turn<0||turn>3)throw RangeError('Invalid manual 1/4 orientation');
 const variant=source.pack===1?(row.variant??'lower'):null;
 if(source.pack===4&&row.variant!=null)throw Error('Pack4 alternate artwork uses an explicit numeric ID');
 const shape=resolveManualFivePackAsset(source.symbol,{numericId:id,orientation:turn,variant});
 const supportAt=row.supportAt??null;
 if(supportAt!==null&&!bounded(supportAt))throw TypeError('Invalid explicit supporting cell');
 if(shape.supportPolicy==='vertical-face'){
  if(!supportAt||Math.abs(supportAt[0]-row.at[0])+
    Math.abs(supportAt[2]-row.at[2])!==1||supportAt[1]!==row.at[1])
   throw Error('Pack1 wall-mounted foliage requires an explicit adjacent wall support');
 }else if(supportAt!==null&&
   !shape.supportOffsets.some(offset=>offset.every((v,i)=>row.at[i]+v===supportAt[i])))
   throw Error('Explicit support does not match the authored mount orientation');
 const anchors=shape.supportOffsets.map(o=>row.at.map((v,i)=>v+o[i]));
 if(supportAt)anchors.push(supportAt);
 if(anchors.some(x=>!bounded(x)))throw Error('Supporting cell is outside playable world');
 return Object.freeze({at:Object.freeze([...row.at]),numericId:id,asset:source.symbol,
   sourcePack:source.pack,orientation:turn,variant,supportAt:supportAt?Object.freeze([...supportAt]):null,
   supports:Object.freeze(anchors.map(x=>Object.freeze(x))),shape});
}
function asRecord(e){return {asset:e.asset,numericId:e.numericId,at:[...e.at],
 orientation:e.orientation,...(e.sourcePack===1?{variant:e.variant}:{}),
 ...(e.supportAt?{supportAt:[...e.supportAt]}:{})};}
export function createManual14Layer(world,{maxCells=MANUAL14_MAX_CELLS,externalCell=null}={}){
 if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
   !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>MANUAL14_MAX_CELLS||
   (externalCell!==null&&typeof externalCell!=='function'))
   throw TypeError('Invalid manual 1/4 layer host');
 let placed=new Map();
 const externalAt=at=>Boolean(externalCell?.([...at]))||
   Boolean(world.pack3Runtime?.get?.(at))||
   Boolean(world.pack5Layer?.cell?.(at));
 const solidAt=(at,future)=>{
  const own=future.get(key(at));
  if(own)return own.shape.collisionBoxes.length>0;
  if(world.pack3Runtime?.get?.(at))
   return Boolean(world.pack3Runtime.readShape(...at)?.boxes?.length);
  const id=world.get(...at);
  if(id===BLOCK.AIR)return false;
  if(id>0&&id<=BLOCK.DEEPSTONE)return true;
  if(isBiome130BlockId(id))
   return biome130Block(id,world.rotationAt?.(...at)??0).solid===true;
  if(isPack2LiveId(id)){
   if(id===76)return false;
   const state=world.getPack2State?.(...at);
   return Boolean(state&&pack2ShapeOf(id,state).boxes.length);
  }
  return false; // Other unknown blocks are never fabricated as supports.
 };
 function verifyEntries(entries,{playerBody=null}={}){
  if(entries.size>maxCells)throw RangeError('Manual14 cell count exceeds budget');
  if(playerBody!==null&&!isBody(playerBody))throw TypeError('Invalid physical player bounds');
  for(const entry of entries.values()){
   if(world.get(...entry.at)!==BLOCK.AIR||externalAt(entry.at))
    throw Error('Blocked by an existing saved/foreign physical cell');
   for(const support of entry.supports)if(!solidAt(support,entries))
    throw Error('Missing certified structural mount at '+key(support));
   if(playerBody&&entry.shape.collisionBoxes.some(b=>pointIn(playerBody,worldBox(b,entry.at))))
    throw Error('Physical placement intersects player');
  }
 }
 function placeMany(records,options={}){
  if(!Array.isArray(records)||!records.length||placed.size+records.length>maxCells)
   throw RangeError('Invalid manual 1/4 blueprint batch');
  const future=new Map(placed);
  for(const raw of records){
   const entry=decodeRecord(raw),k=key(entry.at);
   if(future.has(k))throw Error('Overlapping manually authored construction '+k);
   future.set(k,entry);
  }
  verifyEntries(future,options); // fail closed before any mutation
  placed=future;
  return records.length;
 }
 function remove(at){
  if(!bounded(at))throw TypeError('Invalid removal cell');
  const k=key(at),found=placed.get(k);
  if(!found)return false;
  for(const entry of placed.values())if(entry!==found&&entry.supports.some(c=>key(c)===k))
   throw Error('Remove mounted dependent objects before their backing block');
  const next=new Map(placed);next.delete(k);placed=next;return true;
 }
 function get(at){if(!coordinate(at))throw TypeError('Invalid physical cell');return placed.get(key(at))??null;}
 function readShape(x,y,z,kind='selection'){
  const row=get([x,y,z]);if(!row)return null;
  const boxes=kind==='collision'?row.shape.collisionBoxes:row.shape.selectionBoxes;
  return boxes.length?{boxes}:null;
 }
 function target(eye,dir,reach=6){return raycastShapes(eye,dir,(x,y,z)=>readShape(x,y,z),reach);}
 function collision(body){
  if(!isBody(body))throw TypeError('Invalid manual 1/4 body bounds');
  return !inspectBodyFit(body,(x,y,z)=>readShape(x,y,z,'collision')).fits;
 }
 function snapshot(){return Object.freeze({format:MANUAL14_FORMAT,seed:world.seed,
   entries:[...placed.values()].sort((a,b)=>a.at[1]-b.at[1]||a.at[2]-b.at[2]||a.at[0]-b.at[0])
     .map(asRecord)});
 }
 function restore(doc){
  if(!doc||doc.format!==MANUAL14_FORMAT||doc.seed!==world.seed||
    !Array.isArray(doc.entries)||doc.entries.length>maxCells)
   throw Error('Foreign, damaged or oversized manual 1/4 sidecar');
  const rebuilt=new Map();
  for(const row of doc.entries){
   const item=decodeRecord(row),k=key(item.at);
   if(rebuilt.has(k))throw Error('Duplicate saved physical cell');
   rebuilt.set(k,item);
  }
  verifyEntries(rebuilt);placed=rebuilt;return rebuilt.size;
 }
 return Object.freeze({world,placeMany,remove,get,target,collision,readShape,
   snapshot,restore,size:()=>placed.size,entries:()=>Object.freeze([...placed.values()])});
}

// Stronger than an unverified localStorage write: stale-tab detection,
// previous-good readback, atomic in-memory rollback and read-only damaged saves.
export function createManual14SavedBridge(world,storage,opts={}){
 if(!storage||!['getItem','setItem','removeItem'].every(k=>typeof storage[k]==='function'))
  throw TypeError('A readback-capable storage device is required');
 const layer=createManual14Layer(world,opts),id=MANUAL14_STORAGE_PREFIX+world.seed;
 let readOnly=null,lastRaw=null;
 try{
  lastRaw=storage.getItem(id);
  if(lastRaw!==null){
   if(typeof lastRaw!=='string'||lastRaw.length>500000)throw Error('Oversized physical sidecar');
   layer.restore(JSON.parse(lastRaw));
  }
 }catch(err){readOnly='Protected manual 1/4 sidecar: '+String(err?.message||err);}
 function change(action){
  if(readOnly)return {ok:false,reason:readOnly};
  const before=layer.snapshot(),oldRaw=lastRaw;
  try{
   if(storage.getItem(id)!==oldRaw)throw Error('External tab edited manual 1/4 save; reload required');
   const outcome=action();
   if(!outcome)return {ok:false,reason:'No physical change'};
   const next=JSON.stringify(layer.snapshot());
   if(next.length>500000)throw Error('Manual 1/4 save budget exceeded');
   if(oldRaw!==null){
    storage.setItem(id+':previous-good',oldRaw);
    if(storage.getItem(id+':previous-good')!==oldRaw)
     throw Error('Previous-good manual 1/4 save verification failed');
   }
   storage.setItem(id,next);
   if(storage.getItem(id)!==next)throw Error('Manual 1/4 sidecar readback failed');
   lastRaw=next;
   return {ok:true,count:layer.size(),seed:world.seed};
  }catch(err){
   try{
    layer.restore(before);
    if(storage.getItem(id)!==oldRaw){
     if(oldRaw===null)storage.removeItem(id);else storage.setItem(id,oldRaw);
    }
    if(storage.getItem(id)!==oldRaw)throw Error('Rollback readback mismatch');
   }catch(rollback){
    readOnly='Manual 1/4 rollback cannot be verified; editing disabled: '+String(rollback);
   }
   return {ok:false,reason:readOnly??String(err?.message||err)};
  }
 }
 return Object.freeze({layer,key:id,placeMany:(a,o)=>change(()=>layer.placeMany(a,o)),
   remove:at=>change(()=>layer.remove(at)),get blocked(){return readOnly;},
   get lastRaw(){return lastRaw;},
   snapshot:()=>layer.snapshot(),target:(...a)=>layer.target(...a),collision:b=>layer.collision(b)});
}
