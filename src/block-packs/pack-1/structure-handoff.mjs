// Pack 1-owned, opt-in physical builder ABI for coordinated five-pack integration.
// Mirrors the source-authored builder blueprint fields but NEVER registers/places live blocks.
import {PACK1_BUILDER_CATALOG,resolvePack1BuilderFamily,
  pack1BuilderPlacementPlan,pack1InteractionReaderShapes} from './builder-handoff.mjs';
import {PACK1_WORLD_BOUNDS,compilePack1Construction,inspectPack1Construction} from './construction-stress.mjs';
const TURNS=Object.freeze({north:0,east:1,south:2,west:3,none:0});
const FACES=Object.freeze(['north','east','south','west']);
const BY_ID=new Map(PACK1_BUILDER_CATALOG.map(d=>[d.id,d]));
export const PACK1_BUILDER_SYMBOLS=Object.freeze([...new Set(PACK1_BUILDER_CATALOG.map(e=>e.symbolicRef))].sort());
export const PACK1_BUILDER_IDS=Object.freeze(PACK1_BUILDER_CATALOG.map(e=>e.id));
export const PACK1_BUILDER_AVAILABILITY=Object.freeze({
  physicalGeometry:true,deterministicFutureBlueprints:true,
  liveGameRegistry:false,playerPlacement:false,schema1BlockIdsExtended:false,
  saveMetadataPersisted:false,worldPlacement:false,builderUsableForDesign:true,
  requiresLiveIntegration:true,creatorArtApproved:false,physicalIPhoneVerified:false
});
const coordinates=at=>Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger)&&
  at.every(n=>Math.abs(n)<=1000000);
function yawOf(orientation){
  if(Number.isInteger(orientation)&&orientation>=0&&orientation<=3)return orientation;
  if(typeof orientation==='string'&&Object.hasOwn(TURNS,orientation))return TURNS[orientation];
  throw new RangeError('Invalid Pack 1 builder orientation');
}
export function resolvePack1BuilderAsset(symbol,orientation='north',{candidateId=null,variant='lower'}={}){
  const yaw=yawOf(orientation);
  const s=resolvePack1BuilderFamily(symbol,{candidateId,rotation:yaw,variant});
  const readers=pack1InteractionReaderShapes(s.id,{rotation:yaw,variant});
  return Object.freeze({
    symbol,blockId:s.id,roster:s.roster,name:s.name,yaw,variant:s.variant,
    sourcePack:1,physical:true,worldRegistered:false,livePlaceable:false,
    candidateOnly:true,builderUsable:true,
    attachment:s.support,
    requiresOrientationSidecar:s.requiresOrientationSidecar,
    requiresVariantPersistence:s.requiresVariantPersistence,
    shape:s.shape,selection:s.selection,collision:s.collision,parts:s.parts,
    targetShape:readers.targetShape,collisionShape:readers.collisionShape,
    isPassable:readers.isPassable
  });
}
export function planPack1BuilderStructure(placements,{origin=[0,0,0],maxCells=4096}={}){
  if(!coordinates(origin)||!Array.isArray(placements)||!placements.length||
     !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>4096||
     placements.length>maxCells)
    throw new RangeError('Invalid Pack 1 construction blueprint');
  const occupied=new Set(),cells=[],worldBoxes=[];
  for(const p of placements){
    if(!p||!coordinates(p.at))throw new TypeError('Invalid Pack 1 builder local cell');
    const cell=p.at.map((v,i)=>v+origin[i]);
    if(!coordinates(cell)||cell[1]<PACK1_WORLD_BOUNDS.minY||
       cell[1]>PACK1_WORLD_BOUNDS.maxY)
      throw new RangeError('Pack 1 builder cell outside current world vertical bounds');
    const key=cell.join(',');
    if(occupied.has(key))throw new Error('Duplicate Pack 1 blueprint cell');
    occupied.add(key);
    const asset=resolvePack1BuilderAsset(p.asset,p.orientation??'north',{
      candidateId:p.candidateId??null,variant:p.variant??'lower'});
    const face=p.wallFace??null;
    if(face!==null&&!FACES.includes(face))throw new RangeError('Invalid wall mount face');
    if(asset.attachment==='vertical-face'&&face===null)
      throw new Error('Wall-mounted Pack 1 asset needs a named supporting face');
    if(asset.attachment!=='vertical-face'&&face!==null)
      throw new Error('Pack 1 wall metadata on non-mounted asset');
    const placement=pack1BuilderPlacementPlan(asset.blockId,{
      cell,rotation:asset.yaw,variant:asset.variant,wallMounted:face!==null});
    if(!placement.ok)throw new Error('Invalid Pack 1 placement plan');
    cells.push(Object.freeze({
      at:Object.freeze(cell),asset:asset.symbol,blockId:asset.blockId,
      yaw:asset.yaw,variant:asset.variant,wallFace:face,shape:asset.shape,
      targetShape:asset.targetShape,collisionShape:asset.collisionShape,
      isPassable:asset.isPassable,
      requiresOrientationSidecar:asset.requiresOrientationSidecar,
      requiresVariantPersistence:asset.requiresVariantPersistence,
      requiresSupportValidation:face!==null
    }));
    for(const part of asset.parts){
      worldBoxes.push(Object.freeze({
        at:Object.freeze(cell),asset:asset.symbol,blockId:asset.blockId,
        role:part.role,
        box:Object.freeze(part.box.map((v,i)=>v+cell[i%3]))
      }));
    }
  }
  return Object.freeze({
    kind:'physical-pack1-construction-blueprint',actualGeometry:true,
    builderReadyForDesign:true,livePlaced:false,saveWritten:false,
    requiresSharedEngineRegistration:true,needsPhysicalIPhoneVerification:true,
    cells:Object.freeze(cells),worldBoxes:Object.freeze(worldBoxes)
  });
}
// Opt-in DRY-RUN bridge from authoring blueprint to the separately persisted
// schema-1 compatibility simulation. Never write into the game's VoxelWorld.
export function compilePack1BuilderSnapshot(blueprint,{
  existingSave=null,seed=null,existingEdits=[],existingPack1State=null
}={}){
  if(!blueprint||blueprint.kind!=='physical-pack1-construction-blueprint'||
     !Array.isArray(blueprint.cells)||!blueprint.cells.length||
     blueprint.cells.length>4096)
    throw new TypeError('Not a valid Pack 1 physical blueprint');
  const placements=[];
  for(const row of blueprint.cells){
    if(!row||!coordinates(row.at)||!BY_ID.has(row.blockId))
      throw new TypeError('Invalid Pack 1 blueprint cell');
    const chosen=resolvePack1BuilderAsset(row.asset,row.yaw,{
      candidateId:row.blockId,variant:row.variant});
    if(chosen.blockId!==row.blockId)throw new Error('Pack 1 blueprint asset drift');
    placements.push({
      cell:row.at,symbolicRef:row.asset,candidateId:row.blockId,
      rotation:chosen.yaw,variant:chosen.variant,wallFace:row.wallFace
    });
  }
  const previous=existingPack1State===null?0:
    inspectPack1Construction({world:existingSave,pack1State:existingPack1State}).pack1Count;
  const snapshot=compilePack1Construction(placements,{
    existingSave,seed,existingEdits,existingPack1State
  });
  const verified=inspectPack1Construction(snapshot);
  if(verified.pack1Count!==previous+blueprint.cells.length)
    throw new Error('Pack 1 blueprint count mismatch after restoring source geometry');
  return snapshot;
}
