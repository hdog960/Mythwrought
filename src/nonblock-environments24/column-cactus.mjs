// :24 D column cactus: tapered hexagonal trunk and offset articulated arms. Source-only.
export const COLUMN_CACTUS_SCENE_ID='nonblock:d:column-cactus';
const anchorOK=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeColumnCactus({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!anchorOK(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid column cactus identity');
 const sceneId=COLUMN_CACTUS_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],selectionAabbs=[],turn=2*Math.PI;
 const phase=hash(instanceKey)/4294967296*turn;
 const tri=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const track=points=>selectionAabbs.push({
  min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.004),
  max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.004)
 });
 function tube(nodes,radii,sides,side){
  const rings=nodes.map((center,index)=>{
   const prior=nodes[Math.max(0,index-1)],next=nodes[Math.min(index+1,nodes.length-1)];
   const [dx,dy,dz]=next.map((value,axis)=>value-prior[axis]);
   const length=Math.hypot(dx,dy,dz);
   const up=[-side[2]*dy/length,(side[2]*dx-side[0]*dz)/length,side[0]*dy/length];
   return Array.from({length:sides},(_,point)=>{
    const angle=point*turn/sides+(sides===12?phase:0);
    const radius=radii[index]*(sides===12&&point%2===0?.83:1);
    return center.map((value,axis)=>value+radius*(Math.cos(angle)*side[axis]+Math.sin(angle)*up[axis]));
   });
  });
  for(let level=0;level<rings.length-1;level++)for(let i=0;i<sides;i++){
   const j=(i+1)%sides,lower=rings[level],upper=rings[level+1];
   const material=i%3===0?2:i%2===0?1:0;
   tri(lower[i],upper[i],lower[j],material);
   tri(lower[j],upper[i],upper[j],material);
  }
  for(let i=0;i<sides;i++){
   const j=(i+1)%sides;
   tri(nodes[0],rings[0][i],rings[0][j],0);
   tri(nodes.at(-1),rings.at(-1)[j],rings.at(-1)[i],3);
  }
  return rings;
 }
 const height=.66+variant*.096;
 track(tube([[0,0,0],[0,height*.71,0],[0,height,0]],[.101,.109,.060],12,[1,0,0]).flat());
 for(let i=0;i<variant+1;i++){
  const heading=phase+i*2.3999632297,dx=Math.cos(heading),dz=Math.sin(heading);
  const y=.236+i*.093;
  const root=[dx*.061,y,dz*.061],elbow=[dx*.207,y+.078,dz*.207];
  const tip=[dx*.229,y+.252+.025*(i%2),dz*.229];
  const rings=tube([root,elbow,tip],[.045,.048,.027],6,[-dz,0,dx]);
  track([...rings[0],...rings[1]]);track([...rings[1],...rings[2]]);
 }
 const triangleCount=positions.length/9;
 if(triangleCount>216)throw new Error('column cactus triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'solid',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:216,lodTriangles:[216,96,24]},
  integrationStatus:'source-candidate-only'};
}
export function validateColumnCactus(o){
 if(!o||!anchorOK(o.anchor))throw new TypeError('invalid column cactus');
 const expected=makeColumnCactus({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical column cactus '+k);
 return true;
}
