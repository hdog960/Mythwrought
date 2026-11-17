// Builder 3A M2 source-only producer-ABI and physical-fit blocker ledger.
// Describes unresolved work; DOES NOT alter legacy or M2 geometry or saves.
import {createLegacyBlacksmithPool} from './legacy-blacksmiths.mjs';
import {auditLegacyBlacksmithSupports} from './legacy-physical-support-audit.mjs';
import {createM2MetalworkPool} from './m2-metalwork-second-variants.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
const key=(x,y,z)=>[x,y,z].join(',');
export function auditM2MetalworkPhysicalFits(){
 const legacy=createLegacyBlacksmithPool(),old=auditLegacyBlacksmithSupports();
 const newModels=createM2MetalworkPool(),records=[];
 for(const b of newModels){
  const entries=b.modules.flatMap(m=>m.cells),filled=new Set(entries.map(c=>key(c.slice(0,3))));
  const familyRecords=[];
  for(const c of entries.filter(c=>['pack4:064','pack5:088','pack4:057'].includes(c[3]))){
   const o=c[4]??{},a=resolveManualFivePackAsset(c[3],o.variant?
     {orientation:o.orientation,variant:o.variant}:{orientation:o.orientation??'north'});
   const supports=a.supportOffsets.map(offset=>{
    const position=[c[0]+offset[0],c[1]+offset[1],c[2]+offset[2]];
    return {position,present:filled.has(key(position))};
   });
   familyRecords.push({family:c[3],at:c.slice(0,3),orientation:o.orientation??null,
    variant:o.variant??null,sourcePhysicalResolvable:a.builderResolvable,
    authoredSupportPresent:supports.every(s=>s.present),supports,
    producerLivePlaceable:a.livePlaceable,
    partialShapeClearanceApproved:false,heatApproved:false});
  }
  const forge=b.type==='blacksmith',flue=b.architecture.flueVoid;
  const flueOpen=forge?[...Array(18)].every((_,i)=>!filled.has(key([flue[0],i+3,flue[1]]))):null;
  records.push({id:b.id,legacyGeometryChanged:false,worldPlaced:false,
   physicallyPlacedSourceCells:entries.length,sourceOnly:true,
   sourceFixtureMountsPresent:familyRecords.every(a=>a.authoredSupportPresent),
   fireplaceSupportStatus:forge?'rear-source-cell-present; thermal and real AABB unapproved':'not-applicable',
   hollowMasonryShaft:forge,flueVerticallyOpen:flueOpen,
   futureChimneyCap:'pack4:063 symbolic unresolved; no floating/solid cap installed',
   weatherproofRoofApproved:false,spanLoadApproved:false,
   productionAABBClearanceApproved:false,familyRecords});
 }
 return {schema:'mythwrought.3a.m2.fit-readiness.v1',
  exactLegacyBlacksmiths:legacy.length,
  legacyMountsStillMissing:old.missingSupports,
  legacySupportRepairsApplied:0,legacyFingerprintsAltered:false,
  M2Authored:newModels.length,newColdSmithyFlues:records.filter(r=>r.hollowMasonryShaft).length,
  sourceFixtureSupportFailures:records.reduce((n,b)=>n+b.familyRecords.filter(x=>!x.authoredSupportPresent).length,0),
  newCapSymbolsPending:15,fullShapeCertified:0,productionPlacements:0,
  remainingBlockers:['Pack4 chimney cap geometry, hollow roof flashing and fire behavior',
   'Pack1 stone heat and side bearing, Pack3 roof span and weather',
   'true producer AABB intersections and oriented partial-family collisions',
   'chunk budget, save/schema-1 and physical iPhone review'],records};
}
