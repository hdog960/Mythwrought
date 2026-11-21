import assert from 'node:assert/strict';
import test from 'node:test';
import {makeCaveRubbleCluster,validateCaveRubbleCluster} from '../src/nonblock-environments24/cave-rubble-cluster.mjs';
import {makeMineralEncrustation,validateMineralEncrustation} from '../src/nonblock-environments24/mineral-encrustation.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [make,validate,faces,triangles] of [
  [makeCaveRubbleCluster,validateCaveRubbleCluster,[undefined],96],
  [makeMineralEncrustation,validateMineralEncrustation,['north','south','east','west'],112]
]){
  test(make.name+' creates closed distinct low-poly parts on its existing supports',()=>{
    for(const [orientation,face] of faces.entries())for(const variant of [0,1,2,3]){
      const seed=179,anchor=[15,4,6];
      const source=make({seed,anchor,variant,face}),{sceneId,mesh,selectionAabbs}=source;
      const candidate=describeCandidateObject(seed,{sceneId,anchor,variant,orientation});
      assert.equal(validate(source),true);
      assert.equal(candidate.colliders.length,0);
      assert.equal(candidate.supports.length,1);
      assert.equal(mesh.materials?.length,mesh.triangleCount);
      assert.ok(new Set(mesh.materials).size>=3);
      assert.ok(mesh.materials.every(tag=>candidate.palette[tag]?.length===3));
      assert.ok(mesh.triangleCount<=triangles);
      assert.equal(mesh.triangleCount,16*selectionAabbs.length);
      for(let part=0;part<selectionAabbs.length;part++){
        const edges=new Map(),box=selectionAabbs[part];
        for(let offset=part*144;offset<(part+1)*144;offset+=9){
          const points=[0,3,6].map(index=>mesh.positions.slice(offset+index,offset+index+3));
          const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
          assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
          for(const point of points)assert.ok(point.every((value,axis)=>value>=box.min[axis]&&value<=box.max[axis]));
          for(let index=0;index<3;index++){
            const key=[points[index].join(','),points[(index+1)%3].join(',')].sort().join('|');
            edges.set(key,1+(edges.get(key)??0));
          }
        }
        assert.ok([...edges.values()].every(count=>count===2));
      }
    }
  });
}
