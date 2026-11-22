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
  const records=[],physicalColumns=[];
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
         physical.legacyTop!==p.legacyTop||physical.cap!==p.cap||
         !Number.isSafeInteger(physical.estimatedCells)||
         physical.estimatedCells<1||physical.estimatedCells>18||
         physical.estimatedCells!==p.top-p.legacyTop+1||
         !Array.isArray(physical.writes)||
         physical.writes.length!==physical.estimatedCells||
         physical.writes.some((cell,i)=>!cell||cell.x!==a||cell.z!==b||
           cell.y!==p.legacyTop+i||
           cell.material!==(i===physical.estimatedCells-1?p.cap:
             p.cap==='alpine-grass'&&p.legacyTop+i>=p.top-2?'dirt':'stone')))return null;
      verifiedCells+=physical.estimatedCells;
      if(verifiedCells>90)return null;
      physicalColumns.push(physical);
    }
    records.push(Object.freeze({x:a,z:b,top:p.top,cap:p.cap}));
  }
  const center=records[0];
  const differences=records.slice(1).map(p=>Math.abs(center.top-p.top));
  if(differences.some(n=>n>maxStep))return null;
  // Enumerate the newly exposed vertical faces at the four exact cardinal
  // contacts. Each face must come from certified physical source material;
  // unknown original-bedrock faces are not silently invented as V8 geometry.
  const exposedFaces=[];
  if(readSupport){
    for(let i=1;i<records.length;i++){
      const neighbor=records[i];
      const higher=center.top>neighbor.top?0:i;
      const lowerTop=Math.min(center.top,neighbor.top);
      const exposedTop=Math.max(center.top,neighbor.top);
      const solid=physicalColumns[higher];
      for(let y=lowerTop+1;y<=exposedTop;y++){
        const cell=solid.writes[y-solid.legacyTop];
        if(!cell||cell.y!==y||!cell.material)return null;
        exposedFaces.push(Object.freeze({
          x:records[higher].x,y,z:records[higher].z,
          toward:Object.freeze([
            i===1?(higher===0?1:-1):i===2?(higher===0?-1:1):0,
            i===3?(higher===0?1:-1):i===4?(higher===0?-1:1):0
          ]),
          material:cell.material
        }));
      }
    }
  }
  if(exposedFaces.length>8)return null; // four faces x two-block step
  return Object.freeze({center,neighbors:Object.freeze(records.slice(1)),
    greatestStep:Math.max(...differences),checks:records.length,
    physicallyVerified:Boolean(readSupport),verifiedCells,
    exposedFaces:Object.freeze(exposedFaces),
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
