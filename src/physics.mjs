// MYTHWROUGHT v0.06 — deterministic AABB voxel walking and jumping.
// Uses WORLD voxel coordinates; no isolated physics dimension or save-schema changes.
// An accessible, responsive first-person controller; not a Souls-style stamina system.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,WORLD_MAX_Y,WORLD_MIN_Y,collides} from './voxel.mjs';
import {WATER_CANDIDATE_ID,parseWaterCell,waterSurfaceHeight} from './block-packs/pack-2/water.mjs';
export const WALK_SPEED=4.25;
export const SWIM_SPEED=2.6;
const SWIM_THRESHOLD=.35, SWIM_ASCENT=2.4, SWIM_DESCENT=-1.8;
// Center-column immersion, measured against the actual sloped fluid surface.
// No fluid propagation, save mutation or invented state for missing cells.
// Only the existing owner reader is consulted; dry legacy worlds cost no queries.
export function waterImmersion(world,p){
  if(typeof world?.getPack2State!=='function')return 0;
  const x=Math.floor(p.x),z=Math.floor(p.z),top=p.feet+BODY_HEIGHT;
  let submerged=0;
  for(let y=Math.floor(p.feet);y<top;y++){
    const raw=world.getPack2State(x,y,z);
    if(raw?.id!==WATER_CANDIDATE_ID)continue;
    const cell=parseWaterCell(raw);
    const surface=y+waterSurfaceHeight(cell,p.x-x,p.z-z);
    submerged+=Math.max(0,Math.min(top,surface)-Math.max(p.feet,y));
  }
  return Math.max(0,Math.min(1,submerged/BODY_HEIGHT));
}
export const GRAVITY=19.6;
export const JUMP_VELOCITY=7.2;
export const STEP_HEIGHT=1.01;
export const GROUND_PROBE=.065;
export const JUMP_BUFFER=.115;
export const COYOTE_TIME=.09;
const MAX_FRAME_DT=.05;
const MAX_PHYSICS_DT=1/90;

