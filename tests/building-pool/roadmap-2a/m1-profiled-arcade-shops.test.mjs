import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_PROFILED_ARCADE_SPECS,M1_PROFILED_ARCADE_SHOPS,author2AProfiledArcade} from '../../../src/building-pool/roadmap-2a/m1-profiled-arcade-shops.mjs';
import {author2ALandmark} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {assertDistinctArchitecture,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>x+','+y+','+z, F=(x,z)=>x+','+z;
function footprint(s){
 const floor=new Set();
 for(const [a,b,c,d] of s.rects)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)floor.add(F(x,z));
 for(const [a,b,c,d] of s.cuts)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)floor.delete(F(x,z));
 return floor;
}
function norm(points){
 const x0=Math.min(...points.map(v=>v[0])),z0=Math.min(...points.map(v=>v[1]));
 return new Set(points.map(([x,z])=>F(x-x0,z-z0)));
}
function d4(points){
 const all=[];for(let mirror=0;mirror<2;mirror++)for(let angle=0;angle<4;angle++){
  const rotated=points.map(([ax,az])=>{let x=mirror?-ax:ax,z=az;for(let i=0;i<angle;i++){const t=x;x=-z;z=t;}return[x,z]});
  all.push(norm(rotated));
 }return all;
}
const iou=(a,b)=>{let common=0;for(const p of a)if(b.has(p))common++;return common/(a.size+b.size-common)};
const plan=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
test('six source-authored architecturally original premium shops increase draft inventory from 122 to 128 of 420',()=>{
 assert.equal(M1_PROFILED_ARCADE_SHOPS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,128);
 assert.equal(inventory().authoredCandidateTotal,128);
 assert.equal(inventory().newlyAuthored,113);
 assert.equal(inventory().unwrittenNewCandidates,292);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,128);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,128);
 for(const b of M1_PROFILED_ARCADE_SHOPS){
  assert(validateBlueprint(b).valid);
  assert.equal(b.rooms.length,4);assert.equal(b.isolated,true);
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.premiumArchitecture.creatorApproval,false);
  assert.equal(b.premiumArchitecture.walkableUpperLevelClaim,false);
 }
});
test('all six irregular sources have exact true foundation, floor and primary weather plate with genuinely open sky courts',()=>{
 for(let i=0;i<6;i++){
  const b=M1_PROFILED_ARCADE_SHOPS[i],s=M1_PROFILED_ARCADE_SPECS[i],floor=footprint(s);
  for(const [kind,y] of [['foundation',0],['floor',1],['roof',s.h+1]]){
   const actual=new Set(b.voxels.filter(v=>v.kind===kind&&v.y===y).map(v=>F(v.x,v.z)));
   assert.deepEqual(actual,floor,b.id+' false '+kind+' sourced ground');
  }
  assert(floor.size>1400,b.id+' not substantial source architecture');
  for(const [a,c,d,e] of s.cuts)for(let x=a;x<=c;x++)for(let z=d;z<=e;z++)
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' courtyard source is not really sky-open');
 }
});
test('three real east open arcade cells, two-wide rear portal and twelve genuinely carved Pack4 upper windows per building',()=>{
 for(let i=0;i<6;i++){
  const s=M1_PROFILED_ARCADE_SPECS[i],b=M1_PROFILED_ARCADE_SHOPS[i],
   before=new Map(author2ALandmark(s).voxels.map(v=>[K(v.x,v.y,v.z),v])),
   now=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  for(const z of [29,30,31])for(let y=2;y<=4;y++){
   assert.equal(before.get(K(s.w-1,y,z))?.kind,'wall',b.id+' frontless east source');
   assert(!now.has(K(s.w-1,y,z)),b.id+' visual east facade still solid '+K(s.w-1,y,z));
  }
  for(const x of [s.entry+8,s.entry+9])for(let y=2;y<=4;y++){
   assert.equal(before.get(K(x,y,s.d-1))?.kind,'wall',b.id+' never had rear source wall');
   assert(!now.has(K(x,y,s.d-1)),b.id+' rear opening is nominal');
  }
  const upper=b.voxels.filter(v=>v.architecturalRole==='physically-carved-upper-opening-producer-mount-unapproved');
  assert.equal(upper.length,12,b.id+' actual mounted source upper window cell count');
  for(const v of upper){
   assert.equal(before.get(K(v.x,v.y,v.z))?.kind,'wall',b.id+' fake open window '+K(v.x,v.y,v.z));
   assert(b.openings.some(o=>o.type==='window'&&o.x===v.x&&o.y===v.y&&o.z===v.z&&o.material===v.material),
    b.id+' upper glazing without matching source opening '+K(v.x,v.y,v.z));
  }
  assert.equal(b.premiumArchitecture.eastSourceCarvedArches,3);
  assert.equal(b.premiumArchitecture.rearSourceCarvedPortals,2);
  assert.equal(b.premiumArchitecture.sourceWeatherWallCarves,15);
 }
});
test('six truly different east/rear skyline families use strictly vertical source roof support, not floating decorative cubes',()=>{
 const families=new Set();
 for(let i=0;i<6;i++){
  const s=M1_PROFILED_ARCADE_SPECS[i],b=M1_PROFILED_ARCADE_SHOPS[i],now=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  assert.equal(b.premiumArchitecture.skyline.length,2);
  assert.notEqual(s.eastRoofStyle,s.rearRoofStyle);
  for(const part of b.premiumArchitecture.skyline){
   families.add(part.style);
   assert(part.rootedOriginalWeatherPlateColumns>=55,b.id+' profile not rooted in source weather plate');
   assert(part.authoredNewSourceCells>=75,b.id+' profile is only a label');
   assert.equal(part.mountedPackGeometryCertified,false);
   assert.equal(part.accessibleRoofUpperRooms,false);
  }
  const authored=b.voxels.filter(v=>v.architecturalRole?.startsWith('original-eastern-skyline-')||
    v.architecturalRole?.startsWith('original-rear-skyline-'));
  assert.equal(authored.length,b.premiumArchitecture.totalNewRoofSourceCells);
  assert(authored.length>=150,b.id+' no visible substantial silhouette');
  for(const v of authored){
   assert.equal(now.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' floating new roof '+K(v.x,v.y,v.z));
   assert.equal(now.get(K(v.x,s.h+1,v.z))?.kind,'roof',b.id+' missing original roof support '+K(v.x,v.y,v.z));
  }
  const piers=b.voxels.filter(v=>v.architecturalRole==='east-pier-full-height-on-original-floor');
  assert.equal(piers.length,2*(s.h-1),b.id+' missing two connected floor-founded piers');
  for(const p of piers){
   assert.equal(now.get(K(p.x,1,p.z))?.kind,'floor',b.id+' unsupported façade pier');
   if(p.y>2)assert.equal(now.get(K(p.x,p.y-1,p.z))?.kind,'wall',b.id+' disconnected rooted pilaster');
  }
 }
 assert.equal(families.size,12,'architectural rooflines repeat rather than being independently specified');
});
test('all previous source cells remain exact except 15 disclosed wall carvings and 12 legitimate windows; new walls/roofs never overwrite',()=>{
 for(let i=0;i<6;i++){
  const s=M1_PROFILED_ARCADE_SPECS[i],b=M1_PROFILED_ARCADE_SHOPS[i],original=author2ALandmark(s),
   old=new Map(original.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   now=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  let carveCount=0,windowCount=0;
  for(const [p,v] of old){
   const a=now.get(p);
   if(!a){
    assert(v.kind==='wall',b.id+' deleted non-wall source '+p);
    const allowed=(v.x===s.w-1&&[29,30,31].includes(v.z)&&v.y>=2&&v.y<=4)||
      (v.z===s.d-1&&[s.entry+8,s.entry+9].includes(v.x)&&v.y>=2&&v.y<=4);
    assert(allowed,b.id+' removed original cell outside explicit façade arcade '+p);carveCount++;
   }else if(v.kind==='wall'&&a.kind==='window'&&a.architecturalRole==='physically-carved-upper-opening-producer-mount-unapproved'){
    windowCount++;
   }else assert.deepEqual(a,v,b.id+' modified earlier local source cell at '+p);
  }
  assert.equal(carveCount,15);
  assert.equal(windowCount,12);
 }
});
test('all 24 ground-floor rooms remain physically accessible after real producer-backed Pack5 AABB occupied offsets',()=>{
 let rooms=0;
 for(const b of M1_PROFILED_ARCADE_SHOPS){
  const cell=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>F(v.x,v.z))),occupied=new Set();
  for(const f of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const p=resolveManualFivePackAsset(f.material,{orientation:f.intendedFacing??'north',variant:f.physicalVariant});
   assert(p.occupiedOffsets.length>0,b.id+' physical family has no occupied shape');
   for(const [dx,dy,dz] of p.occupiedOffsets){
    const x=f.x+dx,y=f.y+dy,z=f.z+dz,k=K(x,y,z),old=cell.get(k);
    assert(!old||k===K(f.x,f.y,f.z)||old.kind==='floor',b.id+' real producer overlaps source at '+k);
    assert.equal(cell.get(K(x,1,z))?.kind,'floor',b.id+' ungrounded producer shape at '+k);
    assert(!occupied.has(k),b.id+' two physical fixtures occupy '+k);
    occupied.add(k);blocked.add(F(x,z));
   }
  }
  const first=b.openings.find(o=>o.type==='entrance'),q=[[first.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],k=F(x,z);
   if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(k)||blocked.has(k)||
      cell.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>cell.has(K(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){assert(seen.has(room.access.join(',')),b.id+' unreachable '+room.name);rooms++;}
  if(b.category==='bank'){
   const o=b.openings.find(o=>o.role==='vault-threshold');assert(o,b.id+' missing 2-leaf bank gate');
   const descriptor=resolveManualFivePackAsset(o.doorSymbol,{variant:o.physicalVariant,orientation:o.intendedFacing});
   assert.equal(descriptor.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of descriptor.occupiedOffsets)for(let h=0;h<3;h++)
    assert(!cell.has(K(o.x+dx,o.y+dy+h,o.z+dz)),b.id+' bank vault must be three-high two-wide true air');
  }
 }assert.equal(rooms,24);
});
test('all six genuinely new floors strictly pass eight-way D4 floor IoU <0.89 versus all 128 and preserve inherited 269/30 debt exactly',()=>{
 const all=M1_D4_AUDIT_ALL.map(b=>({id:b.id,normal:norm(plan(b))}));
 for(const b of M1_PROFILED_ARCADE_SHOPS){
  let highest=0,other='';
  for(const x of all)if(x.id!==b.id){
   const max=Math.max(...d4(plan(b)).map(y=>iou(x.normal,y)));
   if(max>highest){highest=max;other=x.id;}
  }
  assert(highest<.89,b.id+' new D4 high IoU '+highest+' near '+other);
 }
 const d=inspect2AD4FloorDebt();
 assert.equal(d.sources,128);assert.equal(d.grandfatheredHighOverlapPairs,269);
 assert.equal(d.exactMatchingFloorPairs,30);assert.equal(d.newHighOverlapPairs,0);
});
test('fail closed for unsupported external arcade or missing roof-bearing region',()=>{
 const s=M1_PROFILED_ARCADE_SPECS[0];
 assert.throws(()=>author2AProfiledArcade({...s,w:s.w+2}),/authentic source wall required/);
 assert.throws(()=>author2AProfiledArcade({...s,entry:s.entry+100}),/missing real front doorway wall|outside authored floor/);
});
