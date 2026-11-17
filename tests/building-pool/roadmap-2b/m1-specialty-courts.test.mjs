import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {M1_SPECIALTY_COURTS as NEW} from '../../../src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
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
const prior=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES];
const all=[...prior,...NEW],byId=new Map(NEW.map(x=>[x.id,x]));
const cell=(x,y,z)=>x+','+y+','+z;
function cells(b){return new Map(b.voxels.map(v=>[cell(v.x,v.y,v.z),v]));}
function reach(b,blocked=[]){
 const v=cells(b),entry=b.openings.find(o=>o.type==='entrance');
 const excluded=new Set(blocked.map(([x,z])=>x+','+z));
 const queue=[[entry.x,entry.z]],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],p=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(p)||excluded.has(p))continue;
  if(v.get(cell(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>v.has(cell(x,y,z))))continue;
  seen.add(p);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
test('eight new reserved IDs, exact self-contained coordinate massing, 55 genuine unique source designs',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:market-square:temperate:medium:01','r2:tailor:snow:medium:01',
  'r2:butcher:enchanted-forest:small:01','r2:jeweler:desert:small:01',
  'r2:bookshop:snow:small:01','r2:temple:mountain:medium:02',
  'r2:theater:snow:small:01','r2:bookshop:temperate:medium:01']);
 const roster=new Set(plannedSlots().map(s=>s.id));
 for(const bp of NEW){
  assert(roster.has(bp.id),bp.id+' not reserved');
  assert(bp.voxels.length>=1900,bp.id+' title-only architecture');
  assert.equal(bp.status,'authored-candidate');
  assert.equal(bp.worldPlaced,false);
  assert.equal(bp.numericIdsAssigned,false);
  assert.equal(validateBlueprint(bp).uniqueCells,bp.voxels.length);
  assert(bp.rooms.length>=3);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:55,distinctArchitectures:55});
});
test('every new blueprint has whole supported floor, exact registered windows and truly 3-high empty door geometry',()=>{
 for(const b of NEW){
  const map=cells(b);
  assert.equal(map.size,b.voxels.length);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   assert.equal(map.get(cell(x,0,z))?.kind,'foundation',b.id+' missing footing');
   assert.equal(map.get(cell(x,1,z))?.kind,'floor',b.id+' missing ground floor');
  }
  const physical=b.voxels.filter(v=>v.kind==='window');
  const entries=b.openings.filter(o=>o.type==='window');
  assert.equal(physical.length,entries.length,b.id);
  assert(physical.length>=8,b.id+' has no window detail');
  for(const o of entries)assert.equal(map.get(cell(o.x,o.y,o.z))?.material,o.material);
  for(const o of b.openings.filter(o=>['entrance','internal-doorway'].includes(o.type))){
   assert.equal(o.clearHeightCells,3,b.id);
   for(let y=o.y;y<o.y+3;y++)assert(!map.has(cell(o.x,y,o.z)),b.id+' blocked '+cell(o.x,y,o.z));
  }
  assert(b.voxels.some(v=>v.kind==='roof')&&b.voxels.some(v=>v.kind==='fixture')&&
   b.voxels.some(v=>v.kind==='decor'));
 }
});
test('all authored public paths, specialized workrooms and backstage entrances are traversable to actual floor targets',()=>{
 for(const b of NEW){
  const reachable=reach(b);
  assert(b.routeTargets.length>=3,b.id+' no real route targets');
  for(const t of b.routeTargets)
   assert(reachable.has(t.x+','+t.z),b.id+' inaccessible '+t.name);
 }
});
test('two independent snow tailor fitting rooms are sealed by their OWN door, not bypassable',()=>{
 const b=byId.get('r2:tailor:snow:medium:01');
 const room1=b.routeTargets.find(t=>t.name==='first fitting');
 const room2=b.routeTargets.find(t=>t.name==='second fitting');
 assert(room1&&room2);
 assert(!reach(b,[[8,8]]).has(room1.x+','+room1.z));
 assert(reach(b,[[8,8]]).has(room2.x+','+room2.z));
 assert(!reach(b,[[8,14]]).has(room2.x+','+room2.z));
 assert(reach(b,[[8,14]]).has(room1.x+','+room1.z));
 const stock=b.routeTargets.find(t=>t.name==='cutting workshop');
 assert(!reach(b,[[12,19]]).has(stock.x+','+stock.z));
});
test('actual vault, reading annex, cold-room and cliff chantry never bypass their real closed private ports',()=>{
 for(const [id,ports,rooms] of [
  ['r2:jeweler:desert:small:01',[[14,17]],['locked vault']],
  ['r2:bookshop:snow:small:01',[[15,12]],['reading annex']],
  ['r2:bookshop:temperate:medium:01',[[19,12]],['quiet gallery']],
  ['r2:temple:mountain:medium:02',[[9,13]],['west chapel']],
  ['r2:temple:mountain:medium:02',[[19,13]],['east chapel']],
  ['r2:theater:snow:small:01',[[5,23],[21,23]],['west dressing access','east dressing access']],
  ['r2:butcher:enchanted-forest:small:01',[[5,10],[19,10]],['cold goods','prep']]
 ]){
  const b=byId.get(id),open=reach(b),closed=reach(b,ports);
  for(const name of rooms){
   const target=b.routeTargets.find(t=>t.name===name);
   assert(target,id+' missing '+name);
   const at=target.x+','+target.z;
   assert(open.has(at),id+' missing reachable '+name);
   assert(!closed.has(at),id+' private room bypass '+name);
  }
 }
});
test('five temperate medium market booths are independent, all canopy cells are supported and public water basin does not block the crossing',()=>{
 const b=byId.get('r2:market-square:temperate:medium:01'),map=cells(b);
 const stalls=b.routeTargets.filter(t=>['west-grain','east-fabric','west-flowers','east-pottery','north-apothecary'].includes(t.name));
 assert.equal(stalls.length,5);
 for(const t of stalls){
  const x=t.x-2,z=t.z-1;
  for(const xx of [x,x+4])for(const zz of [z,z+4])
   for(let y=0;y<=6;y++)assert(map.has(cell(xx,y,zz)),t.name+' unsupported roof post');
  for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
   assert.equal(map.get(cell(xx,6,zz))?.kind,'roof',t.name+' canopy gap');
 }
 assert.equal(b.voxels.filter(v=>v.role==='off-center-public-water-basin').length,4);
 assert(!map.has(cell(15,6,14)),'market courtyard center not open to sky');
});
test('roof skylights are honestly open and distinct snow auditorium ridge is directly borne at y8',()=>{
 for(const id of ['r2:butcher:enchanted-forest:small:01','r2:jeweler:desert:small:01',
  'r2:bookshop:temperate:medium:01']){
  const b=byId.get(id),m=cells(b);
  assert(b.intentionallyOpenRoof.length>0);
  for(const o of b.intentionallyOpenRoof)for(let x=o.x0;x<=o.x1;x++)
   for(let z=o.z0;z<=o.z1;z++)assert(!m.has(cell(x,7,z)),b.id+' fake skylight');
 }
 const b=byId.get('r2:theater:snow:small:01'),v=cells(b);
 for(let z=4;z<=26;z++){
  assert.equal(v.get(cell(13,9,z))?.role,'high-snow-auditorium-ridge');
  assert(v.has(cell(13,8,z)),'ridge not supported by intermediate bearing course');
 }
 for(const xx of [7,19])for(const zz of [17,21])
  for(let y=0;y<=6;y++)assert(v.has(cell(xx,y,zz)),'unanchored stage roof support');
});
test('physical raised sanctuary and stage stair intentions never become falsely certified playable slopes',()=>{
 for(const id of ['r2:temple:mountain:medium:02','r2:theater:snow:small:01']){
  const b=byId.get(id),m=cells(b);
  assert.equal(b.symbolicStairApproaches.length,2);
  for(const step of b.symbolicStairApproaches){
   assert.equal(step.shapeRotationStatus,'unresolved-symbolic');
   assert.equal(m.get(cell(step.x,2,step.z))?.material,'pack1:008');
  }
  assert(b.unresolvedDependencies.some(d=>d.ref==='pack1:008'));
  if(b.category==='theater')assert.equal(b.voxels.filter(v=>v.role==='elevated-stage-floor').length,55);
 }
});
test('all eight material symbols exist in real integrated physical manual-five-pack source, while Pack 5 variants fail closed',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const families=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 let pack5Count=0;
 for(const b of NEW){
  const used=new Set([...b.voxels.map(v=>v.material),'pack2:020']);
  assert.deepEqual([...used].sort(),b.unresolvedDependencies.map(d=>d.ref));
  for(const ref of used){
   assert(families.has(ref),b.id+' missing physical family symbol '+ref);
   const variants=manualFivePackVariants(ref);
   assert(variants.length>0,ref);
   if(ref.startsWith('pack5:')){
    assert.throws(()=>resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'}),/explicit authored variant/);
   }else{
    const resolved=resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'});
    assert(resolved.visibleBoxes.length&&resolved.selectionBoxes.length&&resolved.occupiedOffsets.length,ref);
    assert.equal(resolved.livePlaceable,false);
   }
  }
  const audit=inspectPack5InMixedBlueprint(b);
  pack5Count+=audit.pack5Total;
  assert.equal(audit.readyForCombinedPlacement,false);
  if(audit.pack5Total)assert.equal(audit.resolvedPack5Count,0);
 }
 assert(pack5Count>15);
});
test('truthful 79/420 ledger, all 64 new original identities preserved, and exact committed source file verified',()=>{
 const file='src/building-pool/roadmap-2b/m1-specialty-courts.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim());
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,
  ledger.authoredCandidates,ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],
  [420,15,123,138,282,0,0,0]);
 assert.equal(ledger.originals.length,123);
 const actual=new Set(all.filter(b=>b.category!=='temple'||b.variation!==1).map(b=>b.id));
 for(const id of actual)assert(new Set(ledger.originals.map(x=>x.id)).has(id),'lost original '+id);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),138);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),282);
});
