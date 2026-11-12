// MYTHWROUGHT v0.03: stable camera math shared by desktop and touch input.
// Leave a small horizon-independent safety margin from the vertical singularity.
// The previous 1.3 radian cap prevented builders from aiming at their feet.
export const MAX_PITCH=Math.PI/2-.015;
export function clampLook(yaw,pitch,dx,dy,sensitivity=1,scale=.008){
  if(![yaw,pitch,dx,dy,sensitivity,scale].every(Number.isFinite))throw Error('Invalid camera input');
  const safe=Math.max(.5,Math.min(1.8,sensitivity));
  const outYaw=((yaw+dx*scale*safe+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
  const outPitch=Math.max(-MAX_PITCH,Math.min(MAX_PITCH,pitch-dy*scale*safe));
  return {yaw:outYaw,pitch:outPitch};
}
export function forwardVector(yaw,pitch){
  return [Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
}
export function compassDegrees(yaw){
  return ((Math.round(540-yaw*180/Math.PI)%360)+360)%360;
}
