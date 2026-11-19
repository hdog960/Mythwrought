// :48 forest lichen patch: opt-in shaped mesh with stable break identity.
export const LICHEN_SCENE_ID='scene48:forest-lichen-patch';
export const LICHEN_CONTRACT='nonblock-object-v1';
const safe=Number.isSafeInteger;
export function createForestLichenPatch(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(safe)||variant<1||variant>3||
    [x,y,z].some(n=>Math.abs(n)>1000000))throw new TypeError('invalid lichen identity');
 const positions=[],materials=[];
 const tri=(a,b,c,m)=>{positions.push(...a,...b,...c);materials.push(m);};
 // Six separate irregular lobes; their inner vertices meet a shallow raised hub.
 // Unlike the continuous moss mat, this forms a radial crust with distinct scalloped edges.
 const phase=((seed%97)+97)%97*.013+variant*.21;
 const hub=[0,.028,0],lobes=6+variant;
 for(let i=0;i<lobes;i++){
  const angle=phase+i*2*Math.PI/lobes;
  const next=phase+(i+1)*2*Math.PI/lobes;
  const radius=.24+variant*.035+(i%3)*.025;
  const a=[Math.cos(angle)*radius,.018+(i%2)*.012,Math.sin(angle)*radius];
  const b=[Math.cos(next)*(radius*.88),.02,Math.sin(next)*(radius*.88)];
  const mid=[Math.cos((angle+next)/2)*(radius*1.13),.035,Math.sin((angle+next)/2)*(radius*1.13)];
  tri(hub,a,mid,i%3);tri(hub,mid,b,i%3);
  // Raised curling rim, non-cubic and ray-pickable.
  tri(a,b,[mid[0]*.96,.075+variant*.012,mid[2]*.96],3);
 }
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){
  const v=positions[i+k]+[x,y,z][k];
  min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v);
 }
 const instanceKey=`${LICHEN_SCENE_ID}:${seed}:${x},${y},${z}:v${variant}`;
 return Object.freeze({contract:LICHEN_CONTRACT,sceneId:LICHEN_SCENE_ID,
  instanceKey,anchor:[x,y,z],variant,attachment:'stone-or-ground',
  collision:'pass-through',selectionAabb:{min,max},
  mesh:{positions:new Float32Array(positions),materials:new Uint8Array(materials),
   triangleCount:materials.length},breakIntent:'remove-instance',
  tombstoneKey:instanceKey,spawn:'opt-in-only',respawn:'never-with-tombstone',
  lod:{maxTriangles:32,batch:'scene-family',distanceCull:28}});
}
