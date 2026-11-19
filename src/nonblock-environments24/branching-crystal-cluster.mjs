// :24 E branching crystal cluster. Isolated, opt-in shaped object; never auto-spawns.
export const BRANCHING_CRYSTAL_SCENE_ID='nonblock:e:branching-crystal-cluster';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeBranchingCrystalCluster({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid crystal cluster identity');
 const sceneId=BRANCHING_CRYSTAL_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],selectionAabbs=[],count=3+variant,phase=hash(instanceKey)/4294967296*Math.PI*2;
 const emit=(a,b,c)=>positions.push(...a,...b,...c);
 for(let i=0;i<count;i++){
  const angle=phase+i*2.399963229728653,dx=Math.cos(angle),dz=Math.sin(angle);
  const height=.32+.10*((i+variant)%4),reach=i===0?.02:.10+.025*(i%3),radius=.065+.009*((i+variant)%3);
  const base=[dx*reach,0,dz*reach],tip=[dx*(reach+.09),height,dz*(reach+.09)];
  const ring=[];
  for(let k=0;k<5;k++){const a=angle+k*Math.PI*2/5;ring.push([base[0]+radius*Math.cos(a),.015,base[2]+radius*Math.sin(a)]);}
  for(let k=0;k<5;k++){emit(ring[k],ring[(k+1)%5],tip);emit(base,ring[(k+1)%5],ring[k]);}
  const verts=[...ring,base,tip];
  selectionAabbs.push({min:[0,1,2].map(axis=>Math.min(...verts.map(v=>v[axis]))-.003),max:[0,1,2].map(axis=>Math.max(...verts.map(v=>v[axis]))+.003)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>60)throw new Error('crystal triangle cap');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'solid',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:96,maxTrianglesPerInstance:60,lodTriangles:[60,30,12]},
  integrationStatus:'source-candidate-only'};
}
export function validateBranchingCrystalCluster(object){
 if(!object||!validAnchor(object.anchor))throw new TypeError('invalid crystal cluster');
 const canonical=makeBranchingCrystalCluster({seed:object.seed,anchor:object.anchor,variant:object.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(object[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical crystal cluster '+k);
 return true;
}
