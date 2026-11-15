// Block Pack 2's read-only, five-pack construction dependency ABI.
// Symbols are roster keys, NOT provisional production block IDs.
// Mirrors the existing Pack 3 builder adapter contract without importing or
// changing Pack 3, other packs, settlement blueprints, saves or world generation.
import {PACK2_LIVE_IDS,pack2Spec,pack2NormalizeState,
  pack2ShapeOf,pack2AuthoredMesh} from '../pack2-integration.mjs';

const symbolFor=roster=>'pack2:'+String(roster).padStart(3,'0');
const items=Object.freeze(PACK2_LIVE_IDS.map(id=>{
  const spec=pack2Spec(id);
  if(!spec||!Number.isInteger(spec.roster))throw Error('Missing approved Pack 2 roster');
  return Object.freeze({symbol:symbolFor(spec.roster),blockId:id,
    roster:spec.roster,name:spec.name});
}).sort((a,b)=>a.roster-b.roster));
const bySymbol=new Map(items.map(a=>[a.symbol,a]));
export const PACK2_BUILDER_SYMBOLS=Object.freeze(items.map(x=>x.symbol));
export const PACK2_BUILDER_IDS=Object.freeze(items.map(x=>x.blockId));
export const PACK2_BUILDER_AVAILABILITY=Object.freeze({
  physicalGeometry:true,creatorArtworkApproved:true,
  deterministicFutureBlueprints:true,oneCellParts:true,
  candidateLiveIntegrationInDraft:true,liveGameRegistry:false,
  livePlaceable:false,worldPlacement:false,
  legacySaveSchemaUnmodified:true,requiresCoordinatedFivePackIntegration:true,
  waterSimulation:false,gravityForGravel:false
});
if(items.length!==18||bySymbol.size!==18||
   new Set(PACK2_BUILDER_IDS).size!==18||
   PACK2_BUILDER_IDS.some(id=>id<59||id>76)||
   items.some(x=>!((x.roster>=13&&x.roster<=22)||(x.roster>=39&&x.roster<=46))))
  throw Error('Pack 2 symbolic construction roster changed');

const TURNS=Object.freeze({north:0,east:1,south:2,west:3,none:0});
function yawOf(value){
  if(Number.isInteger(value)&&value>=0&&value<=3)return value;
  if(typeof value==='string'&&Object.hasOwn(TURNS,value))return TURNS[value];
  throw new RangeError('Invalid Pack 2 builder orientation');
}
function coordinates(point){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isSafeInteger))
    throw new TypeError('Expected integer [x,y,z] builder coordinate');
  return point;
}
const safeBox=box=>Array.isArray(box)&&box.length===6&&
  box.every(Number.isFinite)&&
  [0,1,2].every(i=>box[i]>=0&&box[i]<box[i+3]&&box[i+3]<=1);

// The caller's symbolic roster is always the source of truth. Unknown state
// keys, invalid rotations, open states and water-source contradictions fail.
export function resolvePack2BuilderAsset(symbol,orientation='north',configuration={}){
  if(typeof symbol!=='string'||!/^pack2:\d{3}$/.test(symbol)||!bySymbol.has(symbol))
    throw new RangeError('Unknown Pack 2 construction symbol');
  if(!configuration||typeof configuration!=='object'||Array.isArray(configuration))
    throw new TypeError('Invalid Pack 2 construction state');
  const yaw=yawOf(orientation),row=bySymbol.get(symbol),id=row.blockId;
  const isWater=id===76;
  if(isWater&&yaw!==0)throw new RangeError('Fluid has no compass orientation');
  if(!isWater&&configuration.rotation!==undefined&&configuration.rotation!==yaw)
    throw new RangeError('Conflicting Pack 2 construction rotations');
  const requested=isWater?{...configuration}:{...configuration,rotation:yaw};
  if(requested.id!==undefined&&requested.id!==id)
    throw new RangeError('Builder roster and block ID disagree');
  const state=pack2NormalizeState(id,requested);
  if(Object.keys(requested).some(key=>!Object.hasOwn(state,key)))
    throw new TypeError('Unexpected Pack 2 builder state key');
  const shape=pack2ShapeOf(id,state);
  const mesh=pack2AuthoredMesh(id,state);
  if(!mesh||!Number.isInteger(mesh.triangles)||mesh.triangles<=0)
    throw Error('Approved Pack 2 authored mesh missing');
  const isFluid=id===76;
  if(isFluid){
    if(shape.boxes.length!==0||shape.solidCollision!==false||
       !Array.isArray(shape.broadPhaseBox)||shape.broadPhaseBox.length!==6)
      throw Error('Fluid must retain passable closed-prism geometry');
  }else if(!shape.boxes.length||!shape.boxes.every(safeBox)){
    throw Error('Missing/out-of-bounds physical Pack 2 solid geometry');
  }
  return Object.freeze({
    symbol,blockId:id,roster:row.roster,name:row.name,sourcePack:2,
    yaw:isWater?null:yaw,state,
    shape:Object.freeze({boxes:shape.boxes}),
    fluid:isFluid,fluidVolume:isFluid?shape.occupiedVolume:null,
    triangleCount:mesh.triangles,physical:true,builderUsable:true,
    worldRegistered:false,livePlaceable:false
  });
}
// Build physical blueprints using exact authored shapes and state. This is
// read-only: it does not register IDs, change the active world, create
// settlements, or write schema-1 / sidecar saves.
export function planPack2BuilderStructure(placements,{origin=[0,0,0],maxCells=4096}={}){
  coordinates(origin);
  if(!Array.isArray(placements)||placements.length===0||
      !Number.isSafeInteger(maxCells)||maxCells<1||placements.length>maxCells)
    throw new RangeError('Invalid Pack 2 blueprint size');
  const seen=new Set(),cells=[],worldBoxes=[],fluidVolumes=[];
  for(const placement of placements){
    if(!placement||typeof placement!=='object'||Array.isArray(placement))
      throw new TypeError('Invalid Pack 2 builder placement');
    const local=coordinates(placement.at);
    const cell=local.map((n,i)=>n+origin[i]);
    if(!cell.every(Number.isSafeInteger))throw new RangeError('Builder cell coordinate overflow');
    const key=cell.join(',');
    if(seen.has(key))throw new Error('Duplicate builder voxel cell');
    seen.add(key);
    const asset=resolvePack2BuilderAsset(
      placement.asset,placement.orientation??'north',placement.state??{});
    const at=Object.freeze(cell);
    cells.push(Object.freeze({at,asset:asset.symbol,blockId:asset.blockId,
      yaw:asset.yaw,state:asset.state,shape:asset.shape,fluid:asset.fluid}));
    for(const box of asset.shape.boxes)
      worldBoxes.push(Object.freeze({at,asset:asset.symbol,blockId:asset.blockId,
        box:Object.freeze(box.map((v,i)=>v+cell[i%3]))}));
    if(asset.fluid)
      fluidVolumes.push(Object.freeze({at,asset:asset.symbol,blockId:asset.blockId,
        volume:asset.fluidVolume}));
  }
  return Object.freeze({kind:'physical-pack2-construction-blueprint',
    actualGeometry:true,livePlaced:false,saveWritten:false,
    cells:Object.freeze(cells),worldBoxes:Object.freeze(worldBoxes),
    fluidVolumes:Object.freeze(fluidVolumes)});
}
