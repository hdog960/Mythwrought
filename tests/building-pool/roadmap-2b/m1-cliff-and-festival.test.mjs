import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_CLIFF_AND_FESTIVAL as NEW} from '../../../src/building-pool/roadmap-2b/m1-cliff-and-festival.mjs';
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

const all=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,
 ...TRADE_CULTURE_M1_EXEMPLARS,...M1_REGIONAL_EXEMPLARS,
 ...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,...NEW];
const byId=new Map(NEW.map(b=>[b.id,b]));
const key=(x,y,z)=>x+','+y+','+z;
const voxels=b=>new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
function flood(b,blocked=[]){
 const m=voxels(b),entry=b.openings.find(o=>o.type==='entrance'),
  q=[[entry.x,entry.z]],seen=new Set(),excluded=new Set(blocked.map(([x,z])=>x+','+z));
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i],k=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(k)||excluded.has(k))continue;
  if(m.get(key(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>m.has(key(x,y,z))))continue;
  seen.add(k);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
 }
 return seen;
}
test('eight truly authored formerly vacant slots and full 79/79 source D4 architecture uniqueness',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
 'r2:market-square:mountain:small:02','r2:tailor:mountain:small:01',
 'r2:butcher:mountain:small:01','r2:jeweler:mountain:small:01',
 'r2:bookshop:mountain:small:01','r2:theater:mountain:small:01',
 'r2:market-square:enchanted-forest:medium:01','r2:theater:snow:medium:01']);
 const reservation=new Set(plannedSlots().map(s=>s.id));
 for(const b of NEW){
  assert(reservation.has(b.id),'unreserved '+b.id);
  assert(b.voxels.length>=1800,b.id+' title-only candidate');
  assert.equal(validateBlueprint(b).valid,true);
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:79,distinctArchitectures:79});
});
test('all 24 actual functional interior spaces have unique names and supported nonempty coordinate bounds',()=>{
 for(const bp of NEW){
  const names=new Set();
  for(const room of bp.rooms){
   assert(typeof room.name==='string'&&room.name.length>=12,bp.id+' unnamed room');
   assert(!names.has(room.name),bp.id+' repeated room name');
   names.add(room.name);
   const b=room.bounds;
   assert(b&&Number.isInteger(b.x0)&&Number.isInteger(b.x1)&&Number.isInteger(b.z0)&&Number.isInteger(b.z1),bp.id+' unbounded room');
   assert(b.x0>=0&&b.x1<bp.extents.x&&b.x0<b.x1&&b.z0>=0&&b.z1<bp.extents.z&&b.z0<b.z1,bp.id+' invalid actual room extents');
  }
 }
 assert.equal(NEW.reduce((n,b)=>n+b.rooms.length,0),24);
});
test('full source physical foundations/floors, windows, weather roof, fixtures, décor and actual 3-high air doors',()=>{
 for(const b of NEW){
  const m=voxels(b);assert.equal(m.size,b.voxels.length);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   assert.equal(m.get(key(x,0,z))?.kind,'foundation',b.id+' unsupported footing');
   assert.equal(m.get(key(x,1,z))?.kind,'floor',b.id+' disconnected walking slab');
  }
  const real=b.voxels.filter(v=>v.kind==='window'),decl=b.openings.filter(v=>v.type==='window');
  assert(real.length>=8);assert.equal(real.length,decl.length,b.id);
  for(const w of decl)assert.equal(m.get(key(w.x,w.y,w.z))?.material,w.material);
  for(const o of b.openings.filter(v=>v.type==='entrance'||v.type==='internal-doorway')){
   assert.equal(o.clearHeightCells,3);
   for(let y=o.y;y<o.y+3;y++)assert(!m.has(key(o.x,y,o.z)),b.id+' blocked 3-high port');
  }
  for(const kind of ['wall','roof','fixture','decor'])assert(b.voxels.some(v=>v.kind===kind),b.id+' missing '+kind);
 }
});
test('all named interior/private, vendor, public and backstage walking destinations have real unobstructed entry paths',()=>{
 for(const b of NEW){
  const walk=flood(b);
  assert(b.routeTargets.length>=3);
  for(const t of b.routeTargets)
   assert(walk.has(t.x+','+t.z),b.id+' unreachable '+t.name);
 }
});
test('mountain tailor salon and loom shop, stonechill cold/provisions, strongbox and cliff reader have secure, non-bypassable real doors',()=>{
 const checks=[
  ['r2:tailor:mountain:small:01',[[8,11]],['private fitting']],
  ['r2:tailor:mountain:small:01',[[11,20]],['rear looms']],
  ['r2:butcher:mountain:small:01',[[5,10],[12,17]],['cold stores']],
  ['r2:butcher:mountain:small:01',[[19,10],[12,17]],['butcher studio']],
  ['r2:jeweler:mountain:small:01',[[6,12]],['workroom']],
  ['r2:jeweler:mountain:small:01',[[15,20]],['east strongbox']],
  ['r2:bookshop:mountain:small:01',[[17,12]],['reading tower']],
  ['r2:bookshop:mountain:small:01',[[12,22]],['rear archive']],
  ['r2:theater:mountain:small:01',[[5,27],[23,27]],['west dressing','east dressing']],
  ['r2:theater:snow:medium:01',[[6,29],[26,29]],['backstage west','backstage east']]
 ];
 for(const [id,blocked,names] of checks){
  const b=byId.get(id),open=flood(b),closed=flood(b,blocked);
  for(const name of names){
   const t=b.routeTargets.find(t=>t.name===name);assert(t,id+' missing '+name);
   const at=t.x+','+t.z;
   assert(open.has(at),id+' physically unwalkable before gate close');
   assert(!closed.has(at),id+' undisclosed bypass to '+name);
  }
 }
});
test('four mountain vendor roofs and six woodland festival roofs have actual separate canopies on grounded posts',()=>{
 for(const [id,count] of [
  ['r2:market-square:mountain:small:02',4],
  ['r2:market-square:enchanted-forest:medium:01',6]]){
  const b=byId.get(id),m=voxels(b);
  const stalls=b.routeTargets.filter(t=>!['central crossing','main festival crossing','north dance'].includes(t.name));
  assert.equal(stalls.length,count,id+' unexpected vendor count');
  for(const t of stalls){
   const x=t.x-2,z=t.z-1;
   for(const xx of [x,x+4])for(const zz of [z,z+4])
    for(let y=0;y<=6;y++)assert(m.has(key(xx,y,zz)),id+' canopy lacks post');
   for(let xx=x;xx<=x+4;xx++)for(let zz=z;zz<=z+4;zz++)
    assert.equal(m.get(key(xx,6,zz))?.kind,'roof',id+' missing seller cover');
  }
 }
});
test('woodland high festival arch has two continuous foundation-connected bearing posts',()=>{
 const b=byId.get('r2:market-square:enchanted-forest:medium:01'),m=voxels(b);
 for(const x of [14,22])for(let y=0;y<=8;y++)
  assert(m.has(key(x,y,27)),b.id+' unsupported upper festival arch '+x+','+y+',27');
 for(let x=14;x<=22;x++)
  assert.equal(m.get(key(x,8,27))?.role,'high-festival-bough');
});
test('true skylights and tiered roofs have physical empty sky/ground-to-height support at the documented sections',()=>{
 for(const id of ['r2:tailor:mountain:small:01','r2:butcher:mountain:small:01',
  'r2:jeweler:mountain:small:01','r2:theater:mountain:small:01']){
  const b=byId.get(id),m=voxels(b);
  assert(b.intentionallyOpenRoof.length>0,id+' missing true sky opening');
  for(const o of b.intentionallyOpenRoof)for(let x=o.x0;x<=o.x1;x++)
   for(let z=o.z0;z<=o.z1;z++)
    assert(!m.has(key(x,7,z)),id+' falsely advertised open sky');
 }
 const a=byId.get('r2:butcher:mountain:small:01'),va=voxels(a);
 for(let y=0;y<=11;y++)assert(va.has(key(21,y,20)),'stone extraction chimney floats');
 for(const id of ['r2:theater:mountain:small:01','r2:theater:snow:medium:01']){
  const b=byId.get(id),m=voxels(b);
  for(const t of b.symbolicStairApproaches){
   assert.equal(t.shapeRotationStatus,'unresolved-symbolic');
   assert.equal(m.get(key(t.x,t.y,t.z))?.material,'pack1:008');
  }
  const cols=id.includes(':mountain:')?[[8,20],[8,25],[20,20],[20,25]]:[[9,20],[9,26],[23,20],[23,26]];
  for(const [x,z] of cols)for(let y=0;y<=8;y++)assert(m.has(key(x,y,z)),id+' raised stage roof post disconnected');
 }
});
test('no invented real-world build ABI: every source family is from the physical manual producer and Pack5 remains unresolved',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const known=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),examined=new Set();
 let count=0;
 for(const b of NEW){
  const symbols=new Set([...b.voxels.map(v=>v.material),'pack2:020']);
  assert.deepEqual([...symbols].sort(),b.unresolvedDependencies.map(v=>v.ref));
  for(const symbol of symbols){
   assert(known.has(symbol),b.id+' invented unregistered producer '+symbol);
   const variants=manualFivePackVariants(symbol);
   assert(variants.length>0,symbol+' no source variant candidates');
   if(examined.has(symbol))continue;
   if(symbol.startsWith('pack5:'))
    assert.throws(()=>resolveManualFivePackAsset(symbol,{numericId:variants[0].numericId,orientation:'north'}),/explicit authored variant/);
   else{
    const asset=resolveManualFivePackAsset(symbol,{numericId:variants[0].numericId,orientation:'north'});
    assert(asset.visibleBoxes.length&&asset.selectionBoxes.length&&asset.occupiedOffsets.length);
    assert.equal(asset.livePlaceable,false);
    assert.equal(asset.saveWritten,false);
   }
   examined.add(symbol);
  }
  const audit=inspectPack5InMixedBlueprint(b);
  assert.equal(audit.readyForCombinedPlacement,false);
  count+=audit.pack5Total;
  if(audit.pack5Total)assert.equal(audit.resolvedPack5Count,0);
 }
 assert(count>=15);
});
test('current exact PR source Git blob, 79/420 ledger and all original 64 source identities are real without approval inflation',()=>{
 const file='src/building-pool/roadmap-2b/m1-cliff-and-festival.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim());
 const j=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([j.target,j.sourceExactInheritedTemples,j.originalNewModels,j.authoredCandidates,
  j.remainingUnauthored,j.creatorAccepted,j.integratedInGame,j.placedInWorld],[420,15,86,101,319,0,0,0]);
 assert.equal(j.originals.length,86);
 const current=new Set(j.originals.map(v=>v.id));
 for(const b of all.filter(b=>b.category!=='temple'||b.variation!==1))
  assert(current.has(b.id),'lost inherited authoring '+b.id);
 assert.equal(Object.values(j.byCategory).reduce((n,v)=>n+v.authored,0),101);
 assert.equal(Object.values(j.byCategory).reduce((n,v)=>n+v.remaining,0),319);
});
