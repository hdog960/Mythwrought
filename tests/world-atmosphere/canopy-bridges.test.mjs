import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {planCanopyBridge,validateCanopyBridge} from '../../src/world-atmosphere/canopy-bridges.mjs';
const a=[20,13,20],b=[28,13,20];
function fixture(){
 const occupied=new Map([[a.join(','),BLOCK.WOOD],[b.join(','),BLOCK.WOOD]]);
 return {seed:42,get:(x,y,z)=>occupied.get([x,y,z].join(','))??BLOCK.AIR,occupied};
}
test('physical bridge has contiguous deck, overhead leaf crown and two-block walking clearance',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);
 assert.ok(p);assert.ok(p.blockCount>8);
 const deck=p.cells.filter(c=>c[3]===BLOCK.WOOD);
 assert.deepEqual(deck.map(c=>c[0]),[21,22,23,24,25,26,27]);
 assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES));
 assert.ok(p.cells.filter(c=>c[3]===BLOCK.LEAVES).every(c=>c[1]===16));
 for(const c of deck)for(let h=1;h<=2;h++)
   assert.ok(p.clearance.includes([c[0],c[1]+h,c[2]].join(',')));
 assert.equal(validateCanopyBridge(w,p),true);
});
test('rejects player edits on deck and headroom, altered plans, seeds and unsupported diagonals',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);assert.ok(p);
 const [x,y,z]=p.cells[0];
 w.occupied.set([x,y,z].join(','),BLOCK.STONE);
 assert.equal(planCanopyBridge(w,a,b),null);
 w.occupied.delete([x,y,z].join(','));
 w.occupied.set([x,y+1,z].join(','),BLOCK.STONE);
 assert.equal(planCanopyBridge(w,a,b),null);
 w.occupied.delete([x,y+1,z].join(','));
 p.cells[0][3]=BLOCK.STONE;
 assert.equal(validateCanopyBridge(w,p),false);
 assert.equal(validateCanopyBridge({...w,seed:43},p),false);
 assert.equal(planCanopyBridge(w,a,[40,13,20]),null);
 assert.equal(planCanopyBridge(w,a,[28,13,21]),null);
});
test('reproducible in both axes and across a chunk seam without changing original world',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);
 assert.deepEqual(planCanopyBridge(fixture(),a,b),p);
 const start=[14,13,20],end=[22,13,20];
 const seam=fixture();seam.occupied.set(start.join(','),BLOCK.WOOD);
 assert.ok(planCanopyBridge(seam,start,end));
 const north=[32,13,14],south=[32,13,22];
 const vertical=fixture();
 vertical.occupied.set(north.join(','),BLOCK.WOOD);
 vertical.occupied.set(south.join(','),BLOCK.WOOD);
 assert.ok(planCanopyBridge(vertical,north,south));
 assert.equal(seam.occupied.size,3);
});
