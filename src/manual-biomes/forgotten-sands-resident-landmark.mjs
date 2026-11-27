// Low-surface fallback: annotate ONLY already resident native monument
// full-cube triangles, before other layer composition. Same vertex ABI,
// same number of bytes/owners/triangles. No new distant geometry or slot.
const allowed=new Set([3,6]),isInt=Number.isSafeInteger;
export function p0ResidentLandmarkWitness(v,i,source,composed,owner,H){
 if(![v[i+8],v[i+17],v[i+26]].every(n=>allowed.has(n)&&n===v[i+8]))return null;
 const p=[0,9,18].map(j=>[v[i+j],v[i+j+1],v[i+j+2]]);
 if(!p.flat().every(isInt))return null;
 const lo=[0,1,2].map(a=>Math.min(...p.map(q=>q[a]))),hi=[0,1,2].map(a=>Math.max(...p.map(q=>q[a])));
 const axis=lo.findIndex((n,a)=>n===hi[a]);
 if(axis<0||lo.some((n,a)=>a!==axis&&hi[a]-n!==1))return null;
 const choices=[];
 for(const side of [-1,1]){
  const cell=[...lo],other=[...lo];if(side<0)cell[axis]--;else other[axis]--;
  const [x,y,z]=cell,id=composed.get(x,y,z);
  if(id!==v[i+8]||source.get(x,y,z)!==0||composed.get(...other)!==0||
   composed.edits?.has(cell.join(','))||composed.base?.edits?.has(cell.join(',')))continue;
  const key=H.physicalRegionAt(x,y,z)?.key;
  if(key!==owner)continue;
  choices.push({cell,axis,side,id});
 }
 return choices.length===1?Object.freeze(choices[0]):null;
}
export function annotateP0ResidentLandmarks(vertices,{source,composed,owner,H,sourceCurrent}={}){
 if(!(vertices instanceof Float32Array)||vertices.length%27||typeof owner!=='string'||!source||!composed||!H||typeof sourceCurrent!=='function'||sourceCurrent()!==true)throw Error('Invalid resident landmark source');
 const out=vertices.slice();let triangles=0;
 const owners=new Set();
 for(let i=0;i<vertices.length;i+=27){
  if([vertices[i+8],vertices[i+17],vertices[i+26]].some(n=>!Number.isFinite(n)||n<0))throw Error('Unexpected native material tag');
  const q=p0ResidentLandmarkWitness(vertices,i,source,composed,owner,H);if(!q)continue;
  for(const j of [8,17,26])out[i+j]=-vertices[i+j]-1;
  triangles++;owners.add(q.cell.join(','));
 }
 if(sourceCurrent()!==true)throw Error('Stale resident landmark source');
 return Object.freeze({vertices:out,triangles,cells:owners.size,bytes:out.byteLength,extraOwners:0});
}
// Exact current shader string patch. Original material and alpha restored
// before existing art code; cave haze remains original. Only tagged
// physical landmark triangles get longer fog. No new attribute or draw.
export function p0ResidentLandmarkShaders(original){
 const vs=original?.terrainVertex,fs=original?.terrainFragment;
 const vdecl='flat out int vMat; out float vPack2Alpha;',vcode='vMat=int(floor(aMat+.001)); vPack2Alpha=fract(aMat);';
 const fdecl='uniform vec3 uFog;',fog='float worldFog(float distanceToEye){ return smoothstep(mix(29.0,9.0,uCaveHaze),mix(68.0,27.0,uCaveHaze),distanceToEye); }';
 if(typeof vs!=='string'||typeof fs!=='string'||!vs.includes(vdecl)||!vs.includes(vcode)||!fs.includes(fdecl)||!fs.includes(fog))throw Error('Current terrain shader contract changed');
 return Object.freeze({...original,terrainVertex:vs.replace(vdecl,vdecl+' flat out int vLandmark;').replace(vcode,'vLandmark=aMat<0.0?1:0; float nativeMat=vLandmark==1?-aMat-1.0:aMat; vMat=int(floor(nativeMat+.001)); vPack2Alpha=fract(nativeMat);'),
 terrainFragment:fs.replace(fdecl,'flat in int vLandmark; '+fdecl).replace(fog,'float worldFog(float distanceToEye){ if(vLandmark==1&&uCaveHaze==0.0)return smoothstep(45.0,155.0,distanceToEye); return smoothstep(mix(29.0,9.0,uCaveHaze),mix(68.0,27.0,uCaveHaze),distanceToEye); }')});
}
