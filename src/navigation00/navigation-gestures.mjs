// Opt-in expanded-map gesture interpreter. No DOM listeners or player input interception.
export const NAV00_GESTURES_VERSION = 1;
const finite = Number.isFinite;
const inFrame = (p, f) => p.x >= f.x && p.x <= f.x + f.width && p.y >= f.y && p.y <= f.y + f.height;
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export function createNavigationGestures({viewport, initiallyOpen=false}={}) {
  if (!viewport || typeof viewport.snapshot !== 'function' || typeof viewport.panPixels !== 'function' || typeof viewport.zoomAt !== 'function') throw Error('Navigation viewport required');
  let open=Boolean(initiallyOpen), active=new Map(), previous=null;
  const reset=()=>{active.clear();previous=null;};
  const point=(id,x,y)=>{
    if ((!Number.isSafeInteger(id) && typeof id!=='string') || (typeof id==='string' && (id.length===0 || id.length>64)) || ![x,y].every(finite)) throw Error('Invalid map pointer');
    return {x,y};
  };
  const gesture=()=>{
    const p=[...active.values()];
    if (!p.length) return null;
    if (p.length===1) return {center:p[0],span:null};
    return {center:{x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2},span:distance(p[0],p[1])};
  };
  return Object.freeze({
    get isOpen(){return open;},get activePointers(){return active.size;},
    open(){open=true;reset();return true;},
    close(){open=false;reset();return false;},
    cancel(){reset();},
    begin(id,x,y){
      if(!open)return false;
      const p=point(id,x,y),f=viewport.snapshot().frame;
      if(!inFrame(p,f)||active.has(id)||active.size>=2)return false;
      active.set(id,p);previous=gesture();return true;
    },
    move(id,x,y){
      if(!open||!active.has(id))return false;
      const p=point(id,x,y),f=viewport.snapshot().frame;
      // Do not let a drag crossing a thumb rail trigger a gameplay gesture.
      if(!inFrame(p,f)){reset();return false;}
      const old=previous;
      active.set(id,p);
      const next=gesture();
      if(old&&next){
        const dx=next.center.x-old.center.x,dy=next.center.y-old.center.y;
        // Pinch zoom around the midpoint, then pan to track its movement.
        if(old.span!==null&&next.span!==null&&old.span>=8&&next.span>=8){
          viewport.zoomAt({factor:next.span/old.span,screenX:next.center.x,screenY:next.center.y});
        }
        if(dx||dy)viewport.panPixels({dx,dy});
      }
      previous=next;
      return true;
    },
    end(id){if(!active.has(id))return false;active.delete(id);previous=gesture();return true;}
  });
}
