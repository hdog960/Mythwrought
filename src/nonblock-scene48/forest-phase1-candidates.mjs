// :48 isolated B-family candidate meshes. No world spawn, block IDs, or production writes.
export const FOREST_CANDIDATES=Object.freeze(['scene48:exposed-root','scene48:fallen-branch']);
const valid=n=>Number.isSafeInteger(n);
function tube(vertices,radii,sides=5){
 const positions=[],materials=[];
 for(let i=0;i<vertices.length-1;i++){
  const a=vertices[i],b=vertices[i+1],dx=b[0]-a[0],dz=b[2]-a[2],length=Math.hypot(dx,dz);
  if(length<1e-6)throw new RangeError('zero-length segment');
  const nx=-dz/length,nz=dx/length;
  for(let j=0;j<sides;j++){
   const theta=j*2*Math.PI/sides,phi=(j+1)*2*Math.PI/sides;
   const ring=(p,r,t)=>[p[0]+nx*Math.cos(t)*r,p[1]+Math.sin(t)*r,p[2]+nz*Math.cos(t)*r];
   const p=ring(a,radii[i],theta),q=ring(a,radii[i],phi),s=ring(b,radii[i+1],theta),t=ring(b,radii[i+1],phi);
   positions.push(...p,...q,...s,...q,...t,...s);materials.push(i%2,i%2);
  }
 }
 return {positions,materials};
}
export function createForestCandidate(sceneId,seed,x,y,z){
 if(!FOREST_CANDIDATES.includes(sceneId))throw new RangeError('unknown forest scene');
 if(![seed,x,y,z].every(valid))throw new TypeError('integer seed and anchor required');
 const root=sceneId==='scene48:exposed-root';
 const branches=root?[
  {v:[[0,.09,0],[.19,.16,.04],[.37,.07,.15]],r:[.105,.07,.018]},
  {v:[[0,.09,0],[-.17,.13,.09],[-.3,.04,.24]],r:[.09,.06,.014]},
  {v:[[0,.09,0],[.03,.11,-.2],[.12,.03,-.39]],r:[.09,.05,.012]}
 ]:[{v:[[-.47,.17,-.12],[-.18,.15,-.05],[.17,.12,.06],[.48,.09,.13]],r:[.09,.105,.075,.035]},
    {v:[[.06,.13,.03],[.16,.24,.2],[.23,.3,.29]],r:[.045,.028,.009]}];
 const positions=[],materials=[];
 for(const part of branches){const m=tube(part.v,part.r);positions.push(...m.positions);materials.push(...m.materials);}
 const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(let i=0;i<positions.length;i+=3)for(let j=0;j<3;j++){
  const value=positions[i+j]+[x,y,z][j];
  bounds.min[j]=Math.min(bounds.min[j],value);bounds.max[j]=Math.max(bounds.max[j],value);
 }
 const key=`${sceneId}:${seed}:${x},${y},${z}:v1`;
 return Object.freeze({sceneId,instanceKey:key,anchor:[x,y,z],variant:1,attachment:'ground',
  collision:'pass-through',selectionAabb:bounds,mesh:{positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length},
  breakIntent:'remove-instance',tombstoneKey:key,spawn:'opt-in-only',respawn:'never-with-tombstone'});
}
