// :24 E branching crystal cluster. Isolated, opt-in shaped object; never auto-spawns.
export const BRANCHING_CRYSTAL_SCENE_ID='nonblock:e:branching-crystal-cluster';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeBranchingCrystalCluster({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid crystal cluster identity');
 const sceneId=BRANCHING_CRYSTAL_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],selectionAabbs=[],count=3+variant;
 const turn=2*Math.PI,phase=hash(instanceKey)/4294967296*turn;
 const emit=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 for(let part=0;part<count;part++){
  const heading=phase+part*2.3999632297,dx=Math.cos(heading),dz=Math.sin(heading);
  const reach=part===0?.014:.055+.016*(part%3);
  const lean=part===0?.049:.12+.027*(part%3);
  const height=part===0?.51+.034*variant:.29+.064*((part+variant)%4);
  const radius=part===0?.089:.052+.008*((part+variant)%3),sides=6;
  const crossSection=(rise,span)=>Array.from({length:sides},(_,edge)=>{
   const angle=heading+edge*turn/sides;
   return [dx*(reach+lean*rise)+Math.cos(angle)*span,height*rise,
    dz*(reach+lean*rise)+Math.sin(angle)*span];
  });
  const footing=crossSection(0,radius*.83);
  const shoulder=crossSection(.69+(part%3)*.048,radius);
  const peak=[dx*(reach+lean)-dz*radius*.33,height,dz*(reach+lean)+dx*radius*.33];
  const base=[dx*reach,0,dz*reach];
  for(let edge=0;edge<sides;edge++){
   const next=(edge+1)%sides,material=(edge+part)%3===1?2:1;
   emit(footing[edge],shoulder[edge],footing[next],material);
   emit(footing[next],shoulder[edge],shoulder[next],material);
   emit(shoulder[edge],peak,shoulder[next],edge%2===0?3:2);
   emit(base,footing[edge],footing[next],0);
  }
  const points=[...footing,...shoulder,peak];
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>144)throw new Error('crystal triangle cap');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'solid',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:96,maxTrianglesPerInstance:144,lodTriangles:[144,60,18]},
  integrationStatus:'source-candidate-only'};
}
export function validateBranchingCrystalCluster(object){
 if(!object||!validAnchor(object.anchor))throw new TypeError('invalid crystal cluster');
 const canonical=makeBranchingCrystalCluster({seed:object.seed,anchor:object.anchor,variant:object.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(object[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical crystal cluster '+k);
 return true;
}
