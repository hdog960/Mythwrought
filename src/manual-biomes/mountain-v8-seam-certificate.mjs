// Isolated V8 source-provenance seam gate. No V7 dispatch or world writes.
// All five samples must originate from the SAME authoritative reader.
const integer=n=>Number.isSafeInteger(n);
export const MOUNTAIN_V8_SEAM_OFFSETS=Object.freeze([
  Object.freeze([0,0]),Object.freeze([1,0]),Object.freeze([-1,0]),
  Object.freeze([0,1]),Object.freeze([0,-1])
]);
export function certifyMountainV8Seam(x,z,seed,readProposal,{maxStep=2,readSupport}={}){
  if(![x,z,seed,maxStep].every(integer)||seed!==(seed|0)||
     maxStep<0||maxStep>2||typeof readProposal!=='function'||
     (readSupport!==undefined&&typeof readSupport!=='function'))return null;
  const records=[];
  let verifiedCells=0;
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
    if(readSupport){
      // Each neighboring column must have authentic physical material support.
      // Bounds protect the future iPhone mesher from unbounded hidden fills.
      const physical=readSupport(p);
      if(!physical||physical.safeToIntegrate!==false||
         physical.requiresApprovedV8BlockMapping!==true||
         physical.x!==a||physical.z!==b||physical.top!==p.top||
         !Number.isSafeInteger(physical.estimatedCells)||
         physical.estimatedCells<1||physical.estimatedCells>18||
         !Array.isArray(physical.writes)||
         physical.writes.length!==physical.estimatedCells||
         physical.writes.some((cell,i)=>cell.x!==a||cell.z!==b||
           cell.y!==p.legacyTop+i||typeof cell.material!=='string'))return null;
      verifiedCells+=physical.estimatedCells;
      if(verifiedCells>90)return null;
    }
    records.push(Object.freeze({x:a,z:b,top:p.top,cap:p.cap}));
  }
  const center=records[0];
  const differences=records.slice(1).map(p=>Math.abs(center.top-p.top));
  if(differences.some(n=>n>maxStep))return null;
  return Object.freeze({center,neighbors:Object.freeze(records.slice(1)),
    greatestStep:Math.max(...differences),checks:records.length,
    physicallyVerified:Boolean(readSupport),verifiedCells,
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
