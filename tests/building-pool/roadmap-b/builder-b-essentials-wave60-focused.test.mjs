// MYTHWROUGHT Builder B Wave60 focused native Node22-ELIGIBLE test source.
// Staged original source tests; isolated V8 callback execution is NOT
// native Node full repository, Pack3/4, browser WebGL2 or iPhone PWA.
// Do not lower strict source D4 rejection at >= 0.85.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildHazelspireFourDrySeedTerraceConservatory,HAZELSPIRE_FOUR_TERRACE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave60.mjs';
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
import {buildSolglassFourTerraceSunhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave54.mjs';
const peers=[
 buildAlderglassTrellisConservatory,
 buildRimeglassCrescentSunGreenhouse,
 buildGlimmerboughSplitSunOrchidHouse,
 buildAmberwellSandglassConservatory,
 buildAuroracrestFoldedFrostSeedhouse,
 buildCrystalfenStaggeredWinterglass,
 buildStarpetalDoubleGardenOrchidarium,
 buildWillowglassTripleAtriumConservatory,
 buildSilverpineFourCourtWinterglass,
 buildMoonfernTriskelionArboretum,
 buildFrostmerefoldFourCourtWinterConservatory,
 buildSolglassFourTerraceSunhouse
];
const beds=[
 ['western-fern-slate-bed',13,77],['western-seed-slate-bed',33,77],
 ['eastern-seed-slate-bed',55,77],['eastern-amber-slate-bed',75,77]
];
const K=(x,y,z)=>[x,y,z].join(',');
function walkSource(b){
 return {m:new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk:new Set(b.walkable.map(p=>p.join(',')))};
}
function bfs(start,m,walk,allow){
 const q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(!allow(X,Z)||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
   seen.add(k);q.push(k);
  }
 }
 return seen;
}
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
test('Frozen B115-only temperate large greenhouse #004 has no D92/accepted228 or live registration',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 assert.equal(b.id,HAZELSPIRE_FOUR_TERRACE_ID);
 assert.equal(b.id,'r1:greenhouse:temperate:large:004');
 assert.ok(o.builderBIds.includes(b.id));
 assert.ok(!o.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['greenhouse','temperate','large']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Authentic original schema validates 22887 unique source voxels and 6583 connected original walks, 21 rooms, 30 portals',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory();
 assert.deepEqual(b.footprint,{width:88,height:38,depth:94});
 assert.equal(b.placements.length,22887);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,22887);
 assert.equal(b.walkable.length,6583);
 assert.equal(b.rooms.length,21);assert.equal(b.portals.length,30);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,60);
});
test('Every one of 7560 actual contiguous original stone y0 foundation cells supports halls, plots and exterior',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m}=walkSource(b);
 let n=0;
 for(let x=2;x<=85;x++)for(let z=2;z<=91;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
 }
 assert.equal(n,7560);
});
test('4681 genuine unresolved Pack3 roofs immediately solid-backed across twelve actual distinct >=50-cell wings',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m}=walkSource(b),
  roofs=b.placements.filter(p=>p.role==='roof'),names=new Map();
 assert.equal(roofs.length,4681);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),'roof backing missing '+p.at);
  const n=p.hazelspireActuallyOccupiedNamedRoofWing;
  assert.ok(n,'genuine original roof wing missing');
  names.set(n,(names.get(n)||0)+1);
 }
 assert.equal(names.size,12);
 for(const [name,n]of names)assert.ok(n>=50,'overlapped ghost wing '+name+' '+n);
 assert.equal(names.get('south-outer-seed-vestibule'),51);
});
test('Twelve separate stone-grounded roof bearings remain fully solid to their named roof after portals and glass edits',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m}=walkSource(b),
  parts=b.placements.filter(p=>p.purpose?.startsWith('hazelspire-source-continuous-stone-roof-post-')),
  first=new Map();
 for(const p of parts){
  const n=p.purpose.slice('hazelspire-source-continuous-stone-roof-post-'.length);
  if(!first.has(n))first.set(n,p.at);
 }
 assert.equal(first.size,12);
 for(const [n,[x,,z]]of first){
  const top=b.placements.find(p=>p.hazelspireActuallyOccupiedNamedRoofWing===n&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'no actual roof at source support '+n);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),'broken original bearing '+n+' '+K(x,y,z));
 }
});
test('Four real sky-open source courts total 434 genuinely walkable stone-founded fully empty original columns',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b);
 let n=0;
 for(const [x0,z0,x1,z1]of [
  [36,25,47,36],[17,41,25,50],[63,41,71,50],[39,53,48,63]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'court source walking false');
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'court original sky obstruction '+K(x,y,z));
 }
 assert.equal(n,434);
});
test('Four distinct real 9x9 source stone DRY seed terraces contain 324 nonwalkable original y1 stone bases',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b);
 let stone=0;
 for(const[name,cx,cz]of beds)
  for(let x=cx-4;x<=cx+4;x++)for(let z=cz-4;z<=cz+4;z++){
   stone++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.equal(m.get(K(x,1,z))?.hazelspireActuallySolidNineByNineDrySeedBed,name);
   assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'solid terrace ghost walking');
  }
 assert.equal(stone,324);
 assert.equal(b.architecturalIdentity.liveSeedCrops,false);
});
test('Exactly 128 literal y2 raised original stone terrace rim cells and 196 truly empty upper interior cells',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m}=walkSource(b);
 let rims=0,empty=0;
 for(const[name,cx,cz]of beds)
  for(let x=cx-4;x<=cx+4;x++)for(let z=cz-4;z<=cz+4;z++){
   if(x===cx-4||x===cx+4||z===cz-4||z===cz+4){
    rims++;assert.equal(m.get(K(x,2,z))?.hazelspireRealRaisedStoneSeedBedRim,name);
    assert.equal(m.get(K(x,2,z))?.asset,'live:stone');
   }else{empty++;assert.ok(!m.has(K(x,2,z)),'upper terrace core blocked');}
  }
 assert.deepEqual([rims,empty],[128,196]);
 assert.equal(b.architecturalIdentity.workingIrrigation,false);
});
test('All four dry bed sides have truly 2-high original y1 walking connection across 1488 stone-yard cardinal BFS cells',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b),
  seen=bfs(K(7,1,72),m,walk,(x,z)=>x>=2&&x<=85&&z>=69&&z<=91);
 let sides=0;
 for(const[name,cx,cz]of beds)
  for(const[x,z]of [[cx-5,cz],[cx+5,cz],[cx,cz-5],[cx,cz+5]]){
   assert.ok(seen.has(K(x,1,z)),'original dry bed side not physically accessible '+name+' '+K(x,1,z));
   sides++;
  }
 assert.equal(sides,16);
 assert.equal(seen.size,1488);
});
test('Three genuine 3x3x3 full masonry yard windbreaks have 81 actual stone voxels and no phantom walking',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b);
 let n=0;
 for(const[name,cx,cz]of [
  ['western-courtyard-slate-baffle',26,84],
  ['center-courtyard-slate-baffle',44,82],
  ['eastern-courtyard-slate-baffle',62,84]
 ])for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'windbreak phantom walkway');
  for(let y=1;y<=3;y++){
   n++;assert.equal(m.get(K(x,y,z))?.hazelspireAuthenticThreeHighStoneWindbreak,name);
   assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
  }
 }
 assert.equal(n,81);
});
test('Twenty-five genuinely solid raised dry ledger y1 stone cells on original stone foundation, with real y2 head air',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b);
 let n=0;for(let x=42;x<=46;x++)for(let z=85;z<=89;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,1,z))?.hazelspireRealRaisedStoneSeedLedger,true);
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'solid ledger has fake walking');
  assert.ok(!m.has(K(x,2,z)),'ledger y2 source obstructed');
 }
 assert.equal(n,25);
});
test('All 30 real portal positions have original stone y0 and walkable two-high source y1/y2 clearance',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b);
 assert.equal(b.portals.length,30);
 for(const p of b.portals){
  const[x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'actual named source portal blocked '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'original named source portal lacks headroom '+p.at);
 }
});
test('Exterior-only southern five-row walk crosses the entire four-terrace site on 405 truly y1/y2-clear original cells',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m,walk}=walkSource(b),
  seen=bfs(K(5,1,90),m,walk,(x,z)=>x>=2&&x<=85&&z>=87&&z<=91);
 assert.ok(seen.has(K(83,1,90)),'southern crosswalk physically disconnected');
 assert.equal(seen.size,405);
});
test('185 unresolved candidate Pack4 panes are 37 complete genuinely outward five-high original stone-framed bays',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),{m}=walkSource(b),
  panes=b.placements.filter(p=>p.role==='window'),
  faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},bays=new Map();
 assert.equal(panes.length,185);
 for(const p of panes){
  const[x,y,z]=p.at,d=faces[p.orientation],key=x+','+z;
  assert.ok(d,'pane orientation absent');
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'pane faces actual source solid');
  if(!bays.has(key))bays.set(key,new Set());
  bays.get(key).add(y);
 }
 assert.equal(bays.size,37);
 for(const ys of bays.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Twelve genuine prior greenhouse original constructors pass 96 unchanged strict eight-way D4 comparisons with distinct source fingerprints',()=>{
 const b=buildHazelspireFourDrySeedTerraceConservatory(),target=d4(b,false,0);
 let total=0,maxIoU=0,nearest=null;
 for(const create of peers){
  const old=create();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const mirror of [false,true])for(let t=0;t<4;t++){
   const v=iou(target,d4(old,mirror,t));
   total++;
   if(v>maxIoU){maxIoU=v;nearest=old.id;}
   assert.ok(v<0.85,'original greenhouse near-clone '+old.id+' '+v);
  }
 }
 assert.equal(total,96);
 console.log('HAZELSPIRE_REAL_12_GREENHOUSE_PEERS_96_D4_PASS '+JSON.stringify({total,maxIoU,nearest}));
});
