// MYTHWROUGHT Builder D28 — explicit, UNBUILDABLE until engineered, long-bay
// source triage. Finds wall-to-wall continuous Y6 corridors beneath genuine
// Y7 live:wood, derives symbolic bending/shear/deflection demands and strictly
// preserves every authored WALK cell. The original Pack2 ID61 is a one-cell
// preview; an axial chain of face contacts is NOT a rated continuous beam.
// No registered block, save/world edit, new settlement, or load certification.
import {auditD27OriginalWoodLoadPaths,d27PreviewSourceCollider}
 from './d27-original-wood-loadpath-audit.mjs';
import {calculateD28UnratedBayDemand,d28SameAxisJoinGeometry}
 from './d28-long-bay-load-equations.mjs';
const KEY=(x,z)=>`${x},${z}`,K3=(x,y,z)=>`${x},${y},${z}`;
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const supports=new Set(['foundation','floor','wall','column','partition','beam']);
const bearings=new Set(['wall','partition','column']);
const dirs=Object.freeze([[1,0,'x','north'],[0,1,'z','east']]);
function bounded(n,lo,hi,label){if(!Number.isSafeInteger(n)||n<lo||n>hi)throw RangeError(`D28 ${label} budget`);}
function flood(roof,seeds,limit=8){
 const dist=new Map(),queue=[];
 for(const k of seeds){if(!roof.has(k))throw Error('D28 hypothetical seed outside authentic roof');
  if(!dist.has(k)){dist.set(k,0);queue.push(k);}}
 for(let i=0;i<queue.length;i++){
  const k=queue[i],[x,z]=k.split(',').map(Number),d=dist.get(k);
  for(const n of [KEY(x+1,z),KEY(x-1,z),KEY(x,z+1),KEY(x,z-1)])
   if(roof.has(n)&&!dist.has(n)){dist.set(n,d+1);queue.push(n);}
 }
 const far=new Set();let max=0;
 for(const k of roof){const d=dist.get(k);if(d===undefined||d>limit)far.add(k);if(d!==undefined)max=Math.max(max,d);}
 return {dist,far,max,unreachable:roof.size-dist.size};
}
function components(far){
 const seen=new Set(),bins=[];
 for(const k of far){if(seen.has(k))continue;
  const q=[k];seen.add(k);let len=0;
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i].split(',').map(Number);len++;
   for(const n of [KEY(x+1,z),KEY(x-1,z),KEY(x,z+1),KEY(x,z-1)])
    if(far.has(n)&&!seen.has(n)){seen.add(n);q.push(n);}
  }bins.push(len);
 }
 bins.sort((a,b)=>b-a);
 return bins;
}
/** Genuine original roof and navigation only; returns no mutating handles. */
function inventory(b){
 if(!b||b.integrated!==false||b.worldPlaced!==false||b.creatorApproved!==false||
    !Array.isArray(b.cells)||!Array.isArray(b.navigation)||typeof b.id!=='string')
  throw Error('D28 requires original unregistered building source');
 const at=new Map(),roof=new Set(),walk=new Set();
 for(const c of b.cells){if(!point(c.at)||at.has(K3(...c.at)))throw Error('D28 duplicated original authored source cell');
  at.set(K3(...c.at),c);
  if(c.at[1]===7&&c.role==='roof'&&c.feature==='weather-plane'){
   if(c.asset!=='live:wood')throw Error('D28 original roof material was replaced');
   roof.add(KEY(c.at[0],c.at[2]));
  }
 }
 if(roof.size<100)throw Error('D28 original roof census invalid');
 for(const n of b.navigation){
  if(!point(n.at)||n.mode!=='walk'||walk.has(K3(...n.at)))throw Error('D28 invalid/duplicate original walking node');
  walk.add(K3(...n.at));
 }
 const get=(x,y,z)=>at.get(K3(x,y,z));
 const grounded=(x,z)=>roof.has(KEY(x,z))&&bearings.has(get(x,6,z)?.role)&&
    ['live:stone','live:wood'].includes(get(x,6,z)?.asset)&&
    get(x,0,z)?.role==='foundation'&&get(x,1,z)?.role==='floor'&&
    Array.from({length:7},(_,y)=>supports.has(get(x,y,z)?.role)).every(Boolean);
 let fullClear=0,navClear=0;
 const anchors=[];
 for(const k of roof){const [x,z]=k.split(',').map(Number);
  if(grounded(x,z))anchors.push([x,z]);
  let clear=true;for(let y=2;y<=6;y++)if(get(x,y,z)){clear=false;break;}
  if(!clear)continue;
  fullClear++;
  if(!walk.has(K3(x,2,z)))throw Error('D28 full-height clear interior lacks its authored WALK node');
  navClear++;
 }
 anchors.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 return {at,get,roof,walk,anchors,grounded,fullClear,navClear};
}
/**
 * Optional design study only: future long-bay framing would require a rated
 * beam/joint material, roof tributary loads, foundation reaction, stiffness,
 * construction capacity and verified collider, none currently available.
 */
