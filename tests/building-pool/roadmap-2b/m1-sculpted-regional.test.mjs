import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_SCULPTED_REGIONAL as NEW} from '../../../src/building-pool/roadmap-2b/m1-sculpted-regional.mjs';
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
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

const allOlder=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,
 ...TRADE_CULTURE_M1_EXEMPLARS,...M1_REGIONAL_EXEMPLARS,
 ...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,
 ...M1_CLIFF_AND_FESTIVAL,...M1_CONCAVE_COURTS];
const all=[...allOlder,...NEW];
const key=(x,y,z)=>x+','+y+','+z;
const cellMap=b=>new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
const byId=new Map(NEW.map(b=>[b.id,b]));
function flood(b,blocked=[]){
 const occ=cellMap(b),e=b.openings.find(x=>x.type==='entrance'),
  q=[[e.x,e.z]],seen=new Set(),denied=new Set(blocked.map(([x,z])=>x+','+z));
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i],at=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(at)||denied.has(at))continue;
  if(occ.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>occ.has(key(x,y,z))))continue;
  seen.add(at);
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
 }
 return seen;
}
function d4Set(voxels,t){
 const rotated=voxels.map(v=>{
  let x=v.x,z=v.z;switch(t%4){
   case 1:[x,z]=[-z,x];break;case 2:x=-x;z=-z;break;case 3:[x,z]=[z,-x];break;
  }
  if(t>=4)x=-x;return {x,y:v.y,z};
 });
 const xmin=Math.min(...rotated.map(v=>v.x)),zmin=Math.min(...rotated.map(v=>v.z));
 return new Set(rotated.map(v=>key(v.x-xmin,v.y,v.z-zmin)));
}
function closestD4(a,b){
 const aa=d4Set(a.voxels,0);let high=0;
 for(let t=0;t<8;t++){
  const bb=d4Set(b.voxels,t),shorter=aa.size<=bb.size?aa:bb,longer=aa.size<=bb.size?bb:aa;
  let intersect=0;for(const v of shorter)if(longer.has(v))intersect++;
  high=Math.max(high,intersect/(aa.size+bb.size-intersect));
 }
 return high;
}
test('six original fully sourced 3D regional designs occupy valid unused ID slots and all 90 D4 architectures are distinct',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:tailor:snow:large:01',
  'r2:butcher:enchanted-forest:large:01',
  'r2:jeweler:desert:large:01',
  'r2:bookshop:temperate:large:01',
  'r2:theater:mountain:medium:01',
  'r2:temple:snow:small:02']);
 const allowed=new Set(plannedSlots().map(x=>x.id));
 for(const b of NEW){
  assert(allowed.has(b.id),b.id+' unreserved/overlapping slot');
  assert(b.voxels.length>=2600,b.id+' title-only model');
  assert.equal(validateBlueprint(b).valid,true);
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:90,distinctArchitectures:90});
});
test('genuinely sculpted footprints remove ALL 398/455/306/516/386/442 absent ground columns rather than merely masking flat roofs',()=>{
 const expected=[398,455,306,516,386,442];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],m=cellMap(b),missing=expected[i];
  assert.equal(b.deliberatelyAbsentFootprintCells,missing,b.id);
  assert(b.footprintRectangles.length>=2,b.id+' must not be a full rectangle');
  assert.equal(b.voxels.filter(v=>v.y===0).length,b.extents.x*b.extents.z-missing);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const a=m.get(key(x,0,z)),f=m.get(key(x,1,z));
   assert.equal(!!a,!!f,b.id+' foundation/floor mismatch');
   if(a){assert.equal(a.kind,'foundation');assert.equal(f.kind,'floor');}
   else for(let y=2;y<b.extents.y;y++)
    assert(!m.has(key(x,y,z)),b.id+' ghost architecture hovering above absent ground');
  }
 }
});
test('all actual concave perimeter segments have load-bearing envelope walls and accurate physical window registrations',()=>{
 for(const b of NEW){
  const m=cellMap(b),entry=b.openings.find(o=>o.type==='entrance'),
   windows=b.openings.filter(o=>o.type==='window');
  assert(b.voxels.filter(o=>o.kind==='window').length>=20,b.id+' no real facade glazing');
  assert.equal(b.voxels.filter(o=>o.kind==='window').length,windows.length);
  for(const v of windows)assert.equal(m.get(key(v.x,v.y,v.z))?.material,v.material);
  let corners=0,inner=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   if(m.get(key(x,1,z))?.kind!=='floor')continue;
   const out=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>m.get(key(x+dx,1,z+dz))?.kind!=='floor');
   if(!out)continue;
   corners++;if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inner++;
   for(const y of [5,6])assert.equal(m.get(key(x,y,z))?.kind,'wall',b.id+' missing real weather wall '+key(x,y,z));
   if(x!==entry.x||z!==entry.z)assert.equal(m.get(key(x,2,z))?.kind,'wall',b.id+' unsealed perimeter '+key(x,2,z));
  }
  assert(corners>90&&inner>10,b.id+' artificial perimeter without notch weather edges');
 }
});
test('every new region contains distinct named, coordinate-bounded real functional rooms and no blocked 3-cell entry/auxiliary doors',()=>{
 for(const b of NEW){
  assert(b.rooms.length>=4,b.id+' shallow undifferentiated room program');
  const names=new Set(),m=cellMap(b);
  for(const r of b.rooms){
   assert(typeof r.name==='string'&&r.name.length>15,b.id+' unnamed space');
   assert(!names.has(r.name),b.id+' duplicate room');names.add(r.name);
   const {x0,x1,z0,z1}=r.bounds;
   assert([x0,x1,z0,z1].every(Number.isInteger));
   assert(x0>=0&&x1<b.extents.x&&x0<x1&&z0>=0&&z1<b.extents.z&&z0<z1);
   assert(r.uses.length>0);
  }
  for(const p of b.openings.filter(v=>v.type==='entrance'||v.type==='internal-doorway')){
   assert.equal(p.clearHeightCells,3);
   for(let y=p.y;y<p.y+3;y++)assert(!m.has(key(p.x,y,p.z)),b.id+' solid mass in actual door '+key(p.x,y,p.z));
  }
 }
});
test('actual 3-high physical floor BFS reaches every declared visitor or workshop/vault/nave destination',()=>{
 for(const b of NEW){
  const open=flood(b);
  assert(b.routeTargets.length>=4,b.id+' insufficient independent room targets');
  for(const t of b.routeTargets)
   assert(open.has(t.x+','+t.z),b.id+' cannot actually reach '+t.name);
 }
});
test('all actual cold, loom, scriptorium, gem, reliquary and stage side rooms seal when their declared real physical doorways close',()=>{
 const selected={
  'r2:tailor:snow:large:01':['private fitting','loom benches','winter felt room'],
  'r2:butcher:enchanted-forest:large:01':['cool root cellar','clean butchery','curing station'],
  'r2:jeweler:desert:large:01':['western forge','treasury','back valuation'],
  'r2:bookshop:temperate:large:01':['west quiet readers','east scriptory','north manuscript archive','west annex'],
  'r2:theater:mountain:medium:01':['west dressing','east wardrobe'],
  'r2:temple:snow:small:02':['west cloister','east cloister','altar foot']
 };
 for(const b of NEW){
  const open=flood(b),ports=b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]),sealed=flood(b,ports);
  assert(ports.length>=3,b.id+' missing actual controlled doors');
  for(const name of selected[b.id]){
   const t=b.routeTargets.find(x=>x.name===name);assert(t,b.id+' missing '+name);
   const pos=t.x+','+t.z;
   assert(open.has(pos),b.id+' room inaccessible before gate closure: '+name);
   assert(!sealed.has(pos),b.id+' exposes unintended bypass into '+name);
  }
 }
});
test('original regional roof forms are distinct multi-level actual occupied supported geometry, not metadata ridges',()=>{
 const roles={
  'r2:tailor:snow:large:01':['long-west-private-wing','central-independent-loom-hall','east-long-dyework-roof','high-east-drying-spine'],
  'r2:butcher:enchanted-forest:large:01':['west-thick-root-cellar','center-preparation-hall','east-preservation-wing'],
  'r2:jeweler:desert:large:01':['high-west-artisan-gallery','east-secure-treasury-roof','transverse-rear-valuation-bridge'],
  'r2:bookshop:temperate:large:01':['west-reading-crosswing','east-scriptory-crosswing','north-codex-library-roof'],
  'r2:theater:mountain:medium:01':['supported-mountain-stage-overhang','tiered-stone-performance-roof','cliff-flytower-crest'],
  'r2:temple:snow:small:02':['left-long-transept','right-long-transept','rear-stone-apse','west-high-tower']
 };
 for(const b of NEW){
  const m=cellMap(b),upper=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert(upper.length>=50,b.id+' silhouette too shallow');
  for(const label of roles[b.id]){
   assert(b.voxels.some(v=>v.role===label),b.id+' lacks true architectural '+label);
  }
  for(const v of upper)
   assert(m.has(key(v.x,v.y-1,v.z)),b.id+' floating elevated roof '+key(v.x,v.y,v.z));
  for(const opening of b.intentionallyOpenRoof)
   for(let x=opening.x0;x<=opening.x1;x++)for(let z=opening.z0;z<=opening.z1;z++)
    assert(!m.has(key(x,7,z)),b.id+' falsely advertised sky lightwell');
 }
});
test('mountain theater real 13×4 stage and four grounded canopy piers; snow reliquary has two continuously grounded 11-cell belfries',()=>{
 const theater=byId.get('r2:theater:mountain:medium:01'),m=cellMap(theater);
 assert.equal(theater.voxels.filter(v=>v.role==='raised-original-performance-stage').length,52);
 for(const x of [12,28])for(const z of [27,31])
  for(let y=0;y<=8;y++)assert(m.has(key(x,y,z)),theater.id+' cantilever post lacks physical source bearing');
 assert.equal(theater.symbolicStairApproaches.length,2);
 for(const s of theater.symbolicStairApproaches)assert.equal(s.shapeRotationStatus,'unresolved-symbolic');
 const chapel=byId.get('r2:temple:snow:small:02'),c=cellMap(chapel);
 for(const x of [13,17])for(let y=0;y<=10;y++)
  assert(c.has(key(x,y,3)),chapel.id+' symbolic belfry floats '+key(x,y,3));
});
test('all eight D4 rotation and mirror comparisons reject actual similar same-type-and-size structures at Jaccard >=0.89',()=>{
 for(const b of NEW){
  const preceding=allOlder.filter(x=>x.category===b.category&&x.size===b.size);
  assert(preceding.length>0,b.id+' missing earlier source cohort');
  for(const old of preceding){
   const score=closestD4(b,old);
   assert(score<0.89,b.id+' near duplicate of '+old.id+' at '+score);
  }
 }
});
test('all newly used physical manual Pack family symbols resolve to real read-only source geometry, never to assumed live placement or stable numeric IDs',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const families=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),checked=new Set();let realPack5=0;
 for(const b of NEW){
  const used=new Set([...b.voxels.map(v=>v.material),'pack2:020']);
  assert.deepEqual([...used].sort(),b.unresolvedDependencies.map(x=>x.ref));
  for(const ref of used){
   assert(families.has(ref),b.id+' invented physical roster family '+ref);
   const variants=manualFivePackVariants(ref);
   assert(variants.length>0,ref+' missing real producer family variants');
   if(checked.has(ref))continue;
   if(ref.startsWith('pack5:'))
    assert.throws(()=>resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'}),/explicit authored variant/);
   else{
    const a=resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'});
    assert(a.visibleBoxes.length&&a.occupiedOffsets.length&&a.selectionBoxes.length);
    assert.equal(a.livePlaceable,false);
    assert.equal(a.saveWritten,false);
   }
   checked.add(ref);
  }
  const report=inspectPack5InMixedBlueprint(b);
  assert.equal(report.readyForCombinedPlacement,false);
  if(report.pack5Total){assert.equal(report.resolvedPack5Count,0);realPack5+=report.pack5Total;}
 }
 assert(realPack5>=10);
});
test('read-only inherited temple and all 90 historical source identities are preserved by the exact committed PR-head blob and honest ledger',()=>{
 const source='src/building-pool/roadmap-2b/m1-sculpted-regional.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+source],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',source],{encoding:'utf8'}).trim());
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,ledger.authoredCandidates,
  ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],[420,15,123,138,282,0,0,0]);
 assert.equal(ledger.originals.length,123);
 const current=new Set(ledger.originals.map(x=>x.id));
 for(const bp of all.filter(x=>x.category!=='temple'||x.variation!==1))assert(current.has(bp.id),bp.id+' not in later ledger');
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),138);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),282);
});
