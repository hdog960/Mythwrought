import assert from 'node:assert/strict';
import test from 'node:test';
import {makeDwarfJuniper,validateDwarfJuniper} from '../src/nonblock-environments24/dwarf-juniper.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('dwarf juniper has grounded woody branches and fully modeled evergreen sprays',()=>{
  const shapes=new Set();
  for(const variant of [0,1,2,3]){
    const options={seed:179,anchor:[0,12,768],variant};
    const source=makeDwarfJuniper(options);
    const staged=describeCandidateObject(options.seed,{sceneId:source.sceneId,anchor:options.anchor,variant});
    const {mesh}=source;
    assert.equal(validateDwarfJuniper(source),true);
    assert.equal(staged.instanceKey,source.instanceKey);
    assert.equal(staged.colliders.length,0);
    assert.equal(mesh.materials?.length,mesh.triangleCount);
    assert.deepEqual([...new Set(mesh.materials)].sort(),[0,1,2,3]);
    assert.ok(mesh.materials.every(tag=>staged.palette[tag]?.length===3));
    assert.ok(mesh.triangleCount<=160);
    const incidences=new Map();
    for(let i=0;i<mesh.positions.length;i+=9){
      const points=[0,3,6].map(offset=>mesh.positions.slice(i+offset,i+offset+3));
      const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
      assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
      const material=mesh.materials[i/9];
      for(const point of points){
        assert.ok(source.selectionAabbs.some(({min,max})=>
          point.every((value,axis)=>value>=min[axis]&&value<=max[axis])));
        if(material!==0)assert.ok(point[1]>.05);
      }
      for(let edge=0;edge<3;edge++){
        const key=[points[edge].join(','),points[(edge+1)%3].join(',')].sort().join('|');
        incidences.set(key,1+(incidences.get(key)??0));
      }
    }
    assert.ok([...incidences.values()].every(count=>count===2));
    const heights=mesh.positions.filter((_,index)=>index%3===1);
    assert.equal(Math.min(...heights),0);
    assert.ok(Math.max(...heights)<.45);
    shapes.add(mesh.positions.join(','));
  }
  assert.equal(shapes.size,4);
});
