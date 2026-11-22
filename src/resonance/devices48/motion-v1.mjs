// Isolated Resonance mechanism motion; no player, voxel, or production collision writes.
export const MOTION_CONTRACT=Object.freeze({id:'resonance-motion-v1',productionBound:false,collisionBound:false,maxTravel:8,maxTicks:600});
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const bounded=n=>Number.isFinite(n)&&n>=0&&n<=8;
export function createMotion({id,seed,travel,speed=0.125,kind='gate'}){
 if(typeof id!=='string'||!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(id)||!nat(seed)||!bounded(travel)||travel===0||!Number.isFinite(speed)||speed<=0||speed>0.5||!['gate','lift','bridge','platform'].includes(kind))throw Error('invalid motion configuration');
 return Object.freeze({id,seed,travel,speed,kind,position:0,desired:0,tick:0});
}
export function commandMotion(state,{desired,seed,tick,allocation,clearance}){
 if(!state||!nat(seed)||state.seed!==seed||!nat(tick)||tick<=state.tick||tick-state.tick>600||!bounded(state.travel)||!bounded(state.position)||state.position>state.travel||!Number.isFinite(state.speed)||state.speed<=0||state.speed>0.5||![0,1].includes(desired)||!allocation||allocation.id!==state.id||!['running','stopped','off'].includes(allocation.mode)||typeof clearance!=='boolean')throw Error('invalid motion frame');
 const target=desired?state.travel:0;
 // Never move through unknown or obstructed space. Power loss freezes in place.
 const canMove=allocation.mode==='running'&&clearance;
 const delta=canMove?Math.min(state.speed*(tick-state.tick),Math.abs(target-state.position)):0;
 const position=Number((state.position+Math.sign(target-state.position)*delta).toFixed(8));
 return Object.freeze({...state,desired,position,tick,status:!clearance?'blocked':allocation.mode!=='running'?'unpowered':position===target?'idle':'moving'});
}
