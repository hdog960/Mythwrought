// :24-only geode opening: a hollow faceted rim with inward crystal teeth; opt-in only.
export const GEODE_OPENING_SCENE_ID='nonblock:e:geode-opening';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeGeodeOpening({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid geode identity');
 const sceneId=GEODE_OPENING_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],selectionAabbs=[],segments=8+variant*2,outer=.36+variant*.045,inner=outer*.55,depth=.14+variant*.025;
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 for(let i=0;i<segments;i++){
  const a=i*2*Math.PI/segments,b=(i+1)*2*Math.PI/segments;
  const ring=(r,t,y)=>[Math.cos(t)*r,y,Math.sin(t)*r];
  const o1=ring(outer,a,0),o2=ring(outer,b,0),i1=ring(inner,a,0),i2=ring(inner,b,0);
  const back1=ring(outer*.9,a,-depth),back2=ring(outer*.9,b,-depth);
  tri(o1,o2,i1);tri(i1,o2,i2);tri(o1,back1,o2);tri(o2,back1,back2);
  const tooth=ring(inner*.38,(a+b)/2,-depth*.75-((h+i*13)%5)*.008);
  tri(i1,i2,tooth);tri(i2,i1,tooth);
  const points=[o1,o2,i1,i2,back1,back2,tooth];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...points.map(p=>p[k]))-.003),max:[0,1,2].map(k=>Math.max(...points.map(p=>p[k]))+.003)});
 }
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
 mesh:{primitive:'triangles',positions,triangleCount:positions.length/9},selectionAabbs,collisionIntent:'solid',
 attachment:{face:'wall',requiresSolid:true,requiresClear:true,supportOffset:[0,0,-1],rejectEditedSupport:true},
 breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
 persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
 spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:84,lodTriangles:[84,42,18]},
 integrationStatus:'source-candidate-only'});
}
export function validateGeodeOpening(o){
 if(!o||o.sceneId!==GEODE_OPENING_SCENE_ID||!safe(o.anchor))throw new TypeError('invalid geode');
 const x=makeGeodeOpening({seed:o.seed,anchor:o.anchor,variant:o.variant});
 if(o.instanceKey!==x.instanceKey||o.breakIntent?.targetKey!==x.instanceKey||o.persistence?.key!==x.instanceKey||
 o.attachment?.face!=='wall'||o.attachment?.rejectEditedSupport!==true||o.collisionIntent!=='solid'||
 o.spawn!=='explicit-opt-in-only'||o.mesh?.triangleCount!==x.mesh.triangleCount||
 JSON.stringify(o.mesh?.positions)!==JSON.stringify(x.mesh.positions)||
 JSON.stringify(o.selectionAabbs)!==JSON.stringify(x.selectionAabbs))throw new TypeError('noncanonical geode');
 return true;
}
