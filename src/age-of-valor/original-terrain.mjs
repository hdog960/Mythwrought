import {isPack2LiveId,pack2ShapeOf,pack2IsFluid} from '../pack2-integration.mjs';
import {isBiome130BlockId,biome130Block} from '../biome130-registry.mjs';
import {isMountainV8Material,mountainV8Material} from '../manual-biomes/mountain-v8-materials.mjs';
import {environmentGround} from '../environment-ground.mjs';
import {VEILREACH_GRASS_ID,veilreachGrass} from '../veilreach/flora.mjs';
export function makeOriginalShapeResolver({isPack2LiveId,pack2ShapeOf,pack2IsFluid,isBiome130BlockId,biome130Block,isMountainV8Material,mountainV8Material,environmentGround,VEILREACH_GRASS_ID,veilreachGrass}){
 const unknown=()=>({complete:false,boxes:[]}),empty=()=>({complete:true,boxes:[]});
 const cube=()=>({complete:true,boxes:[[0,0,0,1,1,1]]});
 const solid=d=>d&&typeof d.solid==='boolean'&&Array.isArray(d.boxes)?d.solid?{complete:true,boxes:d.boxes}:empty():unknown();
 return ({world,block,cell})=>{
  try{
   if(block===0)return empty();
   if(Number.isInteger(block)&&block>=1&&block<=8)return cube();
   if(isPack2LiveId(block)){
    const state=world.getPack2State?.(...cell);if(!state)return unknown();
    // Fluid interaction policy is not agreed. Never silently classify water as air.
    if(pack2IsFluid(block))return unknown();
    const d=pack2ShapeOf(block,state);return d&&Array.isArray(d.boxes)?{complete:true,boxes:d.boxes}:unknown();
   }
   if(isBiome130BlockId(block)){const rotation=world.rotationAt?.(...cell);if(!Number.isInteger(rotation)||rotation<0||rotation>3)return unknown();return solid(biome130Block(block,rotation));}
   if(isMountainV8Material(block))return solid(mountainV8Material(block));
   if(block===VEILREACH_GRASS_ID)return solid(veilreachGrass);
   if(environmentGround(block))return cube();
   return unknown();
  }catch{return unknown();}
 };
}
export function createOriginalOverlayReader({world,readRevision,readOwnerBoxes}){
 if(!world||typeof readRevision!=='function')throw Error('missing world revision');
 const names=['pack3Runtime','manual14Layer','manual14Collision','pack5Layer','pack5Collision','stagedNonblockCollision'];
 return q=>{
  try{
   if(q.revision!==readRevision())return {complete:false};
   const before=names.map(k=>world[k]);const layers=[];
   if(before[0]&&(typeof before[0].size!=='function'||before[0].size()!==0))layers.push('pack3');
   if(before[1]||before[2])layers.push('manual14');
   if(before[3]||before[4])layers.push('pack5');
   if(before[5])layers.push('staged');
   if(!layers.length){if(readRevision()!==q.revision||names.some((k,i)=>world[k]!==before[i]))return {complete:false};return {complete:true,revision:q.revision,boxes:[]};}
   if(typeof readOwnerBoxes!=='function')return {complete:false};
   const v=readOwnerBoxes(Object.freeze({...q,layers:Object.freeze(layers)}));
   if(!v||v.complete!==true||v.revision!==q.revision||!Array.isArray(v.layers)||v.layers.length!==layers.length||layers.some((x,i)=>x!==v.layers[i])||!Array.isArray(v.boxes)||readRevision()!==q.revision||names.some((k,i)=>world[k]!==before[i]))return {complete:false};
   return {complete:true,revision:q.revision,boxes:v.boxes};
  }catch{return {complete:false};}
 };
}
export const resolveOriginalVoxelShape=makeOriginalShapeResolver({isPack2LiveId,pack2ShapeOf,pack2IsFluid,isBiome130BlockId,biome130Block,isMountainV8Material,mountainV8Material,environmentGround,VEILREACH_GRASS_ID,veilreachGrass});
