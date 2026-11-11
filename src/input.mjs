// Mythwrought v0.04 — pure, platform-independent touch input math.
export const LOOK_MODES=Object.freeze(['swipe','stick']);
export function normalizedStick(dx,dy,radius,deadzone=.12){
  if(![dx,dy,radius,deadzone].every(Number.isFinite)||radius<=0||deadzone<0||deadzone>=1)throw Error('Invalid stick geometry');
  const raw=Math.hypot(dx,dy),length=Math.min(1,raw/radius);
  if(length<=deadzone)return {x:0,y:0};
  const amount=(length-deadzone)/(1-deadzone);
  return {x:dx/raw*amount,y:dy/raw*amount};
}
export function safePointerDelta(dx,dy,maxPx=58){
  if(![dx,dy,maxPx].every(Number.isFinite)||maxPx<=0)throw Error('Invalid pointer delta');
  const length=Math.hypot(dx,dy);
  if(length<.25)return {x:0,y:0};
  const scale=length>maxPx?maxPx/length:1;
  return {x:dx*scale,y:dy*scale};
}
export function stickLookDelta(stick,seconds){
  if(!Number.isFinite(seconds)||seconds<0)throw Error('Invalid frame time');
  const dt=Math.min(seconds,.05);
  return {x:stick.x*dt*185,y:stick.y*dt*145};
}
export function isWorldControlTarget(element){
  if(!element)return true;
  return !element.isContentEditable&&!['INPUT','SELECT','TEXTAREA','BUTTON'].includes(element.tagName);
}
export function selectedLookMode(mode){return LOOK_MODES.includes(mode)?mode:'swipe';}

// The v0.06 iPhone build's horizontal touch directions felt inverted.
// Normalize ONLY horizontal TOUCH input: do not change vertical travel,
// keyboard arrows, or physical thumb-knob tracking.
export function touchMovementX(rawX){
  if(!Number.isFinite(rawX))throw Error('Invalid horizontal movement input');
  return rawX===0?0:-rawX;
}
export function touchCameraX(rawX){
  if(!Number.isFinite(rawX))throw Error('Invalid horizontal camera input');
  return rawX===0?0:-rawX;
}
