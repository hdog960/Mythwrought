// C3 protected new-world cave entrances. Read-only proposal, never auto-spawn.
// Each candidate uses real source cave anchors, 3-wide supported voxel steps,
// 4-high player clearance and a surface landmark/edit protection survey.
// No writes to VoxelWorld, main, legacy Y=-3, localStorage or Pages.
import {BLOCK,worldKey,terrainHeight,baseBlock,collides} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute} from '../deep-cave-network.mjs';
import {descentEntranceApproach} from '../underground-switchback-descent.mjs';
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';

import {isCandidateGeologyMaterial} from '../living-underworld/protected-entrance-envelope.mjs';
import {stepPlayer} from '../physics.mjs';

export const CAVE_ENTRANCE_PROFILE='new-cave-world-only';
export function originalCaveEntranceSites(){
  const old=deepCaveRoute(DEEP_CAVE_ORIGIN)[0];
  const deep=descentEntranceApproach()[0];
  return Object.freeze([
    Object.freeze({name:'old-deep24',x:old.x,z:old.z,floor:old.floor}),
    Object.freeze({name:'switchback36',x:deep.x,z:deep.z,floor:deep.floor}),
    ...UPPER_SITES.map((site,i)=>Object.freeze({
      name:i?'upper24-hollowbend':'upper24-windcut',
      x:site.x,z:site.z,floor:-8
    }))
  ]);
}
const directions=Object.freeze([[-1,0],[0,-1],[1,0],[0,1]]);
const key=(x,y,z)=>worldKey(x,y,z);
function surveyDirection(world,source,site,dx,dz,reserved){
  const cells=new Map(),route=[];
  let mouth=null,rejected=null;
  const seed=world.seed;
  for(let step=0;step<=64;step++){
    const x=site.x+dx*step,z=site.z+dz*step;
    const floor=site.floor+Math.floor(step/2);
    if(floor+4>WORLD_MAX_Y){rejected='HEIGHT_LIMIT';break;}
    for(const across of [-1,0,1]){
      const xx=x-dz*across,zz=z+dx*across;
      const support=baseBlock(xx,floor,zz,seed);
      const solid=floor<LEGACY_WORLD_MIN_Y?BLOCK.DEEPSTONE:
        support===BLOCK.AIR?BLOCK.STONE:support;
      for(let y=floor;y<=floor+4;y++){
        if(y<WORLD_MIN_Y||y>WORLD_MAX_Y){rejected='WORLD_BOUNDS';break;}
        const id=y===floor?solid:BLOCK.AIR,k=key(xx,y,zz);
        if(reserved.has(k)){rejected='OTHER_ENTRANCE_COLLISION';break;}
        const prior=source.get(k);
        if(prior!==undefined&&prior!==id){rejected='AUTHORED_SOURCE_COLLISION';break;}
        // No overwriting player edits or existing source-owned natural landmarks.
        // The legacy layer is permitted only in a NEW explicit cave-world mode.
        if(world.edits?.has(k)){rejected='PLAYER_EDIT_PROTECTION';break;}
        if(y>=LEGACY_WORLD_MIN_Y){
          const actual=world.get(xx,y,zz),natural=baseBlock(xx,y,zz,seed);
          if(actual!==natural&&actual!==id){
            rejected='PROTECTED_EXISTING_LANDMARK';break;
          }
        }
        const prev=cells.get(k);
        if(prev!==undefined&&prev!==id){rejected='INTERNAL_PORTAL_CONFLICT';break;}
        cells.set(k,id);
      }
      if(rejected)break;
    }
    if(rejected)break;
    route.push(Object.freeze({x,z,floor,feet:floor+1}));
    const localSurface=Math.max(...[-1,0,1].map(a=>
      terrainHeight(x-dz*a,z+dx*a,seed)));
    if(step>=4&&floor>=localSurface){
      mouth=Object.freeze({x,y:floor+1,z,approachSteps:step+1});
      break;
    }
  }
  if(!mouth)return Object.freeze({ok:false,reason:rejected||'NO_SUPPORTED_SURFACE_MOUTH'});
  return Object.freeze({ok:true,name:site.name,sourceAnchor:Object.freeze({...site}),
    direction:Object.freeze({dx,dz}),mouth,cells,route:Object.freeze(route),
    physicallyProposed:true,worldModified:false,runtimeConnected:false});
}
// The original switchback approach starts at (x,z-4), immediately above
// its authored descent. Never move that anchor or overwrite any source map.
// North is the continuation away from the authored descent. A level 3x3
// landing permits a turn; straight sections retain 3-wide, 4-high clearance.
// This search runs ONLY if all four historical straight attempts refused.
function surveySwitchbackFallback(world,source,site,reserved,extraSources,turn,side,delay){
 const cells=new Map(),route=[];
 const reject=reason=>({ok:false,reason});
 const put=(x,z,floor)=>{
  const support=baseBlock(x,floor,z,world.seed);
  const solid=floor<LEGACY_WORLD_MIN_Y?BLOCK.DEEPSTONE:
   support===BLOCK.AIR?BLOCK.STONE:support;
  if(!isCandidateGeologyMaterial(solid)||solid===BLOCK.AIR)return 'UNSAFE_SUPPORT';
  for(let y=floor;y<=floor+4;y++){
   if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)return 'WORLD_BOUNDS';
   const k=key(x,y,z),id=y===floor?solid:BLOCK.AIR;
   if(reserved.has(k))return 'OTHER_ENTRANCE_COLLISION';
   for(const map of [source,...extraSources])
    if(map.has(k)&&map.get(k)!==id)return 'AUTHORED_SOURCE_COLLISION';
   if(world.edits.has(k))return 'PLAYER_EDIT_PROTECTION';
   const natural=baseBlock(x,y,z,world.seed),actual=world.get(x,y,z);
   if(actual!==natural&&actual!==id)return 'PROTECTED_EXISTING_LANDMARK';
   // A below-legacy cell already owned by the PRIMARY authored cave
   // and equal to its existing value is not a new terrain replacement.
   // Preserve the explicit source value; never authorize a new ore cut.
   const alreadyAuthored=y<LEGACY_WORLD_MIN_Y&&source.has(k)&&source.get(k)===id;
   if(actual!==id&&!isCandidateGeologyMaterial(actual)&&!alreadyAuthored)
    return 'UNSAFE_ORIGINAL_MATERIAL:'+k+':'+actual;
   if(cells.has(k)&&cells.get(k)!==id)return 'INTERNAL_PORTAL_CONFLICT';
   cells.set(k,id);
  }
  return null;
 };
 // Corner and its immediate neighbors share a floor. delay varies initial
 // northward grade timing deterministically, not the protected source anchor.
 const floorAt=i=>site.floor+Math.floor(Math.max(0,i-delay)/2);
 const landing=floorAt(turn-2);
 let mouth=null;
 for(let i=0;i<=64;i++){
  const x=site.x+side*Math.max(0,i-turn),z=site.z-Math.min(i,turn);
  const floor=i<turn-2?floorAt(i):i<=turn+2?landing:
   landing+Math.floor((i-turn-2)/2);
  if(floor+4>WORLD_MAX_Y)return reject('HEIGHT_LIMIT');
  const cols=[];
  if(i===turn){
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)cols.push([x+dx,z+dz]);
  }else for(const a of [-1,0,1])cols.push(i<turn?[x+a,z]:[x,z+a]);
  for(const [xx,zz] of cols){
   const reason=put(xx,zz,floor);if(reason)return reject(reason);
  }
  route.push(Object.freeze({x,z,floor,feet:floor+1}));
  if(i>=turn+4&&floor>=Math.max(...cols.map(([xx,zz])=>terrainHeight(xx,zz,world.seed)))){
   mouth=Object.freeze({x,y:floor+1,z,approachSteps:i+1});break;
  }
 }
 if(!mouth)return reject('NO_SUPPORTED_SURFACE_MOUTH');
 // Actual original controller, no teleports within a direction. The lookup
 // preserves original source priority and uses no invented support outside
 // the audited footprint. Both directions are mandatory before acceptance.
 const projected={get(x,y,z){
  const k=key(x,y,z);
  if(cells.has(k))return cells.get(k);
  // Same precedence as sourceCaveCell: primary/connector below legacy,
  // east gallery above. Extra maps are connector then east gallery.
  if(y<LEGACY_WORLD_MIN_Y)return source.get(k)??extraSources[0]?.get(k)??world.get(x,y,z);
  return extraSources[1]?.get(k)??world.get(x,y,z);
 }};
 const drive=points=>{
  const a=points[0],p={x:a.x+.5,z:a.z+.5,feet:a.feet,yaw:0,pitch:0,
   vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
  let frames=0;
  if(collides(projected,p.x,p.feet,p.z)||!collides(projected,p.x,p.feet-.002,p.z))return null;
  for(const b of points.slice(1)){
   let reached=false;
   for(let n=0;n<120;n++){
    const dx=b.x+.5-p.x,dz=b.z+.5-p.z,d=Math.hypot(dx,dz);
    if(d>.085)p.yaw=Math.atan2(dx,dz);
    stepPlayer(projected,p,{forward:d>.085?1:0,strafe:0,jump:false},1/60);frames++;
    if(collides(projected,p.x,p.feet,p.z))return null;
    if(Math.hypot(b.x+.5-p.x,b.z+.5-p.z)<=.12&&
       Math.abs(p.feet-b.feet)<=.025&&p.onGround&&
       collides(projected,p.x,p.feet-.002,p.z)){reached=true;break;}
   }
   if(!reached)return null;
  }
  return frames;
 };
 const forward=drive(route),reverse=forward===null?null:drive([...route].reverse());
 if(forward===null||reverse===null)return reject('ORIGINAL_CONTROLLER_ROUTE_HOLD');
 return Object.freeze({ok:true,name:site.name,sourceAnchor:Object.freeze({...site}),
  direction:Object.freeze({dx:0,dz:-1}),mouth,cells,route:Object.freeze(route),
  fallback:Object.freeze({turn,side,delay,forwardFrames:forward,reverseFrames:reverse,
   originalControllerBothDirections:true,liveWalkingVerified:false}),
  physicallyProposed:true,worldModified:false,runtimeConnected:false});
}

