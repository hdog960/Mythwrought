// Settlement builders consume the SAME registered physical voxel geometry as live play.
// This adapter owns no manual Pack 1-5 source and places no settlement automatically.
import {BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../biome130-registry.mjs';
const TURNS=Object.freeze({north:0,east:1,south:2,west:3});
const yawOf=value=>Number.isInteger(value)&&value>=0&&value<=3?value:
  (typeof value==='string'&&Object.hasOwn(TURNS,value)?TURNS[value]:null);
const coordinates=value=>Array.isArray(value)&&value.length===3&&value.every(Number.isSafeInteger);
export const BIOME130_BUILDER_SYMBOLS=BIOME130_REGISTERED_SYMBOLS;
export const BIOME130_BUILDER_AVAILABILITY=Object.freeze({
  physicalGeometry:true,liveGameRegistry:true,playerPlacement:true,
  schema1BlockIdsExtended:true,builderUsable:true,
  source:'automated-biome130',families:BIOME130_REGISTERED_SYMBOLS.length
});
export function resolveBiome130BuilderAsset(symbol,orientation='north'){
  const yaw=yawOf(orientation);
  if(yaw===null)throw new RangeError('Invalid builder orientation');
  const asset=biome130Block(symbol,yaw);
  return Object.freeze({
    symbol:asset.symbol,blockId:asset.blockId,name:asset.name,
    yaw,source:'auto:12-biome130',worldRegistered:true,livePlaceable:true,
    physical:true,solid:asset.solid,opacity:asset.opacity,
    // The source opacity and leaf cutouts now have a dedicated game render path.
    alphaIntent:asset.alphaMode,transparentIntent:asset.transparent,
    rendererFidelity:asset.blockId===350?'alpha-blended':
      (asset.blockId>=377&&asset.blockId<=385?'alpha-cutout':'opaque'),
    shape:Object.freeze({boxes:asset.boxes}),colors:asset.palette,
    builderUsable:true
  });
}
// A builder may save these physical cells through world.set(x,y,z,id,orientation).
// No implicit world edits: the blueprint is a deterministic, read-only proposal.
export function planBiome130BuilderStructure(placements,{origin=[0,0,0],maxCells=4096}={}){
  if(!coordinates(origin)||!Array.isArray(placements)||!placements.length||
    !Number.isSafeInteger(maxCells)||maxCells<1||placements.length>maxCells)
    throw new RangeError('Invalid construction blueprint');
  const used=new Set(),cells=[],worldBoxes=[];
  for(const p of placements){
    if(!p||!coordinates(p.at))throw new TypeError('Invalid construction cell');
    const at=p.at.map((n,i)=>n+origin[i]);
    if(!coordinates(at)||used.has(at.join(',')))throw new RangeError('Duplicate or invalid construction cell');
    used.add(at.join(','));
    const asset=resolveBiome130BuilderAsset(p.asset,p.orientation??'north');
    cells.push(Object.freeze({at:Object.freeze(at),symbol:asset.symbol,
      blockId:asset.blockId,orientation:asset.yaw,shape:asset.shape}));
    for(const b of asset.shape.boxes)
      worldBoxes.push(Object.freeze({
        at:Object.freeze(at),symbol:asset.symbol,blockId:asset.blockId,
        box:Object.freeze(b.map((n,i)=>n+at[i%3]))
      }));
  }
  return Object.freeze({
    kind:'physical-biome130-construction-blueprint',actualGeometry:true,
    builderReady:true,livePlaced:false,saveWritten:false,
    cells:Object.freeze(cells),worldBoxes:Object.freeze(worldBoxes)
  });
}
// Transactional blueprint placement: never partially overwrite player edits.
// Reject any occupied destination, write in order, roll back on rejected writes.
export function placeBiome130BuilderStructure(world,blueprint){
  if(!world||typeof world.get!=='function'||typeof world.set!=='function'||
    !blueprint||blueprint.kind!=='physical-biome130-construction-blueprint'||
    !Array.isArray(blueprint.cells)||!blueprint.cells.length)return false;
  if(blueprint.cells.some(c=>world.get(...c.at)!==0))return false;
  const placed=[];
  try{
    for(const cell of blueprint.cells){
      if(!world.set(...cell.at,cell.blockId,cell.orientation))throw Error('Write rejected');
      placed.push(cell);
    }
    return true;
  }catch{
    for(let i=placed.length-1;i>=0;i--)world.set(...placed[i].at,0);
    return false;
  }
}
