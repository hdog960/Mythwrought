// Roadmap A3: per-coordinate, source-exact physical blocker witness inventory.
// READ ONLY. Never installs blocks, modifies roof/flue geometry, writes saves,
// certifies thermal/load/weather, or registers world buildings.
import {createLegacyBlacksmithPool} from './legacy-blacksmiths.mjs';
import {auditLegacyBlacksmithSupports} from './legacy-physical-support-audit.mjs';
import {createM2FourthVariantPool} from './m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool} from './m2-metalwork-fifth-variants.mjs';
import {createM3CraftSecondPool} from './m3-craft-second-variants.mjs';
import {createM3CraftThirdPool} from './m3-craft-third-variants.mjs';
import {auditM2FourthPhysicalFit} from './m2-fourth-physical-aabb-audit.mjs';
import {auditM2FifthPhysicalFit} from './m2-fifth-physical-aabb-audit.mjs';
import {auditM3CraftSecondPhysicalFit} from './m3-craft-second-physical-aabb-audit.mjs';
import {auditM3CraftThirdPhysicalFit} from './m3-craft-third-physical-aabb-audit.mjs';
import {createM2ThirdVariantPool} from './m2-metalwork-third-variants.mjs';
import {planUnplacedThirdRoofBearingRemediations} from './m2-third-roof-bearing-options.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';

const k=([x,y,z])=>x+','+y+','+z;
const pos=(c)=>c.slice(0,3);
const freeze=(x)=>Object.freeze(x);
const cohort=[
 ['m2-fourth',createM2FourthVariantPool,auditM2FourthPhysicalFit,33],
 ['m2-fifth',createM2FifthVariantPool,auditM2FifthPhysicalFit,118],
 ['m3-second',createM3CraftSecondPool,auditM3CraftSecondPhysicalFit,83],
 ['m3-third',createM3CraftThirdPool,auditM3CraftThirdPhysicalFit,40]
];

