// :24 D column cactus: tapered hexagonal trunk and offset articulated arms. Source-only.
export const COLUMN_CACTUS_SCENE_ID='nonblock:d:column-cactus';
const anchorOK=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeColumnCactus({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!anchorOK(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid column cactus identity');
 const sceneId=COLUMN_CACTUS_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],selectionAabbs=[],phase=hash(instanceKey)/4294967296*Math.PI*2;
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 function column(base,top,r0,r1){
  const bottom=[],upper=[];
  for(let i=0;i<6;i++){const a=phase+i*Math.PI/3;bottom.push([base[0]+r0*Math.cos(a),base[1],base[2]+r0*Math.sin(a)]);upper.push([top[0]+r1*Math.cos(a),top[1],top[2]+r1*Math.sin(a)]);}
  for(let i=0;i<6;i++){const j=(i+1)%6;tri(bottom[i],bottom[j],upper[j]);tri(bottom[i],upper[j],upper[i]);tri(top,upper[i],upper[j]);}
  const verts=[...bottom,...upper,top];selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...verts.map(v=>v[k]))-.004),max:[0,1,2].map(k=>Math.max(...verts.map(v=>v[k]))+.004)});
 }
 const height=.62+variant*.105;
 column([0,.015,0],[0,height,0],.105,.071);
 for(let i=0;i<variant+1;i++){
  const a=phase+i*2.399963229728653,dx=Math.cos(a),dz=Math.sin(a),y=.25+i*.095;
  const elbow=[dx*.205,y+.055,dz*.205],tip=[dx*.215,y+.25+.035*(i%2),dz*.215];
  column([dx*.08,y,dz*.08],elbow,.048,.045);
  column(elbow,tip,.045,.028);
 }
 const triangleCount=positions.length/9;
 if(triangleCount>162)throw new Error('column cactus triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'solid',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:162,lodTriangles:[162,72,24]},
  integrationStatus:'source-candidate-only'};
}
export function validateColumnCactus(o){
 if(!o||!anchorOK(o.anchor))throw new TypeError('invalid column cactus');
 const expected=makeColumnCactus({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical column cactus '+k);
 return true;
}
