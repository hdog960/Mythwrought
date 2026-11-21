import assert from 'node:assert/strict';
import test from 'node:test';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

function verifyClosedMesh(object){
  const {positions,materials,palette,sceneId}=object;
  const edges=new Map();
  for(let i=0;i<positions.length;i+=9){
    const points=[0,3,6].map(start=>[...positions.subarray(i+start,i+start+3)]);
    const [a,b,c]=points;
    const ab=b.map((n,j)=>n-a[j]),ac=c.map((n,j)=>n-a[j]);
    const area=Math.hypot(ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]);
    assert.ok(area>1e-8,sceneId+' has a degenerate face');
    assert.ok(palette[materials[i/9]]?.length===3,sceneId+' face has no palette pigment');
    for(let j=0;j<3;j++){
      const edge=[points[j],points[(j+1)%3]].map(point=>point.map(value=>value.toFixed(6)).join(',')).sort().join('|');
      edges.set(edge,(edges.get(edge)??0)+1);
    }
  }
  assert.ok([...edges.values()].every(count=>count===2),sceneId+' has an open or duplicated surface edge');
}

test('signpost and chain variants keep their identities on closed bounded source meshes',()=>{
  const anchor=[7,8,9];
  for(const sceneId of ['scene36:signpost','scene36:hanging-chain']){
    const meshes=[];
    for(const variant of [0,1,2,3]){
      const object=describeCandidateObject(179,{sceneId,anchor,variant,orientation:1});
      assert.equal(object.instanceKey,'nb1:'+encodeURIComponent(sceneId)+':179:7,8,9:'+variant+':r1');
      assert.ok(object.positions.length/9<=256);
      verifyClosedMesh(object);
      meshes.push(object.positions.join(','));
      assert.equal(object.colliders.length>0,sceneId==='scene36:signpost');
    }
    assert.equal(new Set(meshes).size,4,sceneId+' needs distinct geometric variants');
  }
});
