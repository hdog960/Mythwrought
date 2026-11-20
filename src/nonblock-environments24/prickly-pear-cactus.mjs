// :24 D prickly pear: independent polygonal pads, no cube IDs or world writes.
export const PRICKLY_PEAR_SCENE_ID='nonblock:d:prickly-pear-cactus';
const valid=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makePricklyPear({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!valid(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid prickly pear identity');
 const sceneId=PRICKLY_PEAR_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const phase=hash(instanceKey)/4294967296*Math.PI*2,positions=[],selectionAabbs=[];
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 const pads=2+variant;
 for(let i=0;i<pads;i++){
  const angle=phase+i*2.399963229728653,dx=Math.cos(angle),dz=Math.sin(angle),sx=-dz,sz=dx;
  const height=.28+i*.20,center=[dx*(i? .16+.07*i:0),height,dz*(i? .16+.07*i:0)];
  const width=.18-.012*(i%2),radiusY=.23-.014*(i%3),thickness=.045;
  const front=[],back=[];
  for(let j=0;j<8;j++){
   const t=j*Math.PI/4;
   const x=center[0]+sx*Math.cos(t)*width,y=center[1]+Math.sin(t)*radiusY,z=center[2]+sz*Math.cos(t)*width;
   front.push([x+dx*thickness,y,z+dz*thickness]);
   back.push([x-dx*thickness,y,z-dz*thickness]);
  }
  const cf=[center[0]+dx*thickness,center[1],center[2]+dz*thickness];
  const cb=[center[0]-dx*thickness,center[1],center[2]-dz*thickness];
  for(let j=0;j<8;j++){const n=(j+1)%8;tri(cf,front[j],front[n]);tri(cb,back[n],back[j]);tri(front[j],back[j],front[n]);tri(front[n],back[j],back[n]);}
  const all=[...front,...back];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...all.map(v=>v[k]))-.003),max:[0,1,2].map(k=>Math.max(...all.map(v=>v[k]))+.003)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>160)throw new RangeError('prickly pear budget exceeded');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'solid',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:160,lodTriangles:[160,80,24]},
  integrationStatus:'source-candidate-only'};
}
export function validatePricklyPear(o){
 if(!o||!valid(o.anchor))throw new TypeError('invalid prickly pear');
 const canonical=makePricklyPear({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(o[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical prickly pear '+k);
 return true;
}
