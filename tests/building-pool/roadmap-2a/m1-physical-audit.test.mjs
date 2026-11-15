import test from 'node:test';
import assert from 'node:assert/strict';
import {inspect2APhysicalReadiness} from '../../../src/building-pool/roadmap-2a/m1-physical-audit.mjs';
test('source-owner physical ABI inspector reads actual merged 96 families and 106 variants without a write',()=>{
 const result=inspect2APhysicalReadiness();
 assert.equal(result.authoredBlueprints,26);
 assert.equal(result.manualFamilies,96);
 assert.equal(result.manualVariants,106);
 assert.equal(result.productionRegistered,false);
 assert.equal(result.worldPlaced,false);
 assert.equal(result.saveWritten,false);
 assert.equal(result.hasFinalPhysicalFamilyAcceptance,false);
 assert.deepEqual(result.unknownManualSymbols,[]);
 assert(result.resolvedFixtureCandidates.length>0,'no physical producer fixtures inspected');
 assert(result.physicallyInspectedWindows.length>0,'no shaped windows inspected');
 for(const p of result.resolvedFixtureCandidates){
  assert(p.selectionBoxes>0&&p.occupiedOffsets>0,p.id);
  assert(Array.isArray(p.overlappedConceptualCells));
 }
 for(const w of result.physicallyInspectedWindows)assert(w.selectionBoxes>0);
});
test('real family geometry remains explicitly distinct from conceptual occupied cells and support/wall/roof approval',()=>{
 const r=inspect2APhysicalReadiness();
 assert(r.roofSymbols.length>0);
 assert(r.pending.every(p=>p.reason));
 assert(r.manualSymbolUse.length>0);
 // The audit is intentionally not a production placement or runtime ABI pass.
 assert.equal(r.hasFinalPhysicalFamilyAcceptance,false);
});
