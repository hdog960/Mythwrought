// MYTHWROUGHT ROADMAP A3 — individual-building review sequence, READ ONLY.
// This orders existing physical risk witnesses for a future *separately authorized*
// human/engineering review. It must not modify source, packs, geometry or saves.
import {classifyA3UnresolvedPhysicalRisks} from './a3-readonly-risk-disposition.mjs';

export function orderA3SourceSpecificPhysicalReviews(){
 const original=classifyA3UnresolvedPhysicalRisks();
 const site=new Map();
 function get(id){
  if(!site.has(id))site.set(id,{sourceBlueprintId:id,mounts:[],beamOptions:[],roofWitnesses:[]});
  return site.get(id);
 }
 for(const m of original.mounts)get(m.buildingId).mounts.push(Object.freeze({
  family:m.family,fixturePosition:m.fixturePosition,
  missingSupportYaws:[...m.sourceMissingSupportYaws],
  reservedFlueCollisionYaws:[...m.reservedFlueCollisionYaws],
  sourceCollisionYaws:[...m.sourceCollisionYaws],
  unresolvedNeighborProxyYaws:[...m.proxyInspectedYaws],
  nominalYawCandidateCount:m.nominalYawCandidateCount,
  mountingCertified:false,thermalCertified:false}));
 for(const b of original.unplacedBeams)get(b.buildingId).beamOptions.push(Object.freeze({
  at:b.at,producerResolvedYaws:[...b.producerResolvedYaws],geometricallyBlockedYaws:[...b.geometryBlockedYaws],
  immediateBearingVerified:false,continuousLoadPathVerified:false,installed:false}));
 for(const r of original.roofWitnesses)get(r.id).roofWitnesses.push(Object.freeze({
  cohort:r.cohort,at:r.at,nearestStructuralSource:r.nearestStructuralSource,
  nearestHorizontalDistance:r.nearestHorizontalDistance,
  sampledWitnessMissing:true,provedStructuralFault:false}));
 const cases=[...site.values()].map(s=>{
  const missing=s.mounts.reduce((a,m)=>a+m.missingSupportYaws.length,0);
  const flue=s.mounts.reduce((a,m)=>a+m.reservedFlueCollisionYaws.length,0);
  const unknown=s.mounts.reduce((a,m)=>a+m.unresolvedNeighborProxyYaws.length,0);
  const rank=flue>0?'P0_RESERVED_FLUE':missing>0?'P1_MISSING_MOUNT_SUPPORT':s.beamOptions.length?'P1_UNVERIFIED_ROOF_BEAMS':'P2_SAMPLED_ROOF_WITNESSES';
  return Object.freeze({sourceBlueprintId:s.sourceBlueprintId,priority:rank,
   mountFixtureCount:s.mounts.length,missingSupportYawCount:missing,flueOverlapYawCount:flue,
   proxyNeighborYawCount:unknown,unplacedBeamCount:s.beamOptions.length,
   roofWitnessSampleCount:s.roofWitnesses.length,
   mounts:Object.freeze(s.mounts),beamOptions:Object.freeze(s.beamOptions),
   roofWitnesses:Object.freeze(s.roofWitnesses),
   placementAuthorized:false,physicalWorldMeshVerified:false,structuralEngineeringApproved:false,
   flueClearanceApproved:false,saveWrites:0,originalSourceEdits:0});
 });
 const order={P0_RESERVED_FLUE:0,P1_MISSING_MOUNT_SUPPORT:1,P1_UNVERIFIED_ROOF_BEAMS:2,P2_SAMPLED_ROOF_WITNESSES:3};
 cases.sort((a,b)=>order[a.priority]-order[b.priority]||
  b.flueOverlapYawCount-a.flueOverlapYawCount||b.missingSupportYawCount-a.missingSupportYawCount||
  b.unplacedBeamCount-a.unplacedBeamCount||b.roofWitnessSampleCount-a.roofWitnessSampleCount||
  a.sourceBlueprintId.localeCompare(b.sourceBlueprintId));
 const sum=(name)=>cases.reduce((n,x)=>n+x[name],0);
 if(sum('mountFixtureCount')!==30||sum('missingSupportYawCount')!==118||
  sum('flueOverlapYawCount')!==60||sum('unplacedBeamCount')!==156||
  sum('roofWitnessSampleCount')!==274)throw Error('3A source review census drift');
 const groups=Object.freeze({P0_RESERVED_FLUE:cases.filter(x=>x.priority==='P0_RESERVED_FLUE').length,
  P1_MISSING_MOUNT_SUPPORT:cases.filter(x=>x.priority==='P1_MISSING_MOUNT_SUPPORT').length,
  P1_UNVERIFIED_ROOF_BEAMS:cases.filter(x=>x.priority==='P1_UNVERIFIED_ROOF_BEAMS').length,
  P2_SAMPLED_ROOF_WITNESSES:cases.filter(x=>x.priority==='P2_SAMPLED_ROOF_WITNESSES').length});
 return Object.freeze({schema:'mythwrought.roadmap-a3.review-priority-ledger.v1',
  original3ASourceDesignsProtected:345,
  reviewSiteCount:cases.length,
  issueCounts:Object.freeze({legacyMounts:30,fireplace:15,chimney:15,
   missingMountYaws:118,flueIntersectionYaws:60,unplacedRoofBeams:156,sampledRoofWitnesses:274}),
  priorityCounts:groups,
  sites:Object.freeze(cases),
  installedPhysicalRepairs:0,sourceGeometryChanges:0,realIphoneTested:false,
  finalInstalledProducerAssemblyCertified:false,
  explicitlyAuthorizedByCreator:false,
  reviewOrderOnly:true});
}
