import test from 'node:test';
import assert from 'node:assert/strict';
import {createEditEcho,sampleEditEcho,EDIT_ECHO_MS} from '../src/edit-echo.mjs';

test('successful mining and placement get distinct finite world-space echoes',()=>{
  for(const mode of ['mine','place']){
    const echo=createEditEcho({ok:true,mode,cell:[21,18,-4]},100);
    assert.deepEqual(echo.cell,[21,18,-4]);
    const first=sampleEditEcho(echo,100);
    assert.ok(first.vertices.length>0);
    assert.equal(first.vertices.length%9,0);
    assert.ok([...first.vertices].every(Number.isFinite));
    const second=sampleEditEcho(echo,100+EDIT_ECHO_MS/2);
    assert.notEqual(first.key,second.key);
    assert.equal(first.vertices.length,second.vertices.length);
    assert.ok(first.vertices[3]>second.vertices[3]);
  }
});
test('edit echo never appears for failed actions, malformed cells or expired feedback',()=>{
  assert.equal(createEditEcho({ok:false,mode:'mine',cell:[1,2,3]},0),null);
  assert.equal(createEditEcho({ok:true,mode:'place',cell:[1,NaN,3]},0),null);
  assert.equal(createEditEcho({ok:true,mode:'attack',cell:[1,2,3]},0),null);
  const echo=createEditEcho({ok:true,mode:'mine',cell:[1,2,3]},100);
  assert.equal(sampleEditEcho(echo,99).vertices.length,0);
  assert.equal(sampleEditEcho(echo,100+EDIT_ECHO_MS).vertices.length,0);
  assert.equal(sampleEditEcho(echo,Infinity).vertices.length,0);
  assert.equal(sampleEditEcho(null,100).vertices.length,0);
});
test('echo snapshots action coordinates without mutating original result',()=>{
  const result={ok:true,mode:'place',cell:[2,3,4]};
  const echo=createEditEcho(result,0);
  result.cell[0]=99;
  assert.deepEqual(echo.cell,[2,3,4]);
});
