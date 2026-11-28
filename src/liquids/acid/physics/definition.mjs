// Acid A, isolated contract v1. No terrain edits or damage activation.
export const ACID_SOLUTE='acid-solute';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
export function createAcidDefinition({gravityLimit=6,lateralLimit=3}={}){
  if(!int(gravityLimit,0,8)||!int(lateralLimit,0,8))throw new RangeError('Invalid acid flow limit');
  return Object.freeze({id:'acid',gravityLimit,lateralLimit});
}
export const ACID_DEFINITION=createAcidDefinition();
// Extensive solute uses 1000 counts per volume unit at maximum strength.
export function acidQuantities(units,strength=600){
  if(!int(units,1,8)||!int(strength,0,1000))throw new RangeError('Invalid acid strength or volume');
  return Object.freeze(strength?{[ACID_SOLUTE]:units*strength}:{});
}
function validCell(c,id){
  return c?.id===id&&Number.isSafeInteger(c.x)&&int(c.y,-210,256)&&Number.isSafeInteger(c.z)&&
    int(c.units,1,8)&&c.quantities&&typeof c.quantities==='object'&&!Array.isArray(c.quantities);
}
export function readAcidStrength(c){
  if(!validCell(c,'acid'))return null;
  const s=Object.hasOwn(c.quantities,ACID_SOLUTE)?c.quantities[ACID_SOLUTE]:0;
  return int(s,0,1000*c.units)?Math.floor(s/c.units):null;
}
// Pure owner-specific plan. Only plain water is accepted; other water payloads
// require an explicitly approved chemistry policy. Never discard quantities.
export function planAcidDilution(acid,water,{maxWaterUnits=2}={}){
  if(!int(maxWaterUnits,1,8))throw new RangeError('Invalid dilution limit');
  if(readAcidStrength(acid)===null||!validCell(water,'water')||Object.keys(water.quantities).length!==0||
    Math.abs(acid.x-water.x)+Math.abs(acid.y-water.y)+Math.abs(acid.z-water.z)!==1)return null;
  const n=Math.min(maxWaterUnits,8-acid.units,water.units);
  if(!n)return null;
  const acidAfter=Object.freeze({...acid,units:acid.units+n,quantities:Object.freeze({...acid.quantities})});
  const waterAfter=n===water.units?null:Object.freeze({...water,units:water.units-n,quantities:Object.freeze({})});
  return Object.freeze({acidBefore:acid,waterBefore:water,acidAfter,waterAfter,waterUnits:n});
}
// Proposal-only by default. Opt in to the shared neutral transaction API
// only on an isolated engine or under an approved host adoption contract.
export function createAcidWaterRule({maxWaterUnits=2,allowSettlement=false}={}){
  if(!int(maxWaterUnits,1,8))throw new RangeError('Invalid dilution limit');
  if(typeof allowSettlement!=='boolean')throw new TypeError('Explicit settlement policy required');
  const rule={a:'acid',b:'water',propose:(a,b)=>{
    const p=planAcidDilution(a,b,{maxWaterUnits});
    return p?Object.freeze({consumeA:0,consumeB:p.waterUnits,product:'acid-dilution'}):null;
  }};
  if(allowSettlement)rule.settle=proposal=>{
    const p=planAcidDilution(proposal?.a,proposal?.b,{maxWaterUnits});
    if(!p||proposal.consumeA!==0||proposal.consumeB!==p.waterUnits||proposal.product!=='acid-dilution')return null;
    return Object.freeze({routeA:null,routeB:'a'});
  };
  return Object.freeze(rule);
}
// Explicit bounded point sampling; output is a signal, not damage or movement.
export function sampleAcidExposure(engine,points,{maxPoints=8}={}){
  if(typeof engine?.samplePoint!=='function'||!int(maxPoints,1,32)||!Array.isArray(points)||points.length>maxPoints)
    throw new TypeError('Invalid acid exposure input or budget');
  let contacts=0,peakStrength=0;
  for(const p of points){
    if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new TypeError('Invalid sample point');
  }
  for(const p of points){
    const hit=engine.samplePoint(...p),strength=readAcidStrength(hit?.cell);
    if(strength===null)continue;
    contacts++;peakStrength=Math.max(peakStrength,strength);
  }
  return Object.freeze({samples:points.length,contacts,peakStrength});
}
