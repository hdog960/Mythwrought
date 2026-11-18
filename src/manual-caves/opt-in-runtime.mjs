// C5: opt-in cave world through the authentic Pack2 game-world wrapper (#240).
// Staging API ONLY. No main.mjs, HTML, seed selector, PWA, startup, storage
// schema or main branch registration; explicitly approved *new* cave worlds.
import {VoxelWorld,worldKey} from '../voxel.mjs';
import {Pack2LiveWorld} from '../pack2-world.mjs';
import {CAVE_PROFILE_KIND,CaveVoxelWorld} from './cave-voxel-world.mjs';
import {planNewCaveEntrances} from './entrance-preflight.mjs';
import {planSpiralSurfaceTransition,inspectSpiralSurfaceTransition} from './surface-transition.mjs';

function attachVerifiedEntrances(base){
  if(!(base instanceof CaveVoxelWorld))throw Error('Expected genuine opt-in CaveVoxelWorld');
  // The historical surface landscape is read only. Actual cave base already
  // owns every candidate below the protected -3 floor; source conflicts fail.
  const plan=planNewCaveEntrances({world:new VoxelWorld(base.seed),
    sourceCells:base.caveCellMap,approved:true});
  if(!plan.ok)throw Error('New cave surface entrances not safe: '+JSON.stringify(plan.failures));
  for(const [key,id] of plan.cells){
    if(base.caveCellMap.has(key)&&base.caveCellMap.get(key)!==id)
      throw Error('Portal would overwrite authored cave geometry at '+key);
  }
  const collar=planSpiralSurfaceTransition({seed:base.seed,
    baseWorld:new VoxelWorld(base.seed),portals:plan.cells,
    forbiddenCells:base.caveEastCells,approved:true});
  if(!collar.ok)throw Error('Historical deep spiral surface seam is unsafe: '+
    JSON.stringify(collar.conflicts?.slice(0,3)??collar.reason));
  const combined=new Map(plan.cells);
  for(const [key,id] of collar.cells){
    if(combined.has(key)&&combined.get(key)!==id)
      throw Error('Source portal/collar AIR/STONE collision at '+key);
    combined.set(key,id);
  }
  base.cavePortalCells=combined;
  const collarInspect=inspectSpiralSurfaceTransition(base,collar);
  if(!collarInspect.ok)throw Error('Unwalkable cave entrance-to-spiral seam: '+
    JSON.stringify(collarInspect.bad));
  base.cavePlanReport=Object.freeze({...base.cavePlanReport,
    surfaceTransitionConnected:true,
    surfaceTransitionCells:collar.cells.size,
    surfaceTransitionSteps:collar.sourceSteps,
    entrancesConnected:true,productionRegistered:false,
    entranceSites:Object.freeze(plan.entrances.map(x=>Object.freeze({
      name:x.name,mouth:x.mouth,steps:x.route.length
    })))});
  // Direct production Pack 2 wrapper: real raycast, collision, mesh and block
  // edits all now read from the same source-of-truth get().
  return Object.freeze({world:new Pack2LiveWorld(base),profile:CAVE_PROFILE_KIND,
    entrancePlan:plan,registeredInHomeScreen:false});
}
export function createStagedCaveRuntime(seed,storage,{approved=false}={}){
  const base=new CaveVoxelWorld(seed,{approved,storage});
  return attachVerifiedEntrances(base);
}
export function restoreStagedCaveRuntime(payload,{approved=false,profile}={}){
  if(approved!==true||profile!==CAVE_PROFILE_KIND)
    throw Error('Cave profile restore requires explicit matching new-world marker');
  const base=CaveVoxelWorld.restore(payload,{approved:true});
  return attachVerifiedEntrances(base);
}
