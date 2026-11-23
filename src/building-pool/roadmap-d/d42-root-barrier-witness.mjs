// MYTHWROUGHT Builder D42. Read-only exact finite grid barrier/dual-face study.
// No cut, drill, wall material modification, part registration, fastener,
// rated pullout, world mutation or roof construction is authorized.
import {inspectD41RootFailureCertificate} from './d41-finite-route-failure-certificate.mjs';
import {probeD40ActualStrapSweep} from './d40-swept-exterior-capture.mjs';
const EPS=1e-8,MOVES=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]];
const key=p=>p.join(','), int3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger),
 finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const volume=(p,h)=>({min:p.map(v=>v+.5-h),max:p.map(v=>v+.5+h)});
const intersects=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const cube=p=>({min:p,max:p.map(v=>v+1)});
const tangent=(a,b,w)=>{const aa=Math.atan2(a[2]-w[2],a[0]-w[0]),bb=Math.atan2(b[2]-w[2],b[0]-w[0]),d=bb-aa;return d>Math.PI?-1:d< -Math.PI?1:0;};
const ROOT_FACE_ROLES=new Set(['wall','partition','column']);
function centerCollision(p,source,socket,halfWidth){
 const box=volume(p,halfWidth),lo=box.min.map(v=>Math.floor(v+EPS)),hi=box.max.map(v=>Math.ceil(v-EPS)-1);
 let sourceCount=0,walkCount=0;
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  if(source.get(x,y,z)&&intersects(box,cube([x,y,z])))sourceCount++;
  if(source.nav.has(`${x},2,${z}`)&&intersects(box,{min:[x+.2,2,z+.2],max:[x+.8,4.5,z+.8]}))walkCount++;
 }
 return Object.freeze({originalSolid:sourceCount,authoredWalk:walkCount,
  socketEnvelope:Number(socket!==null&&intersects(box,socket)),
  clear:sourceCount===0&&walkCount===0&&!(socket&&intersects(box,socket))});
}
function heapPush(h,e){h.push(e);for(let i=h.length-1;i>0;){const p=(i-1)>>1;if(h[p].score<=h[i].score)break;[h[p],h[i]]=[h[i],h[p]];i=p;}}
function heapPop(h){const first=h[0],last=h.pop();if(!h.length)return first;h[0]=last;for(let i=0;;){let a=i*2+1,b=a+1,min=i;if(a<h.length&&h[a].score<h[min].score)min=a;if(b<h.length&&h[b].score<h[min].score)min=b;if(min===i)break;[h[i],h[min]]=[h[min],h[i]];i=min;}return first;}
const neighbors=(p,sites)=>MOVES.map(d=>p.map((v,i)=>v+d[i])).filter(q=>sites.has(key(q)));
function minBlockedCenterRoute(sites,front,rear){
 if(!front.length||!rear.length)return {minimumBlockedCenters:null,path:[],vetoes:[],reachable:false};
 const dist=new Map(),parent=new Map(),h=[];
 // Every invalid center has cost ONE regardless of whether it has multiple
 // overlapping source/WALK vetoes; exact shortest path over this CENTER grid.
 for(const p of front){const k=key(p),n=sites.get(k),d=Number(!n.hit.clear);
  dist.set(k,d*10000);heapPush(h,{p,score:d*10000});}
 const targets=new Set(rear.map(key));let target=null;
 while(h.length){const e=heapPop(h),k=key(e.p);if(e.score!==dist.get(k))continue;
  if(targets.has(k)){target=k;break;}
  for(const q of neighbors(e.p,sites)){
   const k2=key(q),weight=Number(!sites.get(k2).hit.clear)*10000+1,score=e.score+weight;
   if(score<(dist.get(k2)??Infinity)){dist.set(k2,score);parent.set(k2,k);heapPush(h,{p:q,score});}
  }
 }
 if(target===null)return {minimumBlockedCenters:null,path:[],vetoes:[],reachable:false};
 const path=[];for(let k=target;k!==undefined;k=parent.get(k))path.push(sites.get(k).p);path.reverse();
 const vetoes=path.filter(p=>!sites.get(key(p)).hit.clear).map(p=>({at:p,...sites.get(key(p)).hit}));
 return {minimumBlockedCenters:vetoes.length,path,vetoes,reachable:true};
}
function centerComponentAndFrontier(sites,front){
 const seen=new Set(front.map(key)),queue=front.slice(),boundary=new Map();
 for(let i=0;i<queue.length;i++)for(const q of neighbors(queue[i],sites)){
  const k=key(q),n=sites.get(k);
  if(!n.hit.clear){boundary.set(k,n);continue;}
  if(!seen.has(k)){seen.add(k);queue.push(q);}
 }
 return {seen,queue,boundary};
}
function sweepCycleStudy(sites,front,rear,wall,source,socket,halfWidth){
 if(!front.length||!rear.length)return {fundamentalCycles:0,nonzeroWindingCycles:0,reachableRear:false,
  reachableQuadrants:[],numberOfReachableNodes:0,possibleNonzeroWinding:false};
 const clear=new Map([...sites].filter(([,v])=>v.hit.clear).map(([k,v])=>[k,v.p]));
 const edgeCache=new Map();
 const checked=(a,b)=>{const ak=key(a),bk=key(b),id=ak<bk?ak+'|'+bk:bk+'|'+ak;
  if(edgeCache.has(id))return edgeCache.get(id);
  const r=probeD40ActualStrapSweep(a,b,source,{halfWidth,socketBounds:socket});
  edgeCache.set(id,r.clearedEntireStraightPhysicalEnvelope);return r.clearedEntireStraightPhysicalEnvelope;};
 const target=new Set(rear.map(key));
 const components=[];
 for(const start of front){
  const seen=new Set([key(start)]),treeW=new Map([[key(start),0]]),q=[start];
  let cycles=0,nonzero=0;
  for(let i=0;i<q.length;i++)for(const b of neighbors(q[i],clear)){
   const a=q[i],ak=key(a),bk=key(b);if(!checked(a,b))continue;
   const delta=tangent(a,b,wall);
   if(!seen.has(bk)){seen.add(bk);treeW.set(bk,treeW.get(ak)+delta);q.push(b);}
   else if(ak<bk){cycles++;
    if(treeW.get(ak)+delta-treeW.get(bk)!==0)nonzero++;
   }
  }
  const quadrant=new Set(q.map(p=>`${p[0]-wall[0]>=0?'+':'-'}x${p[2]-wall[2]>=0?'+':'-'}z`));
  const result={fundamentalCycles:cycles,nonzeroWindingCycles:nonzero,
   reachableRear:rear.some(p=>seen.has(key(p))),reachableQuadrants:[...quadrant].sort(),
   numberOfReachableNodes:seen.size,possibleNonzeroWinding:nonzero>0};
  if(result.reachableRear)return result;
  components.push(result);
 }
 return components.sort((a,b)=>b.numberOfReachableNodes-a.numberOfReachableNodes)[0];
}
/** D42 exact bounded-source witness. Minimum-blocked-center means fewest
 * hypothetical occupied 0.16-thick center positions on ONE 6-connected path;
 * it is NOT a minimum vertex cut, a safe carving instruction, a swept-volume
 * route or a tested wall/foundation fastener. Original data are read-only. */
