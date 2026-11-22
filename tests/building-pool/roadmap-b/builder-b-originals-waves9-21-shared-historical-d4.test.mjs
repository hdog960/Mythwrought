// MYTHWROUGHT Builder B shared Waves9–21 canonical 1B historical D4 gate.
// CI EFFICIENCY: build the 228 genuine accepted originals ONCE, validate the
// 19 B-only source originals, and perform strict eight-way same-category
// comparisons for only the new Waves9–21 without duplicating each wave's scan.
// NO live game, world write, real iPhone, finished Pack geometry or artwork claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const builderNames=[
 'buildBriarfordSwitchwingBarn',
 'buildAlderglassTrellisConservatory',
 'buildSedgewatchTidehookFishingLodge',
 'buildMeadowstepSplitAisleStables',
 'buildSunshardSplitWellBathhouse',
 'buildTidehollowCrosswharfHarborOffice',
 'buildRimeglassCrescentSunGreenhouse',
 'buildFrostwakeCrownbridgeLighthouse',
 'buildSaltreachTidalLanternStation',
 'buildDunewakeOasisReedworksFishingLodge',
 'buildMossveilTwinCourtSporeGranary',
 'buildSunspokeForkedShelterCorralStables',
 'buildGlimmerboughSplitSunOrchidHouse',
 'buildGlassduneSplitQuayRegistry',
 'buildIcehavenBifurcatedSnowCustoms',
 'buildFrostlineEightWingIcewatchLodge',
 'buildAmberwellSandglassConservatory',
 'buildHearthspanDoubleCourtWinterBathhouse',
 'buildAuroracrestFoldedFrostSeedhouse',
 'buildBramblecrossSplitRailCoachStables',
 'buildSunscarOpenOculusLanternwatch'
];
function d4(b,flip,turn){
 const set=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  set.add([x,Y,z,p.role].join('/'));
 }
 return set;
}
const iou=(a,b)=>{
 let common=0;for(const p of a)if(b.has(p))common++;
 return common/(a.size+b.size-common||1);
};
test('ONE original 228-source canonical 1B history: immutable B115/D92, 19 new IDs and 11 strict unrelaxed eight-way D4 novelty gates',
 {timeout:240000},async()=>{
 const historical=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  const fn=mod['getRoadmapBWave'+i+'B1'];
  assert.equal(typeof fn,'function','accepted source wave '+i+' absent');
  historical.push(...fn());
 }
 assert.equal(historical.length,228,'accepted 169 canonical + 59 staged count drifted');
 const acceptedIds=new Set(historical.map(b=>b.id));
 assert.equal(acceptedIds.size,228,'historically accepted source IDs overlap');
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 const authored=[];
 for(let i=1;i<=21;i++){
  const source=await import('../../../src/building-pool/roadmap-b/builder-b-essentials-wave'+i+'.mjs');
  const fn=source[builderNames[i-1]];
  assert.equal(typeof fn,'function','missing genuine authored source constructor '+i);
  authored.push(fn());
 }
 assert.equal(authored.length,21);
 const newIds=new Set(authored.map(b=>b.id));
 assert.equal(newIds.size,21,'duplicate new Builder B source IDs');
 const fingerprints=new Set(authored.map(b=>structuralFingerprint(b)));
 assert.equal(fingerprints.size,21,'structurally duplicated new authored originals');
 for(const b of authored){
  assert.ok(own.builderBIds.includes(b.id),'B ownership missing '+b.id);
  assert.ok(!own.builderDAvailableIds.includes(b.id),'source takes Builder D exclusive slot '+b.id);
  assert.ok(!acceptedIds.has(b.id),'source overlaps accepted 228 '+b.id);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
 }
 assert.deepEqual([validateAllocation([...historical,...authored]).authored,
   validateAllocation([...historical,...authored]).remaining],[249,186],
   '1B total quota/candidate identity drift');
 // Cache exact eight orientation variants per historically authentic peer ID,
 // so other target categories do not recompile or re-transform repeated sources.
 const variants=new Map();
 function views(b){
  let cached=variants.get(b.id);
  if(!cached){
   cached=[];
   for(const mirror of [false,true])for(const turn of [0,1,2,3])
    cached.push(d4(b,mirror,turn));
   variants.set(b.id,cached);
  }
  return cached;
 }
 const reports=[];
 for(const target of authored.slice(8)){
  const source=d4(target,false,0);
  const peers=[
   ...historical.filter(p=>p.category===target.category),
   ...authored.filter(p=>p.category===target.category&&p.id!==target.id)
  ];
  assert.ok(peers.length>=21,'genuine same-category historical corpus incomplete for '+target.id);
  let comparisons=0,maxIoU=0,nearest=null;
  for(const peer of peers)for(const transformed of views(peer)){
   const value=iou(source,transformed);comparisons++;
   if(value>maxIoU){maxIoU=value;nearest=peer.id;}
   assert.ok(value<.85,'source D4 near-duplicate '+target.id+' / '+peer.id+' value '+value);
  }
  assert.equal(comparisons,peers.length*8,'non-exhaustive 8-way D4 '+target.id);
  reports.push({id:target.id,category:target.category,acceptedHistorical:228,
   peerSources:peers.length,eightWayComparisons:comparisons,
   closestPeer:nearest,maxIoU,actualIphone:false,creatorArtworkAccepted:false});
 }
 assert.equal(reports.length,13,'expected only 13 brand-new Wave9–21 sources');
 console.log('BUILDER_B_SHARED_WAVES9_21_GENUINE_228_HISTORICAL_D4_PASS '+JSON.stringify(reports));
});
