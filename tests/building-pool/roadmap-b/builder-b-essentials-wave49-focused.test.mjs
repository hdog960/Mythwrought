// MYTHWROUGHT Builder B Wave49 authentic original-source native Node22 gates.
// Focused only: do NOT rerun the complete original accepted-228 history here.
// The exact original source compiler executes on imports, but this test never
// approves live Pack3/4 collision, weather, crops, settlement, saves or PWA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBrackenmereThreeSiloCrossyardGranary,BRACKENMERE_THREE_SILO_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave49.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildDuneharpSpiralGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildCoppermesaCombLaneHarvestBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave34.mjs';
import {buildSleetgroveRafterLatticeBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave38.mjs';
import {buildGreenbarrowThreeLaneStonecropGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave42.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const old=[
 buildBriarfordSwitchwingBarn,buildMossveilTwinCourtSporeGranary,
 buildDuneharpSpiralGranary,buildCoppermesaCombLaneHarvestBarn,
 buildSleetgroveRafterLatticeBarn,buildGreenbarrowThreeLaneStonecropGranary
];
function d4(b,flip,turn){
 const pts=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  pts.add([x,Y,z,p.role].join('/'));
 }
 return pts;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Wave49 exact B115-only farm-barn slot remains entirely source-only and D92/historical free',()=>{
 const own=getBuilderBServiceOwnership(),b=buildBrackenmereThreeSiloCrossyardGranary();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,BRACKENMERE_THREE_SILO_ID);
 assert.equal(b.id,'r1:farm-barn:temperate:medium:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['farm-barn','temperate','medium']);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Exact original compiler validates 12,626 unique placements, 3,324 connected walks and 20 two-high portals',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary();
 assert.deepEqual(b.footprint,{width:60,height:32,depth:81});
 assert.equal(b.placements.length,12626);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,12626);
 assert.equal(b.walkable.length,3324);
 assert.equal(b.rooms.length,16);assert.equal(b.portals.length,20);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,49);
});
test('2,885 original candidate Pack3 roof cells are each directly backed and have nine real nonempty distinct roof wings and 36 silo crowns',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map(),
  crowns=roofs.filter(p=>p.originalStoneBackedBinCrown);
 assert.equal(roofs.length,2885);assert.equal(crowns.length,36);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);
  assert.equal(p.occupancy.kind,'unresolved');
  const base=m.get(K(x,y-1,z));
  assert.ok(['wall','partition','support'].includes(base?.role),'false direct Pack3 source backing '+p.at);
  if(p.brackenmereActualCoveredWing)
   wings.set(p.brackenmereActualCoveredWing,(wings.get(p.brackenmereActualCoveredWing)||0)+1);
 }
 assert.equal(wings.size,9,'nine separately labeled roof plans required');
 for(const [name,count]of wings)assert.ok(count>=60,'ghost roof wing '+name);
});
test('Original full-height source roof posts have continuous true stone or support cells from y0 to original under-roof bearer',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  authored=b.placements.filter(p=>p.purpose?.startsWith('grounded-Brackenmere-barn-roof-bearer-'));
 const groups=new Map();
 for(const p of authored){
  const name=p.purpose.slice('grounded-Brackenmere-barn-roof-bearer-'.length);
  if(!groups.has(name))groups.set(name,[]);
  groups.get(name).push(p);
 }
 assert.equal(groups.size,9);
 for(const [name,ps]of groups){
  assert.ok(ps.length>=1);
  const [x,,z]=ps[0].at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  const yRoof=b.placements.find(p=>p.brackenmereActualCoveredWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(yRoof),'true roof site missing '+name);
  for(let y=1;y<yRoof;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'physical column disconnected under genuine roof '+name+' '+K(x,y,z));
 }
});
test('Three independent genuine open courtyard shapes form 252 sky-exposed walkable stone-founded full-height columns',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [x0,z0,x1,z1] of [[26,24,34,34],[10,44,17,52],[44,44,52,52]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   total++;
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walks.has(K(x,1,z)),'courtyard cell blocked '+K(x,1,z));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'roofless court has obstruction '+K(x,y,z));
  }
 assert.equal(total,252);
});
test('Three genuine stone grain markers each have a fully filled 25-cell 3-tier base, continuous 12-cell 12-tier upper ring and 12 directly stone-backed crown caps',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let lower=0,ringCells=0,caps=0;
 for(const [name,cx,cz]of [['west-solid-base-bin',15,70],['center-solid-base-bin',31,70],['east-solid-base-bin',49,70]]){
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   for(let y=1;y<=3;y++){
    lower++;
    assert.equal(m.get(K(x,y,z))?.physicalOriginalSolidBinLowerBody,name);
   }
   assert.ok(!walks.has(K(x,1,z)),'phantom y1 walking inside solid stone silo');
   const dx=Math.abs(x-cx),dz=Math.abs(z-cz),
    onRing=(dx===2||dz===2)&&!(dx===2&&dz===2);
   if(!onRing)continue;
   for(let y=4;y<=15;y++){
    ringCells++;
    assert.equal(m.get(K(x,y,z))?.sourceTrulyContinuousSiloRing,name);
   }
   const crown=m.get(K(x,16,z));
   assert.equal(crown?.originalStoneBackedBinCrown,name);
   assert.equal(crown?.occupancy.kind,'unresolved');
   assert.equal(m.get(K(x,15,z))?.asset,'live:stone');
   caps++;
  }
 }
 assert.deepEqual([lower,ringCells,caps],[225,432,36]);
 assert.equal(b.architecturalIdentity.workingStorage,false);
 assert.equal(b.architecturalIdentity.workingMilling,false);
});
test('All 20 portals have a true foundation and two-high y1/y2 clear original source, including three barn-to-outdoor links',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walks.has(K(x,y,z)),'portal source occupied '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'two-high portal recollided '+p.at);
 }
 for(const [x,z] of [[15,62],[31,57],[49,62]]){
  assert.ok(walks.has(K(x,1,z)),'false actual barn-to-outside connection '+K(x,1,z));
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
 }
});
test('Three true grounded loading stone arms join by outside-only cardinal BFS with no borrowing of indoor source roofs',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(','))),
  start=K(17,1,78),goal=K(49,1,78),queue=[start],seen=new Set(queue);
 for(let i=0;i<queue.length;i++){
  const [x,,z]=queue[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<75||!walks.has(k)||seen.has(k))continue;
   seen.add(k);queue.push(k);
  }
 }
 assert.ok(seen.has(goal),'three-branch exterior loading loop disconnected');
 assert.equal(seen.size,230);
 for(const x of [17,31,49]){
  assert.equal(m.get(K(x,0,78))?.asset,'live:stone');
  assert.ok(walks.has(K(x,1,78)));
 }
 assert.equal(b.architecturalIdentity.originalSourceOutdoorStoneCells,621);
});
test('51 outward unresolved Pack4 panes form 17 complete source stone-sill and header three-high glass bays',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  windows=b.placements.filter(p=>p.role==='window'),groups=new Map();
 assert.equal(windows.length,51);
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,5,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,5,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'window faces source wall');
  const k=x+','+z;if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,17);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4]);
});
test('48 unchanged STRICT D4 novelty comparisons against six genuine earlier same-category originals <0.85',()=>{
 const b=buildBrackenmereThreeSiloCrossyardGranary(),a=d4(b,false,0);
 let compared=0,maxIoU=0,nearest=null;
 for(const fn of old){
  const peer=fn();
  assert.notEqual(peer.id,b.id);
  assert.notEqual(structuralFingerprint(peer),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const v=iou(a,d4(peer,flip,t));compared++;
   if(v>maxIoU){maxIoU=v;nearest=peer.id;}
   assert.ok(v<.85,'real earlier farm-barn geometry near-duplicate '+peer.id+' '+v);
  }
 }
 assert.equal(compared,48);
 console.log('BRACKENMERE_AUTHENTIC_STRICT_48_D4_PASS '+JSON.stringify({compared,maxIoU,nearest}));
});
