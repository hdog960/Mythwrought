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
 const deck=p.cells.filter(c=>c[3]===BLOCK.WOOD&&c[2]===20);
 assert.deepEqual(deck.map(c=>c[0]),[21,22,23,24,25,26,27]);
 assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES));
 assert.ok(p.cells.filter(c=>c[3]===BLOCK.LEAVES).every(c=>c[1]===14||c[1]===16));
 for(const c of deck)for(let h=1;h<=2;h++)
   assert.ok(p.clearance.includes([c[0],c[1]+h,c[2]].join(',')));
 const rails=p.cells.filter(c=>c[3]===BLOCK.LEAVES&&c[1]===14);
 assert.equal(rails.length,10);
 const supports=p.cells.filter(c=>c[3]===BLOCK.WOOD&&c[1]===13&&Math.abs(c[2]-20)===1);
 assert.equal(supports.length,10);
 for(const [x,y,z] of rails)assert.ok(supports.some(c=>c[0]===x&&c[1]===y-1&&c[2]===z));
 assert.ok(rails.every(c=>Math.abs(c[2]-20)===1));
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
 const seam=fixture();seam.occupied.clear();seam.occupied.set(start.join(','),BLOCK.WOOD);
 assert.ok(planCanopyBridge(seam,start,end));
 const north=[32,13,14],south=[32,13,22];
 const vertical=fixture();vertical.occupied.clear();
 vertical.occupied.set(north.join(','),BLOCK.WOOD);
 vertical.occupied.set(south.join(','),BLOCK.WOOD);
 assert.ok(planCanopyBridge(vertical,north,south));
 assert.equal(seam.occupied.size,2,'planning must not alter the only two new anchors');
 const blocked=fixture();blocked.occupied.set(start.join(','),BLOCK.WOOD);blocked.occupied.set(end.join(','),BLOCK.WOOD);
 assert.equal(planCanopyBridge(blocked,start,end),null,'existing occupied third-party span must be rejected');
});

test('physical leaf parapets respect edited side cells and preserve open entrance',()=>{
 const w=fixture(),p=planCanopyBridge(w,a,b);assert.ok(p);
 const rails=p.cells.filter(c=>c[3]===BLOCK.LEAVES&&c[1]===14);
 assert.ok(rails.every(c=>c[0]>21&&c[0]<27));
 const rail=rails[0];w.occupied.set(rail.slice(0,3).join(','),BLOCK.STONE);
 assert.equal(planCanopyBridge(w,a,b),null);
 assert.equal(validateCanopyBridge(w,p),false);
 w.occupied.delete(rail.slice(0,3).join(','));
 assert.equal(validateCanopyBridge(w,p),true);
});

test('rejects an existing edit under a parapet and retains all world cells unchanged',()=>{
 const w=fixture(),before=[...w.occupied.entries()],p=planCanopyBridge(w,a,b);
 assert.ok(p);
 const support=p.cells.find(c=>c[3]===BLOCK.WOOD&&c[2]===21);
 assert.ok(support);
 w.occupied.set(support.slice(0,3).join(','),BLOCK.STONE);
 assert.equal(planCanopyBridge(w,a,b),null);
 w.occupied.delete(support.slice(0,3).join(','));
 assert.deepEqual([...w.occupied.entries()],before);
});
