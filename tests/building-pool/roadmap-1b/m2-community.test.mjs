import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {getM2Community1BPlans} from '../../../src/building-pool/roadmap-1b/m2-community-structures.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {QUOTAS,BIOMES,SIZES,validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {stableBlueprintJSON,validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=p=>p.join(',');
const materialPurpose=(b,purpose)=>b.placements.filter(p=>p.purpose===purpose);
const footprint=(b)=>b.placements.map(p=>p.at.join(','));
const builds=()=>getM2Community1BPlans();
const find=(category,biome,size)=>builds().find(x=>x.category===category&&x.biome===biome&&x.size===size);
function d4Canonical(b){
 const base=b.placements.map(p=>({x:p.at[0],y:p.at[1],z:p.at[2],role:p.role})),W=b.footprint.width,D=b.footprint.depth;
 const digests=[];
 for(const reflect of [false,true])for(let rot=0;rot<4;rot++){
  const rows=base.map(p=>{
   let x=reflect?W-1-p.x:p.x,z=p.z;
   if(rot===1)[x,z]=[z,W-1-x];
   if(rot===2)[x,z]=[W-1-x,D-1-z];
   if(rot===3)[x,z]=[D-1-z,x];
   return [x,p.y,z,p.role].join(':');
  }).sort();
  const dims=rot%2?[D,b.footprint.height,W]:[W,b.footprint.height,D];
  digests.push(createHash('sha256').update(dims.join('x')+'\n'+rows.join('\n')).digest('hex'));
 }
 return digests.sort()[0];
}
test('M2 all nine source-authored designs are independent, 100/435 census and 15 inherited IDs remain unchanged',()=>{
 const original=getInheritedStables(),m2=builds(),all=get1BCandidates(),c=validateAllocation(all);
 assert.equal(m2.length,9);assert.equal(original.length,15);
 assert.equal(all.length,100);assert.equal(c.authored,100);assert.equal(c.remaining,335);
 assert.equal(new Set(all.map(b=>b.id)).size,100);
 assert.equal(new Set(all.map(b=>structuralFingerprint(b))).size,100);
 assert.equal(new Set(m2.map(b=>b.id)).size,9);
 for(const legacy of original){
  const carried=all.find(b=>b.id===legacy.id);
  assert.ok(carried,'missing original stable '+legacy.id);
  assert.equal(stableBlueprintJSON(carried),stableBlueprintJSON(legacy),'source-exact stable moved '+legacy.id);
 }
 const counts=Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(b=>b.category===k).length]));
 assert.deepEqual(counts,{'bathhouse':14,stable:28,'farm-barn':14,greenhouse:11,'fishing-lodge':8,'harbor-office':8,lighthouse:8});
 for(const biome of BIOMES)for(const size of SIZES)for(const [category,n] of Object.entries(QUOTAS)){
  assert.ok(all.filter(x=>x.category===category&&x.biome===biome&&x.size===size).length<=n);
 }
});
test('M2 all nine designs are full authored 3D with actual connected standing clearance and doors',()=>{
 const m2=builds();
 assert.deepEqual(m2.map(b=>b.category).sort(),[
  'bathhouse','bathhouse','bathhouse','stable','stable','stable','farm-barn','farm-barn','farm-barn'].sort());
 for(const b of m2){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1000,'not genuine physical build '+b.id);
  assert.ok(b.walkable.length>=200,'lack of connected floor '+b.id);
  assert.ok(b.rooms.length>=4&&b.portals.length>=4,'missing room graph '+b.id);
  assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.ok(b.placements.some(p=>p.role==='roof'));
  assert.ok(b.placements.some(p=>p.role==='foundation'));
  assert.ok(b.placements.some(p=>p.role==='support'));
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.deepEqual(b.dependencies.map(d=>d.asset),['pack4:030']);
  assert.ok(b.dependencies[0].requires.length>=3);
  assert.ok(!b.placements.some(p=>p.asset==='pack5:090'),'fake towel storage via oven');
  const occupied=new Set(footprint(b)),walking=new Set(b.walkable.map(key));
  for(const portal of b.portals){
   assert.ok(!occupied.has(key(portal.at)),'blocked doorway '+b.id+' '+portal.to);
   assert.ok(!occupied.has(key([portal.at[0],portal.at[1]+1,portal.at[2]])),'blocked head '+b.id);
   assert.ok(walking.has(key(portal.at)),'not a physical walkable portal '+b.id);
  }
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(builds().find(x=>x.id===b.id)),
   'non-deterministic coordinate output '+b.id);
 }
});
test('D4 canonical 90°, 180°, 270° rotations and mirrors find no exact architectural copies among all 100',()=>{
 const m=get1BCandidates(),sets=new Map();
 for(const b of m){
  const fp=d4Canonical(b);
  assert.ok(!sets.has(fp),'rotation/reflection duplicate '+b.id+' vs '+sets.get(fp));
  sets.set(fp,b.id);
 }
 assert.equal(sets.size,100);
});
test('Snow small baths contain two connected empty basins and a physically roofed warming hall',()=>{
 const b=find('bathhouse','snow','small'),walk=new Set(b.walkable.map(key));
 assert.equal(b.rooms.length,4);assert.ok(b.portals.some(p=>p.to==='twin-empty-basin-court'));
 assert.ok(materialPurpose(b,'empty-basin-rim').length>=16);
 assert.ok(walk.has('5,1,14')&&walk.has('12,1,14'),'courtyard circulation blocked');
 assert.ok(b.placements.filter(p=>p.roofProfile==='steep-winter-drain-gable').length>150);
 assert.equal(b.architecturalIdentity.actualWater,false);
});
test('Moonpond Medium bathhouse is a genuine two-pavilion, roof-open central court',()=>{
 const b=find('bathhouse','enchanted-forest','medium');
 const roof=new Set(b.placements.filter(p=>p.role==='roof').map(p=>key(p.at)));
 assert.ok(!roof.has('12,6,12')&&!roof.has('12,7,12'),'skylight is physically blocked');
 assert.ok([...roof].some(k=>/^12,[6-9],5$/.test(k))&&[...roof].some(k=>/^12,[6-9],21$/.test(k)),'separate front/back roofs absent');
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,7);
 assert.ok(materialPurpose(b,'west-basin-rim').length>15);
 assert.ok(materialPurpose(b,'east-basin-rim').length>15);
});
test('Mountain large public baths use sky-well and three physically separated therapy sectors',()=>{
 const b=find('bathhouse','mountain','large'),occupied=new Set(footprint(b));
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,7);
 assert.ok(!occupied.has('14,7,14')&&!occupied.has('14,8,14'),'skywell sealed with roof');
 assert.ok(materialPurpose(b,'upper-empty-stone-bath').length>=15);
 assert.ok(materialPurpose(b,'lower-empty-stone-bath').length>15);
 assert.equal(b.footprint.width,29);assert.equal(b.footprint.depth,29);
});
test('Desert stable variation 004 is NOT an inherited stable and contains four empty functional bays',()=>{
 const b=find('stable','desert','small');
 assert.equal(b.index,4);assert.equal(b.rooms.length,6);
 assert.ok(!getInheritedStables().some(x=>x.id===b.id));
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-bay').length,4);
 assert.ok(materialPurpose(b,'empty-stall-manger').length===4);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Mountain large stable carries eight distinct empty pen doors, wagon road and anchored roof',()=>{
 const b=find('stable','mountain','large'),walk=new Set(b.walkable.map(key));
 assert.equal(b.rooms.length,10);assert.equal(b.portals.filter(p=>p.opening==='empty-wide-pen-access').length,8);
 assert.ok(walk.has('15,1,13')&&walk.has('15,1,24'));
 assert.ok(materialPurpose(b,'heavy-snow-roof-truss-column').length>=50);
 assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1])).size>=4);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Forest small stable has four distinct pen openings, a real covered roof and rear service routes',()=>{
 const b=find('stable','enchanted-forest','small'),walk=new Set(b.walkable.map(key));
 assert.equal(b.portals.filter(p=>p.opening==='open-forest-stall').length,4);
 assert.ok(walk.has('3,1,15')&&walk.has('13,1,15'),'rear corner access sealed');
 assert.equal(b.rooms.length,6);
 assert.ok(materialPurpose(b,'leaf-canopy-bearing-post').length>8);
});
test('Desert large grain barn provides a genuinely sky-open court and independent rear depot',()=>{
 const b=find('farm-barn','desert','large'),occupied=new Set(footprint(b));
 assert.equal(b.rooms.length,6);
 assert.equal(b.portals.length,9);
 assert.ok(!occupied.has('14,7,14')&&!occupied.has('14,8,14'),'threshing courtyard accidentally roofed');
 assert.ok(b.placements.some(p=>p.roofProfile==='west-granary-shed'));
 assert.ok(b.placements.some(p=>p.roofProfile==='east-granary-shed'));
 assert.ok(b.placements.some(p=>p.roofProfile==='rear-caravan-storage'));
});
test('Snow small provision barn has a high steep ridge and separate load/rope/fuel circulation',()=>{
 const b=find('farm-barn','snow','small');
 const heights=new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1]));
 assert.ok(heights.size>=7,'snow roof is a flat placeholder');
 assert.ok(b.portals.some(p=>p.to==='rope-and-repair-store'));
 assert.ok(b.portals.some(p=>p.to==='back-snow-shelter'));
 assert.ok(materialPurpose(b,'high-snow-roof-bearing-post').length>=16);
});
test('Forest medium drying barn has physical two-wing circulation and multiple connected frame posts',()=>{
 const b=find('farm-barn','enchanted-forest','medium');
 assert.ok(b.portals.some(p=>p.from==='west-drying-bay'&&p.to==='east-tackle-store'));
 assert.ok(materialPurpose(b,'living-wood-rib-support').length>=20);
 assert.ok(b.placements.some(p=>p.purpose==='herbal-drying-frame-no-harvest'));
 assert.equal(b.architecturalIdentity.harvesting,false);
});