export function findSafeSpawn(world,originX=0,originZ=0){
  const candidates=[];
  for(let r=0;r<=7;r++)
    for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)
      if(Math.max(Math.abs(dx),Math.abs(dz))===r)candidates.push([originX+dx,originZ+dz]);
  for(const [cx,cz] of candidates){
    const x=Math.floor(cx)+.5,z=Math.floor(cz)+.5;
    for(let y=WORLD_MAX_Y+1;y>WORLD_MIN_Y;y--){
      if(world.get(Math.floor(x),y-1,Math.floor(z))!==BLOCK.AIR &&
         !collides(world,x,y,z) && collides(world,x,y-GROUND_PROBE,z))
        return {x,z,feet:y};
    }
  }
  throw Error('No safe spawn surface within the bounded starting area');
}
export function newPlayer(world){
  return {...findSafeSpawn(world),yaw:Math.PI,pitch:-.12,vX:0,vZ:0,vY:0,
    onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
}
function resolveAxis(world,p,axis,delta){
  if(!delta)return {blocked:false,stepped:false};
  const destination=p[axis]+delta;
  const x=axis==='x'?destination:p.x;
  const z=axis==='z'?destination:p.z;
  if(!collides(world,x,p.feet,z)){p[axis]=destination;return {blocked:false,stepped:false};}
  if(p.onGround && p.vY<=0 && collides(world,p.x,p.feet-.002,p.z)){
    // Authored stairs, paving, slabs and gravel have REAL partial-height
    // collision boxes. A fixed +1 voxel "step" can leave the ground probe
    // above their surface, making the player jump over otherwise walkable art.
    // Find the first collision-free elevation, not an invented full-block top.
    // Search only on an actual horizontal obstruction; this is not a per-frame
    // terrain-height scan and never changes any asset's collision geometry.
    const probes=8,refinements=8;
    let lower=0,upper=null,clear=true;
    for(let n=1;n<=probes;n++){
      const rise=STEP_HEIGHT*n/probes;
      // The body must be able to rise at its CURRENT position: no clipping
      // through ceilings, overhangs or shaped furniture while stepping.
      if(collides(world,p.x,p.feet+rise,p.z)){clear=false;break;}
      if(!collides(world,x,p.feet+rise,z)){upper=rise;break;}
      lower=rise;
    }
    if(clear && upper!==null){
      // Binary refinement puts feet just ABOVE the true surface (including
      // uneven gravel). The certified ground probe then reaches that surface.
      // A fixed 1.01 rise only reliably contacted full-height blocks.
      for(let n=0;n<refinements;n++){
        const mid=(lower+upper)*.5;
        if(collides(world,p.x,p.feet+mid,p.z)){clear=false;break;}
        if(collides(world,x,p.feet+mid,z))lower=mid;else upper=mid;
      }
      const rise=Math.min(STEP_HEIGHT,upper+.0005);
      if(clear && !collides(world,p.x,p.feet+rise,p.z) &&
         !collides(world,x,p.feet+rise,z) &&
         collides(world,x,p.feet+rise-GROUND_PROBE,z)){
        p.feet+=rise;p[axis]=destination;p.onGround=true;p.vY=0;
        return {blocked:false,stepped:true};
      }
    }
  }
  // Sweep to the last clear fraction instead of moving through or jittering at a wall.
  let lo=0,hi=1;
  for(let n=0;n<14;n++){
    const t=(lo+hi)*.5;
    const px=axis==='x'?p.x+delta*t:p.x;
    const pz=axis==='z'?p.z+delta*t:p.z;
    if(collides(world,px,p.feet,pz))hi=t;else lo=t;
  }
  p[axis]+=delta*lo;
  return {blocked:true,stepped:false};
}
function resolveY(world,p,dt){
  const start=p.feet,next=start+p.vY*dt;
  if(!collides(world,p.x,next,p.z)){p.feet=next;p.onGround=false;return {landed:false,ceiling:false};}
  let lo=0,hi=1;
  for(let n=0;n<16;n++){
    const t=(lo+hi)*.5;
    if(collides(world,p.x,start+(next-start)*t,p.z))hi=t;else lo=t;
  }
  p.feet=start+(next-start)*lo;
  const down=p.vY<0;
  p.vY=0;p.onGround=down;
  return {landed:down,ceiling:!down};
}
export function stepPlayer(world,p,input,dt){
  if(!Number.isFinite(dt)||dt<0)throw Error('Invalid physics delta');
  if(!Number.isFinite(p.x)||!Number.isFinite(p.z)||!Number.isFinite(p.feet))throw Error('Invalid player position');
  const out={stepped:false,landed:false,jumped:false,hitWall:false,ceiling:false};
  if(!dt)return out;
  const elapsed=Math.min(MAX_FRAME_DT,dt);
  const climbing=world?.stagedNonblockClimb?.(p)===true;
  if(input.jump&&!climbing)p.jumpBuffer=JUMP_BUFFER;
  // dt subdivision limits every physics step: never tunnel through a cube on a slow frame.
  const count=Math.max(1,Math.ceil(elapsed/MAX_PHYSICS_DT));
  const h=elapsed/count;
  let side=Math.max(-1,Math.min(1,Number(input.strafe)||0));
  let front=Math.max(-1,Math.min(1,Number(input.forward)||0));
  const magnitude=Math.hypot(side,front);
  if(magnitude>1){side/=magnitude;front/=magnitude;}
  const yaw=Number.isFinite(p.yaw)?p.yaw:0;
  const travel=climbing?0:front;
  const directionX=Math.sin(yaw)*travel+Math.cos(yaw)*side;
  const directionZ=Math.cos(yaw)*travel-Math.sin(yaw)*side;
  for(let i=0;i<count;i++){
    const immersion=climbing?0:waterImmersion(world,p);
    const swimming=immersion>=SWIM_THRESHOLD;
    const targetX=directionX*(swimming?SWIM_SPEED:WALK_SPEED);
    const targetZ=directionZ*(swimming?SWIM_SPEED:WALK_SPEED);
    // A support probe helps with step checks, but it must NOT freeze a falling
    // player several centimeters above the floor. Ground contact is near-exact.
    const touchingFloor=collides(world,p.x,p.feet-.002,p.z);
    if(touchingFloor&&p.vY<=0){p.onGround=true;p.coyote=COYOTE_TIME;}
    else if(!touchingFloor){p.onGround=false;p.coyote=Math.max(0,(p.coyote||0)-h);}
    p.jumpBuffer=Math.max(0,(p.jumpBuffer||0)-h);
    if(swimming){p.jumpBuffer=0;p.coyote=0;}
    if(!climbing&&!swimming&&p.jumpBuffer>0&&(p.onGround||p.coyote>0)){
      p.vY=JUMP_VELOCITY;p.onGround=false;p.coyote=0;p.jumpBuffer=0;out.jumped=true;
    }
    // Two-thumb release must stop promptly; gradual build-up is pleasant but
    // lingering acceleration after finger-up feels like a stuck joystick.
    const easingX=Math.min(1,h*(Math.abs(targetX)<.0001?(p.onGround?105:50):(p.onGround?17:8)));
    const easingZ=Math.min(1,h*(Math.abs(targetZ)<.0001?(p.onGround?105:50):(p.onGround?17:8)));
    p.vX+=(targetX-p.vX)*easingX;
    p.vZ+=(targetZ-p.vZ)*easingZ;
    for(const axis of ['x','z']){
      const velocityAxis=axis==='x'?'vX':'vZ';
      const collision=resolveAxis(world,p,axis,p[velocityAxis]*h);
      out.stepped ||= collision.stepped;
      out.hitWall ||= collision.blocked;
      if(collision.blocked)p[velocityAxis]=0;
    }
    // Horizontal motion can leave support during this very substep. Clear
    // stale grounded state before gravity, without consuming coyote time twice.
    if(p.onGround && !collides(world,p.x,p.feet-.002,p.z))p.onGround=false;
    // Don't repeatedly accelerate downward when standing on a stable surface.
    if(climbing){
      p.vY=front*2.0;
      p.jumpBuffer=0;p.coyote=0;
    }else if(swimming){
      // Jump becomes sustained ascent; optional descent is a host intent,
      // not a new touch control. Neutral input settles toward half immersion.
      const target=input.jump&&!input.swimDown?SWIM_ASCENT:
        input.swimDown&&!input.jump?SWIM_DESCENT:(immersion-.5)*4;
      p.vY=Math.max(-4,Math.min(3,p.vY));
      p.vY+=(target-p.vY)*Math.min(1,8*h);
      if(p.onGround&&p.vY<0)p.vY=0;
    }else if(p.onGround&&p.vY<=0)p.vY=0;
    else p.vY=Math.max(-28,p.vY-GRAVITY*h);
    if(p.vY!==0){
      const vertical=resolveY(world,p,h);
      out.landed ||=vertical.landed;out.ceiling ||=vertical.ceiling;
    }
  }
  return out;
}
