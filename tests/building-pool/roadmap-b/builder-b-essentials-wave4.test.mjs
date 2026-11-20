// MYTHWROUGHT Builder B 1B isolated stable Wave4: no original source file changed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMeadowstepSplitAisleStables,MEADOWSTEP_STABLES_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
const K=p=>p.join(',');
const cells=b=>new Set(b.placements.map(p=>K(p.at)));
function d4(b,flip,r){
 const out=new Set(),{width:w,depth:d,height:h}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Z=Math.floor(16*p.at[2]/d),Y=Math.floor(12*p.at[1]/h);
  const a=flip?15-X:X;let x=a,z=Z;
  if(r===1)[x,z]=[Z,15-a];
  if(r===2)[x,z]=[15-a,15-Z];
  if(r===3)[x,z]=[15-Z,a];
  out.add([x,Y,z,p.role].join('/'));
 }
 return out;
}
const overlap=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);};
async function allAccepted(){
 const out=[...get1BCandidates(),createStoneveinSwitchbackBaths()];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  out.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 return out;
}
test('Meadowstep is Builder B exclusive with 4 provisional community source originals and D 92 unchanged',()=>{
 const o=getBuilderBServiceOwnership(),b=buildMeadowstepSplitAisleStables();
 const all=[buildBriarfordSwitchwingBarn(),buildAlderglassTrellisConservatory(),
  buildSedgewatchTidehookFishingLodge(),b];
 assert.equal(b.id,MEADOWSTEP_STABLES_ID);
 assert.ok(o.builderBIds.includes(b.id),'Not reserved to Builder B');
 assert.ok(!o.builderDAvailableIds.includes(b.id),'Builder D owned stable ID');
 assert.deepEqual([o.builderBIds.length,o.builderDAvailableIds.length],[115,92]);
 assert.deepEqual([validateAllocation(all).authored,validateAllocation(all).remaining],[4,431]);
 assert.equal(b.worldPlacement,false);
});
test('Meadowstep four separate service stall spaces, supported roofs, open-air court and valid 2-cell portals',()=>{
 const b=buildMeadowstepSplitAisleStables(),v=cells(b);
 assert.equal(b.rooms.length,8);assert.equal(b.portals.length,9);assert.ok(b.walkable.length>800);
 for(let x=20;x<=25;x++)for(let z=19;z<=24;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'court not actually open');
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(v.has(K([p.at[0],p.at[1]-1,p.at[2]])),'Unsupported stall roof '+K(p.at));
 for(const d of b.portals){
  assert.ok(!v.has(K(d.at)),'Doorway blocked '+K(d.at));
  assert.ok(!v.has(K([d.at[0],d.at[1]+1,d.at[2]])),'Portal headroom blocked');
 }
 const names=new Set(b.rooms.map(r=>r.id));
 for(const p of b.portals)
  assert.ok((p.from==='outside'||names.has(p.from))&&names.has(p.to),'Nonroom/cut-off portal');
 assert.equal(structuralFingerprint(b),structuralFingerprint(buildMeadowstepSplitAisleStables()));
});
test('Meadowstep strictly below original 1B same-category eight-way D4 threshold 0.85', {timeout:240000},async()=>{
 const old=await allAccepted(),b=buildMeadowstepSplitAisleStables();
 assert.equal(old.length,228);
 const same=old.filter(p=>p.category==='stable'),base=d4(b,false,0);
 assert.ok(same.length>=30,'Old stable census not fully loaded');
 let max=0,nearest='';
 for(const o of same){
  assert.notEqual(o.id,b.id,'Stable ID reused');
  for(const flip of [false,true])for(const turn of [0,1,2,3]){
   const similarity=overlap(base,d4(o,flip,turn));
   if(similarity>max){max=similarity;nearest=o.id;}
   assert.ok(similarity<.85,b.id+' vs '+o.id+' normalized D4 '+similarity);
  }
 }
 console.log('Meadowstep same-category strict eight-way D4 max '+max+' vs '+nearest);
});
