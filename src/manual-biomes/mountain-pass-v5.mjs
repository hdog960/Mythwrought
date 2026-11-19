// MYTHWROUGHT manual M5: EXPERIMENTAL IMMUTABLE V5 mountain approach.
// Exists ONLY in an explicitly v5-profiled, freshly created world. The
// already-accepted v2/v3/v4 world's natural voxels are NEVER modified.
// This pass is physically authored geology, not an edit in the save,
// debug teleport, fake collision plane, map preview, or render-only road.
// Always ask the independent FULL-column M4 baseline/landmark/cave checker
// before lowering a freshly generated mountain crest.
import {BLOCK,terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {m4ThreeRegionFreshColumn,M4_PHYSICAL_MATERIALS} from './three-regions-m4.mjs';

const WAYPOINTS=Object.freeze([
  Object.freeze([-350,0]),Object.freeze([-405,-24]),
  Object.freeze([-445,-26]),Object.freeze([-480,-12]),
  Object.freeze([-512,0]),Object.freeze([-536,1])
]);
export const V5_MOUNTAIN_PASS_WAYPOINTS=WAYPOINTS;
const smooth=t=>t*t*(3-2*t);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function segmentDistance(x,z,a,b){
  const dx=b[0]-a[0],dz=b[1]-a[1],denom=dx*dx+dz*dz;
  const t=denom?clamp(((x-a[0])*dx+(z-a[1])*dz)/denom,0,1):0;
  return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
}
export function v5MountainPassDistance(x,z){
  if(!Number.isInteger(x)||!Number.isInteger(z))return null;
  let d=Infinity;
  for(let i=1;i<WAYPOINTS.length;i++)
    d=Math.min(d,segmentDistance(x,z,WAYPOINTS[i-1],WAYPOINTS[i]));
  return d;
}
/** Narrow source-authored natural switchback/gorge through v5 ridges.
 * Inside 6 blocks of the center line, the surface follows the untouched
 * actual legacy geological floor. Beyond 6 blocks the valley gently blends
 * into the M4 physically raised mountain relief over a 16-block shoulder.
 * Never lower legacy ground, break a cave, delete a landmark, or override
 * an edit. Any obstructed column fails closed to its untouched baseline.
 */
export function m5V5MountainFreshColumn(x,z,seed=179,opts={}){
  const original=m4ThreeRegionFreshColumn(x,z,seed,opts);
  const biome=surfaceBiomeAt(x,z,seed);
  if(!biome||biome.name!=='mountain'||biome.weight<.5)return original;
  const d=v5MountainPassDistance(x,z);
  if(d===null||d>=22)return original;
  // M4 must already verify the WHOLE old-to-original raised envelope,
  // including all historical caves, protected structures, trees, edits,
  // above-surface air and both current and future attachment positions.
  if(!original||!opts.enabled||!opts.profileIsFresh||
     typeof opts.readBaseline!=='function'||
     typeof opts.hasEdit!=='function'||typeof opts.isProtected!=='function')
    return null;
  const oldTop=terrainHeight(x,z,seed),amount=clamp((d-6)/16,0,1);
  const feather=smooth(amount);
  const top=Math.max(oldTop,Math.min(WORLD_MAX_Y-3,
    oldTop+Math.round((original.top-oldTop)*feather)));
  if(top===original.top)return original;
  // All changed cells remain solid real geology and preserve original
  // naturally protected landmarks, caves and all old legacy terrain.
  // This is a NEW immutable generation baseline, not retroactive digging.
  const writes=[];
  for(let y=oldTop-2;y<=top;y++){
    const from=opts.readBaseline(x,y,z);
    if(!Number.isInteger(from)||opts.hasEdit(x,y,z)||
       opts.isProtected(x,y,z)||
       (y>oldTop&&from!==BLOCK.AIR)||
       (y<=oldTop&&![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(from)))
      return null;
    let to;
    if(y===top)to=M4_PHYSICAL_MATERIALS.mountain.cap;
    else if(y>oldTop)to=BLOCK.STONE;
    else continue; // Underlying old-world cave-support is byte-identical.
    if(from!==to)writes.push(Object.freeze({x,y,z,from,to}));
  }
  // Preserve the original generator's no-overhang and headroom rules;
  // don't introduce decorative attached non-block flora in this corridor.
  return Object.freeze({
    name:'mountain',x,z,oldTop,top,cap:M4_PHYSICAL_MATERIALS.mountain.cap,
    passDistance:d,sourceGenerator:'mythwrought-four-surface-regions-v5',
    writes:Object.freeze(writes)
  });
}
