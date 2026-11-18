import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_NEW_REGION_ARCHITECTURES as NEW} from '../../../src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,manualFivePackVariants,
 resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

const old=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS];
const all=[...old,...NEW], byId=new Map(NEW.map(m=>[m.id,m]));
const key=(x,y,z)=>x+','+y+','+z;
function voxels(b){return new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));}
function reach(b,blocked=[]){
 const v=voxels(b),first=b.openings.find(o=>o.type==='entrance');
 const denied=new Set(blocked.map(([x,z])=>x+','+z));
 const seen=new Set(),queue=[[first.x,first.z]];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],k=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||denied.has(k)||seen.has(k))continue;
  if(v.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>v.has(key(x,y,z))))continue;
  seen.add(k);
  for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
test('eight actually authored climate-specific plans occupy eight previously empty 2B-only category/biome/size slots',()=>{
 assert.equal(NEW.length,8);
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:market-square:snow:small:01','r2:tailor:desert:small:01',
  'r2:butcher:snow:small:01','r2:jeweler:enchanted-forest:small:01',
  'r2:bookshop:desert:small:01','r2:temple:snow:medium:02',
  'r2:theater:temperate:medium:01','r2:theater:enchanted-forest:small:01']);
 const reserved=new Set(plannedSlots().map(b=>b.id));
 for(const b of NEW){
  assert(reserved.has(b.id),b.id+' violates lane quota');
  assert(b.voxels.length>=1400,b.id+' is only a title/facade');
  assert.equal(b.variation,b.category==='temple'?2:1);
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.status,'authored-candidate');
  assert.equal(validateBlueprint(b).uniqueCells,b.voxels.length);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:47,distinctArchitectures:47});
});
test('genuinely grounded full floor, real weather shell, exact metadata windows and literal vacant 3-high door positions',()=>{
 for(const b of NEW){
  const v=voxels(b);
  assert.equal(v.size,b.voxels.length,b.id);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   assert.equal(v.get(key(x,0,z))?.kind,'foundation',b.id+' missing footing');
   assert.equal(v.get(key(x,1,z))?.kind,'floor',b.id+' missing walking-level support');
  }
  const physical=b.voxels.filter(x=>x.kind==='window');
  const records=b.openings.filter(o=>o.type==='window');
  assert.equal(physical.length,records.length,b.id+' window mismatch');
  assert(physical.length>=8,b.id+' missing source-window detail');
  for(const o of records)assert.equal(v.get(key(o.x,o.y,o.z))?.material,o.material);
  for(const o of b.openings.filter(x=>x.type==='entrance'||x.type==='internal-doorway')){
   assert.equal(o.clearHeightCells,3);
   for(let y=o.y;y<o.y+3;y++)assert(!v.has(key(o.x,y,o.z)),b.id+' blocked registered doorway');
  }
  assert(b.voxels.some(x=>x.kind==='fixture'),b.id+' has no used furniture');
  assert(b.voxels.some(x=>x.kind==='decor'),b.id+' has no decorations');
 }
});
test('all new public buyer aisles and separate specialist rooms connect to front door via actually open 3-high cells',()=>{
 for(const b of NEW){
  const seen=reach(b);
  assert(b.routeTargets.length>=3,b.id);
  for(const target of b.routeTargets)
   assert(seen.has(target.x+','+target.z),b.id+' target '+target.name+' blocked or unreachable');
 }
});
test('specialist private suites and both backstage wings cannot bypass their actual blocked room doors',()=>{
 const check=[
  ['r2:tailor:desert:small:01',[[13,8]],['fitting']],
  ['r2:jeweler:enchanted-forest:small:01',[[14,15]],['vault']],
  ['r2:bookshop:desert:small:01',[[14,9]],['reading']],
  ['r2:temple:snow:medium:02',[[10,12]],['west-chapel']],
  ['r2:temple:snow:medium:02',[[18,12]],['east-chapel']],
  ['r2:theater:temperate:medium:01',[[5,20],[23,20]],['west backstage','east backstage']],
  ['r2:theater:enchanted-forest:small:01',[[4,20],[20,20]],['west-backstage','east-backstage']]
 ];
 for(const [id,closed,names] of check){
  const b=byId.get(id),open=reach(b),blocked=reach(b,closed);
  for(const name of names){
   const target=b.routeTargets.find(q=>q.name===name);
   assert(target,id+' missing '+name);
   const pos=target.x+','+target.z;
   assert(open.has(pos),id+' does not open to '+name);
   assert(!blocked.has(pos),id+' private room has unplanned bypass: '+name);
  }
 }
 const cold=byId.get('r2:butcher:snow:small:01');
 const both=reach(cold,[[5,10],[17,10]]);
 for(const name of ['cold','prep']){
  const t=cold.routeTargets.find(x=>x.name===name);
  assert(!both.has(t.x+','+t.z),'winter butcher rear '+name+' has a bypass');
 }
});
test('snow market includes exactly three independent grounded T-layout kiosks, separate warming pavilion and genuine canopy roofs',()=>{
 const b=byId.get('r2:market-square:snow:small:01'),v=voxels(b);
 const stalls=b.routeTargets.filter(t=>['windward-fish','lee-side-cloth','north-coal'].includes(t.name));
 assert.equal(stalls.length,3);
 for(const t of stalls){
  const xx=t.x-2,zz=t.z-1;
  for(const x of [xx,xx+4])for(const z of [zz,zz+4]){
   for(let y=0;y<=6;y++)assert(v.has(key(x,y,z)),b.id+' unsupported canopy post '+key(x,y,z));
  }
  for(let x=xx;x<=xx+4;x++)for(let z=zz;z<=zz+4;z++)
   assert.equal(v.get(key(x,6,z))?.kind,'roof',b.id+' kiosk weather ceiling missing');
 }
 assert.equal(v.get(key(22,6,18))?.role,'separate-warming-pavilion');
 assert(!v.has(key(13,6,12)),'winter public spine must remain open to sky');
});
test('all eight authored roofs respect intentional open roof zones; canopy ridge and snow flue are truly occupied',()=>{
 for(const b of NEW){
  const v=voxels(b);
  for(const voidZone of b.intentionallyOpenRoof){
   for(let x=voidZone.x0;x<=voidZone.x1;x++)for(let z=voidZone.z0;z<=voidZone.z1;z++)
    assert(!v.has(key(x,7,z)),b.id+' false advertised skylight '+key(x,7,z));
  }
 }
 const snow=byId.get('r2:butcher:snow:small:01'),temple=byId.get('r2:temple:snow:medium:02');
 assert.equal(voxels(snow).get(key(19,11,17))?.role,'separate-extraction-flue');
 assert.equal(voxels(temple).get(key(4,11,4))?.role,'attached-bell-shaft');
 assert.equal(voxels(temple).get(key(24,11,4))?.role,'attached-bell-shaft');
});
test('new raised theater platforms and snow altar steps remain physical coordinates but slope / orientation are UNAPPROVED',()=>{
 for(const id of ['r2:theater:temperate:medium:01','r2:theater:enchanted-forest:small:01',
  'r2:temple:snow:medium:02']){
  const b=byId.get(id),v=voxels(b);
  assert.equal(b.symbolicStairApproaches.length,2);
  for(const s of b.symbolicStairApproaches){
   assert.equal(v.get(key(s.x,s.y,s.z))?.material,'pack1:008');
   assert.equal(s.shapeRotationStatus,'unresolved-symbolic');
  }
  assert(b.unresolvedDependencies.some(d=>d.ref==='pack1:008'));
  if(b.category==='theater')assert(b.voxels.some(v=>v.role==='raised-stage-floor'));
 }
});
test('all eight source-authentic manual physical ABI descriptors exist, but no auto-variants or live placement are declared',()=>{
 const families=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const physical=new Map();
 let pack5=0;
 for(const b of NEW){
  const used=new Set([...b.voxels.map(v=>v.material),'pack2:020']);
  const unresolved=new Set(b.unresolvedDependencies.map(d=>d.ref));
  assert.deepEqual([...used].sort(),[...unresolved].sort(),b.id);
  for(const ref of used){
   assert(families.has(ref),b.id+' not a real Pack 1-5 family: '+ref);
   if(!physical.has(ref)){
    const variants=manualFivePackVariants(ref);
    assert(variants.length>0,ref+' missing variant');
    if(ref.startsWith('pack5:')){
     // Genuine Pack 5 producer intentionally fails closed without an AUTHORED
     // variant. Do not synthesize one simply to make tests green.
     assert.throws(()=>resolveManualFivePackAsset(ref,{
      numericId:variants[0].numericId,orientation:'north'
     }),/explicit authored variant/);
    }else{
     const selected=resolveManualFivePackAsset(ref,{
      numericId:variants[0].numericId,orientation:'north'
     });
     assert(selected.visibleBoxes.length>0&&selected.selectionBoxes.length>0&&selected.occupiedOffsets.length>0);
     assert.equal(selected.livePlaceable,false);
     assert.equal(selected.saveWritten,false);
    }
    physical.set(ref,true);
   }
  }
  const result=inspectPack5InMixedBlueprint(b);
  if(result.pack5Total){
   pack5+=result.pack5Total;
   assert.equal(result.resolvedPack5Count,0);
   assert.equal(result.unresolvedPack5.length,result.pack5Total);
  }
  assert.equal(result.readyForCombinedPlacement,false);
  assert.equal(b.worldPlaced,false);
 }
 assert(pack5>18);
});
test('authoritative ledger is current 79/420, inherited original source stays 15, all new IDs occur once and this is actual PR HEAD source',()=>{
 const file='src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
 const committed=execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim();
 const worktree=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(committed,worktree);
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,
  ledger.authoredCandidates,ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],
  [420,15,131,146,274,0,0,0]);
 assert.equal(ledger.originals.length,131);
 const current=new Set(ledger.originals.map(x=>x.id));
 for(const bp of all.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(current.has(bp.id),'lost earlier authored candidate '+bp.id);
 assert.equal(Object.values(ledger.byCategory).reduce((a,x)=>a+x.authored,0),146);
 assert.equal(Object.values(ledger.byCategory).reduce((a,x)=>a+x.remaining,0),274);
 assert.deepEqual([ledger.byCategory['market-square'].authored,ledger.byCategory.theater.authored,
  ledger.byCategory.temple.authored],[21,22,26]);
});
