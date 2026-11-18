import {M1_TERRACES_SANCTUARIES} from '../../../src/building-pool/roadmap-2b/m1-terraces-sanctuaries.mjs';
import {M1_WINDFOLD_GUILDS} from '../../../src/building-pool/roadmap-2b/m1-windfold-guilds.mjs';
import {M1_CRESCENT_MERCHANTS} from '../../../src/building-pool/roadmap-2b/m1-crescent-merchants.mjs';
import {M1_RIME_AND_RIVER} from '../../../src/building-pool/roadmap-2b/m1-rime-and-river.mjs';
import {M1_REGIONAL_FORMS} from '../../../src/building-pool/roadmap-2b/m1-regional-forms.mjs';
import {M1_CROSSBAR_SWITCHBACK} from '../../../src/building-pool/roadmap-2b/m1-crossbar-switchback.mjs';
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




const PRIOR121=[...all,...M1_TERRACES_SANCTUARIES,...M1_WINDFOLD_GUILDS,...M1_CRESCENT_MERCHANTS,...M1_RIME_AND_RIVER];
const NEW_FORMS=[...M1_REGIONAL_FORMS,...M1_CROSSBAR_SWITCHBACK];
const COMPLETE126=[...PRIOR121,...NEW_FORMS];
const IDS=[
 "r2:tailor:mountain:large:02","r2:butcher:enchanted-forest:small:02","r2:jeweler:mountain:large:02",
 "r2:tailor:enchanted-forest:small:02","r2:butcher:mountain:medium:02"
];
test('five exact reserved source geometries preserve 121 earlier authors and all 126 have distinct full occupied-cell fingerprints under eight-way D4',()=>{
 assert.deepEqual(NEW_FORMS.map(b=>b.id),IDS);
 assert.deepEqual(NEW_FORMS.map(b=>b.voxels.length),[5407,3861,8068,3598,5377]);
 assert.equal(new Set(PRIOR121.map(b=>b.id)).size,121,'lost source-authored historical building identity');
 const previous=new Set(PRIOR121.map(b=>b.id)),reserved=new Set(plannedSlots().map(x=>x.id));
 for(const b of NEW_FORMS){
  assert(reserved.has(b.id)&&!previous.has(b.id),b.id+' unreserved or colliding source');
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert(b.isolated&&b.status==='authored-candidate'&&!b.worldPlaced&&!b.numericIdsAssigned);
 }
 assert.deepEqual(assertDistinctArchitecture(COMPLETE126),{authored:126,distinctArchitectures:126});
});
test('true L, U, ring, T and switchback forms have five distinct original ground signatures and no phantom courtyard foundations',()=>{
 const missing=[963,400,728,504,522],minBounds=[3,3,4,3,4];
 const uniqueShapeFingerprints=new Set();
 for(let i=0;i<NEW_FORMS.length;i++){
  const b=NEW_FORMS[i],map=occupancy(b),foot=new Set(b.voxels.filter(v=>v.y===0).map(v=>key(v.x,0,v.z)));
  assert.equal(b.deliberatelyAbsentFootprintCells,missing[i],b.id+' author-defined no-foundation ground');
  assert(b.footprintRectangles.length>=minBounds[i],b.id+' nonphysical rounded rectangle substitution');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const floor=map.get(key(x,1,z)),base=map.get(key(x,0,z));
   assert.equal(!!floor,!!base,b.id+' missing building walking foundation');
   if(!base){
    for(let y=2;y<b.extents.y;y++)assert(!map.has(key(x,y,z)),b.id+' illegal roof over absent courtyard '+x+','+z);
   }else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!map.has(key(x+dx,0,z+dz)))){
    assert.equal(map.get(key(x,6,z))?.kind,'wall',b.id+' missing real inward rain wall');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=18,b.id+' fake irregular outline');
  uniqueShapeFingerprints.add(b.extents.x+'x'+b.extents.z+':'+[...foot].sort().join('|'));
 }
 assert.equal(uniqueShapeFingerprints.size,5);
 const courtyard=NEW_FORMS.find(b=>b.id===IDS[2]),u=NEW_FORMS.find(b=>b.id===IDS[1]);
 assert(courtyard&&u);
 for(const [b,x,z] of [[courtyard,25,24],[u,16,13]]){
  const m=occupancy(b);for(let y=0;y<b.extents.y;y++)
   assert(!m.has(key(x,y,z)),b.id+' enclosed courtyard is only a drawn floor or skylight');
 }
});
test('all new physical doors have three clear air cells and all source windows match genuine voxel materials',()=>{
 for(const b of NEW_FORMS){
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=3,b.id+' missing secured threshold geometry');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id);
   assert.equal(m.get(key(o.x,1,o.z))?.kind,'floor',b.id+' door missing slab');
   for(let y=2;y<=4;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' blocked real door');
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=12,b.id+' too few source-backed windows');
  for(const o of windows)assert.equal(m.get(key(o.x,o.y,o.z))?.material,o.material,b.id+' phantom window');
 }
});
test('real connected private rooms are reachable from outside via four-way floor movement and physically sealed by closing actual doors',()=>{
 for(const b of NEW_FORMS){
  assert(b.rooms.length>=4&&b.routeTargets.length>=4,b.id+' no useful room architecture');
  const open=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' unreachable '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' unsecured rear room '+t.name);
 }
});
test('four physically supported high roof levels y8 y9 y10 y11 with true roof foundation coverage, not only decorative color fields',()=>{
 const raised=[930,566,1380,431,906];
 for(let i=0;i<NEW_FORMS.length;i++){
  const b=NEW_FORMS[i],map=occupancy(b),hi=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(hi.length,raised[i],b.id+' modified source roof');
  assert.deepEqual([...new Set(hi.map(x=>x.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' missing physical high contour level');
  assert(new Set(hi.map(v=>v.role)).size>=13,b.id+' copied flat roof plate');
  for(const v of hi){
   assert(map.has(key(v.x,v.y-1,v.z)),b.id+' floating ridge '+v.role);
   assert.equal(map.get(key(v.x,0,v.z))?.kind,'foundation',b.id+' roof over non-existent courtyard');
  }
 }
});
test('genuine differently shaped footprint graphs have strict occupied-source normalized eight-way D4 Jaccard IoU <0.85 against every 126 candidate in same category and size',()=>{
 for(const b of NEW_FORMS){
  let worst=0,olderName='';
  for(const prev of COMPLETE126)if(prev!==b&&prev.category===b.category&&prev.size===b.size){
   const val=closest(b,prev);
   if(val>worst){worst=val;olderName=prev.id;}
  }
  assert(worst<0.85,b.id+' near-duplicate '+worst+' versus '+olderName);
 }
});
test('all physical material voxels correspond to real Pack1-5 family producer candidates without asserting AABB yaw collision or save compatibility',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),packs=new Set();
 for(const b of NEW_FORMS){
  const unresolved=new Set(b.unresolvedDependencies.map(d=>d.ref));
  for(const v of b.voxels){
   assert(allowed.has(v.material)&&unresolved.has(v.material),b.id+' ungrounded producer symbol '+v.material);
   packs.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(unresolved.has(o.doorSymbol),b.id+' invented door family');
  for(const d of b.unresolvedDependencies){
   assert(manualFivePackVariants(d.ref).length>0,b.id+' no actual producer variant '+d.ref);
   assert(/unresolved/.test(d.issue),b.id+' wrongly approved physical ABI '+d.ref);
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' improperly approved for runtime world');
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(packs.has(p),'no true '+p+' source family');
});
test('ledger preserves 121 prior source-author records, exact Git source SHA, and records five original new candidates without approving any',()=>{
 for(const p of ['src/building-pool/roadmap-2b/m1-regional-forms.mjs','src/building-pool/roadmap-2b/m1-crossbar-switchback.mjs']){
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+p],{encoding:'utf8'}).trim(),
   execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),p+' differs from exact committed source');
 }
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,ledger.authoredCandidates,ledger.remainingUnauthored,
 ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],[420,15,131,146,274,0,0,0]);
 assert.equal(ledger.originals.length,131);
 for(const b of PRIOR121.filter(x=>x.category!=='temple'||x.variation!==1))assert(ledger.originals.some(x=>x.id===b.id),'older authored source lost '+b.id);
 for(const prior of COMPLETE126.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(ledger.originals.some(row=>row.id===prior.id),'one of 126 protected earlier source models lost '+prior.id);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),146);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),274);
 assert.equal(Object.values(ledger.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),146);
 for(const b of NEW_FORMS){
  const file=b.id===IDS[0]||b.id===IDS[1]||b.id===IDS[2]?'m1-regional-forms.mjs':'m1-crossbar-switchback.mjs';
  assert.equal(ledger.originals.find(x=>x.id===b.id)?.file,'src/building-pool/roadmap-2b/'+file,b.id+' source mapping wrong');
 }
});
