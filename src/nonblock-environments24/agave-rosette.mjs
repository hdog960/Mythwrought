// :24 D agave: thick folded radial succulent blades, never a cubic material.
export const AGAVE_SCENE_ID='nonblock:d:agave-rosette';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeAgaveRosette({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid agave identity');
 const sceneId=AGAVE_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const phase=hash(instanceKey)/4294967296*2*Math.PI,positions=[],materials=[],selectionAabbs=[];
 const tri=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const count=6+variant*2;
 for(let i=0;i<count;i++){
  const angle=phase+i*2.3999632297,dx=Math.cos(angle),dz=Math.sin(angle);
  const inner=i%3===0;
  const length=(inner?.218:.319)+variant*(inner?.024:.038)+.011*(i%4);
  const width=(inner?.043:.066)+.006*(i%3);
  const point=(reach,y,across=0)=>[dx*reach-dz*across,y,dz*reach+dx*across];
  const base=point(.015,0);
  const shoulder=(inner?.155:.094)+.018*(i%3);
  const left=point(length*.52,shoulder,-width),right=point(length*.56,shoulder+.012,width*.82);
  const rise=inner?.21+variant*.036:.084+variant*.024;
  const tip=point(length,rise+(.01*(i%2))),fold=point(length*.51,shoulder+.046,width*.11);
  const underside=point(length*.53,shoulder-.030,-width*.13);
  tri(base,fold,left,1);tri(left,fold,tip,2);tri(fold,right,tip,3);tri(right,fold,base,2);
  tri(left,underside,base,0);tri(tip,underside,left,1);tri(right,underside,tip,0);tri(base,underside,right,1);
  const points=[base,left,right,tip,fold,underside];
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>96)throw new Error('agave triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:96,lodTriangles:[96,40,12]},
  integrationStatus:'source-candidate-only'};
}
export function validateAgaveRosette(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid agave');
 const expected=makeAgaveRosette({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical agave '+k);
 return true;
}
