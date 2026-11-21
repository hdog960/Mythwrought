// S3 prototype only. NOT imported by any M7 generator, game, or save reader.
// Integrate only through a future explicitly versioned world profile after
// S2 provenance, collision, chunk-seam and save acceptance. Physical voxels
// use the existing IDs and original engine mesh ABI.
import {BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

export const SNOWY_S3_STYLES=Object.freeze([
  'compact-fir','layered-spruce','highland-pine','windswept-alpine'
]);
const profiles=Object.freeze({
  'compact-fir':{height:5,tiers:[0,0,2,2,1,1,0],shift:0},
  'layered-spruce':{height:7,tiers:[0,0,3,2,2,1,1,1,0],shift:0},
  'highland-pine':{height:9,tiers:[0,0,0,0,0,2,2,1,2,1,0],shift:0},
  'windswept-alpine':{height:6,tiers:[0,0,0,1,2,1,1,0],shift:1}
});
export function proposedSnowTree(style,x,floor,z,{wind=1}={}){
  const profile=profiles[style];
  if(!profile)throw new RangeError('Unknown snowy tree style');
  if(![x,floor,z].every(Number.isSafeInteger)||floor<0||wind!==1&&wind!==-1)
    throw new RangeError('Invalid candidate tree origin or wind');
  if(floor+profile.height+1>WORLD_MAX_Y)return null;
  const occupied=new Map(),put=(dx,dy,dz,id)=>{
    const key=[x+dx,floor+dy,z+dz].join(',');
    if(!occupied.has(key))occupied.set(key,[x+dx,floor+dy,z+dz,id]);
  };
  // Trunk is a protected vertical load path and remains mined as ordinary
  // WOOD. Canopy cells do not overwrite it.
  for(let dy=1;dy<=profile.height;dy++)put(0,dy,0,BLOCK.WOOD);
  for(let dy=2;dy<=profile.height+1;dy++){
    const radius=profile.tiers[dy]??0;
    const shift=profile.shift&&dy>=4?wind:0;
    for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
      if(Math.abs(dx)+Math.abs(dz)>radius+1)continue;
      if(dx+shift===0&&dz===0&&dy<=profile.height)continue;
      if(style==='windswept-alpine'&&radius>0&&
         (dy+dx*3+dz*5+wind)%4===0)continue;
      const snowy=dy>=profile.height-1||
        style==='compact-fir'&&dy>=4||
        style==='layered-spruce'&&dy%2===0;
      put(dx+shift,dy,dz,snowy?G.snowyNeedles:G.coldNeedles);
    }
  }
  const cells=Object.freeze([...occupied.values()].map(row=>Object.freeze(row)));
  const minX=Math.min(...cells.map(c=>c[0])),maxX=Math.max(...cells.map(c=>c[0]));
  const minZ=Math.min(...cells.map(c=>c[2])),maxZ=Math.max(...cells.map(c=>c[2]));
  return Object.freeze({style,height:profile.height,cells,
    bounds:Object.freeze([minX,floor+1,minZ,maxX,floor+profile.height+1,maxZ])});
}
