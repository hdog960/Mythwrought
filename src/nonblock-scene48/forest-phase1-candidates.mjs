// :48 isolated B-family candidate meshes. No world spawn, block IDs, or production writes.
export const FOREST_CANDIDATES=Object.freeze(['scene48:exposed-root','scene48:fallen-branch']);
const valid=n=>Number.isSafeInteger(n);
function tube(vertices,radii,capMaterial,sides=6){
 const positions=[],materials=[];
 const tri=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const rings=vertices.map(([x,y,z],i)=>{
  const previous=vertices[Math.max(0,i-1)],next=vertices[Math.min(vertices.length-1,i+1)];
  const dx=next[0]-previous[0],dz=next[2]-previous[2],length=Math.hypot(dx,dz);
  if(length<1e-6)throw new RangeError('zero-length segment');
  const nx=-dz/length,nz=dx/length;
  return Array.from({length:sides},(_,side)=>{
   const angle=side*2*Math.PI/sides,radius=radii[i];
   return [x+nx*Math.cos(angle)*radius,y+Math.sin(angle)*radius,z+nz*Math.cos(angle)*radius];
  });
 });
 for(let i=0;i<rings.length-1;i++)for(let side=0;side<sides;side++){
  const next=(side+1)%sides,material=(i+side)%3===0?1:0;
  tri(rings[i][side],rings[i+1][side],rings[i][next],material);
  tri(rings[i][next],rings[i+1][side],rings[i+1][next],material);
 }
 for(let side=0;side<sides;side++){
  const next=(side+1)%sides;
  tri(vertices[0],rings[0][side],rings[0][next],capMaterial);
  tri(vertices.at(-1),rings.at(-1)[next],rings.at(-1)[side],capMaterial);
 }
 return {positions,materials};
}
export function createForestCandidate(sceneId,seed,x,y,z,variant=1){
 if(!FOREST_CANDIDATES.includes(sceneId))throw new RangeError('unknown forest scene');
 if(![seed,x,y,z,variant].every(valid))throw new TypeError('integer seed, anchor and variant required');
 if(variant<0||variant>3)throw new RangeError('invalid forest variant');
 const root=sceneId==='scene48:exposed-root';
 const branches=root?[
  {v:[[0,.096,0],[.19,.16,.04],[.37,.07,.15]],r:[.105,.07,.018]},
  {v:[[0,.096,0],[-.17,.13,.09],[-.3,.04,.24]],r:[.09,.06,.014]},
  {v:[[0,.096,0],[.03,.11,-.2],[.12,.03,-.39]],r:[.09,.05,.012]}
 ]:[{v:[[-.47,.17,-.12],[-.18,.15,-.05],[.17,.12,.06],[.48,.09,.13]],r:[.09,.105,.075,.035]},
    {v:[[.06,.13,.03],[.16,.24,.2],[.23,.3,.29]],r:[.045,.028,.009]}];
 const positions=[],materials=[];
 const angle=(variant-1)*.21,cos=Math.cos(angle),sin=Math.sin(angle);
 const scale=.93+variant*.055;
 for(const {v,r} of branches){
  const nodes=v.map(([px,py,pz],i)=>[(px*cos-pz*sin)*scale,py*(1+variant*.026),
   (pz*cos+px*sin)*scale+i*(variant-1)*.012]);
  const mesh=tube(nodes,r.map(radius=>radius*(.98+variant*.021)),root?1:2);
  positions.push(...mesh.positions);
  materials.push(...mesh.materials);
 }
 const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(let i=0;i<positions.length;i+=3)for(let j=0;j<3;j++){
  const value=positions[i+j]+[x,y,z][j];
  bounds.min[j]=Math.min(bounds.min[j],value);bounds.max[j]=Math.max(bounds.max[j],value);
 }
 const key=`${sceneId}:${seed}:${x},${y},${z}:v${variant}`;
 return Object.freeze({sceneId,instanceKey:key,anchor:[x,y,z],variant,attachment:'ground',
  collision:'pass-through',selectionAabb:bounds,mesh:{positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length},
  breakIntent:'remove-instance',tombstoneKey:key,spawn:'opt-in-only',respawn:'never-with-tombstone'});
}
