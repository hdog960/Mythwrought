// :24-owned saltgrass: sparse salt-flat tufts with bent ribbon blades, opt-in only.
export const SALTGRASS_SCENE_ID='nonblock:d:saltgrass';
const safe=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function makeSaltgrass({seed,anchor,variant=0}={}){
 if(!Number.isSafeInteger(seed)||!safe(anchor)||!Number.isInteger(variant)||variant<0||variant>3)throw new TypeError('invalid saltgrass identity');
 const sceneId=SALTGRASS_SCENE_ID,instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const h=hash(instanceKey),positions=[],selectionAabbs=[];
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 const count=5+variant*2;
 for(let i=0;i<count;i++){
  const theta=i*Math.PI*2/count+(h%113)/113,dx=Math.cos(theta),dz=Math.sin(theta),wx=-dz,wz=dx;
  const length=.22+((h>>>((i%4)*7))%17)/100+variant*.035,reach=.13+((i*11+h)%13)/100;
  const width=.018+((i+h)%3)*.004,base=[dx*.025,0,dz*.025],mid=[dx*reach*.5,length*.63,dz*reach*.5],tip=[dx*reach,length,dz*reach];
  const l=[base[0]+wx*width,0,base[2]+wz*width],r=[base[0]-wx*width,0,base[2]-wz*width],m=[mid[0]+wx*width*.6,mid[1],mid[2]+wz*width*.6];
  tri(l,r,m);tri(r,mid,m);tri(m,mid,tip);tri(r,l,m);tri(mid,r,m);tri(mid,m,tip);
  const extent=reach+width;
  selectionAabbs.push({min:[Math.min(-width,dx*extent-width),0,Math.min(-width,dz*extent-width)],max:[Math.max(width,dx*extent+width),length,Math.max(width,dz*extent+width)]});
 }
 return Object.freeze({contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
 mesh:{primitive:'triangles',positions,triangleCount:positions.length/9},selectionAabbs,collisionIntent:'pass-through',
 attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
 breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
 persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
 spawn:'explicit-opt-in-only',render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:512,maxTrianglesPerInstance:66,lodTriangles:[66,32,16]},
 integrationStatus:'source-candidate-only'});
}
export function validateSaltgrass(o){
 if(!o||o.sceneId!==SALTGRASS_SCENE_ID||!safe(o.anchor))throw new TypeError('invalid saltgrass');
 const x=makeSaltgrass({seed:o.seed,anchor:o.anchor,variant:o.variant});
 if(o.instanceKey!==x.instanceKey||o.breakIntent?.targetKey!==x.instanceKey||o.persistence?.key!==x.instanceKey||
 o.attachment?.face!=='ground'||o.collisionIntent!=='pass-through'||o.spawn!=='explicit-opt-in-only'||
 o.mesh?.triangleCount!==x.mesh.triangleCount||JSON.stringify(o.mesh?.positions)!==JSON.stringify(x.mesh.positions)||
 JSON.stringify(o.selectionAabbs)!==JSON.stringify(x.selectionAabbs))throw new TypeError('noncanonical saltgrass descriptor');
 return true;
}
