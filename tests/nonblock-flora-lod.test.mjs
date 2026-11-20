import assert from 'node:assert/strict';
import test from 'node:test';
import {candidateVertices,createCandidateScene} from '../src/nonblock/candidate-scene.mjs';

const seed=179;
const ids=['low-grass','short-fern','clover-clump','meadow-sedge'];
const deps={storage:{getItem:()=>null},blockAt:(x,y)=>y===0,voxelPick:()=>null};
const direction=[0,0,1];

function stage(id,variant=1){
  return createCandidateScene(seed,'legacy',[{sceneId:'scene48:'+id,anchor:[0,1,0],variant}],deps);
}

test('authored distant foliage preserves placement and silhouette with fewer packed bytes',()=>{
  for(const id of ids){
    for(const variant of [0,1,2,3]){
      const scene=stage(id,variant);
      const full=scene.frame([.5,1.3,-11],direction).objects[0];
      const far=scene.frame([.5,1.3,-17],direction).objects[0];
      assert.equal(far.detail,'far',id);
      assert.equal(far.instanceKey,full.instanceKey);
      assert.equal(far.sceneId,full.sceneId);
      assert.ok(candidateVertices([far]).byteLength<=candidateVertices([full]).byteLength*.78,id);
      assert.ok(far.positions.every(Number.isFinite));
      for(let i=0;i<far.positions.length;i+=9){
        const [x,y,z,bx,by,bz,cx,cy,cz]=far.positions.subarray(i,i+9);
        const a=[bx-x,by-y,bz-z],b=[cx-x,cy-y,cz-z];
        const area=Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]);
        assert.ok(area>1e-8,id+' far triangle is degenerate');
      }
      const limits=positions=>Array.from({length:3},(_,axis)=>{
        const values=positions.filter((_,i)=>i%3===axis);
        return [Math.min(...values),Math.max(...values)];
      });
      const fullBounds=limits(full.positions);
      for(const [axis,farBounds] of limits(far.positions).entries()){
        assert.ok(Math.abs(farBounds[0]-fullBounds[axis][0])<.035,id);
        assert.ok(Math.abs(farBounds[1]-fullBounds[axis][1])<.035,id);
      }
    }
  }
});

test('distance bands hold detail steady while aiming uses the original close mesh',()=>{
  const scene=stage('meadow-sedge',0);
  const view=distance=>scene.frame([.5,1.3,-distance],direction);
  assert.equal(view(15).objects[0].detail,undefined);
  assert.equal(view(17).objects[0].detail,'far');
  assert.equal(view(15).objects[0].detail,'far');
  assert.equal(view(12).objects[0].detail,undefined);
  assert.equal(view(15).objects[0].detail,undefined);
  assert.equal(view(33).objects.length,0);
  const eye=[.5,1.3,-2];
  const mesh=scene.visible()[0].positions;
  const hitRay=eye.map((coord,i)=>(mesh[i]+mesh[i+3]+mesh[i+6])/3-coord);
  const close=scene.frame(eye,hitRay);
  const direct=scene.pick(eye,hitRay);
  assert.ok(direct,'The nearest sedge blade should intercept the exact ray');
  assert.deepEqual(close.hit,direct);
  assert.equal(close.objects[0],scene.visible()[0]);
});
