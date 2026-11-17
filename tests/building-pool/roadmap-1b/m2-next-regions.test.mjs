// Builder 1B M2d: native exact-source acceptance for nine new regional architectures.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2NextRegion1BPlans} from '../../../src/building-pool/roadmap-1b/m2-next-regions.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';

const K=p=>p.join(',');
const allNew=()=>getM2NextRegion1BPlans();
const find=(category,biome,size)=>allNew().find(b=>b.category===category&&b.biome===biome&&b.size===size);
const occupied=b=>new Map(b.placements.map(p=>[K(p.at),p]));
const count=(b,name)=>b.placements.filter(p=>p.purpose===name).length;
const roofs=b=>b.placements.filter(p=>p.role==='roof');
function connected(b){
 const allowed=new Set(b.walkable.map(K)),queue=[b.walkable[0]],visited=new Set([K(queue[0])]);
 for(let i=0;i<queue.length;i++)for(const d of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){
  const c=queue[i].map((v,j)=>v+d[j]),k=K(c);
  if(allowed.has(k)&&!visited.has(k)){visited.add(k);queue.push(c);}
 }
 return visited.size===allowed.size;
}
test('M2d 142/435 unique literal candidate sources preserve all 15 exact inherited stable designs and bucket quotas',()=>{
 const old=getInheritedStables(),all=get1BCandidates(),new9=allNew(),stats=validateAllocation(all);
 assert.equal(all.length,142);assert.equal(stats.authored,142);assert.equal(stats.remaining,293);
 assert.equal(old.length,15);assert.equal(new9.length,9);
 assert.equal(new Set(all.map(b=>b.id)).size,142);
 assert.equal(new Set(all.map(structuralFingerprint)).size,142,'physical/source coordinate identity collision');
 assert.equal(new Set(new9.map(b=>b.architecturalIdentity.program)).size,9);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(category=>
  [category,all.filter(b=>b.category===category).length])),
 {'bathhouse':20,stable:28,'farm-barn':19,greenhouse:20,'fishing-lodge':19,'harbor-office':18,lighthouse:18});
 for(const original of old){
  const carried=all.find(x=>x.id===original.id);
  assert.ok(carried);
  assert.equal(stableBlueprintJSON(carried),stableBlueprintJSON(original),'legacy SHA-exact stable altered');
 }
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(b=>b.category===category&&b.biome===biome&&b.size===size).length<=QUOTAS[category]);
});
test('M2d nine fixed architectural programs have solid full 3D geometry, connected 2-high standing space, real portals and unresolved shape ABI',()=>{
 for(const b of allNew()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1000&&b.walkable.length>=220);
  assert.ok(connected(b),'separate trapped horizontal cells in '+b.id);
  assert.ok(b.rooms.length>=3&&b.portals.length>=5);
  assert.ok(roofs(b).length>=150,'decorative fake roof '+b.id);
  assert.ok(b.placements.some(p=>p.role==='foundation'));
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.ok(b.placements.some(p=>p.role==='support'));
  assert.deepEqual(b.dependencies.map(x=>x.asset),['pack4:030']);
  assert.ok(b.dependencies[0].status==='unresolved'&&b.dependencies[0].requires.length===3);
  assert.ok(!b.placements.some(p=>p.asset==='pack5:090'),'Pack 5 oven cannot substitute as storage');
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  const occ=occupied(b),walkable=new Set(b.walkable.map(K));
  for(const p of b.portals){
   assert.ok(walkable.has(K(p.at)),'door not reachable '+b.id+' '+p.to);
   assert.ok(!occ.has(K(p.at))&&!occ.has(K([p.at[0],p.at[1]+1,p.at[2]])),'door physically blocked '+b.id);
  }
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(allNew().find(q=>q.id===b.id)),'non-deterministic source '+b.id);
 }
});
test('M2d exactly 66 bearing heads contact real roof source cells with source foundation below',()=>{
 let headsTotal=0;
 for(const b of allNew()){
  const occ=occupied(b),heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=6);
  headsTotal+=heads.length;
  for(const p of heads){
   assert.equal(occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role,'roof','detached roof cap '+b.id);
   const below=occ.get(K([p.at[0],p.at[1]-1,p.at[2]]));
   assert.ok(['foundation','support','roof'].includes(below?.role),'floating pillar lacking direct bearing '+b.id);
  }
 }
 assert.equal(headsTotal,66);
});
test('Enchanted Small Moonfern baths have two physically separate empty basins and three canopy wings',()=>{
 const b=find('bathhouse','enchanted-forest','small'),occ=occupied(b);
 assert.ok(count(b,'west-unfilled-moon-basin')>=10);
 assert.ok(count(b,'east-unfilled-moon-basin')>=9);
 assert.ok(!occ.has('9,7,11'),'central open court accidentally roofed');
 assert.equal(b.rooms.length,5);
 assert.equal(b.architecturalIdentity.waterPhysics,false);
});
test('Enchanted Large Elderwillow bath has four peaked pavilion roofing regions around central sky procession',()=>{
 const b=find('bathhouse','enchanted-forest','large'),occ=occupied(b);
 assert.equal(new Set(roofs(b).map(p=>p.roofProfile)).size,4);
 assert.ok(!occ.has('15,8,16')&&!occ.has('15,9,16'));
 assert.equal(b.footprint.depth,35);
 assert.equal(b.rooms.length,6);
 assert.equal(b.architecturalIdentity.actualWater,false);
});
test('Mountain Small Screeledge stone bath has seven-height source retaining slope and two empty cliff basin rims',()=>{
 const b=find('bathhouse','mountain','small');
 assert.ok(new Set(roofs(b).map(p=>p.at[1])).size>=7);
 assert.ok(count(b,'lower-unfilled-healing-rim')>=10&&count(b,'upper-empty-cliff-bath')>=10);
 assert.ok(roofs(b).some(p=>p.roofProfile==='screeledge-entrance-outcrop'&&p.cantileverApproval===false));
 assert.equal(b.architecturalIdentity.heating,false);
});
test('Temperate Small Ashgrove stable has four empty pens and real physically raised roof monitor',()=>{
 const b=find('stable','temperate','small'),occ=occupied(b);
 assert.equal(b.index,4);
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-access').length,4);
 assert.equal(count(b,'empty-stall-feed-rack'),4);
 assert.ok(roofs(b).some(p=>p.roofProfile==='ashgrove-raised-central-vent-monitor'));
 assert.ok(count(b,'ashgrove-monitor-on-gable-riser')===4);
 assert.ok(occ.has('8,10,8')&&occ.get('8,9,8')?.role==='roof');
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Desert Medium Suntrail stable has six separate empty pen arches and asymmetric roof elevations',()=>{
 const b=find('stable','desert','medium');
 assert.equal(b.portals.filter(p=>p.opening==='open-empty-stall-arcade').length,6);
 assert.equal(count(b,'empty-caravan-feed-rim'),6);
 assert.ok(roofs(b).some(p=>p.roofProfile==='suntrail-west-deep-sand-arcade'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='suntrail-east-raised-palm-arcade'));
 assert.equal(b.architecturalIdentity.waterWorking,false);
});
test('Mountain Small Cragpost stable has true uphill stone roof and four distinct empty-load pen doors',()=>{
 const b=find('stable','mountain','small');
 assert.equal(b.portals.filter(p=>p.opening==='stone-empty-stall-opening').length,4);
 assert.equal(b.rooms.length,7);assert.ok(count(b,'cragpost-stone-bearing-buttress')>=60);
 assert.ok(new Set(roofs(b).map(p=>p.at[1])).size>=5);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Desert Small Datewind barn has unroofed threshing slab and distinct stone arm canopies',()=>{
 const b=find('farm-barn','desert','small'),occ=occupied(b);
 assert.ok(!occ.has('9,8,13'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='datewind-west-grain-porch'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='datewind-east-saltstore-porch'));
 assert.equal(count(b,'empty-threshing-stone'),1);
 assert.equal(b.architecturalIdentity.harvest,false);
});
test('Snow Large Whitebarrow grain depot uses genuinely separate load doors and monitor supports bearing on base roof',()=>{
 const b=find('farm-barn','snow','large'),occ=occupied(b);
 assert.equal(b.portals.filter(p=>p.opening==='triple-separated-sled-doors').length,3);
 assert.ok(roofs(b).filter(p=>p.roofProfile==='whitebarrow-roof-light-monitor').length>=70);
 assert.equal(count(b,'whitebarrow-raised-lantern-riser'),4);
 for(const x of [13,17])for(const z of [14,20]){
  assert.equal(occ.get(K([x,12,z]))?.role,'roof','lower roof absent');
  assert.equal(occ.get(K([x,13,z]))?.role,'support','lantern riser absent');
  assert.equal(occ.get(K([x,14,z]))?.role,'roof','upper monitor roof absent');
 }
 assert.equal(b.architecturalIdentity.workingMechanics,false);
});
test('Forest Small Fernhook drying barn has connected double-wing circulation and no claimed harvesting/crafting',()=>{
 const b=find('farm-barn','enchanted-forest','small');
 assert.equal(b.rooms.length,4);
 assert.equal(b.portals.filter(p=>p.from==='west-shaded-drying-bay'&&p.to==='east-basket-assembly-bay').length,2);
 assert.equal(count(b,'fernhook-wood-truss-pier')>=30,true);
 assert.ok(new Set(roofs(b).map(p=>p.roofProfile)).size===4);
 assert.equal(b.architecturalIdentity.harvesting,false);
 assert.equal(b.architecturalIdentity.crafting,false);
});
