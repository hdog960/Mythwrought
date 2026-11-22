// One native historical originality gate for BOTH new Builder B Waves16–17.
// Intentional CI efficiency: authentic prior 228 1B originals are compiled ONCE,
// not independently recompiled in each focused Wave16 and Wave17 test file.
// This is source-only comparison, NOT visual/WebGL2/game/iPhone approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {buildFrostlineEightWingIcewatchLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
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
const iou=(a,b)=>{let shared=0;for(const k of a)if(b.has(k))shared++;return shared/(a.size+b.size-shared||1)};
test('Exact historical 228 accepted 1B source census and same-category 8-way D4 for Frostline & Amberwell',{timeout:240000},async()=>{
 const old=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  old.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(old.length,228,'exact frozen 228 authentic source census changed');
 assert.equal(new Set(old.map(x=>x.id)).size,228,'duplicate accepted source IDs');
 const ownership=getBuilderBServiceOwnership();
 assert.deepEqual([ownership.existing,ownership.forBuilderB,ownership.forBuilderD],[228,115,92]);
 const originalTargets=[
  {target:buildFrostlineEightWingIcewatchLodge(),
   older:[buildSedgewatchTidehookFishingLodge(),buildDunewakeOasisReedworksFishingLodge()]},
  {target:buildAmberwellSandglassConservatory(),
   older:[buildAlderglassTrellisConservatory(),buildRimeglassCrescentSunGreenhouse(),
    buildGlimmerboughSplitSunOrchidHouse()]}
 ];
 const summary=[];
 for(const {target,older} of originalTargets){
  assert.ok(ownership.builderBIds.includes(target.id),'target no longer B115-exclusive '+target.id);
  assert.ok(!ownership.builderDAvailableIds.includes(target.id),'source steals D92 '+target.id);
  assert.ok(!old.some(x=>x.id===target.id),'historically accepted ID reused '+target.id);
  const peers=[...old.filter(x=>x.category===target.category),...older];
  assert.ok(peers.length>=22,'historical category coverage incomplete '+target.category);
  const actual=d4(target,false,0);
  let n=0,max=0,closest=null;
  for(const peer of peers)for(const flipped of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(actual,d4(peer,flipped,turn));n++;
   if(score>max){max=score;closest=peer.id}
   assert.ok(score<.85,'near-clone '+target.id+' vs '+peer.id+' IoU '+score);
  }
  assert.equal(n,peers.length*8,'unrelaxed 8-way D4 not exhaustive '+target.id);
  summary.push({target:target.id,authentic228:old.length,categoryPeers:peers.length,
   eightWayComparisons:n,maxIoU:max,closest,liveIphoneApproved:false});
 }
 assert.equal(summary.length,2);
 console.log('BUILDER_B_WAVES16_17_SHARED_HISTORICAL_228_D4_PASS '+JSON.stringify(summary));
});
