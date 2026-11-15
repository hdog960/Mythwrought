/**
 * Pack 5-owned, read-only builder preflight for a future coordinated five-pack
 * settlement integration. Validates the *actual* authored physical footprint
 * against legacy terrain and externally supplied occupied cells.
 *
 * This module never changes the source blueprint, world, save, numeric registry
 * or any foreign pack. Successful preflight is NOT authorization to place.
 */
import {BLOCK} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {resolvePack5BlueprintPhysical} from './blueprint-handoff.mjs';

const cellValid=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isSafeInteger);
const boxValid=v=>Array.isArray(v)&&v.length===6&&v.every(Number.isFinite)&&
  v.slice(0,3).every((n,i)=>n<v[i+3]);
const key=v=>v.join(',');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function occupiedSet(cells,label){
  if(cells===null)return null;
  if(!Array.isArray(cells)||cells.length>100000)
    throw Error('Invalid '+label+' occupancy list');
  const set=new Set();
  for(const cell of cells){
    if(!cellValid(cell))throw Error('Invalid '+label+' occupancy coordinate');
    set.add(key(cell));
  }
  return set;
}
export function preflightPack5BuilderPlan(plan,{world,
  foreignOccupiedCells=null,existingPack5Cells=null,
  verifiedStructuralSupports=null}={}){
  if(!plan||typeof plan!=='object'||!Array.isArray(plan.placements)||
    plan.placements.length<1||plan.placements.length>4096||
    plan.worldPlaced!==false||plan.saveWritten!==false||
    !world||typeof world.get!=='function'||!Number.isSafeInteger(world.seed))
    throw Error('Invalid read-only Pack 5 builder preflight');
  const foreign=occupiedSet(foreignOccupiedCells,'foreign-pack');
  const existing=occupiedSet(existingPack5Cells,'existing-Pack5');
  const structural=occupiedSet(verifiedStructuralSupports,'certified-structural-support');
  const issues=[],seen=new Set();
  const add=(kind,asset,at)=>issues.push(Object.freeze({
    kind,asset,cell:Object.freeze([...at])
  }));
  let checks=0,supportChecks=0;
  for(const placement of plan.placements){
    if(!placement||placement.sourcePack!==5||placement.numericId!==null||
      placement.productionPlacement!==false||placement.worldPlaced!==false||
      typeof placement.asset!=='string'||!cellValid(placement.anchor)||
      !Number.isInteger(placement.rotation)||placement.rotation<0||placement.rotation>3||
      !placement.physical||placement.physical.hasRealPhysicalGeometry!==true||
      !Array.isArray(placement.physical.occupiedCells)||
      !Array.isArray(placement.physical.requiredSupports)||
      !Array.isArray(placement.physical.visible)||
      !Array.isArray(placement.physical.collision)||
      !Array.isArray(placement.physical.selection))
      throw Error('Invalid Pack 5 physical placement handoff');
    // Recreate each descriptor from the canonical physical catalog; never
    // trust coordinates or collision shapes copied into a foreign blueprint.
    const exact=resolvePack5BlueprintPhysical({
      asset:placement.asset,at:placement.anchor,
      orientation:placement.rotation,variant:placement.variant
    });
    for(const field of ['occupiedCells','requiredSupports','visible','collision','selection'])
      if(!same(placement.physical[field],exact.physical[field]))
        throw Error('Pack 5 physical handoff differs from source geometry: '+field);
    for(const box of placement.physical.collision)
      if(!boxValid(box))throw Error('Invalid Pack 5 source collider');
    for(const at of placement.physical.occupiedCells){
      const cellKey=key(at);checks++;
      if(seen.has(cellKey))add('pack5-plan-overlap',placement.asset,at);
      seen.add(cellKey);
      if(at[1]<WORLD_MIN_Y||at[1]>WORLD_MAX_Y){
        add('out-of-world-bounds',placement.asset,at);continue;
      }
      const legacy=world.get(...at);
      if(!Number.isSafeInteger(legacy)||legacy<BLOCK.AIR)
        throw Error('Invalid registered block ID in Pack 5 builder world');
      if(legacy>BLOCK.DEEPSTONE)
        add('registered-world-occupied',placement.asset,at);
      else if(legacy!==BLOCK.AIR)
        add('legacy-occupied',placement.asset,at);
      if(foreign?.has(cellKey))add('foreign-pack-occupied',placement.asset,at);
      if(existing?.has(cellKey))add('existing-pack5-occupied',placement.asset,at);
    }
    for(const at of placement.physical.requiredSupports){
      supportChecks++;
      if(!cellValid(at))throw Error('Invalid Pack 5 support coordinate');
      if(at[1]<WORLD_MIN_Y||at[1]>WORLD_MAX_Y){
        add('support-out-of-bounds',placement.asset,at);continue;
      }
      const legacy=world.get(...at);
      if(!Number.isSafeInteger(legacy)||legacy<BLOCK.AIR)
        throw Error('Invalid registered support block');
      if(legacy>BLOCK.DEEPSTONE&&!structural?.has(key(at)))
        add('unverified-registered-support',placement.asset,at);
      if(legacy===BLOCK.AIR&&!structural?.has(key(at)))
        add('unverified-support',placement.asset,at);
      // An explicit support proof may describe an incoming *structural*
      // cross-pack block not yet installed in this world's legacy grid.
      // Generic foreign occupancy is never treated as that proof.
    }
  }
  return Object.freeze({
    placementCount:plan.placements.length,
    occupiedCellChecks:checks,supportCellChecks:supportChecks,
    verifiedForeignOccupancy:foreign!==null,
    verifiedExistingPack5Occupancy:existing!==null,
    verifiedStructuralSupportEvidence:structural!==null,
    issues:Object.freeze(issues),
    // A dry run cannot be pronounced clear while any externally owned
    // occupied-cell registry was omitted. This prevents Pack 5 from
    // prematurely approving a layout that overlaps a future Pack 1–4 shape.
    pack5OnlyDryRunClear:issues.length===0&&foreign!==null&&existing!==null,
    crossPackPhysicalAcceptance:false,
    globalNumericIdsAssigned:false,
    worldPlaced:false,saveWritten:false,
    integrationReady:false
  });
}
