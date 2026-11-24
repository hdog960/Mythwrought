// Phase36: bounded read-only compact passage projection across two OWNED
// neighboring chunks at an original upper portal. No constructed supports,
// no live world, no source edits. Original collision/stepPlayer on a sealed
// future mask; unknown cells are solid and never count as floor evidence.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../voxel.mjs';
import {stepPlayer,STEP_HEIGHT} from '../physics.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {auditSourceProtectedChunkRisk} from './source-protected-chunk-risk.mjs';
import {summarizeSourceProtectedChunkRisk} from './source-protected-chunk-aggregate.mjs';
const INT=Number.isSafeInteger,key=(x,y,z)=>x+','+y+','+z;
const roles=['naturalAt','authoredAt','editedAt','protectedAt'];
const freeze=Object.freeze;
const refusal=(reason,extra={})=>freeze({ok:false,reason,...extra,
 worldChanged:false,liveWalkingVerified:false,constructedSupportCells:0});
export function compactPortalChunkPair(seed,rx,rz,direction){
 if(!['east','south'].includes(direction))throw TypeError('Use unique east or south seam');
 const portal=planUnderworldRegion(seed,rx,rz).layers[0].portals[direction];
 const neighbor=planUnderworldRegion(seed,rx+(direction==='east'?1:0),
  rz+(direction==='south'?1:0)).layers[0].portals[direction==='east'?'west':'north'];
 if(JSON.stringify(portal)!==JSON.stringify(neighbor))
  throw Error('ORIGINAL_PORTAL_RECIPROCITY_CHANGED');
 const axis=direction==='east'?'x':'z';
 const origin={x:Math.floor(portal.x/16)*16,y:Math.floor(portal.y/16)*16,
  z:Math.floor(portal.z/16)*16};
 if(origin[axis]!==portal[axis])throw Error('PORTAL_NOT_ON_CHUNK_SEAM');
 return freeze({portal,axis,origins:freeze([freeze({...origin,[axis]:origin[axis]-16}),
  freeze(origin)])});
}
export function auditCompactPortalSeam({seed,rx,rz,direction,source}={}){
 if(!source||roles.some(r=>typeof source[r]!=='function'))
  throw TypeError('Invalid original seam source');
 if(BODY_RADIUS!==.28||BODY_HEIGHT!==1.78||STEP_HEIGHT!==1.01)
  return refusal('ORIGINAL_PLAYER_CONTRACT_CHANGED');
 const pair=compactPortalChunkPair(seed,rx,rz,direction);
 const memo=Object.fromEntries(roles.map(r=>[r,new Map()]));
 const reads=Object.fromEntries(roles.map(r=>[r,0]));
 const readers=freeze(Object.fromEntries(roles.map(role=>[role,(x,y,z)=>{
  const k=key(x,y,z),map=memo[role];
  if(!map.has(k)){
   if(map.size>=11016)throw Error('SEAM_UNIQUE_SOURCE_BUDGET');
   const v=source[role](x,y,z);reads[role]++;map.set(k,v);
  }
  return map.get(k);
 }])));
 const candidates=new Map();
 const mask=(x,y,z)=>{
  const k=key(x,y,z);
  if(!candidates.has(k))candidates.set(k,compactUpperHubResearchAirAt(seed,x,y,z));
  return candidates.get(k);
 };
 const chunks=pair.origins.map(origin=>auditSourceProtectedChunkRisk({
  origin,source:readers,candidateAirAt:mask,side:16,maxCells:6000,maxFaceGrowth:1200
 }));
 // The paired halo has 2*18*18 shared voxels. Count both owned chunks,
 // not a cheaper averaged or split budget. Source permission gates unchanged.
 const aggregate=summarizeSourceProtectedChunkRisk(chunks,{
  expectedChunks:2,maxTotalFaceGrowth:3500,maxTotalSourceQueries:40000,
  maxTotalApprovedCarves:10000,requireInteriorEvidence:true});
 const detail={seed,rx,rz,direction,pair,chunks,aggregate,
  originalRoleInvocations:freeze({...reads}),
  uniqueNaturalCells:memo.naturalAt.size,reportedHaloVisits:aggregate.sourceQueries,
  sharedHaloCells:aggregate.sourceQueries-memo.naturalAt.size};
 if(!aggregate.ok)return refusal('SEAM_SOURCE_OR_BUDGET_HOLD',detail);
 if(memo.naturalAt.size!==11016||detail.sharedHaloCells!==648)
  return refusal('SEAM_CORE_HALO_CENSUS_DRIFT',detail);
 const natural=memo.naturalAt;
 const get=(x,y,z)=>{
  const k=key(x,y,z);
  if(!natural.has(k))return BLOCK.STONE;
  const value=natural.get(k);
  return value===BLOCK.AIR||candidates.get(k)===true?BLOCK.AIR:value;
 };
 const world=freeze({get});
 const supported=(x,y,z)=>{
  const eps=1e-5;
  for(let bx=Math.floor(x-BODY_RADIUS+eps);bx<=Math.floor(x+BODY_RADIUS-eps);bx++)
   for(let bz=Math.floor(z-BODY_RADIUS+eps);bz<=Math.floor(z+BODY_RADIUS-eps);bz++)
    for(let by=Math.floor(y-.002+eps);by<=Math.floor(y+BODY_HEIGHT-eps);by++)
     if(!natural.has(key(bx,by,bz)))return false;
  return !collides(world,x,y,z)&&collides(world,x,y-.002,z);
 };
 const p=pair.portal,trans=pair.axis==='x'?'z':'x';
 const station=(along,t,y)=>pair.axis==='x'?{x:along+.5,z:t+.5,y}:
  {x:t+.5,z:along+.5,y};
 // Six integer columns straddling the seam. Find actual retained-floor
 // positions rather than inventing a flat deck or teleporting between cells.
 const routes=[];
 for(let t=p[trans]-3;t<=p[trans]+3;t++){
  let paths=[[]];
  for(let along=p[pair.axis]-3;along<=p[pair.axis]+2;along++){
   const next=[];
   for(let y=p.y-5;y<=p.y+3;y++){
    const pt=station(along,t,y);
    if(!supported(pt.x,pt.y,pt.z))continue;
    // Passage must lie in the compact proposal itself, not a different
    // pre-existing natural cave that happens to bypass our seam.
    const x=Math.floor(pt.x),z=Math.floor(pt.z);
    if(!mask(x,y,z)||!mask(x,y+1,z))continue;
    for(const path of paths){
     if(path.length&&Math.abs(path.at(-1).y-y)>1)continue;
     next.push([...path,pt]);
    }
   }
   paths=next.slice(0,128);
  }
  routes.push(...paths.filter(r=>r.length===6));
 }
 const drive=route=>{
  const a=route[0],player={x:a.x,z:a.z,feet:a.y,yaw:0,pitch:0,
   vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
  let frames=0,steps=0,gradeEdges=0;
  for(let i=1;i<route.length;i++){
   const b=route[i];
   if(b.y!==route[i-1].y)gradeEdges++;
   let reached=false;
   for(let frame=0;frame<120;frame++){
    const d=Math.hypot(b.x-player.x,b.z-player.z);
    if(d>.085)player.yaw=Math.atan2(b.x-player.x,b.z-player.z);
    const event=stepPlayer(world,player,{forward:d>.085?1:0,strafe:0,jump:false},1/60);
    frames++;if(event.stepped)steps++;
    if(collides(world,player.x,player.feet,player.z)||
       player.feet<p.y-7)return {ok:false,frames,reason:'BODY_OR_FALL'};
    if(Math.hypot(b.x-player.x,b.z-player.z)<=.12&&
       Math.abs(player.feet-b.y)<=.025&&player.onGround&&
       supported(player.x,player.feet,player.z)){
     reached=true;break;
    }
   }
   if(!reached)return {ok:false,frames,reason:'CONTINUOUS_TARGET_NOT_REACHED'};
  }
  return {ok:true,frames,steps,gradeEdges};
 };
 let attempted=0;
 for(const route of routes.slice(0,64)){
  attempted++;
  const forward=drive(route);if(!forward.ok)continue;
  const reverse=drive([...route].reverse());if(!reverse.ok)continue;
  return freeze({ok:true,reason:null,...detail,supportedRoutes:routes.length,
   attempted,route:freeze(route.map(freeze)),forward:freeze(forward),reverse:freeze(reverse),
   originalControllerBidirectional:true,continuousWithinEachDirection:true,
   retainedOriginalFloorOnly:true,constructedSupportCells:0,
   worldChanged:false,liveWalkingVerified:false,actualGpuUnverified:true});
 }
 return refusal('COMPACT_SEAM_SUPPORTED_CONTROLLER_ROUTE_HOLD',{
  ...detail,supportedRoutes:routes.length,attempted});
}
