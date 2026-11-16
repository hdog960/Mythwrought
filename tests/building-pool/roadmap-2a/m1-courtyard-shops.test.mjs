import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_COURTYARD_SHOPS,M1_COURTYARD_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {inspect2ACourtyardPreflight} from '../../../src/building-pool/roadmap-2a/m1-courtyard-preflight.mjs';
const all=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS];
const key=(x,y,z)=>[x,y,z].join(',');
test('six original nonrectangular courtyards are real 3D blueprints, not reserved slots',()=>{
 assert.equal(M1_COURTYARD_SHOPS.length,6);assert.equal(all.length,56);
 assert.equal(new Set(all.map(x=>x.id)).size,56);assert.equal(new Set(all.map(structuralFingerprint)).size,56);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,68);
 assert.equal(inventory().authoredCandidateTotal,68);assert.equal(inventory().newlyAuthored,53);assert.equal(inventory().unwrittenNewCandidates,352);
 for(const b of M1_COURTYARD_SHOPS){assert(validateBlueprint(b).valid);assert(b.voxels.length>1200&&b.rooms.length===3);assert(!b.worldPlaced&&!b.numericIdsAssigned);}
});
test('read-only real-source courtyard/roof/weather and Pack5 multi-cell pen and vault footprints pass',()=>{
 const x=inspect2ACourtyardPreflight();
 assert.equal(x.buildings,6);assert.equal(x.emptyCourtyardColumns,130);
 assert.equal(x.fullWallColumns,56);assert.equal(x.physicalStallCells,8);
 assert.equal(x.realBankGateCells,2);assert.equal(x.reachableRoomTargets,18);
 assert.equal(x.physicalStructuralSpanCertified,false);assert.equal(x.physicalFamilyRendered,false);
 assert.equal(x.integrated,false);
});
test('negative regression catches a plugged courtyard floor, missing inner weather wall and missing roof cap',()=>{
 const b=M1_COURTYARD_SHOPS[0],c=M1_COURTYARD_PROFILES[0].cornerCourtyards[0],z=b.extents.z-c.depth,voidCell={x:0,y:1,z,kind:'floor',material:'pack2:013'};
 assert.throws(()=>inspect2ACourtyardPreflight([{...b,voxels:[...b.voxels,voidCell]}],[M1_COURTYARD_PROFILES[0]]),/not genuinely open/);
 const side=b.courtyardGeometry[0];
 assert.throws(()=>inspect2ACourtyardPreflight([{...b,voxels:b.voxels.filter(v=>key(v.x,v.y,v.z)!==key(side.innerX,3,z))}],[M1_COURTYARD_PROFILES[0]]),/missing return wall|open interior/);
 assert.throws(()=>inspect2ACourtyardPreflight([{...b,voxels:b.voxels.filter(v=>key(v.x,v.y,v.z)!==key(side.innerX,M1_COURTYARD_PROFILES[0].h+1,z))}],[M1_COURTYARD_PROFILES[0]]),/no cap roof/);
});
test('15 legacy General Stores stay source-exact and the first 35 originals have zero courtyard modifications',()=>{
 const pre=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS];
 assert.equal(pre.length,50);for(const b of pre)assert(!b.courtyardGeometry,b.id);
});
