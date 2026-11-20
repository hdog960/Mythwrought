import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCreativeCatalog} from '../src/creative-integration/creative-catalog.mjs';
import {creativePhysicalBoxes} from '../src/creative-integration/creative-thumbnails.mjs';
test('Every displayed physical material has actual source geometry for its thumbnail',()=>{
  const catalog=buildCreativeCatalog(),bySource=new Map(),failures=[];
  for(const item of catalog.blocks){
    try{
      const boxes=creativePhysicalBoxes(item);
      assert.ok(Array.isArray(boxes)&&boxes.length,
        item.key+' lacks a real source shape');
      for(const bounds of boxes){
        assert.equal(bounds.length,6,item.key+' malformed source box');
        assert.ok(bounds.every(Number.isFinite),item.key+' nonfinite source box');
        for(let axis=0;axis<3;axis++)
          assert.ok(bounds[axis]<bounds[axis+3],item.key+' collapsed physical box');
      }
      bySource.set(item.owner,(bySource.get(item.owner)??0)+1);
    }catch(error){failures.push(item.key+': '+error.message);}
  }
  assert.deepEqual(failures,[],'Displayed Creative items must not have placeholder geometry');
  for(const source of ['core','biome130','pack2','pack1','pack3','pack4','pack5'])
    assert.ok(bySource.get(source)>0,'Missing production physical owner '+source);
});
