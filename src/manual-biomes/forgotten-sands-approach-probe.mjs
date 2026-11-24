// Isolated quiet-snapshot entrance apron proposal. No live placement,
// no world changes, no edits, no ownership authority. Maximum 24 columns.
import {BLOCK,worldKey} from '../voxel.mjs';
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
import {auditP0ApproachEdits} from './forgotten-sands-approach-edit-audit.mjs';
export function planP0NorthApproach(world,report,{reserved}={}){
  if(!report?.accepted||world.seed!==report.site.seed||typeof reserved!=='function')
    throw Error('Expected accepted quiet survey and reservation reader');
  const site=report.site,cells=new Map(),rows=[];
  let prior=report.floor;
  const reject=(reason,detail)=>Object.freeze({accepted:false,reason,detail});
  for(let d=1;d<=8;d++){
    const z=site.minZ-d,columns=[];
    for(let x=site.x-1;x<=site.x+1;x++){
      const r=inspectP0GroundColumn(world,defineP0Footprint({seed:site.seed,x,z}),x,z,reserved);
      if(!r.ok)return reject(r.reason,r);
      columns.push(r);
    }
    const top=Math.max(prior-1,...columns.map(c=>c.cap));
    if(top>prior+1||top>17)return reject('unwalkable-grade',{z,top,prior});
    for(const col of columns)for(let y=col.cap+1;y<=top;y++){
      if(world.get(col.x,y,z)!==BLOCK.AIR)return reject('occupied-approach',{x:col.x,y,z});
      cells.set(worldKey(col.x,y,z),BLOCK.STONE);
    }
    rows.push(Object.freeze({z,top}));prior=top;
    // The start is original, naturally supported ground, not a fabricated
    // elevated platform. Test native walking in both directions separately.
    if(columns[1].cap===top){
      const editColumns=[];
      for(let ez=z;ez<site.minZ;ez++)for(let x=site.x-1;x<=site.x+1;x++)editColumns.push([x,ez]);
      const audit=auditP0ApproachEdits(world,editColumns);
      if(!audit.ok)return reject('player-edit-approach',audit);
      return Object.freeze({accepted:true,reason:'quiet research apron only',
        rows:Object.freeze(rows),addedCells:cells.size,editLookups:audit.lookups,start:Object.freeze({x:site.x+.5,z:z+.5,feet:top+1}),
        proposedBlock:(x,y,z)=>cells.get(worldKey(x,y,z))??null});
    }
  }
  return reject('no-natural-start-within-eight-rows');
}
