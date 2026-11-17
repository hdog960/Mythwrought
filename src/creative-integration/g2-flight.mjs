// G2A pure flight math. Not connected to the game loop or native controls.
// All readiness and physical collision authority must come from production hosts.
import {createG2PrefetchState,planG2Prefetch,G2_MAX_LOOKAHEAD} from './g2-streaming.mjs';
export const G2_FLIGHT_SPEEDS=Object.freeze({precision:1.4,normal:4,fast:8,travel:15});
export const G2_MAX_FRAME_SECONDS=0.05;
export const G2_MAX_SEGMENT_LENGTH=0.25;
const num=n=>typeof n==='number'&&Number.isFinite(n);
const point=p=>p&&['x','y','z'].every(k=>num(p[k]));
const fail=s=>{throw new TypeError('G2 flight: '+s);};
const freezePos=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const inBounds=(p,b)=>p.y>=b.minFeet&&p.y<=b.maxFeet;
const staticReturn=(state,reason)=>Object.freeze({state:Object.freeze({...state,blocked:true,reason}),
  requests:Object.freeze([]),cancelled:Object.freeze([])});
export function createG2FlightState({position,heightBounds,worldToken}={}){
  if(!point(position)||!heightBounds||!num(heightBounds.minFeet)||!num(heightBounds.maxFeet)||
     heightBounds.minFeet>=heightBounds.maxFeet||!inBounds(position,heightBounds)||
     typeof worldToken!=='string'||!worldToken.length)fail('verified position, feet bounds and world token required');
  return Object.freeze({mode:'off',position:freezePos(position),
    heightBounds:Object.freeze({minFeet:heightBounds.minFeet,maxFeet:heightBounds.maxFeet}),
    worldToken,profile:'normal',yaw:0,pitch:0,blocked:false,reason:'Flight off',
    prefetch:createG2PrefetchState(worldToken)});
}
export function armG2Flight(state,{isRegionReady,isBodyClear,enabled=false}={}){
  if(!state||state.mode!=='off')fail('only grounded/off state can arm');
  if(!enabled)return Object.freeze({...state,reason:'Creative flight disabled by feature gate'});
  if(typeof isRegionReady!=='function'||typeof isBodyClear!=='function')
    fail('real world readiness and player-body collision readers required');
  if(!isRegionReady(state.position)||!isBodyClear(state.position))
    return Object.freeze({...state,blocked:true,reason:'Starting position unloaded or colliding'});
  return Object.freeze({...state,mode:'flight',blocked:false,reason:'Hover ready'});
}
export function selectG2FlightProfile(state,profile){
  if(!state||!Object.hasOwn(G2_FLIGHT_SPEEDS,profile))fail('unknown flight profile');
  return Object.freeze({...state,profile});
}
export function planG2FlightStep(state,intent={},host={}){
  if(!state)fail('state required');
  if(state.mode!=='flight')return Object.freeze({state,requests:Object.freeze([]),cancelled:Object.freeze([])});
  if(host.worldToken!==state.worldToken)return staticReturn(state,'World changed; flight suspended');
  if(typeof host.isRegionReady!=='function'||typeof host.isBodyClear!=='function'||
     typeof host.sectionForY!=='function')fail('live readiness, full body clearance and section reader required');
  const dt=num(intent.dt)?clamp(intent.dt,0,G2_MAX_FRAME_SECONDS):0;
  const raw=[intent.strafe??0,intent.forward??0,intent.vertical??0];
  if(!raw.every(num)||raw.some(n=>Math.abs(n)>1))fail('axis outside normalized range');
  const mag=Math.max(1,Math.hypot(...raw));
  const [side,front,up]=raw.map(n=>n/mag);
  const yaw=intent.yaw===undefined?state.yaw:intent.yaw;
  const pitch=intent.pitch===undefined?state.pitch:intent.pitch;
  if(!num(yaw)||!num(pitch))fail('invalid look angles');
  const head=clamp(pitch,-Math.PI/2+.015,Math.PI/2-.015);
  const speed=G2_FLIGHT_SPEEDS[state.profile];
  const delta={x:(Math.cos(yaw)*side+Math.sin(yaw)*front)*speed*dt,
    y:up*speed*dt,z:(-Math.sin(yaw)*side+Math.cos(yaw)*front)*speed*dt};
  const candidate={x:state.position.x+delta.x,y:state.position.y+delta.y,z:state.position.z+delta.z};
  const distance=Math.hypot(delta.x,delta.y,delta.z);
  const count=Math.max(1,Math.ceil(distance/G2_MAX_SEGMENT_LENGTH));
  let blocked=false,unready=null,colliding=false;
  for(let i=1;i<=count;i++){
    const t=i/count,p={x:state.position.x+delta.x*t,
      y:state.position.y+delta.y*t,z:state.position.z+delta.z*t};
    if(!inBounds(p,state.heightBounds)){blocked=true;break;}
    if(!host.isRegionReady(p)){blocked=true;unready=p;break;}
    if(!host.isBodyClear(p)){blocked=true;colliding=true;break;}
  }
  // Intent-token is deterministic in the rounded travel direction, not every
  // frame's tiny joystick jitter. This cancels outdated plans on reversal.
  const axis=distance>1e-8?[delta.x/distance,delta.y/distance,delta.z/distance]:[0,0,0];
  const intentToken=axis.map(n=>Math.abs(n)<.2?'0':n>0?'+':'-').join('');
  const ahead=distance>1e-8?{
    x:state.position.x+axis[0]*Math.min(G2_MAX_LOOKAHEAD,Math.max(1,speed*1.5)),
    y:clamp(state.position.y+axis[1]*Math.min(G2_MAX_LOOKAHEAD,Math.max(1,speed*1.5)),
      state.heightBounds.minFeet,state.heightBounds.maxFeet),
    z:state.position.z+axis[2]*Math.min(G2_MAX_LOOKAHEAD,Math.max(1,speed*1.5))
  }:null;
  const plan=planG2Prefetch(state.prefetch,{worldToken:state.worldToken,intentToken,
    points:[...(unready?[unready]:[]),...(ahead?[ahead]:[])],
    sectionForY:host.sectionForY,isRegionReady:host.isRegionReady});
  const next=Object.freeze({...state,position:blocked?state.position:freezePos(candidate),
    yaw,pitch:head,blocked,reason:blocked?(colliding?'Physical collision; holding position':
      unready?'Unloaded region; holding position':'Flight altitude limit; holding position'):'Hover ready',
    prefetch:plan.state});
  return Object.freeze({state:next,requests:plan.requests,cancelled:plan.cancelled});
}
export function holdG2Flight(state,reason='Flight input safely suspended'){
  if(!state)fail('state required');
  return Object.freeze({...state,blocked:true,reason,
    prefetch:createG2PrefetchState(state.worldToken)});
}
