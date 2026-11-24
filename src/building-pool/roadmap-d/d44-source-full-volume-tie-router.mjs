// MYTHWROUGHT Builder D44: original-source-only diagnostic of EXTERIOR hypothetical
// outboard ties. No playable geometry, world edit, new Pack owner, anchor or rating.
// Keep D43's candidate shortlist and D40's literal square-prism sweep authority.
import {probeD40ActualStrapSweep} from './d40-swept-exterior-capture.mjs';
import {inspectD43IndependentOutboardSupport} from './d43-source-backed-outboard-support.mjs';
const EPS=1e-8, HW=.08, MOVES=Object.freeze([[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]]);
const key=a=>a.join(',');
const valid3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const overlap=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const box=(min,max)=>({min,max});
const footprint=(p)=>box(p.map(x=>x+.5-HW),p.map(x=>x+.5+HW));
const validate=(wall,plane,rootAtEnd,source,socket)=>{
 if(!valid3(wall)||wall[1]!==6||!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||!socket||
  !Array.isArray(socket.min)||!Array.isArray(socket.max)||
  !socket.min.every(Number.isFinite)||!socket.max.every(Number.isFinite)||
  socket.min.some((v,i)=>!(v<socket.max[i]))||
  source.get(wall[0],0,wall[2])?.role!=='foundation'||
  source.get(wall[0],1,wall[2])?.role!=='floor'||
  !['wall','partition','column'].includes(source.get(...wall)?.role)||
  source.get(wall[0],7,wall[2])?.asset!=='live:wood')
  throw TypeError('D44 genuine immutable original root, intact weather roof and D36 socket required');
};
/** Identify the ACTUAL original source cell occupying a swept prism, not merely
 * a blocked center point. Recheck literal D40 primitive verdict independently.
 * Witness order is traversal order, so `first` is the first blocked SEGMENT,
 * not a falsely claimed continuous first-contact raycast within the prism. */
export function inspectD44FirstPrismBlocker(a,b,source,{socketBounds=null}={}){
 if(!valid3(a)||!valid3(b)||a.reduce((s,v,i)=>s+Math.abs(v-b[i]),0)!==1||
  typeof source?.get!=='function'||!(source.nav instanceof Set))
  throw TypeError('D44 full six-connected original owner prism required');
 const native=probeD40ActualStrapSweep(a,b,source,{halfWidth:HW,socketBounds}),vol=native.bounds,
  lo=vol.min.map(v=>Math.floor(v+EPS)),hi=vol.max.map(v=>Math.ceil(v-EPS)-1),solids=[],bodies=[];
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  if(!overlap(vol,box([x,y,z],[x+1,y+1,z+1])))continue;
  const c=source.get(x,y,z);
  if(c)solids.push(Object.freeze({at:Object.freeze([x,y,z]),role:c.role??null,asset:c.asset??null}));
  if(source.nav.has(`${x},2,${z}`)&&overlap(vol,box([x+.2,2,z+.2],[x+.8,4.5,z+.8])))
   bodies.push(Object.freeze([x,2,z]));
 }
 if(solids.length!==native.originalSourceCollisionEvents||
  bodies.length!==native.authoredWalkBodyCollisionEvents)
  throw Error('D44 independent original full-prism blocker attribution disagrees with D40');
 const result=Object.freeze({from:Object.freeze([...a]),to:Object.freeze([...b]),
  bounds:native.bounds,sourceCollisionEvents:solids.length,walkingBodyCollisionEvents:bodies.length,
  socketCollisionEvents:native.socketCollisionEvents,firstOriginalSolid:solids[0]??null,
  firstAuthoredWALK:bodies[0]??null,
  originalSolidWitnesses:Object.freeze(solids),walkingBodyWitnesses:Object.freeze(bodies),
  sourceClear:native.clearedEntireStraightPhysicalEnvelope,
  noProtectedTerrainRemovalAuthorized:true,constructionAllowed:false});
 if(result.sourceClear!==(result.sourceCollisionEvents===0&&result.walkingBodyCollisionEvents===0&&result.socketCollisionEvents===0))
  throw Error('D44 physical source sweep verdict inconsistent');
 return result;
}
const lPath=(wall,plane,rootAtEnd,target,order)=>{
 const sign=rootAtEnd?-1:1,[x,,z]=wall,front=plane==='x'?[x+sign,6,z]:[x,6,z+sign],out=[[...front]];
 let p=[...front];
 for(const axis of (order==='x-first'?[0,2]:[2,0])){
  while(p[axis]!==target[axis]){const q=[...p];q[axis]+=Math.sign(target[axis]-q[axis]);out.push(q);p=q;}
 }
 if(out.length>12)throw RangeError('D44 D43 original Y6 first-blocker L route budget exceeded');
 return out;
};
function nodeClear(p,source,socket){
 if(source.get(...p))return false;
 const volume=footprint(p);
 if(overlap(volume,socket))return false;
 if(source.nav.has(`${p[0]},2,${p[2]}`)&&
  overlap(volume,box([p[0]+.2,2,p[2]+.2],[p[0]+.8,4.5,p[2]+.8])))return false;
 return true;
}
/** Bounded independent six-connected 3D BFS, not just D43's two ordered Y6 Ls.
 * Every edge is admitted by ORIGINAL D40 complete swept physical geometry,
 * including vertical/horizontal bends. A center-only path is insufficient. */
