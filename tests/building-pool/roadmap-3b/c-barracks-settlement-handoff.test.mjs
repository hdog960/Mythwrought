import test from 'node:test';
import assert from 'node:assert/strict';
import {createCRoadmapCBarracksHandoff} from '../../../src/building-pool/roadmap-3b/c-barracks-settlement-handoff.mjs';

test('C7 original source-only barracks settlement handoff records measured, ground-supported corridor, exact footprint and genuine two open wells',()=>{
 const a=createCRoadmapCBarracksHandoff(),b=createCRoadmapCBarracksHandoff();
 assert.deepEqual(a,b);
 assert.equal(a.id,'r3:barracks:desert:medium:2');
 assert.equal(a.sourceFingerprint.authoredVoxels,6739);
 assert.match(a.sourceFingerprint.sha256,/^[0-9a-f]{64}$/);
 assert.equal(a.occupiedFoundation.columns,1757);
 assert.equal(a.continuousGroundCorridor.verifiedColumns,98);
 assert.equal(a.roadSockets.length,2);
 assert.equal(a.chamberSockets.length,7);
 assert.deepEqual(a.sourceOpenCourts.map(p=>p.groundAbsentColumns),[9,9]);
 assert.equal(a.elevatedGuardPosition.realTreadCount,8);
 assert.ok(a.neededPhysicalFamilies.length>=7);
 assert.equal(a.sourceOnly,true);
 assert.equal(a.gameRegistered,false);
 assert.equal(a.acceptance.exactHeadCI,false);
 assert.equal(a.acceptance.physicalAssetAABB,false);
 assert.equal(a.settlementPlaced,false);
 assert.ok(Object.isFrozen(a));
});
