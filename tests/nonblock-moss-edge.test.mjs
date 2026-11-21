import assert from 'node:assert/strict';
import test from 'node:test';
import {createForestMossMat,MOSS_SCENE_ID} from '../src/nonblock-scene48/forest-moss-mat.mjs';
import {createForestLichenPatch,LICHEN_SCENE_ID} from '../src/nonblock-scene48/forest-lichen-patch.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('forest moss grows as a low irregular mat with no duplicated faces',()=>{
  for(const variant of [1,2,3]){
    const source=createForestMossMat(179,12,9,7,variant);
    const {positions,triangleCount}=source.mesh;
    assert.ok(triangleCount<=source.lod.maxTriangles);
    const samples=new Set();
    for(let i=0;i<positions.length;i+=9){
      const points=[0,3,6].map(offset=>[...positions.subarray(i+offset,i+offset+3)]);
      const key=points.map(point=>point.join(',')).sort().join('|');
      assert.ok(!samples.has(key),'Coincident opposite triangles create redundant faces');
      samples.add(key);
      assert.ok(points.every(([x,y,z])=>Math.hypot(x,z)<.54&&y>=.014&&y<.17));
    }
    assert.equal(source.instanceKey,`${MOSS_SCENE_ID}:179:12,9,7:v${variant}`);
    assert.equal(describeCandidateObject(179,{sceneId:MOSS_SCENE_ID,anchor:[12,9,7],variant}).instanceKey,
      `nb1:scene48%3Aforest-moss-mat:179:12,9,7:${variant}`);
  }
});

test('the lichen rim has distinct low lobes and an explicit source pigment for every face',()=>{
  const variants=[];
  for(const variant of [1,2,3]){
    const {mesh,lod}=createForestLichenPatch(179,12,9,7,variant);
    assert.ok(mesh.triangleCount<=lod.maxTriangles);
    assert.ok(mesh.positions.every((value,i)=>i%3!==1||value>0&&value<.065));
    const candidate=describeCandidateObject(179,{sceneId:LICHEN_SCENE_ID,anchor:[12,9,7],variant});
    assert.ok(mesh.materials.every(material=>candidate.palette[material]?.length===3));
    variants.push([...mesh.positions].join(','));
  }
  assert.equal(new Set(variants).size,3);
});
