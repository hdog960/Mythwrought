import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

// Uses read-only REAL integrated Block Pack source interfaces; these are not
// runtime placement tests and do not approve any producer rendering or save ABI.
test('all six new M1 blueprints reference real manual-family catalog symbols with no unverified numeric block assignments',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.productionRegistered,false);
 const catalog=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 let count=0;
 for(const bp of M1_PUBLIC_MONUMENTS){
  const used=new Set([...bp.voxels.map(v=>v.material),'pack2:020']);
  for(const ref of used){
   assert(catalog.has(ref),bp.id+' unrecognized actual producer-family symbol: '+ref);
   const candidates=manualFivePackVariants(ref);
   assert(candidates.length>0,bp.id+': no physical variant candidates '+ref);
   assert(candidates.every(c=>Number.isSafeInteger(c.numericId)&&c.numericId!==255));
   count++;
  }
  assert.equal(bp.worldPlaced,false);
  assert.equal(bp.numericIdsAssigned,false);
 }
 assert(count>35,'inadequate source-authentic dependency coverage');
});
test('foundations, roofs, transparent window families and stairs have actual ABI shape descriptors but cannot be automatically approved',()=>{
 const used=new Set(M1_PUBLIC_MONUMENTS.flatMap(bp=>bp.voxels.map(v=>v.material)));
 for(const ref of ['pack1:002','pack1:005','pack1:008','pack2:015','pack2:022',
  'pack3:023','pack3:025','pack3:026','pack4:030','pack4:032','pack4:062']){
  if(!used.has(ref))continue;
  const alternatives=manualFivePackVariants(ref);
  const asset=resolveManualFivePackAsset(ref,{numericId:alternatives[0].numericId,orientation:'north'});
  assert.equal(asset.symbol,ref);
  assert.equal(asset.livePlaceable,false);
  assert.equal(asset.saveWritten,false);
  assert(asset.visibleBoxes.length>0);
  assert(asset.selectionBoxes.length>0);
  assert(asset.occupiedOffsets.length>0);
 }
});
test('source-backed Pack5 altar, stall displays and counters remain unresolved for yaw and exact variant handoff',()=>{
 let inspected=0;
 for(const bp of M1_PUBLIC_MONUMENTS){
  const result=inspectPack5InMixedBlueprint(bp);
  assert.equal(result.blueprintId,bp.id);
  assert.equal(result.worldPlaced,false);
  assert.equal(result.readyForCombinedPlacement,false);
  assert.equal(result.requiresCrossPackCollisionAndSupportValidation,true);
  if(result.pack5Total){
   inspected+=result.pack5Total;
   assert.equal(result.resolvedPack5Count,0);
   assert.equal(result.unresolvedPack5.length,result.pack5Total);
   assert(result.unresolvedPack5.every(v=>
    v.missing.includes('authored-variant')&&v.missing.includes('explicit-four-way-orientation')));
  }
 }
 assert(inspected>25,'expected real unapproved physical altar/counter/display decisions');
});
