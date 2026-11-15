// MYTHWROUGHT v0.08 — predictable, reversible basic block interactions.
// This prototype adds no new inventory or automated mining powers.
import {BLOCK,WORLD_MAX_Y,BODY_RADIUS,BODY_HEIGHT,raycast} from './voxel.mjs';
import {WORLD_MIN_Y} from './depth.mjs';
import {PACK2_LIVE_IDS,PACK2_LIVE_NAMES,isPack2LiveId,
  pack2BodyIntersects,pack2NormalizeState} from './pack2-integration.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block,isBiome130BlockId} from './biome130-registry.mjs';
import {PACK3_BUILDER_IDS,PACK3_BUILDER_SYMBOLS,resolvePack3BuilderAsset} from './builder-assets/pack3.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from './builder-assets/manual-five-pack.mjs';
const manual14Ids=new Set(MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===1||x.pack===4).map(x=>x.numericId));
const manualPack3SymbolById=new Map(PACK3_BUILDER_IDS.map((id,i)=>[id,PACK3_BUILDER_SYMBOLS[i]]));
const manualPack3Shape=(id,rotation)=>resolvePack3BuilderAsset(manualPack3SymbolById.get(id),rotation).shape.boxes;

export const INTERACTION_REACH=6;
export const BUILD_MATERIALS=Object.freeze([BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.LEAVES,BLOCK.DEEPSTONE,...BIOME130_REGISTERED_IDS,...PACK2_LIVE_IDS]);
export const BLOCK_NAMES=Object.freeze({
  [BLOCK.AIR]:'air',[BLOCK.GRASS]:'grass',[BLOCK.DIRT]:'earth',
  [BLOCK.STONE]:'stone',[BLOCK.WOOD]:'timber',[BLOCK.CRYSTAL]:'crystal',
  [BLOCK.ORE]:'ore',[BLOCK.LEAVES]:'leaf canopy',[BLOCK.DEEPSTONE]:'deepstone',
  ...Object.fromEntries(BIOME130_REGISTERED_IDS.map(id=>[id,biome130Block(id).name])),
  ...PACK2_LIVE_NAMES,
  ...Object.fromEntries(PACK3_BUILDER_IDS.map((id,i)=>[id,resolvePack3BuilderAsset(PACK3_BUILDER_SYMBOLS[i]).name])),
  ...Object.fromEntries(MANUAL_FIVE_PACK_CATALOG.filter(x=>manual14Ids.has(x.numericId))
    .map(x=>[x.numericId,x.name??x.symbol]))
});

export function intersectsPlayerBlock(player,cell,selected=BLOCK.STONE,rotation=0,pack2State=null){
  if(!player||!Array.isArray(cell)||cell.length!==3||
    ![player.x,player.feet,player.z,...cell].every(Number.isFinite))return true;
  const [x,y,z]=cell,e=1e-5;
  if(isPack2LiveId(selected))return pack2BodyIntersects(selected,
    pack2State??pack2NormalizeState(selected),cell,
    {x:player.x,z:player.z,feet:player.feet,radius:BODY_RADIUS,height:BODY_HEIGHT});
  const boxes=manualPack3SymbolById.has(selected)?manualPack3Shape(selected,rotation):
    isBiome130BlockId(selected)?biome130Block(selected,rotation).boxes:[[0,0,0,1,1,1]];
  return boxes.some(b=>player.x+BODY_RADIUS>x+b[0]+e&&player.x-BODY_RADIUS<x+b[3]-e&&
    player.feet+BODY_HEIGHT>y+b[1]+e&&player.feet<y+b[4]-e&&
    player.z+BODY_RADIUS>z+b[2]+e&&player.z-BODY_RADIUS<z+b[5]-e);
}

