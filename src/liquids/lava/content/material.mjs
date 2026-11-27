// Lava B presentation only; shared presentation v1, no renderer mount.
export const LAVA_MATERIAL=Object.freeze({id:'lava',pass:'opaque',
  color:Object.freeze([0.95,0.28,0.035]),alpha:1,emissive:0.8,
  depthTest:true,depthWrite:true,cull:false,blend:'none'});
const clamp=n=>Math.max(0,Math.min(1,n));
const wrap=n=>n-Math.floor(n);
const byte=n=>Math.round(clamp(n)*255);
// Periodic, world-aligned fissures. Phase is display-only, not simulation time.
export function sampleMolten(u,v,phase=0,heat=0.8){
  if(![u,v,phase,heat].every(Number.isFinite)||heat<0||heat>1)throw new RangeError('lava visual input');
  const t=wrap(phase)*2*Math.PI,x=wrap(u)*2*Math.PI,y=wrap(v)*2*Math.PI;
  const a=Math.abs(Math.sin(2*x+0.65*Math.sin(3*y+t)));
  const b=Math.abs(Math.sin(3*y+0.55*Math.sin(x-t)));
  const fissure=clamp((0.23-Math.min(a,b))/0.23);
  const crust=clamp(1-fissure*heat);
  const glow=heat*fissure;
  const rgb=[0.10+0.88*glow,0.045+0.61*glow*glow,0.025+0.13*glow**4];
  return {rgb,emission:glow,crust};
}
// CPU asset builder, bounded 20 KiB total typed output; caller owns caching/upload.
export function buildLavaTile({size=32,phase=0,heat=0.8}={}){
  if(!Number.isInteger(size)||size<4||size>64)throw new RangeError('lava tile size');
  const rgba=new Uint8Array(size*size*4),emission=new Uint8Array(size*size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=y*size+x,s=sampleMolten(x/size,y/size,phase,heat);
    rgba.set([...s.rgb.map(byte),255],i*4);emission[i]=byte(s.emission);
  }
  return {size,rgba,emission};
}
// Inject Lava A's validated heat reader; never advance cooling or mutate cells.
export function lavaVisualSignal(cell,readLavaHeat){
  if(typeof readLavaHeat!=='function')throw new TypeError('Lava A heat reader required');
  if(cell?.id!=='lava'||!Number.isInteger(cell.units)||cell.units<1||cell.units>8)return null;
  const h=readLavaHeat(cell);
  if(!Number.isSafeInteger(h)||h<0||h>100*cell.units)return null;
  return Object.freeze({id:'lava',fill:cell.units/8,heat:h/(100*cell.units)});
}
