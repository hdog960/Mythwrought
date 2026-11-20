// :24 desert bloom: original opt-in ground flower, never production spawned.
export const DESERT_BLOOM_SCENE_ID='nonblock:d:desert-bloom';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeDesertBloom({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid desert bloom identity');
 const sceneId=DESERT_BLOOM_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],h=hash(instanceKey),petals=5+variant,theta=(h%360)*Math.PI/180;
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const height=.19+.035*variant,r=.116+.017*variant,turn=Math.PI*2;
 const point=(angle,radius,y)=>[Math.cos(angle)*radius,y,Math.sin(angle)*radius];
 const lower=Array.from({length:4},(_,i)=>point(theta+i*turn/4,.021,0));
 const upper=Array.from({length:4},(_,i)=>point(theta+i*turn/4,.026,height));
 for(let i=0;i<4;i++){
  const j=(i+1)%4;
  triangle(lower[i],lower[j],upper[j],0);
  triangle(lower[i],upper[j],upper[i],0);
 }
 for(let i=0;i<petals;i++){
  const angle=theta+i*turn/petals,dx=Math.cos(angle),dz=Math.sin(angle);
  const reach=r*(.95+.09*Math.sin(i*2.3+variant));
  const throat=point(angle,.021,height+.006),ridge=point(angle,reach*.55,height+.044);
  const left=[dx*reach*.57-dz*.041,height+.017,dz*reach*.57+dx*.041];
  const right=[dx*reach*.61+dz*.033,height+.014,dz*reach*.61-dx*.033];
  const tip=point(angle,reach,height+.025+(i%2)*.008);
  triangle(throat,left,ridge,1);
  triangle(throat,ridge,right,2);
  triangle(left,tip,right,1);
 }
 for(let i=0;i<6;i++){
  triangle([0,height+.027,0],point(theta+i*turn/6,.034,height+.009),
   point(theta+(i+1)*turn/6,.034,height+.009),3);
 }
 for(let i=0;i<3;i++){
  const angle=theta+.38+i*turn/3,reach=.14+variant*.005,root=[0,.046,0];
  const left=point(angle-.40,reach*.64,.034),right=point(angle+.38,reach*.66,.036);
  const tip=point(angle,reach,.072),ridge=point(angle,reach*.52,.076);
  triangle(root,left,ridge,0);
  triangle(root,ridge,right,0);
  triangle(left,tip,right,0);
 }
 const radius=Math.max(.18+variant*.005,r+.04);
 const selectionAabbs=[{min:[-radius,0,-radius],max:[radius,height+.06,radius]}];
 const triangleCount=positions.length/9;
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:256,maxTrianglesPerInstance:48,lodTriangles:[48,24,12]},
  integrationStatus:'source-candidate-only'});
}
export function validateDesertBloom(o){
 if(!o||!safe(o.anchor))throw new TypeError('invalid desert bloom');
 const expected=makeDesertBloom({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const key of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[key])!==JSON.stringify(expected[key]))throw new TypeError('noncanonical desert bloom '+key);
 return true;
}
