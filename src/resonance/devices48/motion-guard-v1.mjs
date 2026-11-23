// Opt-in motion safety gate; does not move production actors or voxels.
export const MOTION_GUARD_CONTRACT=Object.freeze({id:'resonance-motion-guard-v1',productionBound:false,collisionBound:false,maxSamples:64});
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const finite=n=>Number.isFinite(n);
export function guardMotionStep(state,request,{seed,tick,allocation,clearance}){
 if(!state||!request||!nat(seed)||state.seed!==seed||!nat(tick)||tick<=state.tick||!allocation||allocation.id!==state.id||allocation.tick!==tick||!['running','stopped','off'].includes(allocation.mode)||typeof clearance!=='function')throw Error('invalid guarded motion frame');
 if(!finite(state.position)||!finite(state.travel)||!finite(state.speed)||state.travel<=0||state.travel>8||state.position<0||state.position>state.travel||state.speed<=0||state.speed>0.5||![0,1].includes(request.desired))throw Error('invalid mechanism');
 const dt=tick-state.tick;
 if(dt>600)throw Error('stale tick');
 const target=request.desired?state.travel:0;
 const proposed=allocation.mode==='running'?state.position+Math.sign(target-state.position)*Math.min(Math.abs(target-state.position),state.speed*dt):state.position;
 // Bounded sweep; missing clearance evidence fails closed.
 const distance=Math.abs(proposed-state.position);
 const samples=Math.ceil(distance/0.125);
 if(samples>64)throw Error('sweep budget exceeded');
 let blocked=false;
 for(let i=1;i<=samples;i++){
  const at=state.position+(proposed-state.position)*i/samples;
  const verdict=clearance(Object.freeze({id:state.id,seed,tick,kind:state.kind,from:state.position,to:at,sample:i,samples}));
  if(verdict!==true){blocked=true;break;}
 }
 const position=blocked?state.position:Number(proposed.toFixed(8));
 return Object.freeze({...state,desired:request.desired,position,tick,status:blocked?'blocked':allocation.mode!=='running'?'unpowered':position===target?'idle':'moving',sweepVerified:!blocked&&samples>0,sweepSamples:blocked?0:samples});
}