function reach(wall,front,source,socket,levels,cache,totals,{radius=4,maxNodes=256,maxEdges=900}={}){
 const [x,,z]=wall,L=new Set(levels),inBounds=p=>Math.abs(p[0]-x)<=radius&&
  Math.abs(p[2]-z)<=radius&&L.has(p[1])&&!(p[0]===x&&p[2]===z),
  initial=front,seen=new Map();
 if(!inBounds(initial)||!nodeClear(initial,source,socket))return seen;
 const queue=[[...initial]];seen.set(key(initial),{at:queue[0],parent:null});
 for(let i=0;i<queue.length;i++){
  if(i>=maxNodes)throw RangeError('D44 genuine original-source bounded BFS node budget');
  const a=queue[i];
  for(const move of MOVES){const b=a.map((v,j)=>v+move[j]);
   if(!inBounds(b)||seen.has(key(b))||!nodeClear(b,source,socket))continue;
   const ka=key(a),kb=key(b),ek=ka<kb?`${ka}|${kb}`:`${kb}|${ka}`;
   let q=cache.get(ek);
   if(!q){
    if(cache.size>=maxEdges)throw RangeError('D44 genuine physical edge exploration budget');
    q=inspectD44FirstPrismBlocker(a,b,source,{socketBounds:socket});cache.set(ek,q);
    totals.uniqueFullThicknessEdges++;
    totals.sourceEdgeVetoEvents+=q.sourceCollisionEvents;
    totals.walkEdgeVetoEvents+=q.walkingBodyCollisionEvents;
    totals.socketEdgeVetoEvents+=q.socketCollisionEvents;
   }
   if(!q.sourceClear)continue;
   const entry={at:b,parent:ka};seen.set(kb,entry);queue.push(b);
  }
 }
 return seen;
}
function recovered(seen,target,source,socket){
 let e=seen.get(key(target));if(!e)return null;
 const path=[];while(e){path.push(e.at);e=e.parent?seen.get(e.parent):null;}
 path.reverse();
 for(let i=1;i<path.length;i++){
  const physical=probeD40ActualStrapSweep(path[i-1],path[i],source,{halfWidth:HW,socketBounds:socket});
  if(!physical.clearedEntireStraightPhysicalEnvelope)throw Error('D44 cached shortest candidate contradicts actual complete physical prism');
 }
 return Object.freeze({path:Object.freeze(path.map(p=>Object.freeze([...p]))),
  fullThicknessEdges:path.length-1,lowestCourse:Math.min(...path.map(p=>p[1])),
  bends:path.slice(2).filter((p,i)=>{
   const a=path[i],b=path[i+1],d1=p.map((v,k)=>v-b[k]),d0=b.map((v,k)=>v-a[k]);
   return d0.some((v,k)=>v!==d1[k]);
  }).length,actualSocketConnectionProven:false,independentFootingProven:false,
  sourceCellsModified:0,constructionAllowed:false});
}
/** D44 uses D43's EXACT nearest source-clear 12 hypothetical column locations.
 * The output is only a source-authentic geometrical research ledger. No actual
 * generated terrain, cave, borehole, concrete or strength evidence is assumed. */
