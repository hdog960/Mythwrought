// :24-owned saltgrass: sparse salt-flat tufts with bent ribbon blades, opt-in only.
export const SALTGRASS_SCENE_ID='nonblock:d:saltgrass';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeSaltgrass({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid saltgrass identity');
 const sceneId=SALTGRASS_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],materials=[],selectionAabbs=[];
 const tri=(a,b,c,tag)=>{positions.push(...a,...b,...c);materials.push(tag);};
 const track=points=>selectionAabbs.push({
  min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))),
  max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis])))
 });
 const count=5+variant*2,phase=h/4294967296*2*Math.PI;
 for(let i=0;i<count;i++){
  const theta=phase+i*2.3999632297,dx=Math.cos(theta),dz=Math.sin(theta),wx=-dz,wz=dx;
  const height=.13+((h>>>((i%4)*7))%15)*.008+variant*.022;
  const reach=.16+((i*11+h)%13)*.008,width=.013+((i+h)%3)*.003;
  const at=(distance,y,w)=>[dx*distance+wx*w,y,dz*distance+wz*w];
  const left=at(.026,0,width),right=at(.026,0,-width);
  const shoulder=at(reach*.52,height,width*.76),below=at(reach*.55,height*.84,-width*.53);
  const end=at(reach,height*.72,0);
  tri(left,right,shoulder,0);tri(right,below,shoulder,1);tri(shoulder,below,end,2);
  track([left,right,shoulder,below,end]);
 }
 for(let i=0;i<2+variant%2;i++){
  const theta=phase+i*2.3999632297+.49,dx=Math.cos(theta),dz=Math.sin(theta);
  const height=.31+variant*.032+i*.035;
  const at=(distance,y,across=0)=>[dx*distance-dz*across,y,dz*distance+dx*across];
  const roots=[at(.023,0,.011),at(.023,0,-.011),at(.012,0)];
  const crown=[at(.093,height,.005),at(.093,height,-.005),at(.085,height)];
  for(let side=0;side<3;side++){
   const next=(side+1)%3;
   tri(roots[side],roots[next],crown[side],0);
   tri(roots[next],crown[next],crown[side],1);
  }
  const shoulder=[at(.116,height+.028,.022),at(.116,height+.028,-.022),at(.093,height+.033)];
  const tip=at(.151,height+.067);
  for(let side=0;side<3;side++){
   const next=(side+1)%3;
   tri(crown[side],shoulder[side],shoulder[next],side===1?2:3);
   tri(shoulder[side],tip,shoulder[next],side===2?2:3);
  }
  track([...roots,...crown,...shoulder,tip]);
 }
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
 mesh:{primitive:'triangles',positions,materials,triangleCount:positions.length/9},selectionAabbs,collisionIntent:'pass-through',
 attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
 breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
 persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
 spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:512,maxTrianglesPerInstance:72,lodTriangles:[72,32,16]},
 integrationStatus:'source-candidate-only'});
}
export function validateSaltgrass(o){
 if(!o||o.sceneId!==SALTGRASS_SCENE_ID||!safe(o.anchor))throw new TypeError('invalid saltgrass');
 const x=makeSaltgrass({seed:o.seed,anchor:o.anchor,variant:o.variant});
 if(o.instanceKey!==x.instanceKey||o.breakIntent?.targetKey!==x.instanceKey||o.persistence?.key!==x.instanceKey||
 o.attachment?.face!=='ground'||o.collisionIntent!=='pass-through'||o.spawn!=='explicit-opt-in-only'||
 o.mesh?.triangleCount!==x.mesh.triangleCount||JSON.stringify(o.mesh?.positions)!==JSON.stringify(x.mesh.positions)||
 JSON.stringify(o.mesh?.materials)!==JSON.stringify(x.mesh.materials)||
 JSON.stringify(o.selectionAabbs)!==JSON.stringify(x.selectionAabbs))throw new TypeError('noncanonical saltgrass descriptor');
 return true;
}
