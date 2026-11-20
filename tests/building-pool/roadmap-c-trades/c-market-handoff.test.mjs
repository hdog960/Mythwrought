import test from 'node:test';
import assert from 'node:assert/strict';
import {createCDesertMarketHandoff} from '../../../src/building-pool/roadmap-c-trades/c-market-handoff.mjs';

test('C7 market handoff fingerprints all 3602 real source voxels and all 1391 supported ground columns',()=>{
 const p=createCDesertMarketHandoff();
 assert.deepEqual(p,createCDesertMarketHandoff());
 assert.equal(p.id,'r2:market-square:desert:small:01');
 assert.equal(p.sourceFingerprint.authoredVoxelCount,3602);
 assert.match(p.sourceFingerprint.geometryDigest,/^[0-9a-f]{64}$/);
 assert.equal(p.actualFootprint.occupiedGroundColumns,1391);
 assert.equal(p.retailVendorSockets.length,6);
 assert.equal(p.openAirGroundColumns.length,21);
 assert.equal(p.streetEntrance.height,3);
 assert.equal(p.gameRegistered,false);
 assert.equal(p.evidence.realSourceWebGL2Verified,false);
 assert.equal(p.evidence.producerPhysicalShapesApproved,false);
 assert.equal(p.creatorApproved,false);
 assert.ok(Object.isFrozen(p));
});
test('C7 each public vendor and street approach has independent source coordinates',()=>{
 const p=createCDesertMarketHandoff();
 const market=new Set(p.retailVendorSockets.map(t=>t.name));
 assert.equal(market.size,6);
 for(const s of p.retailVendorSockets){
  assert.ok(Number.isInteger(s.x)&&Number.isInteger(s.z));
  assert.equal(s.y,2);
  assert.ok(p.publicApproach.some(x=>x.x===s.x&&x.z===s.z));
 }
 assert.ok(p.physicalDependencies.length>=8);
 assert.deepEqual(p.streetEntrance,{x:21,y:2,z:0,width:2,height:3,facing:'north'});
});
