import {auditCameraFollowTrace} from './camera-follow-audit.mjs';

// Join real engine position evidence to independently recorded camera telemetry.
// Never synthesize a camera path from the player trace.
export function auditRecordedCameraFollow(playerTrace,cameraFrames,options={}){
 const fail=(reason,index=-1)=>({safe:false,reason,index});
 const samples=playerTrace?.samples;
 if(playerTrace?.source!=='src/physics.mjs:stepPlayer'||!Array.isArray(samples)||samples.length<3)
  return fail('missing-engine-evidence');
 if(!Array.isArray(cameraFrames)||cameraFrames.length!==samples.length)
  return fail('missing-camera-evidence');
 const offset=options.eyeOffset??{x:0,y:0,z:0};
 if(!offset||!['x','y','z'].every(k=>Number.isFinite(offset[k])))return fail('invalid-eye-offset');
 const joined=[];
 for(let i=0;i<samples.length;i++){
  const player=samples[i],camera=cameraFrames[i];
  if(!player||!camera||!Number.isFinite(player.time)||!Number.isFinite(camera.time)||
    Math.abs(player.time-camera.time)>1e-6)return fail('unaligned-camera-time',i);
  const pos=player.position;
  if(!pos||!['x','z'].every(k=>Number.isFinite(pos[k]))||!Number.isFinite(pos.feet))
   return fail('invalid-player-evidence',i);
  if(!['x','y','z'].every(k=>Number.isFinite(camera[k])))return fail('invalid-camera-evidence',i);
  joined.push({time:player.time,player:{x:pos.x+offset.x,y:pos.feet+offset.y,z:pos.z+offset.z},
    camera:{x:camera.x,y:camera.y,z:camera.z}});
 }
 const {eyeOffset:_unused,...limits}=options;
 return auditCameraFollowTrace(joined,limits);
}
