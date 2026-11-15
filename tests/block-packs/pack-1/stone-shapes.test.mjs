import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STONE_SHAPE_IDS, STONE_SHAPES,stoneShapeDefinition,
  stoneShapeDescriptor,stoneShapeOccupies,stoneShapeTexture
} from '../../../src/block-packs/pack-1/stone-shapes.mjs';
import {
  createStoneShapeFixture,restoreStoneShapeFixture
} from '../../../src/block-packs/pack-1/stone-shape-fixture.mjs';
import {MASONRY_IDS} from '../../../src/block-packs/pack-1/core-masonry.mjs';

const ids=Object.values(STONE_SHAPE_IDS);
const inShape=(id,x,y,z,options)=>stoneShapeOccupies(id,[x,y,z],options);
const signature=t=>Buffer.from(t.pixels).toString('hex');
test('six distinct independent shaped IDs follow core masonry inside Pack 1 allocation',()=>{
  assert.deepEqual(ids,[15,16,17,18,19,20]);
  assert.equal(new Set([...ids,...Object.values(MASONRY_IDS)]).size,12);
  assert.equal(STONE_SHAPES.length,6);
  for(const asset of STONE_SHAPES){
    assert.ok(asset.id>=9&&asset.id<=58&&asset.id!==255);
    assert.equal(asset.independentCell,true);
    assert.equal(asset.selectable,true);
    assert.equal(asset.removable,true);
    assert.equal(asset.placeable,true);
    assert.equal(asset.integration,'candidate-only');
    assert.equal(asset.save.schema,1);
    assert.equal(asset.save.canonicalOnly,true);
  }
  assert.equal(stoneShapeDefinition(3),null);
});
test('all box unions use immutable positive partial cell volumes and :00/:12 descriptor interface',()=>{
  for(const asset of STONE_SHAPES){
    const desc=stoneShapeDescriptor(asset.id);
    assert.ok(desc.prototypeOnly);
    assert.equal(desc.placeable,false,'not registered in game');
    assert.ok(Array.isArray(desc.boxes));
    assert.ok(desc.boxes.length>=1&&desc.boxes.length<=32);
    assert.ok(Object.isFrozen(desc.boxes));
    assert.ok(desc.boxes.some(b=>JSON.stringify(b)!=='[0,0,0,1,1,1]'));
    for(const b of desc.boxes){
      assert.equal(b.length,6);
      assert.ok(Object.isFrozen(b));
      for(let i=0;i<3;i++)assert.ok(b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1,asset.name+' '+b);
    }
  }
});
test('slab upper/lower half cells have actual empty and solid space',()=>{
  assert.equal(inShape(15,.5,.25,.5),true);
  assert.equal(inShape(15,.5,.75,.5),false);
  assert.equal(inShape(15,.5,.25,.5,{variant:'upper'}),false);
  assert.equal(inShape(15,.5,.75,.5,{variant:'upper'}),true);
});
test('stairs rise across a physical half-voxel step and rotate through four quarters',()=>{
  assert.equal(inShape(16,.5,.25,.25),true);
  assert.equal(inShape(16,.5,.75,.25),false);
  assert.equal(inShape(16,.5,.75,.75),true);
  for(const rotation of [0,1,2,3]){
    const d=stoneShapeDescriptor(16,{rotation});
    assert.equal(d.rotation,rotation);
    assert.equal(d.boxes.length,2);
  }
  assert.equal(inShape(16,.25,.75,.5,{rotation:1}),true);
  assert.equal(inShape(16,.75,.75,.5,{rotation:1}),false);
  assert.equal(inShape(16,.5,.75,.25,{rotation:2}),true);
  assert.equal(inShape(16,.5,.75,.75,{rotation:2}),false);
  assert.equal(inShape(16,.75,.75,.5,{rotation:3}),true);
});
test('walls, pillars, decorative arch and railings are distinct open/supported volumes',()=>{
  assert.equal(inShape(17,.5,.5,.5),true);
  assert.equal(inShape(17,.5,.5,.15),false);
  assert.equal(inShape(18,.5,.4,.5),true);
  assert.equal(inShape(18,.1,.4,.1),false);
  assert.equal(inShape(19,.5,.3,.5),false,'arch has genuine opening');
  assert.equal(inShape(19,.1,.3,.5),true,'left physical pier');
  assert.equal(inShape(19,.9,.3,.5),true,'right physical pier');
  assert.equal(inShape(19,.5,.94,.5),true,'arch has genuine stone crown');
  assert.equal(inShape(19,.5,.94,.1),false,'arch thin along depth axis');
  assert.equal(inShape(20,.3,.4,.5),false,'railing gap between balusters');
  assert.equal(inShape(20,.5,.4,.5),true,'middle baluster');
  assert.equal(inShape(20,.3,.85,.5),true,'top handrail');
  assert.equal(inShape(20,.3,.4,.2),false,'open space in front of railing');
});
test('all rotated shapes stay within a unit cell without losing exact occupancy volume',()=>{
  const sampleVolume=(id,rotation)=>{
    const N=20;let filled=0;
    for(let x=0;x<N;x++)for(let y=0;y<N;y++)for(let z=0;z<N;z++)
      if(inShape(id,(x+.5)/N,(y+.5)/N,(z+.5)/N,{rotation}))filled++;
    return filled;
  };
  for(const id of ids){
    const v0=sampleVolume(id,0);
    assert.ok(v0>0&&v0<8000,id+' not truly partial');
    for(const rotation of [1,2,3])
      assert.equal(sampleVolume(id,rotation),v0,'rotation must not change volume');
  }
});
test('independent pixel artwork maintains correct RGBA and varies by shape',()=>{
  const faces=['north','south','east','west','top','bottom'];
  const swatches=[];
  for(const id of ids){
    for(const face of faces){
      const a=stoneShapeTexture(id,face,24);
      const b=stoneShapeTexture(id,face,24);
      assert.equal(a.pixels.length,24*24*4);
      assert.equal(signature(a),signature(b));
      for(let k=3;k<a.pixels.length;k+=4)assert.equal(a.pixels[k],255);
    }
    swatches.push(signature(stoneShapeTexture(id)));
  }
  assert.equal(new Set(swatches).size,6);
});
test('fixture place / individual cell selection / removal respects partial voids',()=>{
  const w=createStoneShapeFixture(179);
  for(let i=0;i<ids.length;i++){
    assert.equal(w.place(i*2,3,0,ids[i]).ok,true);
    assert.equal(w.get(i*2,3,0),ids[i]);
    assert.equal(w.shapeAt(i*2,3,0).id,ids[i]);
    assert.equal(w.place(i*2,3,0,ids[i]).reason,'occupied-cell');
  }
  assert.equal(w.size,6);
  assert.equal(w.pick(8,3,0,[.5,.3,.5]),null,'arch void should not be targetable');
  assert.equal(w.pick(8,3,0,[.1,.3,.5]).id,19);
  assert.equal(w.pick(10,3,0,[.3,.4,.5]),null,'railing gap empty');
  assert.equal(w.pick(10,3,0,[.5,.4,.5]).id,20);
  assert.equal(w.getShape(0,3,0).boxes.length,1);
  for(let i=0;i<ids.length;i++)assert.equal(w.remove(i*2,3,0).id,ids[i]);
  assert.equal(w.size,0);
});
test('fixture preserves canonical schema-1 edits without inventing orientation persistence',()=>{
  const w=createStoneShapeFixture(-77);
  ids.forEach((id,i)=>assert.equal(w.place(i,3,0,id).ok,true));
  const payload=w.save();
  assert.equal(payload.schema,1);
  assert.deepEqual(Object.keys(payload),['schema','seed','edits']);
  assert.ok(payload.edits.every(row=>row.length===4));
  const again=restoreStoneShapeFixture(JSON.parse(JSON.stringify(payload)));
  assert.deepEqual(again.save(),payload);
  assert.equal(again.size,6);
  assert.equal(again.remove(2,3,0).id,17);
  assert.equal(w.get(2,3,0),17);
});
test('noncanonical rotation and upper variants explicitly reject unsafe save',()=>{
  const rotated=createStoneShapeFixture();
  assert.equal(rotated.place(0,2,0,16,{rotation:1}).ok,true);
  assert.equal(rotated.getShape(0,2,0).rotation,1);
  assert.throws(()=>rotated.save(),/Cannot serialize oriented/);
  const upper=createStoneShapeFixture();
  assert.equal(upper.place(0,2,0,15,{variant:'upper'}).ok,true);
  assert.throws(()=>upper.save(),/Cannot serialize oriented/);
  assert.throws(()=>stoneShapeDescriptor(16,{rotation:4}),RangeError);
  assert.throws(()=>stoneShapeDescriptor(17,{variant:'upper'}),RangeError);
  assert.throws(()=>stoneShapeDescriptor(16,{variant:'invalid'}),RangeError);
});
test('invalid IDs, shape inputs, duplicate edits and unsafe positions rejected',()=>{
  const w=createStoneShapeFixture();
  assert.equal(w.place(0,2,0,255).ok,false);
  assert.equal(w.place(0,2,0,3).ok,false);
  assert.equal(w.place(0,20,0,16).ok,false);
  assert.equal(w.place(0,2.4,0,16).ok,false);
  assert.throws(()=>stoneShapeOccupies(16,[.5,NaN,.5]),TypeError);
  assert.throws(()=>stoneShapeTexture(100),RangeError);
  assert.throws(()=>restoreStoneShapeFixture({schema:1,seed:179,edits:[[0,2,0,16],[0,2,0,17]]}));
  assert.throws(()=>restoreStoneShapeFixture({schema:1,seed:179,edits:[[0,2,0,255]]}));
  assert.throws(()=>restoreStoneShapeFixture({schema:2,seed:179,edits:[]}));
});
