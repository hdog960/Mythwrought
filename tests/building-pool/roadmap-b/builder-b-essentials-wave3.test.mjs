// Builder B 1B downstream Wave3: source-only strict canonical ID ownership + D4 provenance acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSedgewatchTidehookFishingLodge,SEDGEWATCH_FISHING_LODGE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {createStoneveinSwitchbackBaths} from '../../../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
const key=p=>p.join(',');
const frame=b=>new Set(b.placements.map(p=>key(p.at)));
function normalizedD4(b,mirror,turn){
 const v=new Set(),W=b.footprint.width,D=b.footprint.depth,H=b.footprint.height;
 for(const p of b.placements){
  const x=Math.floor(16*p.at[0]/W),z=Math.floor(16*p.at[2]/D),y=Math.floor(12*p.at[1]/H);
  const a=mirror?15-x:x;
  let u=a,w=z;if(turn===1)[u,w]=[z,15-a];if(turn===2)[u,w]=[15-a,15-z];if(turn===3)[u,w]=[15-z,a];
  v.add([u,y,w,p.role].join('/'));
 }
 return v;
}
function iou(a,b){let hit=0;for(const v of a)if(b.has(v))hit++;return hit/(a.size+b.size-hit||1)}
async function accepted(){
 const waves=[];
 for(let i=1;i<=15;i++){
  const mod=await import('../../../src/building-pool/roadmap-b/wave'+i+'-community-b1.mjs');
  waves.push(...mod['getRoadmapBWave'+i+'B1']());
 }
 return [...get1BCandidates(),createStoneveinSwitchbackBaths(),...waves];
}
test('Sedgewatch new fishing lodge ID belongs ONLY to 115 B freeze, never Builder D',()=>{
 const own=getBuilderBServiceOwnership(),old=[buildBriarfordSwitchwingBarn(),buildAlderglassTrellisConservatory()],b=buildSedgewatchTidehookFishingLodge();
 assert.equal(b.id,SEDGEWATCH_FISHING_LODGE_ID);
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.equal(new Set([...own.builderBIds,...own.builderDAvailableIds]).size,207);
 assert.deepEqual([validateAllocation([...old,b]).authored,validateAllocation([...old,b]).remaining],[3,432]);
 assert.equal(b.worldPlacement,false);
});
test('Sedgewatch roofs have literal bearing and preserve truly sky-open negative columns and traversable rooms',()=>{
 const b=buildSedgewatchTidehookFishingLodge(),vox=frame(b);
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,8);
 assert.ok(b.walkable.length>650);
 for(let x=19;x<=24;x++)for(let z=18;z<=23;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake courtyard foundation/roof');
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(vox.has(key([p.at[0],p.at[1]-1,p.at[2]])),'unsupported source roof '+key(p.at));
 for(const d of b.portals)
  assert.ok(!vox.has(key(d.at))&&!vox.has(key([d.at[0],d.at[1]+1,d.at[2]])),'blocked two-high doorway '+key(d.at));
 assert.equal(structuralFingerprint(b),structuralFingerprint(buildSedgewatchTidehookFishingLodge()),'nondeterministic source geometry');
});
test('Eight-way same-category D4 <0.85 against every genuinely authored accepted 1B source', {timeout:240000},async()=>{
 const prior=await accepted(),b=buildSedgewatchTidehookFishingLodge();
 assert.equal(prior.length,228);
 const same=prior.filter(p=>p.category===b.category);
 assert.ok(same.length>=20,'historical same-category portfolio unexpectedly missing');
 const current=normalizedD4(b,false,0);
 let highest=0,closest=null;
 for(const old of same){
  assert.notEqual(old.id,b.id,'accepted original fishing lodge ID collision');
  for(const flip of [false,true])for(const turn of [0,1,2,3]){
   const overlap=iou(current,normalizedD4(old,flip,turn));
   if(overlap>highest){highest=overlap;closest=old.id;}
   assert.ok(overlap<.85,'source D4 near-clone '+b.id+' vs '+old.id+' IoU='+overlap);
  }
 }
 console.log('Sedgewatch historical same-category eight-way strict D4 maximum '+highest+' vs '+closest);
});
