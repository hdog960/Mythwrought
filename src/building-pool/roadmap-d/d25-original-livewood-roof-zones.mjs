// MYTHWROUGHT Builder D25: source-authentic, nonconstructing live:wood roof zoning.
// Only original Y0–Y6 continuous wall columns count as VERIFIED bearings.
// D19/D22/D25 Pack2 timber remains geometrical planning, never certified live-wood joints.
import {auditRoofAdmission} from './d24-roof-support-admission.mjs';
const K=(x,z)=>`${x},${z}`;
const K3=(x,y,z)=>`${x},${y},${z}`;
const R=new Set(['wall','partition','column']);
const V=new Set(['foundation','floor','wall','beam','partition','column']);
const valid=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const DIRECTIONS=Object.freeze([[1,0,'x','north'],[0,1,'z','east']]);
const coords=k=>k.split(',').map(Number);
function requireRange(n,lo,hi,name){if(!Number.isSafeInteger(n)||n<lo||n>hi)throw RangeError(`D25 ${name} out of range`);}
function originalSource(b){
 if(!b||b.integrated!==false||b.worldPlaced!==false||b.creatorApproved!==false||
   !Array.isArray(b.cells)||!Array.isArray(b.navigation)||!b.id)
  throw Error('D25 requires complete, original, unplaced 4B source and navigation');
 const at=new Map(),roof=new Set(),walking=new Set(),occupied=new Set();
 for(const c of b.cells){
  if(!valid(c.at))throw Error('D25 invalid original cell coordinate');
  const [x,y,z]=c.at,k=K3(x,y,z);
  if(at.has(k))throw Error('D25 duplicate original source cell');
  at.set(k,c);
  if(y===7&&c.role==='roof'&&c.feature==='weather-plane'){
   if(c.asset!=='live:wood')throw Error('D25 altered original live:wood roof provenance');
   roof.add(K(x,z));
  }
  if(y>=2&&y<=6)occupied.add(K(x,z));
 }
 if(roof.size<100)throw Error('D25 requires genuine original roof plane');
 const rawNav=new Set();
 for(const n of b.navigation){
  if(!valid(n.at)||n.mode!=='walk'||rawNav.has(K3(...n.at)))
   throw Error('D25 ambiguous original authored walk navigation');
  rawNav.add(K3(...n.at));
  const k=K(n.at[0],n.at[2]);if(roof.has(k))walking.add(k);
 }
 const get=(x,y,z)=>at.get(K3(x,y,z));
 const rooted=(x,z)=>{
  if(!R.has(get(x,6,z)?.role)||!roof.has(K(x,z)))return false;
  for(let y=0;y<=6;y++)if(!V.has(get(x,y,z)?.role))return false;
  return true;
 };
 const walls=[];
 for(const k of roof){const [x,z]=coords(k);if(rooted(x,z))walls.push({x,z});}
 walls.sort((a,b)=>a.z-b.z||a.x-b.x);
 if(!walls.length)throw Error('D25 no genuine foundation-to-roof original walls');
 return {at,roof,walking,occupied,walls,get,rooted};
}
function validateExisting(plan,b,source,blocked,kind){
 if(!plan||plan.blueprintId!==b.id||plan.verifiedSourceBearingToFoundation!==true||
   !Array.isArray(plan.proposedTrussSpans)||!Array.isArray(plan.proposedBeamCells)||
   (kind==='secondary'&&plan.originalPrimaryAndNewBeamCellsDisjoint!==true))
  throw Error(`D25 ${kind} source proof missing`);
 const within=new Set();
 for(const c of plan.proposedBeamCells){
  if(!valid(c.at)||c.at[1]!==6||c.asset!=='pack2:015'||c.candidateId!==61||
    source.at.has(K3(...c.at))||source.get(c.at[0],7,c.at[2])?.asset!=='live:wood')
   throw Error(`D25 ${kind} forged overhead source beam or original wood material`);
  const k=K3(...c.at);
  if(blocked.has(k)||within.has(k))throw Error(`D25 ${kind} beam collision`);
  within.add(k);
 }
 const centers=[];
 for(const s of plan.proposedTrussSpans){
  if(!valid(s.bearingStart)||!valid(s.bearingEnd)||!source.rooted(s.bearingStart[0],s.bearingStart[2])||
    !source.rooted(s.bearingEnd[0],s.bearingEnd[2])||!Array.isArray(s.points)||
    s.points.length!==s.spanCells||!s.points.length||
    s.bothBearingsReachUnbrokenOriginalFoundation!==true)
   throw Error(`D25 ${kind} lacks genuine endpoint-to-foundation support`);
  for(const p of s.points)if(!valid(p)||!within.has(K3(...p)))
   throw Error(`D25 ${kind} span differs from source beam geometry`);
  const m=s.points[Math.floor(s.points.length/2)];centers.push(K(m[0],m[2]));
 }
 for(const k of within)blocked.add(k);
 return centers;
}
function measure(roof,seeds,limit){
 const dist=new Map(),queue=[];
 for(const k of seeds){
  if(!roof.has(k))throw Error('D25 seed lacks actual original roof');
  if(!dist.has(k)){dist.set(k,0);queue.push(k);}
 }
 for(let i=0;i<queue.length;i++){
  const k=queue[i],d=dist.get(k),[x,z]=coords(k);
  for(const n of [K(x+1,z),K(x-1,z),K(x,z+1),K(x,z-1)])
   if(roof.has(n)&&!dist.has(n)){dist.set(n,d+1);queue.push(n);}
 }
 let within=0,far=0,max=0;
 const farSet=new Set();
 for(const k of roof){const d=dist.get(k);
  if(d!==undefined&&d<=limit)within++;
  else{far++;farSet.add(k);}
  if(d!==undefined&&d>max)max=d;
 }
 return {dist,within,far,unreachable:roof.size-dist.size,max,farSet};
}
function zones(farSet,dist){
 const seen=new Set(),all=[];
 for(const k of farSet){
  if(seen.has(k))continue;
  const queue=[k];seen.add(k);
  let count=0,minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity,maxDistance=0,unreachable=0;
  for(let i=0;i<queue.length;i++){
   const t=queue[i],[x,z]=coords(t),d=dist.get(t);
   count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);
   minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);
   if(d===undefined)unreachable++;else maxDistance=Math.max(maxDistance,d);
   for(const n of [K(x+1,z),K(x-1,z),K(x,z+1),K(x,z-1)])
    if(farSet.has(n)&&!seen.has(n)){seen.add(n);queue.push(n);}
  }
  all.push(Object.freeze({cells:count,minX,maxX,minZ,maxZ,maxDistance,
    unreachableCells:unreachable,requiresEngineeredLiveWoodFrame:true}));
 }
 all.sort((a,b)=>b.cells-a.cells||b.maxDistance-a.maxDistance||a.minZ-b.minZ||a.minX-b.minX);
 return all;
}
/**
 * No world edit. Third-lane candidates are *proposals* only: endpoints are actual
 * complete original y0–6 walls; interior cells at y6 are truly empty with Y7
 * authored wood directly above, and no D19/D22 overlaps. Original navigation
 * stays at Y2; clearance is geometric separation, not player collision proof.
 */
