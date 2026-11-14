import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES,M1_FIXTURE_ROSTER} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-2/schema.mjs';

// Cross-checked manually against exact unmerged source rosters: Pack 5 manifest
// rosters 86 Shop Counters, 87 Display Shelves, 93 Altars & Pedestals;
// Pack 4 manifest rosters 30 Clear Glass, 32 Frames, 37 Crystal Lanterns,
// 57 Wooden Crates, 58 Wooden Benches, 61 Hanging Banners;
// Pack 3 roster 72 Ornamental Columns; Pack 1 roster 47 Farmland Soil.
// Candidate symbolism is NOT an approval of geometry, performance, save ABI.
const ROSTER={
 store:'pack5:087', counter:'pack5:086', altar:'pack5:093',
 seat:'pack4:058',light:'pack4:037',glass:'pack4:030',frame:'pack4:032',
 crate:'pack4:057',banner:'pack4:061',column:'pack3:072',garden:'pack1:047'
};
function at(bp,x,y,z){return bp.voxels.find(v=>v.x===x&&v.y===y&&v.z===z);}

test('all M1 named fixtures map to the actual authoritative roster families',()=>{
 assert.deepEqual(M1_FIXTURE_ROSTER,ROSTER);
 assert.notEqual(M1_FIXTURE_ROSTER.altar,'pack3:075',
   'Pack 3 roster 075 is a decorative relief, NOT an altar');
});
test('15 temples use Pack 5 altar family on raised central sanctuary dais',()=>{
 const temples=M1_REPRESENTATIVES.filter(b=>b.category==='temple');
 assert.equal(temples.length,15);
 for(const bp of temples){
  const cx=Math.floor(bp.extents.x/2),z=bp.extents.z-3;
  assert.equal(at(bp,cx,3,z)?.material,'pack5:093',bp.id);
  assert.equal(at(bp,cx,3,z)?.kind,'fixture',bp.id);
  assert(bp.unresolvedDependencies.some(d=>d.ref==='pack5:093'&&d.issue),bp.id);
  assert(!bp.unresolvedDependencies.some(d=>d.ref==='pack3:075'),
    'obsolete wrong decorative-relief altar ref: '+bp.id);
  assert.equal(validateBlueprint(bp).valid,true);
 }
});
test('all dedicated medium and large temple side altars use correct symbolic Pack 5 family',()=>{
 let n=0;
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.category==='temple')){
  if(bp.size==='medium'){
    assert.equal(at(bp,bp.extents.x-3,2,7)?.material,'pack5:093',bp.id);n++;
  }else if(bp.size==='large'){
    for(const x of [2,bp.extents.x-3]){
      assert.equal(at(bp,x,2,8)?.material,'pack5:093',bp.id);n++;
    }
  }
 }
 assert.equal(n,15,'five medium and ten large chapel altar placements');
});
test('all generated candidate material dependencies correspond exactly to placed voxels plus symbolic entry door',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const used=new Set(bp.voxels.map(v=>v.material));
  for(const o of bp.openings)if(o.doorSymbol)used.add(o.doorSymbol);
  const declared=new Set(bp.unresolvedDependencies.map(d=>d.ref));
  assert.deepEqual([...declared].sort(),[...used].sort(),bp.id);
  assert(!bp.numericIdsAssigned&&!bp.worldPlaced,bp.id);
 }
});
