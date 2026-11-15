// Creator-authorized Block Pack 2 opt-in editable overlay.
// Legacy VoxelWorld and schema-1 saves remain byte-for-byte unchanged.
// New candidate cells are written to a separate checksummed per-seed sidecar;
// corrupted existing data is NEVER silently replaced, reset or migrated.
import {VoxelWorld,BLOCK} from './voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from './depth.mjs';
import {worldSlotKey} from './seeds.mjs';
import {saveFingerprint} from './persistence.mjs';
import {isPack2LiveId,pack2NormalizeState} from './pack2-integration.mjs';

export const PACK2_SIDECAR_SUFFIX='-pack2-live-v1';
const JOURNAL='-journal',BACKUP='-backup',MAX_CELLS=50000;
const coord=(x,y,z)=>x+','+y+','+z;
const sortCells=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
const within=(x,y,z)=>[x,y,z].every(Number.isSafeInteger)&&
  y>=WORLD_MIN_Y&&y<=WORLD_MAX_Y;
const isExactState=(id,state)=>{
  if(!state||typeof state!=='object'||Array.isArray(state))return false;
  let canonical;try{canonical=pack2NormalizeState(id,state)}catch{return false}
  return Object.keys(canonical).sort().join(',')===Object.keys(state).sort().join(',')&&
    Object.entries(canonical).every(([k,v])=>state[k]===v);
};
export class Pack2LiveWorld{
  constructor(base,records=[]){
    if(!(base instanceof VoxelWorld))throw new TypeError('Expected actual production VoxelWorld');
    this.base=base;this.seed=base.seed;this.edits=base.edits;
    this.pack2Cells=new Map();this.nextPack2State=null;
    if(!Array.isArray(records)||records.length>MAX_CELLS)throw new TypeError('Invalid Pack 2 records');
    for(const row of records){
      if(!Array.isArray(row)||row.length!==5)throw new TypeError('Bad candidate row');
      const [x,y,z,id,state]=row;
      if(!within(x,y,z)||!isPack2LiveId(id)||!isExactState(id,state)||
          base.get(x,y,z)!==BLOCK.AIR)throw new TypeError('Unsafe Pack 2 overlay');
      const key=coord(x,y,z);
      if(this.pack2Cells.has(key))throw new TypeError('Duplicate Pack 2 coordinates');
      this.pack2Cells.set(key,Object.freeze({...state}));
    }
  }
  get(x,y,z){return this.pack2Cells.get(coord(x,y,z))?.id??this.base.get(x,y,z);}
  // Existing subsystems call these pure, production-authentic voxel helpers.
  legacyBlockAt(...args){return this.base.legacyBlockAt(...args);}
  naturalAndLandmarkBlock(...args){return this.base.naturalAndLandmarkBlock(...args);}
  getPack2State(x,y,z){return this.pack2Cells.get(coord(x,y,z))??null;}
  set(x,y,z,id){
    if(!within(x,y,z)||!Number.isInteger(id))return false;
    const key=coord(x,y,z),previous=this.pack2Cells.get(key);
    if(isPack2LiveId(id)){
      if(this.base.get(x,y,z)!==BLOCK.AIR)return false;
      const requested=this.nextPack2State?.id===id?this.nextPack2State:null;
      let state;try{state=pack2NormalizeState(id,requested??{})}catch{return false}
      if(!previous&&this.pack2Cells.size>=MAX_CELLS)return false;
      this.pack2Cells.set(key,state);return true;
    }
    if(id<0||id>8)return false;
    if(previous){
      // Removing an overlay is NOT a terrain mutation; its underlying air
      // (including an explicit existing AIR edit) stays untouched.
      if(id===BLOCK.AIR){this.pack2Cells.delete(key);return true;}
      if(!this.base.set(x,y,z,id))return false;
      this.pack2Cells.delete(key);return true;
    }
    return this.base.set(x,y,z,id);
  }
  placePack2(x,y,z,id,state){
    if(!isPack2LiveId(id)||!within(x,y,z)||this.base.get(x,y,z)!==BLOCK.AIR)return false;
    const norm=pack2NormalizeState(id,state);
    const old=this.nextPack2State;
    try{this.nextPack2State=norm;return this.set(x,y,z,id)}
    finally{this.nextPack2State=old;}
  }
  updatePack2State(x,y,z,state){
    const key=coord(x,y,z),prior=this.pack2Cells.get(key);
    if(!prior)return false;
    const normalized=pack2NormalizeState(prior.id,state);
    this.pack2Cells.set(key,normalized);return true;
  }
  // Dedicated sidecar ONLY. The old production save format is not widened.
  save(){return this.base.save();}
  pack2Snapshot(){
    return {kind:'mythwrought-pack2-overlay',version:1,seed:this.seed,
      cells:[...this.pack2Cells.entries()].map(([cell,s])=>
        [...cell.split(',').map(Number),s.id,{...s}]).sort(sortCells)};
  }
}
export function validatePack2Snapshot(value,base){
  if(!value||typeof value!=='object'||Array.isArray(value)||
    Object.keys(value).sort().join(',')!=='cells,kind,seed,version'||
    value.kind!=='mythwrought-pack2-overlay'||value.version!==1||
    !Number.isSafeInteger(value.seed)||value.seed!==base.seed||!Array.isArray(value.cells)||
    value.cells.length>MAX_CELLS)throw new TypeError('Unrecognized Pack 2 save sidecar');
  return new Pack2LiveWorld(base,value.cells);
}
export function pack2StorageKey(seed){return worldSlotKey(seed)+PACK2_SIDECAR_SUFFIX;}
function readSnapshot(raw,base){
  if(raw===null)return null;
  try{const snapshot=JSON.parse(raw);return {raw,world:validatePack2Snapshot(snapshot,base)}}
  catch(error){return {error:String(error)}}
}
function readJournal(raw,base){
  if(raw===null)return null;
  try{
    const j=JSON.parse(raw);
    if(!j||j.version!==1||j.seed!==base.seed||typeof j.raw!=='string'||
       j.checksum!==saveFingerprint(j.raw))throw Error('Pack 2 journal checksum mismatch');
    const out=readSnapshot(j.raw,base);
    if(!out?.world)throw Error('Invalid candidate journal sidecar');
    return out;
  }catch(error){return {error:String(error)}}
}
export function loadPack2LiveWorld(storage,base){
  const key=pack2StorageKey(base.seed),primary=readSnapshot(storage.getItem(key),base);
  const journal=readJournal(storage.getItem(key+JOURNAL),base);
  if(primary?.world){
    if(journal?.world&&journal.raw!==primary.raw)
      return {world:journal.world,recovered:true,
        warning:'Pack 2 verified pending journal restored; export an independent backup'};
    return {world:primary.world,recovered:false,warning:''};
  }
  if(journal?.world)return {world:journal.world,recovered:true,
    warning:'Pack 2 recovered verified sidecar journal'};
  const backup=readSnapshot(storage.getItem(key+BACKUP),base);
  if(backup?.world)return {world:backup.world,recovered:true,
    warning:'Pack 2 recovered previous-good sidecar backup'};
  if(primary!==null||journal!==null||backup!==null)
    throw Error('Pack 2 sidecar is damaged. Existing bytes were NOT overwritten; restore from a verified backup.');
  return {world:new Pack2LiveWorld(base),recovered:false,warning:''};
}
export function savePack2LiveWorld(storage,world){
  try{
    if(!(world instanceof Pack2LiveWorld))throw Error('Expected live Pack 2 overlay world');
    const key=pack2StorageKey(world.seed);
    const raw=JSON.stringify(world.pack2Snapshot());
    // No eager changes to preexisting worlds without Pack 2 objects.
    if(!world.pack2Cells.size&&storage.getItem(key)===null&&
       storage.getItem(key+JOURNAL)===null)return {ok:true,unchanged:true};
    const verify=readSnapshot(raw,world.base);
    if(!verify?.world)throw Error('New Pack 2 data failed validation');
    const prior=storage.getItem(key),pending=readJournal(storage.getItem(key+JOURNAL),world.base);
    if(pending?.world&&pending.raw!==prior&&pending.raw!==raw)
      throw Error('A newer uncommitted Pack 2 journal must be recovered first');
    if(prior!==null&&prior!==raw){
      const old=readSnapshot(prior,world.base);
      if(!old?.world)throw Error('Refusing overwrite of damaged Pack 2 primary');
      storage.setItem(key+BACKUP,prior);
      if(storage.getItem(key+BACKUP)!==prior)throw Error('Pack 2 backup verification failed');
    }
    const record=JSON.stringify({version:1,seed:world.seed,raw,checksum:saveFingerprint(raw)});
    storage.setItem(key+JOURNAL,record);
    if(storage.getItem(key+JOURNAL)!==record)throw Error('Pack 2 journal verification failed');
    storage.setItem(key,raw);
    if(storage.getItem(key)!==raw)throw Error('Pack 2 primary verification failed');
    return {ok:true,unchanged:prior===raw};
  }catch(error){return {ok:false,reason:String(error)};}
}
export function pack2ExportBundle(world){
  if(!(world instanceof Pack2LiveWorld))throw TypeError('Expected Pack 2 world');
  return {...world.save(),pack2:world.pack2Snapshot()};
}
export function pack2ImportBundle(payload,base){
  if(!payload||!Object.prototype.hasOwnProperty.call(payload,'pack2'))
    return new Pack2LiveWorld(base);
  return validatePack2Snapshot(payload.pack2,base);
}
