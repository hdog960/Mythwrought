// MYTHWROUGHT Builder B Wave10 Dunewake: original immutable-source acceptance.
// Source only; NOT game integration, approved Pack collisions, runtime, saves or iPhone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDunewakeOasisReedworksFishingLodge,DUNEWAKE_OASIS_REEDWORKS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=v=>v.join(',');
const priorFactories=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation];
function d4(b,flip,turn){
 const r=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Z=Math.floor(16*p.at[2]/d),
   Y=Math.floor(12*p.at[1]/h),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  r.add([x,Y,z,p.role].join('/'));
 }return r;
}
const iou=(a,b)=>{let hit=0;for(const v of a)if(b.has(v))hit++;return hit/(a.size+b.size-hit||1)};
test('Dunewake tenth B-only original preserves frozen B115/D92 and distinct nine prior source identities',()=>{
 const own=getBuilderBServiceOwnership(),b=buildDunewakeOasisReedworksFishingLodge(),before=priorFactories.map(fn=>fn());
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,DUNEWAKE_OASIS_REEDWORKS_ID);
 assert.equal(b.id,'r1:fishing-lodge:desert:small:002');
 assert.ok(own.builderBIds.includes(b.id)&&!own.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...before,b].map(x=>x.id)).size,10,'duplicate 1B source ID');
 assert.deepEqual([validateAllocation([...before,b]).authored,validateAllocation([...before,b]).remaining],[10,425]);
 const finger=structuralFingerprint(b);
 for(const earlier of before)assert.notEqual(finger,structuralFingerprint(earlier),
  'true source shape clone '+earlier.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Dunewake original eight rooms, eleven two-high doors, 20 real sky-open columns and physically backed sloped Pack3 source roofs',()=>{
 const b=buildDunewakeOasisReedworksFishingLodge(),v=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,11);
 assert.ok(b.placements.length>=5000);assert.ok(b.walkable.length>=900);
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.ok(roofs.length>=1200);
 assert.ok(roofs.every(p=>p.asset==='pack3:023'),'source roof material changed or uses upright opening-pane');
 for(const p of roofs){
  const [x,y,z]=p.at,back=v.get(K([x,y-1,z]));
  assert.ok(back&&['wall','partition','support'].includes(back.role),'roof lacking real immediate y-1 bearing '+K(p.at));
 }
 for(let x=20;x<=23;x++)for(let z=20;z<=24;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'courtyard falsely filled '+x+','+z);
 for(const portal of b.portals){
  assert.ok(!v.has(K(portal.at)),'blocked portal '+K(portal.at));
  assert.ok(!v.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'blocked portal headroom '+K(portal.at));
 }
 assert.equal(b.architecturalIdentity.sourceSkyOpenCourtColumns,20);
 assert.equal(b.architecturalIdentity.sourceShorelineOrSlopeValidated,false);
 assert.equal(b.architecturalIdentity.waterSimulated,false);
 assert.equal(b.architecturalIdentity.fishingEnabled,false);
 assert.equal(b.architecturalIdentity.boatEnabled,false);
 assert.equal(b.architecturalIdentity.actualIphoneTested,false);
 assert.equal(b.architecturalIdentity.creatorArtApproved,false);
});
test('Dunewake ten upright authentic Pack4 030 windows face dry exterior, not roof; producer ABI remains distinct from game certification',()=>{
 const b=buildDunewakeOasisReedworksFishingLodge(),v=new Map(b.placements.map(p=>[K(p.at),p]));
 const windows=b.placements.filter(p=>p.role==='window'),sides=new Set();
 assert.equal(windows.length,10);
 assert.ok(windows.every(p=>p.asset==='pack4:030'),'unexpected window family or Pack4 roof');
 const out={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const p of windows){
  assert.equal(p.at[1],2,'vertical window missing expected facade elevation');
  assert.ok(Object.hasOwn(out,p.orientation),'incorrect source cardinal orientation');
  sides.add(p.orientation);
  const [x,y,z]=p.at,[dx,dz]=out[p.orientation];
  assert.ok(!v.has(K([x+dx,0,z+dz])),'actual window faces building footprint rather than outside');
  const a=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(a.id,159);assert.equal(a.mount,'opening');
  assert.ok(a.visible.some(q=>q.bounds[4]-q.bounds[1]>.65),'upright producer AABB missing');
  assert.ok(a.collision.length&&a.selection.length,'source producer geometry missing');
  assert.equal(a.registeredInLiveGame,false);
 }
 assert.deepEqual([...sides].sort(),['east','north','south','west']);
 assert.equal(b.architecturalIdentity.pack4ProducerCollisionInLiveGameCertified,false);
 assert.equal(b.architecturalIdentity.roofSealCertified,false);
});
test('Dunewake unrelaxed 8-way historical 228 source D4 versus all fishing lodges plus prior Sedgewatch', {timeout:240000},async()=>{
 const old=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  old.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(old.length,228,'protected original 1B baseline modified');
 assert.equal(new Set(old.map(x=>x.id)).size,228);
 const b=buildDunewakeOasisReedworksFishingLodge();
 assert.ok(!old.some(x=>x.id===b.id),'claimed previously used 1B slot');
 const same=[...old.filter(x=>x.category===b.category),buildSedgewatchTidehookFishingLodge()];
 assert.ok(same.length>=21,'missing genuine same-category history');
 const exact=d4(b,false,0);let max=0,closest=null,n=0;
 for(const other of same)for(const flip of [false,true])for(const turn of [0,1,2,3]){
  const value=iou(exact,d4(other,flip,turn));n++;
  if(value>max){max=value;closest=other.id;}
  assert.ok(value<.85,'source D4 near duplicate '+b.id+' vs '+other.id+' IoU '+value);
 }
 assert.ok(n>=168,'historical eight-way D4 coverage incomplete');
 console.log('DUNEWAKE_STRICT_228_FISHING_D4_PASS '+JSON.stringify({
  accepted:228,comparisonCount:n,maxD4:max,closest,
  liveRuntime:false,actualIphone:false,creatorArtApproved:false
 }));
});
