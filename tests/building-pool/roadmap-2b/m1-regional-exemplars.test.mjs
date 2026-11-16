import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {M1_REGIONAL_EXEMPLARS as REGIONAL} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots,BIOMES,SIZES} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,manualFivePackVariants} from '../../../src/builder-assets/manual-five-pack.mjs';

const prev=[MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS];
const authored=[...LEGACY_TEMPLES,...prev,...REGIONAL];
const k=(x,y,z)=>x+','+y+','+z;
const index=b=>new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));
const stand=(b,m,x,z,blocked=new Set())=>
  x>=0&&x<b.extents.x&&z>=0&&z<b.extents.z &&
  m.get(k(x,1,z))?.kind==='floor' &&
  !blocked.has(x+','+z)&&[2,3,4].every(y=>!m.has(k(x,y,z)));
function reach(b,blocked=new Set()){
 const m=index(b),entrance=b.openings.find(o=>o.type==='entrance');
 const todo=[[entrance.x,entrance.z]],seen=new Set();
 for(let i=0;i<todo.length;i++){
  const [x,z]=todo[i],loc=x+','+z;
  if(seen.has(loc)||!stand(b,m,x,z,blocked))continue;
  seen.add(loc);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])todo.push([x+dx,z+dz]);
 }
 return seen;
}

test('twelve additional 2B-only original regional coordinate designs occupy reserved biome/size slots',()=>{
 assert.equal(REGIONAL.length,12);
 assert.equal(new Set(REGIONAL.map(b=>b.id)).size,12);
 const categories=REGIONAL.reduce((m,b)=>(m[b.category]=(m[b.category]||0)+1,m),{});
 assert.deepEqual(categories,{
  'market-square':2,tailor:2,butcher:2,jeweler:2,bookshop:2,theater:2
 });
 const biomes=REGIONAL.reduce((m,b)=>(m[b.biome]=(m[b.biome]||0)+1,m),{});
 assert.deepEqual(biomes,{desert:3,snow:3,'enchanted-forest':3,mountain:3});
 for(const b of REGIONAL){
  assert.equal(b.variation,1);
  assert.notEqual(b.biome,'temperate');
  assert(['medium','large'].includes(b.size));
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  assert(plannedSlots().some(p=>p.id===b.id),b.id+' not a reserved building');
  assert(validateBlueprint(b).valid,b.id);
  assert(b.voxels.length>500,b.id+' missing physical massing');
 }
});

test('no duplicate IDs or exact mirrored/translated/rotated structural copies among all 33 authored candidates',()=>{
 assert.equal(authored.length,33);
 assert.equal(new Set(authored.map(b=>b.id)).size,33);
 assert.deepEqual(assertDistinctArchitecture(authored),{authored:33,distinctArchitectures:33});
});

