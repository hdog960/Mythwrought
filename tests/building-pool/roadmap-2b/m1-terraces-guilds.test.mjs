import {M1_TERRACES_SANCTUARIES} from '../../../src/building-pool/roadmap-2b/m1-terraces-sanctuaries.mjs';
import {M1_WINDFOLD_GUILDS} from '../../../src/building-pool/roadmap-2b/m1-windfold-guilds.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_FIVE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-five-courts.mjs';
import {M1_SCULPTED_REGIONAL} from '../../../src/building-pool/roadmap-2b/m1-sculpted-regional.mjs';
import {M1_CONCAVE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-concave-courts.mjs';
import {M1_CLIFF_AND_FESTIVAL} from '../../../src/building-pool/roadmap-2b/m1-cliff-and-festival.mjs';
import {M1_REGIONAL_GALLERIES} from '../../../src/building-pool/roadmap-2b/m1-regional-galleries.mjs';
import {M1_GRAND_COMPLEXES} from '../../../src/building-pool/roadmap-2b/m1-grand-complexes.mjs';
import {M1_SPECIALTY_COURTS} from '../../../src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
import {M1_NEW_REGION_ARCHITECTURES} from '../../../src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {MANUAL_FIVE_PACK_FAMILY_SYMBOLS,manualFivePackVariants} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';
import {M1_BESPOKE_COURTS} from '../../../src/building-pool/roadmap-2b/m1-bespoke-courts.mjs';
import {M1_RITUAL_TRADES} from '../../../src/building-pool/roadmap-2b/m1-ritual-trades.mjs';
import {M1_SHADOWSTAGE} from '../../../src/building-pool/roadmap-2b/m1-shadowstage.mjs';
import {M1_NORTHERN_ARCADES} from '../../../src/building-pool/roadmap-2b/m1-northern-arcades.mjs';
import {M1_REGIONAL_GUILDWINGS} from '../../../src/building-pool/roadmap-2b/m1-regional-guildwings.mjs';
const PRIOR=[...M1_BESPOKE_COURTS,...M1_RITUAL_TRADES,...M1_SHADOWSTAGE];
const NEW=[...M1_NORTHERN_ARCADES,...M1_REGIONAL_GUILDWINGS];
const history=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,
 ...M1_CLIFF_AND_FESTIVAL,...M1_CONCAVE_COURTS,...M1_SCULPTED_REGIONAL];
const all=[...history,...M1_FIVE_COURTS,...PRIOR,...NEW],key=(x,y,z)=>x+','+y+','+z;
function occupancy(b){return new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));}
function walk(b,blocked=[]){
 const vox=occupancy(b),entrance=b.openings.find(x=>x.type==='entrance'),queue=[[entrance.x,entrance.z]],seen=new Set(),closed=new Set(blocked.map(p=>p.join(',')));
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],at=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(at)||closed.has(at))continue;
  if(vox.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>vox.has(key(x,y,z))))continue;
  seen.add(at);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
function orient(b,t){
 const a=b.voxels.map(v=>{let x=v.x,z=v.z;switch(t%4){case 1:[x,z]=[-z,x];break;case 2:x=-x;z=-z;break;case 3:[x,z]=[z,-x];break;}if(t>=4)x=-x;return [x,v.y,z];});
 const xmin=Math.min(...a.map(v=>v[0])),zmin=Math.min(...a.map(v=>v[2]));
 return new Set(a.map(([x,y,z])=>key(x-xmin,y,z-zmin)));
}
function closest(a,b){
 const one=orient(a,0);let best=0;
 for(let i=0;i<8;i++){
  const two=orient(b,i),small=one.size<two.size?one:two,big=small===one?two:one;let common=0;
  for(const x of small)if(big.has(x))common++;
  best=Math.max(best,common/(one.size+two.size-common));
 }
 return best;
}



