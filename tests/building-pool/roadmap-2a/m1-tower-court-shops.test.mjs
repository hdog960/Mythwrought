import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_TOWER_COURT_SHOPS,M1_TOWER_COURT_SPECS,author2ATowerCourt} from '../../../src/building-pool/roadmap-2a/m1-tower-court-shops.mjs';
import {author2ALandmark} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>[x,y,z].join(','),K2=(x,z)=>x+','+z;
function sourceFootprint(s){
 const pts=new Set();
 for(const [x0,x1,z0,z1] of s.rects)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pts.add(K2(x,z));
 for(const [x0,x1,z0,z1] of s.cuts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pts.delete(K2(x,z));
 return pts;
}
function norm(points){
 const x0=Math.min(...points.map(v=>v[0])),z0=Math.min(...points.map(v=>v[1]));
 return new Set(points.map(([x,z])=>K2(x-x0,z-z0)));
}
function d4(points){
 const out=[];
 for(let mirror=0;mirror<2;mirror++)for(let r=0;r<4;r++){
  const transformed=points.map(([x0,z0])=>{let x=mirror?-x0:x0,z=z0;for(let k=0;k<r;k++){const a=x;x=-z;z=a;}return[x,z]});
  out.push(norm(transformed));
 }return out;
}
const iou=(a,b)=>{let shared=0;for(const x of a)if(b.has(x))shared++;return shared/(a.size+b.size-shared)};
const floor=b=>b.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>[v.x,v.z]);
test('preserve source-exact 110 existing designs and add six separate tower-court shops without accepting them into production',()=>{
 assert.equal(M1_TOWER_COURT_SHOPS.length,6);assert.equal(M1_TOWER_COURT_SPECS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,116);
 assert.equal(inventory().authoredCandidateTotal,116);
 assert.equal(inventory().newlyAuthored,101);
 assert.equal(inventory().unwrittenNewCandidates,304);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,116);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,116);
 for(const b of M1_TOWER_COURT_SHOPS){
  assert(validateBlueprint(b).valid);assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.rooms.length,4);assert.equal(b.skylineMassing.length,2);
  assert(b.skylineMassing.every(m=>!m.upperFloorAccessible&&!m.finalLoadApproved));
 }
});
test('six authentic nonrectangular floorplans have identical founded floors, base roof plates and genuinely vacant sky courts',()=>{
 for(let i=0;i<6;i++){
  const b=M1_TOWER_COURT_SHOPS[i],s=M1_TOWER_COURT_SPECS[i],p=sourceFootprint(s);
  for(const [kind,y] of [['foundation',0],['floor',1],['roof',s.h+1]]){
   const observed=new Set(b.voxels.filter(v=>v.kind===kind&&v.y===y).map(v=>K2(v.x,v.z)));
   assert.deepEqual(observed,p,b.id+' source '+kind+' deviates from independently authored footprint');
  }
  for(const [x0,x1,z0,z1] of s.cuts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' fake open-air court '+K2(x,z));
  assert(p.size>1200,b.id+' missing substantial original architecture');
 }
});
test('two genuinely different tower and roof silhouettes are geometrically constructed, not cosmetic descriptors',()=>{
 const shapes=new Set();
 for(let i=0;i<6;i++){
  const s=M1_TOWER_COURT_SPECS[i],b=M1_TOWER_COURT_SHOPS[i],original=author2ALandmark(s),
   map=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const masses=s.masses;
  assert(b.extents.y>original.extents.y+9,b.id+' new tower has no discernible original height');
  // Absolutely preserve every original source cell outside the new, declared rooftop mass.
  for(const old of original.voxels){
   if(old.y>=s.h+2&&masses.some(m=>old.x>=m.rect[0]&&old.x<=m.rect[1]&&old.z>=m.rect[2]&&old.z<=m.rect[3]))continue;
   assert.deepEqual(map.get(K(old.x,old.y,old.z)),old,b.id+' modified independent source cell outside a new tower '+K(old.x,old.y,old.z));
  }
  for(const m of b.skylineMassing){
   shapes.add(m.roof);
   const [x0,x1,z0,z1]=m.rect,cap=m.cap;
   assert(m.newSupportedTowerWallCells>300,b.id+' tower only references nominal shape '+m.name);
   assert(m.sourceRoofCells>(x1-x0+1)*(z1-z0+1)+15,b.id+' roof has no genuinely raised cap geometry');
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(map.get(K(x,s.h+1,z))?.kind,'roof',b.id+' no rooted starting plate');
    assert.equal(map.get(K(x,cap,z))?.kind,'roof',b.id+' source cap cell missing');
    assert.equal(map.get(K(x,cap-1,z))?.kind,'wall',b.id+' cap not supported by solid tower column');
   }
   for(const v of b.voxels.filter(v=>v.architecturalRole?.startsWith('source-geometry-')&&v.architecturalRole.endsWith('-'+m.name))){
    assert.equal(map.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' unsupported upper pitch '+K(v.x,v.y,v.z));
   }
  }
  for(const hole of b.openAirHighVents){
   assert(!map.has(K(hole.x,hole.y,hole.z)),b.id+' false upper ventilation gap');
   assert.equal(hole.notGlazing,true,'unmounted openings are not certified glazing');
  }
 }
 assert(shapes.size>=5,'new cohort is visually repetitive in approved roof form');
});
test('24 genuine source interior room anchors reachable around real Pack5 multi-cell fixture footprints and one bank vault',()=>{
 let rooms=0;
 for(const b of M1_TOWER_COURT_SHOPS){
  const grid=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>K2(v.x,v.z))),real=new Set();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const asset=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   assert(asset.occupiedOffsets.length>0,b.id+' has no real producer shape');
   for(const [dx,dy,dz] of asset.occupiedOffsets){
    const x=v.x+dx,y=v.y+dy,z=v.z+dz,p=K(x,y,z),source=grid.get(p);
    assert(!source||p===K(v.x,v.y,v.z)||source.kind==='floor',b.id+' producer/source occupied AABB collision '+p);
    assert.equal(grid.get(K(x,1,z))?.kind,'floor',b.id+' physically unsupported furniture '+p);
    assert(!real.has(p),b.id+' two source producer fixtures share one occupied cell '+p);
    real.add(p);blocked.add(K2(x,z));
   }
  }
  const gate=b.openings.find(o=>o.type==='entrance'),q=[[gate.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],pos=K2(x,z);
   if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(pos)||blocked.has(pos)||
      grid.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>grid.has(K(x,y,z))))continue;
   seen.add(pos);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){assert(seen.has(room.access.join(',')),b.id+' inaccessible actual room '+room.name+' '+room.access);rooms++;}
  if(b.category==='bank'){
   const opening=b.openings.find(o=>o.role==='vault-threshold');assert(opening,b.id+' no actual two-cell vault opening');
   const asset=resolveManualFivePackAsset(opening.doorSymbol,{variant:opening.physicalVariant,orientation:opening.intendedFacing});
   assert.equal(asset.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of asset.occupiedOffsets)for(let level=0;level<3;level++)
    assert(!grid.has(K(opening.x+dx,opening.y+dy+level,opening.z+dz)),b.id+' closed bank vault portal');
  }
 }
 assert.equal(rooms,24);
});
test('entire 116-source cohort: zero NEW eight-way D4 overlaps at or above 0.89, preserve 269 inherited high pairs',()=>{
 const all=M1_D4_AUDIT_ALL,forms=all.map(b=>({id:b.id,p:norm(floor(b))}));
 for(const b of M1_TOWER_COURT_SHOPS){
  const transformed=d4(floor(b));let largest=0,closest='';
  for(const other of forms)if(other.id!==b.id){
   const v=Math.max(...transformed.map(f=>iou(f,other.p)));
   if(v>largest){largest=v;closest=other.id;}
  }
  assert(largest<.89,b.id+' new near-clone of '+closest+' D4 IoU '+largest);
 }
 const debt=inspect2AD4FloorDebt();
 assert.equal(debt.sources,116);
 assert.equal(debt.grandfatheredHighOverlapPairs,269);
 assert.equal(debt.exactMatchingFloorPairs,30);
 assert.equal(debt.newHighOverlapPairs,0,'existing 269-pair debt cannot increase');
});
test('reject a source-unsupported tower, duplicate cellar collision or blocked two-wide genuine entrance',()=>{
 const s=M1_TOWER_COURT_SPECS[0],bad={...s,masses:[{...s.masses[0],rect:[0,5,0,6]},s.masses[1]]};
 assert.throws(()=>author2ATowerCourt(bad),/tower has no real source roof foundation/);
 const b=M1_TOWER_COURT_SHOPS[0],entrance=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:entrance.x,y:2,z:entrance.z,kind:'wall',material:'pack1:005'}]}),/blocked entrance/);
 const first=b.voxels[0];
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{...first}]}),/overlapping voxel/);
});
