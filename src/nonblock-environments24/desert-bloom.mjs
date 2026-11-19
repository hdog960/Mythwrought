// :24 desert bloom: original opt-in ground flower, never production spawned.
export const DESERT_BLOOM_SCENE_ID='nonblock:d:desert-bloom';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const triangle=(out,a,b,c)=>out.push(...a,...b,...c);
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
export function makeDesertBloom({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid desert bloom identity');
 const sceneId=DESERT_BLOOM_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],h=hash(instanceKey),petals=5+variant,theta=(h%360)*Math.PI/180;
 const height=.19+.035*variant,core=[0,height,0],r=.105+.013*variant;
 // Tapered four-sided succulent stalk, not a cubic block.
 const stem=[[ -.018,0,-.014],[.018,0,-.014],[.018,0,.014],[-.018,0,.014]];
 for(let k=0;k<4;k++)triangle(positions,stem[k],stem[(k+1)%4],core);
 // Thick diamond-shaped petals: raised outer tips and folded midribs.
 for(let k=0;k<petals;k++){
  const a=theta+k*2*Math.PI/petals,dx=Math.cos(a),dz=Math.sin(a),nx=-dz,nz=dx;
  const inner=[dx*.018,height-.008,dz*.018],ridge=[dx*r*.58,height+.037,dz*r*.58];
  const left=[dx*r*.72+nx*.034,height+.008,dz*r*.72+nz*.034];
  const right=[dx*r*.72-nx*.034,height+.008,dz*r*.72-nz*.034];
  const tip=[dx*r,height+.013,dz*r];
  triangle(positions,inner,left,ridge);triangle(positions,inner,ridge,right);
  triangle(positions,ridge,left,tip);triangle(positions,ridge,tip,right);
 }
 // Three stout, ground-hugging basal leaves with folded triangular profiles.
 for(let k=0;k<3;k++){
  const a=theta+.4+k*2*Math.PI/3,dx=Math.cos(a),dz=Math.sin(a),nx=-dz,nz=dx;
  triangle(positions,[0,.045,0],[dx*.12+nx*.024,.022,dz*.12+nz*.024],[dx*.065,.068,dz*.065]);
  triangle(positions,[0,.045,0],[dx*.065,.068,dz*.065],[dx*.12-nx*.024,.022,dz*.12-nz*.024]);
 }
 const radius=r+.035,selectionAabbs=[{min:[-radius,0,-radius],max:[radius,height+.045,radius]}];
 const triangleCount=positions.length/9;
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
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
