// :36 isolated F/G scene proposals. No world writes, block IDs, or automatic placement.
// Compatible descriptor SHAPE with :48 nonblock-object-v1 blob d8f00bcc2d5fe186a9822eeeb48684f51222fad3.
// Manual integrator must reconcile contract and :00 ownership before activation.
export const CONTRACT='nonblock-object-v1';
export const CONTRACT_SOURCE_SHA='d8f00bcc2d5fe186a9822eeeb48684f51222fad3';
export const FITTINGS=Object.freeze({
 'scene36:signpost':{group:'G',number:77,attachment:'ground',collision:'solid-proposed',size:[.95,2.25,.35],tier:'sparse'},
 'scene36:hanging-chain':{group:'F',number:70,attachment:'ceiling',collision:'pass-through',size:[.3,1.85,.3],tier:'medium'},
 'scene36:cloth-banner':{group:'F',number:71,attachment:'wall',collision:'pass-through',size:[.9,1.7,.18],tier:'medium'},
 'scene36:hanging-cobweb':{group:'G',number:83,attachment:'corner',collision:'pass-through',size:[1.1,1.1,.1],tier:'sparse'},
 'scene36:rope-coil':{group:'G',number:81,attachment:'ground',collision:'pass-through',size:[.75,.28,.75],tier:'sparse'}
});
const integer=Number.isSafeInteger;
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
function meshBuilder(){const p=[],m=[];return {tri(a,b,c,mat){p.push(...a,...b,...c);m.push(mat);},quad(a,b,c,d,mat){this.tri(a,b,c,mat);this.tri(a,c,d,mat);},finish(){return {positions:new Float32Array(p),materials:new Uint8Array(m),triangleCount:m.length};}};}
function rod(b,a,c,r,mat,sides=6){for(let i=0;i<sides;i++){const t=i*2*Math.PI/sides,u=(i+1)*2*Math.PI/sides;const q=(p,k)=>[p[0]+Math.cos(k)*r,p[1],p[2]+Math.sin(k)*r];b.quad(q(a,t),q(a,u),q(c,u),q(c,t),mat);}}
function signpost(b){rod(b,[0,0,0],[0,2.15,0],.075,0);b.quad([-.47,1.45,.09],[.47,1.45,.09],[.47,1.82,.09],[-.47,1.82,.09],1);b.quad([.47,1.45,-.09],[-.47,1.45,-.09],[-.47,1.82,-.09],[.47,1.82,-.09],1);b.tri([.47,1.45,.09],[.56,1.64,0],[.47,1.82,.09],1);}
function chain(b){for(let j=0;j<8;j++){const y=1.65-j*.205,axis=j%2;for(let i=0;i<8;i++){const t=i*Math.PI/4,u=(i+1)*Math.PI/4;const a=[Math.cos(t)*.105,y+Math.sin(t)*.145,0],c=[Math.cos(u)*.105,y+Math.sin(u)*.145,0];if(axis){a[2]=a[0];a[0]=0;c[2]=c[0];c[0]=0;}const offset=axis?[.025,0,0]:[0,0,.025];b.quad(a,c,c.map((v,k)=>v+offset[k]),a.map((v,k)=>v+offset[k]),2);}}}
function banner(b){rod(b,[-.48,1.65,0],[.48,1.65,0],.027,0);for(let i=0;i<5;i++){const x=-.43+i*.172,n=-.43+(i+1)*.172;const bottom=i===2?.16:.3;b.quad([x,1.61,.035],[n,1.61,.035],[n,bottom,.055],[x,bottom,.055],3);b.quad([n,1.61,-.035],[x,1.61,-.035],[x,bottom,-.055],[n,bottom,-.055],3);}}
function web(b){const center=[0,.52,0];for(let k=0;k<7;k++){const a=k*Math.PI/12,edge=[Math.cos(a)*.51,.52+Math.sin(a)*.51,0];b.tri(center,edge,[edge[0]*.82,edge[1]*.82+.095,.005],4);}for(let ring=1;ring<=3;ring++)for(let k=0;k<6;k++){const a=k*Math.PI/12,c=(k+1)*Math.PI/12,r=ring*.16;const p=[Math.cos(a)*r,.52+Math.sin(a)*r,.008],q=[Math.cos(c)*r,.52+Math.sin(c)*r,.008];b.tri(p,q,[p[0]*.98,p[1]+.012,.008],5);}}
function coil(b){for(let turn=0;turn<3;turn++){const r=.12+turn*.1;for(let k=0;k<16;k++){const a=k*Math.PI/8,c=(k+1)*Math.PI/8,y=.055+turn*.065;const p=[Math.cos(a)*r,y,Math.sin(a)*r],q=[Math.cos(c)*r,y,Math.sin(c)*r];b.quad(p,q,[q[0],y+.045,q[2]],[p[0],y+.045,p[2]],6);}}}
const makers={'scene36:signpost':signpost,'scene36:hanging-chain':chain,'scene36:cloth-banner':banner,'scene36:hanging-cobweb':web,'scene36:rope-coil':coil};
export function describeFitting({sceneId,seed,anchor,variant,orientation=0,mount={}}){
 const family=FITTINGS[sceneId];if(!family)throw new RangeError('unknown scene family');
 if(!integer(seed)||!Array.isArray(anchor)||anchor.length!==3||!anchor.every(integer)||!integer(orientation)||orientation<0||orientation>3)throw new TypeError('invalid identity');
 const resolved=variant??(hash(sceneId+':'+seed+':'+anchor.join(','))&3);
 if(!integer(resolved)||resolved<0||resolved>3)throw new RangeError('invalid variant');
 const required=family.attachment==='ground'?'below':family.attachment==='ceiling'?'above':family.attachment==='wall'?'behind':'corner';
 if(mount[required]!==true||mount.playerEdited===true||mount.occupied===true)throw new RangeError('mount not verified or edit-protected');
 const key='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+resolved+':r'+orientation;
 const b=meshBuilder();makers[sceneId](b);const mesh=b.finish();
 // Rotate every authored triangle around the anchor; pick bounds come from actual rotated
 // mesh coordinates, never the unrotated nominal family dimensions.
 const p=mesh.positions, world=new Float32Array(p.length);
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<p.length;i+=3){
  const x=p[i],y=p[i+1],z=p[i+2];
  const rx=orientation===0?x:orientation===1?-z:orientation===2?-x:z;
  const rz=orientation===0?z:orientation===1?x:orientation===2?-z:-x;
  const coords=[anchor[0]+rx,anchor[1]+y,anchor[2]+rz];
  for(let k=0;k<3;k++){world[i+k]=coords[k];min[k]=Math.min(min[k],coords[k]);max[k]=Math.max(max[k],coords[k]);}
 }
 // Selection volumes carry a small epsilon so thin cloth/web triangles remain targetable.
 const selectionAabbs=[{min:min.map(v=>v-.025),max:max.map(v=>v+.025)}];
 const worldMesh={positions:world,materials:mesh.materials,triangleCount:mesh.triangleCount};
 return Object.freeze({contract:CONTRACT,sceneId,seed,anchor:[...anchor],variant:resolved,orientation,instanceKey:key,attachment:family.attachment,selectionAabbs,collisionIntent:family.collision,breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},persistence:{kind:'schema1-external-tombstone-sidecar',key,defaultRespawn:'never-until-explicit-reset'},render:{mesh:worldMesh,triangleCount:mesh.triangleCount,instanced:true,lodTier:family.tier,alphaMode:'opaque-palette',maxInstancesPerBatch:256},sourceFingerprint:hash(sceneId+':'+mesh.triangleCount).toString(16).padStart(8,'0')});
}
// Disposable opt-in demonstration only; no schema-1 or game mutation.
export function createFittingFixture(seed,objects){if(!integer(seed)||!Array.isArray(objects)||objects.some(o=>o.seed!==seed||o.contract!==CONTRACT))throw new TypeError('invalid fixture');const removed=new Set();return {visible:()=>objects.filter(o=>!removed.has(o.instanceKey)),breakObject:o=>{if(!objects.includes(o)||o.breakIntent.targetKey!==o.instanceKey)throw new TypeError('invalid target');removed.add(o.instanceKey);return {action:'remove-object',instanceKey:o.instanceKey,removed:true};},snapshot:()=>({contract:CONTRACT,seed,tombstones:[...removed].sort()}),restore:s=>{if(s?.contract!==CONTRACT||s.seed!==seed||!Array.isArray(s.tombstones)||s.tombstones.some(k=>!objects.some(o=>o.instanceKey===k)))throw new TypeError('invalid sidecar');removed.clear();s.tombstones.forEach(k=>removed.add(k));}};}
