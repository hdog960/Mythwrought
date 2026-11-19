// :24 E mineral encrustation: wall-mounted fractured mineral rosettes, opt-in only.
export const MINERAL_ENCRUSTATION_SCENE_ID='nonblock:e:mineral-encrustation';
const anchorOk=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const faces=['north','south','east','west'];
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeMineralEncrustation({seed,anchor,variant=0,face='north'}={}){
 if(!Number.isSafeInteger(seed)||!anchorOk(anchor)||!Number.isInteger(variant)||variant<0||variant>3||!faces.includes(face))throw new TypeError('invalid mineral encrustation identity');
 const sceneId=MINERAL_ENCRUSTATION_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant+':'+face;
 const phase=(hash(instanceKey)%360)*Math.PI/180,positions=[],selectionAabbs=[];
 const n=face==='north'?[0,0,-1]:face==='south'?[0,0,1]:face==='east'?[1,0,0]:[-1,0,0];
 const t=[-n[2],0,n[0]];
 const point=(u,v,d)=>[t[0]*u+n[0]*d,v,t[2]*u+n[2]*d];
 const emit=(a,b,c)=>positions.push(...a,...b,...c);
 const count=4+variant;
 for(let i=0;i<count;i++){
  const angle=phase+i*2.3999632297,cu=Math.cos(angle)*(.095+.025*(i%2)),cv=.42+Math.sin(angle)*(.13+.014*variant);
  const width=.045+.008*((i+variant)%3),height=.07+.012*((i+2*variant)%3),depth=.045+.012*(i%3);
  const a=point(cu-width,cv-height,0),b=point(cu+width*.8,cv-height*.85,0),c=point(cu+width*.65,cv+height,0),d=point(cu-width*.8,cv+height*.75,0);
  const peak=point(cu+.013*Math.sin(angle),cv+.01*Math.cos(angle),depth);
  for(const f of [[a,b,peak],[b,c,peak],[c,d,peak],[d,a,peak],[a,d,c],[a,c,b]])emit(...f);
  const verts=[a,b,c,d,peak];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...verts.map(p=>p[k]))-.003),max:[0,1,2].map(k=>Math.max(...verts.map(p=>p[k]))+.003)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>42)throw new Error('mineral triangle cap');
 const supportOffset=face==='north'?[0,0,1]:face==='south'?[0,0,-1]:face==='east'?[-1,0,0]:[1,0,0];
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,face,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'wall',orientation:face,requiresSolid:true,requiresClear:true,supportOffset},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant+':'+face,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:42,lodTriangles:[42,24,12]},
  integrationStatus:'source-candidate-only'};
}
export function validateMineralEncrustation(o){
 if(!o||!anchorOk(o.anchor))throw new TypeError('invalid mineral encrustation');
 const expected=makeMineralEncrustation({seed:o.seed,anchor:o.anchor,variant:o.variant,face:o.face});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical mineral encrustation '+k);
 return true;
}