export function inspectD42OriginalBarrierWitness(wall,plane,rootAtEnd,source,{
 radius=4,levels=[3,4,5,6],halfWidth=.08,socketBounds=null,
 maxCenterSites=400,maxRecordedWitnessSites=24
}={}){
 if(!int3(wall)||!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
    radius!==4||JSON.stringify(levels)!=='[3,4,5,6]'||halfWidth!==.08||
    !Number.isSafeInteger(maxCenterSites)||maxCenterSites<200||maxCenterSites>400||
    !Number.isSafeInteger(maxRecordedWitnessSites)||maxRecordedWitnessSites<4||maxRecordedWitnessSites>64||
    (socketBounds!==null&&(!finite3(socketBounds.min)||!finite3(socketBounds.max)||
     socketBounds.min.some((v,i)=>v>=socketBounds.max[i]))))
   throw TypeError('D42 exact source-rooted D41 geometry and safe witness budgets required');
 const prior=inspectD41RootFailureCertificate(wall,plane,rootAtEnd,source,{radius,levels,halfWidth,socketBounds});
 const sites=new Map(),[x,,z]=wall,sgn=rootAtEnd?-1:1;
 for(let a=x-radius;a<=x+radius;a++)for(let c=z-radius;c<=z+radius;c++){
  if(a===x&&c===z)continue;for(const y of levels){const p=[a,y,c],k=key(p),hit=centerCollision(p,source,socketBounds,halfWidth);
   sites.set(k,{p,hit});if(sites.size>maxCenterSites)throw RangeError('D42 bounded center graph size');
  }
 }
 const f=plane==='x'?[x+sgn,z]:[x,z+sgn],r=plane==='x'?[x-sgn,z]:[x,z-sgn],
  front=levels.filter(y=>y>=5).map(y=>[f[0],y,f[1]]).filter(p=>sites.get(key(p)).hit.clear),
  rear=levels.filter(y=>y>=5).map(y=>[r[0],y,r[1]]).filter(p=>sites.get(key(p)).hit.clear);
 if(prior.admissibleCenters!==[...sites.values()].filter(v=>v.hit.clear).length||
    JSON.stringify(front.map(p=>p[1]))!==JSON.stringify(prior.availableFrontHeights)||
    JSON.stringify(rear.map(p=>p[1]))!==JSON.stringify(prior.availableRearHeights))
  throw Error('D42 authentic original D41 center/entry provenance mismatch');
 const {seen,queue,boundary}=centerComponentAndFrontier(sites,front),
  hypothetical=minBlockedCenterRoute(sites,front,
   levels.filter(y=>y>=5).map(y=>[r[0],y,r[1]])),
  centerRear=rear.some(p=>seen.has(key(p)));
 if(centerRear!==prior.centerGraphFrontToRearConnected)
  throw Error('D42 front component differs from exact original D41 source');
 const frontierByType={solid:0,walk:0,socket:0};
 for(const {hit} of boundary.values()){
  frontierByType.solid+=Number(hit.originalSolid>0);
  frontierByType.walk+=Number(hit.authoredWalk>0);
  frontierByType.socket+=Number(hit.socketEnvelope>0);
 }
 // Discover SIDE-face source candidates when the required rear position itself
 // is obstructed. These are tangential supports, NOT backface tensile capture.
 const sideOffsets=plane==='x'?[[0,1],[0,-1]]:[[1,0],[-1,0]];
 const sideFaceCandidates=[];
 for(const [dx,dz] of sideOffsets)for(const y of [5,6]){
  const p=[x+dx,y,z+dz],site=sites.get(key(p)),role=source.get(x,y,z)?.role;
  if(!ROOT_FACE_ROLES.has(role))continue;
  const clear=site?.hit.clear??false;
  sideFaceCandidates.push(Object.freeze({at:p,wallRole:role,sourceClear:clear,
   reachableFromFront:clear&&seen.has(key(p)),tensileBackRetentionProven:false}));
 }
 const cycle=prior.rootFailureCategory==='winding-or-closure-unavailable'?
   sweepCycleStudy(sites,front,rear,wall,source,socketBounds,halfWidth):null;
 if(cycle&&cycle.reachableRear!==prior.sweptGraphFrontToRearConnected)
  throw Error('D42 swept fundamental-cycle rear reachability differs from D41');
 const count=hypothetical.minimumBlockedCenters;
 return Object.freeze({format:'mythwrought.builder-d.d42.authentic-minimum-blocked-center-and-barrier-frontier.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,rootFailureCategory:prior.rootFailureCategory,
  originalD41CenterSites:prior.admissibleCenters,frontHeights:prior.availableFrontHeights,
  rearHeights:prior.availableRearHeights,frontReachableClearCenters:queue.length,
  centerGraphFrontRearConnected:centerRear,
  exactFrontBlockingFrontierSites:boundary.size,
  frontierSourceSolidSites:frontierByType.solid,
  frontierAuthoredWalkSites:frontierByType.walk,
  frontierSocketSites:frontierByType.socket,
  boundarySample:Object.freeze([...boundary.values()].slice(0,maxRecordedWitnessSites)
   .map(v=>Object.freeze({at:Object.freeze([...v.p]),...v.hit}))),
  hypotheticalMinimumBlockedCenters:count,
  hypotheticalMinimumBarrierPathLength:hypothetical.path.length,
  hypotheticalBlockedCenterOriginalSolidCount:hypothetical.vetoes.filter(v=>v.originalSolid).length,
  hypotheticalBlockedCenterWALKCount:hypothetical.vetoes.filter(v=>v.authoredWalk).length,
  hypotheticalBlockedCenterSocketCount:hypothetical.vetoes.filter(v=>v.socketEnvelope).length,
  minimumBarrierPathSample:Object.freeze(hypothetical.path.slice(0,maxRecordedWitnessSites).map(p=>Object.freeze([...p]))),
  minimumBlockedPositionsSample:Object.freeze(hypothetical.vetoes.slice(0,maxRecordedWitnessSites)
   .map(v=>Object.freeze({at:Object.freeze([...v.at]),solid:v.originalSolid,
    walk:v.authoredWalk,socket:v.socketEnvelope}))),
  sideFaceCandidates:Object.freeze(sideFaceCandidates),
  clearSideFaceCandidates:sideFaceCandidates.filter(v=>v.sourceClear).length,
  frontReachableSideFaceCandidates:sideFaceCandidates.filter(v=>v.reachableFromFront).length,
  sweptFundamentalCycleWitness:cycle?Object.freeze(cycle):null,
  minimumIsBlockedCENTERCountNotMinimalGraphCut:true,
  protectedBarrierSitesAreNeverRemovalOrCarvingInstructions:true,
  sideFaceShearNotProofOfAxialRearRetention:true,
  noContinuousMechanicalFastenerOrWallToFoundationRatedTension:true,
  noOriginalAuthorWallRoofNavigationOrWorldModified:true,
  constructionAllowed:false,registeredConnectorId:null,worldWrites:0});
}
