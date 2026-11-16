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


test('seven independently reserved source-coordinate architectures expand exactly 101 to 108 with no lost original bodies',()=>{
 assert.deepEqual(NEW.map(x=>x.id),["r2:market-square:snow:medium:02","r2:market-square:enchanted-forest:small:02","r2:bookshop:mountain:medium:02","r2:bookshop:snow:small:02","r2:butcher:desert:small:02","r2:tailor:temperate:large:02","r2:jeweler:snow:small:02"]);
 assert.deepEqual(NEW.map(x=>x.voxels.length),[4671,3172,4439,3542,3392,6864,2779]);
 const roster=new Set(plannedSlots().map(x=>x.id)),older=new Set([...history,...M1_FIVE_COURTS,...PRIOR].map(x=>x.id));
 assert.equal(older.size,101,'prior accepted source count unexpectedly changed');
 for(const b of NEW){
  assert(roster.has(b.id),b.id+' outside reserved category/biome/size manifest');
  assert(!older.has(b.id),b.id+' new source overwrites earlier architecture');
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert.equal(b.status,'authored-candidate');assert(b.isolated&&!b.worldPlaced&&!b.numericIdsAssigned);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:108,distinctArchitectures:108});
});
test('each seven building outline has real deleted voids, occupied floor parity and honest inward/outer perimeter walls',()=>{
 const absent=[363,231,525,202,200,480,315];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],c=occupancy(b);
  assert.equal(b.deliberatelyAbsentFootprintCells,absent[i],b.id+' irregular physical plan missing count');
  assert(b.footprintRectangles.length>=4,b.id+' disguised generic rectangle');
  let inward=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const foundation=c.get(key(x,0,z)),floor=c.get(key(x,1,z));
   assert.equal(!!foundation,!!floor,b.id+' unsupported or omitted walking surface');
   if(!foundation){for(let y=2;y<b.extents.y;y++)assert(!c.has(key(x,y,z)),b.id+' ghost roof mass in actual courtyard');continue;}
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!c.has(key(x+dx,0,z+dz)))){
    assert.equal(c.get(key(x,6,z))?.kind,'wall',b.id+' missing real inward or outer weather boundary');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inward++;
   }
  }
  assert(inward>=12,b.id+' lacks source-defined inner courtyard or reentrant perimeter walls');
 }
});
test('no phantom doors: every window has a source voxel and every public/private port has three real empty air cells',()=>{
 for(const b of NEW){
  const c=occupancy(b);
  const windows=b.openings.filter(o=>o.type==='window');
  assert(windows.length>=12,b.id+' not enough actual exterior windows');
  for(const o of windows)assert.equal(c.get(key(o.x,o.y,o.z))?.material,o.material);
  const ports=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  assert(ports.length>=4,b.id+' room gates are merely strings');
  for(const o of ports){
   assert.equal(o.clearHeightCells,3,b.id);
   for(let y=o.y;y<o.y+3;y++)assert(!c.has(key(o.x,y,o.z)),b.id+' blocked door '+o.x+','+y+','+o.z);
   assert.equal(c.get(key(o.x,1,o.z))?.kind,'floor',b.id+' ungrounded walking door');
  }
 }
});
test('each physical target in public and back-of-house architecture is genuinely reachable from front of actual floor grid',()=>{
 for(const b of NEW){
  assert(b.rooms.length>=4&&b.routeTargets.length>=4);
  const reached=walk(b);
  for(const t of b.routeTargets)assert(reached.has(t.x+','+t.z),b.id+' unreachable real target '+t.name);
 }
});
test('closing all authored room doors physically seals each private destination with no diagonal, void, or exterior bypass',()=>{
 for(const b of NEW){
  const closed=walk(b,b.openings.filter(o=>o.type==='internal-doorway').map(o=>[o.x,o.z]));
  assert(!closed.has(b.routeTargets.at(-1).x+','+b.routeTargets.at(-1).z),b.id+' rear room bypass');
  for(const t of b.routeTargets.slice(1))assert(!closed.has(t.x+','+t.z),b.id+' private room access bypass '+t.name);
 }
});
test('supported biome-specific three-level roof profiles are genuine y8, y9, y10 physical occupied cells, not color-only flat planes',()=>{
 const expectedHigh=[569,341,569,430,265,1011,212];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],c=occupancy(b);
  const raised=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert.equal(raised.length,expectedHigh[i],b.id+' missing authored ridge volume');
  const levels=new Set(raised.map(v=>v.y));
  assert.deepEqual([...levels].sort((a,b)=>a-b),[8,9,10],b.id+' missing physical ridge height');
  assert(new Set(raised.map(v=>v.role)).size>=7,b.id+' one generic shell rather than bespoke regions');
  for(const v of raised){
   assert(c.has(key(v.x,v.y-1,v.z)),b.id+' suspended canopy '+v.role);
   assert(c.has(key(v.x,0,v.z)),b.id+' canopy above deleted center ground');
  }
 }
});
test('genuine central snow and enchanted markets have no fake hidden courtyard foundation or floating ridge',()=>{
 for(const b of NEW.filter(x=>x.category==='market-square')){
  const c=occupancy(b),x=b.biome==='snow'?18:14,z=b.biome==='snow'?21:16;
  for(let y=0;y<b.extents.y;y++)assert(!c.has(key(x,y,z)),b.id+' invalidly filled real central open-air market courtyard');
 }
});
test('eight-way normalized same-category/size occupied-cell IoU is strictly below 0.85 for each truly original new building',()=>{
 for(const b of NEW){
  let highest=0;
  for(const prior of all)if(prior!==b&&prior.category===b.category&&prior.size===b.size)
   highest=Math.max(highest,closest(b,prior));
  assert(highest<0.85,b.id+' near-duplicate full 3D D4 occupied-cell IoU '+highest);
 }
});
test('all actual voxel materials and ports have source-backed physical Pack1–5 candidate symbols and honest unresolved production ABI',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),used=new Set();
 for(const b of NEW){
  const deps=new Set(b.unresolvedDependencies.map(x=>x.ref));
  for(const v of b.voxels){
   assert(allowed.has(v.material),b.id+' fabricated Pack family '+v.material);
   assert(deps.has(v.material),b.id+' incomplete material manifest '+v.material);
   used.add(v.material.split(':')[0]);
  }
  for(const o of b.openings)if(o.doorSymbol)assert(deps.has(o.doorSymbol),b.id+' door family absent from dependencies');
  for(const dep of b.unresolvedDependencies){
   assert(manualFivePackVariants(dep.ref).length>0,dep.ref+' no actual producer candidate');
   assert(/unresolved/.test(dep.issue),dep.ref+' incorrectly marked live-compatible');
  }
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' false integration approval');
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(used.has(p),'source manifest omits actual '+p);
});
test('exact committed source parity, seven newly declared IDs and honest 108/420 registry: zero placement, zero approval, zero registration',()=>{
 for(const file of ['m1-northern-arcades.mjs','m1-regional-guildwings.mjs']){
  const path='src/building-pool/roadmap-2b/'+file;
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
   execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path+' not authentic exact Git commit blob');
 }
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,93,108,312,0,0,0]);
 assert.equal(l.originals.length,93);
 assert.deepEqual(new Set(l.originals.map(x=>x.id)),
  new Set(all.filter(b=>b.category!=='temple'||b.variation!==1).map(b=>b.id)));
 for(const b of NEW){
  const path='src/building-pool/roadmap-2b/'+(b.category==='market-square'||b.category==='bookshop'?'m1-northern-arcades.mjs':'m1-regional-guildwings.mjs');
  assert.equal(l.originals.find(row=>row.id===b.id)?.file,path,b.id+' wrong actual file in ledger');
 }
 assert.equal(Object.values(l.byCategory).reduce((a,b)=>a+b.authored,0),108);
 assert.equal(Object.values(l.byCategory).reduce((a,b)=>a+b.remaining,0),312);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,b)=>n+b.small+b.medium+b.large,0),108);
});
