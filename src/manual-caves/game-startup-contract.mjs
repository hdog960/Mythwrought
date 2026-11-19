// Cave Roadmap #240: guarded selection contract for the ACTUAL game startup.
// No default-world migration, no automatic cave activation, no canonical-world
// writes. The game UI must invoke only after explicit player confirmation.
import {worldSlotKey} from '../seeds.mjs';
import {CaveVoxelWorld,CAVE_PROFILE_KIND} from './cave-voxel-world.mjs';
import {caveProfileStorageKey,createStagedCaveProfile,
  loadStagedCaveProfile,saveStagedCaveProfile} from './profile-store.mjs';

export function existingWorldNeedsSaveBeforeCaveSwitch(storage,world,changed=false){
 if(!storage||typeof storage.getItem!=='function'||!world||!Number.isInteger(world.seed))
  throw Error('Original world preflight unavailable');
 return changed===true||Number(world.edits?.size||0)>0||
  Number(world.pack2Cells?.size||0)>0||
  storage.getItem(worldSlotKey(world.seed))!==null;
}
// Newly visited, unedited starter worlds must NOT gain a fabricated canonical
// save just because the player opened a completely separate Cave World.
export function rejectLegacyWorldWhereCaveExists(storage,seed){
 if(!storage||typeof storage.getItem!=='function')
  throw Error('Storage preflight required for switching worlds');
 const key=caveProfileStorageKey(seed);
 if([key,key+'.journal',key+'.backup'].some(k=>storage.getItem(k)!==null))
  throw Error('Seed '+seed+' belongs to a protected Cave World. Choose LOAD CAVE PROFILE or another seed.');
 return true;
}
export function prepareExplicitCaveWorld(storage,seed,{action,approved=false}={}){
 if(approved!==true)throw Error('Explicit player confirmation required for cave world selection');
 if(action!=='create'&&action!=='load')throw Error('Choose CREATE CAVE or LOAD CAVE explicitly');
 const response=action==='create'?
  createStagedCaveProfile(storage,seed,{approved:true}):
  loadStagedCaveProfile(storage,seed,{approved:true});
 const runtime=response.runtime;
 if(runtime?.profile!==CAVE_PROFILE_KIND||
    !(runtime.world?.base instanceof CaveVoxelWorld)||
    runtime.world.seed!==seed||runtime.registeredInHomeScreen!==false||
    runtime.entrancePlan?.entrances?.length!==4)
  throw Error('Incomplete cave runtime refused at actual game startup');
 return Object.freeze({runtime,world:runtime.world,
  recovery:response.recovery??null,needsCommit:response.needsCommit??false,
  seed,profile:CAVE_PROFILE_KIND,created:action==='create'});
}
export function saveExplicitCaveWorld(storage,selection,{approved=false}={}){
 if(approved!==true)throw Error('Explicit cave save requested without profile selection');
 if(selection?.profile!==CAVE_PROFILE_KIND||
    !selection?.runtime||selection.world!==selection.runtime.world||
    !(selection.world.base instanceof CaveVoxelWorld))
  throw Error('Refusing to save ordinary world into cave sidecar');
 // Do not let legacy Pack2, Pack3 or manual-scene sidecars silently affect
 // what the separate cave profile claims is persisted.
 if(selection.world.pack2Cells?.size)
  throw Error('Cave profile cannot yet persist Pack2 overlays. Remove them before cave SAVE.');
 return saveStagedCaveProfile(storage,selection.runtime,{approved:true});
}
