import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_REGIONAL_GALLERIES as NEW} from '../../../src/building-pool/roadmap-2b/m1-regional-galleries.mjs';
import {M1_GRAND_COMPLEXES} from '../../../src/building-pool/roadmap-2b/m1-grand-complexes.mjs';
import {M1_SPECIALTY_COURTS} from '../../../src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
import {M1_NEW_REGION_ARCHITECTURES} from '../../../src/building-pool/roadmap-2b/m1-new-region-architectures.mjs';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture,structuralFingerprint} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inspectPack5InMixedBlueprint} from '../../../src/pack5-integration/blueprint-handoff.mjs';

const all=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...NEW];
const byId=new Map(NEW.map(x=>[x.id,x]));
const pos=(x,y,z)=>x+','+y+','+z;
const cells=b=>new Map(b.voxels.map(v=>[pos(v.x,v.y,v.z),v]));
function reachable(bp,blocked=[]){
 const occupied=cells(bp),first=bp.openings.find(o=>o.type==='entrance'),
  queue=[[first.x,first.z]],reached=new Set(),denied=new Set(blocked.map(([x,z])=>x+','+z));
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],k=x+','+z;
  if(reached.has(k)||denied.has(k)||x<0||z<0||x>=bp.extents.x||z>=bp.extents.z)continue;
  if(occupied.get(pos(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>occupied.has(pos(x,y,z))))continue;
  reached.add(k);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return reached;
}
test('eight actually independently authored slots, 71 distinct D4-normalized geometries',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:market-square:mountain:medium:01',
  'r2:market-square:snow:medium:01',
  'r2:tailor:enchanted-forest:medium:02',
  'r2:butcher:temperate:medium:01',
  'r2:jeweler:snow:medium:01',
  'r2:bookshop:enchanted-forest:medium:01',
  'r2:temple:temperate:large:02',
  'r2:theater:desert:large:01']);
 const reserved=new Set(plannedSlots().map(s=>s.id));
 for(const b of NEW){
  assert(reserved.has(b.id),b.id+' not reserved in authored category × biome × size');
  assert(b.voxels.length>=2700,b.id+' lacks full occupied 3d coordinate construction');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  assert.equal(validateBlueprint(b).uniqueCells,b.voxels.length);
  assert(b.rooms.length>=3,b.id+' missing functional room topology');
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:71,distinctArchitectures:71});
});
test('all eight have real full footings, walkable floor, mounted source windows, and 3-high literal air doors',()=>{
 for(const b of NEW){
  const m=cells(b);assert.equal(m.size,b.voxels.length);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   assert.equal(m.get(pos(x,0,z))?.kind,'foundation',b.id+' floating cell base');
   assert.equal(m.get(pos(x,1,z))?.kind,'floor',b.id+' broken floor walking support');
  }
  const actual=b.voxels.filter(v=>v.kind==='window'),
   recorded=b.openings.filter(o=>o.type==='window');
  assert(actual.length>=8,b.id+' no architectural windows');
  assert.equal(actual.length,recorded.length,b.id+' synthetic window metadata');
  for(const o of recorded)assert.equal(m.get(pos(o.x,o.y,o.z))?.material,o.material);
  for(const o of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway')){
   assert.equal(o.clearHeightCells,3,b.id+' short door');
   for(let y=o.y;y<o.y+3;y++)assert(!m.has(pos(o.x,y,o.z)),b.id+' blocked '+pos(o.x,y,o.z));
  }
  assert(b.voxels.some(v=>v.kind==='fixture')&&b.voxels.some(v=>v.kind==='decor')&&b.voxels.some(v=>v.kind==='roof'));
 }
});
test('all 8 advertised real walking targets physically reachable with 3-high empty standing columns',()=>{
 for(const b of NEW){
  const v=reachable(b);
  assert(b.routeTargets.length>=3);
  for(const target of b.routeTargets)
   assert(v.has(target.x+','+target.z),b.id+' cannot actually reach '+target.name);
 }
});
test('all separately enclosed fitting, cutting, cold, vault, book, sanctuary and backstage rooms have no undeclared bypass',()=>{
 const checks=[
  ['r2:tailor:enchanted-forest:medium:02',[[8,13]],['west fitting']],
  ['r2:tailor:enchanted-forest:medium:02',[[24,19]],['east fitting']],
  ['r2:tailor:enchanted-forest:medium:02',[[16,27]],['rear embroidery']],
  // Crosswise doors x12/x23,z21 are intentional real hygiene/service
  // transfers; a room seals only after ALL its physical entrance ports close.
  ['r2:butcher:temperate:medium:01',[[6,13],[12,21]],['cold larder']],
  ['r2:butcher:temperate:medium:01',[[17,13],[12,21],[23,21]],['prep floor']],
  ['r2:butcher:temperate:medium:01',[[28,13],[23,21]],['curing floor']],
  ['r2:jeweler:snow:medium:01',[[21,24]],['vault']],
  ['r2:bookshop:enchanted-forest:medium:01',[[9,13]],['west reading']],
  ['r2:bookshop:enchanted-forest:medium:01',[[25,19]],['east reading']],
  ['r2:bookshop:enchanted-forest:medium:01',[[17,29]],['book stock']],
  ['r2:temple:temperate:large:02',[[11,17]],['west chapel']],
  ['r2:temple:temperate:large:02',[[33,21]],['east chapel']],
  ['r2:temple:temperate:large:02',[[21,33],[22,33],[23,33]],['altar route']],
  ['r2:theater:desert:large:01',[[8,34],[36,34]],['west backstage','east backstage']]
 ];
 for(const [id,ports,names] of checks){
  const b=byId.get(id),open=reachable(b),closed=reachable(b,ports);
  for(const name of names){
   const target=b.routeTargets.find(t=>t.name===name);assert(target,id+' missing '+name);
   const pos2=target.x+','+target.z;
   assert(open.has(pos2),id+' no open route '+name);
   assert(!closed.has(pos2),id+' has unadvertised unprotected bypass into '+name);
  }
 }
});
test('butcher service-transfer doors intentionally preserve circulation if only the public larder portal is closed',()=>{
 const b=byId.get('r2:butcher:temperate:medium:01');
 const cold=b.routeTargets.find(x=>x.name==='cold larder');
 assert(cold);
 assert(reachable(b,[[6,13]]).has(cold.x+','+cold.z),
  'actual transfer door x12,z21 must still connect the room through the central work bay');
 assert(!reachable(b,[[6,13],[12,21]]).has(cold.x+','+cold.z),
  'both genuine cold-room ports closed must isolate cold storage');
});
test('five mountain stalls and four winter stalls have source-real independent 5×5 supported canopy roofs',()=>{
 for(const [id,count,other] of [
  ['r2:market-square:mountain:medium:01',5,'long-supported-cliff-gallery'],
  ['r2:market-square:snow:medium:01',4,'detached-public-warming-pavilion']]){
  const b=byId.get(id),v=cells(b);
  const marketStalls=b.routeTargets.filter(t=>!['center passage','north approach','crossroads','warming pavilion'].includes(t.name));
  assert.equal(marketStalls.length,count);
  for(const t of marketStalls){
   const xx=t.x-2,zz=t.z-1;
   for(const x of [xx,xx+4])for(const z of [zz,zz+4])
    for(let y=0;y<=6;y++)assert(v.has(pos(x,y,z)),b.id+' canopy load not grounded');
   for(let x=xx;x<=xx+4;x++)for(let z=zz;z<=zz+4;z++)
    assert.equal(v.get(pos(x,6,z))?.kind,'roof',b.id+' seller roof hole');
  }
  assert(b.voxels.some(x=>x.role===other),b.id+' climate-specific massing omitted');
 }
});
test('true roof openings, closed private wings, grounded four-bell garden towers, raised desert stage and unapproved stairs',()=>{
 for(const id of ['r2:tailor:enchanted-forest:medium:02','r2:butcher:temperate:medium:01',
  'r2:bookshop:enchanted-forest:medium:01','r2:temple:temperate:large:02',
  'r2:theater:desert:large:01']){
  const b=byId.get(id),m=cells(b);assert(b.intentionallyOpenRoof.length>0);
  for(const o of b.intentionallyOpenRoof)for(let x=o.x0;x<=o.x1;x++)
   for(let z=o.z0;z<=o.z1;z++)
    assert(!m.has(pos(x,7,z)),b.id+' declared open sky blocked at '+pos(x,7,z));
 }
 const temple=byId.get('r2:temple:temperate:large:02'),m=cells(temple);
 for(const x of [4,40])for(const z of [4,36])
  for(let y=0;y<=12;y++)assert(m.has(pos(x,y,z)),'garden belfry lacks continuous support '+pos(x,y,z));
 const stage=byId.get('r2:theater:desert:large:01'),v=cells(stage);
 assert.equal(stage.voxels.filter(x=>x.role==='raised-stage-floor').length,13*6);
 for(const x of [15,29])for(const z of [24,31])
  for(let y=0;y<=9;y++)assert(v.has(pos(x,y,z)),'stage high shade floating at '+pos(x,y,z));
 for(const b of [temple,stage]){
  assert.equal(b.symbolicStairApproaches.length,2);
  for(const s of b.symbolicStairApproaches){
   assert.equal(s.shapeRotationStatus,'unresolved-symbolic');
   assert.equal(cells(b).get(pos(s.x,s.y,s.z))?.material,'pack1:008');
  }
 }
});
test('six exterior-shape corrections are real multilevel occupied roofs, not metadata or hovering cap blocks',()=>{
 const specs=[
  ['r2:tailor:enchanted-forest:medium:02','separate-fitted-wing-roof',266,8,'high-private-wing-ridge',34,9],
  ['r2:butcher:temperate:medium:01','triple-sawtooth-work-bay-roof',465,8,'specialist-roof-ridge',36,9],
  ['r2:jeweler:snow:medium:01','separate-protected-snow-wing',468,8,'flanking-high-snow-ridge',42,9],
  ['r2:bookshop:enchanted-forest:medium:01','enclosed-reading-wing-roof',280,8,'high-cloister-wing-ridge',32,9],
  ['r2:temple:temperate:large:02','side-prayer-cloister-roof',342,8,'ceremonial-high-side-gable',30,9],
  ['r2:theater:desert:large:01','upper-desert-proscenium',36,10,'desert-spotlight-crest',2,11]
 ];
 for(const [id,lowerRole,lowCount,lowY,upperRole,highCount,highY] of specs){
  const b=byId.get(id),m=cells(b);
  const low=b.voxels.filter(v=>v.role===lowerRole),
   high=b.voxels.filter(v=>v.role===upperRole);
  assert.equal(low.length,lowCount,id+' missing architectural low roof');
  assert.equal(high.length,highCount,id+' missing upper silhouette');
  assert(low.every(v=>v.y===lowY&&v.kind==='roof'),id+' claimed low roof is not occupied');
  assert(high.every(v=>v.y===highY&&v.kind==='roof'),id+' claimed high roof is not occupied');
  for(const v of high)
   assert(m.has(pos(v.x,v.y-1,v.z)),id+' roof floats at '+pos(v.x,v.y,v.z));
 }
});
test('near-duplicate review: forest medium tailors have different whole-source D4 shape and real distinct circulation/roof program',()=>{
 const first=all.find(x=>x.id==='r2:tailor:enchanted-forest:medium:01'),
  second=byId.get('r2:tailor:enchanted-forest:medium:02');
 assert(first&&second,'missing retained earlier forest medium tailor');
 assert.notEqual(structuralFingerprint(first),structuralFingerprint(second));
 const prior=first.voxels.filter(x=>x.kind==='roof').length,
  current=second.voxels.filter(x=>x.kind==='roof').length;
 assert(Math.abs(prior-current)>30,'new variant visually too close in total roof occupied structure');
 assert(second.rooms.some(r=>r.uses.includes('second-fitting')),'missing architecturally separate fitting program');
});
test('read-only manual five-pack producer physical symbol audit never assumes completed Pack5 orientation or live schema-1 integration',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const symbols=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 let count=0;
 const audited=new Set();
 for(const b of NEW){
  const used=new Set([...b.voxels.map(x=>x.material),'pack2:020']);
  assert.deepEqual([...used].sort(),b.unresolvedDependencies.map(x=>x.ref));
  for(const ref of used){
   assert(symbols.has(ref),b.id+' requires non-existent material family '+ref);
   const shapes=manualFivePackVariants(ref);assert(shapes.length>0,ref+' missing physical producer');
   if(audited.has(ref))continue;
   if(ref.startsWith('pack5:')){
    assert.throws(()=>resolveManualFivePackAsset(ref,{numericId:shapes[0].numericId,orientation:'north'}),/explicit authored variant/);
   }else{
    const candidate=resolveManualFivePackAsset(ref,{numericId:shapes[0].numericId,orientation:'north'});
    assert(candidate.visibleBoxes.length&&candidate.occupiedOffsets.length&&candidate.selectionBoxes.length);
    assert.equal(candidate.livePlaceable,false);assert.equal(candidate.saveWritten,false);
   }
   audited.add(ref);
  }
  const pack5=inspectPack5InMixedBlueprint(b);
  assert.equal(pack5.readyForCombinedPlacement,false);
  if(pack5.pack5Total){
   count+=pack5.pack5Total;
   assert.equal(pack5.resolvedPack5Count,0);
  }
 }
 assert(count>15);
});
test('ledger is 79/420, 15 inherited exact temples + 64 unique originals, no approved/integrated and genuine exact PR HEAD Git blob',()=>{
 const file='src/building-pool/roadmap-2b/m1-regional-galleries.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim());
 const j=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([j.target,j.sourceExactInheritedTemples,j.originalNewModels,j.authoredCandidates,
  j.remainingUnauthored,j.creatorAccepted,j.integratedInGame,j.placedInWorld],
  [420,15,64,79,341,0,0,0]);
 assert.equal(j.originals.length,64);
 const allCurrent=new Set(j.originals.map(x=>x.id));
 for(const b of all.filter(b=>b.category!=='temple'||b.variation!==1))assert(allCurrent.has(b.id),'previous candidate identity lost');
 assert.equal(Object.values(j.byCategory).reduce((n,x)=>n+x.authored,0),79);
 assert.equal(Object.values(j.byCategory).reduce((n,x)=>n+x.remaining,0),341);
});
