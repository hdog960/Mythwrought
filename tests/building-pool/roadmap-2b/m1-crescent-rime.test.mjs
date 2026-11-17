import {M1_TERRACES_SANCTUARIES} from '../../../src/building-pool/roadmap-2b/m1-terraces-sanctuaries.mjs';
import {M1_WINDFOLD_GUILDS} from '../../../src/building-pool/roadmap-2b/m1-windfold-guilds.mjs';
import {M1_CRESCENT_MERCHANTS} from '../../../src/building-pool/roadmap-2b/m1-crescent-merchants.mjs';
import {M1_RIME_AND_RIVER} from '../../../src/building-pool/roadmap-2b/m1-rime-and-river.mjs';
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




const OLD115=[...all,...M1_TERRACES_SANCTUARIES,...M1_WINDFOLD_GUILDS];
const NEW121=[...M1_CRESCENT_MERCHANTS,...M1_RIME_AND_RIVER];
const ALL121=[...OLD115,...NEW121];
const EXPECTED=[
 "r2:market-square:enchanted-forest:medium:02","r2:market-square:desert:small:02",
 "r2:bookshop:temperate:medium:02","r2:butcher:snow:large:02",
 "r2:jeweler:enchanted-forest:small:02","r2:theater:temperate:medium:02"
];
test('six source-identical reserved architectures preserve all 115 earlier originals and are D4-unique among 121 true geometries',()=>{
 assert.deepEqual(NEW121.map(b=>b.id),EXPECTED);
 assert.deepEqual(NEW121.map(b=>b.voxels.length),[5204,3029,4639,7154,3525,5095]);
 assert.equal(new Set(OLD115.map(b=>b.id)).size,115,'previous 115 full-source identities lost');
 const slots=new Set(plannedSlots().map(x=>x.id)),prior=new Set(OLD115.map(b=>b.id));
 for(const b of NEW121){
  assert(slots.has(b.id)&&!prior.has(b.id),b.id+' colliding or unreserved building');
  assert.equal(validateBlueprint(b).valid,true,b.id+' invalid source');
  assert.equal(b.status,'authored-candidate');assert(b.isolated&&!b.worldPlaced&&!b.numericIdsAssigned);
 }
 assert.deepEqual(assertDistinctArchitecture(ALL121),{authored:121,distinctArchitectures:121});
});
test('new originals have real missing courtyard foundations, concave physically sealed weather walls and never fake roof mass in void columns',()=>{
 const missing=[402,232,474,603,340,552];
 for(let i=0;i<NEW121.length;i++){
  const b=NEW121[i],map=occupancy(b);
  assert.equal(b.deliberatelyAbsentFootprintCells,missing[i],b.id+' physical ground absence');
  assert(b.footprintRectangles.length>=4,b.id+' boxlike generic ground');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const f=map.get(key(x,0,z)),floor=map.get(key(x,1,z));
   assert.equal(!!f,!!floor,b.id+' ungrounded walking cell');
   if(!f){for(let y=2;y<b.extents.y;y++)assert(!map.has(key(x,y,z)),b.id+' fake courtyard roof/floor');continue;}
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!map.has(key(x+dx,0,z+dz)))){
    assert.equal(map.get(key(x,6,z))?.kind,'wall',b.id+' missing perimeter weather solid');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=16,b.id+' no genuine inward/missing-ground wall curvature');
 }
});
test('every source air doorway has actual three-voxel vertical clearance and is grounded; exterior glazing is a real voxel symbol',()=>{
 for(const b of NEW121){
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=4,b.id+' doors only in graph metadata');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id+' insufficient physical door clearance');
   assert.equal(m.get(key(o.x,1,o.z))?.kind,'floor',b.id+' doorway lacks source floor');
   for(let y=2;y<=4;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' physically blocked door '+o.x+','+y+','+o.z);
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=10,b.id+' exterior has no real glass');
  for(const o of windows)assert.equal(m.get(key(o.x,o.y,o.z))?.material,o.material,b.id+' invented window opening');
 }
});
test('each novel public floor and every private destination is reachable, but locked internal doors seal all nonpublic targets',()=>{
 for(const b of NEW121){
  const open=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  assert(b.routeTargets.length>=4&&b.rooms.length>=4,b.id+' nonfunctional rooms');
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' disconnected physical target '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' private room bypass '+t.name);
 }
});
test('physically supported y8, y9, y10 and y11 biome-differentiated ridge sections are real occupied source solids',()=>{
 const raised=[692,213,502,944,359,637];
 for(let i=0;i<NEW121.length;i++){
  const b=NEW121[i],m=occupancy(b),hi=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(hi.length,raised[i],b.id+' high ridge source changed');
  assert.deepEqual([...new Set(hi.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' missing upper contour tiers');
  assert(new Set(hi.map(v=>v.role)).size>=11,b.id+' insufficient independent source roof programs');
  for(const v of hi){
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' floating upper '+v.role);
   assert.equal(m.get(key(v.x,0,v.z))?.kind,'foundation',b.id+' roof above unsupported courtyard');
  }
 }
});
test('the real riverside theater stage is a supported 36-cell stage with an unobstructed backstage circulation route',()=>{
 const b=NEW121.find(b=>b.category==='theater');
 assert(b);
 const m=occupancy(b),raised=b.voxels.filter(v=>v.role==='raised-original-performance-stage');
 assert.equal(raised.length,36);
 for(const v of raised)assert(v.y===2&&v.kind==='fixture'&&m.get(key(v.x,1,v.z))?.kind==='floor','fake ungrounded stage');
 const back=b.routeTargets.find(x=>x.name==='backstage');
 assert(back&&walk(b).has(back.x+','+back.z),'stage barrier blocks backstage path');
 assert(!walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z])).has(back.x+','+back.z),'unlocked backstage bypass');
});
test('new six are strictly <0.85 normalized occupied-cell eight-way D4 Jaccard IoU versus every matching type and size',()=>{
 for(const b of NEW121){
  let maximum=0,nearest='';
  for(const older of ALL121)if(older!==b&&older.category===b.category&&older.size===b.size){
   const score=closest(b,older);
   if(score>maximum){maximum=score;nearest=older.id;}
  }
  assert(maximum<0.85,b.id+' near-duplicate D4 IoU '+maximum+' of '+nearest);
 }
});
test('every physically used symbolic material belongs to real Pack1–5 producer candidate families and physical AABB/yaw/variant readiness remains blocked',()=>{
 const symbols=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),groups=new Set();
 for(const b of NEW121){
  const refs=new Set(b.unresolvedDependencies.map(d=>d.ref));
  for(const v of b.voxels){
   assert(symbols.has(v.material)&&refs.has(v.material),b.id+' lacks true producer family '+v.material);
   groups.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(refs.has(o.doorSymbol),b.id+' untracked door family');
  for(const dep of b.unresolvedDependencies){
   assert(manualFivePackVariants(dep.ref).length>0,b.id+' missing real producer candidate '+dep.ref);
   assert(/unresolved/.test(dep.issue),b.id+' false geometric approval '+dep.ref);
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' falsely production registered');
 }
 for(const family of ['pack1','pack2','pack3','pack4','pack5'])assert(groups.has(family),'source lacks '+family);
});
test('full 121-source identity ledger, exact Git blobs and 0 creator-approved or integrated placements',()=>{
 for(const path of ['src/building-pool/roadmap-2b/m1-crescent-merchants.mjs','src/building-pool/roadmap-2b/m1-rime-and-river.mjs']){
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
    execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path+' blob mismatch');
 }
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,111,126,294,0,0,0]);
 assert.equal(l.originals.length,111);
 for(const previous of OLD115.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(x=>x.id===previous.id),'lost one of previous 115 source-authored designs '+previous.id);
 for(const prev of ALL121.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(row=>row.id===prev.id),'historical 121 source missing '+prev.id);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),126);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.remaining,0),294);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),126);
 for(const b of NEW121){
  const target='src/building-pool/roadmap-2b/'+(b.category==='market-square'||b.category==='bookshop'?'m1-crescent-merchants.mjs':'m1-rime-and-river.mjs');
  assert.equal(l.originals.find(row=>row.id===b.id)?.file,target,b.id+' wrong original author location');
 }
});
