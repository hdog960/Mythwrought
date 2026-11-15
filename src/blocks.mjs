// MYTHWROUGHT v0.08 — predictable, reversible basic block interactions.
// This prototype adds no new inventory or automated mining powers.
import {BLOCK,WORLD_MAX_Y,BODY_RADIUS,BODY_HEIGHT,raycast} from './voxel.mjs';
import {WORLD_MIN_Y} from './depth.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block,isBiome130BlockId} from './biome130-registry.mjs';

export const INTERACTION_REACH=6;
export const BUILD_MATERIALS=Object.freeze([BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.LEAVES,BLOCK.DEEPSTONE,...BIOME130_REGISTERED_IDS]);
export const BLOCK_NAMES=Object.freeze({
  [BLOCK.AIR]:'air',[BLOCK.GRASS]:'grass',[BLOCK.DIRT]:'earth',
  [BLOCK.STONE]:'stone',[BLOCK.WOOD]:'timber',[BLOCK.CRYSTAL]:'crystal',
  [BLOCK.ORE]:'ore',[BLOCK.LEAVES]:'leaf canopy',[BLOCK.DEEPSTONE]:'deepstone',
  ...Object.fromEntries(BIOME130_REGISTERED_IDS.map(id=>[id,biome130Block(id).name]))
});

export function intersectsPlayerBlock(player,cell,selected=BLOCK.STONE){
  if(!player||!Array.isArray(cell)||cell.length!==3||
    ![player.x,player.feet,player.z,...cell].every(Number.isFinite))return true;
  const [x,y,z]=cell,e=1e-5;
  const boxes=isBiome130BlockId(selected)?biome130Block(selected).boxes:[[0,0,0,1,1,1]];
  return boxes.some(b=>player.x+BODY_RADIUS>x+b[0]+e&&player.x-BODY_RADIUS<x+b[3]-e&&
    player.feet+BODY_HEIGHT>y+b[1]+e&&player.feet<y+b[4]-e&&
    player.z+BODY_RADIUS>z+b[2]+e&&player.z-BODY_RADIUS<z+b[5]-e);
}

export function inspectBlockTarget(world,eye,direction,selected,player){
  const target=raycast(world,eye,direction,INTERACTION_REACH);
  if(!target)return {hit:null,adjacent:null,canMine:false,canPlace:false,
    distance:null,block:BLOCK.AIR,reason:'Look at a nearby block'};
  const hit=target.hit,adjacent=target.adjacent;
  const block=world.get(...hit);
  const canMine=block!==BLOCK.AIR&&hit[1]>=WORLD_MIN_Y&&hit[1]<=WORLD_MAX_Y;
  let reason='';
  if(!adjacent)reason='No free space for placement';
  else if(adjacent[1]<WORLD_MIN_Y||adjacent[1]>WORLD_MAX_Y)reason='Outside editable height';
  else if(!BUILD_MATERIALS.includes(selected))reason='Choose a building material';
  else if(world.get(...adjacent)!==BLOCK.AIR)reason='Placement space occupied';
  else if(intersectsPlayerBlock(player,adjacent,selected))reason='Cannot place inside the player';
  const canPlace=reason==='';
  return {hit,adjacent,canMine,canPlace,distance:target.distance,block,reason};
}

export function applyBlockAction(world,eye,direction,mode,selected,player,rebuild,{rotation=0}={}){
  if(mode!=='mine'&&mode!=='place')return {ok:false,reason:'Unknown block action'};
  const state=inspectBlockTarget(world,eye,direction,selected,player);
  if(!state.hit)return {ok:false,reason:state.reason};
  if(mode==='mine'&&!state.canMine)return {ok:false,reason:'Cannot mine here'};
  if(mode==='place'&&!state.canPlace)return {ok:false,reason:state.reason};
  const cell=mode==='mine'?state.hit:state.adjacent;
  const previous=world.get(...cell),previousRotation=world.rotationAt?.(...cell)??0,
        next=mode==='mine'?BLOCK.AIR:selected;
  if(previous===next&&(!isBiome130BlockId(next)||previousRotation===rotation))
    return {ok:false,reason:'Block is already in that state'};
  if(!world.set(...cell,next,mode==='place'&&isBiome130BlockId(next)?rotation:0))
    return {ok:false,reason:'Invalid block ID, rotation or editable height'};
  try{
    if(typeof rebuild==='function')rebuild(cell[0],cell[2],cell[1]);
  }catch(error){
    world.set(...cell,previous,previousRotation);
    return {ok:false,reason:'Block update failed; nothing changed',error:String(error)};
  }
  return {ok:true,mode,cell,previous,next,block:mode==='mine'?previous:next};
}
