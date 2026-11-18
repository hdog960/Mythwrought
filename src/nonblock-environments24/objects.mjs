// :24 environmental non-block producer. Candidate-only, no world spawning or save writes.
// Contract proposal v1; requires source-exact :48 approval before integration.
export const CONTRACT = 'nonblock-object-v1-proposal-24';
export const FAMILIES = Object.freeze({
  stalagmite: {sceneId:'nonblock:e:small-stalagmite',mount:'ground',collision:'solid',palette:[.61,.57,.48]},
  stalactite: {sceneId:'nonblock:e:hanging-stalactite',mount:'ceiling',collision:'solid',palette:[.58,.55,.49]},
  crystal: {sceneId:'nonblock:e:crystal-shard',mount:'ground',collision:'solid',palette:[.28,.77,.91]},
  icicle: {sceneId:'nonblock:d:icicle-spear',mount:'ceiling',collision:'solid',palette:[.66,.87,.96]},
  agave: {sceneId:'nonblock:d:agave-rosette',mount:'ground',collision:'pass-through',palette:[.28,.51,.34]}
});
const hash=(s)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
// Preserve the full safe-integer world identity; bitwise truncation aliases distinct seeds/anchors.
const key=(seed,a,id,v)=>[seed,a.x,a.y,a.z,id,v].join(':');
function triangle(out,a,b,c){out.push(...a,...b,...c);}
function tapered(out,x,z,y0,y1,r0,r1,sides=7){
  for(let j=0;j<sides;j++){const a=j*2*Math.PI/sides,b=(j+1)*2*Math.PI/sides;
    const p=[x+Math.cos(a)*r0,y0,z+Math.sin(a)*r0],q=[x+Math.cos(b)*r0,y0,z+Math.sin(b)*r0];
    const u=[x+Math.cos(a)*r1,y1,z+Math.sin(a)*r1],v=[x+Math.cos(b)*r1,y1,z+Math.sin(b)*r1];
    triangle(out,p,q,u);triangle(out,q,v,u);
  }
}
function blade(out,angle,length,height,width){
 const dx=Math.cos(angle),dz=Math.sin(angle),nx=-dz*width,nz=dx*width;
 triangle(out,[nx,0,nz],[-nx,0,-nz],[dx*length,height,dz*length]);
 triangle(out,[-nx,0,-nz],[nx,0,nz],[dx*length,height,dz*length]);
}
export function makeEnvironmentObject(family,{seed=179,anchor,variant=0}={}){
 const def=FAMILIES[family];
 if(!def||!Number.isSafeInteger(seed)||!anchor||![anchor.x,anchor.y,anchor.z].every(Number.isSafeInteger)||!Number.isInteger(variant)||variant<0||variant>7)throw Error('Invalid environmental object');
 const h=hash(key(seed,anchor,def.sceneId,variant)),t=h/4294967295;
 const height=(family==='agave'?.48:family==='crystal'?1.15:1.5)+variant*.075+t*.2;
 const r=family==='agave'?.62:family==='crystal'?.36:.28+variant*.025;
 const positions=[];
 if(family==='agave'){for(let i=0;i<9;i++)blade(positions,i*Math.PI*2/9+t*.3,r*.95,.18+(i%3)*.12,.07);}
 else if(family==='crystal'){
   tapered(positions,0,0,0,height,r,0,6);
   tapered(positions,.25,.08,0,height*.65,r*.52,0,5);
   tapered(positions,-.21,-.09,0,height*.55,r*.45,0,5);
 }else if(def.mount==='ceiling')tapered(positions,0,0,0,-height,r,.012,7);
 else tapered(positions,0,0,0,height,r,.012,7);
 const pickRadius=family==='crystal'?r+.3:r;
 const bounds=def.mount==='ceiling'?
   {min:[-pickRadius,-height,-pickRadius],max:[pickRadius,0,pickRadius]}:
   {min:[-pickRadius,0,-pickRadius],max:[pickRadius,height,pickRadius]};
 const instanceKey=key(seed,anchor,def.sceneId,variant);
 return Object.freeze({contract:CONTRACT,sceneId:def.sceneId,instanceKey,seed,anchor:{...anchor},
   variant,mount:def.mount,mesh:{primitive:'triangles',positions,triangleCount:positions.length/9,color:def.palette},
   selection:[bounds],collision:def.collision,attachment:{face:def.mount==='ground'?'up':'down',requireSolid:true,requireClear:true},
   removal:{action:'break',tombstoneKey:'nonblock:'+instanceKey,respawn:'never-unless-explicit-reset'},
   render:{batchKey:def.sceneId+':'+variant,lod:[12,28,48],maxTriangles:48},spawn:'explicit-opt-in-only'});
}
export function canAttach(object,{blockAt,editedAt=()=>false,occupiedAt=()=>false}={}){
 if(typeof blockAt!=='function'||typeof editedAt!=='function'||typeof occupiedAt!=='function')return false;
 const {x,y,z}=object.anchor,face=object.mount==='ground'?-1:1;
 if(!blockAt(x,y+face,z)||editedAt(x,y+face,z))return false;
 const box=object.selection[0],low=Math.floor(y+box.min[1]),high=Math.ceil(y+box.max[1]);
 for(let yy=low;yy<=high;yy++)if(blockAt(x,yy,z)||editedAt(x,yy,z)||occupiedAt(x,yy,z))return false;
 return true;
}
export function createFixture(objects,{tombstones=[]}={}){
 const removed=new Set(tombstones);
 const visible=()=>objects.filter(o=>!removed.has(o.removal.tombstoneKey));
 return {visible,breakByKey(instanceKey){const o=visible().find(x=>x.instanceKey===instanceKey);
   if(!o)return false;removed.add(o.removal.tombstoneKey);return true;},
   snapshot(){return [...removed].sort();}};
}
