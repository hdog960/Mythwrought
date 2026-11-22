// MYTHWROUGHT Builder D23 — absolute source-owned roof material and walk-space gate.
// Source-only theoretical audit. Does not insert supports or change original
// source buildings, live:wood roofs, Pack3, navigation, selection or saves.
// Important: original W16/W17 weather-plane Y7 is live:wood, NOT Pack3 source.
// Pack3 ID109–112 contacts from D21/D22 are only preview replacement proposals.
import {auditD22OriginalRoofPlaneReach} from './d22-original-secondary-roof-trusses.mjs';
const key=p=>p.join(',');
const integerPoint=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const supportBelow=new Set(['floor','foundation']);
const vertical=new Set(['foundation','floor','wall','column','beam','partition']);
const originalBearing=new Set(['wall','column','partition']);
function sourceMap(b){
 if(!b||b.integrated!==false||b.worldPlaced!==false||b.creatorApproved!==false||
    !Array.isArray(b.cells)||!Array.isArray(b.navigation))
   throw Error('D23 requires fully original unregistered building with navigation');
 const map=new Map();
 for(const c of b.cells){
  if(!integerPoint(c.at)||map.has(key(c.at)))throw Error('D23 duplicate/invalid original physical source');
  map.set(key(c.at),c);
 }
 const nav=new Map();
 for(const v of b.navigation){
  if(!integerPoint(v.at)||nav.has(key(v.at))||v.mode!=='walk')
   throw Error('D23 ambiguous or duplicated original walking location');
  nav.set(key(v.at),v);
 }
 return {map,nav};
}
const rooted=(lookup,x,z)=>{for(let y=6;y>=0;y--){
 const cell=lookup(x,y,z);
 if(!cell||!vertical.has(cell.role))return false;
 }return originalBearing.has(lookup(x,6,z)?.role);};
