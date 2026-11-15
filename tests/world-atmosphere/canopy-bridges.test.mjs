import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {planCanopyBridge,validateCanopyBridge} from '../../src/world-atmosphere/canopy-bridges.mjs';
const a=[20,13,20],b=[28,13,20];
function fixture(){
 const occupied=new Map([[a.join(','),BLOCK.WOOD],[b.join(','),BLOCK.WOOD]]);
 return {seed:42,get:(x,y,z)=>occupied.get([x,y,z].join(','))??BLOCK.AIR,
   occupied};
}
test('canopy bridge uses only physical wood and leaf voxels',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);
 assert.ok(p);assert.ok(p.blockCount>8);
 assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES));
 assert.ok(p.cells.some(c=>c[3]===BLOCK.WOOD));
 assert.equal(validateCanopyBridge(w,p),true);
});
test('rejects edits, altered plans, different seeds and long spans',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);assert.ok(p);
 const [x,y,z]=p.cells[0];w.occupied.set([x,y,z].join(','),BLOCK.STONE);
 assert.equal(planCanopyBridge(w,a,b),null);
 w.occupied.delete([x,y,z].join(','));
 p.cells[0][3]=BLOCK.STONE;
 assert.equal(validateCanopyBridge(w,p),false);
 assert.equal(validateCanopyBridge({...w,seed:43},p),false);
 assert.equal(planCanopyBridge(w,a,[40,13,20]),null);
});
test('same seed and anchors reproduce exact occupancy',()=>{
 const p=planCanopyBridge(fixture(),a,b);
 assert.deepEqual(planCanopyBridge(fixture(),a,b),p);
});
