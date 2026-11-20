// :48 B-family low-profile moss mat; opt-in world object, never production spawned.
export const MOSS_SCENE_ID='scene48:forest-moss-mat';
export const MOSS_CONTRACT='nonblock-object-v1';
const integer=Number.isSafeInteger;
export function createForestMossMat(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(integer)||variant<1||variant>3||
    [x,y,z].some(v=>Math.abs(v)>1000000))throw new TypeError('invalid moss identity');
 const positions=[],materials=[];
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 // A continuous uneven ground-hugging surface, with raised asymmetric tuft ridges.
 // 4x4 cells, two real triangles per cell, plus four tapered tuft fins.
 const radius=.32+variant*.075,step=radius/2;
 const vertex=(i,j)=>{
  const u=i/2,v=j/2;
  const h=.025+.022*(1+Math.sin((i+seed%17)*2.1+(j+variant)*1.7))*.5;
  return [u*radius,h,v*radius];
 };
 for(let i=-2;i<2;i++)for(let j=-2;j<2;j++){
  const a=vertex(i,j),b=vertex(i+1,j),c=vertex(i,j+1),d=vertex(i+1,j+1);
  triangle(a,b,c,(i+j+8)%2);triangle(c,b,d,(i+j+8)%2);
 }
 for(let k=0;k<4;k++){
  const angle=k*Math.PI/2+variant*.19;
  const px=Math.cos(angle)*step,pz=Math.sin(angle)*step;
  const a=[px-.055,.04,pz],b=[px+.055,.04,pz];
  const tip=[px+.018,.14+variant*.028,pz+.045];
  triangle(a,b,tip,2);triangle(tip,b,a,2);
 }
 const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){
  const n=positions[i+k]+[x,y,z][k];
  bounds.min[k]=Math.min(bounds.min[k],n);bounds.max[k]=Math.max(bounds.max[k],n);
 }
 const instanceKey=`${MOSS_SCENE_ID}:${seed}:${x},${y},${z}:v${variant}`;
 return Object.freeze({contract:MOSS_CONTRACT,sceneId:MOSS_SCENE_ID,instanceKey,
  anchor:[x,y,z],variant,attachment:'ground',collision:'pass-through',
  selectionAabb:bounds,mesh:{positions:new Float32Array(positions),
   materials:new Uint8Array(materials),triangleCount:materials.length},
  breakIntent:'remove-instance',tombstoneKey:instanceKey,
  spawn:'opt-in-only',respawn:'never-with-tombstone',
  lod:{maxTriangles:64,batch:'scene-family',distanceCull:32}});
}
