// Amber Sap B: content admission for Amber Sap A's staged solidification.
// Never execute terrain or inventory writes here; the physics owner owns mass.
import {planHardenedAmber} from './transfers.mjs';

export function stageAmberContentPlacement({engine,curing,proposal,solidification,
  solid,revision,isLoaded,isOpen,canPlaceAmber,canUseMaterial}={}){
  if(typeof solidification?.stage!=='function'||typeof canUseMaterial!=='function'||
    !Number.isSafeInteger(revision)||revision<0||revision===Number.MAX_SAFE_INTEGER)
    throw new TypeError('Explicit solidification owner, material policy and revision required');
  const content=planHardenedAmber({proposal,curing,engine,isLoaded,isOpen,canPlaceAmber});
  if(!content||canUseMaterial(content.material,content.position)!==true)return null;
  const staged=solidification.stage({engine,curing,proposal:content.physicsProposal,solid,revision});
  if(staged===null)return null;
  const p=staged?.placement,[x,y,z]=content.position;
  if(!p||p.x!==x||p.y!==y||p.z!==z||p.product!==content.material||p.solidUnits!==content.solidUnits||
    staged.expectedRevision!==revision||staged.nextRevision!==revision+1||
    !Array.isArray(staged.changed)||staged.changed.length!==1||
    !Array.isArray(staged.changed[0])||staged.changed[0].length!==3||
    staged.changed[0].some((v,i)=>v!==content.position[i]))
    throw new TypeError('Incompatible solidification placement result');
  // The ledger-backed placement is the sole product; never grant a second item.
  // Preserve the entire owner result for a future atomic host adoption.
  return Object.freeze({kind:'amber-solid-placement',material:content.material,
    expectedRevision:revision,position:content.position,staged});
}

function matchesSolid(c,position){
  return !!c&&c.x===position[0]&&c.y===position[1]&&c.z===position[2]&&
    c.id==='amber-sap'&&c.units===8&&c.quantities&&typeof c.quantities==='object'&&
    !Array.isArray(c.quantities)&&Object.keys(c.quantities).length===0;
}

// Host must authenticate and atomically adopt the complete owner stage with
// physical terrain, then confirm under the same edit/streaming lease, before
// a tick or any other edit. Matching reads do not themselves prove adoption.
export function prepareAmberSolidHandoff(request){
  const plan=stageAmberContentPlacement(request);
  if(!plan)return null;
  const {position,material,staged}=plan;
  // Owner appends the conserved solid record, never a separate item reward.
  if(staged.solid?.version!==1||!Array.isArray(staged.solid.cells)||
    !matchesSolid(staged.solid.cells.at(-1),position))
    throw new TypeError('Missing staged amber ledger record');
  const nextRevision=staged.nextRevision;
  const signal=Object.freeze({changed:Object.freeze([position]),requestStep:true,capacityReleased:true});
  function confirm({committed,revision,engine,isLoaded,isOpen,hasMaterial,getSolidCell}={}){
    if(committed!==true||revision!==nextRevision)return null;
    if([engine?.getCell,isLoaded,isOpen,hasMaterial,getSolidCell].some(f=>typeof f!=='function'))
      throw new TypeError('Explicit adopted solid state required');
    if(isLoaded(...position)!==true||isOpen(...position)!==false||
      hasMaterial(material,position)!==true||engine.getCell(...position)!==null||
      !matchesSolid(getSolidCell(...position),position))return null;
    // Render the external voxel change separately from tick.changed. Request a
    // budget-admitted step even when the old queue was idle. Retain the signal
    // on downstream deferral; never replay solidification or grant inventory.
    return signal;
  }
  return Object.freeze({plan,confirm});
}
