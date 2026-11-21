// Opt-in geometry bridge for an expanded map; no DOM, globals or save access.
import {layoutNavigationControls} from './navigation-safe-controls.mjs';
export const NAV00_SAFE_AREA_VERSION = 1;
const valid = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
export function layoutNavigationSafeArea({width,height,insets={top:0,right:0,bottom:0,left:0},thumbRails={left:0,right:0},buttonSize=44,gap=8}={}) {
  if (![width,height].every(valid) || width===0 || height===0 ||
      !insets || !['top','right','bottom','left'].every(k=>valid(insets[k])) ||
      insets.left+insets.right>=width || insets.top+insets.bottom>=height) throw Error('Invalid navigation safe area');
  const frame=Object.freeze({x:insets.left,y:insets.top,width:width-insets.left-insets.right,height:height-insets.top-insets.bottom});
  const controls=layoutNavigationControls({frame,thumbRails,buttonSize,gap});
  return Object.freeze({frame,controls});
}
