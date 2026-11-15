import test from 'node:test';
import assert from 'node:assert/strict';
import {auditAllM1Materials,auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import {buildM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';

test('every inherited design reviews merged manual-family ABI without writing to saves or world',()=>{
 const r=auditAllM1Materials();
 assert.equal(r.designs,30);
 assert.equal(r.manualFamilies,96);
 assert.equal(r.manualVariants,106);
 assert.ok(r.totalGroups>=30);
 assert.ok(r.physicalShapeSampleGroups>0);
 assert.equal(r.allReadyForWorld,false);
 assert.ok(r.reports.every(x=>x.entries.length>0&&x.symbolicCells>0&&
  x.worldHeightPreflightRequired&&!x.worldPlaced&&!x.saveWritten&&!x.productionReady));
});
test('physical examples retain explicit support/collision/yaw and whole-building integration blockers',()=>{
 const r=auditBlueprintMaterials(buildM1('castle-palace','temperate','medium'));
 assert.equal(r.id,'r4:castle-palace:temperate:medium:01');
 for(const g of r.entries){
  assert.equal(g.chosenNumericId,null);
  assert.ok(g.blockedBy.length>0);
  if(g.status==='source-shape-resolved-for-review'){
   assert.ok(g.visibleAABBs>0&&g.selectionAABBs>0&&g.occupiedOffsets>0);
   assert.ok(g.blockedBy.some(x=>x.includes('support')));
  }
 }
});
test('unverified biome130 stays symbolic with no invented production block ID',()=>{
 const r=auditBlueprintMaterials(buildM1('civic-hall','mountain','small'));
 for(const g of r.entries.filter(x=>x.ref.startsWith('biome130:'))){
  assert.equal(g.status,'unregistered-biome130-symbol');
  assert.equal(g.chosenNumericId,null);
 }
});
