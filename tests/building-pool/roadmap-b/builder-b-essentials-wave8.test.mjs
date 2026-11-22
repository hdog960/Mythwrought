// Original Builder B 1B Wave8 snow lighthouse: real source, full historical 228 strict D4,
// frozen B115/D92 allocation, actual roof source backing & vertical Pack4 manufacturer ABI.
// Lighthouse is an inert architectural source; no upper-floor walkable stairs, live light,
// collision/weather/iPhone approval, save or production registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFrostwakeCrownbridgeLighthouse,FROSTWAKE_CROWNBRIDGE_LIGHTHOUSE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
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
const K=at=>at.join(',');
const earlier=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse];
const d4=(b,flip,turn)=>{
 const v=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Z=Math.floor(16*p.at[2]/d),
   Y=Math.floor(12*p.at[1]/h),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  v.add([x,Y,z,p.role].join('/'));
 }return v;
};
const iou=(a,b)=>{let shared=0;for(const k of a)if(b.has(k))shared++;return shared/(a.size+b.size-shared||1);};

test('Frostwake eighth original lighthouse is reserved only for Builder B; earlier seven IDs frozen',()=>{
 const owner=getBuilderBServiceOwnership(),prior=earlier.map(fn=>fn()),b=buildFrostwakeCrownbridgeLighthouse(),all=[...prior,b];
 assert.equal(b.id,FROSTWAKE_CROWNBRIDGE_LIGHTHOUSE_ID);
 assert.equal(b.id,'r1:lighthouse:snow:small:002');
 assert.deepEqual([owner.builderBIds.length,owner.builderDAvailableIds.length],[115,92]);
 assert.equal(new Set(all.map(x=>x.id)).size,8);
 assert.ok(owner.builderBIds.includes(b.id),'missing exact immutable B115 lighthouse reservation');
 assert.ok(!owner.builderDAvailableIds.includes(b.id),'stole immutable Builder D92 slot');
 assert.deepEqual([validateAllocation(all).authored,validateAllocation(all).remaining],[8,427]);
 assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 for(const item of prior)assert.notEqual(structuralFingerprint(item),structuralFingerprint(b),
  'Frostwake must not be architectural-source duplicate of any earlier original');
});

test('Original snow lighthouse retains supported six distinct roof wings, genuine void, eight rooms and nine two-high portals',()=>{
 const b=buildFrostwakeCrownbridgeLighthouse(),v=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,9);
 assert.ok(b.walkable.length>=600,'original connected lower-floor source circulation collapsed');
 assert.ok(b.placements.length>=4300,'source authored original voxel mass disappeared');
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.ok(roof.length>=850,'seven asymmetrical roof masses and tower crown lost');
 assert.ok(roof.some(p=>p.asset==='pack3:025'),'tall original beacon roof missing');
 assert.ok(roof.some(p=>p.asset==='pack3:026'),'original snow-wing roof missing');
 for(const p of roof){
  assert.ok(!p.asset.startsWith('pack4:'),'upright Pack4 window used as false horizontal roof');
  const below=v.get(K([p.at[0],p.at[1]-1,p.at[2]]));
  assert.ok(below&&['support','wall','partition'].includes(below.role),
   'original roof without immediately authored bearing source voxel at '+K(p.at));
 }
 for(let x=8;x<=10;x++)for(let z=19;z<=21;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),
   'source-only snow drift courtyard lost actual fully sky-open nine-voxel negative footprint');
 for(const portal of b.portals){
  assert.ok(!v.has(K(portal.at)),'Frostwake portal blocks original walkable passage');
  assert.ok(!v.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
   'Frostwake portal headspace is not genuinely two cells clear');
 }
 assert.equal(b.architecturalIdentity.realFootprintVoidCells,9);
 assert.equal(b.architecturalIdentity.raisedBeaconUnlit,true);
 assert.equal(b.architecturalIdentity.upperTowerTraversable,false);
 assert.equal(b.architecturalIdentity.realStaircaseInstalled,false);
 assert.equal(b.architecturalIdentity.roofSnowWeatherCertified,false);
 assert.equal(b.architecturalIdentity.liveBeaconPowered,false);
});

test('Eight genuinely upright beacon glass openings use original Pack4 manufacturer geometry, four facades, never lit',()=>{
 const b=buildFrostwakeCrownbridgeLighthouse(),v=new Map(b.placements.map(p=>[K(p.at),p]));
 const upper=b.placements.filter(p=>p.sourceUpperTowerWall===true),
  low=b.placements.filter(p=>p.role==='window'&&p.sourceUpperTowerWall!==true);
 assert.equal(upper.length,8);assert.equal(low.length,10);
 assert.equal(b.placements.filter(p=>p.asset==='pack4:030').length,18);
 assert.deepEqual([...new Set(upper.map(p=>p.orientation))].sort(),['east','north','south','west']);
 const direction={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const p of upper){
  const [x,y,z]=p.at,[dx,dz]=direction[p.orientation];
  assert.equal(y,16,'upper real beacon lens mounted at wrong floor');
  assert.equal(p.role,'window');assert.equal(p.liveLight,false);
  assert.equal(p.actualWindowCollisionApproved,false);
  assert.equal(p.realWindowWeatherSealApproved,false);
  assert.ok(v.get(K([x,y-1,z]))?.role==='wall','upper lens missing true stone sill');
  assert.ok(v.get(K([x,y+1,z]))?.role==='wall','upper lens missing true stone lintel');
  assert.ok(!v.has(K([x+dx,y,z+dz])),'upper lens faces occupied high-altitude structure rather than clear exterior air');
  const physical=pack4BuilderAsset('pack4:030',{rotation:p.orientation});
  assert.equal(physical.mount,'opening');
  assert.equal(physical.id,159);
  assert.ok(physical.visible.some(s=>s.bounds[4]-s.bounds[1]>.65),
   'producer glass is not actually upright');
  assert.ok(physical.collision.length>0&&physical.selection.length>0,
   'true source manufacturer pane collider/selection absent');
  assert.equal(physical.registeredInLiveGame,false,'false production registration claim');
 }
});
test('Frostwake original snow lighthouse strict unchanged 8-way same-category D4 against all 228 historical community sources',{timeout:240000},async()=>{
 const prior=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const module=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  prior.push(...module['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(prior.length,228,'real historical accepted community source baseline changed');
 assert.equal(new Set(prior.map(x=>x.id)).size,228,'historical accepted IDs duplicated');
 const current=buildFrostwakeCrownbridgeLighthouse();
 const same=prior.filter(x=>x.category===current.category);
 assert.ok(same.length>=20,'historic lighthouse category source corpus unexpectedly incomplete');
 assert.ok(!prior.some(p=>p.id===current.id),'B original lighthouse collided with accepted historical lighthouse');
 const base=d4(current,false,0);let max=0,closest=null,checked=0;
 for(const old of same)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(base,d4(old,flip,turn));checked++;
  if(score>max){max=score;closest=old.id;}
  assert.ok(score<.85,current.id+' violates original strict eight-way D4<.85 against '+old.id+' IoU '+score);
 }
 assert.ok(checked>=160,'source historical lighthouse corpus 8-way D4 audit incomplete');
 console.log('FROSTWAKE_STRICT_HISTORIC_228_LIGHTHOUSE_D4_PASS '+JSON.stringify({
  accepted:228,sameCategory:same.length,transforms:checked,maxD4:max,closest,
  creatorApproved:false,realIphone:false,liveBeaconOn:false}));
});
