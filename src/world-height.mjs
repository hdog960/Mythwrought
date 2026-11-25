// Shared physical ownership; legacy generator/depth contracts remain unchanged.
// Upper arithmetic is reused from the exact authenticated Island/Wilds adapter.
import {WORLD_MIN_Y,WORLD_MAX_Y,sectionForY,sectionBounds,depthMeshKey,verticalEditSections} from './depth.mjs';
import {SKY_ISLAND_MIN_Y,SKY_ISLAND_MAX_Y,SKY_ISLAND_SECTION_COUNT,
  skyIslandSectionForY,skyIslandSectionBounds,skyIslandMeshKey} from './floating-islands/sky-runtime-adapter.mjs';
export const PHYSICAL_MIN_Y=WORLD_MIN_Y;
export const LEGACY_GENERATION_MAX_Y=WORLD_MAX_Y;
export const PHYSICAL_MAX_Y=SKY_ISLAND_MAX_Y;
export const UPPER_MIN_Y=SKY_ISLAND_MIN_Y;
export const UPPER_SECTION_COUNT=SKY_ISLAND_SECTION_COUNT;
export const PHYSICAL_LAYER_COUNT=PHYSICAL_MAX_Y-PHYSICAL_MIN_Y+1;
export const UPPER_LAYER_COUNT=PHYSICAL_MAX_Y-LEGACY_GENERATION_MAX_Y;
const safe=Number.isSafeInteger;
export function physicalCellY(y){return safe(y)&&y>=PHYSICAL_MIN_Y&&y<=PHYSICAL_MAX_Y;}
export function physicalSectionForY(y){
  if(!Number.isFinite(y))return null;
  const cell=Math.floor(y);
  if(!physicalCellY(cell))return null;
  if(cell>=UPPER_MIN_Y)return Object.freeze({kind:'upper',section:skyIslandSectionForY(cell)});
  const section=sectionForY(cell);
  return Object.freeze({kind:section===0?'surface':'depth',section});
}
export function physicalSectionBounds(region){
  if(!region||!safe(region.section))throw TypeError('Invalid physical section');
  if(region.kind==='upper')return skyIslandSectionBounds(region.section);
  if(region.kind==='surface'&&region.section===0||region.kind==='depth'&&region.section<0)
    return Object.freeze(sectionBounds(region.section));
  throw TypeError('Invalid physical section kind');
}
export function physicalMeshKey(cx,cz,region){
  if(!safe(cx)||!safe(cz))throw TypeError('Invalid physical chunk');
  physicalSectionBounds(region);
  return region.kind==='upper'?skyIslandMeshKey(cx,cz,region.section):depthMeshKey(cx,cz,region.section);
}
export function physicalRegionAt(x,y,z){
  if(![x,y,z].every(Number.isFinite))return null;
  const cx=Math.floor(x/16),cz=Math.floor(z/16),region=physicalSectionForY(y);
  if(!safe(cx)||!safe(cz)||!region)return null;
  return Object.freeze({cx,cz,...region,key:physicalMeshKey(cx,cz,region)});
}
// Conservative invalidation for physical face/edge halos and inherited
// surface tint reads. Full production halo audit remains a release gate.
export function physicalEditKeys(x,y,z){
  if(!safe(x)||!safe(z)||!physicalCellY(y)||!safe(x-4)||!safe(x+4)||!safe(z-4)||!safe(z+4))throw TypeError('Invalid physical edit');
  const keys=new Set(),regions=new Map();
  for(const dy of [-1,0,1]){
    const region=physicalSectionForY(y+dy);
    if(region)regions.set(region.kind+':'+region.section,region);
  }
  for(const region of regions.values()){
    const radius=region.kind==='surface'?4:1;
    for(let cx=Math.floor((x-radius)/16);cx<=Math.floor((x+radius)/16);cx++)
      for(let cz=Math.floor((z-radius)/16);cz<=Math.floor((z+radius)/16);cz++)
        keys.add(physicalMeshKey(cx,cz,region));
  }
  return Object.freeze([...keys].sort());
}
// Body volume spans cell intervals [Y,Y+1), including fractional space in
// the final cell. No clamping can hide an out-of-envelope body.
export function physicalBodyRegions({x,feet,z,radius=.28,height=1.78}={}){
  if(![x,feet,z,radius,height].every(Number.isFinite)||radius<=0||radius>1||height<=0||height>4)
    throw TypeError('Invalid physical body');
  if(feet<PHYSICAL_MIN_Y||feet+height>PHYSICAL_MAX_Y+1)return null;
  const e=1e-5,rows=new Map();
  for(let bx=Math.floor(x-radius+e);bx<=Math.floor(x+radius-e);bx++)
    for(let bz=Math.floor(z-radius+e);bz<=Math.floor(z+radius-e);bz++)
      for(let by=Math.floor(feet+e);by<=Math.floor(feet+height-e);by++){
        const row=physicalRegionAt(bx,by,bz);
        if(!row)return null;
        rows.set(row.key,row);
      }
  return Object.freeze([...rows.values()].sort((a,b)=>a.key.localeCompare(b.key)));
}
