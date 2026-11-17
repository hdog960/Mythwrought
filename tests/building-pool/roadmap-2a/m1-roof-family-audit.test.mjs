import test from 'node:test';
import assert from 'node:assert/strict';
import {inspect2ARoofAndWindows} from '../../../src/building-pool/roadmap-2a/m1-roof-family-audit.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';

test('real Pack1-5 producer descriptors identify actual roofing boxes, orientations and unresolved Pack5 variants',()=>{
 const a=inspect2ARoofAndWindows();
 assert.equal(a.designs,122);assert(a.roofCells>5000);assert(a.totalWindows>0);
 assert(a.roofSourceDescriptors.some(x=>x.valid&&x.visibleBoxes>0&&x.selectionBoxes>0),'physical roof descriptors not inspected');
 assert(a.roofSourceDescriptors.some(x=>x.pending&&x.symbol.startsWith('pack5:')),'ambiguous Pack5 roof should remain unresolved');
 assert(a.facadePhysicalChecks.some(x=>x.producer.valid&&x.producer.visibleBoxes>0),'actual physical window geometry absent');
 assert(a.facadePhysicalChecks.every(x=>x.registeredOpening),'source glass opening ABI mismatch');
 assert.equal(a.physicalFamilyMeshesRendered,false);assert.equal(a.worldSupportCertified,false);
 assert.equal(a.windowTransparencyApproved,false);assert.equal(a.saveWritten,false);
});
test('all six region-authored raised roof volumes have direct source-bearing cells, without approving flat-plate long spans',()=>{
 const a=inspect2ARoofAndWindows(M1_REGIONAL_SHOPS);
 assert.equal(a.designs,6);assert.equal(a.raisedMissingVerticalSupport,0);
 assert.equal(a.raisedGabledSourceDesigns.length,6);
 assert.equal(new Set(a.raisedGabledSourceDesigns.map(x=>x.roles.join(','))).size,6);
 assert(a.rootPlateMissingSupport>0,'long-span roof load must remain reported not assumed supported');
});
test('removing a raised roof cell beneath another exposes an unsupported real coordinate rather than silently approving it',()=>{
 const b=M1_REGIONAL_SHOPS.find(x=>x.category==='bakery');
 const key=new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
 const top=b.voxels.find(v=>v.architecturalRole==='unlit-ovenhouse-chimney-masonry'&&v.y>b.extents.y-3);
 assert(top,'need raised authored chimney geometry');
 const below=[top.x,top.y-1,top.z].join(',');assert(key.get(below)?.kind==='roof');
 const damaged={...b,voxels:b.voxels.filter(v=>[v.x,v.y,v.z].join(',')!==below)};
 const original=inspect2ARoofAndWindows([b]),broken=inspect2ARoofAndWindows([damaged]);
 assert.equal(broken.raisedMissingVerticalSupport,original.raisedMissingVerticalSupport+1);
});
