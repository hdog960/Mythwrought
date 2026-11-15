// MYTHWROUGHT Roadmap 9 M2: PURE, DETACHED candidate flight model.
// No imports from the game, no storage, world edits, network, or runtime registration.
export const FLIGHT_PROFILES=Object.freeze({precision:1.4,normal:4,fast:8,travel:15});
export const FLIGHT_PROFILE_NAMES=Object.freeze(Object.keys(FLIGHT_PROFILES));
export const FLIGHT_CHUNK_SIZE=16;
export const MAX_PREFETCH_PENDING=6;
export const MAX_PREFETCH_PER_STEP=2;
export const MAX_FRAME_SECONDS=.05;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const pos=p=>p&&finite(p.x)&&finite(p.y)&&finite(p.z);
const bounded=(p,limits)=>p.y>=limits.minY&&p.y<=limits.maxY;
const snap=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
export function flightRegionKey(position){
 if(!pos(position))throw TypeError('Non-finite flight position');
 return [Math.floor(position.x/FLIGHT_CHUNK_SIZE),Math.floor(position.y/FLIGHT_CHUNK_SIZE),Math.floor(position.z/FLIGHT_CHUNK_SIZE)].join(':');
}
export function createFlightState(position={x:0,y:6,z:0},limits={minY:2,maxY:30}){
 if(!pos(position)||!finite(limits?.minY)||!finite(limits?.maxY)||limits.minY>=limits.maxY||!bounded(position,limits))
   throw TypeError('Invalid initial flight region and height');
 return Object.freeze({position:snap(position),limits:Object.freeze({...limits}),active:false,
   profile:'normal',yaw:0,pitch:0,blocked:false,pending:Object.freeze([]),reason:'Flight off'});
}
function withState(state,changes){return Object.freeze({...state,...changes});}
export function enterFlight(state,isRegionReady){
 if(state.active)return state;
 if(typeof isRegionReady!=='function'||!isRegionReady(state.position))
  return withState(state,{reason:'Cannot fly: starting region is not loaded',blocked:true});
 return withState(state,{active:true,blocked:false,reason:'Hover · ready'});
}
export function setFlightProfile(state,profile){
 if(!FLIGHT_PROFILE_NAMES.includes(profile))return state;
 return withState(state,{profile});
}
export function planFlightStep(state,intent={},env={}){
 if(!state?.active)return Object.freeze({state,requests:Object.freeze([])});
 const {isRegionReady}=env;
 if(typeof isRegionReady!=='function')throw TypeError('Flight requires a region-readiness adapter');
 const dt=finite(intent.dt)?clamp(intent.dt,0,MAX_FRAME_SECONDS):0;
 const v=[intent.strafe??0,intent.forward??0,intent.vertical??0];
 if(!v.every(finite))throw TypeError('Invalid flight direction');
 const max=Math.max(1,Math.hypot(...v));
 const [strafe,forward,vertical]=v.map(n=>clamp(n,-1,1)/max);
 const yaw=finite(intent.yaw)?intent.yaw:state.yaw;
 const pitch=finite(intent.pitch)?clamp(intent.pitch,-1.35,1.35):state.pitch;
 const speed=FLIGHT_PROFILES[state.profile];
 const candidate={x:state.position.x+(Math.cos(yaw)*strafe+Math.sin(yaw)*forward)*speed*dt,
   y:state.position.y+vertical*speed*dt,
   z:state.position.z+(-Math.sin(yaw)*strafe+Math.cos(yaw)*forward)*speed*dt};
 // Check the entire short motion segment. This never warps through unready chunks.
 const distance=Math.hypot(candidate.x-state.position.x,candidate.y-state.position.y,candidate.z-state.position.z);
 const segments=Math.max(1,Math.ceil(distance/.25));
 let allowed=true,unready=null;
 for(let n=1;n<=segments;n++){
   const t=n/segments;
   const point={x:state.position.x+(candidate.x-state.position.x)*t,
     y:state.position.y+(candidate.y-state.position.y)*t,
     z:state.position.z+(candidate.z-state.position.z)*t};
   if(!bounded(point,state.limits)||!isRegionReady(point)){allowed=false;unready=point;break;}
 }
 const pending=state.pending.filter(key=>!(env.isRegionKeyReady?.(key)??false));
 const requests=[];
 // At most two fresh requests, six in flight, deduplicated across frames.
 // Calling code decides whether to submit them; M2 preview never loads real chunks.
 const enqueue=point=>{
   if(!point||!pos(point)||requests.length>=MAX_PREFETCH_PER_STEP||pending.length>=MAX_PREFETCH_PENDING)return;
   const key=flightRegionKey(point);
   if(pending.includes(key))return;
   pending.push(key);requests.push(Object.freeze({key,point:snap(point)}));
 };
 if(unready)enqueue(unready);
 // Prefetch only when moving, and only toward the future travel direction.
 if(distance>0.0001){const advance=Math.min(FLIGHT_CHUNK_SIZE,Math.max(1,speed*1.5));
   const unit={x:(candidate.x-state.position.x)/distance,y:(candidate.y-state.position.y)/distance,
     z:(candidate.z-state.position.z)/distance};
   const ahead={x:state.position.x+unit.x*advance,y:clamp(state.position.y+unit.y*advance,state.limits.minY,state.limits.maxY),
     z:state.position.z+unit.z*advance};
   if(!isRegionReady(ahead))enqueue(ahead);
 }
 const next=withState(state,{position:allowed?snap(candidate):state.position,yaw,pitch,
   blocked:!allowed,reason:allowed?'Hover · ready':'Unloaded or unsafe region · holding position',pending:Object.freeze(pending)});
 return Object.freeze({state:next,requests:Object.freeze(requests)});
}
export function returnToGround(state,findSafeLanding,isRegionReady){
 if(!state.active)return Object.freeze({state,landed:true});
 if(typeof findSafeLanding!=='function'||typeof isRegionReady!=='function')
   throw TypeError('Landing requires explicit safety and readiness adapters');
 const landing=findSafeLanding(state.position);
 if(!pos(landing)||!bounded(landing,state.limits)||!isRegionReady(landing)||landing.y>state.position.y)
   return Object.freeze({state:withState(state,{blocked:true,reason:'No verified landing · remain hovering'}),landed:false});
 return Object.freeze({state:withState(state,{active:false,position:snap(landing),pending:Object.freeze([]),
   blocked:false,reason:'Landed safely'}),landed:true});
}
