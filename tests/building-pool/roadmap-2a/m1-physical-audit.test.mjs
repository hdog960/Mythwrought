import test from 'node:test';
import assert from 'node:assert/strict';
import {inspect2APhysicalReadiness} from '../../../src/building-pool/roadmap-2a/m1-physical-audit.mjs';
test('source-owner physical ABI inspector reads actual merged 96 families and 106 variants without a write',()=>{
 const result=inspect2APhysicalReadiness();
 assert.equal(result.authoredBlueprints,122);
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

test('real producer-resolved two-cell oak dividers preserve exact no-overlap pen footprints',()=>{
 const r=inspect2APhysicalReadiness();
 const pen=r.resolvedFixtureCandidates.filter(x=>x.id==='r2:pet-shop:temperate:small:01'&&x.symbol==='pack5:096'&&x.variant==='oak-stall-divider');
 const mountain=r.resolvedFixtureCandidates.filter(x=>x.id==='r2:pet-shop:mountain:medium:01'&&x.symbol==='pack5:096'&&x.variant==='oak-stall-divider');
 assert.equal(pen.length,6);assert.equal(mountain.length,3);
 for(const x of [...pen,...mountain]){assert.equal(x.occupiedOffsets,2);assert.equal(x.orientationProvenance,'explicit-author-intent');assert.equal(x.overlappedConceptualCells.length,0);}
 const unique=x=>new Set(x.flatMap(v=>v.physicalOccupiedCells.map(c=>c.join(','))));
 assert.equal(unique(pen).size,12);assert.equal(unique(mountain).size,6);
 assert.equal(r.physicalFootprintConflicts.length,0,JSON.stringify(r.physicalFootprintConflicts.slice(0,8)));
});
test('real producer Pack5 heavy gates occupy exactly two physically open 3-high cells in both 2A banks',()=>{
 const r=inspect2APhysicalReadiness();
 assert.equal(r.resolvedGateCandidates.length,18);
 const ids=new Set(r.resolvedGateCandidates.map(x=>x.id));
 assert(ids.has('r2:bank:mountain:large:01'));
 assert(ids.has('r2:bank:enchanted-forest:medium:01'));
 for(const gate of r.resolvedGateCandidates){assert.equal(gate.occupiedCells.length,2);assert(gate.hasTwoClearOpenings);assert.equal(gate.productionPlaced,false);}
});
