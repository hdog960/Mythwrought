import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_CONCAVE_COURTS as NEW} from '../../../src/building-pool/roadmap-2b/m1-concave-courts.mjs';
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
const earlier=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,
 ...TRADE_CULTURE_M1_EXEMPLARS,...M1_REGIONAL_EXEMPLARS,
 ...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,
 ...M1_CLIFF_AND_FESTIVAL];
const all=[...earlier,...NEW],byId=new Map(NEW.map(b=>[b.id,b])),k=(x,y,z)=>x+','+y+','+z;
const cubes=b=>new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v]));
function travel(b,block=[]){
 const c=cubes(b),entrance=b.openings.find(x=>x.type==='entrance'),q=[[entrance.x,entrance.z]],
  seen=new Set(),denied=new Set(block.map(([x,z])=>x+','+z));
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i],id=x+','+z;
  if(x<0||x>=b.extents.x||z<0||z>=b.extents.z||seen.has(id)||denied.has(id))continue;
  if(c.get(k(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>c.has(k(x,y,z))))continue;
  seen.add(id);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
 }
 return seen;
}
function orientation(c,variant){
 const v=c.map(o=>{let x=o.x,z=o.z;
  switch(variant%4){case 1:[x,z]=[-z,x];break;case 2:x=-x;z=-z;break;case 3:[x,z]=[z,-x];break;}
  if(variant>=4)x=-x;return {x,z,y:o.y};
 });
 const xmin=Math.min(...v.map(o=>o.x)),zmin=Math.min(...v.map(o=>o.z));
 return new Set(v.map(o=>k(o.x-xmin,o.y,o.z-zmin)));
}
function bestD4Jaccard(a,b){
 const a0=orientation(a.voxels,0);let max=0;
 for(let t=0;t<8;t++){
  const candidate=orientation(b.voxels,t);
  const small=a0.size<=candidate.size?a0:candidate,large=a0.size<=candidate.size?candidate:a0;
  let overlap=0;for(const cell of small)if(large.has(cell))overlap++;
  max=Math.max(max,overlap/(a0.size+candidate.size-overlap));
 }
 return max;
}
test('exactly 5 new IDs, 84 unique D4 source-fingerprints, 84 reserved identifiers, zero production registration',()=>{
 assert.deepEqual(NEW.map(b=>b.id),[
  'r2:tailor:temperate:medium:01','r2:butcher:desert:medium:01',
  'r2:jeweler:mountain:medium:01','r2:bookshop:snow:medium:01',
  'r2:theater:enchanted-forest:large:01']);
 const ids=new Set(plannedSlots().map(s=>s.id));
 for(const b of NEW){assert(ids.has(b.id));assert.equal(validateBlueprint(b).valid,true);
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.status,'authored-candidate');assert(b.voxels.length>4200);}
 assert.deepEqual(assertDistinctArchitecture(all),{authored:84,distinctArchitectures:84});
});
test('all 5 buildings have genuinely absent nonrectangular footprint cells, not decorative courtyard labels',()=>{
 const expected=[209,304,220,234,304];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],m=cubes(b),ground=b.voxels.filter(v=>v.y===0);
  assert.equal(b.deliberatelyAbsentFootprintCells,expected[i],b.id);
  assert.equal(ground.length,b.extents.x*b.extents.z-expected[i]);
  assert(b.footprintRectangles.length>=2);
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const foundation=m.get(k(x,0,z)),floor=m.get(k(x,1,z));
   assert.equal(!!foundation,!!floor,b.id+' nonexistent floor supported');
   if(foundation){assert.equal(foundation.kind,'foundation');assert.equal(floor.kind,'floor');}
   else for(let y=2;y<b.extents.y;y++)
    assert(!m.has(k(x,y,z)),b.id+' has fake roof/wall over absent ground');
  }
 }
});
test('all concave exterior perimeter edges are real weather-boundary walls or explicit public doorway, not exposed accidental openings',()=>{
 for(const b of NEW){
  const m=cubes(b),entrance=b.openings.find(v=>v.type==='entrance');
  const hasFloor=(x,z)=>m.get(k(x,1,z))?.kind==='floor';
  let perimeterCount=0,innerFacingWalls=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   if(!hasFloor(x,z))continue;
   const neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
   const outside=neighbors.filter(([dx,dz])=>!hasFloor(x+dx,z+dz));
   if(!outside.length)continue;
   perimeterCount++;
   if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)innerFacingWalls++;
   for(const y of [2,5,6]){
    if(x===entrance.x&&z===entrance.z&&y===2)
     assert(!m.has(k(x,y,z)),b.id+' physically blocked exterior entrance');
    else assert.equal(m.get(k(x,y,z))?.kind,'wall',b.id+' missing exterior envelope '+k(x,y,z));
   }
  }
  assert(perimeterCount>100,b.id+' incorrectly simple perimeter');
  assert(innerFacingWalls>15,b.id+' has no real courtyard-facing exterior');
 }
});
test('named room programs have actual inside-building min/max bounds and distinct usage roles',()=>{
 for(const b of NEW){
  assert(b.rooms.length>=3);
  const names=new Set();
  for(const room of b.rooms){
   assert(typeof room.name==='string'&&room.name.length>12);
   assert(!names.has(room.name));names.add(room.name);
   const {x0,x1,z0,z1}=room.bounds;
   assert(Number.isInteger(x0)&&Number.isInteger(x1)&&Number.isInteger(z0)&&Number.isInteger(z1));
   assert(x0>=0&&x1<b.extents.x&&x0<x1&&z0>=0&&z1<b.extents.z&&z0<z1);
   assert(room.uses.length>0);
  }
  for(const target of b.routeTargets){
   const r=b.voxels.find(v=>v.x===target.x&&v.y===1&&v.z===target.z);
   assert.equal(r?.kind,'floor',b.id+' room reference rests on a non-floor');
  }
 }
});
test('every actual window is a registered physical source cell, every entrance and private door three-high clear',()=>{
 for(const b of NEW){
  const m=cubes(b),glass=b.voxels.filter(v=>v.kind==='window'),windows=b.openings.filter(v=>v.type==='window');
  assert(glass.length>=16,b.id+' weak exterior illumination');
  assert.equal(windows.length,glass.length,b.id+' wrong registered window count');
  for(const w of windows)assert.equal(m.get(k(w.x,w.y,w.z))?.material,w.material);
  for(const door of b.openings.filter(v=>['entrance','internal-doorway'].includes(v.type))){
   assert.equal(door.clearHeightCells,3);
   for(let y=door.y;y<door.y+3;y++)assert(!m.has(k(door.x,y,door.z)),b.id+' blocked door');
  }
 }
});
test('literal 3-high accessible routes to every published customer, wing, workshop, vault and dressing destination',()=>{
 for(const b of NEW){
  const seen=travel(b);
  for(const t of b.routeTargets)assert(seen.has(t.x+','+t.z),b.id+' unreachable '+t.name);
 }
});
test('actual U wings, butcher coldhouse, gem vault, reader archive and theater backstage do not have bypasses when all physical ports close',()=>{
 const cases=[
  ['r2:tailor:temperate:medium:01',[[6,14]],['west fitting']],
  ['r2:tailor:temperate:medium:01',[[30,14]],['east cutting']],
  ['r2:butcher:desert:medium:01',[[8,11],[8,19]],['cold store']],
  ['r2:butcher:desert:medium:01',[[27,11],[17,15]],['clean prep']],
  ['r2:jeweler:mountain:medium:01',[[8,17]],['lapidary']],
  ['r2:jeweler:mountain:medium:01',[[33,17]],['strongbox']],
  ['r2:bookshop:snow:medium:01',[[19,17],[25,24]],['private reading']],
  ['r2:bookshop:snow:medium:01',[[32,17],[25,24]],['archive']],
  ['r2:theater:enchanted-forest:large:01',[[10,41],[38,41]],['west dressing','east dressing']]
 ];
 for(const [id,ports,names] of cases){
  const b=byId.get(id),open=travel(b),closed=travel(b,ports);
  for(const name of names){
   const target=b.routeTargets.find(x=>x.name===name);assert(target,id+' missing '+name);
   const key=target.x+','+target.z;
   assert(open.has(key),id+' inaccessible open '+name);
   assert(!closed.has(key),id+' unauthorized bypass to '+name);
  }
 }
});
test('all elevated multilevel roofs have immediate real cell support, true courtyard voids have actual open sky',()=>{
 for(const b of NEW){
  const m=cubes(b);
  const elevated=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert(elevated.length>=125,b.id+' lacks substantive independent supported roof profiles');
  for(const v of elevated)assert(m.has(k(v.x,v.y-1,v.z)),b.id+' unsupported high roof '+k(v.x,v.y,v.z));
  for(const h of b.intentionallyOpenRoof)
   for(let x=h.x0;x<=h.x1;x++)for(let z=h.z0;z<=h.z1;z++)
    assert(!m.has(k(x,7,z)),b.id+' falsely marked sky void');
 }
 const t=byId.get('r2:theater:enchanted-forest:large:01'),m=cubes(t);
 for(const x of [16,32])for(const z of [33,39])for(let y=0;y<=8;y++)
  assert(m.has(k(x,y,z)),t.id+' front green roof ungrounded');
 assert.equal(t.voxels.filter(v=>v.role==='real-elevated-stage').length,13*5);
 assert.equal(t.symbolicStairApproaches.length,2);
 for(const s of t.symbolicStairApproaches){
  assert.equal(s.shapeRotationStatus,'unresolved-symbolic');
  assert.equal(m.get(k(s.x,2,s.z))?.material,'pack1:008');
 }
});
test('every new design rejects same-category near duplicate geometry across all eight D4 symmetries, threshold below 0.89',()=>{
 for(const b of NEW){
  for(const old of earlier.filter(x=>x.category===b.category&&x.size===b.size)){
   const sim=bestD4Jaccard(b,old);
   assert(sim<0.89,b.id+' too close to '+old.id+' D4-Jaccard '+sim);
  }
 }
});
test('physical family producer ABI exists but typed symbolic variant, Pack5 yaw, collision and saves are never falsely approved',()=>{
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const families=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),audited=new Set();let pack5Total=0;
 for(const b of NEW){
  const used=new Set([...b.voxels.map(v=>v.material),'pack2:020']);
  assert.deepEqual([...used].sort(),b.unresolvedDependencies.map(v=>v.ref));
  for(const ref of used){
   assert(families.has(ref),b.id+' unowned family '+ref);
   const variants=manualFivePackVariants(ref);assert(variants.length>0);
   if(audited.has(ref))continue;
   if(ref.startsWith('pack5:'))assert.throws(()=>resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'}),/explicit authored variant/);
   else{
    const physical=resolveManualFivePackAsset(ref,{numericId:variants[0].numericId,orientation:'north'});
    assert(physical.visibleBoxes.length&&physical.occupiedOffsets.length&&physical.selectionBoxes.length);
    assert.equal(physical.livePlaceable,false);assert.equal(physical.saveWritten,false);
   }
   audited.add(ref);
  }
  const result=inspectPack5InMixedBlueprint(b);
  assert.equal(result.readyForCombinedPlacement,false);
  if(result.pack5Total){assert.equal(result.resolvedPack5Count,0);pack5Total+=result.pack5Total;}
 }
 assert(pack5Total>=15);
});
test('exact committed PR HEAD source blob and 84/420 cumulative original registry, no creator approvals or integration',()=>{
 const source='src/building-pool/roadmap-2b/m1-concave-courts.mjs';
 assert.equal(execFileSync('git',['rev-parse','HEAD:'+source],{encoding:'utf8'}).trim(),
  execFileSync('git',['hash-object',source],{encoding:'utf8'}).trim());
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([ledger.target,ledger.sourceExactInheritedTemples,ledger.originalNewModels,ledger.authoredCandidates,
  ledger.remainingUnauthored,ledger.creatorAccepted,ledger.integratedInGame,ledger.placedInWorld],
  [420,15,86,101,319,0,0,0]);
 assert.equal(ledger.originals.length,86);
 // This is the historical 84-source test: verify every earlier identity remains
 // in the updated 95-source ledger, without falsely requiring the new six to be absent.
 const current=new Set(ledger.originals.map(x=>x.id));
 for(const earlier of all.filter(x=>x.category!=='temple'||x.variation!==1))
  assert(current.has(earlier.id),'lost original concave/historical source '+earlier.id);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.authored,0),101);
 assert.equal(Object.values(ledger.byCategory).reduce((n,x)=>n+x.remaining,0),319);
});
