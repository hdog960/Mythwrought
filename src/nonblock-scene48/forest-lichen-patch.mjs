// :48 forest lichen patch: opt-in shaped mesh with stable break identity.
export const LICHEN_SCENE_ID='scene48:forest-lichen-patch';
export const LICHEN_CONTRACT='nonblock-object-v1';
const safe=Number.isSafeInteger;
export function createForestLichenPatch(seed,x,y,z,variant=1){
 if(![seed,x,y,z,variant].every(safe)||variant<1||variant>3||
    [x,y,z].some(n=>Math.abs(n)>1000000))throw new TypeError('invalid lichen identity');
 const positions=[],materials=[];
 const tri=(a,b,c,m)=>{positions.push(...a,...b,...c);materials.push(m);};
 const phase=((seed%97)+97)%97*.013+variant*.21;
 const hub=[.018,.025,-.012],lobes=6+variant;
 for(let i=0;i<lobes;i++){
  const center=phase+(i+.5)*2*Math.PI/lobes;
  const halfWidth=Math.PI/lobes;
  const extent=.228+variant*.032+.045*Math.sin(phase+i*2.24);
  const point=(a,r,h)=>[Math.cos(a)*r,h,Math.sin(a)*r];
  const a=point(center-halfWidth,.46*extent,.026), b=point(center+halfWidth,.46*extent,.026);
  const left=point(center-halfWidth*.62,extent,.037), right=point(center+halfWidth*.66,extent,.041);
  const rim=point(center,extent*(1.1+.065*(i%2)),.022);
  const fold=point(center,extent*.76,.046+variant*.004);
  tri(hub,a,b,i%3);
  tri(a,left,fold,1);
  tri(a,fold,b,0);
  tri(b,fold,right,1);
  tri(left,rim,fold,2);
  tri(rim,right,fold,3);
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
  lod:{maxTriangles:54,batch:'scene-family',distanceCull:28}});
}
