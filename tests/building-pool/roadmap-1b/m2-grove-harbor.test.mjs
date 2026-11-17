// Builder 1B M2g: nine fixed-coordinate asymmetric services, source-exact native
// acceptance; no runtime/Pack/automation or sibling writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2GroveHarbor1BPlans} from '../../../src/building-pool/roadmap-1b/m2-grove-harbor.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,BIOMES,SIZES,QUOTAS} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=p=>p.join(',');
const group=()=>getM2GroveHarbor1BPlans();
const select=(c,b,s)=>group().find(x=>x.category===c&&x.biome===b&&x.size===s);
const map=b=>new Map(b.placements.map(p=>[key(p.at),p]));
const roofs=b=>b.placements.filter(p=>p.role==='roof');
const profiles=b=>new Set(roofs(b).map(p=>p.roofProfile));
function connected(b){
 const allowed=new Set(b.walkable.map(key)),seen=new Set([key(b.walkable[0])]),q=[b.walkable[0]];
 for(let i=0;i<q.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const p=[q[i][0]+dx,1,q[i][2]+dz],k=key(p);
  if(allowed.has(k)&&!seen.has(k)){seen.add(k);q.push(p)}
 }
 return seen.size===allowed.size;
}
function shaped(b,flip,turn){
 const w=b.footprint.width,d=b.footprint.depth;
 const cells=new Set();
 for(const p of b.placements){
  let [x,y,z]=p.at;if(flip)x=w-1-x;
  if(turn===1)[x,z]=[z,w-1-x];
  if(turn===2)[x,z]=[w-1-x,d-1-z];
  if(turn===3)[x,z]=[d-1-z,x];
  cells.add([x,y,z,p.role].join('/'));
 }
 return cells;
}
test('M2g real 164/435 authored census; 15 byte-exact inherited stables; category and biome-size quotas',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),new9=group(),count=validateAllocation(all);
 assert.equal(all.length,164);assert.equal(count.authored,164);assert.equal(count.remaining,271);
 assert.equal(old.length,15);assert.equal(new9.length,9);
 assert.equal(new Set(all.map(p=>p.id)).size,164);
 assert.equal(new Set(all.map(p=>structuralFingerprint(p))).size,164);
 assert.equal(new Set(new9.map(p=>p.architecturalIdentity.program)).size,9);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(p=>p.category===k).length])),
  {'bathhouse':23,stable:28,'farm-barn':22,greenhouse:23,'fishing-lodge':21,'harbor-office':20,lighthouse:21});
 for(const inherited of old)
  assert.equal(stableBlueprintJSON(all.find(p=>p.id===inherited.id)),stableBlueprintJSON(inherited),
   'inherited source cells changed '+inherited.id);
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===category&&p.biome===biome&&p.size===size).length<=QUOTAS[category]);
});
test('M2g every source model genuinely 3D, nonrectangular, roof-bearing and deterministic',()=>{
 let placements=0;
 for(const b of group()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1400,b.id+' not fully occupied architecture');
  placements+=b.placements.length;
  const foundation=b.placements.filter(p=>p.role==='foundation');
  const box=(b.footprint.width-2)*(b.footprint.depth-2);
  assert.ok(foundation.length/box<0.80,b.id+' no meaningful missing-corner footprint');
  assert.ok(b.rooms.length>=3&&b.portals.length>=3);
  assert.ok(b.walkable.length>250&&connected(b),b.id+' disconnected walking');
  assert.ok(roofs(b).length>=350&&profiles(b).size>=2);
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.deepEqual(b.dependencies.map(x=>x.asset),['pack4:030']);
  assert.equal(b.dependencies[0].status,'unresolved');
  assert.ok(b.dependencies[0].requires.length===3);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(group().find(x=>x.id===b.id)));
  const occ=map(b),walk=new Set(b.walkable.map(key));
  for(const p of b.portals){
   assert.ok(walk.has(key(p.at)),b.id+' blocked portal '+p.to);
   assert.ok(!occ.has(key(p.at))&&!occ.has(key([p.at[0],p.at[1]+1,p.at[2]])),
    b.id+' occupied 2-high doorway '+p.to);
  }
 }
 assert.equal(placements,25454);
});
test('M2g 51 roof post heads each connect a physical source foundation to an occupied source roof',()=>{
 let total=0;
 for(const b of group()){
  const occ=map(b);
  const heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=4);
  for(const p of heads){
   assert.equal(occ.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' foundation missing');
   assert.equal(occ.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role,'roof',b.id+' floating roof');
   total++;
  }
 }
 assert.equal(total,51);
});
test('M2g source XYZ role comparison rejects rotations, mirrors and near-geometric duplicates at 0.89',()=>{
 const all=get1BCandidates(),fresh=group();
 for(const b of fresh){
  const A=shaped(b,false,0);
  for(const other of all){
   if(other.id===b.id||other.category!==b.category)continue;
   // Exact D4 source-vocabulary Jaccard; exclude pure relabeling.
   for(const flip of [false,true])for(let t=0;t<4;t++){
    const B=shaped(other,flip,t);
    if(Math.abs(A.size-B.size)>Math.max(A.size,B.size)*0.25)continue;
    let common=0;for(const k of A)if(B.has(k))common++;
    const score=common/(A.size+B.size-common);
    assert.ok(score<0.89,b.id+' nearly mirrors '+other.id+' Jaccard '+score);
   }
  }
 }
});
test('Temperate large Branchglass is physical fork around absent center garden, not rectangular glass',()=>{
 const b=select('greenhouse','temperate','large'),occ=map(b);
 assert.ok(!occ.has('15,0,21')&&occ.has('8,0,21')&&occ.has('23,0,21'));
 assert.ok(occ.has('20,0,33')&&profiles(b).size===4);
 assert.equal(b.architecturalIdentity.waterMechanics,false);
});
test('Desert medium Sunneedle greenhouse physically zigzags west with raised Pack4 glass ridge',()=>{
 const b=select('greenhouse','desert','medium'),occ=map(b);
 assert.ok(!occ.has('25,0,26')&&occ.has('9,0,26')&&occ.has('15,0,16'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='sunneedle-narrow-glazed-light-ridge'&&p.asset==='pack4:030'));
 assert.equal(b.architecturalIdentity.irrigation,false);
});
test('Mountain small Keystone greenhouse makes a three-part backtracking source S',()=>{
 const b=select('greenhouse','mountain','small'),occ=map(b);
 assert.ok(!occ.has('5,0,15')&&occ.has('17,0,15')&&occ.has('8,0,24'));
 assert.equal(profiles(b).size,3);
 assert.equal(b.architecturalIdentity.growing,false);
});
test('Desert large Saltmoon dry fishing pier has three separated original roof masses and a cut-back lower deck',()=>{
 const b=select('fishing-lodge','desert','large'),occ=map(b);
 assert.ok(!occ.has('7,0,20')&&occ.has('23,0,20')&&occ.has('20,0,32'));
 assert.equal(profiles(b).size,3);
 assert.equal(b.architecturalIdentity.boats,false);
});
test('Mountain small Shalehook lodge truly turns from west hallway to right-hand upper lookout',()=>{
 const b=select('fishing-lodge','mountain','small'),occ=map(b);
 assert.ok(!occ.has('18,0,16')&&occ.has('6,0,16')&&occ.has('17,0,24'));
 assert.equal(profiles(b).size,3);
 assert.equal(b.architecturalIdentity.fishing,false);
});
test('Desert large Suncharter customs has a strong central corridor and distinct east administrative spur',()=>{
 const b=select('harbor-office','desert','large'),occ=map(b);
 assert.ok(!occ.has('5,0,20')&&occ.has('18,0,20')&&occ.has('34,0,37'));
 assert.ok(profiles(b).size===4);
 assert.equal(b.architecturalIdentity.harborEconomy,false);
});
test('Enchanted large Moonharbor has H cloister crosspass and two source-open opposite gardens',()=>{
 const b=select('harbor-office','enchanted-forest','large'),occ=map(b);
 assert.ok(!occ.has('19,0,14')&&!occ.has('19,0,34'));
 assert.ok(occ.has('6,0,19')&&occ.has('19,0,23')&&occ.has('31,0,19'));
 assert.equal(profiles(b).size,4);
 assert.equal(b.architecturalIdentity.magicalBeacons,false);
});
test('Temperate small Brookwatch has a broad faceted stage, narrow lantern crown, roof caps and true crenels',()=>{
 const b=select('lighthouse','temperate','small'),occ=map(b);
 for(const y of [8,17,22])assert.equal(occ.get(key([6,y,7]))?.role,'roof','missing tower source cap y'+y);
 assert.ok(b.placements.filter(p=>p.towerProfile==='brookwatch-oak-stone-eight-sided-shaft').length>=100);
 assert.ok(b.placements.some(p=>p.purpose==='brookwatch-battlement'));
 assert.equal(occ.get('6,25,7')?.role,'decoration');
 assert.equal(b.architecturalIdentity.activeLight,false);
});
test('Mountain large Highcairn upper column forks into two disjoint physically capped unequal-height horns',()=>{
 const b=select('lighthouse','mountain','large'),occ=map(b);
 for(const y of [9,21,30])assert.equal(occ.get(key([9,y,10]))?.role,'roof','missing main tower cap '+y);
 assert.equal(occ.get('6,36,13')?.role,'roof');
 assert.equal(occ.get('12,38,7')?.role,'roof');
 assert.ok(!occ.has('9,35,10'),'fork gap must remain real sky');
 assert.equal(occ.get('6,39,13')?.role,'decoration');
 assert.equal(occ.get('12,41,7')?.role,'decoration');
 assert.ok(b.placements.filter(p=>p.towerProfile==='highcairn-west-forked-stone-pylon').length>40);
 assert.ok(b.placements.filter(p=>p.towerProfile==='highcairn-east-taller-wind-pylon').length>40);
 assert.equal(b.architecturalIdentity.lightsOperational,false);
});

