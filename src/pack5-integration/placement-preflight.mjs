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
export const PACK5_PREFLIGHT_MAX_COLLIDER_BOXES=32768;

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const boxesOverlap=(a,b)=>a[0]<b[3]&&a[3]>b[0]&&
  a[1]<b[4]&&a[4]>b[1]&&a[2]<b[5]&&a[5]>b[2];
const containsBox=(outer,inner)=>outer.slice(0,3).every((n,i)=>
  n<=inner[i]&&outer[i+3]>=inner[i+3]);
const boxCells=box=>{
  if(!boxValid(box)||box.some(n=>Math.abs(n)>1e9))
    throw Error('Invalid source-external physical collider');
  const lo=box.slice(0,3).map(Math.floor),
    hi=box.slice(3).map(n=>Math.ceil(n)-1);
  if([...lo,...hi].some(n=>!Number.isSafeInteger(n))||
     lo.some((n,i)=>hi[i]-n>31)||
     (hi[0]-lo[0]+1)*(hi[1]-lo[1]+1)*(hi[2]-lo[2]+1)>4096)
    throw Error('Foreign collider requires bounded spatial proof');
  return {lo,hi};
};
function colliderIndex(boxes,label){
  if(boxes===null)return null;
  if(!Array.isArray(boxes)||boxes.length>PACK5_PREFLIGHT_MAX_COLLIDER_BOXES)
    throw Error('Invalid '+label+' physical collision registry');
  const cells=new Map();let indexed=0;
  for(const box of boxes){
    const {lo,hi}=boxCells(box);
    for(let x=lo[0];x<=hi[0];x++)
      for(let y=lo[1];y<=hi[1];y++)
        for(let z=lo[2];z<=hi[2];z++){
          if(++indexed>250000)
            throw Error('Pack 5 external collision index budget exceeded');
          const k=key([x,y,z]);
          if(!cells.has(k))cells.set(k,[]);
          cells.get(k).push(box);
        }
  }
  return cells;
}
function collidesExternal(index,shape){
  if(index===null)return false;
  const {lo,hi}=boxCells(shape),visited=new Set();
  for(let x=lo[0];x<=hi[0];x++)
    for(let y=lo[1];y<=hi[1];y++)
      for(let z=lo[2];z<=hi[2];z++)
        for(const external of index.get(key([x,y,z]))??[]){
          if(visited.has(external))continue;
          visited.add(external);
          if(boxesOverlap(shape,external))return true;
        }
  return false;
}
/**
 * Read-only exact Pack 5 collision geometry. For large settlements, supply a
 * world-space query AABB that covers the target builder plan (with its real
 * physical colliders), so a small house does not allocate the full world's
 * collider array on an iPhone. Never truncate silently: oversize requests
 * fail closed. A caller must attest that its query bounds cover the plan.
 */
export function collectPack5PlacedCollisionBoxes(layer,{bounds=null}={}){
  if(!layer||typeof layer.list!=='function'||typeof layer.count!=='function')
    throw Error('Invalid Pack 5 collision source');
  if(bounds!==null&&(!boxValid(bounds)||
    bounds.some(n=>Math.abs(n)>1e9)||
    bounds.slice(0,3).some((n,i)=>bounds[i+3]-n>256)))
    throw Error('Pack 5 collision extraction bounds must be finite and local');
  const rows=layer.list();
  if(!Array.isArray(rows)||rows.length!==layer.count()||rows.length>4096)
    throw Error('Invalid Pack 5 collision source count');
  const boxes=[];
  for(const row of rows){
    const resolved=resolvePack5BlueprintPhysical({
      asset:row.symbolicId,at:row.anchor,
      orientation:row.rotation,variant:row.variant
    });
    for(const box of resolved.physical.collision){
      if(bounds!==null&&!boxesOverlap(box,bounds))continue;
      boxCells(box);
      if(boxes.length>=PACK5_PREFLIGHT_MAX_COLLIDER_BOXES)
        throw Error('Pack 5 collision extraction budget exceeded; query smaller bounds');
      boxes.push(Object.freeze([...box]));
    }
  }
  // This is source-owned provenance for a region-scoped export, not a claim
  // about foreign-pack collider completeness. Consumers must check coverage
  // against the entire proposed plan before treating this export as clearance.
  Object.defineProperty(boxes,'coverageBounds',{
    value:bounds===null?null:Object.freeze([...bounds]),enumerable:false
  });
  return Object.freeze(boxes);
}

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
  verifiedStructuralSupports=null,
  foreignCollisionBoxes=null,existingPack5CollisionBoxes=null}={}){
  if(!plan||typeof plan!=='object'||!Array.isArray(plan.placements)||
    plan.placements.length<1||plan.placements.length>4096||
    plan.worldPlaced!==false||plan.saveWritten!==false||
    !world||typeof world.get!=='function'||!Number.isSafeInteger(world.seed))
    throw Error('Invalid read-only Pack 5 builder preflight');
  const foreign=occupiedSet(foreignOccupiedCells,'foreign-pack');
  const existing=occupiedSet(existingPack5Cells,'existing-Pack5');
  const structural=occupiedSet(verifiedStructuralSupports,'certified-structural-support');
  const foreignShapes=colliderIndex(foreignCollisionBoxes,'foreign-pack');
  const existingShapes=colliderIndex(existingPack5CollisionBoxes,'existing-Pack5');
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
    if(placement.physical.collision.some(box=>collidesExternal(foreignShapes,box)))
      add('foreign-shape-overlap',placement.asset,placement.anchor);
    if(placement.physical.collision.some(box=>collidesExternal(existingShapes,box)))
      add('existing-pack5-shape-overlap',placement.asset,placement.anchor);
    // Scope information cannot be lost when the producer's regional export
    // is passed directly. A room only clears if every source-authored collider
    // in the proposed plan is fully covered by that existing-object query.
    const queryBounds=existingPack5CollisionBoxes?.coverageBounds;
    if(queryBounds!==undefined&&queryBounds!==null&&
       placement.physical.collision.some(box=>!containsBox(queryBounds,box)))
      add('existing-pack5-query-scope-incomplete',placement.asset,placement.anchor);
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
      if(legacy===BLOCK.AIR){
        if(!structural?.has(key(at)))
          add('unverified-support',placement.asset,at);
        else if(!foreign?.has(key(at)))
          add('certified-support-not-occupied',placement.asset,at);
      }
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
    providedForeignCollisionBoxes:foreignShapes!==null,
    providedExistingPack5CollisionBoxes:existingShapes!==null,
    issues:Object.freeze(issues),
    // A dry run cannot be pronounced clear while any externally owned
    // occupied-cell registry was omitted. This prevents Pack 5 from
    // prematurely approving a layout that overlaps a future Pack 1–4 shape.
    pack5OnlyDryRunClear:issues.length===0&&foreign!==null&&existing!==null,
    shapeAwareDryRunClear:issues.length===0&&foreign!==null&&existing!==null&&
      foreignShapes!==null&&existingShapes!==null,
    crossPackPhysicalAcceptance:false,
    globalNumericIdsAssigned:false,
    worldPlaced:false,saveWritten:false,
    integrationReady:false
  });
}

