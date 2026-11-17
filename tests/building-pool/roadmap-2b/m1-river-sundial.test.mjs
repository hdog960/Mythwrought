import {M1_RIVER_SUNDIAL} from '../../../src/building-pool/roadmap-2b/m1-river-sundial.mjs';
import {M1_ECHO_SIX} from '../../../src/building-pool/roadmap-2b/m1-echo-six.mjs';
import {M1_WEAVE_GEM_TRIPTYCH} from '../../../src/building-pool/roadmap-2b/m1-weave-gem-triptych.mjs';
import {M1_DIADEM_FOLIOS} from '../../../src/building-pool/roadmap-2b/m1-diadem-folios.mjs';
import {M1_TERRACES_SANCTUARIES} from '../../../src/building-pool/roadmap-2b/m1-terraces-sanctuaries.mjs';
import {M1_WINDFOLD_GUILDS} from '../../../src/building-pool/roadmap-2b/m1-windfold-guilds.mjs';
import {M1_CRESCENT_MERCHANTS} from '../../../src/building-pool/roadmap-2b/m1-crescent-merchants.mjs';
import {M1_RIME_AND_RIVER} from '../../../src/building-pool/roadmap-2b/m1-rime-and-river.mjs';
import {M1_REGIONAL_FORMS} from '../../../src/building-pool/roadmap-2b/m1-regional-forms.mjs';
import {M1_CROSSBAR_SWITCHBACK} from '../../../src/building-pool/roadmap-2b/m1-crossbar-switchback.mjs';
import {M1_HIGHLAND_GROVE_SIX} from '../../../src/building-pool/roadmap-2b/m1-highland-grove-six.mjs';
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




const PRESERVED126=[...all,...M1_TERRACES_SANCTUARIES,...M1_WINDFOLD_GUILDS,...M1_CRESCENT_MERCHANTS,...M1_RIME_AND_RIVER,...M1_REGIONAL_FORMS,...M1_CROSSBAR_SWITCHBACK];
const ORIGINAL_SIX=M1_HIGHLAND_GROVE_SIX;
const COMPLETE132=[...PRESERVED126,...ORIGINAL_SIX];


const OLD132=COMPLETE132;
const NEW138=[...M1_WEAVE_GEM_TRIPTYCH,...M1_DIADEM_FOLIOS];
const ALL138=[...OLD132,...NEW138];
const NEW_IDS=[
"r2:tailor:desert:large:02","r2:tailor:snow:small:02","r2:jeweler:temperate:large:02",
"r2:jeweler:desert:medium:02","r2:bookshop:snow:large:02","r2:bookshop:enchanted-forest:small:02"
];


const PRESERVED138=ALL138;
const ECHO_SIX=M1_ECHO_SIX;
const ALL144=[...PRESERVED138,...ECHO_SIX];
const IDS=[
'r2:butcher:snow:small:02','r2:theater:mountain:large:02','r2:temple:mountain:small:02',
'r2:bookshop:temperate:large:02','r2:tailor:temperate:small:02','r2:market-square:snow:small:02'
];

