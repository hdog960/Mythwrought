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
const NEW=[...M1_BESPOKE_COURTS,...M1_RITUAL_TRADES,...M1_SHADOWSTAGE];
const history=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,...TRADE_CULTURE_M1_EXEMPLARS,
 ...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS,...M1_NEW_REGION_ARCHITECTURES,
 ...M1_SPECIALTY_COURTS,...M1_GRAND_COMPLEXES,...M1_REGIONAL_GALLERIES,
 ...M1_CLIFF_AND_FESTIVAL,...M1_CONCAVE_COURTS,...M1_SCULPTED_REGIONAL];
const all=[...history,...M1_FIVE_COURTS,...NEW],key=(x,y,z)=>x+','+y+','+z;
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

test('six new reserved full-coordinate designs preserve all 95 earlier bodies and unique D4 structures among 101',()=>{
 assert.deepEqual(NEW.map(x=>x.id),["r2:jeweler:temperate:medium:02","r2:jeweler:enchanted-forest:large:02","r2:butcher:mountain:large:02","r2:tailor:desert:medium:02","r2:temple:enchanted-forest:large:02","r2:theater:desert:small:02"]);
 assert.deepEqual(NEW.map(x=>x.voxels.length),[4938,7557,8084,4974,6681,3172]);
 const allowed=new Set(plannedSlots().map(x=>x.id)),prior=new Set([...history,...M1_FIVE_COURTS].map(x=>x.id));
 for(const b of NEW){
  assert(allowed.has(b.id)&&!prior.has(b.id),b.id+' not a new reserved authoring slot');
  assert.equal(validateBlueprint(b).valid,true);assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);assert.equal(b.isolated,true);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:101,distinctArchitectures:101});
});
test('every new architectural notch genuinely deletes foundation, floor and all 3D mass outside its integer physical plan',()=>{
 const missing=[227,314,255,286,567,294];
 for(let i=0;i<NEW.length;i++){
  const b=NEW[i],c=occupancy(b);assert.equal(b.deliberatelyAbsentFootprintCells,missing[i],b.id);
  assert(b.footprintRectangles.length>=3);
  let inner=0;
  for(let x=0;x<b.extents.x;x++)for(let z=0;z<b.extents.z;z++){
   const f=c.get(key(x,0,z)),floor=c.get(key(x,1,z));
   assert.equal(!!f,!!floor,b.id+' foundation/floor parity');
   if(!f){for(let y=2;y<b.extents.y;y++)assert(!c.has(key(x,y,z)),b.id+' fake roof over empty footprint');continue;}
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!c.has(key(x+dx,1,z+dz)))){
    assert.equal(c.get(key(x,6,z))?.kind,'wall',b.id+' concave perimeter missing weather wall');
    if(x>0&&z>0&&x<b.extents.x-1&&z<b.extents.z-1)inner++;
   }
  }
  assert(inner>12,b.id+' no authentic inside corners');
 }
});
test('source-driven cutaway has physical facade windows and all public/private doors are 3-air-cell tall',()=>{
 for(const b of NEW){
  const c=occupancy(b),window=b.openings.filter(p=>p.type==='window');
  assert(window.length>=15,b.id+' no actual transparent candidate cells');
  for(const w of window)assert.equal(c.get(key(w.x,w.y,w.z))?.material,w.material);
  for(const port of b.openings.filter(p=>p.type==='entrance'||p.type==='internal-doorway')){
   assert.equal(port.clearHeightCells,3,b.id+' no full three-cell air door');
   for(let y=port.y;y<port.y+port.clearHeightCells;y++)
    assert(!c.has(key(port.x,y,port.z)),b.id+' concealed blocked room access');
  }
 }
});
test('all six designs have actually reachable public and backstage route-target cells',()=>{
 for(const b of NEW){
  const publicRoute=walk(b);assert(b.rooms.length>=4&&b.routeTargets.length>=4);
  for(const target of b.routeTargets)assert(publicRoute.has(target.x+','+target.z),b.id+' unreachable '+target.name);
 }
});
test('genuine protected source rooms seal without hidden backdoors when actual internal portals close',()=>{
 for(const b of NEW){
  const ports=b.openings.filter(p=>p.type==='internal-doorway').map(p=>[p.x,p.z]);
  assert(ports.length>=3,b.id+' graph-only private rooms without physical doors');
  const sealed=walk(b,ports);
  const protectedTargets=b.category==='theater'
    ?b.routeTargets.filter(t=>/backstage|workshop/i.test(t.name))
    :b.routeTargets.slice(1);
  for(const t of protectedTargets)
   assert(!sealed.has(t.x+','+t.z),b.id+' physically bypassable private '+t.name);
 }
});
test('every elevated roof is occupied geometry with ground attachment and real immediate voxel support',()=>{
 for(const b of NEW){
  const c=occupancy(b),upper=b.voxels.filter(v=>v.kind==='roof'&&v.y>=8);
  assert(upper.length>65,b.id+' no bespoke upper physical roof');
  assert(new Set(upper.map(v=>v.role)).size>=3,b.id+' one repeated generic flat roof');
  assert(upper.some(v=>v.y>=9),b.id+' missing distinct high ridge');
  for(const v of upper){
   assert(c.has(key(v.x,v.y-1,v.z)),b.id+' floating roof '+v.role);
   assert(c.has(key(v.x,0,v.z)),b.id+' upper roof over missing earth');
  }
 }
});
test('shadowstage has complete raised 36-cell platform, four true posts, and navigable public aisle to guarded backstage',()=>{
 const b=NEW.find(v=>v.category==='theater'),c=occupancy(b);
 assert.equal(b.voxels.filter(v=>v.role==='raised-original-performance-stage').length,36);
 for(const [x,z]of [[10,22],[21,22],[6,25],[24,25]]){
  for(let y=2;y<=6;y++)assert.equal(c.get(key(x,y,z))?.kind,'wall',b.id+' missing structurally real pier '+key(x,y,z));
  assert(c.get(key(x,7,z))?.kind==='roof',b.id+' missing roof under stage canopy');
  assert(c.get(key(x,8,z))?.kind==='roof',b.id+' missing stage canopy over real post');
 }
 const rear=b.routeTargets.find(v=>/backstage/.test(v.name));
 assert(walk(b).has(rear.x+','+rear.z),'public alley cannot reach backstage');
 assert(!walk(b,b.openings.filter(x=>x.type==='internal-doorway').map(x=>[x.x,x.z])).has(rear.x+','+rear.z),'private stage backdoor bypass');
 assert(b.symbolicStairApproaches.every(v=>v.shapeRotationStatus==='unresolved-symbolic'));
});
test('all six designs clear same-category-and-size eight-orientation normalized occupied-cell similarity below 0.85',()=>{
 for(const b of NEW){
  let nearMax=0;
  for(const q of all)if(q!==b&&q.category===b.category&&q.size===b.size)nearMax=Math.max(nearMax,closest(b,q));
  assert(nearMax<0.85,b.id+' excessive normalized D4 near-duplicate Jaccard '+nearMax);
 }
});
test('true Pack1–5 physical producer-family tokens are used; actual variants, AABBs and save readiness remain blocked',()=>{
 const allowed=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS),usedPacks=new Set();
 for(const b of NEW){
  const declared=new Set(b.unresolvedDependencies.map(x=>x.ref));
  for(const v of b.voxels){assert(allowed.has(v.material),b.id+' forged material '+v.material);
   assert(declared.has(v.material),b.id+' incomplete physical dependency ledger '+v.material);
   usedPacks.add(v.material.split(':')[0]);}
  for(const dep of b.unresolvedDependencies)assert(manualFivePackVariants(dep.ref).length>0,dep.ref+' no actual candidate variant');
  assert.equal(inspectPack5InMixedBlueprint(b).readyForCombinedPlacement,false,b.id+' unapproved production ABI incorrectly certified');
 }
 for(const pack of ['pack1','pack2','pack3','pack4','pack5'])assert(usedPacks.has(pack),pack+' not physically referenced');
});
test('all 101 actual source identities match exact committed PR-head Git blob and honest authoritative 420-slot ledger',()=>{
 for(const filename of ['m1-bespoke-courts.mjs','m1-ritual-trades.mjs','m1-shadowstage.mjs']){
  const path='src/building-pool/roadmap-2b/'+filename;
  assert.equal(execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim(),
   execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),path);
 }
 const l=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.deepEqual([l.target,l.sourceExactInheritedTemples,l.originalNewModels,l.authoredCandidates,l.remainingUnauthored,
  l.creatorAccepted,l.integratedInGame,l.placedInWorld],[420,15,100,115,305,0,0,0]);
 assert.equal(l.originals.length,100);
 const ids=new Set(all.filter(b=>b.category!=='temple'||b.variation!==1).map(b=>b.id));
 for(const id of ids)assert(new Set(l.originals.map(x=>x.id)).has(id),'lost historical six-bespoke candidate '+id);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.authored,0),115);
 assert.equal(Object.values(l.byCategory).reduce((n,x)=>n+x.remaining,0),305);
 assert.equal(Object.values(l.biomeSizeDistribution).reduce((n,b)=>n+b.small+b.medium+b.large,0),115);
 assert(NEW.every(b=>l.originals.some(row=>row.id===b.id&&row.file==='src/building-pool/roadmap-2b/'+
  (b.category==='jeweler'||b.category==='butcher'?'m1-bespoke-courts.mjs':b.category==='theater'?'m1-shadowstage.mjs':'m1-ritual-trades.mjs'))));
});
