// Opt-in Enchanted Forest crown clearance for the original full-cube
// player collider (BODY_HEIGHT=1.78). A walking player standing with feet
// immediately above a real surface cap occupies the first TWO air voxels.
// Only discard candidate LEAVES too close to an already-authored solid below.
// Never move terrain, hollow caves, alter roots/branches, or change M7 defaults.
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

export const ENCHANTED_WALKING_HEADROOM_VOXELS=2;

export function clearEnchantedCanopyForWalking(cells,readBaseline,air=0){
  if(!Array.isArray(cells)||typeof readBaseline!=='function'||
     !Number.isInteger(air))throw Error('Invalid enchanted walking clearance input');
  // Copy-on-first-removal keeps the common unmodified canopy allocation-free.
  let kept=null;
  for(let i=0;i<cells.length;i++){
    const cell=cells[i];
    if(!Array.isArray(cell)||cell.length!==4||
       !cell.every(Number.isInteger))
      throw Error('Invalid enchanted canopy voxel');
    const [x,y,z,id]=cell;
    if((id===G.aetherLeaves||id===G.moonLeaves)&&
       (readBaseline(x,y-1,z)!==air||readBaseline(x,y-2,z)!==air)){
      if(kept===null)kept=cells.slice(0,i);
    }else if(kept!==null)kept.push(cell);
  }
  return kept===null?cells:kept;
}
