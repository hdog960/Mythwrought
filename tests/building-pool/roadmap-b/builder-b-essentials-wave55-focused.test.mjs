// MYTHWROUGHT Builder B Wave55 focused ORIGINAL-source native Node22 tests.
// Staged for genuine full original repo checkout: isolated V8 JS execution
// does NOT imply Node module imports, browser WebGL2, installed Pack3/4
// physical collider/selection, real water, boats, fishing or iPhone PWA.
// Preserve immutable B115/D92/228 and strict near-duplicate reject >=0.85.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderwakeTripleDrySlipFishingLodge,ALDERWAKE_TRIPLE_DRY_SLIP_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave55.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildFrostlineEightWingIcewatchLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildTidemarkForkedQuayFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs';
import {buildDriftgaleTLandingSnowLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave28.mjs';
import {buildCoppersaltTripleDrySlipLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave39.mjs';
import {buildCattailreachThreeFingerFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave46.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const peers=[
 buildSedgewatchTidehookFishingLodge,buildDunewakeOasisReedworksFishingLodge,
 buildFrostlineEightWingIcewatchLodge,buildTidemarkForkedQuayFishingLodge,
 buildDriftgaleTLandingSnowLodge,buildCoppersaltTripleDrySlipLodge,
 buildCattailreachThreeFingerFishingLodge
];
const slips=[
 ['western-true-dry-landing-slip',13,84],
 ['central-true-dry-landing-slip',40,84],
 ['eastern-true-dry-landing-slip',67,84]
];
function d4(v,flip,t){
 const out=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }
 return out;
}
const iou=(a,b)=>{let overlap=0;for(const k of a)if(b.has(k))overlap++;return overlap/(a.size+b.size-overlap||1)};
test('B115 exclusivity: temperate LARGE fishing-lodge #003 is not D92 or accepted228, source candidate only',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,ALDERWAKE_TRIPLE_DRY_SLIP_ID);
 assert.equal(b.id,'r1:fishing-lodge:temperate:large:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['fishing-lodge','temperate','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Authentic original blueprint: 22,366 individually distinct cells, 6,471 connected source walks, 24 rooms, 36 portals',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge();
 assert.deepEqual(b.footprint,{width:86,height:38,depth:100});
 assert.equal(b.placements.length,22366);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,22366);
 assert.equal(b.walkable.length,6471);
 assert.equal(b.rooms.length,24);assert.equal(b.portals.length,36);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,55);
});
test('5,423 actual original unresolved Pack3 candidate roof cells have real direct solid backing and 12 occupied wing masses',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,5423);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);
  assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),'genuine original roof lacks source solid bearer '+p.at);
  const n=p.alderwakeActualDistinctRoofWing;
  assert.ok(n,'original source roof unowned by a real wing');
  wings.set(n,(wings.get(n)||0)+1);
 }
 assert.equal(wings.size,12);
 for(const [name,count] of wings)assert.ok(count>=60,'entire proposed roof occluded '+name);
});
test('All twelve physical original stone roof-bearing columns remain continuously source-solid from y0 to their real roof undersides',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  parts=b.placements.filter(p=>p.purpose?.startsWith('alderwake-actual-full-height-stone-bearing-')),
  sites=new Map();
 for(const p of parts){
  const name=p.purpose.slice('alderwake-actual-full-height-stone-bearing-'.length);
  if(!sites.has(name))sites.set(name,p.at);
 }
 assert.equal(sites.size,12);
 for(const [name,[x,,z]] of sites){
  const roof=b.placements.find(p=>p.alderwakeActualDistinctRoofWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,'unoccupied source roof post site '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<roof.at[1];y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'source-bearing column cut by doorway/glass '+name+' '+K(x,y,z));
 }
});
test('Five original fully open sky courts contain 532 original stone-founded genuinely y1-walkable columns with zero overhead occupancy',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [x0,z0,x1,z1] of [
  [37,26,49,37],[17,47,26,56],[61,47,70,56],[37,60,48,69],[24,60,30,67]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'source open sky court not walkable '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)assert.ok(!m.has(K(x,y,z)),'source sky court blocked at '+K(x,y,z));
 }
 assert.equal(n,532);
});
test('Three truly stone-founded separate 7x11 dry slips have exactly 168 physical two-high opaque timber guardrail cells and twelve true gate openings',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let rails=0,gates=0;
 for(const [name,x0,z0] of slips){
  const x1=x0+6,z1=z0+10;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const fence=x===x0||x===x1||z===z0||z===z1;
   const gate=(x===x0+2||x===x0+3)&&(z===z0||z===z1);
   if(fence&&!gate)for(let y=1;y<=2;y++){
    rails++;
    assert.equal(m.get(K(x,y,z))?.alderwakeTrueTwoTierDryPierRail,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:wood');
    assert.ok(!walk.has(K(x,1,z)),'ghost source walk through solid guardrail');
   }
   if(gate){
    gates++;
    assert.ok(walk.has(K(x,1,z)),'supposed gate actually blocks walking');
    assert.ok(!m.has(K(x,2,z)),'two-high true gate has head obstruction');
   }
  }
 }
 assert.deepEqual([rails,gates],[168,12]);
});
test('Every dry slip has uninterrupted true two-high cardinal physical walking from its north gate to its south gate around the solid stone drying table',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let directions=0;
 for(const [name,x0,z0] of slips)for(const z of [z0,z0+10]){
  const start=K(x0+2,1,z),goal=K(x0+2,1,z===z0?z0+10:z0),
   queue=[start],seen=new Set(queue);
  for(let i=0;i<queue.length;i++){
   const [x,,zz]=queue[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=zz+dz,k=K(X,1,Z);
    if(X<x0||X>x0+6||Z<z0||Z>z0+10||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
    seen.add(k);queue.push(k);
   }
  }
  assert.ok(seen.has(goal),'dry north/south slip passage cannot be walked physically '+name);
  directions++;
 }
 assert.equal(directions,6);
});
test('All three authentic 3x3 dry stone sorting racks have true 27 raised y1 foundation-backed blocks, 24 upper y2 rims and unblocked centers',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let bases=0,rims=0,open=0;
 for(const [name,x0,z0] of slips)
  for(let x=x0+2;x<=x0+4;x++)for(let z=z0+4;z<=z0+6;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const p=m.get(K(x,1,z));
   assert.equal(p?.alderwakeOriginalRaisedDryFishSortingTable,name);
   assert.equal(p?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'dry sorting table falsely source-walkable');bases++;
   if(x===x0+2||x===x0+4||z===z0+4||z===z0+6){
    assert.equal(m.get(K(x,2,z))?.alderwakeFullStoneRaisedTableRim,name);
    rims++;
   }else{
    assert.ok(!m.has(K(x,2,z)),'dry table center filled by an obstruction');open++;
   }
  }
 assert.deepEqual([bases,rims,open],[27,24,3]);
 assert.equal(b.architecturalIdentity.realFishing,false);
 assert.equal(b.architecturalIdentity.activeBoatOrWater,false);
});
test('All 36 original room-graph portals physically occupy genuine y0 stone-founded clear y1 with free y2 headroom',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,36);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'portal source y1 not physically admitted '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'portal source y2 head obstructed '+p.at);
 }
 assert.equal(b.portals.filter(p=>slips.some(([name])=>p.to===name)).length,6);
});
test('Three really unroofed southern dry piers connect west-to-east by exterior-only cardinal stone walk, no hall shortcuts',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(16,1,97),end=K(70,1,97),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<95||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(end),'outside east and west piers lack real connected route');
 assert.equal(seen.size,280);
 for(const x of [16,43,70]){
  assert.equal(m.get(K(x,0,97))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,97)));
 }
});
test('90 original unresolved Pack4 candidate glass cells form eighteen outward five-high complete framed stone bays',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  panes=b.placements.filter(p=>p.role==='window'),
  dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(panes.length,90);
 for(const p of panes){
  const [x,y,z]=p.at,d=dirs[p.orientation],k=x+','+z;
  assert.ok(d,'bad original window orientation');
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'window faces solid original adjacent cell');
  if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,18);
 for(const levels of groups.values())assert.deepEqual([...levels].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Seven genuine older fishing-lodge original constructors have 56 strict unchanged D4 <0.85 comparisons and no duplicate ID/fingerprint',()=>{
 const b=buildAlderwakeTripleDrySlipFishingLodge(),set=d4(b,false,0);
 let count=0,maxIoU=0,nearest=null;
 for(const fn of peers){
  const old=fn();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const flipped of [false,true])for(let t=0;t<4;t++){
   const score=iou(set,d4(old,flipped,t));
   if(score>maxIoU){maxIoU=score;nearest=old.id}
   assert.ok(score<0.85,'strict same-category source near-duplicate '+old.id+' '+score);
   count++;
  }
 }
 assert.equal(count,56);
 console.log('ALDERWAKE_GENUINE_7_PRECEDENTS_56_D4_PASS '+JSON.stringify({count,maxIoU,nearest}));
});
