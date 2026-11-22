// Source-only D3 bounded assembly proposal. No production voxel, physics or save mutation.
export const ASSEMBLY_V1 = Object.freeze({id:'resonance-device-assembly-v1',productionBound:false,maxParts:16,maxSpan:4,maxEnergy:64});
const integer=(n)=>Number.isSafeInteger(n);
export function validateAssembly({seed,parts,energyPerTick,travel,clearance}) {
  if(!integer(seed)||seed<0||!Array.isArray(parts)||parts.length<1||parts.length>16) throw Error('invalid assembly identity or size');
  if(!integer(energyPerTick)||energyPerTick<1||energyPerTick>64) throw Error('invalid energy budget');
  if(!Number.isFinite(travel)||travel<0||travel>4) throw Error('invalid travel');
  if(clearance!==true) throw Error('authoritative clearance required');
  const seen=new Set();
  const checked=parts.map(p=>{
    if(!p||typeof p.id!=='string'||! /^[a-z0-9_-]{1,48}$/.test(p.id)||!Array.isArray(p.offset)||p.offset.length!==3||!p.offset.every(n=>integer(n)&&Math.abs(n)<=4)) throw Error('invalid part');
    if(seen.has(p.id)) throw Error('duplicate part');seen.add(p.id);
    if(p.playerPlaced!==false||p.assetApproved!==true) throw Error('unapproved or player-placed geometry');
    return Object.freeze({id:p.id,offset:Object.freeze([...p.offset])});
  });
  const spans=[0,1,2].map(i=>Math.max(...checked.map(p=>p.offset[i]))-Math.min(...checked.map(p=>p.offset[i])));
  if(spans.some(n=>n>4)) throw Error('assembly exceeds span');
  return Object.freeze({contract:ASSEMBLY_V1.id,seed,energyPerTick,travel,parts:Object.freeze(checked)});
}
export function advanceAssembly(frame,{allocation,clearance}) {
  if(!frame||frame.contract!==ASSEMBLY_V1.id) throw Error('invalid frame');
  if(!integer(allocation)||allocation<0||allocation>frame.energyPerTick) throw Error('invalid allocation');
  return Object.freeze({state:allocation===frame.energyPerTick&&clearance===true?'eligible':'stopped',positionChanged:false,productionBound:false});
}
