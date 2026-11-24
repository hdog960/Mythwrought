// D45: exact source-authored FIRST physical obstruction anatomy and an independent
// fractional face-rail egress probe. Absolutely NO installed joint, edited
// original block, approved fastening, new material ID, or tensile reaction.
import {inspectD44FirstPrismBlocker} from './d44-source-full-volume-tie-router.mjs';
const EPS=1e-8, HW=.08;
const integer3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const intersect=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const mk=(min,max)=>Object.freeze({min:Object.freeze(min),max:Object.freeze(max)});
const rootRoles=new Set(['foundation','floor','wall','column','partition','beam']);
const validSocket=b=>b&&finite3(b.min)&&finite3(b.max)&&b.min.every((v,i)=>v<b.max[i]);
function check(wall,plane,rootAtEnd,src,socket){
 if(!integer3(wall)||wall[1]!==6||!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
  typeof src?.get!=='function'||!(src.nav instanceof Set)||!validSocket(socket)||
  src.get(wall[0],0,wall[2])?.role!=='foundation'||
  src.get(wall[0],1,wall[2])?.role!=='floor'||
  src.get(wall[0],7,wall[2])?.asset!=='live:wood'||
  !['wall','partition','column'].includes(src.get(...wall)?.role)||
  !Array.from({length:7},(_,y)=>rootRoles.has(src.get(wall[0],y,wall[2])?.role)).every(Boolean))
   throw Error('D45 demands original intact source rooted wall, Y7 wood, WALK, and real unregistered socket AABB');
}
/** Ray vs padded source voxel slab: earliest *physical entry* of a finite
 * square-prism segment into this actual original voxel, not D44's first
 * lexicographically enumerated occupant. Query only D44 measured solids. */
export function d45SourceVoxelEntryFraction(a,b,at,{halfWidth=HW}={}){
 if(!integer3(a)||!integer3(b)||!integer3(at)||
  a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)!==1||halfWidth!==HW)
  throw TypeError('D45 original integer unit full-thickness prism and source cell required');
 const start=a.map(v=>v+.5),d=a.map((v,i)=>b[i]-v);let enter=-Infinity,exit=Infinity;
 for(let i=0;i<3;i++){
  const lo=at[i]-halfWidth,hi=at[i]+1+halfWidth;
  if(d[i]===0){if(start[i]<lo-EPS||start[i]>hi+EPS)return null;continue;}
  const t0=(lo-start[i])/d[i],t1=(hi-start[i])/d[i];
  enter=Math.max(enter,Math.min(t0,t1));exit=Math.min(exit,Math.max(t0,t1));
 }
 if(exit<-EPS||enter>1+EPS||enter>exit+EPS)return null;
 return Math.min(1,Math.max(0,enter));
}
const route=(wall,plane,rootAtEnd,target,order)=>{
 const [x,,z]=wall,s=rootAtEnd?-1:1;
 const p=plane==='x'?[x+s,6,z]:[x,6,z+s],out=[[...p]];
 for(const dim of (order==='x-first'?[0,2]:[2,0])){
  while(p[dim]!==target[dim]){p[dim]+=Math.sign(target[dim]-p[dim]);out.push([...p]);}
 }
 if(out.length<2||out.length>12)throw RangeError('D45 authenticated D43 bounded Y6 L path');
 return out;
};
/** Exactly D43's two orders and D44's SAME full-prism collision authority.
 * Positions are classified by first FAILED SEGMENT, not misrepresented as
 * first contact along a global straight line. Independent slab entry is
 * recomputed for every actual authored voxel on that segment. */