export function auditD28OriginalLongBayArchitecture(b,primary,secondary,d25,{
  minInteriorCells=13,maxInteriorCells=48,maxReportedSpans=4,
  maxProposedBeamCells=180,maximumCandidates=25000,distanceLimit=8
}={}){
 bounded(minInteriorCells,13,48,'minimum long span');
 bounded(maxInteriorCells,minInteriorCells,48,'maximum long span');
 bounded(maxReportedSpans,0,8,'reported spans');
 bounded(maxProposedBeamCells,0,384,'proposal cell');
 bounded(maximumCandidates,100,25000,'candidate scan');
 bounded(distanceLimit,1,16,'proximity reporting');
 const d27=auditD27OriginalWoodLoadPaths(b,primary,secondary,d25,{sampleLimit:0});
 const src=inventory(b);
 if(d25.blueprintId!==b.id||d25.originalRoofCells!==src.roof.size||
    d25.originalEmptyY2ToY6RoofColumns!==src.fullClear||
    d25.originalNavigableRoofColumns!==[...src.walk].filter(k=>{
      const [x,,z]=k.split(',').map(Number);return src.roof.has(KEY(x,z));}).length||
    d25.verifiedOriginalFoundationWallRoofAnchors!==src.anchors.length||
    d25.sourceFullHeightPierCandidates!==0||d27.remainingRoofBeyondProximity!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D28 requires exact original D25-D27 roof, anchor and WALK evidence');
 const groups=[primary.proposedTrussSpans,secondary.proposedTrussSpans,d25.thirdLaneProposedSpans];
 const occupied=new Set();
 for(const group of [primary.proposedBeamCells,secondary.proposedBeamCells,d25.thirdLaneProposedCells])
  for(const c of group){if(!point(c.at)||c.at[1]!==6||occupied.has(K3(...c.at))||src.at.has(K3(...c.at)))
    throw Error('D28 source-owned Y6 proposal overlap');occupied.add(K3(...c.at));}
 if(occupied.size!==d27.originalBeamCount)throw Error('D28 original composite site count changed');
 const seedKeys=src.anchors.map(([x,z])=>KEY(x,z));
 for(const group of groups)for(const span of group){
  const m=span.points[Math.floor(span.points.length/2)];seedKeys.push(KEY(m[0],m[2]));
 }
 const original=flood(src.roof,seedKeys,distanceLimit);
 if(original.far.size!==d25.afterD25HypotheticalBeyondRadius||
    original.max!==d25.afterD25HypotheticalMaxSourceSteps||
    components(original.far).length!==d25.unresolvedRoofZoneCount)
  throw Error('D28 genuine original roof distance/34-zone ledger drift');
 const shape={x:d27PreviewSourceCollider('x'),z:d27PreviewSourceCollider('z')};
 const contacts={x:d28SameAxisJoinGeometry(shape.x.boxes,'x'),
                 z:d28SameAxisJoinGeometry(shape.z.boxes,'z')};
 for(const axis of ['x','z']){
  if(shape[axis].colliderBoxCount!==7||Math.abs(contacts[axis].adjacentFaceArea-.36)>1e-8||
      shape[axis].loadBearingOrGravityStrengthCertified!==false)
   throw Error('D28 original Pack2 end-face is not a rated continuous member');
 }
 let scanned=0;
 const candidates=[];
 for(const [wx,wz] of src.anchors)for(const [dx,dz,axis,orientation] of dirs){
  const points=[];
  for(let n=1;n<=maxInteriorCells+1;n++){
   scanned++;if(scanned>src.anchors.length*2*(maxInteriorCells+1)+2)throw Error('D28 source traversal exceeded deterministic bound');
   const x=wx+n*dx,z=wz+n*dz,k=K3(x,6,z);
   if(src.get(x,6,z)){
    if(src.grounded(x,z)&&points.length>=minInteriorCells){
     const m=points[Math.floor(points.length/2)],mid=KEY(m[0],m[2]);
     candidates.push({axis,orientation,start:[wx,6,wz],end:[x,6,z],points,
      originalMidpointDistance:original.dist.get(mid)??null});
     if(candidates.length>maximumCandidates)throw Error('D28 bounded long-bay candidate count exceeded');
    }
    break;
   }
   if(!src.roof.has(KEY(x,z))||occupied.has(k))break;
   points.push([x,6,z]);
  }
 }
 // Deepest genuine unresolved regions first, then longest full-wall bearing
 // corridors. This is a geometrical design queue, NOT a load-safe ranking.
 candidates.sort((a,b)=>(b.originalMidpointDistance??1e7)-(a.originalMidpointDistance??1e7)||
   b.points.length-a.points.length||a.start[2]-b.start[2]||a.start[0]-b.start[0]||
   a.axis.localeCompare(b.axis));
 const selected=[],taken=new Set();let joints=0,unratedLongDemandMax=0;
 for(const c of candidates){
  if(selected.length>=maxReportedSpans)break;
  if(c.points.length>maxProposedBeamCells||taken.size+c.points.length>maxProposedBeamCells||
    c.points.some(p=>taken.has(K3(...p))))continue;
  const demand=calculateD28UnratedBayDemand(c.points.length);
  const aboveRoofReserved=c.points.reduce((n,p)=>n+(src.get(p[0],8,p[2])||src.get(p[0],9,p[2])?1:0),0);
  for(const p of c.points){if(src.get(...p)||src.get(p[0],7,p[2])?.asset!=='live:wood')
   throw Error('D28 potential long corridor destroyed original roof or AIR');
   taken.add(K3(...p));}
  joints+=demand.jointCountBetweenOneCellTimberSegments;
  unratedLongDemandMax=Math.max(unratedLongDemandMax,demand.idealPeakBendingMomentDemand);
  selected.push(Object.freeze({
   candidateIndex:selected.length,axis:c.axis,orientation:c.orientation,
   originalStartBearing:Object.freeze([...c.start]),originalEndBearing:Object.freeze([...c.end]),
   Y6UnoccupiedOriginalColumns:c.points.length,
   sourceMidpoint:Object.freeze([...c.points[Math.floor(c.points.length/2)]]),
   midpointOriginalSourceSteps:c.originalMidpointDistance,
   originalRoofY8OrY9OccupiedColumns:aboveRoofReserved,
   originalPack2FaceJointArea:contacts[c.axis].adjacentFaceArea,
   demand,geometricallyContinuousThroughOriginalWoodRoof:true,
   projectedTimberMaterial:'pack2:015',novelAABBShapeCertified:false,
   constructionApproved:false,ratedLongSpan:false,
   jointMomentRatingUnproven:true,realExteriorRoofTrussRequiresNewDesign:true,
   noSourceCellModified:true
  }));
 }
 const projectionSeeds=[...seedKeys,...selected.map(s=>KEY(s.sourceMidpoint[0],s.sourceMidpoint[2]))];
 const projected=flood(src.roof,projectionSeeds,distanceLimit);
 const origZoneSizes=components(original.far),projectedZoneSizes=components(projected.far);
 const newFarReduction=original.far.size-projected.far.size;
 if(newFarReduction<0||src.fullClear!==src.navClear||
   original.far.size!==d27.remainingRoofBeyondProximity||
   projected.far.size+newFarReduction!==original.far.size)
  throw Error('D28 hypothetical long-bay reporting ledger impossible');
 return Object.freeze({format:'mythwrought.builder-d.d28.unrated-long-bay-source-triage.v1',
  blueprintId:b.id,sourceRoofAsset:'live:wood',originalRoofCells:src.roof.size,
  verifiedFoundationWallColumns:src.anchors.length,
  allClearY2toY6ColumnsCoveredByAuthoredWalk:src.fullClear,
  priorShortSpanCount:d27.originalSpanCount,priorCompositeBeamSites:d27.originalBeamCount,
  genuineRoofFarBefore:original.far.size,originalUnresolvedZones:origZoneSizes.length,
  originalLargestUnresolvedZoneCells:origZoneSizes[0]??0,
  originalMaxSourceRoofDistance:original.max,
  geometricallyPossibleUnratedLongBays:candidates.length,
  selectedGeometricalLongBays:Object.freeze(selected),
  suggestedUninstalledLongBeamCells:taken.size,
  suggestedUnratedAxialJoints:joints,
  maximumNormalizedIdealBendingMomentDemand:unratedLongDemandMax,
  hypotheticalFarAfterAddingUnratedMidpointSeeds:projected.far.size,
  purelyHypotheticalFarCellReduction:newFarReduction,
  hypotheticalZoneCount:projectedZoneSizes.length,
  sourceDistanceNotLoadCapacity:true,
  noApprovedLongSpanTimberStrength:true,noApprovedMomentRatedJoint:true,
  noCalibratedRoofTributaryWeight:true,noLateralBracingOrRoofDiaphragmCertification:true,
  noWorldOrOriginalBlueprintEdits:true,noInteriorPierInsertion:true,
  actualPlayerColliderUnaccepted:true,physicalMaterialOwnerUntouched:true,
  structuralRoofSupportAccepted:false,canBuildLongBays:false,
  noRuntimeOrSaveMutation:true,webgl2NotTested:true,installedIphonePwaNotTested:true
 });
}
