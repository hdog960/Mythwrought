// MYTHWROUGHT v0.06 — deterministic AABB voxel walking and jumping.
// Uses WORLD voxel coordinates; no isolated physics dimension or save-schema changes.
// An accessible, responsive first-person controller; not a Souls-style stamina system.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,WORLD_MAX_Y,WORLD_MIN_Y,collides} from './voxel.mjs';
export const WALK_SPEED=4.25;
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
  if(p.onGround && p.vY<=0){
    // Only a single real voxel step with head clearance and support may be climbed.
    // A taller wall or low ceiling rejects the ascent instead of clipping.
    const rise=STEP_HEIGHT;
    let clear=true;
    for(let h=.20;h<=rise+.001;h+=.2){
      const at=Math.min(h,rise);
      if(collides(world,p.x,p.feet+at,p.z)){clear=false;break;}
    }
    if(clear && !collides(world,x,p.feet+rise,z) &&
       collides(world,x,p.feet+rise-GROUND_PROBE,z)){
      p.feet+=rise;p[axis]=destination;p.onGround=false;p.vY=0;
      return {blocked:false,stepped:true};
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
  if(input.jump)p.jumpBuffer=JUMP_BUFFER;
  // dt subdivision limits every physics step: never tunnel through a cube on a slow frame.
  const count=Math.max(1,Math.ceil(elapsed/MAX_PHYSICS_DT));
  const h=elapsed/count;
  let side=Math.max(-1,Math.min(1,Number(input.strafe)||0));
  let front=Math.max(-1,Math.min(1,Number(input.forward)||0));
  const magnitude=Math.hypot(side,front);
  if(magnitude>1){side/=magnitude;front/=magnitude;}
  const yaw=Number.isFinite(p.yaw)?p.yaw:0;
  const targetX=(Math.sin(yaw)*front+Math.cos(yaw)*side)*WALK_SPEED;
  const targetZ=(Math.cos(yaw)*front-Math.sin(yaw)*side)*WALK_SPEED;
  for(let i=0;i<count;i++){
    // A support probe helps with step checks, but it must NOT freeze a falling
    // player several centimeters above the floor. Ground contact is near-exact.
    const touchingFloor=collides(world,p.x,p.feet-.002,p.z);
    if(touchingFloor&&p.vY<=0){p.onGround=true;p.coyote=COYOTE_TIME;}
    else if(!touchingFloor){p.onGround=false;p.coyote=Math.max(0,(p.coyote||0)-h);}
    p.jumpBuffer=Math.max(0,(p.jumpBuffer||0)-h);
    if(p.jumpBuffer>0&&(p.onGround||p.coyote>0)){
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
    // Don't repeatedly accelerate downward when standing on a stable surface.
    if(p.onGround&&p.vY<=0)p.vY=0;
    else p.vY=Math.max(-28,p.vY-GRAVITY*h);
    if(p.vY!==0){
      const vertical=resolveY(world,p,h);
      out.landed ||=vertical.landed;out.ceiling ||=vertical.ceiling;
    }
    if(p.onGround && !collides(world,p.x,p.feet-GROUND_PROBE,p.z)){
      p.onGround=false;
    }
  }
  return out;
}
