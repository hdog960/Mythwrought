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
