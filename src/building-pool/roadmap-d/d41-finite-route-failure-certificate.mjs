// D41: original-source-only diagnostic CERTIFICATE for D40 bounded swept routes.
// Never installs an anchor, registered collider, block ID, renderer or world edit.
// Counts CENTER connectivity separately from exact swept SEGMENT connectivity
// and projected nonzero winding. No empty space is a tensile load path.
const EPS=1e-8;
const MOVES=Object.freeze([[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]]);
const ROOT_ROLES=new Set(['foundation','floor','wall','partition','column','beam']);
const key=p=>p.join(',');
const valid3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const intersect=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const cube=(x,y,z)=>({min:[x,y,z],max:[x+1,y+1,z+1]});
const center=(p,t)=>({min:p.map(v=>v+.5-t),max:p.map(v=>v+.5+t)});
const segment=(a,b,t)=>({min:a.map((v,i)=>Math.min(v,b[i])+.5-t),max:a.map((v,i)=>Math.max(v,b[i])+.5+t)});
function witnessOriginal(wall,source){
 if(!valid3(wall)||wall[1]!==6||typeof source?.get!=='function'||!(source.nav instanceof Set)||
  source.get(wall[0],0,wall[2])?.role!=='foundation'||source.get(wall[0],1,wall[2])?.role!=='floor'||
  source.get(wall[0],7,wall[2])?.asset!=='live:wood'||
  !['wall','column','partition'].includes(source.get(...wall)?.role)||
  !Array.from({length:7},(_,y)=>ROOT_ROLES.has(source.get(wall[0],y,wall[2])?.role)).every(Boolean))
   throw Error('D41 authentic original Y0-Y7 foundation-backed wall and wood roof required');
}
function collision(b,source,socket,maxCells){
 const low=b.min.map(v=>Math.floor(v+EPS)),high=b.max.map(v=>Math.ceil(v-EPS)-1);
 const cells=low.reduce((n,x,i)=>n*(high[i]-x+1),1);
 if(!Number.isSafeInteger(cells)||cells<1||cells>maxCells)throw RangeError('D41 bounded real 3D owner-voxel envelope');
 let sourceHits=0,walkHits=0;
 for(let x=low[0];x<=high[0];x++)for(let y=low[1];y<=high[1];y++)for(let z=low[2];z<=high[2];z++){
  if(source.get(x,y,z)&&intersect(b,cube(x,y,z)))sourceHits++;
  if(source.nav.has(`${x},2,${z}`)&&intersect(b,{min:[x+.2,2,z+.2],max:[x+.8,4.5,z+.8]}))walkHits++;
 }
 return Object.freeze({solid:sourceHits,body:walkHits,socket:Number(socket!==null&&intersect(b,socket))});
}
const angle=(p,wall)=>Math.atan2(p[2]-wall[2],p[0]-wall[0]);
const winding=(a,b,wall)=>{const delta=angle(b,wall)-angle(a,wall);return delta>Math.PI?-1:delta< -Math.PI?1:0;};
const classify=(front,rear,centerRear,sweptRear,closed)=>{
 if(closed)return 'complete-bounded-route';
 if(!front.length&&!rear.length)return 'front-and-rear-source-entries-blocked';
 if(!front.length)return 'front-source-entry-blocked';
 if(!rear.length)return 'rear-source-entry-blocked';
 if(!centerRear)return 'center-graph-disconnected';
 if(!sweptRear)return 'swept-segment-graph-disconnected';
 return 'winding-or-closure-unavailable';
};
/** Completely read-only, independent D40-style bounded topology audit.
 * Center-only and exact finite square-prism edge graphs are kept separate.
 * Six-connected moves, original Y2 WALK standing probe, full wall column veto,
 * actual D36 socket AABB, original Y0/Y1 foundation, Y7 roof unchanged.
 */
