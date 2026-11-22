// Builder B Wave11 Mossveil original: source-only immutable ownership, backed
// roofing, true dual sky-open courts, upright Pack4 and historical D4 acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMossveilTwinCourtSporeGranary,MOSSVEIL_TWINCOURT_BARN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const old=[buildBriarfordSwitchwingBarn,buildAlderglassTrellisConservatory,
 buildSedgewatchTidehookFishingLodge,buildMeadowstepSplitAisleStables,
 buildSunshardSplitWellBathhouse,buildTidehollowCrosswharfHarborOffice,
 buildRimeglassCrescentSunGreenhouse,buildFrostwakeCrownbridgeLighthouse,
 buildSaltreachTidalLanternStation,buildDunewakeOasisReedworksFishingLodge];
const K=v=>v.join(',');
function d4(b,flip,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(p.at[0]*16/w),Y=Math.floor(p.at[1]*12/h),Z=Math.floor(p.at[2]*16/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let hits=0;for(const x of a)if(b.has(x))hits++;return hits/(a.size+b.size-hits||1)};
test('Mossveil uniquely owns a frozen B115 slot, cannot take D92, and is distinct from earlier ten originals',()=>{
 const owner=getBuilderBServiceOwnership(),b=buildMossveilTwinCourtSporeGranary(),prior=old.map(f=>f());
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 assert.equal(b.id,MOSSVEIL_TWINCOURT_BARN_ID);
 assert.equal(b.id,'r1:farm-barn:enchanted-forest:small:002');
 assert.ok(owner.builderBIds.includes(b.id),'not original reserved B115');
 assert.ok(!owner.builderDAvailableIds.includes(b.id),'Builder D exclusive source slot stolen');
 assert.equal(new Set([...prior,b].map(x=>x.id)).size,11);
 assert.deepEqual([validateAllocation([...prior,b]).authored,validateAllocation([...prior,b]).remaining],[11,424]);
 const fp=structuralFingerprint(b);
 for(const item of prior)assert.notEqual(fp,structuralFingerprint(item),'clone '+item.id);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.liveForestModified,false);
});
test('Mossveil genuine two courtyards, seven roofs, 8 rooms and 11 completely two-high physical doorways',()=>{
 const b=buildMossveilTwinCourtSporeGranary(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.equal(b.placements.length,6148);assert.equal(b.rooms.length,8);
 assert.equal(b.portals.length,11);assert.equal(b.walkable.length,1135);
 assert.deepEqual(b.architecturalIdentity.skyOpenGroveColumns,30);
 assert.deepEqual(b.architecturalIdentity.skyOpenDryingColumns,12);
 for(const [x0,z0,x1,z1] of [[25,20,29,25],[12,32,14,35]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake open-air court '+x+','+z);
 const roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,1431);assert.ok(roofs.every(p=>p.asset.startsWith('pack3:')));
 assert.equal(new Set(roofs.map(p=>p.mossveilSourceRoof||p.namedWing)).size,7);
 for(const p of roofs){
  const [x,y,z]=p.at,base=cells.get(K([x,y-1,z]));
  assert.ok(base&&['wall','partition','support'].includes(base.role),'unbacked roof '+K(p.at));
 }
 for(const port of b.portals){
  assert.ok(!cells.has(K(port.at))&&!cells.has(K([port.at[0],port.at[1]+1,port.at[2]])),
   'blocked original 2-high portal '+K(port.at));
 }
 for(const flag of ['fungusGrowthEnabled','machinesEnabled','realWeatherSealCertified',
   'packPhysicalCollisionCertified','actualIphoneTested','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'unearned acceptance '+flag);
});
test('Twelve original Pack4 upright panes face exterior and retain real producer geometry without live certification',()=>{
 const b=buildMossveilTwinCourtSporeGranary(),cells=new Map(b.placements.map(p=>[K(p.at),p]));
 const panes=b.placements.filter(p=>p.role==='window'),dir={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 assert.equal(panes.length,12);
 for(const p of panes){
  assert.equal(p.asset,'pack4:030');assert.equal(p.at[1],2);
  assert.ok(Object.hasOwn(dir,p.orientation),'non-cardinal Pack4 source pane');
  const [x,y,z]=p.at,[dx,dz]=dir[p.orientation];
  assert.ok(!cells.has(K([x+dx,0,z+dz])),'glass opens against another original wing');
  assert.equal(cells.get(K([x,y-1,z]))?.role,'wall','no actual window sill');
  assert.equal(cells.get(K([x,y+1,z]))?.role,'wall','no actual window lintel');
  const physical=pack4BuilderAsset(p.asset,{rotation:p.orientation});
  assert.equal(physical.id,159);assert.equal(physical.mount,'opening');
  assert.ok(physical.visible.some(part=>part.bounds[4]-part.bounds[1]>.65),'not original upright pane');
  assert.ok(physical.selection.length&&physical.collision.length,'missing producer real AABB');
  assert.equal(physical.registeredInLiveGame,false);
 }
});
test('Mossveil strict unrelaxed 8-way same-category D4 against true 228 accepted originals',{timeout:240000},async()=>{
 const original=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  original.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(original.length,228,'historical source census changed');
 assert.equal(new Set(original.map(x=>x.id)).size,228);
 const b=buildMossveilTwinCourtSporeGranary();
 assert.ok(!original.some(x=>x.id===b.id),'historically owned source slot');
 const same=[...original.filter(x=>x.category===b.category),buildBriarfordSwitchwingBarn()];
 assert.ok(same.length>=21,'missing historic farm-barn originals');
 const now=d4(b,false,0);let checks=0,max=0,closest=null;
 for(const old of same)for(const flip of [false,true])for(let turn=0;turn<4;turn++){
  const score=iou(now,d4(old,flip,turn));checks++;
  if(score>max){max=score;closest=old.id;}
  assert.ok(score<.85,'new Mossveil farm-barn too similar '+old.id+' '+score);
 }
 assert.ok(checks>=168,'unrelaxed eight-way historical D4 comparisons incomplete');
 console.log('BUILDER_B_MOSSVEIL_STRICT_228_D4_PASS '+JSON.stringify({
  accepted:228,comparisons:checks,maxD4:max,closest,
  liveWorld:false,iPhoneAccepted:false,creatorApproved:false
 }));
});
