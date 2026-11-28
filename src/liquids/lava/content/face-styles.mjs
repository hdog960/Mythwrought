// Lava B: compose with Water B prepareLiquidFaceStyles, never draw or mutate.
import {lavaVisualSignal} from './material.mjs';
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
// Create once per batch under the same stable lease as mesh construction.
// Discard after binding. Heat-only changes require a new batch revision even
// if the mesh geometry is unchanged. No cross-batch or cross-revision cache.
export function createLavaFaceStyleResolver({engine,isLoaded,isOpen,readLavaHeat,heatBands=8,maxCells=256}={}){
  if(typeof engine?.getCell!=='function'||typeof isLoaded!=='function'||typeof isOpen!=='function'||typeof readLavaHeat!=='function'||!int(heatBands,1,16)||!int(maxCells,1,4096))throw TypeError('Invalid lava face style inputs');
  const cache=new Map();
  return function styleForFace(face){
    if(face?.liquid!=='lava')return null;
    const p=face.cell;
    if(!Array.isArray(p)||p.length!==3||!p.every(Number.isSafeInteger)||!int(p[1],-210,256))throw RangeError('Invalid lava face cell');
    const k=p.join(',');
    if(cache.has(k))return cache.get(k);
    if(cache.size>=maxCells)throw RangeError('Lava style cell budget');
    if(isLoaded(...p)!==true||isOpen(...p)!==true)throw Error('Unavailable lava face');
    const c=engine.getCell(...p);
    if(c?.x!==p[0]||c?.y!==p[1]||c?.z!==p[2])throw Error('Stale lava face');
    const s=lavaVisualSignal(c,readLavaHeat);
    if(!s)throw Error('Invalid lava face heat');
    // Visual-only quantization: zero stays cold, positive heat stays visible.
    // At most heatBands+1 distinct texture heat levels per display phase.
    const heat=Math.round(s.heat*100*c.units);
    const style=Object.freeze([Math.ceil(heat*heatBands/(100*c.units))/heatBands]);
    cache.set(k,style);return style;
  };
}
