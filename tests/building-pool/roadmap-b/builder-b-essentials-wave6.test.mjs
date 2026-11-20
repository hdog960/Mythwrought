// Builder B 1B source-only Tidehollow bathhouse Wave5: exact 115 B / 92 D ownership and strict historic D4 gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTidehollowCrosswharfHarborOffice,TIDEHOLLOW_HARBOR_OFFICE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildTidehollowSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
const K=x=>x.join(',');
const allOccupied=b=>new Set(b.placements.map(p=>K(p.at)));
async function historical(){
 const b=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const module=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  b.push(...module['getRoadmapBWave'+i+'B1']());
 }
 return b;
}
function d4(b,flip,turn){
 const v=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Z=Math.floor(16*p.at[2]/d),Y=Math.floor(12*p.at[1]/h),
   A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  v.add([x,Y,z,p.role].join('/'));
 }return v;
}
const iou=(a,b)=>{let n=0;for(const v of a)if(b.has(v))n++;return n/(a.size+b.size-n||1)};
test('Tidehollow exact new temperate harbor office is B-exclusive and protected D 92 unchanged',()=>{
 const owner=getBuilderBServiceOwnership(),b=buildTidehollowSplitWellBathhouse(),all=[
  buildBriarfordSwitchwingBarn(),buildAlderglassTrellisConservatory(),
  buildSedgewatchTidehookFishingLodge(),buildMeadowstepSplitAisleStables(),buildSunshardSplitWellBathhouse(),b
 ];
 assert.equal(b.id,TIDEHOLLOW_HARBOR_OFFICE_ID);
 assert.ok(owner.builderBIds.includes(b.id));
 assert.ok(!owner.builderDAvailableIds.includes(b.id));
 assert.deepEqual([owner.builderBIds.length,owner.builderDAvailableIds.length],[115,92]);
 assert.deepEqual([validateAllocation(all).authored,validateAllocation(all).remaining],[6,429]);
 assert.equal(b.worldPlacement,false);
});
test('Original seven-room temperate harbor office has fully connected authentic XY/Z circulation, sky-open 30-column court, backed roof and two-high portals',()=>{
 const b=buildTidehollowSplitWellBathhouse(),vox=allOccupied(b);
 assert.equal(b.rooms.length,7);assert.equal(b.portals.length,9);
 assert.ok(b.walkable.length>1000);
 for(let x=21;x<=25;x++)for(let z=19;z<=24;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'not an actual absent-ground courtyard');
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(vox.has(K([p.at[0],p.at[1]-1,p.at[2]])),'unsupported original desert bath roof');
 for(const d of b.portals)
  assert.ok(!vox.has(K(d.at))&&!vox.has(K([d.at[0],d.at[1]+1,d.at[2]])),'physically blocked bathhouse portal');
 assert.equal(structuralFingerprint(b),structuralFingerprint(buildTidehollowSplitWellBathhouse()));
});
test('Strict 8-way same-category D4 below .85 against every prior accepted 1B original', {timeout:240000},async()=>{
 const old=await historical(),b=buildTidehollowSplitWellBathhouse();
 assert.equal(old.length,228);
 const category=old.filter(x=>x.category===b.category);
 assert.ok(category.length>=20,'historical bathhouses unexpectedly absent');
 const original=d4(b,false,0);
 let max=0,near=null;
 for(const source of category){
  assert.notEqual(source.id,b.id,'original temperate harbor office ID reused');
  for(const flip of [false,true])for(const turn of [0,1,2,3]){
   const sim=iou(original,d4(source,flip,turn));
   if(sim>max){max=sim;near=source.id;}
   assert.ok(sim<.85,b.id+' near-cloned from '+source.id+' IoU='+sim);
  }
 }
 console.log('Tidehollow strict eight-way same-category D4 max '+max+' nearest '+near);
});
