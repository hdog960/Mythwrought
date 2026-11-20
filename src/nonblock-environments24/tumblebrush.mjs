// :24 original tumblebrush: bounded interwoven triangular twigs, no automatic spawn.
export const TUMBLEBRUSH_SCENE_ID='nonblock:d:tumblebrush';
const valid=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makeTumblebrush({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!valid(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid tumblebrush identity');
 const sceneId=TUMBLEBRUSH_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const phase=hash(instanceKey)/4294967296*Math.PI*2,positions=[],selectionAabbs=[];
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 const count=7+variant,r=.21+variant*.026,centerY=r+.015;
 for(let i=0;i<count;i++){
  const az=phase+i*2.399963229728653,el=-.7+1.4*((i*3)%count)/(count-1);
  const dir=[Math.cos(az)*Math.cos(el),Math.sin(el),Math.sin(az)*Math.cos(el)];
  const side=[-Math.sin(az),0,Math.cos(az)],other=[-dir[1]*side[2],dir[2]*side[0]-dir[0]*side[2],dir[0]*side[1]];
  const start=[dir[0]*r*.14,centerY+dir[1]*r*.14,dir[2]*r*.14];
  const end=[dir[0]*r,centerY+dir[1]*r,dir[2]*r];
  const width=.012;
  const a=start.map((v,k)=>v+side[k]*width),b=start.map((v,k)=>v-side[k]*width),c=end.map((v,k)=>v+other[k]*width),d=end.map((v,k)=>v-other[k]*width);
  tri(a,b,c);tri(b,d,c);tri(a,c,d);tri(a,d,b);
  const all=[a,b,c,d];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...all.map(p=>p[k]))-.003),max:[0,1,2].map(k=>Math.max(...all.map(p=>p[k]))+.003)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>40)throw new RangeError('tumblebrush triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:40,lodTriangles:[40,20,8]},
  integrationStatus:'source-candidate-only'};
}
export function validateTumblebrush(o){
 if(!o||!valid(o.anchor))throw new TypeError('invalid tumblebrush');
 const canonical=makeTumblebrush({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(o[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical tumblebrush '+k);
 return true;
}
