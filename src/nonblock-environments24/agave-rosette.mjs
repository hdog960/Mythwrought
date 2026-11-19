// :24 D agave: thick folded radial succulent blades, never a cubic material.
export const AGAVE_SCENE_ID='nonblock:d:agave-rosette';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeAgaveRosette({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid agave identity');
 const sceneId=AGAVE_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const phase=hash(instanceKey)/4294967296*Math.PI*2,positions=[],selectionAabbs=[];
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 const count=6+variant*2;
 for(let i=0;i<count;i++){
  const angle=phase+i*Math.PI*2/count,rad=[Math.cos(angle),Math.sin(angle)],side=[-rad[1],rad[0]];
  const length=.30+variant*.055+.025*(i%3),width=.068+.007*(i%2);
  const point=(r,y,s)=>[rad[0]*r+side[0]*s,y,rad[1]*r+side[1]*s];
  const left=point(.045,.075,-width),right=point(.045,.075,width);
  const ridge=point(length*.52,.22+variant*.018,0),tip=point(length,.13+variant*.022,0);
  const underside=point(length*.46,.045,0);
  tri(left,ridge,right);tri(left,tip,ridge);tri(right,ridge,tip);
  tri(right,underside,left);tri(left,underside,tip);tri(right,tip,underside);
  const vertices=[left,right,ridge,tip,underside];
  selectionAabbs.push({min:[0,1,2].map(k=>Math.min(...vertices.map(v=>v[k]))-.004),max:[0,1,2].map(k=>Math.max(...vertices.map(v=>v[k]))+.004)});
 }
 const triangleCount=positions.length/9;
 if(triangleCount>72)throw new Error('agave triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:72,lodTriangles:[72,36,12]},
  integrationStatus:'source-candidate-only'};
}
export function validateAgaveRosette(o){
 if(!o||!validAnchor(o.anchor))throw new TypeError('invalid agave');
 const expected=makeAgaveRosette({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(expected))if(JSON.stringify(o[k])!==JSON.stringify(expected[k]))throw new TypeError('noncanonical agave '+k);
 return true;
}
