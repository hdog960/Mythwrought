// :24 E mineral encrustation: wall-mounted fractured mineral rosettes, opt-in only.
export const MINERAL_ENCRUSTATION_SCENE_ID='nonblock:e:mineral-encrustation';
const anchorOk=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const faces=['north','south','east','west'];
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeMineralEncrustation({seed,anchor,variant=0,face='north'}={}){
 if(!Number.isSafeInteger(seed)||!anchorOk(anchor)||!Number.isInteger(variant)||variant<0||variant>3||!faces.includes(face))throw new TypeError('invalid mineral encrustation identity');
 const sceneId=MINERAL_ENCRUSTATION_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant+':'+face;
 const phase=(hash(instanceKey)%360)*Math.PI/180,positions=[],materials=[],selectionAabbs=[];
 const n=face==='north'?[0,0,-1]:face==='south'?[0,0,1]:face==='east'?[1,0,0]:[-1,0,0];
 const t=[-n[2],0,n[0]];
 const point=(u,v,d)=>[t[0]*u+n[0]*d,v,t[2]*u+n[2]*d];
 const emit=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const outline=[[-1,-.34],[-.26,-.94],[.82,-.56],[.86,.53],[-.57,.90]];
 for(let i=0;i<4+variant;i++){
  const angle=phase+i*2.3999632297;
  const cu=Math.cos(angle)*(.072+.023*(i%3)),cv=.43+Math.sin(angle)*(.104+.012*variant);
  const w=.058+.014*((i+variant)%3),h=.074+.012*((i+variant*2)%3),depth=.023+.012*(i%3);
  const c=Math.cos(angle*.63),s=Math.sin(angle*.63);
  const layer=(x,y,relief)=>point(cu+x*c-y*s,cv+x*s+y*c,relief);
  const base=outline.map(([u,v])=>layer(u*w,v*h,0));
  const shelf=outline.map(([u,v],index)=>layer(u*w*.71+w*.11,v*h*.72-h*.09,
   depth*(.72+.12*((index+i)%4))));
  for(let edge=0;edge<5;edge++){
   const next=(edge+1)%5,pigment=(edge+i)%3===0?1:0;
   emit(base[edge],base[next],shelf[edge],pigment);
   emit(base[next],shelf[next],shelf[edge],pigment);
  }
  for(let edge=1;edge<4;edge++){
   emit(base[0],base[edge+1],base[edge],0);
   emit(shelf[0],shelf[edge],shelf[edge+1],(edge+i)%3===0?3:2);
  }
  const points=[...base,...shelf];
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>112)throw new Error('mineral triangle cap');
 const supportOffset=face==='north'?[0,0,1]:face==='south'?[0,0,-1]:face==='east'?[-1,0,0]:[1,0,0];
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,face,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'wall',orientation:face,requiresSolid:true,requiresClear:true,supportOffset},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant+':'+face,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:112,lodTriangles:[112,42,14]},
  integrationStatus:'source-candidate-only'};
}
export function validateMineralEncrustation(o){
 if(!o||!anchorOk(o.anchor))throw new TypeError('invalid mineral encrustation');
 const expected=makeMineralEncrustation({seed:o.seed,anchor:o.anchor,variant:o.variant,face:o.face});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical mineral encrustation '+k);
 return true;
}
