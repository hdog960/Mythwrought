// Incorporation 011 guard: frozen seeded forests, opt-in new archwood, unchanged live rotunda.
import test from 'node:test';
import assert from 'node:assert/strict';
import {TREE_VARIANTS,planVoxelTree} from '../src/voxel-trees.mjs';
import {VoxelWorld} from '../src/voxel.mjs';
import {planVoxelGrove} from '../src/voxel-groves.mjs';
import {planStoneRotunda as originalRotunda} from '../src/stone-rotunda.mjs';
import {planStoneRotunda as candidateRotunda} from '../src/stone-rotunda-v2.mjs';
test('existing four seeded tree variants remain unchanged',()=>{
 assert.deepEqual(TREE_VARIANTS,['roundwood','spire','windswept','elderwood']);
 const world=new VoxelWorld(179),grove=planVoxelGrove(world,{minX:32,maxX:72,minZ:32,maxZ:72,maxTrees:8});
 assert.ok(grove);
 assert.ok(grove.plans.every(p=>TREE_VARIANTS.includes(p.variant)));
 assert.equal(world.save().edits.length,0);
});
test('archwood is explicit opt-in only, not part of legacy seeded pool',()=>{
 const world=new VoxelWorld(179);
 let p=null;
 for(let z=-48;z<=48&&!p;z++)for(let x=-48;x<=48&&!p;x++)p=planVoxelTree(world,x,z,{variant:'archwood'});
 assert.ok(p);
 assert.equal(p.variant,'archwood');
 assert.ok(p.cells.every(c=>Number.isInteger(c[3])));
 assert.equal(world.save().edits.length,0);
});
test('rotunda candidate is separately versioned and never replaces active world generator',()=>{
 assert.notEqual(candidateRotunda,originalRotunda);
 const world=new VoxelWorld(179);
 for(let z=-24;z<=24;z+=4)for(let x=-24;x<=24;x+=4){
   const a=originalRotunda(world,x,z),b=candidateRotunda(world,x,z);
   if(b)assert.ok(a,'stricter opt-in candidate cannot create a site outside legacy eligibility');
 }
 assert.equal(world.save().edits.length,0);
});
