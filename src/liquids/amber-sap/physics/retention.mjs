// Amber Sap A: opt-in transfer limiter for a future shared-engine policy hook.
// Pure, bounded calculation only; never moves liquid or writes terrain.
import {sampleSapRetention} from './definition.mjs';

const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const valid=c=>c?.id==='amber-sap'&&Number.isSafeInteger(c.x)&&
  int(c.y,-210,256)&&Number.isSafeInteger(c.z)&&int(c.units,1,8);
const emptyFaces=Object.freeze([]);

export function createSapRetentionPolicy({isLoaded,isOpen,isSolid,isAdhesive,
  enabled=false,bottomReserve=0,sideReserve=1,topReserve=1}={}){
  if(typeof enabled!=='boolean'||![bottomReserve,sideReserve,topReserve].every(n=>int(n,0,8)))
    throw new RangeError('Invalid sap retention policy');
  if([isLoaded,isOpen,isSolid,isAdhesive].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit sap retention host callbacks required');
  const policy=Object.freeze({enabled,bottomReserve,sideReserve,topReserve});
  function describe(cell){
    if(!valid(cell))throw new TypeError('Expected a valid amber sap cell');
    if(!enabled)return Object.freeze({faces:emptyFaces,reservedUnits:0,movableUnits:cell.units});
    if(isLoaded(cell.x,cell.y,cell.z)!==true||isOpen(cell.x,cell.y,cell.z)!==true)return null;
    // Only an actual contacted, loaded, solid AND host-approved adhesive face
    // may retain volume. The original ceiling-contact correction is reused.
    const contact=sampleSapRetention(cell,{isLoaded,
      isSolid:(x,y,z)=>isSolid(x,y,z)===true&&isAdhesive(x,y,z)===true});
    if(!contact)return null;
    let reserve=0;
    for(const face of contact.faces){
      reserve=Math.max(reserve,face==='bottom'?bottomReserve:face==='top'?topReserve:sideReserve);
    }
    // Corners never multiply retention; a reserve is a floor, not a second
    // inventory. Recompute against the current immutable cell each transfer.
    const reservedUnits=Math.min(cell.units,reserve);
    return Object.freeze({faces:contact.faces,reservedUnits,movableUnits:cell.units-reservedUnits});
  }
  function limitTransfer(cell,requestedUnits){
    if(!int(requestedUnits,0,8))throw new RangeError('Invalid proposed transfer');
    const result=describe(cell);
    return result===null?0:Math.min(requestedUnits,result.movableUnits);
  }
  return Object.freeze({policy,describe,limitTransfer});
}
