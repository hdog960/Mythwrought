import {test} from 'node:test';
import assert from 'node:assert/strict';
import {enchantedTreeFootingsSupported as rooted}
  from '../../src/manual-biomes/enchanted-tree-footings.mjs';

const giant=[[0,0],[1,0],[0,1],[1,1]];
const surface=(x,z)=>new Map([[6,403]]);
const read=(x,y,z)=>y===6?403:y===5?404:0;
const probe=(reader=read,column=surface,x=15,z=-529)=>
  rooted(x,6,z,giant,column,reader,0);

test('all four giant caps and their subsoil are real, including a chunk seam',()=>{
  assert.equal(probe(),true);
  const crossed=[];
  assert.equal(probe((x,y,z)=>{crossed.push([x,y,z]);return read(x,y,z);}),true);
  assert.ok(crossed.some(([x,y,z])=>x===16&&z===-529),
    'real 16-block seam-crossing giant must inspect the neighboring chunk');
});
test('an underground cave void beneath ANY one of four giant root corners refuses the whole tree',()=>{
  for(const [dx,dz] of giant){
    const x=15+dx,z=-529+dz;
    assert.equal(probe((a,b,c)=>a===x&&b===5&&c===z?0:read(a,b,c)),false,
      'missing real subsoil at '+x+','+z);
  }
});
test('reject a raised neighbor, protected landmark column or empty biome plan',()=>{
  assert.equal(probe((x,y,z)=>x===16&&z===-528&&y===7?3:read(x,y,z)),false);
  assert.equal(probe((x,y,z)=>x===16&&z===-528&&y===6?3:read(x,y,z)),false);
  assert.equal(probe(read,(x,z)=>x===16&&z===-529?new Map():surface(x,z)),false);
  assert.equal(probe(read,(x,z)=>x===16&&z===-528?new Map([[5,403]]):surface(x,z)),false);
});
test('no edits, mutation, random calls, or permission to skip source-ground validation',()=>{
  const before=surface(1,1),snapshot=[...before.entries()];
  const column=()=>before;
  assert.equal(probe(read,column),true);
  assert.deepEqual([...before.entries()],snapshot);
  assert.throws(()=>rooted(0,6,0,[],column,read),/Invalid enchanted tree footing probe/);
  assert.throws(()=>rooted(0.5,6,0,giant,column,read),/Invalid enchanted tree footing probe/);
  assert.throws(()=>rooted(0,6,0,[[0,'bad']],column,read),/Invalid enchanted tree footing offset/);
});
