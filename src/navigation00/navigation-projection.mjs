// Shared, opt-in coordinate projection for discovered cells, player and pins.
import {NAV00_CELL_SIZE} from './observed-navigation.mjs';
export function createNavigationProjection({frame,zoom,center}) {
  if(!frame||![frame.x,frame.y,frame.width,frame.height,zoom,center?.x,center?.z].every(Number.isFinite)||zoom<=0||frame.width<=0||frame.height<=0)throw Error('Invalid navigation projection');
  const cell=(x,z)=>{
    if(!Number.isSafeInteger(x)||!Number.isSafeInteger(z))throw Error('Invalid discovery cell');
    return Object.freeze({screenX:frame.x+frame.width/2+(x-center.x)*zoom,screenY:frame.y+frame.height/2+(z-center.z)*zoom});
  };
  const world=(x,z)=>{
    if(![x,z].every(Number.isFinite))throw Error('Invalid world coordinate');
    return cell(Math.floor(x/NAV00_CELL_SIZE),Math.floor(z/NAV00_CELL_SIZE));
  };
  return Object.freeze({cell,world});
}
