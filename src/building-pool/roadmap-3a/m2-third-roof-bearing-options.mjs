/**
 * Builder 3A read-only supporting-beam option study for the 156 source roof
 * bearing gaps found in the thirty unmodified M2 third-variant buildings.
 * No source geometry is edited. Not an engineering load certification.
 */
import {createM2ThirdVariantPool} from './m2-metalwork-third-variants.mjs';
import {auditM2ThirdPhysicalFamilyFit} from './m2-third-physical-aabb-audit.mjs';
const key=(x,y,z)=>x+','+y+','+z;
export function planUnplacedThirdRoofBearingRemediations(){
 const original=createM2ThirdVariantPool();
 const prior=auditM2ThirdPhysicalFamilyFit(),models=[];
 for(const b of original){
  const all=b.modules.flatMap(m=>m.cells);
  const occupied=new Map(all.map(c=>[key(...c.slice(0,3)),c]));
  const supports=b.modules.filter(m=>['wall','support-pier','roof-purlin','cold-flue-masonry'].includes(m.role)).flatMap(m=>m.cells);
  const roof=b.modules.find(m=>m.role==='roof').cells;
  const proposed=[];
  for(let i=0;i<roof.length;i+=6){
   const [x,y,z]=roof[i];
   const has= supports.some(c=>Math.abs(x-c[0])+Math.abs(z-c[2])<=5&&
     y-c[1]>=0&&y-c[1]<=3);
   if(has)continue;
   const at=[x,y-1,z];
   // A support block is not accepted merely because the immediate cell is
   // clear; it needs a load path, approved material and creator review.
   const occupiedBy=occupied.get(key(...at));
   const nearest=supports.reduce((best,c)=>{
    const distance=Math.abs(x-c[0])+Math.abs(z-c[2]);
    if(distance>=best.horizontalDistance)return best;
    return {source:[c[0],c[1],c[2]],horizontalDistance:distance};
   },{source:null,horizontalDistance:Infinity});
   const aisle=b.clearances?.some(cl=>
     at[0]>=cl.x&&at[0]<cl.x+cl.width&&
     at[1]>=cl.y&&at[1]<cl.y+cl.height&&
     at[2]>=cl.z&&at[2]<cl.z+cl.depth)??false;
   proposed.push(Object.freeze({roof:[x,y,z],candidateUnplacedBeam:at,
     sourceCellUnoccupied:!occupiedBy,occupyingSourceRole:occupiedBy?.[3]??null,
     conflictsReservedAccess:aisle,
     nearestAuthoredStructuralSource:nearest.source,
     horizontalSpanToExistingStructure:nearest.horizontalDistance,
     attachedLoadPathVerified:false,
     physicalFamilyMaterialProposal:'pack2:015',
     sourceGeometryEdited:false,engineeringApproved:false,
     resolution:'PENDING_CREATOR_AND_STRUCTURAL_REVIEW'}));
  }
  models.push(Object.freeze({blueprintId:b.id,sourceCells:all.length,
   previousUnverifiedRoofSamples:proposed.length,
   sourceGeometryPreserved:true,unplacedOptions:Object.freeze(proposed)}));
 }
 const candidates=models.reduce((n,m)=>n+m.previousUnverifiedRoofSamples,0);
 return Object.freeze({schema:'mythwrought.builder3a.m2.third-roof-support-options.v1',
  previousRoofSamplesWithoutBearingWitness:prior.uncertifiedRoofSamples,
  sourceDerivedUnplacedCandidateCount:candidates,
  originalThirdVariants:models.length,
  originalBlacksmithLegacyDefectsStillOpen:prior.legacyBlacksmithMountBlockers,
  actualRoofSourceModifications:0,physicalSupportsInstalled:0,
  structuralEngineeringApproved:false,
  roofWeatherApproved:false,
  unsupportedSamplesAfterApprovedRepair:prior.uncertifiedRoofSamples,
  models:Object.freeze(models)});
}
