/** Read-only Roadmap A3 exact source-cell roof-witness census.
 * Copies the unchanged archived fifth-cell sampling contract exactly.
 * No support is installed and no load capacity, weather or roof span is certified.
 */
import {createM2FourthVariantPool} from './m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool} from './m2-metalwork-fifth-variants.mjs';
import {createM3CraftSecondPool} from './m3-craft-second-variants.mjs';
import {createM3CraftThirdPool} from './m3-craft-third-variants.mjs';
const key=(x,y,z)=>x+','+y+','+z;
export const ROADMAP_A3_ROOF_COHORTS=Object.freeze([
 Object.freeze({key:'m2-metal-fourth',count:33,create:createM2FourthVariantPool}),
 Object.freeze({key:'m2-metal-fifth',count:118,create:createM2FifthVariantPool}),
 Object.freeze({key:'m3-craft-second',count:83,create:createM3CraftSecondPool}),
 Object.freeze({key:'m3-craft-third',count:40,create:createM3CraftThirdPool})
]);
function exactWitnesses(building){
 const modules=new Map(building.modules.map(m=>[m.role,m.cells]));
 const supportRoles=['roof-purlin','support-pier','wall','cold-flue-masonry'];
 const supports=supportRoles.flatMap(role=>(modules.get(role)||[]).map(c=>({at:c.slice(0,3),role,ref:c[3]})));
 const indexed=new Set(supports.map(s=>key(...s.at))),roof=modules.get('roof')??[];
 const findings=[];
 for(let i=0;i<roof.length;i+=5){
  const c=roof[i];let found=false;
  for(let dx=-3;dx<=3&&!found;dx++)for(let dz=-3;dz<=3&&!found;dz++){
   if(Math.abs(dx)+Math.abs(dz)>3)continue;
   for(let dy=0;dy<=2;dy++)if(indexed.has(key(c[0]+dx,c[1]-dy,c[2]+dz))){found=true;break;}
  }
  if(found)continue;
  const [x,y,z]=c;
  let closest=null,metric=Infinity;
  for(const p of supports){
   const [sx,sy,sz]=p.at;
   const dist=Math.abs(sx-x)+Math.abs(sz-z)+Math.abs(sy-y);
   if(dist<metric){metric=dist;closest=p;}
  }
  findings.push(Object.freeze({
   blueprintId:building.id,sourceRoofIndex:i,roofPosition:[x,y,z],
   sampledRoofAsset:c[3],roofCellMetadata:c[4]??null,
   nearbyBearingRoleWitness:false,
   nearestAuthoredStructuralCell:closest?.at??null,
   nearestAuthoredStructuralRole:closest?.role??null,
   nearestAuthoredStructuralAsset:closest?.ref??null,
   nearestSourceCellManhattanDistance:Number.isFinite(metric)?metric:null,
   classification:'ROOF_PROXIMITY_WITNESS_ABSENT_NOT_ENGINEERING_FAILURE',
   correctiveSourceGeometryPlaced:false,
   actualMeshMountValidated:false,roofLoadCertified:false
  }));
 }
 return {blueprintId:building.id,roofCells:roof.length,samples:Math.ceil(roof.length/5),witnesses:findings};
}
export function readOnlyRoadmapA3RoofWitnessLedger(){
 const cohorts=ROADMAP_A3_ROOF_COHORTS.map(cohort=>{
  const models=cohort.create().map(exactWitnesses);
  const count=models.reduce((n,b)=>n+b.witnesses.length,0);
  return {cohort:cohort.key,previouslyArchivedWitnessCount:cohort.count,
   sourceModels:models.length,sourceGeometryAltered:false,
   roofSamples:models.reduce((n,b)=>n+b.samples,0),
   exactlyLocatedWarnings:count,
   buildings:models.filter(m=>m.witnesses.length>0)};
 });
 const total=cohorts.reduce((n,c)=>n+c.exactlyLocatedWarnings,0);
 return Object.freeze({schema:'mythwrought.roadmap-a.a3-roof-witness-positions.v1',
  immutableSourcePR:183,exactParentHead:'76656f35d2065bf24f288ea828f9e33f134cefd0',
  sourceOnly:true,productionPlaced:false,roofGeometryModified:0,
  originalCohortCounts:[33,118,83,40],totalExactLocatedWarnings:total,
  beamProposalsSeparatelyCounted:156,
  historicalWarningsNotCertifiedStructuralFailures:true,
  cohorts});
}
