import assert from 'node:assert/strict';
import test from 'node:test';
import {makeBranchingCrystalCluster} from '../src/nonblock-environments24/branching-crystal-cluster.mjs';
import {makeGeodeOpening,validateGeodeOpening} from '../src/nonblock-environments24/geode-opening.mjs';
import {makePebbleScatter} from '../src/nonblock-environments24/pebble-scatter.mjs';
import {createCandidateScene,describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [name,make,partTriangles,materialCount,solid] of [
  ['branching crystal cluster',makeBranchingCrystalCluster,24,4,true],
  ['pebble scatter',makePebbleScatter,12,3,false]
]){
  test(name+' has distinct, closed parts with terrain-facing material variation',()=>{
    const shapes=new Set();
    for(const variant of [0,1,2,3]){
      const seed=179,anchor=[8,9,6],source=make({seed,anchor,variant});
      const {sceneId,mesh,selectionAabbs}=source;
      const staged=describeCandidateObject(seed,{sceneId,anchor,variant});
      assert.equal(staged.instanceKey,source.instanceKey);
      assert.equal(staged.colliders.length,solid?3+variant:0);
      assert.equal(selectionAabbs.length,3+variant);
      assert.equal(mesh.triangleCount,partTriangles*(3+variant));
      assert.equal(new Set(mesh.materials).size,materialCount);
      assert.ok(mesh.materials.every(tag=>staged.palette[tag]?.length===3));
      for(let part=0;part<selectionAabbs.length;part++){
        const box=selectionAabbs[part],stride=partTriangles*9;
        const incidences=new Map();
        assert.ok(box.min[1]<=0&&box.min[1]>-.015);
        for(let i=part*stride;i<(part+1)*stride;i+=9){
          const points=[0,3,6].map(offset=>mesh.positions.slice(i+offset,i+offset+3));
          const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
          assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
          for(const point of points)assert.ok(point.every((value,axis)=>value>=box.min[axis]&&value<=box.max[axis]));
          for(let edge=0;edge<3;edge++){
            const key=[points[edge].join(','),points[(edge+1)%3].join(',')].sort().join('|');
            incidences.set(key,1+(incidences.get(key)??0));
          }
        }
        assert.ok([...incidences.values()].every(count=>count===2));
      }
      shapes.add(mesh.positions.join(','));
    }
    assert.equal(shapes.size,4);
  });
}

test('geode has an irregular layered face and a pick-through center',()=>{
  for(const variant of [0,1,2,3]){
    const seed=179,anchor=[7,9,7],sceneId='nonblock:e:geode-opening';
    const source=makeGeodeOpening({seed,anchor,variant});
    const desc=describeCandidateObject(seed,{sceneId,anchor,variant});
    const scene=createCandidateScene(seed,'legacy',[{sceneId,anchor,variant}],{
      blockAt:(x,y,z)=>x===7&&y===9&&z===6,
      storage:{getItem:()=>null},voxelPick:()=>null
    });
    assert.equal(validateGeodeOpening(source),true);
    assert.equal(scene.visible().length,1);
    assert.equal(desc.colliders.length,8+variant*2);
    assert.equal(desc.materials?.length,source.mesh.triangleCount);
    assert.equal(new Set(desc.materials).size,5);
    assert.ok(source.mesh.triangleCount<=180);
    assert.equal(scene.pick([7.5,9.5,9.5],[0,0,-1]),null);
    assert.equal(scene.pick([7.77,9.5,9.5],[0,0,-1])?.instanceKey,desc.instanceKey);
    const faces=new Set();
    for(let i=0;i<source.mesh.positions.length;i+=9){
      const triangle=[0,3,6].map(offset=>source.mesh.positions.slice(i+offset,i+offset+3));
      faces.add(triangle.map(point=>point.join(',')).sort().join('|'));
    }
    assert.equal(faces.size,source.mesh.triangleCount);
  }
});