export function planNewCaveEntrances({world,sourceCells,approved=false,additionalSourceMaps=[]}={}){
  if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_CAVE_WORLD_REQUIRED'});
  if(!world||!Number.isInteger(world.seed)||!(sourceCells instanceof Map)||
     typeof world.get!=='function'||!(world.edits instanceof Map)||
     !Array.isArray(additionalSourceMaps)||additionalSourceMaps.some(m=>!(m instanceof Map)))
    return Object.freeze({ok:false,reason:'SOURCE_WORLD_REQUIRED'});
  const selected=[],reserved=new Set(),failures=[];
  for(const site of originalCaveEntranceSites()){
    const attempts=[];
    let accepted=null;
    for(const [dx,dz] of directions){
      const plan=surveyDirection(world,sourceCells,site,dx,dz,reserved);
      if(plan.ok){accepted=plan;break;}
      attempts.push(plan.reason);
    }
    if(!accepted&&site.name==='switchback36'){
      // At most 48 alternatives, fixed order. Preserve legacy straight
      // paths for every seed that previously had a valid entrance.
      const alternateAttempts=[];
      search: for(const turn of [4,6,8,10,12,14])
        for(const delay of [0,2,4,6])for(const side of [-1,1]){
          const plan=surveySwitchbackFallback(world,sourceCells,site,reserved,
            additionalSourceMaps,turn,side,delay);
          if(plan.ok){accepted=plan;break search;}
          alternateAttempts.push(plan.reason);
        }
      if(!accepted){failures.push(Object.freeze({name:site.name,
        attempts:Object.freeze(attempts),alternateAttempts:Object.freeze(alternateAttempts)}));continue;}
    }
    if(!accepted){failures.push(Object.freeze({name:site.name,attempts:Object.freeze(attempts)}));continue;}
    selected.push(accepted);
    for(const k of accepted.cells.keys())reserved.add(k);
  }
  const combined=new Map();
  for(const p of selected)for(const [key,id] of p.cells)combined.set(key,id);
  return Object.freeze({
    ok:failures.length===0&&selected.length===4,
    entrances:Object.freeze(selected),failures:Object.freeze(failures),
    cells:combined,profile:CAVE_ENTRANCE_PROFILE,
    modifiedExistingWorld:false,runtimeConnected:false
  });
}
