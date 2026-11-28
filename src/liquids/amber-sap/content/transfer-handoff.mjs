// Amber Sap B: read-only post-adoption handoff, not a transaction executor.
import {planAmberTransfer} from './transfers.mjs';

function sameQuantities(actual,expected){
  if(!actual||typeof actual!=='object'||Array.isArray(actual))return false;
  const keys=Object.keys(expected);
  return Object.keys(actual).length===keys.length&&keys.every(k=>Object.hasOwn(actual,k)&&actual[k]===expected[k]);
}

// The host must hold its edit/streaming lease, atomically adopt the full world
// and container state, then confirm before any simulation or terrain change.
// No plan or matching values prove a real commit; only the host can do that.
export function prepareAmberTransferHandoff(request){
  const plan=planAmberTransfer(request);
  if(!plan||plan.container.revision===Number.MAX_SAFE_INTEGER)return null;
  const {position,world,container:before}=plan;
  const capacity=before.expected.capacity;
  const signal=Object.freeze({changed:Object.freeze([position]),requestStep:true,
    capacityReleased:plan.direction==='collect'&&world.after.units===0});
  function confirm({committed,engine,container,isLoaded,isOpen}={}){
    if(committed!==true)return null;
    if([engine?.getCell,isLoaded,isOpen].some(f=>typeof f!=='function'))throw new TypeError('Explicit adopted state required');
    if(!container||container.id!==before.id||container.capacity!==capacity||
      container.revision!==before.revision+1||container.liquidId!==before.after.id||
      container.units!==before.after.units||!sameQuantities(container.quantities,before.after.quantities))return null;
    if(isLoaded(...position)!==true||isOpen(...position)!==true)return null;
    const c=engine.getCell(...position),a=world.after;
    if(a.units===0?c!==null:(!c||c.x!==position[0]||c.y!==position[1]||c.z!==position[2]||
      c.id!==a.id||c.units!==a.units||!sameQuantities(c.quantities,a.quantities)))return null;
    // External edits are not included in tick.changed. Route this coordinate
    // separately; request a budget-admitted step even if the last tick had
    // pending=0. Retain the signal on downstream rejection, without replaying
    // the transfer. Core owns dormant FIFO promotion; no snapshot scan here.
    return signal;
  }
  return Object.freeze({plan,confirm});
}
