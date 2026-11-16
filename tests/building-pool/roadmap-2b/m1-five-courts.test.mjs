import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_FIVE_COURTS as NEW} from '../../../src/building-pool/roadmap-2b/m1-five-courts.mjs';
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
const history=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,
 ...M1_CLIFF_AND_FESTIVAL,...M1_CONCAVE_COURTS,...M1_SCULPTED_REGIONAL];
const all=[...history,...NEW],key=(x,y,z)=>x+','+y+','+z;
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
test('five previously vacant IDs are actual source authored, and all 95 architectures survive full D4 uniqueness',()=>{
 assert.deepEqual(NEW.map(x=>x.id),[
 'r2:market-square:desert:large:02','r2:tailor:mountain:medium:02',
 'r2:butcher:snow:medium:02','r2:bookshop:desert:medium:02',
 'r2:theater:temperate:large:02']);
 const reserved=new Set(plannedSlots().map(x=>x.id)),prior=new Set(history.map(x=>x.id));
 for(const b of NEW){assert(reserved.has(b.id)&&!prior.has(b.id));assert.equal(validateBlueprint(b).valid,true);
  assert(b.voxels.length>=4000);assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);}
 assert.deepEqual(assertDistinctArchitecture(all),{authored:95,distinctArchitectures:95});
});
test('real missing concave foundations and floors, no phantom elevation or fake outer weather rings',()=>{
 const missing=[378,355,278,160,368];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],c=occupancy(b);assert.equal(b.deliberatelyAbsentFootprintCells,missing[i]);
  assert(b.footprintRectangles.length>=3);
  let inner=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const foundation=c.get(key(x,0,z)),floor=c.get(key(x,1,z));
   assert.equal(!!foundation,!!floor,b.id+' unsupported floor');
   if(!foundation){for(let y=2;y<b.extents.y;y++)assert(!c.has(key(x,y,z)),b.id+' ghost mass');continue;}
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!c.has(key(x+dx,1,z+dz)))){
    assert.equal(c.get(key(x,6,z))?.kind,'wall',b.id+' missing concave exterior');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inner++;
   }
  }
  assert(inner>=10,b.id+' lacks actual inward corner weather boundaries');
 }
});
test('real window geometry, three-high air door clearance, accessible public and back-of-house destinations',()=>{
 for(const b of NEW){
  const c=occupancy(b),w=b.openings.filter(o=>o.type==='window');assert(w.length>=15);
  for(const o of w)assert.equal(c.get(key(o.x,o.y,o.z))?.material,o.material);
  for(const o of b.openings.filter(o=>['entrance','internal-doorway'].includes(o.type)))
   for(let y=o.y;y<o.y+3;y++)assert(!c.has(key(o.x,y,o.z)),b.id+' obstructed gateway');
  assert(b.rooms.length>=4&&b.routeTargets.length>=4);
  const reached=walk(b);for(const p of b.routeTargets)assert(reached.has(p.x+','+p.z),b.id+' blocked '+p.name);
 }
});
test('closed physically authored internal ports isolate genuinely private rooms',()=>{
 const guarded={
 'market-square':['west vendor lane','east weighing','rear accounting'],
 'tailor':['west private fitting','east dye tables','northern loom','west wool annexe'],
 'butcher':['cold larder','clean workspace','rear smokehouse'],
 'bookshop':['west archive','east study','rear documents'],
 'theater':['backstage costumes']};
 for(const b of NEW){
  const closed=walk(b,b.openings.filter(p=>p.type==='internal-doorway').map(p=>[p.x,p.z]));
  for(const name of guarded[b.category]){
   const p=b.routeTargets.find(t=>t.name===name);assert(p);
   assert(!closed.has(p.x+','+p.z),b.id+' private doorway bypass '+name);
  }
 }
});
test('multi-level elevated roof voxel masses are individually supported and rooted in real foundations',()=>{
 for(const b of NEW){
  const c=occupancy(b),roof=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert(roof.length>=60);assert(new Set(roof.map(v=>v.role)).size>=3);
  assert(roof.some(v=>v.y>=9),b.id+' no actual ridge elevation');
  for(const v of roof){assert(c.has(key(v.x,v.y-1,v.z)),b.id+' floating roof '+v.role);
   assert(c.has(key(v.x,0,v.z)),b.id+' ungrounded column');}
 }
});
test('new opera stage includes real raised blocks and continuous grounded load-bearing posts',()=>{
 const b=NEW.find(x=>x.category==='theater'),c=occupancy(b);
 assert.equal(b.voxels.filter(v=>v.role==='raised-original-performance-stage').length,39);
 for(const [x,z]of [[15,29],[31,29],[16,33],[30,33]]){
  for(let y=2;y<=6;y++)assert.equal(c.get(key(x,y,z))?.kind,'wall');
  assert(c.has(key(x,7,z)));
 }
 assert(b.symbolicStairApproaches.every(x=>x.shapeRotationStatus==='unresolved-symbolic'));
});
test('eight-way normalized same-category/size occupied-cell near-duplicate rejection below 0.85',()=>{
 for(const b of NEW){let max=0;
  for(const x of all)if(x!==b&&x.category===b.category&&x.size===b.size)max=Math.max(max,closest(b,x));
  assert(max<0.85,b.id+' source clone similarity '+max);
 }
});
test('only genuine manual Pack1–5 symbols; physical variant and game placement remain blocked',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),packs=new Set();
 for(const b of NEW){
  const manifest=new Set(b.unresolvedDependencies.map(x=>x.ref));
  for(const v of b.voxels){assert(allowed.has(v.material),v.material);assert(manifest.has(v.material));packs.add(v.material.split(':')[0]);}
  for(const ref of manifest)assert(manualFivePackVariants(ref).length>0,ref);
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false);
 }
 for(const p of ['pack1','pack2','pack3','pack4','pack5'])assert(packs.has(p),p);
});
test('exact HEAD committed source and complete ledger: 95 / 420 candidates, 0 approved or integrated',()=>{
 const source='src/building-pool/roadmap-2b/m1-five-courts.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+source],{encoding:'utf8'}).trim(),execFileSync('git',['hash-object',source],{encoding:'utf8'}).trim());
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,100,115,305,0,0,0]);
 assert.equal(l.originals.length,100);
 const actual=new Set(all.filter(b=>b.category!=='temple'||b.variation!==1).map(b=>b.id));
 for(const id of actual)assert(new Set(l.originals.map(x=>x.id)).has(id),'historic six-courts source lost '+id);
 for(const b of NEW)assert.equal(l.originals.find(x=>x.id===b.id).file,source);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),115);
});
