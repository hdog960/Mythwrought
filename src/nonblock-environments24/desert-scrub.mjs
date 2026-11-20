// :24 D desert scrub. Source-only opt-in shaped object; no world spawning.
export const DESERT_SCRUB_SCENE_ID='nonblock:d:desert-scrub';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeDesertScrub({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid desert scrub identity');
 const sceneId=DESERT_SCRUB_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],selectionAabbs=[],count=5+variant;
 const phase=hash(instanceKey)/4294967296*2*Math.PI;
 const emit=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 for(let i=0;i<count;i++){
  const angle=phase+i*2.3999632297,reach=.17+.033*((i+variant)%4),height=.193+.034*((i*3+variant)%4);
  const dx=Math.cos(angle),dz=Math.sin(angle);
  const at=(distance,y,width)=>[dx*distance-dz*width,y,dz*distance+dx*width];
  const ring=(distance,level,width)=>[
   at(distance,level,width),at(distance,level,-width),at(distance-width*.51,level+.009,0)
  ];
  const base=ring(.021,0,.016),elbow=ring(reach*.57,height*.58,.013),tip=ring(reach,height,.006);
  for(let edge=0;edge<3;edge++){
   const next=(edge+1)%3,material=edge===1?0:1;
   emit(base[edge],elbow[edge],base[next],material);
   emit(base[next],elbow[edge],elbow[next],material);
   emit(elbow[edge],tip[edge],elbow[next],material);
   emit(elbow[next],tip[edge],tip[next],material);
  }
  emit(...base,0);emit(...tip.slice().reverse(),1);
  const points=[...base,...elbow,...tip];
  for(const direction of [-1,1]){
   const leafRoot=at(reach*.60,height*.65,0),leafEnd=at(reach*.80,height*.83,direction*.068);
   const fold=at(reach*.73,height*.83,direction*.031);
   const flank=at(reach*.80,height*.72,direction*.031);
   emit(leafRoot,leafEnd,fold,2);
   emit(leafRoot,flank,leafEnd,3);
   points.push(leafRoot,leafEnd,fold,flank);
  }
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.004),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.004)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>144)throw new Error('scrub triangle cap');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:144,lodTriangles:[144,55,15]},
  integrationStatus:'source-candidate-only'};
}
export function validateDesertScrub(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid desert scrub');
 const canonical=makeDesertScrub({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(o[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical desert scrub '+k);
 return true;
}
