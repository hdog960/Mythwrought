import assert from 'node:assert/strict';
import test from 'node:test';
import {EFFECT_IDS,prepareCandidateEffects,readCandidateEffectLayout} from '../src/nonblock/candidate-effects.mjs';

test('all twelve effects are bounded, deterministic and animate distinct geometry',()=>{
  assert.equal(EFFECT_IDS.length,12);
  const frameArgs={seed:179,viewer:[0,4,-2],seconds:.5,parents:new Set()};
  const shapes=new Set();
  for(const sceneId of EFFECT_IDS){
    const prepare=prepareCandidateEffects([{sceneId,anchor:[0,1,0]}]);
    const a=prepare(frameArgs);
    const b=prepare(frameArgs);
    assert.deepEqual(a,b);
    assert.equal(a.instances,1);
    assert.ok(a.vertices.length/27>=2&&a.vertices.length/27<=192);
    assert.ok(a.vertices.every(Number.isFinite));
    assert.notDeepEqual(a.vertices,prepare({...frameArgs,seconds:.9}).vertices);
    shapes.add(a.vertices.join());
  }
  assert.equal(shapes.size,12);
});

test('effect lifetimes follow actual surviving parent keys and ambient visibility is bounded',()=>{
  const layout=[
    {sceneId:'scene48:flame',anchor:[0,0,0],parentKey:'object:firewood'},
    {sceneId:'scene48:pollen',anchor:[0,0,1]},
    {sceneId:'scene48:mist',anchor:[100,0,0]}
  ];
  const prepare=prepareCandidateEffects(layout);
  const frame={seed:179,viewer:[0,0,0],seconds:1,parents:new Set(['object:firewood'])};
  assert.equal(prepare(frame).instances,2);
  assert.equal(prepare({...frame,parents:new Set()}).instances,1);
  const query='?nonblock-stage=%5B%5D&nonblock-fx='+encodeURIComponent(JSON.stringify(layout));
  assert.deepEqual(readCandidateEffectLayout(new URL('http://localhost:4173/'+query)),layout);
  assert.deepEqual(readCandidateEffectLayout(new URL('https://hdog960.github.io/Mythwrought/'+query)),[]);
  assert.throws(()=>prepareCandidateEffects([{sceneId:'unknown',anchor:[0,0,0]}]));
});
