// MYTHWROUGHT Builder B Wave17 Amberwell — focused original source acceptance.
// Source-only; no duplicated full historical scan in this per-wave focused test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAmberwellSandglassConservatory,AMBERWELL_SANDGLASS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=a=>a.join(',');
function d4(b,flip,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let shared=0;for(const x of a)if(b.has(x))shared++;return shared/(a.size+b.size-shared||1)};
test('Amberwell original #17 owns only frozen B115 desert small greenhouse allocation, not D92 or prior designs',()=>{
 const b=buildAmberwellSandglassConservatory(),owner=getBuilderBServiceOwnership(),
  prior=[buildAlderglassTrellisConservatory(),buildRimeglassCrescentSunGreenhouse(),
   buildGlimmerboughSplitSunOrchidHouse()];
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 assert.equal(b.id,AMBERWELL_SANDGLASS_ID);
 assert.equal(b.id,'r1:greenhouse:desert:small:002');
 assert.ok(owner.builderBIds.includes(b.id));
 assert.ok(!owner.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([b,...prior].map(x=>x.id)).size,4);
 assert.ok(prior.every(x=>structuralFingerprint(x)!==structuralFingerprint(b)));
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Amberwell physically real 32 three-high framed glass bays, two source-open courts and 12 two-high internal passages',()=>{
 const b=buildAmberwellSandglassConservatory(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,7745);
 assert.equal(b.walkable.length,1299);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,12);
 assert.deepEqual(b.architecturalIdentity.originalOpenSandCourts,[42,20]);
 const glass=b.placements.filter(p=>p.role==='window');
 assert.equal(glass.length,96);
 assert.equal(b.architecturalIdentity.originalVerticalGlassCells,96);
 assert.equal(b.architecturalIdentity.originalVerticalGlassBays,32);
 assert.equal(new Set(glass.map(p=>p.at[0]+','+p.at[2])).size,32);
 const exposed={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]},yaw=new Set();
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=exposed[p.orientation];
  yaw.add(p.orientation);
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.threeHighOriginalExternalGlazing??p.originalThreeTierVerticalGlass,true);
  assert.ok([2,3,4].includes(y));
  assert.ok(!m.has(K([x+dx,0,z+dz])),'pane faces another building wing');
  assert.equal(m.get(K([x,1,z]))?.role,'wall','original real sill absent');
  assert.equal(m.get(K([x,5,z]))?.role,'wall','original real lintel absent');
 }
 assert.ok(yaw.size>=3,'genuine exterior panes use too few facades');
 for(const side of yaw){
  const candidate=pack4BuilderAsset('pack4:030',{rotation:side});
  assert.equal(candidate.id,159);assert.equal(candidate.mount,'opening');
  assert.ok(candidate.visible.some(item=>item.bounds[4]-item.bounds[1]>.65));
  assert.ok(candidate.collision.length&&candidate.selection.length);
  assert.equal(candidate.registeredInLiveGame,false);
 }
 for(const [x0,z0,x1,z1] of [[22,21,28,26],[13,35,16,39]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'false sky-open court');
 for(const p of b.portals)
  assert.ok(!m.has(K(p.at))&&!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),
   '2-high passage blocked');
});
test('Amberwell genuinely grounded solid prism tower and eight original supported opaque Pack3 roof masses',()=>{
 const b=buildAmberwellSandglassConservatory(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,1665);
 assert.equal(new Set(roofs.map(p=>p.originalOpaqueRoofWing).filter(Boolean)).size,8);
 for(const p of roofs){
  assert.ok(p.asset.startsWith('pack3:'),'Pack4 vertical glazing used as horizontal roof');
  const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
  assert.ok(below&&['wall','partition','support'].includes(below.role),'roof not backed by original support');
 }
 for(let y=1;y<=24;y++)
  assert.equal(m.get('43,'+y+',12')?.role,'wall','solid prism perimeter not grounded level '+y);
 assert.equal(m.get('43,27,12')?.asset,'pack3:025');
 for(const flag of ['upperPrismTowerStairs','upperPrismTowerTransparent',
  'cropGrowthEnabled','waterIrrigationEnabled','solarPowerEnabled',
  'activeHeatClimateControls','physicalPackCollisionApproved','actualWeatherSealCertified',
  'actualIphoneTested','creatorArtworkAccepted'])
  assert.equal(b.architecturalIdentity[flag],false,'invented original-game/producer acceptance '+flag);
});
test('Amberwell genuinely distinct under 24 eight-way D4 variations of prior three authored greenhouses',()=>{
 const b=buildAmberwellSandglassConservatory(),v=d4(b,false,0);
 const previous=[buildAlderglassTrellisConservatory(),buildRimeglassCrescentSunGreenhouse(),
  buildGlimmerboughSplitSunOrchidHouse()];
 let comparisons=0;
 for(const p of previous)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(v,d4(p,flip,turn));comparisons++;
  assert.ok(score<.85,'near-copy of '+p.id+' '+score);
 }
 assert.equal(comparisons,24);
});