const BESPOKE_NEXT=[...M1_TERRACES_SANCTUARIES,...M1_WINDFOLD_GUILDS];
const ALL115=[...all,...BESPOKE_NEXT];
const EXPECTED=[
 "r2:theater:mountain:medium:02","r2:theater:snow:large:02",
 "r2:temple:desert:small:02","r2:bookshop:enchanted-forest:large:02",
 "r2:tailor:snow:medium:02","r2:butcher:enchanted-forest:large:02",
 "r2:jeweler:desert:large:02"
];
test('seven reserved original geometries preserve the 108 earlier physical models and complete 115 fully D4-unique source architectures',()=>{
 assert.deepEqual(BESPOKE_NEXT.map(b=>b.id),EXPECTED);
 assert.deepEqual(BESPOKE_NEXT.map(b=>b.voxels.length),[4958,8480,3190,7983,4746,7578,7157]);
 const slots=new Set(plannedSlots().map(x=>x.id)),historical=new Set(all.map(b=>b.id));
 assert.equal(historical.size,108,'prior 108 authored identities changed');
 for(const b of BESPOKE_NEXT){
  assert(slots.has(b.id),b.id+' not in original 420-slot roster');
  assert(!historical.has(b.id),b.id+' duplicates a protected prior ID');
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert.equal(b.status,'authored-candidate');assert(b.isolated&&!b.worldPlaced&&!b.numericIdsAssigned);
 }
 assert.deepEqual(assertDistinctArchitecture(ALL115),{authored:115,distinctArchitectures:115});
});
test('seven original source forms delete actual foundations, never fake a courtyard with hidden floors or sky roofs',()=>{
 const absent=[429,435,340,480,385,512,406];
 for(let i=0;i<BESPOKE_NEXT.length;i++){
  const b=BESPOKE_NEXT[i],c=occupancy(b);
  assert.equal(b.deliberatelyAbsentFootprintCells,absent[i],b.id+' missing physical courtyard void');
  assert(b.footprintRectangles.length>=4,b.id+' lacks genuinely asymmetric wings');
  let inner=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const f=c.get(key(x,0,z)),floor=c.get(key(x,1,z));
   assert.equal(!!f,!!floor,b.id+' floor/foundation mismatch');
   if(!f){
    for(let y=2;y<b.extents.y;y++)assert(!c.has(key(x,y,z)),b.id+' floating in deliberate absent footprint '+x+','+z);
   }else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!c.has(key(x+dx,0,z+dz)))){
    assert.equal(c.get(key(x,6,z))?.kind,'wall',b.id+' nonsealed concave real physical weather wall');
    if(x&&z&&x<b.extents.x-1&&z<b.extents.z-1)inner++;
   }
  }
  assert(inner>20,b.id+' only generic outer rectangular walls');
  for(const sky of b.intentionallyOpenRoof)for(let x=sky.x0;x<=sky.x1;x++)for(let z=sky.z0;z<=sky.z1;z++)
   assert(!c.has(key(x,7,z)),b.id+' fake open roof aperture');
 }
});
test('physical stage is truly raised timber and stage-side aisles still reach sealed backstage through actual three-high gates',()=>{
 for(const b of BESPOKE_NEXT.filter(x=>x.category==='theater')){
  const c=occupancy(b),stage=b.voxels.filter(v=>v.role==='raised-original-performance-stage');
  assert(stage.length>=45,b.id+' stage is only metadata');
  assert(stage.every(v=>v.kind==='fixture'&&v.y===2),b.id+' physical performance platform not elevated');
  for(const v of stage)assert(c.get(key(v.x,1,v.z))?.kind==='floor',b.id+' stage has no walking support');
  const open=walk(b),behind=b.routeTargets.find(t=>t.name.includes('backstage'));
  assert(behind&&open.has(behind.x+','+behind.z),b.id+' stage blocks backstage aisles');
  const closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  assert(!closed.has(behind.x+','+behind.z),b.id+' performer-only backstage door can be bypassed');
 }
});
test('all authentic private rooms are reachable on actual zero-obstacle voxel floor while every restricted destination seals if door cells close',()=>{
 for(const b of BESPOKE_NEXT){
  assert(b.rooms.length>=5,b.id+' missing architecturally different chambers');
  const walkOpen=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  for(const t of b.routeTargets)assert(walkOpen.has(t.x+','+t.z),b.id+' impossible physical route to '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' easily bypassed private '+t.name);
 }
});
test('genuine door clearances and actual source-occupied exterior window cells remain consistent in all seven source geometries',()=>{
 for(const b of BESPOKE_NEXT){
  const c=occupancy(b),doors=b.openings.filter(o=>['entrance','internal-doorway'].includes(o.type));
  assert(doors.length>=5,b.id+' too few physically modeled private thresholds');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id+' non-3-high opening');
   assert.equal(c.get(key(o.x,1,o.z))?.kind,'floor',b.id+' unsupported door approach');
   for(let y=2;y<=4;y++)assert(!c.has(key(o.x,y,o.z)),b.id+' air-cell door blocked');
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=14,b.id+' only placeholder painted window symbol');
  for(const o of windows)assert.equal(c.get(key(o.x,o.y,o.z))?.material,o.material,b.id+' window source mismatch');
 }
});
test('source-specific roofs are physically supported with a y8/9/10/11 upper silhouette, not just recolored full-flat planes',()=>{
 const high=[626,1339,317,1063,566,1065,942];
 for(let i=0;i<BESPOKE_NEXT.length;i++){
  const b=BESPOKE_NEXT[i],c=occupancy(b),raised=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(raised.length,high[i],b.id+' raised roof source geometry changed');
  assert.deepEqual([...new Set(raised.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' lacks sculpted upper height levels');
  assert(new Set(raised.map(v=>v.role)).size>=12,b.id+' only a few copied roof plates');
  for(const v of raised){
   assert(c.has(key(v.x,v.y-1,v.z)),b.id+' floating roof '+v.role);
   assert(c.get(key(v.x,0,v.z))?.kind==='foundation',b.id+' false foundation under '+v.role);
  }
  assert(b.roof.biomeSpecific,b.id+' roof not documented climate dependent');
 }
});
test('full occupied-source 8-way D4 Jaccard IoU stays strictly below 0.85 for every new design versus matching category and size',()=>{
 for(const b of BESPOKE_NEXT){
  let best=0,bestName='';
  for(const candidate of ALL115)if(candidate!==b&&candidate.category===b.category&&candidate.size===b.size){
   const score=closest(b,candidate);
   if(score>best){best=score;bestName=candidate.id;}
  }
  assert(best<0.85,b.id+' source near-duplicate IoU '+best+' with '+bestName);
 }
});
test('physically used symbols correspond to real Pack1–5 candidate family entries, including distinct field props, with production physical ABI expressly unresolved',()=>{
 const symbols=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),families=new Set();
 for(const b of BESPOKE_NEXT){
  const deps=new Set(b.unresolvedDependencies.map(d=>d.ref));
  for(const v of b.voxels){
   assert(symbols.has(v.material),b.id+' invented nonexistent manual Pack family '+v.material);
   assert(deps.has(v.material),b.id+' missing physical material manifest '+v.material);
   families.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(deps.has(o.doorSymbol),b.id+' door without source producer dependency');
  for(const d of b.unresolvedDependencies){
   assert(manualFivePackVariants(d.ref).length>0,b.id+' no real Pack candidate producer variant '+d.ref);
   assert(/unresolved/.test(d.issue),d.ref+' incorrectly certified live placement');
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' false Pack production readiness');
 }
 for(const family of ['pack1','pack2','pack3','pack4','pack5'])assert(families.has(family),'missing real '+family+' physical use');
});
test('ledger ids are byte-for-byte sourced from exact branch files, and no historic architectural source or schema is staged for world placement',()=>{
 for(const path of ['src/building-pool/roadmap-2b/m1-terraces-sanctuaries.mjs',
  'src/building-pool/roadmap-2b/m1-windfold-guilds.mjs']){
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
   execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path+' differs from recorded HEAD blob');
 }
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,131,146,274,0,0,0]);
 assert.equal(l.originals.length,131);
 for(const historical of ALL115.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(row=>row.id===historical.id),'lost prior 115 coordinate-authored building '+historical.id);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),146);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.remaining,0),274);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),146);
 for(const b of BESPOKE_NEXT){
  const expected=b.category==='theater'||b.category==='temple'||b.category==='bookshop'?'m1-terraces-sanctuaries.mjs':'m1-windfold-guilds.mjs';
  const item=l.originals.find(x=>x.id===b.id);
  assert.equal(item?.file,'src/building-pool/roadmap-2b/'+expected,b.id+' source file ledger inaccurate');
 }
});
