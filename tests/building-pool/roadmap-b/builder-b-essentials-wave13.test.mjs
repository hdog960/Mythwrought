// MYTHWROUGHT Builder B Wave13 original enchanted-forest Glimmerbough greenhouse.
// Strict source-only acceptance; not real iPhone/producer/gameplay certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGlimmerboughSplitSunOrchidHouse,GLIMMERBOUGH_SPLITSUN_ORCHID_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
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
const allPrior=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation,buildDunewakeOasisReedworksFishingLodge,
 buildMossveilTwinCourtSporeGranary,buildSunspokeForkedShelterCorralStables];
const K=a=>a.join(',');
function d4(b,flip,turn){
 const res=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  res.add([x,Y,z,p.role].join('/'));
 }return res;
}
const iou=(a,b)=>{let same=0;for(const x of a)if(b.has(x))same++;return same/(a.size+b.size-same||1)};
test('Glimmerbough source #13 is exclusively Builder B, never historical 228 or D92',()=>{
 const b=buildGlimmerboughSplitSunOrchidHouse(),owner=getBuilderBServiceOwnership(),before=allPrior.map(f=>f());
 assert.equal(b.id,GLIMMERBOUGH_SPLITSUN_ORCHID_ID);
 assert.equal(b.id,'r1:greenhouse:enchanted-forest:small:002');
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 assert.ok(owner.builderBIds.includes(b.id)&&!owner.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...before,b].map(x=>x.id)).size,13);
 assert.deepEqual([validateAllocation([...before,b]).authored,validateAllocation([...before,b]).remaining],[13,422]);
 const fp=structuralFingerprint(b);
 for(const earlier of before)assert.notEqual(fp,structuralFingerprint(earlier),'source clone '+earlier.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.actualForestBiomeEdited,false);
});
test('Glimmerbough actually authors 195 upright glass cells in 65 3-cell bays, not disguised roof skylights',()=>{
 const b=buildGlimmerboughSplitSunOrchidHouse(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 const glass=b.placements.filter(p=>p.role==='window');
 assert.equal(glass.length,195,'glazing count changed; check true physical openings');
 assert.equal(b.architecturalIdentity.originalUprightGlassBays,65);
 assert.equal(b.architecturalIdentity.originalVerticalGlassCellsBeforeEntrances,195);
 const bays=new Set(glass.map(p=>p.at[0]+','+p.at[2]));
 assert.equal(bays.size,65,'stacked greenhouse bay provenance lost');
 const face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const seenYaw=new Set();
 for(const p of glass){
  assert.equal(p.asset,'pack4:030','false Pack4 glazing asset');
  assert.ok([2,3,4].includes(p.at[1]),'greenhouse glass became horizontal or above original frame');
  assert.equal(p.originalUprightThreeCellGlass,true);
  const [x,,z]=p.at,[dx,dz]=face[p.orientation];
  assert.ok(!cells.has(K([x+dx,0,z+dz])),'glass faces another wing');
  assert.equal(cells.get(K([x,1,z]))?.role,'wall','real wooden source glazing sill missing');
  assert.equal(cells.get(K([x,5,z]))?.role,'wall','real glazing frame lintel missing');
  seenYaw.add(p.orientation);
 }
 assert.ok(seenYaw.size>=3,'original glass does not span multiple facade orientations');
 for(const orientation of seenYaw){
  const physical=pack4BuilderAsset('pack4:030',{rotation:orientation});
  assert.equal(physical.id,159);assert.equal(physical.mount,'opening');
  assert.ok(physical.visible.some(s=>s.bounds[4]-s.bounds[1]>.65));
  assert.ok(physical.selection.length&&physical.collision.length);
  assert.equal(physical.registeredInLiveGame,false);
 }
});
test('Glimmerbough dual actual open courts and 1516 supported original Pack3 roofs retain real physical 2-high circulation',()=>{
 const b=buildGlimmerboughSplitSunOrchidHouse(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,6728);assert.equal(b.walkable.length,1175);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,12);
 for(const [x0,z0,x1,z1] of [[21,21,26,26],[11,34,14,37]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'sky-open source falsely roofed or filled');
 const roof=b.placements.filter(p=>p.role==='roof');assert.equal(roof.length,1516);
 assert.equal(new Set(roof.map(p=>p.sourceRoofWing)).size,7);
 for(const p of roof){
  assert.ok(p.asset.startsWith('pack3:')&&!p.asset.startsWith('pack4:'));
  const [x,y,z]=p.at,below=cells.get(K([x,y-1,z]));
  assert.ok(below&&['wall','support','partition'].includes(below.role),'missing original immediately lower roof bearing '+K(p.at));
 }
 for(const portal of b.portals){
  assert.ok(!cells.has(K(portal.at)),'blocked original greenhouse portal');
  assert.ok(!cells.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'blocked upper entrance');
 }
 for(const flag of ['plantGrowthEnabled','lightEmittersActive','realWeatherSealCertified',
  'packPhysicalCollisionApproved','actualIphoneTested','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'unearned acceptance '+flag);
});
test('Glimmerbough strict untouched historical 228 original greenhouse D4 versus Alderglass/Rimeglass',{timeout:240000},async()=>{
 const history=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  history.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(history.length,228,'historical accepted 1B census changed');
 assert.equal(new Set(history.map(x=>x.id)).size,228);
 const b=buildGlimmerboughSplitSunOrchidHouse();
 assert.ok(!history.some(x=>x.id===b.id),'historical source collision');
 const same=[...history.filter(x=>x.category===b.category),
  buildAlderglassTrellisConservatory(),buildRimeglassCrescentSunGreenhouse()];
 assert.ok(same.length>=22,'historic greenhouse corpus incomplete');
 const current=d4(b,false,0);let checked=0,max=0,nearest=null;
 for(const old of same)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(current,d4(old,flip,turn));checked++;
  if(score>max){max=score;nearest=old.id}
  assert.ok(score<.85,'Glimmerbough same-category exact-source near clone '+old.id+' '+score);
 }
 assert.ok(checked>=176,'strict D4 coverage insufficient');
 console.log('GLIMMERBOUGH_STRICT_228_GREENHOUSE_D4_PASS '+JSON.stringify({
  accepted:228,comparisons:checked,closest:nearest,maxD4:max,
  physicalPack4SourceOnly:true,actualIphone:false,creatorApproved:false
 }));
});
