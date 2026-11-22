// MYTHWROUGHT Builder B 1B Wave14 Glassdune source-only acceptance.
// No simulated harbor, lighthouse beacon, shipping, economy, world or save mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGlassduneSplitQuayRegistry,GLASSDUNE_SPLITQUAY_REGISTRY_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildSunspokeForkedShelterCorralStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
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
const earlier=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation,buildDunewakeOasisReedworksFishingLodge,
 buildMossveilTwinCourtSporeGranary,buildSunspokeForkedShelterCorralStables,
 buildGlimmerboughSplitSunOrchidHouse];
const K=at=>at.join(',');
function d4(b,flip,turn){
 const v=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  v.add([x,Y,z,p.role].join('/'));
 }return v;
}
const iou=(a,b)=>{let hits=0;for(const x of a)if(b.has(x))hits++;return hits/(a.size+b.size-hits||1)};
test('Glassdune original fourteenth service source owns B115 only and remains entirely unregistered',()=>{
 const own=getBuilderBServiceOwnership(),b=buildGlassduneSplitQuayRegistry(),before=earlier.map(fn=>fn());
 assert.equal(b.id,GLASSDUNE_SPLITQUAY_REGISTRY_ID);
 assert.equal(b.id,'r1:harbor-office:desert:small:002');
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.ok(own.builderBIds.includes(b.id)&&!own.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...before,b].map(x=>x.id)).size,14);
 assert.deepEqual([validateAllocation([...before,b]).authored,validateAllocation([...before,b]).remaining],[14,421]);
 for(const x of before)assert.notEqual(structuralFingerprint(x),structuralFingerprint(b),'original source clone '+x.id);
 assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Real Glassdune multiwing plan has exactly two sky-open 46-column courts, 12 two-high portals and fully supported Pack3 roofs',()=>{
 const b=buildGlassduneSplitQuayRegistry(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,7280);assert.equal(b.walkable.length,1173);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,12);
 assert.deepEqual(b.architecturalIdentity.physicalOpenCourts,[30,16]);
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.equal(roof.length,1529);
 assert.ok(roof.some(p=>p.asset==='pack3:025'),'original high tower crown missing');
 assert.ok(roof.some(p=>p.asset==='pack3:026'),'original independent wing roofs missing');
 for(const p of roof){
  assert.ok(!p.asset.startsWith('pack4:'),'false roof uses vertical glazing');
  const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
  assert.ok(below&&['wall','support','partition'].includes(below.role),
   'unsupported physically original source roof at '+K(p.at));
 }
 for(const [x0,z0,x1,z1] of [[22,21,27,25],[13,35,16,38]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake open court '+x+','+z);
 for(const p of b.portals){
  assert.ok(!m.has(K(p.at))&&!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),'blocked two-high original passage '+K(p.at));
 }
 const flags=['originalElevatedTowerNavigable','poweredSignalEnabled','realWaterAndShoreline',
  'actualEconomyEnabled','realWeatherLoadCertified','physicalPackProducerAccepted',
  'creatorArtApproved','liveIphoneTested'];
 for(const f of flags)assert.equal(b.architecturalIdentity[f],false,'unearned live approval '+f);
});
test('Twelve original lower and eight high Pack4 030 openings preserve real masonry sill/lintel and true exterior air',()=>{
 const b=buildGlassduneSplitQuayRegistry(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const panes=b.placements.filter(p=>p.role==='window'),high=panes.filter(p=>p.originalRaisedRegistryPane),low=panes.filter(p=>!p.originalRaisedRegistryPane);
 assert.equal(panes.length,20);assert.equal(high.length,8);assert.equal(low.length,12);
 assert.equal(b.architecturalIdentity.raisedUprightTowerWindows,8);
 const face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const p of panes){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.equal(p.asset,'pack4:030');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'source window faces blocked exterior air');
  assert.equal(m.get(K([x,y-1,z]))?.role,'wall','missing original source wall sill');
  assert.equal(m.get(K([x,y+1,z]))?.role,'wall','missing original source wall lintel');
  if(p.originalRaisedRegistryPane){assert.equal(y,18);assert.equal(p.glowEnabled,false);}
  else {assert.equal(y,2);assert.ok(!m.has(K([x+dx,0,z+dz])),'low window faces a neighboring wing');}
  const physical=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(physical.id,159);assert.equal(physical.mount,'opening');
  assert.ok(physical.visible.some(x=>x.bounds[4]-x.bounds[1]>.65),'Pack4 manufacturer pane not upright');
  assert.ok(physical.selection.length&&physical.collision.length,'real Pack4 physical AABB missing');
  assert.equal(physical.registeredInLiveGame,false);
 }
});

// Strict original 228-source D4 for Waves9–19 is covered once by
// builder-b-originals-waves9-19-shared-historical-d4.test.mjs.
