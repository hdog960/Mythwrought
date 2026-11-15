// Mythwrought Pack 3 creator-approved physical builder asset interface.
// Bridges architectural symbolic roster (pack3:023...) to approved IDs 109–125.
// This is NOT a live voxel registry, save codec or world placement path.
import {PACK3_ROSTER,validatePack3Manifest} from '../block-packs/pack-3/manifest.mjs';
import {pack3CandidateById} from '../block-packs/pack-3/catalog.mjs';
import {validateShape} from '../voxel-shape-interactions.mjs';

const TURNS=Object.freeze({north:0,east:1,south:2,west:3,none:0});
const symbolFor=roster=>'pack3:'+String(roster).padStart(3,'0');
const lookup=new Map(PACK3_ROSTER.map(row=>[symbolFor(row.roster),row.id]));
export const PACK3_BUILDER_SYMBOLS=Object.freeze(PACK3_ROSTER.map(row=>symbolFor(row.roster)));
export const PACK3_BUILDER_IDS=Object.freeze(PACK3_ROSTER.map(row=>row.id));
export const PACK3_BUILDER_AVAILABILITY=Object.freeze({
  physicalGeometry:true, creatorArtworkApproved:true,
  deterministicFutureBlueprints:true, oneCellParts:true,
  liveGameRegistry:false, playerPlacement:false, schema1BlockIdsExtended:false,
  worldPlacement:false, requiresLiveIntegration:true,
  supportedOrientationPolicy:'four-quarter-turns-for-113-to-125; 109-to-112-north-only'
});
if(!validatePack3Manifest() || lookup.size!==17 || new Set(PACK3_BUILDER_IDS).size!==17)
  throw Error('Pack 3 builder registry is incomplete or duplicates an approved ID');

function yawOf(orientation){
  if(Number.isInteger(orientation)&&orientation>=0&&orientation<=3)return orientation;
  if(typeof orientation==='string'&&Object.hasOwn(TURNS,orientation))return TURNS[orientation];
  throw new RangeError('Invalid Pack 3 builder orientation');
}
const cellKey=p=>p.join(',');
function coordinates(at){
  if(!Array.isArray(at)||at.length!==3||!at.every(Number.isSafeInteger))
    throw new TypeError('Expected integer [x,y,z] placement');
  return at;
}
// The roster symbol, not provisional numeric block ID, is the dependency ABI
// used by Building Roadmap 1–4 and future village/town/city assembly.
export function resolvePack3BuilderAsset(symbol,orientation='north'){
  if(typeof symbol!=='string'||!/^pack3:\d{3}$/.test(symbol)||!lookup.has(symbol))
    throw new RangeError('Unknown Pack 3 construction symbol');
  const yaw=yawOf(orientation),id=lookup.get(symbol);
  if(id<=112 && yaw!==0)throw new RangeError('Roof-surface rotations 109–112 are not certified');
  const source=pack3CandidateById(id,yaw);
  if(!source||source.id!==id||!validateShape({boxes:source.boxes}) ||
     source.parts?.length!==source.boxes.length)
    throw new Error('Missing or invalid Pack 3 physical asset');
  const parts=Object.freeze(source.parts.map(part=>{
    if(typeof source.colors?.[part.tone]!=='string')throw Error('Missing physical part material');
    return Object.freeze({tone:part.tone,color:source.colors[part.tone],box:part.box});
  }));
  return Object.freeze({
    symbol,blockId:id,roster:source.roster,name:source.name,
    yaw,kind:source.kind,sourcePack:3,parts,
    shape:Object.freeze({boxes:source.boxes}),
    physical:true,worldRegistered:false,
    // A physical resolver is usable by offline blueprint designers now.
    // A later audited engine bridge must handle saves/turns/rendering.
    builderUsable:true,livePlaceable:false
  });
}
// Read-only construction compiler. Returns the exact authored physical boxes
// translated to world coordinates, plus cells for later protected placement.
// Never writes into a VoxelWorld, changes schema-1 or places a settlement.
export function planPack3BuilderStructure(placements,{origin=[0,0,0],maxCells=4096}={}){
  coordinates(origin);
  if(!Array.isArray(placements)||placements.length<1||
      !Number.isSafeInteger(maxCells)||maxCells<1||placements.length>maxCells)
    throw new RangeError('Invalid Pack 3 construction size');
  const occupied=new Set(),cells=[],boxes=[];
  for(const placement of placements){
    if(!placement||typeof placement!=='object')throw new TypeError('Invalid builder placement');
    const local=coordinates(placement.at),cell=local.map((n,i)=>n+origin[i]);
    if(!cell.every(Number.isSafeInteger))throw new RangeError('Placement outside integer range');
    const key=cellKey(cell);
    if(occupied.has(key))throw new Error('Duplicate builder voxel cell');
    occupied.add(key);
    const asset=resolvePack3BuilderAsset(placement.asset,placement.orientation??'north');
    cells.push(Object.freeze({at:Object.freeze(cell),asset:asset.symbol,
      blockId:asset.blockId,yaw:asset.yaw,shape:asset.shape}));
    for(const part of asset.parts)
      boxes.push(Object.freeze({at:Object.freeze(cell),asset:asset.symbol,
        blockId:asset.blockId,tone:part.tone,color:part.color,
        box:Object.freeze(part.box.map((v,i)=>v+cell[i%3]))}));
  }
  return Object.freeze({
    kind:'physical-pack3-construction-blueprint',actualGeometry:true,
    livePlaced:false,saveWritten:false,
    cells:Object.freeze(cells),worldBoxes:Object.freeze(boxes)
  });
}
