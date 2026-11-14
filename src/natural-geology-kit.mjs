// Physical geological material arrangements for opt-in caves.
// This module never mutates seeded terrain or a player's saved edits.
// The terrain lane owns where and whether to consume these voxel cells.
import {BLOCK,WORLD_MIN_Y,WORLD_MAX_Y} from './voxel.mjs';

export const GEOLOGY_MATERIALS=Object.freeze({
  host:BLOCK.DEEPSTONE, vein:BLOCK.ORE, crystal:BLOCK.CRYSTAL,
  legacyStone:BLOCK.STONE, trunk:BLOCK.WOOD, canopy:BLOCK.LEAVES
});
function hash3(x,y,z,seed){
  let h=(seed|0)^Math.imul(x|0,0x9e3779b1)^Math.imul(y|0,0x85ebca77)^Math.imul(z|0,0xc2b2ae3d);
  h=Math.imul(h^(h>>>16),0x7feb352d);
  h=Math.imul(h^(h>>>15),0x846ca68b);
  return (h^(h>>>16))>>>0;
}
function validOrigin(origin){
  if(!Array.isArray(origin)||origin.length!==3||!origin.every(Number.isInteger))
    throw new TypeError('Geology origin must be three integer voxel coordinates');
}
// Returns a narrow, discontinuous physical mineral seam embedded in a stone
// wall, not a floating decorative mesh. Host blocks are optional: callers
// may choose only the ore/crystal entries when preserving existing cave walls.
export function caveMineralSeam(origin,{seed=179,length=11,axis='x',host=true}={}){
  validOrigin(origin);
  if(!Number.isInteger(seed)||!Number.isInteger(length)||length<3||length>32||
     !['x','z'].includes(axis))throw new RangeError('Invalid seam configuration');
  const [ox,oy,oz]=origin, cells=[];
  for(let i=0;i<length;i++){
    const bend=(hash3(i,oy,0,seed)%3)-1;
    const y=oy+Math.floor(i/5)+bend;
    if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)continue;
    const x=ox+(axis==='x'?i:0),z=oz+(axis==='z'?i:0);
    const roll=hash3(x,y,z,seed)%11;
    const id=roll===0?BLOCK.CRYSTAL:roll<6?BLOCK.ORE:BLOCK.DEEPSTONE;
    if(host||id!==BLOCK.DEEPSTONE)cells.push(Object.freeze([x,y,z,id]));
  }
  return Object.freeze(cells);
}
// Non-destructive integration planner: a cave owner can overlay a seam only
// into natural solid stone, never into air, built structures, or saved edits.
export function planUneditedMineralSeam(world,cells){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map))
    throw new TypeError('Expected editable voxel world');
  const planned=[];
  for(const cell of cells){
    if(!Array.isArray(cell)||cell.length!==4||!cell.every(Number.isInteger))
      throw new TypeError('Invalid geological cell');
    const [x,y,z,id]=cell;
    if(y<WORLD_MIN_Y||y>WORLD_MAX_Y||![BLOCK.DEEPSTONE,BLOCK.ORE,BLOCK.CRYSTAL].includes(id))
      continue;
    if(world.edits.has(x+','+y+','+z))continue;
    const previous=world.get(x,y,z);
    if(previous!==BLOCK.STONE&&previous!==BLOCK.DEEPSTONE&&previous!==BLOCK.ORE)continue;
    planned.push(Object.freeze([...cell]));
  }
  return Object.freeze(planned);
}
