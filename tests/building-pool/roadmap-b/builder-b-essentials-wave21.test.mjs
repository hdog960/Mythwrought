// MYTHWROUGHT Builder B Wave21 authentic desert lighthouse source gates.
// No real powered lantern, coast, tower stairs, iPhone or release approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSunscarOpenOculusLanternwatch,SUNSCAR_OPEN_OCULUS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=v=>v.join(',');
function d4(b,flip,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }return s;
}
const iou=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)};
test('Sunscar distinct true reserved Builder B desert lighthouse with no historical or D92 ID reuse',()=>{
 const b=buildSunscarOpenOculusLanternwatch(),own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,SUNSCAR_OPEN_OCULUS_ID);
 assert.equal(b.id,'r1:lighthouse:desert:small:002');
 assert.ok(own.builderBIds.includes(b.id)&&!own.builderDAvailableIds.includes(b.id));
 const old=[buildFrostwakeCrownbridgeLighthouse(),buildSaltreachTidalLanternStation()];
 assert.equal(new Set([b,...old].map(x=>x.id)).size,3);
 assert.ok(old.every(x=>structuralFingerprint(x)!==structuralFingerprint(b)));
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Sunscar 24-cell TRUE tower ring with vertical grounded masonry, 8 elevated openings and 24 original Pack3 crown cells',()=>{
 const b=buildSunscarOpenOculusLanternwatch(),m=new Map(b.placements.map(p=>[K(p.at),p])),walkSet=new Set(b.walkable.map(K));
 assert.equal(b.placements.length,6700);assert.equal(b.walkable.length,1292);
 assert.equal(b.rooms.length,7);assert.equal(b.portals.length,9);
 const crown=b.placements.filter(p=>p.directlyGroundBackedTowerCrown);
 assert.equal(crown.length,24);
 for(let x=35;x<=41;x++)for(let z=14;z<=22;z++){
  const wall=(x===35||x===41||z===14||z===22)&&!((x===35||x===41)&&(z===14||z===22));
  if(!wall)continue;
  assert.equal(m.get(K([x,0,z]))?.role,'foundation');
  for(let y=1;y<=29;y++){
   const block=m.get(K([x,y,z]));
   assert.ok(block&&['wall','window'].includes(block.role),'tower missing grounded masonry '+K([x,y,z]));
  }
  assert.equal(m.get(K([x,30,z]))?.asset,'pack3:025','original tower crown absent');
 }
 assert.equal(b.architecturalIdentity.sourceOctagonalTowerHeight,30);
 assert.equal(b.architecturalIdentity.octagonalTowerHighPanes,8);
 const courtyard=[21,22,27,29];
 for(let x=courtyard[0];x<=courtyard[2];x++)for(let z=courtyard[1];z<=courtyard[3];z++){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','authored sun court floor missing');
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K([x,y,z])),'sun court incorrectly roofed or blocked');
  assert.ok(walkSet.has(K([x,1,z])),'paved sky court not traversable');
 }
});
test('Sunscar 8 HIGH original exterior Pack4 glass cells have authentic stone sills/lintels, and 15 lower exterior windows',()=>{
 const b=buildSunscarOpenOculusLanternwatch(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const glass=b.placements.filter(p=>p.role==='window'),
  high=glass.filter(p=>p.elevatedRealUprightSourcePane),
  low=glass.filter(p=>!p.elevatedRealUprightSourcePane),
  face={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 assert.equal(glass.length,23);assert.equal(high.length,8);assert.equal(low.length,15);
 for(const pane of glass){
  const [x,y,z]=pane.at,[dx,dz]=face[pane.orientation];
  assert.equal(pane.asset,'pack4:030');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'physical window directly faces a solid voxel');
  if(pane.elevatedRealUprightSourcePane){
   assert.equal(y,22);
   assert.equal(m.get(K([x,21,z]))?.role,'wall');
   assert.equal(m.get(K([x,23,z]))?.role,'wall');
   assert.equal(pane.sourceUnlit,true);
  }else{
   assert.equal(y,2);assert.ok(!m.has(K([x+dx,0,z+dz])),'lower window faces another wing');
   assert.equal(m.get(K([x,1,z]))?.role,'wall');
   assert.equal(m.get(K([x,3,z]))?.role,'wall');
  }
  const producer=pack4BuilderAsset('pack4:030',{rotation:pane.orientation});
  assert.equal(producer.id,159);assert.equal(producer.mount,'opening');
  assert.ok(producer.visible.some(v=>v.bounds[4]-v.bounds[1]>.65));
  assert.ok(producer.selection.length&&producer.collision.length);
  assert.equal(producer.registeredInLiveGame,false);
 }
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.equal(roof.length,1465);
 for(const p of roof){
  assert.ok(p.asset.startsWith('pack3:'),'fake upright Pack4 horizontal skylight');
  const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
  assert.ok(below&&['wall','support','partition'].includes(below.role),'no real immediate roof support '+K(p.at));
 }
 for(const portal of b.portals)
  assert.ok(!m.has(K(portal.at))&&!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'blocked 2-high source doorway');
 for(const flag of ['activeLighthouseBeacon','upperTowerStairsInstalled','liveSeaWaterMechanics',
  'packProducerMeshesCertified','actualIphoneTested','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'unearned certified lighthouse gameplay '+flag);
});
test('Sunscar original octagonal tower and five wings are novel against Saltreach and Frostwake under strict 8-way D4',()=>{
 const b=buildSunscarOpenOculusLanternwatch(),s=d4(b,false,0);
 let checks=0;
 for(const old of [buildSaltreachTidalLanternStation(),buildFrostwakeCrownbridgeLighthouse()])
  for(const flip of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(s,d4(old,flip,turn));checks++;
   assert.ok(score<.85,'near-clone lighthouse '+old.id+' score '+score);
  }
 assert.equal(checks,16);
});