export function auditD23OriginalRoofNavigationInvariants(blueprint,primary,secondary,{
 radius=8
}={}){
 const {map,nav}=sourceMap(blueprint);
 if(!Number.isSafeInteger(radius)||radius<1||radius>16)
  throw RangeError('D23 source roof support proximity radius must be bounded');
 const get=(x,y,z)=>map.get(x+','+y+','+z);
 const originalRoof=blueprint.cells.filter(c=>c.at[1]===7&&c.role==='roof'&&
    c.feature==='weather-plane');
 if(originalRoof.length<100||originalRoof.some(c=>c.asset!=='live:wood'))
  throw Error('D23 original Y7 roofing was altered; cannot claim Pack3 roof is authored');
 const roofSet=new Set(originalRoof.map(c=>c.at[0]+','+c.at[2]));
 if(roofSet.size!==originalRoof.length)
  throw Error('D23 original authored Y7 weather-plane duplicate in source');
 const navXZ=new Set([...nav.values()].map(x=>x.at[0]+','+x.at[2]));
 let groundedFloorColumnCandidates=0,emptyFullHeightColumns=0,walkwayConflict=0;
 let walkFreeFullHeightColumns=0,sourceFootingsUnderRoof=0;
 const blockedSample=[];
 for(const roof of originalRoof){
  const [x,,z]=roof.at;
  const base=get(x,0,z),floor=get(x,1,z);
  if(!supportBelow.has(base?.role)||!supportBelow.has(floor?.role))continue;
  groundedFloorColumnCandidates++;
  let clear=true;
  for(let y=2;y<=6;y++)if(get(x,y,z)){clear=false;break;}
  if(!clear)continue;
  emptyFullHeightColumns++;
  if(navXZ.has(x+','+z)){
   walkwayConflict++;
   if(blockedSample.length<12)blockedSample.push(Object.freeze([x,z]));
  }else walkFreeFullHeightColumns++;
 }
 for(const r of originalRoof)if(rooted(get,r.at[0],r.at[2]))sourceFootingsUnderRoof++;
 if(walkwayConflict+walkFreeFullHeightColumns!==emptyFullHeightColumns)
  throw Error('D23 original navigation allocation accounting failure');
 if(!primary||primary.blueprintId!==blueprint.id||
    primary.verifiedSourceBearingToFoundation!==true||
    !Array.isArray(primary.proposedTrussSpans)||
    !Array.isArray(primary.proposedBeamCells))
  throw Error('Original D19 founder source evidence missing');
 if(!secondary||secondary.blueprintId!==blueprint.id||
    secondary.verifiedSourceBearingToFoundation!==true||
    secondary.originalPrimaryAndNewBeamCellsDisjoint!==true||
    !Array.isArray(secondary.proposedTrussSpans)||
    !Array.isArray(secondary.proposedBeamCells))
  throw Error('Original D22 secondary source evidence missing');
 const pos=new Set();
 let sampleHeightClearance=Infinity;
 for(const plan of [primary,secondary])for(const beam of plan.proposedBeamCells){
  if(!integerPoint(beam.at)||beam.at[1]!==6||map.has(key(beam.at))||
     pos.has(key(beam.at))||get(beam.at[0],7,beam.at[2])?.asset!=='live:wood')
   throw Error('Proposed source overhead roof beam overwrites original source/plan');
  pos.add(key(beam.at));
  // A body standing on the floor (at local nav Y2) has four full vertical
  // original source cell courses between the walk plane and the Y6 proposal.
  if(navXZ.has(beam.at[0]+','+beam.at[2]))
   sampleHeightClearance=Math.min(sampleHeightClearance,beam.at[1]-2);
 }
 const prior=auditD22OriginalRoofPlaneReach(blueprint,primary,null,{radius});
 const current=auditD22OriginalRoofPlaneReach(blueprint,primary,secondary,{radius});
 if(current.authoredPlaneCellCount!==originalRoof.length||
    current.cellsWithinRadius<prior.cellsWithinRadius||
    current.cellsBeyondRadius+current.cellsWithinRadius+
    current.sourcePlaneCellsUnreachable!==originalRoof.length)
   throw Error('D23 original roof area coverage math lacks source integrity');
 return Object.freeze({
  format:'mythwrought.builder-d.d23.source-owned-roof-navigation-safety.v1',
  blueprintId:blueprint.id,originalRoofSourceAsset:'live:wood',
  originalRoofPlaneCells:originalRoof.length,
  originalPack3RoofIdsOnlyMaterialReplacementProposals:Object.freeze([109,110,111,112]),
  groundedSourceFloorColumns:groundedFloorColumnCandidates,
  originalEmptyFullHeightY2ToY6Columns:emptyFullHeightColumns,
  overlappingAuthoredNavigationColumns:walkwayConflict,
  currentlyWalkwayFreePotentialFullHeightPiers:walkFreeFullHeightColumns,
  realOriginalFoundationWallRoofCells:sourceFootingsUnderRoof,
  sampledProhibitedPierPositions:Object.freeze(blockedSample),
  allAuthoredNavigationCellsRetained:true,
  verifiedExistingPhysicalBeamProposals:pos.size,
  originalPrimarySpans:primary.proposedTrussSpans.length,
  originalSecondarySpans:secondary.proposedTrussSpans.length,
  minimumProposedBeamVerticalGapAboveWalkY2:Number.isFinite(sampleHeightClearance)?
   sampleHeightClearance:null,
  sourceRoofRadius:radius,
  sourceRoofNearPrimary:prior.cellsWithinRadius,
  sourceRoofNearPrimaryAndSecondary:current.cellsWithinRadius,
  originalRoofBeyondRadius:current.cellsBeyondRadius,
  sourceRoofMaxHorizontalDistance:current.farthestSourceHorizontalSteps,
  roofContiguityNotGravityLoadCertification:true,
  impossibleToAddGroundedPiersWithoutAlteringAuthoredNavigation:walkFreeFullHeightColumns===0,
  sourcePack3ActuallyAuthoredOnRoof:false,
  noNewAuthoredWorldVoxels:true,
  allOriginalSourceCellsUnchanged:true,
  sourceRoofMaterialsPreserved:true,
  allProposedRoofPhysicsUnaccepted:true,
  liveSourceBlockCollisionUnaccepted:true,
  originalGameWebGL2Unaccepted:true,
  iphonePwaUnaccepted:true,worldPlaced:false
 });
}
