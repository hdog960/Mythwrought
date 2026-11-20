// :48 B-family low-profile moss mat; opt-in world object, never production spawned.
export const MOSS_SCENE_ID='scene48:forest-moss-mat';
export const MOSS_CONTRACT='nonblock-object-v1';
const integer=Number.isSafeInteger;
export function createForestMossMat(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(integer)||variant<0||variant>3||
    [x,y,z].some(v=>Math.abs(v)>1000000))throw new TypeError('invalid moss identity');
 const positions=[],materials=[];
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const sides=10, radius=.30+variant*.058;
 const phase=seed%89+x*.17+y*.11+z*.23+variant*.73;
 const edge=[],interior=[];
 for(let i=0;i<sides;i++){
  const angle=(i/sides+variant*.031)*Math.PI*2;
  const radial=radius*(.86+.18*Math.sin(phase+i*1.91));
  const x=Math.cos(angle)*radial,z=Math.sin(angle)*radial;
  edge.push([x,.016+.008*(i%3),z]);
  interior.push([x*.49,.048+.016*Math.sin(phase+i*2.19),z*.49]);
 }
 const center=[.022,.055,-.018];
 for(let i=0;i<sides;i++){
  const j=(i+1)%sides;
  const pigment=(i%4===0)?0:1;
  triangle(edge[i],edge[j],interior[j],0);
  triangle(edge[i],interior[j],interior[i],pigment);
  triangle(center,interior[i],interior[j],i%3===0?2:1);
 }
 for(let i=0;i<3+variant;i++){
  const [x,y,z]=interior[(i*2+variant)%sides];
  const peak=[x+.014,y+.032+(i%3)*.013,z-.014];
  const spine=[x,y+.020,z+.053];
  triangle([x-.036,y-.006,z],peak,spine,3);
  triangle(peak,[x+.033,y-.004,z+.027],spine,2);
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
