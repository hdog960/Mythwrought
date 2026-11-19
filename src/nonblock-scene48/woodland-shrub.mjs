// :48 B-family shrub; source-only, opt-in, never registered in the live world.
export const SHRUB_SCENE_ID='scene48:woodland-shrub';
export const SHRUB_VERSION='nonblock-shrub-v1';
const safe=Number.isSafeInteger;
export function createWoodlandShrub(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(safe)||variant<1||variant>3||[x,y,z].some(n=>Math.abs(n)>1000000))throw new TypeError('invalid shrub identity');
 const p=[],m=[];
 const tri=(a,b,c,material)=>{p.push(...a,...b,...c);m.push(material);};
 const stem=(a,b,r)=>{
  for(let k=0;k<4;k++){const t=k*Math.PI/2,u=(k+1)*Math.PI/2;
   const q=[a[0]+r*Math.cos(t),a[1],a[2]+r*Math.sin(t)],s=[a[0]+r*Math.cos(u),a[1],a[2]+r*Math.sin(u)];
   tri(q,s,b,0);
  }
 };
 const height=.48+variant*.11;
 stem([0,0,0],[0,height,0],.07);
 for(let i=0;i<6;i++){
  const theta=(i*2.399963229728653)+variant*.31;
  const dx=Math.cos(theta),dz=Math.sin(theta),h=.2+(i%3)*.09;
  const tip=[dx*(.22+variant*.035),h+.19,dz*(.22+variant*.035)];
  stem([0,h,0],tip,.022);
  const side=[-dz*.16,0,dx*.16],base=[tip[0]-dx*.08,tip[1]-.07,tip[2]-dz*.08];
  const a=[base[0]+side[0],base[1],base[2]+side[2]],b=[base[0]-side[0],base[1],base[2]-side[2]];
  const crown=[tip[0]+dx*.1,tip[1]+.15,tip[2]+dz*.1];
  tri(a,b,crown,1);tri(crown,b,a,1);
 }
 const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(let i=0;i<p.length;i+=3)for(let k=0;k<3;k++){
  const n=p[i+k]+[x,y,z][k];bounds.min[k]=Math.min(bounds.min[k],n);bounds.max[k]=Math.max(bounds.max[k],n);
 }
 const key=`${SHRUB_SCENE_ID}:${seed}:${x},${y},${z}:v${variant}`;
 return Object.freeze({sceneId:SHRUB_SCENE_ID,instanceKey:key,anchor:[x,y,z],variant,
  attachment:'ground',collision:'pass-through',selectionAabb:bounds,
  mesh:{positions:new Float32Array(p),materials:new Uint8Array(m),triangleCount:m.length},
  breakIntent:'remove-instance',tombstoneKey:key,spawn:'opt-in-only',respawn:'never-with-tombstone',
  lod:{maxTriangles:128,batch:'scene-family',distanceCull:48}});
}
