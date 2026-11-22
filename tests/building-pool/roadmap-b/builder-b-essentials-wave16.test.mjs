// Builder B 1B Wave16 Frostline — original-source structural and ownership gates.
// Source-only tests. The expensive 228-source historic D4 belongs to one shared
// acceptance sweep; no per-wave duplicate full 228-source loops.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFrostlineEightWingIcewatchLodge,FROSTLINE_ICEWATCH_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=a=>a.join(',');
function d4(b,flip,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }return s;
}
const iou=(a,b)=>{let n=0;for(const p of a)if(b.has(p))n++;return n/(a.size+b.size-n||1)};
test('Frostline 16th original owns frozen B115 only and retains unique source identity',()=>{
 const b=buildFrostlineEightWingIcewatchLodge(),owner=getBuilderBServiceOwnership();
 const old=[buildSedgewatchTidehookFishingLodge(),buildDunewakeOasisReedworksFishingLodge()];
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 assert.equal(b.id,FROSTLINE_ICEWATCH_ID);
 assert.equal(b.id,'r1:fishing-lodge:snow:small:002');
 assert.ok(owner.builderBIds.includes(b.id));
 assert.ok(!owner.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([b,...old].map(x=>x.id)).size,3);
 assert.ok(old.every(x=>structuralFingerprint(x)!==structuralFingerprint(b)));
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.actualIphoneTested,false);
});
test('Frostline actual eight roof wings, two open ice courts, twelve source portals and contiguous grounded 25-tier mast',()=>{
 const b=buildFrostlineEightWingIcewatchLodge(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,7845);assert.equal(b.walkable.length,1494);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,12);
 assert.deepEqual(b.architecturalIdentity.openIceCourts,[36,20]);
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,1858);
 assert.equal(new Set(roofs.map(p=>p.frostlineRoofWing).filter(Boolean)).size,8);
 for(const p of roofs){
  assert.ok(p.asset.startsWith('pack3:'),'roof is an upright Pack4 proxy');
  const [x,y,z]=p.at,below=cells.get(K([x,y-1,z]));
  assert.ok(below&&['wall','partition','support'].includes(below.role),
   'original roof unsupported '+K(p.at));
 }
 for(const [x0,z0,x1,z1] of [[23,21,28,26],[40,30,43,34]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake open court '+x+','+z);
 for(const p of b.portals){
  assert.ok(!cells.has(K(p.at))&&!cells.has(K([p.at[0],p.at[1]+1,p.at[2]])),
   'blocked 2-high portal '+K(p.at));
 }
 for(let y=1;y<=25;y++){
  const solid=cells.get('44,'+y+',12');
  assert.ok(solid&&['support','wall'].includes(solid.role),'ungrounded source mast tier '+y);
 }
 assert.equal(cells.get('44,26,12')?.asset,'pack3:025');
 assert.equal(cells.get('44,26,12')?.signalCapUnpowered,true);
 for(const flag of ['fishingActive','liveOceanOrIcePhysics','boatsActive','beaconPowered',
  'snowLoadOrWeatherSealed','producerPhysicalPackAccepted','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false);
});
test('Frostline 13 vertical exterior Pack4 panes have genuine source sill, lintel and producer selection AABBs',()=>{
 const b=buildFrostlineEightWingIcewatchLodge(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const glass=b.placements.filter(p=>p.role==='window'),
  face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 assert.equal(glass.length,13);
 for(const pane of glass){
  const [x,y,z]=pane.at,[dx,dz]=face[pane.orientation];
  assert.equal(pane.asset,'pack4:030');assert.equal(y,2);
  assert.ok(!m.has(K([x+dx,0,z+dz])),'source window faces attached wing');
  assert.equal(m.get(K([x,y-1,z]))?.role,'wall','lower original frame missing');
  assert.equal(m.get(K([x,y+1,z]))?.role,'wall','upper original frame missing');
  const physical=pack4BuilderAsset('pack4:030',{rotation:pane.orientation});
  assert.equal(physical.id,159);assert.equal(physical.mount,'opening');
  assert.ok(physical.visible.some(part=>part.bounds[4]-part.bounds[1]>.65));
  assert.ok(physical.collision.length&&physical.selection.length);
  assert.equal(physical.registeredInLiveGame,false);
 }
});
test('Frostline novelty against prior Sedgewatch and Dunewake source geometry with all eight strict D4 transforms',()=>{
 const b=buildFrostlineEightWingIcewatchLodge(),target=d4(b,false,0);
 const old=[buildSedgewatchTidehookFishingLodge(),buildDunewakeOasisReedworksFishingLodge()];
 let count=0;for(const candidate of old)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(target,d4(candidate,flip,turn));count++;
  assert.ok(score<.85,'Frostline near-copy of '+candidate.id+' score '+score);
 }
 assert.equal(count,16);
});
