// Material-independent D4 (all four turns + mirror) geometry identity.
// Preventing merely mirrored/rotated houses is an authoring requirement, not worldgen.
import {validateBlueprint} from './legacy-schema.mjs';
const canonical=(arr)=>arr.sort().join(';');
function transform(x,z,w,d,turn,mirror){
 let X,Z;
 switch(turn){case 0:X=x;Z=z;break;
 case 1:X=d-1-z;Z=x;break;
 case 2:X=w-1-x;Z=d-1-z;break;
 case 3:X=z;Z=w-1-x;break;
 default:throw new Error('turn must be 0–3');}
 if(mirror)X=(turn%2?d:w)-1-X;
 return [X,Z];
}
function key(b,turn,mirror){
 const {width:w,depth:d,height:h}=b.footprint,W=turn%2?d:w,D=turn%2?w:d;
 const blocks=canonical(b.placements.map(p=>{const [x,z]=transform(p.at[0],p.at[2],w,d,turn,mirror);return [x,p.at[1],z,p.role].join(':');}));
 const rooms=canonical(b.rooms.map(r=>{
  const a=transform(r.min[0],r.min[2],w,d,turn,mirror),c=transform(r.max[0]-1,r.max[2]-1,w,d,turn,mirror);
  return [Math.min(a[0],c[0]),Math.min(a[1],c[1]),Math.max(a[0],c[0])+1,Math.max(a[1],c[1])+1,r.min[1],r.max[1]].join(':');
 }));
 const walk=canonical(b.walkable.map(v=>{const [x,z]=transform(v[0],v[2],w,d,turn,mirror);return [x,v[1],z].join(':');}));
 return [W,D,h,blocks,rooms,walk].join('|');
}
export function invariantGeometrySignature(b){
 validateBlueprint(b);
 let best=null;for(let turn=0;turn<4;turn++)for(const mirror of [false,true]){
  const s=key(b,turn,mirror);if(best===null||s<best)best=s;
 }return best;
}
export function findMirroredOrRotatedDuplicates(blueprints){
 const seen=new Map(),collisions=[];
 for(const b of blueprints){const sig=invariantGeometrySignature(b);if(seen.has(sig))collisions.push([seen.get(sig),b.id]);else seen.set(sig,b.id);}
 return collisions;
}
