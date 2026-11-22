// Phase 2 opt-in Enchanted Forest leaf clearance for the ORIGINAL full-cube
// player collider (BODY_RADIUS=.28 and BODY_HEIGHT=1.78).
// A real player may straddle a cardinal/diagonal block boundary; therefore
// a two-voxel-high clear space over walkable terrain requires examining the
// 3x3 adjacent ground columns, not just the leaf's own X/Z column.
// Only candidate leaves are pruned. Bark, cave AIR, terrain, original trees,
// landmarks, saved worlds and the historical M7 generator are never edited.
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

export const ENCHANTED_WALKING_HEADROOM_VOXELS=2;
export const ENCHANTED_WALKING_GROUND_NEIGHBORS=Object.freeze([
  [0,0],[-1,0],[1,0],[0,-1],[0,1],
  [-1,-1],[-1,1],[1,-1],[1,1]
].map(offset=>Object.freeze(offset)));

export function clearEnchantedCanopyForWalking(cells,readBaseline,air=0,sharedCache=null){
  if(!Array.isArray(cells)||typeof readBaseline!=='function'||
     !Number.isInteger(air)||sharedCache!==null&&!(sharedCache instanceof Map))
    throw Error('Invalid enchanted walking clearance input');

  // Every source terrain/cave/landmark probe is read-only. Crown voxels
  // frequently share nearby support coordinates across several vertical
  // tiers; memoize real source reads for this ONE tree, not globally.
  // A caller may share this bounded cache among candidates in ONE chunk.
  // It is never retained by the world or shared between seeds/loads.
  const baselineCache=sharedCache??new Map();
  const blocked=(x,y,z)=>{
    const key=x+','+y+','+z;
    if(!baselineCache.has(key))
      baselineCache.set(key,readBaseline(x,y,z));
    return baselineCache.get(key)!==air;
  };

  // No copies for trees whose leaves already have genuine player headroom.
  let kept=null;
  for(let i=0;i<cells.length;i++){
    const cell=cells[i];
    if(!Array.isArray(cell)||cell.length!==4||
       !cell.every(Number.isInteger))
      throw Error('Invalid enchanted canopy voxel');
    const [x,y,z,id]=cell;
    let blocksWalking=false;
    if(id===G.aetherLeaves||id===G.moonLeaves){
      for(const [dx,dz] of ENCHANTED_WALKING_GROUND_NEIGHBORS){
        // At a real natural foot position, original full-cube collisions
        // contact the candidate leaf whenever it occupies either body layer.
        // Fail closed on unknown baseline readings: they are NOT known AIR.
        if(blocked(x+dx,y-1,z+dz)||blocked(x+dx,y-2,z+dz)){
          blocksWalking=true;break;
        }
      }
    }
    if(blocksWalking){
      if(kept===null)kept=cells.slice(0,i);
    }else if(kept!==null)kept.push(cell);
  }
  return kept===null?cells:kept;
}
