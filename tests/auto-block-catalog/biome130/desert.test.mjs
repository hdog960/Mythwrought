import test from 'node:test';
import assert from 'node:assert/strict';
import {DESERT_CANDIDATE_IDS,desertCandidate,candidateFixture} from '../../../src/auto-block-catalog/biome130/desert.mjs';
test('nine exclusive symbolic candidates have future IDs 256..264 and no live IDs',()=>{
 assert.equal(DESERT_CANDIDATE_IDS.length,9);
 for(let i=0;i<9;i++){const d=desertCandidate(DESERT_CANDIDATE_IDS[i]);assert.equal(d.proposedFutureId,256+i);assert.equal(d.status,'BLOCKED BY ENGINE');assert.equal(d.shape.boxes.length,1);assert.deepEqual(d.shape.boxes[0],[0,0,0,1,1,1]);assert.equal(d.physical.selectable,true);assert.equal(d.physical.removable,true);}
});
test('six deterministic voxel faces per family with distinct color and pattern',()=>{
 const descriptors=DESERT_CANDIDATE_IDS.map(desertCandidate);
 assert.equal(new Set(descriptors.map(d=>JSON.stringify(d.texture))).size,4);
 for(const d of descriptors){assert.equal(d.texture.faces.length,6);for(const f of d.texture.faces){assert.equal(f.length,16);for(const pixel of f)assert.ok(pixel>=0&&pixel<4);}assert.deepEqual(desertCandidate(d.symbolicId),d);}
});
test('isolated placement selection removal and reversible snapshot never touches world saves',()=>{
 const a=candidateFixture();assert.equal(a.place(1,2,3,'biome130:001'),true);assert.equal(a.place(1,2,3,'biome130:002'),false);
 assert.equal(a.place(-3,0,7,'biome130:004'),true);const s=a.snapshot();const b=candidateFixture();b.restore(s);assert.equal(b.snapshot(),s);
 assert.equal(b.select(1,2,3),'biome130:001');assert.equal(b.remove(1,2,3),'biome130:001');assert.equal(b.select(1,2,3),null);
 assert.throws(()=>b.place(0,0,0,'biome130:999'),RangeError);
});

test('desert geology 005..009 is independently identifiable and physical in isolated fixtures',()=>{
 const names=['Sunbaked mud','Wind-carved sandstone','Banded desert rock','Desert varnish stone','Fossil-bearing sandstone'];
 const fixture=candidateFixture();
 for(let i=5;i<=9;i++){
  const id='biome130:'+String(i).padStart(3,'0'),d=desertCandidate(id);
  assert.equal(d.name,names[i-5]);assert.equal(d.proposedFutureId,255+i);
  assert.equal(d.texture.faces.length,6);assert.equal(d.physical.solid,true);
  assert.equal(d.physical.selectable,true);assert.equal(d.physical.removable,true);
  assert.ok(d.physical.hardness>0);assert.ok(d.physical.friction>0);
  assert.equal(fixture.place(i,0,0,id),true);
  assert.equal(fixture.select(i,0,0),id);
 }
 const snapshot=fixture.snapshot(),restored=candidateFixture();restored.restore(snapshot);
 assert.equal(restored.snapshot(),snapshot);
 for(let i=5;i<=9;i++)assert.equal(restored.remove(i,0,0),'biome130:'+String(i).padStart(3,'0'));
 assert.equal(new Set(DESERT_CANDIDATE_IDS.map(id=>JSON.stringify(desertCandidate(id).texture))).size,9);
});