export function inspectD45OriginalSourceLAnatomy(wall,plane,rootAtEnd,target,src,socket){
 check(wall,plane,rootAtEnd,src,socket);
 if(!integer3(target)||target[1]!==6||target[0]===wall[0]&&target[2]===wall[2])
  throw TypeError('D45 requires a real original-source prospective Y6 support site');
 const attempts=[];
 for(const order of ['x-first','z-first']){
  const points=route(wall,plane,rootAtEnd,target,order);let result=null;
  for(let i=1;i<points.length;i++){
   const physical=inspectD44FirstPrismBlocker(points[i-1],points[i],src,{socketBounds:socket});
   if(physical.sourceClear)continue;
   const ordered=physical.originalSolidWitnesses.map(v=>({
    at:v.at,role:v.role,asset:v.asset,
    firstFraction:d45SourceVoxelEntryFraction(points[i-1],points[i],v.at)
   })).filter(v=>v.firstFraction!==null).sort((a,b)=>a.firstFraction-b.firstFraction||
     a.at[0]-b.at[0]||a.at[1]-b.at[1]||a.at[2]-b.at[2]);
   if(ordered.length!==physical.sourceCollisionEvents)
    throw Error('D45 slab source entry disagrees with original D44 physical first-segment voxel census');
   const frac=ordered[0]?.firstFraction??null;
   const part=i===1?'socket-adjacent-first-segment':i===points.length-1?'near-proposed-support':'mid-route';
   result=Object.freeze({order,segmentIndex:i-1,totalSegments:points.length-1,
    class:part,from:Object.freeze(points[i-1]),to:Object.freeze(points[i]),
    representativeExactFirstContact:ordered[0]??null,originalSolidHits:ordered.length,
    sourceRoles:Object.freeze(ordered.map(v=>v.role)),
    walkingHits:physical.walkingBodyCollisionEvents,socketHits:physical.socketCollisionEvents,
    physicalContactPoint:frac===null?null:Object.freeze(points[i-1].map((v,j)=>v+.5+frac*(points[i][j]-v))),
    authorCellModifications:0,constructionAllowed:false});break;
  }
  if(!result)throw Error('D45 D43 source-authentic original Y6 candidate unexpectedly no longer blocked');
  if(result.originalSolidHits<1)throw Error('D45 protected Y6 original first-solid regression');
  attempts.push(result);
 }
 return Object.freeze({format:'mythwrought.builder-d.d45.authentic-original-first-prism-source-anatomy.v1',
  root:Object.freeze([...wall]),target:Object.freeze([...target]),twoSourceOriginalOrders:Object.freeze(attempts),
  originalFirstSourceHits:attempts.reduce((t,a)=>t+a.originalSolidHits,0),
  originalSourceEdits:0,physicalSocketTieAttachment:false,independentFootingRated:false,
  noWorldEdits:true,constructionAllowed:false});
}
/** A DIFFERENT hypothetical fractional 2-segment face-rail near the root.
 * Start is outside the untouched wall; no attachment to D36 socket is claimed.
 * Entire segment and shared corner occupied volumes are scanned (not points).
 * This is NOT D40's original integer-center grid, and is never registered. */
export function inspectD45FractionalExteriorDogleg(wall,plane,rootAtEnd,src,socket,{side=1,height=6,halfWidth=HW}={}){
 check(wall,plane,rootAtEnd,src,socket);
 if(![-1,1].includes(side)||![5,6].includes(height)||halfWidth!==HW)
  throw RangeError('D45 bounded authentic original side and Y5/Y6 fractional rail');
 const axis=plane==='x'?0:2,other=axis===0?2:0,sign=rootAtEnd?-1:1;
 const p0=[wall[0]+.5,height+.5,wall[2]+.5];p0[axis]+=sign*.94;p0[other]+=side*.28;
 const p1=[...p0];p1[axis]+=sign*.50;
 const p2=[...p1];p2[other]+=side*1.0;
 const path=[p0,p1,p2],bounds=[],observations={solid:0,body:0,socket:0};
 for(let j=1;j<path.length;j++){
  const a=path[j-1],b=path[j],vol=mk(a.map((v,i)=>Math.min(v,b[i])-halfWidth),
   a.map((v,i)=>Math.max(v,b[i])+halfWidth));bounds.push(vol);
  const lo=vol.min.map(v=>Math.floor(v+EPS)),hi=vol.max.map(v=>Math.ceil(v-EPS)-1);
  const count=lo.reduce((s,v,i)=>s*(hi[i]-v+1),1);
  if(count<1||count>32)throw RangeError('D45 bounded fractional full-segment source occupancy');
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   if(src.get(x,y,z)&&intersect(vol,mk([x,y,z],[x+1,y+1,z+1])))observations.solid++;
   if(src.nav.has(`${x},2,${z}`)&&intersect(vol,mk([x+.2,2,z+.2],[x+.8,4.5,z+.8])))observations.body++;
  }
  if(intersect(vol,socket))observations.socket++;
 }
 return Object.freeze({format:'mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,height,side,
  path:Object.freeze(path.map(p=>Object.freeze(p))),fullPrismBounds:Object.freeze(bounds),
  originalSourceSolidCollisionEvents:observations.solid,
  authoredWalkingBodyCollisionEvents:observations.body,
  originalD36SocketVolumeCollisionEvents:observations.socket,
  sourceAndWalkingClear:observations.solid===0&&observations.body===0,
  allPhysicalVolumesClear:Object.values(observations).every(v=>v===0),
  originalID61PaletteNotARegisteredVariant:true,sourceToSocketPhysicalFastenerAbsent:true,
  newTerrainFoundationUnknown:true,originalCellsWritten:0,constructionAllowed:false});
}

