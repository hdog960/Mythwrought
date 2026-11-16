import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_U_COURT_SHOPS,M1_U_COURT_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';

import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {inspect2AUFootprints} from '../../../src/building-pool/roadmap-2a/m1-u-court-preflight.mjs';
const coord=(x,y,z)=>[x,y,z].join(',');
test('six new U-shaped original 2A buildings represent 68/420 genuine authored candidate IDs, 340 unauthored',()=>{
 assert.equal(M1_U_COURT_SHOPS.length,6);assert.equal(inventory().authoredCandidateTotal,80);assert.equal(inventory().newlyAuthored,65);
 assert.equal(inventory().unwrittenNewCandidates,340);assert.equal(plannedSlots().filter(x=>x.authoredHere).length,80);
 assert.equal(new Set(M1_U_COURT_SHOPS.map(x=>x.id)).size,6);assert.equal(new Set(M1_U_COURT_SHOPS.map(structuralFingerprint)).size,6);
 for(const b of M1_U_COURT_SHOPS){assert(validateBlueprint(b).valid);assert.equal(b.rooms.length,4);assert(b.voxels.length>2000);assert.equal(b.worldPlaced,false);}
});
test('physical producer-backed two-cell pens and vault plus true U roof absence and four-room circulation',()=>{
 const p=inspect2AUFootprints();assert.equal(p.models,6);
 assert.equal(p.removedRearColumns,683);assert.equal(p.removedFrontColumns,140);
 assert.equal(p.roofCapWallColumns,249);assert.equal(p.physicalPenOccupiedCells,6);assert.equal(p.bankGateOccupiedCells,2);
 assert.equal(p.accessibleRooms,24);assert.equal(p.physicalFamilyMeshRendered,false);assert.equal(p.windowMountApproved,false);
 assert.equal(p.roofLoadCertified,false);assert.equal(p.creatorApproved,false);assert.equal(p.integrated,false);
});
test('true producer two-cell stall catches the originally evidenced source-partition collision rather than assuming a one-cell fixture',()=>{
 const pet=M1_U_COURT_SHOPS.find(x=>x.category==='pet-shop'),profile=M1_U_COURT_PROFILES.find(x=>x.category==='pet-shop');
 const original=pet.voxels.find(v=>v.kind==='fixture'&&v.material==='pack5:096'&&v.x===2&&v.z===10);
 assert(original,'missing corrected source pen at [2,2,10]');
 const damaged={...pet,voxels:pet.voxels.map(v=>v===original?{...v,z:11}:v)};
 assert.throws(()=>inspect2AUFootprints([damaged],[profile]),/real oak pen second cell intersects source wall/);
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

// Eight D4 isometries, using exact source floor coordinates rather than palette names.
const floorCells=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function symmetryVersions(points){
 const variants=[];
 for(let mirror=0;mirror<2;mirror++)for(let quarter=0;quarter<4;quarter++){
  const transformed=points.map(([px,pz])=>{let x=mirror?-px:px,z=pz;for(let r=0;r<quarter;r++){const n=x;x=-z;z=n;}return[x,z];});
  const xmin=Math.min(...transformed.map(v=>v[0])),zmin=Math.min(...transformed.map(v=>v[1]));
  variants.push(new Set(transformed.map(([x,z])=>(x-xmin)+','+(z-zmin))));
 }
 return variants;
}
function jaccard(a,b){let both=0;for(const value of a)if(b.has(value))both++;return both/(a.size+b.size-both);}
test('all six authored U buildings reject any 2D floor near-duplicate against the protected 62-design cohort under all eight D4 symmetries',()=>{
 const all=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS];
 assert.equal(all.length,62);
 const sources=all.map(b=>({id:b.id,floor:new Set(floorCells(b).map(v=>v.join(',')))}));
 for(const subject of M1_U_COURT_SHOPS){
  const variants=symmetryVersions(floorCells(subject));let maximum=0,closest='';
  for(const earlier of sources)if(earlier.id!==subject.id){
   const iou=Math.max(...variants.map(v=>jaccard(v,earlier.floor)));
   if(iou>maximum){maximum=iou;closest=earlier.id;}
  }
  assert(maximum<0.89,subject.id+' is too similar to '+closest+' source planar IoU='+maximum);
 }
});