export function inspectD41RootFailureCertificate(wall,plane,rootAtEnd,source,{
 radius=4,levels=[3,4,5,6],halfWidth=.08,socketBounds=null,
 maxSweptEdges=2400,maxStates=16000,maxPrismCells=32
}={}){
 witnessOriginal(wall,source);
 if(!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
  !Number.isSafeInteger(radius)||radius<2||radius>4||
  !Array.isArray(levels)||levels.length<2||levels.length>4||
  levels.some((y,i)=>!Number.isSafeInteger(y)||y<3||y>6||(i>0&&y<=levels[i-1]))||
  !Number.isFinite(halfWidth)||halfWidth<.055||halfWidth>.18||
  !Number.isSafeInteger(maxSweptEdges)||maxSweptEdges<16||maxSweptEdges>3000||
  !Number.isSafeInteger(maxStates)||maxStates<64||maxStates>25000||
  !Number.isSafeInteger(maxPrismCells)||maxPrismCells<8||maxPrismCells>64||
  (socketBounds!==null&&(!finite3(socketBounds.min)||!finite3(socketBounds.max)||
   socketBounds.min.some((v,i)=>v>=socketBounds.max[i]))))
  throw TypeError('D41 exact approved diagnostic search settings only');
 const x=wall[0],z=wall[2],sign=rootAtEnd?-1:1;
 const f=plane==='x'?[x+sign,z]:[x,z+sign],r=plane==='x'?[x-sign,z]:[x,z-sign];
 const open=new Map(),rejected={solid:0,body:0,socket:0},frontReasons=[],rearReasons=[];
 let inspected=0;
 for(let a=x-radius;a<=x+radius;a++)for(let c=z-radius;c<=z+radius;c++){
  if(a===x&&c===z)continue;
  for(const y of levels){const p=[a,y,c],hit=collision(center(p,halfWidth),source,socketBounds,maxPrismCells);inspected++;
   for(const type of Object.keys(rejected))if(hit[type])rejected[type]++;
   if(!hit.solid&&!hit.body&&!hit.socket)open.set(key(p),p);
   if(y>=5&&a===f[0]&&c===f[1])frontReasons.push(Object.freeze({course:y,...hit}));
   if(y>=5&&a===r[0]&&c===r[1])rearReasons.push(Object.freeze({course:y,...hit}));
  }
 }
 const fronts=frontReasons.filter(p=>!p.solid&&!p.body&&!p.socket).map(p=>[f[0],p.course,f[1]]);
 const rears=rearReasons.filter(p=>!p.solid&&!p.body&&!p.socket).map(p=>[r[0],p.course,r[1]]);
 const neighbors=p=>MOVES.map(d=>p.map((v,i)=>v+d[i])).filter(p=>open.has(key(p)));
 const centerReached=new Set(fronts.map(key)),centerQueue=[...fronts];
 for(let i=0;i<centerQueue.length;i++)for(const p of neighbors(centerQueue[i])){
  const k=key(p);if(centerReached.has(k))continue;centerReached.add(k);centerQueue.push(p);
 }
 // Include a count of center-only source-vacant components: a graph cut may
 // preclude any full wrap independently of socket anchor strength.
 const allSeen=new Set(),components=[];
 for(const p of open.values()){const start=key(p);if(allSeen.has(start))continue;
  const q=[p];allSeen.add(start);for(let i=0;i<q.length;i++)for(const n of neighbors(q[i])){
   const k=key(n);if(!allSeen.has(k)){allSeen.add(k);q.push(n);}
  }components.push(q.length);
 }
 const edgeCache=new Map(),edgeVeto={solid:0,body:0,socket:0},edgeEligible={tested:0,clear:0};
 function edge(a,b){const ak=key(a),bk=key(b),k=ak<bk?`${ak}|${bk}`:`${bk}|${ak}`;
  if(edgeCache.has(k))return edgeCache.get(k);
  if(++edgeEligible.tested>maxSweptEdges)throw RangeError('D41 real finite swept edge budget');
  const d=a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0);
  if(d!==1)throw Error('D41 non-six-connected source path');
  const hit=collision(segment(a,b,halfWidth),source,socketBounds,maxPrismCells),valid=!hit.solid&&!hit.body&&!hit.socket;
  for(const type of Object.keys(edgeVeto))if(hit[type])edgeVeto[type]++;
  if(valid)edgeEligible.clear++;edgeCache.set(k,valid);return valid;
 }
 const sweptReached=new Set(fronts.map(key)),sweptQueue=[...fronts];
 for(let i=0;i<sweptQueue.length;i++)for(const p of neighbors(sweptQueue[i])){
  if(!edge(sweptQueue[i],p))continue;const k=key(p);if(sweptReached.has(k))continue;
  sweptReached.add(k);sweptQueue.push(p);
 }
 const centerRear=rears.some(p=>centerReached.has(key(p))),sweptRear=rears.some(p=>sweptReached.has(key(p)));
 let closed=false,windingStates=0,visitedRearWithWinding=0;
 // Separate nonzero-winding state proof from ordinary reachability. A path
 // from front to back is not by itself an enclosing mechanical retainer.
 if(fronts.length&&rears.length&&sweptRear){
  for(const start of fronts){const q=[{p:start,w:0,back:false}],seen=new Set([`${key(start)}|0|0`]);
   for(let i=0;i<q.length;i++){
    if(++windingStates>maxStates)throw RangeError('D41 bounded certified winding graph budget');
    const n=q[i];for(const p of neighbors(n.p)){
     if(!edge(n.p,p))continue;
     const w=n.w+winding(n.p,p,wall);if(Math.abs(w)>1)continue;
     const back=n.back||(p[0]===r[0]&&p[2]===r[1]&&p[1]>=5);
     if(back)visitedRearWithWinding++;
     if(key(p)===key(start)&&Math.abs(w)===1&&back){closed=true;break;}
     const k=`${key(p)}|${w}|${Number(back)}`;
     if(!seen.has(k)){seen.add(k);q.push({p,w,back});}
    }if(closed)break;
   }if(closed)break;
  }
 }
 const reason=classify(fronts,rears,centerRear,sweptRear,closed);
 return Object.freeze({format:'mythwrought.builder-d.d41.original-source-swept-route-failure-certificate.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,radius,levels:Object.freeze([...levels]),halfWidth,
  frontHeightReasons:Object.freeze(frontReasons),rearHeightReasons:Object.freeze(rearReasons),
  availableFrontHeights:Object.freeze(fronts.map(p=>p[1])),availableRearHeights:Object.freeze(rears.map(p=>p[1])),
  inspectedCenters:inspected,admissibleCenters:open.size,
  centerSolidVetoes:rejected.solid,centerWalkingVetoes:rejected.body,centerSocketVetoes:rejected.socket,
  centerConnectedComponents:components.length,largestCenterComponent:Math.max(0,...components),
  centerGraphFrontReachable: centerReached.size, centerGraphFrontToRearConnected:centerRear,
  sweptGraphFrontReachable:sweptReached.size,sweptGraphFrontToRearConnected:sweptRear,
  finiteSweptEdgesTested:edgeEligible.tested,finiteSweptEdgesClear:edgeEligible.clear,
  edgeOriginalVetoes:edgeVeto.solid,edgeWalkingVetoes:edgeVeto.body,edgeSocketVetoes:edgeVeto.socket,
  windingStates,reachableRearWindingStates:visitedRearWithWinding,
  completeSweptLoop:closed,rootFailureCategory:reason,
  originalSourceOnly:true,socketAABBIsConservativeNotExactConvex:true,
  noNewAnchorOrIndependentRearFastener:true,exteriorCenterConnectivityNotWallToFoundationRetention:true,
  originalOriginalRoofAndWalkProtected:true,normalisedTensileForceIsNotRatedStrength:true,
  constructionAllowed:false,registeredSourceOwner:false,worldWrites:0});
}
