// Builder 1B M2f: source-specific native regression for nine original regional
// services plus two visually sculpted beacon silhouettes. Draft only, no runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2Beacon1BPlans} from '../../../src/building-pool/roadmap-1b/m2-beacon-regions.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,BIOMES,SIZES,QUOTAS} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=x=>x.join(',');
const make=()=>getM2Beacon1BPlans();
const pick=(category,biome,size)=>make().find(x=>x.category===category&&x.biome===biome&&x.size===size);
const occupancy=b=>new Map(b.placements.map(x=>[key(x.at),x]));
const role=(b,name)=>b.placements.filter(p=>p.role===name);
const roofProfiles=b=>new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
function connectedWalk(b){
 const cells=new Set(b.walkable.map(key)),seen=new Set([key(b.walkable[0])]),q=[b.walkable[0]];
 for(let i=0;i<q.length;i++)for(const d of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){
  const v=q[i].map((x,j)=>x+d[j]),k=key(v);
  if(cells.has(k)&&!seen.has(k)){seen.add(k);q.push(v);}
 }
 return seen.size===cells.size;
}
test('M2f 118/435 candidate census, exact 15 legacy stable parity and all category/biome/size quotas',()=>{
 const old=getInheritedStables(),all=get1BCandidates(),next=make(),s=validateAllocation(all);
 assert.equal(s.authored,118);assert.equal(s.remaining,317);
 assert.equal(all.length,118);assert.equal(old.length,15);assert.equal(next.length,9);
 assert.equal(new Set(all.map(p=>p.id)).size,118);
 assert.equal(new Set(all.map(structuralFingerprint)).size,118);
 assert.equal(new Set(next.map(p=>p.architecturalIdentity.program)).size,9);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(x=>x.category===k).length])),
  {'bathhouse':14,stable:28,'farm-barn':15,greenhouse:15,'fishing-lodge':15,'harbor-office':15,lighthouse:15});
 for(const p of old){
  assert.equal(stableBlueprintJSON(all.find(q=>q.id===p.id)),stableBlueprintJSON(p),
    'inherited stable mutated '+p.id);
 }
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===category&&p.biome===biome&&p.size===size).length<=QUOTAS[category]);
});
test('M2f all nine genuinely irregular source foundations, deterministic full XYZ geometry and two-high accessible rooms',()=>{
 for(const b of make()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1500,b.id+' empty/nonphysical model');
  assert.ok(b.rooms.length>=2&&b.portals.length>=2,b.id+' missing room programs');
  assert.ok(b.walkable.length>=280,b.id+' blocked local walking');
  assert.ok(connectedWalk(b),b.id+' disconnected horizontal walking');
  const mask=role(b,'foundation').length,rect=(b.footprint.width-2)*(b.footprint.depth-2);
  assert.ok(mask/rect<0.82,b.id+' rectangular fake silhouette');
  assert.ok(roofProfiles(b).size>=2,b.id+' single flat roof');
  assert.ok(role(b,'wall').length>=100,b.id+' fake perimeter');
  assert.ok(role(b,'window').length>=5,b.id+' no real glazed anchors');
  assert.deepEqual(b.dependencies.map(p=>p.asset),['pack4:030']);
  assert.ok(b.dependencies[0].status==='unresolved'&&b.dependencies[0].requires.length===3);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  const occ=occupancy(b),walking=new Set(b.walkable.map(key));
  for(const p of b.portals){
   assert.ok(walking.has(key(p.at)),b.id+' portal not physically walkable '+p.to);
   assert.ok(!occ.has(key(p.at))&&!occ.has(key([p.at[0],p.at[1]+1,p.at[2]])),
    b.id+' blocked doorway');
  }
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(make().find(q=>q.id===b.id)));
 }
});
test('M2f 46 grounded authored roof piers all contact real roof voxels, none terminate in air',()=>{
 let total=0;
 for(const b of make()){
  const occ=occupancy(b),heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=4);
  for(const p of heads){
   assert.equal(occ.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' missing base foundation');
   assert.equal(occ.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role,'roof',b.id+' free-floating roof');
  }
  total+=heads.length;
 }
 assert.equal(total,46);
});
test('Mountain Talusglass L-ridge has actual missing outside corner and source Pack 4 glazed upslope roof',()=>{
 const b=pick('greenhouse','mountain','medium'),occ=occupancy(b);
 assert.ok(!occ.has('5,0,25')&&occ.has('19,0,25'));
 assert.ok(roofProfiles(b).has('talusglass-stone-visitor-crossroof'));
 assert.ok(b.placements.some(p=>p.roofProfile==='talusglass-glazed-upslope-glory'&&p.asset==='pack4:030'));
 assert.equal(b.architecturalIdentity.irrigation,false);
});
test('Enchanted Thorncrown C has a huge real open-center growing garden and three mutually different roof sections',()=>{
 const b=pick('greenhouse','enchanted-forest','large'),occ=occupancy(b);
 assert.ok(!occ.has('20,0,20')&&!occ.has('20,11,20'));
 assert.ok(occ.has('6,0,20')&&occ.has('20,0,34'));
 assert.ok(roofProfiles(b).size>=3);
 assert.equal(b.architecturalIdentity.growthSimulation,false);
});
test('Snow Bridgefrost H greenhouse owns opposing enclosed long galleries and a physical glass bridge',()=>{
 const b=pick('greenhouse','snow','large'),occ=occupancy(b);
 assert.ok(!occ.has('17,0,6')&&!occ.has('17,0,32'));
 assert.ok(occ.has('6,0,6')&&occ.has('27,0,6')&&occ.has('17,0,20'));
 assert.ok(b.placements.some(p=>p.asset==='pack4:030'&&p.roofProfile==='bridgefrost-elevated-frostglass-connector'));
 assert.equal(b.portals.length,4);
});
test('Snow Icehook fishing lodge is real U with two different drynet wings and true open ice court',()=>{
 const b=pick('fishing-lodge','snow','medium'),occ=occupancy(b);
 assert.ok(!occ.has('15,0,24')&&!occ.has('15,8,24'));
 assert.ok(occ.has('5,0,24')&&occ.has('25,0,24'));
 assert.equal(roofProfiles(b).size,3);
 assert.equal(b.architecturalIdentity.realFishing,false);
});
test('Enchanted Glimmerhook lodge has narrow true T stem, offset east ending and three distinct roofs',()=>{
 const b=pick('fishing-lodge','enchanted-forest','medium'),occ=occupancy(b);
 assert.ok(!occ.has('5,0,23')&&occ.has('14,0,23')&&occ.has('20,0,29'));
 assert.equal(roofProfiles(b).size,3);
 assert.equal(b.architecturalIdentity.boats,false);
});
test('Temperate Estuary Harbor Office is C-plan with double-curved route around an open-courtyard void',()=>{
 const b=pick('harbor-office','temperate','large'),occ=occupancy(b);
 assert.ok(!occ.has('17,0,18')&&!occ.has('17,9,18'));
 assert.ok(occ.has('6,0,18')&&occ.has('30,0,18')&&occ.has('19,0,33'));
 assert.equal(roofProfiles(b).size,4);
 assert.equal(b.architecturalIdentity.harborEconomy,false);
});
test('Mountain Switchback office has true Z route, 3 gabled roof masses and no active mountain transport',()=>{
 const b=pick('harbor-office','mountain','medium'),occ=occupancy(b);
 assert.ok(!occ.has('5,0,24')&&occ.has('16,0,24')&&occ.has('4,0,6'));
 assert.equal(roofProfiles(b).size,3);
 assert.equal(b.architecturalIdentity.mountainHarborTransport,false);
});
test('Desert Miraj tower has genuine three setback octagonal stages physically founded on roof plates',()=>{
 const b=pick('lighthouse','desert','large'),occ=occupancy(b),profiles=roofProfiles(b);
 for(const y of [8,19,26,31])assert.equal(occ.get(key([8,y,8]))?.role,'roof','missing tower load platform y'+y);
 for(const y of [9,18])assert.equal(occ.get(key([8,y,2]))?.role,'wall','first octagon tower band y'+y);
 for(const y of [20,25])assert.equal(occ.get(key([8,y,5]))?.role,'wall','second octagon band y'+y);
 for(const y of [27,30])assert.equal(occ.get(key([8,y,6]))?.role,'wall','third octagon band y'+y);
 assert.ok(profiles.has('miraj-octagonal-outward-first-gallery'));
 assert.ok(profiles.has('miraj-glassless-crystal-beacon-cap'));
 assert.ok(b.placements.filter(p=>p.sourceCrenellation).length>=10);
 assert.equal(occ.get('8,34,8')?.role,'decoration');
 assert.equal(b.architecturalIdentity.beaconOperational,false);
});
test('Snow Rimewatch source is a true twin-tower lighthouse with independent elevation and cap sequences',()=>{
 const b=pick('lighthouse','snow','large'),occ=occupancy(b);
 for(const y of [8,20,29,34])assert.equal(occ.get(key([7,y,8]))?.role,'roof','main tower source plate y'+y);
 for(const y of [8,17,22])assert.equal(occ.get(key([31,y,32]))?.role,'roof','secondary tower source cap y'+y);
 assert.ok(occ.has('7,37,8'),'high main tower source finial absent');
 assert.ok(b.placements.filter(p=>p.towerProfile==='rimewatch-shorter-independent-rear-watch-turret').length>=40);
 assert.ok(b.placements.filter(p=>p.sourceCrenellation).length>=10);
 assert.equal(b.architecturalIdentity.beaconsActive,false);
 assert.equal(b.architecturalIdentity.verticalTraversal,false);
});
test('M2f every roof-to-wall tier transition has physical capped support and no fabricated upstairs walk spaces',()=>{
 for(const b of make().filter(x=>x.category==='lighthouse')){
  const occ=occupancy(b),upper=b.placements.filter(p=>p.towerProfile&&p.role==='wall'&&p.at[1]>=9);
  assert.ok(upper.length>=250);
  for(const p of upper){
   const below=occ.get(key([p.at[0],p.at[1]-1,p.at[2]]));
   if(below?.role==='window'){
    // A stone-header bridge above an unapproved slit has 2 lateral bearings;
    // pane geometry/support/weather are NOT certified to carry vertical load.
    const x=p.at[0],y=p.at[1],z=p.at[2];
    const bearings=[[[x-1,y,z],[x+1,y,z]],[[x,y,z-1],[x,y,z+1]]];
    assert.ok(bearings.some(pair=>pair.every(at=>{
      const side=occ.get(key(at)),foot=occ.get(key([at[0],y-1,at[2]]));
      return side?.role==='wall'&&foot?.role==='wall';
    })),'tower slit lacks two actual side masonry header bearings '+b.id+' '+key(p.at));
   }else assert.ok(['wall','roof'].includes(below?.role),
    'upper tier wall physically floating '+b.id+' '+key(p.at));
  }
  assert.ok(b.walkable.every(p=>p[1]===1),'unapproved elevated tower floor sneaked into walking graph');
 }
});
