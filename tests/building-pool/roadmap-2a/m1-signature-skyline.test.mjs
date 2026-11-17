import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_SIGNATURE_SKYLINE_SPECS,M1_SIGNATURE_SKYLINE_SHOPS,author2ASignatureSkyline} from '../../../src/building-pool/roadmap-2a/m1-signature-skyline.mjs';
import {author2ALandmark} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>x+','+y+','+z;
const key2=(x,z)=>x+','+z;
const floor=b=>b.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>[v.x,v.z]);
function symmetries(p){
 const out=[];
 for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
  const points=p.map(([a,b])=>{let x=mirror?-a:a,z=b;for(let i=0;i<rot;i++){const t=x;x=-z;z=t;}return[x,z]});
  const x0=Math.min(...points.map(a=>a[0])),z0=Math.min(...points.map(a=>a[1]));
  out.push(new Set(points.map(([x,z])=>key2(x-x0,z-z0))));
 }return out;
}
const IoU=(a,b)=>{let count=0;for(const p of a)if(b.has(p))count++;return count/(a.size+b.size-count);};
function sourceMask(s){
 const out=new Set();
 for(const [a,b,c,d] of s.rects)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)out.add(key2(x,z));
 for(const [a,b,c,d] of s.cuts)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)out.delete(key2(x,z));
 return out;
}
test('preserve the full 98-design green source cohort; add six original individually silhouetted skylines, 104/420',()=>{
 assert.equal(M1_SIGNATURE_SKYLINE_SPECS.length,6);
 assert.equal(M1_SIGNATURE_SKYLINE_SHOPS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,110);
 assert.equal(inventory().authoredCandidateTotal,110);
 assert.equal(inventory().newlyAuthored,95);
 assert.equal(inventory().unwrittenNewCandidates,310);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,110);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,110);
 for(const b of M1_SIGNATURE_SKYLINE_SHOPS){
  assert(validateBlueprint(b).valid);
  assert.equal(b.status,'authored-candidate');
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.rooms.length,4);
  assert(b.skylineStructures.length>=1,'missing real silhouette engineering');
 }
});
test('source footprints are real irregular connected ground and base roof plates, all courtyards actually empty',()=>{
 for(let i=0;i<6;i++){
  const b=M1_SIGNATURE_SKYLINE_SHOPS[i],s=M1_SIGNATURE_SKYLINE_SPECS[i],mask=sourceMask(s);
  for(const [label,kind,y] of [['foundation','foundation',0],['floor','floor',1],['base roof','roof',s.h+1]]){
   const points=new Set(b.voxels.filter(v=>v.y===y&&v.kind===kind).map(v=>key2(v.x,v.z)));
   assert.deepEqual(points,mask,b.id+' '+label+' is not the original complete source footprint');
  }
  for(const r of s.cuts)for(let x=r[0];x<=r[1];x++)for(let z=r[2];z<=r[3];z++){
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),'courtyard not open to sky '+b.id+' '+key2(x,z));
  }
  assert(b.voxels.length>2500,b.id+' incomplete candidate model');
 }
});
test('six new visible skyline towers, roof vents and chimneys occupy original supported source-cell columns, not metadata',()=>{
 for(let i=0;i<6;i++){
  const b=M1_SIGNATURE_SKYLINE_SHOPS[i],s=M1_SIGNATURE_SKYLINE_SPECS[i],
   before=author2ALandmark(s),base=new Map(before.voxels.map(v=>[K(v.x,v.y,v.z),v])),
   actual=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  assert.equal(b.voxels.length>before.voxels.length,true);
  for(const [at,v] of base){
   assert.deepEqual(actual.get(at),v,b.id+' old source cell was modified '+at);
  }
  assert.equal(b.skylineStructures.length,s.finials.length);
  for(const sk of b.skylineStructures){
   assert(sk.addedCells>=6,b.id+' source-less decorative spire '+sk.name);
   assert.equal(sk.realWalkableUpperFloor,false);
   const raised=b.voxels.filter(v=>v.architecturalRole==='source-bearing-'+sk.name);
   assert.equal(raised.length,sk.addedCells,b.id+' dishonest source skyline count');
   for(const v of raised){
    assert.equal(actual.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' unsupported rooftop column '+K(v.x,v.y,v.z));
    assert.equal(actual.get(K(v.x,s.h+1,v.z))?.kind,'roof',b.id+' source roof missing below '+K(v.x,v.y,v.z));
   }
  }
  assert(b.extents.y>before.extents.y,b.id+' not taller in actual voxel coordinates');
 }
});
test('every one of 24 original source room anchors has physically clear three-high interior circulation and Pack5 multi-cell fixture support',()=>{
 let tested=0;
 for(const b of M1_SIGNATURE_SKYLINE_SHOPS){
  const world=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>key2(v.x,v.z))),packCells=new Map();
  const fixtures=b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'));
  assert(fixtures.length>=3);
  for(const v of fixtures){
   const physical=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   for(const [dx,dy,dz] of physical.occupiedOffsets){
    const x=v.x+dx,y=v.y+dy,z=v.z+dz,at=K(x,y,z),existing=world.get(at);
    assert(!existing||at===K(v.x,v.y,v.z)||existing.kind==='floor',b.id+' Pack fixture source collision '+at);
    assert.equal(world.get(K(x,1,z))?.kind,'floor',b.id+' missing producer footprint support '+at);
    assert(!packCells.has(at),b.id+' two Pack fixtures share '+at);
    packCells.set(at,v.material);blocked.add(key2(x,z));
   }
  }
  const entry=b.openings.find(o=>o.type==='entrance'),q=[[entry.x,1]],seen=new Set();
  for(let n=0;n<q.length;n++){
   const [x,z]=q[n],p=key2(x,z);
   if(seen.has(p)||blocked.has(p)||x<0||z<0||x>=b.extents.x||z>=b.extents.z||
    world.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>world.has(K(x,y,z))))continue;
   seen.add(p);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
  }
  for(const room of b.rooms){
   assert(seen.has(room.access.join(',')),b.id+' unavailable '+room.name+' '+room.access);
   tested++;
  }
  if(b.category==='bank'){
   const gate=b.openings.find(o=>o.role==='vault-threshold');
   assert(gate,'bank must have a two-leaf source-authored vault');
   const physical=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(physical.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of physical.occupiedOffsets)for(let h=0;h<3;h++)
    assert(!world.has(K(gate.x+dx,gate.y+dy+h,gate.z+dz)),b.id+' bank threshold blocked by a physical cell');
  }
 }
 assert.equal(tested,24);
});
test('every new landmark strictly below 0.89 eight-way D4 floor IoU, zero new debt among 104',()=>{
 const forms=M1_D4_AUDIT_ALL.map(b=>({id:b.id,set:symmetries(floor(b))[0]}));
 for(const b of M1_SIGNATURE_SKYLINE_SHOPS){
  const moves=symmetries(floor(b));let max=0,other='';
  for(const p of forms)if(p.id!==b.id){const i=Math.max(...moves.map(x=>IoU(x,p.set)));if(i>max){max=i;other=p.id;}}
  assert(max<.89,b.id+' floor resembles '+other+' D4 IoU '+max);
 }
 const debt=inspect2AD4FloorDebt();
 assert.equal(debt.sources,110);
 assert.equal(debt.grandfatheredHighOverlapPairs,269);
 assert.equal(debt.exactMatchingFloorPairs,30);
 assert.equal(debt.newHighOverlapPairs,0,'historic 269-pair debt must not be increased');
});
test('fail closed when roof finial footprint has no actual roof plate, no rendered sky detail or corrupt support',()=>{
 const s=M1_SIGNATURE_SKYLINE_SPECS[0],invalid={...s,finials:[{...s.finials[0],center:[s.w-2,s.d-2]}]};
 assert.throws(()=>author2ASignatureSkyline(invalid),/roofline finial has no actual source-roof support plate/);
 const b=M1_SIGNATURE_SKYLINE_SHOPS[0],door=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:door.x,y:2,z:door.z,kind:'wall',material:'pack1:004'}]}),/blocked entrance/);
});
