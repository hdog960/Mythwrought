import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_ARCADED_FRONT_SHOPS,M1_ARCADED_FRONT_SPECS,author2AArcadedFront} from '../../../src/building-pool/roadmap-2a/m1-arcaded-front-shops.mjs';
import {author2ALandmark} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inspect2ARoofAndWindows} from '../../../src/building-pool/roadmap-2a/m1-roof-family-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>x+','+y+','+z;
const F=(x,z)=>x+','+z;
function mask(s){
 const pts=new Set();
 for(const [a,b,c,d] of s.rects)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)pts.add(F(x,z));
 for(const [a,b,c,d] of s.cuts)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)pts.delete(F(x,z));
 return pts;
}
function normalize(p){
 const minX=Math.min(...p.map(x=>x[0])),minZ=Math.min(...p.map(x=>x[1]));
 return new Set(p.map(([x,z])=>F(x-minX,z-minZ)));
}
function orientations(p){
 const all=[];for(let flip=0;flip<2;flip++)for(let rotation=0;rotation<4;rotation++){
  const moved=p.map(([ax,az])=>{let x=flip?-ax:ax,z=az;for(let i=0;i<rotation;i++){const a=x;x=-z;z=a;}return[x,z]});
  all.push(normalize(moved));
 }return all;
}
const IoU=(a,b)=>{let matches=0;for(const k of a)if(b.has(k))matches++;return matches/(a.size+b.size-matches);};
const floor=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
test('116 previously accepted source objects + six independently authored arcade/frontage buildings = 122 of 420',()=>{
 assert.equal(M1_ARCADED_FRONT_SPECS.length,6);
 assert.equal(M1_ARCADED_FRONT_SHOPS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,128);
 assert.equal(inventory().authoredCandidateTotal,128);
 assert.equal(inventory().newlyAuthored,113);
 assert.equal(inventory().unwrittenNewCandidates,292);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,128);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,128);
 for(const b of M1_ARCADED_FRONT_SHOPS){
  assert(validateBlueprint(b).valid);
  assert.equal(b.rooms.length,4);
  assert.equal(b.isolated,true);assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);assert.equal(b.status,'authored-candidate');
 }
});
test('original foundation/floor and source-owned base roof remain exact and all courtyards really sky-open',()=>{
 for(let i=0;i<6;i++){
  const b=M1_ARCADED_FRONT_SHOPS[i],s=M1_ARCADED_FRONT_SPECS[i],target=mask(s);
  for(const [name,kind,y] of [['ground','foundation',0],['walkable floor','floor',1],['original roof','roof',s.h+1]]){
   const actual=new Set(b.voxels.filter(v=>v.kind===kind&&v.y===y).map(v=>F(v.x,v.z)));
   assert.deepEqual(actual,target,b.id+' untruthful original '+name+' source');
  }
  for(const [a,c,d,e] of s.cuts)for(let x=a;x<=c;x++)for(let z=d;z<=e;z++)
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' fake open-to-sky courtyard '+F(x,z));
  assert(target.size>1100,b.id+' is not a substantial separate ground-floor plan');
 }
});
test('physical façade has three truly open front arches, a source-founded recessed screen with six 2-wide access cells and four west arches',()=>{
 for(let i=0;i<6;i++){
  const b=M1_ARCADED_FRONT_SHOPS[i],s=M1_ARCADED_FRONT_SPECS[i],vox=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const allowed=[s.entry-5,s.entry-4,s.entry,s.entry+1,s.entry+4,s.entry+5];
  const front=[s.entry-6,s.entry-5,s.entry-4,s.entry,s.entry+1,s.entry+4,s.entry+5,s.entry+6];
  for(const x of front)for(let y=2;y<=5;y++)assert(!vox.has(K(x,y,0)),b.id+' front arch not carved out of a genuine source wall '+K(x,y,0));
  for(let x=s.front[0];x<=s.front[1];x++)for(let y=2;y<=s.h;y++){
   const v=vox.get(K(x,y,3));
   if(allowed.includes(x)&&y<=5)assert(!v,b.id+' fake inner recessed entry air '+K(x,y,3));
   else assert.equal(v?.kind,'wall',b.id+' inner recessed physical screen missing '+K(x,y,3));
  }
  for(const z of [20,21,27,28])for(let y=2;y<=4;y++)assert(!vox.has(K(0,y,z)),b.id+' false west-side open arcade');
  for(const z of [20,21,27,28])for(let y=2;y<=5;y++)
   assert(!vox.has(K(s.w-1,y,z)),b.id+' camera-facing east arcade has uncarved wall '+K(s.w-1,y,z));
  for(const x of [s.entry+9,s.entry+10])for(let y=2;y<=4;y++)
   assert(!vox.has(K(x,y,s.d-1)),b.id+' camera-facing rear arcade has uncarved wall '+K(x,y,s.d-1));
  assert.equal(b.facadeArticulation.frontArcades,3);
  assert.equal(b.facadeArticulation.openWestArcades,2);
  assert.equal(b.facadeArticulation.openEastArcades,2);
  assert.equal(b.facadeArticulation.openRearArcade,1);
  assert(b.facadeArticulation.removedWeatherWallCells>=36);
  assert(b.facadeArticulation.insideRecessWallCells>=100);
 }
});
test('sixteen real source upper Pack4 window cells include camera-facing east/rear glazing and preserve all old source outside documented art changes',()=>{
 for(let i=0;i<6;i++){
  const b=M1_ARCADED_FRONT_SHOPS[i],s=M1_ARCADED_FRONT_SPECS[i],
   old=author2ALandmark(s),oldMap=new Map(old.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   actual=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const newWindows=b.openings.filter(o=>o.type==='window'&&!old.openings.some(p=>p.x===o.x&&p.y===o.y&&p.z===o.z));
  assert.equal(newWindows.length,16,b.id+' sixteen front, west, east and rear glazing source cells mandatory');
  for(const w of newWindows){
   const k=K(w.x,w.y,w.z);
   assert.equal(oldMap.get(k)?.kind,'wall',b.id+' glazing was not source-wall carve');
   assert.equal(actual.get(k)?.kind,'window');
   assert.equal(actual.get(k)?.material,w.material);
  }
  for(const [x,z] of s.rearButtresses){
   assert.equal(oldMap.get(K(x,1,z))?.kind,'floor',b.id+' explicit rear buttress base missing');
   assert.equal(oldMap.get(K(x,2,z)),undefined,b.id+' rear source coordinate already occupied by weather wall or pier');
   assert.equal(actual.get(K(x,2,z))?.kind,'wall',b.id+' rear supported buttress not authored');
  }
  const supports=b.voxels.filter(v=>v.architecturalRole==='source-founded-recessed-facade-buttress');
  assert(supports.length>=70,b.id+' missing physical facade and near-facing source-founded buttresses');
  for(const v of supports){
   assert.equal(actual.get(K(v.x,1,v.z))?.kind,'floor',b.id+' ungrounded buttress '+K(v.x,v.y,v.z));
   if(v.y>2)assert.equal(actual.get(K(v.x,v.y-1,v.z))?.kind,'wall',b.id+' broken buttress source load path '+K(v.x,v.y,v.z));
  }
  // Existing original cells outside declared carvings and raised roof additions are source-exact.
  const carvedFront=new Set([s.entry-6,s.entry-5,s.entry-4,s.entry,s.entry+1,s.entry+4,s.entry+5,s.entry+6]);
  for(const v of old.voxels){
   const p=K(v.x,v.y,v.z),now=actual.get(p);
   const expectedCarve=(v.z===0&&carvedFront.has(v.x)&&v.y>=2&&v.y<=5)||
      (v.x===0&&[20,21,27,28].includes(v.z)&&v.y>=2&&v.y<=4)||
      (v.x===s.w-1&&[20,21,27,28].includes(v.z)&&v.y>=2&&v.y<=5)||
      (v.z===s.d-1&&[s.entry+9,s.entry+10].includes(v.x)&&v.y>=2&&v.y<=4);
   if(expectedCarve){assert(!now,b.id+' original wall uncarved '+p);continue;}
   if(newWindows.some(w=>K(w.x,w.y,w.z)===p)){assert.equal(now?.kind,'window');continue;}
   assert.deepEqual(now,v,b.id+' modified original source cell outside declared independent façade geometry '+p);
  }
 }
});
test('source-backed roof transitions form genuinely distinct front roof profiles with no floating roof cells',()=>{
 const profiles=new Set();
 for(let i=0;i<6;i++){
  const b=M1_ARCADED_FRONT_SHOPS[i],s=M1_ARCADED_FRONT_SPECS[i],
    vox=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const newly=b.voxels.filter(v=>v.architecturalRole?.startsWith('distinct-facade-')||
    v.architecturalRole==='source-supported-split-rear-eaves'||
    v.architecturalRole?.startsWith('visible-near-east-eave-')||
    v.architecturalRole?.startsWith('visible-near-rear-eave-'));
  const nearFacing=newly.filter(v=>v.architecturalRole?.startsWith('visible-near-east-eave-')||
    v.architecturalRole?.startsWith('visible-near-rear-eave-'));
  assert.equal(nearFacing.length,b.facadeArticulation.visibleNearFacingRoofCells,
    b.id+' must source-count all camera-facing roof voxels');
  assert.equal(newly.length,b.facadeArticulation.sourceRoofTransitionCells);
  assert(newly.length>=75,b.id+' new architecture has only nominal roof change');
  assert(b.facadeArticulation.rearTransitions>=8);
  assert(b.facadeArticulation.visibleNearFacingRoofCells>=65,b.id+' camera-facing roof changed only on paper');
  profiles.add(b.category);
  for(const v of newly){
   assert.equal(v.kind,'roof');
   assert.equal(vox.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' new roof floating '+K(v.x,v.y,v.z));
   assert.equal(vox.get(K(v.x,s.h+1,v.z))?.kind,'roof',b.id+' source weather plate absent '+K(v.x,v.y,v.z));
  }
 }
 assert.equal(profiles.size,6);
 const a=inspect2ARoofAndWindows(M1_ARCADED_FRONT_SHOPS);
 assert.equal(a.designs,6);
 assert.equal(a.raisedMissingVerticalSupport,0,'actual supported roof must not float');
 assert.equal(a.worldSupportCertified,false,'physical structure engineering is still unapproved');
});
test('all 24 original ground-floor room access anchors reachable after source windows/portals and real Pack5 occupied footprints',()=>{
 let count=0;
 for(const b of M1_ARCADED_FRONT_SHOPS){
  const grid=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>F(v.x,v.z))),occupied=new Map();
  for(const f of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const asset=resolveManualFivePackAsset(f.material,{variant:f.physicalVariant,orientation:f.intendedFacing??'north'});
   assert(asset.occupiedOffsets.length>0);
   for(const [dx,dy,dz] of asset.occupiedOffsets){
    const x=f.x+dx,y=f.y+dy,z=f.z+dz,k=K(x,y,z),old=grid.get(k);
    assert(!old||k===K(f.x,f.y,f.z)||old.kind==='floor',b.id+' Pack5 physical collision '+k);
    assert.equal(grid.get(K(x,1,z))?.kind,'floor',b.id+' unsupported real producer occupied-offset '+k);
    assert(!occupied.has(k),b.id+' two Pack5 parts share one source coordinate '+k);
    occupied.set(k,f.material);blocked.add(F(x,z));
   }
  }
  const entrance=b.openings.find(o=>o.type==='entrance'),q=[[entrance.x,1]],seen=new Set();
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i],p=F(x,z);
   if(seen.has(p)||blocked.has(p)||x<0||z<0||x>=b.extents.x||z>=b.extents.z||
    grid.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>grid.has(K(x,y,z))))continue;
   seen.add(p);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const r of b.rooms){assert(seen.has(r.access.join(',')),b.id+' physically blocked room '+r.name+' '+r.access);count++;}
  if(b.category==='bank'){
   const door=b.openings.find(o=>o.role==='vault-threshold');assert(door,b.id+' no real bank two-leaf vault');
   const asset=resolveManualFivePackAsset(door.doorSymbol,{variant:door.physicalVariant,orientation:door.intendedFacing});
   assert.equal(asset.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of asset.occupiedOffsets)for(let y=0;y<3;y++)
    assert(!grid.has(K(door.x+dx,door.y+dy+y,door.z+dz)),b.id+' bank vault gate not 2-wide 3-high physically clear');
  }
 }
 assert.equal(count,24);
});
test('strict eight-way D4 occupied-floor IoU <0.89 for all new 6 versus all 122, unchanged historic 269-pair ledger',()=>{
 const all=M1_D4_AUDIT_ALL,normal=all.map(b=>({id:b.id,p:normalize(floor(b))}));
 for(const b of M1_ARCADED_FRONT_SHOPS){
  const moves=orientations(floor(b));let highest=0,near='';
  for(const other of normal)if(other.id!==b.id){
   const i=Math.max(...moves.map(p=>IoU(p,other.p)));
   if(i>highest){highest=i;near=other.id;}
  }
  assert(highest<.89,b.id+' too close to '+near+' D4 IoU '+highest);
 }
 const ledger=inspect2AD4FloorDebt();
 assert.equal(ledger.sources,122);
 assert.equal(ledger.protectedOriginals,74);
 assert.equal(ledger.grandfatheredHighOverlapPairs,269);
 assert.equal(ledger.exactMatchingFloorPairs,30);
 assert.equal(ledger.newHighOverlapPairs,0);
});
test('source integrity fails closed for ungrounded portico, blocked recessed portal and illegal supported roof base',()=>{
 const s=M1_ARCADED_FRONT_SPECS[0];
 const bad={...s,front:[0,44]};
 assert.throws(()=>author2AArcadedFront(bad),/recessed wall is not on source floor|source geometry collision/);
 const b=M1_ARCADED_FRONT_SHOPS[0],portal=b.openings.find(o=>o.role==='two-wide-inner-loggia-passage');
 assert(portal);
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:portal.x,y:2,z:portal.z,kind:'wall',material:s.wall}]}),/blocked internal doorway/);
});
