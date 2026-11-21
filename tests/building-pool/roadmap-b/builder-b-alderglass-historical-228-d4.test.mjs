// Builder B Alderglass: genuine full 228 accepted historic 1B unchanged architectural source comparison.
// No runtime/world/save or approved historical-source writes. Eight strict D4 rotations/reflections
// on actual XYZ placements with original 0.85 same-category IoU rejection threshold.
import test from 'node:test';
import assert from 'node:assert/strict';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
const d4=(b,flip,turn)=>{
 const vox=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Z=Math.floor(16*p.at[2]/d),Y=Math.floor(12*p.at[1]/h),
   A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  vox.add([x,Y,z,p.role].join('/'));
 }return vox;
};
const iou=(a,b)=>{let same=0;for(const k of a)if(b.has(k))same++;return same/(a.size+b.size-same||1);};
test('Corrected original Alderglass greenhouse is below original strict 0.85 eight-way D4 against all 228 accepted community sources', {timeout:240000},async()=>{
 const historic=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  historic.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 assert.equal(historic.length,228,'historical 228 source acceptance baseline changed');
 const ids=new Set(historic.map(x=>x.id));
 assert.equal(ids.size,228,'historical 228 sources have repeated canonical IDs');
 const b=buildAlderglassTrellisConservatory(),owner=getBuilderBServiceOwnership();
 assert.ok(owner.builderBIds.includes(b.id),'Alderglass B115 reservation changed');
 assert.ok(!owner.builderDAvailableIds.includes(b.id),'Alderglass now claims reserved D92');
 assert.ok(!ids.has(b.id),'Alderglass collided with accepted historic ID');
 const source=historic.filter(x=>x.category===b.category);
 assert.ok(source.length>=20,'accepted original greenhouse category unexpectedly incomplete');
 const original=d4(b,false,0);
 let max=0,nearest=null,checked=0;
 for(const old of source){
  for(const flip of [false,true])for(let turn=0;turn<4;turn++){
   const value=iou(original,d4(old,flip,turn));
   checked++;
   if(value>max){max=value;nearest=old.id;}
   assert.ok(value<.85,
    'Corrected Alderglass source is cloned under strict D4 from '+old.id+' IoU='+value);
  }
 }
 assert.ok(checked>=160,'inadequate actual 8-way same-category historical comparisons');
 assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 console.log('ALDERGLASS_REAL_ACCEPTED_228_STRICT_8WAY_D4_PASS '+JSON.stringify({
  originalAccepted:228,comparedSameCategory:source.length,transforms:checked,
  maximumIoU:max,nearest,hardLimit:0.85,realIPhoneApproved:false,productionRegistered:false}));
});
