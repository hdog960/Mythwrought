// Opt-in navigation00 viewport controller; no DOM, input, or world mutation.
export const NAV00_VIEWPORT_VERSION = 1;
const finite = Number.isFinite;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const MIN_ZOOM = 4, MAX_ZOOM = 14;
function cameraState(state) {
  if (!state || ![state.zoom,state.panX,state.panZ].every(finite) ||
      state.zoom < MIN_ZOOM || state.zoom > MAX_ZOOM ||
      Math.abs(state.panX)>4e7 || Math.abs(state.panZ)>4e7) throw Error('Invalid navigation camera state');
  return Object.freeze({zoom:state.zoom,panX:state.panX,panZ:state.panZ});
}
function viewport(box) {
  if (!box || ![box.width,box.height,box.left,box.right,box.top,box.bottom].every(finite) ||
      box.width<=0 || box.height<=0 || box.width>4096 || box.height>4096 ||
      [box.left,box.right,box.top,box.bottom].some(v=>v<0) ||
      box.left+box.right>=box.width || box.top+box.bottom>=box.height) throw Error('Invalid navigation safe area');
  return Object.freeze({...box});
}
export function createNavigationViewport({width,height,safeArea={left:0,right:0,top:0,bottom:0},zoom=7,panX=0,panZ=0}) {
  let area=viewport({width,height,...safeArea});
  let state=cameraState({zoom,panX,panZ});
  const frame=()=>Object.freeze({x:area.left,y:area.top,width:area.width-area.left-area.right,
    height:area.height-area.top-area.bottom});
  const snapshot=()=>Object.freeze({...state,frame:frame()});
  return Object.freeze({
    snapshot,
    resize(next){area=viewport({width:next.width,height:next.height,...(next.safeArea||{left:0,right:0,top:0,bottom:0})});return snapshot();},
    zoomAt({factor,screenX,screenY}){
      if(!finite(factor)||factor<=0||![screenX,screenY].every(finite))throw Error('Invalid zoom gesture');
      const f=frame();
      if(screenX<f.x||screenX>f.x+f.width||screenY<f.y||screenY>f.y+f.height)return snapshot();
      const nextZoom=clamp(state.zoom*factor,MIN_ZOOM,MAX_ZOOM);
      const dx=screenX-(f.x+f.width/2),dy=screenY-(f.y+f.height/2);
      state=cameraState({zoom:nextZoom,
        panX:state.panX+dx*4*(1/state.zoom-1/nextZoom),
        panZ:state.panZ+dy*4*(1/state.zoom-1/nextZoom)});
      return snapshot();
    },
    panPixels({dx,dy}){
      if(![dx,dy].every(finite))throw Error('Invalid pan gesture');
      state=cameraState({...state,panX:state.panX-dx*4/state.zoom,panZ:state.panZ-dy*4/state.zoom});
      return snapshot();
    },
    reset(){state=cameraState({zoom:7,panX:0,panZ:0});return snapshot();},
    projectOptions(player){
      const f=frame();
      return Object.freeze({player,panX:state.panX,panZ:state.panZ,zoom:state.zoom,width:f.width,height:f.height});
    }
  });
}
