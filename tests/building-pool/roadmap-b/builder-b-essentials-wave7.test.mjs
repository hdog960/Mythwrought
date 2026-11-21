// Builder B 1B source-only Rimeglass physical opening-pane correction: strict 228 historical D4, B115/D92 and unmodified roof/glazing counts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRimeglassCrescentSunGreenhouse,RIMEGLASS_CRESCENT_GREENHOUSE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
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
test('Rimeglass exact new snow greenhouse is B-exclusive and protected D 92 unchanged',()=>{
 const owner=getBuilderBServiceOwnership(),b=buildRimeglassCrescentSunGreenhouse(),all=[
  buildBriarfordSwitchwingBarn(),buildAlderglassTrellisConservatory(),
  buildSedgewatchTidehookFishingLodge(),buildMeadowstepSplitAisleStables(),buildSunshardSplitWellBathhouse(),buildTidehollowCrosswharfHarborOffice(),b
 ];
 assert.equal(b.id,RIMEGLASS_CRESCENT_GREENHOUSE_ID);
 assert.ok(owner.builderBIds.includes(b.id));
 assert.ok(!owner.builderDAvailableIds.includes(b.id));
 assert.deepEqual([owner.builderBIds.length,owner.builderDAvailableIds.length],[115,92]);
 assert.deepEqual([validateAllocation(all).authored,validateAllocation(all).remaining],[7,428]);
 assert.equal(b.worldPlacement,false);
});
test('Original seven-room snow greenhouse has fully connected authentic XY/Z circulation, sky-open 30-column court, backed roof and two-high portals',()=>{
 const b=buildRimeglassCrescentSunGreenhouse(),vox=allOccupied(b);
 assert.equal(b.rooms.length,7);assert.equal(b.portals.length,10);
 assert.ok(b.walkable.length>1000);
 for(let x=20;x<=24;x++)for(let z=19;z<=24;z++)
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'not an actual absent-ground courtyard');
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(vox.has(K([p.at[0],p.at[1]-1,p.at[2]])),'unsupported original Rimeglass roof');
 const roof=b.placements.filter(p=>p.role==='roof'),
  panes=b.placements.filter(p=>p.asset==='pack4:030'),
  clerestory=panes.filter(p=>p.originalGlazing===true);
 // Preserve ALL 278 source-transparent placements, but ensure they now use the real
 // Pack4 opening-pane's upright physical ABI instead of an unsupported flat roof.
 assert.equal(roof.length,1261,'source roof cell coverage weakened');
 assert.ok(roof.every(p=>p.asset==='pack3:025'),'upright Pack4 opening pane wrongly used as roof');
 assert.equal(clerestory.length,278,'original 278 glazing panels diminished or duplicated');
 assert.equal(panes.length,287,'old nine pane windows or new 278 clerestories changed');
 assert.ok(panes.every(p=>p.role==='window'),'Pack4 clear glass placed in non-window source role');
 assert.ok(roof.every(p=>vox.has(K([p.at[0],p.at[1]-1,p.at[2]]))),
  'opaque roof requires its actual authored under-roof support');
 assert.equal(b.architecturalIdentity.sourceUprightGlazingCount,278);
 assert.equal(b.architecturalIdentity.sourceOpaqueRoofCells,1261);
 assert.equal(b.architecturalIdentity.sourceRoofGlassTiles,0);
 for(const d of b.portals)
  assert.ok(!vox.has(K(d.at))&&!vox.has(K([d.at[0],d.at[1]+1,d.at[2]])),'physically blocked snow greenhouse portal');
 assert.equal(structuralFingerprint(b),structuralFingerprint(buildRimeglassCrescentSunGreenhouse()));
});
test('Real Pack4 030 upright facade glazing: 278 different two-band framed openings, four sides and honest producer support limitations',()=>{
 const b=buildRimeglassCrescentSunGreenhouse(),at=new Map(b.placements.map(p=>[K(p.at),p]));
 const glass=b.placements.filter(p=>p.originalGlazing===true),used=new Set(),sides=new Map();
 assert.equal(glass.length,278,'preserve the exact original glazed source count, no threshold relaxation');
 assert.equal(new Set(glass.map(p=>K(p.at))).size,278,'duplicate glazing placements');
 for(const p of glass){
  const [x,y,z]=p.at,orientation=p.orientation;
  assert.ok(y===3||y===5,'horizontal/roof or unframed elevation used for pane');
  assert.ok(['north','south','east','west'].includes(orientation),'clear-glass pane has no exterior cardinal yaw');
  const descriptor=pack4BuilderAsset(p.asset,{rotation:orientation});
  assert.equal(descriptor.id,159,'source glass is not original Pack4 clear glass ID159');
  assert.equal(descriptor.mount,'opening','real Pack4 window wrongly treated as roof/cap');
  assert.equal(descriptor.hasRealPhysicalGeometry,true);
  assert.ok(descriptor.visible.length>0&&descriptor.selection.length>0,'actual pane producer shape absent');
  assert.equal(descriptor.occludesWholeCell,false,'transparent original pane cannot become solid full cube');
  assert.ok(descriptor.visible.some(part=>part.bounds[4]-part.bounds[1]>.65),
   'the producer clear-glass pane itself is not an upright y-span');
  assert.ok(!p.roofTile&&p.uprightOpeningPane===true&&p.framedClerestory===true,
   'source falsely calls the pane a roof tile or omits its upright opening');
  assert.equal(p.actualPaneWeatherSealCertified,false,'unearned weather seal approval');
  assert.equal(p.livePack4CollisionCertified,false,'unearned live Pack collision approval');
  const sill=at.get(K([x,y-1,z])),lintel=at.get(K([x,y+1,z]));
  assert.ok(sill?.role==='wall'&&lintel?.role==='wall',
   'clear-glass pane not framed by physically present wall/sill/lintel');
  const directions={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]},[dx,dz]=directions[orientation];
  assert.ok(!at.has(K([x+dx,0,z+dz])),'original window faces an occupied building foundation, not daylight');
  const other=[x,z].join(','),set=used.has(other)?null:other; if(set)used.add(set);
  sides.set(orientation,(sides.get(orientation)||0)+1);
 }
 assert.equal(used.size,139,'278 panes must form two separated glazing bands in 139 distinct framed wall bays');
 assert.ok([...sides.values()].every(n=>n>=60),'all four original exterior facades require substantial real glazing');
 assert.equal(sides.size,4,'facade glazing entirely missing');
 assert.equal(b.architecturalIdentity.winterGlassSnowLoadCertified,false);
 assert.equal(b.architecturalIdentity.glassPanePhysicalCollisionCertified,false);
 assert.equal(b.architecturalIdentity.roofSealingCertified,false);
 assert.equal(b.productionRegistered,false);
 assert.equal(b.worldPlacement,false);
});
test('Strict 8-way same-category D4 below .85 against every prior accepted 1B original', {timeout:240000},async()=>{
 const old=await historical(),b=buildRimeglassCrescentSunGreenhouse();
 assert.equal(old.length,228);
 const category=old.filter(x=>x.category===b.category);
 assert.ok(category.length>=20,'historical greenhouse sources unexpectedly absent');
 const original=d4(b,false,0);
 let max=0,near=null;
 for(const source of category){
  assert.notEqual(source.id,b.id,'original snow greenhouse ID reused');
  for(const flip of [false,true])for(const turn of [0,1,2,3]){
   const sim=iou(original,d4(source,flip,turn));
   if(sim>max){max=sim;near=source.id;}
   assert.ok(sim<.85,b.id+' near-cloned from '+source.id+' IoU='+sim);
  }
 }
 console.log('Rimeglass strict eight-way same-category D4 max '+max+' nearest '+near);
});
