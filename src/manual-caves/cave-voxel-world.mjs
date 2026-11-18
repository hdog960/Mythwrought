// C4/C5: strictly explicit NEW-WORLD cave physical voxel baseline (#240).
// Standalone opt-in staging only. No production entry/UI, Pages or save writes.
// It inherits authentic production get/set/raycast/mesh semantics: generated
// caves are baseline voxels; player edits override and persist in schema 1.
import {VoxelWorld,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
import {worldSlotKey,LEGACY_WORLD_KEY,DEFAULT_WORLD_SEED} from '../seeds.mjs';
import {auditCaveSourceCells} from './source-composition.mjs';

export const CAVE_PROFILE_KIND='mythwrought-new-caves-v1';
function existingSaveKeys(storage,seed){
  if(!storage)return [];
  if(typeof storage.getItem!=='function')throw Error('Storage guard requires getItem');
  const base=worldSlotKey(seed),keys=[
    base,base+'-integrity-v009',base+'-backup-v009',base+'-damaged-v009',
    base+'-pack2-live-v1',base+'-pack2-live-v1-journal',
    base+'-pack2-live-v1-backup'
  ];
  if(seed===DEFAULT_WORLD_SEED)keys.push(LEGACY_WORLD_KEY);
  // Do not trust a new seed if any existing source-owned per-seed sidecar
  // is present; preserving saved buildings and other overlays takes priority.
  if(Number.isInteger(storage.length)&&typeof storage.key==='function'){
    for(let i=0;i<storage.length;i++){
      const k=storage.key(i);
      if(typeof k==='string'&&k.startsWith(base))keys.push(k);
    }
  }
  return [...new Set(keys)].filter(k=>storage.getItem(k)!==null);
}

export function checkNewCaveWorldAdmission(storage,seed,{approved=false}={}){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))
    return Object.freeze({ok:false,reason:'INVALID_SEED'});
  if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_WORLD_SELECTION_REQUIRED'});
  const blocked=existingSaveKeys(storage,seed);
  if(blocked.length)return Object.freeze({ok:false,reason:'EXISTING_WORLD_MUST_NOT_BE_REPROFILED',
    blockedKeys:Object.freeze(blocked)});
  return Object.freeze({ok:true,profile:CAVE_PROFILE_KIND,seed});
}
export class CaveVoxelWorld extends VoxelWorld{
  constructor(seed=179,options={}){
    const permission=checkNewCaveWorldAdmission(options.storage,seed,options);
    if(!permission.ok)throw Error('Protected cave world admission: '+permission.reason);
    super(seed);
    const audit=auditCaveSourceCells(seed);
    // Do not expose a partially composed cave map as a playable world.
    if(!audit.ok)throw Error('Cave source composition not safe: '+audit.reasons.join('; ')+
      ' '+JSON.stringify(audit.conflicts.slice(0,3)));
    this.caveCellMap=audit.cells;
    this.cavePlanReport=Object.freeze({
      seed,sourceCount:audit.sourceCount,
      sourceReports:audit.sourceReports,overlapCount:audit.overlapCount,
      entrancesConnected:false,productionRegistered:false
    });
  }
  naturalAndLandmarkBlock(x,y,z){
    if([x,y,z].every(Number.isSafeInteger)&&y>=WORLD_MIN_Y&&y<LEGACY_WORLD_MIN_Y){
      const key=worldKey(x,y,z);
      if(this.caveCellMap?.has(key))return this.caveCellMap.get(key);
    }
    return super.naturalAndLandmarkBlock(x,y,z);
  }
  static restore(payload,{approved=false}={}){
    if(approved!==true)throw Error('Explicit cave profile restore required');
    // Validate all legacy schema-1 fields with the canonical parser first.
    // DO NOT copy its normalized edits: a player-built DEEPSTONE block inside
    // generated cave AIR equals the *old* solid baseline and would be dropped.
    const valid=VoxelWorld.restore(payload);
    const cave=new CaveVoxelWorld(valid.seed,{approved:true});
    for(const row of payload.edits)
      if(!cave.set(...row))throw Error('Cave restore rejected a validated voxel edit');
    cave.rotations=new Map(valid.rotations);
    return cave;
  }
}
// Staging-only API: no persistent flag is automatically written and no
// existing seed is ever selected. Production UI must add explicit new-world
// selection and robust profile/recovery sidecar BEFORE shipping this.
export function createNewCaveWorld(seed,storage,{approved=false}={}){
  return new CaveVoxelWorld(seed,{approved,storage});
}
