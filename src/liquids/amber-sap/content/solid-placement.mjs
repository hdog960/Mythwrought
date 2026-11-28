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
