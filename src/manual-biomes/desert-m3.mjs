// MYTHWROUGHT manual M3 Desert — deterministic *physical* fresh-world dunes.
// Uses ONLY already registered biome130 IDs 256..270. No automation assets,
// invented lighting, detached render geometry or schema-1 save extensions.
// A source plan is rejected as a WHOLE when ANY cell is unsafe.
import {terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {surfaceBiomeAt,surfaceBiomeHeight,
  surfaceBiomeFreshColumn} from '../surface-regions/regions.mjs';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=t=>t*t*(3-2*t);
function hash(x,z,seed,salt=0){
  let h=Math.imul(x|0,0x7feb352d)^Math.imul(z|0,0x846ca68b)^
    Math.imul((seed+salt)|0,0x9e3779b1);
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  return ((h^(h>>>16))>>>0)/4294967296;
}
const VALID_MATERIALS=Object.freeze([256,257,258,259,260,261,262,263,264,266,268,270]);
for(const id of VALID_MATERIALS){
  if(!isBiome130BlockId(id)||!biome130Block(id).solid)
    throw Error('M3 Desert refers to an unregistered/non-solid block '+id);
}
export const M3_DESERT_IDS=Object.freeze({
  pale:256,red:257,hardpan:258,salt:259,mud:260,sandstone:261,
  banded:262,varnish:263,fossil:264,gypsum:266,cactus:268,thorn:270
});
export const M3_XERIC_IDS=Object.freeze([266,268,270]);

/** Cross-wind dunes perturb existing M2 relief by a maximum of 4 blocks.
 * Smooth shoulder fades physical height to legacy terrain at biome edges.
 * Wave frequencies never use chunk coordinates, so seams are deterministic.
 * M2 original seed-179 Desert anchor remains at its original visible crest.
 */
export function m3DesertHeight(x,z,seed=179){
  if(![x,z,seed].every(Number.isInteger))return null;
  const biome=surfaceBiomeAt(x,z,seed);
  if(biome?.name!=='desert'||biome.weight<.35)return null;
  const old=terrainHeight(x,z,seed),base=surfaceBiomeHeight(x,z,seed);
  const feather=smooth(clamp((biome.weight-.35)/.65,0,1));
  const dx=x-512,dz=z;
  const main=Math.sin(dx*.091+dz*.034+.24*Math.sin(dz*.025));
  const cross=Math.sin(dx*.033-dz*.071);
  const longwave=Math.sin(dx*.019+dz*.048);
  const delta=Math.round(feather*(2.2*main+.95*cross+.8*longwave));
  return clamp(Math.max(old,base+delta),old,WORLD_MAX_Y-3);
}
function surfaceMaterial(x,z,seed,top,old){
  // Multi-chunk, world-space material strata, never random one-block
  // confetti. At the canonical Desert anchor the pale dune remains ID 256.
  const dx=x-512,dz=z;
  const red=Math.sin(dx*.047+dz*.024+.23*Math.sin(dz*.011))+
    .4*Math.sin(dx*.013-dz*.037);
  const flat=Math.abs(Math.sin(dx*.027-dz*.021));
  if(top<=old+1&&flat<.16&&hash(x,z,seed,39)<.55)
    return M3_DESERT_IDS.salt;
  if(red>.68)return M3_DESERT_IDS.red;
  return M3_DESERT_IDS.pale;
}
function buriedMaterial(x,z,y,top,seed){
  const depth=top-y;
  if(depth<=0)throw Error('Buried desert material requires depth');
  if(depth<=2)return M3_DESERT_IDS.hardpan;
  const seam=Math.floor((y+Math.sin(x*.041+z*.052)*2)/3);
  if(seam%8===0)return M3_DESERT_IDS.fossil;
  if(seam%5===0)return M3_DESERT_IDS.banded;
  if(seam%3===0)return M3_DESERT_IDS.varnish;
  return M3_DESERT_IDS.sandstone;
}
/** A sparse, supported, naturally occurring *real* shape. No separate
 * sidecar and no :48 object ownership. A cactus stem is at most 2 units.
 * Unsupported decoration is suppressed, not floated or painted.
 */
export function m3DesertXeric(x,z,seed,top,weight){
  if(weight<.84||top+2>WORLD_MAX_Y)return Object.freeze([]);
  const roll=hash(x,z,seed,1309);
  // Keep vegetation sparse: at most one occupied cell per ~60 columns.
  if(roll<.0025)return Object.freeze([
    Object.freeze({y:top+1,id:M3_DESERT_IDS.cactus}),
    Object.freeze({y:top+2,id:M3_DESERT_IDS.cactus})
  ]);
  if(roll<.006)return Object.freeze([
    Object.freeze({y:top+1,id:M3_DESERT_IDS.gypsum})
  ]);
  if(roll<.02)return Object.freeze([
    Object.freeze({y:top+1,id:M3_DESERT_IDS.thorn})
  ]);
  return Object.freeze([]);
}
/** Always use source producer's existing full-column protected landmark/cave
 * gate FIRST; then independently re-check the larger M3 raised envelope.
 * Fresh-world profile only, never retroactively edits an old seed/world.
 */
export function m3DesertFreshColumn(x,z,seed=179,{
  enabled=false,profileIsFresh=false,readBaseline=null,
  hasEdit=null,isProtected=null
}={}){
  if(!enabled||!profileIsFresh||typeof readBaseline!=='function'||
     typeof hasEdit!=='function'||typeof isProtected!=='function')
    return null;
  const biome=surfaceBiomeAt(x,z,seed);
  if(biome?.name!=='desert'||biome.weight<.35)return null;
  const original=surfaceBiomeFreshColumn(x,z,seed,{
    enabled,profileIsFresh,readBaseline,hasEdit,isProtected
  });
  if(!original)return null;
  const oldTop=original.oldTop,top=m3DesertHeight(x,z,seed);
  if(top===null||top<oldTop||top>WORLD_MAX_Y-3)return null;
  // Protect every baseline cell that would change, including old caves,
  // landmarks, trees, and future non-block attachment candidates.
  // Do not write in the adjacent non-desert normal world.
  for(let y=oldTop-2;y<=WORLD_MAX_Y;y++){
    const base=readBaseline(x,y,z);
    if(!Number.isInteger(base)||hasEdit(x,y,z)||isProtected(x,y,z))return null;
    if(y<=oldTop&&y>=oldTop-2&&![1,2,3].includes(base))return null;
    if(y>oldTop&&base!==BLOCK.AIR)return null;
  }
  const writes=[];
  const cap=surfaceMaterial(x,z,seed,top,oldTop);
  const threshold=smooth(clamp((biome.weight-.35)/.45,0,1));
  for(let y=oldTop-2;y<=top;y++){
    const natural=readBaseline(x,y,z);
    // Same per-column feather as the protected legacy candidate: the v3
    // height blends down gently, and buried old ground isn't rewritten on
    // barely reached edges unless naturally selected.
    if(y<=oldTop&&hash(x,z,seed,907)>threshold)continue;
    const id=y===top?cap:buriedMaterial(x,z,y,top,seed);
    if(id!==natural)writes.push(Object.freeze({x,y,z,from:natural,to:id}));
  }
  const decorations=m3DesertXeric(x,z,seed,top,biome.weight);
  // Decorations are supported by a real top-cap block and protected by
  // above-surface all-AIR validation. They use existing physical shapes.
  for(const {y,id} of decorations)
    writes.push(Object.freeze({x,y,z,from:BLOCK.AIR,to:id}));
  return Object.freeze({name:'desert',x,z,oldTop,top,cap,
    decorations,writes:Object.freeze(writes)});
}
