import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS,PACK3_BUILDER_AVAILABILITY,
  resolvePack3BuilderAsset,planPack3BuilderStructure} from '../src/builder-assets/pack3.mjs';
import {validateShape} from '../src/voxel-shape-interactions.mjs';
import {BLOCK,VoxelWorld} from '../src/voxel.mjs';

test('approved Pack 3 builder roster maps 17 symbolic families to unique IDs 109–125',()=>{
  assert.equal(PACK3_BUILDER_SYMBOLS.length,17);
  assert.deepEqual([...PACK3_BUILDER_IDS].sort((a,b)=>a-b),Array.from({length:17},(_,i)=>109+i));
  assert.equal(new Set(PACK3_BUILDER_SYMBOLS).size,17);
  assert.deepEqual(PACK3_BUILDER_SYMBOLS.slice(0,7),
    ['pack3:023','pack3:024','pack3:025','pack3:026','pack3:027','pack3:028','pack3:029']);
  assert.deepEqual(PACK3_BUILDER_SYMBOLS.slice(7),Array.from({length:10},(_,i)=>'pack3:'+String(69+i).padStart(3,'0')));
  assert.ok(PACK3_BUILDER_IDS.every(id=>id>BLOCK.DEEPSTONE&&id<255));
  assert.equal(PACK3_BUILDER_AVAILABILITY.liveGameRegistry,false);
  assert.equal(PACK3_BUILDER_AVAILABILITY.creatorArtworkApproved,true);
});

test('builder resolves the 56 approved source-authentic physical orientations',()=>{
  let views=0;
  for(const symbol of PACK3_BUILDER_SYMBOLS){
    const defaultShape=resolvePack3BuilderAsset(symbol);
    assert.equal(defaultShape.builderUsable,true);
    assert.equal(defaultShape.livePlaceable,false);
    assert.ok(validateShape(defaultShape.shape));
    assert.equal(defaultShape.parts.length,defaultShape.shape.boxes.length);
    assert.ok(defaultShape.parts.every(p=>p.box.length===6&&/^#[0-9a-f]{6}$/i.test(p.color)));
    const turns=defaultShape.blockId<=112?[0]:[0,1,2,3];
    for(const yaw of turns){
      const chosen=resolvePack3BuilderAsset(symbol,yaw);
      assert.equal(chosen.yaw,yaw);
      assert.ok(validateShape(chosen.shape));
      views++;
    }
  }
  assert.equal(views,56);
});

test('physical builder structure plans translate real box geometry without world edits',()=>{
  const before=new VoxelWorld(179).save();
  const plan=planPack3BuilderStructure([
    {asset:'pack3:028',at:[0,0,0],orientation:'east'},
    {asset:'pack3:027',at:[1,0,0],orientation:'north'},
    {asset:'pack3:027',at:[0,0,1],orientation:'west'},
    {asset:'pack3:069',at:[4,0,0],orientation:'south'},
    {asset:'pack3:070',at:[4,1,0],orientation:'south'},
    {asset:'pack3:071',at:[4,0,-1],orientation:'south'}
  ],{origin:[100,5,-30]});
  assert.equal(plan.cells.length,6);
  assert.ok(plan.worldBoxes.length>65);
  assert.deepEqual(plan.cells[0].at,[100,5,-30]);
  assert.ok(plan.worldBoxes.every(p=>p.box.length===6 && p.box.every(Number.isFinite)));
  assert.equal(plan.livePlaced,false);assert.equal(plan.saveWritten,false);
  assert.deepEqual(new VoxelWorld(179).save(),before);
});

test('reject unknown symbols, uncertified roof turns, duplicate cells and invalid rotations',()=>{
  for(const symbol of ['pack3:109','pack3:030','pack2:023','pack3:255'])
    assert.throws(()=>resolvePack3BuilderAsset(symbol),RangeError);
  assert.throws(()=>resolvePack3BuilderAsset('pack3:023','east'),RangeError);
  assert.throws(()=>resolvePack3BuilderAsset('pack3:027','up'),RangeError);
  assert.throws(()=>planPack3BuilderStructure([
    {asset:'pack3:027',at:[0,0,0]},{asset:'pack3:028',at:[0,0,0]}
  ]),/Duplicate/);
  assert.throws(()=>planPack3BuilderStructure([{asset:'pack3:027',at:[.5,0,0]}]),TypeError);
  assert.throws(()=>planPack3BuilderStructure([{asset:'pack3:027',at:[0,0,0]}],{maxCells:0}),RangeError);
});
