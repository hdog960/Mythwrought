// Render-workload budget only. Layout geometry and touch grip sizing are untouched.
export const RENDER_PREF='mythwrought-v010-render-preset';
export function normalizeRenderPreset(value){
  return value==='battery'||value==='economy'?value:'balanced';
}
export function pixelBudget(mode,deviceRatio){
  const ratio=Number.isFinite(deviceRatio)&&deviceRatio>0?deviceRatio:1;
  const cap=mode==='economy'?0.65:mode==='battery'?0.85:1.5;
  return Math.max(0.4,Math.min(ratio,cap));
}
export function bufferDimensions(cssWidth,cssHeight,mode,deviceRatio){
  const ratio=pixelBudget(normalizeRenderPreset(mode),deviceRatio);
  if(!Number.isFinite(cssWidth)||!Number.isFinite(cssHeight))throw Error('Invalid canvas dimensions');
  return {
    width:Math.max(1,Math.floor(cssWidth*ratio)),
    height:Math.max(1,Math.floor(cssHeight*ratio)),
    scale:ratio
  };
}

// The existing economy shader and established framebuffer budget are reused
// during ACTIVE deep digging only. No change to CSS size, voxel geometry,
// PWA shell, world saves, default chosen render preset, or the rest of the world.
// Restore full creator-selected quality after 4 seconds without a deep edit.
export const DEEP_MINING_RENDER_SCALE_CAP=0.65;
export const DEEP_MINING_QUALITY_HOLD_MS=4000;
export function deepMiningRenderActive(feet,caveWorld,lastEditAt,now){
  return Number.isFinite(feet)&&feet<=-48&&caveWorld===false&&
    Number.isFinite(lastEditAt)&&Number.isFinite(now)&&
    now>=lastEditAt&&now-lastEditAt<=DEEP_MINING_QUALITY_HOLD_MS;
}
export function deepMiningBufferDimensions(cssWidth,cssHeight,mode,deviceRatio,active){
  const original=bufferDimensions(cssWidth,cssHeight,mode,deviceRatio);
  if(active!==true)return original;
  const scale=Math.min(original.scale,DEEP_MINING_RENDER_SCALE_CAP);
  return {width:Math.max(1,Math.floor(cssWidth*scale)),
    height:Math.max(1,Math.floor(cssHeight*scale)),scale};
}
