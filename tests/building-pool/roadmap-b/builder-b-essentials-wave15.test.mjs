// MYTHWROUGHT Builder B Wave15 Icehaven original snow harbor customs source.
// Frozen B115/D92 ownership, true pedestrian continuity, supported Pack3 roofs,
// 20-cell grounded inert mast, actual Pack4 panes and strict historic 8-way D4.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildIcehavenBifurcatedSnowCustoms,ICEHAVEN_WINTER_CUSTOMS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave15.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
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
const existing=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation,buildDunewakeOasisReedworksFishingLodge,
 buildMossveilTwinCourtSporeGranary,buildSunspokeForkedShelterCorralStables,
 buildGlimmerboughSplitSunOrchidHouse,buildGlassduneSplitQuayRegistry];
const K=a=>a.join(',');
function d4(b,flip,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let shared=0;for(const v of a)if(b.has(v))shared++;return shared/(a.size+b.size-shared||1)};
test('Icehaven fifteenth original exclusively B115, not D92, and 14 previous IDs unchanged',()=>{
 const own=getBuilderBServiceOwnership(),b=buildIcehavenBifurcatedSnowCustoms(),prior=existing.map(f=>f());
 assert.equal(b.id,ICEHAVEN_WINTER_CUSTOMS_ID);
 assert.equal(b.id,'r1:harbor-office:snow:small:002');
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.ok(own.builderBIds.includes(b.id)&&!own.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...prior,b].map(x=>x.id)).size,15);
 assert.deepEqual([validateAllocation([...prior,b]).authored,validateAllocation([...prior,b]).remaining],[15,420]);
 for(const old of prior)assert.notEqual(structuralFingerprint(old),structuralFingerprint(b),'reused architectural source '+old.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Icehaven winter source: grounded 20-cell mast, 7 supported roofs, genuine twin open courts and physical two-high access',()=>{
 const b=buildIcehavenBifurcatedSnowCustoms(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,6675);assert.equal(b.walkable.length,1204);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,12);
 assert.deepEqual(b.architecturalIdentity.openSkyCourtCells,[36,15]);
 const roof=b.placements.filter(p=>p.role==='roof');assert.equal(roof.length,1533);
 assert.equal(new Set(roof.filter(p=>p.originalWinterRoof).map(p=>p.originalWinterRoof)).size,7);
 for(const p of roof){
  assert.ok(p.asset.startsWith('pack3:'),'upright window used as roof');
  const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
  assert.ok(below&&['support','wall','partition'].includes(below.role),'winter roof has no immediately backed cell '+K(p.at));
 }
 for(const [x0,z0,x1,z1] of [[23,22,28,27],[12,36,14,40]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'winter source open court filled');
 for(const p of b.portals){
  assert.ok(!m.has(K(p.at))&&!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),'2-high source doorway blocked');
 }
 for(let y=1;y<=20;y++){
  const source=m.get(K([42,y,16]));
  assert.ok(source&&['support','wall'].includes(source.role),'warning mast has physically floating tier '+y);
 }
 assert.equal(m.get('42,21,16')?.asset,'pack3:025');
 assert.equal(m.get('42,21,16')?.unlitWarningMastCap,true);
 assert.equal(b.architecturalIdentity.warningBeaconPowered,false);
 for(const flag of ['worldIceOrShorelineActive','weatherSealedApproved',
  'physicalPackAABBApproved','actualIphoneTested','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'falsely certified '+flag);
});
test('Icehaven real vertical facade panes face exterior and have actual Pack4 030 physical opening manufacturer geometry',()=>{
 const b=buildIcehavenBifurcatedSnowCustoms(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const windows=b.placements.filter(p=>p.role==='window'),out={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 assert.equal(windows.length,11);
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=out[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(y,2);
  assert.ok(!m.has(K([x+dx,0,z+dz])),'winter Pack4 pane opens into another wing');
  assert.equal(m.get(K([x,y-1,z]))?.role,'wall','source winter pane sill missing');
  assert.equal(m.get(K([x,y+1,z]))?.role,'wall','source winter pane lintel missing');
  const asset=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(asset.id,159);assert.equal(asset.mount,'opening');
  assert.ok(asset.visible.some(v=>v.bounds[4]-v.bounds[1]>.65));
  assert.ok(asset.selection.length&&asset.collision.length,'original physical Pack4 profile absent');
  assert.equal(asset.registeredInLiveGame,false);
 }
});
test('Icehaven unrelaxed original historical 228 same-category eight-way D4 plus Tidehollow and Glassdune', {timeout:240000},async()=>{
 const historic=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  historic.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(historic.length,228,'canonical historical service census changed');
 assert.equal(new Set(historic.map(x=>x.id)).size,228);
 const b=buildIcehavenBifurcatedSnowCustoms();
 assert.ok(!historic.some(x=>x.id===b.id),'historical accepted 1B slot stolen');
 const same=[...historic.filter(x=>x.category===b.category),buildTidehollowCrosswharfHarborOffice(),buildGlassduneSplitQuayRegistry()];
 assert.ok(same.length>=22,'historical harbor office category missing');
 const now=d4(b,false,0);let max=0,closest=null,checked=0;
 for(const old of same)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(now,d4(old,flip,turn));checked++;
  if(score>max){max=score;closest=old.id;}
  assert.ok(score<.85,'Icehaven original winter customs geometry near-clone '+old.id+' '+score);
 }
 assert.ok(checked>=176,'historical eight-way category comparison missing');
 console.log('ICEHAVEN_STRICT_228_HARBOR_OFFICE_D4_PASS '+JSON.stringify({
  accepted:228,transforms:checked,maxIoU:max,closest,
  iPhoneAccepted:false,productionRegistered:false,creatorApproved:false
 }));
});
