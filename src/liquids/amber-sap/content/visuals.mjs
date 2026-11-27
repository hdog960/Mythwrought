// Isolated Amber Sap B presentation proposal; no runtime registration.
export const AMBER_SAP_MATERIAL = Object.freeze({
  id: 'amber-sap', shallow: '#f6c65b', deep: '#a95b16',
  opacity: 0.72, roughness: 0.38, emissive: 0, dripPeriod: 48
});
const int = (n, lo, hi) => Number.isSafeInteger(n) && n >= lo && n <= hi;
const valid = (x,y,z) => Number.isSafeInteger(x) && int(y,-210,256) && Number.isSafeInteger(z);
const phase = (x,y,z) => ((Math.imul(x,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791))>>>0)%48;
const faces = [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];

// Reads core v1 only; host supplies loaded/open queries. The phase is visual,
// not a flow or curing clock. No geometry is emitted for retained unloaded cells.
export function sampleAmberSapVisual({engine,isLoaded,isOpen,x,y,z,frame=0}={}) {
  if (typeof engine?.getCell !== 'function' || typeof isLoaded !== 'function' || typeof isOpen !== 'function')
    throw new TypeError('Amber sap visual host required');
  if (!valid(x,y,z) || !int(frame,0,Number.MAX_SAFE_INTEGER)) throw new RangeError('Invalid visual sample');
  if (isLoaded(x,y,z)!==true || isOpen(x,y,z)!==true) return null;
  const c=engine.getCell(x,y,z);
  if (c?.id!=='amber-sap' || !int(c.units,1,8)) return null;
  const fill=c.units/8;
  const sides=faces.map(([dx,dy,dz])=>{
    const p=[x+dx,y+dy,z+dz];
    if (!valid(...p) || isLoaded(...p)!==true || isOpen(...p)!==true) return 0;
    const n=engine.getCell(...p);
    if (n && n.id!=='amber-sap') return 0;
    return Math.max(0,fill-(int(n?.units,1,8)?n.units/8:0));
  });
  const below=[x,y-1,z];
  const drip=valid(...below)&&isLoaded(...below)===true&&isOpen(...below)===true&&!engine.getCell(...below);
  const t=((frame%48+phase(x,y,z))%48)/48;
  return Object.freeze({id:c.id,fill,surfaceY:y+fill,opacity:AMBER_SAP_MATERIAL.opacity,
    sides:Object.freeze(sides),drip:drip?Object.freeze({phase:t,length:Math.min(fill,0.125+t*0.25)}):null});
}

// Integer voxel basin, not a settlement or generator. Host must authorize the
// complete footprint and choose actual material IDs before placing anything.
export function createAmberBasin({x,y,z}={}) {
  if (!valid(x,y,z)||y>255||!valid(x+4,y+1,z+4)) throw new RangeError('Basin outside physical envelope');
  const solid=[],interior=[];
  for(let dz=0;dz<5;dz++)for(let dx=0;dx<5;dx++){
    solid.push(Object.freeze([x+dx,y,z+dz]));
    const p=Object.freeze([x+dx,y+1,z+dz]);
    if(dx===0||dx===4||dz===0||dz===4)solid.push(p);else interior.push(p);
  }
  return Object.freeze({id:'amber-sap-basin',solid:Object.freeze(solid),interior:Object.freeze(interior),
    capacityUnits:interior.length*8,materialRole:'basin-liner'});
}
