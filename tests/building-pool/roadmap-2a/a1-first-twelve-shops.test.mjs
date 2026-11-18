import test from 'node:test';
import assert from 'node:assert/strict';
import {A1_FIRST_TWELVE_SHOPS,A1_FIRST_TWELVE_CENSUS} from '../../../src/building-pool/roadmap-2a/a1-first-twelve-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
import {M1_LATERAL_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {M1_FIVE_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_LANDMARK_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_SIGNATURE_SKYLINE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-signature-skyline.mjs';
import {M1_SCULPTED_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-sculpted-markets.mjs';
import {M1_TOWER_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-tower-court-shops.mjs';
import {M1_ARCADED_FRONT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-arcaded-front-shops.mjs';
import {M1_PROFILED_ARCADE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-profiled-arcade-shops.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {assertDistinctArchitecture,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset,manualFivePackVariants} from '../../../src/builder-assets/manual-five-pack.mjs';
const previous=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_LANDMARK_SHOPS,...M1_SIGNATURE_SKYLINE_SHOPS,...M1_SCULPTED_MARKETS,...M1_TOWER_COURT_SHOPS,...M1_ARCADED_FRONT_SHOPS,...M1_PROFILED_ARCADE_SHOPS]);
const combined=[...previous,...A1_FIRST_TWELVE_SHOPS];
const key=(x,y,z)=>x+','+y+','+z;
const floor=b=>new Set(b.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>v.x+','+v.z));
const D4=(pts)=>{
 const a=[...pts].map(x=>x.split(',').map(Number)),ret=[];
 for(let reflect=0;reflect<2;reflect++)for(let turn=0;turn<4;turn++){
  const b=a.map(([px,pz])=>{let x=reflect?-px:px,z=pz;for(let r=0;r<turn;r++)[x,z]=[-z,x];return[x,z]});
  const loX=Math.min(...b.map(v=>v[0])),loZ=Math.min(...b.map(v=>v[1]));
  ret.push(new Set(b.map(([x,z])=>(x-loX)+','+(z-loZ))));
 }return ret;
};
const iou=(a,b)=>{let overlap=0;for(const q of a)if(b.has(q))overlap++;return overlap/(a.size+b.size-overlap);};

test('Roadmap A batch: 12 separately authored 3D commercial candidates, original 128 and catalog untouched',()=>{
 assert.equal(previous.length,128);
 assert.equal(A1_FIRST_TWELVE_SHOPS.length,12);
 assert.equal(combined.length,140);
 assert.equal(new Set(combined.map(b=>b.id)).size,140);
 assert.equal(inventory().authoredCandidateTotal,128);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,128);
 assert.equal(A1_FIRST_TWELVE_CENSUS.cumulativeCandidateSources,140);
 assert.equal(A1_FIRST_TWELVE_CENSUS.stillUnauthored,280);
 assert.equal(assertDistinctArchitecture(combined).distinctArchitectures,140);
 const counts={};
 for(const b of A1_FIRST_TWELVE_SHOPS){
  assert(validateBlueprint(b).valid);
  counts[b.category]=(counts[b.category]||0)+1;
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.rooms.length,4);
  assert(b.voxels.length>1400,b.id+' not substantial 3D voxel geometry');
  assert(b.roof && b.openings.some(o=>o.type==='window'));
  assert(b.voxels.some(v=>v.kind==='roof'&&v.y>=b.extents.y-6));
  assert(b.courtyardGeometry.length>=2);
 }
 for(const type of ['general-store','pet-shop','magic-shop','potion-shop','bakery','bank'])assert.equal(counts[type],2);
});

test('Every new source D4 floor outline has IoU strictly below 0.89 against all previous and new designs',()=>{
 const earlier=previous.map(b=>({id:b.id,pts:floor(b)}));
 const newData=A1_FIRST_TWELVE_SHOPS.map(b=>({id:b.id,pts:floor(b)}));
 for(const x of newData){
  let nearest={id:null,iou:-1};const sym=D4(x.pts);
  for(const y of [...earlier,...newData])if(x.id!==y.id){
   const score=Math.max(...sym.map(z=>iou(z,y.pts)));
   if(score>nearest.iou)nearest={id:y.id,iou:score};
  }
  assert(nearest.iou<.89,x.id+' near-duplicate '+JSON.stringify(nearest));
 }
});

test('Every real entrance and all four functional room access points are walkable with 3-high clearance',()=>{
 for(const b of A1_FIRST_TWELVE_SHOPS){
  const m=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  const blocked=new Set();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of shape.occupiedOffsets)blocked.add((v.x+dx)+','+(v.z+dz));
  }
  const gate=b.openings.find(o=>o.type==='entrance'&&o.z===0);assert(gate,b.id+' missing real front entrance');
  const q=[[gate.x,0]],seen=new Set();
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i],k=x+','+z;
   if(seen.has(k)||blocked.has(k)||x<0||z<0||x>=b.extents.x||z>=b.extents.z||m.get(key(x,1,z))?.kind!=='floor')continue;
   if([2,3,4].some(y=>m.has(key(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms)assert(seen.has(room.access.join(',')),b.id+' inaccessible room '+room.name+' '+room.access);
 }
});

test('Read-only real Manual Five Pack producer variants: fixtures, windows, vault gates and occupied offsets',()=>{
 let fixtures=0,windows=0,gates=0;
 for(const b of A1_FIRST_TWELVE_SHOPS){
  const map=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  const occupied=new Map();
  for(const v of b.voxels){
   if(v.kind==='window'){
    const face=v.z===0?'north':v.z===b.extents.z-1?'south':v.x===0?'west':v.x===b.extents.x-1?'east':null;
    assert(face,b.id+' window without facade');
    const variants=manualFivePackVariants(v.material);
    assert.equal(variants.length,1,b.id+' ambiguous glass producer family');
    const shape=resolveManualFivePackAsset(v.material,{numericId:variants[0].numericId,orientation:face});
    assert(shape.selectionBoxes.length>=0);
    windows++;
   }
   if(v.kind!=='fixture'||!v.material.startsWith('pack5:'))continue;
   const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   assert(shape.collisionBoxes.length>=0&&shape.selectionBoxes.length>=0);
   for(const [dx,dy,dz] of shape.occupiedOffsets){
    const x=v.x+dx,z=v.z+dz,y=v.y+dy,pos=key(x,y,z),prior=map.get(pos);
    assert(!prior||pos===key(v.x,v.y,v.z)||prior.kind==='floor',b.id+' physical fixture overlaps source '+pos);
    assert.equal(map.get(key(x,1,z))?.kind,'floor',b.id+' producer shape unsupported '+pos);
    assert(!occupied.has(pos),b.id+' two producer fixtures overlap '+pos);
    occupied.set(pos,v.role);
   }
   fixtures++;
  }
  const g=b.openings.find(o=>o.role==='vault-threshold');
  if(b.category==='bank'){
   assert(g);const shape=resolveManualFivePackAsset(g.doorSymbol,{variant:g.physicalVariant,orientation:g.intendedFacing});
   assert.equal(shape.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of shape.occupiedOffsets)for(let h=0;h<3;h++)assert(!map.has(key(g.x+dx,g.y+dy+h,g.z+dz)),b.id+' blocked two-cell vault gate');
   gates++;
  }
 }
 assert.equal(fixtures,36); // three real pack5 fixture anchors per design
 assert.equal(gates,2);assert(windows>=48);
});