const ADDED=M1_RIVER_SUNDIAL;
const ALL146=[...ALL144,...ADDED];
test('two newly sourced, truly original M1 reserved models preserve complete 144-model history and 146 D4 unique structures',()=>{
 assert.deepEqual(ADDED.map(b=>b.id),["r2:market-square:temperate:small:02","r2:theater:desert:small:03"]);
 assert.deepEqual(ADDED.map(b=>b.voxels.length),[6069,7310]);
 assert.equal(new Set(ALL144.map(b=>b.id)).size,144);
 assert.deepEqual(assertDistinctArchitecture(ALL146),{authored:146,distinctArchitectures:146});
 const reserved=new Set(plannedSlots().map(s=>s.id));
 for(const b of ADDED)assert(reserved.has(b.id)&&!ALL144.some(v=>v.id===b.id)&&validateBlueprint(b).valid);
});
test('both five-region original physical plans have real nonrectangular absent foundations, floors and open central courts',()=>{
 for(let i=0;i<ADDED.length;i++){
  const b=ADDED[i],m=occupancy(b);
  assert.equal(b.deliberatelyAbsentFootprintCells,[609,923][i]);
  assert(b.footprintRectangles.length>=5);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const a=!!m.get(key(x,0,z)),floor=!!m.get(key(x,1,z));
   assert.equal(a,floor,b.id+' ungrounded walking floor');
   if(!a)for(let y=2;y<b.extents.y;y++)assert(!m.has(key(x,y,z)),b.id+' phantom courtyard');
  }
 }
});
test('every intended real doorway is three high, wall-flanked, physically grounded and private access can be sealed',()=>{
 for(const b of ADDED){
  assert(b.rooms.length>=5&&b.routeTargets.length>=5);
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=7,b.id+' missing required controlled portals');
  for(const d of doors){
   assert.equal(d.clearHeightCells,3);
   assert.equal(m.get(key(d.x,1,d.z))?.kind,'floor');
   for(let y=2;y<=4;y++)assert(!m.has(key(d.x,y,d.z)),b.id+' doorway blocked');
   if(d.type==='internal-doorway')assert.equal(m.get(key(d.x-1,3,d.z))?.kind,'wall',b.id+' missing physical left gate jamb');
  }
  const open=walk(b),closed=walk(b,doors.filter(d=>d.type==='internal-doorway').map(d=>[d.x,d.z]));
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' inaccessible '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' unauthorized bypass '+t.name);
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=12);
  for(const o of windows)assert.equal(m.get(key(o.x,o.y,o.z))?.material,o.material);
 }
});
test('twenty individually named upper roof tiers have complete y8–11 actual source support over real foundations',()=>{
 for(let i=0;i<ADDED.length;i++){
  const b=ADDED[i],m=occupancy(b),high=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(high.length,[1112,1701][i]);
  assert.deepEqual([...new Set(high.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11]);
  assert.equal(new Set(high.map(v=>v.role)).size,20);
  for(const v of high){
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' floating architectural high roof');
   assert.equal(m.get(key(v.x,0,v.z))?.kind,'foundation');
  }
 }
});
test('two new models remain D4 unique and below strict 0.85 normalized occupied 3D IoU in category/size against all earlier models',()=>{
 for(const b of ADDED){
  let worst=0,closestId='';
  for(const o of ALL146)if(o!==b&&o.category===b.category&&o.size===b.size){
   const v=closest(b,o);if(v>worst){worst=v;closestId=o.id;}
  }
  assert(worst<0.85,b.id+' Jaccard '+worst+' vs '+closestId);
 }
});
test('only actually available symbolic Pack1-5 families are used and placement/yaw/AABB approval stays unresolved',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),families=new Set();
 for(const b of ADDED){
  const declared=new Set(b.unresolvedDependencies.map(d=>d.ref));
  assert(b.isolated&&!b.worldPlaced&&!b.numericIdsAssigned);
  for(const v of b.voxels){assert(allowed.has(v.material)&&declared.has(v.material),b.id+' invented '+v.material);families.add(v.material.split(':')[0]);}
  for(const d of b.unresolvedDependencies){assert(manualFivePackVariants(d.ref).length>0);assert(/unresolved/.test(d.issue));}
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false);
 }
 for(const family of ['pack1','pack2','pack3','pack4','pack5'])assert(families.has(family));
});
test('new source is committed as original blob; full 146/420 ledger, 144 protected fingerprints, no gameplay integrations',()=>{
 const path='src/building-pool/roadmap-2b/m1-river-sundial.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim());
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,131,146,274,0,0,0]);
 assert.equal(l.originals.length,131);
 for(const b of ALL144.filter(x=>x.category!=='temple'||x.variation!==1))
  assert(l.originals.some(row=>row.id===b.id),b.id+' lost historical authored source');
 for(const b of ADDED)assert.equal(l.originals.find(x=>x.id===b.id)?.file,path);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),146);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),146);
});
