// :24 dwarf juniper: deterministic, non-cubic, opt-in environmental object.
export const DWARF_JUNIPER_SCENE_ID='nonblock:d:dwarf-juniper';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
function triangle(out,a,b,c){out.push(...a,...b,...c);}
export function makeDwarfJuniper({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid dwarf juniper identity');
 const sceneId=DWARF_JUNIPER_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],branches=4+variant;
 let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 const emit=(a,b,c)=>{triangle(positions,a,b,c);for(const p of [a,b,c])for(let i=0;i<3;i++){min[i]=Math.min(min[i],p[i]);max[i]=Math.max(max[i],p[i]);}};
 // Central woody trunk as a tapered three-sided prism, not a cubic block.
 const trunkH=.18+.025*variant,w=.035;
 for(let i=0;i<3;i++){
  const a=i*2*Math.PI/3,b=(i+1)*2*Math.PI/3;
  const lo=[w*Math.cos(a),0,w*Math.sin(a)],ln=[w*Math.cos(b),0,w*Math.sin(b)],hi=[.013*Math.cos(a),trunkH,.013*Math.sin(a)],hn=[.013*Math.cos(b),trunkH,.013*Math.sin(b)];
  emit(lo,ln,hi);emit(ln,hn,hi);
 }
 // Radial woody limbs and individually shaped triangular evergreen sprays.
 for(let i=0;i<branches;i++){
  const theta=(h%6283)/1000+i*2.3999632297,reach=.17+.025*(i%3)+.012*variant;
  const dx=Math.cos(theta),dz=Math.sin(theta),side=[-dz,dx];
  const root=[0,.075+.015*(i%2),0],tip=[dx*reach,.16+.02*(i%3),dz*reach];
  const left=[root[0]+side[0]*.015,root[1],root[2]+side[1]*.015];
  const right=[root[0]-side[0]*.015,root[1],root[2]-side[1]*.015];
  emit(left,right,tip);
  for(let j=0;j<3;j++){
   const t=.35+j*.23,px=tip[0]*t,pz=tip[2]*t,y=root[1]+(tip[1]-root[1])*t;
   const width=.048+.009*(j%2),length=.06;
   const outer=[px+dx*length,y+.018,pz+dz*length];
   const l=[px+side[0]*width,y,pz+side[1]*width],r=[px-side[0]*width,y,pz-side[1]*width];
   emit(l,r,outer);emit(r,l,outer);
  }
 }
 const triangleCount=positions.length/9;
 if(triangleCount>160)throw new Error('juniper triangle budget exceeded');
 const selectionAabbs=[{min:[min[0]-.008,0,min[2]-.008],max:[max[0]+.008,max[1]+.008,max[2]+.008]}];
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:160,lodTriangles:[160,80,24]},
  integrationStatus:'source-candidate-only'});
}
export function validateDwarfJuniper(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid dwarf juniper');
 const expected=makeDwarfJuniper({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const key of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
  if(JSON.stringify(o[key])!==JSON.stringify(expected[key]))throw new TypeError('noncanonical dwarf juniper '+key);
 return true;
}
