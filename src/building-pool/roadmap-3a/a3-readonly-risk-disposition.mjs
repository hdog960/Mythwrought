// Mythwrought Roadmap A3: read-only disposition ledger derived from the four-yaw
// source-exact physical producer audit. No fixture/beam placement or edits.
import {auditA3FourYawPhysicalRisks} from './a3-four-yaw-physical-risk-matrix.mjs';
const key=x=>x.join(',');
const YAWS=['north','east','south','west'];
export function classifyA3UnresolvedPhysicalRisks(){
 const raw=auditA3FourYawPhysicalRisks();
 const fixtureGroups=new Map(),beamGroups=new Map(),roofGroups=new Map();
 for(const v of raw.fireplaceChimneyYaw){
  const id=v.id+'|'+v.family+'|'+key(v.at);
  if(!fixtureGroups.has(id))fixtureGroups.set(id,[]);
  fixtureGroups.get(id).push(v);
 }
 const mounts=[...fixtureGroups].map(([id,a])=>{
  if(a.length!==4||new Set(a.map(x=>x.yaw)).size!==4)throw Error('Incomplete fixture yaw group '+id);
  const missing=a.filter(x=>x.missingAuthoredSourceSupports.length>0).map(x=>x.yaw);
  const lumen=a.filter(x=>x.intersectsReservedHollowFlue).map(x=>x.yaw);
  const conflicts=a.filter(x=>x.geometricCollisionIntersections>0||x.occupiedOffsetConflicts.length>0).map(x=>x.yaw);
  const unresolved=a.filter(x=>x.proxyCollisionNeighbors>0).map(x=>x.yaw);
  return Object.freeze({id,buildingId:a[0].id,family:a[0].family,fixturePosition:a[0].at,
   yawCoverage:YAWS.length,sourceMissingSupportYaws:missing,reservedFlueCollisionYaws:lumen,
   sourceCollisionYaws:conflicts,proxyInspectedYaws:unresolved,
   severity:lumen.length?'FLUE_THERMAL_EXCLUSION':missing.length?'MISSING_LOAD_BEARING_SUPPORT':'UNPROVEN_PRODUCER_MOUNT',
   nominalYawCandidateCount:4-new Set([...missing,...lumen,...conflicts]).size,
   physicalInstallationAllowed:false,flueThermalEngineeringApproved:false,
   manualPackPhysicalJoineryCertified:false,requiresCreatorApproval:true});
 });
 for(const v of raw.beamYaw){
  const id=v.id+'|'+key(v.proposedBeam);
  if(!beamGroups.has(id))beamGroups.set(id,[]);
  beamGroups.get(id).push(v);
 }
 const beams=[...beamGroups].map(([id,a])=>{
  if(a.length!==4||new Set(a.map(x=>x.yaw)).size!==4)throw Error('Incomplete third roof beam yaw group '+id);
  return Object.freeze({id,buildingId:a[0].id,at:a[0].proposedBeam,
    producerResolvedYaws:a.filter(x=>x.producerResolved).map(x=>x.yaw),
    geometryBlockedYaws:a.filter(x=>x.intersectsHollowFlue||x.intersectsReservedCirculation||
      (x.geometricCollisionIntersections??0)>0||(x.occupiedOffsetConflicts??[]).length>0).map(x=>x.yaw),
    immediateAuthoredBearingVerified:a.every(x=>x.sourceImmediateBearing===true),
    engineeringLoadPathProven:false,physicalSupportsInstalled:0,
    status:'UNPLACED_UNVERIFIED_LOAD_PATH',
    physicalPlacementAllowed:false,requiresRoofEngineeringApproval:true,
    requiresCreatorApproval:true});
 });
 for(const w of raw.roofWitnesses){
  const label=w.cohort;
  if(!roofGroups.has(label))roofGroups.set(label,[]);
  roofGroups.get(label).push(w);
 }
 const roof=raw.roofWitnesses.map(x=>Object.freeze({id:x.id,cohort:x.cohort,at:x.at,
  nearestStructuralSource:x.nearestStructuralSource,nearestHorizontalDistance:x.nearestHorizontalDistance,
  familyProducerResolved:!!x.producerShape,
  status:'SAMPLED_NEARBY_BEARING_WITNESS_ABSENT_NOT_PROVEN_LOAD_DEFECT',
  physicalStructuralFaultProven:false,retrospectiveRoofApproval:false,
  physicalRepairPermitted:false}));
 if(mounts.length!==30||beams.length!==156||roof.length!==274)throw Error('A3 protected ledger census drift');
 const total=(xs,p)=>xs.reduce((s,x)=>s+(p(x)?1:0),0);
 const summary={legacyMounts:mounts.length,
  fireplaceMounts:total(mounts,x=>x.family==='pack4:064'),
  chimneyMounts:total(mounts,x=>x.family==='pack4:063'),
  mountYawMissingSourceSupport:mounts.reduce((n,x)=>n+x.sourceMissingSupportYaws.length,0),
  mountYawIntersectsReservedFlue:mounts.reduce((n,x)=>n+x.reservedFlueCollisionYaws.length,0),
  mountYawProxyNeighborCases:mounts.reduce((n,x)=>n+x.proxyInspectedYaws.length,0),
  unplacedBeamProposals:beams.length,beamsWithoutVerifiedBearing:total(beams,x=>!x.immediateAuthoredBearingVerified),
  beamYawProducerResolution:beams.reduce((n,x)=>n+x.producerResolvedYaws.length,0),
  roofSamplesByCohort:[...roofGroups].map(([cohort,rows])=>({cohort,count:rows.length})),
  sampledRoofBearingWitnessGaps:roof.length,physicalRepairsPlaced:0,modifiedSourceBlueprints:0};
 return Object.freeze({schema:'mythwrought.roadmap-a3.readonly-risk-disposition.v1',
  summary:Object.freeze(summary),mounts:Object.freeze(mounts),unplacedBeams:Object.freeze(beams),
  roofWitnesses:Object.freeze(roof),rootSourceDesigns:345,
  realPackProducerCollisionInspection:true,
  endToEndInstalledFamilyAssemblyCertified:false,
  realIphoneTested:false,gameplayRegistered:false,creatorApproved:false,
  allPhysicalRepairsForbiddenWithoutSeparateApproval:true});
}