test('every new source actually specifies 3D supported floor, wall/roof, window materials and vacant three-high ports',()=>{
 for(const b of REGIONAL){
  const m=index(b);
  assert.equal(m.size,b.voxels.length,b.id+' overlapping voxels');
  const outer=b.extents;
  for(let x=0;x<outer.x;x++)for(let z=0;z<outer.z;z++){
   assert.equal(m.get(k(x,0,z))?.kind,'foundation',b.id+' missing footing');
   assert.equal(m.get(k(x,1,z))?.kind,'floor',b.id+' missing ground support');
  }
  const windows=b.voxels.filter(v=>v.kind==='window');
  assert(windows.length>=6,b.id+' almost no glazing');
  const portMap=b.openings.filter(o=>o.type==='window');
  assert.equal(windows.length,portMap.length,b.id+' window registry mismatch');
  for(const o of portMap)assert.equal(m.get(k(o.x,o.y,o.z))?.material,o.material,b.id+' window material mismatch');
  for(const d of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway'))
   for(let y=d.y;y<d.y+d.clearHeightCells;y++)
    assert(!m.has(k(d.x,y,d.z)),b.id+' false three-cell-clear port '+JSON.stringify(d));
 }
});

test('all independent public, commercial, workshop and backstage conceptual routes are physically traversable with three-high clearance',()=>{
 for(const b of REGIONAL){
  const visited=reach(b),m=index(b);
  assert(b.routeTargets.length>=3,b.id);
  for(const target of b.routeTargets){
   assert(stand(b,m,target.x,target.z),b.id+' occupied route target '+target.name);
   assert(visited.has(target.x+','+target.z),b.id+' inaccessible target '+target.name);
  }
  const center=b.openings.find(o=>o.type==='entrance');
  assert(visited.has(center.x+','+center.z),b.id+' entry is blocked');
 }
});

test('snow and desert market booths retain true corner posts and separate canopies, never stall-title placeholders',()=>{
 for(const b of REGIONAL.filter(x=>x.category==='market-square')){
  const m=index(b);
  const posts=b.voxels.filter(v=>v.role==='kiosk-support');
  const roofs=b.voxels.filter(v=>v.role==='trade-canopy');
  const stalls=b.routeTargets.filter(t=>t.name.includes('-row-'));
  const expected=b.biome==='snow'?6:4;
  assert.equal(stalls.length,expected);
  assert.equal(posts.length,expected*4*4);
  assert.equal(roofs.length,expected*5*5);
  for(const target of stalls){
   const x0=target.x-2,z0=target.z-1;
   for(const x of [x0,x0+4])for(const z of [z0,z0+4])
    for(let y=0;y<=6;y++)assert(m.has(k(x,y,z)),b.id+' disconnected kiosk post at '+k(x,y,z));
   for(let x=x0;x<=x0+4;x++)for(let z=z0;z<=z0+4;z++)
    assert.equal(m.get(k(x,6,z))?.kind,'roof',b.id+' canopy gap');
  }
  assert(!m.has(k(Math.floor(b.extents.x/2),6,Math.floor(b.extents.z/2))),
   b.id+' open-air public court roofed over');
 }
});

test('commercial regional store rooms are sealable; jeweled vault requires the interior-only transfer',()=>{
 for(const b of REGIONAL.filter(x=>['tailor','butcher','jeweler','bookshop'].includes(x.category))){
  const doors=b.openings.filter(o=>o.type==='internal-doorway');
  assert(doors.length>=2,b.id+' lacks separated work and retail');
  const blocked=new Set([doors[0].x+','+doors[0].z]);
  assert(!reach(b,blocked).has(b.routeTargets[1].x+','+b.routeTargets[1].z),
   b.id+' rear left room bypasses closed service portal');
  if(b.category==='jeweler'){
   const vault=b.routeTargets.find(x=>x.name==='vault');
   assert(vault,b.id+' no secure vault');
   const sealed=new Set([doors[1].x+','+doors[1].z]);
   assert(!reach(b,sealed).has(vault.x+','+vault.z),b.id+' bypasses locked vault screen');
  }
  if(b.size==='large'){
   const ann=b.routeTargets.find(x=>x.name==='rear-annex');
   assert(ann,'large house missing a genuinely distinct rear annex');
   assert(b.rooms.length===4);
   const annDoor=doors.find(x=>x.x===4&&x.z===b.extents.z-6);
   assert(annDoor,b.id+' annex door is not physical');
   assert(!reach(b,new Set([annDoor.x+','+annDoor.z])).has(ann.x+','+ann.z),b.id+' annex bypasses screen');
  }
 }
});

test('regional theaters have full raised platform cells, side paths and supported symbolic stair approach pairs',()=>{
 for(const b of REGIONAL.filter(x=>x.category==='theater')){
  const stage=b.voxels.filter(x=>x.role==='raised-stage-platform');
  const stairs=b.voxels.filter(x=>x.role==='stage-stair-candidate');
  const expected=(b.size==='large'?17:13)*6;
  assert.equal(stage.length,expected,b.id+' stage too small / fake');
  assert.equal(stairs.length,2,b.id+' missing stage approach');
  for(const stair of stairs){
   assert.equal(stair.material,'pack1:008');
   assert.equal(stair.shapeRotationStatus,'unresolved-symbolic');
   assert.equal(stair.lowerLanding.y,1);
   assert.equal(stair.upperLanding.y,2);
   assert(b.voxels.some(v=>v.x===stair.upperLanding.x&&v.z===stair.upperLanding.z&&v.y===2&&v.role==='raised-stage-platform'));
  }
  const backstage=b.openings.filter(o=>o.type==='internal-doorway');
  assert.equal(backstage.length,2);
  const seal=new Set(backstage.map(d=>d.x+','+d.z));
  const room=b.routeTargets.find(r=>r.name.startsWith('western-backstage'));
  assert(!reach(b,seal).has(room.x+','+room.z),b.id+' backstage accessible with both doors sealed');
 }
});

test('all 12 new concepts use actually integrated manual family symbols but never claim game-runtime registration',()=>{
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.numericVariants,106);
 const familySet=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
 for(const b of REGIONAL){
  const used=new Set(b.voxels.map(v=>v.material));
  used.add('pack2:020');
  const deps=new Set(b.unresolvedDependencies.map(x=>x.ref));
  assert.deepEqual([...deps].sort(),[...used].sort(),b.id+' incomplete typed dependency ledger');
  for(const sym of used){
   assert(familySet.has(sym),b.id+' unintegrated manual-family reference '+sym);
   assert(manualFivePackVariants(sym).length>0,b.id+' missing physical candidate variant '+sym);
  }
  assert(b.unresolvedDependencies.every(x=>/true AABB|physical variant/.test(x.issue)));
  assert(!b.worldPlaced&&!b.numericIdsAssigned,b.id);
 }
});

test('committed exact PR-head native source and authored ledger match the checked-out blob, not a test facade',()=>{
 const paths=[
  'src/building-pool/roadmap-2b/m1-regional-exemplars.mjs',
  'tests/building-pool/roadmap-2b/m1-regional-exemplars.test.mjs',
  'src/building-pool/roadmap-2b/m1-authoring-ledger.json'
 ];
 for(const path of paths){
  const committed=execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim();
  const current=execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();
  assert.equal(committed,current,path+' differs from exact committed HEAD');
 }
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.authoredCandidates,ledger.sourceExactInheritedTemples,
  ledger.originalNewModels,ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame],
  [420,84,15,69,336,0,0]);
 const slotSet=new Set(authored.map(x=>x.id));
 assert([...prev,...REGIONAL].every(x=>ledger.originals.some(row=>row.id===x.id)),
  'previous 18 original design identities lost after six new public candidates');
 assert.equal(ledger.originals.length,69);
 assert([...prev,...REGIONAL].every(x=>slotSet.has(x.id)));
 assert.equal(ledger.placedInWorld,0);
});
