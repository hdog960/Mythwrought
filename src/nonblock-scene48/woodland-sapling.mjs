// :48 B-family opt-in sapling. Triangle mesh only; never spawns into production.
export const SAPLING_SCENE_ID='scene48:woodland-sapling';
export const SAPLING_VERSION='nonblock-sapling-v1';
const valid=Number.isSafeInteger;
export function createWoodlandSapling(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(valid)||variant<1||variant>3)throw new TypeError('invalid sapling identity');
 const positions=[],materials=[];
 const tri=(a,b,c,mat)=>{positions.push(...a,...b,...c);materials.push(mat);};
 const stem=(a,b,r,mat)=>{
  const corners=[[r,0,0],[0,0,r],[-r,0,0],[0,0,-r]];
  for(let i=0;i<4;i++){const p=corners[i],q=corners[(i+1)%4];
   tri([a[0]+p[0],a[1],a[2]+p[2]],[a[0]+q[0],a[1],a[2]+q[2]],[b[0]+p[0]*.55,b[1],b[2]+p[2]*.55],mat);
   tri([a[0]+q[0],a[1],a[2]+q[2]],[b[0]+q[0]*.55,b[1],b[2]+q[2]*.55],[b[0]+p[0]*.55,b[1],b[2]+p[2]*.55],mat);
  }
 };
 const h=1.05+variant*.12;
 stem([0,.02,0],[0,h,0],.045,0);
 for(let k=0;k<5;k++){
  const theta=(k*2.399963229728653)+variant*.2,level=.36+k*.125;
  const dx=Math.cos(theta),dz=Math.sin(theta),reach=.27+(k%2)*.08;
  stem([0,level,0],[dx*reach,level+.15,dz*reach],.018,0);
  const tip=[dx*reach,level+.15,dz*reach],side=[-dz*.115,0,dx*.115];
  const leafA=[tip[0]+side[0],tip[1]+.065,tip[2]+side[2]];
  const leafB=[tip[0]-side[0],tip[1]+.065,tip[2]-side[2]];
  const apex=[tip[0]+dx*.14,tip[1]+.21,tip[2]+dz*.14];
  tri(tip,leafA,apex,1);tri(tip,apex,leafB,1);
  tri(apex,leafA,tip,1);tri(apex,tip,leafB,1);
 }
 const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(let i=0;i<positions.length;i+=3)for(let j=0;j<3;j++){
  const v=positions[i+j]+[x,y,z][j];bounds.min[j]=Math.min(bounds.min[j],v);bounds.max[j]=Math.max(bounds.max[j],v);
 }
 const key=`${SAPLING_SCENE_ID}:${seed}:${x},${y},${z}:v${variant}`;
 return Object.freeze({sceneId:SAPLING_SCENE_ID,instanceKey:key,anchor:[x,y,z],variant,
  attachment:'ground',collision:'pass-through',selectionAabb:bounds,
  mesh:{positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length},
  breakIntent:'remove-instance',tombstoneKey:key,spawn:'opt-in-only',respawn:'never-with-tombstone',
  lod:{maxTriangles:128,batch:'scene-family',distanceCull:48}});
}
