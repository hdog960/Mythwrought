/**
 * Builder-roadmap-compatible read-only dependency handoff.
 * Every physical box comes directly from the 18 approved source descriptors.
 * Does not place a building, register numeric IDs or edit another roadmap.
 */
import {orientedParts,rotateCellOffset} from '../block-packs/pack-5/fixture.mjs';
import {resolvePack5BuilderAsset} from './catalog.mjs';
import {PACK5_BUILDER_SIDECAR} from './construction-layer.mjs';
const directions=Object.freeze({north:0,east:1,south:2,west:3,none:0});
const integerCell=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isSafeInteger);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const key=v=>v.join(',');
const finiteWorld=v=>v.every(Number.isFinite);
export function resolvePack5BlueprintPhysical(placement,{origin=[0,0,0]}={}){
  if(!placement||typeof placement!=='object'||!integerCell(placement.at)||!integerCell(origin))
    throw Error('Invalid Pack 5 physical blueprint cell');
  const orientation=placement.orientation??'north';
  const rotation=Number.isInteger(orientation)?orientation:directions[orientation];
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw Error('Unresolved or unsupported Pack 5 orientation');
  const {descriptor,variant}=resolvePack5BuilderAsset(placement.asset,placement.variant??null);
  const anchor=add(origin,placement.at);
  if(!integerCell(anchor))throw Error('Pack 5 physical anchor overflows integer coordinate');
  const parts=orientedParts(descriptor,rotation);
  const occupied=[],visible=[],collision=[];
  for(const p of parts){
    const cell=add(anchor,p.cell);
    if(!integerCell(cell))throw Error('Pack 5 physical part overflows integer coordinate');
    occupied.push(Object.freeze(cell));
    for(const b of p.boxes){
      const box=b.map((n,i)=>n+cell[i%3]);
      if(!finiteWorld(box))throw Error('Invalid physical box');
      visible.push(Object.freeze(box));
    }
    for(const b of p.collisionBoxes){
      const box=b.map((n,i)=>n+cell[i%3]);
      if(!finiteWorld(box))throw Error('Invalid physical collider');
      collision.push(Object.freeze(box));
    }
  }
  const supports=[];
  if(descriptor.attachment==='floor')
    for(const cell of occupied)supports.push([cell[0],cell[1]-1,cell[2]]);
  if(descriptor.attachment==='ceiling')supports.push(add(anchor,[0,1,0]));
  if(descriptor.attachment==='wall')
    supports.push(add(anchor,rotateCellOffset([0,0,-1],rotation)));
  return Object.freeze({
    asset:placement.asset,sourcePack:5,variant,rotation,
    anchor:Object.freeze(anchor),attachment:descriptor.attachment,
    physical:Object.freeze({
      hasRealPhysicalGeometry:true,
      occupiedCells:Object.freeze(occupied),
      visible:Object.freeze(visible),
      collision:Object.freeze(collision),
      selection:Object.freeze(visible),
      requiredSupports:Object.freeze(supports.map(c=>Object.freeze(c))),
      supportVerified:false
    }),
    numericId:null,saveCodec:PACK5_BUILDER_SIDECAR,
    productionPlacement:false,worldPlaced:false
  });
}
export function planPack5BuilderBlueprint(blueprint,{origin=[0,0,0],maxInstances=4096}={}){
  if(!blueprint||typeof blueprint!=='object'||!Array.isArray(blueprint.placements)||
     !blueprint.placements.length||!integerCell(origin)||
     !Number.isSafeInteger(maxInstances)||maxInstances<1||
     blueprint.placements.length>maxInstances)
    throw Error('Invalid Pack 5 blueprint request');
  const occupied=new Set(),resolved=[];
  for(const input of blueprint.placements){
    // A Pack 5 resolver NEVER claims symbols owned by Packs 1–4 or biome130.
    if(typeof input?.asset!=='string'||!/^pack5:0(?:7[9]|8\d|9[0-6])$/.test(input.asset))
      throw Error('Foreign/unresolved symbol cannot be claimed by Pack 5');
    const asset=resolvePack5BlueprintPhysical(input,{origin});
    for(const cell of asset.physical.occupiedCells){
      const k=key(cell);
      if(occupied.has(k))throw Error('Pack 5 blueprint has overlapping multi-cell geometry');
      occupied.add(k);
    }
    resolved.push(asset);
  }
  return Object.freeze({id:blueprint.id??null,physicalSource:'pack5:079–096',
    resolvedCount:resolved.length,occupiedCount:occupied.size,
    placements:Object.freeze(resolved),worldPlaced:false,saveWritten:false});
}

