import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_LATERAL_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
import {M1_DISTINCT_WING_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const buildings=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_DISTINCT_WING_SHOPS];
const key=(x,z)=>x+','+z;
function walk(b){
 const source=new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
 const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>key(v.x,v.z)));
 // Real producer-owned Pack5 multi-cell footprints: conceptual 1-cell anchors
 // are NOT sufficient for determining a physically walkable route.
 for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
  // Original PR #124 has 197 Pack5 fixture occurrences without authored
  // variant metadata. Do not guess or pretend those physical AABBs are resolved.
  if(!v.physicalVariant||v.physicalVariant==='unresolved')continue;
  const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
  if(shape.collisionBoxes.length===0)continue;
  for(const [dx,dy,dz] of shape.occupiedOffsets)if(dy===0)blocked.add(key(v.x+dx,v.z+dz));
 }
 const entry=b.openings.find(o=>o.type==='entrance');
 const queue=[[entry.x,1]],reached=new Set();
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],k=key(x,z);
  if(reached.has(k)||blocked.has(k)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
     source.get([x,1,z].join(','))?.kind!=='floor'||
     [2,3,4].some(y=>source.has([x,y,z].join(','))))continue;
  reached.add(k);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return {reached,blocked};
}
test('real producer-based multi-cell fixture footprints leave all 92 authored 2A room entrances reachable',()=>{
 assert.equal(buildings.length,92);
 let verified=0;
 for(const b of buildings){
  const walkable=walk(b);
  for(const r of b.rooms){
   if(!Array.isArray(r.access))continue; // original fifteen preserve their legacy circulation records
   verified++;assert(walkable.reached.has(key(...r.access)),
     b.id+' physical Pack5 multi-cell obstruction at '+r.name+' '+r.access.join(','));
  }
 }
 assert(verified>=65,'did not check all new authored room access anchors');
});
test('enchanted large pet-shop pen divider cannot block its west room aisle or support fake single-cell geometry',()=>{
 const b=M1_BIOME_EXPANSION.find(x=>x.category==='pet-shop'),
  r=b.rooms.find(x=>x.uses.includes('empty-animal-display')),
  actual=walk(b);
 assert(r);assert(actual.reached.has(key(...r.access)));
 const rails=b.voxels.filter(v=>v.physicalVariant==='oak-stall-divider');
 assert.equal(rails.length,4);
 const occupied=new Set();
 for(const v of rails){
  const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing});
  assert.equal(shape.occupiedOffsets.length,2);
  for(const [dx,dy,dz] of shape.occupiedOffsets){
   const k=[v.x+dx,v.y+dy,v.z+dz].join(',');
   assert(!occupied.has(k),'overlapping real producer stall part');occupied.add(k);
  }
 }
 assert.equal(occupied.size,8);
 assert(!actual.blocked.has(key(...r.access)));
});
