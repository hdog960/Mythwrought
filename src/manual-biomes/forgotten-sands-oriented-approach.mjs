// Isolated rotated monument entrance research; no live placement authority.
import {BLOCK,worldKey} from '../voxel.mjs';
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
export function planP0OrientedApproach(world,report,turn,{reserved}={}){
  if(!report?.accepted||world.seed!==report.site.seed||!Number.isInteger(turn)||turn<0||turn>3||
      typeof reserved!=='function')throw Error('Expected surveyed site and orientation');
  const site=report.site,[dx,dz]=dirs[turn],r=(site.size-1)/2;
  const point=(distance,side)=>[site.x+dx*distance-dz*side,site.z+dz*distance+dx*side];
  const cells=new Map(),rows=[];let prior=report.floor;
  const deny=(reason,detail)=>Object.freeze({accepted:false,turn,reason,detail});
  for(let d=1;d<=8;d++){
    const columns=[];
    for(let side=-1;side<=1;side++){
      const [x,z]=point(r+d,side);
      const c=inspectP0GroundColumn(world,defineP0Footprint({seed:site.seed,x,z}),x,z,reserved);
      if(!c.ok)return deny(c.reason,c);
      columns.push(c);
    }
    const top=Math.max(prior-1,...columns.map(c=>c.cap));
    if(top>prior+1||top>17)return deny('unwalkable-grade',{d,top,prior});
    for(const c of columns)for(let y=c.cap+1;y<=top;y++){
      if(world.get(c.x,y,c.z)!==BLOCK.AIR)return deny('occupied-approach',{x:c.x,y,z:c.z});
      cells.set(worldKey(c.x,y,c.z),BLOCK.STONE);
    }
    rows.push(Object.freeze({distance:r+d,top}));prior=top;
    if(columns[1].cap!==top)continue;
    for(const k of world.edits.keys()){
      const [x,,z]=k.split(',').map(Number),rx=x-site.x,rz=z-site.z;
      const distance=rx*dx+rz*dz,side=-rx*dz+rz*dx;
      if(Math.abs(side)<=1&&distance>r&&distance<=r+d)return deny('player-edit-approach',{key:k});
    }
    const [x,z]=point(r+d,0);
    const proposedBlock=(x,y,z)=>{
      const apron=cells.get(worldKey(x,y,z));if(apron!==undefined)return apron;
      if(y<report.floor)return report.proposedBlock(x,y,z);
      // Rotate only the superstructure. Actual terrain-following cap and
      // supports retain their original world coordinates.
      const rx=x-site.x,rz=z-site.z;
      return report.proposedBlock(site.x-rx*dz+rz*dx,y,site.z-rx*dx-rz*dz);
    };
    return Object.freeze({accepted:true,turn,start:Object.freeze({x:x+.5,z:z+.5,feet:top+1}),
      rows:Object.freeze(rows),addedCells:cells.size,proposedBlock});
  }
  return deny('no-natural-start-within-eight-rows');
}
