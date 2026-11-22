// MYTHWROUGHT Builder B Wave20 original MEDIUM temperate stable source gates.
// Genuine sky-open WALKABLE ground, not the hollow ungrounded "open courts"
// used by other source briefs. No production or creator visual acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBramblecrossSplitRailCoachStables,BRAMBLECROSS_COACH_STABLES_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunspokeForkedShelterCorralStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=v=>v.join(',');
function d4(b,flip,turn) {
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let hits=0;for(const k of a)if(b.has(k))hits++;return hits/(a.size+b.size-hits||1)};
test('Bramblecross is an exclusive immutable B115 original medium stable with distinct prior architecture',()=>{
 const own=getBuilderBServiceOwnership(),b=buildBramblecrossSplitRailCoachStables();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,BRAMBLECROSS_COACH_STABLES_ID);
 assert.equal(b.id,'r1:stable:temperate:medium:001');
 assert.equal(b.size,'medium');
 assert.ok(own.builderBIds.includes(b.id),'B115 medium allocation missing');
 assert.ok(!own.builderDAvailableIds.includes(b.id),'Builder D reserved slot stolen');
 const previous=[buildMeadowstepSplitAisleStables(),buildSunspokeForkedShelterCorralStables()];
 assert.equal(new Set([...previous,b].map(x=>x.id)).size,3);
 for(const old of previous)assert.notEqual(structuralFingerprint(b),structuralFingerprint(old));
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Bramblecross has 217 true WALKABLE, stone-paved, completely open-sky courtyard cells and explicit 24-cell paths',()=>{
 const b=buildBramblecrossSplitRailCoachStables(),cells=new Map(b.placements.map(p=>[K(p.at),p])),walkSet=new Set(b.walkable.map(K));
 assert.equal(b.placements.length,8484);assert.equal(b.walkable.length,1793);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,11);
 assert.deepEqual(b.architecturalIdentity.pavedGroundSkyCourts,[182,35]);
 assert.equal(b.architecturalIdentity.originalConnectingPavedPathCells,24);
 for(const [x0,z0,x1,z1] of [[23,19,36,31],[13,37,17,43]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   assert.equal(cells.get(K([x,0,z]))?.role,'foundation','paved hardstand floor absent');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!cells.has(K([x,y,z])),'a purported open-sky hardstand is actually roofed or blocked');
   assert.ok(walkSet.has(K([x,1,z])),'yard has physical stone but is not traversable');
  }
 const sealed=cells.get('39,1,33');
 assert.equal(sealed?.role,'partition','corrected isolated cell reopened');
 assert.equal(sealed?.sealedEastHarnessBearingPier,true);
 assert.ok(!b.walkable.some(p=>K(p)==='39,1,33'));
 for(const passage of b.portals){
  assert.ok(!cells.has(K(passage.at))&&!cells.has(K([passage.at[0],passage.at[1]+1,passage.at[2]])),'blocked source 2-high portal');
 }
});
test('Six original real-backed Pack3 roof wings, grounded timbers and exterior upright producer Pack4 windows',()=>{
 const b=buildBramblecrossSplitRailCoachStables(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 const roofs=b.placements.filter(p=>p.role==='roof'),glass=b.placements.filter(p=>p.role==='window');
 assert.equal(roofs.length,1900);assert.equal(glass.length,20);
 assert.equal(new Set(roofs.map(p=>p.originalRoofWing).filter(Boolean)).size,6);
 const face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const roof of roofs){
  assert.ok(roof.asset.startsWith('pack3:'),'incorrect Pack4 roof proxy');
  const [x,y,z]=roof.at,below=cells.get(K([x,y-1,z]));
  assert.ok(below&&['wall','support','partition'].includes(below.role),'unbacked roof '+K(roof.at));
 }
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.equal(y,2);assert.equal(p.asset,'pack4:030');
  assert.ok(!cells.has(K([x+dx,0,z+dz])),'window faces connected building rather than exterior air');
  assert.equal(cells.get(K([x,1,z]))?.role,'wall','physical window sill missing');
  assert.equal(cells.get(K([x,3,z]))?.role,'wall','physical window lintel missing');
  const producer=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(producer.id,159);assert.equal(producer.mount,'opening');
  assert.ok(producer.visible.some(v=>v.bounds[4]-v.bounds[1]>.65));
  assert.ok(producer.selection.length&&producer.collision.length);
  assert.equal(producer.registeredInLiveGame,false);
 }
 for(const k of ['liveHorseAI','liveCartWheels','liveRoadNetwork','packPhysicalCollisionCertified',
  'weatherSealCertified','actualIphoneTested','creatorArtAccepted'])
  assert.equal(b.architecturalIdentity[k],false,'source falsely claims final engine acceptance '+k);
});
test('Bramblecross focused non-clone against Meadowstep and Sunspoke, eight strict D4 transforms each',()=>{
 const b=buildBramblecrossSplitRailCoachStables(),fixed=d4(b,false,0);
 let compared=0;
 for(const older of [buildMeadowstepSplitAisleStables(),buildSunspokeForkedShelterCorralStables()])
  for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(fixed,d4(older,mirror,turn));compared++;
   assert.ok(score<.85,'same-category source clone '+older.id+' score='+score);
  }
 assert.equal(compared,16);
});
