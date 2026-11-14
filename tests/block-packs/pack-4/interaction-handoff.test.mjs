import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK4_SHARED_AABB_LIMIT,pack4ShapeHandoff,
 pack4SidecarHandoff,pack4ReviewSidecar
} from '../../../src/block-packs/pack-4/interaction-handoff.mjs';
import {pack4Shape} from '../../../src/block-packs/pack-4/fixture.mjs';

const ids=Array.from({length:23},(_,i)=>159+i);
function sharedValidateShape(shape){
 // Exact 32-AABB cap, coordinate contract and shape reader semantics
 // reviewed in :00 PR #106, commit 2054e00ead30736726d53d5aed8a1f9dc4e080a0.
 return Boolean(shape&&Array.isArray(shape.boxes)&&shape.boxes.length>=1&&
  shape.boxes.length<=32&&shape.boxes.every(b=>Array.isArray(b)&&
  b.length===6&&b.every(Number.isFinite)&&b.slice(0,3).every((v,i)=>
  v>=0&&v<b[i+3])&&b.slice(3).every(v=>v<=1)));
}
test('all 23 assets × four orientations satisfy the shared 32-box collision and selection budget',()=>{
 assert.equal(PACK4_SHARED_AABB_LIMIT,32);
 for(const id of ids)for(let rotation=0;rotation<4;rotation++){
  for(const purpose of ['collision','selection']){
   const shape=pack4ShapeHandoff(id,rotation,purpose);
   assert.ok(sharedValidateShape(shape),
    'shared :00 descriptor rejected '+id+' '+purpose+' r='+rotation);
   assert.equal(shape.id,id);
   assert.equal(shape.rotation,rotation);
   assert.equal(shape.purpose,purpose);
   assert.equal(shape.candidateOnly,true);
   assert.equal(shape.placeable,false);
   assert.ok(Object.isFrozen(shape.boxes));
   assert.deepEqual(shape.boxes,pack4Shape(id,rotation)[purpose]);
  }
 }
});
test('ironbound crate preserves 34 visible parts while selection fits shared cap',()=>{
 const crate=pack4Shape(170);
 assert.equal(crate.visible.length,34);
 assert.equal(crate.collision.length,26);
 assert.equal(crate.selection.length,26);
 assert.ok(crate.visible.filter(part=>part.selection===false).length>=8);
 assert.equal(pack4ShapeHandoff(170,0,'selection').boxes.length,26);
});
test('hollow chimney, open fireplace and well rim keep empty space in the shared contract',()=>{
 const hollow=pack4ShapeHandoff(176,0,'collision').boxes;
 const hearth=pack4ShapeHandoff(177,0,'collision').boxes;
 const rim=pack4ShapeHandoff(178,0,'collision').boxes;
 const occupied=(boxes,x,y,z)=>boxes.some(b=>x>=b[0]&&x<b[3]&&
  y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
 assert.equal(occupied(hollow,.5,.5,.5),false);
 assert.equal(occupied(hearth,.5,.52,.26),false);
 assert.equal(occupied(rim,.63,.32,.63),false);
 assert.equal(occupied(hollow,.2,.45,.5),true);
});
test('sidecar handoff matches shared staged {cell,blockId,turns} without modifying legacy saves',()=>{
 const entry=pack4SidecarHandoff([12,-2,90],180,3);
 assert.deepEqual(entry,{cell:[12,-2,90],blockId:180,turns:3});
 assert.ok(Object.isFrozen(entry)&&Object.isFrozen(entry.cell));
 const a=pack4ReviewSidecar([{cell:[9,2,0],id:169,rotation:2},
  {cell:[1,3,0],id:163,rotation:1}]);
 assert.deepEqual(a,[{cell:[1,3,0],blockId:163,turns:1},
  {cell:[9,2,0],blockId:169,turns:2}]);
 assert.ok(Object.isFrozen(a));
});
test('distant safe-integer world cells survive Pack 4 orientation sidecar handoff',()=>{
  const far=pack4SidecarHandoff([1000000,-1000000,65537],176,3);
  assert.deepEqual(far,{cell:[1000000,-1000000,65537],blockId:176,turns:3});
  const max=pack4SidecarHandoff([Number.MAX_SAFE_INTEGER,0,0],181,1);
  assert.deepEqual(max.cell,[Number.MAX_SAFE_INTEGER,0,0]);
  const replay=pack4ReviewSidecar([
    {cell:[65537,0,0],id:169,rotation:2},
    {cell:[-65538,1,0],id:170,rotation:1}
  ]);
  assert.deepEqual(replay.map(x=>x.cell),[[-65538,1,0],[65537,0,0]]);
});
test('invalid rotations, unassigned IDs, collision aliases and duplicate sidecars are rejected',()=>{
 for(const id of [0,5,158,182,208,255,-1])
  assert.throws(()=>pack4ShapeHandoff(id));
 for(const r of [-1,4,NaN,1.5,'0',null])
  assert.throws(()=>pack4ShapeHandoff(170,r));
 for(const purpose of ['visual','',null])
  assert.throws(()=>pack4ShapeHandoff(170,0,purpose));
 for(const cell of [[],[1,2],[1,2,3.2],[Infinity,0,0],[Number.MAX_SAFE_INTEGER+1,0,0]])
  assert.throws(()=>pack4SidecarHandoff(cell,169,1));
 assert.throws(()=>pack4ReviewSidecar([
  {cell:[0,0,0],id:169,rotation:0},
  {cell:[0,0,0],id:170,rotation:2}
 ]));
 assert.throws(()=>pack4ReviewSidecar([null]));
});
