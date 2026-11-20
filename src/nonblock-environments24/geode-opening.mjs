// :24-only geode opening: a hollow faceted rim with inward crystal teeth; opt-in only.
export const GEODE_OPENING_SCENE_ID='nonblock:e:geode-opening';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeGeodeOpening({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid geode identity');
 const sceneId=GEODE_OPENING_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const positions=[],materials=[],selectionAabbs=[],segments=8+variant*2;
 const outer=.337+variant*.044,depth=.14+variant*.025;
 const phase=hash(instanceKey)/4294967296*2*Math.PI,turn=2*Math.PI;
 const tri=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const edges=Array.from({length:segments},(_,i)=>{
  const heading=phase+i*turn/segments;
  const rock=.93+.06*Math.sin(i*2.47+phase)+.03*Math.cos(i*4.051+phase);
  const rim=.52+.04*Math.sin(i*1.81+phase);
  return [
   [.88*rock,0],
   [rock,-(.39+.11*Math.cos(i*1.79))*depth],
   [(.68+.04*Math.sin(i*3.94))*rock,-.83*depth],
   [rim,-(.66+.09*Math.cos(i*2.64))*depth],
   [rim*.71,-.26*depth],
   [rim*.64,0]
  ].map(([radial,reach])=>[Math.cos(heading)*radial*outer,reach,Math.sin(heading)*radial*outer]);
 });
 const teeth=new Set([0,Math.floor(segments/3),Math.floor(2*segments/3)]);
 for(let i=0;i<segments;i++){
  const next=(i+1)%segments,edge=edges[i],neighbor=edges[next];
  const pigments=[0,i%3===0?0:1,i%3===0?3:2,i%2===0?2:4,4,0];
  for(let layer=0;layer<pigments.length;layer++){
   const below=(layer+1)%pigments.length;
   tri(edge[layer],neighbor[layer],edge[below],pigments[layer]);
   tri(neighbor[layer],neighbor[below],edge[below],pigments[layer]);
  }
  const points=[...edge,...neighbor];
  if(teeth.has(i)){
   const center=(a,b,factor)=>a.map((value,axis)=>(value+b[axis])*.5*(axis===1?1:factor));
   const tip=center(edge[3],neighbor[3],.73);
   tip[1]-=.035;
   const base=center(edge[2],neighbor[2],1);
   tri(edge[3],tip,neighbor[3],3);tri(tip,base,neighbor[3],3);
   tri(base,tip,edge[3],2);tri(edge[3],neighbor[3],base,2);
   points.push(tip,base);
  }
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
  });
 }
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
 mesh:{primitive:'triangles',positions,materials,triangleCount:positions.length/9},selectionAabbs,collisionIntent:'solid',
 attachment:{face:'wall',requiresSolid:true,requiresClear:true,supportOffset:[0,0,-1],rejectEditedSupport:true},
 breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
 persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
 spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:180,lodTriangles:[180,84,36]},
 integrationStatus:'source-candidate-only'});
}
export function validateGeodeOpening(o){
 if(!o||o.sceneId!==GEODE_OPENING_SCENE_ID||!safe(o.anchor))throw new TypeError('invalid geode');
 const x=makeGeodeOpening({seed:o.seed,anchor:o.anchor,variant:o.variant});
 if(o.instanceKey!==x.instanceKey||o.breakIntent?.targetKey!==x.instanceKey||o.persistence?.key!==x.instanceKey||
 o.attachment?.face!=='wall'||o.attachment?.rejectEditedSupport!==true||o.collisionIntent!=='solid'||
 o.spawn!=='explicit-opt-in-only'||o.mesh?.triangleCount!==x.mesh.triangleCount||
 JSON.stringify(o.mesh?.positions)!==JSON.stringify(x.mesh.positions)||
 JSON.stringify(o.mesh?.materials)!==JSON.stringify(x.mesh.materials)||
 JSON.stringify(o.selectionAabbs)!==JSON.stringify(x.selectionAabbs))throw new TypeError('noncanonical geode');
 return true;
}
