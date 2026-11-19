// MYTHWROUGHT manual M4: Snow, Mountain and Enchanted physical terrain.
// Fresh-profile v4 only. No props, particles, rendered decals, artificial
// caves, automations, new block registrations or save-schema modifications.
// Every authored cell is a REAL registered solid / legacy stone voxel.
import {BLOCK,terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {surfaceBiomeAt,surfaceBiomeHeight,
  surfaceBiomeFreshColumn} from '../surface-regions/regions.mjs';

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=t=>t*t*(3-2*t);
export const M4_PHYSICAL_MATERIALS=Object.freeze({
  snow:Object.freeze({cap:272,glacier:277,permafrost:278,rime:279}),
  mountain:Object.freeze({cap:302,layered:303,rust:307}),
  enchanted:Object.freeze({cap:286,glade:293})
});
for(const spec of Object.values(M4_PHYSICAL_MATERIALS))
  for(const id of Object.values(spec))
    if(!isBiome130BlockId(id)||!biome130Block(id).solid)
      throw Error('M4 terrain requires an existing registered physical solid '+id);
export const M4_REGION_NAMES=Object.freeze(['snow','mountain','enchanted']);

function relative(x,z,name){
  if(name==='snow')return [x,z-512];
  if(name==='mountain')return [x+512,z];
  return [x,z+512];
}
function capAt(x,z,name){
  const [dx,dz]=relative(x,z,name);
  // Preserve the four canonical M2/M3 biome anchors, while creating broad
  // colored strata from continuous WORLD coordinates (not chunk boundaries).
  if(dx===0&&dz===0)return M4_PHYSICAL_MATERIALS[name].cap;
  if(name==='snow'){
    const band=Math.sin(dx*.065+dz*.033+.27*Math.sin(dz*.016));
    return band>.5?M4_PHYSICAL_MATERIALS.snow.glacier:
      band<-.83?M4_PHYSICAL_MATERIALS.snow.rime:
        M4_PHYSICAL_MATERIALS.snow.cap;
  }
  if(name==='mountain'){
    const vein=Math.sin(dx*.054-dz*.026+.3*Math.sin(dz*.021));
    return vein>.84?M4_PHYSICAL_MATERIALS.mountain.rust:
      vein<-.75?M4_PHYSICAL_MATERIALS.mountain.layered:
        M4_PHYSICAL_MATERIALS.mountain.cap;
  }
  const opening=Math.sin(dx*.07+dz*.028+.32*Math.sin(dx*.019));
  return opening>.55?M4_PHYSICAL_MATERIALS.enchanted.glade:
    M4_PHYSICAL_MATERIALS.enchanted.cap;
}
function waveRise(x,z,name,weight){
  if(weight<.7)return 0;
  const [dx,dz]=relative(x,z,name);
  if(dx===0&&dz===0)return 0;
  const feather=smooth(clamp((weight-.7)/.3,0,1));
  const wave=name==='snow'?
    Math.sin(dx*.065+dz*.023):
    name==='mountain'?
      Math.sin(dx*.042+dz*.058):
      Math.sin(dx*.04-dz*.061);
  // Only 0-1 extra actual physical blocks, rare on mountain. Do NOT exceed
  // the already tight 8MiB mountain mesh budget or create a new fake ridge.
  const threshold=name==='mountain'?.88:name==='snow'?.58:.73;
  return wave*feather>threshold?1:0;
}
export function m4PhysicalTerrainHeight(x,z,seed=179){
  if(![x,z,seed].every(Number.isInteger))return null;
  const region=surfaceBiomeAt(x,z,seed);
  if(!region||!M4_REGION_NAMES.includes(region.name)||region.weight<.5)
    return null;
  const base=surfaceBiomeHeight(x,z,seed);
  const old=terrainHeight(x,z,seed);
  return clamp(Math.max(old,base+waveRise(x,z,region.name,region.weight)),
    old,WORLD_MAX_Y-3);
}
/** Validate entire envelope with ORIGINAL legacy+landmark+cave producer
 * before changing a single cell. Disallow mining/claim history or protection
 * conflicts. The old v2 plan performs the same gate first. All 3 regions
 * retain the original terrain outside the interior M4 coverage.
 */
export function m4ThreeRegionFreshColumn(x,z,seed=179,{
 enabled=false,profileIsFresh=false,readBaseline=null,hasEdit=null,
 isProtected=null
}={}){
  if(!enabled||!profileIsFresh||typeof readBaseline!=='function'||
     typeof hasEdit!=='function'||typeof isProtected!=='function')return null;
  const biome=surfaceBiomeAt(x,z,seed);
  if(!biome||!M4_REGION_NAMES.includes(biome.name))return null;
  const opts={enabled,profileIsFresh,readBaseline,hasEdit,isProtected};
  const original=surfaceBiomeFreshColumn(x,z,seed,opts);
  if(!original)return null;
  // Keep the same original output through the inter-region fade. This
  // prevents a stepped material ring or a new cliff at the original seam.
  if(biome.weight<.5)return original;
  const top=m4PhysicalTerrainHeight(x,z,seed);
  if(top===null||top<original.oldTop||top>WORLD_MAX_Y-3)return null;
  for(let y=original.oldTop-2;y<=WORLD_MAX_Y;y++){
    const prior=readBaseline(x,y,z);
    if(!Number.isInteger(prior)||hasEdit(x,y,z)||isProtected(x,y,z))
      return null;
    if(y<=original.oldTop&&![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior))
      return null;
    if(y>original.oldTop&&prior!==BLOCK.AIR)return null;
  }
  const cap=capAt(x,z,biome.name);
  const source=new Map(original.writes.map(w=>[w.y,w.to]));
  for(let y=original.oldTop-2;y<=top;y++){
    // Never paint formerly untouched old terrain near a protected edge.
    if(y<=original.oldTop&&!source.has(y))continue;
    let to;
    if(y===top)to=cap;
    else if(y>=top-2){
      to=biome.name==='snow'?M4_PHYSICAL_MATERIALS.snow.permafrost:
        biome.name==='mountain'?BLOCK.STONE:
          M4_PHYSICAL_MATERIALS.enchanted.glade;
    }else{
      // Hidden new raised interior must be actual full-cube stone or
      // frozen ground, not expensive disconnected sub-cube scenery.
      to=biome.name==='snow'?M4_PHYSICAL_MATERIALS.snow.permafrost:BLOCK.STONE;
    }
    if(to===readBaseline(x,y,z))source.delete(y);else source.set(y,to);
  }
  // Must remain mineable and collider-resolvable. Mountain hidden interior
  // is additionally enforced by the existing v2 concealed-stone adapter.
  const writes=[...source].sort((a,b)=>a[0]-b[0]).map(([y,to])=>
    Object.freeze({x,y,z,from:readBaseline(x,y,z),to}));
  return Object.freeze({name:biome.name,x,z,oldTop:original.oldTop,
    top,cap,writes:Object.freeze(writes)});
}
