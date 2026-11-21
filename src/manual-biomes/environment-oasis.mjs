import {BLOCK,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {waterCell} from '../block-packs/pack-2/water.mjs';

export const OASIS_WATER=waterCell();
const NATURAL_GROUND=new Set([BLOCK.DIRT,BLOCK.GRASS,BLOCK.STONE]);
const RADIUS=6;

export function oasisSites([tileX,tileZ],seed){
  const number=(Math.imul(tileX^seed,0x7feb352d)^Math.imul(tileZ+seed,0x45d9f3b))>>>0;
  const x=tileX+(number%113)-56,z=tileZ+((number>>>12)%113)-56;
  return [[x,z],[x+57,z+41],[x-43,z+34],[x+35,z-52]];
}

export function nearOasisSite(sites,x,z,padding=0){
  return sites.some(([a,b])=>Math.abs(x-a)<=RADIUS+padding&&Math.abs(z-b)<=RADIUS+padding);
}

export function planOasis(sites,seed,readBaseline){
  for(const [x,z] of sites){
    const waterY=terrainHeight(x,z,seed)-1;
    if(waterY<2||waterY>13)continue;
    const columns=new Map(),water=[],shore=[];
    let clear=true;
    survey:
    for(let dx=-RADIUS;dx<=RADIUS;dx++)for(let dz=-RADIUS;dz<=RADIUS;dz++){
      const distance=dx*dx+dz*dz;
      if(distance>RADIUS*RADIUS)continue;
      const a=x+dx,b=z+dz,old=terrainHeight(a,b,seed);
      const submerged=distance<=16;
      const floor=submerged?waterY-1:Math.max(waterY,old);
      if(old-floor>2||Math.abs(old-waterY)>2||!NATURAL_GROUND.has(readBaseline(a,floor-1,b))){
        clear=false;break survey;
      }
      for(let y=old-2;y<=WORLD_MAX_Y;y++){
        const prior=readBaseline(a,y,b);
        if(y>old?prior!==BLOCK.AIR:!NATURAL_GROUND.has(prior)){
          clear=false;break survey;
        }
      }
      const writes=new Map();
      // A still source cell sits over real sand. The next ring has a
      // continuous supported bank at or above the entire water plane.
      for(let y=Math.min(old,floor);y<=Math.max(old,waterY,floor);y++)
        writes.set(y,y<floor?258:y===floor?(submerged?258:259):
          y===waterY?OASIS_WATER.id:BLOCK.AIR);
      columns.set(a+','+b,writes);
      if(submerged)water.push([a,waterY,b,worldKey(a,waterY,b)]);
      else if(distance<30)shore.push([a,b]);
    }
    if(clear)return {center:[x,waterY,z],columns,water,shore};
  }
  return null;
}
