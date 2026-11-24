// Read-only actual M7 switchback navigation. Select retained, supported
// positions within the existing authored route, never carve or install cells.
import {BLOCK,collides} from '../voxel.mjs';
import {stepPlayer} from '../physics.mjs';
import {descentRoute} from '../underground-switchback-descent.mjs';
const freeze=Object.freeze;
const at=(p)=>({x:p.x+.5,z:p.z+.5,feet:p.feet,yaw:0,pitch:0,
 vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0});
const supported=(world,p)=>!collides(world,p.x+.5,p.feet,p.z+.5)&&
 collides(world,p.x+.5,p.feet-.002,p.z+.5);
const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.z-b.z);
const cellKey=p=>p.x+','+p.feet+','+p.z;
function advance(world,state,target){
 const p={...state};let frames=0;
 for(let n=0;n<120;n++){
  const dx=target.x+.5-p.x,dz=target.z+.5-p.z,d=Math.hypot(dx,dz);
  if(d>.085)p.yaw=Math.atan2(dx,dz);
  stepPlayer(world,p,{forward:d>.085?1:0,strafe:0,jump:false},1/60);
  frames++;
  if(collides(world,p.x,p.feet,p.z)||p.feet<target.feet-1.05)
   return {ok:false,frames,reason:'BODY_OR_DROP'};
  if(Math.hypot(target.x+.5-p.x,target.z+.5-p.z)<=.12&&
     Math.abs(p.feet-target.feet)<=.025&&p.onGround&&
     collides(world,p.x,p.feet-.002,p.z))
   return {ok:true,state:p,frames};
 }
 return {ok:false,frames,reason:'TARGET_NOT_REACHED'};
}
export function traverseRetainedDescent(world,route){
 if(!world||typeof world.get!=='function'||!Array.isArray(route)||!route.length)
  throw TypeError('Original world and nonempty route required');
 if(!supported(world,route[0]))return freeze({ok:false,frames:0,reached:0,reason:'INITIAL_SUPPORT'});
 let state=at(route[0]),frames=0;
 for(let i=1;i<route.length;i++){
  const r=advance(world,state,route[i]);frames+=r.frames;
  if(!r.ok)return freeze({ok:false,frames,reached:i,reason:r.reason,blockedAt:freeze({...route[i]})});
  state=r.state;
 }
 return freeze({ok:true,frames,reached:route.length,reason:null});
}
function candidates(world,nominal,allowOffset){
 const out=[];
 for(const dy of [0,-1,1,-2])for(const dx of [0,-1,1])for(const dz of [0,-1,1]){
  if(!allowOffset&&(dx||dy||dz))continue;
  const p={x:nominal.x+dx,z:nominal.z+dz,feet:nominal.feet+dy};
  // Require original authored AIR at both body cells, not an unrelated
  // natural void or a fabricated support. Original actual collision decides
  // support, including any old retained authored floors.
  if(world.environmentCaves.get(p.x,p.feet,p.z)!==BLOCK.AIR||
     world.environmentCaves.get(p.x,p.feet+1,p.z)!==BLOCK.AIR||
     !supported(world,p))continue;
  out.push(freeze({...p,offsetCost:Math.abs(dx)+Math.abs(dz)+Math.abs(dy)}));
 }
 return out.sort((a,b)=>a.offsetCost-b.offsetCost);
}
export function planRetainedOriginalDescent(world,{maxStations=128,beamWidth=4}={}){
 const nominal=descentRoute();
 if(!world?.environmentCaves||typeof world.environmentCaves.get!=='function'||
    !Number.isSafeInteger(maxStations)||maxStations<2||maxStations>nominal.length||
    !Number.isSafeInteger(beamWidth)||beamWidth<1||beamWidth>6)
  throw TypeError('Bounded original M7 descent reader required');
 const initial=candidates(world,nominal[0],false);
 let states=initial.map(p=>({p,state:at(p),prev:null,cost:0,frames:0,index:0}));
 let best=states[0],attempts=0,failedAt=null;
 const hardAttemptLimit=maxStations*beamWidth*36;
 for(let i=1;i<maxStations&&states.length;i++){
  const options=candidates(world,nominal[i],true),next=[];
  const seen=new Set();
  for(const prior of states){
   for(const p of options){
    if(distance(prior.p,p)<1||distance(prior.p,p)>2||Math.abs(prior.p.feet-p.feet)>1)continue;
    if(seen.has(cellKey(p)))continue;
    if(++attempts>hardAttemptLimit)throw Error('DESCENT_CONTROLLER_ATTEMPT_CAP');
    // Independent reverse edge check before selecting a route. The final
    // reverse replay still must pass continuously without resetting state.
    const forward=advance(world,prior.state,p);
    if(!forward.ok)continue;
    const reverse=advance(world,at(p),prior.p);
    if(!reverse.ok)continue;
    seen.add(cellKey(p));
    next.push({p,state:forward.state,prev:prior,cost:prior.cost+p.offsetCost,
      frames:prior.frames+forward.frames,index:i});
    if(next.length>=beamWidth*2)break;
   }
   if(next.length>=beamWidth*2)break;
  }
  if(!next.length){failedAt=freeze({index:i,nominal:freeze({...nominal[i]}),supportedCandidates:options.length});break;}
  states=next.sort((a,b)=>a.cost-b.cost||a.frames-b.frames).slice(0,beamWidth);
  best=states[0];
 }
 const route=[];
 for(let node=best;node;node=node.prev)route.push(node.p);
 route.reverse();
 const forward=route.length?traverseRetainedDescent(world,route):null;
 const reverse=forward?.ok?traverseRetainedDescent(world,[...route].reverse()):null;
 const full=route.length===maxStations&&forward?.ok&&reverse?.ok;
 return freeze({ok:!!full,reason:full?null:failedAt?'RETAINED_ROUTE_FRONTIER_HOLD':'CONTINUOUS_REPLAY_HOLD',
  requestedStations:maxStations,originalTotalStations:nominal.length,verifiedPrefixStations:route.length,
  route:freeze(route),failedAt,attempts,hardAttemptLimit,
  shiftedStations:route.filter(p=>p.offsetCost>0).length,
  forward,reverse,deepestFeet:route.length?Math.min(...route.map(p=>p.feet)):null,
  originalAuthoredAirRequired:true,constructedSupportCells:0,worldChanged:false,
  liveWalkingVerified:false,releaseApproved:false});
}
