import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GARDEN_IDS,GARDEN_COMPONENTS,gardenDefinition,gardenDescriptor,
  gardenOccupies,gardenTexture
} from '../../../src/block-packs/pack-1/garden-components.mjs';
import {createGardenFixture,restoreGardenFixture} from '../../../src/block-packs/pack-1/garden-fixture.mjs';
import {STONE_SHAPE_IDS} from '../../../src/block-packs/pack-1/stone-shapes.mjs';
import {MASONRY_IDS} from '../../../src/block-packs/pack-1/core-masonry.mjs';

const ids=Object.values(GARDEN_IDS);
const occupied=(id,x,y,z,rotation=0)=>gardenOccupies(id,[x,y,z],{rotation});
const hex=tex=>Buffer.from(tex.pixels).toString('hex');
function occupancyVolume(boxes){
  const axes=[0,1,2].map(i=>[...new Set(boxes.flatMap(b=>[b[i],b[i+3]]))].sort((a,b)=>a-b));
  let volume=0;
  for(let i=0;i<axes[0].length-1;i++)for(let j=0;j<axes[1].length-1;j++)
    for(let k=0;k<axes[2].length-1;k++){
      const [x,X]=[axes[0][i],axes[0][i+1]];
      const [y,Y]=[axes[1][j],axes[1][j+1]];
      const [z,Z]=[axes[2][k],axes[2][k+1]];
      const mid=[(x+X)/2,(y+Y)/2,(z+Z)/2];
      if(boxes.some(b=>mid.every((v,n)=>v>=b[n]&&v<b[n+3])))volume+=(X-x)*(Y-y)*(Z-z);
    }
  return volume;
}
test('IDs 21–23 remain exclusive, contiguous, and never reuse existing persistent blocks',()=>{
  assert.deepEqual(ids,[21,22,23]);
  assert.equal(GARDEN_COMPONENTS.length,3);
  const all=[...ids,...Object.values(STONE_SHAPE_IDS),...Object.values(MASONRY_IDS)];
  assert.equal(new Set(all).size,15);
  for(const a of GARDEN_COMPONENTS){
    assert.equal(a.roster,a.id+26);
    assert.ok(a.id>=9&&a.id<=58&&a.id!==255);
    assert.equal(a.selectable,true);assert.equal(a.removable,true);
    assert.equal(a.placeable,true);assert.equal(a.individualCell,true);
    assert.equal(a.cropGrowth,false);assert.equal(a.harvesting,false);assert.equal(a.planting,false);
    assert.equal(a.save.schema,1);
    assert.match(a.integration,/NOT MERGED/);
  }
  assert.equal(gardenDefinition(2),null);
});
test('all three have nontrivial valid physical box unions and per-part material roles',()=>{
  for(const item of GARDEN_COMPONENTS){
    const d=gardenDescriptor(item.id);
    assert.ok(d.prototypeOnly);assert.equal(d.placeable,false);
    assert.equal(d.occupancy,'union-of-axis-aligned-boxes');
    assert.ok(d.boxes.length>=5&&d.boxes.length<=32);
    assert.ok(Object.isFrozen(d));assert.ok(Object.isFrozen(d.boxes));
    assert.deepEqual(d.boxes,d.parts.map(x=>x.box));
    for(const part of d.parts){
      assert.ok(item.roles.includes(part.role));
      assert.ok(Object.isFrozen(part));assert.ok(Object.isFrozen(part.box));
      for(let i=0;i<3;i++)assert.ok(
        Number.isFinite(part.box[i])&&part.box[i]>=0&&part.box[i]<part.box[i+3]&&
        part.box[i+3]<=1,JSON.stringify(part));
    }
    const v=occupancyVolume(d.boxes);
    assert.ok(v>.05&&v<1,item.name+' is not a partial volume '+v);
  }
});
test('tilled farmland has actual raised earth ridges and recessed spaces',()=>{
  assert.equal(occupied(21,.12,.76,.5),true,'solid raised ridge');
  assert.equal(occupied(21,.25,.76,.5),false,'recessed furrow above soil base');
  assert.equal(occupied(21,.25,.57,.5),true,'underlying earth bed');
  assert.equal(occupied(21,.97,.76,.5),false,'no solid beyond outer raised bank');
  assert.equal(occupied(21,.25,.85,.5),false,'no full-cube phantom collision');
  assert.equal(gardenDescriptor(21).parts.filter(p=>p.role==='ridge').length,4);
});
test('cedar planter has separate physical rim, planks and an unplanted soil bed',()=>{
  assert.equal(occupied(22,.5,.30,.5),true,'contained soil');
  assert.equal(occupied(22,.5,.51,.5),false,'cavity above soil');
  assert.equal(occupied(22,.1,.50,.5),true,'structural cedar wall');
  assert.equal(occupied(22,.5,.60,.12),true,'raised lip');
  assert.equal(occupied(22,.5,.60,.5),false,'open top center');
  assert.ok(gardenDescriptor(22).parts.some(p=>p.role==='loam'));
  assert.ok(gardenDescriptor(22).parts.some(p=>p.role==='cedar'));
  assert.equal(occupied(22,.5,.86,.5),false);
});
test('flower pot has a genuinely hollow center, bottom and continuous raised rim',()=>{
  assert.equal(occupied(23,.5,.49,.5),false,'center air above floor');
  assert.equal(occupied(23,.5,.16,.5),true,'physical terracotta bottom');
  assert.equal(occupied(23,.30,.48,.5),true,'physical pot wall');
  assert.equal(occupied(23,.25,.68,.5),true,'glazed rim');
  assert.equal(occupied(23,.10,.48,.5),false,'empty outside silhouette');
  assert.equal(occupied(23,.5,.68,.5),false,'opening inside lip');
  assert.equal(occupied(23,.5,.80,.5),false);
});
test('all four orientations preserve exact union volume and stay inside unit voxel',()=>{
  for(const id of ids){
    const base=occupancyVolume(gardenDescriptor(id).boxes);
    for(let rotation=0;rotation<4;rotation++){
      const d=gardenDescriptor(id,{rotation});
      assert.equal(d.rotation,rotation);
      assert.equal(d.orientationRequiresEngineSave,rotation!==0);
      for(const b of d.boxes)assert.ok(b.every(v=>v>=0&&v<=1));
      assert.ok(Math.abs(occupancyVolume(d.boxes)-base)<1e-9,id+' rotated volume changed');
    }
  }
});
test('materials expose distinct deterministic rich opaque face textures',()=>{
  const signatures=new Set();
  for(const item of GARDEN_COMPONENTS)for(const role of item.roles){
    const a=gardenTexture(item.id,'top',24,role);
    const b=gardenTexture(item.id,'top',24,role);
    assert.equal(a.role,role);
    assert.equal(a.pixels.length,24*24*4);
    assert.equal(hex(a),hex(b));
    const colors=new Set();
    for(let i=0;i<a.pixels.length;i+=4){
      assert.equal(a.pixels[i+3],255);
      colors.add([a.pixels[i],a.pixels[i+1],a.pixels[i+2]].join(','));
    }
    assert.ok(colors.size>=15,'insufficient texture detail for '+item.name+' '+role);
    signatures.add(hex(a));
  }
  assert.equal(signatures.size,7,'no material role is a byte-identical alias');
});
test('textures and roles reject unknowns, bad dimensions and invalid orientations',()=>{
  for(const size of [8,16,24,32,64,128])
    assert.equal(gardenTexture(21,'north',size).pixels.length,size*size*4);
  assert.throws(()=>gardenTexture(3),RangeError);
  assert.throws(()=>gardenTexture(21,'bad'),RangeError);
  assert.throws(()=>gardenTexture(22,'top',24,'terracotta'),RangeError);
  assert.throws(()=>gardenTexture(22,'top',7),RangeError);
  assert.throws(()=>gardenTexture(23,'west',129),RangeError);
  assert.throws(()=>gardenDescriptor(22,{rotation:4}),RangeError);
  assert.throws(()=>gardenDescriptor(22,{rotation:.5}),RangeError);
  assert.throws(()=>gardenOccupies(21,[.2,NaN,.4]),TypeError);
});
test('fixture places three independent cells, protects occupancy and removes cleanly',()=>{
  const f=createGardenFixture();
  ids.forEach((id,i)=>{
    assert.equal(f.place(i*2,4,0,id).ok,true);
    assert.equal(f.get(i*2,4,0),id);
    assert.equal(f.getShape(i*2,4,0).boxes.length,gardenDescriptor(id).boxes.length);
    assert.equal(f.place(i*2,4,0,id).reason,'occupied-cell');
  });
  assert.equal(f.size,3);
  assert.equal(f.place(10,4,0,255).reason,'unknown-candidate-id');
  assert.equal(f.place(0,20,0,21).reason,'invalid-coordinate');
  assert.equal(f.place(.5,4,0,21).reason,'invalid-coordinate');
  assert.equal(f.probe(4,4,0,[.5,.5,.5]),null,'flower-pot cavity is not solid');
  assert.equal(f.probe(4,4,0,[.3,.5,.5]).id,23);
  ids.forEach((id,i)=>assert.equal(f.remove(i*2,4,0).id,id));
  assert.equal(f.size,0);
  assert.equal(f.remove(0,4,0).reason,'empty-cell');
});
test('actual box-ray targeting passes through garden voids and strikes pot/plank surfaces',()=>{
  const f=createGardenFixture();
  assert.equal(f.place(0,3,0,21).ok,true);
  assert.equal(f.place(2,3,0,22).ok,true);
  assert.equal(f.place(4,3,0,23).ok,true);
  const ridge=f.raycast([.12,5,.5],[0,-1,0]);
  const furrow=f.raycast([.25,5,.5],[0,-1,0]);
  assert.equal(ridge.id,21);assert.equal(furrow.id,21);
  assert.ok(ridge.distance<furrow.distance,'physical raised farmland furrow must intercept ray first');
  const center=f.raycast([2.5,5,.5],[0,-1,0]);
  assert.equal(center.id,22);assert.ok(Math.abs(center.distance-1.58)<1e-7);
  const pot=f.raycast([4.5,5,.5],[0,-1,0]);
  assert.equal(pot.id,23);assert.ok(Math.abs(pot.distance-1.80)<1e-7);
  const side=f.raycast([4.5,3.45,-2],[0,0,1]);
  assert.equal(side.id,23);assert.ok(Math.abs(side.distance-2.27)<1e-7);
  assert.deepEqual(side.normal,[0,0,-1]);
  assert.equal(f.raycast([12,3.5,-2],[0,0,1]),null);
  assert.throws(()=>f.raycast([0,0,0],[0,0,0]),RangeError);
});
test('schema-1-shaped fixture roundtrip preserves IDs without inventing farming state',()=>{
  const f=createGardenFixture(-77);
  ids.forEach((id,i)=>assert.equal(f.place(-i,2,i,id).ok,true));
  const payload=f.save();
  assert.deepEqual(Object.keys(payload),['schema','seed','edits']);
  assert.equal(payload.schema,1);assert.equal(payload.seed,-77);
  assert.ok(payload.edits.every(row=>row.length===4));
  const copy=restoreGardenFixture(JSON.parse(JSON.stringify(payload)));
  assert.deepEqual(copy.save(),payload);
  assert.equal(copy.size,3);
  assert.equal(copy.remove(-1,2,1).id,22);
  assert.equal(f.get(-1,2,1),22);
});
test('unsafe rotated saves fail closed until central orientation persistence exists',()=>{
  const f=createGardenFixture();
  assert.equal(f.place(0,3,0,22,{rotation:1}).ok,true);
  assert.equal(f.getShape(0,3,0).rotation,1);
  assert.throws(()=>f.save(),/Rotated garden piece requires central engine/);
  assert.equal(f.remove(0,3,0).id,22);
  assert.deepEqual(f.save().edits,[]);
});
test('invalid schema rows, duplicates and old engine IDs fail fixture restoration',()=>{
  const good={schema:1,seed:179,edits:[[0,3,0,21]]};
  assert.equal(restoreGardenFixture(good).size,1);
  for(const row of [[0,3,0,21],[0,20,0,21],[0,3,0,3],[0,3,0,255],[1,3.5,0,23]])
    assert.throws(()=>restoreGardenFixture({...good,edits:[...good.edits,row]}));
  assert.throws(()=>restoreGardenFixture({...good,schema:2}));
  assert.throws(()=>restoreGardenFixture({...good,seed:1.2}));
  assert.throws(()=>restoreGardenFixture({...good,edits:'invalid'}));
});
test('independent fixtures never touch game-world seeds, saves or other fixture cells',()=>{
  const a=createGardenFixture(179),b=createGardenFixture(179);
  a.place(1,3,1,23);
  assert.equal(a.size,1);assert.equal(b.size,0);
  assert.equal(b.get(1,3,1),0);
  assert.deepEqual(b.save(),{schema:1,seed:179,edits:[]});
});
