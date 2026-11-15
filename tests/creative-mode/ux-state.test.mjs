import test from 'node:test';
import assert from 'node:assert/strict';
import {initialCreativeUxState,updateCreativeUx,visiblePreviewItems,UX_SAMPLE_ITEMS,UX_SLOT_COUNT} from '../../src/creative-mode/ux-state.mjs';
const apply=(state,type,props={})=>updateCreativeUx(state,{type,...props});
test('M1 starts Explore, inventory closed and all sample hotbar slots empty',()=>{
 const s=initialCreativeUxState();assert.equal(s.mode,'explore');assert.equal(s.inventoryOpen,false);assert.equal(s.hotbar.length,UX_SLOT_COUNT);
 assert.ok(s.hotbar.every(x=>x===null));assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.hotbar));
});
test('inventory cannot open during Explore and closes when leaving Creative',()=>{
 const base=initialCreativeUxState();assert.equal(apply(base,'OPEN_INVENTORY'),base);
 const creative=apply(base,'MODE',{mode:'creative'}),open=apply(creative,'OPEN_INVENTORY');assert.equal(open.inventoryOpen,true);
 const explore=apply(open,'MODE',{mode:'explore'});assert.equal(explore.inventoryOpen,false);assert.equal(explore.mode,'explore');
});
test('preview-only sample assignment works in Creative and cannot place or register content',()=>{
 let s=apply(initialCreativeUxState(),'MODE',{mode:'creative'});
 const item=UX_SAMPLE_ITEMS[0];assert.equal(item.registered,false);assert.equal(item.placeable,false);assert.equal(item.previewOnly,true);
 s=apply(s,'OPEN_INVENTORY');s=apply(s,'ASSIGN_SAMPLE',{uid:item.uid});assert.equal(s.hotbar[0],item.uid);
 s=apply(s,'SELECT_SLOT',{slot:3});s=apply(s,'ASSIGN_SAMPLE',{uid:UX_SAMPLE_ITEMS[2].uid});assert.equal(s.hotbar[3],UX_SAMPLE_ITEMS[2].uid);
 assert.notEqual(s.hotbar[0],s.hotbar[3]);assert.ok(s.announcement.includes('Not placeable'));
});
test('reject unknown sample IDs and attempts to assign with drawer closed',()=>{
 const s=apply(apply(initialCreativeUxState(),'MODE',{mode:'creative'}),'OPEN_INVENTORY');
 assert.equal(apply(s,'ASSIGN_SAMPLE',{uid:'production-stone'}),s);
 assert.equal(apply(apply(s,'CLOSE_INVENTORY'),'ASSIGN_SAMPLE',{uid:UX_SAMPLE_ITEMS[0].uid}).hotbar[0],null);
});
test('search filters case-insensitively and categories filter independently',()=>{
 let s=apply(initialCreativeUxState(),'SEARCH',{value:'TILE A'});assert.deepEqual(visiblePreviewItems(s).map(i=>i.uid),['ux-sample-a']);
 s=apply(s,'CATEGORY',{category:'objects'});assert.deepEqual(visiblePreviewItems(s),[]);
 s=apply(s,'SEARCH',{value:'sample'});assert.equal(visiblePreviewItems(s).length,2);
});
test('invalid slot and category actions are ignored',()=>{
 const s=initialCreativeUxState();assert.equal(apply(s,'SELECT_SLOT',{slot:6}),s);
 assert.equal(apply(s,'SELECT_SLOT',{slot:-1}),s);assert.equal(apply(s,'CATEGORY',{category:'draft-assets'}),s);
});
test('clearing a selected preview hotbar slot leaves other slots intact',()=>{
 let s=apply(apply(initialCreativeUxState(),'MODE',{mode:'creative'}),'OPEN_INVENTORY');
 s=apply(s,'ASSIGN_SAMPLE',{uid:UX_SAMPLE_ITEMS[0].uid});s=apply(s,'SELECT_SLOT',{slot:1});s=apply(s,'ASSIGN_SAMPLE',{uid:UX_SAMPLE_ITEMS[1].uid});s=apply(s,'CLEAR_SLOT');
 assert.equal(s.hotbar[0],UX_SAMPLE_ITEMS[0].uid);assert.equal(s.hotbar[1],null);
});
test('state transitions do not mutate previous snapshots, preserving detached UX behavior',()=>{
 const a=initialCreativeUxState();const b=apply(a,'MODE',{mode:'creative'});const c=apply(b,'SELECT_SLOT',{slot:5});
 assert.equal(a.mode,'explore');assert.equal(a.selectedSlot,0);assert.equal(b.selectedSlot,0);assert.equal(c.selectedSlot,5);
 assert.ok(Object.isFrozen(c));assert.ok(Object.isFrozen(c.hotbar));assert.ok(Object.isFrozen(UX_SAMPLE_ITEMS));
});
