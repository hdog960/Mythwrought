// :24 isolated read-only voxel occlusion witness; never modifies production raycast.
// Exact Amanatides-Woo traversal of unit voxel cells, with conservative fail-closed ties.
export function firstSolidVoxel(origin,direction,maxDistance,blockAt,editedAt){
 if(!Array.isArray(origin)||!Array.isArray(direction)||origin.length!==3||direction.length!==3||
    !origin.every(Number.isFinite)||!direction.every(Number.isFinite)||
    !Number.isFinite(maxDistance)||maxDistance<=0||maxDistance>128||
    typeof blockAt!=='function'||typeof editedAt!=='function')
  throw new TypeError('invalid isolated occlusion inputs');
 const length=Math.hypot(...direction);
 if(length<1e-10)throw new RangeError('zero ray');
 const d=direction.map(v=>v/length),cell=origin.map(Math.floor);
 const step=d.map(v=>Math.sign(v));
 const delta=d.map(v=>v===0?Infinity:Math.abs(1/v));
 const next=origin.map((v,i)=>d[i]===0?Infinity:
   ((step[i]>0?cell[i]+1:cell[i])-v)/d[i]);
 const blocked=()=>Boolean(blockAt(...cell)||editedAt(...cell));
 if(blocked())return {cell:[...cell],distance:0};
 let t=0;
 // Upper bound is conservative: at most three boundary crossings per unit distance.
 for(let n=0;n<Math.ceil(maxDistance*3)+6;n++){
  t=Math.min(...next);
  if(!Number.isFinite(t)||t>maxDistance)return null;
  // At a grid edge/corner, check all touched cells before advancing past it.
  const axes=[0,1,2].filter(i=>Math.abs(next[i]-t)<1e-9);
  const base=[...cell];
  for(let mask=1;mask<(1<<axes.length);mask++){
   const candidate=[...base];
   axes.forEach((axis,j)=>{if(mask&(1<<j))candidate[axis]+=step[axis]});
   if(blockAt(...candidate)||editedAt(...candidate))
    return {cell:candidate,distance:Math.max(0,t)};
  }
  for(const axis of axes){cell[axis]+=step[axis];next[axis]+=delta[axis]}
 }
 throw new RangeError('occlusion traversal budget exhausted');
}
export function pickEnvironmentWithoutWall(session,origin,direction,maxDistance,blockAt,editedAt){
 if(!session||typeof session.pick!=='function')throw new TypeError('missing isolated session');
 const hit=session.pick(origin,direction,maxDistance);
 if(!hit)return null;
 const wall=firstSolidVoxel(origin,direction,Math.min(hit.distance+1e-8,128),blockAt,editedAt);
 return wall&&wall.distance<=hit.distance+1e-8?null:hit;
}
