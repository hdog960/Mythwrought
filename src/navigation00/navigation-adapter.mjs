// Opt-in adapter between the production discovered-cell map and navigation00 camera.
// No DOM hooks, terrain generation, save writes, or unvisited-world queries.
import {createObservedNavigator,NAV00_CELL_SIZE} from './observed-navigation.mjs';
import {createNavigationViewport} from './navigation-viewport.mjs';

export const NAV00_ADAPTER_VERSION=1;
export function createNavigationAdapter({seed,discovery,storage=null,width,height,safeArea,player}) {
  if (!player || ![player.x,player.z,player.yaw].every(Number.isFinite)) throw Error('Valid player required');
  const navigator=createObservedNavigator({seed,discovery,storage});
  const viewport=createNavigationViewport({width,height,safeArea});
  let current=Object.freeze({x:player.x,z:player.z,yaw:player.yaw,y:player.y});
  function updatePlayer(next) {
    if (!next || ![next.x,next.z,next.yaw].every(Number.isFinite) ||
        (next.y!==undefined&&!Number.isFinite(next.y))) throw Error('Invalid player position');
    current=Object.freeze({x:next.x,z:next.z,yaw:next.yaw,y:next.y});
  }
  function frame() {
    const camera=viewport.snapshot();
    const projected=navigator.project(viewport.projectOptions(current));
    // Project returns cell-center coordinates relative to the safe-area frame.
    // Preserve immutable world coordinates on pins; never confuse them with screen pixels.
    const cells=projected.cells.map(c=>Object.freeze({...c,screenX:c.screenX+camera.frame.x,screenY:c.screenY+camera.frame.y}));
    const knownPins=new Map(navigator.visiblePins().map(p=>[p.id,p]));
    const pins=projected.pins.map(p=>{const world=knownPins.get(p.id);return Object.freeze({
      id:p.id,label:p.label,worldX:world.x,worldZ:world.z,
      screenX:camera.frame.x+camera.frame.width/2+
        (Math.floor(world.x/NAV00_CELL_SIZE)-projected.center.x)*camera.zoom,
      screenY:camera.frame.y+camera.frame.height/2+
        (Math.floor(world.z/NAV00_CELL_SIZE)-projected.center.z)*camera.zoom
    });}).filter(p=>p.screenX>=camera.frame.x-camera.zoom&&p.screenX<=camera.frame.x+camera.frame.width+camera.zoom&&
      p.screenY>=camera.frame.y-camera.zoom&&p.screenY<=camera.frame.y+camera.frame.height+camera.zoom);
    return Object.freeze({version:NAV00_ADAPTER_VERSION,seed,frame:camera.frame,zoom:camera.zoom,
      cells:Object.freeze(cells),pins:Object.freeze(pins),
      player:Object.freeze({worldX:current.x,worldZ:current.z,worldY:current.y,
        bearing:projected.player.bearing,
        screenX:projected.player.x+camera.frame.x,screenY:projected.player.y+camera.frame.y}),
      undiscoveredCount:null});
  }
  return Object.freeze({seed,navigator,viewport,updatePlayer,frame});
}
