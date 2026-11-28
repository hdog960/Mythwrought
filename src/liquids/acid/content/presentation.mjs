// Acid B adapter for Water B presentation v1. No renderer or chemistry ownership.
import {ACID_MATERIAL,sampleAcidEffects} from './material.mjs';
const rgb=hex=>Object.freeze([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
export const ACID_PRESENTATION_MATERIAL=Object.freeze({id:ACID_MATERIAL.id,pass:'transparent',
  color:rgb(ACID_MATERIAL.surface),alpha:ACID_MATERIAL.opacity,emissive:0,
  depthTest:true,depthWrite:false,cull:false,blend:'straight-alpha'});
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger)&&p[1]>=-210&&p[1]<=256;
const ids=new Set(['water','lava','acid','amber-sap','liquid-resonance']);
// Caller provides visible, priority-ordered coordinates; no world scan or mesh copy.
// Full cells require known air above; partial cells have air inside their own cell.
export function sampleVisibleAcidEffects({engine,isLoaded,isOpen,cells,step=0,maxVisits=128,maxParticles=12}={}){
  if(typeof engine?.getCell!=='function'||typeof isLoaded!=='function'||typeof isOpen!=='function'||
    !Array.isArray(cells)||!Number.isSafeInteger(step)||step<0||
    !Number.isInteger(maxVisits)||maxVisits<1||maxVisits>1024||
    !Number.isInteger(maxParticles)||maxParticles<0||maxParticles>64)throw TypeError('Invalid acid presentation input');
  if(maxParticles===0)return Object.freeze({visited:0,effects:Object.freeze([])});
  const cache=new Map(),batch=[];
  function read(p){
    if(!point(p))return undefined;
    const k=p.join(',');if(cache.has(k))return cache.get(k);
    let c;
    if(isLoaded(...p)===true&&isOpen(...p)===true){
      c=engine.getCell(...p);
      if(c!==null&&(!c||!ids.has(c.id)||!Number.isInteger(c.units)||c.units<1||c.units>8||
        c.x!==p[0]||c.y!==p[1]||c.z!==p[2]))throw TypeError('Invalid liquid cell');
    }
    cache.set(k,c);return c;
  }
  const visited=Math.min(cells.length,maxVisits);
  for(let i=0;i<visited;i++){
    const p=cells[i];if(!point(p))throw RangeError('Invalid acid presentation coordinate');
    const c=read(p);if(c?.id==='acid')batch.push(c);
  }
  const result=sampleAcidEffects(batch,{step,maxVisits,maxParticles,
    isExposed:c=>c.units<8||read([c.x,c.y+1,c.z])===null});
  return Object.freeze({visited,effects:result.effects});
}
