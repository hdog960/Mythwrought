// :24 original alpine wildflower, source-only candidate; no production registration.
export const ALPINE_WILDFLOWER_SCENE_ID='nonblock:d:alpine-wildflower';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const tri=(p,a,b,c)=>p.push(...a,...b,...c);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeAlpineWildflower({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid alpine wildflower identity');
 const sceneId=ALPINE_WILDFLOWER_SCENE_ID;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[];
 const stems=2+variant,angle0=(h%360)*Math.PI/180;
 let radius=0,top=0;
 for(let s=0;s<stems;s++){
  const theta=angle0+s*2.3999632297,ox=Math.cos(theta)*(.045+.018*s),oz=Math.sin(theta)*(.045+.018*s);
  const height=.31+.035*s+.025*variant;
  const cx=ox+.035*Math.cos(theta),cz=oz+.035*Math.sin(theta);
  // Three-sided tapered stem, six nondegenerate triangles.
  const w=.009,base=[[ox-w,0,oz-w],[ox+w,0,oz-w],[ox,.0,oz+w]];
  const apex=[cx,height,cz];
  for(let k=0;k<3;k++)tri(positions,base[k],base[(k+1)%3],apex);
  const petals=5+(s%2),flowerY=height-.018;
  for(let p=0;p<petals;p++){
   const a=theta+p*2*Math.PI/petals,dx=Math.cos(a),dz=Math.sin(a),nx=-dz,nz=dx;
   const length=.065+.008*variant,width=.025;
   const inner=[cx,flowerY,cz],left=[cx+dx*length+nx*width,flowerY+.022,cz+dz*length+nz*width];
   const right=[cx+dx*length-nx*width,flowerY+.022,cz+dz*length-nz*width];
   tri(positions,inner,left,right);tri(positions,inner,right,left);
   radius=Math.max(radius,Math.hypot(cx,cz)+length+width);
  }
  // Low lanceolate leaves: two triangular faces per leaf.
  for(const side of [-1,1]){
   const dx=Math.cos(theta+side*1.15),dz=Math.sin(theta+side*1.15);
   const a=[ox,height*.32,oz],b=[ox+dx*.095,height*.22,oz+dz*.095],c=[ox+dx*.035,height*.48,oz+dz*.035];
   tri(positions,a,b,c);tri(positions,a,c,b);
   radius=Math.max(radius,Math.hypot(ox,oz)+.1);
  }
  top=Math.max(top,height+.025);
 }
 const selectionAabbs=[{min:[-radius-.005,0,-radius-.005],max:[radius+.005,top+.005,radius+.005]}];
 const triangleCount=positions.length/9;
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:256,maxTrianglesPerInstance:112,lodTriangles:[112,56,20]},
  integrationStatus:'source-candidate-only'});
}
export function validateAlpineWildflower(o){
 if(!o||!safe(o.anchor))throw new TypeError('invalid alpine wildflower');
 const e=makeAlpineWildflower({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const field of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[field])!==JSON.stringify(e[field]))throw new TypeError('noncanonical alpine wildflower '+field);
 return true;
}