/** Independent colored triangular preview of both fractional physical prisms,
 * never a registered Pack2 shape or a production join-cap. A ray against the
 * colored triangle mesh must match the analytic original-source AABB surface. */
export function sampleD45OriginalPaletteFractionalRay(inspection,originalID61Palette){
 if(inspection?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  inspection.fullPrismBounds?.length!==2||
  JSON.stringify(originalID61Palette?.metal)!=='[0.29,0.32,0.33]'||
  JSON.stringify(originalID61Palette?.base)!=='[0.4,0.24,0.17]')
  throw TypeError('D45 genuine original Pack2 ID61 palette and unregistered full-prism geometry required');
 const faces=b=>{const [x,y,z]=b.min,[X,Y,Z]=b.max;
  return [[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[[x,y,Z],[x,Y,Z],[X,Y,Z],[X,y,Z]],
   [[x,y,z],[x,Y,z],[x,Y,Z],[x,y,Z]],[[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],
   [[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]]];};
 const positions=[],colors=[],indices=[];
 for(const vol of inspection.fullPrismBounds)for(const quad of faces(vol)){
  const base=positions.length/3;
  for(const p of quad){positions.push(...p);colors.push(...originalID61Palette.metal);}
  indices.push(base,base+1,base+2,base,base+2,base+3);
 }
 const mesh={positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)};
 const vol=inspection.fullPrismBounds[0],from=[(vol.min[0]+vol.max[0])/2,(vol.min[1]+vol.max[1])/2,vol.min[2]-1];
 // Dynamically resolved local pure geometry only, not original live picking.
 const ray=localMeshRay(mesh,from,[0,0,1],4);
 if(ray===null||Math.abs(ray-1)>1e-5)throw Error('D45 independent physical AABB/ray mesh parity lost');
 return Object.freeze({sourcePaletteID:61,sourceOwnerOriginalMeshNotReplaced:true,
  coloredTriangles:mesh.indices.length/3,mesh,analyticRayDistance:1,actualMeshRayDistance:ray,
  maxRayDisagreement:Math.abs(ray-1),actualRegisteredVariant:false,
  actualProductionGamePickingAccepted:false,constructionAllowed:false});
}
// Minimal independent triangle ray equivalent to the established pure D31
// mesh intersection, with strict finite original-author typed buffers.
function localMeshRay(mesh,origin,direction,maxDistance){
 let best=Infinity;
 const px=mesh.positions,idx=mesh.indices;
 for(let i=0;i<idx.length;i+=3){
  const a=[...px.slice(3*idx[i],3*idx[i]+3)],
   b=[...px.slice(3*idx[i+1],3*idx[i+1]+3)],
   c=[...px.slice(3*idx[i+2],3*idx[i+2]+3)],
   e1=b.map((v,k)=>v-a[k]),e2=c.map((v,k)=>v-a[k]),
   cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],
   dot=(u,v)=>u.reduce((s,w,k)=>s+w*v[k],0),p=cross(direction,e2),det=dot(e1,p);
  if(Math.abs(det)<1e-10)continue;
  const inverse=1/det,t=origin.map((v,k)=>v-a[k]),u=dot(t,p)*inverse;
  if(u<-1e-8||u>1+1e-8)continue;
  const q=cross(t,e1),v=dot(direction,q)*inverse;
  if(v<-1e-8||u+v>1+1e-8)continue;
  const distance=dot(e2,q)*inverse;
  if(distance>=0&&distance<=maxDistance&&distance<best)best=distance;
 }
 return best===Infinity?null:best;
}
