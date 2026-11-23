// MYTHWROUGHT Builder B Roadmap B Wave54 focused original native Node22 tests.
// Staged for a complete original checkout; isolated JS V8 source execution
// is NOT native Node, full accepted228 historic D4, Pack3/4 live physics
// or real iPhone PWA acceptance. Never relax original >=0.85 D4 exclusion.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSolglassFourTerraceSunhouse,SOLGLASS_FOUR_TERRACE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave54.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildAuroracrestFoldedFrostSeedhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildWillowglassTripleAtriumConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs';
import {buildSilverpineFourCourtWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave37.mjs';
import {buildMoonfernTriskelionArboretum} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave40.mjs';
import {buildFrostmerefoldFourCourtWinterConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave48.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const peers=[
 buildAlderglassTrellisConservatory,buildRimeglassCrescentSunGreenhouse,
 buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory,
 buildAuroracrestFoldedFrostSeedhouse,buildCrystalfenStaggeredWinterglass,
 buildStarpetalDoubleGardenOrchidarium,buildWillowglassTripleAtriumConservatory,
 buildSilverpineFourCourtWinterglass,buildMoonfernTriskelionArboretum,
 buildFrostmerefoldFourCourtWinterConservatory
];
const beds=[
 ['west-dry-seed-terrace',17,83],
 ['westcenter-dry-seed-terrace',35,84],
 ['eastcenter-dry-seed-terrace',46,84],
 ['east-dry-seed-terrace',63,83]
];
const markers=[
 ['west-north-shadow',10,82],['west-south-shadow',10,88],
 ['east-north-shadow',71,82],['east-south-shadow',71,88]
];
function d4(v,flip,t){
 const s=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Frozen B115 exclusive desert LARGE greenhouse #003, no original D92/228 or world integration',()=>{
 const b=buildSolglassFourTerraceSunhouse(),own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,SOLGLASS_FOUR_TERRACE_ID);
 assert.equal(b.id,'r1:greenhouse:desert:large:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['greenhouse','desert','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('True original blueprint compiler validates exactly 19,679 unique source voxels, 5,620 connected y1 walks and 30 genuine portals',()=>{
 const b=buildSolglassFourTerraceSunhouse();
 assert.deepEqual(b.footprint,{width:80,height:38,depth:94});
 assert.equal(b.placements.length,19679);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,19679);
 assert.equal(b.walkable.length,5620);
 assert.equal(b.rooms.length,21);assert.equal(b.portals.length,30);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,54);
});
test('4,649 real candidate Pack3 roof cells each have immediate original solid backing and twelve nonempty distinct roofs',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,4649);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),
   'original source roof has no direct solid backing '+K(x,y,z));
  assert.ok(p.solglassActuallyCoveredRoofWing,'unexpected unowned Pack3 candidate roof');
  wings.set(p.solglassActuallyCoveredRoofWing,(wings.get(p.solglassActuallyCoveredRoofWing)||0)+1);
 }
 assert.equal(wings.size,12);
 for(const [name,cellCount] of wings)assert.ok(cellCount>=80,'phantom source roof wing '+name);
});
test('All twelve stone-bearing roof columns are solid from actual original y0 foundation to corresponding covered roof underside',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  postPieces=b.placements.filter(p=>p.purpose?.startsWith('solglass-true-solid-original-bearing-')),
  first=new Map();
 for(const p of postPieces){
  const name=p.purpose.slice('solglass-true-solid-original-bearing-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,12);
 for(const [name,[x,,z]] of first){
  const roof=b.placements.find(p=>p.solglassActuallyCoveredRoofWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,'missing actual original roof site for load-bearing post '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<roof.at[1];y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'source bearing stone column removed by late doorway/pane '+name+' '+K(x,y,z));
 }
});
test('All five stone-founded courts are really open to full original sky height across 482 walkable source columns',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [x0,z0,x1,z1] of [
  [34,24,45,35],[14,44,22,53],[57,44,65,53],[35,55,45,64],[21,57,26,64]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walks.has(K(x,1,z)),'court original floor not walkable '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'source sky court unexpectedly covered '+K(x,y,z));
 }
 assert.equal(n,482);
});
test('Four original dry 5x7 stone terraces have true foundation, 140 solid y1 bottom cells, 80 raised y2 perimeter cells and 60 empty inner overheads',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let bases=0,rims=0,empty=0;
 for(const [name,cx,cz] of beds)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-3;z<=cz+3;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.equal(m.get(K(x,1,z))?.solglassOriginalSolidDryPlantPlate,name);
   assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
   assert.ok(!walks.has(K(x,1,z)),'raised terrace phantom walk');
   bases++;
   const rim=x===cx-2||x===cx+2||z===cz-3||z===cz+3;
   if(rim){
    assert.equal(m.get(K(x,2,z))?.solglassRealStoneBedRim,name);
    assert.equal(m.get(K(x,2,z))?.asset,'live:stone');
    rims++;
   }else{assert.ok(!m.has(K(x,2,z)),'interior terrace canopy not actually open');empty++}
  }
 assert.deepEqual([bases,rims,empty],[140,80,60]);
 assert.equal(b.architecturalIdentity.cropGrowth,false);
 assert.equal(b.architecturalIdentity.workingIrrigation,false);
});
test('Four original 3x3x3 masonry windbreak markers have 108 continuous y1-3 stone cells with no original phantom walking',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [name,cx,cz] of markers)
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(!walks.has(K(x,1,z)),'solid windbreak falsely walkable');
   for(let y=1;y<=3;y++){
    count++;assert.equal(m.get(K(x,y,z))?.solglassSolidOriginalSunMarker,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
   }
  }
 assert.equal(count,108);
 assert.equal(b.architecturalIdentity.sunlightMechanics,false);
});
test('All 30 actual named source portals preserve stone y0 support and two-high clear cardinal entry, never cutting terraces',()=>{
 const b=buildSolglassFourTerraceSunhouse(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,30);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walks.has(K(x,y,z)),'source portal floor blocked '+K(x,y,z));
  assert.ok(!m.has(K(x,y+1,z)),'source portal head blocked '+K(x,y+1,z));
  assert.ok(!m.get(K(x,y,z))?.solglassOriginalSolidDryPlantPlate);
 }
});
test('Four real outdoor terrace approaches remain cardinally walkable up to each solid raised bed without crossing any planting cells',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 const start=K(40,1,91);
 let proven=0;
 for(const [name,cx,cz] of beds){
  const target=K(cx,1,cz+4),q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=z+dz,k=K(X,1,Z);
    if(Z<78||seen.has(k)||!walk.has(k))continue;
    assert.ok(!m.get(k)?.solglassOriginalSolidDryPlantPlate,'walk goes through solid terracing');
    seen.add(k);q.push(k);
   }
  }
  assert.ok(seen.has(target),'dry terrace physically inaccessible from south '+name);
  assert.equal(m.get(K(cx,1,cz+3))?.solglassOriginalSolidDryPlantPlate,name);
  assert.equal(m.get(K(cx,0,cz+4))?.asset,'live:stone');
  proven++;
 }
 assert.equal(proven,4);
});
test('Three open-air outer walking arms connect only by outside cardinal z>=89 stone walking, not borrowing roofed indoor routes',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(19,1,91),end=K(62,1,91),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<89||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(end),'real outside walking source path disconnected');
 assert.equal(seen.size,258);
 for(const x of [19,40,62]){
  assert.equal(m.get(K(x,0,91))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,91)));
 }
});
test('135 original unresolved Pack4 candidate pane cells form exactly 27 outward five-high fully stone-framed bays',()=>{
 const b=buildSolglassFourTerraceSunhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),
  dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(glass.length,135);
 for(const p of glass){
  const [x,y,z]=p.at,d=dirs[p.orientation],key=x+','+z;
  assert.ok(d,'bad pane direction');
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'window faces physically solid outside');
  if(!groups.has(key))groups.set(key,new Set());
  groups.get(key).add(y);
 }
 assert.equal(groups.size,27);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Strict original 0.85 D4 gate: 88 actual transforms of eleven authentic earlier greenhouses, no identical fingerprints or ownership duplicates',()=>{
 const b=buildSolglassFourTerraceSunhouse(),src=d4(b,false,0);
 let comparisons=0,maxIoU=0,closest=null;
 for(const fn of peers){
  const old=fn();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const v=iou(src,d4(old,flip,t));
   comparisons++;
   if(v>maxIoU){maxIoU=v;closest=old.id}
   assert.ok(v<.85,'strict original greenhouse clone '+old.id+' '+v);
  }
 }
 assert.equal(comparisons,88);
 console.log('SOLGLASS_AUTHENTIC_11_PEERS_88_D4_PASS '+JSON.stringify({comparisons,maxIoU,closest}));
});
