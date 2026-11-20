import assert from 'node:assert/strict';
import test from 'node:test';
import {SCENE_FAMILIES} from '../src/nonblock-scene48/flora-phase1.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('each inherited meadow or mushroom family has four intentional bounded variants',()=>{
  const seed=179,anchor=[0,8,-2];
  for(const sceneId of Object.keys(SCENE_FAMILIES)){
    const signatures=new Set();
    for(let variant=0;variant<4;variant++){
      const specimen=describeCandidateObject(seed,{sceneId,anchor,variant});
      const fresh=describeCandidateObject(seed,{sceneId,anchor,variant});
      assert.deepEqual(fresh.positions,specimen.positions);
      assert.equal(specimen.instanceKey,'nb1:'+encodeURIComponent(sceneId)+':179:0,8,-2:'+variant);
      assert.ok(specimen.positions.length>=9*18&&specimen.positions.length<=9*192,sceneId);
      signatures.add(specimen.positions.join());
      assert.ok(specimen.positions.every(Number.isFinite),sceneId);
      for (let i=0;i<specimen.positions.length;i+=9){
        const p=specimen.positions;
        const a=[0,1,2].map(k=>p[i+3+k]-p[i+k]);
        const b=[0,1,2].map(k=>p[i+6+k]-p[i+k]);
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-7,sceneId);
      }
    }
    assert.equal(signatures.size,4,sceneId);
  }
});
