import assert from 'node:assert/strict';
import test from 'node:test';
import {makeColumnCactus,validateColumnCactus} from '../src/nonblock-environments24/column-cactus.mjs';
import {makeDesertScrub,validateDesertScrub} from '../src/nonblock-environments24/desert-scrub.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [make,validate,limit,solid] of [
  [makeColumnCactus,validateColumnCactus,216,true],[makeDesertScrub,validateDesertScrub,168,false]
]){
  test(make.name+' has grounded, bounded geometry with coherent material faces',()=>{
    for(const seed of [0,179,-163])for(const variant of [0,1,2,3]){
      const anchor=[512,9,0],source=make({seed,anchor,variant});
      const {sceneId,mesh,selectionAabbs}=source;
      const stage=describeCandidateObject(seed,{sceneId,anchor,variant});
      assert.equal(validate(source),true);
      assert.equal(stage.instanceKey,source.instanceKey);
      assert.equal(stage.colliders.length,solid?1+2*(variant+1):0);
      assert.equal(mesh.materials?.length,mesh.triangleCount);
      assert.equal(new Set(mesh.materials).size,4);
      assert.ok(mesh.materials.every(tag=>stage.palette[tag]?.length===3));
      assert.ok(mesh.triangleCount<=limit);
      const heights=mesh.positions.filter((_,index)=>index%3===1);
      assert.ok(Math.min(...heights)<.002);
      const edges=new Map();
      for(let index=0;index<mesh.positions.length;index+=9){
        const points=[0,3,6].map(offset=>mesh.positions.slice(index+offset,index+offset+3));
        const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
        for(const point of points)assert.ok(selectionAabbs.some(({min,max})=>
          point.every((value,axis)=>value>=min[axis]&&value<=max[axis])));
        for(let edge=0;edge<3;edge++){
          const key=[points[edge].join(','),points[(edge+1)%3].join(',')].sort().join('|');
          edges.set(key,1+(edges.get(key)??0));
        }
      }
      if(solid)assert.ok([...edges.values()].every(count=>count===2));
    }
  });
}
