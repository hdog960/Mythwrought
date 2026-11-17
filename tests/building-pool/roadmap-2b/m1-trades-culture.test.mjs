import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {TRADE_CULTURE_M1_EXEMPLARS as examples} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL as market} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
const categories=['tailor','butcher','jeweler','bookshop','theater'];
const byCat=Object.fromEntries(examples.map(m=>[m.category,m]));
const point=(v)=>v.x+','+v.y+','+v.z;
function buildIndex(b){return new Map(b.voxels.map(v=>[point(v),v]));}
function canStand(b,vox,x,z,blocked=new Set()){
 if(x<0||x>=b.extents.x||z<0||z>=b.extents.z)return false;
 if(blocked.has(x+','+z))return false;
 if(vox.get(x+',1,'+z)?.kind!=='floor')return false;
 return [2,3,4].every(y=>!vox.has(x+','+y+','+z));
}
function reach(b,blocked=new Set()){
 const vox=buildIndex(b),entry=b.openings.find(o=>o.type==='entrance');
 const seen=new Set(),queue=[[entry.x,entry.z]];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],p=x+','+z;
  if(seen.has(p)||!canStand(b,vox,x,z,blocked))continue;
  seen.add(p);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
test('M1 exactly five new original coordinate-authored categories, with no sibling candidate identities',()=>{
 assert.equal(examples.length,5);
 assert.deepEqual(examples.map(b=>b.category),categories);
 assert.equal(new Set(examples.map(b=>b.id)).size,5);
 for(const bp of examples){
  assert.equal(bp.id,'r2:'+bp.category+':temperate:small:01');
  assert(plannedSlots().some(s=>s.id===bp.id));
  assert.equal(bp.status,'authored-candidate');
  assert.equal(bp.worldPlaced,false);
  assert.equal(bp.numericIdsAssigned,false);
  assert(bp.voxels.length>650,bp.id);
  assert.equal(validateBlueprint(bp).uniqueCells,bp.voxels.length);
  assert(bp.rooms.length>=3,bp.id);
  assert(bp.openings.some(o=>o.type==='window'));
  assert(bp.voxels.some(v=>v.kind==='decor'),bp.id);
 }
 assert.deepEqual(assertDistinctArchitecture([...LEGACY_TEMPLES,market,...examples]),{authored:21,distinctArchitectures:21});
});
test('every new authored model has supported floors, roof, side walls, explicit glazing and structural post occupancy',()=>{
 for(const bp of examples){
  const vox=buildIndex(bp);
  assert.equal(vox.size,bp.voxels.length,bp.id);
  for(let x=0;x<bp.extents.x;x++)for(let z=0;z<bp.extents.z;z++){
   assert.equal(vox.get(x+',0,'+z)?.kind,'foundation',bp.id+' foundation hole');
   assert.equal(vox.get(x+',1,'+z)?.kind,'floor',bp.id+' unsupported floor');
   assert.equal(vox.get(x+',7,'+z)?.kind,'roof',bp.id+' roof hole');
  }
  const windows=bp.voxels.filter(v=>v.kind==='window');
  const records=bp.openings.filter(o=>o.type==='window');
  assert.equal(windows.length,records.length,bp.id+' unmatched glass/frame');
  for(const o of records)assert.equal(vox.get(point(o))?.material,o.material);
  for(const e of bp.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway'))
   for(let y=e.y;y<e.y+e.clearHeightCells;y++)
    assert(!vox.has(e.x+','+y+','+e.z),bp.id+' blocked physical door');
 }
});
test('every modeled advertised room target truly reachable via independent three-high voxel clearance',()=>{
 for(const b of examples){
  const visited=reach(b),vox=buildIndex(b);
  assert(b.routeTargets.length>=3,b.id);
  for(const p of b.routeTargets){
   assert(canStand(b,vox,p.x,p.z),b.id+' occupied approach '+p.name);
   assert(visited.has(p.x+','+p.z),b.id+' unreachable '+p.name);
  }
 }
});
test('tailor fitting room is enclosed except its one declared physical screen door',()=>{
 const b=byCat.tailor;
 const seen=reach(b,new Set(['13,7']));
 assert(!seen.has('15,7'),'screened fitting room has an unplanned bypass');
 const used=reach(b);
 assert(used.has('15,7'));
});
test('jeweler actual vault is not accessible when the single internal screen is sealed',()=>{
 const b=byCat.jeweler,entry=reach(b),closed=reach(b,new Set(['10,14']));
 assert(entry.has('13,14'),'strongroom missing entrance');
 assert(!closed.has('13,14'),'strongroom bypasses controlled internal door');
});
test('bookshop reading annex has an isolated approach, real stocked backroom and no bypass',()=>{
 const b=byCat.bookshop;
 assert(reach(b).has('15,8'));
 assert(!reach(b,new Set(['13,8'])).has('15,8'),'reading annex can bypass screened doorway');
 assert(reach(b).has('9,17'),'book storage unreachable');
});
test('butcher partitions real cold chamber from prep and supplies distinct fixtures',()=>{
 const b=byCat.butcher;
 const cells=buildIndex(b);
 assert(reach(b).has('5,12'));
 assert(reach(b).has('15,12'));
 assert.equal(cells.get('3,2,12')?.role,'insulated-cold-stock');
 assert.equal(cells.get('13,2,12')?.role,'butcher-preparation-table');
 assert.equal(cells.get('10,2,14'),undefined,'rear lateral doorway blocked');
});
test('theater has raised coordinate-authored 13x6 stage, two stair intents and clear backstage aisles',()=>{
 const b=byCat.theater,vox=buildIndex(b);
 const stage=b.voxels.filter(v=>v.role==='raised-stage-platform');
 assert.equal(stage.length,13*6);
 for(let x=7;x<=19;x++)for(let z=13;z<=18;z++)
   assert.equal(vox.get(x+',2,'+z)?.role,'raised-stage-platform');
 assert.equal(b.voxels.filter(v=>v.role==='symbolic-stage-step').length,2);
 for(const x of [5,21]){
  assert(reach(b).has(x+',16'),'side promenade blocked');
  assert(reach(b).has(x+',21'),'backstage door blocked');
 }
 assert(!reach(b,new Set(['5,19','21,19'])).has('5,21'),
   'backstage should be enclosed when both physical doors are sealed');
 assert(b.unresolvedDependencies.some(d=>d.ref==='pack1:008'), 'stage stair ABI not surfaced');
});
test('dependency ledger discloses every used construction symbol, including original door, without claiming runtime IDs',()=>{
 for(const bp of examples){
  const used=new Set(bp.voxels.map(v=>v.material));used.add('pack2:020');
  const declared=new Set(bp.unresolvedDependencies.map(d=>d.ref));
  assert.deepEqual([...declared].sort(),[...used].sort());
  assert(bp.unresolvedDependencies.every(d=>/schema-1/.test(d.issue)));
 }
});
test('exact Git blob at HEAD for new original candidate source, actual Node module and tests',()=>{
 const paths=[
  'src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs',
  'tests/building-pool/roadmap-2b/m1-trades-culture.test.mjs'
 ];
 for(const p of paths){
  const commit=execFileSync('git',['rev-parse','HEAD:'+p],{encoding:'utf8'}).trim();
  const disk=execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
  assert.equal(commit,disk,p+' is not the exact checked-out PR-head source');
 }
 assert.equal(examples.length,5);
});

test('earlier six original candidates remain source-exact within the cumulative 79/420 ledger',()=>{
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 const baseline=[market,...examples];
 const all=new Set(ledger.originals.map(o=>o.id));
 assert.equal(baseline.length,6,'original M1 six-candidate checkpoint changed');
 assert.equal(new Set([...LEGACY_TEMPLES,...baseline].map(x=>x.id)).size,21,
  'original 15 temples or six early original identities were mutated');
 for(const model of baseline)assert(all.has(model.id),'lost prior original blueprint '+model.id);
 assert.equal(ledger.sourceExactInheritedTemples,15);
 assert.deepEqual([ledger.target,ledger.originalNewModels,ledger.authoredCandidates,
  ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],
  [420,117,132,288,0,0,0]);
 assert.equal(ledger.originals.length,117);
 assert.equal(Object.values(ledger.byCategory).reduce((a,x)=>a+x.authored,0),132);
 assert.equal(Object.values(ledger.byCategory).reduce((a,x)=>a+x.remaining,0),288);
 assert.equal(Object.values(ledger.byCategory).reduce((a,x)=>a+x.target,0),420);
 assert(ledger.biomeSizeDistribution.temperate.small>=7);
 assert.equal(ledger.productionRegistryUnchanged,true);
});
