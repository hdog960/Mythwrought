import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewM1PhysicalDependencies} from '../../../src/building-pool/roadmap-3b/physical-review.mjs';
const review=reviewM1PhysicalDependencies();
const status=symbol=>review.assets.find(a=>a.symbol===symbol);
console.log('MYTHWROUGHT_3B_M1_ABI='+JSON.stringify(review.assets.map(({symbol,uses,status,numericIds,numericId,error})=>({symbol,uses,status,numericIds,numericId,error}))));
test('M1 reports exactly 15 original watchtowers using current real 96-family/106-variant bridge without world writes',()=>{
 assert.equal(review.authored,15);
 assert.equal(review.occupancy,42642);
 assert.equal(review.manualCatalog.families,96);
 assert.equal(review.manualCatalog.numericVariants,106);
 assert.equal(review.manualCatalog.productionRegistered,false);
 assert.equal(review.worldPlaced,0);
 assert.equal(review.creatorApproved,0);
 assert.equal(review.readyForPhysicalConstruction,false);
 assert.equal(review.hasFinalPerCellOrientation,false);
 assert.equal(review.hasFinalMultiCellReservations,false);
 assert.ok(review.assets.every(a=>a.uses>0&&a.finalWorldProof===false));
});
test('M1 typed ledger distinguishes current biome130 006 from four unregistered far-future families',()=>{
 assert.equal(status('biome130:006')?.status,'registry-shape-available');
 for(const ref of ['biome130:094','biome130:096','biome130:098','biome130:104']){
  assert.equal(status(ref)?.status,'not-registered-in-current-main',ref);
  assert.equal(status(ref)?.numericId,null);
 }
});
test('M1 all imported manual source references have a typed, fail-closed physical catalog resolution status',()=>{
 const families=review.assets.filter(a=>a.source==='manual-five-pack');
 assert.ok(families.length>=6);
 assert.ok(families.every(a=>['default-shape-inspected','numeric-variant-unselected',
   'shape-needs-explicit-variant-or-state','missing-family'].includes(a.status)));
 for(const a of families){
  assert.equal(a.explicitlyUnresolved,true,'legacy source lacks per-cell ABI '+a.symbol);
  assert.equal(a.finalWorldProof,false);
 }
});
