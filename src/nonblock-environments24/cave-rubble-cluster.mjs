// :24 E cave rubble: isolated opt-in fractured mesh fragments, no terrain edits.
export const CAVE_RUBBLE_SCENE_ID='nonblock:e:cave-rubble-cluster';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makeCaveRubbleCluster({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid cave rubble identity');
 const sceneId=CAVE_RUBBLE_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],selectionAabbs=[],count=3+variant;
 const phase=hash(instanceKey)/4294967296*2*Math.PI;
 const emit=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const outline=[[-1,-.65],[.18,-.96],[.88,-.46],[.71,.68],[-.74,.91]];
 for(let part=0;part<count;part++){
  const angle=phase+part*2.3999632297,offset=.04+.073*(part%3);
  const x=Math.cos(angle)*offset,z=Math.sin(angle)*offset;
  const yaw=angle+.41,ux=Math.cos(yaw),uz=Math.sin(yaw);
  const w=.052+.017*((part+variant)%3),d=.039+.012*((part+2*variant)%3);
  const height=part===0?.133+.018*variant:.061+.021*((part+variant)%3);
  const point=(u,v,y)=>[x+ux*u-uz*v,y,z+uz*u+ux*v];
  const foot=outline.map(([u,v])=>point(u*w,v*d,0));
  const ridge=outline.map(([u,v],edge)=>point(u*w*.82+w*.12,v*d*.75-d*.13,
   height*([.65,1,.85,.70,.44][(edge+part)%5])));
  for(let edge=0;edge<5;edge++){
   const next=(edge+1)%5,tag=(edge+part)%4===0?2:1;
   emit(foot[edge],ridge[edge],foot[next],tag);
   emit(foot[next],ridge[edge],ridge[next],edge%2===0?tag:0);
  }
  for(let edge=1;edge<4;edge++){
   emit(foot[0],foot[edge],foot[edge+1],0);
   emit(ridge[0],ridge[edge+1],ridge[edge],edge===2?3:2);
  }
  const points=[...foot,...ridge];
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>96)throw new Error('cave rubble triangle cap');
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:96,lodTriangles:[96,40,12]},
  integrationStatus:'source-candidate-only'});
}
export function validateCaveRubbleCluster(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid cave rubble');
 const expected=makeCaveRubbleCluster({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const key of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[key])!==JSON.stringify(expected[key]))throw new TypeError('noncanonical cave rubble '+key);
 return true;
}