export function inspectBlockTarget(world,eye,direction,selected,player,rotation=0){
  const target=raycast(world,eye,direction,INTERACTION_REACH);
  if(!target)return {hit:null,adjacent:null,canMine:false,canPlace:false,
    distance:null,block:BLOCK.AIR,reason:'Look at a nearby block'};
  const hit=target.hit,adjacent=target.adjacent;
  const physicalPack3=world?.pack3Runtime?.get?.(hit);
  const physicalManual14=world?.manual14Layer?.get?.(hit);
  const block=physicalManual14?.numericId??physicalPack3?.id??world.get(...hit);
  const canMine=block!==BLOCK.AIR&&hit[1]>=WORLD_MIN_Y&&hit[1]<=WORLD_MAX_Y;
  let reason='';
  if(!adjacent)reason='No free space for placement';
  else if(adjacent[1]<WORLD_MIN_Y||adjacent[1]>WORLD_MAX_Y)reason='Outside editable height';
  else if(!BUILD_MATERIALS.includes(selected)&&
    !(world?.pack3Runtime&&manualPack3SymbolById.has(selected))&&
    !(world?.manual14Layer&&manual14Ids.has(selected)))reason='Choose a building material';
  else if(world.get(...adjacent)!==BLOCK.AIR||world?.pack3Runtime?.get?.(adjacent)||
    world?.manual14Layer?.get?.(adjacent)||world?.pack5Layer?.cell?.(adjacent))
    reason='Placement space occupied';
  else if(intersectsPlayerBlock(player,adjacent,selected,rotation,
    world.nextPack2State?.id===selected?world.nextPack2State:null))reason='Cannot place inside the player';
  const canPlace=reason==='';
  return {hit,adjacent,canMine,canPlace,distance:target.distance,block,reason};
}

export function applyBlockAction(world,eye,direction,mode,selected,player,rebuild,{rotation=0}={}){
  if(mode!=='mine'&&mode!=='place')return {ok:false,reason:'Unknown block action'};
  const state=inspectBlockTarget(world,eye,direction,selected,player,rotation);
  if(!state.hit)return {ok:false,reason:state.reason};
  if(mode==='mine'&&!state.canMine)return {ok:false,reason:'Cannot mine here'};
  if(mode==='place'&&!state.canPlace)return {ok:false,reason:state.reason};
  if(world?.pack3Runtime?.get?.(state.hit))
    return {ok:false,reason:'Physical Pack 3 objects require the verified overlay action'};
  if(world?.manual14Layer?.get?.(state.hit)||manual14Ids.has(selected))
    return {ok:false,reason:'Physical manual 1/4 objects require the verified sidecar action'};
  if(mode==='place'&&manualPack3SymbolById.has(selected))
    return {ok:false,reason:'Physical Pack 3 placement requires a verified separate sidecar'};
  const cell=mode==='mine'?state.hit:state.adjacent;
  const previous=world.get(...cell),previousRotation=world.rotationAt?.(...cell)??0,
        previousPack2=world.getPack2State?.(...cell)||null,
        next=mode==='mine'?BLOCK.AIR:selected;
  if(previous===next&&(!isBiome130BlockId(next)||previousRotation===rotation))
    return {ok:false,reason:'Block is already in that state'};
  if(!world.set(...cell,next,mode==='place'&&isBiome130BlockId(next)?rotation:0))
    return {ok:false,reason:'Invalid block ID, rotation or editable height'};
  try{
    if(typeof rebuild==='function')rebuild(cell[0],cell[2],cell[1]);
  }catch(error){
    if(previousPack2&&typeof world.placePack2==='function'){
      // If a biome candidate replaced this manual overlay, remove only that
      // newly placed block first, then restore the exact old authored state.
      if(world.base?.get(...cell)!==BLOCK.AIR)world.base.set(...cell,BLOCK.AIR);
      world.placePack2(...cell,previous,previousPack2);
    }else world.set(...cell,previous,previousRotation);
    return {ok:false,reason:'Block update failed; nothing changed',error:String(error)};
  }
  return {ok:true,mode,cell,previous,next,block:mode==='mine'?previous:next};
}
