import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateGripWidth,normalizeControlSize} from '../src/layout.mjs';

test('side grips leave majority of world visible at five landscape device sizes',()=>{
  for(const [width,height] of [[568,320],[667,375],[844,390],[932,430],[1180,520]]){
    for(const size of ['regular','large']){
      const g=calculateGripWidth(width,height,size),world=width-2*g;
      assert.ok(g>=96&&g<=192,`grip out of range on ${width}x${height}: ${g}`);
      assert.ok(world>=width*.45,`world viewport not protected on ${width}x${height} at ${size}`);
      assert.ok(world>=245,'central world cannot collapse below minimum size');
    }
  }
});
test('larger touch setting never makes grip smaller',()=>{
  for(const width of [568,667,800,932,1366])
    assert.ok(calculateGripWidth(width,430,'large')>=calculateGripWidth(width,430,'regular'));
});
test('controls resize deterministically and reject malformed dimensions',()=>{
  assert.equal(calculateGripWidth(932,430,'regular'),calculateGripWidth(932,430,'regular'));
  assert.equal(normalizeControlSize('giant'),'regular');
  assert.equal(normalizeControlSize('large'),'large');
  assert.throws(()=>calculateGripWidth(0,430));
  assert.throws(()=>calculateGripWidth(932,NaN));
  assert.throws(()=>calculateGripWidth(Infinity,430));
});
test('safe area reduces available width before grips are chosen',()=>{
  const outside=calculateGripWidth(844,390,'large');
  const inside=calculateGripWidth(844-48,390,'large');
  assert.ok(inside<=outside,'safe-area subtraction cannot increase grip size');
});