export function auditA3SourceSpecificBlockerLocations(){
 const legacySource=createLegacyBlacksmithPool(),legacy=auditLegacyBlacksmithSupports();
 const legacyById=new Map(legacySource.map(b=>[b.id,b]));
 const fireplace=[],chimney=[];
 for(const row of legacy.buildings){
  const b=legacyById.get(row.id);if(!b)throw Error('A3 legacy source not found '+row.id);
  const occupied=new Map(b.modules.flatMap(m=>m.cells.map(c=>[k(pos(c)),c])));
  const flue=b.architecture.flueVoid;
  for(const issue of row.unresolved){
   const target=issue.ref==='pack4:064'?fireplace:chimney;
   if(!['pack4:064','pack4:063'].includes(issue.ref))throw Error('Unexpected 3A blocker family '+issue.ref);
   const required=issue.requiredSupport;
   const inFlue=required[0]===flue[0]&&required[2]===flue[1]&&required[1]>=3;
   const asset=resolveManualFivePackAsset(issue.ref,{orientation:'north'});
   target.push(freeze({id:b.id,biome:b.biome,size:b.size,family:issue.ref,
     fixture:issue.position,requiredSupport:required,
     sourceCellOccupied:occupied.has(k(required)),inFunctionalFlueColumn:inFlue,
     flueColumn:flue,producerSupportPolicy:asset.supportPolicy,
     producerSupportOffsets:asset.supportOffsets.map(o=>[...o]),
     producerOccupiedOffsets:asset.occupiedOffsets.map(o=>[...o]),
     producerCollisionAabbCount:asset.collisionBoxes.length,
     classification:inFlue?'CANNOT_INSERT_SOLID_IN_SMOKE_LUMEN':'MOUNT_SUPPORT_ABSENT_REQUIRES_ORIENTED_REVIEW',
     acceptedRepair:false,sourceUnchanged:true}));
  }
 }
 if(fireplace.length!==15||chimney.length!==15)throw Error('A3 legacy 15+15 count drift');

 const roof=[];
 const summaries=[];
 for(const [label,make,reportFn,expected] of cohort){
  const models=make(),report=reportFn();let cohortMissing=0,samples=0;
  for(const b of models){
   const roofCells=b.modules.filter(m=>m.role==='roof').flatMap(m=>m.cells);
   const structure=b.modules.filter(m=>['roof-purlin','support-pier','wall','cold-flue-masonry'].includes(m.role)).flatMap(m=>m.cells);
   const nearby=new Set(structure.map(c=>k(pos(c))));
   for(let i=0;i<roofCells.length;i+=5){
    const c=roofCells[i];samples++;
    let witnessed=false;
    for(let dx=-3;dx<=3&&!witnessed;dx++)for(let dz=-3;dz<=3&&!witnessed;dz++){
     if(Math.abs(dx)+Math.abs(dz)>3)continue;
     for(let dy=0;dy<=2;dy++)if(nearby.has(k([c[0]+dx,c[1]-dy,c[2]+dz]))){witnessed=true;break;}
    }
    if(witnessed)continue;
    cohortMissing++;
    let nearest=null,dist=Infinity;
    for(const s of structure){
     const horizontal=Math.abs(s[0]-c[0])+Math.abs(s[2]-c[2]);
     if(horizontal<dist){dist=horizontal;nearest=pos(s);}
    }
    const flue=b.architecture?.flueVoid??null;
    roof.push(freeze({cohort:label,id:b.id,at:pos(c),
      sourceCellIndex:i,closestStructuralSource:nearest,nearestHorizontalDistance:dist,
      sameFlueColumn:!!flue&&c[0]===flue[0]&&c[2]===flue[1],
      sampledNearbyBearingWitness:false,confirmedEngineeringLoadFailure:false,
      classification:'MISSING_SAMPLED_BEARING_WITNESS_REQUIRES_LOAD_PATH_TRACE',
      sourceUnchanged:true}));
   }
  }
  if(cohortMissing!==expected||report.roofBearingWitnessAbsent!==expected)
   throw Error('A3 source-specific witness count differs from protected physical auditor '+label+' '+cohortMissing+'/'+expected);
  summaries.push(freeze({cohort:label,sourceBuildings:models.length,sampledRoofCells:samples,witnessGaps:cohortMissing,
   engineeringCertified:false,sourceGeometryModified:false}));
 }
 if(roof.length!==274)throw Error('Roof source inventory must report exactly 274 distinct witness gap samples');

 const thirdById=new Map(createM2ThirdVariantPool().map(b=>[b.id,b]));
 const third=planUnplacedThirdRoofBearingRemediations();
 const beam=[];
 for(const model of third.models){
  const b=thirdById.get(model.blueprintId);
  if(!b)throw Error('Missing M2 third-variant source '+model.blueprintId);
  const occupied=new Map(b.modules.flatMap(m=>m.cells.map(c=>[k(pos(c)),c])));
  const flue=b.architecture?.flueVoid??null;
  for(const option of model.unplacedOptions){
   const at=option.candidateUnplacedBeam;
   const below=[at[0],at[1]-1,at[2]];
   const inFlue=!!flue&&at[0]===flue[0]&&at[2]===flue[1]&&at[1]>=3;
   const support=occupied.get(k(below));
   const attached=!!support&&['support-pier','roof-purlin','wall','cold-flue-masonry'].includes(
     b.modules.find(m=>m.cells.includes(support))?.role);
   const hardBlocked=!option.sourceCellUnoccupied||option.conflictsReservedAccess||inFlue;
   beam.push(freeze({cohort:'m2-third-unplaced-option',id:b.id,roof:option.roof,
     proposedBeam:at,below,belowSourceCellRole:support?.[3]??null,
     authoredBearingImmediatelyBelow:attached,
     sourceCellUnoccupied:option.sourceCellUnoccupied,
     reservedWalkwayConflict:option.conflictsReservedAccess,
     inFunctionalFlueColumn:inFlue,
     originalHorizontalSpan:option.horizontalSpanToExistingStructure,
     proposedFamily:option.physicalFamilyMaterialProposal,
     classification:hardBlocked?'BLOCKED_WITHOUT_AUTHOR_REDESIGN':'UNATTACHED_UNVERIFIED_LOAD_PATH',
     installed:false,structurallyApproved:false,producerOrientationCertified:false,sourceUnchanged:true}));
  }
 }
 if(beam.length!==156||third.sourceDerivedUnplacedCandidateCount!==156||third.physicalSupportsInstalled!==0)
  throw Error('M2 third separate 156 unplaced options drift');
 return freeze({schema:'mythwrought.roadmap-a3.source-specific-physical-classification.v1',
  counts:freeze({original3ADesigns:345,legacyFireplaceMounts:fireplace.length,
   legacyChimneyMounts:chimney.length,sampledRoofWitnessGaps:roof.length,unplacedBeamOptions:beam.length,
   physicalSupportsInstalled:0,originalSourcesChanged:0}),
  legacyFireplaceMounts:freeze(fireplace),legacyChimneyMounts:freeze(chimney),
  roofCohorts:freeze(summaries),roofWitnessRecords:freeze(roof),unplacedBeamRecords:freeze(beam),
  manualPackAudit:'real integrated producer source offsets and collision AABB read-only; assembly NOT approved',
  physicalLoadCertified:false,thermalOrFlueCertified:false,creatorApproved:false,realIphoneTested:false,
  gameRegistration:false,sourceModifications:0});
}
