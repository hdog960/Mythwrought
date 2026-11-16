import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_U_COURT_SHOPS,M1_U_COURT_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {inspect2AUFootprints} from '../../../src/building-pool/roadmap-2a/m1-u-court-preflight.mjs';
const coord=(x,y,z)=>[x,y,z].join(',');
test('six new U-shaped original 2A buildings represent 62/420 genuine authored candidate IDs, 358 unauthored',()=>{
 assert.equal(M1_U_COURT_SHOPS.length,6);assert.equal(inventory().authoredCandidateTotal,62);assert.equal(inventory().newlyAuthored,47);
 assert.equal(inventory().unwrittenNewCandidates,358);assert.equal(plannedSlots().filter(x=>x.authoredHere).length,62);
 assert.equal(new Set(M1_U_COURT_SHOPS.map(x=>x.id)).size,6);assert.equal(new Set(M1_U_COURT_SHOPS.map(structuralFingerprint)).size,6);
 for(const b of M1_U_COURT_SHOPS){assert(validateBlueprint(b).valid);assert.equal(b.rooms.length,4);assert(b.voxels.length>2000);assert.equal(b.worldPlaced,false);}
});
test('physical producer-backed two-cell pens and vault plus true U roof absence and four-room circulation',()=>{
 const p=inspect2AUFootprints();assert.equal(p.models,6);
 assert.equal(p.removedRearColumns,478);assert.equal(p.removedFrontColumns,72);
 assert.equal(p.roofCapWallColumns,200);assert.equal(p.physicalPenOccupiedCells,6);assert.equal(p.bankGateOccupiedCells,2);
 assert.equal(p.accessibleRooms,24);assert.equal(p.physicalFamilyMeshRendered,false);assert.equal(p.windowMountApproved,false);
 assert.equal(p.roofLoadCertified,false);assert.equal(p.creatorApproved,false);assert.equal(p.integrated,false);
});
test('negative weather tests fail closed when U court is roof-covered, missing inner wall or front step is filled',()=>{
 const p=M1_U_COURT_PROFILES[0],b=M1_U_COURT_SHOPS[0],c=p.openRearCourt,z=p.d-c.depth;
 const bogusRoof={x:c.x0,y:p.h+1,z,kind:'roof',material:p.roof};
 assert.throws(()=>inspect2AUFootprints([{...b,voxels:[...b.voxels,bogusRoof]}],[p]),/open-air column blocked/);
 const removed=b.voxels.filter(v=>coord(v.x,v.y,v.z)!==coord(c.x0-1,4,z));
 assert.throws(()=>inspect2AUFootprints([{...b,voxels:removed}],[p]),/weather leg not sealed/);
 const f=p.frontWingSetback,frontX=f.side==='west'?0:p.w-1;
 assert.throws(()=>inspect2AUFootprints([{...b,voxels:[...b.voxels,{x:frontX,y:0,z:0,kind:'foundation',material:p.foundation}]}],[p]),/open-air column blocked/);
});
test('all protected inherited and first 6 L-courtyard source geometries remain separate and untouched',()=>{
 assert.equal(M1_GENERAL_STORES.length,15);assert.equal(M1_COURTYARD_SHOPS.length,6);
 for(const b of [...M1_GENERAL_STORES,...M1_COURTYARD_SHOPS])assert(!b.courtyardGeometry?.some(c=>c.kind==='open-rear-U-courtyard'));
});
