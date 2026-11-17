import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_SCULPTED_MARKET_SPECS,M1_SCULPTED_MARKETS,author2ASculptedMarket} from '../../../src/building-pool/roadmap-2a/m1-sculpted-markets.mjs';
import {author2ALandmark} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const floor=b=>b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
function normalize(pts){
 const minX=Math.min(...pts.map(a=>a[0])),minZ=Math.min(...pts.map(a=>a[1]));
 return new Set(pts.map(([x,z])=>(x-minX)+','+(z-minZ)));
}
function transform(pts){
 const out=[];for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
  const moved=pts.map(([x0,z0])=>{let x=mirror?-x0:x0,z=z0;for(let i=0;i<rot;i++){const a=x;x=-z;z=a;}return[x,z]});
  out.push(normalize(moved));
 }return out;
}
const IoU=(a,b)=>{let shared=0;for(const p of a)if(b.has(p))shared++;return shared/(a.size+b.size-shared)};
function shapeSource(s){
 const p=new Set();
 for(const [x0,x1,z0,z1] of s.rects)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)p.add(x+','+z);
 for(const [x0,x1,z0,z1] of s.cuts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)p.delete(x+','+z);
 return p;
}
test('six independently authored M1 sculpted-roof shops preserve exact 104-design candidate cohort and reach 110 of 420',()=>{
 assert.equal(M1_SCULPTED_MARKETS.length,6);
 assert.equal(M1_SCULPTED_MARKET_SPECS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,110);
 assert.equal(inventory().authoredCandidateTotal,110);
 assert.equal(inventory().newlyAuthored,95);
 assert.equal(inventory().unwrittenNewCandidates,310);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,110);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,110);
 for(const b of M1_SCULPTED_MARKETS){
  assert(validateBlueprint(b).valid);
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.rooms.length,4);assert.equal(b.roofProfiles.length,2);
 }
});
test('six original floorplans are wholly source-built foundation/floor/roof masks with two genuinely roof-empty courts',()=>{
 for(let i=0;i<6;i++){
  const s=M1_SCULPTED_MARKET_SPECS[i],b=M1_SCULPTED_MARKETS[i],target=shapeSource(s);
  for(const [kind,y] of [['foundation',0],['floor',1],['roof',s.h+1]]){
   const have=new Set(b.voxels.filter(v=>v.kind===kind&&v.y===y).map(v=>v.x+','+v.z));
   assert.deepEqual(have,target,b.id+' source '+kind+' differs from actual original plan');
  }
  for(const [x0,x1,z0,z1] of s.cuts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' fake open-air courtyard '+x+','+z);
  assert(target.size>900,b.id+' nominal or underspecified structure');
 }
});
test('per-building visible sculpted roof volumes have two different physical styles and continuous original-source vertical supports',()=>{
 const allStyles=new Set();
 for(let i=0;i<6;i++){
  const s=M1_SCULPTED_MARKET_SPECS[i],b=M1_SCULPTED_MARKETS[i],before=author2ALandmark(s),
   old=new Map(before.voxels.map(v=>[K(v.x,v.y,v.z),v])),now=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  assert(b.voxels.length>before.voxels.length+100,b.id+' visible improvement is only a nominal tag');
  for(const [pos,v] of old)assert.deepEqual(now.get(pos),v,b.id+' overwrote original source roof or usable room: '+pos);
  assert.equal(b.roofProfiles.length,2);
  assert(new Set(b.roofProfiles.map(p=>p.style)).size===2,b.id+' repeats same roof profile');
  for(const profile of b.roofProfiles){
   allStyles.add(profile.style);
   assert(profile.addedCells>=40,b.id+' missing real sculpted source cells '+profile.name);
   assert(profile.roofRootColumns>=12,b.id+' unbacked sculpted roof '+profile.name);
   assert.equal(profile.upperFloorAccessible,false,'do not falsely claim walkable upper room');
   const authored=b.voxels.filter(v=>v.architecturalRole==='independently-shaped-'+profile.name);
   assert.equal(authored.length,profile.addedCells,b.id+' untruthful added source count');
   for(const v of authored){
    assert.equal(now.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' unsupported roof voxel '+K(v.x,v.y,v.z));
    assert.equal(now.get(K(v.x,s.h+1,v.z))?.kind,'roof',b.id+' no roof-bearing root '+K(v.x,v.y,v.z));
   }
  }
 }
 assert(allStyles.size>=7,'too few visibly distinct source shapes');
});
test('all 24 source-room access points are physically reachable around true Pack5 multi-cell occupied offsets',()=>{
 let rooms=0;
 for(const b of M1_SCULPTED_MARKETS){
  const world=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z)),physicalCells=new Set();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const physical=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   assert(physical.occupiedOffsets.length>0);
   for(const [dx,dy,dz] of physical.occupiedOffsets){
    const x=v.x+dx,y=v.y+dy,z=v.z+dz,p=K(x,y,z),existing=world.get(p);
    assert(!existing||p===K(v.x,v.y,v.z)||existing.kind==='floor',b.id+' source/producer AABB collision '+p);
    assert.equal(world.get(K(x,1,z))?.kind,'floor',b.id+' real producer unsupported '+p);
    assert(!physicalCells.has(p),b.id+' duplicate occupied producer cell '+p);
    physicalCells.add(p);blocked.add(x+','+z);
   }
  }
  const entrance=b.openings.find(o=>o.type==='entrance'),queue=[[entrance.x,1]],visited=new Set();
  for(let n=0;n<queue.length;n++){
   const [x,z]=queue[n],p=x+','+z;
   if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||visited.has(p)||blocked.has(p)||
     world.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>world.has(K(x,y,z))))continue;
   visited.add(p);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){assert(visited.has(room.access.join(',')),b.id+' unreachable '+room.name+' '+room.access);rooms++;}
  if(b.category==='bank'){
   const gate=b.openings.find(o=>o.role==='vault-threshold');assert(gate,b.id+' missing vault gate');
   const shape=resolveManualFivePackAsset(gate.doorSymbol,{orientation:gate.intendedFacing,variant:gate.physicalVariant});
   assert.equal(shape.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of shape.occupiedOffsets)for(let h=0;h<3;h++)
    assert(!world.has(K(gate.x+dx,gate.y+dy+h,gate.z+dz)),b.id+' two-wide bank gate obstructed');
  }
 }assert.equal(rooms,24);
});
test('all six new occupied-floor architectures pass strict D4 IoU below 0.89 against all 110 without adding to inherited 269-pair debt',()=>{
 const compared=M1_D4_AUDIT_ALL.map(b=>({id:b.id,normal:normalize(floor(b))}));
 for(const b of M1_SCULPTED_MARKETS){
  const v=transform(floor(b));let best=0,other='';
  for(const x of compared)if(x.id!==b.id){
   const max=Math.max(...v.map(p=>IoU(p,x.normal)));if(max>best){best=max;other=x.id;}
  }
  assert(best<.89,b.id+' too similar to '+other+' D4 '+best);
 }
 const d=inspect2AD4FloorDebt();
 assert.equal(d.sources,110);
 assert.equal(d.grandfatheredHighOverlapPairs,269);
 assert.equal(d.exactMatchingFloorPairs,30);
 assert.equal(d.newHighOverlapPairs,0,'new M1 source increased historic floorplate debt');
});
test('fail closed on source unsupported roof-plate placement, under-specified roof arch, blocked real entrance',()=>{
 const s=M1_SCULPTED_MARKET_SPECS[0],bad={...s,profiles:[[...s.profiles[0].slice(0,1),[0,2,0,3],...s.profiles[0].slice(2)],s.profiles[1]]};
 assert.throws(()=>author2ASculptedMarket(bad),/roof region lacks substantial physical source geometry/);
 const b=M1_SCULPTED_MARKETS[0],entrance=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:entrance.x,y:2,z:entrance.z,kind:'wall',material:'pack1:005'}]}),/blocked entrance/);
});
