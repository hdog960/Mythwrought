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
import {M1_PROFILED_ARCADE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-profiled-arcade-shops.mjs';
import {M1_ARCADED_FRONT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-arcaded-front-shops.mjs';
import {M1_TOWER_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-tower-court-shops.mjs';
import {M1_SCULPTED_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-sculpted-markets.mjs';
import {M1_SIGNATURE_SKYLINE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-signature-skyline.mjs';
import {M1_LANDMARK_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave06.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave07.mjs';
import {ROADMAP_A_WAVE18_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave18.mjs';
const historical=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_PROFILED_ARCADE_SHOPS,...M1_ARCADED_FRONT_SHOPS,...M1_TOWER_COURT_SHOPS,...M1_SCULPTED_MARKETS,...M1_SIGNATURE_SKYLINE_SHOPS,...M1_LANDMARK_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_STEPPED_COURT_SHOPS];
const newWave=ROADMAP_A_WAVE18_SHOPS;
function variants(bp){const cells=bp.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);return Array.from({length:8},(_,i)=>{const t=cells.map(([ax,az])=>{let x=i>=4?-ax:ax,z=az;for(let n=0;n<i%4;n++)[x,z]=[-z,x];return [x,z]});const xmin=Math.min(...t.map(p=>p[0])),zmin=Math.min(...t.map(p=>p[1]));return new Set(t.map(([x,z])=>(x-xmin)+','+(z-zmin)));});}
function pairD4(left,right){let top=0;for(const a of left)for(const b of right){let count=0,sm=a.size<b.size?a:b,lg=a.size<b.size?b:a;for(const v of sm)if(lg.has(v))count++;top=Math.max(top,count/(a.size+b.size-count));}return top;}

test('Wave18 ONLY: all twelve new source footprints stay strictly <0.85 against protected original 128 same-category D4 shapes',{timeout:240000},()=>{
 assert.equal(historical.length,128);
 assert.equal(new Set(historical.map(x=>x.id)).size,128);
 assert.deepEqual(
  Object.fromEntries(['general-store','pet-shop','magic-shop','potion-shop','bakery','bank']
   .map(key=>[key,historical.filter(x=>x.category===key).length])),
  {'general-store':33,'pet-shop':19,'magic-shop':19,'potion-shop':19,'bakery':19,'bank':19});
 assert.equal(newWave.length,12);
 const oldIDs=new Set(historical.map(x=>x.id));
 for(const added of newWave)assert.ok(!oldIDs.has(added.id),'protected original ID collision '+added.id);
 const historic=historical.map(x=>({bp:x,variants:variants(x)}));
 const failures=[];
 let max=0,checks=0,maxPair=null;
 for(const candidate of newWave){
  const rotated=variants(candidate);
  for(const old of historic)if(candidate.category===old.bp.category){
   checks++;
   const score=pairD4(rotated,old.variants);
   if(score>max){max=score;maxPair={candidate:candidate.id,historical:old.bp.id};}
   if(score>=.85)failures.push({candidate:candidate.id,historical:old.bp.id,score});
  }
 }
 console.log('ROADMAP_A_WAVE18_STRICT_PROTECTED_128_D4 '+JSON.stringify({
  newWave18:12,protectedOriginals:128,comparedSameCategoryPairs:checks,
  sourceD4Threshold:.85,maxIoU:max,maxPair,
  violations:failures.slice(0,30),notInstalledManualPackOrProduction:true
 }));
 assert.equal(failures.length,0,'New Wave18 must not clone any protected historical source design at D4 >= .85: '+JSON.stringify(failures.slice(0,12)));
});
