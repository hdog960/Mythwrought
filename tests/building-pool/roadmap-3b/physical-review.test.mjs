import {BIOME130_REGISTERED_SYMBOLS} from '../../../src/biome130-registry.mjs';
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
test('M1 typed ledger reflects actual current biome130 registered source shapes but never world placement approval',()=>{
 for(const ref of ['biome130:006','biome130:094','biome130:096','biome130:098','biome130:104']){
  const registered=BIOME130_REGISTERED_SYMBOLS.includes(ref);
  assert.equal(status(ref)?.status,registered?'registry-shape-available':'not-registered-in-current-main',ref);
  if(registered)assert.ok(Number.isSafeInteger(status(ref)?.numericId),ref+' real numeric ID absent');
  else assert.equal(status(ref)?.numericId,null,ref);
  assert.equal(status(ref)?.finalWorldProof,false,ref+' producer registry is not creator placement approval');
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
