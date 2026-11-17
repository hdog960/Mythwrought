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
test('six exact reserved M1 source architectures retain all 126 earlier source-owned buildings and prove 132-way D4 physical-fingerprint uniqueness',()=>{
 assert.deepEqual(ORIGINAL_SIX.map(b=>b.id),IDS);
 assert.deepEqual(ORIGINAL_SIX.map(b=>b.voxels.length),[7336,7088,5399,4019,4740,5505]);
 assert.equal(new Set(PRESERVED126.map(b=>b.id)).size,126,'earlier original authored IDs changed');
 const reserved=new Set(plannedSlots().map(x=>x.id)),prior=new Set(PRESERVED126.map(x=>x.id));
 for(const b of ORIGINAL_SIX){
  assert(reserved.has(b.id)&&!prior.has(b.id),b.id+' is not reserved, or was already authored');
  assert.equal(validateBlueprint(b).valid,true,b.id+' invalid blueprint');
  assert(b.isolated&&b.status==='authored-candidate'&&!b.worldPlaced&&!b.numericIdsAssigned,b.id+' illicit production registration');
 }
 assert.deepEqual(assertDistinctArchitecture(COMPLETE132),{authored:132,distinctArchitectures:132});
});
test('asymmetric C, T, zigzag, forest courtyard theater, and pinched cloister have genuinely absent ground, 3D exterior walls, no courtyard roof or fake floors',()=>{
 const missing=[771,674,413,321,357,631];
 const courtPoints=new Map([[IDS[0],[25,26]],[IDS[1],[21,22]],[IDS[4],[17,20]],[IDS[5],[21,20]]]);
 for(let i=0;i<ORIGINAL_SIX.length;i++){
  const b=ORIGINAL_SIX[i],m=occupancy(b),base=b.voxels.filter(v=>v.y===0),footprints=b.footprintRectangles;
  assert.equal(b.deliberatelyAbsentFootprintCells,missing[i],b.id+' courtyard ground falsely reported');
  assert(footprints.length>=4,b.id+' insufficient source-authored footprint masses');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const solid=m.get(key(x,0,z)),floor=m.get(key(x,1,z));
   assert.equal(!!solid,!!floor,b.id+' ungrounded floor');
   if(!solid){for(let y=2;y<b.extents.y;y++)assert(!m.has(key(x,y,z)),b.id+' phantom gazebo in unbuilt court '+x+','+z);}
   else if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!m.has(key(x+dx,0,z+dz)))){
    assert.equal(m.get(key(x,6,z))?.kind,'wall',b.id+' outdoor weather wall missing');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=15,b.id+' has no real interior reentrant weather corners');
  const point=courtPoints.get(b.id);
  if(point)for(let y=0;y<b.extents.y;y++)assert(!m.has(key(point[0],y,point[1])),b.id+' courtyard was never truly cut from geometry');
  assert(base.length>600,b.id+' too little author-created architecture');
 }
});
test('source windows and all modeled internal ports are physical, grounded and actually three voxels tall with no hidden wall collision',()=>{
 for(const b of ORIGINAL_SIX){
  const m=occupancy(b),doors=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(doors.length>=4,b.id+' private rooms are only drawn');
  for(const o of doors){
   assert.equal(o.clearHeightCells,3,b.id+' 3-high air threshold contract');
   assert.equal(m.get(key(o.x,1,o.z))?.kind,'floor',b.id+' threshold lacks proper ground');
   for(let y=2;y<=4;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' physically blocked entry '+o.x+','+y+','+o.z);
  }
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=10,b.id+' no producer-token windows');
  for(const w of windows)assert.equal(m.get(key(w.x,w.y,w.z))?.material,w.material,b.id+' window has no physical authored cell');
 }
});
test('all new original structure rooms are physically reachable from exterior, and genuinely secured when the actual door cells close',()=>{
 for(const b of ORIGINAL_SIX){
  assert(b.routeTargets.length>=4&&b.rooms.length>=4,b.id+' poor original functional room plan');
  const open=walk(b),closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  for(const t of b.routeTargets)assert(open.has(t.x+','+t.z),b.id+' unreachable internal room witness '+t.name);
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' rear or secure room bypass while gate closed '+t.name);
 }
});
test('real 4-tier source-authored stepped roofs at y8/9/10/11 have immediate bearing support and ground under every roof element',()=>{
 const expected=[1291,1249,828,576,810,676];
 for(let i=0;i<ORIGINAL_SIX.length;i++){
  const b=ORIGINAL_SIX[i],m=occupancy(b),raised=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(raised.length,expected[i],b.id+' supported upper roof source parity drift');
  assert.deepEqual([...new Set(raised.map(v=>v.y))].sort((a,b)=>a-b),[8,9,10,11],b.id+' colored flat plane, missing real ridge tiers');
  assert(new Set(raised.map(v=>v.role)).size>=14,b.id+' not enough independent region-specific roof sources');
  for(const v of raised){
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' unsupported roof voxel '+v.role);
   assert.equal(m.get(key(v.x,0,v.z))?.kind,'foundation',b.id+' floating rooftop over nonexistent ground');
  }
  assert(b.roof.biomeSpecific,b.id+' missing seasonal roof metadata');
 }
});
test('forest stagehouse supplies physically elevated 28-source-cell stage supported by floor and separately accessible backstage aisles',()=>{
 const b=ORIGINAL_SIX.find(x=>x.category==='theater');
 assert(b);
 const m=occupancy(b),stage=b.voxels.filter(v=>v.role==='raised-original-performance-stage');
 assert.equal(stage.length,28,'stage is only decorative metadata');
 for(const v of stage)assert(v.kind==='fixture'&&v.y===2&&m.get(key(v.x,1,v.z))?.kind==='floor','actual raised stage has no ground');
 const back=b.routeTargets.find(t=>t.name==='stagehands');
 assert(back&&walk(b).has(back.x+','+back.z),'no route around real raised stage');
 assert(!walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z])).has(back.x+','+back.z),'private stagehands route can be bypassed');
});
test('all new original occupied sources are strictly below eight-way normalized 3D Jaccard IoU 0.85 against entire 132-candidate type-and-size group',()=>{
 for(const b of ORIGINAL_SIX){
  let worst=0,otherId='';
  for(const other of COMPLETE132)if(b!==other&&b.category===other.category&&b.size===other.size){
   const sim=closest(b,other);
   if(sim>worst){worst=sim;otherId=other.id;}
  }
  assert(worst<0.85,b.id+' near duplicate occupied-cell D4 '+worst+' with '+otherId);
 }
});
test('all symbolic source materials are real Pack1–5 candidate producer families while exact variant/yaw/AABB and physical game integration remain blocked',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),families=new Set();
 for(const b of ORIGINAL_SIX){
  const depRefs=new Set(b.unresolvedDependencies.map(d=>d.ref));
  for(const v of b.voxels){
   assert(allowed.has(v.material),b.id+' invented material '+v.material);
   assert(depRefs.has(v.material),b.id+' missing physical producer family manifest '+v.material);
   families.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(depRefs.has(o.doorSymbol),b.id+' unbound modeled door');
  for(const d of b.unresolvedDependencies){
   assert(manualFivePackVariants(d.ref).length>0,b.id+' no real variant candidate '+d.ref);
   assert(/unresolved/.test(d.issue),b.id+' claims unverified producer AABB');
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' wrongly ready for world placement');
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(families.has(p),'missing physical '+p+' candidate material');
});
test('ledger records exact source ID identities, immutable historical 126-source parity, committed Git blob and never any approved or placed building',()=>{
 const path='src/building-pool/roadmap-2b/m1-highland-grove-six.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
 execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path+' source not exact HEAD');
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,123,138,282,0,0,0]);
 assert.equal(l.originals.length,123);
 for(const prior of PRESERVED126.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(row=>row.id===prior.id),'lost historical authored source identity '+prior.id);
 for(const prior of COMPLETE132.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(l.originals.some(r=>r.id===prior.id),'lost one of original 132 authored identities '+prior.id);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),138);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.remaining,0),282);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,x)=>n+x.small+x.medium+x.large,0),138);
 for(const b of ORIGINAL_SIX)
  assert.equal(l.originals.find(x=>x.id===b.id)?.file,path,b.id+' ledger wrong author source');
});
