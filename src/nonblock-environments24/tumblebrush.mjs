// :24 original tumblebrush: bounded interwoven triangular twigs, no automatic spawn.
export const TUMBLEBRUSH_SCENE_ID='nonblock:d:tumblebrush';
const valid=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makeTumblebrush({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!valid(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid tumblebrush identity');
 const sceneId=TUMBLEBRUSH_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const turn=Math.PI*2,phase=hash(instanceKey)/4294967296*turn;
 const positions=[],materials=[],selectionAabbs=[];
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const branches=4,radius=.21+variant*.026,stems=[];
 const recordBounds=points=>selectionAabbs.push({
  min:[0,1,2].map(k=>Math.min(...points.map(point=>point[k]))-.003),
  max:[0,1,2].map(k=>Math.max(...points.map(point=>point[k]))+.003)
 });
 const reaches=[.12,.72,1.02,.78,.49],heights=[.12,.51,1.08,1.72,1.46];
 for(let branch=0;branch<branches;branch++){
  const heading=phase+branch*2.39996323;
  const nodes=reaches.map((reach,i)=>{
   const turnAtNode=heading+i*(.27+.055*((branch+variant)%3));
   const lateral=radius*reach*(.91+.11*Math.sin(phase+branch*1.88+i*.41));
   const rise=radius*heights[i]*(.96+.08*Math.sin(branch*1.2+i*2.1));
   return [lateral*Math.cos(turnAtNode),rise,lateral*Math.sin(turnAtNode)];
  });
  stems.push(nodes);
  const rings=nodes.map((point,i)=>{
   const incoming=nodes[Math.max(0,i-1)],outgoing=nodes[Math.min(nodes.length-1,i+1)];
   const [dx,dy,dz]=outgoing.map((n,k)=>n-incoming[k]);
   const flat=Math.hypot(dx,dz),length=Math.hypot(dx,dy,dz);
   const side=[dz/flat,0,-dx/flat];
   const up=[dy*side[2]/length,(dz*side[0]-dx*side[2])/length,-dy*side[0]/length];
   const width=.016-i*.0029+variant*.0007;
   return Array.from({length:3},(_,sideIndex)=>{
    const angle=sideIndex*turn/3+.21;
    return point.map((value,k)=>value+width*(Math.cos(angle)*side[k]+Math.sin(angle)*up[k]));
   });
  });
  for(let level=1;level<rings.length;level++)for(let edge=0;edge<3;edge++){
   const next=(edge+1)%3,below=rings[level-1],above=rings[level];
   const material=level===rings.length-1?2:edge%2;
   triangle(below[edge],below[next],above[next],material);
   triangle(below[edge],above[next],above[edge],material);
  }
  triangle(...rings[0],0);
  triangle(...rings.at(-1),2);
  recordBounds(rings.flat());
 }
 for(let branch=0;branch<branches;branch++){
  const start=stems[branch][2],end=stems[(branch+1)%branches][3];
  const dx=end[0]-start[0],dz=end[2]-start[2],span=Math.hypot(dx,dz);
  const side=[-dz/span,0,dx/span];
  const curve=Array.from({length:4},(_,i)=>{
   const t=i/3;
   const arch=Math.sin(Math.PI*t)*radius*(.25+.05*variant);
   return start.map((value,k)=>value+(end[k]-value)*t+side[k]*arch+(k===1?arch*.48:0));
  });
  const ribbon=(point,offset)=>point.map((value,k)=>value+side[k]*offset+(k===1?offset*.5:0));
  const pairs=curve.map(point=>[ribbon(point,.009),ribbon(point,-.009)]);
  for(let i=0;i<3;i++){
   triangle(pairs[i][0],pairs[i][1],pairs[i+1][1],1);
   triangle(pairs[i][0],pairs[i+1][1],pairs[i+1][0],2);
  }
  recordBounds(pairs.flat());
 }
 const triangleCount=positions.length/9;
 if(triangleCount>132)throw new RangeError('tumblebrush triangle budget');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'pass-through',
  attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:64,maxTrianglesPerInstance:132,lodTriangles:[132,20,8]},
  integrationStatus:'source-candidate-only'};
}
export function validateTumblebrush(o){
 if(!o||!valid(o.anchor))throw new TypeError('invalid tumblebrush');
 const canonical=makeTumblebrush({seed:o.seed,anchor:o.anchor,variant:o.variant});
 for(const k of Object.keys(canonical))if(JSON.stringify(o[k])!==JSON.stringify(canonical[k]))throw new TypeError('noncanonical tumblebrush '+k);
 return true;
}
