// Opt-in AABB body-fit checks against registered local voxel shape boxes.
// No mutation of worlds, saves, block IDs or UI.
import {validateShape} from './voxel-shape-interactions.mjs';
const EPS=1e-9;
function validBounds(b) {return Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&[0,1,2].every(i=>b[i]<b[i+3]);}
function overlap(a,b) {return [0,1,2].every(i=>a[i]<b[i+3]-EPS&&b[i]<a[i+3]-EPS);}
export function inspectBodyFit(body,getShape,{maxCells=4096}={}) {
  if(!validBounds(body)||typeof getShape!=='function'||!Number.isSafeInteger(maxCells)||maxCells<1) throw new TypeError('Invalid body or shape reader');
  const lo=body.slice(0,3).map(Math.floor);
  const hi=body.slice(3).map(v=>Math.ceil(v)-1);
  const count=hi.reduce((p,v,i)=>p*(v-lo[i]+1),1);
  if(!Number.isSafeInteger(count)||count>maxCells) throw new RangeError('Body check exceeds cell budget');
  for(let x=lo[0];x<=hi[0];x++) for(let y=lo[1];y<=hi[1];y++) for(let z=lo[2];z<=hi[2];z++) {
    const shape=getShape(x,y,z);
    if(shape==null) continue;
    if(!validateShape(shape)) throw new TypeError('Invalid registered shape');
    for(const local of shape.boxes) {
      const world=local.map((v,i)=>v+[x,y,z][i%3]);
      if(overlap(body,world)) return {fits:false,cell:[x,y,z],box:world};
    }
  }
  return {fits:true,cell:null,box:null};
}
export function canPlaceWithoutTrapping(shape,cell,getShape,playerBody) {
  if(!validateShape(shape)||!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isInteger)) throw new TypeError('Invalid placement');
  if(typeof getShape!=='function') throw new TypeError('Invalid reader');
  // The host must still enforce world edit protections and same-cell occupancy.
  return inspectBodyFit(playerBody,(x,y,z)=>x===cell[0]&&y===cell[1]&&z===cell[2]?shape:null).fits;
}
