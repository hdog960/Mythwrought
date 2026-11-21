// :24 dwarf juniper: deterministic, non-cubic, opt-in environmental object.
export const DWARF_JUNIPER_SCENE_ID='nonblock:d:dwarf-juniper';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const turn=2*Math.PI;

function ring(center,radius,u,v){
 return Array.from({length:3},(_,index)=>{
  const angle=index*turn/3;
  return center.map((value,axis)=>value+radius*(Math.cos(angle)*u[axis]+Math.sin(angle)*v[axis]));
 });
}

function branchTube(lower,upper,emit){
 for(let index=0;index<3;index++){
  const next=(index+1)%3;
  emit(lower[index],upper[index],lower[next],0);
  emit(lower[next],upper[index],upper[next],0);
 }
 emit(...lower,0);
 emit(...upper.slice().reverse(),0);
}

function evergreenSpray(base,tip,side,width,depth,emit){
 const center=base.map((value,axis)=>.44*value+.56*tip[axis]);
 const shoulders=ring(center,1,side.map(value=>value*width),[0,depth,0]);
 for(let edge=0;edge<3;edge++){
  const next=(edge+1)%3;
  emit(base,shoulders[edge],shoulders[next],edge===0?2:1);
  emit(tip,shoulders[next],shoulders[edge],edge===0?3:2);
 }
}

export function makeDwarfJuniper({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid dwarf juniper identity');
 const sceneId=DWARF_JUNIPER_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],branchCount=4+variant,phase=hash(instanceKey)/4294967296*turn;
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 const emit=(a,b,c,material)=>{
  positions.push(...a,...b,...c);
  materials.push(material);
  for(const point of [a,b,c])for(let axis=0;axis<3;axis++){
   min[axis]=Math.min(min[axis],point[axis]);
   max[axis]=Math.max(max[axis],point[axis]);
  }
 };
 const trunkHeight=.18+.023*variant;
 branchTube(ring([0,0,0],.038,[1,0,0],[0,0,1]),
  ring([.012,trunkHeight,-.009],.014,[1,0,0],[0,0,1]),emit);
 for(let branch=0;branch<branchCount;branch++){
  const heading=phase+branch*2.3999632297;
  const dx=Math.cos(heading),dz=Math.sin(heading),side=[-dz,0,dx],up=[0,1,0];
  const reach=.163+.029*(branch%3)+.012*variant;
  const root=[.005,.072+.018*(branch%4),-.003];
  const shoulder=[dx*reach*.69,root[1]+.039+.019*(branch%3),dz*reach*.69];
  branchTube(ring(root,.015,side,up),ring(shoulder,.006,side,up),emit);
  const crown=[dx*(reach+.033),shoulder[1]+.056,dz*(reach+.033)];
  evergreenSpray(root.map((value,axis)=>(value+shoulder[axis])*.5),crown,side,.059,.027,emit);
  const sweep=(branch%2===0?1:-1)*(.07+.009*(variant%2));
  const tip=[crown[0]-side[0]*sweep,crown[1]+.031,crown[2]-side[2]*sweep];
  evergreenSpray(shoulder,tip,side,.048,.028,emit);
 }
 const triangleCount=positions.length/9;
 if(triangleCount>160)throw new Error('juniper triangle budget exceeded');
 const selectionAabbs=[{min:[min[0]-.008,0,min[2]-.008],max:[max[0]+.008,max[1]+.008,max[2]+.008]}];
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
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
