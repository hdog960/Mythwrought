// Opt-in discovered-only map painter. Consumes navigation-adapter frames, never terrain.
export const NAV00_PAINT_VERSION=1;
export function paintNavigationFrame(canvas, frame, {background='#122126',cellColor='#648b80',pinColor='#ffcf78',playerColor='#ffffff',cellInk=null}={}) {
  if (!canvas || !frame || !frame.frame || !Array.isArray(frame.cells) || !Array.isArray(frame.pins)) throw Error('Invalid navigation frame');
  const ctx=canvas.getContext?.('2d');
  if (!ctx) throw Error('2D canvas unavailable');
  const {x,y,width,height}=frame.frame;
  if (![x,y,width,height,frame.zoom].every(Number.isFinite) || width<=0 || height<=0 || frame.zoom<4 || frame.zoom>14 ||
      x<0 || y<0 || x+width>canvas.width || y+height>canvas.height || frame.cells.length>20000 || frame.pins.length>64)
    throw Error('Invalid bounded navigation frame');
  // Validate everything before painting: reject forged, oversized or offscreen data.
  for (const cell of frame.cells) if(![cell.x,cell.z,cell.screenX,cell.screenY].every(Number.isFinite)) throw Error('Invalid discovery cell');
  for (const pin of frame.pins) if(![pin.screenX,pin.screenY,pin.worldX,pin.worldZ].every(Number.isFinite)) throw Error('Invalid waypoint');
  if(!frame.player || ![frame.player.screenX,frame.player.screenY,frame.player.bearing].every(Number.isFinite)) throw Error('Invalid player');
  ctx.save();
  try {
    ctx.beginPath();ctx.rect(x,y,width,height);ctx.clip();
    ctx.fillStyle=background;ctx.fillRect(x,y,width,height);
    for(const cell of frame.cells) {
      if(cell.screenX+frame.zoom<x || cell.screenX-frame.zoom>x+width ||
         cell.screenY+frame.zoom<y || cell.screenY-frame.zoom>y+height)continue;
      ctx.fillStyle=cellInk?cellInk(cell):cellColor;
      ctx.fillRect(Math.floor(cell.screenX-frame.zoom/2),Math.floor(cell.screenY-frame.zoom/2),Math.ceil(frame.zoom),Math.ceil(frame.zoom));
    }
    ctx.fillStyle=pinColor;
    for(const pin of frame.pins) {
      if(pin.screenX<x || pin.screenX>x+width || pin.screenY<y || pin.screenY>y+height)continue;
      ctx.fillRect(Math.floor(pin.screenX)-2,Math.floor(pin.screenY)-2,5,5);
    }
    const p=frame.player;
    if(p.screenX>=x&&p.screenX<=x+width&&p.screenY>=y&&p.screenY<=y+height){
      // Adapter bearing is the original game yaw: zero faces +Z (map down).
      const angle=p.bearing*Math.PI/180;
      ctx.fillStyle=playerColor;ctx.beginPath();
      ctx.moveTo(p.screenX+Math.sin(angle)*8,p.screenY+Math.cos(angle)*8);
      ctx.lineTo(p.screenX+Math.sin(angle+2.5)*6,p.screenY+Math.cos(angle+2.5)*6);
      ctx.lineTo(p.screenX+Math.sin(angle-2.5)*6,p.screenY+Math.cos(angle-2.5)*6);
      ctx.closePath();ctx.fill();
    }
  } finally {ctx.restore();}
  return Object.freeze({cells:frame.cells.length,pins:frame.pins.length,viewport:{x,y,width,height}});
}
