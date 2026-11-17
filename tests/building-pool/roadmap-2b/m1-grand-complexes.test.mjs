import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_GRAND_COMPLEXES as NEW} from '../../../src/building-pool/roadmap-2b/m1-grand-complexes.mjs';
import {M1_SPECIALTY_COURTS} from '../../../src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
import {M1_NEW_REGION_ARCHITECTURES} from '../../../src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

const all=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...NEW];
const byId=new Map(NEW.map(x=>[x.id,x]));
const k=(x,y,z)=>x+','+y+','+z;
function cells(b){return new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));}
function walk(b,blocked=[]){
 const v=cells(b),start=b.openings.find(o=>o.type==='entrance'),
  denied=new Set(blocked.map(([x,z])=>x+','+z)),
  queue=[[start.x,start.z]],found=new Set();
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],key=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||denied.has(key)||found.has(key))continue;
  if(v.get(k(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>v.has(k(x,y,z))))continue;
  found.add(key);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return found;
}
test('exactly eight genuinely new large original spaces, no identity duplication, 63 structural signatures',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:market-square:temperate:large:01','r2:market-square:desert:large:01',
  'r2:tailor:desert:large:01','r2:butcher:snow:large:01',
  'r2:jeweler:enchanted-forest:large:01','r2:bookshop:mountain:large:01',
  'r2:temple:desert:large:02','r2:theater:temperate:large:01']);
 assert.equal(NEW.length,8);
 const planned=new Set(plannedSlots().map(o=>o.id));
 for(const b of NEW){
  assert(planned.has(b.id),b.id);
  assert.equal(b.size,'large');
  assert(b.voxels.length>3300,b.id+' has no authored large geometry');
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  assert.equal(validateBlueprint(b).valid,true);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:63,distinctArchitectures:63});
});
test('full occupied foundations, supported walking floors, declared windows, and clear three-high door geometry',()=>{
 for(const b of NEW){
  const v=cells(b);
  assert.equal(v.size,b.voxels.length,b.id);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   assert.equal(v.get(k(x,0,z))?.kind,'foundation',b.id+' foundation hole');
   assert.equal(v.get(k(x,1,z))?.kind,'floor',b.id+' unsupported floor');
  }
  const windows=b.voxels.filter(t=>t.kind==='window'),
   records=b.openings.filter(t=>t.type==='window');
  assert(windows.length>=8,b.id+' no genuine windows');
  assert.equal(windows.length,records.length,b.id+' unregistered physical window');
  for(const w of records)assert.equal(v.get(k(w.x,w.y,w.z))?.material,w.material);
  for(const o of b.openings.filter(t=>t.type==='entrance'||t.type==='internal-doorway')){
   assert.equal(o.clearHeightCells,3);
   for(let y=o.y;y<o.y+3;y++)assert(!v.has(k(o.x,y,o.z)),b.id+' blocked doorway');
  }
  assert(b.voxels.some(t=>t.kind==='fixture')&&b.voxels.some(t=>t.kind==='decor'));
 }
});
test('every buyer and workroom destination has genuine floor access from physical public entrance',()=>{
 for(const b of NEW){
  const accessible=walk(b);
  assert(b.routeTargets.length>=3,b.id+' missing three functional destinations');
  for(const t of b.routeTargets)
   assert(accessible.has(t.x+','+t.z),b.id+' cannot reach '+t.name);
 }
});
test('desert two fitting salons are independently sealable, without losing accessible other salon',()=>{
 const b=byId.get('r2:tailor:desert:large:01');
 const a=b.routeTargets.find(t=>t.name==='salon1'),d=b.routeTargets.find(t=>t.name==='salon2'),
  looms=b.routeTargets.find(t=>t.name==='looms');
 assert(!walk(b,[[10,9]]).has(a.x+','+a.z));
 assert(walk(b,[[10,9]]).has(d.x+','+d.z));
 assert(!walk(b,[[10,19]]).has(d.x+','+d.z));
 assert(walk(b,[[10,19]]).has(a.x+','+a.z));
 assert(!walk(b,[[17,26]]).has(looms.x+','+looms.z));
});
test('vault, panorama reader, two pilgrim chapels and backstage have no bypass when their real physical portals are sealed',()=>{
 const cases=[
  ['r2:jeweler:enchanted-forest:large:01',[[23,25]],['vault']],
  ['r2:bookshop:mountain:large:01',[[29,15]],['readers']],
  ['r2:bookshop:mountain:large:01',[[19,27]],['archive']],
  ['r2:temple:desert:large:02',[[11,15]],['west chantry']],
  ['r2:temple:desert:large:02',[[29,15]],['east chantry']],
  ['r2:temple:desert:large:02',[[19,28],[20,28],[21,28]],['altar']],
  ['r2:theater:temperate:large:01',[[8,32],[34,32]],['west backstage','east backstage']],
  ['r2:butcher:snow:large:01',[[7,13],[18,13],[29,13]],['cold room','prep','smoker']]
 ];
 for(const [id,ports,targets] of cases){
  const b=byId.get(id),open=walk(b),closed=walk(b,ports);
  for(const name of targets){
   const t=b.routeTargets.find(q=>q.name===name);assert(t,id+' lacks '+name);
   assert(open.has(t.x+','+t.z),id+' unreachable open '+name);
   assert(!closed.has(t.x+','+t.z),id+' private bypass '+name);
  }
 }
});
test('seven-stall civic market and six-wing caravan court have different real support layouts',()=>{
 const specs=[
  ['r2:market-square:temperate:large:01',7],
  ['r2:market-square:desert:large:01',6]
 ];
 for(const [id,count] of specs){
  const b=byId.get(id),v=cells(b),stalls=b.routeTargets.filter(t=>
   !['center crossing','north route','sun gathering','western shaded path','eastern shaded path'].includes(t.name));
  assert.equal(stalls.length,count);
  for(const t of stalls){
   const x=t.x-2,z=t.z-1;
   for(const xx of [x,x+4])for(const zz of [z,z+4])
    for(let y=0;y<=6;y++)assert(v.has(k(xx,y,zz)),id+' missing canopy corner');
   for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
    assert.equal(v.get(k(xx,6,zz))?.kind,'roof',id+' incomplete vendor canopy');
  }
 }
 const a=byId.get(specs[0][0]),d=byId.get(specs[1][0]);
 assert(a.voxels.some(v=>v.role==='public-water-arch'));
 assert(d.voxels.some(v=>v.role==='beacon-turret'));
});
test('grand performance stage and raised flytower have real supported positions, and stairs remain unapproved',()=>{
 const b=byId.get('r2:theater:temperate:large:01'),v=cells(b);
 assert.equal(b.voxels.filter(q=>q.role==='raised-stage-floor').length,15*7);
 assert.equal(b.voxels.filter(q=>q.role==='audience-rank').length,12*5);
 assert.equal(b.voxels.filter(q=>q.role==='upper-flytower-roof').length,17*7);
 for(const x of [13,29])for(const z of [23,29])
  for(let y=0;y<=10;y++)assert(v.has(k(x,y,z)), 'flytower roof has unsupported post '+k(x,y,z));
 for(const s of b.symbolicStairApproaches){
  assert.equal(s.shapeRotationStatus,'unresolved-symbolic');
  assert.equal(v.get(k(s.x,2,s.z))?.material,'pack1:008');
 }
});
test('all four large tower/trade families have source-authored continuous foundation-to-tall-roof bearing, not hovering props',()=>{
 const supports=[
  ['r2:jeweler:enchanted-forest:large:01',[[24,17],[24,31],[35,17],[35,31]],10],
  ['r2:bookshop:mountain:large:01',[[4,3],[4,30],[34,3],[34,30]],10],
  ['r2:temple:desert:large:02',[[3,3],[3,32],[37,3],[37,32]],10],
  ['r2:butcher:snow:large:01',[[32,25]],12]
 ];
 for(const [id,points,top] of supports){
  const b=byId.get(id),v=cells(b);
  for(const [x,z] of points){
   for(let y=0;y<=top;y++)
    assert(v.has(k(x,y,z)),id+' hovering high-roof structure at '+k(x,y,z));
   assert.equal(v.get(k(x,0,z))?.kind,'foundation',id+' lacks tower foundation');
  }
 }
});
test('six different grand-building exterior rooflines are actually authored at distinct occupied elevations',()=>{
 const specs=[
  ['r2:tailor:desert:large:01','loom-workshop-sawtooth-vault',8,147,'loom-workshop-ridge',9,21],
  ['r2:butcher:snow:large:01','winter-multi-bay-snow-buttress',8,182,'raised-peak-snow-roof',9,72],
  ['r2:bookshop:mountain:large:01','cliff-bookvault-side-arch',8,322,'high-cliff-bookvault-gable',9,38],
  ['r2:jeweler:enchanted-forest:large:01','stepped-root-canopy',11,72,'gem-vault-living-ridge',12,14],
  ['r2:temple:desert:large:02','ceremonial-side-roof',8,84,'ceremonial-apse-crest',9,18],
  ['r2:theater:temperate:large:01','stepped-flytower-shoulder',11,45,'high-grand-flytower-peak',12,3]
 ];
 for(const [id,lowerRole,lowerY,lowerN,upperRole,upperY,upperN] of specs){
  const b=byId.get(id);
  const low=b.voxels.filter(v=>v.role===lowerRole),high=b.voxels.filter(v=>v.role===upperRole);
  assert.equal(low.length,lowerN,id+' missing actual shaped roof geometry');
  assert.equal(high.length,upperN,id+' missing upper architectural roof shape');
  assert(low.every(v=>v.y===lowerY&&v.kind==='roof'),id+' lower roof not actual occupied cell');
  assert(high.every(v=>v.y===upperY&&v.kind==='roof'),id+' upper roof not actual occupied cell');
  const map=cells(b);
  for(const v of high)
   assert(map.has(k(v.x,v.y-1,v.z)),id+' roof ridge floats without a directly occupied lower course');
 }
});
test('desert sacred court has genuinely open lightwell, attached four towers, actual aisle and only symbolic altar steps',()=>{
 const b=byId.get('r2:temple:desert:large:02'),v=cells(b);
 for(const o of b.intentionallyOpenRoof)for(let x=o.x0;x<=o.x1;x++)
  for(let z=o.z0;z<=o.z1;z++)assert(!v.has(k(x,7,z)),b.id+' fake skylight');
 assert.equal(b.voxels.filter(w=>w.role==='sun-tower-cap').length,4);
 assert.equal(b.voxels.filter(w=>w.role==='sun-citadel-altar').length,1);
 assert.equal(b.symbolicStairApproaches.length,2);
 assert(b.symbolicStairApproaches.every(s=>s.shapeRotationStatus==='unresolved-symbolic'));
});
test('manual integrated family source is real but producer shapes, Pack5 fixtures and schema-1 remain unapproved',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const symbols=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 let pack5Total=0;
 const visited=new Set();
 for(const b of NEW){
  const used=new Set([...b.voxels.map(x=>x.material),'pack2:020']);
  assert.deepEqual([...used].sort(),b.unresolvedDependencies.map(d=>d.ref));
  for(const ref of used){
   assert(symbols.has(ref),b.id+' unrecognized Pack family '+ref);
   const variants=manualFivePackVariants(ref);
   assert(variants.length>0);
   if(!visited.has(ref)){
    if(ref.startsWith('pack5:'))
     assert.throws(()=>resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'}),/explicit authored variant/);
    else{
     const asset=resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'});
     assert(asset.visibleBoxes.length&&asset.occupiedOffsets.length&&asset.selectionBoxes.length);
     assert.equal(asset.livePlaceable,false);assert.equal(asset.saveWritten,false);
    }
    visited.add(ref);
   }
  }
  const audit=inspectPack5InMixedBlueprint(b);
  assert.equal(audit.readyForCombinedPlacement,false);
  if(audit.pack5Total){
   pack5Total+=audit.pack5Total;
   assert.equal(audit.resolvedPack5Count,0);
   assert.equal(audit.unresolvedPack5.length,audit.pack5Total);
  }
 }
 assert(pack5Total>20);
});
test('exact PR-head Git blob and cumulative 79/420 source inventory preserve 15 legacy and 48 original identities',()=>{
 const file='src/building-pool/roadmap-2b/m1-grand-complexes.mjs';
 const original=execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim();
 const disk=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(original,disk);
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,
  ledger.authoredCandidates,ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],
  [420,15,106,121,299,0,0,0]);
 assert.equal(ledger.originals.length,106);
 const current=new Set(ledger.originals.map(x=>x.id));
 for(const old of all.filter(x=>x.category!=='temple'||x.variation!==1))
  assert(current.has(old.id),'lost previous authored grand candidate '+old.id);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),121);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),299);
});
