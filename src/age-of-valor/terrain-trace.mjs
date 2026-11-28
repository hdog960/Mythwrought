// AV11 read-only original voxel reader port; shape/overlay completeness requires owner.
export function sweptSphereBox(from,to,radius,box){
 const v=to.map((x,i)=>x-from[i]),cuts=[0,1];
 for(let i=0;i<3;i++)if(v[i]!==0)for(const x of [box[i],box[i+3]]){const t=(x-from[i])/v[i];if(t>0&&t<1)cuts.push(t);}
 cuts.sort((a,b)=>a-b);
 const distance=t=>{let d=0;for(let i=0;i<3;i++){const x=from[i]+v[i]*t,q=x<box[i]?x-box[i]:x>box[i+3]?x-box[i+3]:0;d+=q*q;}return d;};
 const rr=radius*radius,epsilon=1e-12;
 for(let j=0;j<cuts.length-1;j++){
  const lo=cuts[j],hi=cuts[j+1],mid=(lo+hi)/2;
  if(distance(lo)<=rr+epsilon)return lo;
  let aa=0,bb=0;
  for(let i=0;i<3;i++){const x=from[i]+v[i]*mid,bound=x<box[i]?box[i]:x>box[i+3]?box[i+3]:null;if(bound!==null){aa+=v[i]*v[i];bb+=v[i]*(from[i]-bound);}}
  const closest=aa>0?Math.max(lo,Math.min(hi,-bb/aa)):lo;
  if(distance(closest)>rr+epsilon)continue;
  let l=lo,u=closest;for(let k=0;k<40;k++){const m=(l+u)/2;if(distance(m)<=rr+epsilon)u=m;else l=m;}return u;
 }
 return distance(1)<=rr+epsilon?1:null;
}
export function createVoxelProjectileTrace({world,identity,readRevision,residentCell,resolveShape,readOverlays,physicalMinY=-210,physicalMaxY=256}){
 const keys=['worldId','profileId','sourceId','fixture'],vec=x=>Array.isArray(x)&&x.length===3&&x.every(n=>Number.isFinite(n)&&Math.abs(n)<=1e7);
 if(!world||typeof world.get!=='function'||!identity||!keys.slice(0,3).every(k=>typeof identity[k]==='string'&&identity[k].length>0)||typeof identity.fixture!=='boolean'||![readRevision,residentCell,resolveShape,readOverlays].every(x=>typeof x==='function')||physicalMinY!==-210||physicalMaxY!==256)throw Error('invalid terrain owner');
 const scope=Object.freeze(Object.fromEntries(keys.map(k=>[k,identity[k]])));let closed=false,busy=false;
 const unknown=()=>Object.freeze({complete:false,fraction:null});
 function trace(q){
  if(closed||busy||!q||!keys.every(k=>q[k]===scope[k])||!vec(q.from)||!vec(q.to)||!Number.isFinite(q.radius)||q.radius<0||q.radius>2||Math.hypot(...q.to.map((x,i)=>x-q.from[i]))>8)return unknown();
  busy=true;try{
   const rev=readRevision();if(!Number.isSafeInteger(rev)||rev<0)throw Error('unknown revision');
   const lo=q.from.map((x,i)=>Math.floor(Math.min(x,q.to[i])-q.radius-1e-8)),hi=q.from.map((x,i)=>Math.floor(Math.max(x,q.to[i])+q.radius+1e-8));
   // Bounds include tangencies. Out-of-world cells have no certified geometry.
   if(lo[1]<physicalMinY||hi[1]>physicalMaxY||(hi[0]-lo[0]+1)*(hi[1]-lo[1]+1)*(hi[2]-lo[2]+1)>512)throw Error('outside terrain budget');
   let best=null,boxCount=0;const cells=[];
   const validBox=(b,local)=>Array.isArray(b)&&b.length===6&&b.every(n=>Number.isFinite(n)&&Math.abs(n)<=1e7)&&[0,1,2].every(i=>b[i]<=b[i+3]&&(!local||b[i]>=0&&b[i+3]<=1));
   const consider=b=>{if(++boxCount>2048)throw Error('shape budget');const f=sweptSphereBox(q.from,q.to,q.radius,b);if(f!==null&&(best===null||f<best))best=f;};
   for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
    if(residentCell(x,y,z)!==true)throw Error('unresident voxel');cells.push([x,y,z]);
    const block=world.get(x,y,z),shape=resolveShape({world,block,cell:[x,y,z]});
    if(!shape||shape.complete!==true||!Array.isArray(shape.boxes)||shape.boxes.length>32||shape.boxes.some(b=>!validBox(b,true)))throw Error('unknown voxel shape');
    for(const b of shape.boxes)consider(b.map((v,i)=>v+[x,y,z][i%3]));
   }
   const overlay=readOverlays(Object.freeze({...scope,revision:rev,from:Object.freeze([...q.from]),to:Object.freeze([...q.to]),radius:q.radius,bounds:Object.freeze([...lo,...hi.map(x=>x+1)])}));
   if(!overlay||overlay.complete!==true||overlay.revision!==rev||!Array.isArray(overlay.boxes)||overlay.boxes.length>512||overlay.boxes.some(b=>!validBox(b,false)))throw Error('unknown overlay');
   for(const b of overlay.boxes)consider(b);
   if(closed||cells.some(c=>residentCell(...c)!==true)||readRevision()!==rev)throw Error('terrain changed');
   return Object.freeze({complete:true,fraction:best});
  }catch{return unknown();}finally{busy=false;}
 }
 return Object.freeze({trace,close:()=>{closed=true}});
}
export function resolveLegacyVoxelShape({block}){
 if(block===0)return {complete:true,boxes:[]};
 if(Number.isInteger(block)&&block>=1&&block<=8)return {complete:true,boxes:[[0,0,0,1,1,1]]};
 return {complete:false,boxes:[]};
}
