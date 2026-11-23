import {previewContinuousAssemblySweep} from './continuous-assembly-sweep-v2.mjs';
const validId=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(s);
const validCoord=n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000;
export function previewAssemblyObstructions(input) {
 if(!input||typeof input!=='object'||Array.isArray(input)) throw new TypeError('input');
 if(input.productionBound!==false||input.allowActuation===true||input.authoritativeDelivery===true) throw new Error('source-only');
 const sweep=previewContinuousAssemblySweep(input);
 if(!Array.isArray(input.obstacles)||input.obstacles.length>256) throw new RangeError('obstacles');
 const cells=new Set(sweep.sweptCells.map(p=>p.x+','+p.y+','+p.z)),ids=new Set(),blockers=[];
 for(const obstacle of input.obstacles){
  if(!obstacle||typeof obstacle!=='object'||Array.isArray(obstacle)||!validId(obstacle.id)||!['actor','terrain','protected-edit'].includes(obstacle.kind)) throw new TypeError('obstacle');
  if(ids.has(obstacle.id)) throw new Error('duplicate obstacle');
  ids.add(obstacle.id);
  if(obstacle.worldId!==input.worldId) throw new Error('cross-world obstacle');
  const {x,y,z}=obstacle;
  if(![x,y,z].every(validCoord)) throw new RangeError('obstacle coordinate');
  if(cells.has(x+','+y+','+z)) blockers.push(Object.freeze({id:obstacle.id,kind:obstacle.kind,x,y,z}));
 }
 blockers.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 return Object.freeze({version:1,worldId:sweep.worldId,deviceId:sweep.deviceId,sourceOnly:true,mayActuate:false,requiresGameCollision:true,requiresDeliveredPowerReceipt:true,clearPreview:blockers.length===0,blockers:Object.freeze(blockers),energyDemandUnits:sweep.energyDemandUnits});
}
