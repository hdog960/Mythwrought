import test from 'node:test';
import assert from 'node:assert/strict';
import {SPAN_CANDIDATES,inspect2AConceptualRoofSpans} from '../../../src/building-pool/roadmap-2a/m1-span-preflight.mjs';

test('all 44 source roof plates report actual lateral reach from bearing wall, not a fictitious supported flag',()=>{
 const r=inspect2AConceptualRoofSpans();assert.equal(r.buildings,44);
 assert.equal(r.spans.length,44);assert(r.directlySupportedRoofCells>0);assert(r.roofCellsWithoutDirectBearing>10000);
 assert(r.maximumLateralCellsToNearestBearing>=5);
 assert(r.unapprovedSpandrelCells>100);
 assert.equal(r.unrootedElevations,0,'authored elevated roof geometry must have a connected source root');
 assert.equal(r.warnings.length,0,'disconnected roof patch detected');
 assert.equal(r.physicalRoofLoadCertified,false);assert.equal(r.structuralEngineeringPerformed,false);
});
test('all 18 modern recessed front porticoes remain unapproved physical-spandrel supports',()=>{
 const modern=r=>r.id.startsWith('r2:')&&r.unapprovedSpandrels>0;
 const items=inspect2AConceptualRoofSpans().spans.filter(modern);
 assert(items.length>=18);
 assert(items.every(s=>s.maxNearestBearingDistance>0));
});
test('negative support mutation increases unsupported roof cells instead of silently treating a floating plate as held',()=>{
 const b=SPAN_CANDIDATES.find(x=>x.id==='r2:bank:temperate:medium:01');assert(b);
 const lowestRoofY=Math.min(...b.voxels.filter(v=>v.kind==='roof').map(v=>v.y));
 const lower=b.voxels.find(v=>v.kind==='wall'&&v.y===lowestRoofY-1&&v.x===0&&v.z>1&&v.z<b.extents.z-2);
 assert(lower);
 const baseline=inspect2AConceptualRoofSpans([b]);
 const broken={...b,voxels:b.voxels.filter(v=>v!==lower)};
 const after=inspect2AConceptualRoofSpans([broken]);
 assert(after.roofCellsWithoutDirectBearing>baseline.roofCellsWithoutDirectBearing);
 assert.equal(after.physicalRoofLoadCertified,false);
});