/**
 * Non-destructive adapter for building-roadmap blueprints that contain materials
 * from other packs. Emits Pack 5 dependencies without claiming ownership of
 * foreign symbols, assigning IDs, or inventing orientation/variant choices.
 * Returns unresolved requirements rather than incorrectly "finishing" a build.
 */
export function inspectPack5InMixedBlueprint(blueprint,{origin=[0,0,0]}={}){
  if(!blueprint||typeof blueprint!=='object'||!integerCell(origin))
    throw Error('Invalid mixed blueprint request');
  const source=Array.isArray(blueprint.placements)?blueprint.placements:
    Array.isArray(blueprint.voxels)?blueprint.voxels:null;
  if(!source)throw Error('Mixed blueprint must contain placements or voxels');
  const pack5=[],pending=[],foreign=new Set(),foreignCount=new Map();
  for(let i=0;i<source.length;i++){
    const item=source[i];
    if(!item||typeof item!=='object')throw Error('Invalid mixed blueprint placement');
    const asset=item.asset??item.material;
    if(typeof asset!=='string'||!asset.startsWith('pack5:')){
      if(typeof asset==='string'){
        foreign.add(asset);foreignCount.set(asset,(foreignCount.get(asset)||0)+1);
      }
      continue;
    }
    if(!/^pack5:0(?:7[9]|8\d|9[0-6])$/.test(asset))
      throw Error('Pack 5 blueprint symbol outside assigned 079–096 ownership');
    const at=Array.isArray(item.at)?item.at:[item.x,item.y,item.z];
    if(!integerCell(at))throw Error('Invalid Pack 5 blueprint placement cell');
    const orientation=item.orientation??item.intendedFacing??null;
    const variant=item.variant??null;
    const missing=[];
    if(!(Number.isInteger(orientation)&&orientation>=0&&orientation<=3)&&
       !['north','east','south','west'].includes(orientation))
      missing.push('explicit-four-way-orientation');
    const family=resolvePack5BuilderAsset(asset);
    if(variant===null||!family.entry.variants.includes(variant))
      missing.push('authored-variant');
    if(missing.length){
      pending.push(Object.freeze({placementIndex:i,asset,at:Object.freeze([...at]),
        missing:Object.freeze(missing)}));
      continue;
    }
    pack5.push({asset,at,orientation,variant});
  }
  const physicalPlan=pending.length===0&&pack5.length?
    planPack5BuilderBlueprint({id:blueprint.id??null,placements:pack5},{origin}):null;
  return Object.freeze({
    blueprintId:blueprint.id??null,
    pack5Total:pack5.length+pending.length,
    resolvedPack5Count:physicalPlan?.resolvedCount??0,
    unresolvedPack5:Object.freeze(pending),
    externalDependencies:Object.freeze([...foreign].sort()),
    externalDependencyCounts:Object.freeze(Object.fromEntries(
      [...foreignCount].sort(([a],[b])=>a.localeCompare(b)))),
    physicalPlan,worldPlaced:false,readyForCombinedPlacement:false,
    requiresOtherPackResolvers:foreign.size>0,
    requiresCrossPackCollisionAndSupportValidation:true
  });
}
