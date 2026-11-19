// :24 D desert scrub. Source-only opt-in shaped object; no world spawning.
export const DESERT_SCRUB_SCENE_ID='nonblock:d:desert-scrub';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeDesertScrub({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid desert scrub identity');
 const sceneId=DESERT_SCRUB_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],selectionAabbs=[],count=5+variant*2,phase=hash(instanceKey)/4294967296*Math.PI*2;
 const emit=(a,b,c)=>positions.push(...a,...b,...c);
 for(let i=0;i<count;i++){
  const angle=phase+i*2.399963229728653,reach=.16+.027*((i+variant)%4),height=.20+.035*((i*3+variant)%4);
  const x=Math.cos(angle),z=Math.sin(angle),base=[x*.018,.025,z*.018],tip=[x*reach,height,z*reach],side=[-z*.014,0,x*.014];
  const left=[base[0]+side[0],base[1],base[2]+side[2]],right=[base[0]-side[0],base[1],base[2]-side[2]];
  const mid=[x*reach*.65,height*.72,z*reach*.65];
  emit(left,right,mid);emit(left,mid,tip);emit(right,tip,mid);
  const leafA=[x*reach*.70-z*.052,height*.70,z*reach*.70+x*.052],leafB=[x*reach*.70+z*.052,height*.70,z*reach*.70-x*.052];
  emit(mid,leafA,tip);emit(mid,tip,leafB);
  const verts=[left,right,mid,tip,leafA,leafB];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...verts.map(v=>v[k]))-.004),max:[0,1,2].map(k=>Math.max(...verts.map(v=>v[k]))+.004)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>55)throw new Error('scrub triangle cap');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:55,lodTriangles:[55,30,15]},
  integrationStatus:'source-candidate-only'};
}
export function validateDesertScrub(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid desert scrub');
 const canonical=makeDesertScrub({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(o[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical desert scrub '+k);
 return true;
}
