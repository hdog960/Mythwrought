// Builder B: exact-source all-seven physical roof/Pack family witness; no actual world placement.
// NOT load, waterproofing, live renderer, iPhone or creator artwork certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
const K=at=>at.join(',');
const buildAll=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse];
test('Seven exclusive Builder B source originals have no upright window panes misused as roofing and actual roof-backing cells',()=>{
 const b=buildAll.map(fn=>fn()),ownership=getBuilderBServiceOwnership();
 assert.equal(b.length,7);assert.equal(new Set(b.map(x=>x.id)).size,7);
 assert.deepEqual([ownership.builderBIds.length,ownership.builderDAvailableIds.length],[115,92]);
 assert.deepEqual([validateAllocation(b).authored,validateAllocation(b).remaining],[7,428]);
 let roofs=0,glazing=0;
 for(const house of b){
  assert.ok(ownership.builderBIds.includes(house.id),house.id+' outside immutable B115');
  assert.ok(!ownership.builderDAvailableIds.includes(house.id),house.id+' stolen from immutable D92');
  assert.equal(house.worldPlacement,false,house.id+' falsely claimed integration');
  assert.equal(house.liveIntegration,false,house.id+' falsely claimed live engine geometry');
  const cells=new Map(house.placements.map(p=>[K(p.at),p]));
  const roof=house.placements.filter(p=>p.role==='roof'),panes=house.placements.filter(p=>p.asset==='pack4:030');
  assert.ok(roof.length>1000,house.id+' original roof inventory missing');
  for(const p of roof){
   assert.ok(!p.asset.startsWith('pack4:'),house.id+' uses vertical Pack4 window pane as roof '+K(p.at));
   const below=cells.get(K([p.at[0],p.at[1]-1,p.at[2]]));
   assert.ok(below&&['support','partition','wall'].includes(below.role),
    house.id+' roof lacks an actual authored immediately lower bearing cell '+K(p.at));
  }
  for(const p of panes){
   assert.equal(p.role,'window',house.id+' upright producer window misclassified as roof');
   assert.ok(['north','east','south','west'].includes(p.orientation),house.id+' non-cardinal pane yaw');
  }
  if(house.category==='greenhouse'){
   const corrected=house.placements.filter(p=>p.originalGlazing===true);
   if(house.biome==='temperate')
    assert.ok(corrected.length>=300,house.id+' original Alderglass 300+ transparent source panels lost');
   else
    assert.equal(corrected.length,278,house.id+' original Rimeglass 278 glass panes lost');
   assert.ok(roof.filter(p=>p.asset.startsWith('pack3:')).length>=350,
    house.id+' opaque-original threshold fell below 350');
  }
  roofs+=roof.length;glazing+=panes.length;
 }
 assert.equal(glazing,7+383+10+9+8+9+287,
  'seven-source corrected physical glazing inventory changed');
 assert.ok(roofs>8000,'original seven-source roof massing unexpectedly shrank');
 console.log('BUILDER_B_SEVEN_SOURCE_PACK_ROOF_AND_VERTICAL_GLAZING_PASS '+JSON.stringify({
  originals:b.length,roofs,glassSourceWindows:glazing,physicalSnowLoadApproved:false,
  realWeatherSealApproved:false,livePackCollisionCertified:false,iPhoneAccepted:false}));
});
