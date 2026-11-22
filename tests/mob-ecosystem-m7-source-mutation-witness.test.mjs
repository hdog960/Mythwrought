import test from 'node:test';
import assert from 'node:assert/strict';
import {createM7SourceMutationWitness}
  from './helpers/m7-source-mutation-witness.mjs';
function originalLikeWorld(){
  const edits=[],cells=[];
  return {
    edits,cells,
    save(){return {schema:1,seed:179,edits:edits.map(e=>[...e])};},
    pack2Snapshot(){return {kind:'mythwrought-pack2-overlay',version:1,
      seed:179,cells:cells.map(e=>structuredClone(e))};}
  };
}
test('unchanged source world has stable zero witness without writes',()=>{
  const world=originalLikeWorld(),w=createM7SourceMutationWitness(world);
  assert.equal(w.revision(),0);assert.equal(w.revision(),0);
  assert.equal(w.assertUnchanged(),true);
  assert.deepEqual(world.edits,[]);assert.deepEqual(world.cells,[]);
});
test('original Schema-1 edits increment observation counter and fail acceptance',()=>{
  const world=originalLikeWorld(),w=createM7SourceMutationWitness(world);
  world.edits.push([1,4,1,3]);
  assert.equal(w.revision(),1);assert.equal(w.revision(),1);
  assert.throws(()=>w.assertUnchanged(),/world was edited/);
});
test('Pack2 overlay writes and changes are observed without editing the world',()=>{
  const world=originalLikeWorld(),w=createM7SourceMutationWitness(world);
  world.cells.push([1,4,2,59,{id:59,orientation:0}]);
  assert.equal(w.revision(),1);
  world.cells[0][4].orientation=1;
  assert.equal(w.revision(),2);
  assert.throws(()=>w.assertUnchanged(),/world was edited/);
});
test('changed and restored state is not misrepresented as production authority',()=>{
  const world=originalLikeWorld(),w=createM7SourceMutationWitness(world);
  world.edits.push([1,4,1,3]);
  assert.equal(w.revision(),1);
  world.edits.pop();
  assert.equal(w.revision(),2);
  // This witness is observational: it cannot detect an edit that happened
  // and was undone between two calls, so it MUST remain test-only.
  const another=createM7SourceMutationWitness(world);
  world.edits.push([2,4,2,3]);world.edits.pop();
  assert.equal(another.revision(),0);
});
test('invalid or mismatched original save/Pack2 envelope fails closed',()=>{
  assert.throws(()=>createM7SourceMutationWitness({}),/snapshot required/);
  const world=originalLikeWorld();
  world.pack2Snapshot=()=>({kind:'mythwrought-pack2-overlay',version:1,
    seed:999,cells:[]});
  assert.throws(()=>createM7SourceMutationWitness(world),/Invalid original/);
  const bad=originalLikeWorld();bad.save=()=>({schema:2,seed:179,edits:[]});
  assert.throws(()=>createM7SourceMutationWitness(bad),/Invalid original/);
});
