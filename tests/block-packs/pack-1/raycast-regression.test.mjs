// Milestone 6: deterministic analytic ray/occupancy regression against
// original Pack 1 candidate fixtures. Pack-owned, opt-in; no engine imports.
// This is a real Node test module when run with node --test, not a CI hook.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MASONRY_IDS} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {createMasonryFixture} from '../../../src/block-packs/pack-1/fixture.mjs';
import {STONE_SHAPE_IDS,stoneShapeDescriptor} from '../../../src/block-packs/pack-1/stone-shapes.mjs';
import {createStoneShapeFixture} from '../../../src/block-packs/pack-1/stone-shape-fixture.mjs';
import {GARDEN_IDS,gardenDescriptor} from '../../../src/block-packs/pack-1/garden-components.mjs';
import {createGardenFixture} from '../../../src/block-packs/pack-1/garden-fixture.mjs';
import {FOLIAGE_IDS,foliageDescriptor} from '../../../src/block-packs/pack-1/physical-foliage.mjs';
import {createFoliageFixture} from '../../../src/block-packs/pack-1/foliage-fixture.mjs';
import {FLORAL_IDS,floralDescriptor} from '../../../src/block-packs/pack-1/floral-forms.mjs';
import {createFloralFixture} from '../../../src/block-packs/pack-1/floral-fixture.mjs';

const groups=[
  {name:'masonry',ids:Object.values(MASONRY_IDS),
   create:createMasonryFixture,orientationCount:1,boxes:()=>[[0,0,0,1,1,1]]},
  {name:'stone',ids:Object.values(STONE_SHAPE_IDS),
   create:createStoneShapeFixture,orientationCount:4,
   boxes:(id,rotation)=>stoneShapeDescriptor(id,{rotation}).boxes},
  {name:'garden',ids:Object.values(GARDEN_IDS),
   create:createGardenFixture,orientationCount:4,
   boxes:(id,rotation)=>gardenDescriptor(id,{rotation}).boxes},
  {name:'foliage',ids:Object.values(FOLIAGE_IDS),
   create:createFoliageFixture,orientationCount:4,
   boxes:(id,rotation)=>foliageDescriptor(id,{rotation}).boxes},
  {name:'floral',ids:Object.values(FLORAL_IDS),
   create:createFloralFixture,orientationCount:4,
   boxes:(id,rotation)=>floralDescriptor(id,{rotation}).boxes}
];
// Completely independent slab-intersection logic for the expected result.
// Bounding boxes come from authored candidate data; ray math does NOT call
// fixture raycast nor reuse implementation helpers.
function referenceHit(origin,direction,boxes,cell=[0,3,0],reach=6){
  const magnitude=Math.hypot(...direction);
  if(magnitude<=0)throw new RangeError('zero direction');
  const d=direction.map(v=>v/magnitude);
  let closest=null;
  for(const box of boxes){
    let enter=-Infinity,leave=Infinity;
    for(let axis=0;axis<3;axis++){
      const lo=cell[axis]+box[axis],hi=cell[axis]+box[axis+3];
      if(Math.abs(d[axis])<1e-12){
        if(origin[axis]<lo||origin[axis]>hi){leave=-Infinity;break;}
      }else{
        const a=(lo-origin[axis])/d[axis];
        const b=(hi-origin[axis])/d[axis];
        enter=Math.max(enter,Math.min(a,b));
        leave=Math.min(leave,Math.max(a,b));
      }
    }
    if(leave<0||enter>leave)continue;
    const distance=Math.max(0,enter);
    if(distance<=reach&&(closest===null||distance<closest))closest=distance;
  }
  return closest;
}
function referenceOccupies(local,boxes){
  return boxes.some(box=>local.every((v,axis)=>v>=box[axis]&&v<box[axis+3]));
}
function options(id,rotation){
  return id===27||id===28?{rotation,wallMount:true}:{rotation};
}
function testRayFamily(group){
  let tested=0;
  for(const id of group.ids)for(let rotation=0;rotation<group.orientationCount;rotation++){
    const fixture=group.create(179);
    assert.equal(fixture.place(0,3,0,id,options(id,rotation)).ok,true);
    const boxes=group.boxes(id,rotation);
    for(let axis=0;axis<3;axis++)for(const side of [-1,1])
    for(let i=0;i<7;i++)for(let j=0;j<7;j++){
      const a=(i+.45)/7,b=(j+.45)/7;
      let origin,direction=[0,0,0];
      direction[axis]=-side;
      if(axis===0)origin=[side<0?-2:3,3+a,b];
      else if(axis===1)origin=[a,side<0?1:6,b];
      else origin=[a,3+b,side<0?-2:3];
      const expected=referenceHit(origin,direction,boxes);
      const actual=fixture.raycast(origin,direction,6)?.distance??null;
      assert.equal(expected===null,actual===null,
        group.name+' ID '+id+' rotation '+rotation+' axis '+axis+' had phantom/missing hit');
      if(expected!==null)
        assert.ok(Math.abs(expected-actual)<1e-7,
          group.name+' ID '+id+' rotation '+rotation+' has incorrect hit distance');
      tested++;
    }
  }
  assert.ok(tested>0);
  return tested;
}
for(const group of groups){
  if(group.name==='stone')continue; // stone picking uses local occupancy, not fake raycasting
  test('independent slab rays match '+group.name+' fixture, every tested rotation',()=>{
    const count=testRayFamily(group);
    assert.equal(count,group.ids.length*group.orientationCount*6*7*7);
  });
}
test('stone geometry picks match independent AABB occupancy across all 4 rotations',()=>{
  let checked=0;
  const stone=groups.find(x=>x.name==='stone');
  for(const id of stone.ids)for(let rotation=0;rotation<4;rotation++){
    const fixture=createStoneShapeFixture();
    assert.equal(fixture.place(0,3,0,id,{rotation}).ok,true);
    const boxes=stone.boxes(id,rotation);
    for(let xi=0;xi<7;xi++)for(let yi=0;yi<7;yi++)for(let zi=0;zi<7;zi++){
      const p=[(xi+.45)/7,(yi+.45)/7,(zi+.45)/7];
      const expected=referenceOccupies(p,boxes);
      assert.equal(Boolean(fixture.pick(0,3,0,p)),expected,
        'stone shape ID '+id+' rotation '+rotation+' local '+p.join(','));
      checked++;
    }
  }
  assert.equal(checked,6*4*7*7*7);
});
test('isolated empty fixtures cannot return phantom rays or occupied stone',()=>{
  assert.equal(createMasonryFixture().raycast([.5,3.5,-2],[0,0,1]),null);
  assert.equal(createGardenFixture().raycast([.5,3.5,-2],[0,0,1]),null);
  assert.equal(createFoliageFixture().raycast([.5,3.5,-2],[0,0,1]),null);
  assert.equal(createFloralFixture().raycast([.5,3.5,-2],[0,0,1]),null);
  assert.equal(createStoneShapeFixture().pick(0,3,0,[.5,.5,.5]),null);
});
