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
const IDS=["r2:market-square:mountain:large:02","r2:butcher:temperate:large:02","r2:jeweler:snow:medium:02","r2:bookshop:mountain:small:02","r2:theater:enchanted-forest:small:02","r2:temple:enchanted-forest:medium:02"];


const OLD132=COMPLETE132;
const NEW138=[...M1_WEAVE_GEM_TRIPTYCH,...M1_DIADEM_FOLIOS];
const ALL138=[...OLD132,...NEW138];
const NEW_IDS=[
"r2:tailor:desert:large:02","r2:tailor:snow:small:02","r2:jeweler:temperate:large:02",
"r2:jeweler:desert:medium:02","r2:bookshop:snow:large:02","r2:bookshop:enchanted-forest:small:02"
];
test('six independently original reserved slots retain all 132 earlier full-source original geometric identities and 138-way D4 uniqueness',()=>{
 assert.deepEqual(NEW138.map(b=>b.id),NEW_IDS);
 assert.deepEqual(NEW138.map(b=>b.voxels.length),[6956,4316,8521,5495,11289,4804]);
 assert.equal(new Set(OLD132.map(b=>b.id)).size,132,'historical source identity lost');
 const reserved=new Set(plannedSlots().map(x=>x.id)),prior=new Set(OLD132.map(x=>x.id));
 for(const b of NEW138){
  assert(reserved.has(b.id)&&!prior.has(b.id),b.id+' illegal source slot or overwrote prior');
  assert.equal(validateBlueprint(b).valid,true,b.id+' source invalid');
  assert(b.isolated&&b.status==='authored-candidate'&&!b.worldPlaced&&!b.numericIdsAssigned,b.id+' improperly registered');
 }
 assert.deepEqual(assertDistinctArchitecture(ALL138),{authored:138,distinctArchitectures:138});
});
test('all six have genuinely nonrectangular different ground source programs, no phantom courtyard foundations or fake open-air roofs',()=>{
 const absent=[902,391,678,491,430,291],courtyards=[
 [[25,21]],[[25,15]],[[25,23]],[[20,19]],[[20,25],[36,25]],[[16,20]]
 ];
 const shapes=new Set();
 for(let i=0;i<NEW138.length;i++){
  const b=NEW138[i],m=occupancy(b);
  assert.equal(b.deliberatelyAbsentFootprintCells,absent[i],b.id+' physical void accounting');
  assert(b.footprintRectangles.length>=4,b.id+' generic single-rectangle massing');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const base=m.get(key(x,0,z)),floor=m.get(key(x,1,z));
   assert.equal(!!base,!!floor,b.id+' floating walking surface');
   if(!base){
    for(let y=2;y<b.extents.y;y++)assert(!m.has(key(x,y,z)),b.id+' unbuilt garden hides a roof/solid');
   }else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!m.has(key(x+dx,0,z+dz)))){
    assert.equal(m.get(key(x,6,z))?.kind,'wall',b.id+' missing weatherproof outer wall');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=12,b.id+' lacking original re-entrant footprint walls');
  for(const [x,z] of courtyards[i])for(let y=0;y<b.extents.y;y++)assert(!m.has(key(x,y,z)),b.id+' merely painted court');
  shapes.add(b.extents.x+'x'+b.extents.z+':'+b.voxels.filter(v=>v.y===0).map(v=>key(v.x,0,v.z)).join('|'));
 }
 assert.equal(shapes.size,6);
});
test('all real doors have three unblocked physical vertical voxels and at least ten actual source-bound glazed/frame window cells',()=>{
 for(const b of NEW138){
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=4,b.id+' incomplete internal doors');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id+' incomplete air height');
   assert.equal(m.get(key(o.x,1,o.z))?.kind,'floor',b.id+' ungrounded threshold');
   for(let y=2;y<=4;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' physically blocked gate '+o.x+','+y+','+o.z);
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=10,b.id+' no producer-symbol glazing');
  for(const w of windows)assert.equal(m.get(key(w.x,w.y,w.z))?.material,w.material,b.id+' painted but absent glazing');
 }
});
test('public entrance reaches all source-grounded internal destination cells; closing authored internal doors seals private rooms',()=>{
 for(const b of NEW138){
  assert(b.rooms.length>=4&&b.routeTargets.length>=4,b.id+' no distinct room use');
  const open=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' source destination disconnected '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' secret private room bypass '+t.name);
 }
});
test('separate visibly different y8–11 roof regions are source-occupied and physically bearing with foundation below each ridge piece',()=>{
 const hiCounts=[1131,680,1552,902,2365,764];
 for(let i=0;i<NEW138.length;i++){
  const b=NEW138[i],m=occupancy(b),high=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(high.length,hiCounts[i],b.id+' roof original authored source parity');
  assert.deepEqual([...new Set(high.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' colored flat cap rather than high roof mass');
  assert(new Set(high.map(v=>v.role)).size>=15,b.id+' copied identical roof program');
  for(const v of high){
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' floating ridge '+v.role);
   assert.equal(m.get(key(v.x,0,v.z))?.kind,'foundation',b.id+' high roof over unbuilt courtyard');
  }
  assert(b.roof.biomeSpecific,b.id+' roof lacks biome physical descriptor');
 }
});
test('all new sources strictly satisfy eight-way normalized 3D occupied-cell D4 Jaccard IoU <0.85 against every same-category/size source across 138',()=>{
 for(const b of NEW138){
  let max=0,near='';
  for(const o of ALL138)if(o!==b&&o.category===b.category&&o.size===b.size){
   const sim=closest(b,o);
   if(sim>max){max=sim;near=o.id;}
  }
  assert(max<0.85,b.id+' too close to '+near+' at '+max);
 }
});
test('actual declared Pack1–5 symbolic family materials match available producer family candidates, without falsely approving variant/yaw/AABB or saves',()=>{
 const known=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),used=new Set();
 for(const b of NEW138){
  const refs=new Set(b.unresolvedDependencies.map(d=>d.ref));
  for(const v of b.voxels){
   assert(known.has(v.material)&&refs.has(v.material),b.id+' invented producer material '+v.material);
   used.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(refs.has(o.doorSymbol),b.id+' fictional door asset');
  for(const d of b.unresolvedDependencies){
   assert(manualFivePackVariants(d.ref).length>0,b.id+' material lacks real producer variant '+d.ref);
   assert(/unresolved/.test(d.issue),b.id+' wrongly claims verified physical ABI '+d.ref);
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' falsely approved for runtime');
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(used.has(p),'source missing manual '+p);
});
test('fully authored 3-column snow bookshop has two distinct physically empty courtyards and three separate accessible book rooms',()=>{
 const b=NEW138.find(x=>x.id==='r2:bookshop:snow:large:02'),m=occupancy(b),open=walk(b);
 assert(b);
 assert(!m.has(key(20,0,25))&&!m.has(key(36,0,25)),'three independent library naves replaced by generic slab');
 for(const [x,z] of [[9,21],[28,25],[46,23]])assert(open.has(x+','+z),'one of three naves disconnected');
 assert(b.footprintRectangles.length>=5,'no complete triple nave source plan');
});
test('138-file source inventory, no creator acceptance, original 132 source protection, exact new Git blobs, zero merge/in-game placement',()=>{
 const files=['src/building-pool/roadmap-2b/m1-weave-gem-triptych.mjs','src/building-pool/roadmap-2b/m1-diadem-folios.mjs'];
 for(const path of files){
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
   execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path+' differs from committed source');
 }
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,131,146,274,0,0,0]);
 assert.equal(l.originals.length,131);
 for(const prev of OLD132.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(row=>row.id===prev.id),'historical blueprint missing '+prev.id);
 for(const previous of ALL138.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(x=>x.id===previous.id),'one of previous 138 original source IDs lost '+previous.id);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),146);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.remaining,0),274);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),146);
 for(const b of NEW138){
  const path='src/building-pool/roadmap-2b/'+(NEW138.indexOf(b)<3?'m1-weave-gem-triptych.mjs':'m1-diadem-folios.mjs');
  assert.equal(l.originals.find(r=>r.id===b.id)?.file,path,b.id+' source provenance changed');
 }
});
