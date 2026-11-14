import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CORE_MASONRY,MASONRY_IDS,MASONRY_FACES,masonryDefinition,
  masonryTexture,masonryTextureSet
} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {
  createMasonryFixture,restoreMasonryFixture
} from '../../../src/block-packs/pack-1/fixture.mjs';

const ids=Object.values(MASONRY_IDS);
const hex=t=>Buffer.from(t.pixels).toString('hex');
function average(t) {
  const sums=[0,0,0];let varied=new Set();
  for(let i=0;i<t.pixels.length;i+=4){
    for(let c=0;c<3;c++)sums[c]+=t.pixels[i+c];
    assert.equal(t.pixels[i+3],255);
    varied.add(t.pixels.slice(i,i+3).join(','));
  }
  return {rgb:sums.map(s=>s/(t.width*t.height)),colors:varied.size};
}
test('six distinct candidate IDs reserved solely in Pack 1 band',()=>{
  assert.deepEqual(ids,[9,10,11,12,13,14]);
  assert.equal(new Set(ids).size,6);
  assert.ok(ids.every(id=>id>=9&&id<=58&&id!==255));
  assert.equal(masonryDefinition(3),null);
  assert.equal(masonryDefinition(255),null);
  for(const d of CORE_MASONRY){
    assert.equal(d.integration,'candidate-only');
    assert.equal(d.placeable,true);assert.equal(d.removable,true);
    assert.equal(d.save.schema,1);
    assert.equal(d.shape.kind,'full_cube');
    assert.deepEqual(d.shape.boxes,[[0,0,0,1,1,1]]);
    assert.deepEqual(d.selection.boxes,d.collision.boxes);
    assert.equal(d.selection.individual,true);
  }
});
test('all six faces have deterministic opaque pixel artwork',()=>{
  for(const id of ids){
    const faces=masonryTextureSet(id);
    assert.deepEqual(Object.keys(faces),MASONRY_FACES);
    for(const face of MASONRY_FACES){
      const a=faces[face],b=masonryTexture(id,face);
      assert.equal(a.width,24);assert.equal(a.height,24);
      assert.equal(a.pixels.length,24*24*4);
      assert.equal(hex(a),hex(b));
      assert.ok(average(a).colors>=15,id+' '+face+' lacks authored detail');
    }
  }
});
test('six material faces are not aliases or palette-only placeholders',()=>{
  const textures=ids.map(id=>masonryTexture(id,'north'));
  assert.equal(new Set(textures.map(hex)).size,6);
  const means=textures.map(t=>average(t).rgb);
  assert.ok(means[4][2]>means[4][0],'polished teal-grey blue component');
  assert.ok(means[5][0]>means[4][0]+35,'carved ochre distinct from polished');
  const green=t=>{
    let n=0;
    for(let i=0;i<t.pixels.length;i+=4){
      if(t.pixels[i+1]>t.pixels[i]+14&&t.pixels[i+1]>t.pixels[i+2]+12)n++;
    }
    return n;
  };
  assert.ok(green(textures[2])>green(textures[1])+15,'mossy is physically green-detailed');
  assert.notEqual(hex(textures[1]),hex(textures[3]),'cracks distinguish ash from masonry');
});
test('shader unrelated; texture sizes and unknown assets guarded',()=>{
  for(const size of [8,16,24,32,64,128]){
    const tile=masonryTexture(9,'top',size);
    assert.equal(tile.pixels.length,size*size*4);
  }
  assert.throws(()=>masonryTexture(9,'north',129),RangeError);
  assert.throws(()=>masonryTexture(9,'north',7),RangeError);
  assert.throws(()=>masonryTexture(9,'north',16.5),RangeError);
  assert.throws(()=>masonryTexture(3),RangeError);
  assert.throws(()=>masonryTexture(255),RangeError);
  assert.throws(()=>masonryTexture(9,'around'),RangeError);
});
test('fixture places and removes each independent full voxel',()=>{
  const w=createMasonryFixture();
  for(let i=0;i<ids.length;i++){
    assert.equal(w.place(i,3,0,ids[i]).ok,true);
    assert.equal(w.get(i,3,0),ids[i]);
    assert.deepEqual(w.place(i,3,0,ids[i]),{ok:false,reason:'occupied'});
  }
  assert.equal(w.size,6);
  assert.equal(w.place(9,3,0,255).ok,false);
  assert.equal(w.place(9,3,0,3).ok,false);
  assert.equal(w.place(9,20,0,9).ok,false);
  assert.equal(w.place(9,3.5,0,9).ok,false);
  for(let i=0;i<ids.length;i++){
    assert.equal(w.remove(i,3,0).id,ids[i]);
    assert.equal(w.get(i,3,0),0);
  }
  assert.equal(w.size,0);
});
test('selection ray distinguishes six individually targetable cells',()=>{
  const w=createMasonryFixture();
  for(let i=0;i<ids.length;i++)w.place(i*2,4,0,ids[i]);
  for(let i=0;i<ids.length;i++){
    const hit=w.raycast([i*2+.5,4.5,-2],[0,0,1],6);
    assert.deepEqual(hit.cell,[i*2,4,0]);
    assert.equal(hit.id,ids[i]);assert.equal(hit.distance,2);
    assert.deepEqual(hit.normal,[0,0,-1]);
  }
  assert.equal(w.raycast([30,4.5,-2],[0,0,1]),null);
  assert.throws(()=>w.raycast([0,0,0],[0,0,0]),RangeError);
});
test('fixture simulated schema-1 delta survives save/restore without new keys',()=>{
  const w=createMasonryFixture(-77);
  for(let i=0;i<ids.length;i++)w.place(-i,2,i,ids[i]);
  const payload=w.save();
  assert.deepEqual(Object.keys(payload),['schema','seed','edits']);
  assert.equal(payload.schema,1);assert.equal(payload.seed,-77);
  assert.ok(payload.edits.every(row=>row.length===4));
  const restored=restoreMasonryFixture(JSON.parse(JSON.stringify(payload)));
  assert.deepEqual(restored.save(),payload);
  assert.equal(restored.size,6);
  assert.equal(restored.remove(-2,2,2).id,11);
  assert.equal(w.get(-2,2,2),11);
});
test('restore rejects duplicate positions, out-of-bounds and out-of-band IDs',()=>{
  const saved={schema:1,seed:179,edits:[[0,3,0,9]]};
  assert.equal(restoreMasonryFixture(saved).size,1);
  for(const edit of [[0,3,0,9],[0,19,0,255],[0,20,0,9],[1,3,0,3],[1,3,0,9.5]]){
    assert.throws(()=>restoreMasonryFixture({...saved,edits:[saved.edits[0],edit]}));
  }
  assert.throws(()=>restoreMasonryFixture({...saved,schema:2}));
  assert.throws(()=>restoreMasonryFixture({...saved,seed:1.2}));
});
test('the gallery fixture does not touch VoxelWorld or global game state',()=>{
  const a=createMasonryFixture(179),b=createMasonryFixture(179);
  a.place(3,3,3,9);
  assert.equal(b.size,0);
  assert.equal(b.get(3,3,3),0);
});
