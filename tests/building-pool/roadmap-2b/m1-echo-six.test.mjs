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
test('six unique source-only authorial slots retain 138 earlier full architectural fingerprints and yield 144 D4-unique complete sources',()=>{
 assert.deepEqual(ECHO_SIX.map(b=>b.id),IDS);
 assert.deepEqual(ECHO_SIX.map(b=>b.voxels.length),[5224,9818,4510,8729,4647,5453]);
 assert.equal(new Set(PRESERVED138.map(b=>b.id)).size,138,'protected 138 source identities lost');
 const prior=new Set(PRESERVED138.map(b=>b.id)),reserved=new Set(plannedSlots().map(s=>s.id));
 for(const b of ECHO_SIX){
  assert(reserved.has(b.id)&&!prior.has(b.id),b.id+' overwrote or invented original slot');
  assert.equal(validateBlueprint(b).valid,true,b.id+' not a valid individually authored source');
  assert(b.isolated&&b.status==='authored-candidate'&&!b.worldPlaced&&!b.numericIdsAssigned,b.id+' production integration not authorized');
 }
 assert.deepEqual(assertDistinctArchitecture(ALL144),{authored:144,distinctArchitectures:144});
});
test('all six structures are real deeply concave independently occupied-cell floors, with actual absent ground and no roofs over empty courtyards',()=>{
 const absent=[395,842,414,686,415,393],voidTargets=[[[20,22]],[[28,26]],[[21,21]],[[39,20],[10,15]],[[28,19]],[[20,20]]];
 const shapes=new Set();
 for(let i=0;i<ECHO_SIX.length;i++){
  const b=ECHO_SIX[i],m=occupancy(b),foot=b.voxels.filter(v=>v.y===0);
  assert.equal(b.deliberatelyAbsentFootprintCells,absent[i],b.id+' old rectified floor footprint');
  assert(b.footprintRectangles.length>=4,b.id+' reused trivial box plan');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const ground=m.get(key(x,0,z)),floor=m.get(key(x,1,z));
   assert.equal(!!floor,!!ground,b.id+' floating walking floor');
   if(!ground)for(let y=2;y<b.extents.y;y++)assert(!m.has(key(x,y,z)),b.id+' roof over unbuilt sky '+x+','+z);
   else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!m.has(key(x+dx,0,z+dz)))){
    assert.equal(m.get(key(x,6,z))?.kind,'wall',b.id+' no inward true weather wall');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=20,b.id+' insufficient concavity');
  for(const [x,z] of voidTargets[i])for(let y=0;y<b.extents.y;y++)
   assert(!m.has(key(x,y,z)),b.id+' fake empty central court '+x+','+z);
  assert(foot.length>=650,b.id+' architecture smaller than source intent');
  shapes.add(b.extents.x+'x'+b.extents.z+':'+foot.map(v=>key(v.x,0,v.z)).join('|'));
 }
 assert.equal(shapes.size,6);
});
test('all new three-high modeled doors are empty and grounded; glazing and frame openings are source-physical rather than painted',()=>{
 for(const b of ECHO_SIX){
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=4,b.id+' no physically closable private passages');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id+' door not three high');
   assert.equal(m.get(key(o.x,1,o.z))?.kind,'floor',b.id+' unsupported portal');
   for(let y=2;y<=4;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' obstructed door '+o.x+','+y+','+o.z);
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=12,b.id+' incomplete source-backed windows');
  for(const o of windows)assert.equal(m.get(key(o.x,o.y,o.z))?.material,o.material,b.id+' imaginary glass');
 }
});
test('public entrances reach all intended rooms and closed actual internal door ports block every private route',()=>{
 for(const b of ECHO_SIX){
  assert(b.rooms.length>=5&&b.routeTargets.length>=5,b.id+' not a complete functional program');
  const open=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' unreachable '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' unlocked private room bypass '+t.name);
 }
});
test('individual y8–11 roof ridges are all actual supported 3D source voxels with foundation below, not uniform colored flat roof plates',()=>{
 const expected=[823,2058,688,1613,777,961];
 for(let i=0;i<ECHO_SIX.length;i++){
  const b=ECHO_SIX[i],m=occupancy(b),raised=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(raised.length,expected[i],b.id+' altered original roof mass');
  assert.deepEqual([...new Set(raised.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' missing high roof tier');
  assert(new Set(raised.map(v=>v.role)).size>=17,b.id+' unvaried roof source geometry');
  for(const v of raised){
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' unsupported '+v.role);
   assert.equal(m.get(key(v.x,0,v.z))?.kind,'foundation',b.id+' unsupported courtyard canopy');
  }
  assert(b.roof.biomeSpecific,b.id+' no biome roof descriptor');
 }
});
test('original mountain large amphitheater has 36 real source-voxel elevated stage cells and accessible side backstage route',()=>{
 const b=ECHO_SIX.find(x=>x.id==='r2:theater:mountain:large:02'),m=occupancy(b);
 assert(b);
 const stage=b.voxels.filter(v=>v.role==='raised-original-performance-stage');
 assert.equal(stage.length,36,'original physical high performance platform missing');
 for(const v of stage)assert(v.kind==='fixture'&&v.y===2&&m.get(key(v.x,1,v.z))?.kind==='floor','stage does not have raised source physical footprint');
 assert(walk(b).has('19,47'),'backstage physical aisle missing');
 assert(!walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z])).has('19,47'),'stage crew passage is not private');
});
test('all six new models have normalized eight-way full 3D occupied-cell Jaccard IoU below 0.85 versus all same-category-and-size sources of 144',()=>{
 for(const b of ECHO_SIX){
  let max=0,near='';
  for(const other of ALL144)if(other!==b&&other.category===b.category&&other.size===b.size){
   const v=closest(b,other);if(v>max){max=v;near=other.id;}
  }
  assert(max<0.85,b.id+' near-duplicate occupied source '+max+' versus '+near);
 }
});
test('new source materials refer to existing manual Pack1–5 producer family symbols but real yaw/variants/AABB remain unavailable',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),families=new Set();
 for(const b of ECHO_SIX){
  const deps=new Set(b.unresolvedDependencies.map(x=>x.ref));
  for(const v of b.voxels){
   assert(allowed.has(v.material)&&deps.has(v.material),b.id+' unbacked material '+v.material);
   families.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(deps.has(o.doorSymbol),b.id+' door symbolic dependency missing');
  for(const dep of b.unresolvedDependencies){
   assert(manualFivePackVariants(dep.ref).length>0,b.id+' no actual candidate variant for '+dep.ref);
   assert(/unresolved/.test(dep.issue),b.id+' unjustified full physical ABI validation');
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' wrongly allowed to place in world');
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(families.has(p),'no valid source references to '+p);
});
test('144-candidate exact-source Git blob provenance, all earlier 138 original IDs and zero creator or runtime placement',()=>{
 const path='src/building-pool/roadmap-2b/m1-echo-six.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
 execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),'new source differs from current tested Git blob');
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,ledger.authoredCandidates,ledger.remainingUnauthored,
 ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],[420,15,131,146,274,0,0,0]);
 assert.equal(ledger.originals.length,131);
 for(const previous of PRESERVED138.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(ledger.originals.some(r=>r.id===previous.id),'missing one of protected 138 previous authored source objects '+previous.id);
 assert.deepEqual(new Set(ledger.originals.map(x=>x.id)),new Set([...ALL144.filter(b=>b.category!=='temple'||b.variation!==1).map(b=>b.id), 'r2:market-square:temperate:small:02','r2:theater:desert:small:03']));
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),146);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),274);
 assert.equal(Object.values(ledger.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),146);
 for(const b of ECHO_SIX)assert.equal(ledger.originals.find(x=>x.id===b.id)?.file,path,b.id+' wrong new source origin');
});
