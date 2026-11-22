// MYTHWROUGHT Builder B Wave12 Sunspoke genuine original source acceptance.
// Historical 228, B115/D92, roof bearing, real Pack4, connected walkable
// and 8-way same-category novelty. NO live game/iPhone/saves approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSunspokeForkedShelterCorralStables,SUNSPOKE_FORKED_CORRAL_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const previous=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation,buildDunewakeOasisReedworksFishingLodge,
 buildMossveilTwinCourtSporeGranary];
const K=at=>at.join(',');
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
const iou=(a,b)=>{let hits=0;for(const x of a)if(b.has(x))hits++;return hits/(a.size+b.size-hits||1)};
test('Sunspoke uniquely consumes only immutable Builder B slot 12; all eleven previous originals frozen',()=>{
 const ownership=getBuilderBServiceOwnership(),b=buildSunspokeForkedShelterCorralStables(),history=previous.map(fn=>fn());
 assert.equal(b.id,SUNSPOKE_FORKED_CORRAL_ID);
 assert.equal(b.id,'r1:stable:desert:small:002');
 assert.deepEqual([ownership.existing,ownership.forBuilderB,ownership.forBuilderD],[228,115,92]);
 assert.ok(ownership.builderBIds.includes(b.id)&&!ownership.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...history,b].map(v=>v.id)).size,12);
 assert.deepEqual([validateAllocation([...history,b]).authored,validateAllocation([...history,b]).remaining],[12,423]);
 const fp=structuralFingerprint(b);
 for(const old of history)assert.notEqual(structuralFingerprint(old),fp,'duplicated original geometry '+old.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Sunspoke original 52-column dual air paddocks, 12 two-high real portals, and 1472 fully supported Pack3 roof tiles',()=>{
 const b=buildSunspokeForkedShelterCorralStables(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,6498);
 assert.equal(b.walkable.length,1138);
 assert.equal(b.portals.length,12);
 assert.equal(b.rooms.length,8);
 assert.equal(b.architecturalIdentity.openSunPaddockColumns,36);
 assert.equal(b.architecturalIdentity.openSaddlingCourtColumns,16);
 assert.equal(b.architecturalIdentity.originalRoofWings,7);
 for(const [x0,z0,x1,z1] of [[21,19,26,24],[13,34,16,37]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake open paddock '+x+','+z);
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,1472);
 assert.equal(new Set(roofs.map(p=>p.originalRoofWing)).size,7);
 for(const p of roofs){
  assert.ok(p.asset.startsWith('pack3:'),'vertical Pack4 fake horizontal roof');
  const [x,y,z]=p.at,below=cells.get(K([x,y-1,z]));
  assert.ok(below&&['support','partition','wall'].includes(below.role),'unbacked sloped source roof '+K(p.at));
 }
 for(const portal of b.portals){
  assert.ok(!cells.has(K(portal.at)),'blocked lower original portal');
  assert.ok(!cells.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'blocked 2-high portal');
 }
 assert.equal(cells.get('17,1,33')?.sealedGroundedTackPier,true,
  'previous genuinely isolated one-column walkable pocket was reopened');
 assert.ok(!b.walkable.some(v=>K(v)==='17,1,33'),'fake disconnected walkable resumed');
 for(const flag of ['liveHorses','liveAnimalMovement','actualWater','realWeatherProof',
  'packProducerAccepted','actualIphoneTested','creatorArtAccepted'])
  assert.equal(b.architecturalIdentity[flag],false,'unearned acceptance '+flag);
});
test('Sunspoke 12 upright Pack4 windows genuinely face exterior and have actual producer geometry, not approved game meshes',()=>{
 const b=buildSunspokeForkedShelterCorralStables(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 const panes=b.placements.filter(p=>p.role==='window'),out={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 assert.equal(panes.length,12);
 for(const p of panes){
  assert.equal(p.asset,'pack4:030');assert.equal(p.at[1],2);
  const [dx,dz]=out[p.orientation], [x,y,z]=p.at;
  assert.ok(!cells.has(K([x+dx,0,z+dz])),'physically inward-facing source window');
  assert.equal(cells.get(K([x,y-1,z]))?.role,'wall','window sill absent');
  assert.equal(cells.get(K([x,y+1,z]))?.role,'wall','window lintel absent');
  const physical=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(physical.id,159);assert.equal(physical.mount,'opening');
  assert.ok(physical.visible.some(x=>x.bounds[4]-x.bounds[1]>.65),'upright actual Pack4 geometry missing');
  assert.ok(physical.selection.length&&physical.collision.length,'Pack4 physical producer AABB missing');
  assert.equal(physical.registeredInLiveGame,false);
 }
});

// Strict original 228-source D4 for Waves9–19 is covered once by
// builder-b-originals-waves9-19-shared-historical-d4.test.mjs.
