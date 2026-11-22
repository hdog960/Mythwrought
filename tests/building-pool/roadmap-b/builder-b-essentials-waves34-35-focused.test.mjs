// MYTHWROUGHT Builder B original Waves34–35 focused source contracts.
// Authentic original sourcePlan, physical paving, source-supported roofing,
// real unheated stone silos, four-high glass and strict eight-way D4.
// Does NOT run the shared 228-original historical census, real WebGL2,
// Pack3/Pack4 installed physics, iPhone, worlds, saves or settlement placement.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCoppermesaCombLaneHarvestBarn,COPPERMESA_COMB_HARVEST_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave34.mjs';
import {buildFrostmereThreeCourtBathLodge,FROSTMERE_THREE_COURT_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave35.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildDuneharpSpiralGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildWistermereCrescentBaths} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=a=>a.join(',');
const face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const cases=[
 {fn:buildCoppermesaCombLaneHarvestBarn,id:COPPERMESA_COMB_HARVEST_ID,
  category:'farm-barn',biome:'desert',size:'medium',cells:15848,
  roofCells:3678,walkCells:3687,windowCells:56,rooms:14,portals:20,
  roofWings:8,roofKey:'originalCoppermesaRoofWing',
  courts:[[27,25,42,37],[13,49,20,56]],extraPaving:184,
  pavedKey:'genuineGroundedCombLaneCells',endpoints:[[19,70],[51,70]],
  windowLevels:[2,3],glazingBays:22,
  prior:[buildBriarfordSwitchwingBarn,buildMossveilTwinCourtSporeGranary,buildDuneharpSpiralGranary]},
 {fn:buildFrostmereThreeCourtBathLodge,id:FROSTMERE_THREE_COURT_ID,
  category:'bathhouse',biome:'snow',size:'medium',cells:14333,
  roofCells:3604,walkCells:3755,windowCells:132,rooms:15,portals:21,
  roofWings:9,roofKey:'originalFrostmereRoofWing',
  courts:[[26,25,41,38],[13,48,21,55],[52,49,60,56]],extraPaving:183,
  pavedKey:'realRooflessPromenadeCells',endpoints:[[18,69],[53,69]],
  windowLevels:[2,3,4,5],glazingBays:33,
  prior:[buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse,buildWistermereCrescentBaths]}
];
function d4(b,mirror,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),
   A=mirror?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }
 return out;
}
const iou=(a,b)=>{let overlap=0;for(const key of a)if(b.has(key))overlap++;return overlap/(a.size+b.size-overlap||1)};
test('Wave34 and35 source IDs are precisely B115-only, never accepted 228 or frozen D92, and detached from live/save systems',()=>{
 const o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 for(const spec of cases){
  const b=spec.fn();
  assert.equal(b.id,spec.id);assert.equal(b.category,spec.category);
  assert.equal(b.biome,spec.biome);assert.equal(b.size,spec.size);
  assert.ok(o.builderBIds.includes(b.id),'unassigned Builder B original '+b.id);
  assert.ok(!o.builderDAvailableIds.includes(b.id),'Builder D reserved ID collision '+b.id);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const fn of spec.prior)assert.notEqual(structuralFingerprint(b),structuralFingerprint(fn()));
 }
});
test('Original 7282 Pack3 roofs have real immediate source backing, all 640 open paved court cells actually walkable, and 41 portal headrooms clear',()=>{
 let roofsTotal=0,courtsTotal=0,portalsTotal=0;
 for(const spec of cases){
  const b=spec.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,spec.cells);
  assert.equal(b.walkable.length,spec.walkCells);
  assert.equal(b.rooms.length,spec.rooms);assert.equal(b.portals.length,spec.portals);
  assert.equal(roofs.length,spec.roofCells);
  assert.equal(new Set(roofs.map(p=>p[spec.roofKey]).filter(Boolean)).size,spec.roofWings);
  for(const p of roofs){
   assert.ok(p.asset.startsWith('pack3:'),'horizontal roof pretends to be Pack4 glass');
   assert.equal(p.occupancy.kind,'unresolved','unearned physical Pack3 producer acceptance');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['support','wall','partition'].includes(below.role),
    'actual source roof bearing missing immediately at '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of spec.courts)for(let x=x0;x<=x1;x++)
   for(let z=z0;z<=z1;z++){
    courtsTotal++;
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','advertised paved court lacks source stone');
    assert.ok(walk.has(K([x,1,z])),'source y1 court is not genuinely accessible');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'original-source sky blocked at '+K([x,y,z]));
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'portal lacks real grounded pedestrian access');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
    'original physical two-high doorway obstructed');
  }
  roofsTotal+=roofs.length;portalsTotal+=b.portals.length;
 }
 assert.deepEqual([roofsTotal,courtsTotal,portalsTotal],[7282,640,41]);
});
test('Both source-ground exterior comb and winter promenades really connect their detached ends via cardinal y1 walking',()=>{
 for(const spec of cases){
  const b=spec.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),[[sx,sz],[gx,gz]]=spec.endpoints;
  assert.equal(b.architecturalIdentity[spec.pavedKey],spec.extraPaving);
  for(const [x,z] of spec.endpoints){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','outboard track missing physical original y0 floor');
   assert.ok(walk.has(K([x,1,z])),'genuine source promenade endpoint not walkable');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K([x,y,z])),'unroofed source promenade has overhead obstruction');
  }
  const start=K([sx,1,sz]),target=K([gx,1,gz]),
   q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const next=K([x+dx,y,z+dz]);
    if(walk.has(next)&&!seen.has(next)){seen.add(next);q.push(next);}
   }
  }
  assert.ok(seen.has(target),'paved source route is not connected between its advertised ends');
 }
});
test('Coppermesa has 2 genuine stone-grounded octagonal silos, 48 backed Pack3 crown cells and twelve high stone-framed Pack4 panes',()=>{
 const b=buildCoppermesaCombLaneHarvestBarn(),
  m=new Map(b.placements.map(p=>[K(p.at),p])),
  towers=[{name:'west-unfilled-grain-silo',x0:7,x1:13,z0:21,z1:29,h:29},
   {name:'east-unfilled-seed-silo',x0:59,x1:65,z0:21,z1:29,h:32}];
 assert.deepEqual(b.architecturalIdentity.sourceSiloWallHeights,[29,32]);
 assert.equal(b.architecturalIdentity.physicallyBackedSiloCrownCells,48);
 assert.equal(b.architecturalIdentity.originalHighPack4Windows,12);
 let crown=0,highTotal=0;
 for(const t of towers){
  let thisCrown=0;
  for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','original silo has no real footing');
   for(let y=1;y<=3;y++)
    assert.equal(m.get(K([x,y,z]))?.asset,'live:stone','silo base is hollow or unsupported');
   const ring=(x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
    !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
   if(!ring)continue;
   for(let y=4;y<=t.h;y++){
    const p=m.get(K([x,y,z]));
    assert.ok(p&&['wall','window'].includes(p.role),'stone silo upper wall incomplete');
    assert.ok(['live:stone','pack4:030'].includes(p.asset),'invalid original silo tier');
   }
   const cap=m.get(K([x,t.h+1,z]));
   assert.equal(cap?.originalBackedSiloCrown,t.name);
   assert.equal(cap?.asset,'pack3:025');
   thisCrown++;
  }
  assert.equal(thisCrown,24,'octagonal grain silo crown is not backed by 24 original stone cells');
  const highs=b.placements.filter(p=>p.realOriginalHighSiloWindow&&
   p.at[0]>=t.x0&&p.at[0]<=t.x1&&p.at[2]>=t.z0&&p.at[2]<=t.z1);
  assert.equal(highs.length,6,'silo has fewer than six actual elevated window apertures');
  for(const p of highs){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(m.get(K([x,y-1,z]))?.role,'wall','no true high window stone sill');
   assert.equal(m.get(K([x,y+1,z]))?.role,'wall','no true high window stone lintel');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'high original silo window faces a blocked neighbor');
  }
  highTotal+=highs.length;crown+=thisCrown;
 }
 assert.deepEqual([crown,highTotal],[48,12]);
 for(const key of ['noLiveGrainOrCropGrowth','liveHarvestMachines',
  'noLiveHeatOrWindOrSandPhysics','upperSiloFloorsNotAccessible'])
  assert.equal(b.architecturalIdentity[key],key==='liveHarvestMachines'?false:true);
});
test('Both buildings have real complete outward Pack4 vertical glass, with solid low sill/top lintel; no post-doorway broken bay',()=>{
 let lowTotal=0,highTotal=0,totalBay=0;
 for(const spec of cases){
  const b=spec.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   glass=b.placements.filter(p=>p.role==='window'),bays=new Map();
  assert.equal(glass.length,spec.windowCells);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved','source falsely claims live Pack4 physical status');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'source exterior window faces another source solid');
   if(spec.id===COPPERMESA_COMB_HARVEST_ID&&p.realOriginalHighSiloWindow){
    highTotal++;
    assert.equal(m.get(K([x,y-1,z]))?.role,'wall');
    assert.equal(m.get(K([x,y+1,z]))?.role,'wall');
   }else{
    lowTotal++;
    assert.ok(spec.windowLevels.includes(y));
    assert.equal(m.get(K([x,1,z]))?.role,'wall');
    assert.equal(m.get(K([x,spec.windowLevels.at(-1)+1,z]))?.role,'wall');
    const key=x+','+z;if(!bays.has(key))bays.set(key,new Set());
    bays.get(key).add(y);
   }
  }
  assert.equal(bays.size,spec.glazingBays);
  for(const levels of bays.values())
   assert.deepEqual([...levels].sort(),spec.windowLevels,'original source window column incomplete');
  totalBay+=bays.size;
 }
 assert.deepEqual([lowTotal,highTotal,totalBay],[176,12,55]);
});
test('Exactly 48 strict eight-way same-category original D4 transforms all stay under unrelaxed 0.85 threshold',()=>{
 let checked=0;
 for(const spec of cases){
  const actual=spec.fn(),a=d4(actual,false,0);
  for(const priorFn of spec.prior){
   const prior=priorFn();
   for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(a,d4(prior,mirror,turn));checked++;
    assert.ok(score<.85,'source copy '+actual.id+' vs '+prior.id+' IoU='+score);
   }
  }
 }
 assert.equal(checked,48);
});
