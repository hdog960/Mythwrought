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
function banner(b,variant){
 const top=1.61, hem=.29+variant*.025, width=.43, folds=6;
 // Horizontal rail: rings live on its YZ cross-section.
 const radius=.025;
 for(let i=0;i<8;i++){
  const angle=i*Math.PI/4, next=(i+1)*Math.PI/4;
  const ring=(x,a)=>[x,1.65+Math.cos(a)*radius,Math.sin(a)*radius];
  b.quad(ring(-.48,angle),ring(.48,angle),ring(.48,next),ring(-.48,next),0);
  b.tri([-.48,1.65,0],ring(-.48,next),ring(-.48,angle),9);
  b.tri([.48,1.65,0],ring(.48,angle),ring(.48,next),9);
 }
 const fabric=(i,y,side,offset=0)=>{
  const x=-width+2*width*i/folds;
  return [x,y,Math.sin(i*Math.PI*.68+variant*.8)*.019*(top-y)+side*(.014+offset)];
 };
 const lower=i=>hem-Math.max(0,1-Math.abs(i-folds/2)/2)*.15;
 for(const side of [-1,1]){
  for(let i=0;i<folds;i++){
   const j=i+1, bottom=lower(i), nextBottom=lower(j);
   b.quad(fabric(i,top,side),fabric(j,top,side),
    fabric(j,nextBottom+.045,side),fabric(i,bottom+.045,side),(i+variant)%3===1?7:3);
   b.quad(fabric(i,bottom+.045,side),fabric(j,nextBottom+.045,side),
    fabric(j,nextBottom,side),fabric(i,bottom,side),8);
   b.quad(fabric(i,top,side,.001),fabric(j,top,side,.001),
    fabric(j,top-.045,side,.001),fabric(i,top-.045,side,.001),8);
  }
  const center=1.02+variant*.035;
  const point=(i,y,offset=.009)=>fabric(i,y,side,offset);
  b.quad(point(3,center+.23),point(4.16,center),point(3,center-.23),point(1.84,center),8);
  b.quad(point(3,center+.12,.012),point(3.61,center,.012),point(3,center-.12,.012),point(2.39,center,.012),7);
 }
}
function web(b,variant){
 const hub=[-.40,.25,.022];
 const edges=7,rings=4;
 const edgePoints=Array.from({length:edges},(_,i)=>{
  const angle=(i/6)*Math.PI*.52;
  const radius=.63+.05*Math.sin(i*1.42+variant*.81);
  return [hub[0]+Math.cos(angle)*radius,hub[1]+Math.sin(angle)*radius,
   .015+.036*Math.sin(angle*1.9)];
 });
 const stroke=(a,c,width,material)=>{
  const dx=c[0]-a[0],dy=c[1]-a[1],length=Math.hypot(dx,dy);
  const offset=[-dy*width/length,dx*width/length,0];
  const side=(p,k)=>p.map((n,i)=>n+k*offset[i]);
  b.quad(side(a,-1),side(a,1),side(c,1),side(c,-1),material);
 };
 for(const point of edgePoints)stroke(hub,point,.008,4);
 for(let ring=1;ring<=rings;ring++){
  const t=ring/(rings+1);
  const points=edgePoints.map(edge=>edge.map((value,i)=>hub[i]+(value-hub[i])*t));
  for(let i=0;i<points.length-1;i++){
   const a=points[i],c=points[i+1];
   const sag=a.map((value,j)=>(value+c[j])*.5-(j===1?.011*t:0));
   stroke(a,sag,.006,5);
   stroke(sag,c,.006,4);
  }
 }
 stroke([-.489,hub[1]-.038,hub[2]],hub,.007,5);
}
function coil(b,variant){
 // Single continuous rope, from a free outer end into the stacked turns.
 const segments=28, sides=4, radius=.035;
 const phase=variant*.45, turns=2.28+variant*.09;
 const sample=(index,side)=>{
  const t=index/segments, angle=phase+t*Math.PI*2*turns;
  const r=.337-.19*t, y=.036+.112*t*t;
  const a=side*2*Math.PI/sides+Math.PI/4;
  return [Math.cos(angle)*(r+Math.cos(a)*radius),y+Math.sin(a)*radius,
   Math.sin(angle)*(r+Math.cos(a)*radius)];
 };
 for(let i=0;i<segments;i++){
  for(let j=0;j<sides;j++){
   const next=(j+1)%sides;
   b.quad(sample(i,j),sample(i+1,j),sample(i+1,next),sample(i,next),
    i===0||i===segments-1?9:6+Number((i+j)%4===0)*4);
  }
 }
 b.quad(...[3,2,1,0].map(side=>sample(0,side)),9);
 b.quad(...[0,1,2,3].map(side=>sample(segments,side)),9);
}
const makers={'scene36:signpost':signpost,'scene36:hanging-chain':chain,'scene36:cloth-banner':banner,'scene36:hanging-cobweb':web,'scene36:rope-coil':coil};
export function describeFitting({sceneId,seed,anchor,variant,orientation=0,mount={}}){
 const family=FITTINGS[sceneId];if(!family)throw new RangeError('unknown scene family');
 if(!integer(seed)||!Array.isArray(anchor)||anchor.length!==3||!anchor.every(integer)||!integer(orientation)||orientation<0||orientation>3)throw new TypeError('invalid identity');
 const resolved=variant??(hash(sceneId+':'+seed+':'+anchor.join(','))&3);
 if(!integer(resolved)||resolved<0||resolved>3)throw new RangeError('invalid variant');
 const required=family.attachment==='ground'?'below':family.attachment==='ceiling'?'above':family.attachment==='wall'?'behind':'corner';
 if(mount[required]!==true||mount.playerEdited===true||mount.occupied===true)throw new RangeError('mount not verified or edit-protected');
 const key='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+resolved+':r'+orientation;
 const b=meshBuilder();makers[sceneId](b,resolved);const mesh=b.finish();
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
 // Canonical anchor-relative geometry is shared by all instances of this family.
 // Keep worldMesh for exact triangle picking; GPU instancing consumes localMesh + transform.
 const localMesh=mesh;
 const transform={translation:[...anchor],quarterTurnsY:orientation};
 return Object.freeze({contract:CONTRACT,sceneId,seed,anchor:[...anchor],variant:resolved,orientation,instanceKey:key,attachment:family.attachment,selectionAabbs,collisionIntent:family.collision,breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},persistence:{kind:'schema1-external-tombstone-sidecar',key,defaultRespawn:'never-until-explicit-reset'},render:{mesh:worldMesh,localMesh,transform,triangleCount:mesh.triangleCount,instanced:true,lodTier:family.tier,alphaMode:'opaque-palette',maxInstancesPerBatch:256},sourceFingerprint:hash(sceneId+':'+mesh.triangleCount).toString(16).padStart(8,'0')});
}
// Disposable opt-in demonstration only; no schema-1 or game mutation.
export function createFittingFixture(seed,objects){if(!integer(seed)||!Array.isArray(objects)||objects.some(o=>o.seed!==seed||o.contract!==CONTRACT))throw new TypeError('invalid fixture');const removed=new Set();return {visible:()=>objects.filter(o=>!removed.has(o.instanceKey)),breakObject:o=>{if(!objects.includes(o)||o.breakIntent.targetKey!==o.instanceKey)throw new TypeError('invalid target');removed.add(o.instanceKey);return {action:'remove-object',instanceKey:o.instanceKey,removed:true};},snapshot:()=>({contract:CONTRACT,seed,tombstones:[...removed].sort()}),restore:s=>{if(s?.contract!==CONTRACT||s.seed!==seed||!Array.isArray(s.tombstones)||s.tombstones.some(k=>!objects.some(o=>o.instanceKey===k)))throw new TypeError('invalid sidecar');removed.clear();s.tombstones.forEach(k=>removed.add(k));}};}
