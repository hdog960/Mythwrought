// :24-owned original snowgrass source candidate. Opt-in only; no live registration.
// Independent D-family geometry, pending coordinator v1 registration and :00 adapter.
export const SNOWGRASS_SCENE_ID='nonblock:d:snowgrass';
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),16777619);}return h>>>0;};
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const tri=(p,a,b,c)=>p.push(...a,...b,...c);
export function makeSnowgrass({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)
  throw new TypeError('snowgrass requires safe seed, integer anchor, variant 0..3');
 const sceneId=SNOWGRASS_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[];
 // Narrow, wind-bent, double-sided tapered leaves with distinct deterministic
 // offsets. No per-blade draw calls: one family mesh per instance.
 const count=7+variant*2;
 let radius=0,top=0;
 for(let i=0;i<count;i++){
  const phase=(i/count)*Math.PI*2+((h>>>8)%127)/127;
  const spread=.14+((h+i*31)%19)/150;
  const height=.26+((h>>>((i%4)*6))%17)/100+variant*.035;
  const width=.016+((i+h)%5)*.003;
  const dx=Math.cos(phase),dz=Math.sin(phase),nx=-dz*width,nz=dx*width;
  const tip=[dx*spread,height,dz*spread];
  const a=[nx,0,nz],b=[-nx,0,-nz];
  tri(positions,a,b,tip);tri(positions,b,a,tip);
  radius=Math.max(radius,spread+width);top=Math.max(top,height);
 }
 const min=[-radius,0,-radius],max=[radius,top,radius];
 return Object.freeze({
  contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:Object.freeze({primitive:'triangles',positions:Object.freeze(positions),triangleCount:positions.length/9}),
  selectionAabbs:[{min,max}],collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:512,maxTrianglesPerInstance:32,lodTriangles:[32,16,8]},
  integrationStatus:'source-candidate-only'
 });
}
export function validateSnowgrass(o){
 if(!o||o.sceneId!==SNOWGRASS_SCENE_ID||!safe(o.anchor))throw new TypeError('invalid snowgrass');
 const expected=makeSnowgrass({seed:o.seed,anchor:o.anchor,variant:o.variant});
 if(o.instanceKey!==expected.instanceKey||o.breakIntent?.targetKey!==expected.instanceKey||
    o.persistence?.key!==expected.instanceKey||o.attachment?.face!=='ground'||
    o.collisionIntent!=='pass-through'||o.spawn!=='explicit-opt-in-only'||
    o.mesh?.triangleCount!==expected.mesh.triangleCount||
    !Array.isArray(o.mesh?.positions)||o.mesh.positions.length!==expected.mesh.positions.length||
    o.mesh.positions.some((n,i)=>n!==expected.mesh.positions[i])||
    JSON.stringify(o.selectionAabbs)!==JSON.stringify(expected.selectionAabbs))
  throw new TypeError('noncanonical snowgrass descriptor');
 return true;
}
