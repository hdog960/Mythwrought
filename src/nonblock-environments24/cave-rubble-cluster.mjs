// :24 E cave rubble: isolated opt-in fractured mesh fragments, no terrain edits.
export const CAVE_RUBBLE_SCENE_ID='nonblock:e:cave-rubble-cluster';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makeCaveRubbleCluster({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid cave rubble identity');
 const sceneId=CAVE_RUBBLE_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],selectionAabbs=[],count=3+variant,phase=hash(instanceKey)/4294967296*Math.PI*2;
 const emit=(a,b,c)=>positions.push(...a,...b,...c);
 // Each fragment is a lopsided fractured wedge with four irregular ground corners
 // and two offset ridge vertices: never a cubic block or billboard.
 for(let i=0;i<count;i++){
  const angle=phase+i*2.399963229728653,dist=.085+.07*(i%3),cx=Math.cos(angle)*dist,cz=Math.sin(angle)*dist;
  const w=.045+.012*((i+variant)%3),d=.035+.009*((i+2*variant)%3),height=.07+.025*((i+variant)%3);
  const yaw=angle+.41,ux=Math.cos(yaw),uz=Math.sin(yaw),vx=-uz,vz=ux;
  const p=(u,v,y)=>[cx+ux*u+vx*v,y,cz+uz*u+vz*v];
  const a=p(-w,-d,0),b=p(w,-d*.8,0),c=p(w*.72,d,0),e=p(-w*.9,d*.85,0);
  const r=p(-w*.23,-d*.1,height),s=p(w*.32,d*.16,height*.67);
  for(const face of [[a,b,r],[b,s,r],[b,c,s],[c,e,s],[e,r,s],[e,a,r],[a,e,c],[a,c,b],[r,b,a],[s,c,e]])emit(...face);
  const vertices=[a,b,c,e,r,s];
  selectionAabbs.push({min:[Math.min(...vertices.map(v=>v[0]))-.003,0,Math.min(...vertices.map(v=>v[2]))-.003],max:[Math.max(...vertices.map(v=>v[0]))+.003,height+.003,Math.max(...vertices.map(v=>v[2]))+.003]});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>60)throw new Error('cave rubble triangle cap');
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:60,lodTriangles:[60,30,12]},
  integrationStatus:'source-candidate-only'});
}
export function validateCaveRubbleCluster(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid cave rubble');
 const expected=makeCaveRubbleCluster({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const key of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[key])!==JSON.stringify(expected[key]))throw new TypeError('noncanonical cave rubble '+key);
 return true;
}