test('M2h Highcairn horn screen silhouettes have positive sky gap at all three exact iPhone CSS viewports',()=>{
 const b=select('lighthouse','mountain','large'),occ=map(b);
 const west=b.placements.filter(p=>p.towerProfile==='highcairn-west-forked-stone-pylon');
 const east=b.placements.filter(p=>p.towerProfile==='highcairn-east-taller-wind-pylon');
 assert.ok(west.length>40&&east.length>40,'both must be genuine multi-height source walls');
 // Include every rendered unit-cube corner: x+1 extends the western edge and
 // z+1 moves the eastern minimum LEFT in the actual (x-z) isometric projection.
 const westMax=Math.max(...west.map(p=>p.at[0]+1-p.at[2]));
 const eastMin=Math.min(...east.map(p=>p.at[0]-(p.at[2]+1)));
 assert.ok(eastMin>westMax,'source cubes cannot overlap in horizontal projection');
 const {width:W,depth:D,height:H}=b.footprint;
 for(const [w,h] of [[667,375],[844,390],[932,430]]){
  const scale=Math.min(w*.86/((W+D)*.7071068),h*.72/((W+D)*.4082483+H*.9));
  const px=(eastMin-westMax)*.7071068*scale;
  assert.ok(px>=9.5,'Highcairn visible sky gap too small at '+w+'x'+h+': '+px+'px');
 }
 // Both horn footprints must bear on source-authored platform voxels y=30.
 const foot=(parts)=>new Set(parts.filter(p=>p.at[1]===31).map(p=>p.at[0]+','+p.at[2]));
 for(const [name,parts] of [['west',west],['east',east]])
  for(const point of foot(parts)){
   const [x,z]=point.split(',').map(Number);
   assert.equal(occ.get(key([x,30,z]))?.role,'roof',name+' upper wall unsupported at '+point);
  }
 assert.equal(b.architecturalIdentity.hornRoofBearingCertified,false);
});
