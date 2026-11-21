// :24 original alpine wildflower, source-only candidate; no production registration.
export const ALPINE_WILDFLOWER_SCENE_ID='nonblock:d:alpine-wildflower';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeAlpineWildflower({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid alpine wildflower identity');
 const sceneId=ALPINE_WILDFLOWER_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],materials=[],turn=2*Math.PI;
 const tri=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const stems=2+variant,phase=h/4294967296*turn;
 for(let index=0;index<stems;index++){
  const theta=phase+index*2.3999632297,dx=Math.cos(theta),dz=Math.sin(theta);
  const ox=dx*(.040+.017*index),oz=dz*(.040+.017*index);
  const height=.31+.03*index+.025*variant,drift=.041+.006*(index%2);
  const cx=ox+dx*drift,cz=oz+dz*drift;
  const ring=(x,y,z,radius,edges)=>Array.from({length:edges},(_,i)=>{
   const angle=theta+i*turn/edges;
   return [x+radius*Math.cos(angle),y,z+radius*Math.sin(angle)];
  });
  const foot=ring(ox,0,oz,.012,3),crown=ring(cx,height,cz,.007,3);
  for(let i=0;i<3;i++){
   const j=(i+1)%3;
   tri(foot[i],crown[i],foot[j],0);tri(foot[j],crown[i],crown[j],0);
  }
  tri(...foot,0);tri(...crown.slice().reverse(),0);
  for(const direction of [-1,1]){
   const angle=theta+direction*1.12,lx=Math.cos(angle),lz=Math.sin(angle);
   const root=[ox+dx*drift*.31,height*.31,oz+dz*drift*.31];
   const point=(reach,y,w)=>[root[0]+lx*reach-lz*w,root[1]+y,root[2]+lz*reach+lx*w];
   const shoulder=point(.067,.03,.021),ridge=point(.047,.067,0),tip=point(.113,.064,-.002);
   tri(root,shoulder,ridge,0);tri(shoulder,tip,ridge,0);
  }
  const heart=ring(cx,height+.009,cz,.021,5),center=[cx,height+.028,cz];
  for(let petal=0;petal<5;petal++){
   const angle=theta+(petal+.5)*turn/5,px=Math.cos(angle),pz=Math.sin(angle);
   const reach=.078+.008*variant+(petal%2)*.006,w=.025+.004*variant;
   const point=(distance,y,side)=>[cx+px*distance-pz*side,height+y,cz+pz*distance+px*side];
   const left=point(reach*.73,.023,w),right=point(reach*.71,.019,-w);
   const tip=point(reach,.039+(petal%3)*.004,0),fold=point(reach*.49,.013,.003);
   const next=(petal+1)%5;
   tri(heart[petal],center,heart[next],3);
   tri(heart[petal],fold,right,1);tri(heart[next],left,fold,1);
   tri(left,tip,fold,2);tri(fold,tip,right,petal%2===0?2:1);
  }
 }
 const axes=[0,1,2].map(axis=>positions.filter((_,index)=>index%3===axis));
 const selectionAabbs=[{min:axes.map(values=>Math.min(...values)),max:axes.map(values=>Math.max(...values))}];
 const triangleCount=positions.length/9;
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:256,maxTrianglesPerInstance:185,lodTriangles:[185,70,20]},
  integrationStatus:'source-candidate-only'});
}
export function validateAlpineWildflower(o){
 if(!o||!safe(o.anchor))throw new TypeError('invalid alpine wildflower');
 const e=makeAlpineWildflower({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const field of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[field])!==JSON.stringify(e[field]))throw new TypeError('noncanonical alpine wildflower '+field);
 return true;
}