export function inspectD44AlternateOriginalOutboardTie(wall,plane,rootAtEnd,source,{
 socketBounds,maxTieCandidates=12,maxSamples=3,radius=4
}={}){
 validate(wall,plane,rootAtEnd,source,socketBounds);
 if(!Number.isSafeInteger(maxTieCandidates)||maxTieCandidates<1||maxTieCandidates>12||
    !Number.isSafeInteger(maxSamples)||maxSamples<0||maxSamples>8||radius!==4)
  throw RangeError('D44 bounded genuine source footprint/bend sampling budget');
 const old=inspectD43IndependentOutboardSupport(wall,plane,rootAtEnd,source,{
  socketBounds,radius,maxTieCandidates,maxSamples:maxTieCandidates});
 if(old.constructionAllowed!==false||old.sourceClearExternalTieCorridors!==0||
    old.candidates.length!==old.candidateFootprintsExaminedForTies)
  throw Error('D44 D43 baseline Y6 source-only no-footing state drifted');
 const totals={originalD43NearestCandidatePositions:old.candidateFootprintsExaminedForTies,
  originalD43Y6LSourceClear:old.sourceClearExternalTieCorridors,
  baselineY6LPlansChecked:0,baselineFirstSolidBlockedPlans:0,
  baselineFirstWalkBlockedPlans:0,baselineFirstSocketBlockedPlans:0,
  baselineFirstBlockingSourceVoxelAtY4:0,baselineFirstBlockingSourceVoxelAtY5:0,
  baselineFirstBlockingSourceVoxelAtY6:0,
  originalY6BFSReachableCandidatePositions:0,
  y5PermittedBFSReachableCandidatePositions:0,
  y4PermittedBFSReachableCandidatePositions:0,
  newlyReachableWithY5:0,newlyReachableWithY4:0,
  uniqueFullThicknessEdges:0,sourceEdgeVetoEvents:0,walkEdgeVetoEvents:0,socketEdgeVetoEvents:0,
  sourceApprovedFootings:0,verifiedGeneratedTerrainGround:0,
  actualRatedFastenerConnections:0,worldCellWrites:0};
 const [x,,z]=wall,s=rootAtEnd?-1:1,
  front=plane==='x'?[x+s,6,z]:[x,6,z+s],edgeCache=new Map(),
  graph6=reach(wall,front,source,socketBounds,[6],edgeCache,totals),
  graph56=reach(wall,front,source,socketBounds,[5,6],edgeCache,totals),
  graph456=reach(wall,front,source,socketBounds,[4,5,6],edgeCache,totals);
 const samples=[];
 for(const c of old.candidates){const target=[...c.at],results=[];
  for(const order of ['x-first','z-first']){
   const p=lPath(wall,plane,rootAtEnd,target,order);
   let blocked=null;
   for(let j=1;j<p.length;j++){
    const q=inspectD44FirstPrismBlocker(p[j-1],p[j],source,{socketBounds});
    if(!q.sourceClear){blocked=q;break;}
   }
   totals.baselineY6LPlansChecked++;
   if(!blocked)throw Error('D44 authenticated D43 Y6 L rejection became a clear original route');
   if(blocked.sourceCollisionEvents)totals.baselineFirstSolidBlockedPlans++;
   if(blocked.walkingBodyCollisionEvents)totals.baselineFirstWalkBlockedPlans++;
   if(blocked.socketCollisionEvents)totals.baselineFirstSocketBlockedPlans++;
   if(blocked.firstOriginalSolid){
    const y=blocked.firstOriginalSolid.at[1];if(y>=4&&y<=6)totals[`baselineFirstBlockingSourceVoxelAtY${y}`]++;
   }
   results.push({order,firstBlockedPhysicalSegment:blocked});
  }
  const p6=recovered(graph6,target,source,socketBounds),
   p56=recovered(graph56,target,source,socketBounds),
   p456=recovered(graph456,target,source,socketBounds);
  if(p6)totals.originalY6BFSReachableCandidatePositions++;
  if(p56)totals.y5PermittedBFSReachableCandidatePositions++;
  if(p456)totals.y4PermittedBFSReachableCandidatePositions++;
  if(p56&&!p6)totals.newlyReachableWithY5++;
  if(p456&&!p56)totals.newlyReachableWithY4++;
  if(p6&&!p56||p56&&!p456)throw Error('D44 course enlargement lost source-clear original route');
  if(samples.length<maxSamples)samples.push(Object.freeze({
   prospectiveColumnAt:Object.freeze(target),
   firstY6XThenZBlocker:results[0].firstBlockedPhysicalSegment?.firstOriginalSolid??null,
   firstY6ZThenXBlocker:results[1].firstBlockedPhysicalSegment?.firstOriginalSolid??null,
   blockedByWalking:results.some(v=>v.firstBlockedPhysicalSegment?.walkingBodyCollisionEvents>0),
   boundedY6ShortestPath:p6,boundedY5ShortestPath:p56,boundedY4ShortestPath:p456,
   originalGroundAndCavesUnverified:true,
   actualSocketFastenerUnverified:true,constructionAllowed:false}));
 }
 if(totals.baselineY6LPlansChecked!==2*totals.originalD43NearestCandidatePositions||
   totals.y4PermittedBFSReachableCandidatePositions<totals.y5PermittedBFSReachableCandidatePositions||
   totals.y5PermittedBFSReachableCandidatePositions<totals.originalY6BFSReachableCandidatePositions)
  throw Error('D44 original lateral route tallies inconsistent');
 return Object.freeze({format:'mythwrought.builder-d.d44.original-source-outboard-alternate-bend-v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,sourceOriginalOwnerId:61,
  originalSourceGroundIsNotGeneratedTerrain:true,
  y4StandingWALKEnvelopeIsHardVeto:true,
  entireFullThicknessStrapAndBendsChecked:true,
  sourceColoredOwnerOnlyNotRegisteredNewMaterial:true,
  existingAuthoredSupportIsNotAnIndependentRatedAnchor:true,
  modelledColumnNeverPlaced:true,actualSocketInterfaceNotFastened:true,
  structuralRoofReleaseAccepted:false,constructionAllowed:false,
  ...totals,samples:Object.freeze(samples)});
}
