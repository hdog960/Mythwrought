// The Living Underworld: bounded, exact six-face-connected component census.
// This tests actual proposed voxel AIR, not graph labels or noisy percentages.
// Local sample windows are not evidence that the entire infinite world is connected.
const validPoint=p=>p&&['x','y','z'].every(k=>Number.isSafeInteger(p[k]));
export function auditBoundedCaveComponents({origin,size,airAt,anchors=[],maxCells=65536}={}){
 if(!validPoint(origin)||!validPoint(size)||typeof airAt!=='function'||
   !Array.isArray(anchors)||anchors.some(a=>!validPoint(a))||
   !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>65536||
   !['x','y','z'].every(k=>size[k]>=1&&size[k]<=64))
  throw new TypeError('Invalid bounded cave component audit');
 const nx=size.x,ny=size.y,nz=size.z,plane=nx*nz,volume=plane*ny;
 if(volume>maxCells)return Object.freeze({ok:false,reason:'VOXEL_BUDGET_EXCEEDED',volume,maxCells});
 const mask=new Uint8Array(volume),ids=new Int32Array(volume);
 ids.fill(-1);
 let air=0;
 for(let iy=0;iy<ny;iy++)for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
  const index=ix+nx*(iz+nz*iy);
  if(airAt(origin.x+ix,origin.y+iy,origin.z+iz)){mask[index]=1;air++;}
 }
 const queue=new Int32Array(volume),sizes=[],boundary=[],seeds=[];
 for(let start=0;start<volume;start++){
  if(!mask[start]||ids[start]>=0)continue;
  const component=sizes.length;let begin=0,end=1,componentSize=0,hasBoundary=false;
  queue[0]=start;ids[start]=component;
  while(begin<end){
   const at=queue[begin++],iy=Math.floor(at/plane),rem=at-iy*plane,
    iz=Math.floor(rem/nx),ix=rem-iz*nx;
   componentSize++;
   if(ix===0||ix===nx-1||iy===0||iy===ny-1||iz===0||iz===nz-1)hasBoundary=true;
   const sides=[ix>0?at-1:-1,ix<nx-1?at+1:-1,
    iz>0?at-nx:-1,iz<nz-1?at+nx:-1,
    iy>0?at-plane:-1,iy<ny-1?at+plane:-1];
   for(const other of sides){
    if(other<0||!mask[other]||ids[other]>=0)continue;
    ids[other]=component;queue[end++]=other;
   }
  }
  sizes.push(componentSize);boundary.push(hasBoundary);
  seeds.push(Object.freeze({x:origin.x+(start%nx),
    y:origin.y+Math.floor(start/plane),
    z:origin.z+(Math.floor((start%plane)/nx))}));
 }
 const anchorMembership=anchors.map(a=>{
  const ix=a.x-origin.x,iy=a.y-origin.y,iz=a.z-origin.z;
  const inBounds=ix>=0&&ix<nx&&iy>=0&&iy<ny&&iz>=0&&iz<nz;
  const component=inBounds?ids[ix+nx*(iz+nz*iy)]:-1;
  return Object.freeze({point:a,inBounds,air:component>=0,
   component:component>=0?component:null});
 });
 const anchored=anchorMembership.filter(a=>a.inBounds&&a.air);
 const maxAir=Math.max(0,...sizes);
 return Object.freeze({ok:true,volume,air,solid:volume-air,
  componentCount:sizes.length,largestAirComponent:maxAir,
  largestAirShare:air?maxAir/air:0,
  edgeCrossingComponents:boundary.filter(Boolean).length,
  componentSizes:Object.freeze([...sizes].sort((a,b)=>b-a).slice(0,16)),
  anchors:Object.freeze(anchorMembership),
  allAirAnchorsConnected:anchored.length>=2?
   anchored.every(a=>a.component===anchored[0].component):null,
  wholeWorldConnectivityVerified:false,
  sampledBounds:Object.freeze({origin,size})});
}