/**
 * Source-owned handoff convenience: build every existing-Pack5 occupancy and
 * physical-collision input from the SAME real sidecar, in a region computed
 * from ALL of the proposed Pack5 source-occupied cells and colliders.
 * This prevents integrator mistakes in copied regional AABB/cell lists.
 * Other packs must still provide their own authoritative foreign evidence.
 */
export function preflightPack5BuilderAgainstOwnedLayer(plan,{
  world,existingLayer,foreignOccupiedCells=null,foreignCollisionBoxes=null,
  verifiedStructuralSupports=null
}={}){
  if(!world||!Number.isSafeInteger(world.seed)||!existingLayer||
     existingLayer.seed!==world.seed||typeof existingLayer.list!=='function'||
     typeof existingLayer.count!=='function'||!plan||
     !Array.isArray(plan.placements)||plan.placements.length<1||
     plan.placements.length>4096)
    throw Error('Invalid or cross-seed Pack 5 owned-layer preflight');
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  const include=box=>{
    if(!boxValid(box))throw Error('Invalid Pack 5 planned physical region');
    for(let i=0;i<3;i++){
      lo[i]=Math.min(lo[i],box[i]);
      hi[i]=Math.max(hi[i],box[i+3]);
    }
  };
  for(const row of plan.placements){
    if(!row||!cellValid(row.anchor))throw Error('Invalid source plan anchor');
    const exact=resolvePack5BlueprintPhysical({
      asset:row.asset,at:row.anchor,
      orientation:row.rotation,variant:row.variant
    });
    for(const cell of exact.physical.occupiedCells)
      include([...cell,cell[0]+1,cell[1]+1,cell[2]+1]);
    for(const box of exact.physical.collision)include(box);
  }
  const bounds=[...lo,...hi];
  if(bounds.some(n=>!Number.isFinite(n))||
     lo.some((v,i)=>hi[i]-v>256))
    throw Error('Pack 5 owned-layer preflight region too large; split construction');
  const existingPack5CollisionBoxes=collectPack5PlacedCollisionBoxes(
    existingLayer,{bounds});
  const existingCells=new Set(),rows=existingLayer.list();
  if(!Array.isArray(rows)||rows.length!==existingLayer.count()||rows.length>4096)
    throw Error('Invalid Pack 5 existing layer occupancy');
  for(const row of rows){
    const exact=resolvePack5BlueprintPhysical({
      asset:row.symbolicId,at:row.anchor,
      orientation:row.rotation,variant:row.variant
    });
    for(const cell of exact.physical.occupiedCells){
      const box=[...cell,cell[0]+1,cell[1]+1,cell[2]+1];
      if(boxesOverlap(bounds,box))existingCells.add(key(cell));
    }
  }
  const existingPack5Cells=[...existingCells].sort().map(s=>s.split(',').map(Number));
  const result=preflightPack5BuilderPlan(plan,{
    world,foreignOccupiedCells,existingPack5Cells,verifiedStructuralSupports,
    foreignCollisionBoxes,existingPack5CollisionBoxes
  });
  return Object.freeze({...result,
    existingPack5SourceVerified:true,
    checkedRegion:Object.freeze(bounds),
    existingPack5CollisionBoxCount:existingPack5CollisionBoxes.length,
    existingPack5OccupiedCellCount:existingPack5Cells.length
  });
}
