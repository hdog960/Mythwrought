import test from 'node:test';
import assert from 'node:assert/strict';
import {captureFittingsMatrix,validateFittingsWitness} from '../../src/nonblock-fittings36/browser-matrix-witness.mjs';

const fake=(stage,overrides={})=>({
 stage,width:667,height:375,instanceKey:'scene36:test',webgl2:true,
 triangleCount:stage==='removed'||stage==='restored'?8:20,
 uploadBytes:100,visible:stage==='visible'||stage==='selected',
 selected:stage==='selected',tombstoned:stage==='removed'||stage==='restored',
 png:'data:image/png;base64,AA==',...overrides
});
const valid=()=>({width:667,height:375,stages:['visible','selected','removed','restored'].map(s=>fake(s))});
test('rejects selection without visible highlight state and unremoved tombstone',()=>{
 assert.equal(validateFittingsWitness(valid()),true);
 const x=valid();x.stages[1].selected=false;
 assert.throws(()=>validateFittingsWitness(x),/transition/);
 const y=valid();y.stages[3].tombstoned=false;
 assert.throws(()=>validateFittingsWitness(y),/transition/);
});
test('rejects wrong stage order, missing WebGL2, mismatched viewport and GPU overflow',()=>{
 for(const [index,change] of [
  [0,{stage:'selected'}],[1,{webgl2:false}],[2,{width:844}],
  [3,{uploadBytes:4194305}],[0,{png:'not a PNG'}]
 ]){
  const x=valid();Object.assign(x.stages[index],change);
  assert.throws(()=>validateFittingsWitness(x),/invalid witness stage/);
 }
});
test('matrix requires explicit canvas factory and never claims browser provenance',()=>{
 assert.throws(()=>captureFittingsMatrix({}),/canvas factory/);
 assert.throws(()=>captureFittingsMatrix({createCanvas:()=>({})}),/real browser canvas/);
});
