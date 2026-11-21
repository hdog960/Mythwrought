// :24 original frost-fern candidate; opt-in, never production spawned.
export const FROST_FERN_SCENE_ID='nonblock:d:frost-fern';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeFrostFern({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid frost fern identity');
 const sceneId=FROST_FERN_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],materials=[];
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const arms=4+variant%2,height=.36+variant*.055,spread=.29+variant*.035;
 for(let arm=0;arm<arms;arm++){
  const angle=arm*Math.PI*2/arms+(h%97)/97,dx=Math.cos(angle),dz=Math.sin(angle);
  const reach=spread*(.91+.07*(arm%3));
  const center=t=>[dx*reach*t,height*t*(1.38-.38*t),dz*reach*t];
  const edge=([x,y,z],offset)=>[x-dz*offset,y,z+dx*offset];
  for(let i=0;i<3;i++){
   const a=center(i/3),b=center((i+1)/3),wide=.014-i*.003;
   triangle(edge(a,-wide),edge(a,wide),edge(b,wide*.60),0);
   triangle(edge(a,-wide),edge(b,wide*.60),edge(b,-wide*.60),0);
   const root=center((i+.56)/3),baseWidth=.119-i*.025;
   for(const side of [-1,1]){
    const [x,y,z]=root,width=baseWidth*side;
    const crest=[x-dz*width*.54+dx*.034,y+.031,z+dx*width*.54+dz*.034];
    const outer=[x-dz*width+dx*.026,y+.012,z+dx*width+dz*.026];
    const trail=[x+dx*(.103-i*.014),y+.050,z+dz*(.103-i*.014)];
    triangle(root,outer,crest,1);
    triangle(root,crest,trail,2);
   }
  }
 }
 const radius=spread+.15,maxY=height+.075;
 const descriptor={contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount:positions.length/9},
  selectionAabbs:[{min:[-radius,0,-radius],max:[radius,maxY,radius]}],collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',
  render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:256,maxTrianglesPerInstance:96,lodTriangles:[96,36,12]},
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
