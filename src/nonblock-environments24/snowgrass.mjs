// :24-owned original snowgrass source candidate. Opt-in only; no live registration.
// Independent D-family geometry, pending coordinator v1 registration and :00 adapter.
export const SNOWGRASS_SCENE_ID='nonblock:d:snowgrass';
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),16777619);}return h>>>0;};
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
export function makeSnowgrass({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)
  throw new TypeError('snowgrass requires safe seed, integer anchor, variant 0..3');
 const sceneId=SNOWGRASS_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],materials=[];
 const emit=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const count=7+variant*2,turn=2*Math.PI;
 const phase=h/4294967296*turn,wind=[Math.cos(phase),Math.sin(phase)];
 for(let i=0;i<count;i++){
  const heading=phase+i*2.3999632297,dx=Math.cos(heading),dz=Math.sin(heading);
  const spread=.12+((h+i*31)%19)/155;
  const height=.211+((h>>>((i%4)*6))%17)*.009+variant*.027;
  const width=.021+((i+h)%5)*.003;
  const point=(reach,y,side,drift=0)=>[
   dx*reach-dz*side+wind[0]*drift,y,dz*reach+dx*side+wind[1]*drift
  ];
  const root=point(.026,0,0),a=point(.023,0,-width*.67),b=point(.023,0,width*.67);
  const ridge=point(spread*.36,height*.54,0,.029);
  const left=point(spread*.49,height*.47,-width,.025),right=point(spread*.49,height*.48,width,.026);
  const tip=point(spread,height,0,.083);
  emit(root,a,ridge,0);emit(a,left,ridge,1);
  emit(root,ridge,b,0);emit(ridge,right,b,1);
  emit(left,tip,ridge,i%3===0?3:2);emit(ridge,tip,right,i%3===1?3:1);
 }
 const axes=[0,1,2].map(axis=>positions.filter((_,index)=>index%3===axis));
 const min=axes.map(values=>Math.min(...values)),max=axes.map(values=>Math.max(...values));
 return Object.freeze({
  contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:Object.freeze({primitive:'triangles',positions:Object.freeze(positions),materials:Object.freeze(materials),triangleCount:positions.length/9}),
  selectionAabbs:[{min,max}],collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:512,maxTrianglesPerInstance:78,lodTriangles:[78,28,12]},
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
    JSON.stringify(o.mesh.materials)!==JSON.stringify(expected.mesh.materials)||
    JSON.stringify(o.selectionAabbs)!==JSON.stringify(expected.selectionAabbs))
  throw new TypeError('noncanonical snowgrass descriptor');
 return true;
}
