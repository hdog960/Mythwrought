// Reads original VoxelWorld cells; resident authority is deliberately external.
// No wind, water flow, fuel or player input fabricated from a block ID.
import {BLOCK,VoxelWorld} from '../../voxel.mjs';
import {physicalCellY} from '../../world-height.mjs';
import {ENVIRONMENT_BRIDGE} from './environment-bridge.mjs';
export function observeResidentCrystal(world,descriptor,tick,isResident){
 if(!(world instanceof VoxelWorld)||descriptor?.model!=='crystal'||descriptor.seed!==world.seed||!Number.isSafeInteger(tick)||tick<0||typeof isResident!=='function'||!Array.isArray(descriptor.anchor)||descriptor.anchor.length!==3||!descriptor.anchor.every(Number.isSafeInteger)||!physicalCellY(descriptor.anchor[1]))throw Error('invalid crystal observation');
 const [x,y,z]=descriptor.anchor;
 if(isResident(x,y,z)!==true)return null;
 // A base crystal cell underneath the machine is not inferred from natural generation;
 // read the actual edited world at the exact assigned source anchor.
 const crystalPresent=world.get(x,y,z)===BLOCK.CRYSTAL;
 return Object.freeze({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:tick,instanceKey:descriptor.instanceKey,values:Object.freeze({crystalPresent})});
}
