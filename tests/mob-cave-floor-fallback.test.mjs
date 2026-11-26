import test from 'node:test';
import assert from 'node:assert/strict';
import {caveSupportedFallback} from '../src/mobs/cave-spawn-column.mjs';
const sectionForY=y=>y>=-3?0:Math.floor((Math.floor(y)+3)/16);
const body=Object.freeze({radius:.3,height:1.2});
function probe(support,feet=-79,section=-5){
  const calls=[];
  const world={grounded(p,b){assert.equal(b,body);calls.push([...p]);return support(p);}};
  const result=caveSupportedFallback(world,64.5,93.5,feet,body,section,sectionForY);
  return {result,calls};
}
test('nearby descending floor found without changing horizontal position',()=>{
  const r=probe(p=>p[1]===-76);
  assert.deepEqual(r.result,[64.5,-76,93.5]);
  assert.deepEqual(r.calls.map(p=>p[1]),[-79,-80,-78,-81,-77,-82,-76]);
});
test('never reads a different vertical section',()=>{
  const r=probe(()=>false,-83,-5);
  assert.equal(r.result,null);
  assert.ok(r.calls.every(p=>sectionForY(p[1])===-5));
});
test('blocked and unknown support remain rejected within nine queries',()=>{
  const r=probe(()=>false,-73,-5);
  assert.equal(r.result,null);assert.equal(r.calls.length,9);
});
test('surface and invalid feet do not probe',()=>{
  assert.deepEqual(probe(()=>true,0,0),{result:null,calls:[]});
  assert.deepEqual(probe(()=>true,NaN,-5),{result:null,calls:[]});
});
test('closest valid floor wins and stops immediately',()=>{
  const r=probe(p=>p[1]===-79||p[1]===-75);
  assert.deepEqual(r.result,[64.5,-79,93.5]);assert.equal(r.calls.length,1);
});
