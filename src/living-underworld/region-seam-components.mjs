// Real 3D voxel flood-fill across independently planned UNDERWORLD regions.
// Both anchor cells must be AIR in the SAME exact face-connected component.
// It validates a bounded seam, NOT the infinite cave component fraction.
import {planUnderworldRegion,UNDERWORLD_LEVELS} from './worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt} from './depth-calibrated-proposal.mjs';
import {auditBoundedCaveComponents} from './bounded-components.mjs';

export function auditPhysicalRegionSeams(seed,rx,rz,{
 directions=['east','south'],levelIndices=[0,1,2,3],
 radius=8,maxCells=16384
}={}){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
   ![rx,rz].every(Number.isSafeInteger)||
   !Array.isArray(directions)||directions.length<1||directions.length>2||
   directions.some(d=>!['east','south'].includes(d))||
   new Set(directions).size!==directions.length||
   !Array.isArray(levelIndices)||levelIndices.length<1||levelIndices.length>4||
   levelIndices.some(i=>!Number.isSafeInteger(i)||i<0||i>=UNDERWORLD_LEVELS.length)||
   new Set(levelIndices).size!==levelIndices.length||
   !Number.isSafeInteger(radius)||radius<4||radius>12||
   !Number.isSafeInteger(maxCells)||maxCells<1000||maxCells>65536)
  throw new TypeError('Invalid physical region seam audit');
 const plan=planUnderworldRegion(seed,rx,rz),checks=[];
 for(const index of levelIndices)for(const direction of directions){
  const portal=plan.layers[index].portals[direction];
  const horizontal=direction==='east'?'x':'z';
  const left={...portal,[horizontal]:portal[horizontal]-3};
  const right={...portal,[horizontal]:portal[horizontal]+3};
  const size={x:radius*2+1,y:13,z:radius*2+1};
  const sample=auditBoundedCaveComponents({
   origin:{x:portal.x-radius,y:portal.y-6,z:portal.z-radius},
   size,maxCells,anchors:[left,right],
   airAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)
  });
  const passed=sample.ok===true&&sample.anchors.every(a=>a.inBounds&&a.air)&&
   sample.allAirAnchorsConnected===true;
  checks.push(Object.freeze({depth:UNDERWORLD_LEVELS[index].name,
   direction,portal,passed,
   components:sample.componentCount??null,
   largestAirShare:sample.largestAirShare??null,
   anchors:sample.anchors??[],reason:sample.reason??null}));
 }
 return Object.freeze({seed,rx,rz,pass:checks.every(c=>c.passed),
  checkedSeams:checks.length,checks:Object.freeze(checks),
  caveVoxelReader:'detachedCalibratedUnderworldAirAt',
  actualM7Modified:false,completeInfiniteConnectivityUnverified:true});
}
