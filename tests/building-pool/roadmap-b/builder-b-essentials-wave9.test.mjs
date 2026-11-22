// Builder B 1B Wave9: original Saltreach source, exclusive B115/D92 ownership,
// actual roof-bearing XYZ geometry, producer upright Pack4, and strict historic D4.
// SOURCE ONLY: this is not world placement, creator art signoff or live iPhone acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSaltreachTidalLanternStation,SALTREACH_TIDAL_LANTERN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
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
const K=at=>at.join(',');
const builtPrior=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse];
function d4(b,flip,turn){
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
}
function iou(a,b){let overlap=0;for(const x of a)if(b.has(x))overlap++;return overlap/(a.size+b.size-overlap||1);}
test('Saltreach ninth original owns only frozen Builder B 115 allocation, never D92 or accepted 228',()=>{
 const owner=getBuilderBServiceOwnership(),b=buildSaltreachTidalLanternStation(),earlier=builtPrior.map(fn=>fn());
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 assert.equal(b.id,SALTREACH_TIDAL_LANTERN_ID);
 assert.equal(b.id,'r1:lighthouse:temperate:small:002');
 assert.ok(owner.builderBIds.includes(b.id),'outside frozen 115 original IDs');
 assert.ok(!owner.builderDAvailableIds.includes(b.id),'collides with Builder D');
 assert.equal(new Set([...earlier,b].map(v=>v.id)).size,9,'a prior original ID was repeated');
 assert.deepEqual([validateAllocation([...earlier,b]).authored,validateAllocation([...earlier,b]).remaining],[9,426]);
 const fp=structuralFingerprint(b);
 for(const old of earlier)assert.notEqual(structuralFingerprint(old),fp,'duplicate original structural shape '+old.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
});
test('Saltreach has genuinely separate eight rooms, ten two-high doors, open 16-column skywell and backed Pack3 roofs',()=>{
 const b=buildSaltreachTidalLanternStation(),at=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,10);
 assert.equal(b.footprint.width,44);assert.equal(b.footprint.height,35);assert.equal(b.footprint.depth,44);
 assert.ok(b.walkable.length>=850,'actual 2-high ground circulation lost');
 assert.ok(b.placements.length>=6000,'individually authored source mass collapsed');
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.ok(roofs.length>=1200,'asymmetric six-roof-plus-crown mass missing');
 assert.ok(roofs.some(p=>p.asset==='pack3:025'));
 assert.ok(roofs.some(p=>p.asset==='pack3:026'));
 for(const p of roofs){
  assert.ok(!p.asset.startsWith('pack4:'),'upright glass used as roof');
  const [x,y,z]=p.at,back=at.get(K([x,y-1,z]));
  assert.ok(back&&['wall','partition','support'].includes(back.role),'unbacked roof '+K(p.at));
 }
 for(let x=8;x<=11;x++)for(let z=25;z<=28;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'false skywell '+x+','+z);
 for(const p of b.portals){
  assert.ok(!at.has(K(p.at))&&!at.has(K([p.at[0],p.at[1]+1,p.at[2]])),'blocked source opening '+K(p.at));
 }
 assert.equal(b.architecturalIdentity.sourceOpenSkyCourtColumns,16);
 assert.equal(b.architecturalIdentity.actualTerrainOrShorelineChecked,false);
 assert.equal(b.architecturalIdentity.lighthousePowerOn,false);
 assert.equal(b.architecturalIdentity.physicallyNavigableUpperTower,false);
 assert.equal(b.architecturalIdentity.realStairsInstalled,false);
 assert.equal(b.architecturalIdentity.actualIphoneTested,false);
 assert.equal(b.architecturalIdentity.creatorArtApproved,false);
});
test('Saltreach has eight true vertical source-glass lantern windows with producer Pack4 ABI and no powered beacon',()=>{
 const b=buildSaltreachTidalLanternStation(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 const high=b.placements.filter(p=>p.highUprightPack4Pane),low=b.placements.filter(p=>p.role==='window'&&!p.highUprightPack4Pane);
 assert.equal(high.length,8);assert.equal(low.length,10);
 assert.equal(b.placements.filter(p=>p.asset==='pack4:030').length,18);
 assert.deepEqual([...new Set(high.map(p=>p.orientation))].sort(),['east','north','south','west']);
 const outward={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const p of high){
  assert.equal(p.at[1],18);
  assert.equal(p.role,'window');assert.equal(p.asset,'pack4:030');
  assert.equal(p.lanternUnlit,true);
  assert.equal(p.producerCollisionInLiveGameCertified,false);
  assert.equal(p.actualWaterSealApproved,false);
  const [x,y,z]=p.at,[dx,dz]=outward[p.orientation];
  assert.equal(cells.get(K([x,y-1,z]))?.role,'wall','missing actual glass sill');
  assert.equal(cells.get(K([x,y+1,z]))?.role,'wall','missing actual glass lintel');
  assert.ok(!cells.has(K([x+dx,y,z+dz])),'high window facing occupied stone');
  const actual=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(actual.id,159);assert.equal(actual.mount,'opening');
  assert.ok(actual.visible.some(part=>part.bounds[4]-part.bounds[1]>.65),'true glass not vertical');
  assert.ok(actual.selection.length&&actual.collision.length,'actual producer selection/collision missing');
  assert.equal(actual.registeredInLiveGame,false);
 }
});
test('Saltreach strict unrelaxed eight-way historical lighthouse D4 against all 228 accepted 1B + Frostwake', {timeout:240000},async()=>{
 const old=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  old.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(old.length,228,'historical accepted 1B source count changed');
 assert.equal(new Set(old.map(b=>b.id)).size,228);
 const b=buildSaltreachTidalLanternStation(),same=old.filter(x=>x.category===b.category);
 assert.ok(same.length>=20,'historic lighthouse source corpus missing');
 assert.ok(!old.some(p=>p.id===b.id),'historical accepted original collision');
 const current=d4(b,false,0),others=[...same,buildFrostwakeCrownbridgeLighthouse()];
 let closest=null,max=0,comparisons=0;
 for(const item of others)for(const flip of [false,true])for(const turn of [0,1,2,3]){
  const similarity=iou(current,d4(item,flip,turn));comparisons++;
  if(similarity>max){max=similarity;closest=item.id;}
  assert.ok(similarity<.85,'Saltreach too similar to '+item.id+' IoU='+similarity);
 }
 assert.ok(comparisons>=248,'historic 8-way comparison incomplete');
 console.log('SALTREACH_STRICT_HISTORICAL_LIGHTHOUSE_D4_PASS '+JSON.stringify({
  accepted:228,otherProvisionalCompared:1,comparisons,maxD4:max,closest,
  creatorArtApproved:false,liveGamePlaced:false,iphoneTested:false
 }));
});
