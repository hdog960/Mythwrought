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
const historical=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_PROFILED_ARCADE_SHOPS,...M1_ARCADED_FRONT_SHOPS,...M1_TOWER_COURT_SHOPS,...M1_SCULPTED_MARKETS,...M1_SIGNATURE_SKYLINE_SHOPS,...M1_LANDMARK_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_STEPPED_COURT_SHOPS];
const proposed=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS];
function variants(bp){const cells=bp.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);return Array.from({length:8},(_,i)=>{const t=cells.map(([ax,az])=>{let x=i>=4?-ax:ax,z=az;for(let n=0;n<i%4;n++)[x,z]=[-z,x];return [x,z]});const xmin=Math.min(...t.map(p=>p[0])),zmin=Math.min(...t.map(p=>p[1]));return new Set(t.map(([x,z])=>(x-xmin)+','+(z-zmin)));});}
function pairD4(left,right){let top=0;for(const a of left)for(const b of right){let count=0,sm=a.size<b.size?a:b,lg=a.size<b.size?b:a;for(const v of sm)if(lg.has(v))count++;top=Math.max(top,count/(a.size+b.size-count));}return top;}
test('Roadmap A all 55 new candidates retain 128 protected original IDs and create NO >=0.85 same-type historical D4 clone',{timeout:240000},()=>{
 assert.equal(historical.length,128);
 assert.equal(new Set(historical.map(b=>b.id)).size,128);
 assert.equal(proposed.length,55);
 const all=new Set([...historical,...proposed].map(b=>b.id));assert.equal(all.size,183);
 const histories=historical.map(bp=>({bp,m:variants(bp)}));
 const overlaps=[],near=[];
 for(const p of proposed){const v=variants(p);
  for(const o of histories)if(o.bp.category===p.category){const score=pairD4(v,o.m);
    if(score>=0.85)near.push({candidate:p.id,protected:o.bp.id,score:+score.toFixed(6)});
    if(score>=0.85)overlaps.push({candidate:p.id,protected:o.bp.id,score:+score.toFixed(6)});
  }
 }
 console.log('ROADMAP_A_ALL55_HISTORIC_D4_REVIEW '+JSON.stringify({newCandidates:55,protected:128,near085:near.length,unacceptable085:overlaps.length,nearPairs:near.slice(0,50)}));
 assert.deepEqual(overlaps,[],'NO added >=0.85 D4 clone, regardless of inherited protected similarities');
});
