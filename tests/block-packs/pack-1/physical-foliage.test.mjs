import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FOLIAGE_IDS,FOLIAGE_ASSETS,foliageDefinition,foliageDescriptor,
  foliageOccupies,foliageTexture
} from '../../../src/block-packs/pack-1/physical-foliage.mjs';
import {createFoliageFixture,restoreFoliageFixture}
  from '../../../src/block-packs/pack-1/foliage-fixture.mjs';
import {MASONRY_IDS} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {STONE_SHAPE_IDS} from '../../../src/block-packs/pack-1/stone-shapes.mjs';
import {GARDEN_IDS} from '../../../src/block-packs/pack-1/garden-components.mjs';
const ids=Object.values(FOLIAGE_IDS);
const hex=x=>Buffer.from(x.pixels).toString('hex');
const at=(id,x,y,z,options={})=>foliageOccupies(id,[x,y,z],options);
function volume(boxes){
  const grid=[0,1,2].map(axis=>[...new Set(boxes.flatMap(b=>[b[axis],b[axis+3]]))].sort((a,b)=>a-b));
  let sum=0;
  for(let x=0;x<grid[0].length-1;x++)for(let y=0;y<grid[1].length-1;y++)
  for(let z=0;z<grid[2].length-1;z++){
    const [a,A]=[grid[0][x],grid[0][x+1]];
    const [b,B]=[grid[1][y],grid[1][y+1]];
    const [c,C]=[grid[2][z],grid[2][z+1]];
    if(boxes.some(box=>[(a+A)/2,(b+B)/2,(c+C)/2].every((v,k)=>v>=box[k]&&v<box[k+3])))
      sum+=(A-a)*(B-b)*(C-c);
  }
  return sum;
}
test('eight unique Pack 1 candidate IDs 24–31, no main or other-pack collision',()=>{
  assert.deepEqual(ids,[24,25,26,27,28,29,30,31]);
  assert.equal(FOLIAGE_ASSETS.length,8);
  const all=[...ids,...Object.values(MASONRY_IDS),...Object.values(STONE_SHAPE_IDS),...Object.values(GARDEN_IDS)];
  assert.equal(new Set(all).size,23);
  for(const a of FOLIAGE_ASSETS){
    assert.ok(a.id>=9&&a.id<=58&&a.id!==255);
    assert.ok([50,51,52,55].includes(a.roster));
    assert.equal(a.independentCell,true);
    assert.equal(a.selectable,true);assert.equal(a.removable,true);assert.equal(a.placeable,true);
    assert.equal(a.harvestable,false);assert.equal(a.craftable,false);assert.equal(a.growth,false);
    assert.match(a.integration,/NOT MERGED/);
  }
  assert.equal(foliageDefinition(7),null,'legacy leaf canopy not duplicated as an ID');
});
test('all physical foliage variants expose distinct immutable unit box unions',()=>{
  const signatures=new Set();
  for(const id of ids){
    const d=foliageDescriptor(id);
    assert.equal(d.prototypeOnly,true);assert.equal(d.placeable,false);
    assert.ok(d.boxes.length>=5&&d.boxes.length<=32);
    assert.ok(Object.isFrozen(d));assert.ok(Object.isFrozen(d.boxes));
    assert.deepEqual(d.selection.boxes,d.boxes);
    for(const b of d.boxes){
      assert.equal(b.length,6);assert.ok(Object.isFrozen(b));
      for(let k=0;k<3;k++)assert.ok(b[k]>=0&&b[k]<b[k+3]&&b[k+3]<=1);
    }
    const v=volume(d.boxes);assert.ok(v>.005&&v<.95,'real partial volume '+id+': '+v);
    signatures.add(JSON.stringify(d.boxes));
  }
  assert.equal(signatures.size,8,'all different physical silhouettes, not recolors');
});
test('hedgerow blocks sideways but has air above and outside stepped foliage',()=>{
  assert.equal(at(24,.5,.5,.5),true);
  assert.equal(at(24,.02,.5,.5),false);
  assert.equal(at(24,.5,.995,.5),false);
  assert.ok(foliageDescriptor(24).collision.boxes.length>=5);
  assert.equal(at(24,.5,.5,.5,{mode:'collision'}),true);
  assert.equal(at(24,.02,.5,.5,{mode:'collision'}),false);
});
test('briar thicket and fern bush have unlike branch silhouettes and real empty air',()=>{
  assert.equal(at(25,.5,.3,.5),true);
  assert.equal(at(25,.5,.95,.5),false);
  assert.equal(at(26,.5,.65,.5),true);
  assert.equal(at(26,.15,.8,.5),false);
  assert.notEqual(JSON.stringify(foliageDescriptor(25).boxes),JSON.stringify(foliageDescriptor(26).boxes));
  assert.ok(foliageDescriptor(25).collision.boxes.length>=3);
  assert.equal(foliageDescriptor(26).collision.boxes.length,0,'fern foliage passable, not untargetable');
  assert.ok(foliageDescriptor(26).selection.boxes.length>0);
});
test('climbing vines are thin wall-mounted selectable volumes, with pass-through collision',()=>{
  for(const id of [27,28]){
    const a=foliageDefinition(id);
    assert.equal(a.attachment,'vertical-face');
    const d=foliageDescriptor(id);
    assert.ok(d.boxes.every(b=>b[2]>=0&&b[5]<=.2));
    assert.equal(d.collision.boxes.length,0,'no invisible solid wall');
    assert.equal(at(id,.5,.49,.5),false,'free air in cell, not full cube');
    assert.ok(d.boxes.some(b=>b[3]-b[0]<.18));
  }
  assert.notEqual(JSON.stringify(foliageDescriptor(27).boxes),JSON.stringify(foliageDescriptor(28).boxes));
});
test('ornamental gold/crimson/silver leaf assets have independent open silhouettes',()=>{
  const sigs=[29,30,31].map(id=>JSON.stringify(foliageDescriptor(id).boxes));
  assert.equal(new Set(sigs).size,3);
  for(const id of [29,30,31]){
    const d=foliageDescriptor(id);
    assert.equal(d.collision.boxes.length,0);
    assert.ok(d.selection.boxes.length>=7);
    assert.equal(at(id,.05,.85,.05),false);
  }
});
test('quarter-turn rotation is conserved in exact volume and mount orientation',()=>{
  for(const id of ids){
    const original=volume(foliageDescriptor(id).boxes);
    for(let r=0;r<4;r++){
      const shape=foliageDescriptor(id,{rotation:r});
      assert.ok(Math.abs(volume(shape.boxes)-original)<1e-8,id+' changed occupied volume at '+r);
      assert.equal(shape.orientationRequiresEngineSave,r!==0);
    }
  }
  const ivy=foliageDescriptor(27,{rotation:1});
  assert.ok(ivy.boxes.every(b=>b[0]>=.8&&b[3]<=1),'north face rotates to east face');
});
test('soft foliage still has positive physical selection despite intentionally empty collision',()=>{
  for(const id of [26,27,28,29,30,31]){
    const d=foliageDescriptor(id);
    assert.equal(d.collision.boxes.length,0);
    const first=d.boxes[0],mid=[0,1,2].map(k=>(first[k]+first[k+3])/2);
    assert.equal(foliageOccupies(id,mid,{mode:'selection'}),true);
    assert.equal(foliageOccupies(id,mid,{mode:'collision'}),false);
  }
});
test('every material face has deterministic richly varied opaque RGBA, no aliases',()=>{
  const images=new Set();
  for(const id of ids)for(const role of ['leaf','twig']){
    const a=foliageTexture(id,'top',24,role);
    const b=foliageTexture(id,'top',24,role);
    assert.equal(a.pixels.length,2304);assert.equal(hex(a),hex(b));
    const colors=new Set();
    for(let i=0;i<a.pixels.length;i+=4){
      assert.equal(a.pixels[i+3],255);
      colors.add(a.pixels.slice(i,i+3).join(','));
    }
    assert.ok(colors.size>=18,'needs textured pixel variety: '+id+' '+role+' '+colors.size);
    images.add(hex(a));
  }
  assert.equal(images.size,16,'distinct visual appearance per role and candidate');
});
test('texture input rejection is deterministic and constrained for mobile assets',()=>{
  for(const id of ids)for(const side of ['north','south','east','west','top','bottom']){
    assert.equal(foliageTexture(id,side,16).pixels.length,1024);
  }
  for(const size of [8,24,32,64,128])assert.equal(foliageTexture(24,'top',size).pixels.length,size*size*4);
  assert.throws(()=>foliageTexture(7),RangeError);
  assert.throws(()=>foliageTexture(255),RangeError);
  assert.throws(()=>foliageTexture(24,'unknown'),RangeError);
  assert.throws(()=>foliageTexture(24,'north',7),RangeError);
  assert.throws(()=>foliageTexture(24,'north',129),RangeError);
  assert.throws(()=>foliageTexture(24,'top',24,'bark'),RangeError);
  assert.throws(()=>foliageDescriptor(24,{rotation:4}),RangeError);
  assert.throws(()=>foliageOccupies(24,[NaN,0,0]),TypeError);
});
test('fixture independently places and removes all eight; vines require explicit wall mount',()=>{
  const f=createFoliageFixture();
  for(const [i,id] of ids.entries()){
    const x=i*2,options=[27,28].includes(id)?{wallMount:true}:{};
    assert.equal(f.place(x,3,0,id,options).ok,true);
    assert.equal(f.get(x,3,0),id);
    assert.equal(f.getShape(x,3,0).selection.individual,true);
    assert.equal(f.place(x,3,0,id,options).reason,'occupied-cell');
  }
  assert.equal(f.size,8);
  assert.equal(f.place(100,3,0,27).reason,'mount-surface-required');
  assert.equal(f.place(100,3,0,28).reason,'mount-surface-required');
  assert.equal(f.place(100,20,0,24).reason,'invalid-cell');
  assert.equal(f.place(100,3,0,255).reason,'unknown-foliage-id');
  for(const [i,id] of ids.entries())assert.equal(f.remove(i*2,3,0).id,id);
  assert.equal(f.size,0);
});
test('targeting hits hedge / vine, but ray passes through empty foliage gaps',()=>{
  const f=createFoliageFixture();
  assert.equal(f.place(0,3,0,24).ok,true);
  assert.equal(f.place(2,3,0,27,{wallMount:true}).ok,true);
  const hedge=f.raycast([.5,3.55,-2],[0,0,1]);
  assert.equal(hedge.id,24);
  const gap=f.raycast([.01,3.55,-2],[0,0,1]);
  assert.equal(gap,null);
  const vine=f.raycast([2.47,3.45,-2],[0,0,1]);
  assert.equal(vine.id,27);
  assert.equal(f.probe(2,3,0,[.47,.45,.09],'selection').id,27);
  assert.equal(f.probe(2,3,0,[.47,.45,.09],'collision'),null);
  assert.equal(f.raycast([20,3,-2],[0,0,1]),null);
  assert.throws(()=>f.raycast([0,0,0],[0,0,0]),RangeError);
});
test('canonical foliage fixture preserves schema-1-shaped edits and mount on restore',()=>{
  const f=createFoliageFixture(-77);
  for(const [i,id] of ids.entries())
    assert.equal(f.place(-i,2,i,id,{wallMount:[27,28].includes(id)}).ok,true);
  const save=f.save();
  assert.deepEqual(Object.keys(save),['schema','seed','edits']);
  assert.equal(save.schema,1);assert.equal(save.edits.length,8);
  assert.ok(save.edits.every(x=>x.length===4));
  assert.throws(()=>restoreFoliageFixture(save),/Invalid or duplicate foliage edit or missing mount/);
  const restored=restoreFoliageFixture(JSON.parse(JSON.stringify(save)),{mountForVines:true});
  assert.deepEqual(restored.save(),save);
  assert.equal(restored.remove(-3,2,3).id,27);
  assert.equal(f.get(-3,2,3),27);
});
test('noncanonical orientation cannot silently corrupt schema-1-shaped foliage save',()=>{
  const f=createFoliageFixture();
  assert.equal(f.place(0,3,0,24,{rotation:1}).ok,true);
  assert.equal(f.getShape(0,3,0).rotation,1);
  assert.throws(()=>f.save(),/Rotated foliage requires/);
  assert.equal(f.remove(0,3,0).id,24);
  assert.deepEqual(f.save(),{schema:1,seed:179,edits:[]});
});
test('invalid rows, duplicated cells and protected block IDs are rejected',()=>{
  const one={schema:1,seed:179,edits:[[0,3,0,24]]};
  assert.equal(restoreFoliageFixture(one).size,1);
  for(const row of [[0,3,0,24],[0,20,0,24],[1,3,0,7],[1,3,0,255],[1,3.2,0,24]])
    assert.throws(()=>restoreFoliageFixture({...one,edits:[...one.edits,row]}));
  assert.throws(()=>restoreFoliageFixture({...one,schema:2}));
  assert.throws(()=>restoreFoliageFixture({...one,edits:'oops'}));
  assert.throws(()=>restoreFoliageFixture({...one,seed:1.5}));
});
test('fixtures never mutate each other or existing live game state',()=>{
  const a=createFoliageFixture(),b=createFoliageFixture();
  a.place(1,3,1,29);
  assert.equal(a.size,1);assert.equal(b.size,0);
  assert.equal(b.get(1,3,1),0);
  assert.deepEqual(b.save(),{schema:1,seed:179,edits:[]});
});
