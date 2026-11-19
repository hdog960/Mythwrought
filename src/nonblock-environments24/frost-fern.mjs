// :24 original frost-fern candidate; opt-in, never production spawned.
export const FROST_FERN_SCENE_ID='nonblock:d:frost-fern';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const triangle=(p,a,b,c)=>p.push(...a,...b,...c);
export function makeFrostFern({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid frost fern identity');
 const sceneId=FROST_FERN_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[];
 // Six radial fronds, each with four pairs of serrated leaflets and a narrow spine.
 // Geometry is genuinely triangular, not billboarded or cubic.
 const arms=5+variant, height=.36+variant*.055, spread=.29+variant*.035;
 for(let arm=0;arm<arms;arm++){
  const angle=arm*Math.PI*2/arms+(h%97)/97,dx=Math.cos(angle),dz=Math.sin(angle),nx=-dz,nz=dx;
  const start=[0,.025,0],tip=[dx*spread,height,dz*spread];
  triangle(positions,[nx*.012,.025,nz*.012],[-nx*.012,.025,-nz*.012],tip);
  for(let j=1;j<=4;j++){
   const t=j/5,base=[dx*spread*t,height*t,dz*spread*t];
   for(const sign of [-1,1]){
    const outer=[base[0]+nx*sign*(.12*(1-t)),base[1]+.035*(1-t),base[2]+nz*sign*(.12*(1-t))];
    const next=[dx*spread*(t+.13),height*(t+.13),dz*spread*(t+.13)];
    triangle(positions,base,outer,next);
   }
  }
 }
 const radius=spread+.12,maxY=height+.035;
 const descriptor={contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount:positions.length/9},
  selectionAabbs:[{min:[-radius,0,-radius],max:[radius,maxY,radius]}],collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:256,maxTrianglesPerInstance:72,lodTriangles:[72,36,12]},
  integrationStatus:'source-candidate-only'};
 return Object.freeze(descriptor);
}
export function validateFrostFern(o){
 if(!o||!safe(o.anchor))throw new TypeError('invalid frost fern');
 const e=makeFrostFern({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const field of ['sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render'])
  if(JSON.stringify(o[field])!==JSON.stringify(e[field]))throw new TypeError('noncanonical frost fern '+field);
 return true;
}
