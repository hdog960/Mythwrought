// Shared, opt-in coordinate projection for discovered cells, player and pins.
import {NAV00_CELL_SIZE} from './observed-navigation.mjs';
export function createNavigationProjection({frame,zoom,center,exact=false}) {
  if(!frame||![frame.x,frame.y,frame.width,frame.height,zoom,center?.x,center?.z].every(Number.isFinite)||zoom<=0||frame.width<=0||frame.height<=0)throw Error('Invalid navigation projection');
  const cell=(x,z)=>{
    if(!Number.isSafeInteger(x)||!Number.isSafeInteger(z))throw Error('Invalid discovery cell');
    return Object.freeze({screenX:frame.x+frame.width/2+(x-center.x)*zoom,screenY:frame.y+frame.height/2+(z-center.z)*zoom});
  };
  const world=(x,z)=>{
    if(![x,z].every(Number.isFinite))throw Error('Invalid world coordinate');
    if(!exact)return cell(Math.floor(x/NAV00_CELL_SIZE),Math.floor(z/NAV00_CELL_SIZE));
    return Object.freeze({screenX:frame.x+frame.width/2+(x/NAV00_CELL_SIZE-.5-center.x)*zoom,
      screenY:frame.y+frame.height/2+(z/NAV00_CELL_SIZE-.5-center.z)*zoom});
  };
  function atScreen(x,y){
    if(!exact||![x,y].every(Number.isFinite)||x<frame.x||x>frame.x+frame.width||y<frame.y||y>frame.y+frame.height)return null;
    return Object.freeze({x:(center.x+.5+(x-frame.x-frame.width/2)/zoom)*NAV00_CELL_SIZE,
      z:(center.z+.5+(y-frame.y-frame.height/2)/zoom)*NAV00_CELL_SIZE});
  }
  return Object.freeze({cell,world,atScreen});
}
