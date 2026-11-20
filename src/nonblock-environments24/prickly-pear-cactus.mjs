// :24 D prickly pear: joined polygonal pads, no cube IDs or world writes.
export const PRICKLY_PEAR_SCENE_ID='nonblock:d:prickly-pear-cactus';
const valid=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makePricklyPear({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!valid(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid prickly pear identity');
 const sceneId=PRICKLY_PEAR_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const phase=hash(instanceKey)/4294967296*Math.PI*2;
 const positions=[],materials=[],selectionAabbs=[],pads=[];
 const triangle=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
 const branches=[null,[0,1],[0,-1],[1,-1],[2,1]];
 for(let index=0;index<2+variant;index++){
  const parentBranch=branches[index];
  const parent=parentBranch&&pads[parentBranch[0]];
  const direction=parentBranch?.[1]??0;
  const angle=parent?parent.angle+direction*(.49+.13*((index+variant)%3)):phase;
  const dx=Math.cos(angle),dz=Math.sin(angle),sx=-dz,sz=dx;
  const width=.168-.012*index+.005*(variant%2);
  const height=.22-.014*index+.005*(index>0?variant%2:0);
  const lean=parent?direction*(.046+.009*(index%2)):0;
  const joint=parent?[
   parent.center[0]+parent.sx*(parent.lean*.59+direction*parent.width*.34),
   parent.center[1]+parent.height*.59,
   parent.center[2]+parent.sz*(parent.lean*.59+direction*parent.width*.34)
  ]:[0,0,0];
  const center=[joint[0]+sx*lean,joint[1]+height,joint[2]+sz*lean];
  pads.push({center,angle,sx,sz,width,height,lean});
  const front=[],back=[];
  for(let point=0;point<8;point++){
   const arc=point*Math.PI/4,rise=Math.sin(arc);
   const across=Math.cos(arc)*width*(.84+.15*rise)+lean*rise;
   const x=center[0]+sx*across,y=center[1]+height*rise,z=center[2]+sz*across;
   const rim=.028-.009*Math.abs(rise);
   front.push([x+dx*rim,y,z+dz*rim]);
   back.push([x-dx*rim,y,z-dz*rim]);
  }
  const frontCenter=[center[0]+dx*.054,center[1]+.025,center[2]+dz*.054];
  const backCenter=[center[0]-dx*.054,center[1]+.025,center[2]-dz*.054];
  for(let point=0;point<8;point++){
   const next=(point+1)%8,highlight=point<4;
   triangle(frontCenter,front[next],front[point],highlight?2:1);
   triangle(backCenter,back[point],back[next],highlight?2:1);
   triangle(front[point],front[next],back[point],highlight?1:0);
   triangle(front[next],back[next],back[point],highlight?1:0);
  }
  const vertices=[...front,...back,frontCenter,backCenter];
  selectionAabbs.push({
   min:[0,1,2].map(axis=>Math.min(...vertices.map(point=>point[axis]))-.003),
   max:[0,1,2].map(axis=>Math.max(...vertices.map(point=>point[axis]))+.003)
  });
 }
 const triangleCount=positions.length/9;
 if(triangleCount>160)throw new RangeError('prickly pear budget exceeded');
 return {contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
  mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,collisionIntent:'solid',
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
