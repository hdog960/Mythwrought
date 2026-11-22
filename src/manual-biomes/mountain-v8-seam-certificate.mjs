// Isolated V8 source-provenance seam gate. No V7 dispatch or world writes.
// All five samples must originate from the SAME authoritative reader.
const integer=n=>Number.isSafeInteger(n);
export const MOUNTAIN_V8_SEAM_OFFSETS=Object.freeze([
  Object.freeze([0,0]),Object.freeze([1,0]),Object.freeze([-1,0]),
  Object.freeze([0,1]),Object.freeze([0,-1])
]);
export function certifyMountainV8Seam(x,z,seed,readProposal,{maxStep=2}={}){
  if(![x,z,seed,maxStep].every(integer)||seed!==(seed|0)||
     maxStep<0||maxStep>2||typeof readProposal!=='function')return null;
  const records=[];
  for(const [dx,dz] of MOUNTAIN_V8_SEAM_OFFSETS){
    const a=x+dx,b=z+dz;
    if(!integer(a)||!integer(b))return null;
    const p=readProposal(a,b,seed);
    // Foreign, protected, edited or unknown terrain cannot be certified.
    if(!p||p.x!==a||p.z!==b||p.seed!==seed||
       p.biome!=='mountain'||p.safeToIntegrate!==false||
       p.generatorIdentityRequired!=='v8-new-opt-in'||
       !integer(p.top)||!integer(p.legacyTop)||p.top<p.legacyTop||
       !['snow','alpine-grass','slate','gneiss','scree'].includes(p.cap))return null;
    records.push(Object.freeze({x:a,z:b,top:p.top,cap:p.cap}));
  }
  const center=records[0];
  const differences=records.slice(1).map(p=>Math.abs(center.top-p.top));
  if(differences.some(n=>n>maxStep))return null;
  return Object.freeze({center,neighbors:Object.freeze(records.slice(1)),
    greatestStep:Math.max(...differences),checks:records.length,
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
