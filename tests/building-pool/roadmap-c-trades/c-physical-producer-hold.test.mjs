// Deliberately non-certifying C-owned trade original producer-fit exposure.
 // Each syntactically valid symbolic block awaits actual integrated Pack1-5/
 // biome130 per-variant producer AABB, rotation, supports and collision proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBlueprint,validateSymbol} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {createCDesertSmallMarket} from '../../../src/building-pool/roadmap-c-trades/wave1-desert-market.mjs';
import {createCRiverbendTailor} from '../../../src/building-pool/roadmap-c-trades/wave2-riverbend-tailor.mjs';
import {createCCopperfordButcher} from '../../../src/building-pool/roadmap-c-trades/wave3-copperford-butcher.mjs';
import {createCSilverfinchJeweler} from '../../../src/building-pool/roadmap-c-trades/wave4-silverfinch-jeweler.mjs';
import {createCWrenfieldBookshop} from '../../../src/building-pool/roadmap-c-trades/wave5-wrenfield-bookshop.mjs';
import {createCWinterglassMarket} from '../../../src/building-pool/roadmap-c-trades/wave6-winterglass-snow-market.mjs';
const cases=[
 ['r2:market-square:desert:small:01',3602,createCDesertSmallMarket],
 ['r2:tailor:temperate:small:03',2846,createCRiverbendTailor],
 ['r2:butcher:temperate:small:02',2927,createCCopperfordButcher],
 ['r2:jeweler:temperate:small:02',3043,createCSilverfinchJeweler],
 ['r2:bookshop:temperate:small:02',3911,createCWrenfieldBookshop],
 ['r2:market-square:snow:small:03',4968,createCWinterglassMarket]
];
test('all six original C-owned trade source symbols remain fully documented but 21297 physical placements lack per-variant AABB/yaw/collision acceptance',()=>{
 const refs=new Map();let sourceCells=0;
 for(const [id,count,make] of cases){
  const b=make();
  assert.equal(b.id,id);
  assert.equal(b.voxels.length,count);
  assert.equal(validateBlueprint(b).uniqueCells,count);
  assert.equal(b.isolated,true);assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  const declared=new Map(b.unresolvedDependencies.map(x=>[x.ref,x.issue]));
  assert.ok(declared.size>0,'no source physical unresolved asset ledger '+id);
  for(const voxel of b.voxels){
   const material=voxel.material;
   assert.ok(validateSymbol(material),'material outside original source symbol families '+material);
   assert.ok(declared.has(material)&&declared.get(material),
    'physical Pack asset symbol missing unresolved producer-ABI ledger '+id+' '+material);
   refs.set(material,(refs.get(material)||0)+1);
  }
  assert.ok(b.openings.some(x=>x.type==='entrance'));
  assert.ok(b.openings.some(x=>x.type==='window'));
  sourceCells+=count;
  console.log('MYTHWROUGHT_C_TRADE_REAL_PRODUCER_HOLD='+JSON.stringify({
   id,sourceVoxels:count,unverifiedVariantPlacementCount:count,
   physicalProducerCertified:false,sourceOnly:true}));
 }
 assert.equal(sourceCells,21297);
 assert.equal(refs.size,22,'producer source symbolic family inventory unexpectedly changed');
 assert.equal([...refs.values()].reduce((a,b)=>a+b,0),21297);
 assert.ok(refs.has('pack5:086')&&refs.has('pack4:030')&&refs.has('biome130:006'));
 console.log('MYTHWROUGHT_C_2B_SOURCE_PRODUCER_BLOCKED='+JSON.stringify({
  CTradeCandidates:cases.length,sourceVoxels:sourceCells,unverifiedSourcePlacements:sourceCells,
  uniqueSymbolicFamilies:refs.size,physicalVariantAabbYawCollisionApproved:false,
  sourcePreviewCannotSubstituteForRealIntegratedProducer:true}));
});
