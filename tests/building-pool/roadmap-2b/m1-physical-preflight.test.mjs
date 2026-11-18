import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {manualFivePackVariants,resolveManualFivePackAsset,MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

// These are source-authentic interface checks, NOT live registration or
// cross-pack placement certification. Do not map visual cube proxies to
// source AABBs without the physical variant/orientation decisions.
test('regional structural symbols resolve in integrated manual family ABI with honest non-live flags',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 for(const symbol of ['pack1:002','pack1:005','pack1:008','pack2:013','pack2:015',
   'pack2:022','pack3:023','pack3:025','pack3:026','pack4:030','pack4:062']){
  const variants=manualFivePackVariants(symbol);
  assert(variants.length>0,symbol+' missing family variant');
  const physical=resolveManualFivePackAsset(symbol,{
   numericId:variants[0].numericId,orientation:'north'
  });
  assert.equal(physical.symbol,symbol);
  assert.equal(physical.livePlaceable,false,symbol+' incorrectly claims live placement');
  assert.equal(physical.saveWritten,false);
  assert(physical.visibleBoxes.length>0&&physical.selectionBoxes.length>0,
   symbol+' has no actual source-defined visible and targetable AABBs');
  assert(physical.occupiedOffsets.length>0);
  assert(physical.occupiedOffsets.every(c=>c.length===3&&c.every(Number.isSafeInteger)));
 }
});
test('source Pack 5 resolver flags unselected physical variants and yaw instead of assuming a safe construction',()=>{
 let needed=0;
 for(const bp of M1_REGIONAL_EXEMPLARS){
  const result=inspectPack5InMixedBlueprint(bp);
  assert.equal(result.blueprintId,bp.id);
  assert.equal(result.worldPlaced,false);
  assert.equal(result.readyForCombinedPlacement,false);
  assert.equal(result.requiresCrossPackCollisionAndSupportValidation,true);
  if(result.pack5Total){
   needed+=result.pack5Total;
   assert.equal(result.resolvedPack5Count,0,
    bp.id+' wrongly certified unspecific family without a physical authored variant');
   assert.equal(result.unresolvedPack5.length,result.pack5Total,bp.id);
   assert(result.unresolvedPack5.every(item=>
    item.missing.includes('authored-variant')&&item.missing.includes('explicit-four-way-orientation')),
    bp.id+' missed explicit physical orientation/variant handoff');
  }
 }
 assert(needed>30,'expected genuine symbolic family-mount blockers');
});
test('theater lower/upper stage landings remain symbolic even though Pack 1 has physical stair AABBs',()=>{
 const stairs=M1_REGIONAL_EXEMPLARS.filter(x=>x.category==='theater')
  .flatMap(bp=>bp.voxels.filter(v=>v.material==='pack1:008'));
 assert.equal(stairs.length,4);
 const choices=manualFivePackVariants('pack1:008');
 assert(choices.length>=1);
 const shape=resolveManualFivePackAsset('pack1:008',{numericId:choices[0].numericId,orientation:'north'});
 assert(shape.visibleBoxes.length>0&&shape.collisionBoxes.length>0);
 for(const cell of stairs){
  assert.equal(cell.shapeRotationStatus,'unresolved-symbolic');
  assert.equal(cell.intendedFacing,'stage');
  assert(cell.lowerLanding&&cell.upperLanding);
 }
});
