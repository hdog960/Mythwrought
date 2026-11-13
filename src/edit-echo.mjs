// Short-lived, world-space feedback for existing successful block edits.
// No save state, HUD, audio permission, timers, or extra draw calls.
import {outlineVertices} from './voxel.mjs';

export const EDIT_ECHO_MS=480;
export function createEditEcho(result,now){
  if(!result?.ok||!Array.isArray(result.cell)||result.cell.length!==3||
     !result.cell.every(Number.isInteger)||!Number.isFinite(now)||
     !['mine','place'].includes(result.mode))return null;
  return {cell:[...result.cell],mode:result.mode,start:now};
}
export function sampleEditEcho(echo,now){
  if(!echo||!Number.isFinite(now))return {key:'',vertices:new Float32Array()};
  const elapsed=now-echo.start;
  if(elapsed<0||elapsed>=EDIT_ECHO_MS)return {key:'',vertices:new Float32Array()};
  // Four visibly distinct beats; fixed bounds and finite color values.
  const beat=Math.floor(elapsed/(EDIT_ECHO_MS/4));
  const intensity=[1,.78,.53,.28][beat];
  const base=echo.mode==='mine'?[.28,1,.87]:[1,.70,.24];
  return {key:echo.mode+':'+echo.cell.join(',')+':'+beat,
    vertices:outlineVertices(echo.cell,base.map(c=>c*intensity))};
}