export function planD25OriginalLiveWoodRoofZones(b,primary,secondary,{
 distanceLimit=8,maxNewSpans=10,maxNewBeamCells=72,maxSpanCells=12,maxReportedZones=12
}={}){
 requireRange(distanceLimit,1,16,'planning distance');
 requireRange(maxNewSpans,0,32,'span budget');
 requireRange(maxNewBeamCells,0,256,'beam cell budget');
 requireRange(maxSpanCells,2,12,'maximum unreviewed timber span');
 requireRange(maxReportedZones,0,64,'zone reporting budget');
 const source=originalSource(b),blocked=new Set();
 const centerPrimary=validateExisting(primary,b,source,blocked,'primary');
 const centerSecondary=validateExisting(secondary,b,source,blocked,'secondary');
 const roofCells=[...source.roof].map(k=>{const [x,z]=coords(k);return {x,z};});
 const strict=auditRoofAdmission({roofCells,verifiedWallAnchors:source.walls,
  walkColumns:[...source.walking].map(k=>{const [x,z]=coords(k);return {x,z};}),
  occupiedColumns:[...source.occupied].filter(k=>source.roof.has(k)).map(k=>{
   const [x,z]=coords(k);return {x,z};}),maxPlanningDistance:distanceLimit});
 // No invented load-bearing capacity from either Pack3 saddle or Pack2 cross-member.
 const wallKeys=source.walls.map(p=>K(p.x,p.z));
 const originalHypothetical=measure(source.roof,[...wallKeys,...centerPrimary,...centerSecondary],distanceLimit);
 const candidates=[];
 for(const wall of source.walls){
  for(const [dx,dz,axis,orientation] of DIRECTIONS){
   const points=[];
   for(let n=1;n<=maxSpanCells+1;n++){
    const x=wall.x+n*dx,z=wall.z+n*dz,k=K3(x,6,z),cell=source.get(x,6,z);
    if(cell){
     if(source.rooted(x,z)&&points.length>=2&&points.length<=maxSpanCells){
      candidates.push({axis,orientation,start:[wall.x,6,wall.z],end:[x,6,z],points:[...points]});
     }
     break;
    }
    if(source.get(x,7,z)?.asset!=='live:wood'||blocked.has(k))break;
    points.push([x,6,z]);
   }
  }
 }
 // Longer bounded full-wall-to-full-wall bays first, stable deterministic tie-break.
 candidates.sort((a,b)=>b.points.length-a.points.length||a.start[2]-b.start[2]||
  a.start[0]-b.start[0]||a.axis.localeCompare(b.axis));
 const selected=[],thirdCells=[],used=new Set();
 for(const cand of candidates){
  if(selected.length>=maxNewSpans||thirdCells.length+cand.points.length>maxNewBeamCells)continue;
  if(cand.points.some(p=>used.has(K3(...p))))continue;
  const spanId=selected.length;
  selected.push(Object.freeze({spanId,axis:cand.axis,orientation:cand.orientation,
   bearingStart:Object.freeze(cand.start),bearingEnd:Object.freeze(cand.end),
   points:Object.freeze(cand.points.map(p=>Object.freeze(p))),
   spanCells:cand.points.length,bothBearingsReachUnbrokenOriginalFoundation:true,
   authoredY7LiveWoodAboveEachCell:true,sourceOverheadOnly:true,
   physicalPack2ToLiveWoodJointAccepted:false,gravityLoadCertified:false}));
  for(const p of cand.points){
   used.add(K3(...p));thirdCells.push(Object.freeze({at:p,asset:'pack2:015',candidateId:61,
    role:'roof-cross-beam',orientation:cand.orientation,sourceOnly:true,worldPlaced:false}));
  }
 }
 const hypothetical=measure(source.roof,[...wallKeys,...centerPrimary,...centerSecondary,
   ...selected.map(s=>{const p=s.points[Math.floor(s.points.length/2)];return K(p[0],p[2]);})],distanceLimit);
 const unresolvedZones=zones(hypothetical.farSet,hypothetical.dist);
 const emptyHeight=roofCells.filter(p=>!source.occupied.has(K(p.x,p.z))).length;
 if(strict.candidateFullHeightPiers.some(p=>source.walking.has(K(p.x,p.z))||source.occupied.has(K(p.x,p.z))))
  throw Error('D25 proposed pier invaded original navigation or authored occupancy');
 return Object.freeze({format:'mythwrought.builder-d.d25.livewood-overhead-proposals-roof-zones.v1',
  blueprintId:b.id,actualRoofMaterial:'live:wood',originalRoofCells:source.roof.size,
  verifiedOriginalFoundationWallRoofAnchors:source.walls.length,
  originalEmptyY2ToY6RoofColumns:emptyHeight,
  originalEmptyColumnsWithNavigation:[...source.roof].filter(k=>!source.occupied.has(k)&&source.walking.has(k)).length,
  sourceFullHeightPierCandidates:strict.candidateFullHeightPiers.length,
  originalNavigableRoofColumns:source.walking.size,
  originalPrimaryAndSecondarySpanCount:primary.proposedTrussSpans.length+secondary.proposedTrussSpans.length,
  originalPrimaryAndSecondaryBeamCells:blocked.size,
  thirdLaneProposedSpans:Object.freeze(selected),thirdLaneProposedCells:Object.freeze(thirdCells),
  strictOriginalWallOnlyWithinRadius:strict.withinDistance,
  originalPlusD19D22HypotheticalWithinRadius:originalHypothetical.within,
  originalPlusD19D22HypotheticalBeyondRadius:originalHypothetical.far,
  originalPlusD19D22HypotheticalUnreachable:originalHypothetical.unreachable,
  afterD25HypotheticalWithinRadius:hypothetical.within,
  afterD25HypotheticalBeyondRadius:hypothetical.far,
  originalHypotheticalMaxSourceSteps:originalHypothetical.max,
  afterD25HypotheticalMaxSourceSteps:hypothetical.max,
  unresolvedRoofZoneCount:unresolvedZones.length,
  unresolvedRoofZones:Object.freeze(unresolvedZones.slice(0,maxReportedZones)),
  unreportedRoofZoneCount:Math.max(0,unresolvedZones.length-maxReportedZones),
  originalWalkingSourceUnmodified:true,allProposalsAtY6:true,
  realPack2ToActualLiveWoodPhysicalContactCertified:false,
  originalPack3RoofActuallyAuthored:false,actualLiveWoodGravityLoadAccepted:false,
  actualPlayerCollisionAndPickingAccepted:false,originalGameWebGL2Accepted:false,
  installedIPhonePwaAccepted:false,mutations:0,worldPlaced:false});
}
