// Builder 3A M2 third-variant producer-backed PHYSICAL-FIT DIAGNOSTIC.
// Calculates grounded fixture AABBs, occupied-offset reservation and support
// violations from the real merged main builder ABI, not cube-proxy screenshots.
// This is a proposal-only read. Never registers block IDs or writes world/saves.
import {createM2ThirdVariantPool} from './m2-metalwork-third-variants.mjs';
import {auditLegacyBlacksmithSupports} from './legacy-physical-support-audit.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';

const point=c=>c.slice(0,3).join(',');
const plus=(c,o)=>[c[0]+o[0],c[1]+o[1],c[2]+o[2]];
const freeze=o=>Object.freeze(o);
const overlaps=(a,b)=>{
 const e=1e-7;
 return a[0]<b[3]-e&&b[0]<a[3]-e&&a[1]<b[4]-e&&b[1]<a[4]-e&&
        a[2]<b[5]-e&&b[2]<a[5]-e;
};
const worldBox=(b,cell)=>b.map((v,i)=>v+cell[i%3]);
export function auditM2ThirdPhysicalFamilyFit(){
 const old=auditLegacyBlacksmithSupports(),all=createM2ThirdVariantPool(),models=[];
 let physicalReservationsBlocked=0,missingSourceSupportOffsets=0,fixtureAABBIntersections=0;
 let uncertifiedRoofSamples=0;
 for(const b of all){
  const cells=b.modules.flatMap(m=>m.cells),occupied=new Map(cells.map(c=>[point(c),c]));
  const fixtures=[],positions=cells.filter(c=>['pack5:088','pack4:057','pack4:064'].includes(c[3]));
  for(const c of positions){
   const placement=c[4]??{};
   const original=resolveManualFivePackAsset(c[3],{
     orientation:placement.orientation??'north',variant:placement.variant??null,
     state:placement.state??{}
   });
   const reservations=original.occupiedOffsets
    .filter(o=>o.some(v=>v!==0))
    .map(o=>({at:plus(c,o),blocked:occupied.has(point(plus(c,o)))}));
   const supports=original.supportOffsets.map(o=>({at:plus(c,o),present:occupied.has(point(plus(c,o)))}));
   const sourceBoxes=original.collisionBoxes.map(box=>worldBox(box,c));
   // Test actual selected family collision AABBs against all physical source
   // neighboring family shapes. Do not count the fixture against itself.
   let physicalIntersections=0,neighborChecks=0;
   for(const other of cells){
    if(other===c)continue;
    if(Math.abs(other[0]-c[0])>2||Math.abs(other[1]-c[1])>2||Math.abs(other[2]-c[2])>2)continue;
    const metadata=other[4]??{};
    const neighbor=resolveManualFivePackAsset(other[3],{
      orientation:metadata.orientation??'north',variant:metadata.variant??null,
      state:metadata.state??{}
    });
    neighborChecks++;
    if(sourceBoxes.some(a=>neighbor.collisionBoxes.some(box=>overlaps(a,worldBox(box,other)))))
      physicalIntersections++;
   }
   physicalReservationsBlocked+=reservations.filter(a=>a.blocked).length;
   missingSourceSupportOffsets+=supports.filter(a=>!a.present).length;
   fixtureAABBIntersections+=physicalIntersections;
   fixtures.push(freeze({family:c[3],at:c.slice(0,3),rotation:placement.orientation??null,
     actualSelectedVariant:original.variant,sourceNumericId:original.numericId,
     visibleBoxes:original.visibleBoxes.length,collisionBoxes:original.collisionBoxes.length,
     occupiedPhysicalOffsets:original.occupiedOffsets.length,supportOffsets:supports,
     overlappingReservedCoordinates:reservations.filter(a=>a.blocked),
     actualAABBIntersectionCount:physicalIntersections,nearbyPhysicalShapesChecked:neighborChecks,
     sourceSelectable:original.builderResolvable,livePlaceable:original.livePlaceable,
     mountHeatCertified:false,productionCollisionCertified:false}));
  }
  const roof=b.modules.find(m=>m.role==='roof')?.cells??[];
  const loadBearing=cells.filter(c=>['wall','support-pier','roof-purlin','cold-flue-masonry'].includes(
    b.modules.find(m=>m.cells.includes(c))?.role));
  // Coarse roof support span diagnostics: a roof tile is *not* certified by
  // merely having piers elsewhere. Sampling every sixth tile avoids claiming
  // an unmeasured structural pass for the entire theoretical footprint.
  let distantRoofSamples=0,roofSamples=0;
  for(let i=0;i<roof.length;i+=6){
   const r=roof[i];roofSamples++;
   const nearby=loadBearing.some(s=>Math.abs(r[0]-s[0])+Math.abs(r[2]-s[2])<=5&&
      r[1]-s[1]>=0&&r[1]-s[1]<=3);
   if(!nearby)distantRoofSamples++;
  }
  uncertifiedRoofSamples+=distantRoofSamples;
  models.push(freeze({id:b.id,category:b.type,sourceCells:cells.length,
   trueWings:b.architecture.wingSegments,
   sampledRoofTiles:roofSamples,remoteRoofTilesNeedingEngineering:distantRoofSamples,
   hollowFlueUnobstructed:b.architecture.coldHollowFlue!==null,
   pack4ChimneyCapPlaced:false,
   productionStructuralApproval:false,physicalRoofAcceptable:false,
   creatorAccepted:false,worldIntegrated:false,
   fixtures}));
 }
 return freeze({schema:'mythwrought.3a.m2.third-physical-aabb-diagnostics.v1',
  originalFifteenChanged:false,legacyBlacksmithMountBlockers:old.missingSupports,
  originalSourceApproval:false,newCandidateModels:models.length,
  physicalReservationsBlocked,missingSourceSupportOffsets,
  fixtureAABBIntersections,
  uncertifiedRoofSamples,realPhysicalFamilyAudit:true,
  preciseWorldCollisionCertified:false,heatOrWeatherApproved:false,
  measuredPhysicalIPhone:false,productionPlacements:0,
  models:freeze(models)});
}
